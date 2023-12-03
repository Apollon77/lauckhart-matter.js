/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalError } from "../../../../common/MatterError.js";
import { Constraint, Metatype, ValueModel } from "../../../../model/index.js";
import { Io } from "../Io.js";
import { IoError } from "../IoError.js";
import { assertArray, assertNumeric, assertSequence } from "./assertions.js";

/**
 * Creates a function that validates values based on the constraint in the
 * schema.
 */
export function createConstraintValidator(constraint: Constraint, schema: ValueModel) {
    if (constraint.empty) {
        return;
    }

    switch (schema.effectiveMetatype) {
        case Metatype.array:
            return createArrayConstraintValidator(constraint, schema);

        case Metatype.integer:
        case Metatype.float:
            return (value: Io.Val) => {
                assertNumeric(value, schema);
                if (!constraint.test(value)) {
                    throw new IoError.ConstraintError(
                        schema,
                        `Value ${value} is not within bounds defined by constraint`
                    )
                }
            }

        case Metatype.string:
        case Metatype.bytes:
            return (value: Io.Val) => {
                assertSequence(value, schema);
                if (!constraint.test(value.length)) {
                    throw new IoError.ConstraintError(
                        schema,
                        `Value ${value} is not within bounds defined by constraint`
                    )
                }
            }
            break;

        default:
            throw new InternalError(
                `Cannot define constraint for unsupported metatype ${schema.effectiveMetatype}`
            );
    }
}

/**
 * Validate array constraints specifically.
 * 
 * Array constraints behave like other sequence constraints in that they apply
 * to the length.  They are special however as they may have sub-constraints
 * that apply to data elements.
 */
function createArrayConstraintValidator(constraint: Constraint, schema: ValueModel): Io.Validate {
    let validateEntryConstraint: Io.Validate | undefined;
    if (constraint.entry) {
        const entrySchema = schema.listEntry;
        if (entrySchema) {
            validateEntryConstraint = createConstraintValidator(constraint.entry, entrySchema);
        }
    }

    return (value, options) => {
        assertArray(value, schema);

        if (!constraint.test(value.length, options?.siblings)) {
            throw new IoError.ConstraintError(
                schema,
                `Value ${value} is not within bounds defined by constraint`
            )
        }

        if (validateEntryConstraint) {
            for (const e of value) {
                validateEntryConstraint(e);
            }
        }
    }
}
