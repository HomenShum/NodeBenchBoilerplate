# Native platform lock supplement

A Linux developer's tests failed before collection because the reviewed lock
omitted Rollup's Linux package. The original Node 20 job failed; Node 22 was
cancelled overall after its Test step also failed. Lint and protocol did not
run. The original commit and failed logs remain historical evidence.

The corrected lock retains all existing package-path versions and the nine
earlier security fixes. It adds 59 native/optional records and lets npm supply
resolved/integrity metadata for three incomplete parent records. It does not
upgrade the tool runtime, add permanent dependencies or change CI behavior.

## Distinct attempts and actual outcomes

| Attempt | Observation | Outcome |
| --- | --- | --- |
| [01: existing lock](raw/E6l-platform-lock-resolution-01/receipt.json) | Ordinary lock-only resolution left the exact incomplete lock unchanged | Not accepted |
| [02: manifest only](raw/E6l-platform-lock-resolution-02/receipt.json) | Filled entries but changed 33 existing versions and removed five paths | Rejected |
| [03: constrained named update](raw/E6l-platform-lock-resolution-03/receipt.json) | Added two fsevents rows but still missed 57 platform rows | Not accepted |
| [04: invalidate three parents](raw/E6l-platform-lock-resolution-04/receipt.json) | Preserved the other 356 old row objects; ordinary npm rebuilt the missing parents and their optional closure | Exact lock accepted for guarded transfer |

The [approved input amendment](raw/E6l-platform-lock-parent-rebuild-plan.md.txt) explains the intentional disposable
input transformation. The saved original, invalidated, temporary-manifest,
intermediate and final lock bytes are mapped in raw-copy-map.json. No resolved
URL or integrity was hand-authored. Restoring package.json and native root-edge
reconciliation are separate recorded commands, not an assumed cleanup step.

## Independent proof and limits

- [Original shared failure](raw/E6l_NODEBENCHBOILERPLATE_SHARED_JUDGE.md.txt), [Node 20 raw log](raw/E6l-boilerplate-shared-01/node20-log.stdout.txt), [Node 22 raw log](raw/E6l-boilerplate-shared-01/node22-log.stdout.txt).
- [Final trial judgment](raw/E6l_NODEBENCHBOILERPLATE_PLATFORM_LOCK_TRIAL_JUDGE.md.txt) accepts exact lock
  `ae1f98f63c6b7a1f33bc62931cfd61e621901a8d8c2f8e2862d63b09cd63233f`.
- [Registry and edge review](raw/E6l-platform-lock-independent-01/report.json) verifies 59 new plus three rebuilt
  package records and all 111 optional dependency addresses. OS/CPU/libc
  metadata is evidence of resolution, not execution on every platform.
- [Fresh Windows consumer](raw/E6l-platform-lock-consumer-01/receipt.json) passed normal npm ci, build, two Vitest
  tests, lint and 25 protocol assertions. The [independent readback](raw/E6l-platform-lock-independent-01/consumer-readback.json)
  verifies actual inventories, native SQLite write/read/reopen and all four
  compiled outputs. No new 50-call AGENTS journey or provider call is implied.

Both original Linux lanes failed with the old lock. A new ordinary shared run
on the corrected commit is required before claiming Linux acceptance. The
current install still reports two high Sharp/MCP findings. Docker, global host,
provider, image/OCR and downstream application readiness remain unverified.
No UI or full readiness grade is assigned to this source template.

## Preserve and verify

Use the existing standard-library verifier from the repository root:

```sh
python evidence/local-mcp-handoff-20260905/verify.py
python evidence/local-mcp-handoff-20260905/verify.py --source-root .
```

The complete packet manifest includes this supplement, with strict raw bytes.
The optional source check binds the proposed lock and current HANDOFF alongside
the other fourteen unchanged source files. It accepts proven Git LF/CRLF text
checkout differences; real content changes fail. It does not rerun tests or
certify a Linux runtime. [Lineage](lineage.json) retains exact old binding and
manifest bytes from 5b0181d, while all 279 original raw copies stay unchanged.

[Copy map](raw-copy-map.json) distinguishes 97 non-registry origins in 66 exact
raw files from 71 registry origins in 63 proof-field derivatives. Identical
origins may share a destination. The derivatives contain only name/version,
tarball/integrity, OS/CPU/libc/engines and dependency/optional-dependency maps.
They are explicitly labelled derivatives, not exact raw registry copies. Their
original hashes and omitted-field names are recorded; complete registry JSON,
including public contact fields, remains operator-local. The independent trial
judgment read those originals, while a recipient can inspect the preserved
proof fields and their lineage here.

Historical raw links and absolute owned proof coordinates remain provenance,
not fresh-run commands. Only this index and the current HANDOFF promise active
portable links. [Omissions](excluded-artifacts.json) make the limits explicit.
Environment policies, private profiles/databases, native binaries, caches and
whole source/build trees are not portable payloads. No new install, runtime,
provider or application execution built this packet.
