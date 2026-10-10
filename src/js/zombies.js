// Zombies Management & Wave Director Module
import { gameState, saveGameState } from './state.js';
import { zombieTypes, plantTypes } from './config.js';
import { SPRITES, ZOMBIE_IMAGES } from './sprites.js';
import { updatePlantHealth } from './plants.js';
import { updateWaveDisplay, updateDamageDisplay, addScore, showPointsPopup, createParticleEffect } from './ui.js';
import { playWaveSound, playLawnmowerSound } from './sound.js';

export function getZombieDamage(baseZombieDamage) {
  return baseZombieDamage * gameState.zombieDamageMultiplier;
}

export function updateZombieHealth(zombie) {
  if (!zombie.element || !zombie.healthBar) return;
  const healthPercent = Math.max(0, zombie.health / zombieTypes[zombie.type].maxHealth);
  zombie.healthFill.style.width = `${healthPercent * 100}%`;
}

export function spawnZombie() {
  if (!gameState.boardRect) return;

  const row = Math.floor(Math.random() * 5);
  const zombieTypeKeys = Object.keys(zombieTypes);

  let typeIndex = 0;
  const rand = Math.random();
  if (gameState.wave > 7 && rand > 0.8) {
    typeIndex = 4;
  } else if (gameState.wave > 5 && rand > 0.6) {
    typeIndex = 3;
  } else if (gameState.wave > 3 && rand > 0.5) {
    typeIndex = 2;
  } else if (gameState.wave > 1 && rand > 0.3) {
    typeIndex = 1;
  }

  const typeKey = zombieTypeKeys[typeIndex];
  const zombieType = zombieTypes[typeKey];

  const zombie = document.createElement('div');
  zombie.className = `zombie zombie-${typeKey}`;

  // Authentic Official-Style Zombie Sprite Image
  const img = document.createElement('img');
  img.src = ZOMBIE_IMAGES[typeKey] || ZOMBIE_IMAGES.normal;
  img.alt = typeKey;
  img.className = 'zombie-img';
  zombie.appendChild(img);

  const healthBar = document.createElement('div');
  healthBar.className = 'zombie-health-bar';
  const healthFill = document.createElement('div');
  healthFill.className = 'zombie-health-fill';
  healthFill.style.width = '100%';
  healthBar.appendChild(healthFill);
  zombie.appendChild(healthBar);

  const startX = gameState.boardRect.width;
  const yPosition = gameState.boardRect.top + row * gameState.cellSize.height + gameState.cellSize.height / 2 - 45;

  zombie.style.position = 'fixed';
  zombie.style.left = `${gameState.boardRect.left + startX}px`;
  zombie.style.top = `${yPosition}px`;

  const container = document.getElementById('gameContainer') || document.body;
  container.appendChild(zombie);


  const zombieObj = {
    element: zombie,
    healthBar,
    healthFill,
    row,
    health: zombieType.health,
    type: zombieTypeKeys[typeIndex],
    x: startX,
    attacking: false,
    lastAttack: 0,
    slowed: false,
    slowedUntil: 0,
    lastChomped: 0
  };

  gameState.zombies.push(zombieObj);
}

// Lawnmower Trigger on Lane Breach
export function triggerLawnmower(row) {
  if (!gameState.lawnmowers[row]) return false;
  gameState.lawnmowers[row] = false;

  playLawnmowerSound();

  const mowerEl = document.getElementById(`lawnmower-${row}`);
  if (mowerEl) {
    mowerEl.classList.add('active');
    let posX = 0;
    const speed = 750; // fast roll
    const startLeft = mowerEl.getBoundingClientRect().left;

    const mowerInterval = setInterval(() => {
      posX += speed * (16 / 1000) * gameState.gameSpeed;
      mowerEl.style.transform = `translateX(${posX}px)`;

      // Crush any zombie in this row
      const mowerRect = mowerEl.getBoundingClientRect();
      gameState.zombies.forEach((z) => {
        if (z.row === row && z.element) {
          const zRect = z.element.getBoundingClientRect();
          if (mowerRect.right > zRect.left && mowerRect.left < zRect.right) {
            createParticleEffect(z.element, '💀');
            addScore(zombieTypes[z.type].points);
            gameState.zombiesDefeated++;
            z.element.remove();
            z.element = null;
          }
        }
      });

      if (startLeft + posX > window.innerWidth + 100) {
        clearInterval(mowerInterval);
        mowerEl.remove();
      }
    }, 16);
  }

  return true;
}

export function moveZombies(deltaTime, onGameOver) {
  if (!gameState.boardRect) return;

  gameState.zombies = gameState.zombies.filter((zombie) => {
    if (!zombie.element) return false;

    if (zombie.slowed && Date.now() > zombie.slowedUntil) {
      zombie.slowed = false;
      zombie.element.classList.remove('slowed');
    }

    const baseSpeed = zombieTypes[zombie.type].speed;
    const currentSpeed = zombie.slowed ? baseSpeed * 0.5 : baseSpeed;

    if (!zombie.attacking) {
      zombie.x -= ((currentSpeed * deltaTime) / 1000) * gameState.gameSpeed;
      zombie.element.style.left = `${gameState.boardRect.left + zombie.x}px`;

      const yPosition = gameState.boardRect.top + zombie.row * gameState.cellSize.height + gameState.cellSize.height / 2 - 40;
      zombie.element.style.top = `${yPosition}px`;
    }

    zombie.attacking = false;
    const zombieCol = Math.floor(zombie.x / gameState.cellSize.width);

    gameState.plants.forEach((plant) => {
      if (!plant.element || plant.row !== zombie.row) return;

      if (plant.col === zombieCol) {
        zombie.attacking = true;
        zombie.element.classList.add('eating');

        if (plantTypes[plant.type].melee && Date.now() - zombie.lastChomped > 1000) {
          zombie.lastChomped = Date.now();
          const points = zombieTypes[zombie.type].points * 2;
          showPointsPopup(zombie.element, points);
          addScore(points);
          createParticleEffect(zombie.element, '💀');
          zombie.element.remove();
          zombie.element = null;
          gameState.zombiesDefeated++;
          return;
        }

        if (Date.now() - zombie.lastAttack > 1000) {
          zombie.lastAttack = Date.now();
          const damage = getZombieDamage(zombieTypes[zombie.type].damage);
          plant.health -= damage;
          updatePlantHealth(plant);
          plant.element.classList.add('plant-damage-effect');

          setTimeout(() => {
            if (plant.element) {
              plant.element.classList.remove('plant-damage-effect');
            }
          }, 300);

          if (plant.health <= 0) {
            createParticleEffect(plant.element, '💥');
            plant.element.remove();
            plant.element = null;
          }
        }
      }
    });

    if (!zombie.attacking) {
      zombie.element.classList.remove('eating');
    }

    // Lane breach check
    if (zombie.x <= -15) {
      // Check if lawnmower can save the row
      const savedByMower = triggerLawnmower(zombie.row);
      if (!savedByMower) {
        if (typeof onGameOver === 'function') {
          onGameOver();
        }
      }
    }

    return zombie.element !== null;
  });
}

export function spawnZombieWave(onVictory) {
  if (gameState.isGameOver || gameState.isVictory) return;

  playWaveSound();

  const zombieCount = Math.min(3 + Math.floor(gameState.wave / 2), 15);
  const spawnDelay = Math.max(3000 - gameState.wave * 100, 1000);

  let spawnedCount = 0;
  const spawnInterval = setInterval(() => {
    if (gameState.isPaused) return;

    if (!gameState.isGameOver && !gameState.isVictory) {
      spawnZombie();
      spawnedCount++;

      if (spawnedCount >= zombieCount) {
        clearInterval(spawnInterval);
      }
    }
  }, spawnDelay);

  gameState.waveStartTime = Date.now();
  gameState.waveTimeElapsed = 0;

  scheduleNextWave(onVictory);
}

export function scheduleNextWave(onVictory) {
  if (gameState.waveTimer) {
    clearTimeout(gameState.waveTimer);
  }

  function checkWaveProgress() {
    if (gameState.isGameOver || gameState.isVictory) return;

    if (gameState.isPaused) {
      gameState.waveTimeElapsed = Date.now() - gameState.waveStartTime;
      gameState.waveTimer = setTimeout(checkWaveProgress, 100);
      return;
    }

    const currentTime = Date.now();
    const timeSinceStart = currentTime - gameState.waveStartTime;
    const remaining = gameState.waveDuration - timeSinceStart;

    if (remaining <= 0) {
      if (gameState.wave < gameState.maxWaves) {
        gameState.wave++;
        gameState.zombieDamageMultiplier = 1 + (gameState.wave - 1) * 0.02;
        updateWaveDisplay();
        updateDamageDisplay();
        addScore(100 * gameState.wave);
        saveGameState();
        spawnZombieWave(onVictory);
      } else {
        if (typeof onVictory === 'function') {
          onVictory();
        }
      }
    } else {
      gameState.waveTimer = setTimeout(checkWaveProgress, Math.min(remaining, 1000));
    }
  }

  gameState.waveTimer = setTimeout(checkWaveProgress, 1000);
}
