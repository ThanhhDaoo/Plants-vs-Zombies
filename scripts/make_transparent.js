import sharp from 'sharp';

async function removeBackgroundFloodFill(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Background threshold (near pure white)
    return r > 235 && g > 235 && b > 235;
  }

  // Add all border pixels that are near white
  for (let x = 0; x < width; x++) {
    const topIdx = (0 * width + x) * channels;
    const botIdx = ((height - 1) * width + x) * channels;
    if (isWhite(topIdx)) { queue.push(x, 0); visited[0 * width + x] = 1; }
    if (isWhite(botIdx)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    const leftIdx = (y * width + 0) * channels;
    const rightIdx = (y * width + (width - 1)) * channels;
    if (isWhite(leftIdx)) { queue.push(0, y); visited[y * width + 0] = 1; }
    if (isWhite(rightIdx)) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
  }

  // BFS flood fill from edges
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const cIdx = (cy * width + cx) * channels;
    data[cIdx + 3] = 0; // Make transparent

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          const nIdx = nPos * channels;
          if (isWhite(nIdx)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim()
    .resize({ height: 260, withoutEnlargement: false }) // standard game sprite height
    .png()
    .toFile(outputPath);

  console.log(`Processed: ${outputPath}`);
}

const zombies = [
  {
    in: '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_zombie_sprite_1791646940588.jpg',
    out: '/Users/thanhdao/Documents/plantsvszombiesjs.github.io/public/assets/zombie_normal.png'
  },
  {
    in: '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_conehead_zombie_1791647013237.jpg',
    out: '/Users/thanhdao/Documents/plantsvszombiesjs.github.io/public/assets/zombie_cone.png'
  },
  {
    in: '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_buckethead_zombie_1791647033946.jpg',
    out: '/Users/thanhdao/Documents/plantsvszombiesjs.github.io/public/assets/zombie_bucket.png'
  },
  {
    in: '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_football_zombie_1791647057672.jpg',
    out: '/Users/thanhdao/Documents/plantsvszombiesjs.github.io/public/assets/zombie_fast.png'
  },
  {
    in: '/Users/thanhdao/.gemini/antigravity-ide/brain/b5b2500f-3060-4d03-9602-dc9c78721976/pvz_gargantuar_zombie_1791647082912.jpg',
    out: '/Users/thanhdao/Documents/plantsvszombiesjs.github.io/public/assets/zombie_strong.png'
  }
];

async function run() {
  for (const z of zombies) {
    await removeBackgroundFloodFill(z.in, z.out);
  }
}

run();
