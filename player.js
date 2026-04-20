// player.js — Player state, movement, interaction

const Player = (() => {
  const SPEED = 2.2;
  const T = 32;

  let x, y, dir, moving;
  let inventory = [];
  let interactCooldown = 0;

  const SPRITE = {
    color: '#c8b89a',
    outline: '#8a7860',
    eyes: true,
    eyeColor: '#1a1410',
    dir: 'down'
  };

  function init(wx, wy) {
    x = wx * T;
    y = wy * T;
    dir = 'down';
    moving = false;
    inventory = GameState.loadInventory() || [];
  }

  function update(keys, dt) {
    if (UI.isBlocking()) return;

    let dx = 0, dy = 0;
    if (keys['ArrowLeft']  || keys['a']) { dx = -SPEED; dir = 'left'; }
    if (keys['ArrowRight'] || keys['d']) { dx =  SPEED; dir = 'right'; }
    if (keys['ArrowUp']    || keys['w']) { dy = -SPEED; dir = 'up'; }
    if (keys['ArrowDown']  || keys['s']) { dy =  SPEED; dir = 'down'; }

    // Diagonal normalise
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

    moving = dx !== 0 || dy !== 0;
    SPRITE.dir = dir;

    // Collision — X then Y
    if (dx !== 0) {
      const nx = x + dx;
      if (!collidesAt(nx, y)) x = nx;
    }
    if (dy !== 0) {
      const ny = y + dy;
      if (!collidesAt(x, ny)) y = ny;
    }

    Engine.updateCamera(x + T / 2, y + T / 2);

    // Exit check
    const tx = Math.floor((x + T / 2) / T);
    const ty = Math.floor((y + T / 2) / T);
    const exit = World.getExit(tx, ty);
    if (exit) {
      if (exit.requireItem && !hasItem(exit.requireItem)) {
        UI.showDialogue('???', 'The way is locked. You need something.', 'LOCKED');
      } else {
        GameEvents.emit('mapTransition', exit);
      }
    }

    if (interactCooldown > 0) interactCooldown--;

    // Sanity drain while moving through certain areas
    if (moving) Sanity.onMove();
  }

  function collidesAt(wx, wy) {
    // Check four corners of the player's hitbox (slightly inset)
    const margin = 4;
    const corners = [
      [wx + margin,     wy + margin],
      [wx + T - margin, wy + margin],
      [wx + margin,     wy + T - margin],
      [wx + T - margin, wy + T - margin],
    ];
    return corners.some(([cx, cy]) => World.isSolid(cx, cy));
  }

  function tryInteract() {
    if (interactCooldown > 0) return;
    // Tile in front of player
    const offsets = { down: [0,1], up: [0,-1], left: [-1,0], right: [1,0] };
    const [ox, oy] = offsets[dir];
    const tx = Math.floor((x + T / 2) / T) + ox;
    const ty = Math.floor((y + T / 2) / T) + oy;

    const obj = World.getInteractable(tx, ty, Sanity.get());
    if (obj) {
      interactCooldown = 30;
      GameEvents.emit('interact', obj);
    }
  }

  function hasItem(id) { return inventory.some(i => i.id === id); }

  function addItem(item) {
    if (!hasItem(item.id)) {
      inventory.push(item);
      GameState.saveInventory(inventory);
      UI.showPickup(item);
    }
  }

  function render(animTick) {
    // Slight bob animation while moving
    const bob = moving ? Math.sin(animTick * 0.25) * 2 : 0;
    Engine.drawSprite(SPRITE, x, y + bob);

    // Footstep dust
    if (moving && animTick % 8 === 0) {
      Engine.drawTile('rgba(200,180,150,0.15)', x + 8, y + T - 4, 16, 4);
    }
  }

  function getPos() { return { x, y, tx: Math.floor((x + T/2)/T), ty: Math.floor((y + T/2)/T) }; }
  function getInventory() { return inventory; }

  return { init, update, tryInteract, render, getPos, getInventory, hasItem, addItem };
})();
