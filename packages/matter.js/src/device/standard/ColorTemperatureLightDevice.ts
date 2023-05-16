/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Device } from "../Device.js";
import { DeviceTypes } from "../DeviceTypes.js";
import { Identify, OnOffLighting, LevelControl } from "../../cluster/interface/index.js";
import { ServesClusters } from "../ServesClusters.js"

export class ColorTemperatureLightDevice extends
    ServesClusters(Device,
        Identify,
        OnOffLighting,
        LevelControl)
{
    constructor(endpointId?: number) {
        super(DeviceTypes.COLOR_TEMPERATURE_LIGHT, [], endpointId);
    }
}