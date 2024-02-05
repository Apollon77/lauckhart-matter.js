/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cancellable, Destructable, Lifecycle, Startable } from "../common/Lifecycle.js";
import { Diagnostic } from "../log/Diagnostic.js";
import { Logger } from "../log/Logger.js";
import { AsyncConstruction } from "../util/AsyncConstruction.js";
import { Observable } from "../util/Observable.js";
import type { Environment } from "./Environment.js";
import { Environmental } from "./Environmental.js";

const logger = Logger.get("Runtime");

/**
 * Handles execution and lifecycle management of other components.
 */
export class RuntimeService {
    #workers = new Set<RuntimeService.Worker>();
    #cancelled = new Set<RuntimeService.Worker>();
    #workerDeleted = Observable<[]>();
    #canceled = false;
    #started = Observable<[]>();
    #stopped = Observable<[]>();
    #crashed = Observable<[cause: any]>();

    constructor(environment: Environment) {
        environment.set(RuntimeService, this);
    }

    /**
     * Add a {@link Worker}.
     *
     * The runtime considers itself "active" if there are one or more workers installed.
     * 
     * A worker must either be {@link PromiseLike} or {@link AsyncConstructable} for the runtime to detect completion.
     * On completion the worker is removed and destroyed if the worker is {@link Destructable}.
     */
    addWorker(worker: RuntimeService.Worker) {
        if (this.#workers.has(worker)) {
            return;
        }

        this.#workers.add(worker);
        if (this.#workers.size === 1) {
            this.#started.emit();
        }

        // For PromiseLike just track until resolution
        if (worker.then) {
            Promise.resolve(worker)
                .catch(error => this.#crash(error))
                .finally(() => this.#deleteWorker(worker));
            return;
        }

        if (worker.construction?.change) {
            // AsyncCostructable
            let started = false;
            if (worker.construction.status === Lifecycle.Status.Active) {
                started = true;
                worker.start?.();
            }
            worker.construction.change.on(status => {
                switch (status) {
                    case Lifecycle.Status.Active:
                        if (!started) {
                            started = true;
                            worker.start?.();
                        }
                       break;

                    case Lifecycle.Status.Crashed:
                        let error = worker.construction?.error;
                        if (!error) {
                            error = new Error("Unknown initialization error");
                        }
                        this.#crash(error);
                        break;

                    case Lifecycle.Status.Destroyed:
                        this.#deleteWorker(worker);
                        break;
                }
            });
        } else {
            // PromiseLike or no termination tracking
            worker.start?.();
            if (worker.then) {
                Promise.resolve(worker)
                    .catch(error => this.#crash(error))
                    .finally(() => this.#deleteWorker(worker));
            }
        }
    }

    /**
     * Emits when a worker is added when previously there were none.
     */
    get started() {
        return this.#started;
    }

    /**
     * Emits when the last worker departs.
     */
    get stopped() {
        return this.#stopped;
    }

    /**
     * Emits when a worker experiences an unhandled error.
     */
    get crashed() {
        return this.#crashed;
    }

    static [Environmental.create](environment: Environment) {
        return new this(environment);
    }

    /**
     * Cancel execution.
     *
     * On cancel the runtime destroys all workers.
     */
    cancel() {
        if (this.#canceled) {
            return;
        }
        this.#canceled = true;
        logger.notice("Shutting down");

        for (const worker of this.#workers) {
            const disposal = this.#cancelWorker(worker);
            if (disposal) {
                this.addWorker(disposal);
            }
        }
    }

    /**
     * Resolves when no workers are active.
     */
    get inactive() {
        if (!this.#workers.size) {
            return Promise.resolve();
        }

        return new Promise<void>(resolve => {
            const listener = () => {
                if (!this.#workers.size) {
                    this.#workerDeleted.off(listener);
                    resolve();
                }
            };
            this.#workerDeleted.on(listener);
        });
    }

    async [Symbol.asyncDispose]() {
        this.cancel();
        await this.inactive;
    }

    get [Diagnostic.value]() {
        return "Runtime";
    }

    #cancelWorker(worker: RuntimeService.Worker) {
        if (this.#cancelled.has(worker)) {
            return;
        }

        const cancel = () => {
            this.#cancelled.add(worker);

            if (worker[Symbol.asyncDispose]) {
                this.#cancelled.add(worker);
                return Promise.resolve(worker[Symbol.asyncDispose]?.()).finally(() => this.#deleteWorker(worker));
            }

            if (worker[Symbol.dispose]) {
                worker[Symbol.dispose]?.();
                this.#deleteWorker(worker);
                return;
            }

            if (worker.cancel) {
                worker.cancel();
                return;
            }

            // No means of cancellation so we just need to wait for the worker to exit
        };

        if (worker.construction) {
            return Promise.resolve(worker.construction).finally(cancel);
        }

        return cancel();
    }

    #deleteWorker(worker: RuntimeService.Worker) {
        if (!this.#workers.has(worker)) {
            return;
        }

        // Remove the worker
        this.#workers.delete(worker);
        this.#cancelled.delete(worker);
        this.#workerDeleted.emit();

        // If there are still non-helper workers, remain in active state
        for (const worker of this.#workers) {
            if (!worker.helper) {
                return;
            }
        }

        // No workers except helpers; cancel helpers and exit
        this.cancel();
        this.inactive.then(() => this.#stopped.emit());
    }

    #crash(cause: Error) {
        logger.error(cause);
        this.crashed.emit(cause);
        this.cancel();
    }
}

export namespace RuntimeService {
    /**
     * The runtime tracks individual discrete tasks as "workers".
     *
     * The state of the runtime is dependent on installed workers.  Any JS object may be a worker but the runtime's
     * interaction with workers varies as documented here.
     *
     * If a worker is a {@link PromiseLike} the runtime will delete and/or destroy it on completion.
     */
    export interface Worker extends Partial<PromiseLike<any>>, Partial<Startable>, Partial<Cancellable>, Partial<Destructable> {
        /**
         * If present, {@link RuntimeService} will invoke when the worker is added.
         * 
         * If the worker also supports {@link construction} the runtime will invoke once construction completes.
         */
        start?: () => void;

        /**
         * If this is true, the worker is considered a "helper".  When the last non-helper worker departs the runtime
         * cancels helpers and emits {@link RuntimeService.stopped}.
         */
        helper?: boolean;

        /**
         * If the worker supports {@link AsyncConstruction}, the runtime will monitor the worker's lifecycle:
         *
         *   - If the worker crashed (e.g. experiences an error during initialization) the runtime will cancel all
         *     workers and exit
         *
         *   - If the worker is destroyed deletes it from the set of known workers
         */
        construction?: AsyncConstruction<any>;

        /**
         * If the worker supports {@link Symbol.asyncDispose} the runtime will invoke when the worker is no longer
         * needed.  This happens if:
         *
         *   - The worker is a {@link PromiseLike} that resolves
         *
         *   - The worker's {@link construction} status changed as noted above
         *
         *   - The runtime is canceled via {@link RuntimeService.cancel}
         */
        [Symbol.asyncDispose]?: () => void | Promise<void>;

        /**
         * Workers may implement {@link Symbol.dispose} to handle disposal.  Works the same as the async equivalent.
         */
        [Symbol.dispose]?: () => void;
    }
}
