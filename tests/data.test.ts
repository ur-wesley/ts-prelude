import { describe, expect, it } from "vitest";
import { chunk } from "../src/data/chunk.js";
import { filter } from "../src/data/filter.js";
import { find } from "../src/data/find.js";
import { groupBy } from "../src/data/groupBy.js";
import { map } from "../src/data/map.js";
import { omit } from "../src/data/omit.js";
import { partition } from "../src/data/partition.js";
import { pick } from "../src/data/pick.js";
import { range } from "../src/data/range.js";
import { reduce } from "../src/data/reduce.js";
import { sortBy } from "../src/data/sortBy.js";
import { uniqueBy } from "../src/data/uniqueBy.js";
import { zip } from "../src/data/zip.js";

describe("data re-exports", () => {
  it("array utilities", () => {
    expect(map([1, 2], (n) => n * 2)).toEqual([2, 4]);
    expect(filter([1, 2, 3], (n) => n % 2 === 1)).toEqual([1, 3]);
    expect(find([1, 2], (n) => n > 1)).toBe(2);
    expect(reduce([1, 2, 3], (a, n) => a + n, 0)).toBe(6);
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(range(0, 3)).toEqual([0, 1, 2]);
    expect(sortBy([{ n: 2 }, { n: 1 }], (x) => x.n)).toEqual([
      { n: 1 },
      { n: 2 },
    ]);
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (x) => x.id)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(partition([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ]);
    expect(zip(["a", "b"], [1, 2])).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("object utilities", () => {
    expect(pick({ a: 1, b: 2 }, ["a"])).toEqual({ a: 1 });
    expect(omit({ a: 1, b: 2 }, ["b"])).toEqual({ a: 1 });
    expect(groupBy([1.1, 1.9, 2.1], (n) => Math.floor(n))).toEqual({
      1: [1.1, 1.9],
      2: [2.1],
    });
  });
});
