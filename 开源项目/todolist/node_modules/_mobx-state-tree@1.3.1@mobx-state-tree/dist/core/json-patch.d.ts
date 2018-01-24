export declare type IJsonPatch = {
    op: "replace" | "add" | "remove";
    path: string;
    value?: any;
};
export declare type IReversibleJsonPatch = IJsonPatch & {
    oldValue: any;
};
export declare function splitPatch(patch: IReversibleJsonPatch): [IJsonPatch, IJsonPatch];
export declare function stripPatch(patch: IReversibleJsonPatch): IJsonPatch;
/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
export declare function escapeJsonPath(str: string): string;
/**
 * unescape slashes and backslashes
 */
export declare function unescapeJsonPath(str: string): string;
export declare function joinJsonPath(path: string[]): string;
export declare function splitJsonPath(path: string): string[];
