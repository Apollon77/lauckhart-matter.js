/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Matter } from "../Matter.js";

Matter.children.push({
    tag: "cluster", name: "PressureMeasurement", id: 0x403, classification: "application",
    description: "Pressure Measurement",
    details: "Attributes and commands for configuring the measurement of pressure, and reporting pressure " +
             "measurements",
    xref: { document: "cluster", section: "2.4" },
    children: [
        {
            tag: "attribute", name: "FeatureMap", id: 0xfffc, type: "FeatureMap",
            children: [
                {
                    tag: "datatype", name: "EXT", id: 0x0, conformance: "O",
                    description: "The cluster is capable of extended range and resolution",
                    xref: { document: "cluster", section: "2.4.4" }
                }
            ]
        },

        {
            tag: "attribute", name: "MeasuredValue", id: 0x0, type: "int16", access: "R V", conformance: "M",
            constraint: "MinMeasuredValue to MaxMeasuredValue", quality: "X P",
            details: "This attribute represents the pressure in kPa as follows",
            xref: { document: "cluster", section: "2.4.5.1" }
        },

        {
            tag: "attribute", name: "MinMeasuredValue", id: 0x1, type: "int16", access: "R V", conformance: "M",
            quality: "X",
            details: "This attribute indicates the minimum value of MeasuredValue that can be measured. See Measured Value" +
                     " for more details",
            xref: { document: "cluster", section: "2.4.5.2" }
        },

        {
            tag: "attribute", name: "MaxMeasuredValue", id: 0x2, type: "int16", access: "R V", conformance: "M",
            constraint: "MinMeasuredValue1 to 32767", quality: "X",
            details: "This attribute indicates the maximum value of MeasuredValue that can be measured. See Measured Value" +
                     " for more details",
            xref: { document: "cluster", section: "2.4.5.3" }
        },

        {
            tag: "attribute", name: "Tolerance", id: 0x3, type: "uint16", access: "R V", conformance: "O",
            constraint: "0 to 2048",
            details: "This attribute indicates the magnitude of the possible error that is associated with ScaledValue",
            xref: { document: "cluster", section: "2.4.5.4" }
        },

        {
            tag: "attribute", name: "ScaledValue", id: 0x10, type: "int16", access: "R V", conformance: "EXT",
            constraint: "MinScaledValue to MaxScaledValue", quality: "X",
            details: "ScaledValue represents the pressure in Pascals as follows",
            xref: { document: "cluster", section: "2.4.5.5" }
        },

        {
            tag: "attribute", name: "MinScaledValue", id: 0x11, type: "int16", access: "R V",
            conformance: "EXT", quality: "X",
            details: "The MinScaledValue attribute indicates the minimum value of ScaledValue that can be measured. The " +
                     "null value indicates that the value is not available",
            xref: { document: "cluster", section: "2.4.5.6" }
        },

        {
            tag: "attribute", name: "MaxScaledValue", id: 0x12, type: "int16", access: "R V",
            conformance: "EXT", constraint: "MinScaledValue1 to 32767", quality: "X",
            details: "This attribute indicates the maximum value of ScaledValue that can be measured. MaxScaledValue SHALL" +
                     " be greater than MinScaledValue",
            xref: { document: "cluster", section: "2.4.5.7" }
        },

        {
            tag: "attribute", name: "ScaledTolerance", id: 0x13, type: "uint16", access: "R V",
            conformance: "[EXT]", constraint: "0 to 2048", quality: "P",
            details: "This attribute indicates the magnitude of the possible error that is associated with ScaledValue. " +
                     "The true value is located in the range",
            xref: { document: "cluster", section: "2.4.5.8" }
        },

        {
            tag: "attribute", name: "Scale", id: 0x14, type: "int8", access: "R V", conformance: "EXT",
            constraint: "-127 to 127",
            details: "This attribute indicates the base 10 exponent used to obtain ScaledValue (see ScaledValue Attribute",
            xref: { document: "cluster", section: "2.4.5.9" }
        }
    ]
});
