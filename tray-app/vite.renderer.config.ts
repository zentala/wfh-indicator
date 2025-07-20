/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // Exclude E2E tests, which are handled by Playwright
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "e2e/**/*.{test,spec}.{ts,tsx}",
    ],
  },
});
