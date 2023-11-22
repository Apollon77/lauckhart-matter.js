/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "../../../util/Type.js";
import { TypeFromSchema } from "../../../tlv/TlvSchema.js";
import { TargetNavigator } from "../../../cluster/definitions/TargetNavigatorCluster.js";
import { MatterApplicationClusterSpecificationV1_1 } from "../../../spec/Specifications.js";

export namespace TargetNavigatorInterface {
    /**
     * Upon receipt, this shall navigation the UX to the target identified.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 6.11.4.1
     */
    export type NavigateTargetRequest = TypeFromSchema<typeof TargetNavigator.TlvNavigateTargetRequest>;

    /**
     * This command shall be generated in response to NavigateTarget command.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 6.11.4.2
     */
    export type NavigateTargetResponse = TypeFromSchema<typeof TargetNavigator.TlvNavigateTargetResponse>;

    export interface Base {
        /**
         * Upon receipt, this shall navigation the UX to the target identified.
         *
         * @see {@link MatterApplicationClusterSpecificationV1_1} § 6.11.4.1
         */
        navigateTarget(request: NavigateTargetRequest): MaybePromise<NavigateTargetResponse>;
    }
}

export type TargetNavigatorInterface = { components: [{ flags: {}, methods: TargetNavigatorInterface.Base }] };
