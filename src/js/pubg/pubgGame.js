// PvZ Battle Royale Game Loop & Mechanics
import { pubgState, MAP_CONFIG } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';
import { spawnInitialZombies, updateZombies } from './pubgZombies.js';
import { renderPubg } from './pubgRenderer.js';
import { setupPubgControls, triggerReload } from './pubgControls.js';
import { playShootSound, playHitSound, playExplosionSound, playSunSound } from '../sound.js';

let animationFrameId = null;
let lastTimestamp = 0;
let pubgCanvas = null;
let pubgCtx = null;

export function initPubg() {
  pubgCanvas = document.getElementById('pubgCanvas');
  if (!pubgCanvas) return;
  pubgCtx = pubgCanvas.getContext('2d');

  // Resize canvas to match game container
  resizePubgCanvas();
  window.addEventListener('resize', resizePubgCanvas);

  setupPubgControls(pubgCanvas);
}

function resizePubgCanvas() {
  if (!pubgCanvas) return;
  const container = document.getElementById('pubgContainer');
  if (!container) return;
  pubgCanvas.width = container.clientWidth || 1280;
  pubgCanvas.height = container.clientHeight || 720;
  pubgState.camera.width = pubgCanvas.width;
  pubgState.camera.height = pubgCanvas.height;
}

export function startPubgGame() {
  resizePubgCanvas();
  pubgState.active = true;
  pubgState.isPaused = false;
  pubgState.isGameOver = false;
  pubgState.isVictory = false;

  // Reset player
  const p = pubgState.player;
  p.x = 1200;
  p.y = 1200;
  p.health = 100;
  p.armor = 50;
  p.currentWeapon = 'pea_pistol';
  p.ammo = WEAPONS.pea_pistol.magazineSize;
  p.isReloading = false;
  p.kills = 0;
  p.score = 0;

  // Reset zone
  const z = pubgState.zone;
  z.centerX = 1200;
  z.centerY = 1200;
  z.radius = 1450;
  z.targetCenterX = 1200 + (Math.random() - 0.5) * 400;
  z.targetCenterY = 1200 + (Math.random() - 0.5) * 400;
  z.targetRadius = 900;
  z.phase = 1;
  z.countdown = 40;
  z.isShrinking = false;

  // Clear bullets & particles
  pubgState.bullets = [];
  pubgState.particles = [];
  pubgState.groundItems = [];

  // Spawn Crates
  spawnCrates(25);

  // Spawn Zombies
  spawnInitialZombies(30);

  // Update HUD
  updatePubgHud();

  // Hide modals
  document.getElementById('pubgGameOverModal').style.display = 'none';
  document.getElementById('pubgVictoryModal').style.display = 'none';

  lastTimestamp = performance.now();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(pubgGameLoop);
}

function spawnCrates(count = 25) {
  pubgState.crates = [];
  for (let i = 0; i < count; i++) {
    pubgState.crates.push({
      id: `crate_${i}`,
      x: 150 + Math.random() * (MAP_CONFIG.WIDTH - 300),
      y: 150 + Math.random() * (MAP_CONFIG.HEIGHT - 300),
      health: 50,
      maxHealth: 50,
      isAirdrop: i === 0
    });
  }
}

function pubgGameLoop(timestamp) {
  if (!pubgState.active) return;

  const delta = Math.min(timestamp - lastTimestamp, 100);
  lastTimestamp = timestamp;

  if (!pubgState.isPaused && !pubgState.isGameOver && !pubgState.isVictory) {
    updatePubg(delta);
  }

  renderPubg(pubgCtx, pubgCanvas);

  if (pubgState.isGameOver) {
    document.getElementById('pubgGameOverModal').style.display = 'flex';
  } else if (pubgState.isVictory) {
    document.getElementById('pubgVictoryModal').style.display = 'flex';
  } else {
    animationFrameId = requestAnimationFrame(pubgGameLoop);
  }
}

function updatePubg(delta) {
  const p = pubgState.player;

  // 1. Player Movement (WASD or Touch Joystick)
  let moveX = 0;
  let moveY = 0;

  if (pubgState.input.keys.w) moveY -= 1;
  if (pubgState.input.keys.s) moveY += 1;
  if (pubgState.input.keys.a) moveX -= 1;
  if (pubgState.input.keys.d) moveX += 1;

  if (pubgState.input.touch.moveActive) {
    const tDx = pubgState.input.touch.moveCurX - pubgState.input.touch.moveStartX;
    const tDy = pubgState.input.touch.moveCurY - pubgState.input.touch.moveStartY;
    const dist = Math.hypot(tDx, tDy);
    if (dist > 10) {
      moveX = tDx / dist;
      moveY = tDy / dist;
    }
  }

  // Normalize diagonal
  const moveLen = Math.hypot(moveX, moveY);
  if (moveLen > 0) {
    moveX /= moveLen;
    moveY /= moveLen;
  }

  // Dash boost
  let currentSpeed = p.speed;
  if (p.isDashing) {
    currentSpeed *= 2.6;
    p.dashTimer -= delta;
    if (p.dashTimer <= 0) p.isDashing = false;
  }
  if (p.dashCooldown > 0) p.dashCooldown -= delta;

  p.x += moveX * currentSpeed;
  p.y += moveY * currentSpeed;

  // Clamp player to map
  p.x = Math.max(p.radius + 15, Math.min(MAP_CONFIG.WIDTH - p.radius - 15, p.x));
  p.y = Math.max(p.radius + 15, Math.min(MAP_CONFIG.HEIGHT - p.radius - 15, p.y));

  // 2. Camera Lerp Follow
  const cam = pubgState.camera;
  cam.x += (p.x - cam.x) * 0.12;
  cam.y += (p.y - cam.y) * 0.12;

  // 3. Firing Mechanism
  const now = Date.now();
  const currentW = WEAPONS[p.currentWeapon];

  // Reload progress
  if (p.isReloading) {
    p.reloadTimer -= delta;
    if (p.reloadTimer <= 0) {
      p.isReloading = false;
      p.ammo = currentW.magazineSize;
    }
  }

  // Auto fire if mouse is down or aim touch is active
  const isFiring = pubgState.input.mouse.isDown || pubgState.input.touch.aimActive;
  if (isFiring && !p.isReloading && now - p.lastShotTime >= currentW.fireRate) {
    if (p.ammo > 0) {
      fireWeapon(currentW);
      p.lastShotTime = now;
      p.ammo--;
      if (p.ammo === 0) triggerReload();
    } else {
      triggerReload();
    }
  }

  // 4. Update Projectiles
  updateBullets(delta);

  // 5. Update Zombies
  updateZombies(delta);

  // 6. Update Safe Zone
  updateSafeZone(delta);

  // 7. Check Ground Loot Pickup
  checkLootPickup();

  // 8. Update Particles
  for (let i = pubgState.particles.length - 1; i >= 0; i--) {
    const pt = pubgState.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life -= delta;
    if (pt.life <= 0) pubgState.particles.splice(i, 1);
  }

  // 9. Check Victory (All zombies eliminated)
  if (pubgState.zombies.length === 0 && p.health > 0) {
    pubgState.isVictory = true;
  }

  // 10. Update HTML HUD
  updatePubgHud();
}

function fireWeapon(w) {
  playShootSound();
  const p = pubgState.player;

  for (let i = 0; i < w.pellets; i++) {
    const spreadAngle = (Math.random() - 0.5) * w.spread;
    const finalAngle = p.angle + spreadAngle;

    pubgState.bullets.push({
      x: p.x + Math.cos(p.angle) * (p.radius + 12),
      y: p.y + Math.sin(p.angle) * (p.radius + 12),
      vx: Math.cos(finalAngle) * w.bulletSpeed,
      vy: Math.sin(finalAngle) * w.bulletSpeed,
      radius: w.bulletRadius,
      color: w.bulletColor,
      damage: w.damage,
      isFire: w.isFire,
      slowEffect: w.slowEffect,
      isExplosive: w.isExplosive,
      blastRadius: w.blastRadius,
      range: 850,
      distanceTraveled: 0
    });
  }
}

function updateBullets(delta) {
  for (let i = pubgState.bullets.length - 1; i >= 0; i--) {
    const b = pubgState.bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    const distStep = Math.hypot(b.vx, b.vy);
    b.distanceTraveled += distStep;

    // Bullet expired
    if (b.distanceTraveled >= b.range) {
      pubgState.bullets.splice(i, 1);
      continue;
    }

    // Check hit on Zombies
    let hitZombie = false;
    for (let j = pubgState.zombies.length - 1; j >= 0; j--) {
      const z = pubgState.zombies[j];
      const dist = Math.hypot(b.x - z.x, b.y - z.y);
      if (dist < z.radius + b.radius) {
        hitZombie = true;
        playHitSound();

        if (b.isExplosive) {
          playExplosionSound();
          // AOE blast
          pubgState.zombies.forEach((nearbyZ) => {
            const d = Math.hypot(b.x - nearbyZ.x, b.y - nearbyZ.y);
            if (d < b.blastRadius) {
              nearbyZ.health -= b.damage * (1 - d / b.blastRadius);
            }
          });
          createExplosionParticles(b.x, b.y, '#ff9800');
        } else {
          z.health -= b.damage;
          if (b.slowEffect) z.slowTimer = 3000;
          createHitParticles(b.x, b.y, b.color);
        }

        // Zombie killed
        if (z.health <= 0) {
          pubgState.player.kills++;
          pubgState.player.score += z.points || 100;
          dropZombieLoot(z.x, z.y, z.type === 'boss');
          pubgState.zombies.splice(j, 1);
          pubgState.aliveCount = pubgState.zombies.length + 1;
        }
        break;
      }
    }

    if (hitZombie) {
      pubgState.bullets.splice(i, 1);
      continue;
    }

    // Check hit on Crates
    let hitCrate = false;
    for (let k = pubgState.crates.length - 1; k >= 0; k--) {
      const c = pubgState.crates[k];
      if (Math.hypot(b.x - c.x, b.y - c.y) < 26 + b.radius) {
        hitCrate = true;
        c.health -= b.damage;
        createHitParticles(b.x, b.y, '#8d6e63');

        if (c.health <= 0) {
          playExplosionSound();
          dropCrateLoot(c.x, c.y, c.isAirdrop);
          pubgState.crates.splice(k, 1);
        }
        break;
      }
    }

    if (hitCrate) {
      pubgState.bullets.splice(i, 1);
    }
  }
}

function dropCrateLoot(x, y, isAirdrop) {
  const lootTypes = isAirdrop
    ? ['fire_gatling', 'melon_launcher', 'armor', 'health']
    : ['threepeater', 'snow_sniper', 'armor', 'health', 'speed'];

  const chosen = lootTypes[Math.floor(Math.random() * lootTypes.length)];
  spawnGroundItem(chosen, x, y);
}

function dropZombieLoot(x, y, isBoss) {
  if (isBoss) {
    spawnGroundItem('melon_launcher', x - 20, y);
    spawnGroundItem('armor', x + 20, y);
  } else if (Math.random() < 0.35) {
    const drops = ['health', 'armor', 'speed'];
    spawnGroundItem(drops[Math.floor(Math.random() * drops.length)], x, y);
  }
}

function spawnGroundItem(type, x, y) {
  let item = { x, y, type, name: '', emoji: '' };

  if (WEAPONS[type]) {
    const w = WEAPONS[type];
    item.name = w.name;
    item.emoji = w.emoji;
    item.isWeapon = true;
  } else if (type === 'armor') {
    item.name = '+50 Giáp';
    item.emoji = '🛡️';
  } else if (type === 'health') {
    item.name = '+40 HP Máu';
    item.emoji = '☀️';
  } else if (type === 'speed') {
    item.name = 'Tăng Tốc';
    item.emoji = '🌶️';
  }

  pubgState.groundItems.push(item);
}

function checkLootPickup() {
  const p = pubgState.player;
  for (let i = pubgState.groundItems.length - 1; i >= 0; i--) {
    const item = pubgState.groundItems[i];
    if (Math.hypot(p.x - item.x, p.y - item.y) < p.radius + 20) {
      playSunSound();
      if (item.isWeapon) {
        p.currentWeapon = item.type;
        p.ammo = WEAPONS[item.type].magazineSize;
        p.isReloading = false;
      } else if (item.type === 'armor') {
        p.armor = Math.min(p.maxArmor, p.armor + 50);
      } else if (item.type === 'health') {
        p.health = Math.min(p.maxHealth, p.health + 40);
      } else if (item.type === 'speed') {
        p.speed = 6.8;
        setTimeout(() => (p.speed = 4.6), 8000);
      }
      pubgState.groundItems.splice(i, 1);
    }
  }
}

function updateSafeZone(delta) {
  const z = pubgState.zone;
  const p = pubgState.player;

  if (!z.isShrinking) {
    z.countdown -= delta / 1000;
    if (z.countdown <= 0) {
      z.isShrinking = true;
    }
  } else {
    // Shrink radius toward targetRadius
    if (z.radius > z.targetRadius) {
      z.radius -= z.shrinkSpeed;
      // Shrink center toward target center
      z.centerX += (z.targetCenterX - z.centerX) * 0.002;
      z.centerY += (z.targetCenterY - z.centerY) * 0.002;
    } else {
      // Completed phase
      z.isShrinking = false;
      z.phase++;
      z.countdown = 35;
      z.damagePerSec += 2;
      z.targetRadius = Math.max(200, z.radius * 0.55);
      z.targetCenterX = z.centerX + (Math.random() - 0.5) * (z.radius - z.targetRadius);
      z.targetCenterY = z.centerY + (Math.random() - 0.5) * (z.radius - z.targetRadius);
    }
  }

  // Damage player if outside zone
  const distFromCenter = Math.hypot(p.x - z.centerX, p.y - z.centerY);
  const outOfZoneNotice = document.getElementById('pubgZoneWarning');
  if (distFromCenter > z.radius) {
    p.health -= (z.damagePerSec * delta) / 1000;
    if (outOfZoneNotice) outOfZoneNotice.style.display = 'block';
    if (p.health <= 0) {
      p.health = 0;
      pubgState.isGameOver = true;
    }
  } else {
    if (outOfZoneNotice) outOfZoneNotice.style.display = 'none';
  }
}

function createHitParticles(x, y, color) {
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3;
    pubgState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 3,
      color,
      life: 250,
      maxLife: 250
    });
  }
}

function createExplosionParticles(x, y, color) {
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    pubgState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color,
      life: 400,
      maxLife: 400
    });
  }
}

function updatePubgHud() {
  const p = pubgState.player;
  const w = WEAPONS[p.currentWeapon];
  const z = pubgState.zone;

  const hpBar = document.getElementById('pubgHpFill');
  if (hpBar) hpBar.style.width = `${(p.health / p.maxHealth) * 100}%`;

  const hpText = document.getElementById('pubgHpText');
  if (hpText) hpText.textContent = `${Math.ceil(p.health)} / 100`;

  const armorBar = document.getElementById('pubgArmorFill');
  if (armorBar) armorBar.style.width = `${(p.armor / p.maxArmor) * 100}%`;

  const killsEl = document.getElementById('pubgKills');
  if (killsEl) killsEl.textContent = p.kills;

  const aliveEl = document.getElementById('pubgAlive');
  if (aliveEl) aliveEl.textContent = pubgState.aliveCount;

  const weaponName = document.getElementById('pubgWeaponName');
  if (weaponName && w) weaponName.textContent = `${w.emoji} ${w.name}`;

  const ammoEl = document.getElementById('pubgAmmo');
  if (ammoEl && w) {
    ammoEl.textContent = p.isReloading ? 'RELOADING...' : `${p.ammo} / ${w.magazineSize}`;
  }

  const zoneTime = document.getElementById('pubgZoneTime');
  if (zoneTime) {
    if (z.isShrinking) {
      zoneTime.textContent = '⚡ BO ĐANG THU';
      zoneTime.style.color = '#ff1744';
    } else {
      zoneTime.textContent = `Bo thu: ${Math.max(0, Math.ceil(z.countdown))}s`;
      zoneTime.style.color = '#00e5ff';
    }
  }
}

export function stopPubg() {
  pubgState.active = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
}
