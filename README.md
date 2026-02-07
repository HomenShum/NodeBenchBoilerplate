# nodebench-boilerplate

Production-ready boilerplate for AI agent projects using [NodeBench MCP](https://www.npmjs.com/package/nodebench-mcp).

Pre-configured with **129 MCP tools**, quality gates, parallel agent infrastructure, GitHub Actions CI, and Docker.

## What's Included

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent instructions — every AI session starts here |
| `.mcp.json` | NodeBench MCP server configuration |
| `package.json` | Pre-wired scripts: `mcp:start`, `mcp:lite`, `mcp:core`, `mcp:full` |
| `.github/workflows/ci.yml` | GitHub Actions CI (Node 20 + 22, build, test, lint) |
| `Dockerfile` | Multi-stage production Docker build |
| `tsconfig.json` | Strict TypeScript with ESM |
| `src/index.ts` | Starter entry point |
| `src/index.test.ts` | Example test (Vitest) |

## Quick Start

```bash
# Clone this template
gh repo create my-project --template HomenShum/nodebench-boilerplate --clone
cd my-project

# Install
npm install

# Start NodeBench MCP (129 tools)
npm run mcp:start

# Or use presets
npm run mcp:lite    # 39 tools — lightweight
npm run mcp:core    # 87 tools — recommended
npm run mcp:full    # 129 tools — everything
```

## For AI Agents

Once MCP is running, agents should:

1. **`bootstrap_project`** — Register the project (tech stack, architecture, conventions)
2. **`search_all_knowledge`** — Check past findings before starting work
3. **`discover_tools("what you want to do")`** — Multi-modal search across 129 tools
4. **`get_workflow_chain("new_feature")`** — Get step-by-step tool sequences

### Search Modes

The `discover_tools` search engine supports 6 modes:

| Mode | What it does |
|------|-------------|
| `hybrid` (default) | Runs all 9 strategies: keyword, fuzzy, n-gram, prefix, semantic, TF-IDF, regex, bigram, domain-boost |
| `fuzzy` | Tolerates typos (Levenshtein distance) |
| `regex` | Pattern matching against tool names/descriptions |
| `prefix` | Matches tool names starting with query |
| `semantic` | Expands synonyms (e.g., "check" also searches "verify", "validate") |
| `exact` | Exact name/tag match only |

### Quality Gates

Every change should pass through:

```
search_all_knowledge → start_verification_cycle → [phases 1-6] → run_mandatory_flywheel → record_learning
```

### Parallel Agents

For multi-agent work (Anthropic C-Compiler pattern):

```
bootstrap_parallel_agents → assign_agent_role → claim_agent_task → [work] → release_agent_task
```

## Available Scripts

| Script | Command |
|--------|---------|
| `npm run build` | TypeScript compilation |
| `npm test` | Run tests (Vitest) |
| `npm run dev` | Watch mode development |
| `npm run mcp:start` | Launch NodeBench MCP (full preset) |
| `npm run mcp:lite` | Launch with lite preset (39 tools) |
| `npm run mcp:core` | Launch with core preset (87 tools) |

## Docker

```bash
docker build -t my-project .
docker run my-project
```

## License

MIT
