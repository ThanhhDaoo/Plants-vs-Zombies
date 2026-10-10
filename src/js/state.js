// Game State Management
import { GAME_CONSTANTS } from './config.js';

export const gameState = {
  sun: GAME_CONSTANTS.INITIAL_SUN,
  score: 0,
  selectedPlant: null,
  plants: [],
  zombies: [],
  projectiles: [],
  suns: [],
  lawnmowers: [true, true, true, true, true],
  activeLawnmowers: [],
  wave: 1,
  maxWaves: GAME_CONSTANTS.MAX_WAVES,
  zombiesDefeated: 0,
  isPaused: false,
  isGameOver: false,
  isVictory: false,
  cellSize: { width: 0, height: 0 },
  boardRect: null,
  gameSpeed: 1,
  lastUpdate: Date.now(),
  zombieDamageMultiplier: 1.0,
  waveTimer: null,
  waveStartTime: Date.now(),
  waveTimeElapsed: 0,
  waveDuration: GAME_CONSTANTS.WAVE_DURATION,
  pauseTime: null,
  wasFullscreen: false,
  sunInterval: null,
  gameLoopId: null
};

export function resetGameState() {
  if (gameState.waveTimer) {
    clearTimeout(gameState.waveTimer);
  }
  if (gameState.sunInterval) {
    clearInterval(gameState.sunInterval);
  }

  gameState.sun = GAME_CONSTANTS.INITIAL_SUN;
  gameState.score = 0;
  gameState.selectedPlant = null;
  gameState.plants = [];
  gameState.zombies = [];
  gameState.projectiles = [];
  gameState.suns = [];
  gameState.lawnmowers = [true, true, true, true, true];
  gameState.activeLawnmowers = [];
  gameState.wave = 1;
  gameState.zombiesDefeated = 0;
  gameState.isPaused = false;
  gameState.isGameOver = false;
  gameState.isVictory = false;
  gameState.gameSpeed = 1;
  gameState.lastUpdate = Date.now();
  gameState.zombieDamageMultiplier = 1.0;
  gameState.waveTimer = null;
  gameState.waveStartTime = Date.now();
  gameState.waveTimeElapsed = 0;
  gameState.pauseTime = null;
  gameState.sunInterval = null;
}

export function saveGameState() {
  try {
    const saveData = {
      sun: gameState.sun,
      score: gameState.score,
      wave: gameState.wave,
      zombiesDefeated: gameState.zombiesDefeated,
      zombieDamageMultiplier: gameState.zombieDamageMultiplier
    };
    localStorage.setItem('pvz_gameState', JSON.stringify(saveData));
  } catch (e) {
    console.warn('Could not save game state to localStorage', e);
  }
}

export function loadGameState() {
  try {
    const shouldBeFullscreen = localStorage.getItem('pvz_fullscreen') === 'true';
    if (shouldBeFullscreen && !document.fullscreenElement) {
      setTimeout(() => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
      }, 200);
    }
  } catch (e) {
    console.warn('Could not load game state', e);
  }
}
