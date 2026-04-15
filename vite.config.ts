import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

const pkg = JSON.parse(readFileSync("./package.json", "utf8")) as { version: string };

// Derive suburb routes from the markdown files on disc so the config and
// the runtime loader stay in sync. One .md file = one /gardening/<slug> route.
const suburbSlugs = readdirSync("./src/content/suburbs")
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const PRERENDER_ROUTES = [
  "/",
  "/schedule",
  ...suburbSlugs.map((slug) => `/gardening/${slug}`),
];

const gitSha = (() => {
  try {
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ||
      execSync("git rev-parse HEAD", { encoding: "utf8" }).trim()
    );
  } catch {
    return "0000000000000000000000000000000000000000";
  }
})();

// On Vercel/Linux serverless builds, puppeteer's bundled Chromium is missing
// system libs (libnspr4.so et al). Use @sparticuz/chromium — a Chromium build
// packaged for AWS Lambda / Vercel serverless — by overriding puppeteer's
// executable path via launchOptions. Local Mac builds keep the top-level
// options shape that works with puppeteer's default Chromium.
async function buildRendererOptions() {
  const base: Record<string, unknown> = {
    renderAfterTime: 5000,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  if (process.env.VERCEL === "1") {
    const { default: chromium } = await import("@sparticuz/chromium");
    base.launchOptions = {
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: "new",
    };
    // Drop the top-level args so launchOptions.args takes effect unambiguously.
    delete base.args;
  }

  return base;
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: unknown[] = [react()];

  if (mode === "production") {
    const rendererOptions = await buildRendererOptions();
    plugins.push(
      prerender({
        routes: PRERENDER_ROUTES,
        renderer: new PuppeteerRenderer(rendererOptions) as unknown as never,
      }),
    );
  }

  return {
    server: {
      host: "::",
      port: 3000,
      hmr: {
        overlay: false,
      },
      proxy: {
        // Forward /api/* to the Vercel dev server (run: npx vercel dev --listen 3001)
        // Or comment this out and use `npx vercel dev` on port 3000 instead of npm run dev
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    plugins: plugins.filter(Boolean) as never,
    define: {
      __APP_SEMVER__: JSON.stringify(pkg.version),
      __APP_VERSION__: JSON.stringify(gitSha),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
