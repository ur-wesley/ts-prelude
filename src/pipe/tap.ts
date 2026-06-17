/**
 * Run a side effect on a value, then return the value unchanged.
 *
 * @example
 * ```ts
 * import { logger } from "@ur-wesley/ts-prelude/log";
 * pipe(1, tap((n) => logger.info(n)), (n) => n + 1);
 * ```
 */
export const tap =
  <T>(fn: (value: T) => void) =>
  (value: T): T => {
    fn(value);
    return value;
  };
