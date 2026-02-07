import { describe, it, expect } from "vitest";
import { hello } from "./index.js";

describe("hello", () => {
  it("should return greeting with name", () => {
    expect(hello("World")).toBe("Hello, World! NodeBench MCP is ready.");
  });

  it("should handle empty string", () => {
    expect(hello("")).toBe("Hello, ! NodeBench MCP is ready.");
  });
});
