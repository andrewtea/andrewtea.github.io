import { defineConfig } from "astro/config";

// Builds the site as plain static files into dist/, which wrangler.jsonc serves as the Worker's assets.
export default defineConfig({
  site: "https://andrewtea.dev",
  trailingSlash: "always",
  compressHTML: false,
  markdown: { syntaxHighlight: false },
});
