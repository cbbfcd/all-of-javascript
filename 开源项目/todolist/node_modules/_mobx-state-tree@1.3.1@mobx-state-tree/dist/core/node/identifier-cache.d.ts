import { IType, ObjectNode } from "../../internal";
export declare class IdentifierCache {
    private cache;
    constructor();
    addNodeToCache(node: ObjectNode): this;
    mergeCache(node: ObjectNode): void;
    notifyDied(node: ObjectNode): void;
    splitCache(node: ObjectNode): IdentifierCache;
    resolve(type: IType<any, any>, identifier: string): ObjectNode | null;
}
