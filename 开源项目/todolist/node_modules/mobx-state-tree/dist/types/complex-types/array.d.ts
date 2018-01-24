import { IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice } from "mobx";
import { IJsonPatch, INode, IStateTreeNode, IContext, IValidationResult, ComplexType, IComplexType, IType, TypeFlags, ObjectNode } from "../../internal";
export declare function arrayToString(this: IObservableArray<any> & IStateTreeNode): string;
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    shouldAttachNode: boolean;
    subType: IType<any, any>;
    readonly flags: TypeFlags;
    constructor(name: string, subType: IType<any, any>);
    describe(): string;
    createNewInstance: () => IObservableArray<{}>;
    finalizeNewInstance: (node: ObjectNode, snapshot: any) => void;
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode;
    getChildren(node: ObjectNode): INode[];
    getChildNode(node: ObjectNode, key: string): INode;
    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null;
    getValue(node: ObjectNode): any;
    getSnapshot(node: ObjectNode): any;
    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void;
    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: ObjectNode, snapshot: any[]): void;
    getChildType(key: string): IType<any, any>;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
    getDefaultSnapshot(): never[];
    removeChild(node: ObjectNode, subpath: string): void;
}
/**
 * Creates an index based collection type who's children are all of a uniform declared type.
 *
 * This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)
 *
 * @example
 * const Todo = types.model({
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.array(Todo)
 * })
 *
 * const s = TodoStore.create({ todos: [] })
 * unprotect(s) // needed to allow modifying outside of an action
 * s.todos.push({ task: "Grab coffee" })
 * console.log(s.todos[0]) // prints: "Grab coffee"
 *
 * @export
 * @alias types.array
 * @param {IType<S, T>} subtype
 * @returns {IComplexType<S[], IObservableArray<T>>}
 */
export declare function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>>;
export declare function isArrayType<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>>;
