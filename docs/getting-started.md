# Getting Started

## Runtime Requirements

- Node.js `>=20`
- a CSFloat API key for authenticated account routes
- TypeScript is optional, but the package is designed to be TypeScript-first

## Install

```bash
npm install csfloat-node-sdk
```

The package page is:

- [`https://www.npmjs.com/package/csfloat-node-sdk`](https://www.npmjs.com/package/csfloat-node-sdk)

## Configure

Create `.env` from `.env.example`:

```bash
CSFLOAT_API_KEY=your_api_key_here
```

Most public read routes still expect you to initialize the SDK with an API key, so treat the key as the normal entrypoint even if your first calls are public listings or schema reads.

## Create Your First Client

```ts
import { CsfloatSdk } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
  minRequestDelayMs: 1250,
  maxRetries: 2,
  retryDelayMs: 250,
});
```

Key `CsfloatClientOptions` you will care about first:

- `apiKey`
  Required for the normal SDK flow.
- `minRequestDelayMs`
  Opt-in client-side pacing for scanners, bots, or operators.
- `maxRetries`, `retryDelayMs`, `maxRetryDelayMs`
  Retry policy for retryable failures.
- `timeoutMs`
  Per-request timeout.
- `fetch`, `dispatcher`
  Advanced transport customization.

See [Transport, Errors, And Metadata](./transport-and-errors.md) for the full option set.

## First Useful Calls

```ts
import {
  CsfloatSdk,
  getPublicMarketPageParams,
} from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const rates = await sdk.meta.getExchangeRates();
const listings = await sdk.listings.getListings(getPublicMarketPageParams());
const me = await sdk.account.getMe();
const inventory = await sdk.inventory.getInventory();
```

## First Useful Advanced Calls

If you want a quicker win than wiring multiple calls by hand:

```ts
const feeds = await sdk.workflows.getPublicMarketFeeds({
  feed_limit: 3,
  public_page_limit: 10,
});

const workspace = await sdk.workflows.getAccountWorkspace({
  watchlist_limit: 3,
  stall_limit: 3,
});
```

If you need low-level response headers and rate-limit context:

```ts
const meWithMetadata = await sdk.client.getWithMetadata("me");

console.log(meWithMetadata.meta.status);
console.log(meWithMetadata.meta.rateLimit?.remaining);
```

## What The Package Gives You

The package root exports four major layers:

1. `CsfloatSdk`
   The normal entrypoint for application code.
2. resource helpers on `sdk.*`
   `account`, `listings`, `meta`, `loadout`, `history`, `users`, `inventory`, `stall`, `workflows`.
3. helper modules and constants
   buy-order builders, market presets, loadout helpers, schema helpers, wear helpers, pagination utilities.
4. low-level classes and errors
   `CsfloatHttpClient`, `CsfloatSdkError`, `isCsfloatSdkError`.

## Recommended First Paths

- Public market scan: `sdk.listings.getListings()` or `sdk.workflows.getPublicMarketFeeds()`
- Account dashboard snapshot: `sdk.workflows.getAccountWorkspace()`
- Buy-order insight lookup: `sdk.workflows.getSingleSkinBuyOrderInsights()`
- Public loadout discovery: `sdk.loadout.getDiscoverLoadouts()`
- Exact method-level reference: [Resource Reference](./resource-reference.md)
- Helper/preset reference: [Helpers, Builders, And Constants](./helpers-and-builders.md)
- Write payload reference: [Write Flows And Payloads](./write-flows-and-payloads.md)

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

If you want to exercise the published CLI after a build or from an installed package:

```bash
npx csfloat-node-sdk help
```

## What To Read Next

- which resource or workflow to use:
  [Resources, Workflows, And Surface Map](./resources-and-workflows.md)
- exact public methods:
  [Resource Reference](./resource-reference.md)
- helper/builders/constants:
  [Helpers, Builders, And Constants](./helpers-and-builders.md)
- write-heavy request payloads and caveats:
  [Write Flows And Payloads](./write-flows-and-payloads.md)
- transport or error behavior:
  [Transport, Errors, And Metadata](./transport-and-errors.md)
- runnable snippets and examples:
  [Examples And Recipes](./examples-and-recipes.md)
