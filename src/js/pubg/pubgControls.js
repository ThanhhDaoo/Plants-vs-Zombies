// Controls Module for Keyboard, Mouse, and Dual Virtual Mobile Joysticks
import { pubgState } from './pubgState.js';
import { WEAPONS } from './pubgWeapons.js';

export function setupPubgControls(canvas) {
  // --- Keyboard Listeners ---
  window.addEventListener('keydown', (e) => {
    if (!pubgState.active) return;
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') pubgState.input.keys.w = true;
    if (k === 'a' || k === 'arrowleft') pubgState.input.keys.a = true;
    if (k === 's' || k === 'arrowdown') pubgState.input.keys.s = true;
    if (k === 'd' || k === 'arrowright') pubgState.input.keys.d = true;
    if (k === ' ' || k === 'shift') triggerDash();
    if (k === 'r') triggerReload();
  });

  window.addEventListener('keyup', (e) => {
    if (!pubgState.active) return;
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') pubgState.input.keys.w = false;
    if (k === 'a' || k === 'arrowleft') pubgState.input.keys.a = false;
    if (k === 's' || k === 'arrowdown') pubgState.input.keys.s = false;
    if (k === 'd' || k === 'arrowright') pubgState.input.keys.d = false;
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
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      pubgState.input.mouse.isDown = false;
    }
  });

  // --- Touch Listeners (Dual Joystick for Mobile) ---
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
  if (!pubgState.active) return;
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();
  const halfW = rect.width / 2;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    if (x < halfW && !pubgState.input.touch.moveActive) {
      // Left half: movement joystick
      pubgState.input.touch.moveActive = true;
      pubgState.input.touch.moveId = t.identifier;
      pubgState.input.touch.moveStartX = x;
      pubgState.input.touch.moveStartY = y;
      pubgState.input.touch.moveCurX = x;
      pubgState.input.touch.moveCurY = y;
    } else if (x >= halfW && !pubgState.input.touch.aimActive) {
      // Right half: aim & shoot joystick
      pubgState.input.touch.aimActive = true;
      pubgState.input.touch.aimId = t.identifier;
      pubgState.input.touch.aimStartX = x;
      pubgState.input.touch.aimStartY = y;
      pubgState.input.touch.aimCurX = x;
      pubgState.input.touch.aimCurY = y;
    }
  }
}

function handleTouchMove(e) {
  if (!pubgState.active) return;
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;

    if (pubgState.input.touch.moveActive && t.identifier === pubgState.input.touch.moveId) {
      pubgState.input.touch.moveCurX = x;
      pubgState.input.touch.moveCurY = y;
    }

    if (pubgState.input.touch.aimActive && t.identifier === pubgState.input.touch.aimId) {
      pubgState.input.touch.aimCurX = x;
      pubgState.input.touch.aimCurY = y;
      const dx = x - pubgState.input.touch.aimStartX;
      const dy = y - pubgState.input.touch.aimStartY;
      if (Math.hypot(dx, dy) > 15) {
        pubgState.player.angle = Math.atan2(dy, dx);
      }
    }
  }
}

function handleTouchEnd(e) {
  if (!pubgState.active) return;
  e.preventDefault();

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (pubgState.input.touch.moveActive && t.identifier === pubgState.input.touch.moveId) {
      pubgState.input.touch.moveActive = false;
    }
    if (pubgState.input.touch.aimActive && t.identifier === pubgState.input.touch.aimId) {
      pubgState.input.touch.aimActive = false;
    }
  }
}

export function triggerDash() {
  const p = pubgState.player;
  if (p.dashCooldown <= 0 && !p.isDashing) {
    p.isDashing = true;
    p.dashTimer = 220; // 220ms dash duration
    p.dashCooldown = 1500; // 1.5s cooldown
  }
}

export function triggerReload() {
  const p = pubgState.player;
  const w = WEAPONS[p.currentWeapon];
  if (!w || p.isReloading || p.ammo >= w.magazineSize) return;

  p.isReloading = true;
  p.reloadTimer = w.reloadTime;
}
