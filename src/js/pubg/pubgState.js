// State Management for PvZ Battle Royale Mode
import { WEAPONS } from './pubgWeapons.js';

export const MAP_CONFIG = {
  WIDTH: 2400,
  HEIGHT: 2400,
  TOTAL_ZOMBIES: 30
};

export const pubgState = {
  active: false,
  isPaused: false,
  isGameOver: false,
  isVictory: false,

  player: {
    x: 1200,
    y: 1200,
    radius: 24,
    angle: 0,
    health: 100,
    maxHealth: 100,
    armor: 50,
    maxArmor: 100,
    speed: 4.6,
    speedBoostTimer: 0,
    isDashing: false,
    dashTimer: 0,
    dashCooldown: 0,
    currentWeapon: 'pea_pistol',
    ammo: WEAPONS.pea_pistol.magazineSize,
    isReloading: false,
    reloadTimer: 0,
    lastShotTime: 0,
    kills: 0,
    score: 0
  },

  camera: {
    x: 1200,
    y: 1200,
    width: 800,
    height: 600,
    scale: 1
  },

  zone: {
    centerX: 1200,
    centerY: 1200,
    radius: 1450,
    targetCenterX: 1200,
    targetCenterY: 1200,
    targetRadius: 900,
    shrinkSpeed: 0.35,
    phase: 1,
    maxPhases: 4,
    countdown: 45, // seconds until shrink starts
    isShrinking: false,
    damagePerSec: 4
  },

  zombies: [],
  bullets: [],
  crates: [],
  groundItems: [],
  particles: [],
  airdrop: null,

  // Input states
  input: {
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      space: false,
      shift: false,
      r: false,
      e: false
    },
    mouse: {
      screenX: 0,
      screenY: 0,
      worldX: 1200,
      worldY: 1200,
      isDown: false
    },
    touch: {
      moveActive: false,
      moveStartX: 0,
      moveStartY: 0,
      moveCurX: 0,
      moveCurY: 0,
      aimActive: false,
      aimStartX: 0,
      aimStartY: 0,
      aimCurX: 0,
      aimCurY: 0,
      aimAngle: 0
    }
  },

  aliveCount: 31, // 30 zombies + 1 player
  gameTime: 0
};
