import { INode, IType, Type, IContext, IValidationResult } from "../../internal";
export declare class Refinement<S, T> extends Type<S, T> {
    readonly type: IType<any, any>;
    readonly predicate: (v: any) => boolean;
    readonly message: (v: any) => string;
    readonly flags: number;
    readonly shouldAttachNode: boolean;
    constructor(name: string, type: IType<any, any>, predicate: (v: any) => boolean, message: (v: any) => string);
    describe(): string;
    instantiate(parent: INode, subpath: string, environment: any, value: any): INode;
    isAssignableFrom(type: IType<any, any>): boolean;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
}
export declare function refinement<T>(name: string, type: IType<T, T>, predicate: (snapshot: T) => boolean, message?: string | ((v: any) => string)): IType<T, T>;
export declare function refinement<S, T extends S, U extends S>(name: string, type: IType<S, T>, predicate: (snapshot: S) => snapshot is U, message?: string | ((v: any) => string)): IType<S, U>;
export declare function refinement<S, T extends S, U extends S>(type: IType<S, T>, predicate: (snapshot: S) => snapshot is U, message?: string | ((v: any) => string)): IType<S, U>;
export declare function refinement<T>(type: IType<T, T>, predicate: (snapshot: T) => boolean, message?: string | ((v: any) => string)): IType<T, T>;
export declare function isRefinementType(type: any): type is Refinement<any, any>;
