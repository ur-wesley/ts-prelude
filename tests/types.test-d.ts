import { expectTypeOf, it } from "vitest";
import { some, none, type Option } from "../src/option/index.js";
import { ok, err, type Result } from "../src/result/index.js";
import { type Brand, brand } from "../src/types/newtype.js";
import { type NonEmptyArray } from "../src/types/non-empty.js";

it("option types", () => {
  expectTypeOf(some(1)).toEqualTypeOf<Option<number>>();
  expectTypeOf(none()).toEqualTypeOf<Option<never>>();
});

it("result types", () => {
  expectTypeOf(ok(1)).toEqualTypeOf<Result<number, never>>();
  expectTypeOf(err("x")).toEqualTypeOf<Result<never, string>>();
});

it("brand types", () => {
  type UserId = Brand<string, "UserId">;
  expectTypeOf(brand<string, "UserId">("abc")).toEqualTypeOf<UserId>();
});

it("non-empty array types", () => {
  expectTypeOf<[1, ...number[]]>().toEqualTypeOf<NonEmptyArray<number>>();
});
