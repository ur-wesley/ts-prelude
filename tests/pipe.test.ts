import { describe, expect, it, vi } from "vitest";
import { pipe } from "remeda";
import { flow, compose, tap, dbg, pipeResult } from "../src/pipe/index.js";
import { ok, err } from "../src/result/index.js";

const logMocks = vi.hoisted(() => {
  const debug = vi.fn<(value: unknown) => void>();
  const withTag = vi.fn<(tag: string) => { debug: typeof debug }>(() => ({
    debug,
  }));
  return { debug, withTag };
});

vi.mock("../src/log/index.js", () => ({
  logger: logMocks,
}));

describe("pipe", () => {
  it("re-exports remeda pipe", () => {
    expect(
      pipe(
        1,
        (n) => n + 1,
        (n) => n * 2,
      ),
    ).toBe(4);
  });

  it("flow composes left-to-right", () => {
    const double = (n: number) => n * 2;
    const inc = (n: number) => n + 1;
    expect(flow(inc, double)(3)).toBe(8);
    expect(flow(inc, double, String)(3)).toBe("8");
    expect(
      flow(
        (n: number) => n + 1,
        (n: number) => n * 2,
        (n: number) => n - 1,
        String,
      )(1),
    ).toBe("3");
  });

  it("compose is an alias for flow", () => {
    expect(compose((n: number) => n + 1)(2)).toBe(3);
  });

  it("tap runs side effect and returns value", () => {
    const spy = vi.fn<(value: number) => void>();
    expect(tap(spy)(5)).toBe(5);
    expect(spy).toHaveBeenCalledWith(5);
  });

  it("dbg logs and returns value", () => {
    expect(dbg()(99)).toBe(99);
    expect(logMocks.debug).toHaveBeenCalledWith(99);
    expect(dbg("tag")(1)).toBe(1);
    expect(logMocks.withTag).toHaveBeenCalledWith("tag");
  });

  it("pipeResult short-circuits on error", () => {
    const result = pipeResult(
      "hi",
      (s: string) => ok(s.length),
      (n: number) => (n > 0 ? ok(n * 2) : err("zero")),
    );
    expect(result.isOk() && result.value).toBe(4);

    const failed = pipeResult("", (s: string) =>
      s.length > 0 ? ok(s.length) : err("empty"),
    );
    expect(failed.isErr() && failed.error).toBe("empty");
  });
});
