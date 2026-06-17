import { describe, expect, it } from "vitest";
import {
  ok,
  err,
  matchResult,
  traverse,
  sequence,
  partitionResult,
  traverseOption,
  partitionMap,
  combineWithAllErrors,
  combineWithAllErrorsAsync,
  map2,
  map3,
  zip,
  runCatching,
  context,
  wrapError,
} from "../src/result/index.js";
import { some, none } from "../src/option/index.js";
import { okAsync, errAsync } from "neverthrow";

describe("result", () => {
  it("matchResult", () => {
    expect(matchResult(ok(1), { ok: (v) => `ok:${v}`, err: () => "err" })).toBe(
      "ok:1",
    );
    expect(
      matchResult(err("fail"), {
        ok: () => "ok",
        err: (e) => `err:${e}`,
      }),
    ).toBe("err:fail");
  });

  it("traverse", () => {
    const parse = (s: string) => (s.length > 0 ? ok(s.length) : err("empty"));
    const okResult = traverse(["a", "bb"], parse);
    expect(okResult.isOk() && okResult.value).toEqual([1, 2]);
    const errResult = traverse(["", "bb"], parse);
    expect(errResult.isErr() && errResult.error).toBe("empty");
  });

  it("sequence", () => {
    const okResult = sequence([ok(1), ok(2)]);
    expect(okResult.isOk() && okResult.value).toEqual([1, 2]);
    const errResult = sequence([ok(1), err("x")]);
    expect(errResult.isErr() && errResult.error).toBe("x");
  });

  it("partitionResult", () => {
    expect(partitionResult([ok(1), err("a"), ok(2), err("b")])).toEqual({
      ok: [1, 2],
      err: ["a", "b"],
    });
  });

  it("traverseOption", () => {
    const parse = (s: string) => (s.length > 0 ? some(s.length) : none());
    expect(traverseOption(["a", "bb"], parse)).toEqual({
      _tag: "Some",
      value: [1, 2],
    });
    expect(traverseOption(["", "bb"], parse)).toEqual({ _tag: "None" });
  });

  it("partitionMap", () => {
    const parse = (s: string) => (s.length > 0 ? ok(s.length) : err("empty"));
    expect(partitionMap(["a", "", "bb"], parse)).toEqual({
      ok: [1, 2],
      err: ["empty"],
    });
  });

  it("combineWithAllErrors", () => {
    const result = combineWithAllErrors([ok(1), err("a"), ok(2), err("b")]);
    expect(result.isErr() && result.error).toEqual(["a", "b"]);
  });

  it("combineWithAllErrorsAsync", async () => {
    const result = await combineWithAllErrorsAsync([
      okAsync(1),
      errAsync("a"),
      errAsync("b"),
    ]);
    expect(result.isErr() && result.error).toEqual(["a", "b"]);
  });

  it("map2/map3/zip", () => {
    const sum = map2(ok(1), ok(2), (a, b) => a + b);
    expect(sum.isOk() && sum.value).toBe(3);
    expect(map2(ok(1), err("e"), (a, b) => a + b).isErr()).toBe(true);
    const triple = map3(ok(1), ok(2), ok(3), (a, b, c) => a + b + c);
    expect(triple.isOk() && triple.value).toBe(6);
    const pair = zip(ok(1), ok(2));
    expect(pair.isOk() && pair.value).toEqual([1, 2]);
  });

  it("runCatching", () => {
    const okResult = runCatching(() => 42);
    expect(okResult.isOk() && okResult.value).toBe(42);
    expect(
      runCatching(() => {
        throw new Error("boom");
      }).isErr(),
    ).toBe(true);
  });

  it("context and wrapError", () => {
    const mapped = context(err("raw"), (e) => `wrapped:${e}`);
    expect(mapped.isErr() && mapped.error).toBe("wrapped:raw");
    const wrapped = wrapError(err("cause"), "failed");
    expect(wrapped.isErr() && wrapped.error).toEqual({
      message: "failed",
      cause: "cause",
    });
  });
});
