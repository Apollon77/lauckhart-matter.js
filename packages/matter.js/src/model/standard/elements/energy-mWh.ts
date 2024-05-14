/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DatatypeElement as Datatype } from "../../elements/index.js";

export const energyMWh = Datatype({
    name: "energy-mWh", type: "int64", description: "Energy", isSeed: true,
    details: "This type represents energy measured in milliwatt-hours.",
    xref: { document: "core", section: "7.18.2.15" }
});
Matter.children.push(energyMWh);
