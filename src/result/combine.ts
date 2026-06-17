import { err, ok, type Result } from "neverthrow";
import type { Option } from "../option/types.js";
import { isSome } from "../option/ops.js";

/**
 * Map a collection of items through a fallible function, short-circuiting on first error.
 *
 * @returns {@link Ok} of all values, or the first {@link Err}.
 *
 * @example
 * ```ts
 * traverse(["a", "bb"], (s) => ok(s.length)); // Ok([1, 2])
 * ```
 */
export function traverse<T, E, U>(
  items: readonly T[],
  fn: (item: T) => Result<U, E>,
): Result<U[], E> {
  const results: U[] = [];
  for (const item of items) {
    const result = fn(item);
    if (result.isErr()) return err(result.error);
    results.push(result.value);
  }
  return ok(results);
}

/**
 * Flip `Result<T, E>[]` into `Result<T[], E>`.
 *
 * @example
 * ```ts
 * sequence([ok(1), ok(2)]); // Ok([1, 2])
 * ```
 */
export function sequence<T, E>(
  results: readonly Result<T, E>[],
): Result<T[], E> {
  return traverse(results, (r) => r);
}

/**
 * Split a list of results into separate ok and err arrays.
 *
 * @example
 * ```ts
 * partitionResult([ok(1), err("a")]); // { ok: [1], err: ["a"] }
 * ```
 */
export function partitionResult<T, E>(
  results: readonly Result<T, E>[],
): { ok: T[]; err: E[] } {
  const okValues: T[] = [];
  const errValues: E[] = [];
  for (const result of results) {
    if (result.isOk()) okValues.push(result.value);
    else errValues.push(result.error);
  }
  return { ok: okValues, err: errValues };
}

/**
 * Map a collection through an optional function, short-circuiting on first {@link None}.
 */
export function traverseOption<T, U>(
  items: readonly T[],
  fn: (item: T) => Option<U>,
): Option<U[]> {
  const values: U[] = [];
  for (const item of items) {
    const option = fn(item);
    if (!isSome(option)) return { _tag: "None" };
    values.push(option.value);
  }
  return { _tag: "Some", value: values };
}

/**
 * Split a list of results into ok and err arrays after mapping each item.
 */
export function partitionMap<T, U, E>(
  items: readonly T[],
  fn: (item: T) => Result<U, E>,
): { ok: U[]; err: E[] } {
  return partitionResult(items.map(fn));
}
