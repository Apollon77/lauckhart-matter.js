/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { GroupKeyManagement } from "../../../cluster/definitions/GroupKeyManagementCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { GroupKeyManagementInterface } from "./Interface.js";

/**
 * GroupKeyManagementBehavior is the base class for objects that support interaction with {@link
 * GroupKeyManagement.Cluster}.
 */
export const GroupKeyManagementBehavior = ClusterBehavior
    .withInterface<GroupKeyManagementInterface>()
    .for(GroupKeyManagement.Cluster);

type GroupKeyManagementBehaviorType = InstanceType<typeof GroupKeyManagementBehavior>;
export interface GroupKeyManagementBehavior extends GroupKeyManagementBehaviorType {}
