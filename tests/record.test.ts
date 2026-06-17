import { describe, expect, it } from "vitest";
import { copy, update, updatePath } from "../src/record/index.js";

describe("record", () => {
  it("copy shallow-clones records", () => {
    const src = { a: 1, b: { c: 2 } };
    const cloned = copy(src);
    expect(cloned).toEqual(src);
    expect(cloned).not.toBe(src);
  });

  it("update applies evolve transforms", () => {
    const next = update({ a: 1, b: 2 }, { a: (n) => n + 1, b: (n) => n * 2 });
    expect(next).toEqual({ a: 2, b: 4 });
  });

  it("updatePath sets nested values", () => {
    const next = updatePath({ a: { b: 1 } }, ["a", "b"], 9);
    expect(next).toEqual({ a: { b: 9 } });
  });
});
