# nodebench-boilerplate — Agent Instructions

## Project Overview
- **Name**: nodebench-boilerplate
- **Tech Stack**: TypeScript, Node.js
- **NodeBench MCP**: v2.8.1 (129 tools)
- **Created**: 2026-02-06

## Quick Start for AI Agents

### First Session
1. Call `bootstrap_project` to register this project with NodeBench MCP
2. Call `search_all_knowledge` to check for relevant past findings
3. Call `getMethodology("overview")` to see all available methodologies

### Every Task
1. `search_all_knowledge` — Check what the system already knows
2. `start_verification_cycle` — Begin 6-phase verification
3. Follow phases 1-6 (guided by tool responses)
4. `run_mandatory_flywheel` — 6-step final check before declaring done
5. `record_learning` — Capture what you discovered

### Progressive Tool Discovery
- `discover_tools("what you want to do")` — Multi-modal search (9 strategies: keyword, fuzzy, n-gram, prefix, semantic, TF-IDF, regex, bigram, domain-boost)
- `get_tool_quick_ref("tool_name")` — What to do after calling any tool
- `get_workflow_chain("new_feature")` — Full step-by-step tool sequences

### Parallel Agent Teams
- `bootstrap_parallel_agents` — Scaffold parallel agent infra for this repo
- `claim_agent_task` / `release_agent_task` — Lock/unlock tasks
- `assign_agent_role` — Specialize (implementer, reviewer, tester, documenter)
- `log_context_budget` — Track token usage to prevent context pollution
- `run_oracle_comparison` — Validate against known-good reference outputs

## Architecture
<!-- Describe your project architecture here -->

## Conventions
- ESM modules (`"type": "module"`)
- Strict TypeScript
- Vitest for testing
- Every change must pass `run_mandatory_flywheel` before shipping
- UI changes must pass the `ui_ux_qa` quality gate
- Code changes must pass `run_closed_loop` (compile -> lint -> test -> debug)

## Quality Gates
- `run_quality_gate` with preset `code_review` for all PRs
- `run_quality_gate` with preset `deploy_readiness` before releases
- `run_quality_gate` with preset `ui_ux_qa` for frontend changes

## Edge Cases & Learnings
<!-- Record patterns, gotchas, and edge cases here as you discover them -->
<!-- Use `record_learning` to persist them in the NodeBench knowledge base -->
