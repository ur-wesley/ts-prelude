import { err, ok, type Result } from "neverthrow";

export type WireError = {
  readonly _tag: "WireError";
  readonly key: string;
  readonly cause: unknown;
};

export const wireError = (key: string, cause: unknown): WireError => ({
  _tag: "WireError",
  key,
  cause,
});

export type WireOutput<T> = T extends Result<infer V, unknown> ? V : T;

export type WireFactoryFn = (...args: never[]) => unknown;

export type WireGraph = Record<string, WireFactoryFn>;

export type Resolved<T extends WireGraph> = {
  [K in keyof T]: WireOutput<ReturnType<T[K]>>;
};

export type DisposeMap<T extends WireGraph> = Partial<{
  [K in keyof T]: (value: Resolved<T>[K]) => void;
}>;

export type WireOptions<T extends WireGraph> = {
  dispose?: DisposeMap<T>;
};

export type WireResolver<T extends WireGraph> = {
  resolve(): Result<Resolved<T>, WireError>;
  dispose(): void;
};

function isResult(value: unknown): value is Result<unknown, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "isOk" in value &&
    "isErr" in value &&
    typeof value.isOk === "function" &&
    typeof value.isErr === "function"
  );
}

function toResult<T>(value: T | Result<T, unknown>): Result<T, unknown> {
  return isResult(value) ? value : ok(value);
}

/**
 * Wire a typed factory graph at the composition root.
 *
 * Factories run in definition order; declare dependencies before dependents.
 * Each factory receives all previously resolved services as `deps`.
 *
 * @example
 * ```ts
 * const app = wire({
 *   config: () => loadConfig(),
 *   db: ({ config }) => createDb(config),
 *   users: ({ db }) => ok(createUserRepo(db)),
 * });
 *
 * const resolved = app.resolve();
 * ```
 */
export function wire<T extends WireGraph>(
  graph: T,
  options?: WireOptions<T>,
): WireResolver<T> {
  let cached: Resolved<T> | undefined;

  return {
    resolve(): Result<Resolved<T>, WireError> {
      if (cached) return ok(cached);

      const resolved = {} as Record<string, unknown>;

      for (const key of Object.keys(graph) as (keyof T & string)[]) {
        const factory = graph[key];
        try {
          const output = toResult(
            (factory as (deps: Record<string, unknown>) => unknown)(resolved),
          );
          if (output.isErr()) {
            return err(wireError(key, output.error));
          }
          resolved[key] = output.value;
        } catch (cause) {
          return err(wireError(key, cause));
        }
      }

      cached = resolved as Resolved<T>;
      return ok(cached);
    },

    dispose(): void {
      if (!cached) return;

      if (options?.dispose) {
        const dispose = options.dispose;
        const keys = Object.keys(graph).reverse() as (keyof T & string)[];

        for (const key of keys) {
          const cleanup = dispose[key];
          if (cleanup) cleanup(cached[key]);
        }
      }

      cached = undefined;
    },
  };
}
