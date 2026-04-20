# STILL AWAKE
### a psychological horror game about remembering

---

## SETUP — GitHub Pages (free hosting, 5 minutes)

1. Create a new GitHub repository (public)
2. Upload all files, preserving the folder structure:
   ```
   index.html
   css/style.css
   js/engine.js
   js/world.js
   js/player.js
   js/npc.js
   js/sanity.js
   js/lore.js
   js/ui.js
   js/main.js
   README.md
   ```
3. Go to **Settings → Pages**
4. Under *Source*, select **main branch / root**
5. Save. Your game is live at `https://yourusername.github.io/repositoryname`

---

## CONTROLS

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| E / Enter / Space | Interact / Advance dialogue |
| I | Inventory |
| Escape | Close panels |

---

## THE GAME

You are in **Callow** — a town that disappeared from maps in 1961.

You don't remember arriving. You have a bag. You have a name that sounds like it belongs to someone else.

The town has been waiting for you.

---

## SYSTEMS

### Sanity
Your sanity drains as you explore. At low sanity:
- The screen shakes and reddens
- Hallucinations appear (fake dialogue, inverted controls, screen glitches)
- Hidden objects become visible
- The environment subtly changes

### Cycles
Every time you reach an ending, the cycle counter increments. The game remembers. The town remembers. The warnings on the title screen change. Some lore is only unlocked after multiple cycles.

### The Archive
Accessible from the title screen. Lore fragments unlock as you find notes in the world. There are 8 documents. Some are never meant to be found.

---

## ENDINGS

There are **three real endings**:

- **Escape** — reach the end of the road south. The road is longer than it was.
- **Stay** — complete all of Maren's dialogue and choose to remain.
- **Understand** — find the iron key, unlock the church basement, descend.

---

## THE LORE (surface level — deeper lore is in-game)

Callow was a mining town. In 1961, its residents vanished — not fled, not died. Simply ceased to be accounted for. The buildings remained. The roads remained.

Something else remained too.

**Maren** was the last person to try to leave. She didn't leave.

**Dr. Voss** came to document the phenomenon. His notes deteriorate.

**The child** has no name. The child has been here longer than any adult.

**The Watcher** has no name either. It learned your patterns. It finds them satisfying.

---

## EXPANDING THE GAME

All maps are defined in `js/world.js` in the `MAPS` object using simple ASCII layouts.
All lore, notes, and NPC dialogue is in `js/lore.js`.
Adding a new area: add an entry to `MAPS`, add exits pointing to it, add interactables.

---

## CREDITS

Built with: HTML5 Canvas, vanilla JavaScript, Google Fonts (Share Tech Mono, IM Fell English).
No libraries. No frameworks. No dependencies.
Runs in any browser.

---

*"You have played this before. You just don't remember."*
