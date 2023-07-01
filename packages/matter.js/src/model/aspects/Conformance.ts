/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Aspect } from "./Aspect.js";

/**
 * An operational view of conformance as defined by the Matter Specification.
 * 
 * We extend the specification's syntax to add ">", "<", ">=" and "<=".  These
 * are required to encode some portions of the specification that are described
 * in prose.
 * 
 * "Conformance" controls when a data field or cluster element is allowed or
 * required.
 */
export class Conformance extends Aspect<Conformance.Definition> implements Conformance.Ast {
    type: Conformance.AstType;
    param?: Conformance.AstParam;

    override get empty() {
        return this.type === Conformance.Special.Empty;
    }

    /**
     * Initialize from a Conformance.Definition or the conformance DSL defined
     * by the Matter Specification.
     */
    constructor(definition: Conformance.Definition) {
        super(definition);

        let ast: Conformance.Ast;
        if (definition == undefined) {
            this.type = Conformance.Special.Empty;
            return;
        } else if (typeof definition == "string") {
            if (definition.toLowerCase() == "desc") {
                this.type = Conformance.Special.Desc;
                return;
            }
            ast = new Parser(this, definition).ast;
        } else if (Array.isArray(definition)) {
            const asts = definition.map((def) => new Parser(this, def).ast);
            if (asts.length == 1) {
                ast = asts[0];
            } else {
                ast = {
                    type: Conformance.Special.Group,
                    param: asts
                }
            }
        } else {
            ast = definition;
        }
        this.type = ast.type;
        if (ast.param) {
            this.param = ast.param;
        }
    }

    validateReferences(lookup: Conformance.ReferenceResolver<boolean>) {
        return Conformance.validateReferences(this, this, lookup);
    }

    override toString() {
        return Conformance.serialize(this);
    }
}

export namespace Conformance {
    export type AstType =
        Special | Flag | Exclude<Operator, Operator.DOT>;
    export type AstParam = Ast.Name | Ast.Value | Ast.Option | Ast.UnaryOperand | Ast.BinaryOperands | Ast.Group | Ast.Choice;

    export type Ast = {
        type: AstType,
        param?: AstParam
    };

    export namespace Ast {
        export type Name = string;
        export type Value = string | number;
        export type Option = Ast;
        export type UnaryOperand = Ast;
        export type BinaryOperands = {
            lhs: Ast,
            rhs: Ast
        }
        export type Group = Ast[];
        export type Choice = {
            name: ChoiceName,
            num: number,
            orMore?: boolean,
            expr: Ast
        };
    }

    export enum Special {
        Empty = "empty",
        Desc = "desc",
        Name = "name",
        Value = "value",
        Choice = "choice",
        Group = "group",
        OptionalIf = "optionalIf"
    }

    export enum Flag {
        Mandatory = "M",
        Optional = "O",
        Provisional = "P",
        Deprecated = "D",
        Disallowed = "X"
    }

    export enum Operator {
        NOT = "!",
        EQ = "==",
        NE = "!=",
        OR = "|",
        XOR = "^",
        AND = "&",
        DOT = ".",
        GT = ">",
        LT = "<",
        GTE = ">=",
        LTE = "<="
    }

    export const M = Flag.Mandatory;
    export const O = Flag.Optional;
    export const P = Flag.Provisional;
    export const D = Flag.Deprecated;
    export const X = Flag.Disallowed;
    export const EQ = Operator.EQ;
    export const NE = Operator.NE;
    export const OR = Operator.OR;
    export const XOR = Operator.XOR;
    export const AND = Operator.AND;
    export const DOT = Operator.DOT;
    export const GT = Operator.GT;
    export const LT = Operator.LT;
    export const GTE = Operator.GTE;
    export const LTE = Operator.LTE;

    export type Name = string;

    export type Number = number;

    export type ChoiceName = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";

    export type ReferenceResolver<T> = (type: Conformance.Special.Name | Conformance.Special.Value, name: string) => T;

    /**
     * Supported ways of expressing conformance.
     */
    export type Definition
        = Flag | Name | (Flag | Name)[] | Ast | string | undefined;

    const BinaryOperators = new Set([ EQ, NE, OR, XOR, AND ]);
    const OrXorAnd = new Set([ OR, XOR, AND ]);

    // Serialize with parenthesis if necessary to make the expression atomic
    function serializeAtomic(ast: Ast, operators = BinaryOperators) {
        const serialized = serialize(ast);
        if (ast.type == Conformance.Special.Group || operators.has(ast.type as Operator)) {
            return `(${serialized})`;
        }
        return serialized;
    }

    export function validateReferences(conformance: Conformance, ast: Ast, resolver: ReferenceResolver<boolean>) {
        switch (ast.type) {
            case Operator.OR:
            case Operator.XOR:
            case Operator.AND:
            case Operator.EQ:
            case Operator.NE:
            case Operator.GT:
            case Operator.LT:
            case Operator.GTE:
            case Operator.LTE:
                const operands = ast.param as Conformance.Ast.BinaryOperands;
                validateReferences(conformance, operands.lhs, resolver);
                validateReferences(conformance, operands.rhs, resolver);
                break;

            case Operator.NOT:
                validateReferences(conformance, ast.param as Conformance.Ast.UnaryOperand, resolver);
                break;

            case Special.Group:
                for (const a of ast.param as Conformance.Ast.Group) {
                    validateReferences(conformance, a, resolver);
                }
                break;

            case Special.Name:
            case Special.Value:
                if (typeof ast.param == "string" && !resolver(ast.type, ast.param)) {
                    conformance.error(`UNRESOLVED_CONFORMANCE_${ast.type.toUpperCase()}`, `Conformance ${ast.type} reference "${ast.param}" does not resolve`);
                }
                break;
        }
    }
    
    export function serialize(ast: Ast): string {
        switch (ast.type) {
            case Operator.OR:
            case Operator.XOR:
            case Operator.AND:
            case Operator.EQ:
            case Operator.NE:
            case Operator.GT:
            case Operator.LT:
            case Operator.GTE:
            case Operator.LTE:
                const operands = ast.param as Conformance.Ast.BinaryOperands;
                return `${serializeAtomic(operands.lhs, OrXorAnd)} ${ast.type} ${serializeAtomic(operands.rhs, OrXorAnd)}`;

            case Operator.NOT:
                const n = ast.param as Conformance.Ast.UnaryOperand;
                return `!${serializeAtomic(n)}`;

            case Special.Empty:
                return "";

            case Special.Desc:
                return "desc";
                    
            case Special.Choice:
                const c = ast.param as Conformance.Ast.Choice;
                let result = `${serializeAtomic(c.expr)}.${c.name}`;
                if (c.num > 1) {
                    result = `${result}${c.num}`;
                }
                if (c.orMore) {
                    result = `${result}+`;
                }
                return result;
    
            case Special.Group:
                const l = ast.param as Conformance.Ast.Group;
                return l.map(d => serialize(d)).join(", ");

            case Special.OptionalIf:
                const o = ast.param as Conformance.Ast.Option;
                return `[${serialize(o)}]`;

            case Special.Name:
            case Special.Value:
                // Name or value
                return `${ast.param}`;

            default:
                // Flag
                return ast.type;
        }
    }
}

function isNameChar(c: string) {
    return (c >= "A" && c <= "Z")
        || (c >= "a" && c <= "z")
        || (c >= "0" && c <= "9")
        || c == "_";
}

namespace Tokenizer {
    export enum Special {
        Not = "!",
        Equal = "==",
        NotEqual = "!=",
        Or = "|",
        Xor = "^",
        And = "&",
        Dot = ".",
        Comma = ",",
        OptionalBegin = "[",
        OptionalEnd = "]",
        GroupBegin = "(",
        GroupEnd = ")",
        Plus = "+",
        GreaterThan = ">",
        LessThan = "<",
        GreaterThanOrEqual = ">=",
        LessThanOrEqual = "<="
    }

    export enum TokenType {
        Flag,
        Special,
        Name,
        Choice,
        Number
    }

    namespace Token {
        export type Flag = {
            type: TokenType.Flag,
            value: Conformance.Flag
        }

        export type Special= {
            type: TokenType.Special,
            value: Tokenizer.Special
        }

        export type Name = {
            type: TokenType.Name,
            value: string
        }

        export type Choice = {
            type: TokenType.Choice,
            value: Conformance.ChoiceName
        }

        export type Number = {
            type: TokenType.Number,
            value: number
        }
    }

    export type Token
        = Token.Flag
        | Token.Special
        | Token.Name
        | Token.Choice
        | Token.Number;

    export function* tokenize(conformance: Conformance, definition: string): Generator<Token> {
        const i = definition[Symbol.iterator]();

        let current = i.next();
        if (current.done) {
            return;
        }
        let peeked = i.next();

        function next() {
            current = peeked;
            if (!current.done) {
                peeked = i.next();
            }
        }

        function tokenizeName(): Token {
            const name = [ current.value ];
            while (isNameChar(peeked.value)) {
                next();
                name.push(current.value);
            }
            return { type: TokenType.Name, value: name.join("") };
        }

        while (!current.done) {
            switch (current.value) {
                case Conformance.Flag.Mandatory:
                case Conformance.Flag.Optional:
                case Conformance.Flag.Provisional:
                case Conformance.Flag.Deprecated:
                case Conformance.Flag.Disallowed:
                    if (isNameChar(peeked.value)) {
                        yield tokenizeName();
                    } else {
                        yield { type: TokenType.Flag, value: current.value };
                    }
                    break;

                case Special.Or:
                case Special.Xor:
                case Special.And:
                case Special.Dot:
                case Special.Comma:
                case Special.OptionalBegin:
                case Special.OptionalEnd:
                case Special.GroupBegin:
                case Special.GroupEnd:
                case Special.Plus:
                    yield { type: TokenType.Special, value: current.value };
                    break;

                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    let num = 0;
                    while (true) {
                        num = num * 10 + current.value.charCodeAt(0) - "0".charCodeAt(0);
                        if (peeked.done || peeked.value < "0" || peeked.value > "9") {
                            break;
                        }
                        next();
                    }
                    yield({ type: TokenType.Number, value: num });
                    break;
                    
                case "!":
                case ">":
                case "<":
                    {
                        const base = current.value;
                        if (peeked.value == "=") {
                            next();
                            yield { type: TokenType.Special, value: `${base}${peeked.value}` as Special };
                        } else {
                            yield { type: TokenType.Special, value: base as Special };
                        }
                    }
                    break;

                case "=":
                    if (peeked.value == "=") {
                        next();
                    } else {
                        conformance.error("BAD_EQUAL", `"=" must be followed by another "="`);
                    }
                    yield { type: TokenType.Special, value: Special.Equal };
                    break;

                case " ":
                case "\t":
                case "\r":
                case "\n":
                case "\v":
                case "\f":
                    break;

                default:
                    if (current.value >= "a" && current.value <= "z") {
                        yield { type: TokenType.Choice, value: current.value as Conformance.ChoiceName };
                    } else if (current.value >= "A" && current.value <= "Z") {
                        yield tokenizeName();
                    } else {
                        conformance.error("GARBAGE_CHARACTER", `Unexpected character "${current.value}"`);
                    }
                    break;
            }
            next();
        }        
    }
}

// The DSL is *almost* complex enough to warrant a proper parser library.  Not
// quite though...
class Parser {
    public ast: Conformance.Ast;

    private tokens: Iterator<Tokenizer.Token>;
    private token?: Tokenizer.Token;
    private peeked?: Tokenizer.Token;

    constructor(private conformance: Conformance, definition: string) {
        // Spec conformance sometimes encodes "or" (illegally) as "or" rather
        // than "|"
        definition = definition.replace(" or ", " | ");

        this.tokens = Tokenizer.tokenize(conformance, definition);
        const next = this.tokens.next();
        if (!next.done) {
            this.peeked = next.value;
            this.next();
        }
        this.ast = this.parse();
    }

    private next() {
        this.token = this.peeked;
        const next = this.tokens.next();

        if (next.done) {
            this.peeked = undefined;
        } else {
            this.peeked = next.value;
        }
    }

    // Note that Conformance.Definition effectively serves as our AST.  Its
    // design is slightly suboptimal for this purpose because it also attempts
    // to serve as a DSL for manual expression of conformance
    private parse() {
        return this.parseGroup();
    }

    private parseGroup(end?: Tokenizer.Special) {
        const group = [] as Conformance.Ast[];

        function groupAsAst() {
            if (group.length == 1) {
                return group[0];
            }

            return {
                type: Conformance.Special.Group,
                param: group
            }
        }

        while (true) {
            if (!this.token) {
                if (end) {
                    this.conformance.error("UNTERMINATED_CONFORMANCE_GROUPING", "Unterminated conformance grouping");
                }
                return groupAsAst();
            }

            // Optional brackets are only allowed at the top-level
            const optional = !end
                && this.atSpecial(Tokenizer.Special.OptionalBegin);

            if (optional) {
                this.next();
                group.push({
                    type: Conformance.Special.OptionalIf,
                    param: this.parseGroup(Tokenizer.Special.OptionalEnd)
                })
            } else {
                const expr = this.parseExpression();
                if (expr) {
                    group.push(expr);
                }
            }
            
            if (this.atSpecial(Tokenizer.Special.Comma)) {
                this.next();
            } else if (end && this.atSpecial(end)) {
                this.next();
                return groupAsAst();
            }
        }
    }

    private atSpecial(special: Tokenizer.Special) {
        return this.token
            && this.token.type == Tokenizer.TokenType.Special
            && this.token.value == special;
    }

    private parseExpression() {
        let elements = [] as (Tokenizer.Special | Conformance.Ast | string)[];

        // Collect binary expressions into an array so we can back up and
        // apply operator precedence
        let expr = this.parseAtomicExpression();
        if (expr) {
            elements.push(expr);
        }
        while (this.token && this.token.type == Tokenizer.TokenType.Special && Parser.BinaryOperators.has(this.token.value)) {
            elements.push(this.token.value);
            this.next();
            expr = this.parseAtomicExpression();
            if (expr) {
                elements.push(expr);
            }
        }

        // Convert binary operators into AST nodes in order of precedence
        Parser.BinaryOperatorPrecedence.forEach(operators => {
            for (let i = 0; i < elements.length; i++) {
                if (operators.indexOf(elements[i + 1] as Tokenizer.Special) != -1) {
                    const [ lhs, op, rhs ] = elements.splice(i, 3);
                    elements.splice(i, 0, {
                        type: op as Conformance.AstType,
                        param: { lhs: lhs as Conformance.Ast, rhs: rhs as Conformance.Ast
                    }});
                }
            }
        });

        return elements[0] as Conformance.Ast;
    }

    private parseAtomicExpression(): string | Conformance.Ast | undefined {
        const expr = this.parseAtomicExpressionWithoutChoice();

        // Parse choice suffix
        if (this.atSpecial(Tokenizer.Special.Dot)) {
            this.next();

            if ((this.token as any)?.type != Tokenizer.TokenType.Choice) {
                this.conformance.error("INVALID_CHOICE", 'Choice indicator (".") must be followed by a single lowercase letter');
            }
            const choice = {
                name: this.token?.value ?? "?",
                expr: expr,
                num: 1
            } as Conformance.Ast.Choice;
            this.next();
            if ((this.token as any)?.type == Tokenizer.TokenType.Number) {
                choice.num = this.token?.value as number;
                this.next();
            }
            if (this.atSpecial(Tokenizer.Special.Plus)) {
                choice.orMore = true;
                this.next();
            }

            return {
                type: Conformance.Special.Choice,
                param: choice
            }
        }

        return expr;
    }

    private parseAtomicExpressionWithoutChoice(): string | Conformance.Ast | undefined {
        if (!this.token) {
            this.conformance.error("PREMATURE_CONFORMANCE_TERMINATION", "Terminated with expression expected");
            return;
        }

        if (this.token.type == Tokenizer.TokenType.Flag) {
            const value = this.token.value;
            this.next();
            return { type: value };
        }

        if (this.token.type == Tokenizer.TokenType.Name) {
            const name = this.token.value;
            this.next();
            return { type: Conformance.Special.Name, param: name };
        }

        if (this.token.type == Tokenizer.TokenType.Number) {
            const value = this.token.value;
            this.next();
            return { type: Conformance.Special.Value, param: value };
        }

        if (this.atSpecial(Tokenizer.Special.Not)) {
            this.next();
            return { type: Conformance.Operator.NOT, param: this.parseAtomicExpression() };
        }

        if (this.atSpecial(Tokenizer.Special.GroupBegin)) {
            this.next();
            return this.parseGroup(Tokenizer.Special.GroupEnd);
        }

        this.conformance.error("UNEXPECTED_CONFORMANCE_TOKEN", `Unexpected "${this.token.value}"`);
        this.next();
    }
}

namespace Parser {
    // Highest precedence first
    export const BinaryOperatorPrecedence = [
        [ Tokenizer.Special.Or, Tokenizer.Special.Xor, Tokenizer.Special.And ],
        [ Tokenizer.Special.GreaterThan, Tokenizer.Special.LessThan, Tokenizer.Special.GreaterThanOrEqual, Tokenizer.Special.LessThanOrEqual ],
        [ Tokenizer.Special.Equal, Tokenizer.Special.NotEqual ]
    ]

    export const BinaryOperators = new Set(BinaryOperatorPrecedence.flat());
}