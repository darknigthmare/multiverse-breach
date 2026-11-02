// Source-selected feedback for the engine-owned projectile. Weapon art and
// anatomy remain native pixels; these small markers never create collisions.
export const PROJECTILE_PRESENTATION_WAVE15 = Object.freeze({
  'dispersion-pistol': Object.freeze({ shape: 'orb', color: '#8cbbff' }),
  'quake2-blaster': Object.freeze({ shape: 'orb', color: '#ffaf49' }),
  'marathon2-fusion': Object.freeze({ shape: 'orb', color: '#78ee9a' }),
  // Yellow-green agrees with the retained native emitter/release artwork;
  // this display choice does not certify an official palette reference.
  'sphtkr-emitter': Object.freeze({ shape: 'orb', color: '#dcf56a' }),
  'hexen-serpent-staff': Object.freeze({ shape: 'orb', color: '#7fec75' }),
  'hexen-sapphire-wand': Object.freeze({ shape: 'orb', color: '#9ec9ff' }),
  'jago-endokuken': Object.freeze({ shape: 'orb', color: '#9bed6e' }),
  'magicka-lightning-staff': Object.freeze({ shape: 'spark', color: '#c9b1ff' }),
  'magicka-fire-staff': Object.freeze({ shape: 'orb', color: '#ff9a57' }),
  'magicka-cold-staff': Object.freeze({ shape: 'crystal', color: '#bdeeff' }),
  'vortessence-hands': Object.freeze({ shape: 'spark', color: '#7bff88' }),
  'markov-lightning-gun': Object.freeze({ shape: 'spark', color: '#8ed6ff' }),
  'hammond-pulse-rifle': Object.freeze({ shape: 'pulse', color: '#e4f4ff' }),
  'rain-f44aa': Object.freeze({ shape: 'pulse', color: '#e4f4ff' }),
  'tyler-f44aa': Object.freeze({ shape: 'pulse', color: '#e4f4ff' }),
  'sapphire-shock-orb': Object.freeze({ shape: 'orb', color: '#9bafff' }),
  'gorge-flak-cannon': Object.freeze({ shape: 'pulse', color: '#ffbb69' }),
  'frostbite-rocket-launcher': Object.freeze({ shape: 'rocket-marker', color: '#ffca82' }),
  'turok-talset-bow': Object.freeze({ shape: 'arrow', color: '#decba6' }),
  'turok-joshua-tekbow': Object.freeze({ shape: 'arrow', color: '#decba6' })
});
export const getProjectilePresentationWave15 = kind => PROJECTILE_PRESENTATION_WAVE15[kind]
  || { shape: 'ballistic', color: '#ffe3a6' };
