// world.js — Map data, tile rendering, interactables

const World = (() => {
  const T = 32; // tile size

  // Tile types
  const TILES = {
    VOID:    { color: '#000000', solid: true  },
    FLOOR:   { color: '#1a1a14', solid: false },
    FLOOR2:  { color: '#161612', solid: false },
    FLOOR3:  { color: '#0f0f0c', solid: false },
    WALL:    { color: '#2a2820', solid: true,  outline: '#3a3830' },
    WALL2:   { color: '#1e1c16', solid: true,  outline: '#2e2c22' },
    GRASS:   { color: '#0d150a', solid: false },
    GRASS2:  { color: '#0a1208', solid: false },
    DIRT:    { color: '#1a130a', solid: false },
    ROAD:    { color: '#131310', solid: false },
    WATER:   { color: '#060e14', solid: true,  animate: true },
    DOOR:    { color: '#3a2010', solid: false, isDoor: true },
    TREE:    { color: '#0a1a06', solid: true,  canopy: '#0f2a08' },
    ROCK:    { color: '#252520', solid: true  },
    CHEST:   { color: '#4a3010', solid: true,  isChest: true },
    SIGN:    { color: '#3a2a14', solid: true,  isSign: true },
  };

  // Interactable objects placed over tiles
  // { x, y, type, data, triggered }
  let interactables = [];
  let currentMap = null;
  let mapWidth = 0, mapHeight = 0;
  let tileData = [];

  // ── MAPS ──

  const MAPS = {

    // ─ TOWN SQUARE ─
    town: {
      width: 40,
      height: 30,
      bgColor: '#050505',
      music: 'ambient_town',
      spawnX: 19, spawnY: 22,
      exits: [
        { x: 19, y: 29, to: 'road_south', spawnX: 19, spawnY: 1 },
        { x: 0,  y: 14, to: 'forest_edge', spawnX: 38, spawnY: 14 },
        { x: 39, y: 14, to: 'church_exterior', spawnX: 1, spawnY: 14 },
      ],
      // Row-by-row tile map (simplified — uses char codes)
      // V=void, F=floor, W=wall, G=grass, D=dirt, R=road, T=tree, K=rock, S=sign
      layout: [
        "VVVVVVTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        "VVVVVTTTTGGGGGGGGGGGGGGGGGGGGGGGGGGTTTTV",
        "VVVVTTTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTTTT",
        "VVVTTGGGGWWWWWWGGGGGGGGGGGGWWWWWWGGGGTTV",
        "VVTTGGGGGWFFFFWGGGGGGGGGGGGWFFFFWGGGGTTTV",
        "VVTTGGGGGWFFFFWGGGGGGGGGGGGWFFFFWGGGGTTTV",
        "VVTTGGGGGWWDWWWGGGGGGGGGGGGWWDWWWGGGGTTTV",
        "VVTTGGGGGGdddddgggggggggggddddddggggtttv",
        "VVTTGGGGGGdddddgggggggggggddddddggggtttv",
        "VVTTGGGGGGGGGGGGggggggggggggggggggggtttv",
        "VVTTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTTTV",
        "VTTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTTV",
        "VTTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTTV",
        "VTTGGGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGTTV",// ← exits left/right
        "VTTGGGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGTTV",
        "VTTGGGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGTTV",
        "VTTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTTV",
        "VVTTGGGGGGGGGGWWWWWWWWWWWWWGGGGGGGGGTTTV",
        "VVTTGGGGGGGGGGwffffffffffwGGGGGGGGGGTTTv",
        "VVVTTGGGGGGGGGwffSfffffffwGGGGGGGGTTTTvv",
        "VVVVTTGGGGGGGGwffffffffffwGGGGGGGTTTTvvv",
        "VVVVTTGGGGGGGGwffffffffdwGGGGGGGGTTTTvvv",
        "VVVVVTTGGGGGGGwwwwwwwwwwwGGGGGGGGTTTTvvv",
        "VVVVVTTTGGGGGGGGGGrrrrrrGGGGGGGGGTTTvvvv",
        "VVVVVVTTTGGGGGGGGGrrrrrrGGGGGGGGTTTTvvvv",
        "VVVVVVVTTTGGGGGGGGrrrrrrGGGGGGGTTTTTvvvv",
        "VVVVVVVVTTTGGGGGGGrrrrrrGGGGGGTTTTTTvvvv",
        "VVVVVVVVVVTTTGGGGGrrrrrrGGGGTTTTTTTvvvvv",
        "VVVVVVVVVVVVTTTGGGrrrrrrGGGTTTTTTTvvvvvv",
        "VVVVVVVVVVVVVVTTTTrrrrrrTTTTTTTTvvvvvvvv",// ↓ exit south
      ],
      interactables: [
        { x: 14, y: 4,  type: 'npc',  id: 'henrick',  dialogueKey: 'old_man_henrick' },
        { x: 22, y: 18, type: 'npc',  id: 'maren',    dialogueKey: 'maren_first' },
        { x: 21, y: 19, type: 'sign', text: "CALLOW COMMUNITY BOARD\n\n- Town meeting CANCELLED (see reverse)\n- Dr. Voss unavailable until further notice\n- Please do not approach the church after dark\n- Please do not ask why" },
        { x: 5,  y: 5,  type: 'note', itemId: 'note_torn_page' },
        { x: 30, y: 5,  type: 'note', itemId: 'note_childs_drawing' },
        { x: 7,  y: 13, type: 'note', itemId: 'note_postmaster', hidden: true }, // only visible low sanity
      ]
    },

    // ─ CHURCH EXTERIOR ─
    church_exterior: {
      width: 30,
      height: 25,
      bgColor: '#030305',
      music: 'ambient_dread',
      spawnX: 28, spawnY: 12,
      exits: [
        { x: 0,  y: 12, to: 'town',    spawnX: 38, spawnY: 14 },
        { x: 14, y: 1,  to: 'church_interior', spawnX: 7, spawnY: 18 }
      ],
      layout: [
        "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        "VVVVVVVVVVGGGGGGDGGGGGGVVVVVVVV",// ↑ door to interior
        "VVVVVVVVGGWWWWWWWWWWWWWGGVVVVVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWFFFFFFFFFFFFFFFFFWGGVV",
        "VVVVVVVGGWWWWWWWWWWWWWWWWWWWGGV",
        "VVVVVVVGGGGGGGGGGGGGGGGGGGGGGGVV",
        "VVGGGGGGGGGGGRRRRRRRRGGGGGGGGGGV",// exits ←→
        "VVGGGGGGGGGGGRRRRRRRRGGGGGGGGGGV",
        "VVVGGGGGGGGGGRRRRRRRRGGGGGGGGGVV",
        "VVVVGGGGGGGGGRRRRRRRRGGGGGGGGGVV",
        "VVVVVGGGGKKKGGGGGGGGGGGKKKKGGVVV",
        "VVVVVVGGGGKKKGGGGGGGGGGKKKGGVVVV",
        "VVVVVVVGGGGGGGGGGGGGGGGGGGGGVVVV",
        "VVVVVVVVGGGGGGGGGGGGGGGGGGGGVVVV",
        "VVVVVVVVVGGGGGGGGGGGGGGGGGVVVVVV",
        "VVVVVVVVVVVGGGGGGGGGGGGGVVVVVVVV",
        "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
        "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
      ],
      interactables: [
        { x: 14, y: 5, type: 'npc', id: 'maren_church', dialogueKey: 'maren_basement' },
        { x: 8,  y: 7, type: 'note', itemId: 'note_basement_door' },
        { x: 18, y: 7, type: 'note', itemId: 'note_game_manual', hidden: true },
      ]
    },

    // ─ CHURCH INTERIOR ─
    church_interior: {
      width: 18,
      height: 22,
      bgColor: '#020204',
      music: 'ambient_deep',
      spawnX: 7, spawnY: 19,
      exits: [
        { x: 7,  y: 20, to: 'church_exterior', spawnX: 14, spawnY: 2 },
        { x: 7,  y: 2,  to: 'church_basement', spawnX: 7, spawnY: 18, requireItem: 'iron_key' }
      ],
      layout: [
        "VVVVVVVVVVVVVVVVVV",
        "VVVVVVVVVVVVVVVVVV",
        "VVVWWWWWWWWWWWWWVV",// ← basement door (locked)
        "VVVWFFFFFFFFFFFFWVV",
        "VVVWFFFFFFFFFFFFWVV",
        "VVVWFFWWWWWWFFFFWVV",
        "VVVWFFWFFFFFWFFFFWVV",
        "VVVWFFWFFFFFWFFFFWVV",
        "VVVwffwfffffwffffwvv",
        "VVVwffwfffffwffffwvv",
        "VVVwffwwwwwwwffffwvv",
        "VVVwffffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwfffffffffffffffwvv",
        "VVVwwwwwwwwwwwwwwwwvv",
        "VVVVVVVVVVDVVVVVVVVvv",// exit south
        "VVVVVVVVVVVVVVVVVVVVV",
        "VVVVVVVVVVVVVVVVVVVVV",
      ],
      interactables: [
        { x: 8,  y: 6,  type: 'note', itemId: 'note_dr_voss' },
        { x: 5,  y: 12, type: 'note', itemId: 'note_maren_letter' },
        { x: 12, y: 14, type: 'item', itemId: 'iron_key', label: 'an iron key', icon: '🗝' },
        { x: 9,  y: 4,  type: 'npc',  id: 'the_child', dialogueKey: 'the_child' },
      ]
    },

    // ─ ROAD SOUTH (leads out of town — escape route) ─
    road_south: {
      width: 25,
      height: 40,
      bgColor: '#030303',
      music: 'ambient_road',
      spawnX: 12, spawnY: 2,
      exits: [
        { x: 12, y: 0,  to: 'town',      spawnX: 19, spawnY: 28 },
        { x: 12, y: 38, to: 'ending_escape', spawnX: 12, spawnY: 2 }
      ],
      layout: (() => {
        // Procedurally build a long road
        const rows = [];
        for (let r = 0; r < 40; r++) {
          let row = '';
          for (let c = 0; c < 25; c++) {
            if (c === 0 || c === 24) row += 'T';
            else if (c >= 10 && c <= 14) row += 'R';
            else if (c <= 3 || c >= 21) row += 'T';
            else row += 'G';
          }
          rows.push(row);
        }
        return rows;
      })(),
      interactables: [
        { x: 12, y: 20, type: 'note', itemId: 'note_hidden_wall' },
        { x: 7,  y: 10, type: 'npc',  id: 'henrick_road', dialogueKey: 'old_man_henrick_2' },
      ]
    },

    // ─ FOREST EDGE ─
    forest_edge: {
      width: 40,
      height: 20,
      bgColor: '#010301',
      music: 'ambient_forest',
      spawnX: 1, spawnY: 10,
      exits: [
        { x: 0,  y: 10, to: 'town', spawnX: 2, spawnY: 14 }
      ],
      layout: (() => {
        const rows = [];
        for (let r = 0; r < 20; r++) {
          let row = '';
          for (let c = 0; c < 40; c++) {
            const density = c / 40;
            if (density > 0.7 && Math.random() < density) row += 'T';
            else if (density > 0.4 && Math.random() < 0.3) row += 'K';
            else row += (Math.random() < 0.7 ? 'G' : 'F');
          }
          rows.push(row);
        }
        return rows;
      })(),
      interactables: []
    },

    // ─ ENDINGS ─
    ending_escape: {
      width: 10,
      height: 5,
      bgColor: '#000000',
      music: null,
      spawnX: 5, spawnY: 2,
      exits: [],
      layout: [
        "FFFFFFFFFF",
        "FFFFFFFFFF",
        "FFFFFFFFFF",
        "FFFFFFFFFF",
        "FFFFFFFFFF",
      ],
      interactables: [],
      onLoad: () => { GameState.triggerEnding('escape'); }
    }
  };

  // ── CHAR → TILE mapping ──
  const CHAR_MAP = {
    'V': 'VOID',  'F': 'FLOOR', 'f': 'FLOOR2', 'W': 'WALL',  'w': 'WALL2',
    'G': 'GRASS', 'g': 'GRASS2','D': 'DOOR',   'd': 'DIRT',   'R': 'ROAD',
    'r': 'ROAD',  'T': 'TREE',  'K': 'ROCK',   'S': 'SIGN',   'C': 'CHEST'
  };

  function parseLayout(mapDef) {
    tileData = [];
    mapWidth  = mapDef.width;
    mapHeight = mapDef.height;
    for (let y = 0; y < mapDef.layout.length; y++) {
      tileData[y] = [];
      for (let x = 0; x < mapDef.width; x++) {
        const ch = (mapDef.layout[y] || '')[x] || 'V';
        const key = CHAR_MAP[ch] || 'VOID';
        tileData[y][x] = TILES[key];
      }
    }
  }

  function loadMap(name) {
    currentMap = MAPS[name];
    if (!currentMap) { console.error('Unknown map:', name); return null; }
    parseLayout(currentMap);

    // Place interactables
    interactables = (currentMap.interactables || []).map(i => ({ ...i, triggered: false }));

    if (currentMap.onLoad) currentMap.onLoad();
    return currentMap;
  }

  function getTile(tx, ty) {
    if (ty < 0 || ty >= tileData.length || tx < 0 || tx >= mapWidth) return TILES.VOID;
    return tileData[ty][tx] || TILES.VOID;
  }

  function isSolid(wx, wy) {
    const tx = Math.floor(wx / T);
    const ty = Math.floor(wy / T);
    return getTile(tx, ty).solid;
  }

  function getExit(tx, ty) {
    if (!currentMap) return null;
    return currentMap.exits.find(e => e.x === tx && e.y === ty) || null;
  }

  function getInteractable(tx, ty, sanity) {
    return interactables.find(i => {
      if (i.x !== tx || i.y !== ty) return false;
      if (i.hidden && sanity > 30) return false; // hidden objects only visible at low sanity
      return true;
    }) || null;
  }

  function render(animTick, sanity) {
    const { ctx, W, H, camX, camY } = Engine.get();

    const startX = Math.floor(camX / T) - 1;
    const startY = Math.floor(camY / T) - 1;
    const endX   = startX + Math.ceil(W / T) + 2;
    const endY   = startY + Math.ceil(H / T) + 2;

    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        const tile = getTile(tx, ty);
        let color = tile.color;

        // Animate water
        if (tile.animate) {
          const wave = Math.sin(animTick * 0.05 + tx * 0.3 + ty * 0.2);
          color = wave > 0 ? '#060e18' : '#040a10';
        }

        // Sanity-based color shift — low sanity = subtle red tint on floors
        if (!tile.solid && sanity < 40) {
          const intensity = (40 - sanity) / 40 * 0.15;
          color = shiftColor(color, intensity);
        }

        Engine.drawTile(color, tx * T, ty * T);

        // Outline for walls
        if (tile.outline) {
          const { ctx } = Engine.get();
          const sx = tx * T - camX;
          const sy = ty * T - camY;
          ctx.strokeStyle = tile.outline;
          ctx.lineWidth = 1;
          ctx.strokeRect(Math.round(sx) + 0.5, Math.round(sy) + 0.5, T - 1, T - 1);
        }

        // Tree canopy
        if (tile.canopy) {
          Engine.drawTile(tile.canopy, tx * T + 4, ty * T + 4, T - 8, T - 8);
        }
      }
    }

    // Draw interactable indicators (subtle glow dots)
    interactables.forEach(obj => {
      if (obj.triggered) return;
      if (obj.hidden && sanity > 30) return;
      const sx = obj.x * T - camX + T / 2;
      const sy = obj.y * T - camY + T / 2;
      if (sx < 0 || sx > W || sy < 0 || sy > H) return;
      const pulse = 0.3 + 0.2 * Math.sin(animTick * 0.06);
      const { ctx } = Engine.get();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = obj.type === 'npc' ? '#ddaa44' : obj.type === 'item' ? '#44aacc' : '#cc2233';
      ctx.beginPath();
      ctx.arc(sx, sy - T / 2 + 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  // Subtle red channel boost for floor tiles at low sanity
  function shiftColor(hex, amount) {
    let r = parseInt(hex.slice(1,3), 16);
    let g = parseInt(hex.slice(3,5), 16);
    let b = parseInt(hex.slice(5,7), 16);
    r = Math.min(255, r + Math.round(amount * 80));
    return `rgb(${r},${g},${b})`;
  }

  return { loadMap, getTile, isSolid, getExit, getInteractable, render, get currentMap() { return currentMap; }, get T() { return T; } };
})();
