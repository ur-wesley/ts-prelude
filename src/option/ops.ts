import { err, ok, type Result } from "neverthrow";
import { none, some, type None, type Option, type Some } from "./types.js";

/** Type guard for {@link Some}. */
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option._tag === "Some";
}

/** Type guard for {@link None}. */
export function isNone<T>(option: Option<T>): option is None {
  return option._tag === "None";
}

/**
 * Transform the inner value when {@link Some}; propagate {@link None}.
 *
 * @example
 * ```ts
 * map(some(2), (n) => n * 2); // Some(4)
 * map(none(), (n) => n);       // None
 * ```
 */
export function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return isSome(option) ? some(fn(option.value)) : none();
}

/**
 * Monadic bind — chain computations that return {@link Option}.
 *
 * @example
 * ```ts
 * andThen(some("hi"), (s) => s.length > 0 ? some(s.length) : none());
 * ```
 */
export function andThen<T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>,
): Option<U> {
  return isSome(option) ? fn(option.value) : none();
}

/**
 * Extract the value or a fallback when {@link None}.
 *
 * @param fallback - Value returned for {@link None}.
 */
export function getOrElse<T>(option: Option<T>, fallback: T): T {
  return isSome(option) ? option.value : fallback;
}

/**
 * Extract the value or `null` when {@link None}.
 */
export function getOrNull<T>(option: Option<T>): T | null {
  return isSome(option) ? option.value : null;
}

/**
 * Convert {@link Option} to neverthrow {@link Result}.
 *
 * @param error - Error value used when {@link None}.
 *
 * @example
 * ```ts
 * toResult(some(1), "missing"); // Ok(1)
 * toResult(none(), "missing");  // Err("missing")
 * ```
 */
export function toResult<T, E>(option: Option<T>, error: E): Result<T, E> {
  return isSome(option) ? ok(option.value) : err(error);
}

/**
 * Keep {@link Some} only when the predicate passes; otherwise {@link None}.
 */
export function filter<T>(
  option: Option<T>,
  predicate: (value: T) => boolean,
): Option<T> {
  return isSome(option) && predicate(option.value) ? option : none();
}

/**
 * Return `other` when this option is {@link None}.
 */
export function or<T>(option: Option<T>, other: Option<T>): Option<T> {
  return isSome(option) ? option : other;
}

/**
 * Compute a fallback option when this one is {@link None}.
 */
export function orElse<T>(option: Option<T>, fn: () => Option<T>): Option<T> {
  return isSome(option) ? option : fn();
}

/**
 * Flatten a nested {@link Option}.
 */
export function flatten<T>(option: Option<Option<T>>): Option<T> {
  return isSome(option) ? option.value : none();
}

/**
 * Combine two options into a tuple when both are {@link Some}.
 */
export function zip<T, U>(a: Option<T>, b: Option<U>): Option<[T, U]> {
  return isSome(a) && isSome(b) ? some([a.value, b.value]) : none();
}

/**
 * Combine two options with a function when both are {@link Some}.
 */
export function zipWith<T, U, R>(
  a: Option<T>,
  b: Option<U>,
  fn: (a: T, b: U) => R,
): Option<R> {
  return isSome(a) && isSome(b) ? some(fn(a.value, b.value)) : none();
}

/**
 * Run a side effect on {@link Some}, then return the original option.
 */
export function tap<T>(option: Option<T>, fn: (value: T) => void): Option<T> {
  if (isSome(option)) fn(option.value);
  return option;
}

/**
 * Extract the inner value or throw when {@link None}.
 */
export function unwrap<T>(option: Option<T>): T {
  if (isSome(option)) return option.value;
  throw new Error("Called unwrap on None");
}

/**
 * Extract the inner value or throw with a custom message when {@link None}.
 */
export function expect<T>(option: Option<T>, message: string): T {
  if (isSome(option)) return option.value;
  throw new Error(message);
}
