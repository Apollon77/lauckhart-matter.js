/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessControl } from "../../../../../src/behavior/AccessControl.js";
import { Val } from "../../../../../src/behavior/state/managed/Val.js";
import { FieldElement } from "../../../../../src/model/index.js";
import { TestStruct } from "./value-utils.js";

function createNested() {
    const struct = TestStruct(
        {
            substruct: {
                type: "struct",

                children: [
                    FieldElement({ name: "foo", type: "string" })
                ],
            }
        },
        {
            substruct: {
                foo: "bar",
            },
        });

    const ref = struct.reference(AccessControl.OfflineSession) as {
        substruct: {
            foo: string;
        }
    };

    return { struct, ref };
}

describe("StructManager", () => {
    it("applies nested defaults, no transaction", () => {
        const { ref } = createNested();

        expect(typeof ref.substruct).equals("object");
        expect(ref.substruct.foo).equals("bar");
    });

    it("accepts nested changes, no transaction", () => {
        const { struct, ref } = createNested();

        ref.substruct.foo = "rab";

        expect(ref.substruct.foo).equals("rab");

        const substruct = struct.fields.substruct as Val.Struct;
        expect(typeof substruct).equals("object");
        expect(substruct.foo).equals("rab"); 
    });

    it("notifies on nested change, no transaction", () => {
        const { struct, ref } = createNested();

        debugger;
        ref.substruct.foo = "rab";

        expect(struct.notifies).deep.equal([
            { index: "foo", oldValue: { foo: "bar" }, newValue: { foo: "rab" } }
        ]);
    });
});
