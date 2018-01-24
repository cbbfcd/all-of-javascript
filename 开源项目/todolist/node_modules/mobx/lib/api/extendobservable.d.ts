import { IEnhancer } from "../types/modifiers";
export declare function extendObservable<A extends Object, B extends Object>(target: A, ...properties: B[]): A & B;
export declare function extendShallowObservable<A extends Object, B extends Object>(target: A, ...properties: B[]): A & B;
export declare function extendObservableHelper(target: Object, defaultEnhancer: IEnhancer<any>, properties: Object[]): Object;
