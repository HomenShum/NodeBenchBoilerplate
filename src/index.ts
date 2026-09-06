/**
 * NodeBench Boilerplate — Starter project pre-configured for AI agent development.
 *
 * This project includes:
 * - AGENTS.md with instructions for AI agents
 * - .mcp.json for NodeBench MCP integration
 * - GitHub Actions CI
 * - Docker support
 * - Quality gate patterns
 *
 * Get started:
 *   1. npm ci
 *   2. npm run mcp:start (to launch NodeBench MCP)
 *   3. Call bootstrap_project to register with NodeBench
 */

export function hello(name: string): string {
  return `Hello, ${name}! Starter ran. Connect NodeBench MCP with npm run mcp:start.`;
}

console.log(hello("World"));
