import { IType } from "../../internal";
export interface IContextEntry {
    path: string;
    type?: IType<any, any>;
}
export declare type IContext = IContextEntry[];
export interface IValidationError {
    context: IContext;
    value: any;
    message?: string;
}
export declare type IValidationResult = IValidationError[];
export declare function prettyPrintValue(value: any): string;
export declare function getDefaultContext(type: IType<any, any>): IContext;
export declare function getContextForPath(context: IContext, path: string, type?: IType<any, any>): IContext;
export declare function typeCheckSuccess(): IValidationResult;
export declare function typeCheckFailure(context: IContext, value: any, message?: string): IValidationResult;
export declare function flattenTypeErrors(errors: IValidationResult[]): IValidationResult;
export declare function typecheck(type: IType<any, any>, value: any): void;
/**
 * Run's the typechecker on the given type.
 * Throws if the given value is not according the provided type specification.
 * Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)
 *
 * @alias typecheck
 * @export
 * @param {IType<any, any>} type
 * @param {*} value
 */
export declare function typecheckPublic(type: IType<any, any>, value: any): void;
