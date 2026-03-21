# csfloat-node-sdk AGENTS

Use this file when editing this repo.

## What this repo is

- public Node.js / TypeScript SDK for the live CSFloat API surface
- public docs and examples repo, with a bundled `website/` docs site

## Main surfaces

- `src/`
- `test/`
- `examples/`
- `docs/`
- `scripts/`
- `website/`

## Run and validate

- baseline gate: `npm run release:check`
- docs site build when touching `website/`: `cd website && npm run build`
- prefer repo entry points over ad hoc commands

## Boundaries

- keep `.env` local and untracked
- keep browser state, live audit outputs, Playwright artifacts, and other mutable local evidence out of git
- when used inside the canonical atlas workspace, mirror mutable local state under:
  - `/home/bloob/atlas/state/work/public/personal/cs2-skins/csfloat-node-sdk`

## Project-specific gotchas

- this repo is public OSS-style owned work, so avoid leaking local-only workspace assumptions into user-facing docs unless they are clearly marked
- `website/content/` is generated from the canonical docs sources; edit root docs first, then resync/build the site if needed
