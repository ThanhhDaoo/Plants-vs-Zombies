// Board, Lawnmowers, and Viewport Dimension Module
import { gameState } from './state.js';
import { GAME_CONSTANTS } from './config.js';
import { SPRITES } from './sprites.js';
import { placePlant } from './plants.js';

export function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  );
}

export function createLawnmowers() {
  let mowersContainer = document.getElementById('lawnmowersContainer');
  if (!mowersContainer) {
    mowersContainer = document.createElement('div');
    mowersContainer.id = 'lawnmowersContainer';
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) gameContainer.appendChild(mowersContainer);
  }

  mowersContainer.innerHTML = '';

  for (let row = 0; row < GAME_CONSTANTS.GRID_ROWS; row++) {
    const laneDiv = document.createElement('div');
    laneDiv.className = 'lawnmower-lane';
    laneDiv.id = `lawnmower-lane-${row}`;

    if (gameState.lawnmowers[row]) {
      const mower = document.createElement('div');
      mower.className = 'lawnmower';
      mower.id = `lawnmower-${row}`;
      mower.innerHTML = SPRITES.lawnmower;
      laneDiv.appendChild(mower);
    }

    mowersContainer.appendChild(laneDiv);
  }
}

export function createBoard() {
  const board = document.getElementById('gameBoard');
  if (!board) return;
  board.innerHTML = '';

  for (let row = 0; row < GAME_CONSTANTS.GRID_ROWS; row++) {
    for (let col = 0; col < GAME_CONSTANTS.GRID_COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;

      const onCellAction = (e) => {
        if (e) e.preventDefault();
        placePlant(cell);
      };

      cell.addEventListener('click', onCellAction);
      cell.addEventListener('touchstart', onCellAction, { passive: false });

      board.appendChild(cell);
    }
  }

  createLawnmowers();
  setTimeout(updateBoardDimensions, 100);
}

export function updateBoardDimensions() {
  const board = document.getElementById('gameBoard');
  if (!board) return;

  gameState.boardRect = board.getBoundingClientRect();
  const cells = board.getElementsByClassName('cell');
  if (cells.length > 0) {
    const cellRect = cells[0].getBoundingClientRect();
    gameState.cellSize = {
      width: cellRect.width,
      height: cellRect.height
    };
  }

  // Update existing zombie positions
  gameState.zombies.forEach((zombie) => {
    if (zombie.element) {
      const yPosition =
        gameState.boardRect.top +
        zombie.row * gameState.cellSize.height +
        gameState.cellSize.height / 2 -
        40;
      zombie.element.style.top = `${yPosition}px`;
    }
  });
}

export function enterFullscreen() {
  const elem = document.documentElement;
  const requestFS =
    elem.requestFullscreen ||
    elem.webkitRequestFullscreen ||
    elem.mozRequestFullScreen ||
    elem.msRequestFullscreen;

  if (requestFS && !document.fullscreenElement) {
    requestFS
      .call(elem)
      .then(() => {
        gameState.wasFullscreen = true;
        try {
          localStorage.setItem('pvz_fullscreen', 'true');
        } catch (e) {}

        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
        setTimeout(updateBoardDimensions, 120);
      })
      .catch(() => {});
  }
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    const exitFS =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exitFS) {
      exitFS.call(document).then(() => {
        gameState.wasFullscreen = false;
        try {
          localStorage.removeItem('pvz_fullscreen');
        } catch (e) {}
        setTimeout(updateBoardDimensions, 120);
      });
    }
  }
}
