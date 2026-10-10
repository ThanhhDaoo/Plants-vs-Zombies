// Core Game Engine and Loop Controller
import { gameState, resetGameState, loadGameState } from './state.js';
import { plantTypes, GAME_CONSTANTS } from './config.js';
import { createBoard, updateBoardDimensions, enterFullscreen, isMobile, createLawnmowers } from './board.js';
import { selectPlant, shoot } from './plants.js';
import { moveZombies, spawnZombieWave } from './zombies.js';
import { moveProjectiles } from './projectiles.js';
import { produceSun, spawnSunPeriodically } from './sun.js';
import {
  updateSunDisplay,
  updateDamageDisplay,
  updateWaveDisplay,
  clearAllGameElements,
  showLeaderboard,
  saveToLeaderboard
} from './ui.js';
import { playGameOverSound, playVictorySound } from './sound.js';

export function resetGame() {
  resetGameState();
  clearAllGameElements();

  const sunCount = document.getElementById('sunCount');
  if (sunCount) sunCount.textContent = `${GAME_CONSTANTS.INITIAL_SUN}`;

  const scoreCount = document.getElementById('scoreCount');
  if (scoreCount) scoreCount.textContent = '0';

  const waveCount = document.getElementById('waveCount');
  if (waveCount) waveCount.textContent = '1';

  const dmgBonus = document.getElementById('damageBonus');
  if (dmgBonus) dmgBonus.textContent = '0';

  const speedBtn = document.getElementById('speedBtn');
  if (speedBtn) {
    speedBtn.textContent = '⚡ x1';
    speedBtn.classList.remove('active');
  }

  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) pauseBtn.textContent = '⏸️ Pause';

  const gameOverEl = document.getElementById('gameOver');
  if (gameOverEl) gameOverEl.style.display = 'none';

  const pauseMenuEl = document.getElementById('pauseMenu');
  if (pauseMenuEl) pauseMenuEl.style.display = 'none';

  const victoryEl = document.getElementById('victoryScreen');
  if (victoryEl) victoryEl.style.display = 'none';

  document.querySelectorAll('.plantCard').forEach((card) => {
    card.classList.remove('selected');
  });

  updateSunDisplay();
  updateDamageDisplay();
  updateWaveDisplay();
  createLawnmowers();
  updateBoardDimensions();


  spawnSunPeriodically();
  setTimeout(() => spawnZombieWave(victory), GAME_CONSTANTS.FIRST_WAVE_DELAY);
}

export function gameOver() {
  if (gameState.isGameOver) return;

  playGameOverSound();
  gameState.isGameOver = true;

  saveToLeaderboard(gameState.score, gameState.wave, gameState.zombiesDefeated);

  const gameOverEl = document.getElementById('gameOver');
  if (gameOverEl) gameOverEl.style.display = 'block';

  const finalScore = document.getElementById('finalScore');
  if (finalScore) finalScore.textContent = gameState.score.toLocaleString();

  const finalWave = document.getElementById('finalWave');
  if (finalWave) finalWave.textContent = gameState.wave;

  const finalZombies = document.getElementById('finalZombies');
  if (finalZombies) finalZombies.textContent = gameState.zombiesDefeated;
}

export function victory() {
  if (gameState.isVictory) return;

  playVictorySound();
  gameState.isVictory = true;
  gameState.isGameOver = true;

  gameState.zombies.forEach((zombie) => {
    if (zombie.element) {
      zombie.element.remove();
    }
  });
  gameState.zombies = [];

  gameState.score += GAME_CONSTANTS.VICTORY_BONUS;
  saveToLeaderboard(gameState.score, gameState.wave, gameState.zombiesDefeated);

  const victoryScore = document.getElementById('victoryScore');
  if (victoryScore) victoryScore.textContent = gameState.score.toLocaleString();

  const victoryZombies = document.getElementById('victoryZombies');
  if (victoryZombies) victoryZombies.textContent = gameState.zombiesDefeated;

  const victoryEl = document.getElementById('victoryScreen');
  if (victoryEl) victoryEl.style.display = 'block';
}

export function togglePause() {
  gameState.isPaused = !gameState.isPaused;
  const pauseMenuEl = document.getElementById('pauseMenu');
  if (pauseMenuEl) {
    pauseMenuEl.style.display = gameState.isPaused ? 'block' : 'none';
  }

  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.textContent = gameState.isPaused ? '▶️ Play' : '⏸️ Pause';
  }

  if (gameState.isPaused) {
    gameState.pauseTime = Date.now();
  } else {
    if (gameState.pauseTime) {
      const pauseDuration = Date.now() - gameState.pauseTime;
      gameState.waveStartTime += pauseDuration;
      gameState.pauseTime = null;
    }
    gameState.lastUpdate = Date.now();
  }
}

export function resumeGame() {
  if (gameState.isPaused && gameState.pauseTime) {
    const pauseDuration = Date.now() - gameState.pauseTime;
    gameState.waveStartTime += pauseDuration;
    gameState.pauseTime = null;
  }

  gameState.isPaused = false;
  const pauseMenuEl = document.getElementById('pauseMenu');
  if (pauseMenuEl) pauseMenuEl.style.display = 'none';

  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) pauseBtn.textContent = '⏸️ Pause';

  gameState.lastUpdate = Date.now();
}

export function restartGame() {
  const wasFullscreen = document.fullscreenElement !== null;
  resetGame();
  if (wasFullscreen) {
    enterFullscreen();
  }
}

export function startGameLoop() {
  function gameLoop() {
    const now = Date.now();
    const deltaTime = now - gameState.lastUpdate;
    gameState.lastUpdate = now;

    if (!gameState.isPaused && !gameState.isGameOver) {
      moveZombies(deltaTime, gameOver);
      moveProjectiles(deltaTime);

      gameState.plants.forEach((plant) => {
        if (!plant.element) return;
        const plantType = plantTypes[plant.type];

        if (plantType.produces === 'sun') {
          if (!plant.lastProduction || now - plant.lastProduction > plantType.interval / gameState.gameSpeed) {
            plant.lastProduction = now;
            produceSun(plant);
          }
        }

        if (plantType.shoots) {
          shoot(plant);
        }
      });

      gameState.plants = gameState.plants.filter((p) => p.element);

      const debugInfo = document.getElementById('debugInfo');
      if (debugInfo && debugInfo.style.display === 'block') {
        debugInfo.innerHTML = `
          Zombies: ${gameState.zombies.length}<br>
          Plants: ${gameState.plants.length}<br>
          Projectiles: ${gameState.projectiles.length}<br>
          Score: ${gameState.score}<br>
          Wave: ${gameState.wave}/${gameState.maxWaves}<br>
          Damage Mult: ${gameState.zombieDamageMultiplier.toFixed(2)}x<br>
          FPS: ${Math.round(1000 / deltaTime)}
        `;
      }
    }

    gameState.gameLoopId = requestAnimationFrame(gameLoop);
  }

  gameState.gameLoopId = requestAnimationFrame(gameLoop);
}

export function initGame() {
  createBoard();
  loadGameState();
  startGameLoop();
  spawnSunPeriodically();
  updateDamageDisplay();
  updateWaveDisplay();

  if (isMobile()) {
    setTimeout(enterFullscreen, 500);
  }

  setTimeout(() => spawnZombieWave(victory), GAME_CONSTANTS.FIRST_WAVE_DELAY);
}
