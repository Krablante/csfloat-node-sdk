# Workflows And CLI

This page covers the higher-level orchestration layer and the published CLI.

## `sdk.workflows`

`sdk.workflows` exists for tasks that naturally require multiple lower-level calls.

The same class is also exported as `WorkflowResource`, but most users access it through `sdk.workflows`.

### Workflow Methods

| Method | Returns | Best For | Notes |
|---|---|---|---|
| `getPublicMarketFeeds(options?)` | `Promise<CsfloatPublicMarketFeedWorkflowResult>` | scanners, dashboards, quick public snapshots | pulls public search page plus top-deals/newest/unique feeds |
| `getAccountWorkspace(options?)` | `Promise<CsfloatAccountWorkspaceResult>` | authenticated dashboards and operator tooling | pulls `me`, watchlist, stall, offers, trades, and auto-bids |
| `getSingleSkinBuyOrderInsights(defIndex, paintIndex, options?)` | `Promise<CsfloatSingleSkinBuyOrderInsightResult>` | research on one skin's buy-order market | builds expression preview, similar orders, and matching listings |

### Workflow Defaults

| Export | Meaning |
|---|---|
| `CSFLOAT_PUBLIC_FEED_WORKFLOW_DEFAULTS` | default `feed_limit` and `public_page_limit` |
| `CSFLOAT_ACCOUNT_WORKSPACE_DEFAULTS` | default watchlist/stall/offer/trade/auto-bid limits |
| `CSFLOAT_BUY_ORDER_INSIGHT_DEFAULTS` | default preview price, similar limit, listing limit, and sort |

### When To Prefer Workflows

Use workflows when:

- you want a fast snapshot without rebuilding the same `Promise.all(...)` calls
- you are wiring dashboards or CLI tools
- the default orchestration is already close to what you need

Use raw resources when:

- you need precise per-call parameters
- you only need one piece of the workflow
- you want your own batching, ordering, or failure behavior

## CLI

The package publishes one bin:

- `csfloat-node-sdk`

If the package is installed, you can use:

```bash
npx csfloat-node-sdk help
```

If you are working from source after `npm run build`, you can use:

```bash
node dist/cli.js help
```

### Commands

| Command | What It Does |
|---|---|
| `feeds` | fetch the public search snapshot plus current homepage feed variants |
| `workspace` | fetch the account workspace snapshot |
| `buy-order-similar` | build a single-skin buy-order insight snapshot |

### `feeds`

Usage:

```bash
csfloat-node-sdk feeds [--api-key <key>] [--public-page-limit <n>] [--feed-limit <n>]
```

Flags:

| Flag | Meaning |
|---|---|
| `--api-key` | override `CSFLOAT_API_KEY` |
| `--public-page-limit` | limit for the public search page |
| `--feed-limit` | limit for each homepage feed |

Output shape:

- `public_search_page`
- `top_deals`
- `newest`
- `unique`

Each list is summarized down to listing essentials such as `id`, `market_hash_name`, `price`, and `float_value` where available.

### `workspace`

Usage:

```bash
csfloat-node-sdk workspace [--api-key <key>] [--watchlist-limit <n>] [--stall-limit <n>] [--offer-limit <n>] [--trade-limit <n>] [--auto-bid-limit <n>]
```

Flags:

| Flag | Meaning |
|---|---|
| `--api-key` | override `CSFLOAT_API_KEY` |
| `--watchlist-limit` | watchlist page size |
| `--stall-limit` | stall page size |
| `--offer-limit` | offer page size |
| `--trade-limit` | trade page size |
| `--auto-bid-limit` | number of auto-bids to include |

Output shape:

- `me`
- `watchlist`
- `stall`
- `offers`
- `trades`
- `auto_bids`

### `buy-order-similar`

Usage:

```bash
csfloat-node-sdk buy-order-similar --def-index <n> --paint-index <n> [--api-key <key>] [--similar-limit <n>] [--listing-limit <n>] [--sort-by <value>] [--stattrak true|false] [--souvenir true|false] [--min-float <n>] [--max-float <n>] [--paint-seed <n>] [--rarity <n>] [--preview-max-price <n>] [--quantity <n>]
```

Required flags:

- `--def-index`
- `--paint-index`

Optional flags:

| Flag | Meaning |
|---|---|
| `--api-key` | override `CSFLOAT_API_KEY` |
| `--similar-limit` | number of similar orders to fetch |
| `--listing-limit` | number of matching listings to fetch |
| `--sort-by` | listing sort for the preview listing query |
| `--stattrak` | `true` or `false` |
| `--souvenir` | `true` or `false` |
| `--min-float` | minimum float constraint |
| `--max-float` | maximum float constraint |
| `--paint-seed` | exact paint seed constraint |
| `--rarity` | exact rarity constraint |
| `--preview-max-price` | `max_price` used in the request preview |
| `--quantity` | optional preview quantity |

Output shape:

- `expression`
- `request_preview`
- `similar_orders`
- `matching_listings`

## CLI Examples

```bash
npx csfloat-node-sdk feeds --api-key "$CSFLOAT_API_KEY"
npx csfloat-node-sdk workspace --api-key "$CSFLOAT_API_KEY" --watchlist-limit 3 --stall-limit 3
npx csfloat-node-sdk buy-order-similar --api-key "$CSFLOAT_API_KEY" --def-index 7 --paint-index 72 --stattrak false --souvenir false
```

## Related Pages

- [Resource Reference](./resource-reference.md)
- [Helpers, Builders, And Constants](./helpers-and-builders.md)
- [Examples And Recipes](./examples-and-recipes.md)
