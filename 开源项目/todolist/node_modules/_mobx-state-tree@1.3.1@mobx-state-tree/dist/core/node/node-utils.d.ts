import { IType, ObjectNode } from "../../internal";
export declare enum NodeLifeCycle {
    INITIALIZING = 0,
    CREATED = 1,
    FINALIZED = 2,
    DETACHING = 3,
    DEAD = 4,
}
export interface INode {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    readonly path: string;
    readonly isRoot: boolean;
    readonly parent: ObjectNode | null;
    readonly root: ObjectNode;
    readonly _environment: any;
    subpath: string;
    isAlive: boolean;
    readonly value: any;
    readonly snapshot: any;
    setParent(newParent: ObjectNode | null, subpath?: string | null): void;
    die(): void;
}
export declare type IStateTreeNode = {
    readonly $treenode?: any;
};
/**
 * Returns true if the given value is a node in a state tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IStateTreeNode}
 */
export declare function isStateTreeNode(value: any): value is IStateTreeNode;
export declare function getStateTreeNode(value: IStateTreeNode): ObjectNode;
export declare function canAttachNode(value: any): boolean;
export declare function toJSON(this: IStateTreeNode): any;
export declare function getRelativePathBetweenNodes(base: ObjectNode, target: ObjectNode): string;
export declare function resolveNodeByPath(base: ObjectNode, pathParts: string): INode;
export declare function resolveNodeByPath(base: ObjectNode, pathParts: string, failIfResolveFails: boolean): INode | undefined;
export declare function resolveNodeByPathParts(base: ObjectNode, pathParts: string[]): INode;
export declare function resolveNodeByPathParts(base: ObjectNode, pathParts: string[], failIfResolveFails: boolean): INode | undefined;
