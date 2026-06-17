/** Lazy, chainable iterator wrapper with FP-style combinators. */
export type LazyIterator<T> = {
  /** Map each element lazily. */
  map<U>(fn: (value: T) => U): LazyIterator<U>;
  /** Keep elements matching the predicate. */
  filter(fn: (value: T) => boolean): LazyIterator<T>;
  /** Flat-map each element into a lazy sequence. */
  flatMap<U>(fn: (value: T) => LazyIterator<U>): LazyIterator<U>;
  /** Take at most `n` elements. */
  take(n: number): LazyIterator<T>;
  /** Skip the first `n` elements. */
  skip(n: number): LazyIterator<T>;
  /** Take elements while the predicate holds. */
  takeWhile(fn: (value: T) => boolean): LazyIterator<T>;
  /** Skip elements while the predicate holds. */
  skipWhile(fn: (value: T) => boolean): LazyIterator<T>;
  /** Pair each element with its index. */
  enumerate(): LazyIterator<[number, T]>;
  /** Append another iterable lazily. */
  chain<U>(other: Iterable<U>): LazyIterator<T | U>;
  /** Materialize to an array. */
  collect(): T[];
  /** Left-fold with initial accumulator. */
  fold<U>(init: U, fn: (acc: U, value: T) => U): U;
  /** Return the first matching element. */
  find(fn: (value: T) => boolean): T | undefined;
  [Symbol.iterator](): Iterator<T>;
};

/**
 * Build a {@link LazyIterator} from a generator factory.
 *
 * @internal
 */
export function createIterator<T>(gen: () => Iterator<T>): LazyIterator<T> {
  const self: LazyIterator<T> = {
    map(fn) {
      return createIterator(function* () {
        for (const value of self) yield fn(value);
      });
    },
    filter(fn) {
      return createIterator(function* () {
        for (const value of self) {
          if (fn(value)) yield value;
        }
      });
    },
    flatMap(fn) {
      return createIterator(function* () {
        for (const value of self) {
          yield* fn(value);
        }
      });
    },
    take(n) {
      return createIterator(function* () {
        let count = 0;
        for (const value of self) {
          if (count >= n) return;
          yield value;
          count++;
        }
      });
    },
    skip(n) {
      return createIterator(function* () {
        let count = 0;
        for (const value of self) {
          if (count >= n) yield value;
          count++;
        }
      });
    },
    takeWhile(fn) {
      return createIterator(function* () {
        for (const value of self) {
          if (!fn(value)) return;
          yield value;
        }
      });
    },
    skipWhile(fn) {
      return createIterator(function* () {
        let skipping = true;
        for (const value of self) {
          if (skipping && fn(value)) continue;
          skipping = false;
          yield value;
        }
      });
    },
    enumerate() {
      return createIterator(function* () {
        let index = 0;
        for (const value of self) {
          yield [index, value] as [number, T];
          index++;
        }
      });
    },
    chain(other) {
      return createIterator(function* () {
        yield* self;
        yield* other;
      });
    },
    collect() {
      return [...self];
    },
    fold(init, fn) {
      let acc = init;
      for (const value of self) acc = fn(acc, value);
      return acc;
    },
    find(fn) {
      for (const value of self) {
        if (fn(value)) return value;
      }
      return undefined;
    },
    [Symbol.iterator]() {
      return gen();
    },
  };
  return self;
}

/**
 * Wrap any {@link Iterable} as a {@link LazyIterator}.
 *
 * @example
 * ```ts
 * fromIterable([1, 2, 3]).map((n) => n * 2).take(2).collect(); // [2, 4]
 * ```
 */
export function fromIterable<T>(iterable: Iterable<T>): LazyIterator<T> {
  return createIterator(() => iterable[Symbol.iterator]());
}
