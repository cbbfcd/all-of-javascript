export interface IAtom extends IObservable {
}
/**
 * Anything that can be used to _store_ state is an Atom in mobx. Atoms have two important jobs
 *
 * 1) detect when they are being _used_ and report this (using reportObserved). This allows mobx to make the connection between running functions and the data they used
 * 2) they should notify mobx whenever they have _changed_. This way mobx can re-run any functions (derivations) that are using this atom.
 */
export declare class BaseAtom implements IAtom {
    name: string;
    isPendingUnobservation: boolean;
    observers: never[];
    observersIndexes: {};
    diffValue: number;
    lastAccessedBy: number;
    lowestObserverState: IDerivationState;
    /**
     * Create a new atom. For debugging purposes it is recommended to give it a name.
     * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
     */
    constructor(name?: string);
    onBecomeUnobserved(): void;
    /**
     * Invoke this method to notify mobx that your atom has been used somehow.
     */
    reportObserved(): void;
    /**
     * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
     */
    reportChanged(): void;
    toString(): string;
}
export declare class Atom extends BaseAtom implements IAtom {
    name: string;
    onBecomeObservedHandler: () => void;
    onBecomeUnobservedHandler: () => void;
    isPendingUnobservation: boolean;
    isBeingTracked: boolean;
    /**
     * Create a new atom. For debugging purposes it is recommended to give it a name.
     * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
     */
    constructor(name?: string, onBecomeObservedHandler?: () => void, onBecomeUnobservedHandler?: () => void);
    reportObserved(): boolean;
    onBecomeUnobserved(): void;
}
import { IObservable } from "./observable";
import { IDerivationState } from "./derivation";
export declare const isAtom: (x: any) => x is BaseAtom;
