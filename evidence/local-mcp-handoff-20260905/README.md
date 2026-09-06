# Local MCP handoff evidence

Read [HANDOFF.md](../../HANDOFF.md) from the repository root for the user journey.
This is a finite preservation packet for a small source template. The selected
raw files are exact copies. Historical source, command, path and failed-status
values remain unchanged; they are not claims about a new run.

| Stage | Concrete evidence | Boundary |
| --- | --- | --- |
| Original failure | [No-args stdout](raw/E6l-mcp-protocol-01/stdout.txt), [invalid lite](raw/E6l-documented-command-baseline-01/mcp-lite.json), [missing meta](raw/E6l-documented-command-baseline-01/mcp-meta.json) | Help or failed commands did not establish MCP connectivity |
| Entrypoint repair | [Independent judgment](raw/E6l_NODEBENCHBOILERPLATE_ENTRYPOINT_FINAL_JUDGE.md.txt), [runtime flags](raw/E6l-nodebenchboilerplate-implementation-01/final-runtime-flags.json) | Native transport/storage and blocking checks; original eleven-entry audit remains failed |
| Dependency trial | [Independent judgment](raw/E6l_NODEBENCHBOILERPLATE_SECURITY_TRIAL_JUDGE.md.txt), [nine-row delta](raw/E6l-nodebenchboilerplate-security-trial-01/resolution-delta.json) | No added/removed rows, unchanged MCP/Sharp/native adapter and package manifest |
| Ordinary commands | [Install](raw/E6l-nodebenchboilerplate-security-trial-01/normal-ci.json), [build](raw/E6l-nodebenchboilerplate-security-trial-01/build.json), [tests](raw/E6l-nodebenchboilerplate-security-trial-01/tests.json), [lint](raw/E6l-nodebenchboilerplate-security-trial-01/lint.json) | Exact stdout/stderr siblings retained; two existing tests, no full-tool certification |
| Protocol and storage | [25 assertions](raw/E6l-nodebenchboilerplate-security-trial-01/protocol-proof/report.json), [native write](raw/E6l-nodebenchboilerplate-security-trial-01/protocol-proof/native-write.stdout.txt), [reopen](raw/E6l-nodebenchboilerplate-security-trial-01/protocol-proof/native-reopen.stdout.txt) | Loaded inventories, error/repeated/restart behavior; full catalogs omitted |
| Workflow state | [16 assertions and 50 calls](raw/E6l-nodebenchboilerplate-security-trial-01/agents-state-proof/report.json), [read-only DB facts](raw/E6l-nodebenchboilerplate-security-trial-01/sqlite-readback.json) | All fifty replies and stdout retained; actual database remains private |
| Regression families | [Effective canaries](raw/E6l-nodebenchboilerplate-security-trial-01/canary-final.json), [independent four-pair replay](raw/E6l-security-trial-independent-01/selected-canary-replay.json) | Original resource failures, XML timeout and wrong-shape observer are preserved |
| Current audit | [Raw full audit](raw/E6l-nodebenchboilerplate-security-trial-01/audit.stdout.txt) | Exit 1, two high Sharp/MCP entries still open |
| Candidate transfer | [Exact lock and normal install](raw/E6l-dependency-lock-transfer-01/receipt.json) | Normal install only; no new full protocol or provider replay |

The independent entrypoint and dependency judgments preceded the current
publication. They do not approve this packet, future shared CI, or a release.
Full grades remain unassigned. The finite Hono CORS case passed both versions;
no denial-of-service reproduction or speed gain is claimed. The encoded Windows
path case uses an owned same-root sentinel, not an outside-root disclosure.
The native standalone probe observes 81 tables before creating its probe table
and 82 on reopening; the separate workflow database has 81 tables.

Run `python evidence/local-mcp-handoff-20260905/verify.py` from the repository
root. Add `--source-root .` to check the sixteen effective publication source
files after converting only CRLF pairs to LF. Their canonical bytes, SHA256 and
Git blob IDs were matched to an actual prospective Git index. Original raw
source identities remain alongside them. Packet and raw-copy checks remain
byte-exact; they perform no normalization. This standard-library verifier does
not rerun tests or inspect the current Git index or filters.

[raw-copy-map.json](raw-copy-map.json) maps original operator coordinates to
physical copies. Raw Markdown and collector code have inert `.txt` suffixes.
Embedded historical paths/links are retained verbatim and may point to omitted
local evidence; they are not portable navigation or fresh-run commands.
[source-bindings.json](source-bindings.json) distinguishes historical and current
source identities. The active index and handoff use physical portable links.

[excluded-artifacts.json](excluded-artifacts.json) records the finite omission
scope and custody hashes. Environment/name inventories, profiles, SQLite files,
caches and native binaries are excluded; private path names use opaque hashes.
Repeated full tool catalogs and whole source/build copies stay operator-local.
Their absence means a recipient cannot independently reparse every original
catalog, reopen the original database, or resume its session from this packet.
The reusable repository verifier can create a new owned protocol/storage run.
No secret values, provider traffic or new runtime execution were used to build
this packet. Absolute paths in selected historical records identify owned proof
locations and are not instructions to access a user's state.
