import { describe, expect, it } from "vitest";
import {
  fromArray,
  fromIterable,
  fromOption,
  fromResult,
  first,
  last,
} from "../src/iter/index.js";
import { some, none } from "../src/option/index.js";
import { ok, err } from "../src/result/index.js";

describe("iter", () => {
  it("fromArray with map/filter/take/collect", () => {
    const result = fromArray([1, 2, 3, 4, 5])
      .map((x) => x * 2)
      .filter((x) => x > 4)
      .take(2)
      .collect();
    expect(result).toEqual([6, 8]);
  });

  it("fold", () => {
    const sum = fromArray([1, 2, 3]).fold(0, (a, b) => a + b);
    expect(sum).toBe(6);
  });

  it("find", () => {
    expect(fromArray([1, 2, 3]).find((x) => x > 2)).toBe(3);
    expect(fromArray([1, 2, 3]).find((x) => x > 10)).toBeUndefined();
  });

  it("fromOption", () => {
    expect(fromOption(some(42)).collect()).toEqual([42]);
    expect(fromOption(none()).collect()).toEqual([]);
  });

  it("fromResult", () => {
    expect(fromResult(ok("ok")).collect()).toEqual(["ok"]);
    expect(fromResult(err("fail")).collect()).toEqual([]);
  });

  it("fromIterable", () => {
    const gen = function* () {
      yield 1;
      yield 2;
    };
    expect(
      fromIterable(gen())
        .map((n) => n + 1)
        .collect(),
    ).toEqual([2, 3]);
  });

  it("flatMap", () => {
    const result = fromArray([1, 2])
      .flatMap((n) => fromArray([n, n * 10]))
      .collect();
    expect(result).toEqual([1, 10, 2, 20]);
  });

  it("skip and skipWhile", () => {
    expect(fromArray([1, 2, 3, 4]).skip(2).collect()).toEqual([3, 4]);
    expect(
      fromArray([1, 2, 3, 4])
        .skipWhile((x) => x < 3)
        .collect(),
    ).toEqual([3, 4]);
  });

  it("takeWhile", () => {
    expect(
      fromArray([1, 2, 3, 1])
        .takeWhile((x) => x < 3)
        .collect(),
    ).toEqual([1, 2]);
  });

  it("enumerate and chain", () => {
    expect(fromArray(["a"]).enumerate().collect()).toEqual([[0, "a"]]);
    expect(fromArray([1]).chain([2, 3]).collect()).toEqual([1, 2, 3]);
  });

  it("first and last", () => {
    expect(first(fromArray([1, 2]))).toEqual(some(1));
    expect(first(fromArray([]))).toEqual(none());
    expect(last(fromArray([1, 2, 3]))).toEqual(some(3));
    expect(last(fromArray([]))).toEqual(none());
  });
});
