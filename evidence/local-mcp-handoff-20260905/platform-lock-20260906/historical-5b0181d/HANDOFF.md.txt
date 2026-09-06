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

## Open limits

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

## Verify the portable bytes

Python 3 uses only its standard library; no pip installation is needed:

```sh
python evidence/local-mcp-handoff-20260905/verify.py
python evidence/local-mcp-handoff-20260905/verify.py --source-root .
```

The first command checks the finite packet byte for byte. The second also
checks the sixteen publication source files, including this handoff and the
README link, against their canonical Git content. Only source CRLF pairs are
converted to LF, so ordinary Windows or Linux checkout endings are accepted;
other content changes still fail. Raw source identities remain recorded beside
the canonical byte counts, SHA256 hashes and actual Git blob IDs. Historical
source digests stay historical, and raw evidence is never normalized. Neither
command reruns tests or opens the omitted private databases.
