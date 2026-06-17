import { describe, expect, it } from "vitest";
import { match, isMatching } from "ts-pattern";
import { ok, err } from "../src/result/index.js";
import { some, none } from "../src/option/index.js";
import { R, O, when, whenMatch } from "../src/match/index.js";

describe("match", () => {
  it("R.ok pattern", () => {
    const value = match(ok(42))
      .with(R.ok(), (r) => r.value)
      .with(R.err(), () => "err")
      .exhaustive();
    expect(value).toBe(42);
  });

  it("R.err pattern", () => {
    const value = match(err("fail"))
      .with(R.ok(), () => 0)
      .with(R.err(), (r) => r.error)
      .exhaustive();
    expect(value).toBe("fail");
  });

  it("O.some/O.none patterns", () => {
    const opt = some("hello");
    const value = match(opt)
      .with(O.some(), (o) => o.value)
      .with(O.none(), () => "empty")
      .exhaustive();
    expect(value).toBe("hello");

    const empty = match(none())
      .with(O.some(), () => "never")
      .with(O.none(), () => "empty")
      .exhaustive();
    expect(empty).toBe("empty");
  });

  it("when sugar", () => {
    type Shape =
      | { _tag: "circle"; radius: number }
      | { _tag: "rect"; w: number; h: number };

    const area = (s: Shape) =>
      whenMatch(s, {
        circle: (v) => Math.PI * v.radius ** 2,
        rect: (v) => v.w * v.h,
        _: () => 0,
      });

    expect(area({ _tag: "circle", radius: 1 })).toBeCloseTo(Math.PI);
    expect(area({ _tag: "rect", w: 3, h: 4 })).toBe(12);
  });

  it("when dispatches tagged handlers", () => {
    expect(when({ _tag: "hit" }, { hit: () => "yes", _: () => "no" })).toBe(
      "yes",
    );
    expect(when({ _tag: "other" }, { _: () => "fb" })).toBe("fb");
    expect(when(42, { _: () => 43 })).toBe(43);
  });

  it("whenMatch uses fallback for unhandled tag", () => {
    expect(whenMatch({ _tag: "a" }, { _: () => "fallback" })).toBe("fallback");
    type Shape = { _tag: "b"; n: number };
    expect(
      whenMatch({ _tag: "b", n: 2 } as Shape, {
        b: (v) => v.n,
        _: () => 0,
      }),
    ).toBe(2);
  });

  it("isMatching re-export", () => {
    expect(typeof isMatching).toBe("function");
    expect(isMatching({ kind: "a" }, { kind: "a" })).toBe(true);
  });
});
