const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC_DIR = path.join(__dirname, "../public/images/pre-orders");
const files = [
  "chelsea-away-1", "chelsea-away-2",
  "man-utd-away-1", "man-utd-away-2",
  "real-madrid-away-1", "real-madrid-away-2",
  "barcelona-away-1", "barcelona-away-2",
];

// Consistent aspect matching the site's product card (4:5); garment fills a
// fixed fraction of the canvas so every jersey reads as the same size.
const CANVAS_W = 1200;
const CANVAS_H = 1500;
const FILL_FRACTION = 0.82;

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function analyze(filePath) {
  const img = sharp(filePath);
  const { width, height } = await img.metadata();
  const { data } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

  function px(x, y) {
    const idx = (y * width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  // Sample background from many edge points (median), not a single corner —
  // a corner can land on a watermark icon and poison the whole detection.
  const samples = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    samples.push(px(Math.round(t * (width - 1)), 1));
    samples.push(px(Math.round(t * (width - 1)), height - 2));
    samples.push(px(1, Math.round(t * (height - 1))));
    samples.push(px(width - 2, Math.round(t * (height - 1))));
  }
  const bg = [
    median(samples.map((s) => s[0])),
    median(samples.map((s) => s[1])),
    median(samples.map((s) => s[2])),
  ];

  const THRESH = 18;
  function isBg(x, y) {
    const [r, g, b] = px(x, y);
    return Math.abs(r - bg[0]) < THRESH && Math.abs(g - bg[1]) < THRESH && Math.abs(b - bg[2]) < THRESH;
  }

  // Row/column histograms of non-background pixel counts. A garment spans
  // many contiguous rows/columns with high counts; a small watermark icon or
  // faint diagonal text only lights up a few rows/cols with low counts —
  // this rejects it as noise instead of letting it stretch the bbox.
  const stepY = Math.max(1, Math.floor(height / 500));
  const stepX = Math.max(1, Math.floor(width / 500));
  const rowCounts = new Array(height).fill(0);
  const colCounts = new Array(width).fill(0);

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      if (!isBg(x, y)) {
        rowCounts[y] += stepX;
        colCounts[x] += stepY;
      }
    }
  }

  const rowThreshold = width * 0.08;
  const colThreshold = height * 0.05;

  let minY = 0, maxY = height - 1, minX = 0, maxX = width - 1;
  for (let y = 0; y < height; y++) if (rowCounts[y] > rowThreshold) { minY = y; break; }
  for (let y = height - 1; y >= 0; y--) if (rowCounts[y] > rowThreshold) { maxY = y; break; }
  for (let x = 0; x < width; x++) if (colCounts[x] > colThreshold) { minX = x; break; }
  for (let x = width - 1; x >= 0; x--) if (colCounts[x] > colThreshold) { maxX = x; break; }

  return { minX, maxX, minY, maxY, width, height, bg };
}

async function processOne(name) {
  const inPath = path.join(__dirname, "_preorder-originals", name + ".jpg");
  const bbox = await analyze(inPath);
  const bboxW = bbox.maxX - bbox.minX;
  const bboxH = bbox.maxY - bbox.minY;

  const scaleW = (CANVAS_W * FILL_FRACTION) / bboxW;
  const scaleH = (CANVAS_H * FILL_FRACTION) / bboxH;
  const scale = Math.min(scaleW, scaleH);

  const resizedW = Math.min(CANVAS_W, Math.round(bbox.width * scale));
  const resizedH = Math.min(CANVAS_H, Math.round(bbox.height * scale));

  const cropCenterX = (bbox.minX + bbox.maxX) / 2;
  const cropCenterY = (bbox.minY + bbox.maxY) / 2;
  const resizedCenterX = Math.round(cropCenterX * scale);
  const resizedCenterY = Math.round(cropCenterY * scale);

  const left = Math.round(resizedCenterX - CANVAS_W / 2);
  const top = Math.round(resizedCenterY - CANVAS_H / 2);

  const resized = await sharp(inPath).resize(resizedW, resizedH).toBuffer();

  // Fill with THIS image's own measured background so there's no seam
  // between the source photo's background and the padded canvas.
  const bgFill = { r: bbox.bg[0], g: bbox.bg[1], b: bbox.bg[2] };
  const canvas = sharp({ create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: bgFill } });

  const composited = await canvas
    .composite([{ input: resized, left: -left, top: -top }])
    .jpeg({ quality: 92 })
    .toBuffer();

  const outPath = path.join(SRC_DIR, name + ".jpg");
  const tmpPath = path.join(SRC_DIR, name + ".tmp.jpg");
  fs.writeFileSync(tmpPath, composited);
  fs.renameSync(tmpPath, outPath);
  console.log(name, "-> bbox", bboxW, "x", bboxH, "scale", scale.toFixed(3), "bg", bbox.bg);
}

async function main() {
  for (const f of files) {
    await processOne(f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
