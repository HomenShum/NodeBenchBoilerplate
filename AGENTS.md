# NodeBenchBoilerplate agent instructions

## Start here

This repository is a small TypeScript/Node.js source template. The greeting is
not an agent or a connection check. Use the project-root setup in [README.md](README.md).
The lock currently installs NodeBench MCP 3.2.1. The default configuration uses
`--stdio --no-embedding --preset core`; use core or full and confirm required
method names with `tools/list` before beginning this workflow. Starter is a
smaller discovery surface and cannot be assumed to expose all of these gates.

`npm run verify:mcp` checks transport and native storage in an owned temporary
profile. A normal host session has its own persistent data policy. Never record
synthetic tasks into an existing user's database. Embeddings, model providers,
background engine/watchdog/dashboard activation, and global host setup are
outside the keyless baseline.

## First session

1. Register the real project with `bootstrap_project`, for example
   `{"projectName":"my-project","techStack":"TypeScript, Node.js","buildCommands":"npm run build","testCommands":"npm test"}`.
   Command strings are stored as context; bootstrap does not execute them.
2. Call `search_all_knowledge` with `{"query":"the task you will do","limit":5}`.
3. Call `getMethodology` with `{"topic":"overview"}`.
4. Check `get_project_context` readback. A returned ID alone does not establish
   persistence; the installed native adapter must work and state must survive restart.

## Every task

1. Search existing knowledge with a bounded limit.
2. Call `start_verification_cycle` with a concrete `title` and `description`.
3. Follow all six phases from the returned methodology. Use
   `log_phase_findings` with `cycleId`, `phaseNumber`, `status` (`passed` or
   `failed`), and concrete `findings`; use `get_verification_status` to read back.
4. Run actual `npm run build`, `npm run lint`, `npm test`, and appropriate native
   interaction/failure checks. Record outcomes with `log_test_result` using
   `cycleId`, `layer` (`static`, `unit`, `integration`, `manual`, or `live_e2e`),
   `label`, `passed`, and `output` identifying retained command/artifact evidence.
5. Run the code-review gate and closed loop below, then the mandatory flywheel.
   Every nontrivial change must pass before shipping. Do not skip a behavioral
   change using `skipJustification` or invent an approval for a pending step.
6. Call `record_learning` with a stable `key`, concrete `content`, a `category`
   (`edge_case`, `gotcha`, `pattern`, `regression`, or `convention`), and optional
   `tags`/`sourceCycle`. Read it back with `search_learnings` and a bounded limit.

## Gates record evidence; they do not execute checks

For every PR, retrieve `get_gate_preset` with `{"preset":"code_review"}`.
Evaluate each returned rule against actual evidence, then call `run_quality_gate`
with `gateName`, `target`, and a nonempty `rules` array of `{name, passed}`.
`run_quality_gate` has no `preset` argument. Preserve every failed rule.
Use the same sequence for `deploy_readiness` before releases and `ui_ux_qa`
for frontend changes. No owned frontend exists in this starter today.

For code changes, `run_closed_loop` requires evidence for all four steps:
`compile`, `lint`, `test`, `self_debug`. Supply a `steps` array of
`{step, passed, output}` and optional `cycleId`. It records the supplied results;
it does not start the compiler, linter, test runner, or debugger.

Call `run_mandatory_flywheel` with `target`, optional `cycleId`, and all six
`steps`: `static_analysis`, `happy_path_test`, `failure_path_test`, `gap_analysis`,
`fix_and_reverify`, `deploy_and_document`. Each item uses `stepName`, `passed`,
and evidence-bearing `output`. An unverified shared CI or release remains false.
Use `get_gate_history` with `gateName` and a bounded `limit` to verify stored
failure/success history after restart. Caller-supplied true values are neither
independent review nor human approval.

## Discovery, ownership and conventions

- Read the loaded tool schema before calling a method. Use discovery and
  `get_tool_quick_ref` / `get_workflow_chain` to find guidance; do not infer
  availability or side-effect safety from an old tool-count table.
- ESM modules, strict TypeScript, Vitest scenarios, and the real ESLint gate.
- Parallel-team helpers (`bootstrap_parallel_agents`, task claims and roles)
  can change local files/state. Use them only in an explicitly owned, authorized
  task scope; they are not required to prove this starter's transport.
- Keep before/after evidence and failure history. Do not claim Docker, a provider,
  a deployed surface, or a downstream application from a lower-layer test.
- Full dependency findings remain a separate remediation hold; installation of
  the native adapter or development linter is not an audit waiver.
