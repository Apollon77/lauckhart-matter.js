/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MediaPlayback } from "../../cluster/definitions/MediaPlaybackCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { MediaPlaybackInterface } from "../cluster/definitions/MediaPlaybackInterface.js";

/**
 * MediaPlaybackBehavior is the base class for objects that support interaction with {@link MediaPlayback.Cluster}.
 *
 * This class does not have optional features of MediaPlayback.Cluster enabled. You can enable additional features
 * using MediaPlaybackBehavior.with.
 */
export const MediaPlaybackBehavior = ClusterBehavior
    .withInterface<MediaPlaybackInterface>()
    .for(MediaPlayback.Cluster);

type MediaPlaybackBehaviorType = InstanceType<typeof MediaPlaybackBehavior>;
export interface MediaPlaybackBehavior extends MediaPlaybackBehaviorType {}
