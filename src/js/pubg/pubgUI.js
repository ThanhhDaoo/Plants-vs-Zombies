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

  // Selected Weapon Showcase
  const selectedWId = inventory.getSelectedWeapon();
  const effW = inventory.getEffectiveWeapon(selectedWId);

  const previewName = document.getElementById('lobbySelectedWeaponName');
  if (previewName) previewName.textContent = `${effW.emoji} ${effW.name}`;

  const previewLevel = document.getElementById('lobbySelectedWeaponLevel');
  if (previewLevel) previewLevel.textContent = `Cấp độ ${effW.level} ★`;

  const previewDmg = document.getElementById('lobbySelectedWeaponDmg');
  if (previewDmg) previewDmg.textContent = `${effW.damage} DMG`;

  // Draw Lobby Peashooter Hero Canvas
  drawLobbyHeroPreview();
}

function drawLobbyHeroPreview() {
  const canvas = document.getElementById('lobbyHeroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const selectedWId = inventory.getSelectedWeapon();
  const effW = inventory.getEffectiveWeapon(selectedWId);

  const cx = 68;
  const cy = 80;
  const r = 32;

  // Soft shadow
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.9, r * 1.1, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  // Stem Leaves (Back fins)
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.8, cy - 11, 14, 8, -0.4, 0, Math.PI * 2);
  ctx.ellipse(cx - r * 0.8, cy + 11, 14, 8, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Peashooter Head Body (Radial gradient)
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#4caf50';
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Spetsnaz Level 3 Helmet
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.arc(cx - 2, cy, r + 2, Math.PI * 0.55, Math.PI * 1.45);
  ctx.lineTo(cx - r * 0.4, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Helmet metal visor band
  ctx.fillStyle = '#102027';
  ctx.fillRect(cx - r * 0.35, cy - 14, 7, 28);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(cx - r * 0.35, cy - 14, 7, 28);

  // Heavy Cannon Snout
  const snoutX = cx + r + 8;
  ctx.fillStyle = '#37474f';
  ctx.fillRect(cx + r - 3, cy - 8, 11, 16);

  ctx.beginPath();
  ctx.ellipse(snoutX, cy, 13, 11, 0, 0, Math.PI * 2);
  ctx.fillStyle = effW.bulletColor;
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Glowing laser sight dot
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(snoutX + 8, cy - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + 6, cy - 10, 6.5, 0, Math.PI * 2);
  ctx.arc(cx + 6, cy + 10, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx + 9, cy - 10, 3.2, 0, Math.PI * 2);
  ctx.arc(cx + 9, cy + 10, 3.2, 0, Math.PI * 2);
  ctx.fill();
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
