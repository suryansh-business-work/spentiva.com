const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, 'app/mobile/assets/spentiva-logo.png');

async function makeTransparent(inputBuffer) {
  // The source image has a white background - remove it
  // Extract raw pixel data, make near-white pixels transparent
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const output = Buffer.from(data);

  for (let i = 0; i < width * height * channels; i += channels) {
    const r = output[i];
    const g = output[i + 1];
    const b = output[i + 2];
    // If pixel is near-white (background), make it transparent
    if (r > 240 && g > 240 && b > 240) {
      output[i + 3] = 0; // Set alpha to 0
    }
  }

  return sharp(output, { raw: { width, height, channels } }).png().toBuffer();
}

async function generate() {
  console.log('Reading source image...');
  const sourceBuffer = fs.readFileSync(SOURCE);

  console.log('Making background transparent...');
  const transparentBuffer = await makeTransparent(sourceBuffer);

  // Save the transparent master (2000x2000)
  const masterPath = path.join(__dirname, 'app/mobile/assets/spentiva-logo.png');
  fs.writeFileSync(masterPath, transparentBuffer);
  console.log('Saved transparent master: app/mobile/assets/spentiva-logo.png');

  // ===== MOBILE APP VARIANTS =====

  // 1. App icon (1024x1024) - with padding for proper display
  const iconBuffer = await sharp(transparentBuffer)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/mobile/assets/icon.png'), iconBuffer);
  console.log('Generated: app/mobile/assets/icon.png (1024x1024)');

  // 2. Adaptive icon foreground (432x432 with safe zone padding)
  // Android adaptive icons need ~66% safe zone, so logo at ~280px centered in 432
  const adaptiveBuffer = await sharp({
    create: { width: 432, height: 432, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{
      input: await sharp(transparentBuffer).resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
      gravity: 'centre'
    }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/mobile/assets/adaptive-icon.png'), adaptiveBuffer);
  console.log('Generated: app/mobile/assets/adaptive-icon.png (432x432)');

  // 3. Splash screen (1284x2778 - iPhone 14 Pro Max size, works for Android too)
  // Logo centered, ~400px wide on transparent/white background
  const splashBuffer = await sharp({
    create: { width: 1284, height: 2778, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } }
  })
    .composite([{
      input: await sharp(transparentBuffer).resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
      gravity: 'centre'
    }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/mobile/assets/splash.png'), splashBuffer);
  console.log('Generated: app/mobile/assets/splash.png (1284x2778)');

  // 4. Favicon (48x48)
  const faviconMobileBuffer = await sharp(transparentBuffer)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/mobile/assets/favicon.png'), faviconMobileBuffer);
  console.log('Generated: app/mobile/assets/favicon.png (48x48)');

  // ===== WEB UI VARIANTS =====

  // Logo for web UI (transparent, 512x512 for PWA)
  const webLogoBuffer = await sharp(transparentBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/ui/public/spentiva-logo.png'), webLogoBuffer);
  console.log('Generated: app/ui/public/spentiva-logo.png (512x512)');

  // PWA icon (192x192)
  const pwa192Buffer = await sharp(transparentBuffer)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/ui/public/icon-192.png'), pwa192Buffer);
  console.log('Generated: app/ui/public/icon-192.png (192x192)');

  // PWA icon (512x512)
  fs.writeFileSync(path.join(__dirname, 'app/ui/public/icon-512.png'), webLogoBuffer);
  console.log('Generated: app/ui/public/icon-512.png (512x512)');

  // Favicon for web (32x32)
  const faviconWebBuffer = await sharp(transparentBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/ui/public/favicon.png'), faviconWebBuffer);
  console.log('Generated: app/ui/public/favicon.png (32x32)');

  // Apple touch icon (180x180)
  const appleTouchBuffer = await sharp(transparentBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'app/ui/public/apple-touch-icon.png'), appleTouchBuffer);
  console.log('Generated: app/ui/public/apple-touch-icon.png (180x180)');

  // ===== WEBSITE VARIANTS =====

  // Website logo (transparent, 512x512)
  fs.writeFileSync(path.join(__dirname, 'website/public/spentiva-logo.png'), webLogoBuffer);
  console.log('Generated: website/public/spentiva-logo.png (512x512)');

  // Website favicon (32x32)
  fs.writeFileSync(path.join(__dirname, 'website/public/favicon.png'), faviconWebBuffer);
  console.log('Generated: website/public/favicon.png (32x32)');

  // OG image (1200x630) - for social sharing
  const ogBuffer = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } }
  })
    .composite([{
      input: await sharp(transparentBuffer).resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
      gravity: 'centre'
    }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, 'website/public/og-image.png'), ogBuffer);
  console.log('Generated: website/public/og-image.png (1200x630)');

  console.log('\nAll logo variants generated successfully!');
}

generate().catch(console.error);
