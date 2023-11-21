/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from "@project-chip/matter.js/log";
import { ClusterModel, ClusterVariance, MatterModel, RequirementModel } from "@project-chip/matter.js/model";
import { decamelize } from "@project-chip/matter.js/util";
import { Block } from "../util/TsFile.js";
import { ClusterRequirements } from "./ClusterRequirements.js";
import { EndpointFile } from "./EndpointFile.js";

const logger = Logger.get("EndpointClusterGenerator");

type ClusterDetail = {
    requirement: RequirementModel;
    definition: ClusterModel;
};

/**
 * Analyzes endpoint clusters and generates definitions.
 */
export class RequirementGenerator {
    default = Array<ClusterModel>();
    mandatoryWithExtension?: ClusterModel[];

    #mandatory = Array<ClusterDetail>();
    #optional = Array<ClusterDetail>();
    #mandatoryBlock?: Block;
    #optionalBlock?: Block;
    #clusterBlock: Block | undefined;
    #mandatoryParts = false;

    constructor(
        private file: EndpointFile,
        private type: "client" | "server",
    ) {
        const matter = file.model.owner(MatterModel);
        if (!matter) {
            throw new Error("Unable to locate root MatterModel");
        }
        const clusterReqs = this.file.model.requirements.filter(r => r.element === `${type}Cluster`);

        switch (file.model.name) {
            case "RootEndpoint":
            case "Aggregator":
            case "BridgedNode":
                this.#mandatoryParts = true;
                break;
        }

        for (const requirement of clusterReqs) {
            const definition = matter.get(ClusterModel, requirement.name);
            if (!definition) {
                logger.error(`Skipping ${file.model.name} server cluster for unknown cluster ${requirement.name}`);
                continue;
            }
            if (definition.id === undefined || definition.id === 0x1d) {
                // Skip base clusters & descriptor
                continue;
            }

            if (requirement.mandatory || requirement.name === "Descriptor") {
                const variance = ClusterVariance(definition);
                if (variance.requiresFeatures) {
                    if (!this.mandatoryWithExtension) {
                        this.mandatoryWithExtension = [];
                    }
                    this.mandatoryWithExtension.push(definition);
                } else {
                    this.default.push(definition);
                }

                this.#mandatory.push({ requirement, definition });
            } else {
                this.#optional.push({ requirement, definition });
            }
        }
    }

    generate() {
        if (this.#mandatoryParts) {
            this.file.addImport(`behavior/definitions/parts/PartsBehavior`, "PartsBehavior");
            this.mandatoryBlock.atom("parts", "PartsBehavior");
        }

        for (const detail of this.#mandatory) {
            this.generateOne(detail, this.mandatoryBlock);
        }

        for (const detail of this.#optional) {
            this.generateOne(detail, this.optionalBlock);
        }

        return this.#clusterBlock;
    }

    reference(cluster: ClusterModel, mandatory = true) {
        return `${this.file.requirementsName}.${this.type}.${mandatory ? "mandatory" : "optional"}.${cluster.name}`;
    }

    private get mandatoryBlock() {
        if (this.#mandatoryBlock === undefined) {
            this.#mandatoryBlock = this.clusterBlock.expressions("mandatory: {", "}");
        }
        return this.#mandatoryBlock;
    }

    private get optionalBlock() {
        if (this.#optionalBlock === undefined) {
            this.#optionalBlock = this.clusterBlock.expressions("optional: {", "}");
        }
        return this.#optionalBlock;
    }

    private get clusterBlock() {
        if (!this.#clusterBlock) {
            this.#clusterBlock = this.file.requirements.expressions(`${this.type}: {`, "}");
        }
        return this.#clusterBlock;
    }

    private generateOne(detail: ClusterDetail, target: Block) {
        let baseName;
        let prefix = `behavior/definitions/${decamelize(detail.definition.name)}/${detail.definition.name}`;
        if (this.type === "server") {
            baseName = `${detail.definition.name}Server`;
            this.file.addImport(`${prefix}Server`, baseName);
        } else {
            baseName = `${detail.definition.name}Behavior`;
            this.file.addImport(`${prefix}Behavior`, baseName);
        }

        const cluster = target.builder(`${detail.definition.name}: ${baseName}`);

        const requirements = new ClusterRequirements(this.file, detail.definition, detail.requirement);

        if (requirements.mandatoryFeatures.length) {
            const extended = cluster.expressions("with(", ")");
            for (const feature of requirements.mandatoryFeatures) {
                extended.value(feature);
            }
        }

        if (requirements.defaults) {
            const defaults = cluster.expressions("set(", ")");
            defaults.value(requirements.defaults);
        }

        if (requirements.alterations) {
            const altered = cluster.expressions("alter(", ")");
            altered.value(requirements.alterations);
        }
    }
}
