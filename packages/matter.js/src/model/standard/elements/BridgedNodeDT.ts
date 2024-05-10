/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import { DeviceTypeElement as DeviceType, RequirementElement as Requirement } from "../../elements/index.js";

export const BridgedNodeDT = DeviceType({
    name: "BridgedNode", id: 0x13, classification: "utility",
    details: "This defines conformance for a Bridged Node root endpoint. This endpoint is akin to a \"read me " +
        "first\" endpoint that describes itself and any other endpoints that make up the Bridged Node. A " +
        "Bridged Node endpoint represents a device on a foreign network, but is not the root endpoint of the " +
        "bridge itself.",
    xref: { document: "device", section: "2.5" },

    children: [
        Requirement({
            name: "Descriptor", id: 0x1d, element: "serverCluster",
            children: [
                Requirement({ name: "DeviceTypeList", default: [ { deviceType: 19, revision: 2 } ], element: "attribute" })
            ]
        }),

        Requirement({
            name: "BridgedDeviceBasicInformation", id: 0x39, conformance: "M", element: "serverCluster",
            xref: { document: "device", section: "2.5.5" }
        }),
        Requirement({
            name: "PowerSourceConfiguration", id: 0x2e, conformance: "BridgedPowerSourceInfo, D",
            element: "serverCluster",
            xref: { document: "device", section: "2.5.5" }
        }),
        Requirement({
            name: "PowerSource", id: 0x2f, conformance: "BridgedPowerSourceInfo", element: "serverCluster",
            xref: { document: "device", section: "2.5.5" }
        })
    ]
});

Matter.children.push(BridgedNodeDT);
