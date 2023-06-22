/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "cluster", name: "ValidProxies", id: 0x44, classification: "node", description: "Proxy Valid",
    details: "Cluster to control Proxy Valid",
    xref: { document: "core", section: "9.15.15" },
    children: [
        {
            tag: "attribute", name: "ValidProxyList", id: 0x0, type: "list", access: "RW", conformance: "M",
            quality: "N F",
            details: "List of valid proxies that can proxy this Node. Each entry in this list is fabric-scoped",
            xref: { document: "core", section: "9.15.15.5.1" },
            children: [
                {
                    tag: "datatype", name: "entry", type: "ValidProxyStruct"
                }
            ]
        },

        {
            tag: "command", name: "GetValidProxiesRequest", id: 0x0, access: "O", conformance: "M",
            direction: "request", response: "GetValidProxiesResponse",
            xref: { document: "core", section: "9.15.15.6" }
        },

        {
            tag: "command", name: "GetValidProxiesResponse", id: 0x1, conformance: "M", direction: "response",
            xref: { document: "core", section: "9.15.15.6" }
        },

        {
            tag: "datatype", name: "ValidProxyStruct", type: "struct",
            details: "Encapsulates the Node ID of a Valid Proxy",
            xref: { document: "core", section: "9.15.15.4.1" },
            children: [
                {
                    tag: "datatype", name: "NodeId", id: 0x1, type: "node-id", access: "RW", conformance: "M",
                    xref: { document: "core", section: "9.15.15.4.1" }
                }
            ]
        }
    ]
});
