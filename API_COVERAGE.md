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

## Newly Discovered Live Endpoints

These routes are confirmed live as of 2026-03-07, but are not yet implemented in the SDK:

| Endpoint | Method | SDK Status | Validation Source | Notes |
|---|---|---|---|---|
| `/me/trades` | `GET` | implemented | live | returns `{ trades, count }`; supports `limit` |
| `/me/offers` | `GET` | implemented | live | returns `{ offers, count }`; supports `limit` |
| `/me/watchlist` | `GET` | implemented | live | returns `{ data, cursor }`; supports `limit` |
| `/listings/{auction_id}/bids` | `GET` | implemented | live | returns bid array for auction listings; empty array when no bids |
| `/offers` | `POST` | discovered | live | route exists; seller account received `403 sellers can only use the counter-offers endpoint` |

## Query/Behavior Surface Covered

Currently covered or typed:

1. `limit`
2. `cursor`
3. `type`
4. `market_hash_name`
5. `def_index`
6. `paint_index`
7. `category`
8. `min_float`
9. `max_float`
10. `sort_by`
11. `user_id`

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
