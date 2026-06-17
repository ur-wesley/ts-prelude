import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { Option } from "../option/types.js";
import { isSome } from "../option/ops.js";
import { none, some } from "../option/types.js";

/**
 * Kotlin `let` — transform a value and return the result.
 *
 * @example
 * ```ts
 * let_(5, (n) => n * 2); // 10
 * let_(some(1), (n) => n + 1); // Some(2)
 * ```
 */
export function let_<T, R>(value: T, fn: (v: T) => R): R;
export function let_<T, R>(value: Option<T>, fn: (v: T) => R): Option<R>;
export function let_<T, E, R>(
  value: Result<T, E>,
  fn: (v: T) => R,
): Result<R, E>;
export function let_<T, E, R>(
  value: T | Option<T> | Result<T, E>,
  fn: (v: T) => R,
): R | Option<R> | Result<R, E> {
  if (typeof value === "object" && value !== null) {
    if ("isOk" in value && typeof value.isOk === "function") {
      const result = value as Result<T, E>;
      return result.isOk() ? ok(fn(result.value)) : err(result.error);
    }
    if ("_tag" in value) {
      const option = value as Option<T>;
      return isSome(option) ? some(fn(option.value)) : none();
    }
  }
  return fn(value as T);
}

/**
 * Kotlin `run` — execute a block with the value as receiver context.
 *
 * @example
 * ```ts
 * run("hi", (s) => s.length); // 2
 * ```
 */
export function run<T, R>(value: T, fn: (v: T) => R): R;
export function run<T, R>(value: Option<T>, fn: (v: T) => R): Option<R>;
export function run<T, E, R>(
  value: Result<T, E>,
  fn: (v: T) => R,
): Result<R, E>;
export function run<T, E, R>(
  value: T | Option<T> | Result<T, E>,
  fn: (v: T) => R,
): R | Option<R> | Result<R, E> {
  return let_(value as T, fn);
}

/**
 * Kotlin `apply` — configure a value via side effect, then return it.
 *
 * @example
 * ```ts
 * const arr = apply([1], (a) => { a.push(2); }); // [1, 2]
 * ```
 */
export function apply<T>(value: T, fn: (v: T) => void): T;
export function apply<T>(value: Option<T>, fn: (v: T) => void): Option<T>;
export function apply<T, E>(
  value: Result<T, E>,
  fn: (v: T) => void,
): Result<T, E>;
export function apply<T, E>(
  value: T | Option<T> | Result<T, E>,
  fn: (v: T) => void,
): T | Option<T> | Result<T, E> {
  if (typeof value === "object" && value !== null) {
    if ("isOk" in value && typeof value.isOk === "function") {
      const result = value as Result<T, E>;
      if (result.isOk()) fn(result.value);
      return result;
    }
    if ("_tag" in value) {
      const option = value as Option<T>;
      if (isSome(option)) fn(option.value);
      return option;
    }
  }
  fn(value as T);
  return value as T;
}

/**
 * Kotlin `also` — run a side effect on a value, then return the original.
 *
 * @example
 * ```ts
 * import { logger } from "@ur-wesley/ts-prelude/log";
 * also(1, (n) => logger.info(n)); // logs 1, returns 1
 * ```
 */
export const also = apply;

/**
 * Kotlin `with` — combine two values in a computation.
 *
 * @example
 * ```ts
 * with_(1, 2, (a, b) => a + b); // 3
 * ```
 */
export function with_<T, U, R>(value: T, other: U, fn: (v: T, o: U) => R): R {
  return fn(value, other);
}

/**
 * Run `fn` when a {@link Result} is {@link Ok}.
 *
 * @returns The result of `fn`, or `undefined` on error.
 */
export function ifOk<T, E, R>(
  result: Result<T, E>,
  fn: (value: T) => R,
): R | undefined {
  if (result.isOk()) return fn(result.value);
  return undefined;
}

/**
 * Run `fn` when a {@link Result} is {@link Err}.
 *
 * @returns The result of `fn`, or `undefined` on success.
 */
export function ifErr<T, E, R>(
  result: Result<T, E>,
  fn: (error: E) => R,
): R | undefined {
  if (result.isErr()) return fn(result.error);
  return undefined;
}

/**
 * Run `fn` when a nullable value is defined.
 *
 * @returns The result of `fn`, or `undefined` for `null`/`undefined`.
 */
export function ifDefined<T, R>(
  value: T | null | undefined,
  fn: (v: T) => R,
): R | undefined {
  if (value != null) return fn(value);
  return undefined;
}

export { ifLet, ifSome } from "./if-let.js";
export { takeIf, takeUnless, takeIfDefined } from "./take-if.js";
export { check, require } from "./guards.js";
