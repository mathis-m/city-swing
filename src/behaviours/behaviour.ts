export interface Behaviour<TTarget, TArgs extends unknown[]> {
    update(target: TTarget, ...args: TArgs): void;
}