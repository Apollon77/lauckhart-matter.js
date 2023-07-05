/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from "../../../log/Logger.js";
import { Conformance, Constraint, Quality } from "../../aspects/index.js";
import { ValueModel } from "../../models/index.js";
import { Validator } from "./Validator.js";
import { addConformance } from "./conformance.js";
import { addConstraint } from "./constraint.js";
import { addQuality } from "./quality.js";
import { addType } from "./type.js";

const logger = new Logger("ValidatorBuilder");

export class ValidatorBuilder extends Array<string> {
    hasChoices = false;

    constructor(fields: ValueModel[]) {
        super(
            "this.result = {}",
            "let v"
        );

        for (const child of fields) {
            if (!(child instanceof ValueModel)) {
                continue;
            }

            const aspects = child.validationAspects;
            if (!aspects.length) {
                continue;
            }
    
            this.push(`v = record[JSON.stringify(${child.name})]`);
            this.push("if (v !== undefined) {");
            for (const aspect of aspects) {
                if (aspect instanceof Constraint) {
                    addConstraint(this, child, aspect);
                } else if (aspect instanceof Conformance) {
                    addConformance(this, child, aspect);
                } else if (aspect instanceof Quality) {
                    addQuality(this, child, aspect);
                }
                addType(this, child);
            }

            this.push("}");
        }
        
        if (this.hasChoices) {
            this.unshift("delete this.choices");
            this.push("this.checkChoices()");
        }
        this.push("return this.result");
    }

    addTest(test: string, code: string, source: ValueModel, message: string) {
        this.push(`if (!(${test})) { this.error(${JSON.stringify(code)}, ${JSON.stringify(source.path)}, ${JSON.stringify(message)}) }`);
    }

    logInternalEvaluationError(message: string, e: any) {
        logger.error(`${message}: ${e}`);
        logger.debug("Failing statements:");
        const lineNoWidth = (this.length - 1).toString().length;
        Logger.nest(() => {
            for (let i = 0; i < this.length; i++) {
                logger.debug(`${i.toString().padStart(lineNoWidth, " ")} ${this[i]}`)
            }
        })
    }

    compile() {
        try {
            const fn = new Function(
                "record",
                this.join("\n")
            ) as Validator["validate"];
            return (record: { [name: string]: any }) => {
                try {
                    return fn(record);
                } catch (e) {
                    this.logInternalEvaluationError(`Record validator evaluation failed`, e);
                    throw e;
                }
            }
        } catch (e) {
            this.logInternalEvaluationError("Record validator compilation failed", e);
            throw e;
        }
    }
}
