import { describe, expect, it } from "vitest";
import {
  some,
  none,
  fromNullable,
  map,
  andThen,
  getOrElse,
  getOrNull,
  toResult,
  isSome,
  isNone,
  filter,
  or,
  orElse,
  flatten,
  zip,
  zipWith,
  tap,
  unwrap,
  expect as expectOption,
} from "../src/option/index.js";

describe("option", () => {
  it("some/none constructors", () => {
    expect(some(42)).toEqual({ _tag: "Some", value: 42 });
    expect(none()).toEqual({ _tag: "None" });
  });

  it("fromNullable", () => {
    expect(fromNullable(1)).toEqual(some(1));
    expect(fromNullable(null)).toEqual(none());
    expect(fromNullable(undefined)).toEqual(none());
  });

  it("map", () => {
    expect(map(some(2), (x) => x * 2)).toEqual(some(4));
    expect(map(none(), (x: number) => x * 2)).toEqual(none());
  });

  it("andThen", () => {
    const parse = (s: string) => (s.length > 0 ? some(s.length) : none());
    expect(andThen(some("hi"), parse)).toEqual(some(2));
    expect(andThen(none(), parse)).toEqual(none());
  });

  it("getOrElse", () => {
    expect(getOrElse(some(1), 0)).toBe(1);
    expect(getOrElse(none(), 0)).toBe(0);
  });

  it("getOrNull", () => {
    expect(getOrNull(some(1))).toBe(1);
    expect(getOrNull(none())).toBeNull();
  });

  it("toResult", () => {
    const okResult = toResult(some(1), "err");
    expect(okResult.isOk() && okResult.value).toBe(1);
    const errResult = toResult(none(), "err");
    expect(errResult.isErr() && errResult.error).toBe("err");
  });

  it("isSome/isNone", () => {
    expect(isSome(some(1))).toBe(true);
    expect(isNone(some(1))).toBe(false);
    expect(isSome(none())).toBe(false);
    expect(isNone(none())).toBe(true);
  });

  it("filter", () => {
    expect(filter(some(2), (x) => x > 1)).toEqual(some(2));
    expect(filter(some(1), (x) => x > 1)).toEqual(none());
    expect(filter(none(), (x: number) => x > 1)).toEqual(none());
  });

  it("or/orElse", () => {
    expect(or(none(), some(1))).toEqual(some(1));
    expect(or(some(2), some(1))).toEqual(some(2));
    expect(orElse(none(), () => some(3))).toEqual(some(3));
    expect(orElse(some(2), () => some(3))).toEqual(some(2));
  });

  it("flatten", () => {
    expect(flatten(some(some(1)))).toEqual(some(1));
    expect(flatten(some(none()))).toEqual(none());
    expect(flatten(none())).toEqual(none());
  });

  it("zip/zipWith", () => {
    expect(zip(some(1), some(2))).toEqual(some([1, 2]));
    expect(zip(some(1), none())).toEqual(none());
    expect(zipWith(some(1), some(2), (a, b) => a + b)).toEqual(some(3));
  });

  it("tap", () => {
    let seen = 0;
    expect(
      tap(some(1), (x) => {
        seen = x;
      }),
    ).toEqual(some(1));
    expect(seen).toBe(1);
    expect(
      tap(none(), () => {
        seen = 99;
      }),
    ).toEqual(none());
    expect(seen).toBe(1);
  });

  it("unwrap/expect", () => {
    expect(unwrap(some(1))).toBe(1);
    expect(() => unwrap(none())).toThrow(/unwrap on None/);
    expect(expectOption(some(1), "missing")).toBe(1);
    expect(() => expectOption(none(), "missing")).toThrow("missing");
  });
});
