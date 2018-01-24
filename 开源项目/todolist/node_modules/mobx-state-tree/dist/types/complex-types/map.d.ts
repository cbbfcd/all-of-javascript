import { ObservableMap, IMapChange, IMapWillChange } from "mobx";
import { IJsonPatch, INode, IType, IComplexType, ComplexType, TypeFlags, IContext, IValidationResult, ObjectNode } from "../../internal";
export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this;
}
export declare function mapToString(this: ObservableMap<any>): string;
export declare class MapType<S, T> extends ComplexType<{
    [key: string]: S;
}, IExtendedObservableMap<T>> {
    shouldAttachNode: boolean;
    subType: IType<any, any>;
    readonly flags: TypeFlags;
    constructor(name: string, subType: IType<any, any>);
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode;
    describe(): string;
    createNewInstance: () => ObservableMap<{}>;
    finalizeNewInstance: (node: ObjectNode, snapshot: any) => void;
    getChildren(node: ObjectNode): INode[];
    getChildNode(node: ObjectNode, key: string): INode;
    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null;
    private verifyIdentifier(expected, node);
    getValue(node: ObjectNode): any;
    getSnapshot(node: ObjectNode): {
        [key: string]: any;
    };
    didChange(change: IMapChange<any>): void;
    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: ObjectNode, snapshot: any): void;
    getChildType(key: string): IType<any, any>;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
    getDefaultSnapshot(): {};
    removeChild(node: ObjectNode, subpath: string): void;
}
/**
 * Creates a key based collection type who's children are all of a uniform declared type.
 * If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.
 *
 * This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)
 *
 * @example
 * const Todo = types.model({
 *   id: types.identifier(types.number),
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.map(Todo)
 * })
 *
 * const s = TodoStore.create({ todos: {} })
 * unprotect(s)
 * s.todos.set(17, { task: "Grab coffee", id: 17 })
 * s.todos.put({ task: "Grab cookie", id: 18 }) // put will infer key from the identifier
 * console.log(s.todos.get(17).task) // prints: "Grab coffee"
 *
 * @export
 * @alias types.map
 * @param {IType<S, T>} subtype
 * @returns {IComplexType<S[], IObservableArray<T>>}
 */
export declare function map<S, T>(subtype: IType<S, T>): IComplexType<{
    [key: string]: S;
}, IExtendedObservableMap<T>>;
export declare function isMapType<S, T>(type: any): type is IComplexType<{
    [key: string]: S;
}, IExtendedObservableMap<T>>;
