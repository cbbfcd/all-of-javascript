import { IType } from "../../internal";
/**
 * Maybe will make a type nullable, and also null by default.
 *
 * @export
 * @alias types.maybe
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null | undefined, T | null>)}
 */
export declare function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null>;
