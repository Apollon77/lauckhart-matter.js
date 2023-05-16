/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Device } from "../Device.js";
import { DeviceTypes } from "../DeviceTypes.js"

export class OtaRequestorDevice extends Device {
    constructor(endpointId?: number) {
        super(DeviceTypes.OTA_REQUESTOR, [], endpointId);
    }
}
