import { ObservableMap, IMapEntries, IKeyValueMap } from "./observablemap";
export declare function asReference<T>(value: T): T;
export declare function asStructure<T>(value: T): T;
export declare function asFlat<T>(value: T): T;
export declare function asMap(): ObservableMap<any>;
export declare function asMap<T>(): ObservableMap<T>;
export declare function asMap<T>(entries: IMapEntries<T>): ObservableMap<T>;
export declare function asMap<T>(data: IKeyValueMap<T>): ObservableMap<T>;
