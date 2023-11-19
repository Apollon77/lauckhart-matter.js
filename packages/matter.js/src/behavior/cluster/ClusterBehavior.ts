/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterType } from "../../cluster/ClusterType.js";
import { ClusterComposer } from "../../cluster/mutation/ClusterComposer.js";
import { ElementModifier } from "../../cluster/mutation/ElementModifier.js";
import { Behavior } from "../Behavior.js";
import { ImplementationError } from "../../common/MatterError.js";
import { State } from "../state/State.js";
import { ClusterInterface } from "./ClusterInterface.js";
import { type ClusterOf, createType } from "./ClusterBehaviorUtil.js";
import type { BehaviorBacking } from "../BehaviorBacking.js";
import type { ClusterState } from "./ClusterState.js";
import type { ClusterEvents } from "./ClusterEvents.js";
import type { Agent } from "../../endpoint/Agent.js";

/**
 * A {@link Behavior} with specialization for a specific cluster.
 *
 * To implement cluster functionality you should use a subclass provided by
 * {@link ClusterBehavior.for} with the {@link ClusterType} you are
 * implementing.  Most commonly you would use one of the predefined
 * implementations matter.js includes.
 *
 * Subclasses can be modified using the static builder methods or extended like
 * a normal class.
 * 
 * Behaviors should store all mutable state in their {@link Behavior.state}
 * property.  Other fields will be transient and may not be retained across
 * invocations.
 * 
 * TODO - currently ClusterBehaviors may be instantiated with unsupported
 * mandatory commands and attributes.  Currently this is a runtime error but
 * not a build-time error.  Should we generate abstract methods etc. for this,
 * make the edits by hand as we implement "standard" behaviors, or just leave
 * as a runtime error?
 */
export class ClusterBehavior extends Behavior {
    #cluster: ClusterType;

    /**
     * The ID of ClusterBehavior implementations is the uncapitalized cluster
     * name.
     */
    static override id: Uncapitalize<string>;

    /**
     * The cluster implemented by this behavior.
     */
    get cluster() {
        return this.#cluster;
    };

    /**
     * Every cluster behavior has an associated ClusterType defined statically.
     */
    static readonly cluster = ClusterType.Unknown;

    /**
     * Method definitions.
     */
    static readonly Interface = ClusterInterface.Empty;

    constructor(agent: Agent, backing: BehaviorBacking) {
        super(agent, backing);

        const cluster = (this.constructor as typeof ClusterBehavior).cluster;
        if (!cluster) {
            throw new ImplementationError("ClusterBehavior class has no cluster defined");
        }
        this.#cluster = cluster;
    }

    /**
     * Create a new behavior for a specific {@link ClusterType}.
     *
     * If you invoke directly on {@link ClusterBehavior} you will receive a
     * new implementation that reports all commands as unimplemented.
     *
     * If you invoke on an existing subclass, you will receive a new
     * implementation with the cluster in the subclass replaced.  You should
     * generally only do this with a {@link ClusterType} with the same ID.
     */
    static for<
        This extends ClusterBehavior.Type,
        const ClusterT extends ClusterType
    >(
        this: This,
        cluster: ClusterT,
    ): ClusterBehavior.Type<ClusterT, This> {
        return createType(cluster, this) as any;
    }

    /**
     * Create a new behavior with different cluster features.
     */
    static with<
        This extends ClusterBehavior.Type,
        const FeaturesT extends ClusterComposer.FeatureSelection<This["cluster"]>,
    >(this: This, ...features: FeaturesT) {
        return this.for(new ClusterComposer(this.cluster).compose(features));
    }

    /**
     * Create a new behavior with modified cluster elements.
     */
    static alter<
        This extends ClusterBehavior.Type,
        const AlterationsT extends ElementModifier.Alterations<This["cluster"]>,
    >(this: This, alterations: AlterationsT) {
        return this.for(new ElementModifier(this.cluster).alter(alterations));
    }

    /**
     * Create a new behavior with additional cluster features marked
     * "mandatory".
     *
     * This informs matter.js that an application supports these elements.
     */
    static enable<
        This extends ClusterBehavior.Type,
        const FlagsT extends ElementModifier.ElementFlags<This["cluster"]>,
    >(this: This, flags: FlagsT) {
        return this.for(new ElementModifier(this.cluster).enable(flags));
    }

    /**
     * Create a ClusterBehavior like this one with different interface
     * methods.
     * 
     * The Interface "property" is type-only.  We define a method however to
     * keep the API consistent.  At runtime the method is a no-op.
     */
    static withInterface<
        const I extends ClusterInterface
    >() {
        return this as unknown as ClusterBehavior.Type<
            typeof ClusterType.Unknown,
            typeof ClusterBehavior,
            I
        >;
    }

    static override supports(other: Behavior.Type) {
        if (!Behavior.supports.call(this, other)) {
            return false;
        }

        const otherFeatures = (other as ClusterBehavior.Type).cluster.supportedFeatures;
        const myFeatures = this.cluster.supportedFeatures;
        for (const name in otherFeatures) {
            if (otherFeatures[name] && !(myFeatures as Record<string, boolean>)[name]) {
                return false;
            }
        }

        return true;
    }
}

export namespace ClusterBehavior {
    /**
     * A ClusterBehavior specialized for a specific Cluster.
     */
    export interface Type<
        C extends ClusterType = ClusterType,
        B extends Behavior.Type = Behavior.Type,
        I extends ClusterInterface = ClusterInterface.InterfaceOf<B>
    > {
        new (agent: Agent, backing: BehaviorBacking): Instance<C, B, I>;

        /**
         * The behavior ID for ClusterBehaviors is the name of the cluster.
         */
        readonly id: Uncapitalize<C["name"]>;

        /**
         * Base cluster state include all attribute values but may be extended
         * by subclasses.
         */
        readonly cluster: C;

        readonly Events: ClusterEvents.Type<C, B>;

        readonly EndpointScope: State.Type<ClusterState.Endpoint<C, B>>;

        readonly FabricScope: State.Type<ClusterState.Fabric<C, B>>;

        readonly InternalScope: B["InternalScope"];

        readonly Interface: I;

        readonly defaults: ClusterState.Endpoint<C, B> & ClusterState.Fabric<C, B>;

        for: typeof ClusterBehavior.for;
        with: typeof ClusterBehavior.with;
        alter: typeof ClusterBehavior.alter;
        set: typeof ClusterBehavior.set;
        enable: typeof ClusterBehavior.enable;
        supports: typeof ClusterBehavior.supports;
    }

    /**
     * A fully-typed ClusterBehavior.  This type is derived by combining
     * properties of the base type with properties contributed by the cluster.
     */
    export type Instance<C extends ClusterType, B extends Behavior.Type, I extends ClusterInterface> =
        // Base class
        & ClusterBehavior

        // Bring extensions of old class forward
        & Omit<InstanceType<B>,
            | "cluster"
            | "state"
            | "events"
            | "initialize"

            // Omit command methods of old cluster
            | keyof ClusterInterface.MethodsOf<
                ClusterInterface.InterfaceOf<B>,
                ClusterOf<B>
            >
        >

        // Add command methods
        & ClusterInterface.MethodsOf<I, C>

        // Add other properties
        & {
            /**
             * The implemented cluster.
             */
            cluster: C;

            /**
             * State values for the behavior.
             */
            state: ClusterState<C, B>;

            /**
             * Observables for cluster events and attribute changes.
             */
            events: ClusterEvents<C, B>;
        };
}
