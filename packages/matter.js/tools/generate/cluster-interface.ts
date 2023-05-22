/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

// Generates TypeScript interfaces for each cluster into src/cluster/interface

import { clean, TsFile, CodeModel } from "./util.js";

import * as tlv from "../../src/tlv/index.js";
import { GlobalAttributes } from "../../src/cluster/Cluster.js";

clean("cluster/interface", "Interface");

const GLOBAL_ATTRIBUTE_IDS = new Set(Object.values(GlobalAttributes({})).map((attribute) => attribute.id));

class TypeContext {
    constructor(public file: TsFile, public definitions = file.section()) { }

    typeName = "";
    typeSource = "";
}

function mapType(type: tlv.TlvSchema<any>, context: TypeContext): string {
    switch (type.constructor) {
        case tlv.NullableSchema:
            return `${mapType((<tlv.NullableSchema<any>>type).schema, context)} | undefined`;

        case tlv.VoidSchema:
            return "void";

        case tlv.AnySchema:
            return "any";

        case tlv.TlvWrapper:
            return mapType((<tlv.TlvWrapper<any, any>>type).underlyingSchema, context);

        case tlv.StringSchema:
            if ((<tlv.StringSchema<any>>type).type == tlv.TlvType.ByteString) {
                context.file.addImport("../../util/index", "ByteArray");
                return "ByteArray";
            }
            return "string";

        case tlv.BooleanSchema:
            return "boolean";

        case tlv.TlvNumberSchema:
            return "number";

        case tlv.ArraySchema:
            return `${mapType((<tlv.ArraySchema<any>>type).elementSchema, context)}[]`;

        case tlv.ObjectSchema:
            context.file.addImport("../../tlv/TlvSchema", "TypeFromSchema");
            context.definitions.add(`type ${context.typeName} = TypeFromSchema<typeof ${context.typeSource}>;`);
            return context.typeName;
    }

    return "any";
}

const index = new TsFile("cluster/interface/index");

CodeModel.clusters.forEach((cluster) => {
    const file = new TsFile(`cluster/interface/${cluster.interfaceName}`);
    const context = new TypeContext(file);

    file.addImport("../index", cluster.definitionName);
    file.addImport("../index", "ClusterInterface");

    const module = file.block(`namespace ${cluster.name}`);
    const state = module.block(`export type State =`);
    const client = module.block(`export interface Client`);
    const server = module.block(`export interface Server`);

    // Create sections for commands so they appear at the top of the client
    // and server interfaces
    const clientCommands = client.section();
    const serverCommands = server.section();

    cluster.attributes.forEach((attr) => {
        if (GLOBAL_ATTRIBUTE_IDS.has(attr.id)) return;

        context.typeName = attr.typeName;
        context.typeSource = `${attr.source}.schema`;

        const type = mapType(attr.schema, context);

        const readonly = attr.fixed ? "readonly " : "";
        state.add(`${readonly}${attr.fieldName}${attr.optional ? "?" : ""}: ${type};`);

        [client, server].forEach((target) =>
            target.add(`${attr.handler}(value: ${type}, previous: ${type}): void;`));
    });

    cluster.commands.forEach((command) => {
        context.typeName = `${command.typeName}Request`;
        context.typeSource = `${command.source}.requestSchema`;
        const request = command.requestSchema instanceof tlv.TlvVoid.constructor
            ? ""
            : `request: ${mapType(command.requestSchema, context)}`;

        context.typeName = `${command.typeName}Response`;
        context.typeSource = `${command.source}.responseSchema`;
        const responseType = mapType(command.responseSchema, context);

        clientCommands.add(`${command.invoker}(${request}): Promise<${responseType}>;`)
        serverCommands.add(`${command.handler}(${request}): Promise<${responseType}>;`)
    });

    cluster.events.map((event) => {
        context.typeName = `${event.typeName}Event`;
        context.typeSource = `${event.source}.schema`;

        const type = mapType(event.schema, context);
        client.add(`${event.handler}(event: ${type}): Promise<void>`);
        server.add(`${event.invoker}(event: ${type}): Promise<void>;`);
    });

    let clientName = `${cluster.name}.Client`, serverName = `${cluster.name}.Server`;
    if (!client.length) {
        clientName = "{}";
        client.remove();
    }
    if (!server.length) {
        serverName = "{}";
        server.remove();
    }

    file.block(`export const ${cluster.name}: ClusterInterface<${cluster.name}.State, ${clientName}, ${serverName}> =`)
        .add(`definition: ${cluster.definitionName}`);
    file.save();

    index.add(`export { ${cluster.name} } from "./${cluster.interfaceName}.js";`)
});

index.save();
