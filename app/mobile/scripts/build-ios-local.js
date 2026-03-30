/**
 * Local iOS Build Script for Spentiva
 * Builds iOS app locally without EAS
 *
 * Usage:
 *   node scripts/build-ios-local.js [--simulator|--device] [--debug|--release]
 *
 * Requirements:
 *   - macOS with Xcode installed
 *   - CocoaPods installed (gem install cocoapods)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const forSimulator = args.includes('--simulator') || !args.includes('--device');
const forDevice = args.includes('--device');
const isDebug = args.includes('--debug');
const isRelease = !isDebug;

const ROOT_DIR = path.resolve(__dirname, '..');
const IOS_DIR = path.join(ROOT_DIR, 'ios');
const OUTPUT_DIR = path.join(ROOT_DIR, 'builds');

const SCHEME = 'Spentiva';
const WORKSPACE = 'Spentiva.xcworkspace';

function log(msg) {
  console.log(`\n🔨 ${msg}`);
}

function run(cmd, options = {}) {
  console.log(`  > ${cmd}`);
  try {
    execSync(cmd, {
      stdio: 'inherit',
      cwd: options.cwd || ROOT_DIR,
      env: { ...process.env, ...options.env },
    });
  } catch (_err) {
    console.error(`\n❌ Command failed: ${cmd}`);
    process.exit(1);
  }
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function main() {
  if (process.platform !== 'darwin') {
    console.error('❌ iOS builds require macOS with Xcode installed.');
    process.exit(1);
  }

  const configuration = isRelease ? 'Release' : 'Debug';
  const target = forDevice ? 'Device' : 'Simulator';

  console.log('='.repeat(60));
  console.log(`  Spentiva - Local iOS Build`);
  console.log(`  Configuration: ${configuration} | Target: ${target}`);
  console.log('='.repeat(60));

  // Step 1: Run expo prebuild to generate/sync iOS native project
  log('Running expo prebuild to sync iOS native project...');
  run('npx expo prebuild --platform ios --no-install');

  // Step 2: Install CocoaPods dependencies
  if (fs.existsSync(path.join(IOS_DIR, 'Podfile'))) {
    log('Installing CocoaPods dependencies...');
    run('pod install', { cwd: IOS_DIR });
  }

  // Step 3: Clean previous build
  log('Cleaning previous build...');
  run(
    `xcodebuild clean -workspace ${WORKSPACE} -scheme ${SCHEME} -configuration ${configuration}`,
    { cwd: IOS_DIR }
  );

  ensureOutputDir();
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  if (forSimulator) {
    // Build for simulator
    log(`Building for iOS Simulator (${configuration})...`);
    const buildDir = path.join(OUTPUT_DIR, 'ios-simulator');

    run(
      `xcodebuild build ` +
        `-workspace ${WORKSPACE} ` +
        `-scheme ${SCHEME} ` +
        `-configuration ${configuration} ` +
        `-sdk iphonesimulator ` +
        `-derivedDataPath "${buildDir}" ` +
        `CODE_SIGNING_ALLOWED=NO`,
      { cwd: IOS_DIR }
    );

    log(`Simulator build complete! Output in: builds/ios-simulator/`);
  } else {
    // Build for device - archive and export IPA
    log(`Archiving for Device (${configuration})...`);
    const archivePath = path.join(OUTPUT_DIR, `Spentiva-${timestamp}.xcarchive`);

    run(
      `xcodebuild archive ` +
        `-workspace ${WORKSPACE} ` +
        `-scheme ${SCHEME} ` +
        `-configuration ${configuration} ` +
        `-archivePath "${archivePath}"`,
      { cwd: IOS_DIR }
    );

    // Create export options plist for ad-hoc distribution
    const exportOptionsPath = path.join(OUTPUT_DIR, 'ExportOptions.plist');
    if (!fs.existsSync(exportOptionsPath)) {
      const exportOptions = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>compileBitcode</key>
    <false/>
    <key>stripSwiftSymbols</key>
    <true/>
</dict>
</plist>`;
      fs.writeFileSync(exportOptionsPath, exportOptions);
      console.warn('\n⚠️  Please update builds/ExportOptions.plist with your Apple Team ID before exporting IPA.');
    }

    log('Exporting IPA...');
    run(
      `xcodebuild -exportArchive ` +
        `-archivePath "${archivePath}" ` +
        `-exportOptionsPlist "${exportOptionsPath}" ` +
        `-exportPath "${OUTPUT_DIR}"`,
      { cwd: IOS_DIR }
    );

    log(`IPA exported to: builds/`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('  ✅ iOS Build Complete!');
  console.log('  Check the builds/ folder for output files.');
  console.log('='.repeat(60) + '\n');
}

main();
