import { INode, Type, IType, IContext, IValidationResult } from "../../internal";
export declare type IFunctionReturn<T> = () => T;
export declare type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>;
export declare class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>;
    readonly defaultValue: IOptionalValue<S, T>;
    readonly flags: number;
    readonly shouldAttachNode: boolean;
    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>);
    describe(): string;
    instantiate(parent: INode, subpath: string, environment: any, value: S): INode;
    reconcile(current: INode, newValue: any): INode;
    private getDefaultValue();
    isValidSnapshot(value: any, context: IContext): IValidationResult;
    isAssignableFrom(type: IType<any, any>): boolean;
}
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>;
export declare function isOptionalType(type: any): type is OptionalValue<any, any>;
