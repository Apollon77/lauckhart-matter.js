/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Descriptor } from "../../../cluster/definitions/DescriptorCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";

/**
 * DescriptorBehavior is the base class for objects that support interaction with {@link Descriptor.Cluster}.
 */
export const DescriptorBehavior = ClusterBehavior.for(Descriptor.Cluster);

type DescriptorBehaviorType = InstanceType<typeof DescriptorBehavior>;
export interface DescriptorBehavior extends DescriptorBehaviorType {}
