/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ProxyConfiguration } from "../../cluster/definitions/ProxyConfigurationCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * ProxyConfigurationBehavior is the base class for objects that support interaction with {@link
 * ProxyConfiguration.Cluster}.
 */
export const ProxyConfigurationBehavior = ClusterBehavior.for(ProxyConfiguration.Cluster);

type ProxyConfigurationBehaviorType = InstanceType<typeof ProxyConfigurationBehavior>;
export interface ProxyConfigurationBehavior extends ProxyConfigurationBehaviorType {}
