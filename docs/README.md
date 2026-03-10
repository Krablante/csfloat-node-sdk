# Documentation Hub

This SDK already ships a broad surface. The fastest way to make it usable is not
to make the main README even longer, but to give users a clear map.

If you are reading this on npm:

1. start with the repository README for the high-level pitch and install snippet
2. use this `docs/` directory for task-oriented guidance
3. use `API_COVERAGE.md` when you need endpoint-level truth

## Start Here

- [Getting Started](./getting-started.md)
  First install, API key setup, first requests, local verification.
- [Resources And Workflows](./resources-and-workflows.md)
  Which SDK surface to use for market reads, account automation, loadouts, and higher-level helpers.
- [Transport, Errors, And Metadata](./transport-and-errors.md)
  Retries, pacing, typed errors, and the new opt-in response metadata surface.
- [Examples And Recipes](./examples-and-recipes.md)
  Examples, CLI commands, and which script to run for common tasks.

## How To Read This SDK

Use the SDK in three layers:

1. `CsfloatSdk` resources for normal application code
2. helpers/builders/workflows when you want less glue code
3. `sdk.client.*WithMetadata()` when you need low-level response visibility

## Where Different Kinds Of Truth Live

- Product overview: `README.md`
- Stable endpoint coverage notes: `API_COVERAGE.md`
- Release history: `CHANGELOG.md`
- Task-oriented usage: `docs/*.md`
- Executable examples: `examples/*.mjs`

## Should You Build A Separate Docs Site?

Not yet, unless you are ready to keep GitHub, npm, and the site in sync.

The better near-term strategy is:

1. keep GitHub + npm-readable docs as the source of truth
2. keep docs in Markdown inside the package repository
3. only later add a Vercel-hosted site that reuses this same content

That way npm users are not forced onto an external site just to understand the
package, and a future docs site becomes a presentation layer, not a second
documentation system.
