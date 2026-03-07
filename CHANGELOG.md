# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added

1. `account.createOffer()` for buyer-side offer creation via `POST /offers`
2. `account.counterOffer()` for seller-side counter offers via `POST /offers/{id}/counter-offer`
3. `account.cancelOffer()` for offer-thread cancellation via `DELETE /offers/{id}`
4. `listings.buyNow()` and `listings.buyListing()` for direct `buy_now` purchases via `POST /listings/buy`

### Changed

1. expanded `API_COVERAGE.md` with live-confirmed happy-path offer and purchase contracts
2. updated `.env.example` to document optional `CSFLOAT_API_KEY_2` for controlled cross-account live testing

## [0.5.0] - 2026-03-07

### Added

1. first-class market query helpers via `market.ts`, including `getCategoryParams()`, `withWearPreset()`, `buildFloatRange()`, `buildPriceRange()`, `buildFadeRange()`, and `buildBlueRange()`
2. schema lookup helpers via `schema.ts`, including collection, rarity, weapon, paint, music kit, and highlight reel helpers
3. built-in retry/backoff support for safe requests in `CsfloatHttpClient`, with bounded retries for transient `GET` failures such as `429`, `502`, `503`, and `504`
4. deep live response-shape audit tooling via `audit:shapes`, including optional reversible buy-order sampling for non-empty `buy_orders` inspection
5. `account.getOffer(id)` and `account.getOfferHistory(id)` for direct offer fetches and historical offer-chain inspection

### Changed

1. hardened response parsing so non-JSON error bodies no longer lose status/detail context
2. expanded supported live shape coverage for authenticated account data, transaction details, offer variants, schema faction fields, and temporary buy-order create responses
3. strengthened public README examples around market helpers, schema helpers, retry behavior, and shape-audit workflows

### Notes

1. `GET /offers/{id}/history` is now confirmed live and returns the historical offer chain for a thread
2. `offers` may be empty when there are no active offers; type coverage for offer history was finalized using live buyer-offer and seller counter-offer samples

## [0.4.5] - 2026-03-07

### Added

1. `background_url` and `username` fields to `CsfloatUpdateMeRequest` — both live-confirmed accepted by `PATCH /me` (2026-03-07 research pass 2, returns `200 "user updated!"`)
2. `account.updateBackground(url)` and `account.updateUsername(name)` convenience helpers wrapping `PATCH /me`
3. `account.getOffer(id)` and `account.getOfferHistory(id)` for direct offer fetches and historical offer-chain inspection
4. `API_COVERAGE.md` expanded with new silently-ignored params: `sticker` (all forms: `ID`, `ID|slot`, `ID1,ID2`), `page`, `user_id` (standalone), `source` (all string and numeric forms on standard accounts), `is_commodity`
5. `API_COVERAGE.md` new "Confirmed Hard-Rejected Query Params" section: `type=any/normal/stattrak/souvenir` returns `400` (only `buy_now`/`auction` are valid)
6. `API_COVERAGE.md` live audit findings notes 27–35: history/graph `category` param semantics, `filter=` auth requirement (403), confirmed-dead listing subroutes, confirmed-dead `/me/*` hidden routes, confirmed-dead `/users/{id}/*` extensions, `/offers` GET method not allowed (405), dead top-level routes, and live-confirmed offer history chain fetches

### Notes on Negative Findings

The following routes and params were probed and confirmed **dead or silently-ignored** in this pass:

1. listing subroutes `offers`, `trades`, `history`, `price-history`, `buyer`, `seller`, `item` — all `404`
2. `/me/*` hidden routes (balance, preferences, settings, referrals, kyc, payment, payout, stall, bids, listings, cart, disputes, 2fa, extension, rate-limit, limits) — all `404`
3. `/users/{id}/*` extensions (offers, trades, buy-orders, statistics, reviews, reputation, watchlist, inventory) — all `404`
4. top-level routes (announcements, referrals, promotions, leaderboard, search, items, market, prices, trending, stats, buy-now) — all `400 "invalid resource"`
5. `sticker` / `sticker|slot` / multi-sticker filter — silently ignored; items returned do not have the specified sticker

## [0.4.0] - 2026-03-07


### Added

1. improved source typing via `CsfloatSource`, with IDE-friendly suggestions for `csfloat` and `p2p` while still allowing raw string and numeric forms
2. `API_COVERAGE.md` expanded with a new **Confirmed Silently-Ignored Query Params** table listing 15 `/listings` params that return `200` but produce no filtering effect
3. `API_COVERAGE.md` note that `filter` only accepts `sticker_combos` or `unique`; any other value returns `400 invalid filter value`
4. `API_COVERAGE.md` note that `category=1..4` are the confirmed meaningful values, while `category=5` behaved like an unsupported / effectively unfiltered bucket in live checks
5. `API_COVERAGE.md` note that `history/{name}/graph` works without `paint_index`, but its exact aggregation semantics are not yet fully mapped
6. live audit script expanded: `filter=sticker_combos/unique`, `source=csfloat/p2p`, `category=1..5`, and `history/graph` without `paint_index` added to repeatable checks

### Changed

1. removed the previously over-eager typed `market_hash_name` / `sort_by` additions for `GET /me/buy-orders` after live temporary orders showed no filtering or sorting effect

## [0.3.1] - 2026-03-07

### Fixed

1. added the live-confirmed `listing_id` field to `CsfloatInventoryItem` so authenticated inventory responses are typed correctly

## [0.3.0] - 2026-03-07

### Added

1. advanced market query support for `category`, `collection`, `rarity`, `min_price`, `max_price`, `paint_seed`, `music_kit_index`, `keychain_highlight_reel`, `min_fade`, `max_fade`, `min_blue`, and `max_blue`
2. live-confirmed watchlist toggle helpers for `POST/DELETE /listings/{id}/watchlist`
3. repeatable keyed audit coverage for advanced market filters and reversible watchlist validation
4. refined item and schema typing for fade details, highlight reels, collection metadata, and mixed attachment field shapes

### Changed

1. expanded `README.md` and `API_COVERAGE.md` to document the newly confirmed market-query and watchlist surface

## [0.2.0] - 2026-03-07

### Added

1. live API audit script and discovery notes for repeatable endpoint validation
2. authenticated account endpoints for trades, offers, watchlist, notifications, transactions, auto-bids, account standing, mobile status, and buy orders
3. auction bid fetching and additional listing read helpers for buy orders and similar items
4. public schema endpoint support and additional hidden-route discovery coverage
5. account write helpers for `PATCH /me`, notification read receipts, and mobile status updates
6. buy-order create/delete helpers based on live happy-path validation
7. market query support for `filter`, raw `source`, `sort_by`, and `min_ref_qty`
8. live-confirmed wear preset helpers for `FN`, `MW`, `FT`, `WW`, and `BS`

### Changed

1. strengthened README positioning to present the repository as a maintainer-grade CSFloat SDK and documentation hub
2. expanded `API_COVERAGE.md` to reflect the broader live-validated CSFloat API surface

## [0.1.0] - 2026-03-07

### Added

1. initial TypeScript package skeleton
2. typed HTTP client
3. resources for account, inventory, users, stall, listings, and history
4. listing helpers for buy-now and auction request shapes
5. cursor pagination helper
6. API coverage matrix
7. tests, build, and typecheck scripts
8. read-only example against the CSFloat API
