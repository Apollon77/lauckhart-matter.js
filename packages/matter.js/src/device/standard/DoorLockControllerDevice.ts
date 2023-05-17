/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { DeviceTypes } from "../DeviceTypes.js";
import { ClusterInterface } from "../../cluster/Cluster.js";
import { Identify } from "../../cluster/interface/index.js";
import { AutoDevice } from "../AutoDevice.js"

export class DoorLockController extends AutoDevice {
    constructor(endpointId?: number) {
        super(DeviceTypes.DOOR_LOCK_CONTROLLER, [], endpointId);
    }

    static readonly options = {
        Identify
    };

    static with(...clusters: ClusterInterface<any>[]) {
        return AutoDevice.extendDevice(this, ...clusters);
    }
}
