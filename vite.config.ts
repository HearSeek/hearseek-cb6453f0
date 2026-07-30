import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

// Emits a static, crawler-readable index.html per /collections/* route into the
// build output, based on the built index.html (so hashed asset tags are kept).
const collectionPrerender = () => ({
  name: "collection-prerender",
  apply: "build" as const,
  closeBundle: async () => {
    const outDir = path.resolve(__dirname, "dist");
    const templatePath = path.join(outDir, "index.html");
    if (!existsSync(templatePath)) return;
    const { generateCollectionHtml } = await import(
      "./scripts/generate-collection-html"
    );
    const count = generateCollectionHtml(outDir, readFileSync(templatePath, "utf8"));
    console.log(`prerendered ${count} collection HTML files into dist/collections/`);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    collectionPrerender(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
