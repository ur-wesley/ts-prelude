import { describe, expect, it } from "vitest";
import { createConsola, logger } from "../src/log/index.js";

describe("log", () => {
  it("exposes default logger", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
  });

  it("re-exports createConsola", () => {
    const custom = createConsola({ defaults: { tag: "test" } });
    expect(custom).toBeDefined();
  });
});
