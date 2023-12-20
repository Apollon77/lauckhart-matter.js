/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Behavior } from "../../behavior/Behavior.js";
import { BehaviorBacking } from "../../behavior/BehaviorBacking.js";
import type { ClusterBehavior } from "../../behavior/cluster/ClusterBehavior.js";
import { LifecycleBehavior } from "../../behavior/definitions/lifecycle/LifecycleBehavior.js";
import { ImplementationError } from "../../common/MatterError.js";
import { Observable } from "../../util/Observable.js";
import { camelize, describeList } from "../../util/String.js";
import { MaybePromise } from "../../util/Type.js";
import type { Agent } from "../Agent.js";
import type { Part } from "../Part.js";
import type { SupportedBehaviors } from "./SupportedBehaviors.js";

/**
 * This class manages {@link Behavior} instances owned by a {@link Part}.
 */
export class Behaviors {
    #part: Part;
    #supported: SupportedBehaviors;
    #backings: Record<string, BehaviorBacking> = {};
    #supportAdded = Observable<[type: Behavior.Type]>();

    /**
     * Event emitted when support is added for a new behavior.
     */
    get supportAdded() {
        return this.#supportAdded;
    }

    constructor(part: Part, supported: SupportedBehaviors) {
        if (typeof supported !== "object") {
            throw new ImplementationError('Part "behaviors" option must be an array of Behavior.Type instances');
        }
        for (const id in supported) {
            if (!(supported[id].prototype instanceof Behavior)) {
                throw new ImplementationError(`Part behavior #${id} is not a Behavior.Type`);
            }
            if (typeof supported[id].id !== "string") {
                throw new ImplementationError(`Part behavior #${id} has no ID`);
            }
        }

        this.#part = part;
        this.#supported = supported;
    }

    /**
     * List the {@link SupportedBehaviors} of the {@link Part}.
     */
    get supported() {
        return this.#supported;
    }

    /**
     * Does the {@link Part} support a specified behavior?
     */
    has<T extends Behavior.Type>(type: T) {
        const myType = this.#supported[type.id];
        return myType === type || myType?.supports(type);
    }

    /**
     * Add behavior support dynamically at runtime.  Typically called via
     * {@link Agent.require}.
     */
    require(type: Behavior.Type) {
        if (this.#supported[type.id]) {
            if (!this.has(type)) {
                throw new ImplementationError(
                    `Cannot require behavior ${type.id} because incompatible implementation already exists`,
                );
            }
        } else {
            if (!type.supports(LifecycleBehavior)) {
                if (this.#part.agent.get(LifecycleBehavior).state.online) {
                    throw new ImplementationError(`Cannot add behavior ${type.id} after part is online`);
                }
            }
            this.#supported[type.id] = type;
            this.#supportAdded.emit(type);
        }
    }

    /**
     * Create a behavior.  {@link Agent} obtains behaviors via this method.
     */
    create(type: Behavior.Type, agent: Agent) {
        const behavior = this.createWhenReady(type, agent);
        if (MaybePromise.is(behavior)) {
            throw new ImplementationError(`Cannot access behavior ${type.id} because it is still initializing`);
        }
        return behavior;
    }

    /**
     * Create a behavior, waiting for the behavior to initialize if necessary.
     *
     * This method returns a {@link Promise} only if await is necessary so the
     * behavior can be used immediately if necessary.
     */
    createWhenReady(type: Behavior.Type, agent: Agent): MaybePromise<Behavior> {
        let backing = this.#backings[type.id];

        if (!backing) {
            backing = this.#createBacking(type);
        }

        if (backing.initializing) {
            return backing.initializing.then(() => backing.createBehavior(agent, type));
        }

        return backing.createBehavior(agent, type);
    }

    /**
     * Destroy all behaviors that are initialized (have backings present).
     */
    async [Symbol.asyncDispose]() {
        for (const id in this.#backings) {
            const behavior = (this.#part.agent as unknown as Record<string, Behavior>)[id];
            await behavior?.destroy();
        }
        this.#backings = {};
    }

    /**
     * Ensure a set of behavior requirements are met.  Throws an error
     * detailing missing requirements.
     */
    validateRequirements(requirements?: SupportedBehaviors) {
        if (!requirements) {
            return;
        }

        const missing = Array<string>();
        for (const requirement of Object.values(requirements)) {
            let name = camelize(requirement.name, true);

            const cluster = (requirement as ClusterBehavior.Type).cluster;
            if (cluster) {
                name = `${name} (0x${cluster.id.toString(16)})`;
            }

            if (!this.#part.behaviors.has(requirement)) {
                missing.push(name);
            }
        }

        if (missing.length) {
            throw new ImplementationError(
                `${this.#part.description} is missing required clusters: ${describeList("and", ...missing)}`,
            );
        }
    }

    #createBacking(type: Behavior.Type) {
        // Ensure the type is supported.  If it is, we instantiate with our
        // type rather than the specified type because our type might be an
        // extension
        const myType = this.#getBehaviorType(type);
        if (!myType) {
            throw new ImplementationError(`Request for unsupported behavior ${type.id}`);
        }

        // Ask the owner to create the backing.  This is specialized for the
        // owner (e.g. client or server)
        const backing = this.#part.owner.createBacking(this.#part, myType);
        this.#backings[type.id] = backing;

        // Create an offline instance of the behavior to use for initialization
        const agent = this.#part.agent;
        const behavior = agent.get(type);

        // Invoke initialize().  If the backing is already in initiazing state
        // we defer initialization, otherwise we trigger immediately
        let promise = backing.initializing;
        if (promise) {
            promise = promise.then(behavior.initialize);
        } else {
            behavior.initialize();
        }

        // If we have a promise, update lifecycle so the part doesn't register
        // as initialized before we complete, add error handlers, and install
        // into the backing
        if (promise) {
            const lifecycle = agent.get(LifecycleBehavior);
            lifecycle.state.initializingBehaviors.add(behavior);
            backing.initializing = promise
                .catch(e => {
                    e.message = `Error initializing ${type.name}: ${e.message}`;
                    throw e;
                })
                .finally(() => {
                    lifecycle.state.initializingBehaviors.delete(behavior);
                    backing.initializing = undefined;
                });
        }

        // Our shiny new backing is ready
        return backing;
    }

    #getBehaviorType(type: Behavior.Type) {
        const myType = this.#supported[type.id];

        if (myType === undefined) {
            return myType;
        }

        if (typeof myType !== "function" || !(myType.prototype instanceof Behavior)) {
            throw new ImplementationError(`Endpoint behavior ${type.id} implementation is not a Behavior`);
        }

        return myType;
    }
}