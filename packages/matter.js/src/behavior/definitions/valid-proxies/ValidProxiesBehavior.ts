/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ValidProxies } from "../../../cluster/definitions/ValidProxiesCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { ValidProxiesInterface } from "./ValidProxiesInterface.js";

/**
 * ValidProxiesBehavior is the base class for objects that support interaction with {@link ValidProxies.Cluster}.
 */
export const ValidProxiesBehavior = ClusterBehavior
    .withInterface<ValidProxiesInterface>()
    .for(ValidProxies.Cluster);

type ValidProxiesBehaviorType = InstanceType<typeof ValidProxiesBehavior>;
export interface ValidProxiesBehavior extends ValidProxiesBehaviorType {}
