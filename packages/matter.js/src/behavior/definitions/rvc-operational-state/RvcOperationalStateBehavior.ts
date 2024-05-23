/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { RvcOperationalState } from "../../../cluster/definitions/RvcOperationalStateCluster.js";
import { ClusterBehavior } from "../../cluster/ClusterBehavior.js";
import { RvcOperationalStateInterface } from "./RvcOperationalStateInterface.js";

/**
 * RvcOperationalStateBehavior is the base class for objects that support interaction with {@link
 * RvcOperationalState.Cluster}.
 */
export const RvcOperationalStateBehavior = ClusterBehavior
    .withInterface<RvcOperationalStateInterface>()
    .for(RvcOperationalState.Cluster);

type RvcOperationalStateBehaviorType = InstanceType<typeof RvcOperationalStateBehavior>;
export interface RvcOperationalStateBehavior extends RvcOperationalStateBehaviorType {}
type StateType = InstanceType<typeof RvcOperationalStateBehavior.State>;
export namespace RvcOperationalStateBehavior { export interface State extends StateType {} }
