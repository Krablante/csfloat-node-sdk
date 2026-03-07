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
| `/offers` | `POST` | implemented | live | confirmed happy-path create on buyer account with body `{ contract_id, price }` |
| `/offers/{id}` | `GET` | implemented | live | single offer fetch by valid offer id |
| `/offers/{id}/history` | `GET` | implemented | live + public wrapper source | historical thread for the offer chain; confirmed with valid declined/counter-offer ids |
| `/offers/{id}/counter-offer` | `POST` | implemented | live | confirmed happy-path on seller account with body `{ price }` |
| `/offers/{id}` | `DELETE` | implemented | live | confirmed happy-path cancellation with response `offer canceled`; exact actor/state semantics may vary by thread state |
| `/me/notifications/timeline` | `GET` | implemented | live + public wrapper source | authenticated notifications timeline |
| `/me/buy-orders` | `GET` | implemented | live + public wrapper source | returns `{ orders, count }` |
| `/buy-orders` | `POST` | implemented | live + public wrapper source | confirmed happy-path create using `market_hash_name` + `max_price`; `quantity` defaults to `1` when omitted |
| `/buy-orders/{id}` | `PATCH` | implemented | live | confirmed happy-path update with body `{ max_price }` |
| `/buy-orders/{id}` | `DELETE` | implemented | live + public wrapper source | confirmed happy-path delete with `successfully removed the order` |
| `/me/auto-bids` | `GET` | implemented | live + public wrapper source | authenticated auto-bids list |
| `/me/mobile/status` | `GET` | implemented | live + public wrapper source | authenticated mobile status |
| `/me` | `PATCH` | implemented | live + public wrapper source | confirmed with no-op patch for `offers_enabled`, `max_offer_discount`, `stall_public`, `away`, `trade_url`; **also confirmed for `background_url` and `username` (2026-03-07 research pass 2)** |
| `/me/notifications/read-receipt` | `POST` | implemented | live + public wrapper source | mark notifications read via `last_read_id` |
| `/me/mobile/status` | `POST` | implemented | live + public wrapper source | confirmed live with payload `{ "version": "8.0.0" }` |
| `/listings/{id}/buy-orders` | `GET` | implemented | live + public wrapper source | public without extra query params; authenticated callers can also use `limit` |
| `/listings/{id}/similar` | `GET` | implemented | live + public wrapper source | returns similar live listings |
| `/listings/{id}/watchlist` | `POST` | implemented | live | confirmed happy-path add with `added to watchlist` |
| `/listings/{id}/watchlist` | `DELETE` | implemented | live | confirmed happy-path remove with `removed from watchlist` |
| `/listings/buy` | `POST` | implemented | live + public wrapper source | confirmed happy-path with body `{ contract_ids: string[], total_price }` and response `all listings purchased` |
| `/history/{market_hash_name}/graph` | `GET` | implemented | live + public wrapper source | supports explicit `paint_index`; also responds when `paint_index` is omitted |

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
| `/buy-orders` | `POST` | discovered | live + public wrapper source | invalid payload returned validation error, confirming route existence |
| `/buy-orders/{id}` | `DELETE` | discovered | live + public wrapper source | invalid order id returned `unknown buy order` |
| `/me/notifications/read-receipt` | `POST` | discovered | live + public wrapper source | invalid read marker returned validation error |
| `/trades/bulk/accept` | `POST` | discovered | live + public wrapper source | invalid ids returned validation error |
| `/offers/{id}/accept` | `POST` | discovered | live | invalid offer id returned `failed to accept offer`, confirming route existence; happy-path not yet executed |
| `/me/verify-sms` | `POST` | discovered | live + public wrapper source | invalid phone number returned Twilio validation error |
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

## Confirmed Silently-Ignored Query Params

These params return `200 OK` on `/listings` but produce **no filtering effect** — probed on 2026-03-07 with targeted item comparisons:

| Param | Probed Value | Evidence |
|---|---|---|
| `has_stickers` | `true` | IDs identical to unfiltered result; sticker-less items appear |
| `has_keychains` | `true` | IDs identical to unfiltered result |
| `has_fade` | `true` | IDs identical to unfiltered result |
| `phase` | `1`, `2`, `3`, `4`, `sapphire` | All values return identical IDs; Doppler items unaffected |
| `is_stattrak` | `true`/`false` | IDs identical; items mix StatTrak and non-StatTrak — use `category=2` instead |
| `is_souvenir` | `true`/`false` | IDs identical; use `category=3` instead |
| `wear_name` | `Factory New`, etc. | IDs identical regardless of value — use `min_float`/`max_float` instead |
| `num_stickers` | `1`–`4` | IDs identical; items have different sticker counts |
| `sticker_count` | `1`–`4` | Alias for `num_stickers`; same silently-ignored behavior |
| `min_paint_seed` | `700` | Items with seed `<700` still returned |
| `max_paint_seed` | `50` | Items with seed `>50` still returned |
| `badges` | `hot`, `new`, `rare` | 200 OK but no badge-based filtering; items have no matching badge field |
| `low_rank` | `true` | IDs identical to unfiltered; not a filter |
| `has_low_rank` | `true` | IDs identical to unfiltered; same as `low_rank` |
| `quality` | `4`, `9` | IDs identical; quality values unaffected |
| `sticker` | `55`, `55\|0`, `55,73`, `9999999` | **All forms silently ignored** (2026-03-07 research pass 2): `sticker=55` returns identical IDs to baseline; items in result do NOT have sticker 55; even `sticker=9999999` returns same result set. Official docs show `ID\|POSITION?[,ID\|POSITION?...]` format but the param does not filter in practice on the API |
| `page` | `0`, `1`, `2` | All page values return identical IDs — pagination uses `cursor` exclusively |
| `user_id` | authenticated steam_id | 200 OK but seller IDs in result do not match the specified `user_id`; silently ignored |
| `source` | `1`–`5`, `csfloat`, `p2p` | All values return identical IDs; no `source` field in listing response; silently ignored on standard accounts (2026-03-07 research pass 2) |
| `is_commodity` | `true` | 200 OK but no filtering observed |

> **Note:** Items DO have `low_rank` as a field (e.g. low_rank: 41, low_rank: 4). The param does not filter on it.
> **Note:** For stattrak/souvenir/category filtering use `category` (1=normal, 2=stattrak, 3=souvenir, 4=highlight) — that IS a confirmed real filter.
> **Note:** The `sticker` param format `ID|POSITION?[,ID|POSITION?...]` appears in official docs but the endpoint silently ignores it on the live API as of 2026-03-07.

## Confirmed Hard-Rejected Query Params

These params return a non-200 error (not silently ignored):

| Param | Probed Value | Status | Notes |
|---|---|---|---|
| `type` | `any`, `normal`, `stattrak`, `souvenir` | `400` | Only `buy_now` and `auction` are valid `type` values; other strings hard-fail |

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
14. `collection`
15. `rarity`
16. `min_price`
17. `max_price`
18. `paint_seed`
19. `sticker_index`
20. `keychain_index`
21. `keychain_highlight_reel`
22. `music_kit_index`
23. `min_keychain_pattern`
24. `max_keychain_pattern`
25. `min_blue`
26. `max_blue`
27. `min_fade`
28. `max_fade`

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
3. `filter=sticker_combos` and `filter=unique` are both live; any other `filter` value returns `400 invalid filter value`
4. `filter` values are derived from browser UI labels:
   - `Sticker Combos` -> `sticker_combos`
   - `Unique Items` -> `unique`
5. wear filtering via `min_float` / `max_float` is live
6. browser wear shortcuts map like this:
   - `FN` -> `max_float=0.07`
   - `MW` -> `min_float=0.07&max_float=0.15`
   - `FT` -> `min_float=0.15&max_float=0.38`
   - `WW` -> `min_float=0.38&max_float=0.45`
   - `BS` -> `min_float=0.45`
7. `min_float` alone works
8. `max_float` alone works
9. reversed ranges such as `min_float=0.8&max_float=0.2` return an empty result set
10. invalid ranges such as `min_float < 0` or `max_float > 1` do not hard-fail; they appear to be ignored/fallbacked by the backend
11. `source` is live as both string and numeric forms: `source=csfloat`, `source=p2p`, `source=1`–`5` all return `200`; exact semantic mapping between string/numeric forms and result sets is not fully differentiated on standard accounts
12. `category` is live and maps like this:
   - `1` -> Normal
   - `2` -> StatTrak
   - `3` -> Souvenir
   - `4` -> Highlight
13. `category` is the **confirmed correct filter** for stattrak/souvenir; `is_stattrak` and `is_souvenir` params exist but are silently ignored (see Confirmed Silently-Ignored section)
14. `def_index` + `paint_index` is live and can target a specific skin family
15. `paint_seed` (exact value) is live and can narrow family results to an exact seed
16. `collection` is live; schema keys like `set_cobblestone` work
17. `rarity` is live; schema rarity values like `6` work
18. `min_price` and `max_price` are both live
19. `music_kit_index` is live and can target music kit listings directly
20. `keychain_highlight_reel` is live and can target highlight charm listings directly
21. `min_fade` / `max_fade` are live for fade-capable finishes
22. `min_blue` / `max_blue` are live for blue-percentage filtered searches
23. `sticker_index` and `keychain_index` are accepted by the API; they currently behave as index filters for sticker/charm listings themselves, not yet a documented helper for applied attachments
24. only `category=1..4` have confirmed semantics; `category=5` returned a mixed, effectively unfiltered result set on 2026-03-07 and should be treated as unsupported
25. `GET /me/buy-orders` accepts `market_hash_name` and `sort_by` without hard-failing on the current account, but temporary live orders did not show any filtering or sorting effect; these params should be treated as unconfirmed/ignored for now
26. `GET /history/{name}/graph` works **without** `paint_index`; it returns a broader series than an explicit `paint_index` query, but the exact server-side aggregation semantics are not fully mapped yet
27. `GET /history/{name}/graph` accepts a `category` query param (1=Normal, 2=StatTrak, 3=Souvenir); live probe on 2026-03-07 returned `total_count=1747` for all values of `category` but with slightly different `avg_price` values per day — this behavior suggests `category` may influence averaging, but it does not change the set of days returned; treat as weakly mappable, not a confirmed hard filter
28. `PATCH /me` accepts `background_url` and `username` as undocumented fields — both return `200 "user updated!"` (confirmed 2026-03-07 research pass 2); exact validation rules for `username` are unknown; SDK adds these as optional typed fields in `CsfloatUpdateMeRequest` with helpers `updateBackground()` and `updateUsername()`
29. `filter=sticker_combos` and `filter=unique` require authentication — unauthenticated requests return `403` (not 401); these are actively blocked, not silently ignored
30. listing subroutes `/listings/{id}/offers`, `/listings/{id}/trades`, `/listings/{id}/history`, `/listings/{id}/price-history`, `/listings/{id}/buyer`, `/listings/{id}/seller`, `/listings/{id}/item` all return `404` — none confirmed live
31. `/me/*` hidden routes probed and all return `404`: balance, preferences, settings, referrals, subscriptions, kyc, payment, payout, stall, bids, listings, cart, disputes, 2fa, extension, rate-limit, limits, offers/sent, offers/received, fees
32. all tested `/users/{id}/*` extensions return `404`: offers, trades, buy-orders, statistics, reviews, reputation, watchlist, inventory
33. `GET /offers` returns `405 Method Not Allowed` — GET is not valid on this route; `POST /offers` is the only supported method
34. top-level routes probed and all return `400 "invalid resource"`: announcements, referrals, promotions, leaderboard, search (with q=), items, market, prices, trending, stats, buy-now
35. `GET /offers/{id}` returns the current offer snapshot, while `GET /offers/{id}/history` returns the historical chain for that offer thread; this was confirmed live on 2026-03-07 with a declined buyer offer and a declined seller counter-offer
36. `POST /offers` happy-path is confirmed with body `{ contract_id, price }` on a buyer account; using `listing_id` instead of `contract_id` falls back to `failed to find contract with id '0'`
37. `POST /offers/{id}/counter-offer` happy-path is confirmed with body `{ price }` on a seller account
38. `DELETE /offers/{id}` is the confirmed close route for both buyer-side cancel and seller-side decline flows; the server still returns the generic message `{ "message": "offer canceled" }` in both cases, while the historical offer state becomes `declined`
39. `POST /listings/buy` happy-path is confirmed with body `{ contract_ids: string[], total_price }` and returns `{ "message": "all listings purchased" }`
40. `PATCH /buy-orders/{id}` happy-path is confirmed with body `{ max_price }`; `PUT` and `POST` on the same route return `405`
41. `POST /offers/{id}/accept` exists and returns `code 91: failed to accept offer` for an invalid offer id; the route is discovered, but the happy-path is intentionally not executed yet because that would complete a real purchase

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
