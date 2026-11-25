import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "team-tracker",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-12",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      DB: bindings.d1({ name: "team-tracker-db", id: "96eec549-e21c-438e-a779-eccfb3f6662d" }),
      SESSION_SECRET: bindings.secret(),
      ADMIN_USERNAME: bindings.secret(),
      ADMIN_PASSWORD_HASH: bindings.secret(),
    },
  }),
});
