// Programmatic TWA project init — avoids the interactive CLI wizard.
// Fetches the live manifest, overrides fields we want to control, then
// generates the Android Gradle project into ./android/.
const path = require("path");
const os = require("os");
const { TwaManifest, TwaGenerator, ConsoleLog } = require("@bubblewrap/core");

const MANIFEST_URL = "https://blitz-jerseys.vercel.app/manifest.json";
const PACKAGE_ID = "com.blitzjerseys.app";
const OUTPUT_DIR = path.join(__dirname, "..", "android");

// Keystore lives alongside the android project; we'll generate it with
// keytool immediately after this script runs.
const KEYSTORE_PATH = path.join(OUTPUT_DIR, "blitz-jerseys.keystore");
const KEYSTORE_ALIAS = "blitzjerseys";

async function main() {
  console.log("Fetching web manifest from", MANIFEST_URL);
  const twaManifest = await TwaManifest.fromWebManifest(MANIFEST_URL);

  // Override defaults that the wizard would normally ask about.
  twaManifest.packageId = PACKAGE_ID;
  twaManifest.appVersion = "1";
  twaManifest.appVersionName = "1.0.0";
  twaManifest.signingKey = {
    path: KEYSTORE_PATH,
    alias: KEYSTORE_ALIAS,
  };

  console.log("Package ID :", twaManifest.packageId);
  console.log("App name   :", twaManifest.name);
  console.log("Start URL  :", twaManifest.startUrl);
  console.log("Theme color:", twaManifest.themeColor);
  console.log("Output     :", OUTPUT_DIR);

  const log = new ConsoleLog("twa-init");
  const generator = new TwaGenerator();

  console.log("\nGenerating Android project…");
  await generator.createTwaProject(OUTPUT_DIR, twaManifest, log);

  // Save the twa-manifest.json so bubblewrap build can read it later.
  await twaManifest.saveToFile(path.join(OUTPUT_DIR, "twa-manifest.json"));

  console.log("\nDone! Project generated at:", OUTPUT_DIR);
  console.log(
    "\nNext: generate the signing keystore with:\n  node scripts/twa-keygen.js"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
