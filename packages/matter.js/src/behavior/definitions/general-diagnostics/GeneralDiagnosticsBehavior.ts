/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { GeneralDiagnostics } from "../../../cluster/definitions/GeneralDiagnosticsCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { GeneralDiagnosticsInterface } from "./GeneralDiagnosticsInterface.js";

/**
 * GeneralDiagnosticsBehavior is the base class for objects that support interaction with {@link
 * GeneralDiagnostics.Cluster}.
 */
export const GeneralDiagnosticsBehavior = ClusterBehavior
    .withInterface<GeneralDiagnosticsInterface>()
    .for(GeneralDiagnostics.Cluster);

type GeneralDiagnosticsBehaviorType = InstanceType<typeof GeneralDiagnosticsBehavior>;
export interface GeneralDiagnosticsBehavior extends GeneralDiagnosticsBehaviorType {}
