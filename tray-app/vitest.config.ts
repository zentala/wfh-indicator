/// <reference types="vitest" />
import { defineConfig } from "vite";
import { mergeConfig } from "vitest/config";
import viteConfig from "./vite.renderer.config";

// https://vitejs.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.ts",
    },
  })
);
