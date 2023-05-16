/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { ClientIfaceImpl, ServerIfaceImpl } from "./ClusterIfaceImpl.js";
import { ThreadAndEthernetNetworkCommissioningCluster } from "../index.js";
import { ByteArray } from "../../util/index.js"

import { TypeFromSchema } from "../../tlv/TlvSchema.js";

type Networks = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.attributes.networks.schema>;

type ScanNetworksRequest = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.scanNetworks.requestSchema>;

type ScanNetworksResponse = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.scanNetworks.responseSchema>;

type RemoveNetworkRequest = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.removeNetwork.requestSchema>;

type RemoveNetworkResponse = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.removeNetwork.responseSchema>;

type ConnectNetworkRequest = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.connectNetwork.requestSchema>;

type ConnectNetworkResponse = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.connectNetwork.responseSchema>;

type ReorderNetworkRequest = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.reorderNetwork.requestSchema>;

type ReorderNetworkResponse = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.reorderNetwork.responseSchema>;

type AddOrUpdateThreadNetworkRequest = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.addOrUpdateThreadNetwork.requestSchema>;

type AddOrUpdateThreadNetworkResponse = TypeFromSchema<typeof ThreadAndEthernetNetworkCommissioningCluster.commands.addOrUpdateThreadNetwork.responseSchema>;

export interface ThreadAndEthernetNetworkCommissioningInterface {
    maxNetworks: number;
    addMaxNetworksListener(listener: (newValue: number, oldValue: number) => void): void;
    removeMaxNetworksListener(listener: (newValue: number, oldValue: number) => void): void;

    networks: Networks[];
    addNetworksListener(listener: (newValue: Networks[], oldValue: Networks[]) => void): void;
    removeNetworksListener(listener: (newValue: Networks[], oldValue: Networks[]) => void): void;

    interfaceEnabled: boolean;
    setInterfaceEnabled(value: boolean): Promise<void>;
    addInterfaceEnabledListener(listener: (newValue: boolean, oldValue: boolean) => void): void;
    removeInterfaceEnabledListener(listener: (newValue: boolean, oldValue: boolean) => void): void;

    lastNetworkingStatus: number | undefined;
    addLastNetworkingStatusListener(listener: (newValue: number | undefined, oldValue: number | undefined) => void): void;
    removeLastNetworkingStatusListener(listener: (newValue: number | undefined, oldValue: number | undefined) => void): void;

    lastNetworkId: ByteArray | undefined;
    addLastNetworkIdListener(listener: (newValue: ByteArray | undefined, oldValue: ByteArray | undefined) => void): void;
    removeLastNetworkIdListener(listener: (newValue: ByteArray | undefined, oldValue: ByteArray | undefined) => void): void;

    lastConnectErrorValue: number | undefined;
    addLastConnectErrorValueListener(listener: (newValue: number | undefined, oldValue: number | undefined) => void): void;
    removeLastConnectErrorValueListener(listener: (newValue: number | undefined, oldValue: number | undefined) => void): void;

    scanMaxTimeSeconds?: number;
    addScanMaxTimeSecondsListener(listener: (newValue: number, oldValue: number) => void): void;
    removeScanMaxTimeSecondsListener(listener: (newValue: number, oldValue: number) => void): void;

    connectMaxTimeSeconds?: number;
    addConnectMaxTimeSecondsListener(listener: (newValue: number, oldValue: number) => void): void;
    removeConnectMaxTimeSecondsListener(listener: (newValue: number, oldValue: number) => void): void;

    sendScanNetworks(request: ScanNetworksRequest): Promise<ScanNetworksResponse>;
    sendRemoveNetwork(request: RemoveNetworkRequest): Promise<RemoveNetworkResponse>;
    sendConnectNetwork(request: ConnectNetworkRequest): Promise<ConnectNetworkResponse>;
    sendReorderNetwork(request: ReorderNetworkRequest): Promise<ReorderNetworkResponse>;
    sendAddOrUpdateThreadNetwork(request: AddOrUpdateThreadNetworkRequest): Promise<AddOrUpdateThreadNetworkResponse>;
}

export const ThreadAndEthernetNetworkCommissioningClientImpl = ClientIfaceImpl<ThreadAndEthernetNetworkCommissioningInterface>(ThreadAndEthernetNetworkCommissioningCluster);
export const ThreadAndEthernetNetworkCommissioningServerImpl = ServerIfaceImpl<ThreadAndEthernetNetworkCommissioningInterface>(ThreadAndEthernetNetworkCommissioningCluster);
