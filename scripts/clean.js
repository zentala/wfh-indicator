const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const packagesDir = ["domain", "emulator", "tray-app"];
// UWAGA: Nigdy nie usuwamy .yarn, ponieważ zawiera binaria menedżera pakietów!
const dirsToRemove = ["node_modules", "dist", ".vite", "out"];
const filesToRemove = ["pnpm-lock.yaml", "yarn.lock"];

async function clean() {
  console.log("🧹 Starting cleanup...");

  // Czyszczenie wewnątrz każdego pakietu
  for (const pkg of packagesDir) {
    const pkgPath = path.join(rootDir, pkg);
    if (!fs.existsSync(pkgPath)) continue;

    console.log(`\nProcessing package: ${pkg}`);
    for (const dir of dirsToRemove) {
      const dirPath = path.join(pkgPath, dir);
      if (fs.existsSync(dirPath)) {
        console.log(`  - Removing ${dirPath}...`);
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    }
  }

  // Czyszczenie w głównym katalogu
  console.log("\nProcessing root directory...");

  // Usuwanie plików lock
  for (const file of filesToRemove) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  - Removing ${filePath}...`);
      fs.rmSync(filePath, { force: true });
    }
  }

  // Usuwanie głównego node_modules
  const rootNodeModules = path.join(rootDir, "node_modules");
  if (fs.existsSync(rootNodeModules)) {
    console.log(`  - Removing ${rootNodeModules}...`);
    fs.rmSync(rootNodeModules, { recursive: true, force: true });
  }

  console.log("\n✨ Cleanup complete! The .yarn directory has been preserved.");
}

clean().catch((err) => {
  console.error("🔥 Cleanup failed:", err);
  process.exit(1);
});
