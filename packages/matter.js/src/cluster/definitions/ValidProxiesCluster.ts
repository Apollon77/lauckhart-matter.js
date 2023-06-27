/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Cluster, WritableFixedAttribute, Command, TlvNoResponse } from "../../cluster/Cluster.js";
import { TlvArray } from "../../tlv/TlvArray.js";
import { TlvObject, TlvField } from "../../tlv/TlvObject.js";
import { TlvUInt64 } from "../../tlv/TlvNumber.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";

/**
 * Encapsulates the Node ID of a Valid Proxy.
 *
 * @see {@link MatterCoreSpecificationV1_1} § 9.15.15.4.1
 */
export const ValidProxyStruct = TlvObject({ NodeId: TlvField(1, TlvUInt64) });

export namespace ValidProxiesCluster {
    /**
     * Proxy Valid
     *
     * Cluster to control Proxy Valid
     *
     * This cluster definition includes all elements an implementation may
     * support.  For type safety, use `ValidProxies.with()` and a list of
     * supported features.
     *
     * @see {@link MatterCoreSpecificationV1_1} § 9.15.15
     */
    export const Complete = Cluster({
        id: 0x44,
        name: "ValidProxies",
        revision: 1,

        attributes: {
            /**
             * List of valid proxies that can proxy this Node. Each entry in
             * this list is fabric-scoped.
             *
             * @see {@link MatterCoreSpecificationV1_1} § 9.15.15.5.1
             */
            validProxyList: WritableFixedAttribute(0, TlvArray(ValidProxyStruct), { persistent: true })
        },

        commands: {
            /**
             * @see {@link MatterCoreSpecificationV1_1} § 9.15.15.6
             */
            getValidProxiesRequest: Command(0, TlvNoArguments, 1, TlvNoArguments),

            /**
             * @see {@link MatterCoreSpecificationV1_1} § 9.15.15.6
             */
            getValidProxiesResponse: Command(1, TlvNoArguments, 1, TlvNoResponse)
        }
    });
};