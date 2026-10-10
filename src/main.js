// Entry Point - Plants vs Zombies: Battle Royale Survival
import './styles/index.css';
import { initAudio, toggleAudio } from './js/sound.js';
import { initPubg, startPubgGame, stopPubg } from './js/pubg/pubgGame.js';
import { setupSurvivalUI, renderLobbyStats, openArmoryModal, closeArmoryModal } from './js/pubg/pubgUI.js';
import { triggerDash, triggerReload } from './js/pubg/pubgControls.js';

// Expose globals for modal button clicks
window.restartPubg = () => {
  startPubgGame();
};

window.exitPubg = () => {
  stopPubg();
  const pubgCont = document.getElementById('pubgContainer');
  if (pubgCont) pubgCont.style.display = 'none';

  const lobbyScreen = document.getElementById('lobbyScreen');
  if (lobbyScreen) lobbyScreen.style.display = 'flex';

  renderLobbyStats();
};

window.openArmory = () => openArmoryModal();
window.closeArmory = () => closeArmoryModal();

// Fullscreen toggle helper
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Service worker for PWA offline play
if ('serviceWorker' in navigator && !window.location.host.includes('localhost:5173')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker registration skipped:', err));
  });
}

function setupApp() {
  // Setup audio on first click
  const unlockAudio = () => {
    initAudio();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });

  // Fullscreen button
  const fsBtn = document.getElementById('lobbyFullscreenBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', toggleFullscreen);
  }

  // PUBG exit button
  const exitPubgBtn = document.getElementById('exitPubgBtn');
  if (exitPubgBtn) {
    exitPubgBtn.addEventListener('click', window.exitPubg);
  }

  // PUBG mobile touch controls
  const pubgDashBtn = document.getElementById('pubgDashBtn');
  if (pubgDashBtn) {
    pubgDashBtn.addEventListener('click', triggerDash);
  }

  const pubgReloadBtn = document.getElementById('pubgReloadBtn');
  if (pubgReloadBtn) {
    pubgReloadBtn.addEventListener('click', triggerReload);
  }

  // Initialize UI & Survival Engine
  setupSurvivalUI();
  initPubg();
}

// Bootstrap on DOM load
window.addEventListener('DOMContentLoaded', setupApp);
