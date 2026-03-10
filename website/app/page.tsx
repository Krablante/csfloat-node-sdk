import Link from "next/link";
import styles from "./page.module.css";

const sections = [
  {
    title: "Start Fast",
    description: "Install, auth, and get your first working calls without reading the whole repo.",
    href: "/docs/getting-started",
  },
  {
    title: "Full Surface",
    description: "Method-level reference for resources, workflows, helpers, and transport.",
    href: "/docs/resource-reference",
  },
  {
    title: "Write Flows",
    description: "Mutation-heavy payloads, caveats, and safe operator-oriented examples.",
    href: "/docs/write-flows-and-payloads",
  },
  {
    title: "Coverage Truth",
    description: "Route validation, discovery notes, and what is implemented versus low-level.",
    href: "/docs/api-coverage",
  },
];

export default function HomePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Dark-gold documentation for serious CSFloat automation</p>
          <h1>One SDK. One source of truth. A site that finally feels worthy of it.</h1>
          <p className={styles.lead}>
            This site is the polished presentation layer for <code>csfloat-node-sdk</code>: the full
            public runtime surface, the operator-facing transport model, and the write-flow payloads
            that usually stay trapped in source files.
          </p>
          <div className={styles.ctas}>
            <Link href="/docs" className={styles.primaryCta}>
              Open Documentation
            </Link>
            <a
              href="https://www.npmjs.com/package/csfloat-node-sdk"
              className={styles.secondaryCta}
            >
              View npm Package
            </a>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.codeCard}>
            <span className={styles.codeLabel}>Fast path</span>
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
          <h3>Why this site exists</h3>
          <p>
            GitHub and npm remain the canonical home of the docs, coverage matrix, and release
            history. This site does not replace that source of truth. It turns the same material
            into something faster to scan, easier to navigate, and better suited for onboarding and
            day-to-day use.
          </p>
        </div>
        <div className={styles.points}>
          <div>
            <strong>No second documentation system</strong>
            <span>The docs content is synced from the repository documents you already maintain.</span>
          </div>
          <div>
            <strong>Built for real users</strong>
            <span>Reference, workflows, transport, payloads, and coverage live in one coherent UI.</span>
          </div>
          <div>
            <strong>Ready for Vercel previews</strong>
            <span>Every future docs PR can become a deploy preview instead of a markdown-only diff.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
