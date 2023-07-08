/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { MatterCoreSpecificationV1_1 } from "../../spec/Specifications.js";
import { BitFlags, TypeFromPartialBitSchema, BitFlag } from "../../schema/BitmapSchema.js";
import { extendCluster, ClusterMetadata, ClusterComponent } from "../../cluster/ClusterFactory.js";
import { Attribute, AccessLevel, OptionalAttribute, OptionalEvent, EventPriority, Command, TlvNoResponse, Cluster } from "../../cluster/Cluster.js";
import { TlvByteString } from "../../tlv/TlvString.js";
import { TlvNullable } from "../../tlv/TlvNullable.js";
import { TlvEnum, TlvUInt16, TlvInt8, TlvUInt64, TlvUInt32 } from "../../tlv/TlvNumber.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";

/**
 * WiFi Network Diagnostics
 *
 * The Wi-Fi Network Diagnostics Cluster provides a means to acquire standardized diagnostics metrics that MAY be used
 * by a Node to assist a user or Administrative Node in diagnosing potential problems.
 *
 * Use this factory function to create a WiFiNetworkDiagnostics cluster supporting a specific set of features.  Include
 * each {@link WiFiNetworkDiagnosticsCluster.Feature} you wish to support.
 *
 * @param features a list of {@link WiFiNetworkDiagnosticsCluster.Feature} to support
 * @returns a WiFiNetworkDiagnostics cluster with specified features enabled
 * @throws {IllegalClusterError} if the feature combination is disallowed by the Matter specification
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.14
 */
export function WiFiNetworkDiagnosticsCluster<T extends WiFiNetworkDiagnosticsCluster.Feature[]>(...features: [ ...T ]) {
    const cluster = {
        ...WiFiNetworkDiagnosticsCluster.Metadata,
        supportedFeatures: BitFlags(WiFiNetworkDiagnosticsCluster.Metadata.features, ...features),
        ...WiFiNetworkDiagnosticsCluster.BaseComponent
    };
    extendCluster(cluster, WiFiNetworkDiagnosticsCluster.ErrorCountsComponent, { errorCounts: true });
    extendCluster(cluster, WiFiNetworkDiagnosticsCluster.PacketCountsComponent, { packetCounts: true });
    return cluster as unknown as WiFiNetworkDiagnosticsCluster.Type<BitFlags<typeof WiFiNetworkDiagnosticsCluster.Metadata.features, T>>;
};

/**
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.5.1
 */
export const enum TlvSecurityTypeEnum {
    Unspecified = 0,
    None = 1,
    Wep = 2,
    Wpa = 3,
    Wpa2 = 4,
    Wpa3 = 5
};

/**
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.5.2
 */
export const enum TlvWiFiVersionEnum {
    A = 0,
    B = 1,
    G = 2,
    N = 3,
    Ac = 4,
    Ax = 5
};

/**
 * The Disconnection Event SHALL indicate that a Node’s Wi-Fi connection has been disconnected as a result of
 * de-authenticated or dis-association and indicates the reason.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.1
 */
export const TlvDisconnectionEvent = TlvObject({
    /**
     * This field SHALL contain the Reason Code field value for the Disassociation or Deauthentication event that
     * caused the disconnection and the value SHALL align with Table 9-49 "Reason codes" of IEEE 802.11-2020.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.1.1
     */
    reasonCode: TlvField(0, TlvUInt16)
});

/**
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.5.3
 */
export const enum TlvAssociationFailureCauseEnum {
    Unknown = 0,
    AssociationFailed = 1,
    AuthenticationFailed = 2,
    SsidNotFound = 3
};

/**
 * The AssociationFailure event SHALL indicate that a Node has attempted to connect, or reconnect, to a Wi-Fi access
 * point, but is unable to successfully associate or authenticate, after exhausting all internal retries of its
 * supplicant.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.2
 */
export const TlvAssociationFailureEvent = TlvObject({
    /**
     * The Status field SHALL be set to a value from the AssociationFailureCauseEnum.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.2.1
     */
    associationFailureCause: TlvField(0, TlvEnum<TlvAssociationFailureCauseEnum>()),

    /**
     * The Status field SHALL be set to the Status Code value that was present in the last frame related to association
     * where Status Code was not equal to zero and which caused the failure of a last trial attempt, if this last
     * failure was due to one of the following Management frames:
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.2.2
     */
    status: TlvField(1, TlvUInt16)
});

/**
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.5.4
 */
export const enum TlvConnectionStatusEnum {
    Connected = 0,
    NotConnected = 1
};

/**
 * The ConnectionStatus Event SHALL indicate that a Node’s connection status to a Wi-Fi network has changed. Connected,
 * in this context, SHALL mean that a Node acting as a Wi-Fi station is successfully associated to a Wi-Fi Access Point.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.3
 */
export const TlvConnectionStatusEvent = TlvObject({ connectionStatus: TlvField(0, TlvEnum<TlvConnectionStatusEnum>()) });

export namespace WiFiNetworkDiagnosticsCluster {
    /**
     * These are optional features supported by WiFiNetworkDiagnosticsCluster.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.14.4
     */
    export enum Feature {
        /**
         * PacketCounts
         *
         * Node makes available the counts for the number of received and transmitted packets on the Wi-Fi interface.
         */
        PacketCounts = "PacketCounts",

        /**
         * ErrorCounts
         *
         * Node makes available the counts for the number of errors that have occurred during the reception and
         * transmission of packets on the Wi-Fi interface.
         */
        ErrorCounts = "ErrorCounts"
    };

    export type Type<T extends TypeFromPartialBitSchema<typeof Metadata.features>> = 
        typeof Metadata
        & { supportedFeatures: T }
        & typeof BaseComponent
        & (T extends { errorCounts: true } ? typeof ErrorCountsComponent : {})
        & (T extends { packetCounts: true } ? typeof PacketCountsComponent : {});

    /**
     * WiFiNetworkDiagnostics cluster metadata.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 11.14
     */
    export const Metadata = ClusterMetadata({
        id: 0x36,
        name: "WiFiNetworkDiagnostics",
        revision: 1,

        features: {
            /**
             * PacketCounts
             *
             * Node makes available the counts for the number of received and transmitted packets on the Wi-Fi
             * interface.
             */
            packetCounts: BitFlag(0),

            /**
             * ErrorCounts
             *
             * Node makes available the counts for the number of errors that have occurred during the reception and
             * transmission of packets on the Wi-Fi interface.
             */
            errorCounts: BitFlag(1)
        }
    });

    /**
     * A WiFiNetworkDiagnosticsCluster supports these elements for all feature combinations.
     */
    export const BaseComponent = ClusterComponent({
        attributes: {
            /**
             * The BSSID attribute SHALL indicate the BSSID for which the Wi-Fi network the Node is currently connected.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.1
             */
            bssid: Attribute(
                0,
                TlvNullable(TlvByteString.bound({ minLength: 6, maxLength: 6 })),
                { default: null, readAcl: AccessLevel.View }
            ),

            /**
             * The SecurityType attribute SHALL indicate the current type of Wi-Fi security used.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.2
             */
            securityType: Attribute(
                1,
                TlvNullable(TlvEnum<TlvSecurityTypeEnum>()),
                { default: null, readAcl: AccessLevel.View }
            ),

            /**
             * The WiFiVersion attribute SHALL indicate the current 802.11 standard version in use by the Node, per the
             * table below.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.3
             */
            wiFiVersion: Attribute(
                2,
                TlvNullable(TlvEnum<TlvWiFiVersionEnum>()),
                { default: null, readAcl: AccessLevel.View }
            ),

            /**
             * The ChannelNumber attribute SHALL indicate the channel that Wi-Fi communication is currently operating
             * on.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.4
             */
            channelNumber: Attribute(3, TlvNullable(TlvUInt16), { readAcl: AccessLevel.View }),

            /**
             * The RSSI attribute SHALL indicate the current RSSI of the Node’s Wi-Fi radio in dBm.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.5
             */
            rssi: Attribute(
                4,
                TlvNullable(TlvInt8.bound({ min: -120 })),
                { omitChanges: true, default: null, readAcl: AccessLevel.View }
            ),

            /**
             * The CurrentMaxRate attribute SHALL indicate the current maximum PHY rate of transfer of data in
             * bits-per-second.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.12
             */
            currentMaxRate: OptionalAttribute(11, TlvNullable(TlvUInt64), { omitChanges: true, readAcl: AccessLevel.View })
        },

        events: {
            /**
             * The Disconnection Event SHALL indicate that a Node’s Wi-Fi connection has been disconnected as a result
             * of de-authenticated or dis-association and indicates the reason.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.1
             */
            disconnection: OptionalEvent(0, EventPriority.Info, TlvDisconnectionEvent),

            /**
             * The AssociationFailure event SHALL indicate that a Node has attempted to connect, or reconnect, to a
             * Wi-Fi access point, but is unable to successfully associate or authenticate, after exhausting all
             * internal retries of its supplicant.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.2
             */
            associationFailure: OptionalEvent(1, EventPriority.Info, TlvAssociationFailureEvent),

            /**
             * The ConnectionStatus Event SHALL indicate that a Node’s connection status to a Wi-Fi network has
             * changed. Connected, in this context, SHALL mean that a Node acting as a Wi-Fi station is successfully
             * associated to a Wi-Fi Access Point.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.8.3
             */
            connectionStatus: OptionalEvent(2, EventPriority.Info, TlvConnectionStatusEvent)
        }
    });

    /**
     * A WiFiNetworkDiagnosticsCluster supports these elements if it supports feature ErrorCounts.
     */
    export const ErrorCountsComponent = ClusterComponent({
        attributes: {
            /**
             * The BeaconLostCount attribute SHALL indicate the count of the number of missed beacons the Node has
             * detected. If the Node does not have an ability to count beacons expected and not received, this value
             * MAY remain set to zero.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.6
             */
            beaconLostCount: Attribute(5, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The OverrunCount attribute SHALL indicate the number of packets dropped either at ingress or egress, due
             * to lack of buffer memory to retain all packets on the network interface. The OverrunCount attribute
             * SHALL be reset to 0 upon a reboot of the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.13
             */
            overrunCount: Attribute(12, TlvNullable(TlvUInt64), { omitChanges: true, readAcl: AccessLevel.View })
        },

        commands: {
            /**
             * Reception of this command SHALL reset the following attributes to 0:
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.7.1
             */
            resetCounts: Command(0, TlvNoArguments, 0, TlvNoResponse)
        }
    });

    /**
     * A WiFiNetworkDiagnosticsCluster supports these elements if it supports feature PacketCounts.
     */
    export const PacketCountsComponent = ClusterComponent({
        attributes: {
            /**
             * The BeaconRxCount attribute SHALL indicate the count of the number of received beacons. The total number
             * of expected beacons that could have been received during the interval since association SHOULD match the
             * sum of BeaconRxCount and BeaconLostCount. If the Node does not have an ability to report count of
             * beacons received, this value MAY remain set to zero.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.7
             */
            beaconRxCount: Attribute(6, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The PacketMulticastRxCount attribute SHALL indicate the number of multicast packets received by
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.8
             */
            packetMulticastRxCount: Attribute(7, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The PacketMulticastTxCount attribute SHALL indicate the number of multicast packets transmitted by the
             * Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.9
             */
            packetMulticastTxCount: Attribute(8, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The PacketUnicastRxCount attribute SHALL indicate the number of unicast packets received by the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.10
             */
            packetUnicastRxCount: Attribute(9, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View }),

            /**
             * The PacketUnicastTxCount attribute SHALL indicate the number of unicast packets transmitted by the Node.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 11.14.6.11
             */
            packetUnicastTxCount: Attribute(10, TlvNullable(TlvUInt32), { omitChanges: true, readAcl: AccessLevel.View })
        }
    });

    /**
     * This cluster supports all WiFiNetworkDiagnostics features.  It may support illegal feature combinations.
     *
     * If you use this cluster you must manually specify which features are active and ensure the set of active
     * features is legal per the Matter specification.
     */
    export const Complete = Cluster({
        ...Metadata,
        attributes: { ...BaseComponent.attributes, ...ErrorCountsComponent.attributes, ...PacketCountsComponent.attributes },
        events: { ...BaseComponent.events },
        commands: { ...ErrorCountsComponent.commands }
    });
};