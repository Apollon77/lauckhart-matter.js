/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalError } from "../../../../common/MatterError.js";
import { Constraint, Metatype, ValueModel } from "../../../../model/index.js";
import { StatusResponseError } from "../../../../protocol/interaction/InteractionMessenger.js";
import { StatusCode } from "../../../../protocol/interaction/InteractionProtocol.js";
import { Io } from "../Io.js";
import { assertArray, assertNumeric, assertSequence } from "./assertions.js";

export class ConstraintError extends StatusResponseError {
    constructor(schema: Io.Schema, message: string) {
        super(
            `Error validating ${
                schema.path
            }: ${
                message
            }`, StatusCode.InvalidDataType);
    }
}

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
            return (value: Io.Item) => {
                assertNumeric(value, schema);
                if (!constraint.test(value)) {
                    throw new ConstraintError(
                        schema,
                        `Value ${value} is not within bounds defined by constraint`
                    )
                }
            }

        case Metatype.string:
        case Metatype.bytes:
            return (value: Io.Item) => {
                assertSequence(value, schema);
                if (!constraint.test(value.length)) {
                    throw new ConstraintError(
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
function createArrayConstraintValidator(constraint: Constraint, schema: ValueModel): Io["validate"] {
    let validateEntryConstraint: Io["validate"] | undefined;
    if (constraint.entry) {
        const entrySchema = schema.listEntry;
        if (entrySchema) {
            validateEntryConstraint = createConstraintValidator(constraint.entry, entrySchema);
        }
    }

    return (value, options) => {
        assertArray(value, schema);

        if (!constraint.test(value.length, options?.siblings)) {
            throw new ConstraintError(
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
