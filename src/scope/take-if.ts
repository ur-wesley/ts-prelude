import { some, none, type Option } from "../option/types.js";
import { fromNullable } from "../option/constructors.js";
import { isSome } from "../option/ops.js";

/**
 * Wrap `value` in {@link Some} when the predicate passes; otherwise {@link None}.
 */
export function takeIf<T>(
  value: T,
  predicate: (value: T) => boolean,
): Option<T> {
  return predicate(value) ? some(value) : none();
}

/**
 * Wrap `value` in {@link Some} when the predicate fails; otherwise {@link None}.
 */
export function takeUnless<T>(
  value: T,
  predicate: (value: T) => boolean,
): Option<T> {
  return takeIf(value, (v) => !predicate(v));
}

/**
 * Wrap a nullable value in {@link Some} when defined and the predicate passes.
 */
export function takeIfDefined<T>(
  value: T | null | undefined,
  predicate: (value: T) => boolean,
): Option<T> {
  const option = fromNullable(value);
  return isSome(option) && predicate(option.value) ? option : none();
}
