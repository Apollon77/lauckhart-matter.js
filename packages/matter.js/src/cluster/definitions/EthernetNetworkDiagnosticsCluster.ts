/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Cluster, OptionalAttribute, AccessLevel, OptionalCommand, TlvNoResponse } from "../../cluster/Cluster.js";
import { BitFlag } from "../../schema/BitmapSchema.js";
import { TlvEnum, TlvUInt64 } from "../../tlv/TlvNumber.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { TlvBoolean } from "../../tlv/TlvBoolean.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";

/**
 * This data type is derived from enum8.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.15.5.1
 */
export const enum PHYRateEnum {
    Rate10M = 0,
    Rate100M = 1,
    Rate1G = 2,
    Rate25G = 3,
    Rate5G = 4,
    Rate10G = 5,
    Rate40G = 6,
    Rate100G = 7,
    Rate200G = 8,
    Rate400G = 9
};

export namespace EthernetNetworkDiagnosticsCluster {
    /**
     * Ethernet Network Diagnostics
     *
     * The Ethernet Network Diagnostics Cluster provides a means to acquire
     * standardized diagnostics metrics that MAY be used by a Node to assist a
     * user or Administrative Node in diagnosing potential problems.
     *
     * This cluster definition includes all elements an implementation may
     * support.  For type safety, use `EthernetNetworkDiagnostics.with()` and a
     * list of supported features.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.15
     */
    export const Complete = Cluster({
        id: 0x37,
        name: "EthernetNetworkDiagnostics",
        revision: 1,
        features: {
            PKTCNT: BitFlag(0),
            ERRCNT: BitFlag(1)
        },

        attributes: {
            /**
             * The PHYRate attribute SHALL indicate the current nominal, usable
             * speed at the top of the physical layer of the Node. A value of
             * null SHALL indicate that the interface is not currently
             * configured or operational.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.1
             */
            phyRate: OptionalAttribute(0, TlvNullable(TlvEnum<PHYRateEnum>()), { default: null, readAcl: AccessLevel.View }),

            /**
             * The FullDuplex attribute SHALL indicate if the Node is currently
             * utilizing the full-duplex operating mode. A value of null SHALL
             * indicate that the interface is not currently configured or
             * operational.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.2
             */
            fullDuplex: OptionalAttribute(1, TlvNullable(TlvBoolean), { default: null, readAcl: AccessLevel.View }),

            /**
             * The PacketRxCount attribute SHALL indicate the number of packets
             * that have been received on the ethernet network interface. The
             * PacketRxCount attribute SHALL be reset to 0 upon a reboot of the
             * Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.3
             */
            packetRxCount: OptionalAttribute(2, TlvUInt64, { readAcl: AccessLevel.View }),

            /**
             * The PacketTxCount attribute SHALL indicate the number of packets
             * that have been successfully transferred on the ethernet network
             * interface. The PacketTxCount attribute SHALL be reset to 0 upon
             * a reboot of the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.4
             */
            packetTxCount: OptionalAttribute(3, TlvUInt64, { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The TxErrCount attribute SHALL indicate the number of failed
             * packet transmissions that have occurred on the ethernet network
             * interface. The TxErrCount attribute SHALL be reset to 0 upon a
             * reboot of the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.5
             */
            txErrCount: OptionalAttribute(4, TlvUInt64, { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The CollisionCount attribute SHALL indicate the number of
             * collisions that have occurred while attempting to transmit a
             * packet on the ethernet network interface. The CollisionCount
             * attribute SHALL be reset to 0 upon a reboot of the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.6
             */
            collisionCount: OptionalAttribute(5, TlvUInt64, { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The OverrunCount attribute SHALL indicate the number of packets
             * dropped either at ingress or egress, due to lack of buffer
             * memory to retain all packets on the ethernet network interface.
             * The OverrunCount attribute SHALL be reset to 0 upon a reboot of
             * the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.7
             */
            overrunCount: OptionalAttribute(6, TlvUInt64, { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The CarrierDetect attribute SHALL indicate the value of the
             * Carrier Detect control signal present on the ethernet network
             * interface. A value of null SHALL indicate that the interface is
             * not currently configured or operational.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6.8
             */
            carrierDetect: OptionalAttribute(7, TlvNullable(TlvBoolean), { omitChanges: true, default: null, readAcl: AccessLevel.View }),

            /**
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.6
             */
            timeSinceReset: OptionalAttribute(8, TlvUInt64, { omitChanges: true, readAcl: AccessLevel.View })
        },

        commands: {
            /**
             * Reception of this command SHALL reset the following attributes
             * to 0:
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.15.7.1
             */
            resetCounts: OptionalCommand(0, TlvNoArguments, 0, TlvNoResponse)
        }
    });
};