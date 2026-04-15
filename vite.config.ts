import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

const pkg = JSON.parse(readFileSync("./package.json", "utf8")) as { version: string };

const PRERENDER_ROUTES = ["/", "/schedule"];

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
// launch options. Local Mac builds keep using puppeteer's default Chromium.
async function resolveLaunchOptions() {
  const isVercel = process.env.VERCEL === "1";
  if (!isVercel) {
    return { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] };
  }
  const { default: chromium } = await import("@sparticuz/chromium");
  const executablePath = await chromium.executablePath();
  return {
    headless: true,
    executablePath,
    args: chromium.args,
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: unknown[] = [react()];

  if (mode === "production") {
    const launchOptions = await resolveLaunchOptions();
    plugins.push(
      prerender({
        routes: PRERENDER_ROUTES,
        renderer: new PuppeteerRenderer({
          renderAfterTime: 2500,
          launchOptions,
        }) as unknown as never,
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
