/**
 * Typesafe env config loader — declarative schema, {@link Result}-based errors.
 *
 * @packageDocumentation
 */
export { defineConfig, loadConfig } from "./load.js";
export { boolean, enum_, number, optional, string } from "./parsers.js";
export type {
  ConfigDef,
  ConfigError,
  InferConfig,
  ParseContext,
  ParserOpts,
} from "./types.js";
