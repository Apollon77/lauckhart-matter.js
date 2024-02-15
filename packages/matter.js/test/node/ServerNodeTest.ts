/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NodeId } from "../../src/datatype/NodeId.js";
import { VendorId } from "../../src/datatype/VendorId.js";
import { OnOffLightDevice } from "../../src/endpoint/definitions/device/OnOffLightDevice.js";
import { ByteArray } from "../../src/util/ByteArray.js";
import { MockServerNode } from "./mock-server-node.js";

describe("ServerNode", () => {
    it("starts and stops and emits correct lifecycle changes", async () => {
        const node = new MockServerNode();

        const changes = new Array<[string, string]>();

        node.lifecycle.changed.on((type, part) => {
            changes.push([type, part.toString()]);
        });

        let disposal: Promise<void> | undefined;

        node.lifecycle.ready.on(() => {
            disposal = node[Symbol.asyncDispose]();
        });

        node.add(OnOffLightDevice);

        await node.run();

        expect(disposal).not.undefined;

        await disposal;

        expect(changes).deep.equals([
            ["ready", "node0"],
            ["installed", "node0.?"],
            ["idAssigned", "node0.part0"],
            ["numberAssigned", "node0.part0"],
            ["treeReady", "node0.part0"],
            ["treeReady", "node0"],
            ["ready", "node0.part0"],
            ["destroyed", "node0.part0"],
            ["destroyed", "node0"],
        ]);
    });

    it("commissions", async () => {
        const { node } = await commission();

        node.cancel();

        if (node.lifecycle.isOnline) {
            await node.lifecycle.offline;
        }

        await node.destroy();
    });

    it("times out commissioning", async () => {
        const { node } = await almostCommission();

        const opcreds = node.state.operationalCredentials;

        expect(opcreds.commissionedFabrics).equals(1);

        await MockTime.advance(Fixtures.failsafeLengthS * 1000 + 1);

        if (opcreds.commissionedFabrics > 0) {
            await node.events.operationalCredentials.commissionedFabrics$Change;
        }

        expect(opcreds.commissionedFabrics).equals(0);

        await node.destroy();
    });

    it("decommissions and recommissions", async () => {
        const { node, context } = await commission();

        const fabricIndex = await node.online(
            context,
            async agent => agent.operationalCredentials.state.currentFabricIndex,
        );

        await node.online(context, async agent => {
            await agent.operationalCredentials.removeFabric({ fabricIndex });
        });

        // Node should decommission...
        if (node.lifecycle.isCommissioned) {
            await node.lifecycle.decommissioned;
        }

        // ...then go offline...
        if (node.lifecycle.isOnline) {
            await node.lifecycle.offline;
        }

        // ...then go back online
        // TODO - need fixes in MatterDevice for following steps to work
        // await MockTime.resolve(node.lifecycle.online);

        // await commission(node);

        await node.destroy();
    });

    it("advertises correctly", () => {
        // TODO
    });
});

async function almostCommission(node?: MockServerNode) {
    if (!node) {
        node = await MockServerNode.createOnline();
    }

    const session = await node.createSession();

    const context = { session, command: true };

    await node.online(context, async agent => {
        await agent.generalCommissioning.armFailSafe({ expiryLengthSeconds: Fixtures.failsafeLengthS, breadcrumb: 4 });
    });

    await node.online(context, async agent => {
        await agent.generalCommissioning.setRegulatoryConfig({
            newRegulatoryConfig: 2,
            countryCode: "XX",
            breadcrumb: 5,
        });
    });

    await node.online(context, async agent => {
        agent.operationalCredentials.certificateChainRequest({ certificateType: 2 });
    });

    await node.online(context, async agent => {
        agent.operationalCredentials.certificateChainRequest({ certificateType: 1 });
    });

    await node.online(context, async agent => {
        agent.operationalCredentials.attestationRequest({ attestationNonce: Fixtures.attestationNonce });
    });

    await node.online(context, async agent => {
        agent.operationalCredentials.csrRequest({ csrNonce: Fixtures.csrNonce });
    });

    await node.online(context, async agent => {
        agent.operationalCredentials.addTrustedRootCertificate({ rootCaCertificate: Fixtures.caCert });
    });

    await node.online(context, async agent => {
        await agent.operationalCredentials.addNoc({
            nocValue: Fixtures.nocValue,
            icacValue: Fixtures.icacValue,
            ipkValue: Fixtures.ipkValue,
            caseAdminSubject: NodeId(112233),
            adminVendorId: VendorId(65521),
        });
    });

    return { node, context };
}

async function commission(existingNode?: MockServerNode) {
    const { node, context } = await almostCommission(existingNode);

    await node.online(context, async agent => {
        // Need to wait for broadcaster cleanup here
        await MockTime.resolve(agent.generalCommissioning.commissioningComplete());
    });

    if (!node.lifecycle.isCommissioned) {
        await node.lifecycle.commissioned;
    }

    return { node, context };
}

namespace Fixtures {
    function u(hex: string) {
        return ByteArray.fromHex(hex);
    }

    export const failsafeLengthS = 60;

    export const attestationNonce = u("2cfd6a1c253a03e0f5a9135d841bb443cee50be270ab122ee24b6b0775f53cc6");

    export const csrNonce = u("92c333f220a57c8178863176aeebf1a3ef4d8d45f2d4bd1cb5d1b63a29b8eb3e");

    export const caCert = u(
        "1530010101240201370324140118260480228127260580254d3a370624140118240701240801300941048786311b1347352b08216bc91ecd9e03b1b791ad57f42587b8d62478b853a27414dd7816bbd657b241b3bcc2759998187d10e7e7668fce709bb6611318c19939370a3501290118240260300414898211523c4f998d57c940be9bd24360f503d356300514898211523c4f998d57c940be9bd24360f503d35618300b400d1c064fc9269b4309259f4cbed23f7f10059e29c9a5c728c73b492e8e495af264a4b5338fb2eaefdb3012eeb965eb9eb67f36562a3859c190574929f73eac6a18",
    );

    export const nocValue = u(
        "1530010101240201370324130218260480228127260580254d3a3706241501241101182407012408013009410458b5d8a547375bae6f7e36f6969f6b8322f47386ec57efd7d2b93ec9d559c624e7526c4cfc9590fce7f6b796c66f5cff4cb43cc6dd0d86f78e9b349ca55137c9370a350128011824020136030402040118300414b02b87728e8fe0d7becfe48e60e59962c91531c730051494d101c4667b1123bffe5ccbc3a88dba7a9bc94018300b40fbf900de9b3e2771363af8902eff38edc7b129d54c111087e0221d58ca4afbc74bfa379248a4a2a85ae21baeb33b3cc1dae2e98aa2dbf663081ede54a05bade318",
    );

    export const icacValue = u(
        "1530010101240201370324140118260480228127260580254d3a370624130218240701240801300941045789231805399ce966e541c5d4f554f8c079ad6e9b45d4a3a69d848a4b495c2d10e94270a21bb87bd6241d2d0c05fe481455f1b3a1f51dc8d09e16567946032f370a350129011824026030041494d101c4667b1123bffe5ccbc3a88dba7a9bc940300514898211523c4f998d57c940be9bd24360f503d35618300b40ea5633574251e3a556b6e2adb06eee429a1eb9f7d884415dddaed609637adbe9ee0ee818d92d95acf60bdd548967d9976a18d4081f63964ce7312dff09aec8ec18",
    );

    export const ipkValue = u("74656d706f726172792069706b203031");
}
