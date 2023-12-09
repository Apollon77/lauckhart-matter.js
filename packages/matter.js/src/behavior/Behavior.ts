/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ClusterType } from "../cluster/ClusterType.js";
import { ImplementationError, NotImplementedError } from "../common/MatterError.js";
import { Agent } from "../endpoint/Agent.js";
import { assertSecureSession } from "../session/SecureSession.js";
import { GeneratedClass } from "../util/GeneratedClass.js";
import { EventEmitter } from "../util/Observable.js";
import type { BehaviorBacking } from "./BehaviorBacking.js";
import { Schema } from "./Schema.js";
import type { LifecycleBehavior } from "./definitions/lifecycle/LifecycleBehavior.js";
import { DerivedState, EmptyState } from "./state/State.js";

// We store state and events using this symbol because TS prevents us from
// defining the corresponding getters as part of the class
const BACKING = Symbol("endpoint-owner");
const STATE = Symbol("state");
const INTERNAL = Symbol("internal");
const EVENTS = Symbol("events");

interface Internal extends Behavior {
    [BACKING]: BehaviorBacking;
    [STATE]: {};
    [INTERNAL]: {};
    [EVENTS]: EventEmitter;
}

/**
 * Behavior implements functionality for an Endpoint.  Endpoint agents are
 * implemented as a composition of behaviors.
 *
 * Most behaviors associated 1:1 with a Matter cluster type as implemented by
 * ClusterBehavior.  But you can also extend Behavior directly to add other
 * types of composable logic to an endpoint.
 *
 * You probably want to build your behavior using one of the standard
 * implementations offered by Matter.js.
 */
export abstract class Behavior {
    #agent: Agent;

    /**
     * Each behavior implementation has an ID that uniquely identifies the
     * type of behavior.  An Endpoint may only have one behavior with the
     * specified ID.
     *
     * Endpoint instances store each behavior in a property with the same name
     * as the behavior's ID.
     *
     * EndpointBuilder also uses the ID when replacing behaviors using the
     * with() builder method.
     */
    static readonly id: string;

    /**
     * The agent that owns the behavior.
     */
    get agent() {
        return this.#agent;
    }

    /**
     * The part that owns behavior's agent.
     */
    get part() {
        return this.#agent.part;
    }

    /**
     * The context in which the behavior operates.
     */
    get context() {
        return this.#agent.context;
    }

    /**
     * The session in which the behavior has been invoked.
     */
    get session() {
        const session = this.#agent.context.session;
        if (session === undefined) {
            throw new ImplementationError(`Illegal operation outside session context`);
        }
        
        // TODO - would a behavior ever need access to an insecure session?
        assertSecureSession(session);
        
        return session;
    }

    /**
     * Access the behavior's state.
     */
    declare readonly state: new () => {};

    /**
     * Access the behavior's events.
     */
    declare readonly events: EventEmitter;

    constructor(agent: Agent, backing: BehaviorBacking) {
        this.#agent = agent;
        (this as unknown as Internal)[BACKING] = backing;
    }

    /**
     * The Matter schema for the behavior.  Schema metadata controls various
     * aspects of behavior including data validation and authorization.
     */
    static schema: Schema = Schema.empty;

    /**
     * Implementation of endpoint-scoped state.  Subclasses may override to
     * extend.
     */
    static State = EmptyState;

    /**
     * Implementation of internal state.  Subclasses may override to extend.
     */
    static InternalState = EmptyState;

    /**
     * Implementation of the events property.  Subclasses may override to
     * extend.
     */
    static Events = EventEmitter;

    /**
     * Behaviors are ephemeral and should not perform initialization in their
     * constructor.  They can override this method instead.
     *
     * This method is synchronous.  If a behavior has not completed
     * initialization before returning it should place itself into
     * {@link LifecycleBehavior.state.initializingBehaviors}.
     */
    initialize() {}

    /**
     * Does this behavior support functionality of a specific implementation?
     */
    static supports(other: Behavior.Type) {
        return (this as any) === other || this.prototype instanceof other;
    }

    /**
     * Default state values.
     */
    static get defaults(): Record<string, any> {
        return new this.State();
    }

    /**
     * Create a new behavior with different default state values.
     */
    static set<This extends Behavior.Type>(this: This, defaults: Behavior.InputStateOf<This>) {
        return GeneratedClass({
            name: this.name,
            base: this,

            staticProperties: {
                State: DerivedState({
                    name: `${this.name}$State`,
                    base: this.State,
                    values: defaults,
                }),
            },
        }) as unknown as This;
    }
}

// TS prevents us from declaring an override type if the base field is a
// getter in the class.  So we just declare in the base class and manually
// install the getters here.
Object.defineProperties(Behavior.prototype, {
    state: {
        get(this: Internal) {
            if (!this[STATE]) {
                this[STATE] = this[BACKING].createState(this.context);
            }
            return this[STATE];
        },

        enumerable: true,
    },

    internal: {
        get(this: Internal) {
            if (!this[INTERNAL]) {
                this[INTERNAL] = this[BACKING].getInternal();
            }
            return this[INTERNAL];
        },

        enumerable: false,
    },

    events: {
        get(this: Internal) {
            if (!this[EVENTS]) {
                this[EVENTS] = this[BACKING].events;
            }
            return this[EVENTS];
        },

        enumerable: true,
    },
});

export namespace Behavior {
    /**
     * Static properties supported by all behaviors.
     */
    export interface Type {
        new (agent: Agent, backing: BehaviorBacking): Behavior;

        id: typeof Behavior.id;
        set: typeof Behavior.set;
        supports: typeof Behavior.supports;
        defaults: Record<string, any>;

        schema: Schema,
        State: new () => {};
        InternalState: new () => {};
        Events: typeof EventEmitter;
    }

    /**
     * This function simply throws NotImplementedError.  More importantly, its
     * presence in any command implementation method informs the endpoint that
     * the command is not implemented.
     */
    export function unimplemented(..._args: any[]): Promise<any> {
        throw new NotImplementedError();
    }

    /**
     * The state type of a behavior {@link Type}.
     */
    export type StateOf<B extends Type> = InstanceType<B["State"]>;

    /**
     * Input variant of StateOf.
     */
    export type InputStateOf<B extends Type> = Partial<ClusterType.RelaxTypes<StateOf<B>>>;
}

