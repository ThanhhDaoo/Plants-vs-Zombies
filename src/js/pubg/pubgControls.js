// Controls Module for Keyboard, Mouse, and Dual Virtual Mobile Joysticks
import { pubgState } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';
import { triggerPeaStorm, triggerCherryBomb } from './pubgGame.js';

export function setupPubgControls(canvas) {
  // Elements for interactive desktop key hints
  const keyHintW = document.getElementById('keyHintW');
  const keyHintA = document.getElementById('keyHintA');
  const keyHintS = document.getElementById('keyHintS');
  const keyHintD = document.getElementById('keyHintD');
  const reloadBtn = document.getElementById('pubgReloadBtn');
  const stormBtn = document.getElementById('pubgSkillStormBtn');
  const bombBtn = document.getElementById('pubgSkillBombBtn');
  const dashBtn = document.getElementById('pubgDashBtn');
  const fireBtn = document.getElementById('pubgFireBtn');

  // --- Keyboard Listeners ---
  window.addEventListener('keydown', (e) => {
    if (!pubgState.active) return;
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') {
      pubgState.input.keys.w = true;
      if (keyHintW) keyHintW.classList.add('active');
    }
    if (k === 'a' || k === 'arrowleft') {
      pubgState.input.keys.a = true;
      if (keyHintA) keyHintA.classList.add('active');
    }
    if (k === 's' || k === 'arrowdown') {
      pubgState.input.keys.s = true;
      if (keyHintS) keyHintS.classList.add('active');
    }
    if (k === 'd' || k === 'arrowright') {
      pubgState.input.keys.d = true;
      if (keyHintD) keyHintD.classList.add('active');
    }
    if (k === ' ' || k === 'shift') {
      if (dashBtn) {
        dashBtn.classList.add('active');
        setTimeout(() => dashBtn.classList.remove('active'), 180);
      }
      triggerDash();
    }
    if (k === 'r') {
      if (reloadBtn) {
        reloadBtn.classList.add('active');
        setTimeout(() => reloadBtn.classList.remove('active'), 180);
      }
      triggerReload();
    }
    if (k === 'q') {
      if (stormBtn) {
        stormBtn.classList.add('active');
        setTimeout(() => stormBtn.classList.remove('active'), 180);
      }
      triggerPeaStorm();
    }
    if (k === 'e') {
      if (bombBtn) {
        bombBtn.classList.add('active');
        setTimeout(() => bombBtn.classList.remove('active'), 180);
      }
      triggerCherryBomb();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (!pubgState.active) return;
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') {
      pubgState.input.keys.w = false;
      if (keyHintW) keyHintW.classList.remove('active');
    }
    if (k === 'a' || k === 'arrowleft') {
      pubgState.input.keys.a = false;
      if (keyHintA) keyHintA.classList.remove('active');
    }
    if (k === 's' || k === 'arrowdown') {
      pubgState.input.keys.s = false;
      if (keyHintS) keyHintS.classList.remove('active');
    }
    if (k === 'd' || k === 'arrowright') {
      pubgState.input.keys.d = false;
      if (keyHintD) keyHintD.classList.remove('active');
    }
  });

  // --- Mouse Listeners ---
  canvas.addEventListener('mousemove', (e) => {
    if (!pubgState.active) return;
    const rect = canvas.getBoundingClientRect();
    pubgState.input.mouse.screenX = e.clientX - rect.left;
    pubgState.input.mouse.screenY = e.clientY - rect.top;

    // Convert screen coordinates to world coordinates
    pubgState.input.mouse.worldX =
      pubgState.input.mouse.screenX + (pubgState.camera.x - pubgState.camera.width / 2);
    pubgState.input.mouse.worldY =
      pubgState.input.mouse.screenY + (pubgState.camera.y - pubgState.camera.height / 2);

    // Update player facing angle
    const dx = pubgState.input.mouse.worldX - pubgState.player.x;
    const dy = pubgState.input.mouse.worldY - pubgState.player.y;
    pubgState.player.angle = Math.atan2(dy, dx);
  });

  canvas.addEventListener('mousedown', (e) => {
    if (!pubgState.active) return;
    if (e.button === 0) {
      pubgState.input.mouse.isDown = true;
      if (fireBtn) fireBtn.classList.add('active');
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      pubgState.input.mouse.isDown = false;
      if (fireBtn) fireBtn.classList.remove('active');
    }
  });

  // --- Touch Listeners (Dual Joystick & Combat Buttons for Mobile) ---
  setupMobileTouchHud();

  canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleCanvasTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleCanvasTouchEnd, { passive: false });
}

// On-Screen Joystick & Dedicated Combat Buttons
function setupMobileTouchHud() {
  const joystickZone = document.getElementById('pubgJoystickZone');
  const joystickBase = document.getElementById('pubgJoystickBase');
  const joystickKnob = document.getElementById('pubgJoystickKnob');

  let joystickTouchId = null;
  let baseCenterX = 0;
  let baseCenterY = 0;
  const MAX_RADIUS = 42;

  function updateBaseCenter() {
    if (joystickBase) {
      const rect = joystickBase.getBoundingClientRect();
      baseCenterX = rect.left + rect.width / 2;
      baseCenterY = rect.top + rect.height / 2;
    }
  }

  if (joystickZone && joystickBase && joystickKnob) {
    joystickZone.addEventListener('touchstart', (e) => {
      if (!pubgState.active) return;
      e.preventDefault();
      updateBaseCenter();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (joystickTouchId === null) {
          joystickTouchId = t.identifier;
          handleJoystickMove(t.clientX, t.clientY);
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!pubgState.active || joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystickTouchId) {
          handleJoystickMove(t.clientX, t.clientY);
          break;
        }
      }
    }, { passive: false });

    const handleJoystickEnd = (e) => {
      if (joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          joystickTouchId = null;
          pubgState.input.touch.moveActive = false;
          joystickKnob.style.transform = 'translate(0px, 0px)';
          joystickBase.classList.remove('active');
          break;
        }
      }
    };

    window.addEventListener('touchend', handleJoystickEnd, { passive: false });
    window.addEventListener('touchcancel', handleJoystickEnd, { passive: false });

    function handleJoystickMove(clientX, clientY) {
      const dx = clientX - baseCenterX;
      const dy = clientY - baseCenterY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const clampedDist = Math.min(dist, MAX_RADIUS);
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
      joystickBase.classList.add('active');

      pubgState.input.touch.moveActive = true;
      pubgState.input.touch.moveStartX = 0;
      pubgState.input.touch.moveStartY = 0;
      pubgState.input.touch.moveCurX = knobX;
      pubgState.input.touch.moveCurY = knobY;
    }
  }

  // Dedicated Fire Button (Tap/Hold to shoot & Drag to aim)
  const fireBtn = document.getElementById('pubgFireBtn');
  let fireTouchId = null;
  let fireBtnCenterX = 0;
  let fireBtnCenterY = 0;

  if (fireBtn) {
    fireBtn.addEventListener('touchstart', (e) => {
      if (!pubgState.active) return;
      e.preventDefault();
      const rect = fireBtn.getBoundingClientRect();
      fireBtnCenterX = rect.left + rect.width / 2;
      fireBtnCenterY = rect.top + rect.height / 2;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (fireTouchId === null) {
          fireTouchId = t.identifier;
          pubgState.input.touch.isFiring = true;
          fireBtn.classList.add('active');
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!pubgState.active || fireTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === fireTouchId) {
          const dx = t.clientX - fireBtnCenterX;
          const dy = t.clientY - fireBtnCenterY;
          if (Math.hypot(dx, dy) > 16) {
            pubgState.player.angle = Math.atan2(dy, dx);
            pubgState.isManualAiming = true;
          }
          break;
        }
      }
    }, { passive: false });

    const handleFireEnd = (e) => {
      if (fireTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === fireTouchId) {
          fireTouchId = null;
          pubgState.input.touch.isFiring = false;
          pubgState.isManualAiming = false;
          fireBtn.classList.remove('active');
          break;
        }
      }
    };

    window.addEventListener('touchend', handleFireEnd, { passive: false });
    window.addEventListener('touchcancel', handleFireEnd, { passive: false });

    // Desktop testing support for fire button
    fireBtn.addEventListener('mousedown', (e) => {
      if (!pubgState.active) return;
      e.preventDefault();
      pubgState.input.touch.isFiring = true;
      fireBtn.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
      pubgState.input.touch.isFiring = false;
      pubgState.isManualAiming = false;
      fireBtn.classList.remove('active');
    });
  }

  // Dash & Reload Buttons
  const dashBtn = document.getElementById('pubgDashBtn');
  if (dashBtn) {
    dashBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerDash();
    }, { passive: false });
    dashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerDash();
    });
  }

  const reloadBtn = document.getElementById('pubgReloadBtn');
  if (reloadBtn) {
    reloadBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerReload();
    }, { passive: false });
    reloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerReload();
    });
  }

  // Combat Skill 1: Pea Storm 360° Button
  const stormBtn = document.getElementById('pubgSkillStormBtn');
  if (stormBtn) {
    stormBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerPeaStorm();
    }, { passive: false });
    stormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPeaStorm();
    });
  }

  // Combat Skill 2: Cherry Bomb Button
  const bombBtn = document.getElementById('pubgSkillBombBtn');
  if (bombBtn) {
    bombBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerCherryBomb();
    }, { passive: false });
    bombBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerCherryBomb();
    });
  }
}

// Background Canvas Touch Handlers (Fallback & Free Aim Swipe)
function handleCanvasTouchStart(e) {
  if (!pubgState.active) return;
  const rect = e.target.getBoundingClientRect();
  const halfW = rect.width / 2;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    if (x >= halfW && !pubgState.input.touch.aimActive) {
      // Free aim swipe on right half
      pubgState.input.touch.aimActive = true;
      pubgState.input.touch.aimId = t.identifier;
      pubgState.input.touch.aimStartX = x;
      pubgState.input.touch.aimStartY = y;
      pubgState.input.touch.aimCurX = x;
      pubgState.input.touch.aimCurY = y;
      pubgState.isManualAiming = true;
    }
  }
}

function handleCanvasTouchMove(e) {
  if (!pubgState.active) return;
  const rect = e.target.getBoundingClientRect();

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    if (pubgState.input.touch.aimActive && t.identifier === pubgState.input.touch.aimId) {
      pubgState.input.touch.aimCurX = x;
      pubgState.input.touch.aimCurY = y;
      const dx = x - pubgState.input.touch.aimStartX;
      const dy = y - pubgState.input.touch.aimStartY;
      if (Math.hypot(dx, dy) > 12) {
        pubgState.player.angle = Math.atan2(dy, dx);
        pubgState.isManualAiming = true;
      }
    }
  }
}

function handleCanvasTouchEnd(e) {
  if (!pubgState.active) return;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (pubgState.input.touch.aimActive && t.identifier === pubgState.input.touch.aimId) {
      pubgState.input.touch.aimActive = false;
      pubgState.isManualAiming = false;
    }
  }
}

export function triggerDash() {
  const p = pubgState.player;
  if (p.dashCooldown <= 0 && !p.isDashing) {
    p.isDashing = true;
    p.dashTimer = 220; // 220ms dash duration
    p.dashCooldown = 1500; // 1.5s cooldown
    const dashBtn = document.getElementById('pubgDashBtn');
    if (dashBtn) {
      dashBtn.classList.add('active');
      setTimeout(() => dashBtn.classList.remove('active'), 250);
    }
  }
}

export function triggerReload() {
  const p = pubgState.player;
  const w = WEAPONS[p.currentWeapon];
  if (!w || p.isReloading || p.ammo >= w.magazineSize) return;

  p.isReloading = true;
  p.reloadTimer = w.reloadTime;
  const reloadBtn = document.getElementById('pubgReloadBtn');
  if (reloadBtn) {
    reloadBtn.classList.add('active');
    setTimeout(() => reloadBtn.classList.remove('active'), 300);
  }
}

export { triggerPeaStorm, triggerCherryBomb };

