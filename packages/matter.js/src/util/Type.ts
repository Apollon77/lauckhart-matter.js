/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

export type Properties = { [key: string]: any };

/** Merges two types into one. */
export type Merge<A extends Properties, B extends Properties> = {
    [K in keyof A as K extends keyof B ? never : K]: A[K];
} & B;

export function Merge<A extends Properties, B extends Properties>(a: A, b: B): Merge<A, B> {
    return { ...a, ...b };
}

/** Type that represents a class constructor of a defined type or extend of it */
export type ClassExtends<C> = { new (...args: any[]): C };

/** Merge an array of objects into one.  Currently assumes unique elements */
export type MergeAll<T> = T extends [infer O extends Properties | undefined, ...infer R]
    ? O extends undefined
        ? MergeAll<R>
        : O & MergeAll<R>
    : T extends []
      ? {}
      : never;

export function MergeAll<T extends (Properties | undefined)[]>(...objects: readonly [...T]): MergeAll<T> {
    return Object.assign({}, ...objects);
}

/** Pluck an item from an array of objects if present */
export type Pluck<K, T extends readonly [...any]> = T extends [infer O, ...infer R]
    ? K extends keyof O
        ? [O[K], ...Pluck<K, R>]
        : Pluck<K, R>
    : T extends []
      ? T
      : never;

export function Pluck<T extends Properties[], K extends keyof T[number]>(
    key: K,
    ...objects: readonly [...T]
): Pluck<K, T> {
    return objects.map(o => (o as any)[key]).filter(o => o !== undefined) as any;
}

/** Same as "a == undefined" but keeps the kids happy */
export function isNullish(a: any) {
    return a === undefined || a === null;
}

export type MakeMandatory<T> = Exclude<T, undefined>;

/** Create a branded type */
declare const __brand: unique symbol;
// Don't think it should be necessary to export Brand<B> but it will cause
// the following error under some circumstances:
//
//   Exported variable 'XXX' has or is using name '__brand' from external
//   module "../src/util/Type" but cannot be named.ts(4023)
//
// Specifically this occurs with the reference to Cluster.id in the "complete"
// cluster definitions
export type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

/**
 * Make a type immutable.
 */
export type Immutable<T> = T extends (...args: any[]) => any
    ? T
    : T extends object
      ? { readonly [K in keyof T]: Immutable<T[K]> }
      : T;

/**
 * Return type for functions that are optionally asynchronous.
 */
export type MaybePromise<T = void> = T | Promise<T>;

/**
 * Promise-like version of above.
 */
export type MaybePromiseLike<T = void> = T | PromiseLike<T>;

export namespace MaybePromise {
    /**
     * Determine whether a {@link MaybePromiseLike} is a {@link Promise}.
     */
    export function is<T>(value: MaybePromiseLike<T>): value is PromiseLike<T> {
        return typeof (value as { then?: any }).then === "function";
    }

    /**
     * Chained MaybePromise.  Invokes the resolve function immediately if the
     * {@link MaybePromise} is not a {@link Promise}, otherwise the same as a
     * normal {@link Promise.then}.
     */
    export function then<I, O>(value: MaybePromise<I>, resolve: (input: I) => O): MaybePromise<O> {
        if (is(value)) {
            return value.then(resolve);
        }
        return resolve(value);
    }
}

/**
 * Convert a union to an interface.
 *
 * {@see {@link https://stackoverflow.com/questions/50374908}}
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * An identity type.
 *
 * You can't do:
 *
 *     interface Foo extends typeof Bar {}
 *
 * But you can do:
 *
 *     interface Foo extends Identity<typeof Bar> {}
 *
 * Without this type you'd have to do:
 *
 *     interface FooType = typeof Bar;
 *     interface Foo extends FooType {};
 *
 * We have to do this a lot because we generate complex objects with detailed
 * type information.  When exported, TS (as of 5.2) inlines the type of these
 * objects in declarations which makes our declarations massive.  To avoid this
 * we create an interface from the type then cast to the interface for export.
 */
export type Identity<T> = T;
