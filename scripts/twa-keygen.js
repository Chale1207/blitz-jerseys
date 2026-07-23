// Generate a signing keystore for the TWA build using the JDK keytool.
// The keystore is written to android/blitz-jerseys.keystore.
// The SHA-256 fingerprint is printed — you'll need it for assetlinks.json.
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const JDK_BIN = "C:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot\\bin";
const KEYTOOL = path.join(JDK_BIN, "keytool.exe");

const KEYSTORE = path.join(__dirname, "..", "android", "blitz-jerseys.keystore");
const ALIAS = "blitzjerseys";
// Keep this password; you'll need it for Gradle signing config.
const STORE_PASS = "blitzjerseys2026";
const KEY_PASS = "blitzjerseys2026";
const DNAME =
  "CN=Blitz Jerseys, OU=Mobile, O=Blitz Jerseys, L=Lusaka, ST=Lusaka, C=ZM";

if (fs.existsSync(KEYSTORE)) {
  console.log("Keystore already exists at", KEYSTORE);
} else {
  console.log("Generating keystore…");
  execFileSync(
    KEYTOOL,
    [
      "-genkeypair",
      "-v",
      "-keystore", KEYSTORE,
      "-alias", ALIAS,
      "-keyalg", "RSA",
      "-keysize", "2048",
      "-validity", "10000",
      "-storepass", STORE_PASS,
      "-keypass", KEY_PASS,
      "-dname", DNAME,
    ],
    { stdio: "inherit" }
  );
  console.log("\nKeystore written to:", KEYSTORE);
}

// Print the SHA-256 certificate fingerprint needed for assetlinks.json.
console.log("\nSHA-256 fingerprint:");
execFileSync(
  KEYTOOL,
  [
    "-list",
    "-v",
    "-keystore", KEYSTORE,
    "-alias", ALIAS,
    "-storepass", STORE_PASS,
  ],
  { stdio: "inherit" }
);
