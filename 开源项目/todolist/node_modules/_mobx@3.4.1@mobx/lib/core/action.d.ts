export interface IAction {
    originalFn: Function;
    isMobxAction: boolean;
}
export declare function createAction(actionName: string, fn: Function): Function & IAction;
export declare function executeAction(actionName: string, fn: Function, scope?: any, args?: IArguments): any;
export declare function useStrict(strict: boolean): void;
export declare function isStrictModeEnabled(): boolean;
export declare function allowStateChanges<T>(allowStateChanges: boolean, func: () => T): T;
export declare function allowStateChangesStart(allowStateChanges: boolean): boolean;
export declare function allowStateChangesEnd(prev: boolean): void;
