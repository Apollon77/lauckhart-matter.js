/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

export function capitalize<T extends string>(text: T) {
    return text[0].toUpperCase() + text.slice(1) as Capitalize<T>;
}

/**
 * Converts identifiers of the form "foo-bar", "foo_bar", "foo bar", "foo*bar",
 * "fooBar" or "FOOBar" into "FooBar" or "fooBar".
 */
export function camelize(name: string, upperFirst = true) {
    const pieces = new Array<string>();
    let pieceStart = 0,
        sawUpper = false,
        sawLower = false,
        i = 0;

    function addPiece(to: number) {
        if (pieceStart < to) pieces.push(name.slice(pieceStart, to));
        sawLower = sawUpper = false;
    }

    for (; i < name.length; i++) {
        if (name[i] >= "A" && name[i] <= "Z") {
            if (sawLower) {
                addPiece(i);
                pieceStart = i;
            }
            sawUpper = true;
            continue;
        }

        if (name[i] >= "a" && name[i] <= "z") {
            if (!sawLower) {
                if (sawUpper) {
                    addPiece(i - 1);
                    pieceStart = i - 1;
                }
            }
            sawLower = true;
            continue;
        }

        addPiece(i);

        if ((name[i] >= "0" && name[i] <= "9") || name[i] === "$") {
            pieces.push(name[i])
        }

        pieceStart = i + 1;
        continue;
    }
    addPiece(i);

    let didFirst = false;
    return pieces.map((piece) => {
        let firstChar = piece[0];
        if (upperFirst || didFirst) {
            firstChar = firstChar.toUpperCase();
        } else {
            firstChar = firstChar.toLowerCase();
            didFirst = true;
        }
        return `${firstChar}${piece.slice(1).toLowerCase()}`;
    }).join("");
}

/**
 * Like JSON.stringify but targets well-formed JS and is slightly more readable.
 */
export function serialize(value: any) {
    const visited = new Set();

    function asValidKey(key: string) {
        if (key.match(/[a-z_\$][a-z_\$0-9]*/i)) {
            return key;
        }
        return JSON.stringify(key);
    }
    
    function serializeOne(value: any): string | undefined {
        if (value === undefined) {
            return;
        }
        if (value === null) {
            return "null";
        }
        if (value[serialize.SERIALIZE]) {
            return value[serialize.SERIALIZE]();
        }
        if (typeof value === "function") {
            return;
        }
        if (typeof value === "bigint" || value instanceof BigInt) {
            return value.toString();
        }
        if (typeof value === "number" || value instanceof Number) {
            return value.toString();
        }
        if (typeof value === "string") {
            return JSON.stringify(value);
        }
        if (typeof value === "boolean") {
            return value ? "true" : "false";
        }
        if (ArrayBuffer.isView(value)) {
            const dv = new DataView(value.buffer);
            const bytes = Array<string>();
            for (let i = 0; i < dv.byteLength; i++) {
                bytes.push(dv.getUint8(i).toString(16).padStart(2, "0"));
            }
            return bytes.join("");
        }

        // Composite objects after this
        if (visited.has(value)) {
            return;
        }
        if (value.toJSON) {
            value = JSON.parse(JSON.stringify(value));
        }

        try {
            visited.add(value);

            if (Array.isArray(value)) {
                if (value.length) {
                    return `[ ${value.map(serializeOne).join(", ")} ]`;
                }
                return "[]";
            }

            const entries = Object.entries(value)
                .map(([k, v]) => [ k, serializeOne(v) ])
                .filter(([_k, v]) => v !== undefined)
                .map(([k, v]) => `${asValidKey(k!)}: ${v}`);

            if (!entries.length) {
                return "{}";
            }

            return `{ ${entries.join(", ")} }`
        } finally {
            visited.delete(value);
        }
    }

    return serializeOne(value);
}

export namespace serialize {
    /**
     * Custom serialization function key.
     */
    export const SERIALIZE = Symbol("SERIALIZE");

    /**
     * Mark a value as serialized so the serializer just uses its string
     * representation.
     */
    export function asIs(value: any) {
        if (typeof value === "string") {
            value = new String(value);
        }
        if (value !== undefined && value !== null) {
            value[SERIALIZE] = function() { return this.toString(); };
        }
        return value;
    }

    /**
     * Test whether a value serializes as a structure or a primitive.
     */
    export function isPrimitive(value: any) {
        if (
            value === undefined
            || value === null
            || value instanceof Date
            || ArrayBuffer.isView(value)
            || value[SERIALIZE]
        ) {
            return true;
        }

        if (Array.isArray(value)) {
            return false;
        }

        return typeof value !== "object";
    }
}
