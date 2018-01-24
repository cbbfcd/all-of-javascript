import { INode, Type, IType, TypeFlags, IContext, IValidationResult, ObjectNode } from "../../internal";
import { IStateTreeNode } from "../../index";
export declare abstract class BaseReferenceType<T> extends Type<string | number, T> {
    protected readonly targetType: IType<any, T>;
    readonly flags: TypeFlags;
    constructor(targetType: IType<any, T>);
    describe(): string;
    isAssignableFrom(type: IType<any, any>): boolean;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
}
export declare class IdentifierReferenceType<T> extends BaseReferenceType<T> {
    readonly shouldAttachNode: boolean;
    constructor(targetType: IType<any, T>);
    getValue(node: INode): any;
    getSnapshot(node: INode): any;
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: any): INode;
    reconcile(current: INode, newValue: any): INode;
}
export declare class CustomReferenceType<T> extends BaseReferenceType<T> {
    private readonly options;
    readonly shouldAttachNode: boolean;
    constructor(targetType: IType<any, T>, options: ReferenceOptions<T>);
    getValue(node: INode): T | undefined;
    getSnapshot(node: INode): any;
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: any): INode;
    reconcile(current: INode, snapshot: any): INode;
}
export declare type ReferenceOptions<T> = {
    get(identifier: string | number, parent: IStateTreeNode | null): T;
    set(value: T, parent: IStateTreeNode | null): string | number;
};
export declare function reference<T>(factory: IType<any, T>, options?: ReferenceOptions<T>): IType<string | number, T>;
export declare function isReferenceType(type: any): type is BaseReferenceType<any>;
