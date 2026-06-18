// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",   // ← fixed: tests live in src/tests/e2e
  timeout: 30_000,
  retries: 1,
  use: {
    headless: true,
    baseURL:  "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name:   "chromium",
      use:    { browserName: "chromium" },
    },
  ],
  webServer: {
    command:             "npm run dev",
    port:                3000,
    reuseExistingServer: true,
    timeout:             60_000,
  },
});
