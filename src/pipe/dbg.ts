import { logger } from "../log/index.js";

/**
 * Debug-log a value and pass it through unchanged.
 *
 * @param label - Optional tag for the log line.
 *
 * @example
 * ```ts
 * import { dbg } from "@ur-wesley/ts-prelude/pipe";
 *
 * pipe(42, dbg("answer"), (n) => n + 1);
 * ```
 */
export const dbg =
  <T>(label?: string) =>
  (value: T): T => {
    const log = label ? logger.withTag(label) : logger;
    log.debug(value);
    return value;
  };
