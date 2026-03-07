# API Coverage

Status legend:

1. `implemented` — available in `csfloat-node-sdk`
2. `discovered` — confirmed live, but not yet implemented in the SDK
3. `validated` — confirmed either by official docs, local source analysis, or live account checks
4. `account-gated` — endpoint exists, but live availability depends on account state or platform eligibility
5. `source` — where the endpoint evidence comes from

## Known Endpoint Surface

| Endpoint | Method | SDK Status | Validation Source | Notes |
|---|---|---|---|---|
| `/listings` | `GET` | implemented | official docs + live | supports query params |
| `/listings/{id}` | `GET` | implemented | official docs + live | single listing fetch |
| `/listings` | `POST` | implemented + account-gated | official docs + live | explicit `buy_now` supported; current live retest hit account-state gate for further listings |
| `/listings/{id}` | `PATCH` | implemented | live | update listing price |
| `/listings/{id}` | `DELETE` | implemented | live + python clone | unlist / delist behavior |
| `/users/{id}` | `GET` | implemented | python clone + live | public user profile |
| `/users/{id}/stall` | `GET` | implemented | python clone + live | public user stall |
| `/me` | `GET` | implemented | live + python clone | authenticated account |
| `/me/inventory` | `GET` | implemented | live + python clone | authenticated inventory |
| `/history/{market_hash_name}/sales` | `GET` | implemented | live | sales history |
| `/schema` | `GET` | implemented | live + public wrapper source | public item schema; both `/schema` and `/schema/` resolve |
| `/meta/exchange-rates` | `GET` | implemented | live + public wrapper source | public exchange rate map |
| `/meta/location` | `GET` | implemented | live + public wrapper source | public inferred location data |
| `/me/account-standing` | `GET` | implemented | live + public wrapper source | authenticated account standing |
| `/me/transactions` | `GET` | implemented | live + public wrapper source | returns `{ transactions, count }` |
| `/me/offers-timeline` | `GET` | implemented | live + public wrapper source | authenticated offers timeline |
| `/me/notifications/timeline` | `GET` | implemented | live + public wrapper source | authenticated notifications timeline |
| `/me/buy-orders` | `GET` | implemented | live + public wrapper source | returns `{ orders, count }` |
| `/buy-orders` | `POST` | implemented | live + public wrapper source | confirmed happy-path create using `market_hash_name` + `max_price`; `quantity` defaults to `1` when omitted |
| `/buy-orders/{id}` | `DELETE` | implemented | live + public wrapper source | confirmed happy-path delete with `successfully removed the order` |
| `/me/auto-bids` | `GET` | implemented | live + public wrapper source | authenticated auto-bids list |
| `/me/mobile/status` | `GET` | implemented | live + public wrapper source | authenticated mobile status |
| `/me` | `PATCH` | implemented | live + public wrapper source | confirmed with no-op patch for `offers_enabled`, `max_offer_discount`, `stall_public`, and `away` |
| `/me/notifications/read-receipt` | `POST` | implemented | live + public wrapper source | mark notifications read via `last_read_id` |
| `/me/mobile/status` | `POST` | implemented | live + public wrapper source | confirmed live with payload `{ "version": "8.0.0" }` |
| `/listings/{id}/buy-orders` | `GET` | implemented | live + public wrapper source | public without extra query params; authenticated callers can also use `limit` |
| `/listings/{id}/similar` | `GET` | implemented | live + public wrapper source | returns similar live listings |
| `/history/{market_hash_name}/graph` | `GET` | implemented | live + public wrapper source | requires `paint_index` query param |

## Expanded Live Endpoint Surface

These routes were confirmed live during the 2026-03-07 recon sweep:

| Endpoint | Method | SDK Status | Validation Source | Notes |
|---|---|---|---|---|
| `/me/trades` | `GET` | implemented | live | returns `{ trades, count }`; supports `limit` |
| `/me/offers` | `GET` | implemented | live | returns `{ offers, count }`; supports `limit` |
| `/me/watchlist` | `GET` | implemented | live | returns `{ data, cursor }`; supports `limit` |
| `/listings?limit=40&min_ref_qty=20` | `GET` | discovered | live + frontend network | special unauthenticated public feed shape used by public pages; general search params still require auth |
| `/listings?filter=sticker_combos` | `GET` | discovered | live + browser UI + auth API | UI label `Sticker Combos`; requires auth |
| `/listings?filter=unique` | `GET` | discovered | live + browser UI + auth API | UI label `Unique Items`; requires auth |
| `/listings/{auction_id}/bids` | `GET` | implemented | live | returns bid array for auction listings; empty array when no bids |
| `/offers` | `POST` | discovered | live | route exists; seller account received `403 sellers can only use the counter-offers endpoint` |
| `/buy-orders` | `POST` | discovered | live + public wrapper source | invalid payload returned validation error, confirming route existence |
| `/buy-orders/{id}` | `DELETE` | discovered | live + public wrapper source | invalid order id returned `unknown buy order` |
| `/listings/buy` | `POST` | discovered | live + public wrapper source | invalid contract ids returned existence-confirming error |
| `/me/notifications/read-receipt` | `POST` | discovered | live + public wrapper source | invalid read marker returned validation error |
| `/trades/bulk/accept` | `POST` | discovered | live + public wrapper source | invalid ids returned validation error |
| `/offers/{id}` | `DELETE` | discovered | live | invalid offer id still reached cancel flow and returned `failed to cancel offer` |
| `/me/verify-sms` | `POST` | discovered | live + public wrapper source | invalid phone number returned Twilio validation error |
| `/offers/{offerId}/history` | `GET` | discovered | live + public wrapper source | invalid offer id returned existence-confirming error |
| `/trades/steam-status/new-offer` | `POST` | discovered | live + public wrapper source | invalid payload still reached annotated-offer validation |
| `/trades/steam-status/offer` | `POST` | discovered | live + public wrapper source | accepted empty `sent_offers` update and returned success |
| `/me` with `trade_url` PATCH field | `PATCH` | discovered | live + public wrapper source | invalid payload returned `missing partner id or token in trade url`, confirming field-level validation for `trade_url` |

## Likely Stale Or Wrapper-Only Routes

These routes appeared in public wrappers, but live probing on 2026-03-07 did not confirm them:

| Endpoint | Method | Live Result | Notes |
|---|---|---|---|
| `/listings/sell` | `POST` | `404` | likely stale wrapper surface |
| `/listings/{id}/bit` | `POST` | `404` | likely stale wrapper surface |
| `/me/trades/bulk/cancel` | `POST` | `404` | likely outdated path |
| `/listings/{id}/sales` | `GET` | `404` | wrapper surface not confirmed live |
| `/account-standing` | `GET` | `400 invalid resource` | stale path; live route is `/me/account-standing` |

## Query/Behavior Surface Covered

Currently covered or typed:

1. `limit`
2. `cursor`
3. `type`
4. `filter`
5. `source`
6. `market_hash_name`
7. `def_index`
8. `paint_index`
9. `category`
10. `min_float`
11. `max_float`
12. `sort_by`
13. `user_id`

Live-confirmed search behaviors:

1. `sort_by` accepts:
   - `lowest_price`
   - `highest_price`
   - `most_recent`
   - `expires_soon`
   - `lowest_float`
   - `highest_float`
   - `best_deal`
   - `highest_discount`
   - `float_rank`
   - `num_bids`
2. invalid `sort_by` returns `404`
3. `filter=sticker_combos` and `filter=unique` are both live
4. `filter` values are derived from browser UI labels:
   - `Sticker Combos` -> `sticker_combos`
   - `Unique Items` -> `unique`
5. `source` is live and affects result ordering / inclusion, but its exact enum semantics are not yet fully mapped

## Listing Creation Surface

Current supported request shapes:

1. `buy_now`
   - `asset_id`
   - `price`
   - `type`
   - `private`
   - `description`
   - `max_offer_discount`
2. `auction`
   - `asset_id`
   - `reserve_price`
   - `duration_days`
   - `type`
   - `private`
   - `description`

Important:

1. `buy_now` create flow is live-validated
2. `auction` request shape is supported from known API surface, but should be treated as not-yet-live-validated by this repository until explicitly tested
3. `POST /listings` should not be treated as universally available for every account state; a live retest on 2026-03-07 returned code `134` with a Stripe onboarding requirement for further listings

## Current Account-State Notes

Live retesting on 2026-03-07 confirmed:

1. `PATCH /listings/{id}` still works and was verified with `+1` then revert on a real listing
2. `POST /listings` still exists, but the current account hit `400 code 134` with message `You need to fully onboard with Stripe for payouts to list further items`
3. Because of that gate, this repository should distinguish between:
   - endpoint existence
   - live behavior on a specific account
   - unconditional public availability

## Auth Notes

Current live probing indicates:

1. public routes include:
   - `/schema`
   - `/listings?limit=40&min_ref_qty=20`
   - `/listings/{id}`
   - `/listings/{id}/buy-orders` without extra query params
   - `/users/{id}`
   - `/users/{id}/stall`
   - `/history/.../sales`
   - `/history/.../graph`
   - `/meta/exchange-rates`
   - `/meta/location`
   - `/listings/{auction_id}/bids`
   - `/listings/{id}/similar`
2. authenticated routes include:
   - `/me*`
   - general `/listings` search with normal query params
   - `/listings/{id}/buy-orders` when using auth-only query params such as `limit`
   - mutation routes such as `/buy-orders`, `/offers`, `/listings/buy`

## Repeatable Live Audit

This repository includes a repeatable audit script:

```bash
ENV_FILE=/path/to/.env npm run audit:live
```

To opt into reversible live mutation checks:

```bash
ALLOW_LIVE_MUTATIONS=1 ENV_FILE=/path/to/.env npm run audit:live
```

## Claims This Repository Does Not Make

This repository does **not** claim:

1. support for unknown private endpoints
2. complete coverage of any surface not documented, source-inspected, or live-validated
3. live validation of every mutation variant

## Release-Ready Claim

The honest claim for public release should be:

`csfloat-node-sdk covers the currently known CSFloat API surface that is documented, source-discovered, or live-validated.`

Stronger but still honest positioning:

`csfloat-node-sdk aims to be one of the most comprehensive public maps of the currently accessible CSFloat API surface, while clearly separating implemented, discovered, live-validated, stale, and account-gated behavior.`
