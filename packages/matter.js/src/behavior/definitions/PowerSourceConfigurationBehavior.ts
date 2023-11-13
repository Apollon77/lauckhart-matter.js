/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { PowerSourceConfiguration } from "../../cluster/definitions/PowerSourceConfigurationCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * PowerSourceConfigurationBehavior is the base class for objects that support interaction with {@link
 * PowerSourceConfiguration.Cluster}.
 */
export const PowerSourceConfigurationBehavior = ClusterBehavior.for(PowerSourceConfiguration.Cluster);

type PowerSourceConfigurationBehaviorType = InstanceType<typeof PowerSourceConfigurationBehavior>;
export interface PowerSourceConfigurationBehavior extends PowerSourceConfigurationBehaviorType {}
