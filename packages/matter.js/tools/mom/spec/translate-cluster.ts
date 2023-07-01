/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from "../../../src/log/Logger.js";
import { AnyElement, AttributeElement, ClusterElement, CommandElement, DatatypeElement, EventElement, Globals, Metatype } from "../../../src/model/index.js";
import { camelize } from "../../../src/util/String.js";
import { ClusterReference, HtmlReference } from "./spec-types.js";
import { Integer, Identifier, LowerIdentifier, translateTable, Str, Optional, UpperIdentifier, Alias, NoSpace, translateRecordsToMatter, Children, chooseIdentityAliases, Code } from "./translate-table.js";

const logger = Logger.get("translate-cluster");

const TYPE_ERRORS: { [badType: string]: string} = {
    "attribute-id": "attrib-id",
    "bitmap8": "map8",
    "node-idx": "node-id",
    "SystemTimeMicroseconds": "systime-us",
    "HardwareAddress": "hwadr",
    "String": "string",
    "variable": "any"
}

function fixTypeError(type: string | undefined) {
    if (type != undefined && TYPE_ERRORS[type]) {
        return TYPE_ERRORS[type];
    }
    return type;
}

// Translate from DOM -> MOM
export function* translateCluster(definition: ClusterReference) {
    const children = Array<ClusterElement.Child>();

    const metadata = translateMetadata(definition, children);
    if (!metadata) {
        return;
    }

    translateInvokable(definition, children);
    translateDatatypes(definition, children);

    for (const [id, name] of metadata.ids.entries()) {
        const idStr = id == undefined ? "(no ID)" : `0x${id.toString(16)}`;
        logger.debug(`0x${idStr} ${name}`, Logger.dict({ rev: metadata.revision, cls: metadata.classification }));
        const cluster = ClusterElement({
            id: id,
            name: name,
            classification: metadata.classification,
            children: children,
            type: metadata.derivesFrom,
            xref: definition.xref
        });

        addDetails(cluster, definition);

        yield cluster;
    }
}

// Load misc. values related to cluster definition
function translateMetadata(definition: ClusterReference, children: Array<ClusterElement.Child>) {
    const ids = translateIds();
    if (!ids) {
        logger.warn(`no IDs for ${definition.name}, skipping`);
        return;
    }

    const { classification, derivesFrom } = translateClassification();
    const revision = translateRevision();
    translateFeatures();

    return {
        ids: ids,
        classification: classification,
        revision: revision,
        derivesFrom
    }

    function translateIds() {
        const ids = translateTable("id", definition.ids, {
            // Core spec uses "identifier", cluster spec uses "id".
            // Because why would you to conform to a standard when you're
            // defining a standard?  Normalize to "id"
            //
            // Note that ID is optional because base clusters may have no ID
            id: Alias(Str, "identifier"),
            name: Identifier
        });
    
        // Some tables list the primary ID twice; only accept the secondary
        // instance in core spec; only accept the primary in cluster spec
        const uniqueIds = new Map<number | undefined, string>();
        for (const record of ids) {
            let idStr = record.id.trim().toLowerCase();
            let id;
            if (idStr == "n/a") {
                // Base cluster
                id = undefined;
            } else {
                id = Number.parseInt(idStr);
                if (Number.isNaN(id)) {
                    logger.error(`Skipping cluster with non-numeric ID ${idStr}`);
                    continue;
                }
            }

            if (id == 0x8) {
                // Level control table is just kind of fubar
                uniqueIds.set(id, "LevelControl");
            } else {
                uniqueIds.set(id, camelize(record.name || definition.name));
            }
        }
    
        if (!uniqueIds.size) {
            return false;
        }
    
        return uniqueIds;
    }
    
    function translateClassification() {
        const classifications = translateTable("classfication", definition.classifications, {
            hierarchy: Optional(Str),
            role: Optional(LowerIdentifier),
            scope: Optional(Alias(LowerIdentifier, "context"))
        });
    
        let classification: ClusterElement.Classification;
        if (classifications[0]?.role == "utility") {
            if (classifications[0]?.scope == "node") {
                classification = ClusterElement.Classification.NodeUtility;
            } else {
                classification = ClusterElement.Classification.EndpointUtility;
            }
        } else {
            classification = ClusterElement.Classification.Application;
        }

        let derivesFrom = classifications[0]?.hierarchy;
        if (derivesFrom) {
            derivesFrom = derivesFrom.replace(/^derive[sd] from /i, "");
            derivesFrom = camelize(derivesFrom);
            if (derivesFrom == "Base") {
                derivesFrom = undefined;
            }
        }
    
        return { classification, derivesFrom };
    }
    
    function translateRevision() {
        const revisions = translateTable("revision", definition.revisions, {
            revision: Alias(Integer, "rev")
        });
    
        let revision = revisions[revisions.length - 1]?.revision;
        if (revision == undefined) {
            logger.warn(`no revisions for ${definition.name}, assuming "1"`);
            revision = 1;
        }
    
        children.push({ ...Globals.ClusterRevision, default: revision });
    
        return revision;
    }
    
    function translateFeatures() {
        const records = translateTable("feature", definition.features, {
            id: Alias(Integer, "bit"),
            conformance: Optional(Code),
            details: Optional(Alias(Str, "description", "summary")),

            // Must define after details which uses description column
            description: Optional(Alias(Identifier, "feature", "name")),
    
            // Must define after description which uses name column
            name: Alias(UpperIdentifier, "code", "feature"),
    
            // Actual type is numeric but we let Model handle that translation
            default: Optional(Alias(NoSpace, "def"))
        });
    
        const values = translateRecordsToMatter("feature", records, DatatypeElement);
        values && children.push({
            tag: Globals.FeatureMap.tag,
            id: Globals.FeatureMap.id,
            name: Globals.FeatureMap.name,
            type: "FeatureMap",
            children: values,
            xref: definition.features?.xref
        });
    }
}

// For some reason, "default" fabric access appears in an informational row
// instead of the access column in many of the core definitions.  Fix this.
function applyAccessNotes(fields?: HtmlReference, records?: { access?: string }[]) {
    if (!fields?.table?.notes.length || !records) {
        return;
    }

    // Determine what the access flag should be
    let flag: string | undefined;
    for (const n of fields.table.notes) {
        const match = n.textContent?.match(/access quality: fabric[\s\-](\w+)/i);
        if (match) {
            const quality = match[1].toLowerCase();

            switch (quality) {
                case "scoped":
                    flag = "F";
                    break;

                case "sensitive":
                    flag = "S";
                    break;

                default:
                    logger.warn(`ignoring unrecognized fabric access quality ${quality}`);
            }

            if (flag) {
                break;
            }
        }
    }

    // If we have the flag, apply it unless the row already has an access flag
    if (flag) {
        for (const r of records) {
            const access = r.access;
            if (!access) {
                r.access = flag;
            } else if (!access.match(/[SF]/i)) {
                r.access += flag;
            }
        }
    }
}

// Translate fields for an attribute or struct
function translateFields(desc: string, fields?: HtmlReference) {
    const records = translateTable(desc, fields, {
        id: Integer,
        name: Alias(Identifier, "field"),

        // Not really optional but we want to process rows even if missing
        type: Optional(NoSpace),

        constraint: Optional(Str),
        quality: Optional(Str),
        default: Optional(NoSpace),
        access: Optional(Str),
        conformance: Optional(Code),
        children: Children(translateValueChildren)
    });

    records.forEach(r => {
        r.type = fixTypeError(r.type);
        if (typeof r.default == "string") {
            switch (r.default.toLowerCase()) {
                case "desc": // See description
                case "n/a": // Not available
                case "ms": // Manufacturer specific
                case "-": // Sometimes used for "none"
                case "–": // This is perhaps the dash used for "none"
                    delete r.default;
                    break;

                case "varied":
                    r.default = "any";
                    break;

                case "!lt:0lt:1":
                    // Pump control conditional defaults; just ignore
                    delete r.default;
                    break;

                default:
                    // Sometimes enum values are suffixed with enum name in parenthesis
                    if (r.default.match(/^\d+\(.*\)$/)) {
                        r.default = r.default.replace(/^(\d+).*/, "$1");
                    }

                    // Sometimes default value strings have "" around them
                    if (r.default.startsWith('"') && r.default.endsWith('"')) {
                        r.default = r.default.slice(1, r.default.length - 1);
                    }
                    break;
            }
        }
    });

    applyAccessNotes(fields, records);

    return records;
}

function hasColumn(definition: HtmlReference, ...names: string[]) {
    for (const name of names) {
        if (definition.table?.rows[0]?.[name] != undefined) {
            return true;
        }
    }
    return false;
}

// Translate children of enums, bitmaps, structs, commands, attributes and
// events.  If "parent" is none of these, returns undefined
function translateValueChildren(tag: string, parent: undefined | { type?: string }, definition: HtmlReference): DatatypeElement[] | undefined {
    let type = parent?.type;
    if (type == undefined) {
        switch (tag) {
            case "command":
            case "event":
                type = "struct";
                break;

            default:
                return;
        }
    }

    const dt = (Globals as any)[type];
    switch (dt?.metatype) {
        case Metatype.enum: {
            // Column names are all over the place so examine the table to find
            // a "name" column.
            //
            // Originally mapped manually and had identified the following:
            //     "type", "description", "statuscode", "presentation", "endproducttype", "effect"
            //
            // Turns out after this conversion we already had them all but
            // leaving this logic in as it's more general and will adapt better
            // in the future
            const { ids, names } = chooseIdentityAliases(
                definition,
                [ "id", "value", "enum" ],
                [ "name", "type", "statuscode", "description" ]
            );

            let records = translateTable("value", definition, {
                id: Alias(Integer, ...ids),
                name: Alias(Identifier, ...names),
                conformance: Optional(Code),
                description: Optional(Alias(Str, "notes")),
                meaning: Optional(Str)
            });

            records = records.filter(r => r.name != "Reserved");

            return translateRecordsToMatter("value", records, DatatypeElement);
        }

        case Metatype.bitmap: {
            let records: { id?: number, name: string }[];

            if (hasColumn(definition, "meaning")) {
                // Window covering cluster just plain made up their own format.
                // Implemented a parser but maintaining is more work than just
                // defining manually so tossed it
                logger.warn("Ignoring weird window covering bitmasks");
                return [];
            } else {
                // Standard(ish) bitmap table
                //
                // Previously had identified aliases as "mappedprotocol", "statebit", "function", "relatedattribute"
                // but this was only a partial list.  Auto-detection makes more sense
                const { ids, names } = chooseIdentityAliases(definition, [ "bit", "id" ], [ "name", "eventdescription" ]);
                records = translateTable("bit", definition, {
                    id: Alias(Integer, ...ids),
                    name: Alias(Identifier, ...names),
                    description: Optional(Alias(Str, "summary"))
                });
            }

            return translateRecordsToMatter("bit", records, DatatypeElement);
        }

        case Metatype.object: {
            const records = translateFields("field", definition);
            return translateRecordsToMatter("field", records, DatatypeElement);
        }
    }
}

// Load attributes, events and commands
function translateInvokable(definition: ClusterReference, children: Array<ClusterElement.Child>) {    
    translateAttributes();
    translateEvents();
    translateCommands();
    translateStatusCodes();

    function translateAttributes() {
        const attributeSets = [ definition.attributes ];
        if (definition.attributeSets) {
            attributeSets.push(...definition.attributeSets);
        }
        for (const attributeSet of attributeSets) {
            const records = translateFields("attribute", attributeSet);
            const attributes = translateRecordsToMatter("attribute", records, AttributeElement);
            if (attributes) {
                children.push(...attributes);
            }
        }
    }
    
    function translateCommands() {
        const records = translateTable("command", definition.commands, {
            id: Integer,
            name: Identifier,
            direction: Str,
            response: Optional(Identifier),
            access: Optional(Str),
            conformance: Optional(Code),
            children: Children(translateValueChildren)
        });

        applyAccessNotes(definition.commands, records);
    
        const commands = translateRecordsToMatter("command", records, (r) => {
            let direction: CommandElement.Direction | undefined;
            if (r.direction.match(/client.*server/i)) {
                direction = CommandElement.Direction.Request;
            } else if (r.direction.match(/server.*client/i)) {
                direction = CommandElement.Direction.Response;
            }
    
            let response: string | undefined;
            switch (r.response) {
                case "Y":
                    response = "status";
                    break;
    
                case "N":
                case "":
                case undefined:
                    break;
    
                default:
                    response = r.response;
                    break;
            }
    
            return CommandElement({ ...r, response: response, direction: direction });
        });
        commands && children.push(...commands);
    }
    
    function translateEvents() {
        const records = translateTable("event", definition.events, {
            id: Integer,
            name: Identifier,
            priority: Optional(LowerIdentifier),
            access: Optional(Str),
            conformance: Optional(Code),
            children: Children(translateValueChildren)
        });

        applyAccessNotes(definition.events, records);
        
        let events = translateRecordsToMatter("event", records, (r) => {
            let priority: EventElement.Priority;
            switch (r.priority?.toLowerCase()) {
                case "debug":
                    priority = EventElement.Priority.Debug;
                    break;

                case "info":
                    priority = EventElement.Priority.Info;
                    break;

                case "critical":
                    priority = EventElement.Priority.Critical;
                    break;

                case undefined:
                    logger.warn("no priority defined, assuming CRITICAL");
                    priority = EventElement.Priority.Critical;
                    break;

                default:
                    logger.warn(`unrecognized priority "${r.priority}", assuming CRITICAL`)
                    priority = EventElement.Priority.Critical;
                }
            return EventElement({ ...r, priority });
        });
        events && children.push(...events);
    }

    function translateStatusCodes() {
        const records = translateTable("statusCodes", definition.statusCodes, {
            id: Alias(Integer, "statuscode"),
            name: Alias(Identifier, "value"),
            details: Alias(Str, "summary")
        });
        const statusCodes = translateRecordsToMatter("statusCodes", records, DatatypeElement);
        statusCodes && children.push(DatatypeElement({ name: "StatusCode", type: "status", children: statusCodes }));
    }
}

// Load datatypes
function translateDatatypes(definition: ClusterReference, children: Array<ClusterElement.Child>) {
    if (!definition.datatypes) {
        return;
    }

    for (const datatype of definition.datatypes) {
        Logger.nest(() => {
            const child = translateDatatype(datatype);
            if (child) {
                addDetails(child, datatype);
                children.push(child);
            }
        });
    }
    
    function translateDatatype(definition: HtmlReference) {
        let name = definition.name;
        const text = definition.firstParagraph?.textContent;
        if (!text) {
            logger.warn(`no text to search for base type`);
        }
        let match = text?.match(/derived from ([a-z0-9\-_]+)/i);
        let type = match?.[1];
    
        let description: string | undefined;

        type = fixTypeError(type);
    
        if (name.match(/enum$/i) || type?.match(/^enum/i)) {
            if (!type) {
                logger.warn(`no base detected, guessing enum8`)
                type = "enum8";
            }
        } else if (name.match(/bits$/i) || type?.match(/^map/i)) {
            if (!type) {
                logger.warn(`no base detected, guessing map8`);
                type = "map8";
            } else if (type.match(/^bitmap/)) {
                type = type.slice(3);
            }
        } else if (name.match(/struct$/i)
            || type == "struct"
            || (definition.table?.rows[0].type)
        ) {
            if (!type) {
                type = "struct";
            }
        } else if (name.match(/status$/i)) {
            if (!type) {
                type = "status";
            }
        } else if (match = name.match(/(.+) \((\S+) type\)/i)) {
            description = match[1];
            name = match[2];
        }

        if (!type && name.match(/\s/)) {
            // This isn't actually a datatype
            return;
        }

        const datatype = DatatypeElement({ type: type, name, description, xref: definition.xref });
        datatype.children = translateValueChildren("datatype", datatype, definition);
        return datatype;
    }
}

// A light attempt at making documentation seem slightly less repurposed
function extractUsefulDocumentation(p: HTMLParagraphElement) {
    return Str(p)
        .replace(/This data type is derived from \S+(?: and has its values listed below)?\./, "")
        .replace(/The data type \S+ is derived from \S+\./, "")
        .replace(/The data type of the(?: \w+)+ is derived from \S+\./, "")
        .replace(/The values of the(?: \w+)+ are listed below\./, "")
        .replace(/(?:The )?\S+ Data Type is derived from \S+\./, "")
        .replace(/, derived from \w+,/, "")
        .replace(/SHALL/g, "shall")
        .replace(/\s\s+/, "  ")
        .trim();
}

function addDetails(element: AnyElement, definition: HtmlReference) {
    let p = definition.firstParagraph;
    if (!p) {
        return;
    }
    let details = extractUsefulDocumentation(p);
    while (!details && p) {
        // These are useless as documentation.  Use the next paragraph or
        // simply leave undocumented
        if ((p.nextSibling as any)?.tagName == "P") {
            p = p?.nextSibling as HTMLParagraphElement;
            details = extractUsefulDocumentation(p);
        } else {
            return;
        }
    }
    if (details) {
        element.details = details;
    }
}