/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Access, ClusterModel, DatatypeModel, FeatureSet, FieldModel, type ValueModel } from "../../model/index.js";
import { camelize } from "../../util/String.js";
import type { Behavior } from "../Behavior.js";
import type { StateType } from "../state/StateType.js";
import type { Val } from "../state/managed/Val.js";
import { OperationalSchema } from "./OperationalSchema.js";
import { Schema } from "./Schema.js";

/**
 * Create an {@link OperationalSchema} for a {@link Behavior}.
 * 
 * {@link Behavior} uses this internally for its {@link Behavior.schema}.
 * 
 * BehaviorSchema derives operational schema from a "logical" schema.  If the
 * {@link Behavior} implementation has a static logicalSchema property this
 * defines the logical schema.  Otherwise the logical schema is
 * {@link Schema.empty}.
 *
 * This function loads the logical schema and mutates as required:
 * 
 *   - Filters schema elements to only those applicable for the supported
 *     features.  This improves validation performance and drops conflicting
 *     elements with multiple definitions for different feature selections.
 * 
 *   - Adds fields for any programmatic extensions of state.  This allows
 *     schema-driven logic to process state fields added in pure JS.
 * 
 * The {@link OperationalSchema} is then constructed from the mutated logical
 * schema.
 */
export function BehaviorSchema(options: BehaviorSchema.Options): OperationalSchema {
    let features: Set<string>,
        supportedFeatures: FeatureSet;

    const logical = options.logicalSchema ?? Schema.empty;

    // Extract features and supportedFeatures from the logical schema
    if (logical instanceof ClusterModel) {
        const featureMap = logical.featureMap?.children ?? [];
        features = new Set(featureMap.map(f => camelize(f.name)));
        supportedFeatures = new FeatureSet(Object.keys(logical.supportedFeatures ?? []));
    } else {
        features = new Set;
        supportedFeatures = new FeatureSet([]);
    }

    // Filter children based on feature conformance
    const children = logical.children.filter(
        child => child.effectiveConformance.isApplicable(features, supportedFeatures)
    );

    // Add fields for programmatic extensions
    addExtensionFields(logical, new options.State, children);

    // Create the root operational schema
    let schema: Schema;
    if (logical instanceof ClusterModel) {
        schema = new ClusterModel({
            ...logical,
            children,
        });
        schema.supportedFeatures = supportedFeatures;
    } else {
        schema = new DatatypeModel({
            ...logical,
            children
        })
    }

    return new OperationalSchema(schema, options.State);
}

export namespace BehaviorSchema {
    export interface Options {
        logicalSchema?: Schema;
        State: StateType;
    }
}

/**
 * Adds a field for every property in state that isn't defined in the schema.
 * 
 * Note 1: We skip all attributes, not just those that are applicable given the
 * supported features.
 * 
 * Note 2: Finding fields isn't as simple as just using "for ... in" because
 * ES6 class accessors are non-enumerable.  So we instead search the prototype
 * chain for read/write descriptors.
 */
function addExtensionFields(base: Schema, defaultState: Val.Struct, children: ValueModel[]) {
    const props = new Set<string>();
    for (const field of base.members) {
        props.add(camelize(field.name));
    }

    function addProperties(object: null | Val.Struct) {
        if (!object) {
            return;
        }

        const descriptors = Object.getOwnPropertyDescriptors(object);

        for (const name in descriptors) {
            if (props.has(name)) {
                continue;
            }

            const descriptor = descriptors[name];
            
            if ((!descriptor.value || !descriptor.writable) && (!descriptor.get || !descriptor.set)) {
                continue;
            }

            if (!props.has(name)) {
                props.add(name);
                children.push(new FieldModel({
                    name,
                    type: "any",

                    access: new Access({
                        readPriv: Access.Privilege.View,
                        writePriv: Access.Privilege.Operate,
                    }),
                }));
            }
        }

        addProperties(Object.getPrototypeOf(object));
    }

    addProperties(defaultState);
}
