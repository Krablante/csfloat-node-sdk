# Write Flows And Payloads

This page covers the part of the SDK that usually causes the most hesitation:

- what the mutation-heavy payloads actually look like
- which fields are required
- which flows are safe and stable versus low-level or state-gated

Use this page together with [Resource Reference](./resource-reference.md) and [Stability And Coverage](./stability-and-coverage.md).

## Safety First

Unlike the shipped `examples/*.mjs`, the examples on this page are intentionally docs-only.

They can create, modify, buy, accept, favorite, or cancel real marketplace state.

Before using them against a real account:

1. verify account state and role assumptions
2. start with the smallest possible price, quantity, or batch
3. handle `CsfloatSdkError` and inspect `kind`, `status`, and `apiMessage`
4. prefer preview builders where they exist, especially for buy-order expressions

## Offers

### `account.createOffer()`

Request type: `CreateOfferRequest`

| Field | Required | Meaning |
|---|---|---|
| `contract_id` | yes | target listing contract id |
| `price` | yes | offered price |

Minimal payload:

```ts
await sdk.account.createOffer({
  contract_id: "945821907352158315",
  price: 1_250,
});
```

### `account.counterOffer()`

Request type: `CounterOfferRequest`

| Field | Required | Meaning |
|---|---|---|
| `price` | yes | counter-offer price |

Minimal payload:

```ts
await sdk.account.counterOffer("offer-id", {
  price: 1_400,
});
```

### Notes

- `acceptOffer()` is intentionally low-level even though it is implemented.
- offer acceptance and counter behavior can be actor- and state-sensitive.
- use `getOffer()` and `getOfferHistory()` to inspect the thread before mutating it.

## Trades And Steam Sync

### Bulk Trade Requests

Request type: `AcceptTradesRequest`

| Field | Required | Meaning |
|---|---|---|
| `trade_ids` | yes | one or more trade ids |

Examples:

```ts
await sdk.account.acceptTrades({
  trade_ids: ["trade-1", "trade-2"],
});

await sdk.account.cancelTrades({
  trade_ids: ["trade-1", "trade-2"],
});

await sdk.account.markTradesReceived({
  trade_ids: ["trade-1"],
});
```

### Low-Level Steam Sync Helpers

`syncSteamNewOffer()` request shape:

| Field | Required | Meaning |
|---|---|---|
| `offer_id` | yes | Steam offer id as string |
| `given_asset_ids` | no | optional asset ids the seller gave in that offer |
| `received_asset_ids` | no | optional asset ids the seller received in that offer |

`syncSteamOffers()` request shape:

| Field | Required | Meaning |
|---|---|---|
| `sent_offers` | yes | current set of sent offers, usually an array |
| `trade_id` | no | related CSFloat trade id when available |

Examples:

```ts
await sdk.account.syncSteamNewOffer({
  offer_id: "1234567890123456789",
  given_asset_ids: ["asset-1"],
  received_asset_ids: ["asset-2"],
});

await sdk.account.syncSteamOffers({
  trade_id: "trade-1",
  sent_offers: [],
});
```

### Notes

- trade accept/cancel/received flows are real but state-gated
- bulk accept can reject ids that look visible but are not actionable in the current account state
- the Steam sync helpers are useful operator tools, but they are still lower-level than the average app flow
- single-trade low-level helpers such as `cannotDeliverTrade()`, `disputeTrade()`, `markTradeReceived()`, `rollbackTrade()`, `manualVerifyTrade()`, and `verifyTradeRollback()` now exist for the browser-confirmed trade lifecycle edges; treat them as advanced/state-gated operations rather than generic happy-path methods

## Buy Orders

There are two supported creation shapes.

### Market-Hash Creation

Request type: `CsfloatCreateMarketHashBuyOrderRequest`

| Field | Required | Meaning |
|---|---|---|
| `market_hash_name` | yes | item market hash name |
| `max_price` | yes | max purchase price |
| `quantity` | no | quantity, defaults to API behavior when omitted |

Example:

```ts
await sdk.account.createBuyOrder({
  market_hash_name: "AK-47 | Redline (Field-Tested)",
  max_price: 1_500,
  quantity: 1,
});
```

### Expression Creation

Request type: `CsfloatCreateExpressionBuyOrderRequest`

| Field | Required | Meaning |
|---|---|---|
| `expression` | yes | validated buy-order expression AST |
| `max_price` | yes | max purchase price |
| `quantity` | no | quantity |

Example:

```ts
import { buildSingleSkinBuyOrderExpression } from "csfloat-node-sdk";

const expression = buildSingleSkinBuyOrderExpression(7, 72, {
  stattrak: false,
  souvenir: false,
  min_float: 0.01,
  max_float: 0.07,
});

await sdk.account.createBuyOrder({
  expression,
  max_price: 3,
  quantity: 1,
});
```

### Update And Similar-Order Requests

`updateBuyOrder()` request type: `UpdateBuyOrderRequest`

| Field | Required | Meaning |
|---|---|---|
| `max_price` | yes | new max price |

`getSimilarBuyOrders()` request supports one of:

- `{ market_hash_name }`
- `{ expression }`

Examples:

```ts
await sdk.account.updateBuyOrder("order-id", {
  max_price: 1_700,
});

await sdk.account.getSimilarBuyOrders({
  market_hash_name: "AK-47 | Redline (Field-Tested)",
}, 5);
```

### Notes

- use the builders in [Helpers, Builders, And Constants](./helpers-and-builders.md) instead of hand-writing large expression objects
- for risky or complex expression work, build a preview request first and inspect similar orders before creating a live order

## Listings And Bids

### Buy-Now Listing Creation

Request type: `CreateBuyNowListingRequest`

| Field | Required | Meaning |
|---|---|---|
| `asset_id` | yes | inventory asset id |
| `price` | yes | listing price |
| `private` | no | private listing toggle |
| `description` | no | listing description, max `32` characters |
| `max_offer_discount` | no | listing-level max offer discount |
| `type` | no | optional, defaults to `"buy_now"` |

Example:

```ts
await sdk.listings.createBuyNowListing({
  asset_id: "1234567890",
  price: 2_500,
  private: true,
  description: "clean",
  max_offer_discount: 5,
});
```

### Auction Listing Creation

Request type: `CreateAuctionListingRequest`

| Field | Required | Meaning |
|---|---|---|
| `type` | yes | must be `"auction"` |
| `asset_id` | yes | inventory asset id |
| `reserve_price` | yes | reserve price |
| `duration_days` | yes | one of `1`, `3`, `5`, `7`, `14` |
| `private` | no | private listing toggle |
| `description` | no | description |

Example:

```ts
await sdk.listings.createAuctionListing({
  type: "auction",
  asset_id: "1234567890",
  reserve_price: 2_000,
  duration_days: 3,
  private: false,
});
```

### Listing Updates

Request type: `UpdateListingRequest`

| Field | Required | Meaning |
|---|---|---|
| `price` | no | new price |
| `description` | no | new description |
| `max_offer_discount` | no | new max-offer discount |
| `private` | no | toggle privacy |

Example:

```ts
await sdk.listings.updateListing("listing-id", {
  price: 2_700,
  description: "updated",
  max_offer_discount: 5,
  private: true,
});
```

### Bulk Listing Updates

Request type: `UpdateBulkListingRequest`

| Field | Required | Meaning |
|---|---|---|
| `contract_id` | yes | listing contract id |
| `price` | yes | replacement price |

Example:

```ts
await sdk.listings.updateBulkListings([
  { contract_id: "contract-1", price: 1_500 },
  { contract_id: "contract-2", price: 2_000 },
]);
```

### Buy-Now And Bids

`buyNow()` request type: `BuyNowRequest`

| Field | Required | Meaning |
|---|---|---|
| `contract_ids` | yes | one or more contract ids |
| `total_price` | yes | expected total purchase price |

`placeBid()` request type: `PlaceBidRequest`

| Field | Required | Meaning |
|---|---|---|
| `max_price` | yes | bid ceiling |

Examples:

```ts
await sdk.listings.buyNow({
  contract_ids: ["contract-1", "contract-2"],
  total_price: 4_500,
});

await sdk.listings.placeBid("listing-id", {
  max_price: 1_800,
});
```

### Notes

- listing creation can be account-gated
- bulk listing flows are useful but can hit seller or eligibility gates
- `buyNow()` is a real side-effecting purchase flow, so verify totals before calling it

## Account Preference Updates

Low-level request type: `CsfloatUpdateMeRequest`

| Field | Meaning |
|---|---|
| `max_offer_discount` | account-level max offer discount |
| `offers_enabled` | enable or disable offers |
| `stall_public` | toggle public stall visibility |
| `away` | toggle away status |
| `trade_url` | account trade URL |
| `background_url` | profile background image URL |
| `username` | display username |

Example:

```ts
await sdk.account.updateMe({
  offers_enabled: true,
  stall_public: true,
  max_offer_discount: 5,
  trade_url: "https://steamcommunity.com/tradeoffer/new/?partner=123&token=abc",
});
```

Equivalent convenience helpers:

- `setOffersEnabled()`
- `setStallPublic()`
- `setAway()`
- `setMaxOfferDiscount()`
- `updateTradeUrl()`
- `updateBackground()`
- `updateUsername()`

## Email And Phone Verification

Low-level request types:

- `CsfloatVerifyEmailRequest`
- `CsfloatVerifySmsRequest`

Field shapes:

| Field | Meaning |
|---|---|
| `email` | target email address for the verification flow |
| `phone_number` | target phone number for the verification flow |
| `token` | optional code/token used to confirm a previously requested verification |

Examples:

```ts
await sdk.account.verifyEmail("user@example.com");

await sdk.account.verifyEmail("user@example.com", "123456");

await sdk.account.verifySms({
  phone_number: "+12025550123",
});

await sdk.account.verifySms({
  phone_number: "+12025550123",
  token: "654321",
});
```

Notes:

- calling these helpers without `token` requests a verification message
- calling them with `token` attempts to confirm the verification
- the SDK intentionally keeps these as low-level account helpers because delivery/validation behavior is API-controlled

## Loadout CRUD And Recommendations

### Loadout Side Shape

`CsfloatCreateLoadoutRequest` and `CsfloatUpdateLoadoutRequest` both use this high-level structure:

| Field | Required | Meaning |
|---|---|---|
| `name` | yes | loadout name |
| `ct` | yes | CT-side `CsfloatLoadoutSide` object |
| `t` | yes | T-side `CsfloatLoadoutSide` object |

A `CsfloatLoadoutSide` can contain:

- `is_filled`
- `agent`
- `gloves`
- `knife`
- `zeus`
- `midtier`
- `pistols`
- `rifles`

Each item ref is a `CsfloatLoadoutItemRef` with fields such as:

- `def_index`
- `paint_index`
- `wear_index`
- `isLocked`
- `stat_trak`
- `stickers`

### Create Or Update A Loadout

Example:

```ts
const recommender = await sdk.account.createRecommenderToken();

await sdk.loadout.createLoadout(recommender.token, {
  name: "My CT/T setup",
  ct: {
    is_filled: true,
    rifles: [{ def_index: 7, paint_index: 490 }],
  },
  t: {
    is_filled: true,
    rifles: [{ def_index: 60, paint_index: 16 }],
  },
});
```

`updateLoadout()` uses the same request shape.

### Recommendation Requests

`recommend()` request type: `CsfloatLoadoutRecommendationRequest`

| Field | Required | Meaning |
|---|---|---|
| `items` | yes | array of `{ type: "skin", def_index, paint_index }` |
| `count` | yes | desired result count |
| `def_whitelist` | no | allowed weapon ids |
| `def_blacklist` | no | excluded weapon ids |

`recommendStickers()` request type: `CsfloatStickerRecommendationRequest`

| Field | Required | Meaning |
|---|---|---|
| `items` | yes | array of skin items |
| `count` | yes | desired result count |
| `collection_whitelist` | no | allowed sticker collections |

`generateRecommendations()` request type: `CsfloatGenerateLoadoutRecommendationsRequest`

| Field | Required | Meaning |
|---|---|---|
| `def_indexes` | yes | target weapon ids |
| `faction` | yes | `ct` or `t` |
| `items` | yes | current item refs for the generator context |
| `max_price` | no | max spend cap |

Examples:

```ts
await sdk.loadout.recommend(recommender.token, {
  items: [{ type: "skin", def_index: 7, paint_index: 490 }],
  count: 5,
  def_whitelist: [7, 9, 13],
});

await sdk.loadout.recommendStickers(recommender.token, {
  items: [{ type: "skin", def_index: 7, paint_index: 490 }],
  count: 10,
  collection_whitelist: ["2021 Train Collection"],
});
```

### Notes

- loadout writes and recommendations require a recommender token, not the plain API key
- `cloneLoadout()` is the safest convenience path when you want to start from an existing public loadout
- recommendation and generate helpers are ideal places to use the builder helpers from [Helpers, Builders, And Constants](./helpers-and-builders.md)
