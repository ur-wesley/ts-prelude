import { describe, expect, it } from "vitest";
import { ok, err } from "../src/result/index.js";
import { some, none } from "../src/option/index.js";
import {
  let_,
  run,
  apply,
  also,
  with_,
  ifSome,
  ifOk,
  ifErr,
  ifDefined,
  ifLet,
  takeIf,
  takeUnless,
  takeIfDefined,
  require,
  check,
} from "../src/scope/index.js";

describe("scope", () => {
  it("let_", () => {
    expect(let_(5, (x) => x * 2)).toBe(10);
    expect(let_(some(2), (x: number) => x + 1)).toEqual(some(3));
    expect(let_(none(), (x: number) => x)).toEqual(none());
    const mapped = let_(ok(2), (x: number) => x + 1);
    expect(mapped.isOk() && mapped.value).toBe(3);
    expect(let_(err("e"), (x: number) => x).isErr()).toBe(true);
    expect(let_({ n: 2 }, (o) => o.n)).toBe(2);
  });

  it("run", () => {
    expect(run("hi", (s) => s.length)).toBe(2);
    expect(run(some(3), (x: number) => x * 2)).toEqual(some(6));
    expect(run(err("e"), (x: number) => x).isErr()).toBe(true);
    expect(run(none(), (x: number) => x)).toEqual(none());
  });

  it("apply/also", () => {
    let side = 0;
    const v = also(1, (x) => {
      side = x;
    });
    expect(v).toBe(1);
    expect(side).toBe(1);
    expect(apply(2, () => {})).toBe(2);
    expect(apply(some(1), () => {})).toEqual(some(1));
    expect(apply(none(), () => {})).toEqual(none());
    expect(apply(err("e"), () => {}).isErr()).toBe(true);
    expect(
      apply(ok(1), (n) => {
        void n;
      }).isOk(),
    ).toBe(true);
    const bag = { count: 0 };
    expect(
      apply(bag, (o) => {
        o.count += 1;
      }),
    ).toBe(bag);
    expect(bag.count).toBe(1);
  });

  it("with_", () => {
    expect(with_(1, 2, (a, b) => a + b)).toBe(3);
  });

  it("ifSome", () => {
    expect(ifSome(some(1), (x) => x * 2)).toBe(2);
    expect(ifSome(none(), (x: number) => x * 2)).toBeUndefined();
  });

  it("ifOk/ifErr", () => {
    expect(ifOk(ok(1), (x) => x + 1)).toBe(2);
    expect(ifOk(err("e"), (x: number) => x)).toBeUndefined();
    expect(ifErr(err("e"), (e) => e.length)).toBe(1);
    expect(ifErr(ok(1), (e: string) => e)).toBeUndefined();
  });

  it("ifDefined", () => {
    expect(ifDefined("hi", (s) => s.length)).toBe(2);
    expect(ifDefined(null, (s: string) => s.length)).toBeUndefined();
  });

  it("ifLet", () => {
    expect(ifLet("ab", (s) => s.length)).toBe(2);
    expect(ifLet(null, (s: string) => s.length)).toBeUndefined();
    expect(ifLet(some(4), (n) => n * 2)).toBe(8);
    expect(ifLet(none(), (n: number) => n)).toBeUndefined();
  });

  it("takeIf/takeUnless/takeIfDefined", () => {
    expect(takeIf(2, (x) => x > 1)).toEqual(some(2));
    expect(takeIf(1, (x) => x > 1)).toEqual(none());
    expect(takeUnless(1, (x) => x > 1)).toEqual(some(1));
    expect(takeIfDefined("hi", (s) => s.length > 0)).toEqual(some("hi"));
    expect(takeIfDefined(null, (s: string) => s.length > 0)).toEqual(none());
  });

  it("require/check", () => {
    const okRequire = require("x", () => "missing");
    expect(okRequire.isOk() && okRequire.value).toBe("x");
    const errRequire = require(null, () => "missing");
    expect(errRequire.isErr() && errRequire.error).toBe("missing");
    expect(check(true, () => "nope").isOk()).toBe(true);
    const failed = check(false, () => "nope");
    expect(failed.isErr() && failed.error).toBe("nope");
  });
});
