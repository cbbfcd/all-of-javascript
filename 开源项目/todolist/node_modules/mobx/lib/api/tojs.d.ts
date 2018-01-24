/**
 * Basically, a deep clone, so that no reactive property will exist anymore.
 */
export declare function toJS<T>(source: T, detectCycles?: boolean): T;
export declare function toJS(source: any, detectCycles?: boolean): any;
export declare function toJS(source: any, detectCycles: boolean, __alreadySeen: [any, any][]): any;
