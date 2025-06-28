// website-src/build-script.js
const fs = require("fs");
const { marked } = require("marked");

// Read README.md
const readmeContent = fs.readFileSync("README.md", "utf8");

// Read HTML template
const template = fs.readFileSync("website-src/template.html", "utf8");

// Configure marked for GitHub-style rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
});

// Convert markdown to HTML
const htmlContent = marked(readmeContent);

// Replace placeholder in template
const finalHtml = template.replace("{{CONTENT}}", htmlContent);

// Write to build directory
fs.writeFileSync("build/index.html", finalHtml);

console.log("✅ Website built successfully!");
