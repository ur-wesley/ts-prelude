import { err, ok, type Result } from "neverthrow";

/**
 * Combine two results with a function when both are {@link Ok}.
 */
export function map2<T, U, R, E>(
  a: Result<T, E>,
  b: Result<U, E>,
  fn: (a: T, b: U) => R,
): Result<R, E> {
  if (a.isErr()) return err(a.error);
  if (b.isErr()) return err(b.error);
  return ok(fn(a.value, b.value));
}

/**
 * Combine three results with a function when all are {@link Ok}.
 */
export function map3<T, U, V, R, E>(
  a: Result<T, E>,
  b: Result<U, E>,
  c: Result<V, E>,
  fn: (a: T, b: U, c: V) => R,
): Result<R, E> {
  if (a.isErr()) return err(a.error);
  if (b.isErr()) return err(b.error);
  if (c.isErr()) return err(c.error);
  return ok(fn(a.value, b.value, c.value));
}

/**
 * Combine two results into a tuple when both are {@link Ok}.
 */
export function zip<T, U, E>(
  a: Result<T, E>,
  b: Result<U, E>,
): Result<[T, U], E> {
  return map2(a, b, (x, y) => [x, y] as [T, U]);
}
