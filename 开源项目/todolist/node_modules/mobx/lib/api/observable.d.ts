import { IModifierDescriptor } from "../types/modifiers";
import { IObservableValue } from "../types/observablevalue";
import { IObservableArray } from "../types/observablearray";
import { IObservableObject } from "../types/observableobject";
import { IObservableMapInitialValues, ObservableMap, IMap } from "../types/observablemap";
export interface IObservableFactory {
    <T>(): IObservableValue<T>;
    <T>(wrapped: IModifierDescriptor<T>): T;
    (target: Object, key: string, baseDescriptor?: PropertyDescriptor): any;
    <T>(value: T[]): IObservableArray<T>;
    (value: string): IObservableValue<string>;
    (value: boolean): IObservableValue<boolean>;
    (value: number): IObservableValue<number>;
    (value: Date): IObservableValue<Date>;
    (value: RegExp): IObservableValue<RegExp>;
    (value: Function): IObservableValue<Function>;
    <T>(value: null | undefined): IObservableValue<T>;
    (value: null | undefined): IObservableValue<any>;
    (): IObservableValue<any>;
    <T>(value: IMap<string | number | boolean, T>): ObservableMap<T>;
    <T extends Object>(value: T): T & IObservableObject;
    <T>(value: T): IObservableValue<T>;
}
export interface IObservableFactories {
    box<T>(value?: T, name?: string): IObservableValue<T>;
    shallowBox<T>(value?: T, name?: string): IObservableValue<T>;
    array<T>(initialValues?: T[], name?: string): IObservableArray<T>;
    shallowArray<T>(initialValues?: T[], name?: string): IObservableArray<T>;
    map<T>(initialValues?: IObservableMapInitialValues<T>, name?: string): ObservableMap<T>;
    shallowMap<T>(initialValues?: IObservableMapInitialValues<T>, name?: string): ObservableMap<T>;
    object<T>(props: T, name?: string): T & IObservableObject;
    shallowObject<T>(props: T, name?: string): T & IObservableObject;
    /**
     * Decorator that creates an observable that only observes the references, but doesn't try to turn the assigned value into an observable.ts.
     */
    ref(target: Object, property: string, descriptor?: PropertyDescriptor): any;
    ref<T>(initialValue: T): T;
    /**
     * Decorator that creates an observable converts its value (objects, maps or arrays) into a shallow observable structure
     */
    shallow(target: Object, property: string, descriptor?: PropertyDescriptor): any;
    shallow<T>(initialValues: T[]): IObservableArray<T>;
    shallow<T>(initialValues: IMap<string | number | boolean, T>): ObservableMap<T>;
    shallow<T extends Object>(value: T): T;
    deep(target: Object, property: string, descriptor?: PropertyDescriptor): any;
    deep<T>(initialValues: T[]): IObservableArray<T>;
    deep<T>(initialValues: IMap<string | number | boolean, T>): ObservableMap<T>;
    deep<T>(initialValue: T): T;
    struct(target: Object, property: string, descriptor?: PropertyDescriptor): any;
    struct<T>(initialValues: T[]): IObservableArray<T>;
    struct<T>(initialValues: IMap<string | number | boolean, T>): ObservableMap<T>;
    struct<T>(initialValue: T): T;
}
export declare const observable: IObservableFactory & IObservableFactories & {
    deep: {
        struct<T>(initialValue?: T): T;
    };
    ref: {
        struct<T>(initialValue?: T): T;
    };
};
