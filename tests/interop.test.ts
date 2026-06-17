import { describe, expect, it } from "vitest";
import { fromNullable, toOption, toResult } from "../src/interop/index.js";

describe("interop", () => {
  it("fromNullable matches option semantics", () => {
    expect(fromNullable("x")).toEqual({ _tag: "Some", value: "x" });
    expect(fromNullable(null)).toEqual({ _tag: "None" });
  });

  it("toOption", () => {
    expect(toOption(1)).toEqual({ _tag: "Some", value: 1 });
    expect(toOption(undefined)).toEqual({ _tag: "None" });
  });

  it("toResult", () => {
    const ok = toResult("hi", "missing");
    expect(ok.isOk() && ok.value).toBe("hi");
    const err = toResult(null, "missing");
    expect(err.isErr() && err.error).toBe("missing");
  });
});
