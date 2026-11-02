// Explicit emitter feedback only. Source PNGs own anatomy and equipment, and
// engines own trajectories/collision. A marker cannot create an accepted hit.
export const PROJECTILE_PRESENTATION_WAVE16 = Object.freeze({
  'cup-head-beam': { shape: 'beam', color: '#ecf8ff' },
  crossbow: { shape: 'orb', color: '#9cc7ff' },
  'wave16-b-rifle': { shape: 'ballistic', color: '#ffe2a2' },
  'wave16-b-pistol': { shape: 'ballistic', color: '#ffe2a2' },
  'held-pistol': { shape: 'ballistic', color: '#ffe2a2' },
  'wave16-b-titan-cannon': { shape: 'ballistic', color: '#ffe2a2' },
  'wave16-b-suppressed-rifle': { shape: 'ballistic', color: '#ffe2a2' },
  'wave16-b-laser-gun': { shape: 'beam', color: '#81cfff' },
  'wave16-b-bow': { shape: 'arrow', color: '#d8c7a2' },
  'wave16-b-ion-gun': { shape: 'orb', color: '#83f76a' },
  'wave16-b-rocket-gun': { shape: 'rocket-marker', color: '#f3b05f' },
  'wave16-b-ventral-cannon': { shape: 'orb', color: '#eeaa55' },
  'wave16-b-grenade': { shape: 'orb', color: '#eeaa55' },
  'faye-valentine-source-role': { shape: 'ballistic', color: '#ffe2a2' },
  'kogami-revolver': { shape: 'ballistic', color: '#ffe2a2' },
  'frieren-elf-source-role': { shape: 'beam', color: '#e6f4ff' },
  'fern-mage-source-role': { shape: 'beam', color: '#e6f4ff' },
  'genos-opm-source-role': { shape: 'beam', color: '#ffbd55' },
  'starfire-tt-source-role': { shape: 'orb', color: '#72f85d' },
  'invincible-robot-source-role': { shape: 'orb', color: '#ffb85c' },
  'murder-drones-v-source-role': { shape: 'ballistic', color: '#ffe2a2' },
  'helluva-boss-blitzo-source-role': { shape: 'ballistic', color: '#ffe2a2' },
  'helluva-boss-moxxie-source-role': { shape: 'ballistic', color: '#ffe2a2' },
  'murder-drones-uzi-doorman-source-role': { shape: 'beam', color: '#80ff39' }
});
export const getProjectilePresentationWave16 = kind => PROJECTILE_PRESENTATION_WAVE16[kind]
  || { shape: 'ballistic', color: '#ffe2a2' };
