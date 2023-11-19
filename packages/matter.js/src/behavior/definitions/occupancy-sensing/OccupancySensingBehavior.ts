/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { OccupancySensing } from "../../../cluster/definitions/OccupancySensingCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * OccupancySensingBehavior is the base class for objects that support interaction with {@link
 * OccupancySensing.Cluster}.
 */
export const OccupancySensingBehavior = ClusterBehavior.for(OccupancySensing.Cluster);

type OccupancySensingBehaviorType = InstanceType<typeof OccupancySensingBehavior>;
export interface OccupancySensingBehavior extends OccupancySensingBehaviorType {}
