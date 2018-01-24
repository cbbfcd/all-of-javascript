export interface IEnhancer<T> {
    (newValue: T, oldValue: T | undefined, name: string): T;
}
export interface IModifierDescriptor<T> {
    isMobxModifierDescriptor: boolean;
    initialValue: T | undefined;
    enhancer: IEnhancer<T>;
}
export declare function isModifierDescriptor(thing: any): thing is IModifierDescriptor<any>;
export declare function createModifierDescriptor<T>(enhancer: IEnhancer<T>, initialValue: T): IModifierDescriptor<T>;
export declare function deepEnhancer(v: any, _: any, name: any): any;
export declare function shallowEnhancer(v: any, _: any, name: any): any;
export declare function referenceEnhancer(newValue?: any): any;
export declare function deepStructEnhancer(v: any, oldValue: any, name: any): any;
export declare function refStructEnhancer(v: any, oldValue: any, name: any): any;
