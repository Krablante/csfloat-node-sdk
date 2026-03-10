# Examples And Recipes

## Shipped Examples

These examples are published with the package and included in the npm tarball:

| File | Shows |
|---|---|
| `examples/basic.mjs` | authenticated `me` + inventory + public stall bootstrap |
| `examples/market-public-feeds.mjs` | public listings with homepage/public-page presets |
| `examples/watchlist-stall-iteration.mjs` | authenticated watchlist iteration plus public stall iteration |
| `examples/loadout-companion.mjs` | recommender token flow plus loadout discover/recommend helpers |
| `examples/buy-order-expression.mjs` | single-skin expression preview plus similar buy-order lookup |
| `examples/workflows.mjs` | the higher-level `sdk.workflows` layer end to end |

## Example Commands

```bash
npm run example:basic
npm run example:market
npm run example:watchlist
npm run example:loadout
npm run example:buy-order
npm run example:workflows
```

## CLI Commands

If you are working from source after `npm run build`:

```bash
node dist/cli.js help
node --env-file=.env dist/cli.js feeds
node --env-file=.env dist/cli.js workspace
node --env-file=.env dist/cli.js buy-order-similar --def-index 7 --paint-index 72 --stattrak false --souvenir false
```

If you are using the published package:

```bash
npx csfloat-node-sdk help
npx csfloat-node-sdk feeds --api-key "$CSFLOAT_API_KEY"
```

## Recommended Recipe Paths

- Public feed snapshot:
  `examples/market-public-feeds.mjs`
- Authenticated watchlist + stall iteration:
  `examples/watchlist-stall-iteration.mjs`
- Loadout discover / recommend flows:
  `examples/loadout-companion.mjs`
- Expression-backed buy-order research:
  `examples/buy-order-expression.mjs`
- Higher-level multi-call orchestration:
  `examples/workflows.mjs`

## Common Recipes

Assume `const sdk = new CsfloatSdk({ apiKey: process.env.CSFLOAT_API_KEY! });` unless the snippet shows otherwise.

### Public Market Snapshot

```ts
import {
  CsfloatSdk,
  getHomepageFeedParams,
  getPublicMarketPageParams,
} from "csfloat-node-sdk";

const sdk = new CsfloatSdk({ apiKey: process.env.CSFLOAT_API_KEY! });

const [publicPage, topDeals] = await Promise.all([
  sdk.listings.getListings(getPublicMarketPageParams()),
  sdk.listings.getListings(getHomepageFeedParams("top_deals")),
]);
```

### Watchlist Or Stall Iteration

```ts
for await (const listing of sdk.account.iterateWatchlist({
  limit: 20,
  state: "listed",
  sort_by: "most_recent",
})) {
  console.log(listing.id);
}

for await (const listing of sdk.stall.iterateStall("76561198000000000", {
  limit: 20,
  type: "buy_now",
})) {
  console.log(listing.id);
}
```

### Compose Search Filters With Helpers

```ts
import {
  buildPriceRange,
  buildStickerFilters,
  withWearPreset,
} from "csfloat-node-sdk";

const listings = await sdk.listings.getListings({
  ...withWearPreset({ type: "buy_now" }, "MW"),
  ...buildPriceRange({ min_price: 500, max_price: 5_000 }),
  ...buildStickerFilters([{ sticker_id: 85, slot: 1 }]),
});
```

### Preview A Buy-Order Request Before Creating It

```ts
import {
  buildSingleSkinBuyOrderExpression,
  buildSingleSkinBuyOrderRequest,
} from "csfloat-node-sdk";

const expression = buildSingleSkinBuyOrderExpression(7, 72, {
  stattrak: false,
  souvenir: false,
});

const request = buildSingleSkinBuyOrderRequest(7, 72, {
  max_price: 3,
  quantity: 1,
  stattrak: false,
  souvenir: false,
});

const similar = await sdk.account.getSimilarBuyOrders({ expression }, 5);
```

### Recommender Token Loadout Flow

```ts
const recommender = await sdk.account.createRecommenderToken();

const discover = await sdk.loadout.getDiscoverLoadouts({
  limit: 5,
  def_index: 7,
  paint_index: 490,
});

const stickerRecommendations = await sdk.loadout.recommendStickersForSkin(
  recommender.token,
  7,
  490,
  { count: 10 },
);
```

### Response Metadata And Rate Limits

```ts
const response = await sdk.client.getWithMetadata("me");

console.log(response.meta.status);
console.log(response.meta.rateLimit?.remaining);
console.log(response.meta.rateLimit?.suggestedWaitMs);
```

### Schema Media Helpers

```ts
import { getCsfloatScreenshotUrls } from "csfloat-node-sdk";

const screenshot = await sdk.meta.getItemExampleScreenshot({
  def_index: 7,
  paint_index: 490,
});

console.log(getCsfloatScreenshotUrls(screenshot));
```

### Bulk Listing Mutation

```ts
await sdk.listings.updateBulkListings([
  { contract_id: "123", price: 1_500 },
  { contract_id: "456", price: 2_000 },
]);
```

## How To Decide Between Examples And Docs

- Use docs when you want concepts, boundaries, and entrypoint guidance.
- Use examples when you want something runnable immediately.
- Use `API_COVERAGE.md` when you need route-level certainty.
