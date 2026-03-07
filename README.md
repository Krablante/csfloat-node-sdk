# csfloat-node-sdk

[![CI](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/Krablante/csfloat-node-sdk)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/Krablante/csfloat-node-sdk)](https://github.com/Krablante/csfloat-node-sdk/issues)

Unofficial Node.js / TypeScript SDK for the CSFloat API.

This repository aims to provide a clean, typed, public SDK around the **currently known** CSFloat API surface, with honest coverage claims, maintainable abstractions, and release-quality OSS hygiene from day one.

## Why This Exists

There are community wrappers around the CSFloat API, but the ecosystem still benefits from a stronger TypeScript-first implementation with:

1. explicit request and response typing
2. authenticated account and listing workflows
3. async pagination for global listing scans
4. clean examples and coverage docs
5. a repository that is ready for real maintenance, review, and release workflows

## Highlights

1. TypeScript-first SDK surface
2. `fetch`-based transport with no runtime dependency bloat
3. account, inventory, user, stall, listing, and sales-history resources
4. mutation helpers for create/update/delete listing flows
5. generic cursor pagination helper
6. GitHub Actions CI
7. release-facing OSS files (`CHANGELOG`, `CONTRIBUTING`, `SECURITY`, `API_COVERAGE`)

## Coverage Statement

This SDK covers the **currently known** CSFloat API surface based on:

1. official documentation
2. source discovery from public wrappers
3. live validation against real account workflows

See [API_COVERAGE.md](./API_COVERAGE.md) for the endpoint-by-endpoint support matrix.

## Supported Surface

| Area | Status | Methods |
|---|---|---|
| Account | implemented | `account.getMe()` |
| Inventory | implemented | `inventory.getInventory()` |
| Public users | implemented | `users.getUser()` |
| User stall | implemented | `stall.getStall()` |
| Listings | implemented | `listings.getListings()`, `listings.iterateListings()`, `listings.getListingById()` |
| Listing mutations | implemented | `listings.createListing()`, `listings.createBuyNowListing()`, `listings.createAuctionListing()`, `listings.updateListing()`, `listings.deleteListing()`, `listings.unlistListing()` |
| History | implemented | `history.getSales()` |

## Installation

```bash
npm install
```

## Quick Start

Create `.env` from `.env.example`:

```bash
CSFLOAT_API_KEY=your_api_key_here
```

Run local quality checks:

```bash
npm test
npm run check
npm run build
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
const listings = await sdk.listings.getListings({
  limit: 10,
  type: "buy_now",
});

console.log(me.user.steam_id, inventory.length, listings.data.length);
```

## Safety Note For Mutations

Mutation methods are part of the SDK surface, but public docs and examples should default to read-only flows whenever possible.

Important:

1. `buy_now` listing creation is the primary supported mutation path
2. auction request shape is supported in the SDK surface
3. not every mutation variant should be treated as equally live-validated unless explicitly documented in [API_COVERAGE.md](./API_COVERAGE.md)

## Project Scope

Current scope:

1. CSFloat-first
2. CSFloat-only in the initial public release
3. reusable SDK building blocks for higher-level tools

Current non-goals:

1. browser automation
2. repricer logic
3. Telegram bot workflows
4. pretending to already cover every CS2 market

## Future Roadmap

Long-term, this repository may become the first adapter in a broader **CS2 market adapter ecosystem**.

That means:

1. the current repository stays honest about being CSFloat-first
2. future multi-market support should arrive via real adapters, not vague claims
3. normalized abstractions across providers can come later, once there is actual implementation behind them

See [PLAN.md](./PLAN.md) for the more detailed roadmap and package direction.

## Development

```bash
npm install
npm test
npm run check
npm run build
```

## License

[MIT](./LICENSE)
