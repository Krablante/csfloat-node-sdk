# Examples And Recipes

## Shipped Examples

These examples are already publishable and included in the npm tarball:

- `examples/basic.mjs`
- `examples/market-public-feeds.mjs`
- `examples/watchlist-stall-iteration.mjs`
- `examples/loadout-companion.mjs`
- `examples/buy-order-expression.mjs`
- `examples/workflows.mjs`

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

```bash
node dist/cli.js help
node --env-file=.env dist/cli.js feeds
node --env-file=.env dist/cli.js workspace
node --env-file=.env dist/cli.js buy-order-similar --def-index 7 --paint-index 72 --stattrak false --souvenir false
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

## How To Decide Between Examples And Docs

- Use docs when you want concepts, boundaries, and entrypoint guidance.
- Use examples when you want something runnable immediately.
- Use `API_COVERAGE.md` when you need route-level certainty.
