# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added

1. `meta.getApp()` for the live-confirmed `GET /meta/app` route, currently returning app bootstrap metadata such as `min_required_version`
2. `meta.getSchemaBrowse()` for the live-confirmed `GET /schema/browse` route, including typed category names like `stickers`, `keychains`, and `music kits`
3. `account.getPendingDeposits()` for the live-confirmed `GET /me/payments/pending-deposits` route
4. `listings.createBulkListings()`, `listings.updateBulkListings()`, `listings.deleteBulkListings()`, and `listings.unlistBulkListings()` for the browser-confirmed bulk listing layer under `/listings/bulk-*`
5. `account.createGsInspectToken()` for the live-confirmed `POST /me/gs-inspect-token` companion-token route
6. `meta.getItemExampleScreenshot()` for the live-confirmed authenticated `GET /schema/images/screenshot` route
7. `CsfloatWatchlistParams` / `CsfloatWatchlistState` for the live-confirmed expanded `/me/watchlist` filter surface
8. `buildStickerFilters()` and `buildKeychainFilters()` for the live-confirmed JSON-encoded applied attachment filters on market/watchlist queries
9. typed low-level `sticker_option` support on listing/watchlist query params after confirming `skins|packages` behavior on sticker-filtered searches
10. `CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY` and `buildReferenceQuantityFilter()` for the live-confirmed `min_ref_qty` listing/watchlist filter used by the `Exclude Rare Items` UI toggle
11. `CSFLOAT_STICKER_SEARCH_OPTIONS` for the current live-confirmed sticker attachment search modes (`skins` and `packages`)
12. `npm run audit:live:extended` for the heavier market-filter and candidate-route live sweep

### Changed

1. expanded `API_COVERAGE.md` with the newly confirmed `/meta/app`, `/schema/browse`, and `/me/payments/pending-deposits` surfaces
2. expanded live audit coverage to keep app meta, schema browse, and pending deposits on the repeatable safe-read path
3. expanded `API_COVERAGE.md` again with live-confirmed bulk listing workflows, including the overpricing/KYC gate on `POST /listings/bulk-list` and the current price-focused contract on `PATCH /listings/bulk-modify`
4. widened `account.getWatchlist()` from `cursor|limit` only to the currently confirmed listing-style watchlist filter surface, including typed `state`
5. documented the bundle-observed `stickers` / `keychains` query encoding and then promoted `sticker_option` from docs-only to typed support after live paired-filter probes proved meaningful behavior
6. documented that `/listings` and `/me/watchlist` currently hard-cap `limit` at `50`, and that invalid `min_ref_qty` values hard-fail with schema conversion errors
7. extended `audit:live` again so the repeatable market/watchlist checks now cover `min_ref_qty` and sticker-filtered `sticker_option=skins|packages` probes
8. expanded `audit:live` coverage again to keep the live-confirmed JSON `stickers` / `keychains` market filters on the repeatable regression path
9. documented and audited the sticker- and keychain-filtered watchlist path after confirming that `/me/watchlist?stickers=[...]` and `/me/watchlist?keychains=[...]` reuse the same JSON attachment contract
10. fixed the schema-derived live-audit probes to read `/schema` sticker/keychain maps correctly instead of treating them as arrays, and upgraded the `sticker_option=packages` regression probe to a positive market case (`sticker_id=85`)
11. slowed the default `audit:live` pacing to `1250ms` per request and added a single GET retry after `429` responses so the safe live regression pass better matches the intended market pacing
12. split `audit:live` into `core` vs `extended` scopes so the default script keeps the stable surface while `audit:live:extended` carries the more rate-limit-prone market query burst and candidate sweep
13. strengthened `/me/watchlist` live coverage with meaningful `type=auction|buy_now`, `filter=unique`, and `sort_by=highest_discount` / `sort_by=lowest_price` confirmations, and kept those checks on the core live-audit path

## [0.7.0] - 2026-03-08

### Added

1. `listings.placeBid()` for auction max-price bidding via the live-confirmed `POST /listings/{id}/bid` route
2. `account.deleteAutoBid()` for auction auto-bid cancellation via the live-confirmed `DELETE /me/auto-bids/{id}` route
3. `loadout.recommend()` for bearer-token loadout recommendations via the live-confirmed `POST https://loadout-api.csfloat.com/v1/recommend` companion route
4. `loadout.getLoadouts()`, `loadout.favoriteLoadout()`, and `loadout.unfavoriteLoadout()` for the live-confirmed public/bearer companion routes under `https://loadout-api.csfloat.com/v1/loadout`
5. `loadout.createLoadout()`, `loadout.updateLoadout()`, and `loadout.deleteLoadout()` for the live-confirmed bearer-token CRUD routes under `https://loadout-api.csfloat.com/v1/loadout`
6. `loadout.getFavoriteLoadouts()`, `loadout.recommendStickers()`, and `loadout.generateRecommendations()` for the next live-confirmed companion routes under `https://loadout-api.csfloat.com/v1`
7. `loadout.cloneLoadout()` as a safe convenience helper over the already validated `getLoadout()` + `createLoadout()` flow
8. `account.cancelTrades()`, `account.cancelTrade()`, and `account.cancelSale()` for the browser-mapped seller-side trade cancellation layer (`POST /trades/bulk/cancel` and `DELETE /trades/{id}`)
9. `account.getTrade()` and `account.getTradeBuyerDetails()` for the live-confirmed trade detail routes `GET /trades/{id}` and `GET /trades/{id}/buyer-details`
10. `account.acceptTrade()` / `account.acceptSale()` now align with the browser-confirmed single-route contract `POST /trades/{id}/accept`, while `account.acceptTrades()` remains the explicit bulk helper
11. `meta.getNotary()` and `account.createNotaryToken()` for the browser-confirmed notary companion flow
12. `account.getSimilarBuyOrders()` for the live-confirmed buy-order insight route `POST /buy-orders/similar-orders`
13. `account.getBuyOrdersForInspect()` for the inspect-link oriented `GET /buy-orders/item` route, returning direct `{ expression, qty, price }[]` rows
14. `account.markTradesReceived()` for the buyer-side bulk receipt route `POST /trades/bulk/received`
15. `account.exportTransactions()` for the live-confirmed monthly CSV export route `GET /me/transactions/export`
16. `account.getMaxWithdrawable()`, `account.getPendingWithdrawals()`, `account.deletePendingWithdrawal()`, and `account.getExtensionStatus()` for the newly validated account payout/extension routes under `/me/*`

### Changed

1. expanded coverage notes for browser-auth auction flows, including the fact that item-page `history` maps to `GET /listings/{id}/bids` and both `Bid` / `Auto Bid` converge on the same max-price bid route
2. documented that repeated `POST /listings/{id}/bid` acts as replacement/update semantics for an existing listing auto-bid
3. documented the correct auto-bid removal path `DELETE /me/auto-bids/{id}` and kept the failed delete guesses (`DELETE /auto-bids/{id}` and `DELETE /listings/{id}/bid` both returned `405`) as negative findings
4. tightened `CsfloatTrade` typing with live-observed `verified_at`, `expires_at`, and explicit state/verification-mode unions
5. expanded loadout coverage with the bearer-token `recommend` flow, including confirmed skin-only request semantics and optional `def_whitelist` / `def_blacklist` arrays
6. documented that `GET /v1/loadout` currently honors `sort_by` but appears to ignore `mode` and `page`, while invalid `sort_by` values hard-fail with a validation error
7. expanded `CsfloatLoadoutItemRef` typing with live-observed fields from list/detail payloads: `paint_index`, `wear_index`, `isLocked`, `stat_trak`, and `stickers`
8. expanded `CsfloatLoadoutListParams` with browser-observed discover params such as `limit`, `months`, `def_index`, and `paint_index`, while keeping `any_filled` documented as only weakly mapped on current live probes
9. expanded trade coverage notes with the bundle-confirmed `/trades/{id}`, `/trades/{id}/buyer-details`, `cannot-deliver`, `dispute`, `received`, `rollback`, `manual-verification`, and `rollback-verify` routes, while keeping them discovered-only until real happy-path samples appear
10. promoted `/trades/{id}` and `/trades/{id}/buyer-details` from discovered-only to implemented after capturing a real queued cross-account trade sample at 3 cents
11. clarified the accept-sale split: single-trade `POST /trades/{id}/accept` is the reliable seller-side happy-path on the main account, while `POST /trades/bulk/accept` remains live but can reject visible queued IDs on some seller states
12. expanded coverage notes for `/meta/notary`, `/me/notary-token`, `/buy-orders/item`, `/buy-orders/matching-items/floatdb`, `/trades/bulk/received`, `/trades/{id}/report-error`, and `/trades/notary`
13. refined buy-order insight coverage: `/buy-orders/item` is now promoted to implemented based on a real inspect-link happy-path, while `/buy-orders/similar-orders` now documents browser-observed `limit` and advanced-expression semantics without over-claiming SDK support for the raw expression AST
14. promoted `/trades/bulk/received` to implemented based on bundle-confirmed payload shape `{ trade_ids }` plus real buyer-side state-gated validation (`missing steam offer ID` until a Steam offer exists)

## [0.6.0] - 2026-03-08

### Added

1. `account.createOffer()` for buyer-side offer creation via `POST /offers`
2. `account.counterOffer()` for seller-side counter offers via `POST /offers/{id}/counter-offer`
3. `account.cancelOffer()` for offer-thread cancellation via `DELETE /offers/{id}`
4. `listings.buyNow()` and `listings.buyListing()` for direct `buy_now` purchases via `POST /listings/buy`
5. `fetch` injection and optional `dispatcher` support in `CsfloatHttpClient` for proxy/custom transport scenarios without adding runtime dependency bloat
6. `account.updateBuyOrder()` for direct `PATCH /buy-orders/{id}` updates using the live-confirmed `{ max_price }` contract
7. `account.declineOffer()` as an ergonomic alias for the live-confirmed `DELETE /offers/{id}` close route used by seller-side declines
8. `account.acceptTrades()`, `account.acceptTrade()`, and `account.acceptSale()` for queued seller-side sale acceptance via the live-confirmed `POST /trades/bulk/accept` route
9. `listings.getPriceList()` for the public market-wide `/listings/price-list` index
10. normalized `CsfloatSdkError` taxonomy with `kind`, `retryable`, and `apiMessage` fields plus an exported `isCsfloatSdkError()` type guard
11. `account.createRecommenderToken()` for the browser-observed `POST /me/recommender-token` flow
12. richer `account.getTrades()` typing via `CsfloatTradesParams` with support for `state`, `role`, and `page`
13. `loadout.getUserLoadouts()` and `loadout.getLoadout()` for the public `loadout-api.csfloat.com` companion API

### Changed

1. expanded `API_COVERAGE.md` with live-confirmed happy-path offer and purchase contracts
2. updated `.env.example` to document optional `CSFLOAT_API_KEY_2` for controlled cross-account live testing
3. clarified that `DELETE /offers/{id}` is the confirmed close route for both buyer cancel and seller decline flows, while `POST /offers/{id}/accept` is only discovered so far
4. expanded trade docs with the confirmed `accept sale` transition from `queued` to `pending` and the resulting `trade_url`, `trade_token`, and `steam_offer` timing fields
5. clarified that `/trades/steam-status/new-offer` and `/trades/steam-status/offer` are still discovered-only sync routes, while `/listings/price-list` is now implemented as a strongly validated public endpoint
6. hardened transport errors into stable public categories (`validation`, `authentication`, `authorization`, `account_gated`, `role_gated`, `not_found`, `rate_limit`, `server`, `timeout`, `network`)
7. expanded browser-auth coverage notes with the active/history trade query shapes, the offer timeline thread fetch pattern, the stale withdraw fetch to `/me/payments/stripe/connect`, and the external `loadout-api.csfloat.com` route used by the stall page
8. expanded browser-auth coverage again with the public loadout overview/detail routes and the discovery that `/loadout` redirects to `/loadout/overview?mode=created&sort_by=date-desc`

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
