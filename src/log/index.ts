import { createConsola, type ConsolaInstance } from "consola";

/**
 * Default library logger — use for debug output, taps, and side-effect logging.
 *
 * @example
 * ```ts
 * import { logger } from "@ur-wesley/ts-prelude/log";
 *
 * logger.info("ready");
 * logger.withTag("parse").debug({ input: "hi" });
 * ```
 */
export const logger: ConsolaInstance = createConsola({
  defaults: { tag: "ts-prelude" },
});

export { createConsola, type ConsolaInstance } from "consola";
