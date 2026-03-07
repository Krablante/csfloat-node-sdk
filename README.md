# csfloat-node-sdk

Unofficial Node.js / TypeScript SDK for the CSFloat API.

Important:

The repository metadata in `package.json` should match the real GitHub repository before public release.

## Current Scope

This repository is intentionally focused on one thing first:

1. a clean, typed, well-documented SDK for the CSFloat API
2. practical maintainer tooling for inventory, stall, listings, history, and authenticated account workflows
3. examples, smoke tests, and reusable automation primitives for OSS users and internal tooling

The initial public scope is **CSFloat-first** and **CSFloat-only**.

## Why This Repository Exists

There are unofficial wrappers around the CSFloat API, but the ecosystem still benefits from a stronger Node.js / TypeScript implementation with:

1. explicit request/response typing
2. pagination helpers
3. robust error handling
4. authenticated listing mutation flows
5. examples that reflect real-world maintainer workflows
6. clear documentation of tested endpoints and behavior

## Design Principles

1. API-first, not browser-first
2. typed interfaces over ad-hoc JSON access
3. explicit auth and mutation contracts
4. predictable error handling
5. small, composable client surface
6. honest scope: current support first, roadmap second

## Release Readiness

The repository now includes:

1. build + typecheck
2. tests
3. API coverage matrix
4. contribution guide
5. security policy
6. GitHub Actions CI

## Planned v0 Scope

Initial milestone:

1. authenticated client bootstrap
2. `me`
3. `inventory`
4. `stall`
5. `public listings`
6. `listing by id`
7. `listing create / update / delete`
8. basic pagination helpers
9. example scripts
10. smoke-test docs

## Current Implemented Skeleton

The current repository already includes:

1. typed low-level HTTP client
2. typed SDK entrypoint
3. resources for:
   - `account.getMe()`
   - `inventory.getInventory()`
   - `users.getUser()`
   - `stall.getStall()`
   - `listings.getListings()`
   - `listings.iterateListings()`
   - `listings.getListingById()`
   - `listings.createListing()`
   - `listings.createBuyNowListing()`
   - `listings.createAuctionListing()`
   - `listings.updateListing()`
   - `listings.deleteListing()`
   - `history.getSales()`
4. generic cursor pagination helper
5. read-only example script

## Quick Start

```bash
npm install
npm run check
npm run build
```

Create `.env` from `.env.example` and set:

```bash
CSFLOAT_API_KEY=your_api_key_here
```

Run the basic example:

```bash
npm run example:basic
```

## Minimal Usage

```ts
import { CsfloatSdk } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const me = await sdk.account.getMe();
const inventory = await sdk.inventory.getInventory();
const listings = await sdk.listings.getListings({ limit: 10, type: "buy_now" });
```

## Supported Surface Right Now

Read-only:

1. account profile
2. inventory
3. public user profile
4. stall
5. public listings
6. listing by id
7. sales history

Mutation methods implemented:

1. create listing
2. create auction listing shape
3. create buy-now listing helper
2. update listing
3. delete listing

Important:

Mutation examples should stay opt-in and clearly labeled. The repository should default to read-only examples in public docs.

## Coverage Statement

This repository aims to cover the **currently known** CSFloat API surface.

That means:

1. officially documented endpoints
2. source-discovered endpoints from public wrappers
3. live-validated endpoints we have personally confirmed

See [API_COVERAGE.md](/home/bloob/projects/csfloat-node-sdk/API_COVERAGE.md) for the endpoint-by-endpoint matrix.

## What This Is Not

This repository is not intended to start as:

1. a repricer bot
2. a market sniper
3. a browser automation tool
4. a cross-market trading engine on day one

Those higher-level workflows can exist in separate applications built on top of this SDK.

## Future Roadmap

Long-term, this project may evolve toward a broader **CS2 market adapter ecosystem**.

That means:

1. the current repository starts with a single high-quality CSFloat adapter
2. the architecture should leave room for additional adapters in the future
3. broader coverage across multiple CS2 markets is a roadmap direction, not a current feature

Possible future directions:

1. shared abstractions for listings, inventory, and sales-like market events
2. adapter modules for additional CS2 marketplaces
3. normalized entity models across multiple market providers
4. higher-level OSS utilities for multi-market research and automation

Important:

The repository should never pretend that multi-market coverage already exists before it is actually implemented.

## Candidate Repository Structure

```text
csfloat-node-sdk/
  README.md
  PLAN.md
  package.json
  tsconfig.json
  src/
  examples/
  test/
```

## Next Step

See [PLAN.md](/home/bloob/projects/csfloat-node-sdk/PLAN.md) for the concrete repository plan, milestones, and package design.
