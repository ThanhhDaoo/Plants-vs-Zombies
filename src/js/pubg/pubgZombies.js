// Zombie AI, Spawning & Combat for Battle Royale
import { pubgState, MAP_CONFIG } from './pubgState.js';

export const ZOMBIE_TYPES = {
  normal: {
    id: 'normal',
    name: 'Zombie',
    health: 80,
    speed: 1.9,
    damage: 12,
    radius: 20,
    color: '#8d6e63',
    points: 100
  },
  conehead: {
    id: 'conehead',
    name: 'Conehead Zombie',
    health: 160,
    speed: 1.8,
    damage: 16,
    radius: 21,
    color: '#ff9800',
    points: 200
  },
  buckethead: {
    id: 'buckethead',
    name: 'Buckethead Zombie',
    health: 260,
    speed: 1.7,
    damage: 22,
    radius: 22,
    color: '#9e9e9e',
    points: 350
  },
  runner: {
    id: 'runner',
    name: 'Football Zombie',
    health: 110,
    speed: 3.3,
    damage: 18,
    radius: 20,
    color: '#e53935',
    points: 300
  },
  boss: {
    id: 'boss',
    name: 'Gargantuar Boss',
    health: 700,
    speed: 1.5,
    damage: 38,
    radius: 36,
    color: '#424242',
    points: 1000
  }
};

export function spawnInitialZombies(count = 30) {
  pubgState.zombies = [];
  const p = pubgState.player;

  for (let i = 0; i < count; i++) {
    // Determine type
    let typeKey = 'normal';
    const rand = Math.random();
    if (i === 0) {
      typeKey = 'boss'; // 1 Boss guarding center
    } else if (rand < 0.25) {
      typeKey = 'runner';
    } else if (rand < 0.5) {
      typeKey = 'conehead';
    } else if (rand < 0.7) {
      typeKey = 'buckethead';
    }

    const typeDef = ZOMBIE_TYPES[typeKey];

    // Spawn randomly across the map, at least 350px away from player
    let x, y, dist;
    do {
      x = 100 + Math.random() * (MAP_CONFIG.WIDTH - 200);
      y = 100 + Math.random() * (MAP_CONFIG.HEIGHT - 200);
      dist = Math.hypot(x - p.x, y - p.y);
    } while (dist < 350);

    pubgState.zombies.push({
      id: `z_${i}`,
      type: typeKey,
      name: typeDef.name,
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
      slowTimer: 0,
      patrolTimer: Math.random() * 2000,
      patrolTarget: { x, y }
    });
  }

  pubgState.aliveCount = pubgState.zombies.length + 1;
}

export function updateZombies(delta) {
  const p = pubgState.player;
  const now = Date.now();
  const zone = pubgState.zone;

  for (let i = pubgState.zombies.length - 1; i >= 0; i--) {
    const z = pubgState.zombies[i];

    // Slow effect decay
    if (z.slowTimer > 0) {
      z.slowTimer -= delta;
      z.speed = z.baseSpeed * 0.5;
    } else {
      z.speed = z.baseSpeed;
    }

    // Zone damage for zombies outside safe zone
    const distFromZone = Math.hypot(z.x - zone.centerX, z.y - zone.centerY);
    if (distFromZone > zone.radius) {
      z.health -= (zone.damagePerSec * delta) / 1000;
      if (z.health <= 0) {
        pubgState.zombies.splice(i, 1);
        pubgState.aliveCount = pubgState.zombies.length + 1;
        continue;
      }
    }

    // Distance to player
    const distToPlayer = Math.hypot(p.x - z.x, p.y - z.y);
    const seesPlayer = distToPlayer < 550;

    if (distFromZone > zone.radius + 100) {
      // Flee toward zone center if far outside
      const angleToCenter = Math.atan2(zone.centerY - z.y, zone.centerX - z.x);
      z.angle = angleToCenter;
      z.x += Math.cos(angleToCenter) * z.speed;
      z.y += Math.sin(angleToCenter) * z.speed;
    } else if (seesPlayer && p.health > 0) {
      // Chase player
      const angleToPlayer = Math.atan2(p.y - z.y, p.x - z.x);
      z.angle = angleToPlayer;
      z.x += Math.cos(angleToPlayer) * z.speed;
      z.y += Math.sin(angleToPlayer) * z.speed;

      // Attack player on contact
      if (distToPlayer < z.radius + p.radius + 8 && now - z.lastAttackTime > 900) {
        z.lastAttackTime = now;
        damagePlayer(z.damage);
      }
    } else {
      // Idle patrol
      z.patrolTimer -= delta;
      if (z.patrolTimer <= 0) {
        z.patrolTimer = 2000 + Math.random() * 3000;
        z.angle = Math.random() * Math.PI * 2;
      }
      z.x += Math.cos(z.angle) * (z.speed * 0.4);
      z.y += Math.sin(z.angle) * (z.speed * 0.4);
    }

    // Clamp inside map boundaries
    z.x = Math.max(z.radius, Math.min(MAP_CONFIG.WIDTH - z.radius, z.x));
    z.y = Math.max(z.radius, Math.min(MAP_CONFIG.HEIGHT - z.radius, z.y));
  }
}

function damagePlayer(dmg) {
  const p = pubgState.player;
  if (p.health <= 0) return;

  // Armor absorbs 65% of damage
  if (p.armor > 0) {
    const armorDamage = Math.min(p.armor, dmg * 0.65);
    p.armor -= armorDamage;
    p.health -= dmg - armorDamage;
  } else {
    p.health -= dmg;
  }

  if (p.health <= 0) {
    p.health = 0;
    pubgState.isGameOver = true;
  }
}
