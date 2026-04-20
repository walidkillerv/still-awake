// main.js — Game state, boot sequence, main loop, event wiring

// ── GAME STATE ──
const GameState = (() => {
  const SAVE_KEY = 'still_awake_save';

  function load() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; }
    catch { return {}; }
  }
  function save(data) {
    const current = load();
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...current, ...data }));
  }

  function getCycle() { return load().cycle || 1; }
  function incrementCycle() {
    const c = getCycle() + 1;
    save({ cycle: c });
    return c;
  }
  function hasSave() { return !!load().cycle; }
  function clearSave() { localStorage.removeItem(SAVE_KEY); }

  function loadInventory() { return load().inventory || []; }
  function saveInventory(inv) { save({ inventory: inv }); }

  function unlockLore(id) {
    const ul = load().unlockedLore || [];
    if (!ul.includes(id)) { ul.push(id); save({ unlockedLore: ul }); }
  }
  function getUnlockedLore() { return load().unlockedLore || []; }

  let _invertControls = false;
  let _invertTimeout = null;
  function invertControls(frames) {
    _invertControls = true;
    if (_invertTimeout) clearTimeout(_invertTimeout);
    _invertTimeout = setTimeout(() => { _invertControls = false; }, frames * 16);
  }
  function isInverted() { return _invertControls; }

  function triggerEnding(type) {
    const cycle = getCycle();
    const endings = {
      escape: [
        `You reach the end of the road.`,
        `Behind you, Callow is exactly where you left it.`,
        `You don't look back.`,
        `That was a mistake.`,
        `CYCLE ${cycle} COMPLETE\n\nYou left. The town is still there.\nIt will still be there next time.`
      ],
      stay: [
        `You put down your bag.`,
        `Maren doesn't say anything. She doesn't have to.`,
        `The town settles around you like a held breath finally released.`,
        `You feel, for the first time, like you belong somewhere.`,
        `This is the second-worst ending.\n\nYou are now part of the pattern.\nCYCLE ${cycle} — PERMANENT`
      ],
      understand: [
        `You descend.`,
        `The basement is larger than the church.`,
        `Much larger.`,
        `What waits below has been waiting since before the town.\nIt shows you something.`,
        `We cannot describe what you see.\n\nBut you understand now.\nEverything you thought was wrong.\nEverything you feared was right.\n\nCYCLE ${cycle} — TERMINUS`
      ]
    };
    const lines = endings[type] || endings.escape;
    let i = 0;
    const screen = document.getElementById('transition-screen');
    const tx = document.getElementById('transition-text');
    screen.classList.remove('hidden');
    function nextLine() {
      if (i >= lines.length) {
        setTimeout(() => {
          screen.classList.add('hidden');
          incrementCycle();
          document.getElementById('day-counter').textContent = GameState.getCycle();
          loadMap('town');
        }, 2000);
        return;
      }
      tx.textContent = '';
      let j = 0;
      const line = lines[i++];
      const typ = setInterval(() => {
        tx.textContent += line[j++];
        if (j >= line.length) {
          clearInterval(typ);
          setTimeout(nextLine, 1800);
        }
      }, 40);
    }
    nextLine();
  }

  return { load, save, hasSave, clearSave, getCycle, incrementCycle, loadInventory, saveInventory, unlockLore, getUnlockedLore, invertControls, isInverted, triggerEnding };
})();

// ── EVENT BUS ──
const GameEvents = (() => {
  const listeners = {};
  function on(ev, fn)   { (listeners[ev] = listeners[ev] || []).push(fn); }
  function emit(ev, data) { (listeners[ev] || []).forEach(fn => fn(data)); }
  return { on, emit };
})();

// ── ITEMS DATABASE ──
const ITEMS = {
  iron_key:       { id: 'iron_key',       name: 'iron key',       icon: '🗝', description: 'Old. Heavier than it looks. Something below needs opening.' },
  note_torn_page: { id: 'note_torn_page', name: 'torn page',      icon: '📄', description: 'Someone else was here. They didn\'t make it out.' },
  note_dr_voss:   { id: 'note_dr_voss',   name: 'case notes',     icon: '📋', description: 'A doctor\'s notes. The handwriting deteriorates.' },
};

// ── MAIN GAME ──
const Game = (() => {
  let currentMapName = 'town';
  let frame = 0;
  let animTick = 0;
  let running = false;
  let keys = {};
  let keysConsumed = {};

  function start(newGame = true) {
    Engine.init();
    if (newGame) GameState.clearSave();

    const cycle = GameState.getCycle();
    document.getElementById('day-counter').textContent = cycle;

    // Title warning changes on repeat plays
    if (cycle > 1) {
      document.getElementById('title-warning').textContent =
        `This is cycle ${cycle}. You know how this ends.`;
    }

    loadMap('town');
    setupInput();
    setupEvents();

    running = true;
    requestAnimationFrame(loop);
  }

  function loadMap(name, spawnOverride) {
    const mapDef = World.loadMap(name);
    if (!mapDef) return;
    currentMapName = name;
    const sx = spawnOverride ? spawnOverride.spawnX : mapDef.spawnX;
    const sy = spawnOverride ? spawnOverride.spawnY : mapDef.spawnY;
    Player.init(sx, sy);

    // Brief transition text for certain maps
    const mapFlavour = {
      church_exterior: 'The air is different here.',
      church_interior: 'Something is listening.',
      forest_edge:     'The trees are too still.',
      road_south:      'The road is longer than you remember.'
    };
    if (mapFlavour[name]) {
      UI.showTransition(mapFlavour[name], null, 1500);
    }
  }

  function setupInput() {
    document.addEventListener('keydown', e => {
      if (!keys[e.key]) keysConsumed[e.key] = false;
      keys[e.key] = true;

      // Interaction keys
      if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && !keysConsumed[e.key]) {
        keysConsumed[e.key] = true;
        if (UI.isBlocking()) {
          UI.advanceDialogue();
        } else {
          Player.tryInteract();
        }
      }
      if ((e.key === ' ') && !keysConsumed[e.key]) {
        keysConsumed[e.key] = true;
        if (UI.isBlocking()) UI.advanceDialogue();
        else Player.tryInteract();
      }
      if ((e.key === 'i' || e.key === 'I') && !keysConsumed[e.key]) {
        keysConsumed[e.key] = true;
        const panel = document.getElementById('inventory-panel');
        if (panel.classList.contains('hidden')) UI.showInventory(Player.getInventory());
        else UI.hideInventory();
      }
      if (e.key === 'Escape') {
        UI.hideInventory();
        UI.hideNote();
      }
    });
    document.addEventListener('keyup', e => {
      keys[e.key] = false;
      keysConsumed[e.key] = false;
    });
  }

  function setupEvents() {
    // Map transition
    GameEvents.on('mapTransition', exit => {
      loadMap(exit.to, exit);
    });

    // Interaction handler
    GameEvents.on('interact', obj => {
      if (obj.triggered && obj.type !== 'npc') return;

      if (obj.type === 'npc') {
        // NPC dialogue — pick correct key based on game state
        let key = obj.dialogueKey;
        // Maren upgrades dialogue after notes found
        if (obj.id === 'maren' && Player.getInventory().length > 0) key = 'maren_second';
        const lines = LORE.dialogues[key];
        if (lines) {
          UI.showDialogueSequence(lines);
          Sanity.drain(3, null);
        }
      }
      else if (obj.type === 'note') {
        const note = LORE.notes[obj.itemId];
        if (note) {
          UI.showNote(note);
          // Add to inventory as a readable item
          const item = { id: obj.itemId, name: note.title, icon: '📄', description: 'A found document.', noteKey: obj.itemId };
          Player.addItem(item);
          obj.triggered = true;
          Sanity.drain(10, null);
          // Unlock archive lore
          const archiveMap = {
            note_torn_page:    'archive_loop',
            note_dr_voss:      'archive_maren',
            note_maren_letter: 'archive_mirror',
            note_hidden_wall:  'archive_watcher',
            note_game_manual:  'archive_ending',
            note_basement_door:'archive_you'
          };
          if (archiveMap[obj.itemId]) GameState.unlockLore(archiveMap[obj.itemId]);
        }
      }
      else if (obj.type === 'item') {
        const item = ITEMS[obj.itemId] || { id: obj.itemId, name: obj.label || obj.itemId, icon: obj.icon || '?', description: '' };
        Player.addItem(item);
        obj.triggered = true;
        UI.showPickup(item);
        Sanity.drain(5, null);
      }
      else if (obj.type === 'sign') {
        UI.showNote({ content: obj.text });
        obj.triggered = true;
      }
    });

    // UI buttons
    document.getElementById('btn-inv-close').addEventListener('click', UI.hideInventory);
    document.getElementById('btn-note-close').addEventListener('click', UI.hideNote);
  }

  function loop() {
    if (!running) return;
    frame++;
    animTick++;

    // Effective keys (with possible inversion)
    let effectiveKeys = keys;
    if (GameState.isInverted()) {
      effectiveKeys = {
        ...keys,
        ArrowLeft:  keys['ArrowRight'],
        ArrowRight: keys['ArrowLeft'],
        ArrowUp:    keys['ArrowDown'],
        ArrowDown:  keys['ArrowUp'],
        a: keys['d'], d: keys['a'], w: keys['s'], s: keys['w']
      };
    }

    Player.update(effectiveKeys, 1);
    Sanity.tick(frame);

    Engine.clear();
    World.render(animTick, Sanity.get());
    Player.render(animTick);

    // Render NPCs
    const map = World.currentMap;
    if (map && map.interactables) {
      map.interactables.filter(o => o.type === 'npc').forEach(npc => {
        NPC.render(npc, animTick);
      });
    }

    // Subtle time display
    const timeEl = document.getElementById('time-display');
    if (timeEl) {
      const t = Math.floor(animTick / 60) % 1440; // fake minutes in a day
      const h = Math.floor(t / 60).toString().padStart(2, '0');
      const m = (t % 60).toString().padStart(2, '0');
      timeEl.textContent = `${h}:${m}`;
    }

    requestAnimationFrame(loop);
  }

  return { start, loadMap };
})();

// ── BOOT SEQUENCE ──
(function boot() {
  const bootLines = [
    'STILL AWAKE v0.██████',
    'loading...',
    '',
    'WARNING: This software exhibits anomalous behavior',
    'under prolonged use. Developer notes indicate this',
    'is intentional. Developer is unavailable for comment.',
    '',
    'memory check.......... OK',
    'audio subsystem....... OK',
    'sanity monitor........ OK',
    'external observers.... ██',
    '',
    'initializing world of CALLOW...',
    '',
    '> ready.',
  ];

  const el = document.getElementById('boot-text');
  let li = 0, ci = 0;
  let currentLine = '';

  function typeNext() {
    if (li >= bootLines.length) {
      // Done — fade to title
      setTimeout(() => {
        document.getElementById('boot-screen').style.transition = 'opacity 1s';
        document.getElementById('boot-screen').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('boot-screen').classList.add('hidden');
          showTitle();
        }, 1000);
      }, 600);
      return;
    }
    const line = bootLines[li];
    if (ci < line.length) {
      currentLine += line[ci++];
      el.textContent = bootLines.slice(0, li).join('\n') + '\n' + currentLine;
      setTimeout(typeNext, 18 + Math.random() * 12);
    } else {
      li++; ci = 0; currentLine = '';
      el.textContent = bootLines.slice(0, li).join('\n') + '\n';
      setTimeout(typeNext, line === '' ? 80 : 120);
    }
  }
  typeNext();

  function showTitle() {
    document.getElementById('title-screen').classList.remove('hidden');
    const cycle = GameState.getCycle();
    if (cycle > 1) {
      document.getElementById('title-warning').textContent =
        `Cycle ${cycle}. You came back.`;
      document.getElementById('btn-continue').style.color = '#cc2233';
    } else {
      document.getElementById('btn-continue').style.opacity = '0.3';
      document.getElementById('btn-continue').style.pointerEvents = 'none';
    }
  }

  // Title screen buttons
  document.getElementById('btn-new-game').addEventListener('click', () => {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    Game.start(true);
  });

  document.getElementById('btn-continue').addEventListener('click', () => {
    if (!GameState.hasSave()) return;
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    Game.start(false);
  });

  document.getElementById('btn-lore').addEventListener('click', () => {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('lore-screen').classList.remove('hidden');
    UI.buildLoreScreen();
  });

  document.getElementById('btn-lore-back').addEventListener('click', () => {
    document.getElementById('lore-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
  });
})();
