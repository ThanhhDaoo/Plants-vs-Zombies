// High-Performance 2D Canvas Renderer for PvZ Battle Royale
import { pubgState, MAP_CONFIG } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';

export function renderPubg(ctx, canvas) {
  const p = pubgState.player;
  const cam = pubgState.camera;
  const zone = pubgState.zone;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Center camera on player
  ctx.translate(canvas.width / 2 - cam.x, canvas.height / 2 - cam.y);

  // 1. Draw Battlefield Map Grid & Lawn Pattern
  drawBattlefield(ctx);

  // 2. Draw Crates & Ground Items
  drawCratesAndItems(ctx);

  // 3. Draw Safe Zone Border & Outside Danger Area
  drawZone(ctx);

  // 4. Draw Zombies
  drawZombies(ctx);

  // 5. Draw Player
  drawPlayer(ctx, p);

  // 6. Draw Projectiles & Particles
  drawBulletsAndParticles(ctx);

  ctx.restore();

  // 7. Screen UI: Minimap, Out-of-zone Warning, Virtual Joysticks
  drawScreenOverlays(ctx, canvas);
}

function drawBattlefield(ctx) {
  // Base grass
  ctx.fillStyle = '#43a047';
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

  // Outer fence border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#4e342e';
  ctx.strokeRect(7, 7, MAP_CONFIG.WIDTH - 14, MAP_CONFIG.HEIGHT - 14);

  // Dirt paths crossing the map
  ctx.fillStyle = 'rgba(121, 85, 72, 0.4)';
  ctx.fillRect(0, MAP_CONFIG.HEIGHT / 2 - 40, MAP_CONFIG.WIDTH, 80);
  ctx.fillRect(MAP_CONFIG.WIDTH / 2 - 40, 0, 80, MAP_CONFIG.HEIGHT);

  // Center garden plaza
  ctx.beginPath();
  ctx.arc(MAP_CONFIG.WIDTH / 2, MAP_CONFIG.HEIGHT / 2, 140, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(215, 204, 200, 0.6)';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#8d6e63';
  ctx.stroke();
}

function drawZone(ctx) {
  const z = pubgState.zone;

  // Next Zone Target (dashed white ring)
  ctx.beginPath();
  ctx.arc(z.targetCenterX, z.targetCenterY, z.targetRadius, 0, Math.PI * 2);
  ctx.setLineDash([12, 10]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.setLineDash([]);

  // Current Blue Zone (Electric Cyan Pulsating Ring)
  const pulse = Math.sin(Date.now() / 250) * 4;
  ctx.beginPath();
  ctx.arc(z.centerX, z.centerY, z.radius + pulse, 0, Math.PI * 2);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 8;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Danger fog outside current radius
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, MAP_CONFIG.WIDTH, MAP_CONFIG.HEIGHT);
  ctx.arc(z.centerX, z.centerY, z.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(10, 20, 60, 0.38)';
  ctx.fill();
  ctx.restore();
}

function drawCratesAndItems(ctx) {
  // Wood Crates
  pubgState.crates.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.fillStyle = c.isAirdrop ? '#d32f2f' : '#8d6e63';
    ctx.fillRect(-22, -22, 44, 44);
    ctx.strokeStyle = c.isAirdrop ? '#ffeb3b' : '#4e342e';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22, -22, 44, 44);

    // Cross brace
    ctx.beginPath();
    ctx.moveTo(-22, -22);
    ctx.lineTo(22, 22);
    ctx.moveTo(22, -22);
    ctx.lineTo(-22, 22);
    ctx.stroke();

    // Health bar for crate
    if (c.health < c.maxHealth) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-20, -32, 40, 5);
      ctx.fillStyle = '#ffca28';
      ctx.fillRect(-20, -32, (c.health / c.maxHealth) * 40, 5);
    }
    ctx.restore();
  });

  // Dropped Ground Items
  pubgState.groundItems.forEach((item) => {
    const floatY = Math.sin(Date.now() / 300 + item.x) * 4;
    ctx.save();
    ctx.translate(item.x, item.y + floatY);

    // Glow ring
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 59, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji icon
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 0, 0);

    // Item label
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(item.name, 0, -22);
    ctx.shadowBlur = 0;
    ctx.restore();
  });
}

function drawZombies(ctx) {
  pubgState.zombies.forEach((z) => {
    ctx.save();
    ctx.translate(z.x, z.y);
    ctx.rotate(z.angle);

    // Zombie Body Circle
    ctx.beginPath();
    ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
    ctx.fillStyle = z.slowTimer > 0 ? '#4fc3f7' : '#795548';
    ctx.fill();
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Zombie Hands reaching forward
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(z.radius - 4, -10, 14, 6);
    ctx.fillRect(z.radius - 4, 4, 14, 6);

    // Hat Accessory (Cone or Bucket)
    if (z.type === 'conehead') {
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(8, -8);
      ctx.lineTo(8, 8);
      ctx.lineTo(-14, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e65100';
      ctx.stroke();
    } else if (z.type === 'buckethead') {
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(-10, -10, 20, 20);
      ctx.strokeStyle = '#546e7a';
      ctx.strokeRect(-10, -10, 20, 20);
    } else if (z.type === 'runner') {
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.arc(-2, 0, z.radius - 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Health Bar (unrotated)
    ctx.save();
    ctx.translate(z.x, z.y);
    const barW = z.radius * 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(-barW / 2, -z.radius - 12, barW, 4);
    ctx.fillStyle = z.slowTimer > 0 ? '#29b6f6' : '#e53935';
    ctx.fillRect(-barW / 2, -z.radius - 12, (z.health / z.maxHealth) * barW, 4);
    ctx.restore();
  });
}

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  // Dash speed trails
  if (p.isDashing) {
    ctx.beginPath();
    ctx.arc(-20, 0, p.radius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129, 199, 132, 0.4)';
    ctx.fill();
  }

  // Armor Shield Glow
  if (p.armor > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Peashooter Body
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#66bb6a';
  ctx.fill();
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Peashooter Snout (Nòng bắn hạt đậu)
  const currentW = WEAPONS[p.currentWeapon];
  ctx.beginPath();
  ctx.ellipse(p.radius + 6, 0, 10, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = currentW?.bulletColor || '#43a047';
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(2, -8, 5, 0, Math.PI * 2);
  ctx.arc(2, 8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(4, -8, 2.5, 0, Math.PI * 2);
  ctx.arc(4, 8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBulletsAndParticles(ctx) {
  // Projectiles
  pubgState.bullets.forEach((b) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });

  // Particles
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

function drawScreenOverlays(ctx, canvas) {
  // 1. Minimap (Top Right)
  const mapW = 160;
  const mapH = 160;
  const mapX = canvas.width - mapW - 16;
  const mapY = 16;
  const ratio = mapW / MAP_CONFIG.WIDTH;

  ctx.save();
  // Minimap background box
  ctx.fillStyle = 'rgba(20, 25, 30, 0.85)';
  ctx.fillRect(mapX, mapY, mapW, mapH);
  ctx.strokeStyle = '#ffca28';
  ctx.lineWidth = 2;
  ctx.strokeRect(mapX, mapY, mapW, mapH);

  // Minimap Zone
  const z = pubgState.zone;
  ctx.beginPath();
  ctx.arc(mapX + z.centerX * ratio, mapY + z.centerY * ratio, z.radius * ratio, 0, Math.PI * 2);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Target Zone
  ctx.beginPath();
  ctx.arc(mapX + z.targetCenterX * ratio, mapY + z.targetCenterY * ratio, z.targetRadius * ratio, 0, Math.PI * 2);
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.setLineDash([]);

  // Minimap Zombies (Red dots)
  ctx.fillStyle = '#ff1744';
  pubgState.zombies.forEach((zm) => {
    ctx.beginPath();
    ctx.arc(mapX + zm.x * ratio, mapY + zm.y * ratio, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Minimap Player (Green dot)
  const p = pubgState.player;
  ctx.fillStyle = '#00e676';
  ctx.beginPath();
  ctx.arc(mapX + p.x * ratio, mapY + p.y * ratio, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();

  // 2. Touch Joysticks
  const touch = pubgState.input.touch;
  if (touch.moveActive) {
    ctx.beginPath();
    ctx.arc(touch.moveStartX, touch.moveStartY, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(touch.moveCurX, touch.moveCurY, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
    ctx.fill();
  }

  if (touch.aimActive) {
    ctx.beginPath();
    ctx.arc(touch.aimStartX, touch.aimStartY, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(touch.aimCurX, touch.aimCurY, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 87, 34, 0.8)';
    ctx.fill();
  }
}
