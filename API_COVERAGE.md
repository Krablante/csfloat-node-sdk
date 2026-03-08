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
| `/listings/bulk-list` | `POST` | implemented + account-gated | browser bundle + live | confirmed happy-path on two private low-cost buy-now listings; body `{ items:[{ asset_id, price, type, private?, description?, max_offer_discount? }] }`; overpriced batches can hit seller KYC/Stripe gating |
| `/listings/bulk-modify` | `PATCH` | implemented | browser bundle + live | confirmed happy-path with body `{ modifications:[{ contract_id, price }] }`; current SDK keeps this route price-focused until broader field semantics are proven |
| `/listings/bulk-delist` | `PATCH` | implemented | browser bundle + live | confirmed happy-path with body `{ contract_ids:[...] }` and response `{ "message":"contracts delisted" }` |
| `/listings/{id}` | `PATCH` | implemented | live | update listing price |
| `/listings/{id}` | `DELETE` | implemented | live + python clone | unlist / delist behavior |
| `/users/{id}` | `GET` | implemented | python clone + live | public user profile |
| `/users/{id}/stall` | `GET` | implemented | python clone + live | public user stall; current live validation confirms meaningful listing-style params including `sort_by`, `filter`, `type`, and `min_ref_qty` |
| `/me` | `GET` | implemented | live + python clone | authenticated account; current profile `Earnings` card is derived from `user.statistics.total_sales` and `user.statistics.total_purchases` in this payload, not from a separate earnings endpoint |
| `/me/inventory` | `GET` | implemented | live + python clone | authenticated inventory |
| `/history/{market_hash_name}/sales` | `GET` | implemented | live | sales history |
| `/schema` | `GET` | implemented | live + public wrapper source | public item schema; both `/schema` and `/schema/` resolve |
| `/schema/browse` | `GET` | implemented | browser bundle + live | public grouped browse route; current live validation confirmed `type=stickers` and bundle uses lowercased category labels such as `stickers`, `keychains`, and `music kits` |
| `/schema/images/screenshot` | `GET` | implemented | browser bundle + live | authenticated example-screenshot route; current live sample returned `{ id, sides:{ playside:{path}, backside:{path} } }` for a schema-targeted item query |
| `/meta/exchange-rates` | `GET` | implemented | live + public wrapper source | public exchange rate map |
| `/meta/app` | `GET` | implemented | browser bundle + live | app bootstrap metadata; current live response returned `{ min_required_version: "9.0.0" }` |
| `/meta/location` | `GET` | implemented | live + public wrapper source | public inferred location data |
| `/meta/notary` | `GET` | implemented | browser bundle + live | returns current notary availability flags such as `{ rollback:{enabled,background}, accepted:{enabled,background} }` |
| `https://api.csfloat.com/?url={inspectLink}` | `GET` | implemented | browser tool network + live | external Float Checker companion route; currently requires `Origin: https://csfloat.com` and returns `{ iteminfo:{ defindex, paintindex, floatvalue, paintseed, full_item_name, ... } }` |
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
| `/me/transactions` | `GET` | implemented | live + public wrapper source | returns `{ transactions, count }`; current live validation confirms meaningful `page`, `limit`, `order=asc|desc`, and `type=deposit|withdrawal|fine|bid_posted|trade_verified` |
| `/me/offers-timeline` | `GET` | implemented | live + public wrapper source | authenticated offers timeline |
| `/offers` | `POST` | implemented | live | confirmed happy-path create on buyer account with body `{ contract_id, price }` |
| `/offers/{id}` | `GET` | implemented | live | single offer fetch by valid offer id |
| `/offers/{id}/history` | `GET` | implemented | live + public wrapper source | historical thread for the offer chain; confirmed with valid declined/counter-offer ids |
| `/offers/{id}/counter-offer` | `POST` | implemented | live | confirmed happy-path on seller account with body `{ price }` |
| `/offers/{id}` | `DELETE` | implemented | live | confirmed happy-path cancellation with response `offer canceled`; exact actor/state semantics may vary by thread state |
| `/me/notifications/timeline` | `GET` | implemented | live + public wrapper source | authenticated notifications timeline; current live validation confirms cursor-based pagination while `limit` appears ignored |
| `/me/buy-orders` | `GET` | implemented | live + public wrapper source | returns `{ orders, count }`; current live validation confirms `page`, `limit`, and validated `order=asc|desc`, with the current profile UI emitting `order=desc` |
| `/buy-orders` | `POST` | implemented | live + public wrapper source | confirmed happy-path create using `market_hash_name` + `max_price`; `quantity` defaults to `1` when omitted |
| `/buy-orders/{id}` | `PATCH` | implemented | live | confirmed happy-path update with body `{ max_price }` |
| `/buy-orders/{id}` | `DELETE` | implemented | live + public wrapper source | confirmed happy-path delete with `successfully removed the order` |
| `/buy-orders/similar-orders` | `POST` | implemented | browser bundle + live | safe insight route returning `{ data:[{ market_hash_name, qty, price }] }`; browser service also passes `limit` as a query param and supports both `{ market_hash_name }` and `{ expression }` bodies, though only the simple `market_hash_name` path is live-validated in the SDK today |
| `/me/auto-bids` | `GET` | implemented | live + public wrapper source | authenticated auto-bids list |
| `/me/auto-bids/{id}` | `DELETE` | implemented | browser-auth network + live | confirmed happy-path delete with `{"message":"deleted auto-bid"}` |
| `/me/recommender-token` | `POST` | implemented | live + browser-auth network | returns `{ token, expires_at }` |
| `/me/notary-token` | `POST` | implemented | browser bundle + live | returns `{ token, expires_at }` for the notary/companion flow |
| `/me/gs-inspect-token` | `POST` | implemented | browser bundle + live | returns `{ token, expires_at }` for the external `gs-api.csfloat.com` inspect/equip companion flow |
| `/me/payments/max-withdrawable` | `GET` | implemented | live + browser bundle | returns `{ max_withdrawable }` for the current account payout state |
| `/me/payments/pending-deposits` | `GET` | implemented | browser bundle + live | authenticated pending-deposit list; current live sample returned `[]`, while bundle/UI usage reads fields such as `created`, `amount`, `currency`, and `payment_method_types` |
| `/me/pending-withdrawals` | `GET` | implemented | live + browser bundle | returns the authenticated pending-withdrawal list; current live sample was an empty array |
| `/me/pending-withdrawals/{id}` | `DELETE` | implemented | live invalid probe + browser bundle | invalid probe on `id=0` returned `200` with an empty body, confirming the route/method despite the currently opaque response shape |
| `/me/extension/status` | `GET` | implemented | live + browser bundle | returns extension version/permission metadata for the authenticated account |
| `/me/mobile/status` | `GET` | implemented | live + public wrapper source | authenticated mobile status |
| `/me/transactions/export` | `GET` | implemented | live + browser bundle | returns CSV text for a full past month via `year` + `month`; current-month exports reject with `400 full month must be in the past` |
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
| `/me/offers` | `GET` | implemented | live | returns `{ offers, count }`; current live validation confirms meaningful `page` + `limit`, while legacy `cursor` appears ignored |
| `/me/watchlist` | `GET` | implemented | live + browser-auth UI | returns `{ data, cursor }`; currently confirmed with `limit`, `state`, `sort_by`, `filter`, `category`, `type`, `min_price`, `min_ref_qty`, `stickers`, `keychains`, and `sticker_option`; live-meaningful examples include `type=auction|buy_now`, `filter=unique`, and `sort_by=highest_discount|lowest_price` |
| `/listings?limit=40&min_ref_qty=20` | `GET` | discovered | live + frontend network | special unauthenticated public feed shape used by public pages; general search params still require auth |
| `/listings?limit=5&min_ref_qty=20&type=buy_now&min_price=500` | `GET` | discovered | browser UI + live | current homepage-highlight feed shape; public and stable on 2026-03-08 |
| `/listings?limit=5&sort_by=most_recent&min_ref_qty=20&type=buy_now&min_price=500` | `GET` | discovered | browser UI + live | current homepage `Newest Items` feed shape; public and stable on 2026-03-08 |
| `/listings?limit=5&sort_by=most_recent&filter=unique&min_ref_qty=20&type=buy_now&min_price=500` | `GET` | discovered | browser UI + live | current homepage `Unique Items` feed shape; public and stable on 2026-03-08 |
| `/listings?filter=sticker_combos` | `GET` | discovered | live + browser UI + auth API | UI label `Sticker Combos`; requires auth; current live probes return sticker-heavy rows |
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
| `/trades/steam-status/new-offer` | `POST` | implemented | live + public wrapper source | low-level Steam sync route keyed by string-form `{ offer_id }`; safe live probes returned `200 {"message":"successfully updated offer state"}` even for `"0"`, but business side effects remain partially unmapped |
| `/trades/steam-status/offer` | `POST` | implemented | live + public wrapper source | low-level Steam sync route accepting `{ sent_offers }` and optional `{ trade_id }`; safe live probes returned `200 {"message":"successfully updated offer state"}`, while empty-array syncs produced no observed trade-state change |
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
23. `min_keychain_pattern` / `max_keychain_pattern` are live and can further narrow charm listings when paired with `keychain_index`; on 2026-03-08, `keychain_index=29&min_keychain_pattern=0&max_keychain_pattern=10` returned a smaller `Charm | Semi-Precious` result set than the broader `0..10000` probe
24. `sticker_index` and `keychain_index` are accepted by the API; they currently behave as index filters for sticker/charm listings themselves, not yet a documented helper for applied attachments
25. only `category=1..4` have confirmed semantics; `category=5` returned a mixed, effectively unfiltered result set on 2026-03-07 and should be treated as unsupported
26. `GET /me/buy-orders` accepts `market_hash_name` and `sort_by` without hard-failing on the current account, but temporary live orders did not show any filtering or sorting effect; these params should be treated as unconfirmed/ignored for now
27. `GET /history/{name}/graph` works **without** `paint_index`; it returns a broader series than an explicit `paint_index` query, but the exact server-side aggregation semantics are not fully mapped yet
28. `GET /history/{name}/graph` accepts a `category` query param (1=Normal, 2=StatTrak, 3=Souvenir); live probe on 2026-03-07 returned `total_count=1747` for all values of `category` but with slightly different `avg_price` values per day — this behavior suggests `category` may influence averaging, but it does not change the set of days returned; treat as weakly mappable, not a confirmed hard filter
29. `PATCH /me` accepts `background_url` and `username` as undocumented fields — both return `200 "user updated!"` (confirmed 2026-03-07 research pass 2); exact validation rules for `username` are unknown; SDK adds these as optional typed fields in `CsfloatUpdateMeRequest` with helpers `updateBackground()` and `updateUsername()`
30. `filter=sticker_combos` and `filter=unique` require authentication — unauthenticated requests return `403` (not 401); these are actively blocked, not silently ignored
31. listing subroutes `/listings/{id}/offers`, `/listings/{id}/trades`, `/listings/{id}/history`, `/listings/{id}/price-history`, `/listings/{id}/buyer`, `/listings/{id}/seller`, `/listings/{id}/item` all return `404` — none confirmed live
32. `/me/*` hidden routes probed and all return `404`: balance, preferences, settings, referrals, subscriptions, kyc, payment, payout, stall, bids, listings, cart, disputes, 2fa, extension, rate-limit, limits, offers/sent, offers/received, fees
33. all tested `/users/{id}/*` extensions return `404`: offers, trades, buy-orders, statistics, reviews, reputation, watchlist, inventory
34. `GET /offers` returns `405 Method Not Allowed` — GET is not valid on this route; `POST /offers` is the only supported method
35. top-level routes probed and all return `400 "invalid resource"`: announcements, referrals, promotions, leaderboard, search (with q=), items, market, prices, trending, stats, buy-now
35. browser-auth auction detail flow confirmed that the `history` button maps to `GET /listings/{id}/bids`, while both `Bid` and `Auto Bid` converge on the same max-price route `POST /listings/{id}/bid`
36. `POST /listings/{id}/bid` is a stable happy-path route on cheap auctions; live API tests with `{ "max_price": 9 }`, `{ "max_price": 15 }`, and `{ "max_price": 17 }` created bid records `{ id, created_at, max_price, contract_id }` that immediately appeared in `GET /me/auto-bids`
37. repeated `POST /listings/{id}/bid` behaves as replacement/update semantics for a listing-level auto-bid: the previous entry disappears from `GET /me/auto-bids` and a new record with a new `id` becomes active
38. browser-auth modal state after a live bid shows `Your Max Bid: ...` and a `Remove` affordance; clicking it revealed the actual cancel route `DELETE /me/auto-bids/{id}` via browser-auth network capture
39. direct guesses `DELETE /auto-bids/{id}` and `DELETE /listings/{id}/bid` both returned `405`; the correct delete path is user-scoped under `/me/auto-bids/{id}`
40. `GET /offers/{id}` returns the current offer snapshot, while `GET /offers/{id}/history` returns the historical chain for that offer thread; this was confirmed live on 2026-03-07 with a declined buyer offer and a declined seller counter-offer
41. `POST /offers` happy-path is confirmed with body `{ contract_id, price }` on a buyer account; using `listing_id` instead of `contract_id` falls back to `failed to find contract with id '0'`
42. `POST /offers/{id}/counter-offer` happy-path is confirmed with body `{ price }` on a seller account
38. `DELETE /offers/{id}` is the confirmed close route for both buyer-side cancel and seller-side decline flows; the server still returns the generic message `{ "message": "offer canceled" }` in both cases, while the historical offer state becomes `declined`
39. `POST /listings/buy` happy-path is confirmed with body `{ contract_ids: string[], total_price }` and returns `{ "message": "all listings purchased" }`
40. `PATCH /buy-orders/{id}` happy-path is confirmed with body `{ max_price }`; `PUT` and `POST` on the same route return `405`
41. `POST /offers/{id}/accept` exists and returns `code 91: failed to accept offer` for an invalid offer id; the route is discovered, but the happy-path is intentionally not executed yet because that would complete a real purchase
42. `POST /trades/bulk/accept` is the confirmed `accept sale` route for queued seller trades; on a real `$0.05` queued sale it returned `{ data: [trade] }`, transitioned the trade from `queued` to `pending`, and populated `accepted_at`, `trade_url`, `trade_token`, and `steam_offer` timing fields
43. `GET /listings/price-list` is a public market-wide price index that returned `24653` entries during the 2026-03-07 live check; each entry currently exposes `market_hash_name`, `quantity`, and `min_price`
44. currently observed query params on `/listings/price-list` such as `market_hash_name` and `limit` appear to be silently ignored; exact filtering/pagination semantics are not yet mapped
45. `POST /trades/steam-status/new-offer` keys off a string `offer_id` field, not `trade_id`; `{ offer_id: "0" }` returned `200 {"message":"successfully updated offer state"}` while `{ trade_id: "0" }` returned `invalid offer id format`
46. `POST /trades/steam-status/offer` accepts `sent_offers` and optional `trade_id` payloads; both `{ sent_offers: [] }` and `{ trade_id, sent_offers: [] }` returned `200 {"message":"successfully updated offer state"}`, while the empty-array sync produced no observed trade-state change on the current pending trade
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
64. auction listing discovery on 2026-03-08 confirmed that `GET /listings?type=auction&sort_by=lowest_price` returns the cheap-auction frontier, including repeated `price=3` listings with `auction_details.min_next_bid=8`
65. `sort_by=num_bids` and `sort_by=expires_soon` are both live-meaningful on `type=auction` queries: `num_bids` surfaces high-activity auctions, while `expires_soon` surfaces near-expiry auctions
66. the item spotlight route `/item/{id}` currently bootstraps a stable read bundle around the selected listing: `GET /listings/{id}`, `GET /listings/{id}/buy-orders?limit=10`, `GET /listings/{id}/similar`, and `GET /history/{market_hash_name}/graph?paint_index=...`
67. `GET https://loadout-api.csfloat.com/v1/loadout` also supports browser-observed discover params `limit`, `months`, `def_index`, and `paint_index`; live checks on 2026-03-08 showed `months=1` changes the top ids under `sort_by=favorites`, and `def_index=7&paint_index=490` narrows the result set to AK-47 | Wasteland Rebel themed loadouts
68. `any_filled` is bundle-observed on `GET /v1/loadout` and accepted by the companion API, but a top-page live probe on 2026-03-08 returned the same first ids as the baseline `sort_by=favorites` query; treat this param as only weakly mapped for now
69. `POST https://loadout-api.csfloat.com/v1/recommend/stickers` is live and safe: `{ "items":[{ "type":"skin", "def_index":7, "paint_index":490 }], "count":10, "collection_whitelist":["Holo"] }` returned `200` with `{ "results":[{ "sticker_index", "score" }, ...] }`
70. `POST https://loadout-api.csfloat.com/v1/generate` is live and returns slot-level recommendations; a safe request on 2026-03-08 with `{ "items":[{ "type":"skin", "def_index":7, "paint_index":490, "wear_index":2 }], "def_indexes":[7,13,39,9], "faction":"t", "max_price":3000 }` returned `200` with `{ "remaining_budget":30, "total_cost":2970, "results":[...] }`
71. `POST /v1/generate` hard-validates faction and budget: mismatched `def_indexes` can return `ct-only` / `t-only` errors, and too-small `max_price` can return `Locked items cost (...) exceeds budget (...)`
72. `GET /meta/app` is live and currently returns a minimal bootstrap payload `{ min_required_version }`; on 2026-03-08 the value was `"9.0.0"`
73. `GET /schema/browse` is live and groups schema-adjacent browse items under `{ data:[{ type, user_visible_type, items:[...] }] }`; `type=stickers` returned tournament-era sticker buckets such as `DreamHack 2013` and `Katowice 2014`
74. the browser bundle lowercases schema browse category labels directly before calling `/schema/browse`, so the currently known query values are `rifles`, `pistols`, `smgs`, `heavy`, `knives`, `gloves`, `agents`, `containers`, `stickers`, `keychains`, `patches`, `collectibles`, and `music kits`
75. `POST /listings/bulk-list` is live on authenticated seller accounts and returns `{ data:[listing, ...] }`; on 2026-03-08 a happy-path batch of two private `Zeus x27 | Swamp DDPAT (Factory New)` listings at `$0.04` succeeded, while the same route at `$9.99` hit `400 "Listing is suspected to be overpriced. You need to complete KYC and onboard with Stripe to list this item."`
76. `PATCH /listings/bulk-modify` is live and currently confirmed with price-only updates: `{ modifications:[{ contract_id, price }] }` returned `{ data:[updated listings...] }` on the same two-listing batch
77. `PATCH /listings/bulk-modify` failure modes are already useful for validation: `{ contract_id:"0", price:3 }` returned `500 "failed to fetch listing"`, while `{ contract_id:"0", price:1 }` failed earlier at the server price floor with `422 "minimum allowed price is $0.03 USD"`
78. `PATCH /listings/bulk-delist` is live and reversible: `{ contract_ids:[...] }` returned `200 {"message":"contracts delisted"}` on the real two-listing batch, and `{ contract_ids:["0"] }` returned `500 "failed to delist contracts"`
79. `POST /me/gs-inspect-token` is live and returns the same token-style contract as other companion flows: `{ token, expires_at }`; the current browser bundle uses it to authorize external `gs-api.csfloat.com/api/v1/players/equip*` requests, while the SDK intentionally stops at the CSFloat-side token helper for now
80. `GET /schema/images/screenshot` is live behind authentication: on 2026-03-08, `def_index=7&paint_index=490&min_float=0.15&max_float=0.38` returned `{ id:"1305328935500910839", sides:{ playside:{ path:"m/.../playside.png" }, backside:{ path:"m/.../backside.png" } } }`, while the same request without auth returned `401 code=27 authorization not set`
81. the browser screenshot flow also has an external generator at `https://s-api.csfloat.com/api/v1/public/screenshot?sig=...&url=...`, but the SDK currently only exposes the CSFloat-side `/schema/images/screenshot` helper because the external path depends on item-level screenshot signatures and is better kept as a documented companion detail for now
82. browser-auth discovery on `/profile/watchlist` confirmed that the watchlist page serializes filters into URL/query params on the same listing-style surface: `Listed` -> `state=listed`, `Newest` -> `sort_by=most_recent`, `Sticker Combos` -> `filter=sticker_combos`, and `StatTrak™` -> `category=2`
83. direct authenticated live probes on 2026-03-08 confirmed that `GET /me/watchlist` accepts at least `state`, `sort_by`, `filter`, `category`, `type`, and `min_price`; `state=listed|sold|delisted` all return `200`, while `state=bogus` hard-fails with `400 code 18` and `schema: error converting value for "state". Details: invalid state`
84. current live watchlist state semantics are meaningful on the main account: `state=sold` returned only `sold` rows, `state=delisted` returned only `delisted` rows, and `sort_by=most_recent` changed the first-page ordering versus the default watchlist sort
85. current raw HTTP market-search behavior is mixed rather than uniformly public: on 2026-03-08, many explicit `/listings?...` queries with `sort_by`, `category`, `min_price`, `type`, and `filter` still returned `403 "You need to be logged in to search listings"`, but the small homepage-feed combinations documented below remained replayable without auth; unauthenticated market search should therefore be treated as a guarded surface with a limited public feed subset, not as a clean general-purpose public API contract
86. the current market/watchlist bundle serializes applied sticker filters into a JSON `stickers` query param and keychain filters into a JSON `keychains` query param; the browser helper currently emits sticker entries like `{ "i": <stickerId>, "s": <slot-1> }` or `{ "c": <customStickerId>, "s": <slot-1> }`, and keychain entries like `{ "i": <keychainIndex> }`
87. direct authenticated live probes on 2026-03-08 confirmed that `GET /listings?stickers=[...]` and `GET /listings?keychains=[...]` both return `200` and meaningfully narrow results: `stickers=[{"i":3}]` surfaced items whose payloads included matching applied sticker entries like `{ stickerId: 3, slot: 1 }`, `stickers=[{"c":"C10204271498"}]` surfaced coldzera autograph rows via the lower-level `custom_sticker_id` contract, and `keychains=[{"i":1}]` surfaced items whose payloads included matching keychain entries like `{ stickerId: 1, slot: 0, pattern, ... }`
88. `sticker_option=skins|packages` is live-meaningful when paired with JSON `stickers=[...]` filters: on 2026-03-08, `GET /listings?stickers=[{"i":3}]&sticker_option=skins` preserved the applied-skin result set, while `GET /listings?stickers=[{"i":85}]&sticker_option=packages` and `GET /listings?stickers=[{"i":96}]&sticker_option=packages` both returned `EMS One 2014 Souvenir Package`; the current SDK exposes `sticker_option` as a low-level typed param, but package-side density still depends on the specific sticker id
89. direct authenticated live probes on 2026-03-08 confirmed that `GET /me/watchlist` reuses the same JSON attachment-filter contract as `/listings`: `stickers=[{"i":3}]` returned the matching watched `Souvenir M4A1-S | VariCamo (Field-Tested)` row with an applied `{ stickerId: 3, slot: 3 }` payload, and a targeted `keychains=[{"i":83}]` probe returned the matching watched `Souvenir AUG | Spalted Wood (Field-Tested)` row with an applied `{ stickerId: 83, slot: 0, highlight_reel: 807, ... }` payload; `sticker_option=packages` on watchlist is still only weakly mapped because the current account-side probe for `stickers=[{"i":85}]` returned `200` with an empty set rather than a watched package row
90. `min_ref_qty` is live-meaningful on both `/listings` and `/me/watchlist`: the browser `Exclude Rare Items` toggle maps to `min_ref_qty=20`, higher floors such as `100` further narrow results, and invalid values like `min_ref_qty=bogus` hard-fail with `400 code 18 schema: error converting value for "min_ref_qty"`
91. current live limit ceilings on 2026-03-08 are `50` for both `/listings` and `/me/watchlist`: `limit=50` returned `200`, while `limit=51` and above returned `400 {"code":4,"message":"limit is too high"}`
92. the watchlist page currently reuses meaningful market-style sort and listing-mode params beyond `most_recent`: on 2026-03-08, the default page ordering matched `sort_by=best_deal`, `sort_by=highest_discount` reordered the first rows versus default, `sort_by=lowest_price` surfaced the cheapest watched rows first, `type=auction` returned only auction rows, `type=buy_now` returned buy-now rows, and `filter=unique` also returned a distinct watchlist slice
93. the `/checker` page uses an external companion route rather than `/api/v1`: on 2026-03-08, browser-auth network and direct live replay confirmed `GET https://api.csfloat.com/?url=<inspectLink>` with `Origin: https://csfloat.com` returning `{ iteminfo:{ origin, quality, rarity, paintseed, defindex, paintindex, floatvalue, min, max, weapon_type, item_name, rarity_name, quality_name, wear_name, full_item_name, s, a, d, m } }`; the same request without a valid `Origin` header returned `400 {"error":"Invalid Origin"}`
94. browser-auth discovery on `/sell` did not reveal a new sell-only backend surface on 2026-03-08; the page currently bootstraps with the already-covered `GET /me`, `GET /schema`, `GET /meta/location`, `GET /meta/exchange-rates`, and `GET /me/inventory` routes
95. browser-auth discovery on `/stall/me` likewise stayed on the already-covered surface on 2026-03-08: `POST /me/recommender-token`, `GET /users/{steam_id}/stall?limit=40`, and `GET https://loadout-api.csfloat.com/v1/user/{steam_id}/loadouts`; no additional self-stall-only backend route was promoted from this pass
96. direct public live probes on 2026-03-08 confirmed that `GET /users/{id}/stall` accepts meaningful listing-style params beyond `limit` and `cursor`: `sort_by=lowest_price|highest_discount|most_recent` all changed the first-page ordering, `filter=unique` narrowed the public stall from `263` to `164` rows, `type=buy_now` returned the active rows while `type=auction` returned an empty set on the current stall, and `min_ref_qty=20` narrowed the total count from `263` to `244`
97. the public stall route also accepts attachment-style listing filters: on 2026-03-08, `keychains=[{"i":83}]` returned the matching `Souvenir Zeus x27 | Charged Up (Battle-Scarred)` row, while `filter=sticker_combos` returned `200` with an empty set on the current stall; invalid `filter=bogus` hard-failed with `400 invalid filter value`, while invalid `sort_by=bogus` returned `404 the given resource could not be found`
98. unlike `/listings` and `/me/watchlist`, the current public stall route is not capped at `50` rows per page: on 2026-03-08, `limit=51` returned `200`, and the live audit already uses `GET /users/{id}/stall?limit=500&type=buy_now` successfully for mutation-safe inventory reconciliation
99. `GET /me/notifications/timeline` currently supports cursor pagination but not meaningful limit control: on 2026-03-08, replaying the response cursor returned an older page with a different first `notification_id`, while both `limit=1` and `limit=5` returned the same `42` rows as the default request; `cursor=0` simply fell back to the current first page rather than failing validation
100. `GET /me/transactions` is broader than the original SDK typing suggested: on 2026-03-08, browser-auth discovery and direct API probes confirmed meaningful `order=asc|desc` plus `type=deposit|withdrawal|fine|bid_posted|trade_verified`; invalid `type=bogus` hard-failed with `400 "you are not authorized to filter by this transaction type"`, and invalid `order=bogus` hard-failed with `400 "bogus is not a valid order"`
101. `GET /me/offers` is currently page-oriented rather than cursor-oriented on the live profile UI: on 2026-03-08, `/profile` used `GET /me/offers?page=0&limit=10`, direct API probes confirmed `page=0` and `page=1` are accepted, `limit=1` narrows the result set, invalid `page=bogus` hard-fails with `400 "failed to deserialize query params"`, and `cursor=abc` appears ignored on the current backend
102. `GET /me/buy-orders` is also page-oriented on the live profile UI: on 2026-03-08, `/profile` used `GET /me/buy-orders?page=0&limit=10&order=desc`, direct API probes confirmed `order=asc|desc` is accepted, invalid `order=bogus` hard-fails with `400 "\"bogus\" is not a valid order"`, and invalid `page=bogus` hard-fails with `400 schema: error converting value for "page"`; the current accounts had zero active orders, so the actual asc/desc ordering difference remains only weakly mapped
103. current authenticated market probes on 2026-03-08 showed that `filter=sticker_combos` and `filter=unique` are not cosmetic aliases: `filter=sticker_combos` returned sticker-heavy rows like `Glock-18 | Twilight Galaxy (Factory New)` and `AK-47 | X-Ray (Factory New)` with `4-5` applied attachments, while `filter=unique` returned a distinct knife/glove-heavy slice led by `★ StatTrak™ Bayonet | Blue Steel (Factory New)` and `★ Sport Gloves | Superconductor (Factory New)`
104. the current public homepage bootstraps a highlighted buy-now feed via `GET /listings?limit=5&min_ref_qty=20&type=buy_now&min_price=500`; browser replay and direct unauthenticated live probes both returned `200` on 2026-03-08, so this param combination is now tracked as a stable public page feed rather than just an incidental listing query
105. the current cart/checkout UI does not map to a dedicated CSFloat `/cart` or `/checkout` API route: the live bundle on 2026-03-08 stores cart state under local storage key `checkout_cart_contracts`, refreshes entries through existing listing detail reads, and the item-card `buyNow()` path still delegates to the already-covered purchase flow (`purchaseContracts(...)` / `POST /listings/buy`); no separate cart backend endpoint was promoted from this pass
106. browser-observed homepage radio states are currently backed by three distinct public feed queries on 2026-03-08: `Top Deals` -> `GET /listings?limit=5&min_ref_qty=20&type=buy_now&min_price=500`, `Newest Items` -> the same route plus `sort_by=most_recent`, and `Unique Items` -> the same `Newest` route plus `filter=unique`; all three replayed directly without auth and returned `200`

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
4. `POST /listings/bulk-list` currently reuses the same per-item payload shapes under `{ items:[...] }`; the repository has live-validated the `buy_now` batch path, but not yet a real auction batch happy-path

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

The default script now runs the `core` scope, which keeps the stable read/mutation regression path and skips the heavier market-filter burst.

To include the extended market/candidate sweep as well:

```bash
ENV_FILE=/path/to/.env npm run audit:live:extended
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
