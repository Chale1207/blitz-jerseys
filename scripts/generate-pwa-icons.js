const sharp = require("sharp");
const path = require("path");

const BRAND_TEAL = "#1c695d";
const SRC_MARK = path.join(__dirname, "../public/images/brand/mark-light.png");
const OUT_DIR = path.join(__dirname, "../public/icons");

async function makeIcon({ size, fileName, markScale, background }) {
  const markSize = Math.round(size * markScale);
  const mark = await sharp(SRC_MARK).resize(markSize, markSize, { fit: "contain" }).toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_DIR, fileName));

  console.log(`Wrote ${fileName} (${size}x${size})`);
}

async function main() {
  const fs = require("fs");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Regular "any" purpose icons — mark fills most of the canvas, solid brand
  // background so it reads clearly at small sizes on any launcher.
  for (const size of [192, 512]) {
    await makeIcon({
      size,
      fileName: `icon-${size}.png`,
      markScale: 0.62,
      background: BRAND_TEAL,
    });
  }

  // Maskable icon — Android adaptive icons crop to various shapes (circle,
  // squircle, etc), so the mark must sit inside the ~66% safe zone or it
  // gets clipped on some launchers.
  await makeIcon({
    size: 512,
    fileName: "icon-maskable-512.png",
    markScale: 0.5,
    background: BRAND_TEAL,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
