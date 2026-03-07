# csfloat-node-sdk

[![CI](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/Krablante/csfloat-node-sdk)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/Krablante/csfloat-node-sdk)](https://github.com/Krablante/csfloat-node-sdk/issues)

Unofficial Node.js / TypeScript SDK for the CSFloat API.

This repository aims to provide a clean, typed, public SDK around the **currently known** CSFloat API surface, with honest coverage claims, maintainable abstractions, and release-quality OSS hygiene from day one.

It is also intended to become one of the most comprehensive public maps of the currently accessible CSFloat API surface, consolidating official docs, public wrapper discovery, and live endpoint validation in one maintainer-grade repository.

Status: initial public release, actively maintained, and expanding coverage of the currently known CSFloat API surface.

## Why This Exists

There are community wrappers around the CSFloat API, but the ecosystem still benefits from a stronger TypeScript-first implementation with:

1. explicit request and response typing
2. authenticated account and listing workflows
3. async pagination for global listing scans
4. clean examples and coverage docs
5. a repository that is ready for real maintenance, review, and release workflows
6. a consolidated public reference for the widest responsibly validated CSFloat API surface we can document

## Highlights

1. TypeScript-first SDK surface
2. `fetch`-based transport with no runtime dependency bloat
3. schema, meta, account, inventory, user, stall, listing, and history resources
4. mutation helpers for create/update/delete listing flows
5. generic cursor pagination helper
6. GitHub Actions CI
7. release-facing OSS files (`CHANGELOG`, `CONTRIBUTING`, `SECURITY`, `API_COVERAGE`)
8. live-confirmed wear preset helpers for `FN`, `MW`, `FT`, `WW`, and `BS`
9. repeatable live API audit script for validation and endpoint discovery

## Coverage Statement

This SDK covers the **currently known** CSFloat API surface based on:

1. official documentation
2. source discovery from public wrappers
3. live validation against real account workflows

The intent is not just to expose a few popular endpoints, but to centralize the broadest responsibly confirmed public and authenticated CSFloat API surface in one OSS repository.

Confirmed market query support now includes live-tested `sort_by`, `filter`, `source`, and `min_ref_qty` behavior for listing scans. Exact `source` semantics are still being mapped, so the SDK exposes it as a raw working parameter rather than a finalized enum.
Wear filtering via `min_float` / `max_float` is also live-confirmed, and the SDK exports ready-to-use preset helpers matching the CSFloat search UI.

See [API_COVERAGE.md](./API_COVERAGE.md) for the endpoint-by-endpoint support matrix.

## Supported Surface

| Area | Status | Methods |
|---|---|---|
| Meta | implemented | `meta.getSchema()`, `meta.getExchangeRates()`, `meta.getLocation()` |
| Account | implemented | `account.getMe()`, `account.getTrades()`, `account.getOffers()`, `account.getWatchlist()`, `account.getOffersTimeline()`, `account.getNotifications()`, `account.getTransactions()`, `account.getAccountStanding()`, `account.getBuyOrders()`, `account.createBuyOrder()`, `account.deleteBuyOrder()`, `account.getAutoBids()`, `account.getMobileStatus()`, `account.updateMe()`, `account.setOffersEnabled()`, `account.setStallPublic()`, `account.setAway()`, `account.setMaxOfferDiscount()`, `account.updateTradeUrl()`, `account.markNotificationsRead()`, `account.setMobileStatus()` |
| Inventory | implemented | `inventory.getInventory()` |
| Public users | implemented | `users.getUser()` |
| User stall | implemented | `stall.getStall()` |
| Listings | implemented | `listings.getListings()`, `listings.iterateListings()`, `listings.getListingById()`, `listings.getBids()`, `listings.getBuyOrders()`, `listings.getSimilar()` |
| Listing mutations | implemented | `listings.createListing()`, `listings.createBuyNowListing()`, `listings.createAuctionListing()`, `listings.updateListing()`, `listings.deleteListing()`, `listings.unlistListing()` |
| History | implemented | `history.getSales()`, `history.getGraph()` |

## Installation

This repository is public and usable today, but it is not yet published to npm.

Clone the repository and install dependencies locally:

```bash
git clone https://github.com/Krablante/csfloat-node-sdk.git
cd csfloat-node-sdk
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

Once the package is published or linked locally, the SDK can be consumed like this:

```ts
import { CsfloatSdk } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const rates = await sdk.meta.getExchangeRates();
const me = await sdk.account.getMe();
const trades = await sdk.account.getTrades({ limit: 5 });
const inventory = await sdk.inventory.getInventory();
const listings = await sdk.listings.getListings({
  limit: 10,
  type: "buy_now",
});

console.log(rates.data.usd, me.user.steam_id, trades.count, inventory.length, listings.data.length);
```

Use the wear helpers for search-style float ranges:

```ts
import { CsfloatSdk, getWearParams } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const mwListings = await sdk.listings.getListings({
  limit: 10,
  sort_by: "most_recent",
  ...getWearParams("MW"),
});
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

Run the repeatable live API audit against a local `.env` file:

```bash
ENV_FILE=/path/to/.env npm run audit:live
```

To opt into reversible live mutation checks:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:live
```

## License

[MIT](./LICENSE)
