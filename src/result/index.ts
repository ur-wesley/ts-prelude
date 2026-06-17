/**
 * neverthrow {@link Result} re-exports plus traverse, sequence, and match helpers.
 *
 * @packageDocumentation
 */
export {
  err,
  errAsync,
  fromPromise,
  fromThrowable,
  ok,
  okAsync,
  Result,
  ResultAsync,
  safeTry,
} from "neverthrow";

export { matchResult } from "./match.js";
export {
  partitionMap,
  partitionResult,
  sequence,
  traverse,
  traverseOption,
} from "./combine.js";
export { context, runCatching, wrapError } from "./context.js";
export { map2, map3, zip } from "./map2.js";

import { Result, ResultAsync } from "neverthrow";

/** Accumulate all errors from a list of results (Scala `Validated` style). */
export const combineWithAllErrors = Result.combineWithAllErrors.bind(Result);

/** Async variant of {@link combineWithAllErrors}. */
export const combineWithAllErrorsAsync =
  ResultAsync.combineWithAllErrors.bind(ResultAsync);
