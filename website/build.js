// website-src/build.js
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

// Read README.md
const readmeContent = fs.readFileSync("README.md", "utf8");

// Read HTML template
const template = fs.readFileSync("website/index.html", "utf8");

// Configure marked for GitHub-style rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
});

// Convert markdown to HTML
const htmlContent = marked(readmeContent);

// Read specs files
const specsDir = "docs/specs";
const specsFiles = fs
  .readdirSync(specsDir)
  .filter((file) => file.endsWith(".md"));
const specs = {};

specsFiles.forEach((file) => {
  const filePath = path.join(specsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const htmlContent = marked(content);
  const fileName = path.basename(file, ".md");
  specs[fileName] = {
    title:
      fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, " "),
    content: htmlContent,
  };
});

// Generate specs data for frontend
const specsData = `const specsData = ${JSON.stringify(specs)};`;
fs.writeFileSync("build/specs-data.js", specsData);

// Replace placeholder in template
const finalHtml = template.replace("{{CONTENT}}", htmlContent);

// Write to build directory
fs.writeFileSync("build/index.html", finalHtml);

console.log("✅ Website built successfully!");
