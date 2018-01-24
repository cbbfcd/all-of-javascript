import { INode, Type, IType, IContext, IValidationResult } from "../../internal";
export declare class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>;
    private _subType;
    readonly flags: number;
    readonly shouldAttachNode: boolean;
    readonly subType: IType<S, T>;
    constructor(name: string, definition: () => IType<S, T>);
    instantiate(parent: INode | null, subpath: string, environment: any, snapshot: any): INode;
    reconcile(current: INode, newValue: any): INode;
    describe(): string;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
    isAssignableFrom(type: IType<any, any>): boolean;
}
export declare type ILateType<S, T> = () => IType<S, T>;
export declare function late<S = any, T = any>(type: ILateType<S, T>): IType<S, T>;
export declare function late<S = any, T = any>(name: string, type: ILateType<S, T>): IType<S, T>;
export declare function isLateType(type: any): type is Late<any, any>;
