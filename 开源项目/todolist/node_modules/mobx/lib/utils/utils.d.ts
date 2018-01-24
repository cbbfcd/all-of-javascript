export declare const EMPTY_ARRAY: never[];
export declare function getGlobal(): any;
export interface Lambda {
    (): void;
    name?: string;
}
export declare function getNextId(): number;
export declare function fail(message: string, thing?: any): never;
export declare function invariant(check: boolean, message: string, thing?: any): void;
export declare function deprecated(msg: string): boolean;
/**
 * Makes sure that the provided function is invoked at most once.
 */
export declare function once(func: Lambda): Lambda;
export declare const noop: () => void;
export declare function unique<T>(list: T[]): T[];
export declare function joinStrings(things: string[], limit?: number, separator?: string): string;
export declare function isObject(value: any): boolean;
export declare function isPlainObject(value: any): boolean;
export declare function objectAssign<T extends object>(target: {
    [key: string]: never;
}, clonedSource: T, ...sources: (Partial<T> & object)[]): T;
export declare function objectAssign<T extends object>(target: T, ...sources: (Partial<T> & object)[]): T;
export declare function hasOwnProperty(object: Object, propName: string): any;
export declare function makeNonEnumerable(object: any, propNames: string[]): void;
export declare function addHiddenProp(object: any, propName: string, value: any): void;
export declare function addHiddenFinalProp(object: any, propName: string, value: any): void;
export declare function isPropertyConfigurable(object: any, prop: string): boolean;
export declare function assertPropertyConfigurable(object: any, prop: string): void;
export declare function getEnumerableKeys(obj: any): string[];
/**
 * Naive deepEqual. Doesn't check for prototype, non-enumerable or out-of-range properties on arrays.
 * If you have such a case, you probably should use this function but something fancier :).
 */
export declare function deepEqual(a: any, b: any): any;
export declare function createInstanceofPredicate<T>(name: string, clazz: new (...args: any[]) => T): (x: any) => x is T;
export declare function areBothNaN(a: any, b: any): boolean;
/**
 * Returns whether the argument is an array, disregarding observability.
 */
export declare function isArrayLike(x: any): x is Array<any> | IObservableArray<any>;
export declare function isMapLike(x: any): boolean;
export declare function isES6Map(thing: any): boolean;
export declare function getMapLikeKeys<V>(map: ObservableMap<V> | IKeyValueMap<V> | any): string[];
export declare function primitiveSymbol(): any;
export declare function toPrimitive(value: any): any;
import { IObservableArray } from "../types/observablearray";
import { ObservableMap, IKeyValueMap } from "../types/observablemap";
