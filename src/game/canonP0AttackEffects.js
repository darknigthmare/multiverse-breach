// Opt-in combat feedback for source-locked Wave 4 kits. The effects remain
// disclosed game abstractions; they do not approve existing character artwork.
const SOURCE_IDS = new Set([
  'saturnin_duck', 'lilo_pelekai', 'stitch_626', 'mj_performer', 'rhythm_guard_mj',
  'jack_sparrow_potc', 'will_turner_potc', 'elizabeth_swann_potc', 'roger_rabbit', 'cyber_spider_electro_beam',
  'cyber_spider_flamethrower', 'cyber_spider_kelly', 'raven_tt', 'starfire_tt',
  'batman_tdk', 'harry', 'hermione', 'batman_n52', 'harley_n52', 'joker_n52', 'grim_knight'
]);

const KINDS = new Set([
  'melee', 'music', 'bullet', 'flintlock', 'batarang', 'cameraFlash',
  'shadow', 'starbolt', 'spell', 'patronus', 'electricBeam', 'flame', 'thrownProp', 'call', 'toxin'
]);

const DEFAULTS = {
  melee: { color: '#d7d7d7', sfx: 'hit' },
  music: { color: '#f3d062', sfx: 'special' },
  bullet: { color: '#8e8674', sfx: 'shoot' },
  flintlock: { color: '#8e8674', sfx: 'shoot' },
  batarang: { color: '#686c75', sfx: 'jump' },
  cameraFlash: { color: '#ffffff', sfx: 'shield' },
  shadow: { color: '#42244f', sfx: 'shield' },
  starbolt: { color: '#7dff3b', sfx: 'shoot' },
  spell: { color: '#ef3333', sfx: 'shield' },
  patronus: { color: '#e9f8ff', sfx: 'shield' },
  electricBeam: { color: '#91eaff', sfx: 'laser' },
  flame: { color: '#ff8d27', sfx: 'shoot' },
  thrownProp: { color: '#cac7c0', sfx: 'jump' },
  call: { color: '#f3d062', sfx: 'jump' },
  toxin: { color: '#8ab155', sfx: 'shield' }
};

export const getP0HeroSourceId = actor => String(actor?.sourceId || actor?.id || '')
  .replace(/^(?:p2|cpu-custom):/, '').replace(/:\d+$/, '');

export function resolveP0CanonAttackEffect(actor, actionOrType) {
  const sourceId = getP0HeroSourceId(actor);
  const action = typeof actionOrType === 'string' ? actor?.[actionOrType] : actionOrType;
  if (!action || actor?.canonCombatPresentation !== true || !SOURCE_IDS.has(sourceId)) return null;
  const declared = typeof action.canonPresentation === 'string'
    ? { kind: action.canonPresentation } : action.canonPresentation;
  let kind = declared?.kind;
  if (!kind) {
    const type = String(action.type || '').toLowerCase();
    if (/melee|slash|punch|bite|claw/.test(type)) kind = 'melee';
    else if (sourceId === 'saturnin_duck' && /sound|call/.test(type)) kind = 'call';
    else if (/sound|music/.test(type)) kind = 'music';
    else if (sourceId === 'jack_sparrow_potc' && /bullet|projectile/.test(type)) kind = 'flintlock';
    else if (['batman_tdk', 'batman_n52'].includes(sourceId) && /projectile/.test(type)) kind = 'batarang';
    else if (sourceId === 'lilo_pelekai' && /flash|projectile/.test(type)) kind = 'cameraFlash';
    else if (sourceId === 'raven_tt' && /magic|shadow|spell|projectile/.test(type)) kind = 'shadow';
    else if (sourceId === 'starfire_tt' && /energy|plasma|projectile/.test(type)) kind = 'starbolt';
    else if (['harry', 'hermione'].includes(sourceId) && /patronus/i.test(action.name || '')) kind = 'patronus';
    else if (['harry', 'hermione'].includes(sourceId) && /spell|magic|projectile/.test(type)) kind = 'spell';
    else if (sourceId === 'joker_n52' && /spray/.test(type)) kind = 'toxin';
    else if (/flame|fire/.test(type)) kind = 'flame';
    else if (/electric|electro|beam/.test(type)) kind = 'electricBeam';
    else if (/bullet|gun|rifle/.test(type)) kind = 'bullet';
    else if (/projectile|throw/.test(type)) kind = 'thrownProp';
  }
  if (!KINDS.has(kind)) return null;
  return { ...DEFAULTS[kind], ...declared, kind, color: declared?.color || action.color || DEFAULTS[kind].color };
}

export function emitP0CanonAttackEffect(particles, actor, target, effect) {
  if (!effect || !KINDS.has(effect.kind) || !particles?.add) return false;
  const destination = target || { x: actor.x + (actor.facing || 1) * 60, y: actor.y };
  const dx = destination.x - actor.x;
  const dy = destination.y - actor.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / distance;
  const uy = dy / distance;
  const startX = actor.x + ux * 15;
  const startY = actor.y - 18 + uy * 15;
  const moving = (type, size = 10, speed = 8) => particles.add(
    startX, startY, ux * speed, uy * speed, effect.color, size,
    Math.max(12, Math.ceil(distance / speed)), type
  );
  if (['bullet', 'flintlock'].includes(effect.kind)) {
    moving('bullet', 3, 10);
    if (effect.kind === 'flintlock') {
      particles.add(startX, startY, ux * 0.5, -0.4, '#b8b4ab', 8, 16, 'smoke');
    }
  } else if (effect.kind === 'batarang') moving('batarang', 12);
  else if (effect.kind === 'cameraFlash') {
    particles.add(startX, startY, 0, 0, '#ffffff', 18, 8, 'camera_flash');
    if (target) particles.add(destination.x, destination.y - 24, 0, 0, '#ffffff', 10, 6, 'camera_flash');
  } else if (effect.kind === 'shadow') moving('shadow_wisp', 12, 5);
  else if (effect.kind === 'starbolt') moving('starbolt', 9, 8);
  else if (effect.kind === 'spell') moving('spell_bolt', 5, 8);
  else if (effect.kind === 'patronus') {
    // White protective mist; the exact animal artwork remains pending review.
    particles.add(destination.x, destination.y - 28, 0, -0.3, effect.color, 18, 28, 'patronus');
  } else if (effect.kind === 'electricBeam') moving('electric_beam', 3);
  else if (effect.kind === 'flame') {
    for (const offset of [-1, 0, 1]) {
      particles.add(startX, startY + offset * 4, ux * 6, uy * 6 + offset * 0.2,
        effect.color, 10, Math.max(12, Math.ceil(distance / 6)), 'flame');
    }
  } else if (effect.kind === 'music') moving('music', 20, 4);
  else if (effect.kind === 'thrownProp') moving('thrown_prop', 7, 6);
  else if (effect.kind === 'call') moving('sound_call', 12, 4);
  else if (effect.kind === 'toxin') moving('toxin_cloud', 12, 4);
  else particles.add(destination.x, destination.y - 18, 0, 0, effect.color, 4, 12, 'spark');
  return true;
}
