// Plants vs Zombies - Game Configuration

export const plantTypes = {
  sunflower: {
    emoji: '🌻',
    health: 3.6,
    maxHealth: 3.6,
    produces: 'sun',
    sunAmount: 40,
    interval: 15000,
    shoots: false,
    damage: 0.5,
    shootInterval: 2500,
    projectile: '☀️',
    description: 'Produces sun and shoots'
  },
  peashooter: {
    emoji: '🌱',
    health: 3.6,
    maxHealth: 3.6,
    shoots: true,
    damage: 1,
    shootInterval: 1500,
    projectile: '🟢',
    description: 'Basic shooter'
  },
  wallnut: {
    emoji: '🥥',
    health: 24,
    maxHealth: 24,
    shoots: false,
    damage: 0.3,
    shootInterval: 3000,
    projectile: '🟤',
    description: 'Defensive wall'
  },
  snowpea: {
    emoji: '❄️',
    health: 3.6,
    maxHealth: 3.6,
    shoots: true,
    damage: 1,
    slow: true,
    shootInterval: 2000,
    projectile: '❄️',
    description: 'Slows zombies'
  },
  chomper: {
    emoji: '🌿',
    health: 4.88,
    maxHealth: 4.88,
    melee: false,
    damage: 3,
    interval: 3000,
    shoots: true,
    shootDamage: 2,
    shootInterval: 2500,
    projectile: '🍃',
    description: 'Eats zombies and shoots'
  },
  repeater: {
    emoji: '🌾',
    health: 3.6,
    maxHealth: 3.6,
    shoots: true,
    damage: 1,
    double: true,
    shootInterval: 1500,
    projectile: '🟢',
    description: 'Shoots twice'
  },
  threepeater: {
    emoji: '🎋',
    health: 3.6,
    maxHealth: 3.6,
    shoots: true,
    damage: 1,
    triple: true,
    shootInterval: 1500,
    projectile: '🟢',
    description: 'Shoots 3 lanes'
  },
  firepea: {
    emoji: '🔥',
    health: 3.6,
    maxHealth: 3.6,
    shoots: true,
    damage: 2,
    fire: true,
    shootInterval: 1500,
    projectile: '🔥',
    description: 'Fire damage'
  },
  cactus: {
    emoji: '🌵',
    health: 4.8,
    maxHealth: 4.8,
    shoots: true,
    damage: 1,
    pierce: true,
    shootInterval: 1800,
    projectile: '📍',
    description: 'Piercing shots'
  }
};

export const zombieTypes = {
  normal: { emoji: '🧟', health: 10, maxHealth: 10, speed: 10, damage: 1, points: 100 },
  cone:   { emoji: '🧟‍♂️', health: 20, maxHealth: 20, speed: 10, damage: 1, points: 200 },
  bucket: { emoji: '🧟‍♀️', health: 40, maxHealth: 40, speed: 8,  damage: 1, points: 400 },
  fast:   { emoji: '💀',   health: 6,  maxHealth: 6,  speed: 20, damage: 1, points: 150 },
  strong: { emoji: '👹',   health: 60, maxHealth: 60, speed: 6,  damage: 2, points: 600 }
};

export const GAME_CONSTANTS = {
  GRID_ROWS: 5,
  GRID_COLS: 9,
  INITIAL_SUN: 200,
  MAX_WAVES: 20,
  WAVE_DURATION: 30000,
  SKY_SUN_INTERVAL: 8000,
  SKY_SUN_VALUE: 50,
  FIRST_WAVE_DELAY: 5000,
  VICTORY_BONUS: 5000
};
