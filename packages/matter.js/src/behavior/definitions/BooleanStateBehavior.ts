/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { BooleanState } from "../../cluster/definitions/BooleanStateCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * BooleanStateBehavior is the base class for objects that support interaction with {@link BooleanState.Cluster}.
 */
export const BooleanStateBehavior = ClusterBehavior.for(BooleanState.Cluster);

type BooleanStateBehaviorType = InstanceType<typeof BooleanStateBehavior>;
export interface BooleanStateBehavior extends BooleanStateBehaviorType {}
