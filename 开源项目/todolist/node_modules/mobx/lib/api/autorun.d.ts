import { Lambda } from "../utils/utils";
import { IReactionPublic, IReactionDisposer } from "../core/reaction";
import { IEqualsComparer } from "../types/comparer";
/**
 * Creates a reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @param scope (optional)
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
export declare function autorun(view: (r: IReactionPublic) => any, scope?: any): IReactionDisposer;
/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param name The view name
 * @param view The reactive view
 * @param scope (optional)
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
export declare function autorun(name: string, view: (r: IReactionPublic) => any, scope?: any): IReactionDisposer;
/**
 * Similar to 'observer', observes the given predicate until it returns true.
 * Once it returns true, the 'effect' function is invoked an the observation is cancelled.
 * @param name
 * @param predicate
 * @param effect
 * @param scope (optional)
 * @returns disposer function to prematurely end the observer.
 */
export declare function when(name: string, predicate: () => boolean, effect: Lambda, scope?: any): IReactionDisposer;
/**
 * Similar to 'observer', observes the given predicate until it returns true.
 * Once it returns true, the 'effect' function is invoked an the observation is cancelled.
 * @param predicate
 * @param effect
 * @param scope (optional)
 * @returns disposer function to prematurely end the observer.
 */
export declare function when(predicate: () => boolean, effect: Lambda, scope?: any): Lambda;
export declare function autorunAsync(name: string, func: (r: IReactionPublic) => any, delay?: number, scope?: any): IReactionDisposer;
export declare function autorunAsync(func: (r: IReactionPublic) => any, delay?: number, scope?: any): IReactionDisposer;
export interface IReactionOptions {
    context?: any;
    fireImmediately?: boolean;
    delay?: number;
    compareStructural?: boolean;
    /** alias for compareStructural */
    struct?: boolean;
    equals?: IEqualsComparer<any>;
    name?: string;
}
/**
 *
 * Basically sugar for computed(expr).observe(action(effect))
 * or
 * autorun(() => action(effect)(expr));
 */
export declare function reaction<T>(expression: (r: IReactionPublic) => T, effect: (arg: T, r: IReactionPublic) => void, opts?: IReactionOptions): IReactionDisposer;
export declare function reaction<T>(expression: (r: IReactionPublic) => T, effect: (arg: T, r: IReactionPublic) => void, fireImmediately?: boolean): IReactionDisposer;
