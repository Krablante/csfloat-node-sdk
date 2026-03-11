# Helpers, Builders, And Constants

This page covers the package-root helper exports that are not resource methods but still form part of the public SDK surface.

## Buy-Order Helpers

### Constants

| Export | Use It For |
|---|---|
| `CSFLOAT_BUY_ORDER_GROUP_CONDITIONS` | valid top-level or nested expression conditions (`and`, `or`) |
| `CSFLOAT_BUY_ORDER_EXPRESSION_FIELDS` | valid fields such as `FloatValue`, `PaintSeed`, `DefIndex`, `PaintIndex` |
| `CSFLOAT_BUY_ORDER_COMPARISON_OPERATORS` | comparison operators for numeric/boolean fields |
| `CSFLOAT_BUY_ORDER_OPERATORS` | all operators including sticker `has` |

### Builder Class

| Export | Use It For |
|---|---|
| `CsfloatBuyOrderExpressionBuilder` | build expression ASTs fluently instead of hand-writing nested objects |

Builder methods:

- `addRule(field, operator, value)`
  Add a numeric or boolean rule.
- `addStickerRule(stickerId, options?)`
  Add a sticker `has` rule with optional `qty` or `slot`.
- `addGroup(condition, build)`
  Add a nested `and` or `or` group.
- `build()`
  Validate and return the final expression AST.

### Request Helpers

| Export | Use It For |
|---|---|
| `buildExpressionBuyOrderRequest(expression, options)` | validate an expression and wrap it into a create-buy-order request |
| `buildSingleSkinBuyOrderExpression(defIndex, paintIndex, options?)` | generate the common single-skin expression shape |
| `buildSingleSkinBuyOrderRequest(defIndex, paintIndex, options)` | build a full expression-backed create request for one skin |

Example:

```ts
import {
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
} from "csfloat-node-sdk";

const expression = buildSingleSkinBuyOrderExpression(7, 72, {
  stattrak: false,
  min_float: 0.01,
  max_float: 0.07,
});

const request = buildSingleSkinBuyOrderRequest(7, 72, {
  max_price: 3,
  quantity: 1,
  stattrak: false,
});
```

Relevant types:
`CsfloatSingleSkinBuyOrderExpressionOptions`, `CsfloatSingleSkinBuyOrderRequestOptions`, `CsfloatBuyOrderComparableField`

## Market And Search Helpers

### Presets And Constants

| Export | Use It For |
|---|---|
| `CSFLOAT_CATEGORY_PRESETS` | category mapping for `normal`, `stattrak`, `souvenir`, `highlight` |
| `CSFLOAT_FILTER_OPTIONS` | currently validated listing filters |
| `CSFLOAT_LISTING_TYPES` | current `buy_now` and `auction` listing types |
| `CSFLOAT_STICKER_SEARCH_OPTIONS` | current sticker search option values |
| `CSFLOAT_WATCHLIST_STATES` | current watchlist states |
| `CSFLOAT_HOMEPAGE_FEED_PRESETS` | the validated homepage feed parameter presets |
| `CSFLOAT_PUBLIC_MARKET_PAGE_PARAMS` | the validated public search-page bootstrap params |
| `CSFLOAT_SORT_OPTIONS` | the validated listing sort values |
| `CSFLOAT_EXCLUDE_RARE_ITEMS_MIN_REF_QTY` | current helper constant for the UI's exclude-rare-items cutoff |

### Preset Functions

| Export | Use It For |
|---|---|
| `getCategoryParams(preset)` | translate a category preset into listing params |
| `getHomepageFeedParams(preset)` | fetch params for `top_deals`, `newest`, or `unique` |
| `getPublicMarketPageParams()` | fetch params for the public search bootstrap |
| `withWearPreset(params, preset)` | merge a wear preset into an existing listing query |

### Filter And Range Builders

| Export | Use It For |
|---|---|
| `buildFloatRange(params)` | `min_float` / `max_float` |
| `buildPriceRange(params)` | `min_price` / `max_price` |
| `buildFadeRange(params)` | `min_fade` / `max_fade` |
| `buildBlueRange(params)` | `min_blue` / `max_blue` |
| `buildReferenceQuantityFilter(params)` | `min_ref_qty` |
| `buildCollectionFilter(params)` | `collection` |
| `buildRarityFilter(params)` | `rarity` |
| `buildPaintSeedFilter(params)` | `paint_seed` |
| `buildMusicKitFilter(params)` | `music_kit_index` |
| `buildKeychainPatternRange(params)` | `min_keychain_pattern` / `max_keychain_pattern` |
| `buildStickerFilters(filters)` | JSON-encode attachment sticker filters correctly |
| `buildKeychainFilters(filters)` | JSON-encode attachment keychain filters correctly |

Example:

```ts
import {
  buildPriceRange,
  buildStickerFilters,
  getHomepageFeedParams,
  withWearPreset,
} from "csfloat-node-sdk";

const params = {
  ...getHomepageFeedParams("newest"),
  ...withWearPreset({}, "MW"),
  ...buildPriceRange({ min_price: 500, max_price: 5_000 }),
  ...buildStickerFilters([{ sticker_id: 85, slot: 1 }]),
};

const listings = await sdk.listings.getListings(params);
```

Relevant types:
`CsfloatCategoryPreset`, `CsfloatHomepageFeedPreset`, `CsfloatPriceRangeParams`, `CsfloatFadeRangeParams`, `CsfloatBlueRangeParams`, `CsfloatReferenceQuantityParams`, `CsfloatCollectionFilterParams`, `CsfloatRarityFilterParams`, `CsfloatPaintSeedFilterParams`, `CsfloatMusicKitFilterParams`, `CsfloatKeychainPatternRangeParams`

## Reference Price Helpers

Listings, watchlist entries, stall listings, and some inventory items can include a `reference` object that powers the marketplace-style price widget:

- base price
- item factor
- final/predicted price
- global listing count
- deal percentage versus the current listing price

The SDK already exposes the raw field as `listing.reference` / `inventoryItem.reference`. These helpers make it easier to work with it directly.

| Export | Use It For |
|---|---|
| `getReferencePrice(target)` | extract the raw `reference` object from a listing, inventory item, or reference payload |
| `getReferenceItemFactorAmount(target)` | compute the absolute item-factor amount (`predicted_price - base_price`) |
| `getReferenceDiscountPercent(target, listingPrice?)` | compute the positive discount percent when a listing is below the predicted price |
| `getReferencePremiumPercent(target, listingPrice?)` | compute the positive premium percent when a listing is above the predicted price |
| `buildReferenceInsight(target, listingPrice?)` | build one summary object with base/final price, item factor amount, quantity, and discount/premium info |

Notes:

- `finalPrice` in `buildReferenceInsight()` maps to the API field `predicted_price`
- `globalListings` maps to the API field `quantity`
- all values stay in the same integer price units used by `listing.price` and the API payloads

Example:

```ts
import {
  buildReferenceInsight,
  getReferenceDiscountPercent,
} from "csfloat-node-sdk";

const [listing] = (await sdk.listings.getListings()).data;

const insight = buildReferenceInsight(listing);

console.log(insight?.basePrice);
console.log(insight?.itemFactorAmount);
console.log(insight?.finalPrice);
console.log(insight?.globalListings);
console.log(getReferenceDiscountPercent(listing));
```

Relevant types:
`CsfloatReferencePrice`, `CsfloatReferenceInsight`, `CsfloatReferenceTarget`

## Loadout Helpers

### Constants

| Export | Use It For |
|---|---|
| `CSFLOAT_LOADOUT_SORT_OPTIONS` | validated public loadout sort values |
| `CSFLOAT_LOADOUT_FACTIONS` | valid generation factions (`ct`, `t`) |
| `CSFLOAT_LOADOUT_MAX_LIMIT` | maximum validated loadout list limit |
| `CSFLOAT_STICKER_RECOMMENDATION_MAX_COUNT` | current sticker recommendation count cap |
| `CSFLOAT_DISCOVER_LOADOUT_PARAMS` | validated default discover-mode parameter set |

### Builder Functions

| Export | Use It For |
|---|---|
| `buildLoadoutListParams(params?)` | validate a general loadout list query |
| `buildLoadoutSkinSearchParams(params)` | validate paired `def_index` + `paint_index` loadout searches |
| `getDiscoverLoadoutParams(params?)` | merge caller input onto the discover defaults |
| `buildLoadoutRecommendationRequest(request)` | validate and clone a generic recommend request |
| `buildStickerRecommendationRequest(request)` | validate and clone a generic sticker recommend request |
| `buildGenerateLoadoutRecommendationsRequest(request)` | validate and clone a broader generate request |
| `buildSingleSkinRecommendationRequest(defIndex, paintIndex, options)` | ergonomic single-skin recommend request |
| `buildSingleSkinStickerRecommendationRequest(defIndex, paintIndex, options)` | ergonomic single-skin sticker request |

Example:

```ts
import {
  buildSingleSkinRecommendationRequest,
  getDiscoverLoadoutParams,
} from "csfloat-node-sdk";

const discover = await sdk.loadout.getLoadouts(
  getDiscoverLoadoutParams({ limit: 20, months: 1 }),
);

const request = buildSingleSkinRecommendationRequest(7, 72, {
  count: 5,
  def_whitelist: [7, 9, 13],
});
```

Relevant types:
`CsfloatLoadoutSkinSearchParams`, `CsfloatSingleSkinRecommendationOptions`, `CsfloatSingleSkinStickerRecommendationOptions`

## Schema And Media Helpers

These helpers operate on payloads from `sdk.meta.getSchema()` or `sdk.meta.getItemExampleScreenshot()`.

| Export | Use It For |
|---|---|
| `getSchemaCollection(schema, key)` | fetch one collection by key |
| `getSchemaRarityByValue(schema, value)` | fetch one rarity by numeric value |
| `getSchemaWeapon(schema, defIndex)` | fetch one weapon node |
| `getSchemaPaint(schema, defIndex, paintIndex)` | fetch one paint node |
| `listSchemaWeapons(schema)` | flatten the weapon map into key/value entries |
| `listSchemaPaints(schema, defIndex)` | flatten one weapon's paint map |
| `listSchemaMusicKits(schema)` | flatten music kits |
| `listSchemaHighlightReels(schema)` | flatten highlight reels |
| `findSchemaPaintsByIndex(schema, paintIndex)` | search every weapon for one paint index |
| `toCsfloatScreenshotUrl(path)` | convert a relative screenshot path into a full `https://csfloat.pics/...` URL |
| `getCsfloatScreenshotUrls(screenshot)` | extract full playside/backside URLs from screenshot payloads |

Example:

```ts
import {
  findSchemaPaintsByIndex,
  getCsfloatScreenshotUrls,
} from "csfloat-node-sdk";

const schema = await sdk.meta.getSchema();
const screenshot = await sdk.meta.getItemExampleScreenshot({
  def_index: 7,
  paint_index: 490,
});

console.log(findSchemaPaintsByIndex(schema, 490));
console.log(getCsfloatScreenshotUrls(screenshot));
```

Relevant types:
`CsfloatSchemaRecordEntry`, `CsfloatSchemaPaintMatch`, `CsfloatScreenshotUrls`

## Wear Helpers

| Export | Use It For |
|---|---|
| `CSFLOAT_WEAR_PRESETS` | validated `FN`, `MW`, `FT`, `WW`, `BS` float bounds |
| `getWearParams(preset)` | get one wear preset as `{ min_float?, max_float? }` |

Example:

```ts
import { getWearParams } from "csfloat-node-sdk";

const factoryNew = getWearParams("FN");
```

Relevant types:
`CsfloatWearPreset`, `CsfloatWearParams`

## Pagination Helper

| Export | Use It For |
|---|---|
| `paginateCursor(options)` | build a custom async iterator for cursor-based endpoints |

Most users should prefer the built-in iterators:

- `sdk.listings.iterateListings()`
- `sdk.account.iterateWatchlist()`
- `sdk.stall.iterateStall()`

Use `paginateCursor()` directly when you are composing your own cursor-driven wrapper:

```ts
import { paginateCursor } from "csfloat-node-sdk";

for await (const item of paginateCursor({
  loadPage: (cursor) => sdk.account.getNotifications({ cursor }),
  getItems: (page) => page.data,
})) {
  console.log(item.id);
}
```
