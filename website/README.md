# csfloat-node-sdk website

This folder contains the Vercel-ready documentation site for `csfloat-node-sdk`.

## Architecture

- framework: Next.js App Router
- docs theme: Nextra
- visual direction: dark-gold, forced dark theme
- canonical docs source: repository root `README.md`, `docs/*.md`, `API_COVERAGE.md`, `CHANGELOG.md`
- published site content: generated into `website/content/`

The site is intentionally a presentation layer, not a second hand-maintained documentation system.

## Local Development

```bash
cd website
npm install
npm run dev
```

Local build:

```bash
cd website
npm run build
```

`npm run sync:content` copies the canonical markdown files from the repository root into `website/content/`.

## Vercel

Recommended setup:

1. create a new Vercel project from the same GitHub repository
2. set `Root Directory` to `website`
3. keep the framework preset as `Next.js`
4. use the default install command or `npm install`
5. use the default build command or `npm run build`

Optional:

- set `NEXT_PUBLIC_SITE_URL` to your final production URL or custom domain so sitemap and metadata use the exact public origin

Deployment notes:

- `website/content/` is committed, so deploys still work even if Vercel does not expose parent directories outside `website/` during build
- when Vercel can see the repository root, the build will resync from the canonical docs automatically
- if you enable Vercel's setting for including source files outside the root directory during the build step, deploys can always regenerate from the root docs

## Files That Matter

- `app/` application routes and theme
- `content/` generated docs content consumed by Nextra
- `scripts/sync-content.mjs` sync layer from root docs to site content
- `content/_meta.ts` sidebar structure

## Editing Rule

Do not hand-edit `website/content/*.md` as the canonical source.

Edit one of these instead:

- `README.md`
- `docs/*.md`
- `API_COVERAGE.md`
- `CHANGELOG.md`

Then run:

```bash
cd website
npm run sync:content
```
