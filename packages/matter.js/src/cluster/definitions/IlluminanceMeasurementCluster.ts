/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterApplicationClusterSpecificationV1_1 } from "../../spec/Specifications.js";
import { GlobalAttributes, Attribute, OptionalAttribute, Cluster } from "../../cluster/Cluster.js";
import { ClusterMetadata, ClusterComponent } from "../../cluster/ClusterFactory.js";
import { TlvUInt16, TlvEnum } from "../../tlv/TlvNumber.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";

/**
 * Illuminance Measurement
 *
 * Attributes and commands for configuring the measurement of illuminance, and reporting illuminance measurements.
 *
 * Use this factory function to create an IlluminanceMeasurement cluster.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2
 */
export function IlluminanceMeasurementCluster() {
    const cluster = Cluster({ ...IlluminanceMeasurementCluster.Metadata, ...IlluminanceMeasurementCluster.BaseComponent });
    return cluster as unknown as IlluminanceMeasurementCluster.Type;
}

/**
 * The value of the IlluminanceMeasurement lightSensorType attribute
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.5
 */
export const enum LightSensorType {
    Photodiode = 0,
    Cmos = 1
}

export namespace IlluminanceMeasurementCluster {
    export type Type =
        typeof Metadata
        & { attributes: GlobalAttributes<{}> }
        & typeof BaseComponent;

    /**
     * IlluminanceMeasurement cluster metadata.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2
     */
    export const Metadata = ClusterMetadata({ id: 0x400, name: "IlluminanceMeasurement", revision: 1, features: {} });

    /**
     * A IlluminanceMeasurementCluster supports these elements for all feature combinations.
     */
    export const BaseComponent = ClusterComponent({
        attributes: {
            /**
             * The MeasuredValue attribute represents the illuminance in Lux (symbol lx) as follows:
             *
             *   • MeasuredValue = 10,000 x log10(illuminance) + 1,
             *
             * where 1 lx ≤ illuminance ≤ 3.576 Mlx, corresponding to a MeasuredValue in the range 1 to 0xfffe. The
             * MeasuredValue attribute can take the following values:
             *
             *   • 0 indicates a value of illuminance that is too low to be measured,
             *
             *   • MinMeasuredValue ≤ MeasuredValue ≤ MaxMeasuredValue under normal circumstances,
             *
             *   • null indicates that the illuminance measurement is invalid.
             *
             * The MeasuredValue attribute is updated continuously as new measurements are made.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.1
             */
            measuredValue: Attribute(0, TlvNullable(TlvUInt16), { default: 0 }),

            /**
             * The MinMeasuredValue attribute indicates the minimum value of MeasuredValue that can be measured. A
             * value of null indicates that this attribute is not defined. See Measured Value for more details.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.2
             */
            minMeasuredValue: Attribute(1, TlvNullable(TlvUInt16.bound({ min: 1 }))),

            /**
             * The MaxMeasuredValue attribute indicates the maximum value of MeasuredValue that can be measured. A
             * value of null indicates that this attribute is not defined. See Measured Value for more details.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.3
             */
            maxMeasuredValue: Attribute(2, TlvNullable(TlvUInt16.bound({ max: 65534 }))),

            /**
             * See Measured Value.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.4
             */
            tolerance: OptionalAttribute(3, TlvUInt16.bound({ max: 2048 })),

            /**
             * The LightSensorType attribute specifies the electronic type of the light sensor. This attribute shall be
             * set to one of the non-reserved values listed in Values of the LightSensorType Attribute.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 2.2.5.5
             */
            lightSensorType: OptionalAttribute(4, TlvNullable(TlvEnum<LightSensorType>()), { default: 255 })
        }
    });

    /**
     * This cluster supports all IlluminanceMeasurement features.
     */
    export const Complete = Cluster({ ...Metadata, attributes: { ...BaseComponent.attributes } });
}
