/** Resource that can be cleaned up via `Symbol.dispose`. */
export interface Disposable {
  [Symbol.dispose](): void;
}

/** Resource that can be cleaned up asynchronously via `Symbol.asyncDispose`. */
export interface AsyncDisposable {
  [Symbol.asyncDispose](): Promise<void>;
}

/**
 * Lazily initialize a value with optional cleanup on dispose.
 *
 * @example
 * ```ts
 * using defer(() => openFile("x"), (f) => f.close()), (f) => f.read());
 * ```
 */
export function defer<T>(
  factory: () => T,
  cleanup?: (value: T) => void,
): Disposable & { value: T } {
  const value = factory();
  return {
    value,
    [Symbol.dispose]() {
      cleanup?.(value);
    },
  };
}

/**
 * Run `fn` with a disposable resource, always calling dispose afterward.
 *
 * @example
 * ```ts
 * usingResource(defer(() => acquire()), (r) => r.value.process());
 * ```
 */
export function usingResource<T extends Disposable, R>(
  resource: T,
  fn: (resource: T) => R,
): R {
  try {
    return fn(resource);
  } finally {
    const dispose = resource[Symbol.dispose];
    dispose();
  }
}

/**
 * Acquire a disposable resource, run `fn`, then dispose.
 */
export function using<T, R>(
  factory: () => T & Disposable,
  fn: (resource: T) => R,
): R {
  const resource = factory();
  return usingResource(resource, fn);
}

/**
 * Run `fn` with an async-disposable resource, always calling async dispose afterward.
 */
export async function usingAsync<T extends AsyncDisposable, R>(
  resource: T,
  fn: (resource: T) => Promise<R>,
): Promise<R> {
  try {
    return await fn(resource);
  } finally {
    await resource[Symbol.asyncDispose]();
  }
}

/**
 * Acquire an async-disposable resource, run `fn`, then dispose.
 */
export async function usingResourceAsync<T extends AsyncDisposable, R>(
  factory: () => T,
  fn: (resource: T) => Promise<R>,
): Promise<R> {
  const resource = factory();
  return usingAsync(resource, fn);
}
