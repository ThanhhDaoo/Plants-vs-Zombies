// Plants Management Module
import { gameState } from './state.js';
import { plantTypes } from './config.js';
import { SPRITES } from './sprites.js';
import { updateSunDisplay, createParticleEffect, addScore } from './ui.js';
import { playPlantSound, playShootSound } from './sound.js';

export function selectPlant(card) {
  const cost = parseInt(card.dataset.cost, 10);
  if (gameState.sun >= cost && !gameState.isPaused && !gameState.isGameOver) {
    document.querySelectorAll('.plantCard').forEach((c) => c.classList.remove('selected'));
    card.classList.add('selected');
    gameState.selectedPlant = {
      type: card.dataset.plant,
      cost
    };
  }
}

export function placePlant(cell) {
  if (!gameState.selectedPlant || gameState.isPaused || gameState.isGameOver) return;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  const existingPlant = gameState.plants.find((p) => p.row === row && p.col === col && p.element);
  if (existingPlant) return;

  if (gameState.sun >= gameState.selectedPlant.cost) {
    playPlantSound();
    gameState.sun -= gameState.selectedPlant.cost;
    updateSunDisplay();

    const plantType = plantTypes[gameState.selectedPlant.type];
    const plant = {
      type: gameState.selectedPlant.type,
      row,
      col,
      health: plantType.health,
      maxHealth: plantType.maxHealth,
      element: null,
      healthBar: null,
      healthFill: null,
      lastShot: 0,
      lastProduction: 0
    };

    const plantElement = document.createElement('div');
    plantElement.className = 'plant';
    // Authentic Vector Sprite
    plantElement.innerHTML = SPRITES[plant.type] || '🌱';

    const healthBar = document.createElement('div');
    healthBar.className = 'plant-health-bar';
    const healthFill = document.createElement('div');
    healthFill.className = 'plant-health-fill';
    healthFill.style.width = '100%';
    healthBar.appendChild(healthFill);
    plantElement.appendChild(healthBar);

    cell.appendChild(plantElement);
    plant.element = plantElement;
    plant.healthBar = healthBar;
    plant.healthFill = healthFill;

    gameState.plants.push(plant);

    gameState.selectedPlant = null;
    document.querySelectorAll('.plantCard').forEach((c) => c.classList.remove('selected'));

    createParticleEffect(cell, '✨');
    addScore(25);
  }
}

export function updatePlantHealth(plant) {
  if (!plant.element || !plant.healthFill) return;

  const healthPercent = Math.max(0, plant.health / plant.maxHealth);
  plant.healthFill.style.width = `${healthPercent * 100}%`;

  if (healthPercent < 0.3) {
    plant.healthFill.style.background = 'linear-gradient(90deg, #ff1744, #ff5252)';
  } else if (healthPercent < 0.6) {
    plant.healthFill.style.background = 'linear-gradient(90deg, #ffa000, #ffca28)';
  }

  // Wall-nut crack visual states
  if (plant.type === 'wallnut') {
    const cracks = plant.element.querySelector('.nut-cracks');
    if (cracks) {
      if (healthPercent < 0.35) {
        cracks.setAttribute('opacity', '1');
      } else if (healthPercent < 0.7) {
        cracks.setAttribute('opacity', '0.6');
      } else {
        cracks.setAttribute('opacity', '0');
      }
    }
  }
}

export function shoot(plant) {
  if (!plant.element || !plant.element.parentElement) return;

  const now = Date.now();
  const plantType = plantTypes[plant.type];
  if (!plantType.shoots) return;

  const shootInterval = plantType.shootInterval || 1500;
  if (now - plant.lastShot < shootInterval / gameState.gameSpeed) return;

  let targetRows = [plant.row];
  if (plantType.triple) {
    targetRows = [plant.row - 1, plant.row, plant.row + 1].filter((r) => r >= 0 && r < 5);
  }

  const hasTarget = targetRows.some((row) =>
    gameState.zombies.some((z) => z.row === row && z.element && z.x > plant.col * gameState.cellSize.width)
  );

  if (!hasTarget) return;

  plant.lastShot = now;
  plant.element.classList.add('shooting');
  setTimeout(() => {
    if (plant.element) plant.element.classList.remove('shooting');
  }, 250);

  const cell = plant.element.parentElement;
  const rect = cell.getBoundingClientRect();

  const createProjectileForRow = (targetRow) => {
    playShootSound();
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    if (plantType.fire) projectile.classList.add('fire');

    // Vector projectile sprite
    const projSvg = SPRITES.projectiles[plant.type] || SPRITES.projectiles.peashooter;
    projectile.innerHTML = projSvg;

    const rowY = gameState.boardRect.top + targetRow * gameState.cellSize.height + gameState.cellSize.height / 2 - 14;

    projectile.style.left = `${rect.left + rect.width - 15}px`;
    projectile.style.top = `${rowY}px`;
    projectile.style.position = 'fixed';

    const container = document.getElementById('gameContainer') || document.body;
    container.appendChild(projectile);

    let projectileDamage = plantType.damage;
    if (plant.type === 'chomper' && plantType.shootDamage) {
      projectileDamage = plantType.shootDamage;
    }

    const proj = {
      element: projectile,
      row: targetRow,
      damage: projectileDamage,
      slow: plantType.slow,
      fire: plantType.fire,
      pierce: plantType.pierce,
      x: rect.left + rect.width - gameState.boardRect.left,
      speed: 240 * gameState.gameSpeed,
      hitZombies: []
    };

    gameState.projectiles.push(proj);
  };

  targetRows.forEach((row) => {
    if (gameState.zombies.some((z) => z.row === row && z.element)) {
      createProjectileForRow(row);
    }
  });

  if (plantType.double) {
    setTimeout(() => {
      targetRows.forEach((row) => {
        if (gameState.zombies.some((z) => z.row === row && z.element)) {
          createProjectileForRow(row);
        }
      });
    }, 200);
  }
}
