// Entry Point - Plants vs Zombies Multi-Platform
import './styles/index.css';
import { gameState } from './js/state.js';
import { initGame, resetGame, restartGame, togglePause, resumeGame } from './js/game.js';
import { selectPlant } from './js/plants.js';
import { updateBoardDimensions, toggleFullscreen } from './js/board.js';
import { showLeaderboard, closeLeaderboard } from './js/ui.js';
import { initAudio, toggleAudio, isAudioEnabled } from './js/sound.js';
import { SPRITES } from './js/sprites.js';

// Expose functions globally for inline HTML event handlers
window.resumeGame = resumeGame;
window.restartGame = restartGame;
window.resetGame = resetGame;
window.showLeaderboard = showLeaderboard;
window.closeLeaderboard = closeLeaderboard;

// Register Service Worker for PWA Offline Play
if ('serviceWorker' in navigator && !window.location.host.includes('localhost:5173')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker registration skipped:', err));
  });
}

// Setup Event Listeners
function setupAppListeners() {
  // Populate seed cards with rich vector preview
  document.querySelectorAll('.plantCard').forEach((card) => {
    const type = card.dataset.plant;
    const preview = card.querySelector('.card-preview');
    if (preview && SPRITES[type]) {
      preview.innerHTML = SPRITES[type];
    }
  });

  // Unlock Web Audio on first user interaction (required by mobile browsers & iOS)
  const unlockAudio = () => {
    initAudio();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });

  // Plant Cards Selection
  document.querySelectorAll('.plantCard').forEach((card) => {
    const handleSelect = (e) => {
      if (e) e.preventDefault();
      initAudio();
      selectPlant(card);
    };
    card.addEventListener('click', handleSelect);
    card.addEventListener('touchstart', handleSelect, { passive: false });
  });


  // Pause Button
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
  }

  // Speed Toggle Button
  const speedBtn = document.getElementById('speedBtn');
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      gameState.gameSpeed = gameState.gameSpeed === 1 ? 2 : gameState.gameSpeed === 2 ? 3 : 1;
      speedBtn.textContent = `⚡ x${gameState.gameSpeed}`;
      speedBtn.classList.toggle('active', gameState.gameSpeed > 1);
    });
  }

  // Sound Toggle Button
  const soundBtn = document.getElementById('soundBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const enabled = toggleAudio();
      soundBtn.textContent = enabled ? '🔊 Sound' : '🔇 Mute';
      soundBtn.classList.toggle('active', enabled);
    });
  }

  // Leaderboard Button
  const leaderBtn = document.getElementById('leaderBtn');
  if (leaderBtn) {
    leaderBtn.addEventListener('click', showLeaderboard);
  }

  // Fullscreen Button
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Window Resize & Fullscreen changes
  window.addEventListener('resize', updateBoardDimensions);
  document.addEventListener('fullscreenchange', () => setTimeout(updateBoardDimensions, 100));
  document.addEventListener('webkitfullscreenchange', () => setTimeout(updateBoardDimensions, 100));

  // Visibility change: auto-pause when leaving tab
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !gameState.isPaused && !gameState.isGameOver) {
      togglePause();
    } else if (!document.hidden && !gameState.isPaused) {
      gameState.lastUpdate = Date.now();
    }
  });

  // Debug HUD toggle with 'D' key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      const debugInfo = document.getElementById('debugInfo');
      if (debugInfo) {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
      }
    }
  });
}

// Bootstrap Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  setupAppListeners();
  initGame();
});
