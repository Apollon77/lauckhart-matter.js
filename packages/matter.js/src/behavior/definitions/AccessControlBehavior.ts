/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { AccessControl } from "../../cluster/definitions/AccessControlCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * AccessControlBehavior is the base class for objects that support interaction with {@link AccessControl.Cluster}.
 */
export const AccessControlBehavior = ClusterBehavior.for(AccessControl.Cluster);

type AccessControlBehaviorType = InstanceType<typeof AccessControlBehavior>;
export interface AccessControlBehavior extends AccessControlBehaviorType {}
