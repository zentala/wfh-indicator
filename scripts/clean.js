const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const packagesDir = ["domain", "emulator", "tray-app"];
const dirsToRemove = ["node_modules", "dist", ".vite", "out"];
const filesToRemove = ["pnpm-lock.yaml"];

async function clean() {
  console.log("🧹 Starting cleanup...");

  for (const pkg of packagesDir) {
    const pkgPath = path.join(rootDir, pkg);
    console.log(`\nProcessing package: ${pkg}`);
    for (const dir of dirsToRemove) {
      const dirPath = path.join(pkgPath, dir);
      if (fs.existsSync(dirPath)) {
        console.log(`  - Removing ${dirPath}...`);
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    }
  }

  console.log("\nProcessing root directory...");
  for (const file of filesToRemove) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  - Removing ${filePath}...`);
      fs.rmSync(filePath, { force: true });
    }
  }

  const rootNodeModules = path.join(rootDir, "node_modules");
  if (fs.existsSync(rootNodeModules)) {
    console.log(`  - Removing ${rootNodeModules}...`);
    fs.rmSync(rootNodeModules, { recursive: true, force: true });
  }

  console.log("\n✨ Cleanup complete!");
}

clean().catch((err) => {
  console.error("🔥 Cleanup failed:", err);
  process.exit(1);
});
