/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Scenes } from "../../../cluster/definitions/ScenesCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { ScenesInterface } from "./Interface.js";

/**
 * ScenesBehavior is the base class for objects that support interaction with {@link Scenes.Cluster}.
 */
export const ScenesBehavior = ClusterBehavior
    .withInterface<ScenesInterface>()
    .for(Scenes.Cluster);

type ScenesBehaviorType = InstanceType<typeof ScenesBehavior>;
export interface ScenesBehavior extends ScenesBehaviorType {}
