import { describe, expect, it } from "vitest";
import {
  boolean,
  defineConfig,
  enum_,
  number,
  optional,
  string,
} from "../src/config/index.js";

describe("config", () => {
  it("loads a happy path with inferred types", () => {
    const result = defineConfig(
      {
        port: number(3000, { envKey: "PORT" }),
        host: string("localhost", { envKey: "HOST" }),
        debug: boolean(false, { envKey: "DEBUG" }),
        nodeEnv: enum_(
          ["development", "production", "test"] as const,
          "development",
          { envKey: "NODE_ENV" },
        ),
      },
      {
        PORT: "8080",
        HOST: "0.0.0.0",
        DEBUG: "true",
        NODE_ENV: "production",
      },
    );

    expect(result.isOk() && result.value).toEqual({
      port: 8080,
      host: "0.0.0.0",
      debug: true,
      nodeEnv: "production",
    });
  });

  it("applies positional defaults when env vars are absent", () => {
    const result = defineConfig(
      {
        port: number(3000),
        host: string("localhost"),
        debug: boolean(false),
        label: string("app", {}),
      },
      {},
    );

    expect(result.isOk() && result.value).toEqual({
      port: 3000,
      host: "localhost",
      debug: false,
      label: "app",
    });
  });

  it("maps config keys separately from env keys", () => {
    const result = defineConfig(
      {
        port: number(3000, { envKey: "PORT" }),
        databaseUrl: string({ envKey: "DATABASE_URL" }),
      },
      { PORT: "4000", DATABASE_URL: "postgres://localhost" },
    );

    expect(result.isOk() && result.value).toEqual({
      port: 4000,
      databaseUrl: "postgres://localhost",
    });
  });

  it("falls back to schema key as env key when envKey is omitted", () => {
    const result = defineConfig(
      {
        PORT: number(3000),
      },
      { PORT: "5000" },
    );

    expect(result.isOk() && result.value).toEqual({ PORT: 5000 });
  });

  it("returns Err for a missing required value", () => {
    const result = defineConfig(
      {
        databaseUrl: string({ envKey: "DATABASE_URL" }),
      },
      {},
    );

    expect(result.isErr() && result.error).toEqual([
      {
        key: "databaseUrl",
        envKey: "DATABASE_URL",
        message: "missing required value",
      },
    ]);
  });

  it("collects multiple errors without short-circuiting", () => {
    const result = defineConfig(
      {
        port: number({ envKey: "PORT" }),
        host: string({ envKey: "HOST" }),
      },
      { PORT: "not-a-number" },
    );

    expect(result.isErr() && result.error).toEqual(
      expect.arrayContaining([
        {
          key: "port",
          envKey: "PORT",
          message: "invalid number: not-a-number",
        },
        {
          key: "host",
          envKey: "HOST",
          message: "missing required value",
        },
      ]),
    );
    expect(result.isErr() && result.error).toHaveLength(2);
  });

  it("parses boolean truthy and falsy variants", () => {
    const truthy = defineConfig({ flag: boolean() }, { flag: "YES" });
    expect(truthy.isOk() && truthy.value).toEqual({ flag: true });

    const one = defineConfig({ flag: boolean() }, { flag: "1" });
    expect(one.isOk() && one.value).toEqual({ flag: true });

    const falsy = defineConfig({ flag: boolean() }, { flag: "No" });
    expect(falsy.isOk() && falsy.value).toEqual({ flag: false });

    const zero = defineConfig({ flag: boolean() }, { flag: "0" });
    expect(zero.isOk() && zero.value).toEqual({ flag: false });
  });

  it("rejects invalid enum values", () => {
    const result = defineConfig(
      {
        nodeEnv: enum_(["development", "production"] as const, {
          envKey: "NODE_ENV",
        }),
      },
      { NODE_ENV: "staging" },
    );

    expect(result.isErr() && result.error[0]).toEqual({
      key: "nodeEnv",
      envKey: "NODE_ENV",
      message:
        "invalid enum: staging (expected one of development, production)",
    });
  });

  it("supports optional fields", () => {
    const absent = defineConfig(
      {
        apiKey: optional(string({ envKey: "API_KEY" })),
      },
      {},
    );
    expect(absent.isOk() && absent.value).toEqual({ apiKey: undefined });

    const present = defineConfig(
      {
        apiKey: optional(string({ envKey: "API_KEY" })),
      },
      { API_KEY: "secret" },
    );
    expect(present.isOk() && present.value).toEqual({ apiKey: "secret" });

    const invalid = defineConfig(
      {
        port: optional(number({ envKey: "PORT" })),
      },
      { PORT: "nope" },
    );
    expect(invalid.isErr() && invalid.error[0]?.message).toBe(
      "invalid number: nope",
    );
  });

  it("loadConfig is an alias for defineConfig", async () => {
    const { loadConfig } = await import("../src/config/index.js");
    const result = loadConfig({ port: number(42) }, {});
    expect(result.isOk() && result.value).toEqual({ port: 42 });
  });
});
