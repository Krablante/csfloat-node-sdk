# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

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
