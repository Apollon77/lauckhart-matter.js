/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ChipMatter } from "../internal.js";
import { ClusterElement, AttributeElement } from "../../../index.js";

ChipMatter.children!.push(ClusterElement({
    id: 0x002c, name: "TimeFormatLocalization",
    description: "Time Format Localization",
    details: "Nodes should be expected to be deployed to any and all regions of the world. These global regions may have differing preferences for how dates and times are conveyed. As such, Nodes that visually or audibly convey time information need a mechanism by which they can be configured to use a user’s preferred format.",
    children: [
        AttributeElement({
            id: 0x0000, name: "HourFormat", base: "HourFormat",
            access: { rw: "W" }, conformance: [ "M" ]
        }),

        AttributeElement({
            id: 0x0001, name: "ActiveCalendarType", base: "ActiveCalendarType",
            access: { rw: "W" }, conformance: [ "O" ]
        }),

        AttributeElement({
            id: 0x0002, name: "SupportedCalendarTypes", base: "SupportedCalendarTypes",
            access: { rw: "R" }, conformance: [ "O" ]
        })
    ]
}));
