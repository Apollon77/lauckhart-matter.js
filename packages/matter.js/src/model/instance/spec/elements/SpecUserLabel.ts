/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SpecMatter } from "../internal.js";
import { ClusterElement, AttributeElement } from "../../../index.js";

SpecMatter.children!.push(ClusterElement({
    id: 0x0041, name: "UserLabel",
    classification: "endpoint",
    children: [
        AttributeElement({
            id: 0xfffd, name: "ClusterRevision", base: "uint16",
            access: "R V", conformance: "M", constraint: { min: 1 }, default: 1, quality: "F"
        }),

        AttributeElement({
            id: 0xfffc, name: "FeatureMap", base: "map32",
            access: "R V", conformance: "M", default: 0, quality: "F"
        }),

        AttributeElement({
            id: 0x0000, name: "LabelList", base: "list[LabelStruct]",
            access: "RW VM", conformance: "M", constraint: "min 4 per node", default: "empty", quality: "N",
            details: "An implementation SHALL support at least 4 list entries per node for all User Label cluster instances on the node.",
            xref: { section: "9.9.4.1", document: "core", version: "1.1" }
        })
    ]
}));