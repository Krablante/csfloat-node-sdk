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
| `/listings/price-list` | `GET` | implemented | live | public price index; returns `{ market_hash_name, quantity, min_price }[]` |
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
| `/meta/notary` | `GET` | implemented | browser bundle + live | returns current notary availability flags such as `{ rollback:{enabled,background}, accepted:{enabled,background} }` |
| `https://loadout-api.csfloat.com/v1/user/{steam_id}/loadouts` | `GET` | implemented | browser-auth network + live | public external CSFloat loadout service; returns `{ loadouts: [...] }` |
| `https://loadout-api.csfloat.com/v1/loadout/{id}` | `GET` | implemented | browser-auth network + live | public loadout detail route; returns `{ loadout: ... }` |
| `https://loadout-api.csfloat.com/v1/loadout` | `GET` | implemented | bundle semantics + live | public/global loadout list route; confirmed `sort_by=created_at|favorites|random`; currently observed as `{ loadouts: [...] }` |
| `https://loadout-api.csfloat.com/v1/user/favorites` | `GET` | implemented | bundle semantics + live | requires `Authorization: Bearer <recommender-token>`; confirmed response shape `{ favorites:[{ added_at, loadout_id, loadout }] }` |
| `https://loadout-api.csfloat.com/v1/loadout` | `POST` | implemented | browser-auth network + live | requires `Authorization: Bearer <recommender-token>`; confirmed `201` create with body `{ name, ct, t }` and response `{ loadout: ... }` |
| `https://loadout-api.csfloat.com/v1/loadout/{id}` | `PUT` | implemented | browser-auth network + live | requires `Authorization: Bearer <recommender-token>`; confirmed `200` update with body `{ name, ct, t }` and response `{ loadout: ... }` |
| `https://loadout-api.csfloat.com/v1/loadout/{id}` | `DELETE` | implemented | browser-auth network + live | requires `Authorization: Bearer <recommender-token>`; confirmed `200 {"message":"Loadout deleted successfully"}` |
| `https://loadout-api.csfloat.com/v1/recommend` | `POST` | implemented | browser-auth network + live | requires `Authorization: Bearer <recommender-token>` from `/me/recommender-token`; confirmed skin-only request shape `{ items:[{ type:\"skin\", def_index, paint_index }], count, def_whitelist?, def_blacklist? }` and response `{ count, results:[{ def_index, paint_index, score }] }` |
| `https://loadout-api.csfloat.com/v1/recommend/stickers` | `POST` | implemented | bundle semantics + live | requires `Authorization: Bearer <recommender-token>`; confirmed request shape `{ items:[{ type:\"skin\", def_index, paint_index }], count, collection_whitelist? }` and response `{ count, results:[{ sticker_index, score }] }` |
| `https://loadout-api.csfloat.com/v1/generate` | `POST` | implemented | bundle semantics + live | requires `Authorization: Bearer <recommender-token>`; confirmed request shape `{ items:[{ type:\"skin\", def_index, paint_index, wear_index? }], def_indexes, faction, max_price? }` and response `{ remaining_budget, total_cost, results:[{ def_index, recommendations:[{ def_index, paint_index, wear_index, price, score, locked? }] }] }` |
| `https://loadout-api.csfloat.com/v1/loadout/{id}/favorite` | `POST` | implemented | bundle semantics + live | requires `Authorization: Bearer <recommender-token>`; returns `{"loadout":{"social_stats":{"favorites":N}},"message":"Loadout added to favorites"}` |
| `https://loadout-api.csfloat.com/v1/loadout/{id}/favorite` | `DELETE` | implemented | bundle semantics + live | requires `Authorization: Bearer <recommender-token>`; returns `{"loadout":{"social_stats":{"favorites":N}},"message":"Loadout removed from favorites"}` |
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
| `/buy-orders/similar-orders` | `POST` | implemented | browser bundle + live | safe insight route returning `{ data:[{ market_hash_name, qty, price }] }`; browser service also passes `limit` as a query param and supports both `{ market_hash_name }` and `{ expression }` bodies, though only the simple `market_hash_name` path is live-validated in the SDK today |
| `/me/auto-bids` | `GET` | implemented | live + public wrapper source | authenticated auto-bids list |
| `/me/auto-bids/{id}` | `DELETE` | implemented | browser-auth network + live | confirmed happy-path delete with `{"message":"deleted auto-bid"}` |
| `/me/recommender-token` | `POST` | implemented | live + browser-auth network | returns `{ token, expires_at }` |
| `/me/notary-token` | `POST` | implemented | browser bundle + live | returns `{ token, expires_at }` for the notary/companion flow |
| `/me/mobile/status` | `GET` | implemented | live + public wrapper source | authenticated mobile status |
| `/trades/bulk/accept` | `POST` | implemented | live + public wrapper source | confirmed happy-path on at least one seller account; current live retest on the main seller account showed that visible queued trade IDs can still return `invalid trade ids specified`, so treat this as a bulk/helper route with account-state nuance |
| `/trades/{id}/accept` | `POST` | implemented | browser bundle + live | confirmed happy-path on a real queued cross-account sale (`10` cents) from the main seller account; current live response transitioned the trade to `pending` and returned the updated `CsfloatTrade` payload |
| `/trades/bulk/cancel` | `POST` | implemented | browser bundle + live invalid probe | bundle-mapped seller-side bulk cancel route; live invalid probe with `{ trade_ids:[\"0\"] }` returned `400 invalid trade ids specified` on the correct path |
| `/trades/{id}` | `GET` | implemented | browser bundle + live | trade detail route now captured from a real queued cross-account trade; current live sample included `{ buyer, seller, contract, trade_url, trade_token, wait_for_cancel_ping, is_settlement_period }` |
| `/trades/{id}/buyer-details` | `GET` | implemented | browser bundle + live | buyer-details route now captured from a real queued cross-account trade; current live sample shape `{ steam_level, persona_name, avatar_url }` |
| `/trades/{id}` | `DELETE` | implemented | browser bundle + live invalid probe | bundle-mapped seller-side cancel route; live invalid probe on `id=0` returned `500 record not found`, confirming path/method |
| `/me` | `PATCH` | implemented | live + public wrapper source | confirmed with no-op patch for `offers_enabled`, `max_offer_discount`, `stall_public`, `away`, `trade_url`; **also confirmed for `background_url` and `username` (2026-03-07 research pass 2)** |
| `/me/notifications/read-receipt` | `POST` | implemented | live + public wrapper source | mark notifications read via `last_read_id` |
| `/me/mobile/status` | `POST` | implemented | live + public wrapper source | confirmed live with payload `{ "version": "8.0.0" }` |
| `/listings/{id}/buy-orders` | `GET` | implemented | live + public wrapper source | public without extra query params; authenticated callers can also use `limit` |
| `/listings/{id}/similar` | `GET` | implemented | live + public wrapper source | returns similar live listings |
| `/listings/{id}/bid` | `POST` | implemented | browser bundle + browser-auth network + live | auction max-price bid route; confirmed from item-page `Bid` / `Auto Bid` flow; body shape `{ max_price }`; happy-path response observed as `{ id, created_at, max_price, contract_id }` and records appear in `/me/auto-bids` |
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
| `/offers/{id}/accept` | `POST` | discovered | live | invalid offer id returned `failed to accept offer`, confirming route existence; happy-path not yet executed |
| `/buy-orders/item` | `GET` | implemented | browser bundle + live | inspect-link oriented route using query params `{ url:<inspectLink>, limit }`; live happy-path returned an array like `[{ expression, qty, price }]` |
| `/buy-orders/matching-items/floatdb` | `POST` | discovered | browser bundle + live invalid probe | route exists but currently demands float-expression semantics; plain `market_hash_name` returned `condition and rules are required for an expression` |
| `/trades/{id}/cannot-deliver` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; likely seller-side failure path, not executed happy-path due risk |
| `/trades/{id}/dispute` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; not exercised on a real trade |
| `/trades/{id}/received` | `POST` | discovered | browser bundle + live | real pending buyer-side trade returned `400 missing steam offer ID`; route and state gating are clear, but no successful live sample yet |
| `/trades/bulk/received` | `POST` | implemented | browser bundle + live | bundle-confirmed buyer flow using `{ trade_ids }`; invalid `trade_ids:["0"]` returned `400 invalid trade ids specified`, and a real pending buyer-side trade returned `400 missing steam offer ID` until a Steam offer exists |
| `/trades/{id}/rollback` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; semantics still unmapped |
| `/trades/{id}/manual-verification` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; semantics still unmapped |
| `/trades/{id}/rollback-verify` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; semantics still unmapped |
| `/trades/{id}/report-error` | `POST` | discovered | browser bundle + live invalid probe | invalid `id=0` returned `500 record not found`; likely support/reporting path |
| `/trades/notary` | `POST` | discovered | browser bundle + live invalid probe | empty payload returned `400 payload is required`; exact contract still unmapped |
| `/me/verify-sms` | `POST` | discovered | live + public wrapper source | invalid phone number returned Twilio validation error |
| `/trades/steam-status/new-offer` | `POST` | discovered | live + public wrapper source | accepted string-form `offer_id` payloads and returned success even for `"0"`; exact side effects still unmapped |
| `/trades/steam-status/offer` | `POST` | discovered | live + public wrapper source | accepted `{ sent_offers: [] }` and `{ trade_id, sent_offers: [] }` with success; empty sync produced no observed trade-state change |
| `/me` with `trade_url` PATCH field | `PATCH` | discovered | live + public wrapper source | invalid payload returned `missing partner id or token in trade url`, confirming field-level validation for `trade_url` |
## Likely Stale Or Wrapper-Only Routes

These routes appeared in public wrappers, but live probing on 2026-03-07 did not confirm them:

| Endpoint | Method | Live Result | Notes |
|---|---|---|---|
| `/listings/sell` | `POST` | `404` | likely stale wrapper surface |
| `/listings/{id}/bit` | `POST` | `404` | likely stale wrapper surface |
| `/me/trades/bulk/cancel` | `POST` | `404` | outdated wrapper path; browser bundle and live invalid probe confirm the real route is `/trades/bulk/cancel` |
| `/listings/{id}/sales` | `GET` | `404` | wrapper surface not confirmed live |
| `/account-standing` | `GET` | `400 invalid resource` | stale path; live route is `/me/account-standing` |
| `/me/payments/stripe/connect` | `GET` | `404` | stale withdraw-route fetch still observed in browser-auth flow |

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
35. browser-auth auction detail flow confirmed that the `history` button maps to `GET /listings/{id}/bids`, while both `Bid` and `Auto Bid` converge on the same max-price route `POST /listings/{id}/bid`
36. `POST /listings/{id}/bid` is a stable happy-path route on cheap auctions; live API tests with `{ "max_price": 9 }`, `{ "max_price": 15 }`, and `{ "max_price": 17 }` created bid records `{ id, created_at, max_price, contract_id }` that immediately appeared in `GET /me/auto-bids`
37. repeated `POST /listings/{id}/bid` behaves as replacement/update semantics for a listing-level auto-bid: the previous entry disappears from `GET /me/auto-bids` and a new record with a new `id` becomes active
38. browser-auth modal state after a live bid shows `Your Max Bid: ...` and a `Remove` affordance; clicking it revealed the actual cancel route `DELETE /me/auto-bids/{id}` via browser-auth network capture
39. direct guesses `DELETE /auto-bids/{id}` and `DELETE /listings/{id}/bid` both returned `405`; the correct delete path is user-scoped under `/me/auto-bids/{id}`
35. `GET /offers/{id}` returns the current offer snapshot, while `GET /offers/{id}/history` returns the historical chain for that offer thread; this was confirmed live on 2026-03-07 with a declined buyer offer and a declined seller counter-offer
36. `POST /offers` happy-path is confirmed with body `{ contract_id, price }` on a buyer account; using `listing_id` instead of `contract_id` falls back to `failed to find contract with id '0'`
37. `POST /offers/{id}/counter-offer` happy-path is confirmed with body `{ price }` on a seller account
38. `DELETE /offers/{id}` is the confirmed close route for both buyer-side cancel and seller-side decline flows; the server still returns the generic message `{ "message": "offer canceled" }` in both cases, while the historical offer state becomes `declined`
39. `POST /listings/buy` happy-path is confirmed with body `{ contract_ids: string[], total_price }` and returns `{ "message": "all listings purchased" }`
40. `PATCH /buy-orders/{id}` happy-path is confirmed with body `{ max_price }`; `PUT` and `POST` on the same route return `405`
41. `POST /offers/{id}/accept` exists and returns `code 91: failed to accept offer` for an invalid offer id; the route is discovered, but the happy-path is intentionally not executed yet because that would complete a real purchase
42. `POST /trades/bulk/accept` is the confirmed `accept sale` route for queued seller trades; on a real `$0.05` queued sale it returned `{ data: [trade] }`, transitioned the trade from `queued` to `pending`, and populated `accepted_at`, `trade_url`, `trade_token`, and `steam_offer` timing fields
43. `GET /listings/price-list` is a public market-wide price index that returned `24653` entries during the 2026-03-07 live check; each entry currently exposes `market_hash_name`, `quantity`, and `min_price`
44. currently observed query params on `/listings/price-list` such as `market_hash_name` and `limit` appear to be silently ignored; exact filtering/pagination semantics are not yet mapped
45. `POST /trades/steam-status/new-offer` appears to key off a string `offer_id` field, not `trade_id`; `{ offer_id: "0" }` returned success while `{ trade_id: "0" }` returned `invalid offer id format`
46. `POST /trades/steam-status/offer` accepts `sent_offers` and optional `trade_id` payloads, but an empty-array sync produced no observed state change on the current pending trade, so it remains discovered-only
47. browser-auth discovery on `/profile/trades` showed that the UI uses two concrete trade queries: `/me/trades?state=queued,pending&limit=5000` for active seller-side work and `/me/trades?role=seller&state=failed,cancelled,verified&limit=30&page=0` for history
48. browser-auth discovery on `/profile/offers` uses `/me/offers-timeline?limit=40` plus direct `/offers/{id}/history` fetches for the selected thread
49. browser-auth discovery on `/stall/me` triggers `POST /me/recommender-token`, which returns `{ token, expires_at }`, and also calls the external public route `https://loadout-api.csfloat.com/v1/user/{steam_id}/loadouts`
50. browser-auth discovery on `/loadout/overview` and `/loadout/{id}` confirmed the public companion routes `https://loadout-api.csfloat.com/v1/user/{steam_id}/loadouts` and `https://loadout-api.csfloat.com/v1/loadout/{id}`
51. `POST https://loadout-api.csfloat.com/v1/recommend` requires `Authorization: Bearer <recommender-token>`; a valid live skin request on 2026-03-08 was `{ "items":[{ "type":"skin", "def_index":7, "paint_index":490 }], "count":5 }` and returned `{ "count":5, "results":[{ "def_index", "paint_index", "score" }, ...] }`
52. `def_whitelist` and `def_blacklist` are accepted optional arrays on `/v1/recommend`; a live request with `def_whitelist:[7]` returned only weapon `def_index=7` results
53. sticker-style recommendation requests are currently unsupported; live probes with `{ "items":[{ "type":"sticker", "sticker_index":3 }], "count":5 }` and `{ "type":"sticker", "sticker_index":55 }` both returned `400 {"error":"Item 1 unsupported type 'sticker'"}`
54. `GET https://loadout-api.csfloat.com/v1/loadout` is the public/global list route; `sort_by=created_at`, `sort_by=favorites`, and `sort_by=random` are all live and return different orderings
55. `POST https://loadout-api.csfloat.com/v1/loadout/{id}/favorite` and `DELETE https://loadout-api.csfloat.com/v1/loadout/{id}/favorite` both require the same recommender bearer token family; a live toggle on 2026-03-08 returned `{"message":"Loadout added to favorites"}` and `{"message":"Loadout removed from favorites"}`
56. `mode` and `page` on `GET /v1/loadout` currently look ignored in public probes: `mode=created`, `mode=favorites`, `mode=bogus`, `page=0`, and `page=1` all returned the same first-page ids during the 2026-03-08 check
57. invalid `sort_by` on `GET /v1/loadout` hard-fails with `400 {"error":"sort_by must be \"favorites\", \"random\", or \"created_at\""}`; older UI-style `date-desc` is not accepted by the companion API
58. `POST https://loadout-api.csfloat.com/v1/loadout` is a stable bearer-token create route; a live request on 2026-03-08 with `{ "name":"SDK Temp ...", "ct":{ "is_filled": false }, "t":{ "is_filled": false } }` returned `201` and a full `{ "loadout": ... }` payload
59. `PUT https://loadout-api.csfloat.com/v1/loadout/{id}` is the stable update route; a live request on 2026-03-08 with `{ "name":"... Updated", "ct":{ "is_filled": false }, "t":{ "is_filled": false } }` returned `200` and persisted the renamed loadout
60. `DELETE https://loadout-api.csfloat.com/v1/loadout/{id}` is the stable delete route; a live request on 2026-03-08 returned `200 {"message":"Loadout deleted successfully"}`
61. negative method checks on the companion API: `PUT /v1/loadout` and `PATCH /v1/loadout/{id}` both returned `405`, so create/update should be modeled only as `POST /v1/loadout` and `PUT /v1/loadout/{id}`
62. live loadout item refs can include more than `def_index`: current public list/detail payloads also expose `paint_index`, `wear_index`, `isLocked`, `stat_trak`, and `stickers`
63. `GET https://loadout-api.csfloat.com/v1/user/favorites` requires the same recommender bearer token family; a live favorite/unfavorite cycle on 2026-03-08 returned `{ favorites:[{ added_at, loadout_id, loadout }] }` and correctly included the toggled loadout
64. `GET https://loadout-api.csfloat.com/v1/loadout` also supports browser-observed discover params `limit`, `months`, `def_index`, and `paint_index`; live checks on 2026-03-08 showed `months=1` changes the top ids under `sort_by=favorites`, and `def_index=7&paint_index=490` narrows the result set to AK-47 | Wasteland Rebel themed loadouts
65. `any_filled` is bundle-observed on `GET /v1/loadout` and accepted by the companion API, but a top-page live probe on 2026-03-08 returned the same first ids as the baseline `sort_by=favorites` query; treat this param as only weakly mapped for now
66. `POST https://loadout-api.csfloat.com/v1/recommend/stickers` is live and safe: `{ "items":[{ "type":"skin", "def_index":7, "paint_index":490 }], "count":10, "collection_whitelist":["Holo"] }` returned `200` with `{ "results":[{ "sticker_index", "score" }, ...] }`
67. `POST https://loadout-api.csfloat.com/v1/generate` is live and returns slot-level recommendations; a safe request on 2026-03-08 with `{ "items":[{ "type":"skin", "def_index":7, "paint_index":490, "wear_index":2 }], "def_indexes":[7,13,39,9], "faction":"t", "max_price":3000 }` returned `200` with `{ "remaining_budget":30, "total_cost":2970, "results":[...] }`
68. `POST /v1/generate` hard-validates faction and budget: mismatched `def_indexes` can return `ct-only` / `t-only` errors, and too-small `max_price` can return `Locked items cost (...) exceeds budget (...)`

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
