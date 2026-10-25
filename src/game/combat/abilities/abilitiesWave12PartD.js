import { buff, defend, guard, hit, shot } from './rules.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_D as SOURCES } from '../combatSourceDefinitionsWave12PartD.js';

const kit = (id, simple, secondary, defense, special, sourceReference) => ({
  sourceHeroId: id, universe: SOURCES[id].universe, sourceWork: SOURCES[id].sourceWork,
  sourceReference, sourceUrl: SOURCES[id].sourceReference, identityBasis: 'canonical-role',
  canonicalVerified: false, networkVerified: false, source1to1Verified: false, gameplayAdaptation: true,
  simple, secondary: { ...secondary, cd: 6 }, defense,
  special: { ...special, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 }
});

export const ABILITIES_WAVE12_PART_D = Object.freeze({
  fry_futurama: kit('fry_futurama', guard('Signal de livraison de Fry', { reduce: 0.18 }),
    buff('Passage du colis de Planet Express', { buffMultiplier: 1.12 }), defend('Mise à couvert de Fry', 0.45),
    guard('Relais de livraison de Fry', { duration: 4, reduce: 0.35 }),
    'Fry is an ordinary Planet Express delivery boy in the original Fox run. A parcel relay and safe-position signal are bounded coordination adaptations, not ammunition, a parcel explosion, a laser attack or an invented psychic power. His red jacket, white shirt, blue jeans and orange hair are fixed to this period.'),
  leela_futurama: kit('leela_futurama', hit('Coup de poing de Leela', 1.05),
    hit('Coup de pied de Leela', 1.8, { range: 105 }), defend('Garde de Leela', 0.52),
    hit('Enchaînement de Leela', 4.6, { range: 170 }),
    'Leela is a skilled physical martial artist and Planet Express pilot. This short punch-and-kick combination uses her limbs and athletic guard, not a gun, laser or eye beam. One accepted close contact resolves damage; generated drawings do not add extra hits. Her single central eye remains a single eye.'),
  bender_futurama: kit('bender_futurama', hit('Percussion de la main de Bender', 1.1),
    hit('Allonge mécanique de Bender', 1.75, { range: 110 }), defend('Garde articulée de Bender', 0.55),
    hit('Charge mécanique de Bender', 4.7, { range: 170 }),
    'Bender is the gray bending robot from the original Fox run. Articulated arms, hands and a short physical charge stay mechanical. His chest compartment does not spawn weapons, his eyes do not fire beams and this authored contact sequence does not invent a plasma cannon.'),
  amy_futurama: kit('amy_futurama', buff('Contrôle de l’outil d’Amy', { buffMultiplier: 1.08 }),
    guard('Signal technique d’Amy', { reduce: 0.22 }), defend('Repli d’Amy', 0.45),
    buff('Diagnostic mécanique d’Amy', { duration: 4, buffMultiplier: 1.23 }),
    'Amy is a Planet Express engineering intern in the original Fox period. Examining an ordinary handheld diagnostic pad and communicating a finding give bounded coordination buffs. She has no damaging scanner, gun, healing ray or magical repair power. The pink tracksuit and black bob haircut remain her normal outfit.'),
  hermes_futurama: kit('hermes_futurama', buff('Organisation de la tournée d’Hermes', { buffMultiplier: 1.08 }),
    guard('Consigne de sécurité d’Hermes', { reduce: 0.22 }), defend('Mise à couvert d’Hermes', 0.45),
    buff('Coordination administrative d’Hermes', { duration: 4, buffMultiplier: 1.23 }),
    'Hermes is the human bureaucrat of Planet Express. He sorts actual papers, checks a clipboard and gives work instructions. These zero-damage coordination effects do not turn paperwork, limbo or spoken orders into lasers, physical projectiles, instant healing or supernatural barriers.'),
  zoidberg_futurama: kit('zoidberg_futurama', guard('Avis médical prudent de Zoidberg', { reduce: 0.18 }),
    guard('Indication de retrait de Zoidberg', { reduce: 0.24 }), defend('Repli de Zoidberg', 0.45),
    guard('Orientation médicale de Zoidberg', { duration: 4, reduce: 0.35 }),
    'Dr John Zoidberg is the red Decapodian in a white medical coat, mint shirt and gray trousers. This version uses cautious advice and withdrawal signals rather than claiming reliable human treatment. No HP regeneration, healing magic, claw projectile or beam is supplied by these gestures.'),
  rick: kit('rick', shot('Tir du pistolet spatial de Rick', 1.15),
    guard('Repérage de la sortie par Rick', { reduce: 0.24 }), defend('Esquive de Rick', 0.48),
    shot('Tir du pistolet spatial de Rick', 4.7, { range: 640 }),
    'Season2 Rick uses an ordinary compact science-fiction pistol as the selected damaging equipment. The distinct green portal gun is a transit device and is not used as a damaging blaster. The support action communicates a safe route without teleporting units, splitting reality or creating a Microverse explosion. His source-era white coat, pale cyan shirt and brown trousers remain unchanged.'),
  morty: kit('morty', guard('Avertissement de Morty', { reduce: 0.18 }),
    guard('Repérage d’un abri par Morty', { reduce: 0.24 }), defend('Repli de Morty', 0.45),
    guard('Mise à couvert de Morty', { duration: 4, reduce: 0.35 }),
    'Season2 Morty is the ordinary human boy in a yellow T-shirt and blue jeans. Alarm, pointing out cover and crouching are zero-damage support gestures. This chosen portrayal supplies no gun, reality split, psychic strike or invented explosive catchphrase. End-of-match gestures are calm and non-graphic.'),
  summer: kit('summer', guard('Signal de repli de Summer', { reduce: 0.18 }),
    buff('Appel au regroupement de Summer', { buffMultiplier: 1.1 }), defend('Mise à couvert de Summer', 0.45),
    guard('Regroupement de Summer', { duration: 4, reduce: 0.35 }),
    'Season2 Summer wears a coral-pink sleeveless top, white trousers and black shoes, with orange ponytail. This supporting version communicates a regrouping route. It does not borrow the season3 wasteland costume, rifle, psychic effects or a post-apocalyptic area attack. Her instructions do not inflict damage.'),
  birdperson: kit('birdperson', guard('Garde des ailes de Birdperson', { reduce: 0.2 }),
    guard('Protection rapprochée de Birdperson', { reduce: 0.26 }), defend('Repli ailé de Birdperson', 0.5),
    guard('Garde ailée de Birdperson', { duration: 4, reduce: 0.38 }),
    'Birdperson is his biological season2 version before Phoenixperson. His natural brown feathered wings fold into a physical protective stance, adapted into a bounded guard without adding flight, teleportation, healing or a supernatural force field. Cybernetic wings, implants, laser eyes and the later Phoenixperson weapons are excluded.')
});
