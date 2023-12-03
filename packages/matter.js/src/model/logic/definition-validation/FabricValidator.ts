/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { FabricElement } from "../../elements/index.js";
import { FieldModel, FabricModel } from "../../models/index.js";
import { ModelValidator } from "./index.js";

ModelValidator.validators[FabricElement.Tag] = class AttributeValidator extends ModelValidator<FabricModel> {
    override validate() {
        this.validateStructure(true, FieldModel);
        super.validate();
    }
};
