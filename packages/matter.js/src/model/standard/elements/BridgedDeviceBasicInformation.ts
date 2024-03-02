/**
 * @license
 * Copyright 2022-2024 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import {
    ClusterElement as Cluster,
    AttributeElement as Attribute,
    EventElement as Event,
    FieldElement as Field,
    DatatypeElement as Datatype
} from "../../elements/index.js";

Matter.children.push(Cluster({
    name: "BridgedDeviceBasicInformation", id: 0x39, type: "BasicInformation",
    classification: "endpoint", description: "Bridged Device Basic Information",

    details: "This Cluster serves two purposes towards a Node communicating with a Bridge:" +
        "\n" +
        "  • Indicate that the functionality on the Endpoint where it is placed (and its Parts) is bridged " +
        "    from a non-Matter technology, and" +
        "\n" +
        "  • Provide a centralized collection of attributes that the Node may collect to aid in conveying " +
        "    information regarding the Bridged Device to a user, such as the vendor name, the model name, or " +
        "    user-assigned name." +
        "\n" +
        "This cluster shall be exposed by a Bridge on the Endpoint representing each Bridged Device. When " +
        "the functionality of a Bridged Device is represented using a set of Endpoints, this cluster shall " +
        "only be exposed on the Endpoint which is at the top of the hierarchy for the functionality of that " +
        "Bridged Device." +
        "\n" +
        "This cluster shall NOT be used on an endpoint that is not in the Descriptor cluster PartsList of an " +
        "endpoint with an Aggregator device type." +
        "\n" +
        "This cluster has been derived from the Basic Information Cluster, and provides generic information " +
        "about the Bridged Device. Not all of the attributes in the Basic Information Cluster are relevant " +
        "for a Bridged Device (e.g. ProductID since it is not a Matter device). For other attributes, the " +
        "information which is listed as Mandatory for the Basic Information Cluster, may not be available " +
        "when the Bridged Device does not provide it to the Bridge, and the Bridge has no other means to " +
        "determine it. For such cases where the information for a particular attribute is not available, the " +
        "Bridge SHOULD NOT include the attribute in the cluster for this Bridged Device. See below for " +
        "Conformance details.",

    xref: { document: "core", section: "9.13" },

    children: [
        Attribute({ name: "ClusterRevision", id: 0xfffd, type: "ClusterRevision", default: 2 }),
        Attribute({
            name: "DataModelRevision", id: 0x0, conformance: "X",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "VendorName", id: 0x1, type: "string", conformance: "O", constraint: "max 32",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "VendorId", id: 0x2, type: "vendor-id", conformance: "O",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "ProductName", id: 0x3, type: "string", conformance: "O", constraint: "max 32",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({ name: "ProductId", id: 0x4, conformance: "X", xref: { document: "core", section: "9.13.4" } }),
        Attribute({
            name: "NodeLabel", id: 0x5, type: "string", access: "RW", conformance: "O", constraint: "max 32",
            default: "",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({ name: "Location", id: 0x6, conformance: "X", xref: { document: "core", section: "9.13.4" } }),
        Attribute({
            name: "HardwareVersion", id: 0x7, type: "uint16", conformance: "O", default: 0,
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "HardwareVersionString", id: 0x8, type: "string", conformance: "O", constraint: "max 64",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "SoftwareVersion", id: 0x9, type: "uint32", conformance: "O", default: 0,
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "SoftwareVersionString", id: 0xa, type: "string", conformance: "O", constraint: "max 64",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "ManufacturingDate", id: 0xb, type: "string", conformance: "O", constraint: "max 16",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "PartNumber", id: 0xc, type: "string", conformance: "O", constraint: "max 32",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "ProductUrl", id: 0xd, type: "string", conformance: "O", constraint: "max 256",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "ProductLabel", id: 0xe, type: "string", conformance: "O", constraint: "max 64",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "SerialNumber", id: 0xf, type: "string", conformance: "O", constraint: "max 32",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "LocalConfigDisabled", id: 0x10, conformance: "X",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "Reachable", id: 0x11, type: "bool", conformance: "M", default: true,
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "UniqueId", id: 0x12, type: "string", conformance: "O", constraint: "max 32",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "CapabilityMinima", id: 0x13, conformance: "X",
            xref: { document: "core", section: "9.13.4" }
        }),
        Attribute({
            name: "ProductAppearance", id: 0x14, type: "ProductAppearanceStruct", conformance: "O",
            quality: "F"
        }),
        Event({
            name: "StartUp", id: 0x0, conformance: "O", priority: "critical",
            xref: { document: "core", section: "9.13.5" },
            children: [Field({ name: "SoftwareVersion", id: 0x0, type: "uint32", conformance: "M" })]
        }),
        Event({
            name: "ShutDown", id: 0x1, conformance: "O", priority: "critical",
            xref: { document: "core", section: "9.13.5" }
        }),
        Event({
            name: "Leave", id: 0x2, conformance: "O", priority: "info",
            xref: { document: "core", section: "9.13.5" }
        }),

        Event({
            name: "ReachableChanged", id: 0x3, conformance: "M", priority: "info",
            details: "This event shall be generated when there is a change in the Reachable attribute. Its purpose is to " +
                "provide an indication towards interested parties that the reachability of a bridged device (over " +
                "the non-Matter network) has changed, so they may take appropriate action." +
                "\n" +
                "After (re)start of a bridge this event may be generated.",
            xref: { document: "core", section: "9.13.5.1" },
            children: [Field({ name: "ReachableNewValue", id: 0x0, type: "bool", conformance: "M" })]
        }),

        Datatype({
            name: "ProductAppearanceStruct", type: "struct", conformance: "M",
            children: [
                Field({ name: "Finish", id: 0x0, type: "ProductFinishEnum", conformance: "M" }),
                Field({ name: "PrimaryColor", id: 0x1, type: "ColorEnum", conformance: "M", quality: "X" })
            ]
        }),

        Datatype({
            name: "ProductFinishEnum", type: "enum8", conformance: "M",

            children: [
                Field({ name: "Other", id: 0x0, conformance: "M" }),
                Field({ name: "Matte", id: 0x1, conformance: "M" }),
                Field({ name: "Satin", id: 0x2, conformance: "M" }),
                Field({ name: "Polished", id: 0x3, conformance: "M" }),
                Field({ name: "Rugged", id: 0x4, conformance: "M" }),
                Field({ name: "Fabric", id: 0x5, conformance: "M" })
            ]
        }),

        Datatype({
            name: "ColorEnum", type: "enum8", conformance: "M",

            children: [
                Field({ name: "Black", id: 0x0, conformance: "M" }),
                Field({ name: "Navy", id: 0x1, conformance: "M" }),
                Field({ name: "Green", id: 0x2, conformance: "M" }),
                Field({ name: "Teal", id: 0x3, conformance: "M" }),
                Field({ name: "Maroon", id: 0x4, conformance: "M" }),
                Field({ name: "Purple", id: 0x5, conformance: "M" }),
                Field({ name: "Olive", id: 0x6, conformance: "M" }),
                Field({ name: "Gray", id: 0x7, conformance: "M" }),
                Field({ name: "Blue", id: 0x8, conformance: "M" }),
                Field({ name: "Lime", id: 0x9, conformance: "M" }),
                Field({ name: "Aqua", id: 0xa, conformance: "M" }),
                Field({ name: "Red", id: 0xb, conformance: "M" }),
                Field({ name: "Fuchsia", id: 0xc, conformance: "M" }),
                Field({ name: "Yellow", id: 0xd, conformance: "M" }),
                Field({ name: "White", id: 0xe, conformance: "M" }),
                Field({ name: "Nickel", id: 0xf, conformance: "M" }),
                Field({ name: "Chrome", id: 0x10, conformance: "M" }),
                Field({ name: "Brass", id: 0x11, conformance: "M" }),
                Field({ name: "Copper", id: 0x12, conformance: "M" }),
                Field({ name: "Silver", id: 0x13, conformance: "M" }),
                Field({ name: "Gold", id: 0x14, conformance: "M" })
            ]
        })
    ]
}))
