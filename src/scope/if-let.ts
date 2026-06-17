import type { Option } from "../option/types.js";
import { isSome } from "../option/ops.js";

/**
 * Run `fn` when an {@link Option} is {@link Some}; otherwise return `undefined`.
 *
 * @param option - The option to inspect.
 * @param fn - Called with the inner value when present.
 * @returns The result of `fn`, or `undefined` for {@link None}.
 *
 * @example
 * ```ts
 * ifSome(some(2), (n) => n * 2); // 4
 * ifSome(none(), (n) => n);      // undefined
 * ```
 */
export function ifSome<T, R>(
  option: Option<T>,
  fn: (value: T) => R,
): R | undefined {
  if (isSome(option)) return fn(option.value);
  return undefined;
}

const isOption = <T>(value: unknown): value is Option<T> =>
  typeof value === "object" &&
  value !== null &&
  "_tag" in value &&
  (value._tag === "Some" || value._tag === "None");

/**
 * Kotlin-style `if-let` for nullable values and {@link Option}.
 *
 * @param value - A nullable value or option.
 * @param fn - Called when a value is present.
 * @returns The result of `fn`, or `undefined`.
 *
 * @example
 * ```ts
 * ifLet("hi", (s) => s.length); // 2
 * ifLet(null, (s) => s);          // undefined
 * ```
 */
export function ifLet<T, R>(
  value: T | null | undefined | Option<T>,
  fn: (value: T) => R,
): R | undefined {
  if (value == null) return undefined;
  if (isOption<T>(value)) {
    return isSome(value) ? fn(value.value) : undefined;
  }
  return fn(value);
}
