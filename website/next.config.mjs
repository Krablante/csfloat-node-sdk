import nextra from "nextra";
import { fileURLToPath } from "node:url";

const withNextra = nextra({
  contentDirBasePath: "/docs",
  search: {
    codeblocks: false,
  },
});

export default withNextra({
  reactStrictMode: true,
  turbopack: {
    root: fileURLToPath(new URL("./", import.meta.url)),
  },
});
