/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { BooleanStateCluster, ClusterInterface } from "../index.js";
import { TypeFromSchema } from "../../tlv/TlvSchema.js";

type StateChangeEvent = TypeFromSchema<typeof BooleanStateCluster.events.stateChange.schema>;

export interface BooleanStateInterface {
    stateValue: boolean;
    addStateValueListener(listener: (newValue: boolean, oldValue: boolean) => void): void;
    removeStateValueListener(listener: (newValue: boolean, oldValue: boolean) => void): void;

    addStateChangeListener(listener: (event: StateChangeEvent) => void): void;
    removeStateChangeListener(listener: (event: StateChangeEvent) => void): void;
}

export const BooleanState:
    ClusterInterface<BooleanStateInterface> =
{
    definition: BooleanStateCluster
};