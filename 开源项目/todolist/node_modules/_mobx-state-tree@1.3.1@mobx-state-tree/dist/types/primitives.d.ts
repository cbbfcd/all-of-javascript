import { Type, INode, ISimpleType, IType, TypeFlags, IContext, IValidationResult, ObjectNode } from "../internal";
export declare class CoreType<S, T> extends Type<S, T> {
    readonly shouldAttachNode: boolean;
    readonly checker: (value: any) => boolean;
    readonly flags: TypeFlags;
    readonly initializer: (v: any) => any;
    constructor(name: any, flags: TypeFlags, checker: any, initializer?: (v: any) => any);
    describe(): string;
    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: T): INode;
    isValidSnapshot(value: any, context: IContext): IValidationResult;
}
/**
 * Creates a type that can only contain a string value.
 * This type is used for string values by default
 *
 * @export
 * @alias types.string
 * @example
 * const Person = types.model({
 *   firstName: types.string,
 *   lastName: "Doe"
 * })
 */
export declare const string: ISimpleType<string>;
/**
 * Creates a type that can only contain a numeric value.
 * This type is used for numeric values by default
 *
 * @export
 * @alias types.number
 * @example
 * const Vector = types.model({
 *   x: types.number,
 *   y: 0
 * })
 */
export declare const number: ISimpleType<number>;
/**
 * Creates a type that can only contain a boolean value.
 * This type is used for boolean values by default
 *
 * @export
 * @alias types.boolean
 * @example
 * const Thing = types.model({
 *   isCool: types.boolean,
 *   isAwesome: false
 * })
 */
export declare const boolean: ISimpleType<boolean>;
/**
 * The type of the value `null`
 *
 * @export
 * @alias types.null
 */
export declare const nullType: ISimpleType<null>;
/**
 * The type of the value `undefined`
 *
 * @export
 * @alias types.undefined
 */
export declare const undefinedType: ISimpleType<undefined>;
/**
 * Creates a type that can only contain a javascript Date value.
 *
 * @export
 * @alias types.Date
 * @example
 * const LogLine = types.model({
 *   timestamp: types.Date,
 * })
 *
 * LogLine.create({ timestamp: new Date() })
 */
export declare const DatePrimitive: IType<number, Date>;
export declare function getPrimitiveFactoryFromValue(value: any): ISimpleType<any>;
export declare function isPrimitiveType(type: any): type is CoreType<any, any>;
