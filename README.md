# csfloat-node-sdk

[![CI](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Live API Audit](https://img.shields.io/badge/live%20API-audited-1f883d)](./scripts/live-api-audit.mjs)
[![Coverage Matrix](https://img.shields.io/badge/API%20coverage-matrix-0a7ea4)](./API_COVERAGE.md)
[![License: MIT](https://img.shields.io/github/license/Krablante/csfloat-node-sdk)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/Krablante/csfloat-node-sdk)](https://github.com/Krablante/csfloat-node-sdk/issues)

Maintainer-grade Node.js / TypeScript SDK for the **currently known** CSFloat API surface.

`csfloat-node-sdk` is built to do two things well at the same time:

1. provide a practical TypeScript SDK for real account, market, offer, trade, listing, and buy-order workflows
2. act as a strong public coverage reference for what the CSFloat ecosystem actually exposes in practice

The project is intentionally conservative about claims. Anything called `implemented` or highlighted in the README has been wired into the SDK and validated against live traffic, browser-auth discovery, or both.

> The goal is simple: ship the strongest public TypeScript SDK and coverage reference we can responsibly validate for CSFloat.

## Why This Repository Matters

- broad live-validated CSFloat API coverage with explicit notes for `implemented`, `discovered`, `gated`, and `stale` behavior
- practical write workflows, not just read-only wrappers
- safer transport defaults with retry/backoff, typed errors, and custom transport hooks
- search and market-scan helpers for the parts of the API that people actually use
- release-quality OSS hygiene: CI, tests, changelog, contributing guide, security policy, and a maintained coverage matrix

## What’s In The Current Generation

- live-confirmed offer flows: create, counter, cancel, decline, history
- live-confirmed purchase flows: direct `buyNow`, buy-order create/update/delete, seller-side `acceptSale`
- live-confirmed auction flow pieces: bid history, max-price `placeBid()`, and `deleteAutoBid()` cancellation on cheap auctions
- public market helpers: `price-list`, wear presets, range builders, category helpers
- browser-auth discoveries promoted into SDK surface where they proved stable, including `createRecommenderToken()`
- public companion `loadout-api.csfloat.com` support via `loadout.getLoadouts()`, `loadout.getUserLoadouts()`, `loadout.getLoadout()`, `loadout.getFavoriteLoadouts()`, `loadout.createLoadout()`, `loadout.cloneLoadout()`, `loadout.updateLoadout()`, `loadout.deleteLoadout()`, `loadout.recommend()`, `loadout.recommendStickers()`, `loadout.generateRecommendations()`, `loadout.favoriteLoadout()`, and `loadout.unfavoriteLoadout()`
- normalized `CsfloatSdkError` taxonomy with `kind`, `retryable`, and `apiMessage`

## Coverage Philosophy

This repository is not a thin wrapper around a few obvious endpoints.

It is a maintainer-oriented SDK and reference project built from:

1. official documentation
2. public wrapper/source discovery
3. repeatable live API probes
4. browser-auth network inspection when the web app reveals additional stable surface

That means:

1. no pretending to cover routes we have not validated
2. no hiding uncertainty around undocumented behavior
3. no separating endpoint discovery from SDK ergonomics

See [API_COVERAGE.md](./API_COVERAGE.md) for the endpoint-by-endpoint support matrix.

## Supported Surface

| Area | Status | Methods |
|---|---|---|
| Meta | implemented | `meta.getSchema()`, `meta.getExchangeRates()`, `meta.getLocation()` |
| Account | implemented | `account.getMe()`, `account.getTrades()`, `account.acceptTrades()`, `account.acceptTrade()`, `account.acceptSale()`, `account.cancelTrades()`, `account.cancelTrade()`, `account.cancelSale()`, `account.getOffers()`, `account.createOffer()`, `account.getOffer()`, `account.getOfferHistory()`, `account.counterOffer()`, `account.cancelOffer()`, `account.declineOffer()`, `account.getWatchlist()`, `account.getOffersTimeline()`, `account.getNotifications()`, `account.getTransactions()`, `account.getAccountStanding()`, `account.getBuyOrders()`, `account.createBuyOrder()`, `account.updateBuyOrder()`, `account.deleteBuyOrder()`, `account.getAutoBids()`, `account.deleteAutoBid()`, `account.createRecommenderToken()`, `account.getMobileStatus()`, `account.updateMe()`, `account.setOffersEnabled()`, `account.setStallPublic()`, `account.setAway()`, `account.setMaxOfferDiscount()`, `account.updateTradeUrl()`, `account.updateBackground()`, `account.updateUsername()`, `account.markNotificationsRead()`, `account.setMobileStatus()` |
| Inventory | implemented | `inventory.getInventory()` |
| Public users | implemented | `users.getUser()` |
| User stall | implemented | `stall.getStall()` |
| Listings | implemented | `listings.getListings()`, `listings.getPriceList()`, `listings.iterateListings()`, `listings.getListingById()`, `listings.getBids()`, `listings.placeBid()`, `listings.getBuyOrders()`, `listings.getSimilar()`, `listings.buyNow()`, `listings.buyListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()` |
| Listing mutations | implemented | `listings.createListing()`, `listings.createBuyNowListing()`, `listings.createAuctionListing()`, `listings.updateListing()`, `listings.deleteListing()`, `listings.unlistListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()`, `listings.buyNow()`, `listings.buyListing()` |
| Loadout API | implemented | `loadout.getLoadouts()`, `loadout.getUserLoadouts()`, `loadout.getLoadout()`, `loadout.getFavoriteLoadouts()`, `loadout.createLoadout()`, `loadout.cloneLoadout()`, `loadout.updateLoadout()`, `loadout.deleteLoadout()`, `loadout.recommend()`, `loadout.recommendStickers()`, `loadout.generateRecommendations()`, `loadout.favoriteLoadout()`, `loadout.unfavoriteLoadout()` |
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
  maxRetries: 2,
  retryDelayMs: 250,
});

const rates = await sdk.meta.getExchangeRates();
const me = await sdk.account.getMe();
const trades = await sdk.account.getTrades({ limit: 5 });
const inventory = await sdk.inventory.getInventory();
const listings = await sdk.listings.getListings({
  limit: 10,
  type: "buy_now",
});
const priceList = await sdk.listings.getPriceList();
const auctionBid = await sdk.listings.placeBid("945821907352158315", {
  max_price: 9,
});
const sellerTrades = await sdk.account.getTrades({
  state: "queued,pending",
  role: "seller",
  limit: 30,
  page: 0,
});
const loadouts = await sdk.loadout.getUserLoadouts(me.user.steam_id);
const recommender = await sdk.account.createRecommenderToken();
const featuredLoadouts = await sdk.loadout.getLoadouts({
  sort_by: "favorites",
  limit: 20,
  months: 1,
});
const myFavoriteLoadouts = await sdk.loadout.getFavoriteLoadouts(
  recommender.token,
);
const recommendations = await sdk.loadout.recommend(recommender.token, {
  items: [{ type: "skin", def_index: 7, paint_index: 490 }],
  def_whitelist: [7, 9, 13],
  def_blacklist: [],
  count: 5,
});
const stickerRecommendations = await sdk.loadout.recommendStickers(
  recommender.token,
  {
    items: [{ type: "skin", def_index: 7, paint_index: 490 }],
    collection_whitelist: ["Holo"],
    count: 10,
  },
);
const generatedLoadout = await sdk.loadout.generateRecommendations(
  recommender.token,
  {
    items: [{ type: "skin", def_index: 7, paint_index: 490, wear_index: 2 }],
    def_indexes: [7, 13, 39, 9],
    faction: "t",
    max_price: 3000,
  },
);

console.log(
  rates.data.usd,
  me.user.steam_id,
  trades.count,
  sellerTrades.count,
  inventory.length,
  listings.data.length,
  priceList[0]?.market_hash_name,
  auctionBid.id,
  loadouts.loadouts.length,
  featuredLoadouts.loadouts[0]?.id,
  myFavoriteLoadouts.favorites.length,
  recommendations.results[0]?.paint_index,
  stickerRecommendations.results[0]?.sticker_index,
  generatedLoadout.total_cost,
);
```

By default, the client retries transient `GET` failures such as `429`, `502`, `503`, and `504` with bounded backoff. Unsafe requests are not retried unless you explicitly opt into `retryUnsafeRequests`.

Errors are surfaced as `CsfloatSdkError` with normalized metadata such as `status`, `code`, `apiMessage`, `kind`, and `retryable`. The current error taxonomy includes `validation`, `authentication`, `authorization`, `account_gated`, `role_gated`, `not_found`, `rate_limit`, `server`, `timeout`, and `network`.

```ts
import { CsfloatSdkError, isCsfloatSdkError } from "csfloat-node-sdk";

try {
  await sdk.listings.createBuyNowListing({
    asset_id: "123",
    price: 99,
  });
} catch (error) {
  if (isCsfloatSdkError(error) && error.kind === "account_gated") {
    console.error(error.apiMessage);
  }
}
```

If you need proxying or custom transport behavior, you can inject your own `fetch` implementation or pass a Node-compatible `dispatcher`:

```ts
import { ProxyAgent } from "undici";
import { CsfloatSdk } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
  dispatcher: new ProxyAgent("http://127.0.0.1:8080"),
});
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

Use the expanded market query surface for collection-, rarity-, or pattern-driven scans:

```ts
const expensiveCobble = await sdk.listings.getListings({
  limit: 10,
  collection: "set_cobblestone",
  rarity: 6,
  min_price: 100000,
  type: "buy_now",
});
```

Use the market helpers when you want stronger local ergonomics for category presets and validated range params:

```ts
import {
  buildFadeRange,
  buildPriceRange,
  getCategoryParams,
  withWearPreset,
} from "csfloat-node-sdk";

const scopedSearch = await sdk.listings.getListings(
  withWearPreset(
    {
      limit: 20,
      sort_by: "best_deal",
      type: "buy_now",
      ...getCategoryParams("souvenir"),
      ...buildPriceRange({ min_price: 1000, max_price: 50000 }),
      ...buildFadeRange({ min_fade: 95, max_fade: 100 }),
    },
    "FN",
  ),
);
```

`history.getGraph()` also accepts the currently observed `category` query param in addition to `paint_index`, but its exact semantics are still intentionally documented as only partially mapped.

Offer and purchase happy-paths are also live-confirmed:

```ts
const offer = await sdk.account.createOffer({
  contract_id: "947853172867730629",
  price: 2970,
});

const counter = await sdk.account.counterOffer(offer.id!, {
  price: 3000,
});

await sdk.account.cancelOffer(counter.id!);

await sdk.account.declineOffer(offer.id!);

await sdk.account.acceptSale("950524496987687389");

await sdk.listings.buyListing("807440137469430127", 3);
```

Use the schema helpers when you want to turn `/schema` into practical keyed lookups:

```ts
import {
  findSchemaPaintsByIndex,
  getSchemaCollection,
  getSchemaPaint,
} from "csfloat-node-sdk";

const schema = await sdk.meta.getSchema();

const cobble = getSchemaCollection(schema, "set_cobblestone");
const redline = getSchemaPaint(schema, 7, 282);
const allRedlineMatches = findSchemaPaintsByIndex(schema, 282);
```

For the full, route-by-route support picture, see [API_COVERAGE.md](./API_COVERAGE.md).

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

The default audit path is paced and skips the most rate-limit-prone discovery probes.

To opt into reversible live mutation checks:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:live
```

To include the riskier mutation discovery probes as well:

```bash
ALLOW_RISKY_PROBES=1 ENV_FILE=/path/to/.env npm run audit:live
```

Run the deeper response-shape audit when you want raw payload samples and unioned field paths across the currently supported live surface:

```bash
ENV_FILE=/path/to/.env npm run audit:shapes
```

To let the shape audit create and remove a temporary low-price buy order so non-empty `buy_orders` fields can be observed:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:shapes
```

## License

[MIT](./LICENSE)
