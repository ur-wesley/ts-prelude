import type { Option } from "../option/types.js";
import { none, some } from "../option/types.js";
import type { LazyIterator } from "./core.js";

/** Return the first element as {@link Option}. */
export function first<T>(iter: LazyIterator<T>): Option<T> {
  for (const value of iter) return some(value);
  return none();
}

/** Return the last element as {@link Option}. */
export function last<T>(iter: LazyIterator<T>): Option<T> {
  let result: Option<T> = none();
  for (const value of iter) result = some(value);
  return result;
}
