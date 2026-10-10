// PvZ Battle Royale Game Loop, Combat Mechanics & Ground Loot System
import { pubgState, MAP_CONFIG } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';
import { spawnInitialZombies, updateZombies, ZOMBIE_TYPES } from './pubgZombies.js';
import { renderPubg } from './pubgRenderer.js';
import { setupPubgControls, triggerReload } from './pubgControls.js';
import { inventory } from './pubgInventory.js';
import { playShootSound, playHitSound, playExplosionSound, playSunSound } from '../sound.js';

let animationFrameId = null;
let lastTimestamp = 0;
let pubgCanvas = null;
let pubgCtx = null;

export function initPubg() {
  pubgCanvas = document.getElementById('pubgCanvas');
  if (!pubgCanvas) return;
  pubgCtx = pubgCanvas.getContext('2d');

  resizePubgCanvas();
  window.addEventListener('resize', resizePubgCanvas);
  setupPubgControls(pubgCanvas);
}

export function resizePubgCanvas() {
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

  // Apply player stat upgrades from inventory
  const playerStats = inventory.calculatePlayerStats();
  const selectedWId = inventory.getSelectedWeapon();
  const weaponStats = inventory.getEffectiveWeapon(selectedWId);

  const p = pubgState.player;
  p.x = 1200;
  p.y = 1950;
  pubgState.camera.x = 1200;
  pubgState.camera.y = 1950;
  p.health = playerStats.maxHealth;
  p.maxHealth = playerStats.maxHealth;
  p.armor = playerStats.initialArmor;
  p.maxArmor = playerStats.maxArmor;
  p.speed = playerStats.speed;
  p.magnetRadius = playerStats.magnetRadius;

  p.currentWeapon = selectedWId;
  p.ammo = weaponStats.magazineSize;
  p.isReloading = false;
  p.kills = 0;
  p.score = 0;
  p.recoilOffset = 0;

  // Reset in-match rewards
  pubgState.matchRewards = {
    coins: 0,
    brains: 0,
    kills: 0
  };

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
  z.damagePerSec = 4;

  // Clear combat entities
  pubgState.bullets = [];
  pubgState.enemyProjectiles = [];
  pubgState.shockwaves = [];
  pubgState.particles = [];
  pubgState.floatingTexts = [];
  pubgState.groundItems = [];

  // Spawn Crates & Zombies
  spawnCrates(28);
  spawnInitialZombies(32);

  // Update HUD
  updatePubgHud();

  // Hide modals
  document.getElementById('pubgGameOverModal').style.display = 'none';
  document.getElementById('pubgVictoryModal').style.display = 'none';

  lastTimestamp = performance.now();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(pubgGameLoop);
}

function spawnCrates(count = 28) {
  pubgState.crates = [];
  for (let i = 0; i < count; i++) {
    pubgState.crates.push({
      id: `crate_${i}`,
      x: 150 + Math.random() * (MAP_CONFIG.WIDTH - 300),
      y: 150 + Math.random() * (MAP_CONFIG.HEIGHT - 300),
      health: 60,
      maxHealth: 60,
      isAirdrop: i === 0 || i === 1
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
    handleMatchFinish(false);
  } else if (pubgState.isVictory) {
    handleMatchFinish(true);
  } else {
    animationFrameId = requestAnimationFrame(pubgGameLoop);
  }
}

function handleMatchFinish(isWin) {
  // Commit earned coins and brains into persistent inventory
  const { coins, brains, kills } = pubgState.matchRewards;
  const p = pubgState.player;

  // Bonus for victory
  const finalCoins = isWin ? coins + 300 : coins;
  const finalBrains = isWin ? brains + 3 : brains;

  inventory.addRewards(finalCoins, finalBrains, kills, p.score, isWin);

  if (isWin) {
    const modal = document.getElementById('pubgVictoryModal');
    document.getElementById('pubgWinKills').textContent = kills;
    document.getElementById('pubgWinCoins').textContent = `+${finalCoins} 🪙`;
    document.getElementById('pubgWinBrains').textContent = `+${finalBrains} 🧠`;
    modal.style.display = 'flex';
  } else {
    const modal = document.getElementById('pubgGameOverModal');
    document.getElementById('pubgFinalKills').textContent = kills;
    document.getElementById('pubgFinalCoins').textContent = `+${finalCoins} 🪙`;
    document.getElementById('pubgFinalBrains').textContent = `+${finalBrains} 🧠`;
    modal.style.display = 'flex';
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

  // Dash & Speed calculation
  let currentSpeed = p.speed;
  if (p.isDashing) {
    currentSpeed *= 2.6;
    p.dashTimer -= delta;
    if (p.dashTimer <= 0) p.isDashing = false;
  }
  if (p.dashCooldown > 0) p.dashCooldown -= delta;

  // Recoil recovery
  if (p.recoilOffset > 0) {
    p.recoilOffset = Math.max(0, p.recoilOffset - (delta / 16) * 1.5);
  }

  p.x += moveX * currentSpeed;
  p.y += moveY * currentSpeed;

  // Clamp player to map
  p.x = Math.max(p.radius + 15, Math.min(MAP_CONFIG.WIDTH - p.radius - 15, p.x));
  p.y = Math.max(p.radius + 15, Math.min(MAP_CONFIG.HEIGHT - p.radius - 15, p.y));

  // 2. Camera follow smoothly
  const cam = pubgState.camera;
  cam.x += (p.x - cam.x) * 0.12;
  cam.y += (p.y - cam.y) * 0.12;

  // 3. Firing Mechanism
  const now = Date.now();
  const currentW = inventory.getEffectiveWeapon(p.currentWeapon);

  // Reload progress
  if (p.isReloading) {
    p.reloadTimer -= delta;
    if (p.reloadTimer <= 0) {
      p.isReloading = false;
      p.ammo = currentW.magazineSize;
    }
  }

  const isFiring = pubgState.input.mouse.isDown || pubgState.input.touch.aimActive;
  if (isFiring && !p.isReloading && now - p.lastShotTime >= currentW.fireRate) {
    if (p.ammo > 0) {
      fireWeapon(currentW);
      p.lastShotTime = now;
      p.recoilOffset = 6; // Jerk back barrel
      p.ammo--;
      if (p.ammo === 0) triggerReload();
    } else {
      triggerReload();
    }
  }

  // 4. Update Bullets
  updateBullets(delta);

  // 5. Update Zombies
  updateZombies(delta);

  // 6. Update Safe Zone
  updateSafeZone(delta);

  // 7. Ground Loot Magnet & Pickup
  updateGroundLoot(delta);

  // 8. Update Particles
  for (let i = pubgState.particles.length - 1; i >= 0; i--) {
    const pt = pubgState.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life -= delta;
    if (pt.life <= 0) pubgState.particles.splice(i, 1);
  }

  // 9. Update Floating Numbers
  for (let i = pubgState.floatingTexts.length - 1; i >= 0; i--) {
    const ft = pubgState.floatingTexts[i];
    ft.y -= (delta / 16) * 1.2;
    ft.life -= delta;
    if (ft.life <= 0) pubgState.floatingTexts.splice(i, 1);
  }

  // 10. Check Victory condition
  if (pubgState.zombies.length === 0 && p.health > 0) {
    pubgState.isVictory = true;
  }

  // 11. Update HUD
  updatePubgHud();
}

function fireWeapon(w) {
  playShootSound();
  const p = pubgState.player;

  for (let i = 0; i < w.pellets; i++) {
    const spreadAngle = (Math.random() - 0.5) * w.spread;
    const finalAngle = p.angle + spreadAngle;

    pubgState.bullets.push({
      x: p.x + Math.cos(p.angle) * (p.radius + 14),
      y: p.y + Math.sin(p.angle) * (p.radius + 14),
      vx: Math.cos(finalAngle) * w.bulletSpeed,
      vy: Math.sin(finalAngle) * w.bulletSpeed,
      radius: w.bulletRadius,
      color: w.bulletColor,
      damage: w.damage,
      isFire: w.isFire,
      slowEffect: w.slowEffect,
      isExplosive: w.isExplosive,
      blastRadius: w.blastRadius,
      isPlasma: w.isPlasma,
      pierceRemaining: w.pierceCount || (w.id === 'snow_sniper' ? 2 : 1),
      hitZombies: new Set(),
      range: 900,
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

    if (b.distanceTraveled >= b.range) {
      pubgState.bullets.splice(i, 1);
      continue;
    }

    let bulletConsumed = false;

    // Check hit on Zombies
    for (let j = pubgState.zombies.length - 1; j >= 0; j--) {
      const z = pubgState.zombies[j];
      if (b.hitZombies.has(z.id)) continue;

      const dist = Math.hypot(b.x - z.x, b.y - z.y);
      if (dist < z.radius + b.radius) {
        b.hitZombies.add(z.id);
        playHitSound();

        // Calculate actual damage (check Shield zombie facing angle)
        let actualDamage = b.damage;
        if (z.type === 'shield') {
          // Angle from zombie to bullet
          const angleToBullet = Math.atan2(b.y - z.y, b.x - z.x);
          let angleDiff = Math.abs(angleToBullet - z.angle);
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

          if (angleDiff < Math.PI * 0.38) { // Hit front shield!
            actualDamage *= 0.18; // 82% damage blocked!
            addFloatingText(z.x, z.y - 10, 'BLOCKED!', '#bdbdbd', 12);
            createHitParticles(b.x, b.y, '#ffd54f');
          }
        } else if (z.damageReduction) {
          actualDamage *= (1 - z.damageReduction);
        }

        actualDamage = Math.round(actualDamage);

        if (b.isExplosive) {
          playExplosionSound();
          // AOE blast
          pubgState.zombies.forEach((nearbyZ) => {
            const d = Math.hypot(b.x - nearbyZ.x, b.y - nearbyZ.y);
            if (d < b.blastRadius) {
              const aoeDmg = Math.round(b.damage * (1 - d / b.blastRadius));
              nearbyZ.health -= aoeDmg;
              addFloatingText(nearbyZ.x, nearbyZ.y, `-${aoeDmg}`, '#ff9800', 14);
            }
          });
          createExplosionParticles(b.x, b.y, '#ff9800');
          bulletConsumed = true;
        } else {
          z.health -= actualDamage;
          addFloatingText(z.x, z.y, `-${actualDamage}`, b.color, 14);
          if (b.slowEffect) z.slowTimer = 3000;
          createHitParticles(b.x, b.y, b.color);

          b.pierceRemaining--;
          if (b.pierceRemaining <= 0) {
            bulletConsumed = true;
          }
        }

        // Zombie Defeated!
        if (z.health <= 0) {
          handleZombieKilled(z, j);
        }

        if (bulletConsumed) break;
      }
    }

    if (bulletConsumed) {
      pubgState.bullets.splice(i, 1);
      continue;
    }

    // Check hit on Crates
    for (let k = pubgState.crates.length - 1; k >= 0; k--) {
      const c = pubgState.crates[k];
      if (Math.hypot(b.x - c.x, b.y - c.y) < 26 + b.radius) {
        c.health -= b.damage;
        createHitParticles(b.x, b.y, '#8d6e63');

        if (c.health <= 0) {
          playExplosionSound();
          dropCrateLoot(c.x, c.y, c.isAirdrop);
          pubgState.crates.splice(k, 1);
        }
        pubgState.bullets.splice(i, 1);
        break;
      }
    }
  }
}

function handleZombieKilled(z, index) {
  pubgState.player.kills++;
  pubgState.player.score += z.points || 100;
  pubgState.matchRewards.kills++;

  // Drop rich ground loot
  spawnZombieDrops(z);

  // Remove zombie
  pubgState.zombies.splice(index, 1);
  pubgState.aliveCount = pubgState.zombies.length + 1;
}

// Rich Ground Loot Spawning
function spawnZombieDrops(z) {
  const isBoss = z.type === 'boss';

  if (isBoss) {
    // Boss explosion of riches!
    dropCoinItem(z.x - 30, z.y - 20, 250);
    dropCoinItem(z.x + 30, z.y + 20, 250);
    dropBrainItem(z.x - 15, z.y + 25, 3);
    dropBrainItem(z.x + 15, z.y - 25, 2);
    spawnGroundItem('melon_launcher', z.x, z.y);
    spawnGroundItem('health', z.x - 35, z.y);
    spawnGroundItem('armor', z.x + 35, z.y);
    return;
  }

  // Elite zombies (Toxic, Shield, Runner) drop brains & special loot
  if (z.type === 'toxic') {
    dropCoinItem(z.x, z.y, 60);
    dropBrainItem(z.x + 15, z.y, 1);
    if (Math.random() < 0.6) spawnGroundItem('health', z.x - 15, z.y);
    return;
  }

  if (z.type === 'shield') {
    dropCoinItem(z.x, z.y, 70);
    if (Math.random() < 0.8) dropBrainItem(z.x + 15, z.y, 1);
    spawnGroundItem('armor', z.x - 15, z.y);
    return;
  }

  if (z.type === 'runner') {
    dropCoinItem(z.x, z.y, 45);
    if (Math.random() < 0.4) dropBrainItem(z.x + 15, z.y, 1);
    spawnGroundItem('speed', z.x - 15, z.y);
    return;
  }

  if (z.type === 'buckethead') {
    dropCoinItem(z.x, z.y, 45);
    spawnGroundItem('armor', z.x + 15, z.y);
    return;
  }

  if (z.type === 'conehead') {
    dropCoinItem(z.x, z.y, 30);
    if (Math.random() < 0.4) spawnGroundItem('health', z.x + 15, z.y);
    return;
  }

  // Normal Walker
  dropCoinItem(z.x, z.y, 15);
  if (Math.random() < 0.3) {
    spawnGroundItem('ammo', z.x + 15, z.y);
  }
}

function dropCoinItem(x, y, amount) {
  pubgState.groundItems.push({
    x,
    y,
    vx: 0,
    vy: 0,
    type: 'coin',
    amount,
    name: `+${amount} Vàng`,
    emoji: '🪙'
  });
}

function dropBrainItem(x, y, count = 1) {
  pubgState.groundItems.push({
    x,
    y,
    vx: 0,
    vy: 0,
    type: 'brain',
    amount: count,
    name: `+${count} Não Zombie`,
    emoji: '🧠'
  });
}

function dropCrateLoot(x, y, isAirdrop) {
  if (isAirdrop) {
    const weapons = ['fire_gatling', 'melon_launcher', 'plasma_repeater'];
    const chosenW = weapons[Math.floor(Math.random() * weapons.length)];
    spawnGroundItem(chosenW, x, y);
    dropCoinItem(x - 20, y, 100);
    dropBrainItem(x + 20, y, 2);
    spawnGroundItem('armor', x, y + 20);
  } else {
    const pool = ['threepeater', 'snow_sniper', 'health', 'armor', 'speed', 'ammo'];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    spawnGroundItem(chosen, x, y);
    dropCoinItem(x + 15, y, 35);
  }
}

function spawnGroundItem(type, x, y) {
  let item = { x, y, vx: 0, vy: 0, type, name: '', emoji: '' };

  if (WEAPONS[type]) {
    const w = WEAPONS[type];
    item.name = w.name;
    item.emoji = w.emoji;
    item.isWeapon = true;
  } else if (type === 'armor') {
    item.name = '+45 Giáp';
    item.emoji = '🛡️';
  } else if (type === 'health') {
    item.name = '+45 Máu';
    item.emoji = '💚';
  } else if (type === 'speed') {
    item.name = 'Ớt Tăng Tốc';
    item.emoji = '🌶️';
  } else if (type === 'ammo') {
    item.name = 'Hộp Đạn';
    item.emoji = '🔋';
  }

  pubgState.groundItems.push(item);
}

// Magnet & Pickup System
function updateGroundLoot(delta) {
  const p = pubgState.player;

  for (let i = pubgState.groundItems.length - 1; i >= 0; i--) {
    const item = pubgState.groundItems[i];
    const dist = Math.hypot(p.x - item.x, p.y - item.y);

    // 1. Loot Magnet pulling item toward player
    if (dist < p.magnetRadius) {
      const angle = Math.atan2(p.y - item.y, p.x - item.x);
      const pullSpeed = 7.5;
      item.x += Math.cos(angle) * pullSpeed;
      item.y += Math.sin(angle) * pullSpeed;
    }

    // 2. Pickup item on contact
    if (dist < p.radius + 18) {
      playSunSound();

      if (item.type === 'coin') {
        pubgState.matchRewards.coins += item.amount;
        addFloatingText(p.x, p.y - 20, `+${item.amount} Vàng!`, '#ffd54f', 16);
      } else if (item.type === 'brain') {
        pubgState.matchRewards.brains += item.amount;
        addFloatingText(p.x, p.y - 25, `+${item.amount} Não Zombie!`, '#e040fb', 17);
      } else if (item.isWeapon) {
        p.currentWeapon = item.type;
        const effW = inventory.getEffectiveWeapon(item.type);
        p.ammo = effW.magazineSize;
        p.isReloading = false;
        addFloatingText(p.x, p.y - 20, `Nhặt: ${item.name}`, '#00e5ff', 15);
      } else if (item.type === 'armor') {
        p.armor = Math.min(p.maxArmor, p.armor + 45);
        addFloatingText(p.x, p.y - 20, '+45 Giáp', '#ffd54f', 14);
      } else if (item.type === 'health') {
        p.health = Math.min(p.maxHealth, p.health + 45);
        addFloatingText(p.x, p.y - 20, '+45 Máu', '#4caf50', 14);
      } else if (item.type === 'ammo') {
        const curW = inventory.getEffectiveWeapon(p.currentWeapon);
        p.ammo = curW.magazineSize;
        p.isReloading = false;
        addFloatingText(p.x, p.y - 20, 'Đầy Băng Đạn!', '#ffca28', 14);
      } else if (item.type === 'speed') {
        p.speed = 7.2;
        addFloatingText(p.x, p.y - 20, 'Tăng Tốc!', '#ff5722', 15);
        setTimeout(() => {
          const stats = inventory.calculatePlayerStats();
          p.speed = stats.speed;
        }, 8000);
      }

      pubgState.groundItems.splice(i, 1);
    }
  }
}

function addFloatingText(x, y, text, color = '#ffd54f', size = 14) {
  if (!pubgState.floatingTexts) pubgState.floatingTexts = [];
  pubgState.floatingTexts.push({
    x: x + (Math.random() - 0.5) * 20,
    y: y - 10,
    text,
    color,
    size,
    life: 600,
    maxLife: 600
  });
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
    if (z.radius > z.targetRadius) {
      z.radius -= z.shrinkSpeed;
      z.centerX += (z.targetCenterX - z.centerX) * 0.002;
      z.centerY += (z.targetCenterY - z.centerY) * 0.002;
    } else {
      z.isShrinking = false;
      z.phase++;
      z.countdown = 35;
      z.damagePerSec += 2;
      z.targetRadius = Math.max(200, z.radius * 0.55);
      z.targetCenterX = z.centerX + (Math.random() - 0.5) * (z.radius - z.targetRadius);
      z.targetCenterY = z.centerY + (Math.random() - 0.5) * (z.radius - z.targetRadius);
    }
  }

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
  const w = inventory.getEffectiveWeapon(p.currentWeapon);
  const z = pubgState.zone;

  const hpBar = document.getElementById('pubgHpFill');
  if (hpBar) hpBar.style.width = `${(p.health / p.maxHealth) * 100}%`;

  const hpText = document.getElementById('pubgHpText');
  if (hpText) hpText.textContent = `${Math.ceil(p.health)} / ${p.maxHealth}`;

  const armorBar = document.getElementById('pubgArmorFill');
  if (armorBar) armorBar.style.width = `${(p.armor / p.maxArmor) * 100}%`;

  const killsEl = document.getElementById('pubgKills');
  if (killsEl) killsEl.textContent = p.kills;

  const coinsEl = document.getElementById('pubgHudCoins');
  if (coinsEl) coinsEl.textContent = pubgState.matchRewards.coins;

  const brainsEl = document.getElementById('pubgHudBrains');
  if (brainsEl) brainsEl.textContent = pubgState.matchRewards.brains;

  const aliveEl = document.getElementById('pubgAlive');
  if (aliveEl) aliveEl.textContent = pubgState.aliveCount;

  const weaponName = document.getElementById('pubgWeaponName');
  if (weaponName && w) weaponName.textContent = `${w.emoji} ${w.name} (Lv.${w.level})`;

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
