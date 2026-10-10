// Projectiles and Collision System
import { gameState } from './state.js';
import { zombieTypes } from './config.js';
import { showPointsPopup, addScore, createParticleEffect } from './ui.js';
import { updateZombieHealth } from './zombies.js';
import { playHitSound } from './sound.js';

export function moveProjectiles(deltaTime) {
  if (!gameState.boardRect) return;

  gameState.projectiles = gameState.projectiles.filter((proj) => {
    if (!proj.element || !proj.element.parentElement) return false;

    proj.x += (proj.speed * deltaTime) / 1000;
    proj.element.style.left = `${gameState.boardRect.left + proj.x}px`;

    const rowY = gameState.boardRect.top + proj.row * gameState.cellSize.height + gameState.cellSize.height / 2 - 10;
    proj.element.style.top = `${rowY}px`;

    const projRect = proj.element.getBoundingClientRect();
    let hit = false;

    gameState.zombies.forEach((zombie) => {
      if (!zombie.element || zombie.row !== proj.row) return;
      if (proj.hitZombies.includes(zombie)) return;

      const zombieRect = zombie.element.getBoundingClientRect();

      if (projRect.left < zombieRect.right && projRect.right > zombieRect.left) {
        playHitSound();
        zombie.health -= proj.damage;
        updateZombieHealth(zombie);
        zombie.element.classList.add('damage-effect');

        if (proj.slow) {
          zombie.slowed = true;
          zombie.slowedUntil = Date.now() + 3000;
          zombie.element.classList.add('slowed');
        }

        if (proj.fire && zombie.element) {
          createParticleEffect(zombie.element, '🔥');
        }

        setTimeout(() => {
          if (zombie.element) {
            zombie.element.classList.remove('damage-effect');
          }
        }, 300);

        if (zombie.health <= 0) {
          if (zombie.element) {
            const points = zombieTypes[zombie.type].points;
            showPointsPopup(zombie.element, points);
            addScore(points);
            createParticleEffect(zombie.element, '💀');
            zombie.element.remove();
            zombie.element = null;
          }
          gameState.zombiesDefeated++;
        }

        if (!proj.pierce) {
          hit = true;
        } else {
          proj.hitZombies.push(zombie);
        }
      }
    });

    if (hit || proj.x > window.innerWidth) {
      proj.element.remove();
      return false;
    }

    return true;
  });
}
