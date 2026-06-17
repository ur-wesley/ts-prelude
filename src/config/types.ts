import type { Result } from "neverthrow";

export type ConfigError = {
  key: string;
  envKey: string;
  message: string;
};

export type ParseContext = {
  key: string;
  envKey: string;
};

export type ConfigDef<T> = {
  readonly _output: T;
  readonly envKey?: string;
  parse(raw: string | undefined, ctx: ParseContext): Result<T, ConfigError>;
};

export type InferConfig<S extends Record<string, ConfigDef<unknown>>> = {
  [K in keyof S]: S[K] extends ConfigDef<infer V> ? V : never;
};

export type ParserOpts = {
  envKey?: string;
};

export type DefState<T> = {
  defaultValue?: T;
  envKey?: string;
};
