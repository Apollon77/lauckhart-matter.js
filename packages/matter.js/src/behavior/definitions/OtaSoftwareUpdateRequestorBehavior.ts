/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { OtaSoftwareUpdateRequestor } from "../../cluster/definitions/OtaSoftwareUpdateRequestorCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { OtaSoftwareUpdateRequestorInterface } from "../cluster/definitions/OtaSoftwareUpdateRequestorInterface.js";

/**
 * OtaSoftwareUpdateRequestorBehavior is the base class for objects that support interaction with {@link
 * OtaSoftwareUpdateRequestor.Cluster}.
 */
export const OtaSoftwareUpdateRequestorBehavior = ClusterBehavior
    .withInterface<OtaSoftwareUpdateRequestorInterface>()
    .for(OtaSoftwareUpdateRequestor.Cluster);

type OtaSoftwareUpdateRequestorBehaviorType = InstanceType<typeof OtaSoftwareUpdateRequestorBehavior>;
export interface OtaSoftwareUpdateRequestorBehavior extends OtaSoftwareUpdateRequestorBehaviorType {}
