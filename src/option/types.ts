/** A present {@link Option} value. */
export type Some<T> = { readonly _tag: "Some"; readonly value: T };

/** An absent {@link Option} value. */
export type None = { readonly _tag: "None" };

/** Rust-style optional value — either {@link Some} or {@link None}. */
export type Option<T> = Some<T> | None;

/**
 * Wrap a value in {@link Some}.
 *
 * @example
 * ```ts
 * some(42); // { _tag: "Some", value: 42 }
 * ```
 */
export function some<T>(value: T): Some<T> {
  return { _tag: "Some", value };
}

/**
 * Create an empty {@link None}.
 *
 * @example
 * ```ts
 * none(); // { _tag: "None" }
 * ```
 */
export function none(): None {
  return { _tag: "None" };
}
