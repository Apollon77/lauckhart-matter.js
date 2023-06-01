/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { writeFileSync } from "fs";
import { writeMatterFile } from "./file";

const HEADER = `/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/
`;

class Block extends Array<any> {
    constructor(private parentBlock: Block | undefined, ...entries: any[]) {
        super(...entries);
    }

    override toString(linePrefix = "") {
        const pieces = new Array<string>();
        for (let i = 0; i < this.length; i++) {
            const str = this[i].toString();
            str.split("\n").forEach((line: string) => {
                if (line) {
                    pieces.push(`${linePrefix}${line}`);
                } else {
                    pieces.push("");
                }
            });
            if (i < this.length - 1 && this[i] instanceof Block && str.length && this[i + 1] != "") {
                pieces.push("");
            }
        }
        return pieces.join("\n");
    }

    /** Access the (required) parent */
    get parent() {
        if (!this.parentBlock) throw new Error("Undefined parent access");
        return this.parentBlock;
    }

    /** Delete from parent */
    remove() {
        if (this.parentBlock) {
            const index = this.parentBlock.indexOf(this);
            if (index != -1) this.parentBlock.splice(index, 1);
        }
    }

    /** Add entries.  Each entry will be serialized using toString() */
    add(...entries: any[]) {
        this.push(...entries);
        return this;
    }

    /** Add a blank line */
    blank() {
        return this.add("");
    }

    /** Add a save point that allows for out-of-order insertion */
    section(...entries: any[]) {
        const section = new Block(this, ...entries);
        this.add(section);
        return section;
    }

    /** Add JS code block.  Children will be indented */
    block(prefix: string, ...entries: any[]) {
        const block = new NestedBlock(this, prefix, ...entries);
        this.push(block);
        return block;
    }
}

class NestedBlock extends Block {
    constructor(parent: Block, private prefix: string, ...entries: any[]) {
        super(parent, ...entries);
    }

    override toString() {
        let contents = super.toString("    ");
        if (contents) contents = `${contents}\n`;
        return `${this.prefix} {\n${contents}}`;
    }
}

/**
 * Quick & dirty support for code gen.  Mostly string based but slightly higher
 * level.  And less cumberson than e.g. TS compiler AST
 */
export class TsFile extends Block {
    private imports = new Map<string, Array<string>>();
    private header!: Block;

    constructor(
        public name: string,
        ...parts: any[]
    ) {
        super(undefined, ...parts);
        this.header = this.section(HEADER);
    }

    addImport(file: string, name: string) {
        let list = this.imports.get(file);
        if (!list) {
            list = new Array<string>();
            this.imports.set(file, list);
        }
        if (list.indexOf(name) == -1) list.push(name);
        return this;
    }

    save() {
        console.log(`Write ${this.name}.ts`);

        if (this.imports.size) {
            this.imports.forEach((symbols, name) => {
                this.header.add(`import { ${symbols.join(", ")} } from "${name}.js";`);
            });
        }

        this.blank();

        writeMatterFile(`src/${this.name}.ts`, this);
        return this;
    }
}
