/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalError } from "../common/MatterError.js";
import { Logger } from "../log/Logger.js";
import { AsyncConstructable } from "./AsyncConstruction.js";
import { MaybePromiseLike } from "./Promises.js";

const logger = Logger.get("Mutex");

/**
 * A mutex is a task queue where at most one task is active at a time.
 */
export class Mutex implements PromiseLike<unknown> {
    #owner: {};
    #cancel?: () => void;
    #canceled = false;
    #promise?: Promise<unknown>;

    constructor(owner: {}, initial?: PromiseLike<unknown>) {
        this.#owner = owner;
        if (initial) {
            this.run(() => initial);
        }
    }

    /**
     * As a PromiseLike, you can await the Mutex.  This promise resolves when current activity completes but the mutex
     * may engage in another activity immediately thereafter.  So the mutex is not guaranteed to be available after an
     * await.
     */
    then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>
    {
        return (this.#promise || Promise.resolve()).then(onfulfilled, onrejected);
    }

    /**
     * Enqueue additional work.
     * 
     * If {@link task} is a function it runs when current activity completes.  If it is a promise then the mutex will
     * not clear until {@link task} resolves.
     */
    run(task: MaybePromiseLike<unknown> | (() => PromiseLike<unknown>), cancel?: () => void) {
        if (this.#canceled) {
            cancel?.();
            return;
        }

        if (!this.#promise) {
            this.#promise = this.initiateTask(task);
        } else {
            this.#promise = this.#promise.then(() => {
                if (this.#canceled) {
                    cancel?.();
                    return;
                }

                this.#cancel = cancel;
                return this.initiateTask(task).finally(this.#cancel = undefined);
            });
        }
    }

    /**
     * Cancel remaining work and perform one last task with the Mutex held.
     */
    terminate(cleanup?: () => PromiseLike<void>) {
        if (this.#canceled) {
            throw new InternalError(`Double cancel of ${this.#owner} activity`);
        }

        this.#canceled = true;

        if (this.#cancel) {
            this.#cancel();
        }

        if (cleanup) {
            if (!this.#promise) {
                this.#promise = this.initiateTask(cleanup);
            } else {
                this.#promise = this.#promise.then(() => this.initiateTask(cleanup));
            }
        }
    }

    /**
     * Default error handling crashes the component if it is AsyncConstructable.  Otherwise the error is simply logged.
     */
    protected handleError(cause: any) {
        const construction = (this.#owner as AsyncConstructable<any>).construction;
        if (typeof construction?.crashed === "function") {
            construction.crashed(cause);
        } else {
            logger.error(`Error in ${this.#owner} worker:`, cause);
        }
    }

    /**
     * Execute a task immediately if it is a function.
     */
    protected async initiateTask(task: MaybePromiseLike<unknown> | (() => PromiseLike<unknown>)) {
        if (typeof task === "function") {
            task = task();
        }
        return Promise.resolve(task).catch(cause => this.handleError(cause));
    }
}
