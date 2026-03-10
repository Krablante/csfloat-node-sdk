# Documentation Hub

This docs set is meant to cover the full public runtime surface of `csfloat-node-sdk`:

- `CsfloatSdk` resources
- `sdk.client` and `CsfloatHttpClient`
- workflow helpers
- builder/helper/constant exports from the package root
- CLI commands
- the stability and coverage notes needed to use the SDK responsibly

If you are reading this from the published npm package, these files ship in the tarball.

## Recommended Reading Order

1. [Getting Started](./getting-started.md)
   Install, first client, first requests, and where to go next.
2. [Resources, Workflows, And Surface Map](./resources-and-workflows.md)
   Which surface to use for each kind of task.
3. [Resource Reference](./resource-reference.md)
   The method-level reference for `sdk.meta`, `sdk.account`, `sdk.listings`, and the rest.
4. [Helpers, Builders, And Constants](./helpers-and-builders.md)
   Every exported helper module and the constants that shape queries or requests.
5. [Write Flows And Payloads](./write-flows-and-payloads.md)
   Minimal valid payloads, field meanings, and caveats for mutation-heavy SDK usage.
6. [Workflows And CLI](./workflows-and-cli.md)
   The higher-level orchestration layer plus the published CLI commands.
7. [Transport, Errors, And Metadata](./transport-and-errors.md)
   `CsfloatHttpClient`, retries, pacing, metadata responses, and error handling.
8. [Examples And Recipes](./examples-and-recipes.md)
   Runnable examples plus copyable snippets for common flows.
9. [Stability And Coverage](./stability-and-coverage.md)
   How to interpret implemented vs low-level vs account-gated behavior.
10. [`API_COVERAGE.md`](../API_COVERAGE.md)
   Endpoint-level truth for validated and discovered routes.

## Choose By Task

- First request or install help:
  [Getting Started](./getting-started.md)
- Which resource or helper to reach for:
  [Resources, Workflows, And Surface Map](./resources-and-workflows.md)
- Exact public methods on each resource:
  [Resource Reference](./resource-reference.md)
- Exported builders, presets, constants, and pagination helpers:
  [Helpers, Builders, And Constants](./helpers-and-builders.md)
- Minimal payloads for write-heavy and operator-heavy calls:
  [Write Flows And Payloads](./write-flows-and-payloads.md)
- High-level snapshot helpers or CLI usage:
  [Workflows And CLI](./workflows-and-cli.md)
- Transport behavior, retries, rate limits, or raw metadata:
  [Transport, Errors, And Metadata](./transport-and-errors.md)
- Copyable code for real tasks:
  [Examples And Recipes](./examples-and-recipes.md)
- Support confidence, caveats, and route truth:
  [Stability And Coverage](./stability-and-coverage.md) and [`API_COVERAGE.md`](../API_COVERAGE.md)

## What This Docs Set Covers

- every public runtime entrypoint exported from the package root
- every SDK resource and workflow method
- the helper functions and constants that materially affect day-to-day usage
- the published CLI surface
- the transport and error model

The root package also exports a very large TypeScript type surface. These docs call out the important request and response types by area, but the generated `.d.ts` files and your IDE remain the authoritative field-level reference.

## Where Different Kinds Of Truth Live

- Product overview and install snippet:
  [`README.md`](../README.md)
- Runtime docs:
  `docs/*.md`
- Endpoint-by-endpoint validation and discovery notes:
  [`API_COVERAGE.md`](../API_COVERAGE.md)
- Release history:
  [`CHANGELOG.md`](../CHANGELOG.md)
- Executable examples:
  `examples/*.mjs`
- Tests for supported behavior:
  `test/*.test.ts`
