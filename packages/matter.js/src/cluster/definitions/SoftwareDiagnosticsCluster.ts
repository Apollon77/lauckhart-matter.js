/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ClusterMetadata, ClusterComponent, extendCluster } from "../../cluster/ClusterFactory.js";
import { BitFlag, TypeFromPartialBitSchema, BitFlags } from "../../schema/BitmapSchema.js";
import { OptionalAttribute, AccessLevel, OptionalEvent, EventPriority, Attribute, Command, TlvNoResponse } from "../../cluster/Cluster.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { TlvObject, TlvField, TlvOptionalField } from "../../tlv/TlvObject.js";
import { TlvUInt64, TlvUInt32 } from "../../tlv/TlvNumber.js";
import { TlvString, TlvByteString } from "../../tlv/TlvString.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";

/**
 * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1
 */
export const TlvThreadMetricsStruct = TlvObject({
    /**
     * The Id field SHALL be a server-assigned per-thread unique ID that is constant for the duration of the thread.
     * Efforts SHOULD be made to avoid reusing ID values when possible.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1.1
     */
    id: TlvField(0, TlvUInt64),

    /**
     * The Name field SHALL be set to a vendor defined name or prefix of the software thread that is static for the
     * duration of the thread.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1.2
     */
    name: TlvOptionalField(1, TlvString.bound({ maxLength: 8 })),

    /**
     * The StackFreeCurrent field SHALL indicate the current amount of stack memory, in bytes, that are not being
     * utilized on the respective thread.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1.3
     */
    stackFreeCurrent: TlvOptionalField(2, TlvUInt32),

    /**
     * The StackFreeMinimum field SHALL indicate the minimum amount of stack memory, in bytes, that has been available
     * at any point between the current time and this attribute being reset or initialized on the respective thread.
     * This value SHALL only be reset upon a Node reboot or upon receiving of the ResetWatermarks command.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1.4
     */
    stackFreeMinimum: TlvOptionalField(3, TlvUInt32),

    /**
     * The StackSize field SHALL indicate the amount of stack memory, in bytes, that has been allocated
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.5.1.5
     */
    stackSize: TlvOptionalField(4, TlvUInt32)
});

/**
 * The SoftwareFault Event SHALL be generated when a software fault takes place on the Node. The event’s data are as
 * follows:
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.12.8.1
 */
export const TlvSoftwareFaultEvent = TlvObject({
    id: TlvField(0, TlvUInt64),
    name: TlvOptionalField(1, TlvString.bound({ maxLength: 8 })),

    /**
     * The FaultRecording field SHALL be a manufacturer-specified payload intended to convey information to assist in
     * further diagnosing or debugging a software fault. The FaultRecording field MAY be used to convey information
     * such as, but not limited to, thread backtraces or register contents.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.12.8.1.1
     */
    faultRecording: TlvOptionalField(2, TlvByteString.bound({ maxLength: 1024 }))
});

/**
 * Standard SoftwareDiagnostics cluster properties.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.12
 */
export const SoftwareDiagnosticsMetadata = ClusterMetadata({
    id: 0x34,
    name: "SoftwareDiagnostics",
    revision: 1,

    features: {
        /**
         * Watermarks
         *
         * Node makes available the metrics for high watermark related to memory consumption.
         */
        watermarks: BitFlag(0)
    }
});

/**
 * A SoftwareDiagnosticsCluster supports these elements for all feature combinations.
 */
export const BaseComponent = ClusterComponent({
    attributes: {
        /**
         * The ThreadMetrics attribute SHALL be a list of ThreadMetricsStruct structs. Each active thread on the Node
         * SHALL be represented by a single entry within the ThreadMetrics attribute.
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.6.1
         */
        threadMetrics: OptionalAttribute(0, TlvArray(TlvThreadMetricsStruct), { default: [], readAcl: AccessLevel.View }),

        /**
         * The CurrentHeapFree attribute SHALL indicate the current amount of heap memory, in bytes, that are free for
         * allocation. The effective amount MAY be smaller due to heap fragmentation or other reasons.
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.6.2
         */
        currentHeapFree: OptionalAttribute(1, TlvUInt64, { readAcl: AccessLevel.View }),

        /**
         * The CurrentHeapUsed attribute SHALL indicate the current amount of heap memory, in bytes, that is being used.
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.6.3
         */
        currentHeapUsed: OptionalAttribute(2, TlvUInt64, { readAcl: AccessLevel.View })
    },

    events: {
        /**
         * The SoftwareFault Event SHALL be generated when a software fault takes place on the Node. The event’s data
         * are as follows:
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.8.1
         */
        softwareFault: OptionalEvent(0, EventPriority.Info, TlvSoftwareFaultEvent)
    }
});

/**
 * A SoftwareDiagnosticsCluster supports these elements if it supports feature Watermarks.
 */
export const WatermarksComponent = ClusterComponent({
    attributes: {
        /**
         * The CurrentHeapHighWatermark attribute SHALL indicate the maximum amount of heap memory, in bytes, that has
         * been used by the Node. This value SHALL only be reset upon a Node reboot or upon receiving of the
         * ResetWatermarks command.
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.6.4
         */
        currentHeapHighWatermark: Attribute(3, TlvUInt64, { readAcl: AccessLevel.View })
    },

    commands: {
        /**
         * Receipt of this command SHALL reset the following values which track high and lower watermarks:
         *
         * @see {@link MatterCoreSpecificationV1_1} § 11.12.7.1
         */
        resetWatermarks: Command(0, TlvNoArguments, 0, TlvNoResponse)
    }
});

export type SoftwareDiagnosticsCluster<T extends TypeFromPartialBitSchema<typeof SoftwareDiagnosticsMetadata.features>> = 
    typeof SoftwareDiagnosticsMetadata
    & { supportedFeatures: T }
    & typeof BaseComponent
    & (T extends { watermarks: true } ? typeof WatermarksComponent : {});

export function SoftwareDiagnosticsCluster<T extends (keyof typeof SoftwareDiagnosticsMetadata.features)[]>(...features: [ ...T ]) {
    const cluster = {
        ...SoftwareDiagnosticsMetadata,
        supportedFeatures: BitFlags(SoftwareDiagnosticsMetadata.features, ...features),
        ...BaseComponent
    };
    extendCluster(cluster, WatermarksComponent, { watermarks: true });
    
    return cluster as unknown as SoftwareDiagnosticsCluster<BitFlags<typeof SoftwareDiagnosticsMetadata.features, T>>;
};