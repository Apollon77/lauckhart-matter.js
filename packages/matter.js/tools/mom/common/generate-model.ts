/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

export const MODEL_PATH = "src/model/instance";
export const CLUSTER_SUFFIX = "Model";

import { Logger } from "../../../src/log/Logger.js";
import { ClusterElement as AnyElement } from "../../../src/model/index.js";
import { camelize } from "../../../src/util/String.js";
import { TsFile } from "../../util/TsFile.js";
import { clean } from "../../util/file.js";
import { generateElement } from "./generate-element.js";

const logger = Logger.get("generate-model");

export function cleanCluster(source: string) {
    clean(`${MODEL_PATH}/${source}`, CLUSTER_SUFFIX);
}

export function generateElementFile(source: string, element: AnyElement) {
    const prefix = camelize(source);
    const file = new TsFile(`${MODEL_PATH}/${source}/elements/${prefix}${element.name}`);

    file.addImport("./internal.js", `${prefix}Matter`);

    generateElement(
        file,
        element,
        `${prefix}Matter.children.push(`,
        ")"
    )

    file.save();
}

export function generateIndex(source: string, elements: AnyElement[]) {
    const prefix = camelize(source);
    const file = new TsFile(`${MODEL_PATH}/${source}/index`);

    file.add(`export * from "./${prefix}Matter.js"`);
    file.add("");
    elements.forEach(element =>
        file.add(`import from "./${prefix}${element.name}`));

    file.save();
}

export function generateModel(source: string, elements: AnyElement[]) {
    logger.info(`generate from ${source}`);
    Logger.nest(() => {
        logger.info("clusters");
        Logger.nest(() => {
            for (const cluster of elements) {
                logger.debug(cluster.name);
                Logger.nest(() => generateElementFile(source, cluster));
            }
        });

        logger.info("index");
        generateIndex(source, elements);
    });
}
