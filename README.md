# NodeBenchBoilerplate

Production-ready boilerplate for AI agent projects using [NodeBench MCP](https://www.npmjs.com/package/nodebench-mcp).

Pre-configured with **134 MCP tools**, quality gates, parallel agent infrastructure, GitHub Actions CI, and Docker.

## What's Included

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent instructions — every AI session starts here |
| `.mcp.json` | NodeBench MCP server configuration |
| `package.json` | Pre-wired scripts: `mcp:start`, `mcp:meta`, `mcp:lite`, `mcp:core`, `mcp:full` |
| `.github/workflows/ci.yml` | GitHub Actions CI (Node 20 + 22, build, test, lint) |
| `Dockerfile` | Multi-stage production Docker build |
| `tsconfig.json` | Strict TypeScript with ESM |
| `src/index.ts` | Starter entry point |
| `src/index.test.ts` | Example test (Vitest) |

## Quick Start

```bash
# Clone this template
gh repo create my-project --template HomenShum/NodeBenchBoilerplate --clone
cd my-project

# Install
npm install

# Start NodeBench MCP (full — 134 tools)
npm run mcp:start

# Or use presets
npm run mcp:meta    #   5 tools — discovery-only front door
npm run mcp:lite    #  36 tools — lightweight
npm run mcp:core    #  84 tools — recommended
npm run mcp:full    # 134 tools — everything
```

## Presets

| Preset | Tools | Use Case |
|--------|-------|----------|
| `meta` | 5 | Discovery-first / front door — only meta + discovery tools. Agent self-escalates. |
| `lite` | 36 | Solo dev, standard tasks — fast, low token overhead |
| `core` | 84 | Team with methodology needs — full flywheel loop |
| `full` | 134 | Multi-agent / full pipeline — parallel + self-eval + everything |

## For AI Agents

Once MCP is running, agents should:

1. **`discover_tools("what you want to do")`** — Multi-modal search across 134 tools
2. **`getMethodology("mandatory_flywheel")`** — Get step-by-step methodology
3. **`get_workflow_chain("new_feature")`** — Get pre-built tool sequences
4. **`findTools("keyword")`** — Search loaded tools by keyword

With `--preset meta`, the agent starts with only these 5 tools and discovers what it needs via `discover_tools`, then requests the user escalate to a larger preset.

### Search Modes

The `discover_tools` search engine supports 7 modes:

| Mode | What it does |
|------|-------------|
| `hybrid` (default) | Runs all 10 strategies: keyword, fuzzy, n-gram, prefix, semantic, TF-IDF, regex, bigram, domain-boost, dense |
| `fuzzy` | Tolerates typos (Levenshtein distance) |
| `regex` | Pattern matching against tool names/descriptions |
| `prefix` | Matches tool names starting with query |
| `semantic` | Expands synonyms (e.g., "check" also searches "verify", "validate") |
| `exact` | Exact name/tag match only |
| `dense` | TF-IDF cosine similarity for vector-like semantic search |

### Quality Gates

Every change should pass through:

```
search_all_knowledge → start_verification_cycle → [phases 1-6] → run_mandatory_flywheel → record_learning
```

### Feature Proof Storyboards

Before recording README clips or claiming a feature works, copy
[`docs/FEATURE_PROOF_STORYBOARD_TEMPLATE.md`](docs/FEATURE_PROOF_STORYBOARD_TEMPLATE.md)
to `docs/FEATURE_PROOF_STORYBOARD.md` and bind the demo to concrete commands,
receipts, screenshots, or external judge output.

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
| `npm run mcp:meta` | Launch with meta preset (5 tools — discovery only) |
| `npm run mcp:lite` | Launch with lite preset (36 tools) |
| `npm run mcp:core` | Launch with core preset (84 tools) |

### Agent Contract (Front-Door Pattern)

Every agent session should follow this contract:

```
# 1. FRONT DOOR — always start here
search_all_knowledge("<task>")
getMethodology("mandatory_flywheel")
discover_tools("<task>", { explain: true })
get_workflow_chain("fix_bug" | "new_feature" | ...)

# 2. BEFORE IMPLEMENTATION
run_recon + assess_risk

# 3. BEFORE SHIP
log_test_result → run_quality_gate → run_mandatory_flywheel → record_learning
```

Use the `agent-contract` prompt for the full behavioral specification.

## Docker

```bash
docker build -t my-project .
docker run my-project
```

## License

MIT
