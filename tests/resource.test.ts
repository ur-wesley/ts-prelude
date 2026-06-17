import { describe, expect, it, vi } from "vitest";
import {
  defer,
  using,
  usingResource,
  usingAsync,
  usingResourceAsync,
} from "../src/resource/index.js";

describe("resource", () => {
  it("defer exposes value and optional cleanup on dispose", () => {
    const cleanup = vi.fn<(value: { id: number }) => void>();
    const resource = defer(() => ({ id: 1 }), cleanup);
    expect(resource.value).toEqual({ id: 1 });
    resource[Symbol.dispose]();
    expect(cleanup).toHaveBeenCalledWith({ id: 1 });
  });

  it("defer without cleanup", () => {
    const resource = defer(() => 42);
    expect(() => resource[Symbol.dispose]()).not.toThrow();
  });

  it("usingResource always disposes", () => {
    const dispose = vi.fn<() => void>();
    const resource = { value: 1, [Symbol.dispose]: dispose };
    const out = usingResource(resource, (r) => r.value * 2);
    expect(out).toBe(2);
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("usingResource disposes when fn throws", () => {
    const dispose = vi.fn<() => void>();
    const resource = { [Symbol.dispose]: dispose };
    expect(() =>
      usingResource(resource, () => {
        throw new Error("boom");
      }),
    ).toThrow("boom");
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("using acquires, runs, and disposes", () => {
    const dispose = vi.fn<() => void>();
    const value = using(
      () => ({ n: 7, [Symbol.dispose]: dispose }),
      (r) => r.n + 1,
    );
    expect(value).toBe(8);
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("usingAsync disposes after async fn", async () => {
    const dispose = vi.fn<() => Promise<void>>(async () => {});
    const resource = {
      value: 1,
      [Symbol.asyncDispose]: dispose,
    };
    const out = await usingAsync(resource, async (r) => r.value + 1);
    expect(out).toBe(2);
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("usingResourceAsync acquires and disposes", async () => {
    const dispose = vi.fn<() => Promise<void>>(async () => {});
    const out = await usingResourceAsync(
      () => ({ n: 3, [Symbol.asyncDispose]: dispose }),
      async (r) => r.n * 3,
    );
    expect(out).toBe(9);
    expect(dispose).toHaveBeenCalledOnce();
  });
});
