/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ApplicationLauncher } from "../../cluster/definitions/ApplicationLauncherCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { ApplicationLauncherInterface } from "../cluster/definitions/ApplicationLauncherInterface.js";

/**
 * ApplicationLauncherBehavior is the base class for objects that support interaction with {@link
 * ApplicationLauncher.Cluster}.
 *
 * This class does not have optional features of ApplicationLauncher.Cluster enabled. You can enable additional
 * features using ApplicationLauncherBehavior.with.
 */
export const ApplicationLauncherBehavior = ClusterBehavior
    .withInterface<ApplicationLauncherInterface>()
    .for(ApplicationLauncher.Cluster);

type ApplicationLauncherBehaviorType = InstanceType<typeof ApplicationLauncherBehavior>;
export interface ApplicationLauncherBehavior extends ApplicationLauncherBehaviorType {}
