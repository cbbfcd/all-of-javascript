import { IStateTreeNode, IDisposer } from "../internal";
export declare type IMiddlewareEventType = "action" | "flow_spawn" | "flow_resume" | "flow_resume_error" | "flow_return" | "flow_throw";
export declare type IMiddlewareEvent = {
    type: IMiddlewareEventType;
    name: string;
    id: number;
    parentId: number;
    rootId: number;
    context: IStateTreeNode;
    tree: IStateTreeNode;
    args: any[];
};
export declare type IMiddlewareHandler = (actionCall: IMiddlewareEvent, next: (actionCall: IMiddlewareEvent) => any) => any;
export declare function getNextActionId(): number;
export declare function runWithActionContext(context: IMiddlewareEvent, fn: Function): any;
export declare function getActionContext(): IMiddlewareEvent;
export declare function createActionInvoker<T extends Function>(target: IStateTreeNode, name: string, fn: T): () => any;
/**
 * Middleware can be used to intercept any action is invoked on the subtree where it is attached.
 * If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.
 *
 * For more details, see the [middleware docs](docs/middleware.md)
 *
 * @export
 * @param {IStateTreeNode} target
 * @param {(action: IRawActionCall, next: (call: IRawActionCall) => any) => any} middleware
 * @returns {IDisposer}
 */
export declare function addMiddleware(target: IStateTreeNode, middleware: IMiddlewareHandler): IDisposer;
export declare function decorate<T extends Function>(middleware: IMiddlewareHandler, fn: T): T;
