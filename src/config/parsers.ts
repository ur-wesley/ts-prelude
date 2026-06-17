import { err, ok, type Result } from "neverthrow";
import type {
  ConfigDef,
  ConfigError,
  DefState,
  ParseContext,
  ParserOpts,
} from "./types.js";

const missing = (ctx: ParseContext): ConfigError => ({
  key: ctx.key,
  envKey: ctx.envKey,
  message: "missing required value",
});

const isMissing = (raw: string | undefined): raw is undefined =>
  raw === undefined || raw === "";

function withEnvKey<T extends DefState<unknown>>(
  state: T,
  envKey: string | undefined,
): T {
  return envKey === undefined ? state : { ...state, envKey };
}

function createDef<T>(
  state: DefState<T>,
  parseValue: (raw: string, ctx: ParseContext) => Result<T, ConfigError>,
): ConfigDef<T> {
  const def: ConfigDef<T> = {
    _output: undefined as T,
    parse(raw, ctx) {
      if (isMissing(raw)) {
        if (state.defaultValue !== undefined) return ok(state.defaultValue);
        return err(missing(ctx));
      }
      return parseValue(raw, ctx);
    },
  };
  if (state.envKey !== undefined) {
    return { ...def, envKey: state.envKey };
  }
  return def;
}

function resolveStringArgs(
  defaultOrOpts?: string | ParserOpts,
  maybeOpts?: ParserOpts,
): DefState<string> {
  if (typeof defaultOrOpts === "string") {
    return withEnvKey({ defaultValue: defaultOrOpts }, maybeOpts?.envKey);
  }
  if (defaultOrOpts !== undefined) {
    return withEnvKey({}, defaultOrOpts.envKey);
  }
  return {};
}

function resolveNumberArgs(
  defaultOrOpts?: number | ParserOpts,
  maybeOpts?: ParserOpts,
): DefState<number> {
  if (typeof defaultOrOpts === "number") {
    return withEnvKey({ defaultValue: defaultOrOpts }, maybeOpts?.envKey);
  }
  if (defaultOrOpts !== undefined) {
    return withEnvKey({}, defaultOrOpts.envKey);
  }
  return {};
}

function resolveBooleanArgs(
  defaultOrOpts?: boolean | ParserOpts,
  maybeOpts?: ParserOpts,
): DefState<boolean> {
  if (typeof defaultOrOpts === "boolean") {
    return withEnvKey({ defaultValue: defaultOrOpts }, maybeOpts?.envKey);
  }
  if (defaultOrOpts !== undefined) {
    return withEnvKey({}, defaultOrOpts.envKey);
  }
  return {};
}

function parseBoolean(
  raw: string,
  ctx: ParseContext,
): Result<boolean, ConfigError> {
  const normalized = raw.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return ok(true);
  if (["false", "0", "no"].includes(normalized)) return ok(false);
  return err({
    key: ctx.key,
    envKey: ctx.envKey,
    message: `invalid boolean: ${raw}`,
  });
}

export function string(): ConfigDef<string>;
export function string(defaultValue: string): ConfigDef<string>;
export function string(opts: ParserOpts): ConfigDef<string>;
export function string(
  defaultValue: string,
  opts: ParserOpts,
): ConfigDef<string>;
export function string(
  defaultOrOpts?: string | ParserOpts,
  maybeOpts?: ParserOpts,
): ConfigDef<string> {
  const state = resolveStringArgs(defaultOrOpts, maybeOpts);
  return createDef(state, (raw) => ok(raw));
}

export function number(): ConfigDef<number>;
export function number(defaultValue: number): ConfigDef<number>;
export function number(opts: ParserOpts): ConfigDef<number>;
export function number(
  defaultValue: number,
  opts: ParserOpts,
): ConfigDef<number>;
export function number(
  defaultOrOpts?: number | ParserOpts,
  maybeOpts?: ParserOpts,
): ConfigDef<number> {
  const state = resolveNumberArgs(defaultOrOpts, maybeOpts);
  return createDef(state, (raw, ctx) => {
    const value = Number(raw);
    if (Number.isNaN(value)) {
      return err({
        key: ctx.key,
        envKey: ctx.envKey,
        message: `invalid number: ${raw}`,
      });
    }
    return ok(value);
  });
}

export function boolean(): ConfigDef<boolean>;
export function boolean(defaultValue: boolean): ConfigDef<boolean>;
export function boolean(opts: ParserOpts): ConfigDef<boolean>;
export function boolean(
  defaultValue: boolean,
  opts: ParserOpts,
): ConfigDef<boolean>;
export function boolean(
  defaultOrOpts?: boolean | ParserOpts,
  maybeOpts?: ParserOpts,
): ConfigDef<boolean> {
  const state = resolveBooleanArgs(defaultOrOpts, maybeOpts);
  return createDef(state, parseBoolean);
}

export function enum_<const T extends readonly string[]>(
  values: T,
): ConfigDef<T[number]>;
export function enum_<const T extends readonly string[]>(
  values: T,
  defaultValue: T[number],
): ConfigDef<T[number]>;
export function enum_<const T extends readonly string[]>(
  values: T,
  defaultValue: T[number],
  opts: ParserOpts,
): ConfigDef<T[number]>;
export function enum_<const T extends readonly string[]>(
  values: T,
  opts: ParserOpts,
): ConfigDef<T[number]>;
export function enum_<const T extends readonly string[]>(
  values: T,
  second?: T[number] | ParserOpts,
  third?: ParserOpts,
): ConfigDef<T[number]> {
  let state: DefState<T[number]> = {};

  if (typeof second === "string") {
    state = withEnvKey({ defaultValue: second }, third?.envKey);
  } else if (second !== undefined) {
    state = withEnvKey({}, second.envKey);
  }

  return createDef(state, (raw, ctx) => {
    if ((values as readonly string[]).includes(raw)) {
      return ok(raw as T[number]);
    }
    return err({
      key: ctx.key,
      envKey: ctx.envKey,
      message: `invalid enum: ${raw} (expected one of ${values.join(", ")})`,
    });
  });
}

export function optional<T>(def: ConfigDef<T>): ConfigDef<T | undefined> {
  const optionalDef: ConfigDef<T | undefined> = {
    _output: undefined as T | undefined,
    parse(raw, ctx) {
      if (isMissing(raw)) return ok(undefined);
      return def.parse(raw, ctx);
    },
  };
  if (def.envKey !== undefined) {
    return { ...optionalDef, envKey: def.envKey };
  }
  return optionalDef;
}
