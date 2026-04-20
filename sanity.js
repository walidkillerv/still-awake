// sanity.js — Sanity system: the core paranoia mechanic

const Sanity = (() => {
  let value = 100; // 0–100
  let moveSteps = 0;
  let lastEvent = 0;
  let hallucTick = 0;

  // Fake "glitch" events that play tricks
  const GLITCH_EVENTS = [
    () => { // Fake dialogue
      UI.showDialogue('MAREN', "You've been here before. You know that, right?", 'WHISPER');
      setTimeout(() => UI.hideDialogue(), 2500);
    },
    () => { // Invert controls briefly
      GameState.invertControls(180);
    },
    () => { // Screen stutter
      const el = document.getElementById('glitch-overlay');
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('hidden'), 400);
    },
    () => { // Fake footstep sound indicator
      UI.showMessage("something walked behind you");
    },
    () => { // HUD flicker
      document.getElementById('hud').style.opacity = '0';
      setTimeout(() => document.getElementById('hud').style.opacity = '1', 600);
    },
    () => { // Cycle counter lie
      const el = document.getElementById('day-counter');
      const real = el.textContent;
      el.textContent = parseInt(real) + Math.floor(Math.random() * 40 + 10);
      setTimeout(() => el.textContent = real, 1200);
    },
    () => { // "Someone is watching" text
      UI.showMessage("you are not alone on this screen");
    },
    () => { // Static overlay
      const el = document.getElementById('static-overlay');
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('hidden'), 800);
    }
  ];

  function onMove() {
    moveSteps++;
    // Slow passive drain
    if (moveSteps % 120 === 0 && value > 0) {
      value = Math.max(0, value - 0.5);
      updateUI();
    }
  }

  function drain(amount, reason) {
    value = Math.max(0, value - amount);
    updateUI();
    if (reason) UI.showMessage(reason);
  }

  function restore(amount) {
    value = Math.min(100, value + amount);
    updateUI();
  }

  function tick(frame) {
    hallucTick++;

    // Trigger glitch events based on sanity level
    const chance = value < 20 ? 0.008 : value < 50 ? 0.003 : 0.0005;
    if (Math.random() < chance) {
      const event = GLITCH_EVENTS[Math.floor(Math.random() * GLITCH_EVENTS.length)];
      event();
    }

    // CSS class management
    const body = document.body;
    body.classList.toggle('sanity-low',      value < 40);
    body.classList.toggle('sanity-critical', value < 15);

    // Sanity bar color
    const bar = document.getElementById('sanity-bar');
    if (bar) {
      if (value > 60) bar.style.background = '#44aacc';
      else if (value > 30) bar.style.background = '#ddaa44';
      else bar.style.background = '#cc2233';
    }
  }

  function updateUI() {
    const bar = document.getElementById('sanity-bar');
    if (bar) bar.style.width = value + '%';
  }

  function get() { return value; }
  function set(v) { value = Math.max(0, Math.min(100, v)); updateUI(); }

  return { onMove, drain, restore, tick, get, set };
})();
