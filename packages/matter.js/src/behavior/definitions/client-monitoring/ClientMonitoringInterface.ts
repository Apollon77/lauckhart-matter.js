/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "../../../util/Type.js";
import { TypeFromSchema } from "../../../tlv/TlvSchema.js";
import { ClientMonitoring } from "../../../cluster/definitions/ClientMonitoringCluster.js";

export namespace ClientMonitoringInterface {
    export type RegisterClientMonitoringRequest = TypeFromSchema<typeof ClientMonitoring.TlvRegisterClientMonitoringRequest>;
    export type UnregisterClientMonitoringRequest = TypeFromSchema<typeof ClientMonitoring.TlvUnregisterClientMonitoringRequest>;
    export interface Base {
        registerClientMonitoring(request: RegisterClientMonitoringRequest): MaybePromise<void>;
        unregisterClientMonitoring(request: UnregisterClientMonitoringRequest): MaybePromise<void>;
        stayAwakeRequest(): MaybePromise<void>;
    }
}

export type ClientMonitoringInterface = { components: [{ flags: {}, methods: ClientMonitoringInterface.Base }] };
