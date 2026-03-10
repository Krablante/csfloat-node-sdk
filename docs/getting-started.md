# Getting Started

## Install

```bash
npm install csfloat-node-sdk
```

## Configure

Create `.env` from `.env.example`:

```bash
CSFLOAT_API_KEY=your_api_key_here
```

## First Client

```ts
import { CsfloatSdk } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
  minRequestDelayMs: 1250,
  maxRetries: 2,
  retryDelayMs: 250,
});
```

## First Useful Calls

```ts
const me = await sdk.account.getMe();
const inventory = await sdk.inventory.getInventory();
const listings = await sdk.listings.getListings({
  limit: 10,
  type: "buy_now",
});
const rates = await sdk.meta.getExchangeRates();
```

## Recommended First Paths

- Public market scan: `sdk.listings.getListings()` or `sdk.workflows.getPublicMarketFeeds()`
- Account dashboard snapshot: `sdk.workflows.getAccountWorkspace()`
- Buy-order insight lookup: `sdk.workflows.getSingleSkinBuyOrderInsights()`
- Public loadout discovery: `sdk.loadout.getDiscoverLoadouts()`

## Local Verification

```bash
npm test
npm run check
npm run build
```

For a publish-ready gate:

```bash
npm run release:check
```

## When To Leave The README

Use the README for overview. Switch to the docs pages when you need:

- a clearer map of resources and workflows
- transport/error behavior
- executable examples and recipes
