# csfloat-node-sdk Plan

Date: 2026-03-07
Scope: create a strong public OSS starting point for a Node.js / TypeScript SDK around the CSFloat API, with honest room for future CS2 market adapters.

## 1. Core Positioning

This repository should start as:

1. an unofficial Node.js / TypeScript SDK for the CSFloat API
2. a public OSS project that is actually useful on its own
3. a clean foundation for future automation tools and adapters

This repository should not start as:

1. a vague “all CS2 markets” wrapper without real implementation
2. a thin copy of another unofficial wrapper
3. a giant product surface with unclear ownership

## 2. Repository Goal

Deliver a public repository that can credibly say:

1. here is a well-designed CSFloat Node.js SDK
2. here are the tested API workflows it supports
3. here is the roadmap toward a broader market-adapter architecture

## 3. Current Scope Freeze

Current implementation scope:

1. CSFloat API only
2. Node.js / TypeScript only
3. explicit support for authenticated account flows
4. focus on listings, stall, inventory, account profile, and listing mutation

Current non-goals:

1. browser automation
2. pricing engine logic
3. Telegram bot workflows
4. multi-market support in v0

## 4. Roadmap Direction

Future direction can expand toward a broader CS2 market tooling ecosystem, but only in stages.

Recommended wording:

1. **current**: `CSFloat-first SDK`
2. **next**: `market-adapter-ready architecture`
3. **future**: `additional CS2 market adapters`

That keeps the repository honest while still showing active growth potential.

## 5. v0.1.0 Deliverables

The first strong public version should include:

1. typed API client
2. auth handling via API key
3. methods for:
   - `getMe`
   - `getInventory`
   - `getStall`
   - `getListings`
   - `getListingById`
   - `createListing`
   - `updateListing`
   - `deleteListing`
4. pagination helpers
5. normalized error model
6. usage examples
7. endpoint support matrix in docs
8. basic smoke-test guidance

## 6. Suggested Package Design

Suggested high-level modules:

1. `src/client/`
   - low-level HTTP client
   - auth injection
   - retry / timeout handling
2. `src/resources/`
   - `account`
   - `inventory`
   - `stall`
   - `listings`
   - `history`
3. `src/types/`
   - API response types
   - shared entities
4. `src/errors/`
   - typed errors
5. `src/utils/`
   - query helpers
   - pagination helpers
6. `examples/`
   - real usage scripts

## 7. Documentation Requirements

The public repository should include:

1. `README.md`
2. quick start
3. install instructions
4. auth usage
5. endpoint examples
6. supported / partially-supported endpoint table
7. roadmap section
8. contribution guidelines later

## 8. Quality Bar For Public Release

Before public release, the repo should have:

1. clean naming
2. consistent TypeScript types
3. no hardcoded secrets
4. simple examples that actually run
5. smoke-tested mutation examples clearly labeled
6. clear disclaimer that this is unofficial

## 9. Future Multi-Market Expansion

If the repository later grows beyond CSFloat, it should do so by adapters, not by scope drift.

Good future shape:

1. keep `csfloat-node-sdk` strong as the first adapter
2. later introduce adapter interfaces or sibling packages
3. only claim broad market coverage after real implementations exist

Possible future branches:

1. `market-adapters` abstraction layer
2. normalized listing model across providers
3. additional CS2 market connectors
4. comparison / research utilities

## 10. Best Immediate Next Step

The best next execution step after this planning repo exists:

1. initialize the actual package skeleton
2. choose `TypeScript + tsup` or equivalent minimal build tooling
3. implement authenticated client bootstrap
4. implement `getMe`, `getInventory`, `getStall`, and `getListings`
5. document real tested behavior as the source of truth
