// Zombie AI, Tiers, Combat & Attacks for Battle Royale
import { pubgState, MAP_CONFIG } from './pubgState.js';
import { playHitSound, playExplosionSound } from '../sound.js';

export const ZOMBIE_TYPES = {
  normal: {
    id: 'normal',
    tier: 1,
    name: 'Walker Zombie',
    health: 90,
    speed: 1.9,
    damage: 12,
    radius: 20,
    color: '#8d6e63',
    points: 100,
    description: 'Zombie cơ bản, đi chậm nhưng đông đúc.'
  },
  conehead: {
    id: 'conehead',
    tier: 2,
    name: 'Conehead Zombie',
    health: 190,
    speed: 1.8,
    damage: 16,
    radius: 21,
    color: '#ff9800',
    points: 180,
    description: 'Đội nón bảo hộ giao thông tăng độ chống chịu.'
  },
  buckethead: {
    id: 'buckethead',
    tier: 3,
    name: 'Buckethead Zombie',
    health: 320,
    speed: 1.7,
    damage: 22,
    radius: 22,
    color: '#9e9e9e',
    points: 280,
    damageReduction: 0.25, // Absorb 25% damage
    description: 'Đội xô thép dày cứng cáp, giảm sát thương đạn.'
  },
  runner: {
    id: 'runner',
    tier: 3,
    name: 'Football Zombie',
    health: 150,
    speed: 3.5,
    damage: 20,
    radius: 21,
    color: '#d32f2f',
    points: 250,
    description: 'Cầu thủ bóng bầu dục chạy cực nhanh, lao vào húc người chơi.'
  },
  toxic: {
    id: 'toxic',
    tier: 4,
    name: 'Toxic Zombie',
    health: 260,
    speed: 2.0,
    damage: 16,
    radius: 22,
    color: '#00e676',
    points: 400,
    isRanged: true,
    shootCooldown: 2600,
    description: 'Zombie biến dị hóa chất, bắn cầu axit độc tầm xa nguy hiểm.'
  },
  shield: {
    id: 'shield',
    tier: 4,
    name: 'Shield Zombie',
    health: 280,
    speed: 1.6,
    damage: 24,
    radius: 23,
    color: '#5d4037',
    points: 450,
    hasShield: true,
    description: 'Cầm cửa gỗ bọc sắt chắn phía trước, chặn 80% đạn trực diện.'
  },
  boss: {
    id: 'boss',
    tier: 5,
    name: 'Gargantuar Titan Boss',
    health: 1400,
    speed: 1.5,
    damage: 48,
    radius: 38,
    color: '#37474f',
    points: 1500,
    isBoss: true,
    slamCooldown: 4000,
    description: 'Trùm đột biến khổng lồ, vác cột đèn đập đất tạo sóng xung kích hủy diệt!'
  }
};

export function spawnInitialZombies(count = 32) {
  pubgState.zombies = [];
  pubgState.enemyProjectiles = [];
  pubgState.shockwaves = [];
  const p = pubgState.player;

  for (let i = 0; i < count; i++) {
    let typeKey = 'normal';
    const rand = Math.random();

    if (i === 0) {
      typeKey = 'boss'; // 1 Titan Boss guarding center plaza
    } else if (i === 1 || i === 2) {
      typeKey = 'toxic';
    } else if (i === 3 || i === 4) {
      typeKey = 'shield';
    } else if (rand < 0.20) {
      typeKey = 'runner';
    } else if (rand < 0.40) {
      typeKey = 'conehead';
    } else if (rand < 0.60) {
      typeKey = 'buckethead';
    } else if (rand < 0.75) {
      typeKey = 'toxic';
    } else if (rand < 0.88) {
      typeKey = 'shield';
    }

    const typeDef = ZOMBIE_TYPES[typeKey];

    // Spawn across map safely away from player
    let x, y;
    if (typeKey === 'boss') {
      // 1 Titan Boss guards the North Graveyard Lair
      x = 1200;
      y = 480;
    } else {
      let attempts = 0;
      do {
        x = 140 + Math.random() * (MAP_CONFIG.WIDTH - 280);
        y = 140 + Math.random() * (MAP_CONFIG.HEIGHT - 280);
        attempts++;
      } while (Math.hypot(x - p.x, y - p.y) < 350 && attempts < 25);
    }

    pubgState.zombies.push({
      id: `z_${i}`,
      type: typeKey,
      name: typeDef.name,
      tier: typeDef.tier,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: typeDef.radius,
      health: typeDef.health,
      maxHealth: typeDef.health,
      speed: typeDef.speed,
      baseSpeed: typeDef.speed,
      damage: typeDef.damage,
      angle: Math.random() * Math.PI * 2,
      lastAttackTime: 0,
      lastSpecialTime: Date.now() + Math.random() * 2000,
      slowTimer: 0,
      patrolTimer: Math.random() * 2000,
      slamAnimTimer: 0,
      walkCycle: Math.random() * 10
    });
  }

  pubgState.aliveCount = pubgState.zombies.length + 1;
}

export function updateZombies(delta) {
  const p = pubgState.player;
  const now = Date.now();
  const zone = pubgState.zone;

  // 1. Update Boss Shockwaves
  if (pubgState.shockwaves) {
    for (let i = pubgState.shockwaves.length - 1; i >= 0; i--) {
      const sw = pubgState.shockwaves[i];
      sw.radius += sw.expandSpeed * (delta / 16);
      sw.alpha -= 0.025 * (delta / 16);

      // Check collision with player
      if (!sw.hasHitPlayer && p.health > 0) {
        const d = Math.hypot(p.x - sw.x, p.y - sw.y);
        if (Math.abs(d - sw.radius) < 25) {
          sw.hasHitPlayer = true;
          damagePlayer(sw.damage);
          // Knockback
          const angle = Math.atan2(p.y - sw.y, p.x - sw.x);
          p.x += Math.cos(angle) * 35;
          p.y += Math.sin(angle) * 35;
        }
      }

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        pubgState.shockwaves.splice(i, 1);
      }
    }
  }

  // 2. Update Toxic Acid Spit Projectiles
  if (pubgState.enemyProjectiles) {
    for (let i = pubgState.enemyProjectiles.length - 1; i >= 0; i--) {
      const proj = pubgState.enemyProjectiles[i];
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.life -= delta;

      // Hit player
      const d = Math.hypot(p.x - proj.x, p.y - proj.y);
      if (d < p.radius + proj.radius && p.health > 0) {
        damagePlayer(proj.damage);
        playHitSound();
        pubgState.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (proj.life <= 0) {
        pubgState.enemyProjectiles.splice(i, 1);
      }
    }
  }

  // 3. Update Zombies
  for (let i = pubgState.zombies.length - 1; i >= 0; i--) {
    const z = pubgState.zombies[i];
    const typeDef = ZOMBIE_TYPES[z.type];

    // Animation step
    z.walkCycle += (z.speed * delta) / 100;

    // Slow decay
    if (z.slowTimer > 0) {
      z.slowTimer -= delta;
      z.speed = z.baseSpeed * 0.5;
    } else {
      z.speed = z.baseSpeed;
    }

    // Slam animation freeze for boss
    if (z.slamAnimTimer > 0) {
      z.slamAnimTimer -= delta;
      continue; // Don't move while slamming
    }

    // Zone damage outside safe zone
    const distFromZone = Math.hypot(z.x - zone.centerX, z.y - zone.centerY);
    if (distFromZone > zone.radius) {
      z.health -= (zone.damagePerSec * delta) / 1000;
      if (z.health <= 0) {
        pubgState.zombies.splice(i, 1);
        pubgState.aliveCount = pubgState.zombies.length + 1;
        continue;
      }
    }

    const distToPlayer = Math.hypot(p.x - z.x, p.y - z.y);
    const seesPlayer = distToPlayer < (z.type === 'boss' ? 700 : 550);

    if (distFromZone > zone.radius + 120) {
      // Return to zone
      const angleToCenter = Math.atan2(zone.centerY - z.y, zone.centerX - z.x);
      z.angle = angleToCenter;
      z.x += Math.cos(angleToCenter) * z.speed;
      z.y += Math.sin(angleToCenter) * z.speed;
    } else if (seesPlayer && p.health > 0) {
      // Chase player
      const angleToPlayer = Math.atan2(p.y - z.y, p.x - z.x);
      z.angle = angleToPlayer;

      // Special attack: Toxic Spit
      if (z.type === 'toxic' && distToPlayer < 420 && now - z.lastSpecialTime > typeDef.shootCooldown) {
        z.lastSpecialTime = now;
        fireToxicSpit(z, p);
      }

      // Special attack: Boss Shockwave Slam
      if (z.type === 'boss' && distToPlayer < 240 && now - z.lastSpecialTime > typeDef.slamCooldown) {
        z.lastSpecialTime = now;
        z.slamAnimTimer = 700; // 0.7s charge up animation
        setTimeout(() => triggerBossSlam(z), 600);
      }

      // Movement toward player (unless boss is preparing slam)
      if (z.slamAnimTimer <= 0) {
        z.x += Math.cos(angleToPlayer) * z.speed;
        z.y += Math.sin(angleToPlayer) * z.speed;
      }

      // Melee attack
      if (distToPlayer < z.radius + p.radius + 6 && now - z.lastAttackTime > 850) {
        z.lastAttackTime = now;
        damagePlayer(z.damage);
        playHitSound();
      }
    } else {
      // Idle patrol
      z.patrolTimer -= delta;
      if (z.patrolTimer <= 0) {
        z.patrolTimer = 2200 + Math.random() * 2500;
        z.angle = Math.random() * Math.PI * 2;
      }
      z.x += Math.cos(z.angle) * (z.speed * 0.45);
      z.y += Math.sin(z.angle) * (z.speed * 0.45);
    }

    // Boundary clamp
    z.x = Math.max(z.radius, Math.min(MAP_CONFIG.WIDTH - z.radius, z.x));
    z.y = Math.max(z.radius, Math.min(MAP_CONFIG.HEIGHT - z.radius, z.y));
  }
}

function fireToxicSpit(z, p) {
  const angle = Math.atan2(p.y - z.y, p.x - z.x);
  const speed = 7.5;
  if (!pubgState.enemyProjectiles) pubgState.enemyProjectiles = [];

  pubgState.enemyProjectiles.push({
    x: z.x + Math.cos(angle) * (z.radius + 8),
    y: z.y + Math.sin(angle) * (z.radius + 8),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 7,
    damage: 22,
    color: '#00e676',
    life: 1400
  });
}

function triggerBossSlam(z) {
  playExplosionSound();
  if (!pubgState.shockwaves) pubgState.shockwaves = [];

  pubgState.shockwaves.push({
    x: z.x,
    y: z.y,
    radius: 20,
    maxRadius: 210,
    expandSpeed: 7,
    damage: 35,
    alpha: 0.9,
    hasHitPlayer: false
  });
}

export function damagePlayer(dmg) {
  const p = pubgState.player;
  if (p.health <= 0) return;

  if (p.armor > 0) {
    const armorDamage = Math.min(p.armor, dmg * 0.65);
    p.armor -= armorDamage;
    p.health -= (dmg - armorDamage);
  } else {
    p.health -= dmg;
  }

  if (p.health <= 0) {
    p.health = 0;
    pubgState.isGameOver = true;
  }
}
