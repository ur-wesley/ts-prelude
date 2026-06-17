import { none, some, type Option } from "./types.js";

/**
 * Lift a nullable value into an {@link Option}.
 *
 * @param value - Any value; `null` and `undefined` become {@link None}.
 * @returns {@link Some} when defined, otherwise {@link None}.
 *
 * @example
 * ```ts
 * fromNullable("hi"); // Some("hi")
 * fromNullable(null); // None
 * ```
 */
export function fromNullable<T>(value: T | null | undefined): Option<T> {
  return value == null ? none() : some(value);
}
