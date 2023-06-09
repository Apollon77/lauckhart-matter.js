/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClusterElement, Mei, Model, AttributeModel, CommandModel, DatatypeModel, EventModel } from "../index.js";

export class ClusterModel extends Model implements ClusterElement {
    override type!: ClusterElement.Type;
    override id!: Mei;
    singleton?: boolean;
    classification?: ClusterElement.Classification;
    override children!: ClusterModel.Children[];

    override validate() {
        this.validateStructure(ClusterElement.Type, true, DatatypeModel, AttributeModel, CommandModel, EventModel);

        this.validateProperty({ name: "singleton", type: "boolean" });
        this.validateProperty({ name: "classification", type: "string" })

        return super.validate();
    }

    constructor(definition: ClusterElement.Properties, parent?: Model) {
        super(definition, parent);
    }

    static {
        Model.constructors[ClusterElement.Type] = this;
    }
}

export namespace ClusterModel {
    export type Children =
        DatatypeModel
        | AttributeModel
        | CommandModel
        | EventModel;
}
