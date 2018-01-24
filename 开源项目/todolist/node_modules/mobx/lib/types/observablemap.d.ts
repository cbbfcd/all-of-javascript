import { IEnhancer } from "./modifiers";
import { Lambda } from "../utils/utils";
import { IInterceptable, IInterceptor } from "./intercept-utils";
import { IListenable } from "./listen-utils";
import { Iterator } from "../utils/iterable";
/**
 * Map as defined by Typescript's lib.es2015.collection.d.ts
 *
 * Imported here to not require consumers to have these libs enabled in their tsconfig if not actually using maps
 */
export interface IMap<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: IMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value?: V): this;
    readonly size: number;
}
export interface IKeyValueMap<V> {
    [key: string]: V;
}
export declare type IMapEntry<V> = [string, V];
export declare type IMapEntries<V> = IMapEntry<V>[];
export declare type IMapChange<T> = IMapChangeUpdate<T> | IMapChangeAdd<T> | IMapChangeDelete<T>;
export interface IMapChangeBase<T> {
    object: ObservableMap<T>;
    name: string;
}
export interface IMapChangeUpdate<T> extends IMapChangeBase<T> {
    type: "update";
    newValue: T;
    oldValue: T;
}
export interface IMapChangeAdd<T> extends IMapChangeBase<T> {
    type: "add";
    newValue: T;
}
export interface IMapChangeDelete<T> extends IMapChangeBase<T> {
    type: "delete";
    oldValue: T;
}
export interface IMapWillChange<T> {
    object: ObservableMap<T>;
    type: "update" | "add" | "delete";
    name: string;
    newValue?: T;
}
export declare type IObservableMapInitialValues<V> = IMapEntries<V> | IKeyValueMap<V> | IMap<string, V>;
export declare class ObservableMap<V> implements IInterceptable<IMapWillChange<V>>, IListenable, IMap<string, V> {
    enhancer: IEnhancer<V>;
    name: string;
    $mobx: {};
    private _data;
    private _hasMap;
    private _keys;
    interceptors: null;
    changeListeners: null;
    dehancer: any;
    constructor(initialData?: IObservableMapInitialValues<V>, enhancer?: IEnhancer<V>, name?: string);
    private _has(key);
    has(key: string): boolean;
    set(key: string, value?: V | undefined): this;
    delete(key: string): boolean;
    private _updateHasMapEntry(key, value);
    private _updateValue(name, newValue);
    private _addValue(name, newValue);
    get(key: string): V | undefined;
    private dehanceValue<X>(value);
    keys(): string[] & Iterator<string>;
    values(): V[] & Iterator<V>;
    entries(): IMapEntries<V> & Iterator<IMapEntry<V>>;
    forEach(callback: (value: V, key: string, object: IMap<string, V>) => void, thisArg?: any): void;
    /** Merge another object into this object, returns this. */
    merge(other: ObservableMap<V> | IKeyValueMap<V> | any): ObservableMap<V>;
    clear(): void;
    replace(values: ObservableMap<V> | IKeyValueMap<V> | any): ObservableMap<V>;
    readonly size: number;
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values might still be observable. For a deep clone use mobx.toJS.
     */
    toJS(): IKeyValueMap<V>;
    toJSON(): IKeyValueMap<V>;
    private isValidKey(key);
    private assertValidKey(key);
    toString(): string;
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    observe(listener: (changes: IMapChange<V>) => void, fireImmediately?: boolean): Lambda;
    intercept(handler: IInterceptor<IMapWillChange<V>>): Lambda;
}
export declare function map<V>(initialValues?: IObservableMapInitialValues<V>): ObservableMap<V>;
export declare var isObservableMap: (thing: any) => thing is ObservableMap<any>;
