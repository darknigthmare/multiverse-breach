import { area, buff, defend, guard, hit, shot } from './rules.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 as sources } from '../combatSourceDefinitionsWave11.js';

const kit = (id, reference, simple, secondary, defense, special, color) => ({
  sourceHeroId: id, universe: sources[id].universe, sourceWork: sources[id].sourceWork,
  sourceUrl: sources[id].sourceReference, sourceReference: reference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  source1to1Verified: false, gameplayAdaptation: true,
  simple, secondary: { cd: 6, ...secondary }, defense,
  special: { ...special, name: sources[id].name, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 }
});

export const ABILITIES_WAVE11_PART_C = Object.freeze({
  roland_bl: kit('roland_bl',
    'Borderlands2009 Soldier Roland uses a selected ordinary assault rifle. Scorpio Turret belongs to his secondary action, not his rifle super. No Crimson Raiders rally, later commander costume or magical group attack is imported from Borderlands2. Turret damage is a bounded engine adaptation, not a new autonomous permanent actor.',
    shot('Tir du fusil de Roland', 1.15, { range: 600 }),
    shot('Tourelle Scorpio de Roland', 1.9, { range: 600 }),
    defend('Bouclier personnel du Soldat', 0.6, { duration: 2 }),
    shot(sources.roland_bl.name, 4.7, { range: 640 }), '#a2b68a'),
  brick_bl: kit('brick_bl',
    'Borderlands2009 Berserker Brick fights with his actual bare fists during Berserk. The selected straight punch and uppercut remain contact attacks. No Slab King title, battle axe, explosive fist projectile or Borderlands2 faction power is transferred to this original Vault Hunter.',
    hit('Coup de poing de Brick', 1.2, { range: 170 }),
    hit('Uppercut de Brick', 1.9, { range: 170 }),
    defend('Garde du Berserker', 0.65, { duration: 2 }),
    hit(sources.brick_bl.name, 5, { range: 180 }), '#c29a77'),
  max: kit('max',
    'Mad Max Fury Road2015 Tom Hardy version, human Max with his physical sawed-off double-barrel shotgun. Reloading is a personal readiness buff and taking cover is personal guard. No Interceptor door, vehicle harpoon, conjured truck, thunderstick volley or later video-game power is created.',
    shot('Tir du fusil scié de Max', 1.2, { range: 520 }),
    buff('Recharger le fusil scié de Max', { targetSide: 'self', shape: 'single', range: 1, duration: 3, buffMultiplier: 1.15 }),
    defend('Mise à couvert de Max', 0.6, { duration: 2 }),
    shot(sources.max.name, 4.7, { range: 580 }), '#c2ae90'),
  furiosa: kit('furiosa',
    'Mad Max Fury Road2015 Charlize Theron version with her missing LEFT forearm replaced by the real salvage-metal prosthesis. The held rifle is the scoped Chinese Type56 SKS, without bayonet or cleaning rod, documented in the film. Her mechanical-arm strike is physical contact; neither arm emits energy. No vehicle or Green Place journey is converted into an attack.',
    shot('Tir du SKS de Furiosa', 1.2, { range: 620 }),
    hit('Frappe du bras prosthétique de Furiosa', 1.8, { range: 170 }),
    defend('Couvert personnel de Furiosa', 0.65, { duration: 2 }),
    shot(sources.furiosa.name, 4.9, { range: 680 }), '#c7b79a'),
  nux: kit('nux',
    'Mad Max Fury Road2015 Nux is the pale War Boy and mechanic. These chosen actions adapt checking fastenings, identifying an engine fault and helping the group maintain its route into zero-damage support. A small physical wrench and hands suffice; no vehicle body, suicide explosion, chrome magic, healing light or Valhalla attack is invented.',
    buff('Contrôle des fixations par Nux', { duration: 3, buffMultiplier: 1.1 }),
    guard('Signaler une panne et sécuriser l’accès', { duration: 2.5, reduce: 0.3 }),
    defend('Repli du mécanicien Nux', 0.5, { duration: 2 }),
    guard(sources.nux.name, { duration: 4, reduce: 0.45 }), '#c6c3b5')
});

// Existing authored identities receive explicit four-slot revisions; historic
// records remain intact and these selected screen/game-version actions override them.
export const ABILITY_REVISIONS_WAVE11_PART_C = Object.freeze({
  lilith_borderlands: kit('lilith_borderlands',
    'Borderlands2009 Siren Lilith uses an ordinary equipped SMG for her simple shot. Phasewalk is the original Siren action: the chosen local emergence blast is an area adaptation, not a hand laser, BL2 Firehawk wings or an arbitrary global target. Its withdrawal windows are represented by personal guard, without pretending that the engine implements literal invisibility.',
    shot('Tir du SMG équipé de Lilith', 1.15, { range: 580 }),
    guard('Phasewalk — fenêtre de retrait', { targetSide: 'self', shape: 'single', range: 1, duration: 2.5, reduce: 0.4 }),
    defend('Entrée en Marche de phase', 0.6, { duration: 2 }),
    area(sources.lilith_borderlands.name, 4.7, { range: 300, areaRadius: 140 }), '#9d77d8'),
  mordecai_borderlands: kit('mordecai_borderlands',
    'Borderlands2009 Hunter Mordecai keeps his original leather mask/cowl and actual scoped rifle. His named super is a physical precision shot. Bloodwing remains his original companion secondary action, never a replacement body for Mordecai and never a borrowed Borderlands2 slag rifle or mutated captive bird.',
    shot('Tir du fusil de Mordecai', 1.2, { range: 640 }),
    shot('Bloodwing — intervention du compagnon', 1.9, { range: 600 }),
    defend('Couvert du chasseur Mordecai', 0.55, { duration: 2 }),
    shot(sources.mordecai_borderlands.name, 4.9, { range: 700 }), '#b58e6d'),
  claptrap_borderlands: kit('claptrap_borderlands',
    'Borderlands2009 yellow CL4P-TP is the small monowheel service NPC, not the playable Pre-Sequel Vault Hunter. Signalling a route and calling for service are zero-damage communication adaptations. No VaultHunter.EXE, Funzerker, double gun, electrical attack, offensive laser or humanoid body is granted.',
    buff('CL4P-TP signale la route', { duration: 3, buffMultiplier: 1.1 }),
    guard('Alerte de service de Claptrap', { duration: 2.5, reduce: 0.25 }),
    defend('Retrait sur la roue de Claptrap', 0.45, { duration: 2 }),
    buff(sources.claptrap_borderlands.name, { duration: 4, buffMultiplier: 1.25 }), '#e8c64b'),
  toast_mm: kit('toast_mm',
    'Mad Max Fury Road2015 Toast the Knowing is the adult woman played by Zoe Kravitz, short dark hair and pale cloth wraps, not the male explorer drawn in the old bitmap. Her selected ordinary Glock17 shot is physical. Her special counts and checks the group ammunition, as seen with the War Rig weapons; it remains a zero-damage readiness buff, without conjuring ammunition or firing a support laser.',
    shot('Tir d’appui de Toast', 1.1, { range: 540 }),
    buff('Contrôle des armes du War Rig', { duration: 3, buffMultiplier: 1.12 }),
    defend('Mise à couvert de Toast', 0.5, { duration: 2 }),
    buff(sources.toast_mm.name, { duration: 4, buffMultiplier: 1.25 }), '#d3c3a5'),
  capable_mm: kit('capable_mm',
    'Mad Max Fury Road2015 Capable is the adult red-haired woman played by Riley Keough. She reassures Nux and helps the group make a safe passage. These are bounded communication and positioning adaptations: guard and encouragement, never magical healing, a laser weapon, a truck body or a new supernatural power.',
    buff('Capable rassure Nux', { duration: 3, buffMultiplier: 1.1 }),
    guard('Garder le groupe uni dans le War Rig', { duration: 2.5, reduce: 0.3 }),
    defend('Mise à couvert de Capable', 0.5, { duration: 2 }),
    guard(sources.capable_mm.name, { duration: 4, reduce: 0.45 }), '#d3b599')
});
