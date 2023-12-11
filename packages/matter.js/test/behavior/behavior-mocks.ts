/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Behavior } from "../../src/behavior/Behavior.js";
import { InvocationContext } from "../../src/behavior/InvocationContext.js";
import { DescriptorServer } from "../../src/behavior/definitions/descriptor/DescriptorServer.js";
import { LifecycleBehavior } from "../../src/behavior/definitions/lifecycle/LifecycleBehavior.js";
import { PartsBehavior } from "../../src/behavior/definitions/parts/PartsBehavior.js";
import { ServerBehaviorBacking } from "../../src/behavior/server/ServerBehaviorBacking.js";
import { TransactionCoordinator } from "../../src/behavior/state/transaction/Coordinator.js";
import { AccessLevel } from "../../src/cluster/Cluster.js";
import { Part } from "../../src/endpoint/Part.js";
import { PartOwner } from "../../src/endpoint/part/PartOwner.js";
import { MutableEndpoint } from "../../src/endpoint/type/MutableEndpoint.js";
import type { Fabric } from "../../src/fabric/Fabric.js";

class MockFabricImplementation {
    fabricIndex;

    constructor(id = 1) {
        this.fabricIndex = id;
    }

    addRemoveCallback() {}
}

export const MockFabric = MockFabricImplementation as unknown as new (id?: number) => Fabric;

export class MockOwner implements PartOwner {
    readonly transactionCoordinator = new TransactionCoordinator();

    initializeBehavior(part: Part, behavior: Behavior.Type) {
        return new ServerBehaviorBacking(part, behavior);
    }

    getAncestor(): any {
        throw new Error("No ancestor");
    }
}

export const MockEndpoint = MutableEndpoint({
    name: "MyEndpoint",
    deviceType: 1,
    deviceRevision: 1,
}).with(LifecycleBehavior, DescriptorServer);

export const MockParentEndpoint = MockEndpoint.with(PartsBehavior);

export class MockContext implements InvocationContext {
    accessLevel = AccessLevel.Operate;
    declare fabric?: Fabric;

    constructor(options?: InvocationContext) {
        Object.assign(this, options);

        if (!this.fabric) {
            this.fabric = new MockFabric();
        }
    }
}
