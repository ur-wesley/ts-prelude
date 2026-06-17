import { describe, expect, it, vi } from "vitest";
import type { Result } from "neverthrow";
import { err, ok } from "../src/result/index.js";
import { wire, wireError } from "../src/wire/index.js";

type Config = { url: string };
type Db = { query: (sql: string) => string };
type Repo = { findUser: (id: string) => string };
type Service = { getUser: (id: string) => string };

const loadConfig = (): Result<Config, string> =>
  ok({ url: "postgres://localhost" });

const createDb = (config: Config): Result<Db, string> =>
  ok({
    query: (sql: string) => `${config.url}:${sql}`,
  });

const createRepo = (db: Db): Result<Repo, string> =>
  ok({
    findUser: (id: string) => db.query(`SELECT * FROM users WHERE id = ${id}`),
  });

const createService = (deps: {
  config: Config;
  repo: Repo;
}): Result<Service, string> =>
  ok({
    getUser: (id: string) => `${deps.config.url}:${deps.repo.findUser(id)}`,
  });

function bootstrapManual() {
  const config = loadConfig();
  if (config.isErr()) return err(config.error);
  const db = createDb(config.value);
  if (db.isErr()) return err(db.error);
  const repo = createRepo(db.value);
  if (repo.isErr()) return err(repo.error);
  const service = createService({ config: config.value, repo: repo.value });
  if (service.isErr()) return err(service.error);
  return ok({
    config: config.value,
    db: db.value,
    repo: repo.value,
    service: service.value,
  });
}

describe("wire bootstrap comparison", () => {
  it("manual chaining requires repeated isErr guards", () => {
    const manual = bootstrapManual();
    expect(manual.isOk() && manual.value.service.getUser("1")).toBe(
      "postgres://localhost:postgres://localhost:SELECT * FROM users WHERE id = 1",
    );
  });

  it("wire resolves the same graph in one call", () => {
    const app = wire({
      config: () => loadConfig(),
      db: ({ config }: { config: Config }) => createDb(config),
      repo: ({ db }: { db: Db }) => createRepo(db),
      service: ({ config, repo }: { config: Config; repo: Repo }) =>
        createService({ config, repo }),
    });

    const wired = app.resolve();
    const manual = bootstrapManual();

    expect(wired.isOk() && manual.isOk()).toBe(true);
    if (!wired.isOk() || !manual.isOk()) return;

    expect(wired.value.config).toEqual(manual.value.config);
    expect(wired.value.service.getUser("1")).toBe(
      manual.value.service.getUser("1"),
    );
  });
});

describe("wire", () => {
  it("resolves factories in definition order", () => {
    const order: string[] = [];
    const app = wire({
      a: () => {
        order.push("a");
        return ok(1);
      },
      b: () => {
        order.push("b");
        return 2;
      },
      c: ({ a, b }: { a: number; b: number }) => {
        order.push("c");
        return ok(a + b);
      },
    });

    const result = app.resolve();
    expect(order).toEqual(["a", "b", "c"]);
    expect(result.isOk() && result.value).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("accepts plain values and Results", () => {
    const app = wire({
      plain: () => 1,
      wrapped: () => ok("two"),
      sum: ({ plain, wrapped }: { plain: number; wrapped: string }) =>
        plain + wrapped.length,
    });

    const result = app.resolve();
    expect(result.isOk() && result.value).toEqual({
      plain: 1,
      wrapped: "two",
      sum: 4,
    });
  });

  it("short-circuits on first Err with WireError", () => {
    const app = wire({
      config: () => ok({ url: "x" }),
      db: () => err("db-down"),
      repo: () => ok({ findUser: () => "nope" }),
    });

    const result = app.resolve();
    expect(result.isErr() && result.error).toEqual(wireError("db", "db-down"));
  });

  it("captures thrown errors as WireError", () => {
    const app = wire({
      boom: () => {
        throw new Error("kaboom");
      },
    });

    const result = app.resolve();
    expect(result.isErr() && result.error._tag).toBe("WireError");
    expect(result.isErr() && result.error.key).toBe("boom");
    expect(result.isErr() && result.error.cause).toEqual(new Error("kaboom"));
  });

  it("caches resolved graph on repeated resolve calls", () => {
    const factory = vi.fn<() => Result<number, string>>(() => ok(1));
    const app = wire({ value: factory });

    const first = app.resolve();
    const second = app.resolve();

    expect(factory).toHaveBeenCalledOnce();
    expect(first.isOk()).toBe(true);
    expect(second.isOk()).toBe(true);
    expect(first._unsafeUnwrap()).toBe(second._unsafeUnwrap());
  });

  it("dispose runs cleanup in reverse definition order", () => {
    const order: string[] = [];
    const app = wire(
      {
        a: () => ({ id: "a" }),
        b: () => ({ id: "b" }),
        c: ({ a, b }: { a: { id: string }; b: { id: string } }) => ({
          ids: [a.id, b.id],
        }),
      },
      {
        dispose: {
          a: () => order.push("a"),
          b: () => order.push("b"),
          c: () => order.push("c"),
        },
      },
    );

    app.resolve();
    app.dispose();

    expect(order).toEqual(["c", "b", "a"]);
  });

  it("dispose is a no-op before resolve", () => {
    const cleanup = vi.fn<(value: number) => void>();
    const app = wire({ value: () => 1 }, { dispose: { value: cleanup } });
    app.dispose();
    expect(cleanup).not.toHaveBeenCalled();
  });

  it("clears cache after dispose so resolve rebuilds", () => {
    const factory = vi.fn<() => Result<number, string>>(() => ok(1));
    const app = wire({ value: factory });

    app.resolve();
    app.dispose();
    app.resolve();

    expect(factory).toHaveBeenCalledTimes(2);
  });
});
