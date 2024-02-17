/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE WILL BE REGENERATED IF YOU DO NOT REMOVE THIS MESSAGE ***/

import { PowerSourceBehavior } from "./PowerSourceBehavior.js";

const Base = PowerSourceBehavior.with("Wired", "Battery", "Rechargeable", "Replaceable");

/**
 * This is the default server implementation of PowerSourceBehavior.
 *
 * This implementation includes all features of PowerSource.Cluster. You should use PowerSourceServer.with to
 * specialize the class for the features your implementation supports.
 */
export class PowerSourceServer extends Base {
}
