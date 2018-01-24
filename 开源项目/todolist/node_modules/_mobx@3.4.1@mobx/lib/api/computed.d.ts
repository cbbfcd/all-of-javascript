import { IEqualsComparer } from "../types/comparer";
import { IComputedValue } from "../core/computedvalue";
export interface IComputedValueOptions<T> {
    compareStructural?: boolean;
    struct?: boolean;
    equals?: IEqualsComparer<T>;
    name?: string;
    setter?: (value: T) => void;
    context?: any;
}
export interface IComputed {
    <T>(func: () => T, setter?: (value: T) => void): IComputedValue<T>;
    <T>(func: () => T, options: IComputedValueOptions<T>): IComputedValue<T>;
    (target: Object, key: string | symbol, baseDescriptor?: PropertyDescriptor): void;
    struct(target: Object, key: string | symbol, baseDescriptor?: PropertyDescriptor): void;
    equals(equals: IEqualsComparer<any>): PropertyDecorator;
}
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
export declare var computed: IComputed;
