function readPackage(pkg) {
  if (pkg.name === "@tailwindcss/oxide") {
    // This is a safe, official dependency from the Tailwind CSS team.
    // We approve its build script to allow it to download the correct native binary.
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.postinstall = "node ./bin/download-engine.js";
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
