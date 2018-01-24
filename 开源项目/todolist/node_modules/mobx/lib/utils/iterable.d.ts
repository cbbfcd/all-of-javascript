export declare const IS_ITERATING_MARKER = "__$$iterating";
export interface Iterator<T> {
    next(): {
        done: boolean;
        value?: T;
    };
}
export declare function arrayAsIterator<T>(array: T[]): T[] & Iterator<T>;
export declare function declareIterator<T>(prototType: any, iteratorFactory: () => Iterator<T>): void;
