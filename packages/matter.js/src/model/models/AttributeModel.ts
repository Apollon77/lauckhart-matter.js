/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mei } from "../definitions/index.js";
import { AttributeElement } from "../elements/index.js";
import { ValueModel } from "./ValueModel.js";
import { Model } from "./Model.js";

export class AttributeModel extends ValueModel implements AttributeElement {
    override tag: AttributeElement.Tag = AttributeElement.Tag;
    override id!: Mei;

    get writable() {
        return this.access.writable;
    }

    get fabricScoped() {
        return !!this.access.fabric;
    }

    get fixed() {
        return !!this.quality.fixed;
    }

    get nullable() {
        return !!this.quality.nullable;
    }

    constructor(definition: AttributeElement.Properties) {
        super(definition);
    }

    static {
        Model.constructors[AttributeElement.Tag] = this;
    }

    static Tag = AttributeElement.Tag;
}