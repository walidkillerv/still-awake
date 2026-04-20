// npc.js — NPC rendering and state

const NPC = (() => {
  const T = 32;

  const SPRITES = {
    maren:      { color: '#7a6070', outline: '#5a4054', eyes: true, eyeColor: '#c8a0b0' },
    maren_church: { color: '#6a5060', outline: '#4a3044', eyes: true, eyeColor: '#d0a8b8' },
    henrick:    { color: '#4a4038', outline: '#3a3028', eyes: true, eyeColor: '#887060' },
    henrick_road: { color: '#4a4038', outline: '#3a3028', eyes: true, eyeColor: '#887060' },
    the_child:  { color: '#8090a0', outline: '#607080', eyes: true, eyeColor: '#304050' },
  };

  function render(obj, animTick) {
    const sprite = SPRITES[obj.id] || { color: '#666', outline: '#444', eyes: false };
    const bob = 0.5 * Math.sin(animTick * 0.04 + (obj.x + obj.y));
    // Face toward player lazily
    sprite.dir = 'down';
    Engine.drawSprite(sprite, obj.x * T, obj.y * T + bob);
  }

  return { render };
})();
