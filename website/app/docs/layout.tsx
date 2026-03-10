import { Banner } from "nextra/components";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

const banner = (
  <Banner storageKey="csfloat-docs-v1">
    Canonical source of truth stays in the repository docs. This site is the polished presentation
    layer.
  </Banner>
);

const navbar = (
  <Navbar
    logo={
      <span className="brand-lockup">
        <span className="brand-mark" />
        <span className="brand-text">
          <strong>csfloat-node-sdk</strong>
          <span>Docs</span>
        </span>
      </span>
    }
    projectLink="https://github.com/Krablante/csfloat-node-sdk"
  />
);

const footer = (
  <Footer>
    <div className="footer-grid">
      <span>MIT {new Date().getFullYear()} © csfloat-node-sdk</span>
      <span>
        <a href="https://www.npmjs.com/package/csfloat-node-sdk">npm</a>
        {" · "}
        <a href="https://github.com/Krablante/csfloat-node-sdk">GitHub</a>
      </span>
    </div>
  </Footer>
);

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      banner={banner}
      navbar={navbar}
      footer={footer}
      pageMap={await getPageMap("/docs")}
      copyPageButton={false}
      sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
      navigation={{ prev: true, next: true }}
      toc={{ backToTop: true, float: true }}
      darkMode={false}
      nextThemes={{ forcedTheme: "dark", defaultTheme: "dark" }}
      editLink={null}
      feedback={{ content: null }}
    >
      {children}
    </Layout>
  );
}
