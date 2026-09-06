import { describe, it, expect } from "vitest";
import { hello } from "./index.js";

describe("hello", () => {
  it("should return greeting with name", () => {
    expect(hello("World")).toBe("Hello, World! Starter ran. Connect NodeBench MCP with npm run mcp:start.");
  });

  it("should handle empty string", () => {
    expect(hello("")).toBe("Hello, ! Starter ran. Connect NodeBench MCP with npm run mcp:start.");
  });
});
