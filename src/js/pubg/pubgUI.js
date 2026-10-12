// Lobby, Armory & Modal UI Controller for PvZ Survival
import { inventory } from './pubgInventory.js';
import { WEAPONS } from './pubgWeapons.js';
import { startPubgGame, stopPubg } from './pubgGame.js';
import { initAudio, toggleAudio, isAudioEnabled } from '../sound.js';

export function setupSurvivalUI() {
  renderLobbyStats();
  setupLobbyEvents();
  setupArmoryEvents();
}

export function renderLobbyStats() {
  const coinsEl = document.getElementById('lobbyCoins');
  if (coinsEl) coinsEl.textContent = inventory.getCoins();

  const brainsEl = document.getElementById('lobbyBrains');
  if (brainsEl) brainsEl.textContent = inventory.getBrains();

  const highScoreEl = document.getElementById('lobbyHighScore');
  if (highScoreEl) highScoreEl.textContent = inventory.data.highScore || 0;

  const top1El = document.getElementById('lobbyTop1');
  if (top1El) top1El.textContent = inventory.data.topRank || 0;

  const totalKillsEl = document.getElementById('lobbyTotalKills');
  if (totalKillsEl) totalKillsEl.textContent = inventory.data.totalKills || 0;

  const top1CountEl = document.getElementById('lobbyTop1Count');
  if (top1CountEl) top1CountEl.textContent = inventory.data.topRank || 0;

  // Selected Weapon Showcase
  const selectedWId = inventory.getSelectedWeapon();
  const effW = inventory.getEffectiveWeapon(selectedWId);

  const previewName = document.getElementById('lobbySelectedWeaponName');
  if (previewName) previewName.textContent = `${effW.emoji} ${effW.name}`;

  const previewLevel = document.getElementById('lobbySelectedWeaponLevel');
  if (previewLevel) previewLevel.textContent = `Cấp độ ${effW.level} ★`;

  const previewDmg = document.getElementById('lobbySelectedWeaponDmg');
  if (previewDmg) previewDmg.textContent = `${effW.damage} DMG`;

  // Hero Attributes & Level
  const heroLvl = Math.max(1, Math.round(((inventory.data.stats?.maxHealthLevel || 1) + (inventory.data.stats?.armorLevel || 1) + (inventory.data.stats?.speedLevel || 1)) / 3));
  const heroLvlEl = document.getElementById('lobbyHeroLevel');
  if (heroLvlEl) heroLvlEl.textContent = heroLvl;

  const hpEl = document.getElementById('lobbyHeroHp');
  if (hpEl) hpEl.textContent = 100 + ((inventory.data.stats?.maxHealthLevel || 1) - 1) * 25;

  const armorEl = document.getElementById('lobbyHeroArmor');
  if (armorEl) armorEl.textContent = 25 + ((inventory.data.stats?.armorLevel || 1) - 1) * 20;

  const speedEl = document.getElementById('lobbyHeroSpeed');
  if (speedEl) speedEl.textContent = (4.6 + ((inventory.data.stats?.speedLevel || 1) - 1) * 0.3).toFixed(1);

  // Player Rank Title
  const rankEl = document.getElementById('lobbyPlayerRankTitle');
  if (rankEl) {
    const score = (inventory.data.highScore || 0) + (inventory.data.totalKills || 0) * 50;
    if (score >= 2000) rankEl.textContent = 'Đậu Đại Tướng 5 Sao 🌟';
    else if (score >= 1000) rankEl.textContent = 'Đậu Đặc Nhiệm Tinh Anh ⚡';
    else if (score >= 400) rankEl.textContent = 'Đậu Biệt Kích Rừng Rậm 🌲';
    else if (score >= 100) rankEl.textContent = 'Chiến Binh Đậu Cỏ 🛡️';
    else rankEl.textContent = 'Tân Binh Đậu Mới Nhú 🌱';
  }

  // Draw Lobby Peashooter Hero Canvas
  drawLobbyHeroPreview();
  startLobbyHeroAnimation();
}

let lobbyHeroAnimId = null;

export function startLobbyHeroAnimation() {
  if (lobbyHeroAnimId) return;
  function loop() {
    const lobbyScreen = document.getElementById('lobbyScreen');
    if (!lobbyScreen || lobbyScreen.style.display === 'none' || lobbyScreen.classList.contains('hidden')) {
      lobbyHeroAnimId = null;
      return;
    }
    drawLobbyHeroPreview();
    lobbyHeroAnimId = requestAnimationFrame(loop);
  }
  lobbyHeroAnimId = requestAnimationFrame(loop);
}

function drawLobbyHeroPreview() {
  const canvas = document.getElementById('lobbyHeroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const selectedWId = inventory.getSelectedWeapon();
  const effW = inventory.getEffectiveWeapon(selectedWId);

  const t = Date.now() / 1000;
  const cx = 76;
  const cy = 96;
  const r = 32;

  // Gentle breathing hover & squash
  const breathHover = Math.sin(t * 2.8) * 2;
  const breathSquash = Math.sin(t * 2.8) * 0.02;
  const charY = cy + breathHover;

  // 1. Soft Dynamic Contact Shadow on Grass Podium
  ctx.save();
  const shadowR = Math.max(18, 30 - breathHover * 1.5);
  ctx.beginPath();
  ctx.ellipse(cx, charY + r * 0.88, shadowR, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();
  ctx.restore();

  // 2. 4 Waddling/Resting Leaf Feet on Podium
  ctx.fillStyle = '#2e7d32';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2;
  // Back feet
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.65, charY + r * 0.7, 9, 5.5, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx + r * 0.25, charY + r * 0.7, 9, 5.5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Front feet
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.35, charY + r * 0.82, 10, 6, -0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + r * 0.45, charY + r * 0.82, 10, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. Dual Swishing Stem Leaves (Back fins) with natural wave physics
  const leafWave = Math.sin(t * 2.2) * 0.14;
  ctx.save();
  ctx.translate(cx - r * 0.78, charY);
  ctx.rotate(leafWave);
  ctx.fillStyle = '#388e3c';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.2;
  // Upper leaf
  ctx.beginPath();
  ctx.ellipse(-8, -11, 14, 8, -0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#81c784';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(-14, -13);
  ctx.stroke();
  // Lower leaf
  ctx.fillStyle = '#388e3c';
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(-8, 11, 14, 8, 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#81c784';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.lineTo(-14, 13);
  ctx.stroke();
  ctx.restore();

  // 4. Peashooter Head Body (3D Spherical Volume)
  ctx.save();
  ctx.translate(cx, charY);
  ctx.scale(1 - breathSquash, 1 + breathSquash);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const headGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.12, 0, 0, r);
  headGrad.addColorStop(0, '#a5d6a7');
  headGrad.addColorStop(0.35, '#4caf50');
  headGrad.addColorStop(0.8, '#2e7d32');
  headGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.strokeStyle = '#134017';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Crescent Specular Highlight on forehead
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.25, r * 0.65, Math.PI * 1.1, Math.PI * 1.6);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // 5. Special Ops Tactical Commando Helmet & Fluttering Red Bandana
  ctx.save();
  ctx.translate(cx, charY);
  ctx.beginPath();
  ctx.arc(-2, 0, r + 1.5, Math.PI * 0.52, Math.PI * 1.48);
  ctx.lineTo(-r * 0.38, 0);
  ctx.closePath();
  const helmGrad = ctx.createLinearGradient(-r, 0, 0, 0);
  helmGrad.addColorStop(0, '#212f24');
  helmGrad.addColorStop(0.7, '#37473a');
  helmGrad.addColorStop(1, '#1e2920');
  ctx.fillStyle = helmGrad;
  ctx.fill();
  ctx.strokeStyle = '#141d15';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Steel rivets on helmet rim
  ctx.fillStyle = '#cfd8dc';
  ctx.beginPath();
  ctx.arc(-r * 0.55, -r * 0.75, 1.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.85, 0, 1.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.55, r * 0.75, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Fluttering Red Commando Bandana Ribbons
  const ribbonWave = Math.sin(t * 3.5) * 5;
  ctx.strokeStyle = '#e53935';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.95, -4);
  ctx.quadraticCurveTo(-r * 1.35, -8 + ribbonWave, -r * 1.55, -5 + ribbonWave);
  ctx.moveTo(-r * 0.95, 3);
  ctx.quadraticCurveTo(-r * 1.35, 7 - ribbonWave, -r * 1.6, 9 - ribbonWave);
  ctx.stroke();
  ctx.restore();

  // 6. Weapon-Specific Snout (Heavy Barrel)
  const snoutX = cx + r + 6;
  // Snout Collar Sleeve
  ctx.fillStyle = '#2e3d30';
  ctx.fillRect(cx + r - 3, charY - 7, 9, 14);
  ctx.strokeStyle = '#141d15';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(cx + r - 3, charY - 7, 9, 14);

  if (selectedWId === 'threepeater_shotgun') {
    [-7, 0, 7].forEach((offsetY) => {
      ctx.beginPath();
      ctx.ellipse(snoutX, charY + offsetY, 9, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = effW.bulletColor;
      ctx.fill();
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = '#143517';
      ctx.beginPath();
      ctx.arc(snoutX + 3, charY + offsetY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (selectedWId === 'snow_pea_sniper') {
    ctx.beginPath();
    ctx.ellipse(snoutX, charY, 13, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#80deea';
    ctx.fill();
    ctx.strokeStyle = '#00838f';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Ice crystals
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(snoutX + 5, charY - 8);
    ctx.lineTo(snoutX + 10, charY - 5);
    ctx.lineTo(snoutX + 4, charY - 4);
    ctx.moveTo(snoutX + 5, charY + 8);
    ctx.lineTo(snoutX + 10, charY + 5);
    ctx.lineTo(snoutX + 4, charY + 4);
    ctx.fill();
  } else if (selectedWId === 'fire_pea_gatling') {
    ctx.beginPath();
    ctx.ellipse(snoutX, charY, 14, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d84315';
    ctx.fill();
    ctx.strokeStyle = '#bf360c';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Revolving brass chambers
    ctx.fillStyle = '#ffb300';
    for (let c = 0; c < 4; c++) {
      const ca = c * (Math.PI / 2) + t * 4;
      ctx.beginPath();
      ctx.arc(snoutX + Math.cos(ca) * 5, charY + Math.sin(ca) * 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (selectedWId === 'melon_bazooka') {
    ctx.beginPath();
    ctx.ellipse(snoutX, charY, 16, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7cb342';
    ctx.fill();
    ctx.strokeStyle = '#33691e';
    ctx.lineWidth = 2.8;
    ctx.stroke();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 3;
    ctx.strokeRect(snoutX - 4, charY - 13, 4, 26);
  } else if (selectedWId === 'plasma_cannon') {
    ctx.beginPath();
    ctx.ellipse(snoutX, charY, 14, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7c4dff';
    ctx.fill();
    ctx.strokeStyle = '#b388ff';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    // Pulsing core
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(snoutX + 2, charY, 5 + Math.sin(t * 5) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Default pea pistol trumpet
    ctx.beginPath();
    ctx.ellipse(snoutX, charY, 13, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = effW.bulletColor;
    ctx.fill();
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    // Inner dark cavity
    ctx.fillStyle = '#143818';
    ctx.beginPath();
    ctx.arc(snoutX + 3, charY, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing red laser sight dot
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(snoutX + 9, charY - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 7. Expressive Determined Cartoon Eyes with Natural Blinking
  const isBlinking = (Date.now() % 3800) < 160;

  if (isBlinking) {
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(cx + 6, charY - 8, 6, 0.2, Math.PI - 0.2);
    ctx.arc(cx + 6, charY + 8, 6, -Math.PI + 0.2, -0.2);
    ctx.stroke();
  } else {
    // Sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx + 5, charY - 8, 6.8, 5.8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 5, charY + 8, 6.8, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#134017';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Large pupils looking forward
    ctx.fillStyle = '#0f1710';
    ctx.beginPath();
    ctx.arc(cx + 7.5, charY - 8, 3.5, 0, Math.PI * 2);
    ctx.arc(cx + 7.5, charY + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Double specular reflection shine dots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Big sparkle
    ctx.arc(cx + 7.8, charY - 9.5, 1.4, 0, Math.PI * 2);
    ctx.arc(cx + 7.8, charY + 6.5, 1.4, 0, Math.PI * 2);
    // Small sparkle
    ctx.arc(cx + 9, charY - 7, 0.8, 0, Math.PI * 2);
    ctx.arc(cx + 9, charY + 9, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function setupLobbyEvents() {
  // Start Battle Button
  const startBtn = document.getElementById('lobbyStartBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      initAudio();
      document.getElementById('lobbyScreen').style.display = 'none';
      document.getElementById('pubgContainer').style.display = 'block';
      startPubgGame();
    });
  }

  // Open Armory / Tủ Đồ Button
  const armoryBtn = document.getElementById('lobbyArmoryBtn');
  if (armoryBtn) {
    armoryBtn.addEventListener('click', () => {
      initAudio();
      openArmoryModal();
    });
  }

  const quickArmoryBtn = document.getElementById('lobbyQuickArmoryBtn');
  if (quickArmoryBtn) {
    quickArmoryBtn.addEventListener('click', () => {
      initAudio();
      openArmoryModal();
    });
  }

  // Open Stats / Training Button
  const statsBtn = document.getElementById('lobbyStatsBtn');
  if (statsBtn) {
    statsBtn.addEventListener('click', () => {
      initAudio();
      openArmoryModal('stats');
    });
  }

  // Guide Modal Controls & Tab Switching
  const guideModal = document.getElementById('guideModal');
  const guideBtn = document.getElementById('lobbyGuideBtn');
  if (guideBtn && guideModal) {
    guideBtn.addEventListener('click', () => {
      initAudio();
      guideModal.style.display = 'flex';
    });
  }

  const closeGuideBtn = document.getElementById('closeGuideBtn');
  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener('click', () => {
      guideModal.style.display = 'none';
    });
  }

  const closeGuideTopBtn = document.getElementById('closeGuideTopBtn');
  if (closeGuideTopBtn && guideModal) {
    closeGuideTopBtn.addEventListener('click', () => {
      guideModal.style.display = 'none';
    });
  }

  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) {
        guideModal.style.display = 'none';
      }
    });

    // Wire up Guide tab switching
    const guideTabBtns = guideModal.querySelectorAll('.guide-tab-btn');
    guideTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        guideTabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTabId = btn.dataset.tab;
        guideModal.querySelectorAll('.guide-tab-content').forEach((content) => {
          content.style.display = content.id === targetTabId ? 'block' : 'none';
        });
      });
    });
  }

  // Sound Button
  const soundBtn = document.getElementById('lobbySoundBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const enabled = toggleAudio();
      soundBtn.textContent = enabled ? '🔊 Bật' : '🔇 Tắt';
      soundBtn.classList.toggle('active', enabled);
    });
  }
}

// Armory Modal Management
export function openArmoryModal(activeTab = 'weapons') {
  renderArmoryTabs(activeTab);
  renderArmoryContent();
  document.getElementById('armoryModal').style.display = 'flex';
}

export function closeArmoryModal() {
  document.getElementById('armoryModal').style.display = 'none';
  renderLobbyStats();
}

let currentArmoryTab = 'weapons';

function renderArmoryTabs(tab) {
  currentArmoryTab = tab;
  const weaponsTabBtn = document.getElementById('tabWeaponsBtn');
  const statsTabBtn = document.getElementById('tabStatsBtn');
  const weaponsContent = document.getElementById('armoryWeaponsContent');
  const statsContent = document.getElementById('armoryStatsContent');

  if (tab === 'weapons') {
    weaponsTabBtn.classList.add('active');
    statsTabBtn.classList.remove('active');
    weaponsContent.style.display = 'grid';
    statsContent.style.display = 'none';
  } else {
    statsTabBtn.classList.add('active');
    weaponsTabBtn.classList.remove('active');
    weaponsContent.style.display = 'none';
    statsContent.style.display = 'grid';
  }
}

function renderArmoryContent() {
  // Update header coins & brains
  const modalCoins = document.getElementById('armoryModalCoins');
  if (modalCoins) modalCoins.textContent = inventory.getCoins();

  const modalBrains = document.getElementById('armoryModalBrains');
  if (modalBrains) modalBrains.textContent = inventory.getBrains();

  // Render Weapons
  const weaponsContainer = document.getElementById('armoryWeaponsContent');
  if (weaponsContainer) {
    weaponsContainer.innerHTML = '';
    const selectedWeapon = inventory.getSelectedWeapon();

    Object.values(WEAPONS).forEach((w) => {
      const isUnlocked = inventory.isWeaponUnlocked(w.id);
      const isEquipped = selectedWeapon === w.id;
      const level = inventory.getWeaponLevel(w.id);
      const effW = inventory.getEffectiveWeapon(w.id);

      const upgradeCost = w.upgradeBaseCost * level;
      const canUnlock = inventory.getCoins() >= w.unlockCoins && inventory.getBrains() >= (w.unlockBrains || 0);
      const canUpgrade = inventory.getCoins() >= upgradeCost && level < 5;

      const card = document.createElement('div');
      card.className = `armory-item-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      card.innerHTML = `
        <div class="card-header">
          <span class="weapon-icon">${w.emoji}</span>
          <div class="weapon-meta">
            <h4>${w.name}</h4>
            <div class="stars">${'★'.repeat(level)}${'☆'.repeat(5 - level)}</div>
          </div>
          ${isEquipped ? '<span class="equipped-badge">ĐANG DÙNG</span>' : ''}
        </div>

        <div class="weapon-stats">
          <div class="stat-row">
            <span>Sát Thương:</span>
            <b>${effW.damage} DMG</b>
          </div>
          <div class="stat-row">
            <span>Băng Đạn:</span>
            <b>${effW.magazineSize} viên</b>
          </div>
          <div class="stat-row">
            <span>Tốc Bắn:</span>
            <b>${Math.round(1000 / effW.fireRate * 10) / 10} v/s</b>
          </div>
        </div>

        <p class="weapon-desc">${w.description}</p>

        <div class="card-actions">
          ${
            !isUnlocked
              ? `
            <button class="action-btn unlock ${canUnlock ? 'can-buy' : 'disabled'}" data-action="unlock" data-id="${w.id}">
              Mở Khóa: ${w.unlockCoins}🪙 ${w.unlockBrains ? `+ ${w.unlockBrains}🧠` : ''}
            </button>
          `
              : `
            ${
              !isEquipped
                ? `<button class="action-btn equip" data-action="equip" data-id="${w.id}">Trang Bị</button>`
                : ''
            }
            ${
              level < 5
                ? `
              <button class="action-btn upgrade ${canUpgrade ? 'can-buy' : 'disabled'}" data-action="upgrade" data-id="${w.id}">
                Nâng Cấp Lv.${level + 1} (${upgradeCost}🪙)
              </button>
            `
                : '<div class="max-badge">ĐẠT CẤP TỐI ĐA MAX</div>'
            }
          `
          }
        </div>
      `;

      weaponsContainer.appendChild(card);
    });
  }

  // Render Stats Upgrades
  const statsContainer = document.getElementById('armoryStatsContent');
  if (statsContainer) {
    statsContainer.innerHTML = '';
    const statsDef = [
      {
        id: 'maxHealthLevel',
        name: 'Máu Tối Đa',
        icon: '❤️',
        desc: 'Tăng lượng máu tối đa, sống dai hơn trước zombie đông đúc.',
        getValue: (lvl) => `${100 + (lvl - 1) * 25} HP`,
        getNextValue: (lvl) => `${100 + lvl * 25} HP`,
        cost: (lvl) => 150 * lvl
      },
      {
        id: 'armorLevel',
        name: 'Giáp Khởi Đầu',
        icon: '🛡️',
        desc: 'Bắt đầu ván đấu với sẵn lượng giáp chống đạn vững chắc.',
        getValue: (lvl) => `${25 + (lvl - 1) * 20} Giáp`,
        getNextValue: (lvl) => `${25 + lvl * 20} Giáp`,
        cost: (lvl) => 200 * lvl
      },
      {
        id: 'speedLevel',
        name: 'Tốc Độ Di Chuyển',
        icon: '👟',
        desc: 'Di chuyển nhanh nhẹn để né cắn và thoát khỏi vòng bo bão điện.',
        getValue: (lvl) => `${Math.round((4.6 + (lvl - 1) * 0.35) * 10) / 10}`,
        getNextValue: (lvl) => `${Math.round((4.6 + lvl * 0.35) * 10) / 10}`,
        cost: (lvl) => 250 * lvl
      },
      {
        id: 'magnetLevel',
        name: 'Nam Châm Hút Loot',
        icon: '🧲',
        desc: 'Tự động hút Vàng, Não và Vật phẩm từ khoảng cách cực xa!',
        getValue: (lvl) => `${50 + (lvl - 1) * 35} px`,
        getNextValue: (lvl) => `${50 + lvl * 35} px`,
        cost: (lvl) => 200 * lvl
      }
    ];

    statsDef.forEach((st) => {
      const lvl = inventory.getStatLevel(st.id);
      const cost = st.cost(lvl);
      const canUpgrade = inventory.getCoins() >= cost && lvl < 5;

      const card = document.createElement('div');
      card.className = 'armory-stat-card';
      card.innerHTML = `
        <div class="stat-header">
          <span class="stat-icon">${st.icon}</span>
          <div>
            <h4>${st.name}</h4>
            <div class="level-indicator">Cấp ${lvl} / 5</div>
          </div>
        </div>

        <div class="stat-progress-bar">
          <div class="fill" style="width: ${(lvl / 5) * 100}%;"></div>
        </div>

        <div class="stat-values">
          <span>Hiện tại: <b>${st.getValue(lvl)}</b></span>
          ${lvl < 5 ? `<span class="next-val">-> Tiếp: <b>${st.getNextValue(lvl)}</b></span>` : ''}
        </div>

        <p class="stat-desc">${st.desc}</p>

        <div class="card-actions">
          ${
            lvl < 5
              ? `
            <button class="action-btn upgrade ${canUpgrade ? 'can-buy' : 'disabled'}" data-action="upgrade-stat" data-id="${st.id}" data-cost="${cost}">
              Nâng Cấp (+${cost}🪙)
            </button>
          `
              : '<div class="max-badge">ĐÃ TỐI ĐA MAX</div>'
          }
        </div>
      `;

      statsContainer.appendChild(card);
    });
  }
}

function setupArmoryEvents() {
  // Tab Switch
  const tabWeaponsBtn = document.getElementById('tabWeaponsBtn');
  if (tabWeaponsBtn) {
    tabWeaponsBtn.addEventListener('click', () => renderArmoryTabs('weapons'));
  }

  const tabStatsBtn = document.getElementById('tabStatsBtn');
  if (tabStatsBtn) {
    tabStatsBtn.addEventListener('click', () => renderArmoryTabs('stats'));
  }

  // Close Armory Modal
  const closeArmoryBtn = document.getElementById('closeArmoryBtn');
  if (closeArmoryBtn) {
    closeArmoryBtn.addEventListener('click', closeArmoryModal);
  }

  // Delegated clicks inside Armory Content
  const armoryModal = document.getElementById('armoryModal');
  if (armoryModal) {
    armoryModal.addEventListener('click', (e) => {
      const btn = e.target.closest('button.action-btn');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === 'equip') {
        inventory.setSelectedWeapon(id);
        renderArmoryContent();
        renderLobbyStats();
      } else if (action === 'unlock') {
        const w = WEAPONS[id];
        if (inventory.unlockWeapon(id, w.unlockCoins, w.unlockBrains || 0)) {
          inventory.setSelectedWeapon(id);
          renderArmoryContent();
          renderLobbyStats();
        }
      } else if (action === 'upgrade') {
        const w = WEAPONS[id];
        const lvl = inventory.getWeaponLevel(id);
        const cost = w.upgradeBaseCost * lvl;
        if (inventory.upgradeWeapon(id, cost)) {
          renderArmoryContent();
          renderLobbyStats();
        }
      } else if (action === 'upgrade-stat') {
        const cost = parseInt(btn.dataset.cost, 10);
        if (inventory.upgradeStat(id, cost)) {
          renderArmoryContent();
          renderLobbyStats();
        }
      }
    });
  }
}
