// Non-interactive Bubblewrap first-run setup. The CLI's own wizard uses
// inquirer, which needs a real TTY this environment doesn't have. This
// drives the exact same config.js / installer code with a scripted prompt
// instead, so behavior matches a real interactive run: use the JDK already
// on this machine, let Bubblewrap download the Android command-line tools.
const path = require("path");
const os = require("os");
const { Config } = require("@bubblewrap/core");
const { JdkHelper, AndroidSdkTools, ConsoleLog, fetchUtils } = require("@bubblewrap/core");
const { AndroidSdkToolsInstaller } = require("@bubblewrap/cli/dist/lib/AndroidSdkToolsInstaller");

const EXISTING_JDK_PATH = "C:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot";
const CONFIG_FOLDER = path.join(os.homedir(), ".bubblewrap");
const CONFIG_PATH = path.join(CONFIG_FOLDER, "config.json");
const SDK_FOLDER = path.join(CONFIG_FOLDER, "android_sdk");

class ScriptedPrompt {
  async printMessage(message) {
    console.log(message);
  }
  async promptInput(message, defaultValue, validateFunction) {
    // Only asked when NOT auto-installing — we always auto-install, so this
    // path isn't exercised, but return the existing JDK path defensively.
    const result = await validateFunction(EXISTING_JDK_PATH);
    return result.unwrap();
  }
  async promptConfirm(message) {
    return true;
  }
  async promptChoice(message, choices, defaultValue) {
    return defaultValue;
  }
  async downloadFile(url, filename, totalSize = 0) {
    console.log(`Downloading ${url} -> ${filename}`);
    let lastPct = -1;
    await fetchUtils.downloadFile(url, filename, (current, total) => {
      const pct = total > 0 ? Math.floor((current / total) * 100) : 0;
      if (pct !== lastPct && pct % 10 === 0) {
        console.log(`  ${pct}%`);
        lastPct = pct;
      }
    });
    console.log("Download complete.");
  }
}

async function main() {
  const fs = require("fs");
  fs.mkdirSync(CONFIG_FOLDER, { recursive: true });

  let config = await Config.loadConfig(CONFIG_PATH);
  if (!config) {
    config = new Config("", "");
  }

  // JDK: use what's already installed rather than downloading a second one.
  if (!config.jdkPath) {
    console.log(`Using existing JDK at ${EXISTING_JDK_PATH}`);
    const validation = await JdkHelper.validatePath(EXISTING_JDK_PATH);
    if (validation.isOk && !validation.isOk()) {
      throw new Error(`JDK path invalid: ${validation.unwrapError().message}`);
    }
    config.jdkPath = EXISTING_JDK_PATH;
    await config.saveConfig(CONFIG_PATH);
  }

  // Android SDK: not installed anywhere on this machine, so download it.
  if (!config.androidSdkPath) {
    fs.mkdirSync(SDK_FOLDER, { recursive: true });
    console.log(`Downloading Android command-line tools to ${SDK_FOLDER} ...`);
    const installer = new AndroidSdkToolsInstaller(process, new ScriptedPrompt());
    await installer.install(SDK_FOLDER);
    config.androidSdkPath = SDK_FOLDER;
    await config.saveConfig(CONFIG_PATH);
    console.log("Android SDK command-line tools installed.");
  }

  console.log("Config saved:", CONFIG_PATH);
  console.log(config);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
