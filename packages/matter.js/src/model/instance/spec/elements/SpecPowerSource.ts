/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SpecMatter } from "../SpecMatter.js";
import { ClusterElement, AttributeElement, DatatypeElement, EventElement } from "../../../elements/index.js";

SpecMatter.children!.push(ClusterElement({
    id: 0x002f, name: "PowerSource",
    classification: "node",
    children: [
        AttributeElement({
            id: 0xfffd, name: "ClusterRevision", type: "uint16",
            access: "R V", conformance: "M", constraint: "min 1", default: 1, quality: "F"
        }),

        AttributeElement({
            id: 0xfffc, name: "FeatureMap", type: "map32",
            access: "R V", conformance: "M", default: 0, quality: "F",
            children: [
                DatatypeElement({
                    id: 0x0000, name: "WIRED",
                    description: "A wired power source",
                    xref: { document: "core", section: "11.7.4", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0001, name: "BAT",
                    description: "A battery power source",
                    xref: { document: "core", section: "11.7.4", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0002, name: "RECHG",
                    description: "A rechargeable battery power source (requires Battery feature)",
                    xref: { document: "core", section: "11.7.4", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0003, name: "REPLC",
                    description: "A replaceable battery power source (requires Battery feature)",
                    xref: { document: "core", section: "11.7.4", version: "1.1" }
                })
            ]
        }),

        AttributeElement({
            id: 0x0000, name: "Status", type: "PowerSourceStatusEnum",
            access: "R V", conformance: "M", constraint: "desc", default: "",
            details: "This attribute SHALL indicate the participation of this power source " +
                     "in providing power to the Node as specified in PowerSourceStatusEnum",
            xref: { document: "core", section: "11.7.6.1", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0001, name: "Order", type: "uint8",
            access: "R V", conformance: "M", default: 0, quality: "N",
            details: "This attribute SHALL indicate the relative preference with which the " +
                     "Node will select this source to provide power. A source with a lower " +
                     "order SHALL be selected by the Node to provide power before any other " +
                     "source with a higher order, if the lower order source is available (" +
                     "see Status",
            xref: { document: "core", section: "11.7.6.2", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0002, name: "Description", type: "string",
            access: "R V", conformance: "M", constraint: "max 60", default: "", quality: "F",
            details: "This attribute SHALL provide a user-facing description of this source" +
                     ", used to distinguish it from other power sources, e.g. \"DC Power\", \"" +
                     "Primary Battery\" or \"Battery back-up\". This attribute SHALL NOT be " +
                     "used to convey information such as battery form factor, or chemistry",
            xref: { document: "core", section: "11.7.6.3", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0003, name: "WiredAssessedInputVoltage", type: "uint32",
            access: "R V", conformance: "[WIRED]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the assessed RMS or DC voltage currently" +
                     " provided by the hard-wired source, in mV (millivolts). A value of " +
                     "NULL SHALL indicate the Node is currently unable to assess the value. " +
                     "If the wired source is not connected, but the Node is still able to " +
                     "assess a value, then the assessed value MAY be reported",
            xref: { document: "core", section: "11.7.6.4", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0004, name: "WiredAssessedInputFrequency", type: "uint16",
            access: "R V", conformance: "[WIRED]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the assessed frequency of the voltage, " +
                     "currently provided by the hard-wired source, in Hz. A value of NULL " +
                     "SHALL indicate the Node is currently unable to assess the value. If " +
                     "the wired source is not connected, but the Node is still able to " +
                     "assess a value, then the assessed value MAY be reported",
            xref: { document: "core", section: "11.7.6.5", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0005, name: "WiredCurrentType", type: "WiredCurrentTypeEnum",
            access: "R V", conformance: "WIRED", constraint: "desc", default: "", quality: "F",
            details: "This attribute SHALL indicate the type of current the Node expects to " +
                     "be provided by the hard- wired source as specified in " +
                     "WiredCurrentTypeEnum",
            xref: { document: "core", section: "11.7.6.6", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0006, name: "WiredAssessedCurrent", type: "uint32",
            access: "R V", conformance: "[WIRED]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the assessed instantaneous current draw " +
                     "of the Node on the hard- wired source, in mA (milliamps). A value of " +
                     "NULL SHALL indicate the Node is currently unable to assess the value. " +
                     "If the wired source is not connected, but the Node is still able to " +
                     "assess a value, then the assessed value MAY be reported",
            xref: { document: "core", section: "11.7.6.7", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0007, name: "WiredNominalVoltage", type: "uint32",
            access: "R V", conformance: "[WIRED]", default: 0, quality: "F",
            details: "This attribute SHALL indicate the nominal voltage, printed as part of " +
                     "the Node’s regulatory compliance label in mV (millivolts), expected to" +
                     " be provided by the hard-wired source",
            xref: { document: "core", section: "11.7.6.8", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0008, name: "WiredMaximumCurrent", type: "uint32",
            access: "R V", conformance: "[WIRED]", default: 0, quality: "F",
            details: "This attribute SHALL indicate the maximum current, printed as part of " +
                     "the Node’s regulatory compliance label in mA (milliamps), expected to " +
                     "be provided by the hard-wired source",
            xref: { document: "core", section: "11.7.6.9", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0009, name: "WiredPresent", type: "bool",
            access: "R V", conformance: "[WIRED]", default: false,
            details: "This attribute SHALL indicate if the Node detects that the hard-wired " +
                     "power source is properly connected",
            xref: { document: "core", section: "11.7.6.10", version: "1.1" }
        }),

        AttributeElement({
            id: 0x000a, name: "ActiveWiredFaults", type: "list",
            access: "R V", conformance: "[WIRED]", default: "",
            details: "This attribute SHALL indicate the set of wired faults currently " +
                     "detected by the Node on this power source. This set is represented as " +
                     "a list of WiredFaultEnum. When the Node detects a fault has been " +
                     "raised, the appropriate WiredFaultEnum value SHALL be added to this " +
                     "list, provided it is not already present. This list SHALL NOT contain " +
                     "more than one instance of a specific WiredFaultEnum value. When the " +
                     "Node detects all conditions contributing to a fault have been cleared" +
                     ", the corresponding WiredFaultEnum value SHALL be removed from this " +
                     "list. An empty list SHALL indicate there are currently no active " +
                     "faults. The order of this list SHOULD have no significance. Clients " +
                     "interested in monitoring changes in active faults MAY subscribe to " +
                     "this attribute, or they MAY subscribe to WiredFaultChange",
            xref: { document: "core", section: "11.7.6.11", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", type: "WiredFaultEnum"
                })
            ]
        }),

        AttributeElement({
            id: 0x000b, name: "BatVoltage", type: "uint32",
            access: "R V", conformance: "[BAT]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the currently measured output voltage of" +
                     " the battery in mV (millivolts). A value of NULL SHALL indicate the " +
                     "Node is currently unable to assess the value",
            xref: { document: "core", section: "11.7.6.12", version: "1.1" }
        }),

        AttributeElement({
            id: 0x000c, name: "BatPercentRemaining", type: "uint8",
            access: "R V", conformance: "[BAT]", constraint: "0 to 200", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the estimated percentage of battery " +
                     "charge remaining until the battery will no longer be able to provide " +
                     "power to the Node. Values are expressed in half percent units, ranging" +
                     " from 0 to 200. E.g. a value of 48 is equivalent to 24%. A value of " +
                     "NULL SHALL indicate the Node is currently unable to assess the value",
            xref: { document: "core", section: "11.7.6.13", version: "1.1" }
        }),

        AttributeElement({
            id: 0x000d, name: "BatTimeRemaining", type: "uint32",
            access: "R V", conformance: "[BAT]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the estimated time in seconds before the" +
                     " battery will no longer be able to provide power to the Node. A value " +
                     "of NULL SHALL indicate the Node is currently unable to assess the " +
                     "value",
            xref: { document: "core", section: "11.7.6.14", version: "1.1" }
        }),

        AttributeElement({
            id: 0x000e, name: "BatChargeLevel", type: "BatChargeLevelEnum",
            access: "R V", conformance: "BAT", constraint: "desc", default: "",
            details: "This attribute SHALL indicate a coarse ranking of the charge level of " +
                     "the battery, used to indicate when intervention is required as " +
                     "specified in BatChargeLevelEnum",
            xref: { document: "core", section: "11.7.6.15", version: "1.1" }
        }),

        AttributeElement({
            id: 0x000f, name: "BatReplacementNeeded", type: "bool",
            access: "R V", conformance: "BAT", default: false,
            details: "This attribute SHALL indicate if the battery needs to be replaced. " +
                     "Replacement MAY be simple routine maintenance, such as with a single " +
                     "use, non-rechargeable cell. Replacement, however, MAY also indicate " +
                     "end of life, or serious fault with a rechargeable or even non-" +
                     "replaceable cell",
            xref: { document: "core", section: "11.7.6.16", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0010, name: "BatReplaceability", type: "BatReplaceabilityEnum",
            access: "R V", conformance: "BAT", default: "", quality: "F",
            details: "This attribute SHALL indicate the replaceability of the battery as " +
                     "specified in BatReplaceabilityEnum",
            xref: { document: "core", section: "11.7.6.17", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0011, name: "BatPresent", type: "bool",
            access: "R V", conformance: "[BAT]", default: false,
            details: "This attribute SHALL indicate whether the Node detects that the " +
                     "batteries are properly installed",
            xref: { document: "core", section: "11.7.6.18", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0012, name: "ActiveBatFaults", type: "list",
            access: "R V", conformance: "[BAT]", default: "",
            details: "This attribute SHALL indicate the set of battery faults currently " +
                     "detected by the Node on this power source. This set is represented as " +
                     "a list of BatFaultEnum. When the Node detects a fault has been raised" +
                     ", the appropriate BatFaultEnum value SHALL be added to this list, " +
                     "provided it is not already present. This list SHALL NOT contain more " +
                     "than one instance of a specific BatFaultEnum value. When the Node " +
                     "detects all conditions contributing to a fault have been cleared, the " +
                     "corresponding BatFaultEnum value SHALL be removed from this list. An " +
                     "empty list SHALL indicate there are currently no active faults. The " +
                     "order of this list SHOULD have no significance. Clients interested in " +
                     "monitoring changes in active faults MAY subscribe to this attribute, " +
                     "or they MAY subscribe to Section 11.7.7.2, “BatFaultChange Event",
            xref: { document: "core", section: "11.7.6.19", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", type: "BatFaultEnum"
                })
            ]
        }),

        AttributeElement({
            id: 0x0013, name: "BatReplacementDescription", type: "string",
            access: "R V", conformance: "REPLC", constraint: "max 60", default: "", quality: "F",
            details: "This attribute SHALL provide a user-facing description of this battery" +
                     ", which SHOULD contain information required to identify a replacement" +
                     ", such as form factor, chemistry or preferred manufacturer",
            xref: { document: "core", section: "11.7.6.20", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0014, name: "BatCommonDesignation", type: "BatCommonDesignationEnum",
            access: "R V", conformance: "[REPLC]", constraint: "desc", default: "", quality: "F",
            details: "This attribute SHALL indicate the ID of the common or colloquial " +
                     "designation of the battery, as specified in BatCommonDesignationEnum",
            xref: { document: "core", section: "11.7.6.21", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0015, name: "BatAnsiDesignation", type: "string",
            access: "R V", conformance: "[REPLC]", constraint: "max 20", default: "", quality: "F",
            details: "This attribute SHALL indicate the string representing the ANSI " +
                     "designation for the battery as specified in ANSI C18",
            xref: { document: "core", section: "11.7.6.22", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0016, name: "BatIecDesignation", type: "string",
            access: "R V", conformance: "[REPLC]", constraint: "max 20", default: "", quality: "F",
            details: "This attribute SHALL indicate the string representing the IEC " +
                     "designation for the battery as specified in IEC 60086",
            xref: { document: "core", section: "11.7.6.23", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0017, name: "BatApprovedChemistry", type: "BatApprovedChemistryEnum",
            access: "R V", conformance: "[REPLC]", constraint: "desc", default: "", quality: "F",
            details: "This attribute SHALL indicate the ID of the preferred chemistry of the" +
                     " battery source as specified in BatApprovedChemistryEnum",
            xref: { document: "core", section: "11.7.6.24", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0018, name: "BatCapacity", type: "uint32",
            access: "R V", conformance: "[REPLC]", default: 0, quality: "F",
            details: "This attribute SHALL indicate the preferred minimum charge capacity " +
                     "rating in mAh of individual, user- or factory-serviceable battery " +
                     "cells or packs in the battery source",
            xref: { document: "core", section: "11.7.6.25", version: "1.1" }
        }),

        AttributeElement({
            id: 0x0019, name: "BatQuantity", type: "uint8",
            access: "R V", conformance: "REPLC", default: 0, quality: "F",
            details: "This attribute SHALL indicate the quantity of individual, user- or " +
                     "factory-serviceable battery cells or packs in the battery source",
            xref: { document: "core", section: "11.7.6.26", version: "1.1" }
        }),

        AttributeElement({
            id: 0x001a, name: "BatChargeState", type: "BatChargeStateEnum",
            access: "R V", conformance: "RECHG", constraint: "desc", default: "",
            details: "This attribute SHALL indicate the current state of the battery source " +
                     "with respect to charging as specified in BatChargeStateEnum",
            xref: { document: "core", section: "11.7.6.27", version: "1.1" }
        }),

        AttributeElement({
            id: 0x001b, name: "BatTimeToFullCharge", type: "uint32",
            access: "R V", conformance: "[RECHG]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate the estimated time in seconds before the" +
                     " battery source will be at full charge. A value of NULL SHALL indicate" +
                     " the Node is currently unable to assess the value",
            xref: { document: "core", section: "11.7.6.28", version: "1.1" }
        }),

        AttributeElement({
            id: 0x001c, name: "BatFunctionalWhileCharging", type: "bool",
            access: "R V", conformance: "RECHG", default: false,
            details: "This attribute SHALL indicate whether the Node can remain operational " +
                     "while the battery source is charging",
            xref: { document: "core", section: "11.7.6.29", version: "1.1" }
        }),

        AttributeElement({
            id: 0x001d, name: "BatChargingCurrent", type: "uint32",
            access: "R V", conformance: "[RECHG]", default: 0, quality: "X C",
            details: "This attribute SHALL indicate assessed current in mA (milliamps) " +
                     "presently supplied to charge the battery source. A value of NULL SHALL" +
                     " indicate the Node is currently unable to assess the value",
            xref: { document: "core", section: "11.7.6.30", version: "1.1" }
        }),

        AttributeElement({
            id: 0x001e, name: "ActiveBatChargeFaults", type: "list",
            access: "R V", conformance: "[RECHG]", default: "",
            details: "This attribute SHALL indicate the set of charge faults currently " +
                     "detected by the Node on this power source. This set is represented as " +
                     "a list of BatChargeFaultEnum. When the Node detects a fault has been " +
                     "raised, the appropriate BatChargeFaultEnum value SHALL be added to " +
                     "this list, provided it is not already present. This list SHALL NOT " +
                     "contain more than one instance of a specific BatChargeFaultEnum value" +
                     ". When the Node detects all conditions contributing to a fault have " +
                     "been cleared, the corresponding BatChargeFaultEnum value SHALL be " +
                     "removed from this list. An empty list SHALL indicate there are " +
                     "currently no active faults. The order of this list SHOULD have no " +
                     "significance. Clients interested in monitoring changes in active " +
                     "faults MAY subscribe to this attribute, or they MAY subscribe to the " +
                     "BatFaultChange event",
            xref: { document: "core", section: "11.7.6.31", version: "1.1" },
            children: [
                DatatypeElement({
                    name: "entry", type: "BatChargeFaultEnum"
                })
            ]
        }),

        EventElement({
            id: 0x0000, name: "WiredFaultChange",
            access: "V", conformance: "[WIRED]", priority: "info",
            details: "The WiredFaultChange Event SHALL be generated when the set of wired " +
                     "faults currently detected by the Node on this wired power source " +
                     "changes. This event SHALL correspond to a change in value of " +
                     "ActiveWiredFaults",
            xref: { document: "core", section: "11.7.7.1", version: "1.1" }
        }),

        EventElement({
            id: 0x0001, name: "BatFaultChange",
            access: "V", conformance: "[BAT]", priority: "info",
            details: "The BatFaultChange Event SHALL be generated when the set of battery " +
                     "faults currently detected by the Node on this battery power source " +
                     "changes. This event SHALL correspond to a change in value of " +
                     "ActiveBatFaults",
            xref: { document: "core", section: "11.7.7.2", version: "1.1" }
        }),

        EventElement({
            id: 0x0002, name: "BatChargeFaultChange",
            access: "V", conformance: "[RECHG]", priority: "info",
            details: "The BatChargeFaultChange Event SHALL be generated when the set of " +
                     "charge faults currently",
            xref: { document: "core", section: "11.7.7.3", version: "1.1" }
        }),

        DatatypeElement({
            id: -1, name: "WiredFaultEnum", type: "enum8",
            details: "This data type is derived from enum8",
            xref: { document: "core", section: "11.7.5.1", version: "1.1" },
            children: [
                DatatypeElement({
                    id: 0x0000, name: "Unspecified",
                    conformance: "M",
                    xref: { document: "core", section: "11.7.5.1", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0001, name: "OverVoltage",
                    conformance: "M",
                    xref: { document: "core", section: "11.7.5.1", version: "1.1" }
                }),

                DatatypeElement({
                    id: 0x0002, name: "UnderVoltage",
                    conformance: "M",
                    xref: { document: "core", section: "11.7.5.1", version: "1.1" }
                })
            ]
        })
    ]
}));
