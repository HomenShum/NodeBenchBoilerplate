# NodeBenchBoilerplate

A small TypeScript source template for a developer or coding agent who needs a
local MCP connection, verification records, and ordinary build/test/lint gates.
The starter prints a greeting. It does not generate an application or prove an
MCP connection merely by running. NodeKit remains the separate project factory.

## First use

Use Node.js 22.13 or newer within major 22; the local proof uses 22.22.2.
The retained CI matrix also supports Node 20.19 or newer within major 20.
Run these commands from this repository's root after cloning or using the template:

```sh
npm ci
npm run build
node dist/index.js
npm test
npm run lint
npm run verify:mcp
```

Install the full locked dependencies. MCP is development tooling here, so an
`--omit=dev` install removes the actual tool runtime. The explicit
`better-sqlite3` dependency supplies the native database adapter that the MCP
package otherwise silently replaces with nonpersistent no-op storage. Native
installation requires a compatible platform binary or normal local build tools.

`verify:mcp` creates a new isolated profile and database under the OS temporary
directory, preserves its raw protocol records, and prints the output location.
To retain a named run, use `npm run verify:mcp -- /path/to/new-proof-directory`.
It checks real JSON-RPC initialization, lists, unsupported input, concurrent and
repeated reads, EOF/restart, and a native SQLite insert/readback/reopen. It does
not call model providers or mutation tools, and it does not certify every loaded
tool. A missing local installation fails instead of downloading another CLI.

## Connect your coding agent

After `npm ci`, configure your MCP host with [`.mcp.json`](.mcp.json) and set its
working directory to this project root. The configuration calls the locked local
`node_modules/nodebench-mcp/dist/index.js` directly. It has no global/cache or
automatic-install fallback. Starting a stdio server in a terminal waits for an
MCP client; it is not an HTTP page. EOF closes the session.

| Command | Preset and purpose |
| --- | --- |
| `npm run mcp:start` | Core, the default with the methods required by AGENTS.md |
| `npm run mcp:starter` | Smaller discovery surface; does not satisfy every agent gate |
| `npm run mcp:core` | Explicit core surface |
| `npm run mcp:full` | Wider local tool surface; verify a tool's side effects before use |

All four commands select stdio and disable embeddings explicitly. The baseline
also leaves the background engine, dashboards, watchdog, and profiling disabled.
Optional embeddings and provider integrations require separate setup and proof.
The installed MCP version is locked to 3.2.1. Read the current `tools/list` and
`prompts/list` results instead of relying on historical marketing tool counts.
The retained local run observed 20 starter tools, 273 core tools and 567 full
tools, with 14 prompts in each. These are loaded inventories, not a claim that
every tool has been exercised.
The old `lite` preset is unsupported and the old `mcp:meta` script did not exist.

Normal host sessions use the MCP package's configured data location (by default
the user's profile). Set `NODEBENCH_DATA_DIR` and an appropriate isolated host
profile when recording synthetic work. The verification command isolates both;
it never uses the user's existing NodeBench database.

## Agent handoff and evidence

For the runnable developer sequence, retained evidence, and current holds, read
[HANDOFF.md](HANDOFF.md).

Read [AGENTS.md](AGENTS.md) before changing code. Run the actual command or
interaction first, then record its outcome with the verification and quality
tools. Those tools persist and aggregate caller-supplied booleans; a generated
record ID is not proof of a command, native storage, or independent approval.
Keep missing release evidence false and preserve failure history.

For a feature handoff, start from the
[feature proof storyboard](docs/FEATURE_PROOF_STORYBOARD_TEMPLATE.md). Bind the
real persona, commands, artifacts and observed failures before claiming success.

## Current scope and limits

The repaired local contract is starter guidance, keyless stdio, native storage,
and blocking development checks. Normal installation, build, greeting tests,
lint, compiled starter, and the 25-assertion protocol/storage scenario passed
locally on Node 22.22.2. A separate owned-state journey retained failed gates
across restart and one learning after eight updates. Its review/release steps
remain false; those records are not independent approval.
Shared CI and host integration require their
own actual results. CI covers pushes and pull requests targeting `master` or
`main`, with the existing Node 20/22 matrix and a finite ten-minute job.

The original full audit reported 11 findings (4 moderate, 7 high). Nine compatible
lockfile patches reduced it to two high entries: Sharp and its inherited MCP
entry. The full audit still fails. Patched Sharp 0.35.0 is outside MCP 3.2.1's
optional `^0.34.5` range and requires an upstream package change. No override or
optional-capability removal was used. MCP is used at runtime and the Docker image
copies its dependencies; dev labels do not dismiss the remaining findings.
The patched dependency set passed the same local protocol/storage proof and
eight targeted regression families. Review the full audit before using untrusted
tool inputs; this is not complete security certification.

The existing Dockerfile builds and runs the greeting; Docker execution, provider
tools, global IDE activation, and downstream generated applications are not
certified by the local proof. This repository owns no browser UI, so visual,
responsive and interaction grades for an application cannot be inferred from
these CLI checks. No complete product/readiness grade is claimed.

## License

MIT
