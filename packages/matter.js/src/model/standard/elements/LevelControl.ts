/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";
import {
    ClusterElement as Cluster,
    AttributeElement as Attribute,
    FieldElement as Field,
    CommandElement as Command,
    DatatypeElement as Datatype
} from "../../elements/index.js";

Matter.children.push(Cluster({
    name: "LevelControl", id: 0x8, classification: "application", description: "Level Control",
    details: "This cluster provides an interface for controlling a characteristic of a device that can be set to " +
        "a level, for example the brightness of a light, the degree of closure of a door, or the power " +
        "output of a heater.",
    xref: { document: "cluster", section: "1.6" },

    children: [
        Attribute({ name: "ClusterRevision", id: 0xfffd, type: "ClusterRevision", default: 5 }),

        Attribute({
            name: "FeatureMap", id: 0xfffc, type: "FeatureMap",
            xref: { document: "cluster", section: "1.6.4" },

            children: [
                Field({
                    name: "OO", constraint: "0", default: "1", description: "OnOff",
                    details: "Dependency with the On/Off cluster",
                    xref: { document: "cluster", section: "1.6.4" }
                }),
                Field({
                    name: "LT", constraint: "1", default: "0", description: "Lighting",
                    details: "Behavior that supports lighting applications",
                    xref: { document: "cluster", section: "1.6.4" }
                }),

                Field({
                    name: "FQ", constraint: "2", default: "0", description: "Frequency",
                    details: "Supports frequency attributes and behavior. The Pulse Width Modulation cluster was created for " +
                        "frequency control.",
                    xref: { document: "cluster", section: "1.6.4" }
                })
            ]
        }),

        Attribute({
            name: "CurrentLevel", id: 0x0, type: "uint8", access: "R V", conformance: "M",
            constraint: "MinLevel to MaxLevel", default: null, quality: "X N S",
            details: "The CurrentLevel attribute represents the current level of this device. The meaning of 'level' is " +
                "device dependent.",
            xref: { document: "cluster", section: "1.6.5.1" }
        }),

        Attribute({
            name: "RemainingTime", id: 0x1, type: "uint16", access: "R V", conformance: "LT", default: 0,
            details: "The RemainingTime attribute represents the time remaining until the current command is complete - " +
                "it is specified in 1/10ths of a second.",
            xref: { document: "cluster", section: "1.6.5.2" }
        }),

        Attribute({
            name: "MinLevel", id: 0x2, type: "uint8", access: "R V", conformance: "O", default: 0,
            details: "The MinLevel attribute indicates the minimum value of CurrentLevel that is capable of being " +
                "assigned.",
            xref: { document: "cluster", section: "1.6.5.3" }
        }),

        Attribute({
            name: "MaxLevel", id: 0x3, type: "uint8", access: "R V", conformance: "O",
            constraint: "MinLevel to 254", default: 254,
            details: "The MaxLevel attribute indicates the maximum value of CurrentLevel that is capable of being " +
                "assigned.",
            xref: { document: "cluster", section: "1.6.5.4" }
        }),

        Attribute({
            name: "CurrentFrequency", id: 0x4, type: "uint16", access: "R V", conformance: "FQ",
            constraint: "MinFrequency to MaxFrequency", default: 0, quality: "S P",
            details: "The CurrentFrequency attribute represents the frequency at which the device is at CurrentLevel. A " +
                "CurrentFrequency of 0 is unknown.",
            xref: { document: "cluster", section: "1.6.5.5" }
        }),

        Attribute({
            name: "MinFrequency", id: 0x5, type: "uint16", access: "R V", conformance: "FQ",
            constraint: "0 to MaxFrequency", default: 0,
            details: "The MinFrequency attribute indicates the minimum value of CurrentFrequency that is capable of being " +
                "assigned. MinFrequency shall be less than or equal to MaxFrequency. A value of 0 indicates " +
                "undefined.",
            xref: { document: "cluster", section: "1.6.5.6" }
        }),

        Attribute({
            name: "MaxFrequency", id: 0x6, type: "uint16", access: "R V", conformance: "FQ",
            constraint: "min MinFrequency", default: 0,
            details: "The MaxFrequency attribute indicates the maximum value of CurrentFrequency that is capable of being " +
                "assigned. MaxFrequency shall be greater than or equal to MinFrequency. A value of 0 indicates " +
                "undefined.",
            xref: { document: "cluster", section: "1.6.5.7" }
        }),

        Attribute({
            name: "OnOffTransitionTime", id: 0x10, type: "uint16", access: "RW VO", conformance: "O",
            default: 0,

            details: "The OnOffTransitionTime attribute represents the time taken to move to or from the target level " +
                "when On or Off commands are received by an On/Off cluster on the same endpoint. It is specified in " +
                "1/10ths of a second." +
                "\n" +
                "The actual time taken SHOULD be as close to OnOffTransitionTime as the device is able. Please note " +
                "that if the device is not able to move at a variable rate, the OnOffTransitionTime attribute SHOULD " +
                "NOT be implemented.",

            xref: { document: "cluster", section: "1.6.5.9" }
        }),

        Attribute({
            name: "OnLevel", id: 0x11, type: "uint8", access: "RW VO", conformance: "M",
            constraint: "MinLevel to MaxLevel", default: null, quality: "X",
            details: "The OnLevel attribute determines the value that the CurrentLevel attribute is set to when the OnOff " +
                "attribute of an On/Off cluster on the same endpoint is set to TRUE, as a result of processing an " +
                "On/Off cluster command. If the OnLevel attribute is not implemented, or is set to the null value, " +
                "it has no effect. For more details see Effect of On/Off Commands on the CurrentLevel Attribute.",
            xref: { document: "cluster", section: "1.6.5.10" }
        }),

        Attribute({
            name: "OnTransitionTime", id: 0x12, type: "uint16", access: "RW VO", conformance: "O",
            default: null, quality: "X",
            details: "The OnTransitionTime attribute represents the time taken to move the current level from the minimum " +
                "level to the maximum level when an On command is received by an On/Off cluster on the same " +
                "endpoint. It is specified in 10ths of a second. If this attribute is not implemented, or contains a " +
                "null value, the OnOffTransitionTime will be used instead.",
            xref: { document: "cluster", section: "1.6.5.11" }
        }),

        Attribute({
            name: "OffTransitionTime", id: 0x13, type: "uint16", access: "RW VO", conformance: "O",
            default: null, quality: "X",
            details: "The OffTransitionTime attribute represents the time taken to move the current level from the " +
                "maximum level to the minimum level when an Off command is received by an On/Off cluster on the same " +
                "endpoint. It is specified in 10ths of a second. If this attribute is not implemented, or contains a " +
                "null value, the OnOffTransitionTime will be used instead.",
            xref: { document: "cluster", section: "1.6.5.12" }
        }),

        Attribute({
            name: "DefaultMoveRate", id: 0x14, type: "uint8", access: "RW VO", conformance: "O", quality: "X",
            details: "The DefaultMoveRate attribute determines the movement rate, in units per second, when a Move " +
                "command is received with a null value Rate parameter.",
            xref: { document: "cluster", section: "1.6.5.13" }
        }),

        Attribute({
            name: "Options", id: 0xf, type: "map8", access: "RW VO", conformance: "M", constraint: "desc",
            default: 0,

            details: "The Options attribute is meant to be changed only during commissioning. The Options attribute is a " +
                "bitmap that determines the default behavior of some cluster commands. Each command that is " +
                "dependent on the Options attribute shall first construct a temporary Options bitmap that is in " +
                "effect during the command processing. The temporary Options bitmap has the same format and meaning " +
                "as the Options attribute, but includes any bits that may be overridden by command fields." +
                "\n" +
                "Below is the format and description of the Options attribute and temporary Options bitmap and the " +
                "effect on dependent commands." +
                "\n" +
                "Table 19. Options Attribute",

            xref: { document: "cluster", section: "1.6.5.8" },

            children: [
                Field({ name: "ExecuteIfOff", constraint: "0", xref: { document: "cluster", section: "1.6.5.8" } }),
                Field({
                    name: "CoupleColorTempToLevel", constraint: "1",
                    xref: { document: "cluster", section: "1.6.5.8" }
                })
            ]
        }),

        Attribute({
            name: "StartUpCurrentLevel", id: 0x4000, type: "uint8", access: "RW VM", conformance: "LT",
            constraint: "desc", quality: "X N",

            details: "The StartUpCurrentLevel attribute shall define the desired startup level for a device when it is " +
                "supplied with power and this level shall be reflected in the CurrentLevel attribute. The values of " +
                "the StartUpCurrentLevel attribute are listed below:" +
                "\n" +
                "Table 20. Values of the StartUpCurrentLevel attribute" +
                "\n" +
                "This behavior does not apply to reboots associated with OTA. After an OTA restart, the CurrentLevel " +
                "attribute shall return to its value prior to the restart.",

            xref: { document: "cluster", section: "1.6.5.14" }
        }),

        Command({
            name: "MoveToLevel", id: 0x0, access: "O", conformance: "M", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6.1" },

            children: [
                Field({
                    name: "Level", id: 0x0, type: "uint8", conformance: "M", constraint: "0 to 254",
                    xref: { document: "cluster", section: "1.6.6.1" }
                }),
                Field({
                    name: "TransitionTime", id: 0x1, type: "uint16", conformance: "M", quality: "X",
                    xref: { document: "cluster", section: "1.6.6.1" }
                }),
                Field({
                    name: "OptionsMask", id: 0x2, type: "Options", conformance: "M", constraint: "desc", default: "0",
                    xref: { document: "cluster", section: "1.6.6.1" }
                }),
                Field({
                    name: "OptionsOverride", id: 0x3, type: "Options", conformance: "M", constraint: "desc",
                    default: "0",
                    xref: { document: "cluster", section: "1.6.6.1" }
                })
            ]
        }),

        Command({
            name: "Move", id: 0x1, access: "O", conformance: "M", direction: "request", response: "status",
            xref: { document: "cluster", section: "1.6.6.2" },

            children: [
                Field({
                    name: "MoveMode", id: 0x0, type: "MoveMode", conformance: "M", constraint: "desc",
                    details: "The MoveMode field shall be one of the non-reserved values in Values of the MoveMode Field.",
                    xref: { document: "cluster", section: "1.6.6.2.1" }
                }),

                Field({
                    name: "Rate", id: 0x1, type: "uint8", conformance: "M", quality: "X",

                    details: "The Rate field specifies the rate of movement in units per second. The actual rate of movement " +
                        "SHOULD be as close to this rate as the device is able. If the Rate field is equal to null, then the " +
                        "value in DefaultMoveRate attribute shall be used. However, if the Rate field is equal to null and " +
                        "the DefaultMoveRate attribute is not supported, or if the Rate field is equal to null and the value " +
                        "of the DefaultMoveRate attribute is equal to null, then the device SHOULD move as fast as it is " +
                        "able. If the device is not able to move at a variable rate, this field may be disregarded.",

                    xref: { document: "cluster", section: "1.6.6.2.2" }
                }),

                Field({
                    name: "OptionsMask", id: 0x2, type: "Options", conformance: "M", constraint: "desc", default: "0",
                    xref: { document: "cluster", section: "1.6.6.2" }
                }),
                Field({
                    name: "OptionsOverride", id: 0x3, type: "Options", conformance: "M", constraint: "desc",
                    default: "0",
                    xref: { document: "cluster", section: "1.6.6.2" }
                })
            ]
        }),

        Command({
            name: "Step", id: 0x2, access: "O", conformance: "M", direction: "request", response: "status",

            details: "The StepMode field shall be one of the non-reserved values in Values of the StepMode Field." +
                "\n" +
                "The TransitionTime field specifies the time that shall be taken to perform the step, in tenths of a " +
                "second. A step is a change in the CurrentLevel of StepSize units. The actual time taken SHOULD be " +
                "as close to this as the device is able. If the TransitionTime field is equal to null, the device " +
                "SHOULD move as fast as it is able." +
                "\n" +
                "If the device is not able to move at a variable rate, the TransitionTime field may be disregarded.",

            xref: { document: "cluster", section: "1.6.6.3" },

            children: [
                Field({
                    name: "StepMode", id: 0x0, type: "StepMode", conformance: "M", constraint: "desc",
                    xref: { document: "cluster", section: "1.6.6.3" }
                }),
                Field({
                    name: "StepSize", id: 0x1, type: "uint8", conformance: "M",
                    xref: { document: "cluster", section: "1.6.6.3" }
                }),
                Field({
                    name: "TransitionTime", id: 0x2, type: "uint16", conformance: "M", quality: "X",
                    xref: { document: "cluster", section: "1.6.6.3" }
                }),
                Field({
                    name: "OptionsMask", id: 0x3, type: "Options", conformance: "M", constraint: "desc", default: "0",
                    xref: { document: "cluster", section: "1.6.6.3" }
                }),
                Field({
                    name: "OptionsOverride", id: 0x4, type: "Options", conformance: "M", constraint: "desc",
                    default: "0",
                    xref: { document: "cluster", section: "1.6.6.3" }
                })
            ]
        }),

        Command({
            name: "Stop", id: 0x3, access: "O", conformance: "M", direction: "request", response: "status",
            xref: { document: "cluster", section: "1.6.6.4" },

            children: [
                Field({
                    name: "OptionsMask", id: 0x0, type: "Options", conformance: "M", constraint: "desc", default: "0",
                    xref: { document: "cluster", section: "1.6.6.4" }
                }),
                Field({
                    name: "OptionsOverride", id: 0x1, type: "Options", conformance: "M", constraint: "desc",
                    default: "0",
                    xref: { document: "cluster", section: "1.6.6.4" }
                })
            ]
        }),

        Command({
            name: "MoveToLevelWithOnOff", id: 0x4, access: "O", conformance: "M", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6" },

            children: [
                Field({ name: "Level", type: "uint8", conformance: "M" }),
                Field({ name: "TransitionTime", type: "uint16", conformance: "M", quality: "X" }),
                Field({ name: "OptionsMask", type: "Options", conformance: "M" }),
                Field({ name: "OptionsOverride", type: "Options", conformance: "M" })
            ]
        }),

        Command({
            name: "MoveWithOnOff", id: 0x5, access: "O", conformance: "M", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6" },

            children: [
                Field({ name: "MoveMode", type: "MoveMode", conformance: "M" }),
                Field({ name: "Rate", type: "uint8", conformance: "M", quality: "X" }),
                Field({ name: "OptionsMask", type: "Options", conformance: "M" }),
                Field({ name: "OptionsOverride", type: "Options", conformance: "M" })
            ]
        }),

        Command({
            name: "StepWithOnOff", id: 0x6, access: "O", conformance: "M", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6" },

            children: [
                Field({ name: "StepMode", type: "StepMode", conformance: "M" }),
                Field({ name: "StepSize", type: "uint8", conformance: "M" }),
                Field({ name: "TransitionTime", type: "uint16", conformance: "M", quality: "X" }),
                Field({ name: "OptionsMask", type: "Options", conformance: "M" }),
                Field({ name: "OptionsOverride", type: "Options", conformance: "M" })
            ]
        }),

        Command({
            name: "StopWithOnOff", id: 0x7, access: "O", conformance: "M", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6" },
            children: [
                Field({ name: "OptionsMask", type: "Options", conformance: "M" }),
                Field({ name: "OptionsOverride", type: "Options", conformance: "M" })
            ]
        }),

        Command({
            name: "MoveToClosestFrequency", id: 0x8, access: "O", conformance: "FQ", direction: "request",
            response: "status",
            xref: { document: "cluster", section: "1.6.6.5" },
            children: [Field({
                name: "Frequency", id: 0x0, type: "uint16", conformance: "M", default: "0",
                xref: { document: "cluster", section: "1.6.6.5" }
            })]
        }),

        Datatype({
            name: "MoveMode", type: "enum8", conformance: "M",
            children: [
                Field({ name: "Up", id: 0x0, conformance: "M" }),
                Field({ name: "Down", id: 0x1, conformance: "M" })
            ]
        }),

        Datatype({
            name: "StepMode", type: "enum8", conformance: "M",
            children: [
                Field({ name: "Up", id: 0x0, conformance: "M" }),
                Field({ name: "Down", id: 0x1, conformance: "M" })
            ]
        })
    ]
}));
