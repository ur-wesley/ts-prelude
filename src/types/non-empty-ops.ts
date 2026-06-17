import type { NonEmptyArray } from "./non-empty.js";

export const head = <T>(items: NonEmptyArray<T>): T => items[0];

export const last = <T>(items: NonEmptyArray<T>): T => items[items.length - 1]!;

export const tail = <T>(items: NonEmptyArray<T>): T[] => items.slice(1);

export const map = <T, U>(
  items: NonEmptyArray<T>,
  fn: (value: T) => U,
): NonEmptyArray<U> => items.map(fn) as NonEmptyArray<U>;

export const append = <T>(
  items: NonEmptyArray<T>,
  value: T,
): NonEmptyArray<T> => [...items, value];

export const concat = <T>(
  a: NonEmptyArray<T>,
  b: NonEmptyArray<T>,
): NonEmptyArray<T> => [...a, ...b];

export const reduce1 = <T>(
  items: NonEmptyArray<T>,
  fn: (acc: T, value: T) => T,
): T => items.slice(1).reduce(fn, items[0]);

export const toArray = <T>(items: NonEmptyArray<T>): T[] => [...items];
