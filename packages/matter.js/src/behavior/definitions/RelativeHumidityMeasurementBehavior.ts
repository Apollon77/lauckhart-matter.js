/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { RelativeHumidityMeasurement } from "../../cluster/definitions/RelativeHumidityMeasurementCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";

/**
 * RelativeHumidityMeasurementBehavior is the base class for objects that support interaction with {@link
 * RelativeHumidityMeasurement.Cluster}.
 */
export const RelativeHumidityMeasurementBehavior = ClusterBehavior.for(RelativeHumidityMeasurement.Cluster);

type RelativeHumidityMeasurementBehaviorType = InstanceType<typeof RelativeHumidityMeasurementBehavior>;
export interface RelativeHumidityMeasurementBehavior extends RelativeHumidityMeasurementBehaviorType {}
