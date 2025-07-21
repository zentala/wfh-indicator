import { defineConfig } from "vite";
import { externalizeDepsPlugin } from "electron-vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: "src/main/index.ts",
      formats: ["cjs"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        "electron",
        "electron-updater",
        "electron-log",
        "electron-squirrel-startup",
        "uuid",
        "bufferutil",
        "utf-8-validate",
      ],
    },
    outDir: ".vite/build",
    emptyOutDir: false,
    minify: false,
  },
  define: {
    MAIN_WINDOW_VITE_DEV_SERVER_URL: '"http://localhost:5173"',
    MAIN_WINDOW_VITE_NAME: '"main_window"',
  },
  plugins: [externalizeDepsPlugin()],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
});
