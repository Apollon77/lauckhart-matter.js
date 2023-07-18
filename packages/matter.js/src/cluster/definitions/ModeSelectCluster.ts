/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterApplicationClusterSpecificationV1_1 } from "../../spec/Specifications.js";
import { BitFlags, TypeFromPartialBitSchema, BitFlag } from "../../schema/BitmapSchema.js";
import { extendCluster, ClusterMetadata, ClusterComponent } from "../../cluster/ClusterFactory.js";
import { GlobalAttributes, FixedAttribute, Attribute, OptionalWritableAttribute, Command, TlvNoResponse, WritableAttribute, Cluster } from "../../cluster/Cluster.js";
import { TlvString } from "../../tlv/TlvString.js";
import { TlvUInt16, TlvUInt8 } from "../../tlv/TlvNumber.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";
import { TlvVendorId } from "../../datatype/VendorId.js";

/**
 * Mode Select
 *
 * Attributes and commands for selecting a mode from a list of supported options.
 *
 * Use this factory function to create a ModeSelect cluster supporting a specific set of features. Include each
 * {@link ModeSelectCluster.Feature} you wish to support.
 *
 * @param features a list of {@link ModeSelectCluster.Feature} to support
 * @returns a ModeSelect cluster with specified features enabled
 * @throws {IllegalClusterError} if the feature combination is disallowed by the Matter specification
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8
 */
export function ModeSelectCluster<T extends ModeSelectCluster.Feature[]>(...features: [...T]) {
    const cluster = Cluster({
        ...ModeSelectCluster.Metadata,
        supportedFeatures: BitFlags(ModeSelectCluster.Metadata.features, ...features),
        ...ModeSelectCluster.BaseComponent
    });
    extendCluster(cluster, ModeSelectCluster.OnOffComponent, { onOff: true });
    return cluster as unknown as ModeSelectCluster.Type<BitFlags<typeof ModeSelectCluster.Metadata.features, T>>;
}

/**
 * A Semantic Tag is meant to be interpreted by the client for the purpose the cluster serves.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.2
 */
export const TlvSemanticTagStruct = TlvObject({
    /**
     * If this field is null, the Value field shall be defined in a standard namespace as indicated by the
     * StandardNamespace attribute. If this field is not null, it shall indicate a manufacturer code (Vendor ID), and
     * the Value field shall indicate a semantic tag defined by the manufacturer. Each manufacturer code supports a
     * single namespace of values. The same manufacturer code and semantic tag value in separate cluster instances are
     * part of the same namespace and have the same meaning. For example: a manufacturer tag meaning "pinch", has the
     * same meaning in a cluster whose purpose is to choose the amount of sugar, or amount of salt.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.2.2
     */
    mfgCode: TlvField(0, TlvNullable(TlvVendorId)),

    /**
     * This field shall indicate the semantic tag within a semantic tag namespace which is either manufacturer specific
     * or standard. For semantic tags in a standard namespace, see Standard Namespace.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.2.1
     */
    value: TlvField(1, TlvUInt16)
});

/**
 * This is a struct representing a possible mode of the server.
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.1
 */
export const TlvModeOptionStruct = TlvObject({
    /**
     * This field is readable text that describes the mode option that can be used by a client to indicate to the user
     * what this option means. This field is meant to be readable and understandable by the user.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.1.1
     */
    label: TlvField(0, TlvString.bound({ maxLength: 64 })),

    /**
     * The Mode field is used to identify the mode option. The value shall be unique for every item in the
     * SupportedModes attribute.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.1.2
     */
    mode: TlvField(1, TlvUInt8),

    /**
     * This field is a list of semantic tags that map to the mode option. This MAY be used by clients to determine the
     * meaning of the mode option as defined in a standard or manufacturer specific namespace. Semantic tags can help
     * clients look for options that meet certain criteria. A semantic tag shall be either a standard tag or
     * manufacturer specific tag as defined in each SemanticTagStruct list entry.
     *
     * A mode option MAY have more than one semantic tag. A mode option MAY be mapped to a mixture of standard and
     * manufacturer specific semantic tags.
     *
     * All standard semantic tags are from a single namespace indicated by the StandardNamespace attribute.
     *
     * For example: A mode labeled "100%" can have both the HIGH (MS) and MAX (standard) semantic tag. Clients seeking
     * the option for either HIGH or MAX will find the same option in this case.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.8.1.3
     */
    semanticTags: TlvField(2, TlvArray(TlvSemanticTagStruct))
});

/**
 * Input to the ModeSelect changeToMode command
 *
 * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.6.1
 */
export const TlvChangeToModeRequest = TlvObject({ newMode: TlvField(0, TlvUInt8) });

export namespace ModeSelectCluster {
    /**
     * These are optional features supported by ModeSelectCluster.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.4
     */
    export enum Feature {
        /**
         * OnOff
         *
         * Dependency with the On/Off cluster
         */
        OnOff = "OnOff"
    }

    export type Type<T extends TypeFromPartialBitSchema<typeof Metadata.features>> =
        typeof Metadata
        & { attributes: GlobalAttributes<typeof Metadata.features> }
        & { supportedFeatures: T }
        & typeof BaseComponent
        & (T extends { onOff: true } ? typeof OnOffComponent : {});

    /**
     * ModeSelect cluster metadata.
     *
     * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8
     */
    export const Metadata = ClusterMetadata({
        id: 0x50,
        name: "ModeSelect",
        revision: 1,

        features: {
            /**
             * OnOff
             *
             * Dependency with the On/Off cluster
             */
            onOff: BitFlag(0)
        }
    });

    /**
     * A ModeSelectCluster supports these elements for all feature combinations.
     */
    export const BaseComponent = ClusterComponent({
        attributes: {
            /**
             * This attribute describes the purpose of the server, in readable text.
             *
             * For example, a coffee machine may have a Mode Select cluster for the amount of milk to add, and another
             * Mode Select cluster for the amount of sugar to add. In this case, the first instance can have the
             * description Milk and the second instance can have the description Sugar. This allows the user to tell
             * the purpose of each of the instances.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.1
             */
            description: FixedAttribute(0, TlvString.bound({ maxLength: 64 })),

            /**
             * This attribute, when not null, shall indicate a single standard namespace for any standard semantic tag
             * value supported in this or any other cluster instance with the same value of this attribute. A null
             * value indicates no standard namespace, and therefore, no standard semantic tags are provided in this
             * cluster instance. Each standard namespace and corresponding values and value meanings shall be defined
             * in another document.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.2
             */
            standardNamespace: FixedAttribute(1, TlvNullable(TlvUInt16), { default: null }),

            /**
             * This attribute is the list of supported modes that may be selected for the CurrentMode attribute. Each
             * item in this list represents a unique mode as indicated by the Mode field of the ModeOptionStruct. Each
             * entry in this list shall have a unique value for the Mode field.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.3
             */
            supportedModes: FixedAttribute(2, TlvArray(TlvModeOptionStruct), { default: [] }),

            /**
             * This attribute represents the current mode of the server.
             *
             * The value of this field must match the Mode field of one of the entries in the SupportedModes
             *
             * attribute.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.4
             */
            currentMode: Attribute(3, TlvUInt8, { scene: true, persistent: true }),

            /**
             * The StartUpMode attribute value indicates the desired startup mode for the server when it is supplied
             * with power.
             *
             * If this attribute is not null, the CurrentMode attribute shall be set to the StartUpMode value, when the
             * server is powered up, except in the case when the OnMode attribute overrides the StartUpMode attribute.
             *
             * This behavior does not apply to reboots associated with OTA. After an OTA restart, the CurrentMode
             * attribute shall return to its value prior to the restart.
             *
             * The value of this field shall match the Mode field of one of the entries in the SupportedModes
             *
             * attribute.
             *
             * If this attribute is not implemented, or is set to the null value, it shall have no effect.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.5
             */
            startUpMode: OptionalWritableAttribute(4, TlvNullable(TlvUInt8), { persistent: true })
        },

        commands: {
            /**
             * On receipt of this command, if the NewMode field indicates a valid mode transition within the supported
             * list, the server shall set the CurrentMode attribute to the NewMode value, otherwise, the
             *
             * server shall respond with an INVALID_COMMAND status response.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.6.1
             */
            changeToMode: Command(0, TlvChangeToModeRequest, 0, TlvNoResponse)
        }
    });

    /**
     * A ModeSelectCluster supports these elements if it supports feature OnOff.
     */
    export const OnOffComponent = ClusterComponent({
        attributes: {
            /**
             * This attribute shall indicate the value of CurrentMode that depends on the state of the On/Off cluster
             * on the same endpoint. If this attribute is not present or is set to null, it shall NOT have an effect,
             * otherwise the CurrentMode attribute shall depend on the OnOff attribute of the On/Off cluster
             *
             * The value of this field shall match the Mode field of one of the entries in the SupportedModes attribute.
             *
             * @see {@link MatterApplicationClusterSpecificationV1_1} § 1.8.5.6
             */
            onMode: WritableAttribute(5, TlvNullable(TlvUInt8), { persistent: true, default: null })
        }
    });

    /**
     * This cluster supports all ModeSelect features. It may support illegal feature combinations.
     *
     * If you use this cluster you must manually specify which features are active and ensure the set of active
     * features is legal per the Matter specification.
     */
    export const Complete = Cluster({
        ...Metadata,
        attributes: { ...BaseComponent.attributes, ...OnOffComponent.attributes },
        commands: { ...BaseComponent.commands }
    });
}
