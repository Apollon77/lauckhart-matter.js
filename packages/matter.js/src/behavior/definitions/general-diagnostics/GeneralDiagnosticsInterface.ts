/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "../../../util/Type.js";
import { TypeFromSchema } from "../../../tlv/TlvSchema.js";
import { GeneralDiagnostics } from "../../../cluster/definitions/GeneralDiagnosticsCluster.js";
import { MatterCoreSpecificationV1_1 } from "../../../spec/Specifications.js";

export namespace GeneralDiagnosticsInterface {
    /**
     * This command shall be supported to provide a means for certification tests to trigger some test- plan-specific
     * events, necessary to assist in automation of device interactions for some certification test cases. This command
     * shall NOT cause any changes to the state of the device that persist after the last fabric is removed.
     *
     * The fields for the TestEventTrigger command are as follows:
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.11.7.1
     */
    export type TestEventTriggerRequest = TypeFromSchema<typeof GeneralDiagnostics.TlvTestEventTriggerRequest>;

    export interface Base {
        /**
         * This command shall be supported to provide a means for certification tests to trigger some test-
         * plan-specific events, necessary to assist in automation of device interactions for some certification test
         * cases. This command shall NOT cause any changes to the state of the device that persist after the last
         * fabric is removed.
         *
         * The fields for the TestEventTrigger command are as follows:
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.11.7.1
         */
        testEventTrigger(request: TestEventTriggerRequest): MaybePromise<void>;
    }
}

export type GeneralDiagnosticsInterface = { components: [{ flags: {}, methods: GeneralDiagnosticsInterface.Base }] };
