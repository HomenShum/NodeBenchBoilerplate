# Developer and coding-agent handoff

A developer using this template gets a TypeScript greeting, a local MCP
connection, and commands that can verify transport and native storage. Read
[README.md](README.md) for setup and [AGENTS.md](AGENTS.md) before recording work.
The greeting alone does not establish an agent connection or a usable application.

## Run the local proof

Use Node.js 22.13+ within major 22; retained local runs use 22.22.2 on Windows.
The CI matrix also targets Node 20.19+ within major 20, but that platform lane
needs its own shared result. From the repository root:

```sh
npm ci
npm run build
node dist/index.js
npm test
npm run lint
npm run verify:mcp
```

Install all locked dependencies, including the native better-sqlite3 adapter.
A compatible prebuilt binary or normal native build tools are prerequisites.
`verify:mcp` creates and retains a new owned temporary profile and database,
prints its location, and checks actual insert/readback/reopen. An existing output
directory is refused. To choose a fresh destination, use
`npm run verify:mcp -- /path/to/new-proof-directory`.

After installation, a host can use [the local configuration](.mcp.json) with
this repository as its working directory. It calls the installed CLI directly;
missing installation fails instead of fetching a replacement. The default is
core with stdio and embeddings disabled. Stdio waits for a client, has no web
page, and closes on EOF. Starting it manually is not proof that a particular
coding-agent host has connected.

For a real task, follow AGENTS.md: run actual commands, retain their outcomes,
then record them through the discovered tool schemas. Gates aggregate supplied
booleans. They do not execute tests or grant human approval. Do not record
synthetic work into an existing user's database; the reusable verifier isolates
its own state. Optional providers, embeddings and background services require
separate authorized setup.

## What the retained evidence establishes

The [evidence index](evidence/local-mcp-handoff-20260905/README.md) separates
three source-bound stages: the independently reviewed entrypoint repair, the
independently reviewed nine-row dependency trial, and the subsequent exact-lock
candidate installation. Earlier audit results remain historical.

The dependency trial passed ordinary installation, build, two existing tests,
lint, compiled greeting and 25 protocol/native-storage assertions. A separate
50-call journey passed 16 assertions, retaining false review/release gates,
eight history records and one learning after eight updates across restart.
Eight library regression families passed 71 patched assertions. Independent
review reproduced four old/patched pairs with 48 patched assertions. These
finite checks do not certify every loaded tool or arbitrary sustained load.

The nine-row lock transfer then passed normal `npm ci` in the candidate. The
same four compiled starter outputs matched the earlier trial; this is output
identity, not a new provider or application test. The recorded local judgments
approve these bounded changes. Publication, shared CI and host activation need
their own receipts; this packet is not a substitute for them.

## Native platform lock follow-up

The first shared run at commit `5b0181d` installed and built, then both Linux
Test steps failed before collection because the lock omitted Rollup's Linux
package. Node 22 was cancelled overall; lint and protocol were not reached.
The [dated supplement](evidence/local-mcp-handoff-20260905/platform-lock-20260906/README.md)
preserves those failures and all four resolution attempts. Only the fourth
result was accepted: 59 optional/native records added, no existing package-path
version changed, and only three old parent records gained npm-generated
resolved/integrity metadata. The manifest and permanent dependency set stayed
unchanged; the two high Sharp/MCP findings remain open.

The exact corrected lock passed a fresh Windows npm ci, build, two tests, lint
and 25 protocol assertions, including native SQLite write and reopen. An
independent review checked the records, raw logs, inventories and four compiled
outputs. These results do not replay the older 50-call workflow. A new ordinary
shared Linux Node 20/22 run on the corrected commit is required for Linux
acceptance; the local result is not a substitute. The active byte verifier now
binds this handoff and corrected lock, while the supplement preserves the old
5b0181d source bindings and manifest without rewriting historical proof.

## Historical dependency and platform limits, September 5–6

The retained full audit exits 1 with **two high findings**, Sharp and the MCP
package's inherited Sharp entry. Sharp 0.35.0 lies outside MCP 3.2.1's optional
`^0.34.5` range. Nine compatible patches reduced the earlier eleven findings;
they did not finish the security work. Development-dependency labels do not
remove risk because MCP is the intended tool runtime. Review the remaining
advisory before admitting untrusted inputs; no force update or override is
implied by this handoff.

Docker, Node 20/Linux native execution, global host activation, model/provider
tools, embeddings, image/OCR paths and downstream generated applications are
unverified here. This repository owns no browser UI; visual, responsive and
interaction grades for an application are not applicable to the greeting and
cannot be inferred from these checks. No complete readiness grade is assigned.

## Current consumer-only Sharp patch

The package now overrides Sharp to 0.35.4 only under `nodebench-mcp`; all direct
dependency declarations and MCP 3.2.1 remain unchanged. The lock replaces 26
Sharp-family/runtime records and adds two optional WASM wrappers; 392 existing
records remain exact. The full scratch lock audit reports zero findings. The
starter's Node20.19+/22.13+ floors satisfy Sharp's >=20.9 requirement. Upstream
source already changes the range, but the published MCP still selects ^0.34.5
and retains its separate unresolved Node18 metadata contract.

This patch extends the existing `verify:mcp` full-preset session while keeping
all 25 original protocol/SQLite checks and time/read limits. A deterministic
64x32 PNG is resized to32x16 and cropped to8x8 through actual tools/call; returned
bytes, saved captures and decoded pixels must agree. Small malformed bytes must
produce an error body with no new image/capture, followed by a valid same-session
recovery. All files stay under the proof's owned profile.

The September 8, 2026 Windows x64 Node 22.22.2 run passed a fresh npm ci, complete
installed inventory, full audit with zero findings, build, compiled greeting,
two tests, lint and all 33 protocol/storage/image checks. Sharp 0.35.4 loaded
libvips 8.18.6. The package-local SQLite adapter retained an actual inserted row
across process reopen. Resize and recovery returned the same 138-byte PNG;
the 8x8 crop returned 95 bytes. Returned images, saved captures and decoded pixels
agreed, and malformed input created no capture. All four compiled starter
files match the prior build. Source, index and refs stayed unchanged during
the native run; the previous installation and output remain preserved.

The root reviewed the delegated worker's six-file implementation and ran these
checks after delegated review capacity became unavailable. Only this factual
results update was authored by the root after that source review. This is
local Windows evidence; the existing Linux 20/22 jobs must pass on the exact
proposed commit before integration. Use the normal commands above for a new
local receipt and the commit's CI checks for shared-platform evidence.

The published malformed-image handler returns an error body while its raw
content dispatcher emits isError:false and logs array results as success. The
verifier records that concrete upstream HONEST_STATUS hold, rather than treating
the false-success envelope as desired behavior. Full image-tool readiness,
other formats/OCR, Docker, provider/host integration and application grades
remain outside this proof.

## Verify the historical portable bytes

Python 3 uses only its standard library; no pip installation is needed:

```sh
python evidence/local-mcp-handoff-20260905/verify.py
```

This command checks the finite historical packet byte for byte; it does not
rerun tests or open omitted private databases. Its optional `--source-root`
argument binds the sixteen historical publication sources, including README,
HANDOFF and the old lock. Use it only with that exact historical checkout:
current changed sources intentionally fail this old binding. Source CRLF pairs
are normalized to LF by that historical verifier; raw evidence is never
normalized. The old manifest and raw identities remain unchanged.
