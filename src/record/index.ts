import { evolve, setPath } from "remeda";

export function copy<T extends Record<string, unknown>>(record: T): T {
  return { ...record };
}

type EvolveChanges<T> = {
  [K in keyof T]?: (value: T[K]) => T[K];
};

export function update<T extends Record<string, unknown>>(
  record: T,
  changes: EvolveChanges<T>,
): T {
  return evolve(record, changes as never) as T;
}

export function updatePath<T extends Record<string, unknown>>(
  record: T,
  path: readonly [string, ...string[]],
  value: unknown,
): T {
  return setPath(record, path as never, value as never);
}
