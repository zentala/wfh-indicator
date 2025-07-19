const fs = require("fs");
const path = require("path");

// Kolory dla różnych statusów
const statusColors = {
  red: "#ff0000", // ON_CALL
  orange: "#ff8c00", // VIDEO_CALL
  yellow: "#ffff00", // FOCUSED
  green: "#00ff00", // AVAILABLE
  blue: "#0000ff", // AWAY
  gray: "#808080", // OFFLINE
};

// SVG template dla koła
const createCircleSVG = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="7" fill="${color}" />
</svg>
`;

// Funkcja do konwersji SVG na PNG (uproszczona)
const convertSVGToPNG = (svgContent, outputPath) => {
  // To jest uproszczona implementacja
  // W rzeczywistości potrzebowalibyśmy biblioteki jak sharp lub canvas
  console.log(`Generating ${outputPath}...`);

  // Zapisujemy SVG jako tymczasowe rozwiązanie
  fs.writeFileSync(outputPath.replace(".png", ".svg"), svgContent);

  // TODO: Implementuj prawdziwą konwersję SVG na PNG
  console.log(`⚠️  SVG saved as ${outputPath.replace(".png", ".svg")}`);
  console.log(
    `   PNG conversion requires additional tools (sharp, canvas, etc.)`
  );
};

// Generuj ikony
const iconsDir = path.join(__dirname, "../public/icons");

// Upewnij się, że katalog istnieje
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log("🎨 Generating tray icons...");

Object.entries(statusColors).forEach(([colorName, colorValue]) => {
  const svgContent = createCircleSVG(colorValue);
  const outputPath = path.join(iconsDir, `circle-${colorName}.png`);

  convertSVGToPNG(svgContent, outputPath);
});

console.log("\n✅ Icon generation completed!");
console.log("📁 Icons saved in: public/icons/");
console.log("\n⚠️  Note: PNG files need manual conversion from SVG");
console.log(
  "   You can use online tools or install sharp/canvas for automatic conversion"
);
