/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(__dirname, "src/renderer"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, ".vite/renderer"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/renderer/index.html"),
        settings: path.resolve(__dirname, "src/renderer/settings.html"),
        pairing: path.resolve(__dirname, "src/renderer/pairing.html"),
      },
    },
  },
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
