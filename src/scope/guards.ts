import { err, ok, type Result } from "neverthrow";

/**
 * Return {@link Ok} when `value` is defined; otherwise {@link Err} with `error()`.
 */
export function require<T, E>(
  value: T | null | undefined,
  error: () => E,
): Result<T, E> {
  return value != null ? ok(value) : err(error());
}

/**
 * Return {@link Ok} when `condition` is true; otherwise {@link Err} with `error()`.
 */
export function check<E>(condition: boolean, error: () => E): Result<void, E> {
  return condition ? ok(undefined) : err(error());
}
