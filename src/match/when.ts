type HandlerMap<T, R> = Record<string, (value: unknown) => R> & {
  _: (value: T) => R;
};

export function when<T, R>(value: T, cases: HandlerMap<T, R>): R {
  if (typeof value === "object" && value !== null && "_tag" in value) {
    const tag = (value as { _tag: string })._tag;
    const handler = cases[tag];
    if (handler) return handler(value);
  }
  return cases._(value);
}

export function whenMatch<T extends { _tag: string }, R>(
  value: T,
  cases: { [K in T["_tag"]]?: (v: Extract<T, { _tag: K }>) => R } & {
    _: (v: T) => R;
  },
): R {
  const tag = value._tag;
  const handler = cases[tag as T["_tag"]];
  if (handler) return handler(value as Extract<T, { _tag: typeof tag }>);
  return cases._(value);
}
