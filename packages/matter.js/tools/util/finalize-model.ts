/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from "../../src/log/index.js";
import { ClusterModel, DatatypeModel, MatterModel, Metatype, ValidateModel, ValueModel } from "../../src/model/index.js";
import { isDeepEqual } from "../../src/util/index.js";

const logger = Logger.get("create-model");

// Get the properties of children without xrefs so we can compare types using
// isDeepEqual
function childrenIdentity(model: ValueModel) {
    return model.children.map(child => {
        const properties = child.valueOf();
        delete properties.xref;
        delete (properties as any).conformance;
        return properties;
    })
}

// Some enum definitions are left hanging that we can fix with a quick scan
// comparing names.  I believe this only affects enums in ColorControlCluster
// from the spec but the logic is generic and safe so applying to all clusters
function patchClusterTypes(cluster: ClusterModel) {
    // First gather existing datatypes so we treat them as canonical
    const datatypes = {} as { [name: string]: ValueModel };
    cluster.datatypes.forEach(datatype => datatypes[datatype.name] = datatype);

    // Now add any element that may be promoted to a datatype
    cluster.visit(model => {
        if (model instanceof ValueModel && model.children.length) {
            switch (model.effectiveMetatype) {
                case Metatype.enum:
                case Metatype.object:
                case Metatype.bitmap:
                    break;

                default:
                    return;
            }
            
            const existing = datatypes[model.name];
            if (!existing || (existing.parent != cluster && model.parent == cluster)) {
                datatypes[model.name] = model;
            }
        }
    });

    // Update the type for datatypes that a.) share the name but do not have
    // children, or b.) duplicate this datatype
    const promote = new Set<ValueModel>();
    cluster.visit(model => {
        if (!(model instanceof ValueModel)) {
            return;
        }

        const datatype = datatypes[model.name];
        if (!datatype || datatype == model) {
            return;
        }

        const metabase = datatype.metabase;
        if (!metabase || model.metabase != metabase) {
            return;
        }

        if (model.children.length) {
            if (isDeepEqual(childrenIdentity(datatype), childrenIdentity(model))) {
                model.type = datatype.name;
                model.children = [];
                promote.add(datatype);
            }
        } else {
            model.type = datatype.name;
            promote.add(datatype);
        }
    });

    // Ensure that any referenced datatypes are top-level named datatypes
    promote.forEach(model => {
        if (model.parent == cluster) {
            return;
        }

        if (model.owner(ClusterModel) != cluster) {
            return;
        }

        cluster.add(new DatatypeModel({
            name: model.name,
            type: model.type,
            xref: model.xref,
            children: model.children
        }));

        model.type = model.name;
    })
}

/** Create and validate the final model for export */
export function finalizeModel(matter: MatterModel) {
    matter.children.forEach(c => {
        if (c instanceof ClusterModel) {
            patchClusterTypes(c)
        }
    });

    logger.info(`validate ${matter.name}`);
    
    let validationResult: ValidateModel.Result | undefined;
    Logger.nest(() => {
        validationResult = ValidateModel(matter);
    });

    return validationResult!;
}