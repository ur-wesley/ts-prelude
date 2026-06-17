import { err, ok, type Result } from "neverthrow";

/** Compile-time branded type wrapper for newtype patterns. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * Attach a compile-time brand to a value (zero runtime cost).
 *
 * @example
 * ```ts
 * type UserId = Brand<string, "UserId">;
 * const id = brand<string, "UserId">("u-1");
 * ```
 */
export const brand = <T, B extends string>(value: T): Brand<T, B> =>
  value as Brand<T, B>;

/** Remove a compile-time brand. */
export const unbrand = <T, B extends string>(value: Brand<T, B>): T =>
  value as T;

/**
 * Brand a value when `predicate` passes; otherwise return {@link Err}.
 */
export const refine = <T, B extends string, E>(
  value: T,
  predicate: (value: T) => boolean,
  error: E,
): Result<Brand<T, B>, E> =>
  predicate(value) ? ok(brand<T, B>(value)) : err(error);
