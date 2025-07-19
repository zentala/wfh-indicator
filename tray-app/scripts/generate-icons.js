const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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

// Funkcja do konwersji SVG na PNG używając sharp
const convertSVGToPNG = async (svgContent, outputPath) => {
  try {
    console.log(`Generating ${outputPath}...`);

    // Konwertuj SVG na PNG używając sharp
    await sharp(Buffer.from(svgContent))
      .resize(16, 16)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generating ${outputPath}:`, error.message);
  }
};

// Generuj ikony
const iconsDir = path.join(__dirname, "../public/icons");

// Upewnij się, że katalog istnieje
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log("🎨 Generating tray icons...");

// Asynchroniczna funkcja do generowania wszystkich ikon
const generateAllIcons = async () => {
  const promises = Object.entries(statusColors).map(
    async ([colorName, colorValue]) => {
      const svgContent = createCircleSVG(colorValue);
      const outputPath = path.join(iconsDir, `circle-${colorName}.png`);

      await convertSVGToPNG(svgContent, outputPath);
    }
  );

  await Promise.all(promises);

  console.log("\n✅ Icon generation completed!");
  console.log("📁 Icons saved in: public/icons/");
  console.log("\n📋 Generated icons:");
  Object.keys(statusColors).forEach((color) => {
    console.log(`   - circle-${color}.png`);
  });
};

// Uruchom generowanie
generateAllIcons().catch(console.error);
