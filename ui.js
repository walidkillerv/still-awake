// ui.js — All UI management

const UI = (() => {
  let blocking = false;
  let dialogueQueue = [];
  let dialogueActive = false;
  let typeInterval = null;
  let messageTimeout = null;

  // ── DIALOGUE ──

  function showDialogueSequence(lines) {
    dialogueQueue = [...lines];
    _nextDialogue();
  }

  function _nextDialogue() {
    if (dialogueQueue.length === 0) {
      hideDialogue();
      return;
    }
    const line = dialogueQueue.shift();
    showDialogue(line.speaker, line.text);
    dialogueActive = true;
    blocking = true;
  }

  function showDialogue(speaker, text, speakerOverride) {
    const box = document.getElementById('dialogue-box');
    const sp  = document.getElementById('dialogue-speaker');
    const tx  = document.getElementById('dialogue-text');
    box.classList.remove('hidden');
    sp.textContent  = speakerOverride || speaker || '';
    tx.textContent  = '';
    blocking = true;

    // Typewriter effect
    if (typeInterval) clearInterval(typeInterval);
    let i = 0;
    typeInterval = setInterval(() => {
      tx.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(typeInterval);
        typeInterval = null;
      }
    }, 28);
  }

  function advanceDialogue() {
    if (!dialogueActive) return;
    if (typeInterval) {
      // Skip to end
      clearInterval(typeInterval);
      typeInterval = null;
      const tx = document.getElementById('dialogue-text');
      tx.textContent = dialogueQueue.length > 0 ? '' : tx.textContent; // keep showing
      // Fully type out current line
      const currentLine = dialogueQueue.length > 0 ? null : document.getElementById('dialogue-speaker').textContent;
      _nextDialogue();
    } else {
      _nextDialogue();
    }
  }

  function hideDialogue() {
    document.getElementById('dialogue-box').classList.add('hidden');
    dialogueActive = false;
    blocking = false;
  }

  // ── INVENTORY ──

  function showInventory(items) {
    blocking = true;
    const panel = document.getElementById('inventory-panel');
    const container = document.getElementById('inv-items');
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = '<div style="color:#666;font-size:12px;font-style:italic">nothing yet</div>';
    }
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'inv-item';
      div.innerHTML = `
        <div class="inv-item-icon">${item.icon || '?'}</div>
        <div class="inv-item-info">
          <div class="inv-item-name">${item.name}</div>
          <div class="inv-item-desc">${item.description || ''}</div>
        </div>`;
      container.appendChild(div);
    });
    panel.classList.remove('hidden');
  }

  function hideInventory() {
    document.getElementById('inventory-panel').classList.add('hidden');
    blocking = false;
  }

  // ── NOTE READER ──

  function showNote(note) {
    blocking = true;
    const reader = document.getElementById('note-reader');
    const content = document.getElementById('note-content');
    content.textContent = note.content;
    reader.classList.remove('hidden');

    // Sanity drain for reading unsettling notes
    Sanity.drain(8, null);

    // Unlock archive entry if matching
    if (note.archiveId) {
      const entry = LORE.archiveEntries.find(e => e.id === note.archiveId);
      if (entry) { entry.unlocked = true; GameState.unlockLore(note.archiveId); }
    }
  }

  function hideNote() {
    document.getElementById('note-reader').classList.add('hidden');
    blocking = false;
  }

  // ── PICKUP FLASH ──

  function showPickup(item) {
    showMessage(`found: ${item.name}`);
  }

  function showMessage(text) {
    if (messageTimeout) clearTimeout(messageTimeout);
    const existing = document.getElementById('hud-message');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'hud-message';
    el.style.cssText = `
      position:absolute; bottom:110px; left:50%; transform:translateX(-50%);
      font-family:var(--font-mono); font-size:12px; color:var(--red);
      letter-spacing:0.15em; z-index:25; pointer-events:none;
      animation: fade-pulse 0.5s ease-in;
    `;
    el.textContent = text;
    document.getElementById('game-screen').appendChild(el);

    messageTimeout = setTimeout(() => el.remove(), 3000);
  }

  // ── LORE SCREEN ──

  function buildLoreScreen() {
    const container = document.getElementById('lore-entries');
    container.innerHTML = '';
    const unlocked = GameState.getUnlockedLore();

    LORE.archiveEntries.forEach(entry => {
      if (entry.dynamic) return; // skip dynamic entry
      const div = document.createElement('div');
      const isUnlocked = entry.unlocked || unlocked.includes(entry.id);
      div.className = 'lore-entry' + (isUnlocked ? '' : ' locked');
      div.innerHTML = `
        <div class="lore-entry-title">${entry.title}</div>
        <div class="lore-entry-text">${isUnlocked ? entry.text : ''}</div>`;
      container.appendChild(div);
    });
  }

  // ── TRANSITION SCREEN ──

  function showTransition(text, callback, delay = 3000) {
    const screen = document.getElementById('transition-screen');
    const tx     = document.getElementById('transition-text');
    screen.classList.remove('hidden');
    tx.textContent = text;
    blocking = true;
    setTimeout(() => {
      screen.classList.add('hidden');
      blocking = false;
      if (callback) callback();
    }, delay);
  }

  function isBlocking() { return blocking; }
  function setBlocking(v) { blocking = v; }

  return {
    showDialogue, showDialogueSequence, advanceDialogue, hideDialogue,
    showInventory, hideInventory,
    showNote, hideNote,
    showPickup, showMessage,
    buildLoreScreen,
    showTransition,
    isBlocking, setBlocking
  };
})();
