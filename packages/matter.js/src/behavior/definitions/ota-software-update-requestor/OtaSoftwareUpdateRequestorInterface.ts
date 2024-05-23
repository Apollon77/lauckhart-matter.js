/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MaybePromise } from "../../../util/Promises.js";
import { OtaSoftwareUpdateRequestor } from "../../../cluster/definitions/OtaSoftwareUpdateRequestorCluster.js";

export namespace OtaSoftwareUpdateRequestorInterface {
    export interface Base {
        /**
         * This command may be invoked by Administrators to announce the presence of a particular OTA Provider.
         *
         * This command shall be scoped to the accessing fabric.
         *
         * If the accessing fabric index is 0, this command shall fail with an UNSUPPORTED_ACCESS status code.
         *
         * @see {@link MatterSpecification.v13.Core} § 11.20.7.6.1
         */
        announceOtaProvider(request: OtaSoftwareUpdateRequestor.AnnounceOtaProviderRequest): MaybePromise;
    }
}

export type OtaSoftwareUpdateRequestorInterface = {
    components: [{ flags: {}, methods: OtaSoftwareUpdateRequestorInterface.Base }]
};
