const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = path.join(__dirname, "../public/images/pre-orders");
const files = ["real-madrid-away-1.jpg", "real-madrid-away-2.jpg"];

// Watermark asterisk sits roughly at x:50-170, y:110-230 on the 1200x1500
// canvas. Paint over it with the image's own white background.
const PATCH = { left: 30, top: 90, width: 180, height: 180 };

async function removeWatermark(file) {
  const inPath = path.join(DIR, file);
  const patch = await sharp({
    create: {
      width: PATCH.width,
      height: PATCH.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .jpeg()
    .toBuffer();

  const result = await sharp(inPath)
    .composite([{ input: patch, left: PATCH.left, top: PATCH.top }])
    .jpeg({ quality: 92 })
    .toBuffer();

  const tmpPath = inPath.replace(".jpg", ".tmp.jpg");
  fs.writeFileSync(tmpPath, result);
  fs.renameSync(tmpPath, inPath);
  console.log("patched", file);
}

async function main() {
  for (const f of files) {
    await removeWatermark(f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
