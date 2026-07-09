# Feature Proof Storyboard Template

Copy this file to `docs/FEATURE_PROOF_STORYBOARD.md` in a generated project before recording README media or claiming a feature works.

## Feature

- Name:
- Route/command:
- User/persona:
- Risk level:

## Proof Contract

The demo must prove:

1. The user can reach the feature from a fresh checkout or documented app state.
2. The main action runs through product code, not static mock data.
3. Loading, empty, error, and success states are visible or covered by receipts.
4. Agent/tool work is backed by deterministic receipts, tests, or explicit external judge output.
5. Any official benchmark or production-readiness claim is separated from proxy proof.

## Story Beats

1. Entry state:
2. User action:
3. Agent/tool action:
4. Result state:
5. Evidence/receipt handoff:

## Validation Commands

```bash
npm run build
npm test
```

Add project-specific commands here:

```bash
# npm run clip:capture
# npm run proof:smoke
# npm run typecheck
```

## Node Ecosystem Hooks

- Use NodeTasks for benchmark-style task ids and searchable proof bundles.
- Use NodeGraph when the feature has meaningful relationships between users, tools, artifacts, evidence, traces, or memory.
- Use NodeAgent when the feature needs a portable agent harness.
- Use NodeTrace when the feature needs surface-to-trace proof.
- Use NodeMem when the feature remembers suggestions, dismissals, failures, or repair patterns.
