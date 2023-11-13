/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { LeafWetnessMeasurement } from "../../cluster/definitions/LeafWetnessMeasurementCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * LeafWetnessMeasurementBehavior is the base class for objects that support interaction with {@link
 * LeafWetnessMeasurement.Cluster}.
 */
export const LeafWetnessMeasurementBehavior = ClusterBehavior.for(LeafWetnessMeasurement.Cluster);

type LeafWetnessMeasurementBehaviorType = InstanceType<typeof LeafWetnessMeasurementBehavior>;
export interface LeafWetnessMeasurementBehavior extends LeafWetnessMeasurementBehaviorType {}
