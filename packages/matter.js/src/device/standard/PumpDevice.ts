/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { DeviceTypes } from "../DeviceTypes.js";
import { ClusterInterface } from "../../cluster/ClusterInterface.js";
import { AutoDevice } from "../AutoDevice.js";
import { OnOff, Identify, OnOffLighting, Level, Scenes, Groups, Temperature, Pressure, Flow } from "../../cluster/interface/index.js";

export class Pump extends AutoDevice.implement(DeviceTypes.PUMP, OnOff, Identify) {
    static readonly options = {
        OnOffLighting,
        Level,
        Scenes,
        Groups,
        Temperature,
        Pressure,
        Flow,
    }

    static with<Options extends ClusterInterface<any, any, any>[]>(...options: Options) {
        return AutoDevice.extend(this, ...options);
    }
}
