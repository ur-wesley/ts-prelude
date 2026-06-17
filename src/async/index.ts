import {
  ResultAsync,
  errAsync,
  okAsync,
  type ResultAsync as RA,
} from "neverthrow";

export function retry<T, E>(
  fn: () => RA<T, E>,
  options: { times: number; delay?: number },
): RA<T, E> {
  const attempt = (remaining: number): RA<T, E> =>
    fn().orElse((error) => {
      if (remaining <= 1) return errAsync(error);
      if (options.delay) {
        return ResultAsync.fromSafePromise(
          new Promise<void>((resolve) => setTimeout(resolve, options.delay)),
        ).andThen(() => attempt(remaining - 1));
      }
      return attempt(remaining - 1);
    });

  return attempt(options.times);
}

export function withTimeout<T, E>(
  asyncResult: RA<T, E>,
  ms: number,
  timeoutError: E,
): RA<T, E> {
  return ResultAsync.fromSafePromise(
    Promise.race([
      asyncResult.match(
        (value) => Promise.resolve({ ok: true as const, value }),
        (error) => Promise.resolve({ ok: false as const, error }),
      ),
      new Promise<{ ok: false; error: E }>((resolve) =>
        setTimeout(() => resolve({ ok: false, error: timeoutError }), ms),
      ),
    ]),
  ).andThen((result) =>
    result.ok ? okAsync(result.value) : errAsync(result.error),
  );
}

export function race<T, E>(...asyncResults: RA<T, E>[]): RA<T, E> {
  return ResultAsync.fromSafePromise(
    Promise.race(
      asyncResults.map((r) =>
        r.match(
          (value) => ({ ok: true as const, value }),
          (error) => ({ ok: false as const, error }),
        ),
      ),
    ),
  ).andThen((result) =>
    result.ok ? okAsync(result.value) : errAsync(result.error),
  );
}

/**
 * Await all async results; short-circuits on first {@link Err}.
 */
export function parallel<T, E>(asyncResults: readonly RA<T, E>[]): RA<T[], E> {
  return ResultAsync.combine([...asyncResults]);
}

/**
 * Map items through an async fallible function with optional concurrency limit.
 */
export function asyncTraverse<T, E, U>(
  items: readonly T[],
  fn: (item: T) => RA<U, E>,
  options?: { concurrency?: number },
): RA<U[], E> {
  const concurrency = options?.concurrency ?? items.length;
  if (concurrency >= items.length) {
    return parallel(items.map(fn));
  }

  return ResultAsync.fromSafePromise(
    (async () => {
      const results: U[] = new Array(items.length);
      let nextIndex = 0;

      const worker = async (): Promise<void> => {
        while (nextIndex < items.length) {
          const index = nextIndex++;
          const result = await fn(items[index]!).match(
            (value) => ({ ok: true as const, value }),
            (error) => ({ ok: false as const, error }),
          );
          if (!result.ok) throw result;
          results[index] = result.value;
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      try {
        await Promise.all(workers);
      } catch (thrown) {
        const failure = thrown as { ok: false; error: E };
        return { ok: false as const, error: failure.error };
      }
      return { ok: true as const, value: results };
    })(),
  ).andThen((outcome) =>
    outcome.ok ? okAsync(outcome.value) : errAsync(outcome.error),
  );
}

const asyncCache = new WeakMap<() => Promise<unknown>, Promise<unknown>>();

/**
 * Memoize an async factory; concurrent callers share a single in-flight promise.
 */
export function lazyAsync<T>(factory: () => Promise<T>): () => Promise<T> {
  return () => {
    let pending = asyncCache.get(factory) as Promise<T> | undefined;
    if (!pending) {
      pending = factory();
      asyncCache.set(factory, pending);
    }
    return pending;
  };
}
