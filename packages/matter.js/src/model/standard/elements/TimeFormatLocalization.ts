/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "cluster", name: "TimeFormatLocalization", id: 0x2c, classification: "node",
    description: "Time Format Localization",
    details: "Nodes should be expected to be deployed to any and all regions of the world. These global regions " +
             "may have differing preferences for how dates and times are conveyed. As such, Nodes that visually " +
             "or audibly convey time information need a mechanism by which they can be configured to use a user’s " +
             "preferred format.",
    xref: { document: "core", section: "11.4" },

    children: [
        {
            tag: "attribute", name: "FeatureMap", id: 0xfffc, type: "FeatureMap",
            xref: { document: "core", section: "11.4.4" },

            children: [
                {
                    tag: "datatype", name: "CALFMT", id: 0x0, description: "CalendarFormat",
                    details: "The Node can be configured to use different calendar formats when conveying values to a user."
                }
            ]
        },

        {
            tag: "attribute", name: "HourFormat", id: 0x0, type: "HourFormatEnum", access: "RW VM",
            conformance: "M", default: null, quality: "X N",
            details: "The HourFormat attribute SHALL represent the format that the Node is currently configured to use " +
                     "when conveying the hour unit of time. If provided, this value SHALL take priority over any unit",
            xref: { document: "core", section: "11.4.6.1" }
        },

        {
            tag: "attribute", name: "ActiveCalendarType", id: 0x1, type: "CalendarTypeEnum", access: "RW VM",
            conformance: "CALFMT", default: null, quality: "X N",
            details: "The ActiveCalendarType attribute SHALL represent the calendar format that the Node is currently " +
                     "configured to use when conveying dates. If provided, this value SHALL take priority over any unit " +
                     "implied through the ActiveLocale Attribute.",
            xref: { document: "core", section: "11.4.6.2" }
        },

        {
            tag: "attribute", name: "SupportedCalendarTypes", id: 0x2, type: "list", access: "R V",
            conformance: "CALFMT", constraint: "desc", quality: "F",
            details: "The SupportedCalendarTypes attribute SHALL represent a list of CalendarTypeEnum values that are " +
                     "supported by the Node. The list SHALL NOT contain any duplicate entries. The ordering of items " +
                     "within the list SHOULD NOT express any meaning. The maximum length of the SupportedCalendarTypes " +
                     "list SHALL be equivalent to the number of enumerations within CalendarTypeEnum.",
            xref: { document: "core", section: "11.4.6.3" },
            children: [ { tag: "datatype", name: "entry", type: "CalendarTypeEnum" } ]
        },

        {
            tag: "datatype", name: "HourFormatEnum", type: "enum8", conformance: "M",
            xref: { document: "core", section: "11.4.5.1" },
            children: [
                { tag: "datatype", name: "12Hr", id: 0x0, conformance: "M" },
                { tag: "datatype", name: "24Hr", id: 0x1, conformance: "M" }
            ]
        },

        {
            tag: "datatype", name: "CalendarTypeEnum", type: "enum8", conformance: "M",
            xref: { document: "core", section: "11.4.5.2" },

            children: [
                { tag: "datatype", name: "Buddhist", id: 0x0, conformance: "M" },
                { tag: "datatype", name: "Chinese", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Coptic", id: 0x2, conformance: "M" },
                { tag: "datatype", name: "Ethiopian", id: 0x3, conformance: "M" },
                { tag: "datatype", name: "Gregorian", id: 0x4, conformance: "M" },
                { tag: "datatype", name: "Hebrew", id: 0x5, conformance: "M" },
                { tag: "datatype", name: "Indian", id: 0x6, conformance: "M" },
                { tag: "datatype", name: "Islamic", id: 0x7, conformance: "M" },
                { tag: "datatype", name: "Japanese", id: 0x8, conformance: "M" },
                { tag: "datatype", name: "Korean", id: 0x9, conformance: "M" },
                { tag: "datatype", name: "Persian", id: 0xa, conformance: "M" },
                { tag: "datatype", name: "Taiwanese", id: 0xb, conformance: "M" }
            ]
        }
    ]
});