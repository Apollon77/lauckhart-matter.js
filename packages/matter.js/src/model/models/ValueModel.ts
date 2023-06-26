/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Access, Aspect, Conformance, Constraint, Quality } from "../aspects/index.js";
import { ElementTag, Metatype } from "../definitions/index.js";
import { AnyElement, ValueElement, DatatypeElement, Globals } from "../elements/index.js";
import { Model } from "./Model.js";

// These are circular dependencies so just to be safe we only import the
// types.  We also need the class, though, at runtime.  So we use the
// references in the Model.constructors factory pool.
import { type DatatypeModel } from "./DatatypeModel.js";
import { ModelTraversal } from "../logic/ModelTraversal.js";

const CONSTRAINT: unique symbol = Symbol("constraint");
const CONFORMANCE: unique symbol = Symbol("conformance");
const ACCESS: unique symbol = Symbol("access");
const QUALITY: unique symbol = Symbol("quality");

/**
 * Each ValueElement has a corresponding implementation that derives from
 * this class.
 */
export abstract class ValueModel extends Model implements ValueElement {
    byteSize?: ValueElement.Size;
    default?: any;
    metatype?: Metatype;
    override isType? = true;

    override get children(): DatatypeModel[] {
        return super.children as any;
    }

    override set children(children: (DatatypeModel | DatatypeElement)[]) {
        super.children = children;
    }

    get constraint(): Constraint {
        return this.getAspect(CONSTRAINT, Constraint);
    }
    set constraint(definition: Constraint | Constraint.Definition) {
        this.setAspect(CONSTRAINT, Constraint, definition);
    }

    get conformance(): Conformance {
        return this.getAspect(CONFORMANCE, Conformance);
    }
    set conformance(definition: Conformance | Conformance.Definition) {
        this.setAspect(CONFORMANCE, Conformance, definition);
    }

    get access(): Access {
        return this.getAspect(ACCESS, Access);
    }
    set access(definition: Access | Access.Definition) {
        this.setAspect(ACCESS, Access, definition);
    }

    get quality(): Quality {
        return this.getAspect(QUALITY, Quality);
    }
    set quality(definition: Quality | Quality.Definition) {
        this.setAspect(QUALITY, Quality, definition);
    }

    /**
     * Metatype is only present on global types with specific semantic meaning.
     * This model is significant because it gives us information about how to
     * manipulate the data.  This accessor retrieves this model.
     */
    get metabase(): ValueModel {
        return new ModelTraversal().findMetabase(this) as ValueModel;
    }

    /**
     * The "effective type" may be inferred from context.
     */
    override get effectiveType(): string | undefined {
        const type = super.effectiveType;
        if (type) {
            return type;
        }
        return new ModelTraversal().getTypeName(this);
    }

    /**
     * The working metatype for this object.
     */
    get effectiveMetatype() {
        const metaBase = this.metabase;
        if (metaBase) {
            return metaBase.metatype;
        }
    }

    /**
     * The metatype for this model's type, ignoring inheritance.
     */
    get directMetatype() {
        if (this.type) {
            return (Globals as any)[this.type]?.metatype as Metatype;
        }
    }

    /**
     * Get the first derived ancestor with children, if any.
     */
    get definingModel() {
        return new ModelTraversal().findDefiningModel(this);
    }

    /**
     * Get the entry type for lists, if any.
     */
    get listEntry() {
        return new ModelTraversal().findListEntry(this);
    }

    /**
     * ValueModels may only derive from ValueModels.
     */
    override get base() {
        return super.base as ValueModel | undefined;
    }

    /**
     * ValueModels may derive from models of the same type or from generic
     * Datatype models.
     */
    override get allowedBaseTags() {
        if (this.tag == ElementTag.Datatype) {
            return [ ElementTag.Datatype ];
        }
        return [ this.tag, ElementTag.Datatype ];
    }

    /**
     * Collect constraints and conformance for this type and all base types.
     */
    get validationAspects() {
        let aspects = Array<Aspect<any>>();
        
        new ModelTraversal().visitInheritance(this, (model) => {
            if (model instanceof ValueModel) {
                if (
                    !model.conformance.empty
                    && model.conformance.type != Conformance.Special.Desc
                ) {
                    aspects.push(model.conformance);
                }
                if (!model.constraint.empty && !model.constraint.desc) {
                    aspects.push(model.constraint);
                }
                if (model.quality.nullable === false) {
                    aspects.push(model.quality);
                }
            }
        });

        return aspects;
    }

    /**
     * Is this model deprecated?
     */
    get deprecated() {
        return this.conformance.type == Conformance.Flag.Deprecated;
    }

    override valueOf() {
        const result = super.valueOf() as any;
        for (const k of [ "conformance", "access", "quality", "constraint" ]) {
            const v = (this as any)[k] as Aspect<any>;
            if (v && !v.empty) {
                result[k] = v.valueOf();
            }
        }
        if (result.default === undefined) {
            delete result.default;
        }
        return result as AnyElement;
    }

    constructor(definition: ValueElement.Properties) {
        super(definition);

        const match = this.type?.match(/^list\[(.*)\]$/);
        if (match) {
            this.type = "list";
            this.children.push(new Model.constructors.datatype({ name: "entry", type: match[1] }) as DatatypeModel);
        }
    }

    private getAspect(symbol: symbol, constructor: new(definition: any) => any) {
        return (this as any)[symbol] || ((this as any)[symbol] = new constructor(undefined));
    }

    private setAspect(symbol: symbol, constructor: new(definition: any) => any, value: any) {
        if (value instanceof constructor) {
            (this as any)[symbol] = value;
        } else {
            (this as any)[symbol] = new constructor(value);
        }
    }
}
