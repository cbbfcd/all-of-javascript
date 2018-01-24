import { INode, ObjectNode, ScalarNode, IType } from "../../internal";
export declare function createNode<S, T>(type: IType<S, T>, parent: ObjectNode | null, subpath: string, environment: any, initialValue: any, createNewInstance?: (initialValue: any) => T, finalizeNewInstance?: (node: INode, initialValue: any) => void): ObjectNode | ScalarNode;
export declare function isNode(value: any): value is INode;
