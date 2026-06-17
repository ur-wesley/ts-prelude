import type { Result } from "neverthrow";
import type { Option } from "../option/types.js";
import { isSome } from "../option/ops.js";
import { fromIterable } from "./core.js";

/** Create a lazy iterator from an array. */
export function fromArray<T>(arr: readonly T[]) {
  return fromIterable(arr);
}

/** Yield zero or one element from an {@link Option}. */
export function fromOption<T>(option: Option<T>) {
  return fromIterable(isSome(option) ? [option.value] : ([] as T[]));
}

/** Yield zero or one element from a {@link Result}. */
export function fromResult<T, E>(result: Result<T, E>) {
  return fromIterable(result.isOk() ? [result.value] : ([] as T[]));
}
