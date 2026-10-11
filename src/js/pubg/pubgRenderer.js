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

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, z.radius * 0.9, z.radius * 0.95, z.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fill();

    // Rotate towards facing angle
    ctx.rotate(z.angle);

    // Leg walking wobble animation
    const legOffset = Math.sin(z.walkCycle) * 4;

    // Body base
    ctx.beginPath();
    ctx.arc(0, 0, z.radius, 0, Math.PI * 2);

    // Color skin depending on type & slow status
    if (z.slowTimer > 0) {
      ctx.fillStyle = '#4fc3f7';
    } else if (z.type === 'toxic') {
      ctx.fillStyle = '#00e676';
    } else if (z.type === 'boss') {
      ctx.fillStyle = '#455a64';
    } else {
      ctx.fillStyle = '#795548';
    }
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tattered clothes / vest on back
    ctx.fillStyle = z.type === 'runner' ? '#d32f2f' : '#37474f';
    ctx.fillRect(-z.radius, -z.radius * 0.7, z.radius * 0.8, z.radius * 1.4);

    // Red necktie
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(2, -3);
    ctx.lineTo(8, -1);
    ctx.lineTo(2, 2);
    ctx.closePath();
    ctx.fill();

    // Reaching zombie arms
    ctx.fillStyle = z.type === 'toxic' ? '#00e676' : '#8d6e63';
    ctx.fillRect(z.radius - 6, -11 + legOffset, 16, 5);
    ctx.fillRect(z.radius - 6, 6 - legOffset, 16, 5);

    // Sharp claws
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(z.radius + 8, -12 + legOffset, 4, 3);
    ctx.fillRect(z.radius + 8, 7 - legOffset, 4, 3);

    // Hungry, derpy eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, -7, 5, 0, Math.PI * 2);
    ctx.arc(4, 7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = z.type === 'boss' ? '#ff1744' : '#212121';
    ctx.beginPath();
    ctx.arc(6, -7, 2.5, 0, Math.PI * 2);
    ctx.arc(6, 7, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Mouth with jagged teeth
    ctx.fillStyle = '#212121';
    ctx.fillRect(z.radius - 4, -4, 5, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(z.radius - 3, -3, 2, 2);
    ctx.fillRect(z.radius - 3, 2, 2, 2);

    // Special Tier Visuals
    // 1. Conehead
    if (z.type === 'conehead') {
      ctx.fillStyle = '#ff6d00';
      ctx.beginPath();
      ctx.moveTo(10, -10);
      ctx.lineTo(10, 10);
      ctx.lineTo(-16, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = 2;
      ctx.stroke();
      // White reflective stripes on cone
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 6);
      ctx.moveTo(-8, -3);
      ctx.lineTo(-8, 3);
      ctx.stroke();
    }

    // 2. Buckethead
    else if (z.type === 'buckethead') {
      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(-12, -12, 22, 24);
      ctx.strokeStyle = '#455a64';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-12, -12, 22, 24);
      // Metallic handle
      ctx.beginPath();
      ctx.arc(-1, 0, 14, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#37474f';
      ctx.stroke();
    }

    // 3. Football Runner
    else if (z.type === 'runner') {
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.arc(-2, 0, z.radius - 3, 0, Math.PI * 2);
      ctx.fill();
      // Helmet center stripe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-z.radius + 2, 0);
      ctx.lineTo(z.radius - 2, 0);
      ctx.stroke();
    }

    // 4. Toxic Zombie
    else if (z.type === 'toxic') {
      ctx.strokeStyle = '#b9f6ca';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, z.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5. Shield Zombie
    else if (z.type === 'shield') {
      // Large reinforced wooden door shield in front
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(z.radius + 6, -18, 9, 36);
      ctx.strokeStyle = '#cfd8dc';
      ctx.lineWidth = 3;
      ctx.strokeRect(z.radius + 6, -18, 9, 36);
      // Iron bolts
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(z.radius + 9, -14, 3, 3);
      ctx.fillRect(z.radius + 9, 11, 3, 3);
      ctx.fillRect(z.radius + 9, -2, 3, 3);
    }

    // 6. Gargantuar Titan Boss
    else if (z.type === 'boss') {
      // Huge street lamp-post weapon
      ctx.fillStyle = '#263238';
      ctx.fillRect(z.radius - 4, -26, 32, 10);
      ctx.fillStyle = '#ffe082';
      ctx.fillRect(z.radius + 24, -28, 12, 14); // Glowing street lamp bulb
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 2;
      ctx.strokeRect(z.radius + 24, -28, 12, 14);
    }

    ctx.restore();

    // Health Bar & Tier Badge (unrotated, above zombie head)
    ctx.save();
    ctx.translate(z.x, z.y);
    const barW = Math.max(34, z.radius * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-barW / 2, -z.radius - 14, barW, 5);

    // HP Fill
    const hpRatio = Math.max(0, z.health / z.maxHealth);
    ctx.fillStyle = z.type === 'boss' ? '#ffd600' : z.slowTimer > 0 ? '#29b6f6' : '#e53935';
    ctx.fillRect(-barW / 2, -z.radius - 14, barW * hpRatio, 5);

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

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  // Soft shadow underneath
  ctx.beginPath();
  ctx.ellipse(0, p.radius * 0.85, p.radius * 0.95, p.radius * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();

  // Dash smoke trail
  if (p.isDashing) {
    ctx.beginPath();
    ctx.arc(-22, 0, p.radius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129, 199, 132, 0.5)';
    ctx.fill();
  }

  // Golden Armor Barrier Ring
  if (p.armor > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Rotate to aim angle
  ctx.rotate(p.angle);

  // 1. Dual Stem Leaves (Back fins)
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.ellipse(-p.radius * 0.7, -10, 10, 6, -0.4, 0, Math.PI * 2);
  ctx.ellipse(-p.radius * 0.7, 10, 10, 6, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 2. Peashooter Head Body (Vibrant gradient)
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#4caf50';
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. Spetsnaz Level 3 Tactical Helmet (PUBG Commando Helmet)
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.arc(-2, 0, p.radius + 1, Math.PI * 0.55, Math.PI * 1.45);
  ctx.lineTo(-p.radius * 0.4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Helmet metal band & visor slit
  ctx.fillStyle = '#102027';
  ctx.fillRect(-p.radius * 0.3, -12, 6, 24);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-p.radius * 0.3, -12, 6, 24);

  // 4. Heavy Cannon Snout with Recoil Animation
  const currentW = WEAPONS[p.currentWeapon] || WEAPONS.pea_pistol;
  const recoilX = p.recoilOffset || 0;
  const snoutX = p.radius + 6 - recoilX;

  // Metallic barrel sleeve
  ctx.fillStyle = '#37474f';
  ctx.fillRect(p.radius - 2, -6, 8, 12);

  // Snout cone
  ctx.beginPath();
  ctx.ellipse(snoutX, 0, 11, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = currentW.bulletColor;
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Red Laser Sight Line
  ctx.strokeStyle = 'rgba(255, 23, 68, 0.75)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(snoutX + 10, 0);
  ctx.lineTo(snoutX + 350, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Laser sight emitter dot
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(snoutX + 8, -6, 2, 0, Math.PI * 2);
  ctx.fill();

  // 5. Determined Warrior Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, -8, 5.5, 0, Math.PI * 2);
  ctx.arc(4, 8, 5.5, 0, Math.PI * 2);
  ctx.fill();
  // Pupils looking straight forward
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(7, -8, 2.8, 0, Math.PI * 2);
  ctx.arc(7, 8, 2.8, 0, Math.PI * 2);
  ctx.fill();

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
