# API Coverage

Status legend:

1. `implemented` — available in `csfloat-node-sdk`
2. `validated` — confirmed either by official docs, local source analysis, or live account checks
3. `source` — where the endpoint evidence comes from

## Known Endpoint Surface

| Endpoint | Method | SDK Status | Validation Source | Notes |
|---|---|---|---|---|
| `/listings` | `GET` | implemented | official docs + live | supports query params |
| `/listings/{id}` | `GET` | implemented | official docs + live | single listing fetch |
| `/listings` | `POST` | implemented | official docs + live | explicit `buy_now` supported; auction request shape supported from known surface |
| `/listings/{id}` | `PATCH` | implemented | live | update listing price |
| `/listings/{id}` | `DELETE` | implemented | live + python clone | unlist / delist behavior |
| `/users/{id}` | `GET` | implemented | python clone + live | public user profile |
| `/users/{id}/stall` | `GET` | implemented | python clone + live | public user stall |
| `/me` | `GET` | implemented | live + python clone | authenticated account |
| `/me/inventory` | `GET` | implemented | live + python clone | authenticated inventory |
| `/history/{market_hash_name}/sales` | `GET` | implemented | live | sales history |

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

## Claims This Repository Does Not Make

This repository does **not** claim:

1. support for unknown private endpoints
2. complete coverage of any surface not documented, source-inspected, or live-validated
3. live validation of every mutation variant

## Release-Ready Claim

The honest claim for public release should be:

`csfloat-node-sdk covers the currently known CSFloat API surface that is documented, source-discovered, or live-validated.`
