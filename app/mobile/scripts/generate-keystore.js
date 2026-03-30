/**
 * Generate a release keystore for signing Android APK/AAB
 *
 * Usage: node scripts/generate-keystore.js
 *
 * This creates a keystore at android/app/release.keystore
 * You will be prompted for passwords and identity info.
 *
 * IMPORTANT: Keep the keystore and passwords safe!
 * If you lose them, you cannot update your app on Play Store.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const KEYSTORE_PATH = path.join(__dirname, '..', 'android', 'app', 'release.keystore');
const KEYSTORE_ALIAS = 'spentiva-release';

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Spentiva - Release Keystore Generator');
  console.log('='.repeat(60));

  if (fs.existsSync(KEYSTORE_PATH)) {
    console.log('\n⚠️  Release keystore already exists at:');
    console.log(`   ${KEYSTORE_PATH}`);
    const overwrite = await prompt('\nOverwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
    fs.unlinkSync(KEYSTORE_PATH);
  }

  const storePassword = await prompt('Enter keystore password (min 6 chars): ');
  if (storePassword.length < 6) {
    console.error('❌ Password must be at least 6 characters.');
    process.exit(1);
  }

  const keyPassword = await prompt('Enter key password (or press Enter to use same): ') || storePassword;
  const cn = await prompt('Your name (CN): ') || 'Spentiva';
  const org = await prompt('Organization (O): ') || 'Spentiva';

  console.log('\n🔑 Generating release keystore...');

  const dname = `CN=${cn}, O=${org}, L=Unknown, ST=Unknown, C=IN`;

  try {
    execSync(
      `keytool -genkeypair -v ` +
        `-keystore "${KEYSTORE_PATH}" ` +
        `-alias ${KEYSTORE_ALIAS} ` +
        `-keyalg RSA -keysize 2048 -validity 10000 ` +
        `-storepass "${storePassword}" ` +
        `-keypass "${keyPassword}" ` +
        `-dname "${dname}"`,
      { stdio: 'inherit' }
    );
  } catch {
    console.error('❌ Failed to generate keystore. Make sure keytool (Java JDK) is installed.');
    process.exit(1);
  }

  console.log('\n✅ Release keystore created at:');
  console.log(`   ${KEYSTORE_PATH}`);

  console.log('\n📝 Add these to your gradle.properties (android/gradle.properties):');
  console.log('   SPENTIVA_RELEASE_STORE_FILE=release.keystore');
  console.log(`   SPENTIVA_RELEASE_KEY_ALIAS=${KEYSTORE_ALIAS}`);
  console.log(`   SPENTIVA_RELEASE_STORE_PASSWORD=${storePassword}`);
  console.log(`   SPENTIVA_RELEASE_KEY_PASSWORD=${keyPassword}`);

  console.log('\n⚠️  NEVER commit the keystore or passwords to git!');
  console.log('   Make sure android/app/release.keystore is in .gitignore');
}

main();
