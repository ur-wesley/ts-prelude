import type { Result } from "neverthrow";
import { combineWithAllErrors } from "../result/index.js";
import type { ConfigDef, ConfigError, InferConfig } from "./types.js";

const defaultEnvSource = (): Record<string, string | undefined> => {
  const proc = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process;
  return proc?.env ?? {};
};

export function defineConfig<S extends Record<string, ConfigDef<unknown>>>(
  schema: S,
  source: Record<string, string | undefined> = defaultEnvSource(),
): Result<InferConfig<S>, ConfigError[]> {
  const keys = Object.keys(schema) as (keyof S)[];
  const results = keys.map((key) => {
    const def = schema[key] as ConfigDef<unknown>;
    const envKey = def.envKey ?? String(key);
    return def.parse(source[envKey], { key: String(key), envKey });
  });

  return combineWithAllErrors(results).map((values) => {
    const out = {} as InferConfig<S>;
    keys.forEach((key, index) => {
      (out as Record<string, unknown>)[key as string] = values[index];
    });
    return out;
  });
}

export const loadConfig = defineConfig;
