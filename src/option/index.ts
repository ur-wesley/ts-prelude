/**
 * Rust-style {@link Option} type with constructors and combinators.
 *
 * @packageDocumentation
 */
export type { Some, None, Option } from "./types.js";
export { some, none } from "./types.js";
export { fromNullable } from "./constructors.js";
export {
  map,
  andThen,
  getOrElse,
  getOrNull,
  toResult,
  isSome,
  isNone,
  filter,
  or,
  orElse,
  flatten,
  zip,
  zipWith,
  tap,
  unwrap,
  expect,
} from "./ops.js";
