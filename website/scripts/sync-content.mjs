import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(websiteRoot, "..");
const sourceDocsDir = path.join(repoRoot, "docs");
const targetContentDir = path.join(websiteRoot, "content");

const FILES = [
  { source: path.join(sourceDocsDir, "README.md"), target: "index.md" },
  { source: path.join(repoRoot, "README.md"), target: "package-readme.md" },
  { source: path.join(sourceDocsDir, "getting-started.md"), target: "getting-started.md" },
  { source: path.join(sourceDocsDir, "resources-and-workflows.md"), target: "resources-and-workflows.md" },
  { source: path.join(sourceDocsDir, "resource-reference.md"), target: "resource-reference.md" },
  { source: path.join(sourceDocsDir, "helpers-and-builders.md"), target: "helpers-and-builders.md" },
  { source: path.join(sourceDocsDir, "write-flows-and-payloads.md"), target: "write-flows-and-payloads.md" },
  { source: path.join(sourceDocsDir, "workflows-and-cli.md"), target: "workflows-and-cli.md" },
  { source: path.join(sourceDocsDir, "transport-and-errors.md"), target: "transport-and-errors.md" },
  { source: path.join(sourceDocsDir, "examples-and-recipes.md"), target: "examples-and-recipes.md" },
  { source: path.join(sourceDocsDir, "stability-and-coverage.md"), target: "stability-and-coverage.md" },
  { source: path.join(repoRoot, "API_COVERAGE.md"), target: "api-coverage.md" },
  { source: path.join(repoRoot, "CHANGELOG.md"), target: "changelog.md" },
];

const GITHUB_BLOB_PREFIX = "https://github.com/Krablante/csfloat-node-sdk/blob/main/";
const SITE_LINKS = new Map([
  ["README.md", "/docs/package-readme"],
  ["LICENSE", "https://github.com/Krablante/csfloat-node-sdk/blob/main/LICENSE"],
  ["PLAN.md", "https://github.com/Krablante/csfloat-node-sdk/blob/main/PLAN.md"],
  [
    "scripts/live-api-audit.mjs",
    "https://github.com/Krablante/csfloat-node-sdk/blob/main/scripts/live-api-audit.mjs",
  ],
  ["docs/README.md", "/docs"],
  ["docs/getting-started.md", "/docs/getting-started"],
  ["docs/resources-and-workflows.md", "/docs/resources-and-workflows"],
  ["docs/resource-reference.md", "/docs/resource-reference"],
  ["docs/helpers-and-builders.md", "/docs/helpers-and-builders"],
  ["docs/write-flows-and-payloads.md", "/docs/write-flows-and-payloads"],
  ["docs/workflows-and-cli.md", "/docs/workflows-and-cli"],
  ["docs/transport-and-errors.md", "/docs/transport-and-errors"],
  ["docs/examples-and-recipes.md", "/docs/examples-and-recipes"],
  ["docs/stability-and-coverage.md", "/docs/stability-and-coverage"],
  ["API_COVERAGE.md", "/docs/api-coverage"],
  ["CHANGELOG.md", "/docs/changelog"],
]);

function replaceMarkdownLinks(markdown) {
  let next = markdown;

  for (const [sourcePath, sitePath] of SITE_LINKS.entries()) {
    const escapedSource = sourcePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const relativePattern = new RegExp(`\\]\\((?:\\.\\/|\\.\\.\\/)?${escapedSource}(#[^)]+)?\\)`, "g");
    const absolutePattern = new RegExp(
      `\\]\\(${GITHUB_BLOB_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${escapedSource}(#[^)]+)?\\)`,
      "g",
    );

    next = next
      .replace(relativePattern, (_match, hash = "") => `](${sitePath}${hash})`)
      .replace(absolutePattern, (_match, hash = "") => `](${sitePath}${hash})`);
  }

  return next
    .replace(/\]\((\.\.\/)?docs\//g, "](")
    .replace(/\]\(\.\/docs\//g, "](");
}

async function cleanGeneratedFiles() {
  const entries = await readdir(targetContentDir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (entry.name === "_meta.ts") {
      continue;
    }

    if (!entry.name.endsWith(".md") && !entry.name.endsWith(".mdx")) {
      continue;
    }

    await rm(path.join(targetContentDir, entry.name), { force: true });
  }
}

async function canReadAllSources() {
  const checks = await Promise.all(
    FILES.map(async (file) => {
      try {
        await access(file.source);
        return true;
      } catch {
        return false;
      }
    }),
  );

  return checks.every(Boolean);
}

await mkdir(targetContentDir, { recursive: true });

if (!(await canReadAllSources())) {
  const existingContent = await readdir(targetContentDir).catch(() => []);
  if (existingContent.some((entry) => entry.endsWith(".md") || entry.endsWith(".mdx"))) {
    console.warn(
      "Documentation source files outside website/ were not all readable; using committed website/content files as fallback.",
    );
    process.exit(0);
  }

  throw new Error("Documentation sources are missing and no committed website/content fallback is available.");
}

await cleanGeneratedFiles();

for (const file of FILES) {
  const source = await readFile(file.source, "utf8");
  const normalized = replaceMarkdownLinks(source);
  await writeFile(path.join(targetContentDir, file.target), normalized, "utf8");
}

console.log(`Synced ${FILES.length} documentation files into website/content`);
