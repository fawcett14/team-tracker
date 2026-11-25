import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import { fileURLToPath } from "node:url";
import tailwindPostcss from "@tailwindcss/postcss";

export default defineConfig({
  environments: {
    // Worker-targeted environments: resolve package exports for workerd
    // instead of Node. In particular this makes `@prisma/client` resolve to
    // its WASM edge entry (wasm.js) rather than the native query engine,
    // which cannot run on Workers. Mirrors Vite's webworker SSR conditions.
    rsc: {
      resolve: {
        conditions: ["module", "browser", "workerd", "worker", "edge-light"],
      },
    },
    ssr: {
      resolve: {
        conditions: ["module", "browser", "workerd", "worker", "edge-light"],
      },
    },
  },
  resolve: {
    alias: {
      // Server-only module that reads Cloudflare bindings. Aliased to the
      // workerd version for vinext/Vite builds; `next dev` resolves
      // `@/lib/cf-env` to src/lib/cf-env.ts (Node fallback) via tsconfig paths.
      "@/lib/cf-env": fileURLToPath(new URL("./src/lib/cf-env.workers.ts", import.meta.url)),
      // `@prisma/client` resolves its generated entry via the `#main-entry-point`
      // package import, which picks the native query engine under the `node`
      // condition. Force the WASM edge entry instead — it runs on workerd and
      // is what `@prisma/adapter-d1` is designed for. Node (`next dev`) is
      // unaffected because this alias only exists in the Vite/vinext build.
      "#main-entry-point": fileURLToPath(
        new URL("./node_modules/.prisma/client/wasm.js", import.meta.url),
      ),
    },
  },
  css: {
    // Inline PostCSS config: a root postcss.config.mjs would also be picked up
    // by `next dev` (Turbopack), which cannot load the ESM-only plugin chain.
    postcss: {
      plugins: [tailwindPostcss()],
    },
  },
  plugins: [
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
