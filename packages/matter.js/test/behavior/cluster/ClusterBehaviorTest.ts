/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterBehavior } from "../../../src/behavior/cluster/ClusterBehavior.js";
import { InvocationContext } from "../../../src/behavior/InvocationContext.js";
import { Observable } from "../../../src/util/Observable.js";
import { MaybePromise } from "../../../src/util/Type.js";
import { MyBehavior } from "./cluster-behavior-test-util.js";
import { Behavior } from "../../../src/behavior/Behavior.js";
import { State } from "../../../src/behavior/state/State.js";
import { MockPart } from "../../endpoint/part-mocks.js";

describe("ClusterBehavior", () => {
    type Match<Input, Type> = Input extends Type ? true : false;

    describe("base class", () => {
        describe("state types meet type requirement", () => {
            ClusterBehavior.EndpointScope satisfies State.Type;
            ClusterBehavior.EndpointScope satisfies ClusterBehavior.Type["EndpointScope"];

            ClusterBehavior.FabricScope satisfies State.Type;
            ClusterBehavior.FabricScope satisfies ClusterBehavior.Type["FabricScope"];
        });

        describe("meets type requirements", () => {
            ClusterBehavior satisfies Behavior.Type;

            ({}) as ClusterBehavior["state"] satisfies InstanceType<ClusterBehavior.Type>["state"];
            ({}) as ClusterBehavior["events"] satisfies InstanceType<ClusterBehavior.Type>["events"];

            ClusterBehavior.EndpointScope satisfies ClusterBehavior.Type["EndpointScope"];
            ClusterBehavior.FabricScope satisfies ClusterBehavior.Type["FabricScope"];
            ClusterBehavior.Events satisfies ClusterBehavior.Type["Events"];

            typeof ClusterBehavior.EndpointScope === "function";
            typeof ClusterBehavior.FabricScope === "function";
            typeof ClusterBehavior.Events === "function";

            ClusterBehavior satisfies ClusterBehavior.Type;
            typeof ClusterBehavior === "function";
        });
    })

    describe("ClusterBehavior.for", () => {
        it("exposes mandatory properties for enabled cluster elements", () => {
            ({}) as MyBehavior satisfies {
                state: {
                    reqAttr: string,
                    reqFabricAttr: string
                }
            };
            expect((new MyBehavior.EndpointScope).reqAttr).equals("hello");
            expect((new MyBehavior.FabricScope).reqFabricAttr).equals("world");
            
            ({}) as MyBehavior satisfies {
                reqCmd: (request: string, state: any) => MaybePromise<string>
            };
            expect(typeof MyBehavior.prototype.reqCmd).equals("function");
            
            ({}) as MyBehavior satisfies {
                events: {
                    reqAttr$change: Observable<[
                        value: string,
                        oldValue: string,
                        context?: InvocationContext
                    ]>
                }
            };
            
            ({}) as MyBehavior satisfies {
                events: {
                    reqEv: Observable<[
                        string,
                        context?: InvocationContext
                    ]>
                }
            };
        });

        it("exposes optional properties for disabled cluster elements", () => {
            undefined satisfies MyBehavior["state"]["optAttr"];
            true satisfies MyBehavior["state"]["optAttr"];
            undefined satisfies MyBehavior["state"]["optFabricAttr"];
            true satisfies MyBehavior["state"]["optFabricAttr"];
            (() => true) satisfies MyBehavior["optCmd"];
            ((..._args: any[]) => true) satisfies MyBehavior["optCmd"];
            ({}) as Match<MyBehavior["events"], { optAttr$change: {} }> satisfies false;
            ({}) as Match<MyBehavior["events"], { optEv: {} }> satisfies false;
            ({}) as Match<MyBehavior, { optCmd: (...args: any[]) => any }> satisfies true;
        });

        it("instance exposes values for enabled cluster elements", () => {
            const behavior = MockPart.createBehavior(MyBehavior);

            expect(behavior.state.reqAttr).equals("hello");
            expect(behavior.reqCmd).is.a("function");
            expect(behavior.events.reqAttr$change).is.a("function");
            expect(behavior.events.reqEv).is.a("function");
        });

        it("instance does not expose values for disabled cluster elements", () => {
            const behavior = MockPart.createBehavior(MyBehavior);

            expect((behavior.state as any).optAttr).undefined;
            expect((behavior.events as any).optAttr$change).undefined;
            expect((behavior.events as any).optEv).undefined;
        });

        it("instance allows standard method override", () => {
            const Ignored = class extends MyBehavior {
                override reqCmd(request: string): string {
                    return request.toUpperCase();
                }

                override optCmd(request: boolean): boolean {
                    return !request;
                }
            }
            Ignored;
        })
    });

    describe("for", () => {
        // TODO
    });
});
