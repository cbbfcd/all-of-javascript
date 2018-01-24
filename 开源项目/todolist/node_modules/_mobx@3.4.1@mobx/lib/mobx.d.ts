/**
 * (c) Michel Weststrate 2015 - 2016
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
export { IObservable, IDepTreeNode } from "./core/observable";
export { Reaction, IReactionPublic, IReactionDisposer } from "./core/reaction";
export { IDerivation, untracked, IDerivationState } from "./core/derivation";
export { IAtom, Atom, BaseAtom } from "./core/atom";
export { useStrict, isStrictModeEnabled, IAction } from "./core/action";
export { spy } from "./core/spy";
export { IComputedValue } from "./core/computedvalue";
export { IEqualsComparer, comparer } from "./types/comparer";
export { asReference, asFlat, asStructure, asMap } from "./types/modifiers-old";
export { IModifierDescriptor, IEnhancer, isModifierDescriptor } from "./types/modifiers";
export { IInterceptable, IInterceptor } from "./types/intercept-utils";
export { IListenable } from "./types/listen-utils";
export { IObjectWillChange, IObjectChange, IObservableObject, isObservableObject } from "./types/observableobject";
export { IValueDidChange, IValueWillChange, IObservableValue, isObservableValue as isBoxedObservable } from "./types/observablevalue";
export { IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, isObservableArray } from "./types/observablearray";
export { IKeyValueMap, ObservableMap, IMapEntries, IMapEntry, IMapWillChange, IMapChange, IMapChangeUpdate, IMapChangeAdd, IMapChangeBase, IMapChangeDelete, isObservableMap, map, IObservableMapInitialValues, IMap } from "./types/observablemap";
export { transaction } from "./api/transaction";
export { observable, IObservableFactory, IObservableFactories } from "./api/observable";
export { computed, IComputed, IComputedValueOptions } from "./api/computed";
export { isObservable } from "./api/isobservable";
export { isComputed } from "./api/iscomputed";
export { extendObservable, extendShallowObservable } from "./api/extendobservable";
export { observe } from "./api/observe";
export { intercept } from "./api/intercept";
export { autorun, autorunAsync, when, reaction, IReactionOptions } from "./api/autorun";
export { action, isAction, runInAction, IActionFactory } from "./api/action";
export { expr } from "./api/expr";
export { toJS } from "./api/tojs";
export { ITransformer, createTransformer } from "./api/createtransformer";
export { whyRun } from "./api/whyrun";
export { Lambda, isArrayLike } from "./utils/utils";
export { Iterator } from "./utils/iterable";
export { IObserverTree, IDependencyTree } from "./api/extras";
import { IDerivation } from "./core/derivation";
import { IDepTreeNode } from "./core/observable";
import { IObserverTree, IDependencyTree } from "./api/extras";
import { Lambda } from "./utils/utils";
import { IObservableArray } from "./types/observablearray";
import { ObservableMap } from "./types/observablemap";
import { IObservableValue } from "./types/observablevalue";
export declare const extras: {
    allowStateChanges: <T>(allowStateChanges: boolean, func: () => T) => T;
    deepEqual: (a: any, b: any) => any;
    getAtom: (thing: any, property?: string | undefined) => IDepTreeNode;
    getDebugName: (thing: any, property?: string | undefined) => string;
    getDependencyTree: (thing: any, property?: string | undefined) => IDependencyTree;
    getAdministration: (thing: any, property?: string | undefined) => any;
    getGlobalState: () => any;
    getObserverTree: (thing: any, property?: string | undefined) => IObserverTree;
    interceptReads: {
        <T>(value: IObservableValue<T>, handler: (value: any) => T): Lambda;
        <T>(observableArray: IObservableArray<T>, handler: (value: any) => T): Lambda;
        <T>(observableMap: ObservableMap<T>, handler: (value: any) => T): Lambda;
        (object: Object, property: string, handler: (value: any) => any): Lambda;
    };
    isComputingDerivation: () => boolean;
    isSpyEnabled: () => boolean;
    onReactionError: (handler: (error: any, derivation: IDerivation) => void) => () => void;
    reserveArrayBuffer: (max: number) => void;
    resetGlobalState: () => void;
    isolateGlobalState: () => void;
    shareGlobalState: () => void;
    spyReport: (event: any) => void;
    spyReportEnd: (change?: any) => void;
    spyReportStart: (event: any) => void;
    setReactionScheduler: (fn: (f: () => void) => void) => void;
};
import { Reaction, IReactionPublic, IReactionDisposer } from "./core/reaction";
import { Atom, BaseAtom } from "./core/atom";
import { IComputedValue } from "./core/computedvalue";
import { IModifierDescriptor } from "./types/modifiers";
import { IInterceptor } from "./types/intercept-utils";
import { IObjectWillChange, IObjectChange, IObservableObject } from "./types/observableobject";
import { IValueDidChange, IValueWillChange } from "./types/observablevalue";
import { IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice } from "./types/observablearray";
import { IKeyValueMap, IMapWillChange, IMapChange, IMap } from "./types/observablemap";
import { IObservableFactory, IObservableFactories } from "./api/observable";
import { IComputed } from "./api/computed";
import { IReactionOptions } from "./api/autorun";
import { IActionFactory } from "./api/action";
import { ITransformer } from "./api/createtransformer";
declare const everything: {
    Reaction: typeof Reaction;
    untracked: <T>(action: () => T) => T;
    Atom: typeof Atom;
    BaseAtom: typeof BaseAtom;
    useStrict: (strict: boolean) => void;
    isStrictModeEnabled: () => boolean;
    spy: (listener: (change: any) => void) => Lambda;
    comparer: {
        identity: (a: any, b: any) => boolean;
        structural: (a: any, b: any) => boolean;
        default: (a: any, b: any) => boolean;
    };
    asReference: <T>(value: T) => T;
    asFlat: <T>(value: T) => T;
    asStructure: <T>(value: T) => T;
    asMap: {
        (): ObservableMap<any>;
        <T>(): ObservableMap<T>;
        <T>(entries: [string, T][]): ObservableMap<T>;
        <T>(data: IKeyValueMap<T>): ObservableMap<T>;
    };
    isModifierDescriptor: (thing: any) => thing is IModifierDescriptor<any>;
    isObservableObject: (thing: any) => thing is IObservableObject;
    isBoxedObservable: (x: any) => x is IObservableValue<any>;
    isObservableArray: (thing: any) => thing is IObservableArray<any>;
    ObservableMap: typeof ObservableMap;
    isObservableMap: (thing: any) => thing is ObservableMap<any>;
    map: <V>(initialValues?: [string, V][] | IKeyValueMap<V> | IMap<string, V> | undefined) => ObservableMap<V>;
    transaction: <T>(action: () => T, thisArg?: undefined) => T;
    observable: IObservableFactory & IObservableFactories & {
        deep: {
            struct<T>(initialValue?: T | undefined): T;
        };
        ref: {
            struct<T>(initialValue?: T | undefined): T;
        };
    };
    computed: IComputed;
    isObservable: (value: any, property?: string | undefined) => boolean;
    isComputed: (value: any, property?: string | undefined) => boolean;
    extendObservable: <A extends Object, B extends Object>(target: A, ...properties: B[]) => A & B;
    extendShallowObservable: <A extends Object, B extends Object>(target: A, ...properties: B[]) => A & B;
    observe: {
        <T>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean | undefined): Lambda;
        <T>(observableArray: IObservableArray<T>, listener: (change: IArrayChange<T> | IArraySplice<T>) => void, fireImmediately?: boolean | undefined): Lambda;
        <T>(observableMap: ObservableMap<T>, listener: (change: IMapChange<T>) => void, fireImmediately?: boolean | undefined): Lambda;
        <T>(observableMap: ObservableMap<T>, property: string, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean | undefined): Lambda;
        (object: Object, listener: (change: IObjectChange) => void, fireImmediately?: boolean | undefined): Lambda;
        (object: Object, property: string, listener: (change: IValueDidChange<any>) => void, fireImmediately?: boolean | undefined): Lambda;
    };
    intercept: {
        <T>(value: IObservableValue<T>, handler: IInterceptor<IValueWillChange<T>>): Lambda;
        <T>(observableArray: IObservableArray<T>, handler: IInterceptor<IArrayWillChange<T> | IArrayWillSplice<T>>): Lambda;
        <T>(observableMap: ObservableMap<T>, handler: IInterceptor<IMapWillChange<T>>): Lambda;
        <T>(observableMap: ObservableMap<T>, property: string, handler: IInterceptor<IValueWillChange<T>>): Lambda;
        (object: Object, handler: IInterceptor<IObjectWillChange>): Lambda;
        <T extends Object, K extends keyof T>(object: T, property: K, handler: IInterceptor<IValueWillChange<any>>): Lambda;
    };
    autorun: {
        (view: (r: IReactionPublic) => any, scope?: any): IReactionDisposer;
        (name: string, view: (r: IReactionPublic) => any, scope?: any): IReactionDisposer;
    };
    autorunAsync: {
        (name: string, func: (r: IReactionPublic) => any, delay?: number | undefined, scope?: any): IReactionDisposer;
        (func: (r: IReactionPublic) => any, delay?: number | undefined, scope?: any): IReactionDisposer;
    };
    when: {
        (name: string, predicate: () => boolean, effect: Lambda, scope?: any): IReactionDisposer;
        (predicate: () => boolean, effect: Lambda, scope?: any): Lambda;
    };
    reaction: {
        <T>(expression: (r: IReactionPublic) => T, effect: (arg: T, r: IReactionPublic) => void, opts?: IReactionOptions | undefined): IReactionDisposer;
        <T>(expression: (r: IReactionPublic) => T, effect: (arg: T, r: IReactionPublic) => void, fireImmediately?: boolean | undefined): IReactionDisposer;
    };
    action: IActionFactory;
    isAction: (thing: any) => boolean;
    runInAction: {
        <T>(block: () => T, scope?: any): T;
        <T>(name: string, block: () => T, scope?: any): T;
    };
    expr: <T>(expr: () => T, scope?: any) => T;
    toJS: {
        <T>(source: T, detectCycles?: boolean | undefined): T;
        (source: any, detectCycles?: boolean | undefined): any;
        (source: any, detectCycles: boolean, __alreadySeen: [any, any][]): any;
    };
    createTransformer: <A, B>(transformer: ITransformer<A, B>, onCleanup?: ((resultObject: B | undefined, sourceObject?: A | undefined) => void) | undefined) => ITransformer<A, B>;
    whyRun: (thing?: any, prop?: string | undefined) => string;
    isArrayLike: (x: any) => x is any[] | IObservableArray<any>;
    extras: {
        allowStateChanges: <T>(allowStateChanges: boolean, func: () => T) => T;
        deepEqual: (a: any, b: any) => any;
        getAtom: (thing: any, property?: string | undefined) => IDepTreeNode;
        getDebugName: (thing: any, property?: string | undefined) => string;
        getDependencyTree: (thing: any, property?: string | undefined) => IDependencyTree;
        getAdministration: (thing: any, property?: string | undefined) => any;
        getGlobalState: () => any;
        getObserverTree: (thing: any, property?: string | undefined) => IObserverTree;
        interceptReads: {
            <T>(value: IObservableValue<T>, handler: (value: any) => T): Lambda;
            <T>(observableArray: IObservableArray<T>, handler: (value: any) => T): Lambda;
            <T>(observableMap: ObservableMap<T>, handler: (value: any) => T): Lambda;
            (object: Object, property: string, handler: (value: any) => any): Lambda;
        };
        isComputingDerivation: () => boolean;
        isSpyEnabled: () => boolean;
        onReactionError: (handler: (error: any, derivation: IDerivation) => void) => () => void;
        reserveArrayBuffer: (max: number) => void;
        resetGlobalState: () => void;
        isolateGlobalState: () => void;
        shareGlobalState: () => void;
        spyReport: (event: any) => void;
        spyReportEnd: (change?: any) => void;
        spyReportStart: (event: any) => void;
        setReactionScheduler: (fn: (f: () => void) => void) => void;
    };
};
export default everything;
