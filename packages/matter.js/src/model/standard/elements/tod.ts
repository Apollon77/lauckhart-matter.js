/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DatatypeElement as Datatype, FieldElement as Field } from "../../elements/index.js";

export const tod = Datatype({
    name: "tod", type: "struct", description: "Time of day", isSeed: true,
    details: "Represents time without a date component.",
    xref: { document: "core", section: "7.18.2.3" },

    children: [
        Field({ name: "hours", type: "uint8", constraint: "0 to 23", description: "Hour of the current day." }),
        Field({ name: "minutes", type: "uint8", constraint: "0 to 59", description: "Minute of the current hour." }),
        Field({ name: "seconds", type: "uint8", constraint: "0 to 59", description: "Second of the current minute." }),
        Field({
            name: "hundredths", type: "uint8", constraint: "0 to 99",
            description: "Hundredth of the current second."
        })
    ]
});

Matter.children.push(tod);
