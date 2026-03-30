/**
 * Local Android Build Script for Spentiva
 * Builds APK or AAB locally without EAS
 *
 * Usage:
 *   node scripts/build-android-local.js [--apk|--aab] [--debug|--release]
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const buildApk = args.includes('--apk') || !args.includes('--aab');
const buildAab = args.includes('--aab');
const isDebug = args.includes('--debug');
const isRelease = !isDebug;

const ROOT_DIR = path.resolve(__dirname, '..');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');
const GRADLEW = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

const OUTPUT_DIR = path.join(ROOT_DIR, 'builds');

/**
 * Resolve JAVA_HOME to Android Studio's bundled JBR (JDK 17+)
 * if the system Java is below version 11.
 */
function resolveJavaHome() {
  // If JAVA_HOME is already set and >= 11, use it
  if (process.env.JAVA_HOME) {
    try {
      const ver = execSync(`"${path.join(process.env.JAVA_HOME, 'bin', 'java')}" -version 2>&1`, { encoding: 'utf8' });
      const match = ver.match(/version "(\d+)/);
      if (match && parseInt(match[1], 10) >= 11) {
        return process.env.JAVA_HOME;
      }
    } catch { /* ignore */ }
  }

  // Look for Android Studio's bundled JBR
  const candidates = process.platform === 'win32'
    ? [
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Android', 'Android Studio', 'jbr'),
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Android', 'Android Studio', 'jbr'),
      ]
    : [
        '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
        path.join(process.env.HOME || '', 'android-studio', 'jbr'),
      ];

  for (const candidate of candidates) {
    const javaBin = path.join(candidate, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
    if (fs.existsSync(javaBin)) {
      console.log(`  ✓ Using JDK from Android Studio: ${candidate}`);
      return candidate;
    }
  }

  console.warn('⚠️  Could not find JDK 11+. Build may fail. Install JDK 17+ or use Android Studio\'s JBR.');
  return process.env.JAVA_HOME || '';
}

const JAVA_HOME = resolveJavaHome();

function log(msg) {
  console.log(`\n🔨 ${msg}`);
}

function run(cmd, options = {}) {
  console.log(`  > ${cmd}`);
  try {
    execSync(cmd, {
      stdio: 'inherit',
      cwd: options.cwd || ROOT_DIR,
      env: { ...process.env, JAVA_HOME, ...options.env },
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

function copyBuildOutput() {
  ensureOutputDir();

  const variant = isRelease ? 'release' : 'debug';
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  if (buildApk) {
    const apkDir = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', variant);
    const apkName = `app-${variant}.apk`;
    const apkPath = path.join(apkDir, apkName);

    if (fs.existsSync(apkPath)) {
      const destName = `spentiva-${variant}-${timestamp}.apk`;
      const destPath = path.join(OUTPUT_DIR, destName);
      fs.copyFileSync(apkPath, destPath);
      log(`APK copied to: builds/${destName}`);
      log(`APK size: ${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB`);
    } else {
      console.warn(`⚠️  APK not found at: ${apkPath}`);
      // Try universal APK path
      const universalApk = path.join(apkDir, 'app-universal-release.apk');
      if (fs.existsSync(universalApk)) {
        const destName = `spentiva-universal-${variant}-${timestamp}.apk`;
        const destPath = path.join(OUTPUT_DIR, destName);
        fs.copyFileSync(universalApk, destPath);
        log(`APK copied to: builds/${destName}`);
      }
    }
  }

  if (buildAab) {
    const aabDir = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'bundle', variant);
    const aabName = `app-${variant}.aab`;
    const aabPath = path.join(aabDir, aabName);

    if (fs.existsSync(aabPath)) {
      const destName = `spentiva-${variant}-${timestamp}.aab`;
      const destPath = path.join(OUTPUT_DIR, destName);
      fs.copyFileSync(aabPath, destPath);
      log(`AAB copied to: builds/${destName}`);
      log(`AAB size: ${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB`);
    } else {
      console.warn(`⚠️  AAB not found at: ${aabPath}`);
    }
  }
}

function main() {
  const variant = isRelease ? 'Release' : 'Debug';
  const format = buildAab ? 'AAB (Android App Bundle)' : 'APK';

  console.log('='.repeat(60));
  console.log(`  Spentiva - Local Android Build`);
  console.log(`  Format: ${format} | Variant: ${variant}`);
  console.log('='.repeat(60));

  // Step 1: Run expo prebuild to sync native project
  log('Running expo prebuild to sync native project...');
  run('npx expo prebuild --platform android --no-install');

  // Step 2: Clean previous build
  log('Cleaning previous build...');
  run(`${GRADLEW} clean`, { cwd: ANDROID_DIR });

  // Step 3: Build
  if (buildAab) {
    log(`Building AAB (${variant})...`);
    run(`${GRADLEW} bundle${variant}`, { cwd: ANDROID_DIR });
  } else {
    log(`Building APK (${variant})...`);
    run(`${GRADLEW} assemble${variant}`, { cwd: ANDROID_DIR });
  }

  // Step 4: Copy output
  log('Copying build output...');
  copyBuildOutput();

  console.log('\n' + '='.repeat(60));
  console.log('  ✅ Build Complete!');
  console.log('  Check the builds/ folder for output files.');
  console.log('='.repeat(60) + '\n');
}

main();
