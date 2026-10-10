// UI & HUD Manager
import { gameState, saveGameState } from './state.js';
import { plantTypes } from './config.js';

export function updateSunDisplay() {
  const sunEl = document.getElementById('sunCount');
  if (sunEl) sunEl.textContent = gameState.sun;

  document.querySelectorAll('.plantCard').forEach((card) => {
    const cost = parseInt(card.dataset.cost, 10);
    if (gameState.sun < cost) {
      card.classList.add('disabled');
    } else {
      card.classList.remove('disabled');
    }
  });

  saveGameState();
}

export function updateDamageDisplay() {
  const bonusEl = document.getElementById('damageBonus');
  if (bonusEl) {
    const bonusPercent = Math.round((gameState.zombieDamageMultiplier - 1) * 100);
    bonusEl.textContent = bonusPercent;
  }
}

export function updateWaveDisplay() {
  const waveCountEl = document.getElementById('waveCount');
  if (waveCountEl) waveCountEl.textContent = gameState.wave;

  const waveElement = document.getElementById('wave');
  if (waveElement) {
    if (gameState.wave === gameState.maxWaves) {
      waveElement.classList.add('final-wave');
    } else {
      waveElement.classList.remove('final-wave');
    }
  }
}

export function addScore(points) {
  gameState.score += points;
  const scoreEl = document.getElementById('scoreCount');
  if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();

  // Bonus 50 suns every 1000 points
  if (gameState.score % 1000 < points) {
    gameState.sun += 50;
    updateSunDisplay();
    const sunCounter = document.getElementById('sunCounter');
    if (sunCounter) showPointsPopup(sunCounter, '+50 ☀️');
  }
}

export function showPointsPopup(element, points) {
  if (!element) return;
  const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : { left: 100, top: 100 };
  const popup = document.createElement('div');
  popup.className = 'points-popup';
  popup.textContent = typeof points === 'number' ? `+${points}` : points;
  popup.style.left = `${rect.left}px`;
  popup.style.top = `${rect.top}px`;
  popup.style.position = 'fixed';

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

export function createParticleEffect(element, emoji) {
  if (!element) return;
  const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : { left: element.offsetLeft || 0, top: element.offsetTop || 0 };

  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = `${rect.left}px`;
    particle.style.top = `${rect.top}px`;
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

export function showSaveNotification() {
  const notification = document.createElement('div');
  notification.className = 'save-notification';
  notification.textContent = '✅ Score Saved to Top 10!';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  let dateStr;
  if (diffDays === 0) {
    dateStr = 'Today';
  } else if (diffDays === 1) {
    dateStr = 'Yesterday';
  } else if (diffDays < 7) {
    dateStr = `${diffDays} days ago`;
  } else {
    dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  return { date: dateStr, time: timeStr };
}

export function getLeaderboard() {
  try {
    const saved = localStorage.getItem('pvz_leaderboard');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function saveToLeaderboard(score, wave, zombies) {
  let leaderboard = getLeaderboard();

  leaderboard.push({
    score,
    wave,
    zombies,
    datetime: new Date().toISOString(),
    victory: gameState.isVictory
  });

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  try {
    localStorage.setItem('pvz_leaderboard', JSON.stringify(leaderboard));
  } catch (e) {}

  if (leaderboard.some((entry) => entry.score === score && entry.datetime === leaderboard[leaderboard.length - 1].datetime)) {
    showSaveNotification();
  }

  return leaderboard;
}

export function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const listElement = document.getElementById('leaderboardList');
  if (!listElement) return;

  listElement.innerHTML = '';

  if (leaderboard.length === 0) {
    listElement.innerHTML = '<p style="color: #666; padding: 20px 0;">No scores yet. Be the first hero!</p>';
    return;
  }

  leaderboard.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'leaderboard-entry';

    if (index === 0) entryDiv.classList.add('gold');
    else if (index === 1) entryDiv.classList.add('silver');
    else if (index === 2) entryDiv.classList.add('bronze');

    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
    const { date, time } = formatDateTime(entry.datetime);
    const victoryBadge = entry.victory ? ' 👑' : '';

    entryDiv.innerHTML = `
      <span class="leaderboard-rank">${medal}</span>
      <div class="leaderboard-datetime">
        <span class="leaderboard-date">${date}${victoryBadge}</span>
        <span class="leaderboard-time">${time}</span>
      </div>
      <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
    `;

    listElement.appendChild(entryDiv);
  });
}

export function showLeaderboard() {
  displayLeaderboard();
  const el = document.getElementById('leaderboard');
  if (el) el.style.display = 'block';
}

export function closeLeaderboard() {
  const el = document.getElementById('leaderboard');
  if (el) el.style.display = 'none';
}

export function clearAllGameElements() {
  document.querySelectorAll('.zombie').forEach((el) => el.remove());
  document.querySelectorAll('.projectile').forEach((el) => el.remove());
  document.querySelectorAll('.sun').forEach((el) => el.remove());
  document.querySelectorAll('.cell .plant').forEach((el) => el.remove());
  document.querySelectorAll('.particle, .points-popup').forEach((el) => el.remove());
}
