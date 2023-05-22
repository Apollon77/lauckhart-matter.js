/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { OnOffLightingCluster, ClusterInterface } from "../index.js";
import { TypeFromSchema } from "../../tlv/TlvSchema.js";

type OffWithEffectRequest = TypeFromSchema<typeof OnOffLightingCluster.commands.offWithEffect.requestSchema>;
type OnWithTimedOffRequest = TypeFromSchema<typeof OnOffLightingCluster.commands.onWithTimedOff.requestSchema>;

namespace OnOffLighting {
    export type State = {
        onOff: boolean;
        globalSceneControl: boolean;
        onTime: number | undefined;
        offWaitTime: number | undefined;
        startUpOnOff: number | undefined;
    }

    export interface Client {
        sendOff(): Promise<void>;
        sendOn(): Promise<void>;
        sendToggle(): Promise<void>;
        sendOffWithEffect(request: OffWithEffectRequest): Promise<void>;
        sendOnWithRecallGlobalScene(): Promise<void>;
        sendOnWithTimedOff(request: OnWithTimedOffRequest): Promise<void>;

        onOnOffChange(value: boolean, previous: boolean): void;
        onGlobalSceneControlChange(value: boolean, previous: boolean): void;
        onOnTimeChange(value: number | undefined, previous: number | undefined): void;
        onOffWaitTimeChange(value: number | undefined, previous: number | undefined): void;
        onStartUpOnOffChange(value: number | undefined, previous: number | undefined): void;
    }

    export interface Server {
        onOff(): Promise<void>;
        onOn(): Promise<void>;
        onToggle(): Promise<void>;
        onOffWithEffect(request: OffWithEffectRequest): Promise<void>;
        onOnWithRecallGlobalScene(): Promise<void>;
        onOnWithTimedOff(request: OnWithTimedOffRequest): Promise<void>;

        onOnOffChange(value: boolean, previous: boolean): void;
        onGlobalSceneControlChange(value: boolean, previous: boolean): void;
        onOnTimeChange(value: number | undefined, previous: number | undefined): void;
        onOffWaitTimeChange(value: number | undefined, previous: number | undefined): void;
        onStartUpOnOffChange(value: number | undefined, previous: number | undefined): void;
    }
}

export const OnOffLighting: ClusterInterface<OnOffLighting.State, OnOffLighting.Client, OnOffLighting.Server> = {
    definition: OnOffLightingCluster
}
