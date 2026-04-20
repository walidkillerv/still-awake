// engine.js — Core rendering engine

const Engine = (() => {
  const TILE = 32;
  let canvas, ctx, W, H;
  let camX = 0, camY = 0;
  let targetCamX = 0, targetCamY = 0;

  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    // Track cursor for CSS custom cursor
    document.addEventListener('mousemove', e => {
      document.documentElement.style.setProperty('--cx', e.clientX + 'px');
      document.documentElement.style.setProperty('--cy', e.clientY + 'px');
    });
  }

  function resize() {
    W = Math.floor(window.innerWidth / TILE) * TILE;
    H = Math.floor(window.innerHeight / TILE) * TILE;
    canvas.width  = W;
    canvas.height = H;
  }

  // Smooth camera follow
  function updateCamera(px, py) {
    targetCamX = px - W / 2;
    targetCamY = py - H / 2;
    camX += (targetCamX - camX) * 0.12;
    camY += (targetCamY - camY) * 0.12;
  }

  function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
  }

  // Draw a tile-based sprite (color rectangle with detail for now — pixel art style)
  function drawTile(color, wx, wy, w = TILE, h = TILE, alpha = 1) {
    const sx = wx - camX;
    const sy = wy - camY;
    if (sx + w < 0 || sx > W || sy + h < 0 || sy > H) return; // cull
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(sx), Math.round(sy), w, h);
    ctx.globalAlpha = 1;
  }

  function drawRect(color, sx, sy, w, h, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, w, h);
    ctx.globalAlpha = 1;
  }

  function drawText(text, sx, sy, opts = {}) {
    const { color = '#dddde8', size = 12, font = 'Share Tech Mono', align = 'left', alpha = 1 } = opts;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${size}px "${font}"`;
    ctx.textAlign = align;
    ctx.fillText(text, sx, sy);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // Draw a sprite: an object with color, outline, detail
  function drawSprite(sprite, wx, wy) {
    const sx = Math.round(wx - camX);
    const sy = Math.round(wy - camY);
    if (sx + TILE < 0 || sx > W || sy + TILE < 0 || sy > H) return;

    // Body
    ctx.fillStyle = sprite.color;
    ctx.fillRect(sx, sy, TILE, TILE);

    // Optional outline
    if (sprite.outline) {
      ctx.strokeStyle = sprite.outline;
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
    }

    // Directional detail (eyes for characters)
    if (sprite.eyes) {
      ctx.fillStyle = sprite.eyeColor || '#000';
      const eyeOffsets = {
        down:  [[8, 20], [20, 20]],
        up:    [[8, 10],  [20, 10]],
        left:  [[6, 16],  [6, 20]],
        right: [[22, 16], [22, 20]]
      };
      const offsets = eyeOffsets[sprite.dir] || eyeOffsets.down;
      offsets.forEach(([ex, ey]) => ctx.fillRect(sx + ex, sy + ey, 3, 3));
    }
  }

  function worldToScreen(wx, wy) {
    return { x: Math.round(wx - camX), y: Math.round(wy - camY) };
  }

  function get() { return { canvas, ctx, W, H, TILE, camX, camY }; }

  return { init, resize, clear, updateCamera, drawTile, drawRect, drawText, drawSprite, worldToScreen, get, get TILE() { return TILE; } };
})();
