import { describe, expect, it, vi, afterEach } from "vitest";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import {
  retry,
  withTimeout,
  race,
  parallel,
  asyncTraverse,
  lazyAsync,
} from "../src/async/index.js";

describe("async", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("retry succeeds on later attempt", async () => {
    let calls = 0;
    const result = await retry(
      () => {
        calls++;
        return calls < 2 ? errAsync("fail") : okAsync(42);
      },
      { times: 3 },
    );
    expect(result.isOk() && result.value).toBe(42);
    expect(calls).toBe(2);
  });

  it("retry returns last error when exhausted", async () => {
    const result = await retry(() => errAsync("nope"), { times: 2 });
    expect(result.isErr() && result.error).toBe("nope");
  });

  it("retry waits between attempts when delay is set", async () => {
    vi.useFakeTimers();
    let calls = 0;
    const pending = retry(
      () => {
        calls++;
        return errAsync("fail");
      },
      { times: 2, delay: 100 },
    );
    await vi.advanceTimersByTimeAsync(100);
    const result = await pending;
    expect(result.isErr()).toBe(true);
    expect(calls).toBe(2);
  });

  it("withTimeout resolves when result finishes first", async () => {
    const result = await withTimeout(okAsync("fast"), 500, "slow");
    expect(result.isOk() && result.value).toBe("fast");
  });

  it("withTimeout propagates async errors", async () => {
    const result = await withTimeout(errAsync("fail"), 500, "timeout");
    expect(result.isErr() && result.error).toBe("fail");
  });

  it("withTimeout returns timeout error when too slow", async () => {
    vi.useFakeTimers();
    const slow = ResultAsync.fromSafePromise(
      new Promise<string>((resolve) => setTimeout(() => resolve("late"), 200)),
    );
    const pending = withTimeout(slow, 50, "timeout");
    await vi.advanceTimersByTimeAsync(200);
    const result = await pending;
    expect(result.isErr() && result.error).toBe("timeout");
  });

  it("race returns first settled result", async () => {
    const result = await race(
      ResultAsync.fromSafePromise(
        new Promise<number>((resolve) => setTimeout(() => resolve(1), 50)),
      ),
      okAsync(2),
    );
    expect(result.isOk() && result.value).toBe(2);
  });

  it("race propagates error when first to settle", async () => {
    const result = await race(errAsync("lost"), okAsync(1));
    expect(result.isErr() && result.error).toBe("lost");
  });

  it("parallel collects all ok values", async () => {
    const result = await parallel([okAsync(1), okAsync(2)]);
    expect(result.isOk() && result.value).toEqual([1, 2]);
  });

  it("parallel short-circuits on first error", async () => {
    const result = await parallel([okAsync(1), errAsync("fail")]);
    expect(result.isErr() && result.error).toBe("fail");
  });

  it("asyncTraverse maps items", async () => {
    const result = await asyncTraverse([1, 2], (n) => okAsync(n * 2));
    expect(result.isOk() && result.value).toEqual([2, 4]);
  });

  it("lazyAsync deduplicates concurrent calls", async () => {
    let calls = 0;
    const load = lazyAsync(async () => {
      calls++;
      return 42;
    });
    const [a, b] = await Promise.all([load(), load()]);
    expect(a).toBe(42);
    expect(b).toBe(42);
    expect(calls).toBe(1);
  });
});
