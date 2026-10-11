import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_IMAGE = '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_game_app_icon_1791734601709.jpg';
const ROOT = path.resolve('.');

async function generateIcons() {
  console.log('Generating game app icons from:', SRC_IMAGE);

  // 1. Web icons
  await sharp(SRC_IMAGE)
    .resize(512, 512)
    .png()
    .toFile(path.join(ROOT, 'public/icon-512.png'));
  console.log('✔ public/icon-512.png');

  await sharp(SRC_IMAGE)
    .resize(192, 192)
    .png()
    .toFile(path.join(ROOT, 'public/icon-192.png'));
  console.log('✔ public/icon-192.png');

  await sharp(SRC_IMAGE)
    .resize(64, 64)
    .png()
    .toFile(path.join(ROOT, 'public/favicon.ico'));
  console.log('✔ public/favicon.ico');

  // 2. iOS AppIcon
  const iosIconPath = path.join(ROOT, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
  await sharp(SRC_IMAGE)
    .resize(1024, 1024)
    .removeAlpha()
    .png()
    .toFile(iosIconPath);
  console.log('✔ ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png (1024x1024)');

  // 3. Android mipmap icons
  const densities = [
    { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const d of densities) {
    const dir = path.join(ROOT, 'android/app/src/main/res', d.name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Full standard launcher icon
    await sharp(SRC_IMAGE)
      .resize(d.size, d.size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // Round launcher icon
    // Create circle mask
    const circleBuffer = Buffer.from(
      `<svg width="${d.size}" height="${d.size}"><circle cx="${d.size / 2}" cy="${d.size / 2}" r="${d.size / 2}" fill="#fff" /></svg>`
    );
    await sharp(SRC_IMAGE)
      .resize(d.size, d.size)
      .composite([{ input: circleBuffer, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // Adaptive icon foreground (72% inner safe area)
    const innerSize = Math.round(d.fgSize * 0.72);
    const innerBuf = await sharp(SRC_IMAGE)
      .resize(innerSize, innerSize)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: d.fgSize,
        height: d.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: innerBuf,
        top: Math.round((d.fgSize - innerSize) / 2),
        left: Math.round((d.fgSize - innerSize) / 2)
      }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✔ Android ${d.name} (${d.size}px & ${d.fgSize}px)`);
  }

  // Update Android ic_launcher_background.xml
  const bgXmlPath = path.join(ROOT, 'android/app/src/main/res/values/ic_launcher_background.xml');
  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#142f17</color>
</resources>
`;
  fs.writeFileSync(bgXmlPath, bgXml, 'utf8');
  console.log('✔ Android ic_launcher_background.xml -> #142f17');

  console.log('\nAll app icons successfully generated!');
}

generateIcons().catch(console.error);
