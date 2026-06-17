/**
 * Left-to-right function composition (variadic overloads).
 *
 * @example
 * ```ts
 * const double = (n: number) => n * 2;
 * const toString = (n: number) => String(n);
 * flow(double, toString)(3); // "6"
 * ```
 */
export function flow<T>(fn: (arg: T) => T): (arg: T) => T;
export function flow<T, U>(fn1: (arg: T) => U): (arg: T) => U;
export function flow<T, U, V>(
  fn1: (arg: T) => U,
  fn2: (arg: U) => V,
): (arg: T) => V;
export function flow<T, U, V, W>(
  fn1: (arg: T) => U,
  fn2: (arg: U) => V,
  fn3: (arg: V) => W,
): (arg: T) => W;
export function flow<T, U, V, W, X>(
  fn1: (arg: T) => U,
  fn2: (arg: U) => V,
  fn3: (arg: V) => W,
  fn4: (arg: W) => X,
): (arg: T) => X;
export function flow<T, U, V, W, X, Y>(
  fn1: (arg: T) => U,
  fn2: (arg: U) => V,
  fn3: (arg: V) => W,
  fn4: (arg: W) => X,
  fn5: (arg: X) => Y,
): (arg: T) => Y;
export function flow(...fns: Array<(arg: never) => unknown>) {
  return (initial: unknown) =>
    fns.reduce((acc, fn) => fn(acc as never), initial);
}

/** Alias for {@link flow}. */
export const compose = flow;
