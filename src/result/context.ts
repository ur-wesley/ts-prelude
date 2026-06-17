import { fromThrowable, type Result } from "neverthrow";

/**
 * Kotlin `runCatching` — execute `fn` and capture success or failure as {@link Result}.
 */
export function runCatching<T>(fn: () => T): Result<T, unknown> {
  return fromThrowable(fn)();
}

/**
 * Attach context to an error when mapping {@link Err}.
 */
export function context<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return result.mapErr(fn);
}

/**
 * Wrap an error value with an additional message layer.
 */
export function wrapError<T, E>(
  result: Result<T, E>,
  message: string,
): Result<T, { message: string; cause: E }> {
  return result.mapErr((cause) => ({ message, cause }));
}
