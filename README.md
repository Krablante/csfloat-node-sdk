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
- state-gated trade lifecycle helpers, including seller-side `acceptSale()` and buyer-side `markTradesReceived()`
- low-level trade sync helpers for the browser-observed Steam status routes: `syncSteamNewOffer()` and `syncSteamOffers()`
- live-confirmed buy-order insight flows: inspect-based lookup and similar-order discovery
- live-confirmed support helpers around adjacent account/insight flows such as `meta.getNotary()`, `account.createNotaryToken()`, `account.createGsInspectToken()`, and `account.getSimilarBuyOrders()`
- live-confirmed auction flow pieces: bid history, max-price `placeBid()`, `deleteAutoBid()` cancellation on cheap auctions, and stable item-route bootstrap reads for `getBuyOrders()` / `getSimilar()` around active auction listings
- live-confirmed bulk listing controls: `createBulkListings()`, `updateBulkListings()`, and `deleteBulkListings()` / `unlistBulkListings()`
- live-confirmed public/account helpers around app bootstrap, schema media, checker lookup, and payments, including `meta.getApp()`, `meta.getSchemaBrowse()`, `meta.getItemExampleScreenshot()`, `meta.inspectItem()`, and `account.getPendingDeposits()`
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
| Meta | implemented | `meta.getSchema()`, `meta.getSchemaBrowse()`, `meta.getItemExampleScreenshot()`, `meta.inspectItem()`, `meta.getExchangeRates()`, `meta.getApp()`, `meta.getLocation()`, `meta.getNotary()` |
| Account | implemented | `account.getMe()`, `account.getTrades()`, `account.getTrade()`, `account.getTradeBuyerDetails()`, `account.syncSteamNewOffer()`, `account.syncSteamOffers()`, `account.acceptTrades()`, `account.markTradesReceived()`, `account.acceptTrade()`, `account.acceptSale()`, `account.cancelTrades()`, `account.cancelTrade()`, `account.cancelSale()`, `account.getOffers()`, `account.createOffer()`, `account.getOffer()`, `account.getOfferHistory()`, `account.counterOffer()`, `account.cancelOffer()`, `account.declineOffer()`, `account.getWatchlist()`, `account.getOffersTimeline()`, `account.getNotifications()`, `account.getTransactions()`, `account.exportTransactions()`, `account.getAccountStanding()`, `account.getBuyOrders()`, `account.getBuyOrdersForInspect()`, `account.getSimilarBuyOrders()`, `account.createBuyOrder()`, `account.updateBuyOrder()`, `account.deleteBuyOrder()`, `account.getAutoBids()`, `account.deleteAutoBid()`, `account.createRecommenderToken()`, `account.createNotaryToken()`, `account.createGsInspectToken()`, `account.getMaxWithdrawable()`, `account.getPendingDeposits()`, `account.getPendingWithdrawals()`, `account.deletePendingWithdrawal()`, `account.getExtensionStatus()`, `account.getMobileStatus()`, `account.updateMe()`, `account.setOffersEnabled()`, `account.setStallPublic()`, `account.setAway()`, `account.setMaxOfferDiscount()`, `account.updateTradeUrl()`, `account.updateBackground()`, `account.updateUsername()`, `account.markNotificationsRead()`, `account.setMobileStatus()` |
| Inventory | implemented | `inventory.getInventory()` |
| Public users | implemented | `users.getUser()` |
| User stall | implemented | `stall.getStall()` |
| Listings | implemented | `listings.getListings()`, `listings.getPriceList()`, `listings.iterateListings()`, `listings.getListingById()`, `listings.getBids()`, `listings.placeBid()`, `listings.getBuyOrders()`, `listings.getSimilar()`, `listings.buyNow()`, `listings.buyListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()` |
| Listing mutations | implemented | `listings.createListing()`, `listings.createBuyNowListing()`, `listings.createAuctionListing()`, `listings.createBulkListings()`, `listings.updateBulkListings()`, `listings.deleteBulkListings()`, `listings.unlistBulkListings()`, `listings.updateListing()`, `listings.deleteListing()`, `listings.unlistListing()`, `listings.addToWatchlist()`, `listings.removeFromWatchlist()`, `listings.buyNow()`, `listings.buyListing()` |
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
const featuredLoadouts = await sdk.loadout.getLoadouts({
  any_filled: true,
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
  myFavoriteLoadouts.favorites.length,
  recommendations.results[0]?.paint_index,
  stickerRecommendations.results[0]?.sticker_index,
  generatedLoadout.total_cost,
);
```

`account.syncSteamNewOffer()` and `account.syncSteamOffers()` are intentionally exposed as low-level trade sync helpers. The request shapes and `200 {"message":"successfully updated offer state"}` responses are live-confirmed, but exact side effects are still treated conservatively in the docs.

`account.getNotifications()` now accepts the live-confirmed `cursor` pagination param. Current live behavior on 2026-03-08 suggests `limit` is ignored by the backend, so the SDK intentionally keeps this surface cursor-only for now.

`account.getTransactions()` now accepts the live-confirmed `order` and `type` query params in addition to `page` and `limit`. Current UI/API validation on 2026-03-08 confirmed `order=asc|desc` plus `type=deposit|withdrawal|fine|bid_posted|trade_verified`.

`account.getOffers()` now accepts the current profile-UI pagination shape for `/me/offers`: `page` and `limit` are live-meaningful, while the older `cursor` param currently appears to be ignored by the backend and is only kept as a backward-compatible low-level field in the typed params.

`account.getBuyOrders()` now accepts the current profile-UI page contract for `/me/buy-orders`: `page`, `limit`, and a validated `order=asc|desc`. The current accounts used during 2026-03-08 validation had zero active buy orders, so the ordering effect remains documented conservatively even though the backend validates the field and the UI emits `order=desc`.

`stall.getStall()` now accepts the same practical listing-style query params currently confirmed on public stall pages, including `sort_by`, `filter`, `type`, and `min_ref_qty`.

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
  buildKeychainFilters,
  buildKeychainPatternRange,
  buildPriceRange,
  buildReferenceQuantityFilter,
  buildStickerFilters,
  CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY,
  CSFLOAT_LISTING_TYPES,
  CSFLOAT_STICKER_SEARCH_OPTIONS,
  CSFLOAT_WATCHLIST_STATES,
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
```

`sticker_option: "packages"` is live-meaningful on market searches when paired with sticker filters; for example, sticker ids `85` and `96` currently surface `EMS One 2014 Souvenir Package` listings. The lower-level `custom_sticker_id` form is also live-meaningful: on 2026-03-08, `buildStickerFilters([{ custom_sticker_id: "C10204271498" }])` returned coldzera autograph rows on the public market.

The public homepage currently reuses three stable unauthenticated market-feed variants: `Top Deals` -> `GET /listings?limit=5&min_ref_qty=20&type=buy_now&min_price=500`, `Newest Items` -> the same feed with `sort_by=most_recent`, and `Unique Items` -> the same `Newest` feed plus `filter=unique`.

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

For the full, route-by-route support picture, see [API_COVERAGE.md](./API_COVERAGE.md).

## Safety Note For Mutations

Mutation methods are part of the SDK surface, but public docs and examples should default to read-only flows whenever possible.

Important:

1. `buy_now` listing creation is the primary supported mutation path
2. auction request shape is supported in the SDK surface, while auction read/bid helpers are the more strongly live-validated part of the current auction layer
3. bulk listing routes are now live-confirmed on small private buy-now listings, but the server can still account-gate overpriced batches with a KYC/Stripe onboarding requirement
4. not every mutation variant should be treated as equally live-validated unless explicitly documented in [API_COVERAGE.md](./API_COVERAGE.md)

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

To let the shape audit create and remove a temporary low-price buy order so non-empty `buy_orders` fields can be observed:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:shapes
```

## License

[MIT](./LICENSE)
