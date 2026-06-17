/**
 * Memoize the result of `factory` on first access.
 */
export function lazy<T>(factory: () => T): () => T {
  let initialized = false;
  let value: T;
  return () => {
    if (!initialized) {
      value = factory();
      initialized = true;
    }
    return value!;
  };
}

/**
 * Alias for {@link lazy} — evaluate `factory` at most once.
 */
export const once = lazy;
