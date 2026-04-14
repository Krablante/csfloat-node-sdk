# Stability And Coverage

This SDK is intentionally conservative about what it claims to support.

The goal is not to expose every route-shaped rumor. The goal is to expose the routes and helpers that can be defended with live validation, source analysis, or both, while still being honest about lower-confidence edges.

## Where To Look For What

| Need | Source |
|---|---|
| product overview and install path | `README.md` |
| full runtime usage docs | `docs/*.md` |
| endpoint-by-endpoint validation notes | `API_COVERAGE.md` |
| field-level types | generated `.d.ts` files and your IDE |
| executable supported behavior | `examples/*.mjs` and `test/*.test.ts` |

## Status Words You Will See

The coverage matrix uses these words deliberately:

- `implemented`
  available in `csfloat-node-sdk`
- `degraded`
  still exposed in `csfloat-node-sdk`, but the current live surface is regressed, stale, or externally unavailable
- `discovered`
  route existence is confirmed, but it is not yet promoted into the SDK surface
- `validated`
  confirmed through official docs, live API checks, local source analysis, or a combination
- `account-gated`
  route exists, but real usage depends on account state, eligibility, or role
- `source`
  where the evidence came from

## What Counts As Stable For Users

Treat these as the normal supported surface:

- resource methods documented in [Resource Reference](./resource-reference.md)
- helper exports documented in [Helpers, Builders, And Constants](./helpers-and-builders.md)
- workflow helpers documented in [Workflows And CLI](./workflows-and-cli.md)
- the transport and error model documented in [Transport, Errors, And Metadata](./transport-and-errors.md)
- the shipped example scripts

## What Is Intentionally More Low-Level

Some surface is exposed because it is useful and real, but the SDK still treats it conservatively:

- `account.acceptOffer()`
  the route exists and is implemented, but happy-path response semantics are still intentionally conservative
- `account.syncSteamNewOffer()`
  low-level Steam sync helper
- `account.syncSteamOffers()`
  low-level Steam sync helper
- `account.cannotDeliverTrade()` / `disputeTrade()` / `markTradeReceived()` / `rollbackTrade()` / `manualVerifyTrade()` / `verifyTradeRollback()`
  bundle-confirmed low-level trade lifecycle edges that remain intentionally state-gated and conservative
- `account.verifyEmail()` / `account.verifySms()`
  low-level account verification helpers whose delivery/confirmation behavior remains API-controlled
- `meta.inspectItem()` / `account.getBuyOrdersForInspect()`
  inspect-linked helpers that still need current runtime context: `meta.inspectItem()` is locally live for masked links but degraded for legacy unmasked links, and `account.getBuyOrdersForInspect()` now expects the current listing-derived trio `serialized_inspect ?? inspect_link`, `market_hash_name`, and `gs_sig`
- `sdk.client.get/post/patch/put/delete`
  low-level transport methods for advanced wrappers
- `sdk.client.*WithMetadata()`
  low-level metadata access for operator tooling and rate-limit visibility

These are not "bad" APIs. They are simply closer to the metal than the average application flow.

## Account-Gated And Role-Gated Areas

Some routes are fully implemented in the SDK but still depend on account state or actor role:

- creating listings or bulk listings
- trade acceptance/cancellation flows
- some payments and withdrawal flows
- seller-side or buyer-side trade lifecycle steps
- some companion-token flows if the underlying account cannot mint the token

When these routes reject, the SDK tries to classify the failure into useful `CsfloatSdkError.kind` values such as `account_gated` or `role_gated`.

## Why `API_COVERAGE.md` Still Matters

The docs pages tell you how to use the supported surface.

`API_COVERAGE.md` tells you:

- which raw routes are implemented
- which routes are only discovered
- which query params are meaningful, ignored, or stale
- how confidence was established

That file is especially important when you are deciding whether to build on:

- a public query parameter with weak semantics
- a browser-observed route not yet promoted into the SDK
- a low-level or partially mapped endpoint

## How To Read The Project Conservatively

A good practical rule:

1. start with the documented runtime surface in `docs/`
2. use `API_COVERAGE.md` when you need route-level certainty
3. treat discovered-only routes as research material, not stable SDK surface

## Future Docs Site Strategy

If this project later gets a dedicated docs site, the right strategy is to reuse these Markdown docs as the source of truth instead of creating a second documentation system.
