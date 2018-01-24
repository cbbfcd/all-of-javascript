import { IObservableArray, ObservableMap } from "mobx";
/**
 * Returns the _actual_ type of the given tree node. (Or throws)
 *
 * @export
 * @param {IStateTreeNode} object
 * @returns {IType<S, T>}
 */
export declare function getType<S, T>(object: IStateTreeNode): IType<S, T>;
/**
 * Returns the _declared_ type of the given sub property of an object, array or map.
 *
 * @example
 * const Box = types.model({ x: 0, y: 0 })
 * const box = Box.create()
 *
 * console.log(getChildType(box, "x").name) // 'number'
 *
 * @export
 * @param {IStateTreeNode} object
 * @param {string} child
 * @returns {IType<any, any>}
 */
export declare function getChildType(object: IStateTreeNode, child: string): IType<any, any>;
/**
 * Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @export
 * @param {Object} target the model instance from which to receive patches
 * @param {(patch: IJsonPatch, reversePatch) => void} callback the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch
 * @param {includeOldValue} boolean if oldValue is included in the patches, they can be inverted. However patches will become much bigger and might not be suitable for efficient transport
 * @returns {IDisposer} function to remove the listener
 */
export declare function onPatch(target: IStateTreeNode, callback: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer;
export declare function onSnapshot<S>(target: ObservableMap<S>, callback: (snapshot: {
    [key: string]: S;
}) => void): IDisposer;
export declare function onSnapshot<S>(target: IObservableArray<S>, callback: (snapshot: S[]) => void): IDisposer;
export declare function onSnapshot<S>(target: ISnapshottable<S>, callback: (snapshot: S) => void): IDisposer;
/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.
 *
 * Can apply a single past, or an array of patches.
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
export declare function applyPatch(target: IStateTreeNode, patch: IJsonPatch | IJsonPatch[]): void;
export interface IPatchRecorder {
    patches: ReadonlyArray<IJsonPatch>;
    inversePatches: ReadonlyArray<IJsonPatch>;
    stop(): any;
    replay(target?: IStateTreeNode): any;
    undo(target?: IStateTreeNode): void;
}
/**
 * Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
 * Returns an recorder object with the following signature:
 *
 * @example
 * export interface IPatchRecorder {
 *      // the recorded patches
 *      patches: IJsonPatch[]
 *      // the inverse of the recorded patches
 *      inversePatches: IJsonPatch[]
 *      // stop recording patches
 *      stop(target?: IStateTreeNode): any
 *      // resume recording patches
 *      resume()
 *      // apply all the recorded patches on the given target (the original subject if omitted)
 *      replay(target?: IStateTreeNode): any
 *      // reverse apply the recorded patches on the given target  (the original subject if omitted)
 *      // stops the recorder if not already stopped
 *      undo(): void
 * }
 *
 * @export
 * @param {IStateTreeNode} subject
 * @returns {IPatchRecorder}
 */
export declare function recordPatches(subject: IStateTreeNode): IPatchRecorder;
/**
 * The inverse of `unprotect`
 *
 * @export
 * @param {IStateTreeNode} target
 *
 */
export declare function protect(target: IStateTreeNode): void;
/**
 * By default it is not allowed to directly modify a model. Models can only be modified through actions.
 * However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields.
 * For example because you are building a PoC or don't have any middleware attached to your tree.
 *
 * In that case you can disable this protection by calling `unprotect` on the root of your tree.
 *
 * @example
 * const Todo = types.model({
 *     done: false
 * }).actions(self => ({
 *     toggle() {
 *         self.done = !self.done
 *     }
 * }))
 *
 * const todo = Todo.create()
 * todo.done = true // throws!
 * todo.toggle() // OK
 * unprotect(todo)
 * todo.done = false // OK
 */
export declare function unprotect(target: IStateTreeNode): void;
/**
 * Returns true if the object is in protected mode, @see protect
 */
export declare function isProtected(target: IStateTreeNode): boolean;
/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export declare function applySnapshot<S, T>(target: IStateTreeNode, snapshot: S): void;
export declare function getSnapshot<S>(target: ObservableMap<S>): {
    [key: string]: S;
};
export declare function getSnapshot<S>(target: IObservableArray<S>): S[];
export declare function getSnapshot<S>(target: ISnapshottable<S>): S;
/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
export declare function hasParent(target: IStateTreeNode, depth?: number): boolean;
export declare function getParent(target: IStateTreeNode, depth?: number): any & IStateTreeNode;
export declare function getParent<T>(target: IStateTreeNode, depth?: number): T & IStateTreeNode;
export declare function getRoot(target: IStateTreeNode): any & IStateTreeNode;
export declare function getRoot<T>(target: IStateTreeNode): T & IStateTreeNode;
/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export declare function getPath(target: IStateTreeNode): string;
/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export declare function getPathParts(target: IStateTreeNode): string[];
/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export declare function isRoot(target: IStateTreeNode): boolean;
/**
 * Resolves a path relatively to a given object.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
export declare function resolvePath(target: IStateTreeNode, path: string): IStateTreeNode | any;
/**
 * Resolves a model instance given a root target, the type and the identifier you are searching for.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {IType<any, any>} type
 * @param {IStateTreeNode} target
 * @param {(string | number)} identifier
 * @returns {*}
 */
export declare function resolveIdentifier(type: IType<any, any>, target: IStateTreeNode, identifier: string | number): any;
/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
export declare function tryResolve(target: IStateTreeNode, path: string): IStateTreeNode | any;
/**
 * Given two state tree nodes that are part of the same tree,
 * returns the shortest jsonpath needed to navigate from the one to the other
 *
 * @export
 * @param {IStateTreeNode} base
 * @param {IStateTreeNode} target
 * @returns {string}
 */
export declare function getRelativePath(base: IStateTreeNode, target: IStateTreeNode): string;
/**
 * Returns a deep copy of the given state tree node as new tree.
 * Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`
 *
 * _Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_
 *
 * @export
 * @template T
 * @param {T} source
 * @param {boolean | any} keepEnvironment indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree.
 * @returns {T}
 */
export declare function clone<T extends IStateTreeNode>(source: T, keepEnvironment?: boolean | any): T;
/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 */
export declare function detach<T extends IStateTreeNode>(target: T): T;
/**
 * Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore
 */
export declare function destroy(target: IStateTreeNode): void;
/**
 * Returns true if the given state tree node is not killed yet.
 * This means that the node is still a part of a tree, and that `destroy`
 * has not been called. If a node is not alive anymore, the only thing one can do with it
 * is requesting it's last path and snapshot
 *
 * @export
 * @param {IStateTreeNode} target
 * @returns {boolean}
 */
export declare function isAlive(target: IStateTreeNode): boolean;
/**
 * Use this utility to register a function that should be called whenever the
 * targeted state tree node is destroyed. This is a useful alternative to managing
 * cleanup methods yourself using the `beforeDestroy` hook.
 *
 * @example
 * const Todo = types.model({
 *   title: types.string
 * }).actions(self => ({
 *   afterCreate() {
 *     const autoSaveDisposer = reaction(
 *       () => getSnapshot(self),
 *       snapshot => sendSnapshotToServerSomehow(snapshot)
 *     )
 *     // stop sending updates to server if this
 *     // instance is destroyed
 *     addDisposer(self, autoSaveDisposer)
 *   }
 * }))
 *
 * @export
 * @param {IStateTreeNode} target
 * @param {() => void} disposer
 */
export declare function addDisposer(target: IStateTreeNode, disposer: () => void): void;
/**
 * Returns the environment of the current state tree. For more info on environments,
 * see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)
 *
 * Returns an empty environment if the tree wasn't initialized with an environment
 *
 * @export
 * @param {IStateTreeNode} target
 * @returns {*}
 */
export declare function getEnv<T = any>(target: IStateTreeNode): T;
/**
 * Performs a depth first walk through a tree
 */
export declare function walk(target: IStateTreeNode, processor: (item: IStateTreeNode) => void): void;
import { IStateTreeNode, IJsonPatch, IDisposer, ISnapshottable, IType } from "../internal";
