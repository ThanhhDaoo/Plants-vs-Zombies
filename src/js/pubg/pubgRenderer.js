// High-Performance 2D Canvas Renderer for PvZ Battle Royale
import { pubgState, MAP_CONFIG } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';

export function renderPubg(ctx, canvas) {
  const p = pubgState.player;
  const cam = pubgState.camera;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Center camera smoothly on player
  ctx.translate(canvas.width / 2 - cam.x, canvas.height / 2 - cam.y);

  // 1. Draw Battlefield Map Grid, Lawn Pattern & Environment
  drawBattlefield(ctx);

  // 2. Draw Crates & Ground Loot Items
  drawCratesAndItems(ctx);

  // 3. Draw Safe Zone Border & Electric Cyan Storm
  drawZone(ctx);

  // 4. Draw Boss Shockwaves
  drawShockwaves(ctx);

  // 5. Draw Zombies (All Tiers with Detailed Graphics)
  drawZombies(ctx);

  // 6. Draw Player (Elite Peashooter Commando)
  drawPlayer(ctx, p);

  // 7. Draw Projectiles & Enemy Acid Spits
  drawProjectiles(ctx);

  // 8. Draw Particles (Sparks, Hits, Dust)
  drawParticles(ctx);

  // 9. Draw Floating Numbers & Loot Popups
  drawFloatingTexts(ctx);

  ctx.restore();

  // 10. Screen UI Overlays: Minimap, Out-of-zone Warning, Virtual Joysticks
  drawScreenOverlays(ctx, canvas);
}

function drawBattlefield(ctx) {
  // Base rich grass
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(0, 0, MAP_CONFIG.WIDTH, MAP_CONFIG.HEIGHT);

  // Alternating lawn checkerboard pattern
  const tileSize = 120;
  ctx.fillStyle = '#388e3c';
  for (let x = 0; x < MAP_CONFIG.WIDTH; x += tileSize) {
    for (let y = 0; y < MAP_CONFIG.HEIGHT; y += tileSize) {
      if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // Tactical Dirt crossroads
  ctx.fillStyle = 'rgba(109, 76, 65, 0.45)';
  ctx.fillRect(0, MAP_CONFIG.HEIGHT / 2 - 50, MAP_CONFIG.WIDTH, 100);
  ctx.fillRect(MAP_CONFIG.WIDTH / 2 - 50, 0, 100, MAP_CONFIG.HEIGHT);

  // Center boss plaza (Stone circle)
  ctx.save();
  ctx.beginPath();
  ctx.arc(MAP_CONFIG.WIDTH / 2, MAP_CONFIG.HEIGHT / 2, 170, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(189, 189, 189, 0.4)';
  ctx.fill();
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Center emblem
  ctx.beginPath();
  ctx.arc(MAP_CONFIG.WIDTH / 2, MAP_CONFIG.HEIGHT / 2, 70, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 179, 0, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#ffb300';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Outer fortified boundary fence
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#3e2723';
  ctx.strokeRect(8, 8, MAP_CONFIG.WIDTH - 16, MAP_CONFIG.HEIGHT - 16);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffb300';
  ctx.strokeRect(16, 16, MAP_CONFIG.WIDTH - 32, MAP_CONFIG.HEIGHT - 32);
}

function drawZone(ctx) {
  const z = pubgState.zone;

  // Next Zone Target (White dashed ring)
  ctx.beginPath();
  ctx.arc(z.targetCenterX, z.targetCenterY, z.targetRadius, 0, Math.PI * 2);
  ctx.setLineDash([14, 12]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.setLineDash([]);

  // Current Safe Zone (Electric Blue / Cyan Ring)
  const pulse = Math.sin(Date.now() / 200) * 5;
  ctx.beginPath();
  ctx.arc(z.centerX, z.centerY, z.radius + pulse, 0, Math.PI * 2);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 7;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Blue Zone danger storm fog outside
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, MAP_CONFIG.WIDTH, MAP_CONFIG.HEIGHT);
  ctx.arc(z.centerX, z.centerY, z.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(10, 25, 60, 0.42)';
  ctx.fill();
  ctx.restore();
}

function drawShockwaves(ctx) {
  if (!pubgState.shockwaves) return;
  pubgState.shockwaves.forEach((sw) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 87, 34, ${sw.alpha})`;
    ctx.lineWidth = 8;
    ctx.shadowColor = '#ff5722';
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.restore();
  });
}

function drawCratesAndItems(ctx) {
  // 1. Crates
  pubgState.crates.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);

    // Crate Shadow
    ctx.beginPath();
    ctx.ellipse(0, 22, 24, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // Box body
    ctx.fillStyle = c.isAirdrop ? '#d32f2f' : '#8d6e63';
    ctx.fillRect(-22, -22, 44, 44);
    ctx.strokeStyle = c.isAirdrop ? '#ffeb3b' : '#4e342e';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22, -22, 44, 44);

    // Reinforcements
    ctx.beginPath();
    ctx.moveTo(-22, -22);
    ctx.lineTo(22, 22);
    ctx.moveTo(22, -22);
    ctx.lineTo(-22, 22);
    ctx.stroke();

    // Airdrop parachute icon / star
    if (c.isAirdrop) {
      ctx.fillStyle = '#ffeb3b';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐', 0, 0);
    }

    // Health bar if damaged
    if (c.health < c.maxHealth) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(-20, -32, 40, 5);
      ctx.fillStyle = '#ffca28';
      ctx.fillRect(-20, -32, (c.health / c.maxHealth) * 40, 5);
    }
    ctx.restore();
  });

  // 2. Ground Loot Items
  pubgState.groundItems.forEach((item) => {
    const floatY = Math.sin(Date.now() / 260 + item.x) * 4;
    ctx.save();
    ctx.translate(item.x, item.y + floatY);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 16 - floatY, 14, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Rarity aura glow
    const isEpic = item.type === 'brain' || item.isWeapon;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = isEpic ? 'rgba(156, 39, 176, 0.35)' : 'rgba(255, 215, 0, 0.35)';
    ctx.fill();
    ctx.strokeStyle = isEpic ? '#e040fb' : '#ffd54f';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Emoji icon
    ctx.font = isEpic ? '22px sans-serif' : '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 0, 0);

    // Item label badge
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(item.name, 0, -24);
    ctx.shadowBlur = 0;
    ctx.restore();
  });
}

function drawZombies(ctx) {
  pubgState.zombies.forEach((z) => {
    ctx.save();
    ctx.translate(z.x, z.y);

    const r = z.radius;
    const walk = z.walkCycle || 0;
    const isMoving = z.vx !== 0 || z.vy !== 0 || true; // zombies always shamble
    const shambleAngle = Math.sin(walk) * 0.14; // Limp tilt
    const shambleBob = Math.sin(walk * 2) * 1.8; // Vertical bob
    const armL = Math.sin(walk) * 9; // Left arm reach
    const armR = -Math.sin(walk) * 9; // Right arm reach

    // 1. Soft Dynamic Ambient Shadow underneath
    ctx.beginPath();
    ctx.ellipse(0, r * 0.88, r * 1.05 + Math.abs(Math.sin(walk)) * 2, r * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.fill();

    // Rotate towards facing angle + shambling limp
    ctx.rotate(z.angle + shambleAngle);
    ctx.translate(shambleBob, 0);

    // 2. Palette Selection based on Zombie Tier & Status
    let skinBase = '#7ea077';
    let skinShadow = '#516f4b';
    let skinHighlight = '#a3c59b';
    let coatColor = '#4a3f35';
    let tieColor = '#d32f2f';

    if (z.slowTimer > 0) {
      skinBase = '#80deea';
      skinShadow = '#0097a7';
      skinHighlight = '#e0f7fa';
      coatColor = '#263238';
    } else if (z.type === 'toxic') {
      skinBase = '#00e676';
      skinShadow = '#00a152';
      skinHighlight = '#b9f6ca';
      coatColor = '#1b5e20';
      tieColor = '#ffea00';
    } else if (z.type === 'runner') {
      skinBase = '#8ca88b';
      skinShadow = '#597058';
      skinHighlight = '#b2ccb1';
      coatColor = '#b71c1c';
      tieColor = '#ffffff';
    } else if (z.type === 'boss') {
      skinBase = '#435865';
      skinShadow = '#26343d';
      skinHighlight = '#78909c';
      coatColor = '#121d23';
      tieColor = '#ff1744';
    }

    // --- 3. Tattered Suit Coat & White Collar (Back/Torso) ---
    // Torn business suit jacket
    ctx.beginPath();
    ctx.rect(-r * 1.05, -r * 0.72, r * 0.92, r * 1.44);
    ctx.fillStyle = coatColor;
    ctx.fill();
    ctx.strokeStyle = '#18120b';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Ragged jagged tears on suit hem
    ctx.beginPath();
    ctx.moveTo(-r * 1.05, -r * 0.72);
    ctx.lineTo(-r * 1.18, -r * 0.38);
    ctx.lineTo(-r * 1.05, -r * 0.1);
    ctx.lineTo(-r * 1.22, r * 0.22);
    ctx.lineTo(-r * 1.05, r * 0.52);
    ctx.lineTo(-r * 1.16, r * 0.72);
    ctx.fillStyle = coatColor;
    ctx.fill();

    // White shirt collar lapels
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -6);
    ctx.lineTo(r * 0.12, -2.5);
    ctx.lineTo(-r * 0.15, 0);
    ctx.lineTo(r * 0.12, 2.5);
    ctx.lineTo(-r * 0.15, 6);
    ctx.closePath();
    ctx.fill();

    // Ragged Red Tie dangling & swaying
    ctx.save();
    ctx.translate(r * 0.08, 0);
    ctx.rotate(-shambleAngle * 2);
    ctx.fillStyle = tieColor;
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(12, -1.8);
    ctx.lineTo(16, 0);
    ctx.lineTo(12, 1.8);
    ctx.lineTo(0, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7f0000';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // --- 4. Articulated Reaching Arms with Claws ---
    drawZombieArm(ctx, r, coatColor, skinBase, -r * 0.35, -r * 0.82, armL);
    drawZombieArm(ctx, r, coatColor, skinBase, -r * 0.35, r * 0.82, armR);

    // --- 5. Authentic PvZ Zombie Head with 3D Shading ---
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    const headGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.15, 0, 0, r);
    headGrad.addColorStop(0, skinHighlight);
    headGrad.addColorStop(0.65, skinBase);
    headGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = headGrad;
    ctx.fill();
    ctx.strokeStyle = '#1b2718';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Decaying comic ears on sides
    ctx.fillStyle = skinBase;
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, -r * 0.96, 4.5, 3.2, 0.3, 0, Math.PI * 2);
    ctx.ellipse(-r * 0.1, r * 0.96, 4.5, 3.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sparse wispy black hairs on balding head
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -5);
    ctx.quadraticCurveTo(-r * 1.05, -9 + shambleAngle * 8, -r * 0.95, -14);
    ctx.moveTo(-r * 0.8, 0);
    ctx.quadraticCurveTo(-r * 1.15, shambleAngle * 10, -r * 1.08, -3);
    ctx.moveTo(-r * 0.7, 5);
    ctx.quadraticCurveTo(-r * 1.05, 9 + shambleAngle * 8, -r * 0.95, 14);
    ctx.stroke();

    // --- 6. Open Slack Jaw & Crooked Teeth ---
    ctx.beginPath();
    ctx.ellipse(r * 0.62, 0, r * 0.28, r * 0.42, 0, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = '#160808';
    ctx.fill();
    ctx.strokeStyle = '#1b2718';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Goofy pink tongue
    ctx.fillStyle = '#e57373';
    ctx.beginPath();
    ctx.ellipse(r * 0.65, 2, 4, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Crooked yellow teeth
    ctx.fillStyle = '#fff9c4';
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 1;
    // Tooth 1
    ctx.fillRect(r * 0.55, -7, 3.5, 3.5);
    ctx.strokeRect(r * 0.55, -7, 3.5, 3.5);
    // Tooth 2
    ctx.fillRect(r * 0.6, 4, 3.5, 3.5);
    ctx.strokeRect(r * 0.6, 4, 3.5, 3.5);
    // Tooth 3
    ctx.fillRect(r * 0.52, -1, 3, 3);
    ctx.strokeRect(r * 0.52, -1, 3, 3);

    // --- 7. Iconic Asymmetric Derpy Eyes ---
    // Left eye (big bulging eye)
    ctx.save();
    ctx.translate(r * 0.18, -r * 0.36);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.29, 0, Math.PI * 2);
    ctx.fillStyle = '#fffde7';
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    // Tiny pupil looking forward
    ctx.fillStyle = z.type === 'boss' ? '#ff1744' : '#1a1a1a';
    ctx.beginPath();
    ctx.arc(r * 0.08, -r * 0.04, r * 0.11, 0, Math.PI * 2);
    ctx.fill();
    // Specular shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(r * 0.05, -r * 0.08, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right eye (smaller droopy eye with heavy lid)
    ctx.save();
    ctx.translate(r * 0.18, r * 0.36);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.23, 0, Math.PI * 2);
    ctx.fillStyle = '#fff9c4';
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.9;
    ctx.stroke();
    // Off-center pupil
    ctx.fillStyle = z.type === 'boss' ? '#ff1744' : '#1a1a1a';
    ctx.beginPath();
    ctx.arc(r * 0.06, r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
    // Specular shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(r * 0.03, r * 0.02, 1.4, 0, Math.PI * 2);
    ctx.fill();
    // Droopy decaying eyelid
    ctx.fillStyle = skinBase;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.23, Math.PI * 1.15, Math.PI * 1.85);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // --- 8. Special Tier Visuals ---
    // 1. Conehead
    if (z.type === 'conehead') {
      ctx.save();
      ctx.translate(-r * 0.08, 0);
      // Flanged base rim
      ctx.fillStyle = '#e65100';
      ctx.beginPath();
      ctx.ellipse(r * 0.28, 0, 5, r * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#bf360c';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Vibrant orange cone body
      const coneGrad = ctx.createLinearGradient(0, -r * 0.65, 0, r * 0.65);
      coneGrad.addColorStop(0, '#ff9800');
      coneGrad.addColorStop(0.4, '#ff5722');
      coneGrad.addColorStop(1, '#d84315');
      ctx.beginPath();
      ctx.moveTo(r * 0.28, -r * 0.68);
      ctx.lineTo(r * 0.28, r * 0.68);
      ctx.lineTo(-r * 0.95, 0);
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();
      ctx.stroke();

      // Reflective white safety stripes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.05, -r * 0.44);
      ctx.lineTo(-r * 0.05, r * 0.44);
      ctx.moveTo(-r * 0.48, -r * 0.24);
      ctx.lineTo(-r * 0.48, r * 0.24);
      ctx.stroke();

      // Black chin strap
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r * 0.12, 0, r * 0.85, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Buckethead
    else if (z.type === 'buckethead') {
      ctx.save();
      ctx.translate(-r * 0.08, 0);
      const bucketGrad = ctx.createLinearGradient(0, -r * 0.78, 0, r * 0.78);
      bucketGrad.addColorStop(0, '#eceff1');
      bucketGrad.addColorStop(0.35, '#b0bec5');
      bucketGrad.addColorStop(0.7, '#78909c');
      bucketGrad.addColorStop(1, '#455a64');

      // Bucket body with rounded edges
      ctx.beginPath();
      ctx.roundRect(-r * 0.85, -r * 0.75, r * 1.25, r * 1.5, [4, 8, 8, 4]);
      ctx.fillStyle = bucketGrad;
      ctx.fill();
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Rolled rim lip
      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(r * 0.35, -r * 0.8, 5, r * 1.6);
      ctx.strokeRect(r * 0.35, -r * 0.8, 5, r * 1.6);

      // Rib ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, -r * 0.7);
      ctx.lineTo(-r * 0.35, r * 0.7);
      ctx.stroke();

      // Steel wire handle
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.85, r * 0.5, 0, Math.PI);
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Battle dent
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.arc(-r * 0.42, -r * 0.2, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Football Runner
    else if (z.type === 'runner') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(-r * 0.15, 0, r * 0.95, 0, Math.PI * 2);
      const helmGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, -r * 0.15, 0, r);
      helmGrad.addColorStop(0, '#ef5350');
      helmGrad.addColorStop(0.6, '#d32f2f');
      helmGrad.addColorStop(1, '#b71c1c');
      ctx.fillStyle = helmGrad;
      ctx.fill();
      ctx.strokeStyle = '#1b120c';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // Center white racing stripe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-r * 1.05, 0);
      ctx.lineTo(r * 0.65, 0);
      ctx.stroke();

      // Steel face grill cage
      ctx.strokeStyle = '#eceff1';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(r * 0.35, -8);
      ctx.lineTo(r * 0.8, -8);
      ctx.moveTo(r * 0.45, 0);
      ctx.lineTo(r * 0.88, 0);
      ctx.moveTo(r * 0.35, 8);
      ctx.lineTo(r * 0.8, 8);
      ctx.moveTo(r * 0.7, -9);
      ctx.lineTo(r * 0.7, 9);
      ctx.stroke();

      // Red padded shoulders
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(-r * 0.9, -r * 1.25, 12, 6);
      ctx.fillRect(-r * 0.9, r * 1.25 - 6, 12, 6);
      ctx.restore();
    }

    // 4. Toxic Zombie
    else if (z.type === 'toxic') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.28 + Math.sin(Date.now() * 0.006) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const bub1 = Math.sin(Date.now() * 0.008) * 2;
      ctx.fillStyle = '#69f0ae';
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.5, 4 + bub1, 0, Math.PI * 2);
      ctx.arc(-r * 0.2, r * 0.5, 3.5 - bub1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Shield Zombie
    else if (z.type === 'shield') {
      ctx.save();
      ctx.translate(r + 6, 0);
      // Weathered wood door
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(0, -r * 1.3, 11, r * 2.6);
      ctx.strokeStyle = '#27170e';
      ctx.lineWidth = 2.6;
      ctx.strokeRect(0, -r * 1.3, 11, r * 2.6);

      // Wood plank separation
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.4);
      ctx.lineTo(11, -r * 0.4);
      ctx.moveTo(0, r * 0.4);
      ctx.lineTo(11, r * 0.4);
      ctx.stroke();

      // Iron reinforcing bands
      ctx.fillStyle = '#37474f';
      ctx.fillRect(-1.5, -r * 1.1, 14, 5);
      ctx.fillRect(-1.5, r * 1.1 - 5, 14, 5);
      // Hex rivets
      ctx.fillStyle = '#eceff1';
      ctx.fillRect(4, -r * 1.1 + 1.5, 2.5, 2);
      ctx.fillRect(4, r * 1.1 - 3.5, 2.5, 2);

      // Brass door handle
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(2, -4, 7, 8);
      ctx.restore();
    }

    // 6. Gargantuar Titan Boss
    else if (z.type === 'boss') {
      ctx.save();
      ctx.translate(r * 0.2, -r * 1.1);
      // Street lamp-post weapon
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(0, -6, r * 1.6, 12);
      ctx.strokeStyle = '#1b120c';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, -6, r * 1.6, 12);

      // Glowing lamp bulb
      ctx.fillStyle = '#ffe082';
      ctx.fillRect(r * 1.4, -9, 14, 18);
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(r * 1.4, -9, 14, 18);

      // Lamp glow
      ctx.fillStyle = 'rgba(255, 235, 59, 0.45)';
      ctx.beginPath();
      ctx.arc(r * 1.5 + 7, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Surgical scars on brow
      ctx.strokeStyle = '#cfd8dc';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, -r * 0.4);
      ctx.lineTo(r * 0.35, -r * 0.1);
      ctx.stroke();
      for (let s = -4; s <= 4; s += 4) {
        ctx.beginPath();
        ctx.moveTo(s - 2, -r * 0.3);
        ctx.lineTo(s + 2, -r * 0.2);
        ctx.stroke();
      }
    }

    ctx.restore();

    // 9. Health Bar & Tier Badge (unrotated, above zombie head)
    ctx.save();
    ctx.translate(z.x, z.y);
    const barW = Math.max(34, z.radius * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(-barW / 2, -z.radius - 14, barW, 5.5);

    // HP Fill
    const hpRatio = Math.max(0, z.health / z.maxHealth);
    ctx.fillStyle = z.type === 'boss' ? '#ffd600' : z.slowTimer > 0 ? '#29b6f6' : '#e53935';
    ctx.fillRect(-barW / 2, -z.radius - 14, barW * hpRatio, 5.5);

    // HP Border
    ctx.strokeStyle = '#1b0f06';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-barW / 2, -z.radius - 14, barW, 5.5);

    // Name badge for Boss
    if (z.type === 'boss') {
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ff1744';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('👑 TITAN BOSS', 0, -z.radius - 18);
    }
    ctx.restore();
  });
}

// Helper function to draw articulated zombie arm & claw
function drawZombieArm(ctx, r, coatColor, skinColor, startX, startY, reachOffset) {
  ctx.save();
  ctx.translate(startX, startY);

  const armLen = r * 0.85 + reachOffset;

  // Torn suit jacket sleeve
  ctx.fillStyle = coatColor;
  ctx.beginPath();
  ctx.moveTo(0, -4.5);
  ctx.lineTo(armLen * 0.45, -5.5);
  ctx.lineTo(armLen * 0.4, 0);
  ctx.lineTo(armLen * 0.48, 5.5);
  ctx.lineTo(0, 4.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#18120b';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Decaying zombie forearm
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.rect(armLen * 0.35, -3.2, armLen * 0.5, 6.4);
  ctx.fill();
  ctx.strokeStyle = '#1b2718';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Claws / outstretched fingers reaching forward
  ctx.translate(armLen * 0.85, 0);
  ctx.fillStyle = skinColor;
  for (let f = -1; f <= 1; f++) {
    ctx.beginPath();
    ctx.moveTo(0, f * 3);
    ctx.lineTo(6.5, f * 3.8);
    ctx.lineTo(8, f * 2.2);
    ctx.lineTo(0, f * 1);
    ctx.closePath();
    ctx.fill();
    // Dirty claw nail
    ctx.fillStyle = '#212121';
    ctx.fillRect(6, f * 2.8, 2.2, 2);
    ctx.fillStyle = skinColor;
  }

  ctx.restore();
}

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  const r = p.radius;
  const walk = p.walkCycle || 0;
  const isMoving = !!p.isMoving;
  const currentW = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;

  // Walk cycle animation offsets
  const footSway1 = isMoving ? Math.sin(walk) * 6 : 0;
  const footSway2 = isMoving ? -Math.sin(walk) * 6 : 0;
  const bodyBob = isMoving ? Math.sin(walk * 2) * 1.5 : Math.sin(walk) * 0.8;
  const bodySquash = isMoving ? 1 + Math.sin(walk * 2) * 0.04 : 1 + Math.sin(walk) * 0.02;

  // 1. Soft Dynamic Shadow underneath
  ctx.beginPath();
  ctx.ellipse(0, r * 0.88, r * 1.1 + (isMoving ? Math.abs(Math.sin(walk)) * 2 : 0), r * 0.44, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.fill();

  // Dash smoke trail
  if (p.isDashing) {
    ctx.beginPath();
    ctx.arc(-24, 0, r * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129, 199, 132, 0.55)';
    ctx.fill();
  }

  // Golden Armor Barrier Ring (Rotating Hexagonal Aura)
  if (p.armor > 0) {
    ctx.save();
    const rotArmor = Date.now() * 0.002;
    ctx.rotate(rotArmor);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Rotate to aim angle
  ctx.rotate(p.angle);
  ctx.translate(bodyBob, 0);

  // 2. 4 Adorable Waddling Green Leaf Feet (Plant Pedestal)
  ctx.fillStyle = '#2e7d32';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2;
  // Back-left foot
  ctx.beginPath();
  ctx.ellipse(-r * 0.65 + footSway1, -r * 0.55, 8, 5, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Back-right foot
  ctx.beginPath();
  ctx.ellipse(-r * 0.65 + footSway2, r * 0.55, 8, 5, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Front-left foot
  ctx.beginPath();
  ctx.ellipse(r * 0.35 + footSway2, -r * 0.6, 8, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Front-right foot
  ctx.beginPath();
  ctx.ellipse(r * 0.35 + footSway1, r * 0.6, 8, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. Dual Swishing Stem Leaves (Back fins) with natural wave physics
  const leafWave = Math.sin(walk * 1.5) * 0.18;
  ctx.save();
  ctx.translate(-r * 0.72, 0);
  ctx.rotate(leafWave);
  ctx.fillStyle = '#388e3c';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.2;
  // Top stem leaf
  ctx.beginPath();
  ctx.ellipse(-6, -11, 12, 7, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Leaf vein
  ctx.strokeStyle = '#81c784';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(-12, -13);
  ctx.stroke();
  // Bottom stem leaf
  ctx.fillStyle = '#388e3c';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(-6, 11, 12, 7, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Leaf vein
  ctx.strokeStyle = '#81c784';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.lineTo(-12, 13);
  ctx.stroke();
  ctx.restore();

  // 4. Peashooter Head Body (Vibrant 3D Spherical Volume)
  ctx.save();
  ctx.scale(1 / bodySquash, bodySquash);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.15, 0, 0, r);
  bodyGrad.addColorStop(0, '#98ee99');
  bodyGrad.addColorStop(0.35, '#4caf50');
  bodyGrad.addColorStop(0.8, '#388e3c');
  bodyGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = '#134017';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Crescent Specular Highlight on forehead
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.25, r * 0.65, Math.PI * 1.1, Math.PI * 1.6);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // 5. Special Ops Commando Helmet & Fluttering Red Bandana
  ctx.save();
  // Commando tactical combat helmet on back of head
  ctx.beginPath();
  ctx.arc(-2, 0, r + 1.5, Math.PI * 0.52, Math.PI * 1.48);
  ctx.lineTo(-r * 0.38, 0);
  ctx.closePath();
  const helmGrad = ctx.createLinearGradient(-r, 0, 0, 0);
  helmGrad.addColorStop(0, '#212f24');
  helmGrad.addColorStop(0.7, '#37473a');
  helmGrad.addColorStop(1, '#1e2920');
  ctx.fillStyle = helmGrad;
  ctx.fill();
  ctx.strokeStyle = '#141d15';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Steel rivets on helmet rim
  ctx.fillStyle = '#cfd8dc';
  ctx.beginPath();
  ctx.arc(-r * 0.55, -r * 0.75, 1.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.85, 0, 1.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.55, r * 0.75, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Two fluttering Red Commando Bandana Ribbons
  const ribbonWave = Math.sin(walk * 2) * 5;
  ctx.strokeStyle = '#e53935';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.95, -4);
  ctx.quadraticCurveTo(-r * 1.35, -8 + ribbonWave, -r * 1.55, -5 + ribbonWave);
  ctx.moveTo(-r * 0.95, 3);
  ctx.quadraticCurveTo(-r * 1.35, 7 - ribbonWave, -r * 1.6, 9 - ribbonWave);
  ctx.stroke();
  ctx.restore();

  // 6. Custom Weapon Snout with Recoil Animation
  const recoilX = p.recoilOffset || 0;
  const snoutX = r + 6 - recoilX;

  // Snout Collar Sleeve
  ctx.fillStyle = '#2e3d30';
  ctx.fillRect(r - 3, -7, 9, 14);
  ctx.strokeStyle = '#141d15';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(r - 3, -7, 9, 14);

  // Weapon-specific muzzle styling
  if (p.currentWeapon === 'threepeater_shotgun') {
    // Triple cluster shotgun barrels
    [-6, 0, 6].forEach((offsetY) => {
      ctx.beginPath();
      ctx.ellipse(snoutX, offsetY, 8.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = currentW.bulletColor;
      ctx.fill();
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = '#143517';
      ctx.beginPath();
      ctx.arc(snoutX + 3, offsetY, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (p.currentWeapon === 'snow_pea_sniper') {
    // Frost crystal flared snout
    ctx.beginPath();
    ctx.ellipse(snoutX, 0, 12, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#80deea';
    ctx.fill();
    ctx.strokeStyle = '#00838f';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Ice crystal shards
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(snoutX + 5, -8);
    ctx.lineTo(snoutX + 10, -5);
    ctx.lineTo(snoutX + 4, -4);
    ctx.moveTo(snoutX + 5, 8);
    ctx.lineTo(snoutX + 10, 5);
    ctx.lineTo(snoutX + 4, 4);
    ctx.fill();
  } else if (p.currentWeapon === 'fire_pea_gatling') {
    // Revolving gatling barrel
    ctx.beginPath();
    ctx.ellipse(snoutX, 0, 13, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d84315';
    ctx.fill();
    ctx.strokeStyle = '#bf360c';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Revolving brass chambers
    ctx.fillStyle = '#ffb300';
    for (let c = 0; c < 4; c++) {
      const ca = c * (Math.PI / 2) + Date.now() * 0.01;
      ctx.beginPath();
      ctx.arc(snoutX + Math.cos(ca) * 5, Math.sin(ca) * 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (p.currentWeapon === 'melon_bazooka') {
    // Heavy melon mortar barrel
    ctx.beginPath();
    ctx.ellipse(snoutX, 0, 15, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7cb342';
    ctx.fill();
    ctx.strokeStyle = '#33691e';
    ctx.lineWidth = 2.8;
    ctx.stroke();
    // Iron mortar band
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 3;
    ctx.strokeRect(snoutX - 4, -13, 4, 26);
  } else if (p.currentWeapon === 'plasma_cannon') {
    // High-tech plasma energy coil
    ctx.beginPath();
    ctx.ellipse(snoutX, 0, 13, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7c4dff';
    ctx.fill();
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    // Glowing cyan plasma core
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(snoutX + 2, 0, 5 + Math.sin(Date.now() * 0.01) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Standard Pea Pistol Trumpet Snout
    ctx.beginPath();
    ctx.ellipse(snoutX, 0, 12, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = currentW.bulletColor;
    ctx.fill();
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    // Inner dark cavity
    ctx.fillStyle = '#143818';
    ctx.beginPath();
    ctx.arc(snoutX + 3, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Dynamic Tactical Crosshair & Laser Sight ("Tâm Bắn Linh Động") ---
  const isLocked = !!pubgState.input.lockedTarget;
  const targetDist = isLocked
    ? Math.max(60, Math.min(480, Math.hypot(pubgState.input.lockedTarget.x - p.x, pubgState.input.lockedTarget.y - p.y)))
    : 260;
  const recoil = pubgState.input.crosshairRecoil || 0;
  const aimColor = isLocked ? '#ff1744' : '#ffd54f';
  const aimGlow = isLocked ? 'rgba(255, 23, 68, 0.4)' : 'rgba(255, 213, 79, 0.3)';

  // 1. Soft Laser Glow Beam
  ctx.save();
  ctx.strokeStyle = aimGlow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(snoutX + 10, 0);
  ctx.lineTo(targetDist, 0);
  ctx.stroke();

  // 2. Sharp Core Laser Line
  ctx.strokeStyle = aimColor;
  ctx.lineWidth = isLocked ? 2 : 1.5;
  ctx.setLineDash(isLocked ? [12, 6] : [6, 6]);
  ctx.beginPath();
  ctx.moveTo(snoutX + 10, 0);
  ctx.lineTo(targetDist, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Laser sight emitter dot at snout
  ctx.fillStyle = aimColor;
  ctx.beginPath();
  ctx.arc(snoutX + 8, -6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Dynamic Tactical Reticle at Target Distance
  const reticleR = Math.max(12, 16 + recoil);
  ctx.translate(targetDist, 0);

  // Outer segmented crosshair ring
  ctx.strokeStyle = aimColor;
  ctx.lineWidth = isLocked ? 2.5 : 1.8;
  const rotAnim = (Date.now() / 800) % (Math.PI * 2);
  for (let a = 0; a < 4; a++) {
    const startA = a * (Math.PI / 2) + rotAnim * (isLocked ? 1.5 : 0.8) + 0.15;
    const endA = startA + Math.PI / 2 - 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, reticleR, startA, endA);
    ctx.stroke();
  }

  // Crosshair 4 directional ticks (+)
  ctx.beginPath();
  ctx.moveTo(0, -reticleR - 3);
  ctx.lineTo(0, -reticleR - 9);
  ctx.moveTo(0, reticleR + 3);
  ctx.lineTo(0, reticleR + 9);
  ctx.moveTo(-reticleR - 3, 0);
  ctx.lineTo(-reticleR - 9, 0);
  ctx.moveTo(reticleR + 3, 0);
  ctx.lineTo(reticleR + 9, 0);
  ctx.stroke();

  // Center pip dot
  ctx.fillStyle = aimColor;
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Corner Lock Brackets & Indicator when target is locked
  if (isLocked) {
    const boxR = reticleR + 8;
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(-boxR, -boxR + 6);
    ctx.lineTo(-boxR, -boxR);
    ctx.lineTo(-boxR + 6, -boxR);
    // Top-right
    ctx.moveTo(boxR - 6, -boxR);
    ctx.lineTo(boxR, -boxR);
    ctx.lineTo(boxR, -boxR + 6);
    // Bottom-left
    ctx.moveTo(-boxR, boxR - 6);
    ctx.lineTo(-boxR, boxR);
    ctx.lineTo(-boxR + 6, boxR);
    // Bottom-right
    ctx.moveTo(boxR - 6, boxR);
    ctx.lineTo(boxR, boxR);
    ctx.lineTo(boxR, boxR - 6);
    ctx.stroke();
  }

  ctx.restore();

  // 7. Expressive Determined Cartoon Eyes with Natural Blinking
  const isBlinking = Math.sin(Date.now() * 0.0025) > 0.98;

  if (isBlinking) {
    // Cute confident squint when blinking
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(5, -8, 6, 0.2, Math.PI - 0.2);
    ctx.arc(5, 8, 6, -Math.PI + 0.2, -0.2);
    ctx.stroke();
  } else {
    // Sclera (White eye)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4, -8, 6.5, 5.5, 0, 0, Math.PI * 2);
    ctx.ellipse(4, 8, 6.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#134017';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Large pupils looking forward (+X)
    ctx.fillStyle = '#0f1710';
    ctx.beginPath();
    ctx.arc(6.5, -8, 3.4, 0, Math.PI * 2);
    ctx.arc(6.5, 8, 3.4, 0, Math.PI * 2);
    ctx.fill();

    // Double specular reflection shine dots (Giving life to eyes!)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Big shine
    ctx.arc(6.8, -9.5, 1.4, 0, Math.PI * 2);
    ctx.arc(6.8, 6.5, 1.4, 0, Math.PI * 2);
    // Small shine
    ctx.arc(8, -7, 0.8, 0, Math.PI * 2);
    ctx.arc(8, 9, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawProjectiles(ctx) {
  // Player Projectiles
  pubgState.bullets.forEach((b) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 12;
    ctx.fill();

    // Bullet trail tail
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.radius * 1.4;
    ctx.stroke();

    ctx.restore();
  });

  // Enemy Toxic Acid Spits
  if (pubgState.enemyProjectiles) {
    pubgState.enemyProjectiles.forEach((ep) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, ep.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00e676';
      ctx.shadowColor = '#00e676';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();
    });
  }
}

function drawParticles(ctx) {
  pubgState.particles.forEach((pt) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fillStyle = pt.color;
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fill();
    ctx.restore();
  });
}

function drawFloatingTexts(ctx) {
  if (!pubgState.floatingTexts) return;
  pubgState.floatingTexts.forEach((ft) => {
    ctx.save();
    ctx.font = `900 ${ft.size || 16}px 'Fredoka', 'Baloo 2', sans-serif`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
    // Comic dark outline
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#1a0f06';
    ctx.strokeText(ft.text, ft.x, ft.y);
    // Vibrant comic fill
    ctx.fillStyle = ft.color || '#ffeb3b';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}

function drawScreenOverlays(ctx, canvas) {
  // 1. Tactical Radar Minimap (Top Right)
  const isCompact = canvas.height < 520;
  const mapW = isCompact ? 100 : 160;
  const mapH = isCompact ? 100 : 160;
  const mapX = canvas.width - mapW - (isCompact ? 10 : 16);
  const mapY = isCompact ? 8 : 16;
  const ratio = mapW / MAP_CONFIG.WIDTH;

  ctx.save();
  // Minimap background frame (Carved wood & gold)
  ctx.fillStyle = 'rgba(26, 46, 28, 0.9)';
  ctx.fillRect(mapX, mapY, mapW, mapH);
  ctx.strokeStyle = '#2e1c0c';
  ctx.lineWidth = 5;
  ctx.strokeRect(mapX, mapY, mapW, mapH);
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(mapX + 2, mapY + 2, mapW - 4, mapH - 4);

  // Minimap Zone
  const z = pubgState.zone;
  ctx.beginPath();
  ctx.arc(mapX + z.centerX * ratio, mapY + z.centerY * ratio, z.radius * ratio, 0, Math.PI * 2);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Next Target Zone
  ctx.beginPath();
  ctx.arc(mapX + z.targetCenterX * ratio, mapY + z.targetCenterY * ratio, z.targetRadius * ratio, 0, Math.PI * 2);
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.setLineDash([]);

  // Minimap Zombies (Red dots for normal, Yellow for Boss)
  pubgState.zombies.forEach((zm) => {
    ctx.beginPath();
    ctx.arc(mapX + zm.x * ratio, mapY + zm.y * ratio, zm.type === 'boss' ? 4.5 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = zm.type === 'boss' ? '#ffd600' : '#ff1744';
    ctx.fill();
  });

  // Minimap Player (Bright Green Triangle with view cone)
  const p = pubgState.player;
  ctx.fillStyle = '#00e676';
  ctx.beginPath();
  ctx.arc(mapX + p.x * ratio, mapY + p.y * ratio, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

