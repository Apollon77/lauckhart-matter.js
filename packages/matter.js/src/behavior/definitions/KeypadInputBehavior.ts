/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { KeypadInput } from "../../cluster/definitions/KeypadInputCluster.js";
import { ClusterBehavior } from "../cluster/ClusterBehavior.js";
import { KeypadInputInterface } from "../cluster/definitions/KeypadInputInterface.js";

/**
 * KeypadInputBehavior is the base class for objects that support interaction with {@link KeypadInput.Cluster}.
 */
export const KeypadInputBehavior = ClusterBehavior
    .withInterface<KeypadInputInterface>()
    .for(KeypadInput.Cluster);

type KeypadInputBehaviorType = InstanceType<typeof KeypadInputBehavior>;
export interface KeypadInputBehavior extends KeypadInputBehaviorType {}
