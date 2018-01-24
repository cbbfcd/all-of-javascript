import { IMiddlewareEvent, IMiddlewareHandler } from "../internal";
/**
 * Convenience utility to create action based middleware that supports async processes more easily.
 * All hooks are called for both synchronous and asynchronous actions. Except that either `onSuccess` or `onFail` is called
 *
 * The create middleware tracks the process of an action (assuming it passes the `filter`).
 * `onResume` can return any value, which will be passed as second argument to any other hook. This makes it possible to keep state during a process.
 *
 * See the `atomic` middleware for an example
 *
 * @export
 * @template T
 * @template any
 * @param {{
 *     filter?: (call: IMiddlewareEvent) => boolean
 *     onStart: (call: IMiddlewareEvent) => T
 *     onResume: (call: IMiddlewareEvent, context: T) => void
 *     onSuspend: (call: IMiddlewareEvent, context: T) => void
 *     onSuccess: (call: IMiddlewareEvent, context: T, result: any) => void
 *     onFail: (call: IMiddlewareEvent, context: T, error: any) => void
 * }} hooks
 * @returns {IMiddlewareHandler}
 */
export declare function createActionTrackingMiddleware<T = any>(hooks: {
    filter?: (call: IMiddlewareEvent) => boolean;
    onStart: (call: IMiddlewareEvent) => T;
    onResume: (call: IMiddlewareEvent, context: T) => void;
    onSuspend: (call: IMiddlewareEvent, context: T) => void;
    onSuccess: (call: IMiddlewareEvent, context: T, result: any) => void;
    onFail: (call: IMiddlewareEvent, context: T, error: any) => void;
}): IMiddlewareHandler;
