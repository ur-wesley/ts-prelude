import { err, ok, type Result } from "neverthrow";
import type { Option } from "../option/types.js";
import { fromNullable } from "../option/constructors.js";

export { fromNullable };

/**
 * Convert nullable to {@link Option}.
 *
 * @example
 * ```ts
 * toOption("hi"); // Some("hi")
 * toOption(null); // None
 * ```
 */
export const toOption = <T>(value: T | null | undefined): Option<T> =>
  fromNullable(value);

/**
 * Convert nullable to {@link Result}.
 *
 * @param error - Error value for `null`/`undefined`.
 *
 * @example
 * ```ts
 * toResult("hi", "missing"); // Ok("hi")
 * ```
 */
export const toResult = <T, E>(
  value: T | null | undefined,
  error: E,
): Result<T, E> => (value == null ? err(error) : ok(value));
