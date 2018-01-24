import { INode, Type, IType, TypeFlags, IContext, IValidationResult, ObjectNode } from "../../internal";
export declare class IdentifierType<T> extends Type<T, T> {
    readonly identifierType: IType<T, T>;
    readonly shouldAttachNode: boolean;
    readonly flags: TypeFlags;
    constructor(identifierType: IType<T, T>);
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: T): INode;
    reconcile(current: INode, newValue: any): INode;
    describe(): string;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
}
export declare function identifier<T>(baseType: IType<T, T>): IType<T, T>;
export declare function identifier<T>(): T;
export declare function isIdentifierType(type: any): type is IdentifierType<any>;
