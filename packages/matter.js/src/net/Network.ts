/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { UdpChannel, UdpChannelOptions } from "./UdpChannel.js";
import { MatterError, NoProviderError } from "../common/MatterError.js";

export class NetworkError extends MatterError { }

export abstract class Network {
    static get: () => Network = () => { throw new NoProviderError("No provider configured"); };

    abstract getNetInterfaces(): string[];
    abstract getIpMac(netInterface: string): { mac: string, ips: string[] } | undefined;
    abstract createUdpChannel(options: UdpChannelOptions): Promise<UdpChannel>;
}
