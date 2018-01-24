import { INode, IType, ObjectNode } from "../../internal";
export declare class ScalarNode implements INode {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    subpath: string;
    private readonly _parent;
    readonly _environment: any;
    private _autoUnbox;
    private state;
    constructor(type: IType<any, any>, parent: ObjectNode | null, subpath: string, environment: any, initialValue: any, storedValue: any, canAttachTreeNode: boolean, finalizeNewInstance?: (node: INode, initialValue: any) => void);
    readonly path: string;
    readonly isRoot: boolean;
    readonly parent: ObjectNode | null;
    readonly root: ObjectNode;
    setParent(newParent: INode | null, subpath?: string | null): void;
    readonly value: any;
    readonly snapshot: any;
    readonly isAlive: boolean;
    unbox(childNode: INode): any;
    toString(): string;
    die(): void;
}
