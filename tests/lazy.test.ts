import { describe, expect, it, vi } from "vitest";
import { lazy, once } from "../src/lazy/index.js";

describe("lazy", () => {
  it("lazy evaluates factory once", () => {
    const factory = vi.fn<() => number>(() => 42);
    const get = lazy(factory);
    expect(get()).toBe(42);
    expect(get()).toBe(42);
    expect(factory).toHaveBeenCalledOnce();
  });

  it("once is an alias for lazy", () => {
    const factory = vi.fn<() => string>(() => "x");
    const get = once(factory);
    expect(get()).toBe("x");
    expect(factory).toHaveBeenCalledOnce();
  });
});
