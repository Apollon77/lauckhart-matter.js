/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "deviceType", name: "LightSensor", id: 0x106, classification: "simple",
    details: "A Light Sensor device is a measurement and sensing device that is capable of measuring and " +
        "reporting the intensity of light (illuminance) to which the sensor is being subjected.",
    xref: { document: "device", section: "7.2" },

    children: [
        {
            tag: "requirement", name: "Descriptor", id: 0x1d, element: "serverCluster",
            children: [{
                tag: "requirement", name: "DeviceTypeList", default: [ { deviceType: 262, revision: 2 } ],
                element: "attribute"
            }]
        },

        {
            tag: "requirement", name: "Identify", id: 0x3, conformance: "M", element: "serverCluster",
            xref: { document: "device", section: "7.2.4" },
            children: [{ tag: "requirement", name: "QUERY", conformance: "!Matter", element: "feature" }]
        },
        {
            tag: "requirement", name: "Groups", id: 0x4, conformance: "O", element: "clientCluster",
            xref: { document: "device", section: "7.2.4" }
        },
        {
            tag: "requirement", name: "IlluminanceMeasurement", id: 0x400, conformance: "M",
            element: "serverCluster",
            xref: { document: "device", section: "7.2.4" }
        }
    ]
});
