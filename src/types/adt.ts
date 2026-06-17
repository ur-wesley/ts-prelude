/**
 * Create a tagged object for ADT discriminant matching.
 *
 * @example
 * ```ts
 * const kind = tag("loading"); // { _tag: "loading" }
 * ```
 */
export const tag = <T extends string>(value: T): { readonly _tag: T } => ({
  _tag: value,
});

/**
 * Type guard for a specific `_tag` discriminant.
 */
export const isTag =
  <T extends string>(expected: T) =>
  (value: { readonly _tag: string }): value is { readonly _tag: T } =>
    value._tag === expected;

/**
 * Return the value when the predicate passes, otherwise `undefined`.
 */
export const narrow =
  <T, U extends T>(predicate: (value: T) => value is U) =>
  (value: T): U | undefined =>
    predicate(value) ? value : undefined;
