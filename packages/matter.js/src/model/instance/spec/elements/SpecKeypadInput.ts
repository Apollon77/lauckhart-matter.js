/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SpecMatter } from "../internal.js";
import { ClusterElement, AttributeElement, DatatypeElement, CommandElement } from "../../../index.js";

SpecMatter.children!.push(ClusterElement({
    id: 0x0509, name: "KeypadInput",
    classification: "application",
    children: [
        AttributeElement({
            id: 0xfffd, name: "ClusterRevision", base: "uint16",
            access: "R V", conformance: "M", constraint: { min: 1 }, default: 1, quality: "F"
        }),

        AttributeElement({
            id: 0xfffc, name: "FeatureMap", base: "map32",
            access: "R V", conformance: "M", default: 0, quality: "F",
            children: [
                DatatypeElement({
                    id: 0x0000, name: "NV",
                    description: "Supports UP, DOWN, LEFT, RIGHT, SELECT, BACK, EXIT, MENU",
                    xref: { section: "6.8.2", document: "cluster", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0001, name: "LK",
                    description: "Supports CEC keys 0x0A (Settings) and 0x09 (Home)",
                    xref: { section: "6.8.2", document: "cluster", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0002, name: "NK",
                    description: "Supports numeric input 0..9",
                    xref: { section: "6.8.2", document: "cluster", version: "1.1" }
                })
            ]
        }),

        CommandElement({
            id: 0x0000, name: "SendKey",
            access: "O", conformance: "M", direction: "request", response: "SendKeyResponse",
            details: "Upon receipt, this SHALL process a keycode as input to the media device.",
            xref: { section: "6.8.3.1", document: "cluster", version: "1.1" }
        }),

        CommandElement({
            id: 0x0001, name: "SendKeyResponse",
            conformance: "M", direction: "response",
            details: "This command SHALL be generated in response to a SendKey command. The data for this command SHALL be as follows:",
            xref: { section: "6.8.3.2", document: "cluster", version: "1.1" }
        }),

        DatatypeElement({
            id: -1, name: "StatusEnum", base: "enum8.",
            details: "Status Data Type is derived from enum8.",
            xref: { section: "6.8.4.1", document: "cluster", version: "1.1" },
            children: [
                DatatypeElement({
                    id: 0x0000, name: "Success",
                    conformance: "M", description: "Command succeeded",
                    xref: { section: "6.8.4.1", document: "cluster", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0001, name: "UnsupportedKey",
                    conformance: "M", description: "Command failed: Key code is not supported.",
                    xref: { section: "6.8.4.1", document: "cluster", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0002, name: "InvalidKeyInCurrentState",
                    conformance: "M", description: "Command failed: Requested key code is invalid in the context of the responder’s current state.",
                    xref: { section: "6.8.4.1", document: "cluster", version: "1.1" }
                })
            ]
        })
    ]
}));