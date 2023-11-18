/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from "@project-chip/matter.js/log";
import { ClusterModel, ClusterVariance } from "@project-chip/matter.js/model";
import { TsFile } from "../util/TsFile.js";
import { decamelize } from "@project-chip/matter.js/util";

const logger = Logger.get("BehaviorServerFile");

export class BehaviorServerFile extends TsFile {
    readonly baseName: string;
    readonly definitionName: string;

    constructor(public cluster: ClusterModel, private variance: ClusterVariance) {
        const baseName = `${decamelize(cluster.name)}/Server`
        super(`#behaviors/${baseName}`, true);
        this.baseName = baseName;
        this.definitionName = `${cluster.name}Server`;
        this.cluster = cluster;

        this.generate();
    }

    private generate() {
        logger.info(`${this.cluster.name} → ${this.name}.ts`);

        this.addImport(`./Behavior`, `${this.cluster.name}Behavior`);

        let base;
        let extraDoc;
        if ((this.variance.components).length) {
            this.addImport(`../../../cluster/definitions/${this.cluster.name}Cluster`, this.cluster.name);
            this.atom(`const Base = ${this.cluster.name}Behavior.for(${this.cluster.name}.Complete)`);
            base = 'Base';
            extraDoc = `This implementation includes all features of ${this.cluster.name}.Cluster.  `
                + `You should use ${this.cluster.name}Server.with to specialize the class for the features your `
                + `implementation supports.`;
        } else {
            base = `${this.cluster.name}Behavior`;
        }

        this.statements(`export class ${this.cluster.name}Server extends ${base} {`, `}`)
            .document(
                `This is the default server implementation of ${this.cluster.name}Behavior.`,
                extraDoc
            );
    }
}
