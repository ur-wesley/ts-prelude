import { describe, expect, it } from "vitest";
import {
  assertNever,
  brand,
  unbrand,
  refine,
  tag,
  isTag,
  narrow,
  fromArray,
  isNonEmpty,
  head,
  tail,
  last,
  map,
  append,
  concat,
  reduce1,
  toArray,
} from "../src/types/index.js";
import { some } from "../src/option/index.js";

describe("types", () => {
  it("assertNever throws", () => {
    expect(() => assertNever("x" as never)).toThrow(/Unexpected value/);
  });

  it("brand and unbrand", () => {
    const id = brand<string, "UserId">("abc");
    expect(unbrand(id)).toBe("abc");
  });

  it("tag and isTag", () => {
    const t = tag("loading");
    expect(t).toEqual({ _tag: "loading" });
    expect(isTag("loading")(t)).toBe(true);
    expect(isTag("done")(t)).toBe(false);
  });

  it("narrow", () => {
    const isNum = (v: unknown): v is number => typeof v === "number";
    expect(narrow(isNum)(42)).toBe(42);
    expect(narrow(isNum)("x")).toBeUndefined();
  });

  it("fromArray and isNonEmpty", () => {
    expect(fromArray([1])).toEqual({ _tag: "Some", value: [1] });
    expect(fromArray([])).toEqual({ _tag: "None" });
    expect(isNonEmpty([1])).toBe(true);
    expect(isNonEmpty([])).toBe(false);
  });

  it("refine", () => {
    const positive = refine(5, (n) => n > 0, "not positive");
    expect(positive.isOk() && unbrand(positive.value)).toBe(5);
    const negative = refine(-1, (n) => n > 0, "not positive");
    expect(negative.isErr() && negative.error).toBe("not positive");
  });

  it("non-empty ops", () => {
    const ne = fromArray([1, 2, 3]);
    expect(ne).toEqual(some([1, 2, 3]));
    const items = [1, 2, 3] as [number, ...number[]];
    expect(head(items)).toBe(1);
    expect(last(items)).toBe(3);
    expect(tail(items)).toEqual([2, 3]);
    expect(map(items, (n) => n * 2)).toEqual([2, 4, 6]);
    expect(append(items, 4)).toEqual([1, 2, 3, 4]);
    expect(concat(items, [4, 5] as [number, ...number[]])).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(reduce1(items, (a, b) => a + b)).toBe(6);
    expect(toArray(items)).toEqual([1, 2, 3]);
  });
});
