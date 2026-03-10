export const siteTitle = "csfloat-node-sdk Docs";

export const siteDescription =
  "Dark-gold documentation site for csfloat-node-sdk: setup, resource reference, workflows, write payloads, transport, coverage, and examples.";

export const docsRoutes = [
  "/docs",
  "/docs/package-readme",
  "/docs/getting-started",
  "/docs/resources-and-workflows",
  "/docs/resource-reference",
  "/docs/helpers-and-builders",
  "/docs/write-flows-and-payloads",
  "/docs/workflows-and-cli",
  "/docs/transport-and-errors",
  "/docs/examples-and-recipes",
  "/docs/stability-and-coverage",
  "/docs/api-coverage",
  "/docs/changelog",
] as const;

export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");

  return fromEnv || "https://csfloat-node-sdk-docs.vercel.app";
}
