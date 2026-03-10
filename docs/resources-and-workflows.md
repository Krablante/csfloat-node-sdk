# Resources And Workflows

## Core Resources

- `sdk.meta`
  Schema, exchange rates, app/location/bootstrap metadata, inspect helpers.
- `sdk.listings`
  Market reads, bids, buy-now purchases, listing creation and updates.
- `sdk.account`
  Authenticated account reads and writes: trades, offers, watchlist, buy orders, tokens, notifications, transactions.
- `sdk.inventory`
  Authenticated inventory reads.
- `sdk.stall`
  Public stall reads and cursor iteration.
- `sdk.users`
  Public user profile reads.
- `sdk.history`
  Sales history and graph helpers.
- `sdk.loadout`
  Public and bearer-token companion loadout flows.

## When To Use Workflows

Use `sdk.workflows` when you want an opinionated multi-call helper instead of
manual orchestration.

- `getPublicMarketFeeds()`
  Good for scanners, dashboards, and bots that want a single public snapshot.
- `getAccountWorkspace()`
  Good for authenticated dashboards and operator tooling.
- `getSingleSkinBuyOrderInsights()`
  Good for finding similar buy orders plus matching listings from a single skin input.

## When To Use Builders

Use builders when the API contract is real but awkward to compose manually.

- `buy-order.ts`
  Expression-backed buy-order request building.
- `market.ts`
  Query presets and filter composition.
- `loadout.ts`
  Recommendation and discover-mode helper builders.
- `schema.ts`
  Schema lookup helpers and screenshot URL helpers.

## Suggested Reading Order

1. `README.md`
2. `docs/getting-started.md`
3. this file
4. `docs/transport-and-errors.md`
5. `docs/examples-and-recipes.md`
6. `API_COVERAGE.md` for endpoint-level details
