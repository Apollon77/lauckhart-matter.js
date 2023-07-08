/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { describeList } from "../../../../tools/util/string.js";
import { ClusterModel } from "../../models/index.js";
import { InferredComponent, InferredComponents } from "./InferredComponents.js";

/**
 * An inferred with generated name and documentation.
 */
export type NamedComponent = InferredComponent & {
    name: string;
    documentation: string;
}

/**
 * A set of components keyed by generated names.
 */
export type NamedComponents = NamedComponent[];

/**
 * Compute name and documentation a set of inferred components.
 */
export function NamedComponents(cluster: ClusterModel, inferredComponents: InferredComponents): NamedComponents {
    const namedComponents = [] as NamedComponents;
    const namedComponentMap = {} as { [name: string]: NamedComponent };
    const featureNames = Object.fromEntries(cluster.features.map(f => [ f.name, f.description ]));

    for (const elementVariance of inferredComponents) {
        let name;

        let contributorDocumentation = [];

        const allOf = elementVariance.condition?.allOf;
        if (allOf) {
            const names = allOf.map(f => featureNames[f]!);
            name = names.join("And");
            contributorDocumentation.push(`it supports feature${allOf.length === 1 ? "" : "s"}`, describeList("and", ...names));
        }

        const anyOf = elementVariance.condition?.anyOf;
        if (anyOf) {
            const names = anyOf.map(f => featureNames[f]!);
            const members = Array<string>();
            if (name) {
                members.push(name);
            }
            members.push(...anyOf);
            name = names.join("Or");
            if (contributorDocumentation.length) {
                contributorDocumentation.push("and it");
            }
            contributorDocumentation.push(`it supports feature${anyOf.length === 1 ? "" : "s"}`, describeList("or", ...names))
        }

        const not = elementVariance.condition?.not;
        if (not) {
            name = `${name || ""}Not${featureNames[not]}`;
            if (contributorDocumentation.length) {
                contributorDocumentation.push("and it");
            }
            contributorDocumentation.push("doesn't support feature", not);
        }

        if (!name) {
            name = "Base";
            contributorDocumentation.push(`A ${cluster.name}Cluster supports these elements for all feature combinations`);
        } else {
            contributorDocumentation.unshift(`A ${cluster.name}Cluster supports these elements if`);
        }

        let namedComponent = namedComponentMap[name];
        if (!namedComponent) {
            namedComponent = {
                name,
                documentation: `${contributorDocumentation.join(" ")}.`,
                ...elementVariance
            }
            namedComponentMap[name] = namedComponent;

            if (name === "Base") {
                // Base components should always be first in the list
                namedComponents.unshift(namedComponent);
            } else {
                namedComponents.push(namedComponent);
            }
        }
    }

    return namedComponents;
}