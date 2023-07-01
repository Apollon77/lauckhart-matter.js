/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "cluster", name: "ColorControl", id: 0x300, classification: "application",
    description: "Color Control",
    details: "Attributes and commands for controlling the color properties of a color-capable light.",
    xref: { document: "cluster", section: "3.2" },

    children: [
        {
            tag: "attribute", name: "FeatureMap", id: 0xfffc, type: "FeatureMap",
            xref: { document: "cluster", section: "3.2.5" },

            children: [
                {
                    tag: "datatype", name: "HS", id: 0x0, description: "HueSaturation",
                    details: "Supports color specification via hue/saturation."
                },
                {
                    tag: "datatype", name: "EHUE", id: 0x1, description: "EnhancedHue",
                    details: "Enhanced hue is supported."
                },
                {
                    tag: "datatype", name: "CL", id: 0x2, description: "ColorLoop",
                    details: "Color loop is supported."
                },
                {
                    tag: "datatype", name: "XY", id: 0x3, description: "Xy",
                    details: "Supports color specification via XY."
                },
                {
                    tag: "datatype", name: "CT", id: 0x4, description: "ColorTemperature",
                    details: "Supports specification of color temperature."
                }
            ]
        },

        {
            tag: "attribute", name: "CurrentHue", id: 0x0, type: "uint8", access: "R V", conformance: "HS",
            constraint: "0 to 254", quality: "N P",
            details: "The CurrentHue attribute contains the current hue value of the light. It is updated as fast as " +
                     "practical during commands that change the hue.",
            xref: { document: "cluster", section: "3.2.7.1" }
        },

        {
            tag: "attribute", name: "CurrentSaturation", id: 0x1, type: "uint8", access: "R V",
            conformance: "HS", constraint: "0 to 254", quality: "N S P",
            details: "The CurrentSaturation attribute holds the current saturation value of the light. It is updated as " +
                     "fast as practical during commands that change the saturation.",
            xref: { document: "cluster", section: "3.2.7.2" }
        },

        {
            tag: "attribute", name: "RemainingTime", id: 0x2, type: "uint16", access: "R V", conformance: "O",
            constraint: "0 to 65534",
            details: "The RemainingTime attribute holds the time remaining, in 1/10ths of a second, until the currently " +
                     "active command will be complete.",
            xref: { document: "cluster", section: "3.2.7.3" }
        },

        {
            tag: "attribute", name: "CurrentX", id: 0x3, type: "uint16", access: "R V", conformance: "XY",
            constraint: "0", default: 1558, quality: "N S P",
            details: "The CurrentX attribute contains the current value of the normalized chromaticity value x, as " +
                     "defined in the CIE xyY Color Space. It is updated as fast as practical during commands that change " +
                     "the color.",
            xref: { document: "cluster", section: "3.2.7.4" }
        },

        {
            tag: "attribute", name: "CurrentY", id: 0x4, type: "uint16", access: "R V", conformance: "XY",
            constraint: "0", default: 1543, quality: "N S P",
            details: "The CurrentY attribute contains the current value of the normalized chromaticity value y, as " +
                     "defined in the CIE xyY Color Space. It is updated as fast as practical during commands that change " +
                     "the color.",
            xref: { document: "cluster", section: "3.2.7.5" }
        },

        {
            tag: "attribute", name: "DriftCompensation", id: 0x5, type: "enum8", access: "R V",
            conformance: "O", constraint: "0 to 4",
            details: "The DriftCompensation attribute indicates what mechanism, if any, is in use for compensation for " +
                     "color/intensity drift over time. It SHALL be one of the non-reserved values in Values of the " +
                     "DriftCompensation Attribute.",
            xref: { document: "cluster", section: "3.2.7.6" },

            children: [
                { tag: "datatype", name: "None", id: 0x0 },
                { tag: "datatype", name: "OtherUnknown", id: 0x1 },
                { tag: "datatype", name: "TemperatureMonitoring", id: 0x2 },
                { tag: "datatype", name: "OpticalLuminanceMonitoringAndFeedback", id: 0x3 },
                { tag: "datatype", name: "OpticalColorMonitoringAndFeedback", id: 0x4 }
            ]
        },

        {
            tag: "attribute", name: "CompensationText", id: 0x6, type: "string", access: "R V",
            conformance: "O", constraint: "max 254",
            details: "The CompensationText attribute holds a textual indication of what mechanism, if any, is in use to",
            xref: { document: "cluster", section: "3.2.7.7" }
        },

        {
            tag: "attribute", name: "ColorTemperatureMireds", id: 0x7, type: "uint16", access: "R V",
            conformance: "CT", constraint: "0", quality: "N S P",
            details: "The ColorTemperatureMireds attribute contains a scaled inverse of the current value of the color " +
                     "temperature. The unit of ColorTemperatureMireds is the mired (micro reciprocal degree), AKA mirek " +
                     "(micro reciprocal kelvin). It is updated as fast as practical during commands that change the color.",
            xref: { document: "cluster", section: "3.2.7.8" }
        },

        {
            tag: "attribute", name: "ColorMode", id: 0x8, type: "enum8", access: "R V", conformance: "M",
            constraint: "0 to 2", default: 1, quality: "N",
            details: "The ColorMode attribute indicates which attributes are currently determining the color of the " +
                     "device.",
            xref: { document: "cluster", section: "3.2.7.9" },
            children: [
                { tag: "datatype", name: "CurrentHueAndCurrentSaturation", id: 0x0 },
                { tag: "datatype", name: "CurrentXAndCurrentY", id: 0x1 },
                { tag: "datatype", name: "ColorTemperatureMireds", id: 0x2 }
            ]
        },

        {
            tag: "attribute", name: "Options", id: 0xf, type: "map8", access: "RW", conformance: "M",
            constraint: "desc",
            details: "The Options attribute is meant to be changed only during commissioning. The Options attribute is a " +
                     "bitmap that determines the default behavior of some cluster commands. Each command that is " +
                     "dependent on the Options attribute SHALL first construct a temporary Options bitmap that is in " +
                     "effect during the command processing. The temporary Options bitmap has the same format and meaning " +
                     "as the Options attribute, but includes any bits that may be overridden by command fields.",
            xref: { document: "cluster", section: "3.2.7.10" },
            children: [ { tag: "datatype", name: "ExecuteIfOff", id: 0x1, conformance: "M" } ]
        },

        {
            tag: "attribute", name: "EnhancedCurrentHue", id: 0x4000, type: "uint16", access: "R V",
            conformance: "EHUE", quality: "N S",
            details: "The EnhancedCurrentHue attribute represents non-equidistant steps along the CIE 1931 color " +
                     "triangle, and it provides 16-bits precision.",
            xref: { document: "cluster", section: "3.2.7.11" }
        },

        {
            tag: "attribute", name: "EnhancedColorMode", id: 0x4001, type: "enum8", access: "R V",
            conformance: "M", constraint: "0 to 3", default: 1, quality: "N",
            details: "The EnhancedColorMode attribute specifies which attributes are currently determining the color of " +
                     "the device, as detailed in Values of the EnhancedColorMode Attribute.",
            xref: { document: "cluster", section: "3.2.7.12" },

            children: [
                { tag: "datatype", name: "CurrentHueAndCurrentSaturation", id: 0x0 },
                { tag: "datatype", name: "CurrentXAndCurrentY", id: 0x1 },
                { tag: "datatype", name: "ColorTemperatureMireds", id: 0x2 },
                { tag: "datatype", name: "EnhancedCurrentHueAndCurrentSaturation", id: 0x3 }
            ]
        },

        {
            tag: "attribute", name: "ColorLoopActive", id: 0x4002, type: "uint8", access: "R V",
            conformance: "CL", quality: "N S",
            details: "The ColorLoopActive attribute specifies the current active status of the color loop. If this " +
                     "attribute",
            xref: { document: "cluster", section: "3.2.7.13" }
        },

        {
            tag: "attribute", name: "ColorLoopDirection", id: 0x4003, type: "uint8", access: "R V",
            conformance: "CL", quality: "N S",
            details: "The ColorLoopDirection attribute specifies the current direction of the color loop. If this " +
                     "attribute has the value 0, the EnhancedCurrentHue attribute SHALL be decremented. If this attribute " +
                     "has the value 1, the EnhancedCurrentHue attribute SHALL be incremented. All other values (2 to 254) " +
                     "are reserved.",
            xref: { document: "cluster", section: "3.2.7.14" }
        },

        {
            tag: "attribute", name: "ColorLoopTime", id: 0x4004, type: "uint16", access: "R V",
            conformance: "CL", default: 25, quality: "N S",
            details: "The ColorLoopTime attribute specifies the number of seconds it SHALL take to perform a full color " +
                     "loop, i.e., to cycle all values of the EnhancedCurrentHue attribute (between 0 and 0xfffe).",
            xref: { document: "cluster", section: "3.2.7.15" }
        },

        {
            tag: "attribute", name: "ColorLoopStartEnhancedHue", id: 0x4005, type: "uint16", access: "R V",
            conformance: "CL", default: 8960,
            details: "The ColorLoopStartEnhancedHue attribute specifies the value of the EnhancedCurrentHue attribute " +
                     "from which the color loop SHALL be started.",
            xref: { document: "cluster", section: "3.2.7.16" }
        },

        {
            tag: "attribute", name: "ColorLoopStoredEnhancedHue", id: 0x4006, type: "uint16", access: "R V",
            conformance: "CL",
            details: "The ColorLoopStoredEnhancedHue attribute specifies the value of the EnhancedCurrentHue attribute " +
                     "before the color loop was started. Once the color loop is complete, the EnhancedCurrentHue " +
                     "attribute SHALL be restored to this value.",
            xref: { document: "cluster", section: "3.2.7.17" }
        },

        {
            tag: "attribute", name: "ColorCapabilities", id: 0x400a, type: "map16", access: "R V",
            conformance: "M", constraint: "0",
            details: "Bits 0-4 of the ColorCapabilities attribute SHALL have the same values as the corresponding bits of " +
                     "the FeatureMap attribute. All other bits in ColorCapabilities SHALL be 0.",
            xref: { document: "cluster", section: "3.2.7.18" }
        },

        {
            tag: "attribute", name: "ColorTempPhysicalMinMireds", id: 0x400b, type: "uint16", access: "R V",
            conformance: "CT", constraint: "0",
            details: "The ColorTempPhysicalMinMireds attribute indicates the minimum mired value supported by the " +
                     "hardware. ColorTempPhysicalMinMireds corresponds to the maximum color temperature in kelvins " +
                     "supported by the hardware. ColorTempPhysicalMinMireds ≤ ColorTemperatureMireds.",
            xref: { document: "cluster", section: "3.2.7.19" }
        },

        {
            tag: "attribute", name: "ColorTempPhysicalMaxMireds", id: 0x400c, type: "uint16", access: "R V",
            conformance: "CT", constraint: "0", default: 65279,
            details: "The ColorTempPhysicalMaxMireds attribute indicates the maximum mired value supported by the " +
                     "hardware. ColorTempPhysicalMaxMireds corresponds to the minimum color temperature in kelvins " +
                     "supported by the hardware. ColorTemperatureMireds ≤ ColorTempPhysicalMaxMireds.",
            xref: { document: "cluster", section: "3.2.7.20" }
        },

        {
            tag: "attribute", name: "CoupleColorTempToLevelMinMireds", id: 0x400d, type: "uint16",
            access: "R V", conformance: "CT",
            constraint: "ColorTempPhysicalMinMireds to ColorTemperatureMireds",
            details: "The CoupleColorTempToLevelMinMireds attribute specifies a lower bound on the value of the " +
                     "ColorTemperatureMireds attribute for the purposes of coupling the ColorTemperatureMireds attribute " +
                     "to the CurrentLevel attribute when the CoupleColorTempToLevel bit of the Options attribute of the " +
                     "Level Control cluster is equal to 1. When coupling the ColorTemperatureMireds attribute to the " +
                     "CurrentLevel attribute, this value SHALL correspond to a CurrentLevel value of 0xfe (100%).",
            xref: { document: "cluster", section: "3.2.7.21" }
        },

        {
            tag: "attribute", name: "StartUpColorTemperatureMireds", id: 0x4010, type: "uint16",
            access: "RW VM", conformance: "CT", constraint: "0", quality: "X",
            details: "The StartUpColorTemperatureMireds attribute SHALL define the desired startup color temperature " +
                     "value a lamp SHALL use when it is supplied with power and this value SHALL be reflected in the " +
                     "ColorTemperatureMireds attribute. In addition, the ColorMode and EnhancedColorMode attributes SHALL " +
                     "be set to 0x02 (color temperature). The values of the StartUpColorTemperatureMireds attribute are " +
                     "listed in the table below,",
            xref: { document: "cluster", section: "3.2.7.22" }
        },

        {
            tag: "attribute", name: "NumberOfPrimaries", id: 0x10, type: "uint8", access: "R V",
            conformance: "M", constraint: "0 to 6", quality: "X F",
            details: "The NumberOfPrimaries attribute contains the number of color primaries implemented on this device. " +
                     "A value of null SHALL indicate that the number of primaries is unknown.",
            xref: { document: "cluster", section: "3.2.8.1" }
        },

        {
            tag: "attribute", name: "Primary1X", id: 0x11, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 0", constraint: "0", quality: "F",
            details: "The Primary1X attribute contains the normalized chromaticity value x for this primary, as defined " +
                     "in the CIE xyY Color Space.",
            xref: { document: "cluster", section: "3.2.8.2" }
        },

        {
            tag: "attribute", name: "Primary1Y", id: 0x12, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 0", constraint: "0", quality: "F",
            details: "The Primary1Y attribute contains the normalized chromaticity value y for this primary, as defined " +
                     "in the CIE xyY Color Space.",
            xref: { document: "cluster", section: "3.2.8.3" }
        },

        {
            tag: "attribute", name: "Primary1Intensity", id: 0x13, type: "uint8", access: "R V",
            conformance: "NumberOfPrimaries > 0", quality: "X F",
            details: "The Primary1intensity attribute contains a representation of the maximum intensity of this primary " +
                     "as defined in the Dimming Light Curve in the Ballast Configuration cluster (see Ballast " +
                     "Configuration Cluster), normalized such that the primary with the highest maximum intensity " +
                     "contains the value 0xfe.",
            xref: { document: "cluster", section: "3.2.8.4" }
        },

        {
            tag: "attribute", name: "Primary2X", id: 0x15, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 1", constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary2Y", id: 0x16, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 1", constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary2Intensity", id: 0x17, type: "uint8", access: "R V",
            conformance: "NumberOfPrimaries > 1", quality: "X F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary3X", id: 0x19, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 2", constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary3Y", id: 0x1a, type: "uint16", access: "R V",
            conformance: "NumberOfPrimaries > 2", constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary3Intensity", id: 0x1b, type: "uint8", access: "R V",
            conformance: "NumberOfPrimaries > 2", quality: "X F",
            xref: { document: "cluster", section: "3.2.8" }
        },
        {
            tag: "attribute", name: "Primary4X", id: 0x20, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary4Y", id: 0x21, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary4Intensity", id: 0x22, type: "uint8", access: "R V",
            conformance: "M", quality: "X F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary5X", id: 0x24, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary5Y", id: 0x25, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary5Intensity", id: 0x26, type: "uint8", access: "R V",
            conformance: "M", quality: "X F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary6X", id: 0x28, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary6Y", id: 0x29, type: "uint16", access: "R V", conformance: "M",
            constraint: "0", quality: "F",
            xref: { document: "cluster", section: "3.2.9" }
        },
        {
            tag: "attribute", name: "Primary6Intensity", id: 0x2a, type: "uint8", access: "R V",
            conformance: "M", quality: "X F",
            xref: { document: "cluster", section: "3.2.9" }
        },

        {
            tag: "attribute", name: "WhitePointX", id: 0x30, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            details: "The WhitePointX attribute contains the normalized chromaticity value x, as defined in the CIE xyY " +
                     "Color Space, of the current white point of the device.",
            xref: { document: "cluster", section: "3.2.10.1" }
        },

        {
            tag: "attribute", name: "WhitePointY", id: 0x31, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            details: "The WhitePointY attribute contains the normalized chromaticity value y, as defined in the CIE xyY " +
                     "Color Space, of the current white point of the device.",
            xref: { document: "cluster", section: "3.2.10.2" }
        },

        {
            tag: "attribute", name: "ColorPointRx", id: 0x32, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            details: "The ColorPointRX attribute contains the normalized chromaticity value x, as defined in the CIE xyY " +
                     "Color Space, of the red color point of the device.",
            xref: { document: "cluster", section: "3.2.10.3" }
        },

        {
            tag: "attribute", name: "ColorPointRy", id: 0x33, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            details: "The ColorPointRY attribute contains the normalized chromaticity value y, as defined in the CIE xyY " +
                     "Color Space, of the red color point of the device.",
            xref: { document: "cluster", section: "3.2.10.4" }
        },

        {
            tag: "attribute", name: "ColorPointRIntensity", id: 0x34, type: "uint8", access: "RW VM",
            conformance: "O", quality: "X",
            details: "The ColorPointRIntensity attribute contains a representation of the relative intensity of the red " +
                     "color point as defined in the Dimming Light Curve in the Ballast Configuration cluster (see Ballast " +
                     "Configuration Cluster), normalized such that the color point with the highest relative intensity " +
                     "contains the value 0xfe.",
            xref: { document: "cluster", section: "3.2.10.5" }
        },

        {
            tag: "attribute", name: "ColorPointGx", id: 0x36, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            xref: { document: "cluster", section: "3.2.10" }
        },
        {
            tag: "attribute", name: "ColorPointGy", id: 0x37, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            xref: { document: "cluster", section: "3.2.10" }
        },
        {
            tag: "attribute", name: "ColorPointGIntensity", id: 0x38, type: "uint8", access: "RW VM",
            conformance: "O", quality: "X",
            xref: { document: "cluster", section: "3.2.10" }
        },
        {
            tag: "attribute", name: "ColorPointBx", id: 0x3a, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            xref: { document: "cluster", section: "3.2.10" }
        },
        {
            tag: "attribute", name: "ColorPointBy", id: 0x3b, type: "uint16", access: "RW VM", conformance: "O",
            constraint: "0",
            xref: { document: "cluster", section: "3.2.10" }
        },
        {
            tag: "attribute", name: "ColorPointBIntensity", id: 0x3c, type: "uint8", access: "RW VM",
            conformance: "O", quality: "X",
            xref: { document: "cluster", section: "3.2.10" }
        },

        {
            tag: "command", name: "MoveToHue", id: 0x0, access: "O", conformance: "HS", direction: "request",
            response: "status",
            details: "The MoveToHue command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.4" },

            children: [
                {
                    tag: "datatype", name: "Hue", id: 0x0, type: "uint8", conformance: "M", constraint: "0 to 254",
                    details: "The Hue field specifies the hue to be moved to.",
                    xref: { document: "cluster", section: "3.2.11.4.1" }
                },

                {
                    tag: "datatype", name: "Direction", id: 0x1, type: "Direction", conformance: "M",
                    constraint: "desc",
                    details: "The Direction field SHALL be one of the non-reserved values in Values of the Direction Field.",
                    xref: { document: "cluster", section: "3.2.11.4.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "The TransitionTime field specifies, in 1/10ths of a second, the time that SHALL be taken to move to " +
                             "the new hue.",
                    xref: { document: "cluster", section: "3.2.11.4.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveHue", id: 0x1, access: "O", conformance: "HS", direction: "request",
            response: "status",
            details: "The MoveHue command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.5" },

            children: [
                {
                    tag: "datatype", name: "MoveMode", id: 0x0, type: "MoveMode", conformance: "M", constraint: "desc",
                    details: "The MoveMode field SHALL be one of the non-reserved values in Values of the MoveMode Field. If the " +
                             "MoveMode field is equal to 0 (Stop), the Rate field SHALL be ignored.",
                    xref: { document: "cluster", section: "3.2.11.5.1" }
                },

                {
                    tag: "datatype", name: "Rate", id: 0x1, type: "uint8", conformance: "M",
                    details: "The Rate field specifies the rate of movement in steps per second. A step is a change in the " +
                             "device’s hue of one unit. If the MoveMode field is set to 1 (up) or 3 (down) and the Rate field has " +
                             "a value of zero, the command has no effect and a response command SHALL be sent in response, with " +
                             "the status code set to INVALID_COMMAND. If the MoveMode field is set to 0 (stop) the Rate field " +
                             "SHALL be ignored.",
                    xref: { document: "cluster", section: "3.2.11.5.2" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "StepHue", id: 0x2, access: "O", conformance: "HS", direction: "request",
            response: "status",
            details: "The StepHue command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.6" },

            children: [
                {
                    tag: "datatype", name: "StepMode", id: 0x0, type: "StepMode", conformance: "M", constraint: "desc",
                    details: "The StepMode field SHALL be one of the non-reserved values in Values of the StepMode Field.",
                    xref: { document: "cluster", section: "3.2.11.6.1" }
                },
                {
                    tag: "datatype", name: "StepSize", id: 0x1, type: "uint8", conformance: "M",
                    details: "The change to be added to (or subtracted from) the current value of the device’s hue.",
                    xref: { document: "cluster", section: "3.2.11.6.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint8", conformance: "M",
                    details: "The TransitionTime field specifies, in 1/10ths of a second, the time that SHALL be taken to perform " +
                             "the step. A step is a change in the device’s hue of ‘Step size’ units.",
                    xref: { document: "cluster", section: "3.2.11.6.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveToSaturation", id: 0x3, access: "O", conformance: "HS",
            direction: "request", response: "status",
            details: "The MoveToSaturation command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.7" },

            children: [
                {
                    tag: "datatype", name: "Saturation", id: 0x0, type: "uint8", conformance: "M",
                    constraint: "0 to 254"
                },
                {
                    tag: "datatype", name: "TransitionTime", id: 0x1, type: "uint16", conformance: "M",
                    constraint: "0 to 65534"
                },
                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveSaturation", id: 0x4, access: "O", conformance: "HS",
            direction: "request", response: "status",
            details: "The MoveSaturation command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.8" },

            children: [
                {
                    tag: "datatype", name: "MoveMode", id: 0x0, type: "MoveMode", conformance: "M", constraint: "desc",
                    details: "The MoveMode field SHALL be one of the non-reserved values in Values of the MoveMode Field. If the " +
                             "MoveMode field is equal to 0 (Stop), the Rate field SHALL be ignored.",
                    xref: { document: "cluster", section: "3.2.11.8.1" }
                },

                {
                    tag: "datatype", name: "Rate", id: 0x1, type: "uint8", conformance: "M",
                    details: "The Rate field specifies the rate of movement in steps per second. A step is a change in the " +
                             "device’s",
                    xref: { document: "cluster", section: "3.2.11.8.2" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "StepSaturation", id: 0x5, access: "O", conformance: "HS",
            direction: "request", response: "status",
            details: "The StepSaturation command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.9" },

            children: [
                {
                    tag: "datatype", name: "StepMode", id: 0x0, type: "StepMode", conformance: "M", constraint: "desc",
                    details: "The StepMode field SHALL be one of the non-reserved values in Values of the StepMode Field.",
                    xref: { document: "cluster", section: "3.2.11.9.1" }
                },
                {
                    tag: "datatype", name: "StepSize", id: 0x1, type: "uint8", conformance: "M",
                    details: "The change to be added to (or subtracted from) the current value of the device’s saturation.",
                    xref: { document: "cluster", section: "3.2.11.9.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint8", conformance: "M",
                    details: "The TransitionTime field specifies, in 1/10ths of a second, the time that SHALL be taken to perform " +
                             "the step. A step is a change in the device’s saturation of ‘Step size’ units.",
                    xref: { document: "cluster", section: "3.2.11.9.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveToHueAndSaturation", id: 0x6, access: "O", conformance: "HS",
            direction: "request", response: "status",
            details: "The MoveToHueAndSaturation command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.10" },

            children: [
                { tag: "datatype", name: "Hue", id: 0x0, type: "uint8", conformance: "M", constraint: "0 to 254" },
                {
                    tag: "datatype", name: "Saturation", id: 0x1, type: "uint8", conformance: "M",
                    constraint: "0 to 254"
                },
                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534"
                },
                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveToColor", id: 0x7, access: "O", conformance: "XY", direction: "request",
            response: "status",
            details: "The MoveToColor command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.11" },

            children: [
                { tag: "datatype", name: "ColorX", id: 0x0, type: "uint16", conformance: "M", constraint: "0" },
                { tag: "datatype", name: "ColorY", id: 0x1, type: "uint16", conformance: "M", constraint: "0" },
                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534"
                },
                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveColor", id: 0x8, access: "O", conformance: "XY", direction: "request",
            response: "status",
            details: "The MoveColor command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.12" },

            children: [
                {
                    tag: "datatype", name: "RateX", id: 0x0, type: "int16", conformance: "M",
                    details: "The RateX field specifies the rate of movement in steps per second. A step is a change in the " +
                             "device’s CurrentX attribute of one unit.",
                    xref: { document: "cluster", section: "3.2.11.12.1" }
                },

                {
                    tag: "datatype", name: "RateY", id: 0x1, type: "int16", conformance: "M",
                    details: "The RateY field specifies the rate of movement in steps per second. A step is a change in the " +
                             "device’s CurrentY attribute of one unit.",
                    xref: { document: "cluster", section: "3.2.11.12.2" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "StepColor", id: 0x9, access: "O", conformance: "XY", direction: "request",
            response: "status",
            details: "The StepColor command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.13" },

            children: [
                { tag: "datatype", name: "StepX", id: 0x0, type: "int16", conformance: "M" },
                { tag: "datatype", name: "StepY", id: 0x1, type: "int16", conformance: "M" },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "The TransitionTime field specifies, in 1/10ths of a second, the time that SHALL be taken to perform " +
                             "the color change.",
                    xref: { document: "cluster", section: "3.2.11.13.2" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveToColorTemperature", id: 0xa, access: "O", conformance: "CT",
            direction: "request", response: "status",
            details: "The MoveToColorTemperature command SHALL have the following data fields:",
            xref: { document: "cluster", section: "3.2.11.14" },

            children: [
                {
                    tag: "datatype", name: "ColorTemperatureMireds", id: 0x0, type: "uint16", conformance: "M",
                    constraint: "0"
                },
                {
                    tag: "datatype", name: "TransitionTime", id: 0x1, type: "uint16", conformance: "M",
                    constraint: "0 to 65534"
                },
                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "EnhancedMoveToHue", id: 0x40, access: "O", conformance: "EHUE",
            direction: "request", response: "status",
            details: "The EnhancedMoveToHue command allows lamps to be moved in a smooth continuous transition from their " +
                     "current hue to a target hue.",
            xref: { document: "cluster", section: "3.2.11.15" },

            children: [
                {
                    tag: "datatype", name: "EnhancedHue", id: 0x0, type: "uint16", conformance: "M",
                    details: "The EnhancedHue field specifies the target extended hue for the lamp.",
                    xref: { document: "cluster", section: "3.2.11.15.1" }
                },

                {
                    tag: "datatype", name: "Direction", id: 0x1, type: "Direction", conformance: "M",
                    constraint: "desc",
                    details: "This field is identical to the Direction field of the MoveToHue command of the Color Control " +
                             "cluster (see sub-clause Use of the OptionsMask and OptionsOverride fields).",
                    xref: { document: "cluster", section: "3.2.11.15.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "This field is identical to the TransitionTime field of the MoveToHue command of the Color Control " +
                             "cluster (see sub-clause Use of the OptionsMask and OptionsOverride fields).",
                    xref: { document: "cluster", section: "3.2.11.15.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "EnhancedMoveHue", id: 0x41, access: "O", conformance: "EHUE",
            direction: "request", response: "status",
            details: "The EnhancedMoveHue command allows lamps to be moved in a continuous stepped transition from their " +
                     "current hue to a target hue.",
            xref: { document: "cluster", section: "3.2.11.16" },

            children: [
                {
                    tag: "datatype", name: "MoveMode", id: 0x0, type: "MoveMode", conformance: "M", constraint: "desc",
                    details: "This field is identical to the MoveMode field of the MoveHue command of the Color Control cluster " +
                             "(see sub-clause MoveHue Command). If the MoveMode field is equal to 0 (Stop), the Rate field SHALL " +
                             "be ignored.",
                    xref: { document: "cluster", section: "3.2.11.16.1" }
                },

                {
                    tag: "datatype", name: "Rate", id: 0x1, type: "uint16", conformance: "M",
                    details: "The Rate field specifies the rate of movement in steps per second. A step is a change in the " +
                             "extended hue of a device by one unit. If the MoveMode field is set to 1 (up) or 3 (down) and the " +
                             "Rate field has a value of zero, the command has no effect and a response command SHALL be sent in " +
                             "response, with the status code set to INVALID_COMMAND. If the MoveMode field is set to 0 (stop) the " +
                             "Rate field SHALL be ignored.",
                    xref: { document: "cluster", section: "3.2.11.16.2" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x2, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x3, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "EnhancedStepHue", id: 0x42, access: "O", conformance: "EHUE",
            direction: "request", response: "status",
            details: "The EnhancedStepHue command allows lamps to be moved in a stepped transition from their current hue " +
                     "to a target hue, resulting in a linear transition through XY space.",
            xref: { document: "cluster", section: "3.2.11.17" },

            children: [
                {
                    tag: "datatype", name: "StepMode", id: 0x0, type: "StepMode", conformance: "M", constraint: "desc",
                    details: "This field is identical to the StepMode field of the StepHue command of the Color Control cluster " +
                             "(see sub-clause StepHue Command).",
                    xref: { document: "cluster", section: "3.2.11.17.1" }
                },

                {
                    tag: "datatype", name: "StepSize", id: 0x1, type: "uint16", conformance: "M",
                    details: "The StepSize field specifies the change to be added to (or subtracted from) the current value of " +
                             "the device’s enhanced hue.",
                    xref: { document: "cluster", section: "3.2.11.17.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "The TransitionTime field specifies, in units of 1/10ths of a second, the time that SHALL be taken " +
                             "to perform the step. A step is a change to the device’s enhanced hue of a magnitude corresponding " +
                             "to the StepSize field.",
                    xref: { document: "cluster", section: "3.2.11.17.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "EnhancedMoveToHueAndSaturation", id: 0x43, access: "O", conformance: "EHUE",
            direction: "request", response: "status",
            details: "The EnhancedMoveToHueAndSaturation command allows lamps to be moved in a smooth continuous " +
                     "transition from their current hue to a target hue and from their current saturation to a target " +
                     "saturation.",
            xref: { document: "cluster", section: "3.2.11.18" },

            children: [
                {
                    tag: "datatype", name: "EnhancedHue", id: 0x0, type: "uint16", conformance: "M",
                    details: "The EnhancedHue field specifies the target extended hue for the lamp.",
                    xref: { document: "cluster", section: "3.2.11.18.1" }
                },

                {
                    tag: "datatype", name: "Saturation", id: 0x1, type: "uint8", conformance: "M",
                    constraint: "0 to 254",
                    details: "This field is identical to the Saturation field of the MoveToHueAndSaturation command of the Color " +
                             "Control cluster (see sub-clause MoveToHueAndSaturation Command).",
                    xref: { document: "cluster", section: "3.2.11.18.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "This field is identical to the TransitionTime field of the MoveToHue command of the Color Control " +
                             "cluster (see sub-clause MoveToHueAndSaturation Command).",
                    xref: { document: "cluster", section: "3.2.11.18.3" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x3, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x4, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "ColorLoopSet", id: 0x44, access: "O", conformance: "CL",
            direction: "request", response: "status",
            details: "The Color Loop Set command allows a color loop to be activated such that the color lamp cycles " +
                     "through its range of hues.",
            xref: { document: "cluster", section: "3.2.11.19" },

            children: [
                {
                    tag: "datatype", name: "UpdateFlags", id: 0x0, type: "map8", conformance: "M", constraint: "desc",
                    details: "The UpdateFlags field specifies which color loop attributes to update before the color loop is " +
                             "started. This field SHALL be formatted as illustrated in Format of the UpdateFlags Field of the " +
                             "ColorLoopSet Command.",
                    xref: { document: "cluster", section: "3.2.11.19.1" },

                    children: [
                        { tag: "datatype", name: "UpdateAction", id: 0x0 },
                        { tag: "datatype", name: "UpdateDirection", id: 0x1 },
                        { tag: "datatype", name: "UpdateTime", id: 0x2 },
                        { tag: "datatype", name: "UpdateStartHue", id: 0x3 },
                        { tag: "datatype", name: "Reserved", id: 0x4 }
                    ]
                },

                {
                    tag: "datatype", name: "Action", id: 0x1, type: "enum8", conformance: "M", constraint: "desc",
                    details: "The Action field specifies the action to take for the color loop if the UpdateAction sub-field of " +
                             "the UpdateFlags field is set to 1. This field SHALL be set to one of the non-reserved values listed " +
                             "in Values of the Action Field of the ColorLoopSet Command.",
                    xref: { document: "cluster", section: "3.2.11.19.2" },

                    children: [
                        { tag: "datatype", name: "DeActivateTheColorLoop", id: 0x0 },
                        {
                            tag: "datatype", name: "ActivateTheColorLoopFromTheValueInTheColorLoopStartEnhancedHueField",
                            id: 0x1
                        },
                        { tag: "datatype", name: "ActivateTheColorLoopFromTheValueOfTheEnhancedCurrentHueAttribute", id: 0x2 }
                    ]
                },

                {
                    tag: "datatype", name: "Direction", id: 0x2, type: "enum8", conformance: "M", constraint: "desc",
                    details: "The Direction field specifies the direction for the color loop if the Update Direction field of the " +
                             "UpdateFlags field is set to 1. This field SHALL be set to one of the non-reserved values listed in " +
                             "Values of the Direction Field of the ColorLoopSet Command.",
                    xref: { document: "cluster", section: "3.2.11.19.3" },
                    children: [
                        { tag: "datatype", name: "DecrementTheHueInTheColorLoop", id: 0x0 },
                        { tag: "datatype", name: "IncrementTheHueInTheColorLoop", id: 0x1 }
                    ]
                },

                {
                    tag: "datatype", name: "Time", id: 0x3, type: "uint16", conformance: "M",
                    details: "The Time field specifies the number of seconds over which to perform a full color loop if the " +
                             "UpdateTime sub-field of the UpdateFlags field is set to 1.",
                    xref: { document: "cluster", section: "3.2.11.19.4" }
                },

                { tag: "datatype", name: "StartHue", id: 0x4, type: "uint16", conformance: "M" },
                { tag: "datatype", name: "OptionsMask", id: 0x5, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x6, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "StopMoveStep", id: 0x47, access: "O", conformance: "HS | XY",
            direction: "request", response: "status",
            details: "The StopMoveStep command is provided to allow MoveTo and Step commands to be stopped. (Note this " +
                     "automatically provides symmetry to the Level Control cluster.)",
            xref: { document: "cluster", section: "3.2.11.20" },

            children: [
                { tag: "datatype", name: "OptionsMask", id: 0x0, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x1, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "MoveColorTemperature", id: 0x4b, access: "O", conformance: "CT",
            direction: "request", response: "status",
            details: "The MoveColorTemperature command allows the color temperature of a lamp to be moved at a specified " +
                     "rate.",
            xref: { document: "cluster", section: "3.2.11.21" },

            children: [
                {
                    tag: "datatype", name: "MoveMode", id: 0x0, type: "map8", conformance: "M", constraint: "desc",
                    details: "This field is identical to the MoveMode field of the MoveHue command of the Color Control cluster",
                    xref: { document: "cluster", section: "3.2.11.21.1" }
                },

                {
                    tag: "datatype", name: "Rate", id: 0x1, type: "uint16", conformance: "M",
                    details: "The Rate field specifies the rate of movement in steps per second. A step is a change in the color " +
                             "temperature of a device by one unit. If the MoveMode field is set to 1 (up) or 3 (down) and the " +
                             "Rate field has a value of zero, the command has no effect and a response command SHALL be sent in " +
                             "response, with the status code set to INVALID_COMMAND. If the MoveMode field is set to 0 (stop) the " +
                             "Rate field SHALL be ignored.",
                    xref: { document: "cluster", section: "3.2.11.21.2" }
                },

                {
                    tag: "datatype", name: "ColorTemperatureMinimumMireds", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0",
                    details: "The ColorTemperatureMinimumMireds field specifies a lower bound on the ColorTemperatureMireds " +
                             "attribute (≡ an upper bound on the color temperature in kelvins) for the current move operation " +
                             "such that:",
                    xref: { document: "cluster", section: "3.2.11.21.3" }
                },

                {
                    tag: "datatype", name: "ColorTemperatureMaximumMireds", id: 0x3, type: "uint16", conformance: "M",
                    constraint: "0",
                    details: "The ColorTemperatureMaximumMireds field specifies an upper bound on the ColorTemperatureMireds " +
                             "attribute (≡ a lower bound on the color temperature in kelvins) for the current move operation such " +
                             "that:",
                    xref: { document: "cluster", section: "3.2.11.21.4" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x4, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x5, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "command", name: "StepColorTemperature", id: 0x4c, access: "O", conformance: "CT",
            direction: "request", response: "status",
            details: "The StepColorTemperature command allows the color temperature of a lamp to be stepped with a " +
                     "specified step size.",
            xref: { document: "cluster", section: "3.2.11.22" },

            children: [
                {
                    tag: "datatype", name: "StepMode", id: 0x0, type: "map8", conformance: "M", constraint: "desc",
                    details: "This field is identical to the StepMode field of the StepHue command of the Color Control cluster " +
                             "(see sub-clause StepHue Command).",
                    xref: { document: "cluster", section: "3.2.11.22.1" }
                },

                {
                    tag: "datatype", name: "StepSize", id: 0x1, type: "uint16", conformance: "M",
                    details: "The StepSize field specifies the change to be added to (or subtracted from) the current value of " +
                             "the device’s color temperature.",
                    xref: { document: "cluster", section: "3.2.11.22.2" }
                },

                {
                    tag: "datatype", name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M",
                    constraint: "0 to 65534",
                    details: "The TransitionTime field specifies, in units of 1/10ths of a second, the time that SHALL be taken " +
                             "to perform the step. A step is a change to the device’s color temperature of a magnitude " +
                             "corresponding to the StepSize field.",
                    xref: { document: "cluster", section: "3.2.11.22.3" }
                },

                {
                    tag: "datatype", name: "ColorTemperatureMinimumMireds", id: 0x3, type: "uint16", conformance: "M",
                    constraint: "0",
                    details: "The ColorTemperatureMinimumMireds field specifies a lower bound on the ColorTemperatureMireds " +
                             "attribute (≡ an upper bound on the color temperature in kelvins) for the current step operation " +
                             "such that:",
                    xref: { document: "cluster", section: "3.2.11.22.4" }
                },

                {
                    tag: "datatype", name: "ColorTemperatureMaximumMireds", id: 0x4, type: "uint16", conformance: "M",
                    constraint: "0",
                    details: "The ColorTemperatureMaximumMireds field specifies an upper bound on the ColorTemperatureMireds " +
                             "attribute (≡ a lower bound on the color temperature in kelvins) for the current step operation such " +
                             "that:",
                    xref: { document: "cluster", section: "3.2.11.22.5" }
                },

                { tag: "datatype", name: "OptionsMask", id: 0x5, type: "map8", conformance: "M", constraint: "desc" },
                {
                    tag: "datatype", name: "OptionsOverride", id: 0x6, type: "map8", conformance: "M",
                    constraint: "desc"
                }
            ]
        },

        {
            tag: "datatype", name: "MoveMode", type: "enum8", conformance: "M",
            xref: { document: "cluster", section: "3.2.11.5.1" },
            children: [
                { tag: "datatype", name: "Stop", id: 0x0, conformance: "M" },
                { tag: "datatype", name: "Up", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Down", id: 0x3, conformance: "M" }
            ]
        },

        {
            tag: "datatype", name: "StepMode", type: "enum8", conformance: "M",
            xref: { document: "cluster", section: "3.2.11.6.1" },
            children: [
                { tag: "datatype", name: "Up", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Down", id: 0x3, conformance: "M" }
            ]
        },

        {
            tag: "datatype", name: "Direction", type: "enum8", conformance: "M",
            xref: { document: "cluster", section: "3.2.11.4.2" },

            children: [
                { tag: "datatype", name: "ShortestDistance", id: 0x0, conformance: "M" },
                { tag: "datatype", name: "LongestDistance", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Up", id: 0x2, conformance: "M" },
                { tag: "datatype", name: "Down", id: 0x3, conformance: "M" }
            ]
        },

        {
            tag: "datatype", name: "HueMoveMode", type: "enum8", conformance: "M",
            children: [
                { tag: "datatype", name: "Stop", id: 0x0, conformance: "M" },
                { tag: "datatype", name: "Up", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Down", id: 0x3, conformance: "M" }
            ]
        },

        {
            tag: "datatype", name: "HueStepMode", type: "enum8", conformance: "M",
            children: [
                { tag: "datatype", name: "Up", id: 0x1, conformance: "M" },
                { tag: "datatype", name: "Down", id: 0x3, conformance: "M" }
            ]
        }
    ]
});