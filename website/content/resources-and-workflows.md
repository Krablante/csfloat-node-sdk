# Resources, Workflows, And Surface Map

This page answers the practical question every user hits first:

Which part of the SDK should I use for this task?

## The Main Layers

| Surface | Use It For | Typical User |
|---|---|---|
| `new CsfloatSdk(...)` | Normal entrypoint that wires every resource together | Almost everyone |
| `sdk.meta` | schema, bootstrap metadata, screenshot helpers, inspect lookup | dashboards, research tools |
| `sdk.listings` | public market reads plus listing writes, bids, buy-now, watchlist mutations | scanners, trading tools, sellers |
| `sdk.account` | authenticated account workflows: trades, offers, watchlist, buy orders, tokens, payments, settings | bots, seller tools, operator panels |
| `sdk.inventory` | authenticated inventory reads | sellers, dashboards |
| `sdk.stall` | public seller stall reads and cursor iteration | scanners, seller profile tools |
| `sdk.users` | public user profile lookup | dashboards, enrichers |
| `sdk.history` | sales and graph history for market_hash_name-driven analysis | pricing tools, analytics |
| `sdk.loadout` | public loadout browse plus recommender-token companion flows | loadout tools |
| `sdk.workflows` | higher-level multi-call task helpers | dashboards, scripts, CLI, quick automation |
| package-root helpers | query presets, builders, constants, schema helpers, pagination helpers | users who want less glue code |
| `sdk.client` / `CsfloatHttpClient` | low-level transport control and response metadata | advanced wrappers, operators |

## If You Want X, Use Y

| Task | Recommended Surface |
|---|---|
| fetch the current public market page | `sdk.listings.getListings(getPublicMarketPageParams())` |
| fetch homepage-like public feeds | `sdk.workflows.getPublicMarketFeeds()` or `getHomepageFeedParams()` |
| read your own account snapshot | `sdk.account.getMe()` |
| build a simple account dashboard | `sdk.workflows.getAccountWorkspace()` |
| iterate a cursor-based watchlist or stall | `sdk.account.iterateWatchlist()` / `sdk.stall.iterateStall()` |
| place or research buy orders | `sdk.account.*BuyOrder*` plus buy-order builders |
| mutate listings | `sdk.listings.create*`, `update*`, `delete*` |
| inspect a single item link | `sdk.meta.inspectItem()` |
| work with schema or screenshot media | `sdk.meta.getSchema()` plus schema helpers |
| browse or mutate loadouts | `sdk.loadout.*` plus recommender token flow |
| inspect raw headers or rate limits | `sdk.client.getWithMetadata()` and friends |

## Public, Authenticated, And Companion Surfaces

The SDK spans three related but different surfaces:

1. main CSFloat API
   `https://csfloat.com/api/v1`
2. loadout companion API
   `https://loadout-api.csfloat.com/v1`
3. inspect companion lookup
   `https://api.csfloat.com/?url=<inspectLink>`

What this means in practice:

- `sdk.meta`, `sdk.listings`, `sdk.users`, `sdk.stall`, `sdk.history`, and most of `sdk.account` talk to the main API
- `sdk.loadout` talks to the loadout companion surface
- `sdk.meta.inspectItem()` uses the inspect companion surface with the headers the route expects

## Authentication Model

There are two normal auth stories:

1. your CSFloat API key
   Used when you instantiate `CsfloatSdk`
2. a recommender token
   Minted via `sdk.account.createRecommenderToken()`, then used for token-auth loadout writes and recommendation flows

Typical loadout flow:

```ts
const recommender = await sdk.account.createRecommenderToken();

const recommendations = await sdk.loadout.recommendForSkin(
  recommender.token,
  7,
  72,
  { count: 5 },
);
```

## Pagination Models

There are three patterns in the SDK:

1. cursor pagination
   Used by public listings, public stalls, watchlists, and notifications
2. page-based pagination
   Used by some account reads such as offers, trades, transactions, and buy orders
3. plain limit-only reads
   Used by endpoints that do not expose a richer paginator

When a cursor route matters often enough, the SDK exposes an async iterator:

- `sdk.listings.iterateListings()`
- `sdk.account.iterateWatchlist()`
- `sdk.stall.iterateStall()`

If you need to build your own iterator for a custom cursor endpoint, use `paginateCursor()` directly. See [Helpers, Builders, And Constants](./helpers-and-builders.md).

## Listings, Watchlist, And Stall Are Related But Not Identical

- `sdk.listings`
  The public market and listing mutation layer.
- `sdk.account.getWatchlist()`
  An authenticated market-shaped feed of listings you care about.
- `sdk.stall.getStall(userId, ...)`
  A public market-shaped feed of one seller's inventory.

This is why many of the query patterns feel similar across those surfaces: they all revolve around listing-shaped payloads, but they are still distinct endpoints with distinct caveats.

## When Workflows Are The Better API

Use `sdk.workflows` when the task is naturally multi-call and you do not want to rebuild the same orchestration each time.

- `getPublicMarketFeeds()`
  Pull the public search page plus current top-deals/newest/unique homepage feeds.
- `getAccountWorkspace()`
  Pull `me`, watchlist, stall, offers, trades, and auto-bids in one opinionated snapshot.
- `getSingleSkinBuyOrderInsights()`
  Build an expression preview, fetch similar buy orders, and fetch matching listings.

If you need full control over every query param, use the underlying resource methods instead.

## When Helpers And Builders Are The Better API

Use helper exports when the request shape is real but annoying to compose repeatedly:

- buy-order expression builders
- market presets and filter builders
- loadout recommendation builders
- schema lookup helpers
- wear presets

Use the full reference here:

- [Resource Reference](./resource-reference.md)
- [Helpers, Builders, And Constants](./helpers-and-builders.md)
- [Workflows And CLI](./workflows-and-cli.md)
