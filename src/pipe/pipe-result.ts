import { ok, type Result } from "neverthrow";

type ResultFn<T, E, U> = (value: T) => Result<U, E>;

/**
 * Pipe a value through {@link Result}-returning steps, short-circuiting on first {@link Err}.
 */
export function pipeResult<T, E>(
  value: T,
  ...fns: [ResultFn<T, E, unknown>, ...ResultFn<unknown, E, unknown>[]]
): Result<unknown, E>;
export function pipeResult<T, E, U>(
  value: T,
  fn1: ResultFn<T, E, U>,
): Result<U, E>;
export function pipeResult<T, E, U, V>(
  value: T,
  fn1: ResultFn<T, E, U>,
  fn2: ResultFn<U, E, V>,
): Result<V, E>;
export function pipeResult<T, E, U, V, W>(
  value: T,
  fn1: ResultFn<T, E, U>,
  fn2: ResultFn<U, E, V>,
  fn3: ResultFn<V, E, W>,
): Result<W, E>;
export function pipeResult<T, E>(
  value: T,
  ...fns: ResultFn<unknown, E, unknown>[]
): Result<unknown, E> {
  let current: Result<unknown, E> = ok(value);
  for (const fn of fns) {
    if (current.isErr()) return current;
    current = fn(current.value);
  }
  return current;
}
