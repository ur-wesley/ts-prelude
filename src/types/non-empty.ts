import { none, some, type Option } from "../option/types.js";

/** Array guaranteed to contain at least one element. */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Lift a non-empty array into {@link Some}, or {@link None} when empty.
 *
 * @example
 * ```ts
 * fromArray([1, 2]); // Some([1, 2])
 * fromArray([]);     // None
 * ```
 */
export const fromArray = <T>(items: readonly T[]): Option<NonEmptyArray<T>> =>
  items.length > 0 ? some(items as NonEmptyArray<T>) : none();

/** Type guard for {@link NonEmptyArray}. */
export const isNonEmpty = <T>(items: readonly T[]): items is NonEmptyArray<T> =>
  items.length > 0;
