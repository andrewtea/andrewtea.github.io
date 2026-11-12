import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";

const site = "https://andrewtea.dev";

// Links that leave the site open in a new tab; this does the same for links written in Markdown posts.
const externalLinksOpenInNewTab = {
  name: "external-links-open-in-new-tab",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== "string") return;
      const url = new URL(href, site);
      if (!url.protocol.startsWith("http") || url.origin === site) return;
      ctx.setProperty(node, "target", "_blank");
      ctx.setProperty(node, "rel", ["noopener", "noreferrer"]);
    },
  },
};

// Builds the site as plain static files into dist/, which wrangler.jsonc serves as the Worker's assets.
export default defineConfig({
  site,
  trailingSlash: "always",
  compressHTML: false,
  markdown: { syntaxHighlight: false, processor: satteri({ hastPlugins: [externalLinksOpenInNewTab] }) },
});
