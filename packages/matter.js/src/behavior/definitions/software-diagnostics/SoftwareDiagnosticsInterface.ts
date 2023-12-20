/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "../../../util/Type.js";
import { MatterCoreSpecificationV1_1 } from "../../../spec/Specifications.js";

export namespace SoftwareDiagnosticsInterface {
    export interface Watermarks {
        /**
         * Receipt of this command shall reset the following values which track high and lower watermarks:
         *
         *   • The StackFreeMinimum field of the ThreadMetrics attribute
         *
         *   • The CurrentHeapHighWatermark attribute This command has no payload.
         *
         * Effect on Receipt
         *
         * On receipt of this command, the Node shall make the following modifications to attributes it supports:
         *
         * If implemented, the server shall set the value of the CurrentHeapHighWatermark attribute to the value of the
         * CurrentHeapUsed attribute.
         *
         * If implemented, the server shall set the value of the StackFreeMinimum field for every thread to the value
         * of the corresponding thread’s StackFreeCurrent field.
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.7.1
         */
        resetWatermarks(): MaybePromise<void>;
    }
}

export type SoftwareDiagnosticsInterface = {
    components: [{ flags: { watermarks: true }, methods: SoftwareDiagnosticsInterface.Watermarks }]
};