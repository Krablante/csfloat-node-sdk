import Link from "next/link";
import styles from "./page.module.css";

const sections = [
  {
    title: "Getting Started",
    description: "Install the package, authenticate, and make the first useful requests.",
    href: "/docs/getting-started",
  },
  {
    title: "Resource Reference",
    description: "Method-level reference for resources, workflows, helpers, and transport.",
    href: "/docs/resource-reference",
  },
  {
    title: "Write Flows",
    description: "Payloads, caveats, and examples for mutation-heavy SDK usage.",
    href: "/docs/write-flows-and-payloads",
  },
  {
    title: "Coverage Matrix",
    description: "Route validation notes and what is implemented, low-level, or still exploratory.",
    href: "/docs/api-coverage",
  },
];

const summary = [
  "Resources, workflows, helpers, and CLI",
  "Write payloads, transport behavior, and error handling",
  "Coverage notes, changelog, examples, and repository context",
];

const overview = [
  {
    title: "SDK package",
    description:
      "The npm package exposes typed resources, workflow helpers, builders, transport primitives, and a small CLI.",
  },
  {
    title: "Documentation set",
    description:
      "The docs cover setup, method reference, write-heavy flows, helpers, transport details, and practical recipes.",
  },
  {
    title: "Repository artifacts",
    description:
      "The repository also contains the coverage matrix, release history, examples, and tests that support the package.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>TypeScript SDK reference for CSFloat</p>
          <h1>Documentation for csfloat-node-sdk</h1>
          <p className={styles.lead}>
            This site documents the public runtime surface of <code>csfloat-node-sdk</code>:
            resources, workflows, helpers, write payloads, transport behavior, examples, and
            coverage notes for the currently mapped CSFloat surface.
          </p>
          <ul className={styles.summaryList}>
            {summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <Link href="/docs" className={styles.primaryCta}>
              Browse Documentation
            </Link>
            <a
              href="https://www.npmjs.com/package/csfloat-node-sdk"
              className={styles.secondaryCta}
            >
              npm Package
            </a>
          </div>
          <a href="https://github.com/Krablante/csfloat-node-sdk" className={styles.repoLink}>
            GitHub repository
          </a>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.codeCard}>
            <span className={styles.codeLabel}>Quick start</span>
            <pre>{`import { CsfloatSdk } from "csfloat-node-sdk"\n\nconst sdk = new CsfloatSdk({\n  apiKey: process.env.CSFLOAT_API_KEY!,\n  minRequestDelayMs: 1250,\n})\n\nconst feeds = await sdk.workflows.getPublicMarketFeeds()`}</pre>
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className={styles.card}>
            <span className={styles.cardGlow} />
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </Link>
        ))}
      </section>

      <section className={styles.rationale}>
        <div>
          <h3>Repository overview</h3>
          <p>
            <code>csfloat-node-sdk</code> is both a published package and a maintained repository:
            the SDK lives alongside its documentation, coverage matrix, release history, examples,
            and tests. This site is the easiest way to navigate that material as documentation.
          </p>
        </div>
        <div className={styles.points}>
          {overview.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
