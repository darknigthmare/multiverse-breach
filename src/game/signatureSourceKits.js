import { SIGNATURE_WAVE6_REFERENCES, SIGNATURE_WAVE6_ROWS } from './signatureSourceWave6.js';
import { SIGNATURE_WAVE5_REFERENCES, SIGNATURE_WAVE5_ROWS, SIGNATURE_WAVE5_UPGRADES } from './signatureSourceWave5.js';
import { SIGNATURE_WAVE4_REFERENCES, SIGNATURE_WAVE4_ROWS } from './signatureSourceWave4.js';
import { SIGNATURE_WAVE3_REFERENCES, SIGNATURE_WAVE3_ROWS } from './signatureSourceWave3.js';
import { SIGNATURE_WAVE2_REFERENCES, SIGNATURE_WAVE2_ROWS } from './signatureSourceWave2.js';
// Explicit source identities only. No blanket franchise abilities or 1:1 claim.
// Source URLs document identity/attack-family evidence, not our pixel choreography.
export const SIGNATURE_SOURCE_REFERENCES = Object.freeze({
  ...SIGNATURE_WAVE6_REFERENCES,
  ...SIGNATURE_WAVE2_REFERENCES,
  ...SIGNATURE_WAVE5_REFERENCES,
  ...SIGNATURE_WAVE4_REFERENCES,
  ...SIGNATURE_WAVE3_REFERENCES,
  ff7: 'https://guides.gamercorner.net/ffvii/limit-breaks/',
  ff8: 'https://guides.gamercorner.net/ffviii/limit-breaks/',
  ff13: 'https://guides.gamercorner.net/ffxiii/eidolons/',
  'ff13-primary': 'https://eu.finalfantasy.com/topics/6',
  db: 'https://en.dragon-ball-official.com/news/01_3039.html',
  'db-cell': 'https://en.dragon-ball-official.com/news/01_1257.html',
  naruto: 'https://naruto-official.com/en/news/01_1287',
  doom: 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
  'hl-bullsquid': 'https://github.com/ValveSoftware/halflife/blob/master/dlls/bullsquid.cpp',
  'hl-islave': 'https://github.com/ValveSoftware/halflife/blob/master/dlls/islave.cpp',
  'hl-houndeye': 'https://github.com/ValveSoftware/halflife/blob/master/dlls/houndeye.cpp',
  'hl-bigmomma': 'https://github.com/ValveSoftware/halflife/blob/master/dlls/bigmomma.cpp'
});
const NOTE = 'Source identity and attack family checked; balance, duration, geometry and visual choreography remain adaptations.';
const EIDOLON_NOTE = 'Eidolon finisher adaptation only: no controllable Gestalt phase, TP, instant death or source resistance bypass.';
const COLORS = Object.freeze({ beam: '#88e8ff', slash: '#ffe4ab', healing: '#8af0ac', orb: '#b899ff', lightning: '#c3edff', spiral: '#ffdf87', fire: '#ff9c52', acid: '#c8df69', ice: '#a8ddff', barrage: '#ffc179', summon: '#d0b8ff', radial: '#a6def5' });
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => ({
  key: actorId, universe, actorId, legacyName, name, style, range, source, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => ({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, ...extra
});
const rows = [
  hero("Final Fantasy VII", "cloud_ff7", "Cloud Strife Origin Burst", "Omnislash", "slash", 95, "ff7", {"hits": 15, "shape": "group", "distribution": "random"}),
  hero("Final Fantasy VII", "tifa_ff7", "Tifa Lockhart Origin Burst", "Beat Rush", "slash", 78, "ff7"),
  hero("Final Fantasy VII", "barret_ff7", "Barret Wallace Origin Burst", "Catastrophe", "barrage", 360, "ff7", {"hits": 10, "shape": "group", "distribution": "random"}),
  hero("Final Fantasy VII", "aerith_ff7", "Aerith Gainsborough Origin Burst", "Healing Wind", "healing", 600, "ff7", {"shape": "group", "effect": "heal", "healRatio": 0.5}),
  hero("Final Fantasy VII", "redxiii_ff7", "Red XIII Origin Burst", "Cosmo Memory", "orb", 440, "ff7", {"shape": "group"}),
  hero("Final Fantasy VII", "yuffie_ff7", "Yuffie Kisaragi Origin Burst", "All Creation", "beam", 360, "ff7", {"shape": "group"}),
  hero("Final Fantasy VIII", "squall_ff8", "Squall Leonhart Origin Burst", "Renzokuken", "slash", 95, "ff8", {"hits": 8, "note": "Eight-contact adaptation; no automatic Lion Heart finisher or source trigger mini-game."}),
  hero("Final Fantasy VIII", "rinoa_ff8", "Rinoa Heartilly Origin Burst", "Angelo Cannon", "summon", 320, "ff8", {"shape": "group", "kind": "summon", "summonName": "Angelo"}),
  hero("Final Fantasy VIII", "quistis_ff8", "Quistis Trepe Origin Burst", "Laser Eye", "beam", 360, "ff8", {"shape": "group"}),
  hero("Final Fantasy XIII", "lightning_ff13", "Lightning Origin Burst", "Odin — Zantetsuken", "slash", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Odin", "note": EIDOLON_NOTE}),
  hero("Final Fantasy XIII", "fang_ff13", "Fang Origin Burst", "Bahamut — Megaflare", "beam", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Bahamut", "note": EIDOLON_NOTE}),
  hero("Final Fantasy XIII", "vanille_ff13", "Vanille Origin Burst", "Hecatoncheir — Gaian Salvo", "barrage", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Hecatoncheir", "note": EIDOLON_NOTE}),
  hero("Final Fantasy XIII", "snow_ff13", "Snow Villiers Origin Burst", "Stiria & Nix — Diamond Dust", "ice", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Stiria & Nix", "note": EIDOLON_NOTE}),
  hero("Final Fantasy XIII", "sazh_ff13", "Sazh Katzroy Origin Burst", "Brynhildr — Múspell Flame", "fire", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Brynhildr", "note": EIDOLON_NOTE}),
  hero("Final Fantasy XIII", "hope_ff13", "Alexander Summon Trace", "Alexander — Divine Judgment", "orb", 520, "ff13", {"shape": "group", "kind": "summon", "summonName": "Alexander", "note": EIDOLON_NOTE}),
  hero("Dragon Ball Z", "goku_dbz", "Son Goku Origin Burst", "Kamehameha", "beam", 380, "db", {"shape": "multi"}),
  hero("Dragon Ball Z", "vegeta_dbz", "Vegeta Origin Burst", "Final Flash", "beam", 380, "db-cell", {"shape": "multi", "color": "#fff299"}),
  hero("Dragon Ball Z", "piccolo_dbz", "Piccolo Origin Burst", "Special Beam Cannon", "spiral", 380, "db", {"shape": "multi"}),
  hero("Naruto", "naruto_uzumaki_young", "Naruto Uzumaki Origin Burst", "Rasengan", "orb", 78, "naruto", {"color": "#86e6ff", "delivery": "melee"}),
  hero("Naruto", "sasuke_uchiha_young", "Sasuke Uchiha Origin Burst", "Chidori", "lightning", 90, "naruto", {"delivery": "melee"}),
  hero("Naruto Shippuden", "naruto_six_paths", "Naruto Uzumaki Shippuden Origin Burst", "Rasengan", "orb", 78, "naruto", {"note": "Shared Rasengan technique; does not grant a new Six Paths transformation.", "color": "#86e6ff", "delivery": "melee"}),
  hero("Naruto Shippuden", "sasuke_rinnegan", "Sasuke Uchiha Shippuden Origin Burst", "Chidori", "lightning", 90, "naruto", {"delivery": "melee"}),
  enemy("Dragon Ball Z", "Frieza Final Form", "Frieza Final Form Breach Pattern", "Death Ball", "orb", 430, "db", {"shape": "group"}),
  enemy("Dragon Ball Z", "Perfect Cell", "Perfect Cell Breach Pattern", "Kamehameha", "beam", 380, "db-cell", {"shape": "multi"}),
  enemy("Dragon Ball Z", "Kid Buu", "Spirit Bomb finish", "Planet Burst", "orb", 520, "db", {"shape": "group"}),
  enemy("Half-Life", "Acid-Spitting Bullsquid", null, "Bullsquid Spit", "acid", 330, "hl-bullsquid"),
  enemy("Half-Life", "Vortigaunt Shock Trooper", null, "Vortigaunt Electrical Discharge", "lightning", 330, "hl-islave"),
  enemy("Half-Life", "Houndeye Pack", null, "Houndeye Sonic Blast", "radial", 180, "hl-houndeye", {"shape": "group"}),
  enemy("Half-Life", "Gonarch Brood Mother", "Headcrab Swarm Birth", "Gonarch Mortar", "orb", 380, "hl-bigmomma", {"shape": "multi"}),
  enemy("Doom", "Imp Fireball Thrower", null, "Imp Fireball", "fire", 330, "doom"),
  enemy("Doom", "Imp Fireballer", null, "Imp Fireball", "fire", 330, "doom"),
  enemy("Doom", "Imp Fireball Pack", null, "Imp Fireball", "fire", 330, "doom"),
  enemy("Doom", "Cacodemon Orb", null, "Cacodemon Ball Lightning", "orb", 340, "doom"),
  enemy("Doom", "Cacodemon Floater", null, "Cacodemon Ball Lightning", "orb", 340, "doom"),
  enemy("Doom", "Revenant Jetpack", null, "Revenant Missile", "barrage", 350, "doom"),
  enemy("Doom", "Mancubus Flame Tank", null, "Mancubus Fireball Salvo", "barrage", 320, "doom", {"hits": 6, "shape": "multi", "distribution": "cycle"}),
  enemy("Doom", "Mancubus Heavy Demon", null, "Mancubus Fireball Salvo", "barrage", 320, "doom", {"hits": 6, "shape": "multi", "distribution": "cycle"}),
  enemy("Doom", "Cyberdemon Lord", "Tyrant Rocket Storm", "Cyberdemon Rocket Salvo", "barrage", 390, "doom", {"hits": 3, "shape": "multi", "distribution": "cycle"}),
  enemy("Doom", "Spider Mastermind Mother", "Plasma Pulse Ring", "Spider Mastermind Chaingun", "barrage", 380, "doom", {"hits": 3}),
  ...SIGNATURE_WAVE6_ROWS,
  ...SIGNATURE_WAVE2_ROWS,
  ...SIGNATURE_WAVE5_ROWS,
  ...SIGNATURE_WAVE4_ROWS,
  ...SIGNATURE_WAVE3_ROWS
 ].map(row => ({
  hits: 1, shape: 'single', kind: 'personal', distribution: 'all', effect: 'damage', note: NOTE,
  delivery: row.style === 'slash' ? 'melee' : 'ranged', directional: row.shape !== 'group', color: COLORS[row.style], ...row
}));
const frozen = value => { if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); } return value; };
export const SIGNATURE_SOURCE_KITS = frozen(Object.fromEntries(rows.map(row => [row.key, {
  ...row, ...SIGNATURE_WAVE5_UPGRADES[row.key], fidelity: 'source-described-adaptation', canonicalFidelityApproved: false,
  referenceUrl: SIGNATURE_SOURCE_REFERENCES[row.source], visualStatus: SIGNATURE_WAVE5_UPGRADES[row.key]?.visualStatus || 'existing-artwork; source animation missing',
  windupTicks: row.delivery === 'melee' ? 18 : 30, revealTicks: row.kind === 'summon' ? 42 : 24,
  hitGapTicks: row.hits > 1 ? 8 : 1, outroTicks: 24
}])));
const heroes = new Map(rows.filter(row => row.actorId).map(row => [row.actorId, SIGNATURE_SOURCE_KITS[row.key]]));
const enemies = new Map(rows.filter(row => row.enemyName).map(row => [`${row.universe}::${row.enemyName}`, SIGNATURE_SOURCE_KITS[row.key]]));
const allowedActor = actor => actor && !actor.nonCombatTrial && actor.nonCombat !== true
  && actor.combatEnabled !== false && actor.combatEligible !== false;
export function resolveSourceSignature(actor) {
  if (!allowedActor(actor)) return null;
  const sourceId = actor.sourceId || actor.id;
  const universe = actor.sourceUniverse || actor.universe;
  const hero = heroes.get(sourceId);
  const definition = hero || enemies.get(`${universe}::${actor.canonicalName || actor.name}`);
  if (!definition || universe !== definition.universe) return null;
  if (definition.enemyId && sourceId !== definition.enemyId) return null;
  if (definition.requiredContinuity && actor.continuityScope !== definition.requiredContinuity) return null;
  // A different incarnation or an explicitly authored custom kit is not replaced.
  const current = actor.special;
  if (current?.sourceSignatureKey === definition.key) return definition;
  if (actor.canonCombatPresentation === true || current?.smashProfile || current?.rpgProfile
    || actor.smashAttacks?.special || actor.rpgAttacks?.special) return null;
  const name = typeof current === 'string' ? current : current?.name;
  if (name != null && name !== definition.legacyName) return null;
  if (definition.actorId && name == null) return null;
  return definition;
}

// Called only on battle-local actors; catalog/save definitions are never mutated.
export function prepareSourceSignature(actor) {
  const d = resolveSourceSignature(actor);
  if (!d || actor.special?.sourceSignatureKey === d.key) return d;
  const old = actor.special;
  const multiplier = Number.isFinite(old?.dmg) ? old.dmg : actor.isBoss || actor.isWorldBoss ? 2.5 : 1.5;
  const support = d.effect === 'heal' || d.effect === 'guard';
  actor.special = {
    ...(typeof old === 'object' ? old : {}), name: d.name,
    type: support ? d.effect === 'guard' ? 'shield' : 'heal' : d.kind === 'summon' ? 'summon' : d.delivery === 'melee' ? 'melee' : 'beam',
    dmg: support ? 0 : multiplier, healRatio: d.healRatio || 0, sourceSignatureKey: d.key,
    rpgProfile: { effect: d.effect, targetSide: support ? 'ally' : 'enemy',
      shape: d.shape === 'single' ? 'single' : 'group', healRatio: d.healRatio || 0 },
    smashProfile: { delivery: d.delivery, shape: d.shape, range: d.range,
      verticalRange: d.shape === 'group' ? 180 : 42, maxTargets: d.shape === 'single' ? 1 : 8,
      directional: support ? false : d.directional, knockback: d.hits > 1 ? 0 : d.delivery === 'melee' ? 24 : 12 }
  };
  // Correct only a documented generic basic action; never rewrite a player's
  // custom attack or another incarnation while preparing the special.
  const correction = d.basicCorrection;
  if (correction && actor.simple?.name === correction.legacyName
    && !actor.simple.smashProfile && !actor.simple.rpgProfile && !actor.simple.attackProfile
    && !actor.smashAttacks?.simple && !actor.rpgAttacks?.simple) {
    actor.simple = { ...actor.simple, name: correction.name, type: correction.type,
      rpgProfile: { effect: 'damage', targetSide: 'enemy', shape: 'single', delivery: correction.delivery },
      smashProfile: { delivery: correction.delivery, shape: 'single', range: correction.range, verticalRange: 40 } };
    actor.weaponType = correction.weaponType;
  }
  actor.versusSpecialName = d.name;
  actor.sourceSignature = { key: d.key, fidelity: d.fidelity, referenceUrl: d.referenceUrl };
  if (!Number.isFinite(actor.specialCharge)) actor.specialCharge = 0;
  return d;
}
