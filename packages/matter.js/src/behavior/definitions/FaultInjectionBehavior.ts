/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { FaultInjection } from "../../cluster/definitions/FaultInjectionCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { FaultInjectionInterface } from "../cluster/definitions/FaultInjectionInterface.js";

/**
 * FaultInjectionBehavior is the base class for objects that support interaction with {@link FaultInjection.Cluster}.
 */
export const FaultInjectionBehavior = ClusterBehavior
    .withInterface<FaultInjectionInterface>()
    .for(FaultInjection.Cluster);

type FaultInjectionBehaviorType = InstanceType<typeof FaultInjectionBehavior>;
export interface FaultInjectionBehavior extends FaultInjectionBehaviorType {}
