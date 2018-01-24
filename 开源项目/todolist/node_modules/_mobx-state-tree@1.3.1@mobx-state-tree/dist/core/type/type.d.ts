import { IContext, IValidationResult, INode, IStateTreeNode, IJsonPatch, ObjectNode } from "../../internal";
export declare enum TypeFlags {
    String = 1,
    Number = 2,
    Boolean = 4,
    Date = 8,
    Literal = 16,
    Array = 32,
    Map = 64,
    Object = 128,
    Frozen = 256,
    Optional = 512,
    Reference = 1024,
    Identifier = 2048,
    Late = 4096,
    Refinement = 8192,
    Union = 16384,
    Null = 32768,
    Undefined = 65536,
}
export interface ISnapshottable<S> {
}
export interface IType<S, T> {
    name: string;
    flags: TypeFlags;
    is(thing: any): thing is S | T;
    validate(thing: any, context: IContext): IValidationResult;
    create(snapshot?: S, environment?: any): T;
    isType: boolean;
    describe(): string;
    Type: T;
    SnapshotType: S;
    instantiate(parent: INode | null, subpath: string, environment: any, initialValue?: any): INode;
    reconcile(current: INode, newValue: any): INode;
    getValue(node: INode): T;
    getSnapshot(node: INode): S;
    applySnapshot(node: INode, snapshot: S): void;
    applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void;
    getChildren(node: INode): INode[];
    getChildNode(node: INode, key: string): INode;
    getChildType(key: string): IType<any, any>;
    removeChild(node: INode, subpath: string): void;
    isAssignableFrom(type: IType<any, any>): boolean;
    shouldAttachNode: boolean;
}
export interface ISimpleType<T> extends IType<T, T> {
}
export interface IComplexType<S, T> extends IType<S, T & IStateTreeNode> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>;
}
export declare abstract class ComplexType<S, T> implements IType<S, T> {
    readonly isType: boolean;
    readonly name: string;
    constructor(name: string);
    create(snapshot?: S, environment?: any): any;
    abstract instantiate(parent: INode | null, subpath: string, environment: any, initialValue: any): INode;
    abstract flags: TypeFlags;
    abstract describe(): string;
    abstract applySnapshot(node: INode, snapshot: any): void;
    abstract getDefaultSnapshot(): any;
    abstract getChildren(node: INode): INode[];
    abstract getChildNode(node: INode, key: string): INode;
    abstract getValue(node: INode): T;
    abstract getSnapshot(node: INode): any;
    abstract applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void;
    abstract getChildType(key: string): IType<any, any>;
    abstract removeChild(node: INode, subpath: string): void;
    abstract isValidSnapshot(value: any, context: IContext): IValidationResult;
    abstract shouldAttachNode: boolean;
    isAssignableFrom(type: IType<any, any>): boolean;
    validate(value: any, context: IContext): IValidationResult;
    is(value: any): value is S | T;
    reconcile(current: ObjectNode, newValue: any): INode;
    readonly Type: T;
    readonly SnapshotType: S;
}
export declare abstract class Type<S, T> extends ComplexType<S, T> implements IType<S, T> {
    constructor(name: string);
    abstract instantiate(parent: INode | null, subpath: string, environment: any, initialValue: any): INode;
    getValue(node: INode): any;
    getSnapshot(node: INode): any;
    getDefaultSnapshot(): undefined;
    applySnapshot(node: INode, snapshot: S): void;
    applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void;
    getChildren(node: INode): INode[];
    getChildNode(node: INode, key: string): INode;
    getChildType(key: string): IType<any, any>;
    reconcile(current: INode, newValue: any): INode;
    removeChild(node: INode, subpath: string): void;
}
export declare function isType(value: any): value is IType<any, any>;
