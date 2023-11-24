/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatterDevice } from "../../MatterDevice.js";
import { Attributes, Events } from "../../cluster/Cluster.js";
import { AttributeServer, FabricScopedAttributeServer } from "../../cluster/server/AttributeServer.js";
import { ClusterServer } from "../../cluster/server/ClusterServer.js";
import type { ClusterServerObj, CommandHandler, SupportedEventsList } from "../../cluster/server/ClusterServerTypes.js";
import { ImplementationError } from "../../common/MatterError.js";
import type { FabricIndex } from "../../datatype/FabricIndex.js";
import { EndpointInterface } from "../../endpoint/EndpointInterface.js";
import type { Part } from "../../endpoint/Part.js";
import { SecureSession, assertSecureSession } from "../../session/SecureSession.js";
import { Session } from "../../session/Session.js";
import { isDeepEqual } from "../../util/DeepEqual.js";
import { InvocationContext } from "../InvocationContext.js";
import type { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { ClusterEvents } from "../cluster/ClusterEvents.js";
import { ValidatedElements } from "../cluster/ValidatedElements.js";
import { ServerBehaviorBacking } from "./ServerBehaviorBacking.js";

/**
 * Backing for cluster behaviors on servers.
 */
export class ClusterServerBehaviorBacking extends ServerBehaviorBacking {
    #clusterServer: ClusterServerObj<Attributes, Events>;

    constructor(part: Part, type: ClusterBehavior.Type) {
        super(part, type);

        const elements = new ValidatedElements(type);
        elements.report();

        // Install command handlers that map to implementation methods
        const handlers = {} as Record<string, any>;
        for (const name of elements.commands) {
            handlers[name] = createCommandHandler(this, name);
        }

        // Install attribute accessors
        for (const name of elements.attributes) {
            const { get, set } = createAttributeAccessors(
                this,
                name,
                type.cluster.attributes[name].fabricScoped
            );
            handlers[`${name}AttributeGetter`] = get;
            handlers[`${name}AttributeSetter`] = set;
        }

        // Flag supported events
        const supportedEvents = {} as SupportedEventsList<any>;
        for (const name of elements.events) {
            supportedEvents[name] = true;
        }

        // Create the cluster server
        this.#clusterServer = ClusterServer(type.cluster, type.defaults, handlers, supportedEvents);

        // Monitor change events so we can notify the cluster server of data
        // changes
        for (const name in elements.attributes) {
            createChangeHandler(this, name);
        }
    }

    get clusterServer() {
        return this.#clusterServer;
    }
}

function createCommandHandler(backing: ClusterServerBehaviorBacking, name: string): CommandHandler<any, any, any> {
    return args => {
        const context: InvocationContext = {
            fabric: args.session.getAssociatedFabric(),
            session: args.session,
            message: args.message,
        };

        const agent = backing.part.getAgent(context);
        const behavior = agent.get(backing.type);
        return (behavior as unknown as Record<string, (arg: any) => any>)[name](args.request);
    };
}

type ScopedValue = { fabricIndex: FabricIndex }[];

function createAttributeAccessors(
    backing: ClusterServerBehaviorBacking,
    name: string,
    fabric: boolean,
): {
    get: (session?: Session<MatterDevice>, endpoint?: EndpointInterface, isFabricFiltered?: boolean) => any;
    set: (value: any, session?: Session<MatterDevice>, endpoint?: EndpointInterface) => boolean;
} {
    if (fabric) {
        return {
            get(session, _endpoint, isFabricFiltered) {
                const value = backing.state[name] as ScopedValue | undefined;
                if (!value || !isFabricFiltered) {
                    return value;
                }

                const fabric = session?.getAssociatedFabric();
                if (!fabric) {
                    throw new ImplementationError(
                        `Fabric filtering requested for ${backing.type.name}.state.${name} outside fabric context`
                    );
                }
                assertSecureSession(session);
                const fabric = session?.getAssociatedFabric();
                if (fabric === undefined) {
                    throw new 
                }
                
                return value.filter(v => v.fabricIndex = session?.getAssociatedFabric())
            }
        }
    }

    return {
        get() {
            return backing.state[name];
        },

        set(value) {
            const current = backing.state[name];
            if (isDeepEqual(current, value)) {
                return false;
            }
            backing.state[name] = value;
            return true;
        },
    };
}

function createChangeHandler(backing: ClusterServerBehaviorBacking, name: string) {
    const observable = (backing.events as any)[`${name}$change`] as ClusterEvents.AttributeObservable;
    if (!observable) {
        return;
    }

    const attributeServer = backing.clusterServer.attributes[name];
    if (!attributeServer) {
        return;
    }

    if (attributeServer instanceof FabricScopedAttributeServer) {
        observable.on((_value, _oldValue, context) => {
            const session = context.session;
            if (session instanceof SecureSession) {
                attributeServer.updated(session);
            } else if (context.fabric) {
                attributeServer.updatedLocalForFabric(context.fabric);
            } else {
                throw new ImplementationError(`Attribute with fabric-scoped server updated outside of fabric context`);
            }
        });
    } else if (attributeServer instanceof AttributeServer) {
        observable.on((_value, _oldValue, context) => {
            const session = context.session;
            if (session instanceof SecureSession) {
                attributeServer.updated(session);
            } else {
                attributeServer.updatedLocal();
            }
        });
    }
}
