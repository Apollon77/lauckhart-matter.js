/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "cluster", name: "ThermostatUserInterfaceConfiguration", id: 0x204,
    classification: "application", description: "Thermostat User Interface Configuration",
    details: "An interface for configuring the user interface of a thermostat (which may be remote from the " +
             "thermostat",
    xref: { document: "cluster", section: "4.5" },
    children: [
        {
            tag: "attribute", name: "TemperatureDisplayMode", id: 0x0, type: "enum8", access: "RW",
            conformance: "M", constraint: "desc",
            details: "The TemperatureDisplayMode attribute specifies the units of the temperature displayed on the " +
                     "thermostat screen",
            xref: { document: "cluster", section: "4.5.5.1" },
            children: [
                {
                    tag: "datatype", name: "Celsius", id: 0x0, conformance: "M",
                    description: "Temperature displayed in °C",
                    xref: { document: "cluster", section: "4.5.5.1" }
                },

                {
                    tag: "datatype", name: "Fahrenheit", id: 0x1, conformance: "M",
                    description: "Temperature displayed in °F",
                    xref: { document: "cluster", section: "4.5.5.1" }
                }
            ]
        },

        {
            tag: "attribute", name: "KeypadLockout", id: 0x1, type: "enum8", access: "RW VM", conformance: "M",
            constraint: "desc",
            details: "The KeypadLockout attribute specifies the level of functionality that is available to the user via " +
                     "the keypad",
            xref: { document: "cluster", section: "4.5.5.2" },
            children: [
                {
                    tag: "datatype", name: "NoLockout", id: 0x0, conformance: "M",
                    description: "All functionality available to the user",
                    xref: { document: "cluster", section: "4.5.5.2" }
                },

                {
                    tag: "datatype", name: "Lockout1", id: 0x1, conformance: "M",
                    description: "Level 1 reduced functionality",
                    xref: { document: "cluster", section: "4.5.5.2" }
                },

                {
                    tag: "datatype", name: "Lockout2", id: 0x2, conformance: "M",
                    description: "Level 2 reduced functionality",
                    xref: { document: "cluster", section: "4.5.5.2" }
                },

                {
                    tag: "datatype", name: "Lockout3", id: 0x3, conformance: "M",
                    description: "Level 3 reduced functionality",
                    xref: { document: "cluster", section: "4.5.5.2" }
                },

                {
                    tag: "datatype", name: "Lockout4", id: 0x4, conformance: "M",
                    description: "Level 4 reduced functionality",
                    xref: { document: "cluster", section: "4.5.5.2" }
                },

                {
                    tag: "datatype", name: "Lockout5", id: 0x5, conformance: "M",
                    description: "Least functionality available to the user",
                    xref: { document: "cluster", section: "4.5.5.2" }
                }
            ]
        },

        {
            tag: "attribute", name: "ScheduleProgrammingVisibility", id: 0x2, type: "enum8", access: "RW VM",
            conformance: "O", constraint: "desc",
            details: "The ScheduleProgrammingVisibility attribute is used to hide the weekly schedule programming " +
                     "functionality or menu on a thermostat from a user to prevent local user programming of the weekly " +
                     "schedule. The schedule programming MAY still be performed via a remote interface, and the thermostat" +
                     " MAY operate in schedule programming mode",
            xref: { document: "cluster", section: "4.5.5.3" },
            children: [
                {
                    tag: "datatype", name: "ScheduleProgrammingPermitted", id: 0x0, conformance: "M",
                    description: "Local schedule programming functionality is enabled at the thermostat",
                    xref: { document: "cluster", section: "4.5.5.3" }
                },

                {
                    tag: "datatype", name: "ScheduleProgrammingDenied", id: 0x1, conformance: "M",
                    description: "Local schedule programming functionality is disabled at the thermostat",
                    xref: { document: "cluster", section: "4.5.5.3" }
                }
            ]
        }
    ]
});
