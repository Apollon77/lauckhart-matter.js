/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ElectricalMeasurement } from "../../cluster/definitions/ElectricalMeasurementCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { ElectricalMeasurementInterface } from "../cluster/definitions/ElectricalMeasurementInterface.js";

/**
 * ElectricalMeasurementBehavior is the base class for objects that support interaction with {@link
 * ElectricalMeasurement.Cluster}.
 */
export const ElectricalMeasurementBehavior = ClusterBehavior
    .withInterface<ElectricalMeasurementInterface>()
    .for(ElectricalMeasurement.Cluster);

type ElectricalMeasurementBehaviorType = InstanceType<typeof ElectricalMeasurementBehavior>;
export interface ElectricalMeasurementBehavior extends ElectricalMeasurementBehaviorType {}
