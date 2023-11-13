/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { DiagnosticLogs } from "../../cluster/definitions/DiagnosticLogsCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { DiagnosticLogsInterface } from "../cluster/definitions/DiagnosticLogsInterface.js";

/**
 * DiagnosticLogsBehavior is the base class for objects that support interaction with {@link DiagnosticLogs.Cluster}.
 */
export const DiagnosticLogsBehavior = ClusterBehavior
    .withInterface<DiagnosticLogsInterface>()
    .for(DiagnosticLogs.Cluster);

type DiagnosticLogsBehaviorType = InstanceType<typeof DiagnosticLogsBehavior>;
export interface DiagnosticLogsBehavior extends DiagnosticLogsBehaviorType {}
