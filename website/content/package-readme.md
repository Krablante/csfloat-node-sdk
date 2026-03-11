# csfloat-node-sdk

[![npm version](https://img.shields.io/npm/v/csfloat-node-sdk?logo=npm&label=npm)](https://www.npmjs.com/package/csfloat-node-sdk)
[![CI](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Krablante/csfloat-node-sdk/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Live API Audit](https://img.shields.io/badge/live%20API-audited-1f883d)](https://github.com/Krablante/csfloat-node-sdk/blob/main/scripts/live-api-audit.mjs)
[![Coverage Matrix](https://img.shields.io/badge/API%20coverage-matrix-0a7ea4)](/docs/api-coverage)
[![License: MIT](https://img.shields.io/github/license/Krablante/csfloat-node-sdk)](https://github.com/Krablante/csfloat-node-sdk/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/Krablante/csfloat-node-sdk)](https://github.com/Krablante/csfloat-node-sdk/issues)

The strongest public Node.js / TypeScript SDK for the **currently known** CSFloat surface that we can responsibly validate today.

`csfloat-node-sdk` is built to do two things well at the same time:

1. provide a practical TypeScript SDK for real account, market, offer, trade, listing, and buy-order workflows
2. act as a strong public coverage reference for what the CSFloat ecosystem actually exposes in practice

The project is intentionally conservative about claims. Anything called `implemented` or highlighted in the README has been wired into the SDK and validated against live traffic, browser-auth discovery, or both.

> The goal is simple: be the SDK you reach for first if you want serious CSFloat automation instead of a thin wrapper.
>
> Install from npm: [`csfloat-node-sdk@0.9.4`](https://www.npmjs.com/package/csfloat-node-sdk)

## Documentation

The docs set now aims to cover the full public runtime surface of the package, not just the quick-start path.

If you want the fastest path through the SDK, start here:

1. [Documentation Hub](/docs)
2. [Getting Started](/docs/getting-started)
3. [Resources, Workflows, And Surface Map](/docs/resources-and-workflows)
4. [Resource Reference](/docs/resource-reference)
5. [Helpers, Builders, And Constants](/docs/helpers-and-builders)
6. [Write Flows And Payloads](/docs/write-flows-and-payloads)
7. [Workflows And CLI](/docs/workflows-and-cli)
8. [Transport, Errors, And Metadata](/docs/transport-and-errors)
9. [Examples And Recipes](/docs/examples-and-recipes)
10. [Stability And Coverage](/docs/stability-and-coverage)
11. [API Coverage Matrix](/docs/api-coverage)

These Markdown docs ship in the npm tarball as well, so npm users are not forced onto a separate site just to understand the SDK.

## Why Choose This SDK

If you want the broadest public CSFloat TypeScript surface with honest live validation, this repository is built to be the default choice.

What it tries to beat:

1. thin wrappers that expose a few obvious endpoints but stop where the practical workflows begin
2. generated-feeling SDKs with weak docs and no clear evidence that the trickier routes were ever exercised
3. libraries that make you re-assemble the same market, watchlist, buy-order, and loadout flows yourself

What you get here instead:

1. live-validated endpoint coverage and a public [API_COVERAGE.md](/docs/api-coverage) matrix
2. practical write workflows, not just read-only browsing
3. workflow helpers, builder helpers, examples, CLI commands, and safer transport defaults for bots
4. honest notes for gated, partial, and weakly mapped surfaces instead of inflated claims

## Why This Repository Matters

- broad live-validated CSFloat API coverage with explicit notes for `implemented`, `discovered`, `gated`, and `stale` behavior
- practical write workflows, not just read-only wrappers
- safer transport defaults with retry/backoff, typed errors, opt-in response metadata, and custom transport hooks
- optional client-side pacing via `minRequestDelayMs` for safer bot/runtime usage
- search and market-scan helpers for the parts of the API that people actually use
- workflow helpers and a small CLI for the most common read-heavy tasks
- release-quality OSS hygiene: CI, tests, changelog, contributing guide, security policy, and a maintained coverage matrix

## Who This Is For

This SDK is optimized for:

1. bot authors who need safer defaults and less glue code
2. dashboard and analytics developers who want stable typed payloads
3. serious market scanners who need public feed helpers, iteration helpers, and buy-order tooling
4. maintainers who care whether claims are actually backed by live probes

## What’s In The Current Generation

- live-confirmed offer flows: create, counter, cancel, decline, history, plus a low-level `acceptOffer()` helper for the browser-observed accept route
- live-confirmed purchase flows: direct `buyNow`, buy-order create/update/delete, seller-side `acceptSale`
- state-gated trade lifecycle helpers, including seller-side `acceptSale()`, buyer-side `markTradesReceived()`, and low-level single-trade helpers such as `markTradeReceived()`, `cannotDeliverTrade()`, and `rollbackTrade()`
- low-level trade sync helpers for the browser-observed Steam status routes: `syncSteamNewOffer()` and `syncSteamOffers()`, with optional asset-annotation payloads on the new-offer route
- low-level account verification helpers for `verifyEmail()` and `verifySms()`
- live-confirmed buy-order insight flows: inspect-based lookup and similar-order discovery
- live-confirmed buy-order expression workflows via `account.createBuyOrder({ expression, ... })`, `account.getSimilarBuyOrders({ expression }, ...)`, and composable builder helpers
- workflow-first helpers via `sdk.workflows` for public feed snapshots, account workspace snapshots, and single-skin buy-order insights
- live-confirmed support helpers around adjacent account/insight flows such as `meta.getNotary()`, `account.createNotaryToken()`, `account.createGsInspectToken()`, and `account.getSimilarBuyOrders()`
- live-confirmed auction flow pieces: bid history, max-price `placeBid()`, `deleteAutoBid()` cancellation on cheap auctions, and stable item-route bootstrap reads for `getBuyOrders()` / `getSimilar()` around active auction listings
- live-confirmed bulk listing controls: `createBulkListings()`, `updateBulkListings()`, and `deleteBulkListings()` / `unlistBulkListings()`
- live-confirmed public/account helpers around app bootstrap, schema media, checker lookup, and payments, including `meta.getApp()`, `meta.getSchemaBrowse()`, `meta.getItemExampleScreenshot()`, `meta.inspectItem()`, and `account.getPendingDeposits()`
- public market helpers: `price-list`, wear presets, range builders, category helpers
- browser-auth discoveries promoted into SDK surface where they proved stable, including `createRecommenderToken()`
- opt-in low-level response metadata via `client.getWithMetadata()` / `postWithMetadata()` / `patchWithMetadata()` / `putWithMetadata()` / `deleteWithMetadata()` for callers that need rate-limit visibility without changing existing method signatures
- public companion `loadout-api.csfloat.com` support via `loadout.getLoadouts()`, `loadout.getDiscoverLoadouts()`, `loadout.getSkinLoadouts()`, `loadout.getUserLoadouts()`, `loadout.getLoadout()`, `loadout.getFavoriteLoadouts()`, `loadout.createLoadout()`, `loadout.cloneLoadout()`, `loadout.updateLoadout()`, `loadout.deleteLoadout()`, `loadout.recommend()`, `loadout.recommendForSkin()`, `loadout.recommendStickers()`, `loadout.recommendStickersForSkin()`, `loadout.generateRecommendations()`, `loadout.favoriteLoadout()`, and `loadout.unfavoriteLoadout()`
- normalized `CsfloatSdkError` taxonomy with `kind`, `retryable`, and `apiMessage`
- publishable CLI commands via `feeds`, `workspace`, and `buy-order-similar`

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

The package metadata is also intentionally tuned for actual use: publishable examples ship in the npm tarball, `sideEffects` is marked `false`, and `prepublishOnly` now runs the full local `release:check` gate before publish.

See [API_COVERAGE.md](/docs/api-coverage) for the endpoint-by-endpoint support matrix.

## Supported Surface

| Area | Status | Methods |
|---|---|---|
| Meta | implemented | `meta.getSchema()`, `meta.getSchemaBrowse()`, `meta.getItemExampleScreenshot()`, `meta.inspectItem()`, `meta.getExchangeRates()`, `meta.getApp()`, `meta.getLocation()`, `meta.getNotary()` |
| Account | implemented | `account.getMe()`, `account.getTrades()`, `account.getTrade()`, `account.getTradeBuyerDetails()`, `account.cannotDeliverTrade()`, `account.disputeTrade()`, `account.syncSteamNewOffer()`, `account.syncSteamOffers()`, `account.acceptTrades()`, `account.markTradesReceived()`, `account.markTradeReceived()`, `account.acceptTrade()`, `account.acceptSale()`, `account.cancelTrades()`, `account.cancelTrade()`, `account.cancelSale()`, `account.rollbackTrade()`, `account.manualVerifyTrade()`, `account.verifyTradeRollback()`, `account.getOffers()`, `account.createOffer()`, `account.getOffer()`, `account.acceptOffer()`, `account.getOfferHistory()`, `account.counterOffer()`, `account.cancelOffer()`, `account.declineOffer()`, `account.getWatchlist()`, `account.iterateWatchlist()`, `account.getOffersTimeline()`, `account.getNotifications()`, `account.getTransactions()`, `account.exportTransactions()`, `account.getAccountStanding()`, `account.getBuyOrders()`, `account.getBuyOrdersForInspect()`, `account.getSimilarBuyOrders()`, `account.createBuyOrder()`, `account.updateBuyOrder()`, `account.deleteBuyOrder()`, `account.getAutoBids()`, `account.deleteAutoBid()`, `account.createRecommenderToken()`, `account.createNotaryToken()`, `account.createGsInspectToken()`, `account.getMaxWithdrawable()`, `account.getPendingDeposits()`, `account.getPendingWithdrawals()`, `account.deletePendingWithdrawal()`, `account.getExtensionStatus()`, `account.getMobileStatus()`, `account.verifyEmail()`, `account.verifySms()`, `account.updateMe()`, `account.setOffersEnabled()`, `account.setStallPublic()`, `account.setAway()`, `account.setMaxOfferDiscount()`, `account.updateTradeUrl()`, `account.updateBackground()`, `account.updateUsername()`, `account.markNotificationsRead()`, `account.setMobileStatus()` |
| Inventory | implemented | `inventory.getInventory()` |
| Public users | implemented | `users.getUser()` |
| User stall | implemented | `stall.getStall()`, `stall.iterateStall()` |
| Listings | implemented | `listings.getListings()`, `listings.getPriceList()`, `listings.iterateListings()`, `listings.getListingById()`, `listings.getBids()`, `listings.placeBid()`, `listings.getBuyOrders()`, `listings.getSimilar()`, `listings.buyNow()`, `listings.buyListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()` |
| Listing mutations | implemented | `listings.createListing()`, `listings.createBuyNowListing()`, `listings.createAuctionListing()`, `listings.createBulkListings()`, `listings.updateBulkListings()`, `listings.deleteBulkListings()`, `listings.unlistBulkListings()`, `listings.updateListing()`, `listings.updateListingPrice()`, `listings.updateListingDescription()`, `listings.updateListingMaxOfferDiscount()`, `listings.updateListingPrivate()`, `listings.deleteListing()`, `listings.unlistListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()`, `listings.buyNow()`, `listings.buyListing()` |
| Loadout API | implemented | `loadout.getLoadouts()`, `loadout.getDiscoverLoadouts()`, `loadout.getSkinLoadouts()`, `loadout.getUserLoadouts()`, `loadout.getLoadout()`, `loadout.getFavoriteLoadouts()`, `loadout.createLoadout()`, `loadout.cloneLoadout()`, `loadout.updateLoadout()`, `loadout.deleteLoadout()`, `loadout.recommend()`, `loadout.recommendForSkin()`, `loadout.recommendStickers()`, `loadout.recommendStickersForSkin()`, `loadout.generateRecommendations()`, `loadout.favoriteLoadout()`, `loadout.unfavoriteLoadout()` |
| History | implemented | `history.getSales()`, `history.getGraph()` |
| Workflows | implemented | `workflows.getPublicMarketFeeds()`, `workflows.getAccountWorkspace()`, `workflows.getSingleSkinBuyOrderInsights()` |
| Transport | implemented | `client.getWithMetadata()`, `client.postWithMetadata()`, `client.patchWithMetadata()`, `client.putWithMetadata()`, `client.deleteWithMetadata()` |

## Installation

The canonical package distribution is npm:

```bash
npm install csfloat-node-sdk
```

Package page:

- [`https://www.npmjs.com/package/csfloat-node-sdk`](https://www.npmjs.com/package/csfloat-node-sdk)

The GitHub repository remains the source of truth for code, issues, release notes, coverage docs, and examples.

If you want to work from source instead of the published package:

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
npm run check:node
npm run build
```

For a publish-ready local gate, run:

```bash
npm run release:check
```

Run the basic example:

```bash
npm run example:basic
```

Additional focused examples:

```bash
npm run cli:help
npm run example:buy-order
npm run example:market
npm run example:watchlist
npm run example:loadout
npm run example:workflows
```

Published/package-ready examples now cover:

1. public market page + homepage feed presets
2. authenticated watchlist iteration + public stall iteration
3. public loadout discover + single-skin recommendation flows
4. expression-backed buy-order similarity lookups
5. the higher-level workflow layer end-to-end

The package also now ships a small CLI for the most common read-heavy workflows:

```bash
npx csfloat-node-sdk help
npx csfloat-node-sdk feeds --api-key "$CSFLOAT_API_KEY"
npx csfloat-node-sdk workspace --api-key "$CSFLOAT_API_KEY"
```

If you are running from source after `npm run build`:

```bash
node dist/cli.js help
node --env-file=.env dist/cli.js feeds
node --env-file=.env dist/cli.js workspace
node --env-file=.env dist/cli.js buy-order-similar --def-index 7 --paint-index 72 --stattrak false --souvenir false
```

## Minimal Usage

Once the package is published or linked locally, the SDK can be consumed like this:

```ts
import { CsfloatSdk, type CsfloatMeResponse } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
  minRequestDelayMs: 1250,
  maxRetries: 2,
  retryDelayMs: 250,
});

const rates = await sdk.meta.getExchangeRates();
const inspected = await sdk.meta.inspectItem(
  "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198771627775A49783170345D11819840296628392577",
);
const me = await sdk.account.getMe();
const trades = await sdk.account.getTrades({ limit: 5 });
const inventory = await sdk.inventory.getInventory();
const listings = await sdk.listings.getListings({
  limit: 10,
  type: "buy_now",
});
const auctionListings = await sdk.listings.getListings({
  limit: 10,
  type: "auction",
  sort_by: "expires_soon",
});
const priceList = await sdk.listings.getPriceList();
const meWithMetadata = await sdk.client.getWithMetadata<CsfloatMeResponse>("me");
const auctionBid = await sdk.listings.placeBid("945821907352158315", {
  max_price: 9,
});
const sellerTrades = await sdk.account.getTrades({
  state: "queued,pending",
  role: "seller",
  limit: 30,
  page: 0,
});
const steamStatusPing = await sdk.account.syncSteamOffers({
  trade_id: sellerTrades.trades[0]?.id,
  sent_offers: [],
});
const recentListedWatchlist = await sdk.account.getWatchlist({
  limit: 10,
  state: "listed",
  sort_by: "most_recent",
});
const olderNotifications = await sdk.account.getNotifications({
  cursor: "949215210613375538",
});
const verifiedTransactions = await sdk.account.getTransactions({
  page: 0,
  limit: 10,
  order: "desc",
  type: "trade_verified",
});
const publicStall = await sdk.stall.getStall(me.user.steam_id, {
  limit: 20,
  sort_by: "lowest_price",
  filter: "unique",
  min_ref_qty: 20,
});
const loadouts = await sdk.loadout.getUserLoadouts(me.user.steam_id);
const recommender = await sdk.account.createRecommenderToken();
const remainingBudget = meWithMetadata.meta.rateLimit?.remaining;
const featuredLoadouts = await sdk.loadout.getDiscoverLoadouts({
  limit: 20,
  def_index: 7,
  paint_index: 490,
});
const ak47Loadouts = await sdk.loadout.getSkinLoadouts(7, 490, {
  limit: 20,
  months: 1,
});
const skinRecommendations = await sdk.loadout.recommendForSkin(
  recommender.token,
  7,
  490,
  {
    count: 5,
    def_whitelist: [7, 9, 13],
  },
);
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
  steamStatusPing.message,
  olderNotifications.data.length,
  verifiedTransactions.transactions[0]?.id,
  publicStall.total_count,
  inventory.length,
  listings.data.length,
  auctionListings.data[0]?.id,
  priceList[0]?.market_hash_name,
  auctionBid.id,
  loadouts.loadouts.length,
  featuredLoadouts.loadouts[0]?.id,
  ak47Loadouts.loadouts[0]?.id,
  skinRecommendations.results[0]?.paint_index,
  myFavoriteLoadouts.favorites.length,
  recommendations.results[0]?.paint_index,
  stickerRecommendations.results[0]?.sticker_index,
  generatedLoadout.total_cost,
);
```

`loadout.getDiscoverLoadouts()` is the higher-level helper for the current public discover contract (`sort_by=favorites&months=1&any_filled=true`), `loadout.getSkinLoadouts(defIndex, paintIndex, params?)` is the paired helper for the live-confirmed skin-scoped loadout search contract, and `loadout.recommendForSkin()` / `loadout.recommendStickersForSkin()` remove the boilerplate single-item request wrapper for the most common companion recommendation flows. If you want the raw params instead, `CSFLOAT_DISCOVER_LOADOUT_PARAMS`, `CSFLOAT_LOADOUT_SORT_OPTIONS`, `CSFLOAT_LOADOUT_FACTIONS`, `CSFLOAT_LOADOUT_MAX_LIMIT`, `CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT`, `buildLoadoutListParams()`, `buildLoadoutRecommendationRequest()`, `buildLoadoutSkinSearchParams()`, `buildSingleSkinRecommendationRequest()`, `buildSingleSkinStickerRecommendationRequest()`, `buildStickerRecommendationRequest()`, `buildGenerateLoadoutRecommendationsRequest()`, and `getDiscoverLoadoutParams()` are also exported.

```ts
import {
  buildGenerateLoadoutRecommendationsRequest,
  buildLoadoutListParams,
  buildLoadoutRecommendationRequest,
  buildLoadoutSkinSearchParams,
  buildSingleSkinRecommendationRequest,
  buildSingleSkinStickerRecommendationRequest,
  buildStickerRecommendationRequest,
  CSFLOAT_LOADOUT_FACTIONS,
  CSFLOAT_LOADOUT_MAX_LIMIT,
  CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT,
  getDiscoverLoadoutParams,
} from "csfloat-node-sdk";

const discoverLoadouts = await sdk.loadout.getLoadouts(
  getDiscoverLoadoutParams({ limit: 20 }),
);

const ak47Loadouts = await sdk.loadout.getSkinLoadouts(7, 490, {
  limit: 20,
  months: 1,
});

const validatedSkinQuery = buildLoadoutSkinSearchParams({
  def_index: 7,
  paint_index: 490,
  limit: 20,
  months: 1,
});

const cappedDiscoverQuery = buildLoadoutListParams({
  ...getDiscoverLoadoutParams(),
  limit: CSFLOAT_LOADOUT_MAX_LIMIT,
});

const validatedSkinQuery = buildLoadoutSkinSearchParams({
  def_index: 7,
  paint_index: 490,
  months: 1,
});

const validatedRecommendation = buildLoadoutRecommendationRequest({
  items: [{ type: "skin", def_index: 7, paint_index: 490 }],
  count: 5,
});

const singleSkinRecommendation = buildSingleSkinRecommendationRequest(7, 490, {
  count: 5,
});

const singleSkinStickers = buildSingleSkinStickerRecommendationRequest(7, 490, {
  count: CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT,
});

const generatedRequest = buildGenerateLoadoutRecommendationsRequest({
  items: [],
  def_indexes: [7, 13, 39, 9],
  faction: CSFLOAT_LOADOUT_FACTIONS[1],
  max_price: 3000,
});
```

`account.syncSteamNewOffer()` and `account.syncSteamOffers()` are intentionally exposed as low-level trade sync helpers. The request shapes and `200 {"message":"successfully updated offer state"}` responses are live-confirmed, but exact side effects are still treated conservatively in the docs.

`account.getNotifications()` now accepts the live-confirmed `cursor` pagination param. Current live behavior on 2026-03-08 suggests `limit` is ignored by the backend, so the SDK intentionally keeps this surface cursor-only for now.

`account.getTransactions()` now accepts the live-confirmed `order` and `type` query params in addition to `page` and `limit`. Current UI/API validation on 2026-03-08 confirmed `order=asc|desc` plus `type=deposit|withdrawal|fine|bid_posted|trade_verified`.

`account.getOffers()` now accepts the current profile-UI pagination shape for `/me/offers`: `page` and `limit` are live-meaningful, while the older `cursor` param currently appears to be ignored by the backend and is only kept as a backward-compatible low-level field in the typed params.

`account.getBuyOrders()` now accepts the current profile-UI page contract for `/me/buy-orders`: `page`, `limit`, and a validated `order=asc|desc`. The current accounts used during 2026-03-08 validation had zero active buy orders, so the ordering effect remains documented conservatively even though the backend validates the field and the UI emits `order=desc`.

The buy-order layer now also covers the expression-backed workflow that the browser/API accepts in practice. Live validation on 2026-03-08 confirmed both `POST /buy-orders` and `POST /buy-orders/similar-orders?limit=...` with an AST body like `{ expression:{ condition, rules }, max_price, quantity }`. To keep this convenient, the SDK now exports `CsfloatBuyOrderExpressionBuilder`, `buildSingleSkinBuyOrderExpression()`, `buildExpressionBuyOrderRequest()`, and `buildSingleSkinBuyOrderRequest()`:

```ts
import {
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
} from "csfloat-node-sdk";

const expression = buildSingleSkinBuyOrderExpression(7, 72, {
  stattrak: false,
  souvenir: false,
});

const request = buildSingleSkinBuyOrderRequest(7, 72, {
  max_price: 3,
  quantity: 1,
  stattrak: false,
  souvenir: false,
});

const similar = await sdk.account.getSimilarBuyOrders({ expression }, 3);
const temporaryOrder = await sdk.account.createBuyOrder(request);
await sdk.account.deleteBuyOrder(String(temporaryOrder.id));
```

The higher-level `workflows` resource sits on top of these primitives when you want multi-call task helpers instead of raw route wrappers:

```ts
const feeds = await sdk.workflows.getPublicMarketFeeds();

const workspace = await sdk.workflows.getAccountWorkspace({
  watchlist_limit: 5,
  stall_limit: 5,
});

const insights = await sdk.workflows.getSingleSkinBuyOrderInsights(7, 72, {
  stattrak: false,
  souvenir: false,
  similar_limit: 3,
  listing_limit: 3,
});
```

These helpers intentionally stay on top of already live-confirmed routes:

1. `getPublicMarketFeeds()` bundles the public `/search` bootstrap and homepage feed presets.
2. `getAccountWorkspace()` bundles `me`, watchlist, stall, offers, trades, and auto-bids into a practical account snapshot.
3. `getSingleSkinBuyOrderInsights()` builds the single-skin expression, returns a request preview, fetches similar buy orders, and loads matching listings.

`stall.getStall()` now accepts the same practical listing-style query params currently confirmed on public stall pages, including `sort_by`, `filter`, `type`, and `min_ref_qty`.

By default, the client retries transient `GET` failures such as `429`, `502`, `503`, and `504` with bounded backoff. Unsafe requests are not retried unless you explicitly opt into `retryUnsafeRequests`.

If you are building a bot or always-on scanner, `minRequestDelayMs` adds simple client-side pacing across the SDK instance and its derived companion clients:

```ts
const pacedSdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
  minRequestDelayMs: 1250,
  maxRetries: 2,
});
```

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
  buildCollectionFilter,
  buildFadeRange,
  buildKeychainFilters,
  buildKeychainPatternRange,
  buildMusicKitFilter,
  buildPaintSeedFilter,
  buildPriceRange,
  buildRarityFilter,
  buildReferenceQuantityFilter,
  buildStickerFilters,
  CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY,
  CSFLOAT_HOMEPAGE_FEED_PRESETS,
  CSFLOAT_LISTING_TYPES,
  CSFLOAT_PUBLIC_MARKET_PAGE_PARAMS,
  CSFLOAT_STICKER_SEARCH_OPTIONS,
  CSFLOAT_WATCHLIST_STATES,
  getHomepageFeedParams,
  getPublicMarketPageParams,
  getCategoryParams,
  withWearPreset,
} from "csfloat-node-sdk";

const scopedSearch = await sdk.listings.getListings(
  withWearPreset(
    {
      limit: 20,
      sort_by: "best_deal",
      type: CSFLOAT_LISTING_TYPES[0],
      ...getCategoryParams("souvenir"),
      ...buildPriceRange({ min_price: 1000, max_price: 50000 }),
      ...buildCollectionFilter({ collection: "set_cobblestone" }),
      ...buildRarityFilter({ rarity: 6 }),
      ...buildPaintSeedFilter({ paint_seed: 611 }),
      ...buildMusicKitFilter({ music_kit_index: 3 }),
      ...buildFadeRange({ min_fade: 95, max_fade: 100 }),
    },
    "FN",
  ),
);
```

Low-level applied-attachment filters can also be serialized for market/watchlist queries:

```ts
const appliedStickerSearch = await sdk.listings.getListings({
  limit: 10,
  sticker_option: CSFLOAT_STICKER_SEARCH_OPTIONS[0],
  ...buildStickerFilters([{ sticker_id: 3, slot: 1 }]),
});

const souvenirPackageSearch = await sdk.listings.getListings({
  limit: 10,
  sticker_option: CSFLOAT_STICKER_SEARCH_OPTIONS[1],
  ...buildStickerFilters([{ sticker_id: 85 }]),
});

const customStickerSearch = await sdk.listings.getListings({
  limit: 10,
  ...buildStickerFilters([{ custom_sticker_id: "C10204271498" }]),
});

const charmSearch = await sdk.listings.getListings({
  limit: 10,
  ...buildKeychainFilters([{ keychain_index: 1 }]),
});

const patternedCharmSearch = await sdk.listings.getListings({
  limit: 10,
  keychain_index: 29,
  ...buildKeychainPatternRange({ min_keychain_pattern: 0, max_keychain_pattern: 10 }),
});

const highlightCharms = await sdk.listings.getListings({
  limit: 10,
  keychain_highlight_reel: 1,
});

const musicKits = await sdk.listings.getListings({
  limit: 10,
  music_kit_index: 3,
});

const watchedStickerItems = await sdk.account.getWatchlist({
  limit: 10,
  ...buildStickerFilters([{ sticker_id: 3 }]),
});

const watchedCharmItems = await sdk.account.getWatchlist({
  limit: 10,
  ...buildKeychainFilters([{ keychain_index: 83 }]),
});

const excludeRareItems = await sdk.listings.getListings({
  limit: 20,
  ...buildReferenceQuantityFilter({
    min_ref_qty: CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY,
  }),
});

const soldWatchlist = await sdk.account.getWatchlist({
  limit: 10,
  state: CSFLOAT_WATCHLIST_STATES[1],
});
for await (const listing of sdk.account.iterateWatchlist({
  limit: 5,
  state: "listed",
})) {
  console.log(listing.id);
}
for await (const listing of sdk.stall.iterateStall(me.user.steam_id, {
  limit: 100,
  type: "buy_now",
})) {
  console.log(listing.id);
  break;
}

const publicUniqueFeed = await sdk.listings.getListings({
  ...getHomepageFeedParams("unique"),
  limit: 10,
});
const publicMarketPage = await sdk.listings.getListings(
  getPublicMarketPageParams(),
);
const samePublicMarketPage = await sdk.listings.getListings({
  ...CSFLOAT_PUBLIC_MARKET_PAGE_PARAMS,
});
```

`sticker_option: "packages"` is live-meaningful on market searches when paired with sticker filters; for example, sticker ids `85` and `96` currently surface `EMS One 2014 Souvenir Package` listings. The lower-level `custom_sticker_id` form is also live-meaningful: on 2026-03-08, `buildStickerFilters([{ custom_sticker_id: "C10204271498" }])` returned coldzera autograph rows on the public market.

The public homepage currently reuses three stable unauthenticated market-feed variants: `Top Deals` -> `GET /listings?limit=5&min_ref_qty=20&type=buy_now&min_price=500`, `Newest Items` -> the same feed with `sort_by=most_recent`, and `Unique Items` -> the same `Newest` feed plus `filter=unique`.

`getHomepageFeedParams()` and `CSFLOAT_HOMEPAGE_FEED_PRESETS` expose those current public feed contracts directly, so consumers can start from the live-backed preset and then override `limit` or other safe params as needed.

The unauthenticated `/search` page is stricter than the homepage feed toggles: the current public page bootstrap is exactly `GET /listings?limit=40&min_ref_qty=20`, and adding `sort_by`, `filter`, `type`, or `min_price` to that public baseline currently flips the route into auth-gated `403` behavior. `getPublicMarketPageParams()` and `CSFLOAT_PUBLIC_MARKET_PAGE_PARAMS` expose that exact current public page contract directly.

`account.getWatchlist()` now exposes the same practical listing-style filters currently confirmed on the watchlist UI, plus the watchlist-only `state` switch:

```ts
const soldStickerCombos = await sdk.account.getWatchlist({
  limit: 20,
  state: "sold",
  sort_by: "most_recent",
  filter: "sticker_combos",
  category: 2,
});

const discountedWatchlistAuctions = await sdk.account.getWatchlist({
  limit: 20,
  type: "auction",
  sort_by: "highest_discount",
});
```

`account.iterateWatchlist()` and `stall.iterateStall()` are also live-backed cursor helpers: current watchlist and public stall probes both produced distinct follow-up pages under successive cursors on 2026-03-08, so callers can iterate these surfaces without hand-rolling cursor loops.

`CSFLOAT_LISTING_TYPES` and `CSFLOAT_WATCHLIST_STATES` are exported for the current live-confirmed enum-like values on market/watchlist queries, so callers do not need to hardcode the common string forms.

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

For the full, route-by-route support picture, see [API_COVERAGE.md](/docs/api-coverage).

## Safety Note For Mutations

Mutation methods are part of the SDK surface, but public docs and examples should default to read-only flows whenever possible.

Important:

1. `buy_now` listing creation is the primary supported mutation path
2. auction request shape is supported in the SDK surface, while auction read/bid helpers are the more strongly live-validated part of the current auction layer
3. bulk listing routes are now live-confirmed on small private buy-now listings, but the server can still account-gate overpriced batches with a KYC/Stripe onboarding requirement
4. not every mutation variant should be treated as equally live-validated unless explicitly documented in [API_COVERAGE.md](/docs/api-coverage)

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

See [PLAN.md](https://github.com/Krablante/csfloat-node-sdk/blob/main/PLAN.md) for the more detailed roadmap and package direction.

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

The default audit path is the `core` scope: it keeps the stable account, market, watchlist, and companion checks, but skips the broad market-filter burst and stale candidate sweep that are more likely to hit listing rate limits.

To include the extended market-filter and candidate-route sweep as well:

```bash
ENV_FILE=/path/to/.env npm run audit:live:extended
```

To opt into reversible live mutation checks:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:live
```

To include the riskier mutation discovery probes as well:

```bash
ALLOW_RISKY_PROBES=1 ENV_FILE=/path/to/.env npm run audit:live
```

Both live audit scripts also accept `CSFLOAT_REQUEST_DELAY_MS` if you need to slow them down further during the same-session market work.

Run the deeper response-shape audit when you want raw payload samples and unioned field paths across the currently supported live surface:

```bash
ENV_FILE=/path/to/.env npm run audit:shapes
```

The shape audit now defaults to conservative pacing and also supports:

- `SHAPE_AUDIT_DELAY_MS`
- `SHAPE_AUDIT_RETRY_DELAY_MS`
- `SHAPE_AUDIT_INCLUDE_TOKEN_HELPERS=0`

To let the shape audit create and remove a temporary low-price buy order so non-empty `buy_orders` fields can be observed:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:shapes
```

## License

[MIT](https://github.com/Krablante/csfloat-node-sdk/blob/main/LICENSE)
