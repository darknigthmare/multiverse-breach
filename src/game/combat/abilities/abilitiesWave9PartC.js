import { buff, defend, hit, shot } from './rules.js';

const universe = 'Ghost in the Shell';
const sourceWork = 'Ghost in the Shell: Stand Alone Complex (2002), season 1';
const sourceUrl = 'https://theghostintheshell.jp/en/series/stand_alone_complex';
const special = (action, color) => ({ ...action, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, sourceReference, simple, secondary, defense, superAction) => ({
  sourceHeroId, universe, sourceWork, sourceUrl, sourceReference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special: superAction
});

// These are descriptive project actions, not claimed names of canonical ultimates.
// Cyberbrain access and optical camouflage do not cause universal enemy damage.
export const ABILITIES_WAVE9_PART_C = Object.freeze({
  motoko: kit('motoko',
    'SAC season1 Motoko uses a prosthetic body, Section9 firearms and thermo-optical camouflage. Production I.G model-sheet1 names Seburo C-26A and M-5. Her volley is physical ammunition; cyberbrain hacking is not a universal area attack. Reflexes and camouflage protect only Motoko, without creating an energy shield or transferring her body to allies.',
    shot('Tir au pistolet-mitrailleur de Motoko', 1.1),
    hit('Frappe rapprochée de Motoko', 1.9, { range: 170 }),
    defend('Esquive sous camouflage thermo-optique', 0.5),
    special(shot('Salve au pistolet-mitrailleur de Motoko', 4.6, { range: 640 }), '#9795d8')),
  batou: kit('batou',
    'SAC season1 Batou is a heavily cyberized former Ranger with physical strength and conventional firearms. His support volley is fired from a held gun; the Ranger prosthetic eyes are sensors and never shoot projectiles. Personal bracing protects Batou, not unrelated allies with shared cybernetic anatomy.',
    shot('Tir d’appui de Batou', 1.2),
    hit('Coup de poing du cyborg Batou', 2, { range: 170 }),
    defend('Garde renforcée de Batou', 0.55),
    special(shot('Rafale d’appui de Batou', 4.8, { range: 650 }), '#c7be9e')),
  togusa: kit('togusa',
    'SAC season1 Togusa is an organic former detective with a cyberbrain and a Mateba revolver. The official SAC character profile explicitly identifies the revolver. His observation prepares his own aim; it does not scan enemies into explosions, grant them damage, or distribute his senses to the team. Every damaging shot uses the real held revolver.',
    shot('Tir du revolver Mateba de Togusa', 1.1),
    buff('Observation du détective Togusa', { targetSide: 'self', shape: 'single', range: 1, buffMultiplier: 1.18, duration: 3 }),
    defend('Mise à couvert de Togusa', 0.45),
    special(shot('Tir de précision au Mateba', 4.3, { range: 620 }), '#bdab8c'))
});

// Exact existing authored IDs are revised once by the root catalogue. The
// secondary override deliberately limits Hawkeye calibration to Saito himself.
export const ABILITY_REVISIONS_WAVE9_PART_C = Object.freeze({
  aramaki: {
    universe, sourceWork, sourceUrl,
    versionNote: 'SAC season1 (2002): Daisuke Aramaki is the Section9 chief in a dark business suit. Keep his existing briefing, operation authorization and personal cover semantics. His super is allied command support with zero damage; no gun, eye beam, energy explosion or offensive finale is introduced.',
    identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false
  },
  saito_gits: {
    universe, sourceWork, sourceUrl,
    versionNote: 'SAC season1 (2002): the official character profile identifies Saito as Section9 sniper with left Hawkeye cybernetic eye and prosthetic left arm. The eye improves his own ballistic aim; the projectile leaves the held rifle, never his eye. Do not copy the Arise design or transfer Hawkeye to allies.',
    secondary: { cd: 6, ...buff('Œil de faucon — correction de visée', { targetSide: 'self', shape: 'single', range: 1, buffMultiplier: 1.18, duration: 3 }) },
    identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false
  }
});
