/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalError } from "@project-chip/matter.js/common";
import { Logger } from "@project-chip/matter.js/log";
import { Specification } from "@project-chip/matter.js/model";
import { camelize } from "../../util/string.js";
import { scanDocument } from "./scan-document.js";
import { ClusterReference, GlobalReference, HtmlReference } from "./spec-types.js";

const logger = Logger.get("load-clusters");

const FAKE_CLUSTER_NAMES = ["New", "Sample", "Disco Ball", "Super Disco Ball"];

const GlobalTypeSections: Partial<Record<Specification, Record<string, GlobalReference["format"]>>> = {
    core: {
        "Base Data Types": "datatypes",
        "Derived Data Types": "datatypes",
        "Global Elements": "elements",
        "Time of Day": "standalone",
        "Status Code Table": "statusCodes",
    },
};

interface SubsectionCollector {
    subsection: string;
    collector: (ref: HtmlReference) => void;
}

enum ScanDirective {
    // Ignore section in stream
    IGNORE = 1,

    // Treat as one-level higher than actual in stream
    POP = 2,
}

function isCluster(ref: HtmlReference, document: Specification, name: string) {
    return ref.xref.document === document && ref.name === name;
}

function isSection(ref: HtmlReference, ...sections: string[]) {
    return !!sections.find(section => ref.xref.section === section);
}

// Modify incoming stream to workaround specific spec issues
function applyPatches(subref: HtmlReference, clusterRef: HtmlReference) {
    if (isCluster(clusterRef, Specification.Core, "General Commissioning")) {
        if (isSection(subref, "11.9.6") && subref.name === "Commands" && !subref.table) {
            // In 1.1 spec, command table is not here...
            return ScanDirective.IGNORE;
        }

        if (
            isSection(subref, "11.9.6.1") &&
            subref.name === "Common fields in General Commissioning cluster responses" &&
            subref.table
        ) {
            // ...but here
            subref.name = "Commands";
            subref.detailSection = "11.9.6";
        }
    } else if (isCluster(clusterRef, Specification.Cluster, "Thermostat")) {
        if (isSection(subref, "4.3.9.6", "4.3.9.7")) {
            return ScanDirective.IGNORE;
        }

        if (isSection(subref, "4.3.3.1")) {
            // In 1.1 spec thermostat features is errantly nested under cluster identifiers
            return ScanDirective.POP;
        }
    } else if (isCluster(clusterRef, Specification.Cluster, "Content Launcher")) {
        if (isSection(subref, "6.7.3.2")) {
            // In 1.1. spec, SupportedStreamingProtocols bitmap is not here...
            return ScanDirective.IGNORE;
        } else if (isSection(subref, "6.7.3.2.1")) {
            // ...but here
            subref.name = "SupportedStreamingProtocols Attribute";
        }
    } else if (isCluster(clusterRef, Specification.Cluster, "Door Lock")) {
        // These two are nested one level too deep in 1.3 spec
        if (isSection(subref, "5.2.6.25.1", "5.2.6.25.2")) {
            return ScanDirective.POP;
        }
    }
}

/**
 * Collect the bits that define a cluster.  Here we are just building a tree of HTML nodes.  Conversion to Matter
 * elements happens in translate-cluster.
 *
 * The primary purpose of this function is to load clusters but it also loads bare "global" types when encountered.
 * There are not many global types and this allows us to process specs in a single pass.
 */
export function* loadClusters(clusters: HtmlReference): Generator<ClusterReference | GlobalReference> {
    // The definition we are building
    let definition: ClusterReference | GlobalReference | undefined;

    // A stack of functions that ingest subsections
    const collectors = Array<SubsectionCollector>();

    for (const subref of scanDocument(clusters)) {
        if (definition) {
            const directive = applyPatches(subref, definition);

            switch (directive) {
                case ScanDirective.IGNORE:
                    continue;

                case ScanDirective.POP:
                    collectors.pop();
                    break;
            }
        }

        while (collectors.length && !subref.xref.section.startsWith(collectors[collectors.length - 1].subsection)) {
            collectors.pop();
        }

        if (!collectors.length) {
            if (definition) {
                yield definition;
            }

            definition = identifyCluster(subref);
            if (definition) {
                collectors.push({
                    subsection: definition.xref.section,
                    collector: clusterCollector,
                });
            } else {
                definition = identifyGlobal(subref);
                if (definition) {
                    collectDetails(definition);
                }
            }
        }

        if (collectors.length) {
            collectors[collectors.length - 1].collector(subref);
        }
    }

    if (definition) {
        yield definition;
    }

    function identifyCluster(ref: HtmlReference): ClusterReference | undefined {
        // Core spec (and cluster spec >= 1.2) convention for clusters is heading suffixed with "Cluster"
        if (ref.name.endsWith(" Cluster")) {
            if (ref.xref.document === Specification.Core && Number.parseInt(ref.xref.section) < 3) {
                // There's some noise in early sections of core spec
                return;
            }

            const name = ref.name.slice(0, ref.name.length - 8);
            if (FAKE_CLUSTER_NAMES.indexOf(name) !== -1) {
                collectors.push({
                    subsection: ref.xref.section,
                    collector() {},
                });
                return;
            }

            return {
                type: "cluster",
                ...ref,
                name: ref.name.slice(0, ref.name.length - 8),
                path: ref.path,
            };
        }

        // Cluster spec convention is one cluster per sub-section except the first sub-section which summarizes the
        // section
        if (ref.xref.document === Specification.Cluster) {
            const sectionPath = ref.xref.section.split(".");
            if (sectionPath.length === 2 && sectionPath[1] !== "1") {
                return { type: "cluster", ...ref };
            }
        }
    }

    function clusterCollector(subref: HtmlReference) {
        if (definition?.type !== "cluster") {
            throw new InternalError(`Cluster collector invoked without an active cluster definition`);
        }

        if (subref.xref.section === definition.xref.section) {
            definition.prose = subref.prose;
        }

        const name = camelize(subref.name).toLowerCase();
        switch (name) {
            case "clusterid":
            case "clusteridentifiers":
                defineElement("ids", subref);
                break;

            case "features":
                defineElement("features", subref);
                break;

            case "revisionhistory":
                defineElement("revisions", subref);
                break;

            case "classification":
                defineElement("classifications", subref);
                break;

            case "attributes":
                defineElement("attributes", subref);
                break;

            case "commands":
                defineElement("commands", subref);
                break;

            case "events":
                defineElement("events", subref);
                break;

            case "statuscodes":
                if (subref.table) {
                    // Until 1.3 status codes were in a specialized table in the "status codes" sections
                    defineElement("statusCodes", subref);
                } else {
                    // After 1.3 the people that wanted it to be a proper datatype won halfway and it was moved into a
                    // "StatusCodeEnum Type" section, but still nested under a "Status Codes" section that only has a
                    // single subsection.  Mmm committees
                    collectDatatypes(definition, subref);
                }
                break;

            case "datatypes":
                // Datatypes are different than everybody else.  The types themselves are defined in subsections
                collectDatatypes(definition, subref);
                break;

            default:
                // "Attribute Set" is suffixed to sections containing a subset of attributes
                if (name.endsWith("attributeset")) {
                    if (!definition.attributeSets) {
                        definition.attributeSets = [];
                    }
                    logger.debug(`attribute set ${subref.name} § ${subref.xref.section}`);
                    definition.attributeSets.push(subref);
                    if (subref.table) {
                        collectDetails(subref);
                    }
                    break;
                }
        }
    }

    function collectDatatypes(definition: ClusterReference, subref: HtmlReference) {
        collectors.push({
            subsection: subref.xref.section,
            collector(datatypeRef) {
                if (!definition.datatypes) {
                    definition.datatypes = [];
                }
                datatypeRef.name = datatypeRef.name.replace(/\s+type$/i, "");
                logger.debug(`datatype ${datatypeRef.name} § ${datatypeRef.xref.section}`);
                definition.datatypes.push(datatypeRef);
                if (datatypeRef.table) {
                    // Probably a struct, enum or bitmap.  These are sometimes followed with sections that
                    // detail individual items
                    collectDetails(datatypeRef);
                }
            },
        });
    }

    function collectDetails(ref: HtmlReference) {
        collectors.push({
            subsection: ref.detailSection ?? ref.xref.section,
            collector(subref: HtmlReference) {
                if (!ref.details) {
                    ref.details = [];
                }
                ref.details.push(subref);

                // Attempt to collect sub-details if the new section is more specific than the current section
                if (subref.xref.section > ref.xref.section) {
                    collectDetails(subref);
                }
            },
        });
    }

    function defineElement(
        name:
            | "ids"
            | "features"
            | "attributes"
            | "commands"
            | "events"
            | "revisions"
            | "classifications"
            | "statusCodes",
        ref: HtmlReference,
    ) {
        if (definition?.type !== "cluster") {
            throw new InternalError(`Cannot define element ${name} because there is no active cluster definition`);
        }

        if (!ref.table) {
            // Sometimes there's a section with no table to indicate no elements
            if (ref.prose?.[0]?.textContent?.match(/(?:this cluster has no|no cluster specific)/i)) {
                return;
            }
            logger.warn("no defining table in definition of", name, "for", ref.name, `(${ref.path})`);
            return;
        }

        // Sometimes there's an empty table to indicate no elements
        if (!ref.table.rows.length) {
            return;
        }

        if (definition[name]?.table) {
            logger.warn("ignoring tertiary definition of", name, "for", ref.name);
            return;
        }

        logger.debug(`${name} § ${ref.xref.section}`);

        collectDetails((definition[name] = ref));
    }

    function identifyGlobal(ref: HtmlReference): GlobalReference | undefined {
        const format = GlobalTypeSections[ref.xref.document]?.[ref.name];
        if (
            // Lists
            format ||
            // Most standalone types are designated like this
            ref.name.endsWith(" Type") ||
            // Some don't have the "Type" suffix
            ref.name.match(/\S+(?:Bitmap|Enum|Struct)$/i)
        ) {
            return {
                type: "global",
                format: format ?? "standalone",
                ...ref,
                name: ref.name.replace(/\s+type$/i, ""),
            };
        }
    }
}
