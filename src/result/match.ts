import type { Result } from "neverthrow";

/**
 * Exhaustively match a {@link Result} with ok/err handlers.
 *
 * @example
 * ```ts
 * matchResult(ok(1), { ok: (v) => v * 2, err: () => 0 }); // 2
 * ```
 */
export const matchResult = <T, E, U>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => U; err: (error: E) => U },
): U => result.match(handlers.ok, handlers.err);
