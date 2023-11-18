/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import {
    ThermostatUserInterfaceConfiguration
} from "../../../cluster/definitions/ThermostatUserInterfaceConfigurationCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * ThermostatUserInterfaceConfigurationBehavior is the base class for objects that support interaction with {@link
 * ThermostatUserInterfaceConfiguration.Cluster}.
 */
export const ThermostatUserInterfaceConfigurationBehavior = ClusterBehavior
    .for(ThermostatUserInterfaceConfiguration.Cluster);

type ThermostatUserInterfaceConfigurationBehaviorType = InstanceType<typeof ThermostatUserInterfaceConfigurationBehavior>;
export interface ThermostatUserInterfaceConfigurationBehavior extends ThermostatUserInterfaceConfigurationBehaviorType {}
