// Sun Spawning and Collection System
import { gameState } from './state.js';
import { plantTypes, GAME_CONSTANTS } from './config.js';
import { SPRITES } from './sprites.js';
import { updateSunDisplay, addScore, createParticleEffect } from './ui.js';
import { playSunSound } from './sound.js';

export function produceSun(plant) {
  if (!plant.element || !plant.element.parentElement) return;

  const cell = plant.element.parentElement;
  const rect = cell.getBoundingClientRect();
  const plantType = plantTypes[plant.type];
  const sunValue = plantType.sunAmount || 40;

  const sun = document.createElement('div');
  sun.className = 'sun';
  sun.innerHTML = SPRITES.sun;

  const sunValueElement = document.createElement('span');
  sunValueElement.className = 'sun-value';
  sunValueElement.textContent = sunValue;
  sun.appendChild(sunValueElement);

  sun.style.left = `${rect.left + rect.width / 2 - 25}px`;
  sun.style.top = `${rect.top - 10}px`;
  sun.style.animation = 'none';
  sun.style.position = 'fixed';

  const container = document.getElementById('gameContainer') || document.body;
  container.appendChild(sun);

  const onCollect = (e) => {
    if (e) e.preventDefault();
    collectSun(sun, sunValue);
  };

  sun.addEventListener('click', onCollect);
  sun.addEventListener('touchstart', onCollect, { passive: false });

  setTimeout(() => {
    if (sun.parentElement) {
      sun.remove();
    }
  }, 6000);
}

export function spawnFallingSun() {
  const sun = document.createElement('div');
  sun.className = 'sun';
  sun.innerHTML = SPRITES.sun;

  const sunValue = document.createElement('span');
  sunValue.className = 'sun-value';
  sunValue.textContent = `${GAME_CONSTANTS.SKY_SUN_VALUE}`;
  sun.appendChild(sunValue);

  sun.style.left = `${Math.random() * (window.innerWidth - 80) + 20}px`;

  const container = document.getElementById('gameContainer') || document.body;
  container.appendChild(sun);

  const onCollect = (e) => {
    if (e) e.preventDefault();
    collectSun(sun, GAME_CONSTANTS.SKY_SUN_VALUE);
  };

  sun.addEventListener('click', onCollect);
  sun.addEventListener('touchstart', onCollect, { passive: false });

  setTimeout(() => {
    if (sun.parentElement) {
      sun.remove();
    }
  }, 10000);
}

export function collectSun(sunElement, value) {
  if (!sunElement.parentElement) return;

  playSunSound();
  sunElement.classList.add('collect-effect');
  gameState.sun += value;
  updateSunDisplay();

  addScore(10);
  createParticleEffect(sunElement, `+${value} ☀️`);

  setTimeout(() => {
    if (sunElement.parentElement) {
      sunElement.remove();
    }
  }, 450);
}

export function spawnSunPeriodically() {
  if (gameState.sunInterval) {
    clearInterval(gameState.sunInterval);
  }

  gameState.sunInterval = setInterval(() => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      spawnFallingSun();
    }
  }, GAME_CONSTANTS.SKY_SUN_INTERVAL);
}
