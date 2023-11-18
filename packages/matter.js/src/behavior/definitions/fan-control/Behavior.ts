/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { FanControl } from "../../../cluster/definitions/FanControlCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * FanControlBehavior is the base class for objects that support interaction with {@link FanControl.Cluster}.
 *
 * This class does not have optional features of FanControl.Cluster enabled. You can enable additional features using
 * FanControlBehavior.with.
 */
export const FanControlBehavior = ClusterBehavior.for(FanControl.Cluster);

type FanControlBehaviorType = InstanceType<typeof FanControlBehavior>;
export interface FanControlBehavior extends FanControlBehaviorType {}
