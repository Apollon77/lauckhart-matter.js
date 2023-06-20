/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Conformance } from "../aspects/index.js";
import { FeatureSet } from "../definitions/index.js";
import { AttributeModel, ClusterModel, ValueModel, DatatypeModel } from "../models/index.js";
import { RecordValidator } from "./RecordValidator.js";

/**
 * Lists mandatory and optional elements for a specific context.
 */
export type ElementVariance = {
    mandatory: ValueModel[],
    optional: ValueModel[]
}

/**
 * Details simple feature variance for elements that vary solely on the
 * presence of a single feature.
 */
export type FeatureVariance = { [name: FeatureSet.Flag]: ElementVariance }

/**
 * Details complex feature variance that depends on a combination of feature
 * flags.
 */
export type FeatureSetVariance = ElementVariance & {
    flags: FeatureSet
};

/**
 * Details all variance for a cluster.
 */
export type ClusterVariance = ElementVariance & {
    features: FeatureVariance,
    featureSets: FeatureSetVariance[]
}

type SimpleVariance = {
    mandatory: boolean,
    feature?: FeatureSet.Flag
}

/**
 * Computes valid feature feature combinations for a cluster and which
 * elements apply to each valid combination. 
 */
export function ClusterVariance(cluster: ClusterModel): ClusterVariance {
    const result: ClusterVariance = {
        mandatory: [],
        optional: [],
        features: {},
        featureSets: []
    }

    const featureMap = getFeatures(cluster);
    if (!featureMap) {
        return result;
    }

    const complex = Array<ValueModel>();

    addSimple(cluster, result, complex);
    addFeatureSets(cluster, result, complex);

    return result;
}

// Add variance of the form O, M, FEATURE, [FEATURE], ignoring D and P
function addSimple(cluster: ClusterModel, result: ClusterVariance, complex: ValueModel[]) {
    for (const child of cluster.children) {
        if (!(child instanceof ValueModel)) {
            continue;
        }

        const simple = getSimpleVariance(child);
        if (simple) {
            let pool: ElementVariance;
            if (simple.feature) {
                pool = result.features[simple.feature];
                if (!pool) {
                    pool = result.features[simple.feature] = {
                        mandatory: [],
                        optional: []
                    };
                }
            } else {
                pool = result;
            }
            if (simple.mandatory) {
                pool.mandatory.push(child);
            } else {
                pool.optional.push(child);
            }
        } else {
            complex.push(child);
        }
    }
}

function addFeatureSets(cluster: ClusterModel, result: ClusterVariance, complex: ValueModel[]) {
    if (!complex.length) {
        return;
    }

    const validCombinations = getValidCombinations(cluster);

    // TODO
    validCombinations;
    cluster;
    result;
}

function getSimpleVariance(element: ValueModel) {
    function fromNode(node: Conformance.Ast): SimpleVariance | undefined {
        switch (node.type) {
            case Conformance.Flag.Mandatory:
                return { mandatory: true };

            case Conformance.Flag.Optional:
            case Conformance.Special.Empty:
            case Conformance.Special.Desc:
            case Conformance.Flag.Provisional:
            case Conformance.Flag.Deprecated:
                return { mandatory: false };

            case Conformance.Special.Group:
                const group = node.param as Conformance.Ast.Group;
                for (let i = 0; i < group.length; i++) {
                    switch (group[i].type) {
                        case Conformance.Flag.Provisional:
                        case Conformance.Flag.Deprecated:
                        case Conformance.Special.Empty:
                        case Conformance.Special.Desc:
                            break;

                        default:
                            return fromNode(group[i]);
                    }
                }
                return { mandatory: false };

            case Conformance.Special.OptionalIf:
                const simple = fromNode(node.param as Conformance.Ast.Option);
                if (simple && simple.mandatory) {
                    simple.mandatory = false;
                    return simple;
                }
                break;
        }
        return undefined;
    }
    return fromNode(element.conformance);
}

function getValidCombinations(cluster: ClusterModel): FeatureSet[] {
    const featureMap = cluster.childrenOfType(AttributeModel, "featureMap");
    const featureModels = featureMap?.children || [];
    const features = new FeatureSet(featureModels.map(f => f.name));

    const valid = [];
    for (const subset of permute(features.array)) {
        const featureSet = new FeatureSet(subset);
        const validator = RecordValidator(featureModels, featureSet);
        if (validator.validate(featureSet.record).valid) {
            valid.push(featureSet);
        }
    }

    return valid;
}

function getFeatures(cluster: ClusterModel): FeatureSet {
    const featureMap = cluster.childrenOfType(AttributeModel, "featureMap");
    if (!featureMap) {
        return new FeatureSet();
    }
    return new FeatureSet(featureMap.local(DatatypeModel).map(f => f.name))
}

function permute<T>(array: T[]): T[][] {
    const permutations = Array<T[]>();

    function permute(onto: Array<T>, from: number) {
        for (let i = from; i < array.length; i++) {
            const base = Array(...onto, array[i]);
            permutations.push(base);
            permute(base, i + 1);
        }
    }

    permute(Array<T>(), 0);

    return permutations;
}
