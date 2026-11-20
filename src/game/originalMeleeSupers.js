import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';

const timed = (animationDuration, hitAt, targeting, extra = {}) => ({ animationDuration, hitAt, targeting, ...extra });
const sweep = (range, coneAngle, duration, hitAt, maxTargets = 2) => timed(duration, hitAt, {
  delivery: 'melee', shape: 'cone', range, coneAngle, maxTargets
});
const strike = (range, duration, hitAt) => timed(duration, hitAt, { delivery: 'melee', shape: 'single', range });
const radial = (range, maxTargets, duration, hitAt) => timed(duration, hitAt, {
  delivery: 'radial', shape: 'area', range, areaRadius: range, maxTargets
});
const line = (range, maxTargets, duration, hitAt) => timed(duration, hitAt, {
  delivery: 'beam', shape: 'line', range, maxTargets
});
const volley = (range, maxTargets, duration, hitAt) => timed(duration, hitAt, {
  delivery: 'projectile', shape: 'line', range, maxTargets
});
const targetZone = (delivery, range, areaRadius, maxTargets, duration, hitAt, statusEffect) => timed(duration, hitAt, {
  delivery, shape: 'area', range, areaRadius, maxTargets
}, statusEffect ? { statusEffect } : {});
const support = (effect, range, animationDuration, hitAt, values) => timed(animationDuration, hitAt, {
  effect, targetSide: 'ally', shape: 'group', range, maxTargets: 3, ...values
}, { dmg: 0 });
const guard = (range, reduce, duration, animationDuration, hitAt, targetSide = 'ally') => support(
  'guard', range, animationDuration, hitAt, { reduce, duration, targetSide, ...(targetSide === 'self' ? { shape: 'single' } : {}) }
);
const buff = (range, buffMultiplier, duration, animationDuration, hitAt) => support(
  'buff', range, animationDuration, hitAt, { buffMultiplier, duration }
);
const cleanse = (range, animationDuration, hitAt) => support(
  'cleanse', range, animationDuration, hitAt, { cleanses: 'glitched' }
);
const heal = (range, healRatio, animationDuration, hitAt) => support(
  'heal', range, animationDuration, hitAt, { healRatio }
);

// These timings and distances belong to Mêlée. The manifest supplies the
// move name, equipment, colour, identity, and base power for offensive moves.
const profiles = new Map(Object.entries({
  // Imperium Aeternum — the augur disrupts a small patch of the front line.
  numa_corvinus: targetZone('area', 268, 86, 2, 1.22, 0.56, 'glitched'),
  // Aegea — the navigator cuts forward, the oracle disrupts a vision, the smith forges protection.
  thaleia_naxos: sweep(104, 98, 0.92, 0.33),
  melantho_seer: targetZone('area', 258, 95, 2, 1.26, 0.58, 'glitched'),
  doros_bronzehand: guard(152, 0.44, 4, 1.36, 0.66),
  // The shield line holds, the spear pursues one quarry and the rune marks a short area.
  eira_hrafnsdottir: guard(132, 0.5, 4.1, 1.03, 0.42),
  sten_ulfsson: strike(139, 0.91, 0.34),
  yrsa_rune_binder: targetZone('area', 284, 82, 2, 1.17, 0.51, 'glitched'),
  // The courier carries a rallying message while stone and khipu ward the group.
  killa_mayu: buff(218, 1.22, 4.2, 0.88, 0.31),
  rumi_illa: guard(158, 0.48, 4.5, 1.24, 0.53),
  sumaq_khipu: cleanse(207, 1.33, 0.59),
  // Ofuda and forge protect the boundary; the sanctuary blade severs the affliction.
  rei_kagetsu: guard(174, 0.37, 3.8, 1.29, 0.62),
  aoi_mikazuki: cleanse(107, 0.91, 0.36),
  daichi_kurogane: guard(147, 0.47, 4.6, 1.42, 0.68),
  // Talismans mark a calculation, the glaive directs the current, the bell heals nearby kin.
  lin_yue: targetZone('area', 271, 90, 2, 1.18, 0.55, 'glitched'),
  wei_long: sweep(158, 80, 1.11, 0.46, 3),
  mei_zhen: heal(187, 0.31, 1.33, 0.61),
  // Compass, stone and voice stay distinct; the song strengthens existing allies.
  astra_vey: targetZone('area', 305, 98, 3, 1.22, 0.54),
  korun_stoneborn: radial(141, 3, 1.36, 0.62),
  nyme_first_song: buff(209, 1.25, 4.6, 1.37, 0.64),
  // Broadside, penned current and boarding swing use their own geometry.
  ysara_flint: targetZone('projectile', 318, 85, 3, 1.24, 0.53),
  milo_quill: targetZone('area', 246, 113, 3, 1.12, 0.5),
  brann_crow: sweep(123, 116, 1.2, 0.49, 3),
  // Arcanist exception, alchemical medicine and rune blade.
  lyra_hexwind: targetZone('area', 294, 104, 3, 1.16, 0.52),
  orin_vale: heal(152, 0.36, 1.31, 0.57),
  nessa_vire: sweep(112, 82, 0.93, 0.37),
  // Unbind contracts, sweep with the hellblade, or bear the chains yourself.
  mercy_ash: cleanse(182, 1.18, 0.51),
  azael_vorn: sweep(132, 105, 1.18, 0.5, 3),
  morcant_bound: guard(1, 0.58, 4.4, 1.29, 0.58, 'self'),
  // The Concordat distinguishes its lance, cannon and consensual network.
  seyra_tal: line(397, 3, 1.15, 0.49),
  korr_venn: targetZone('projectile', 303, 98, 3, 1.38, 0.63),
  ixo_9: guard(189, 0.36, 4.3, 1.25, 0.58),
  // A translation breaks compulsion; the lighthouse projects and the compass disorients.
  mara_ell: cleanse(167, 1.16, 0.53),
  jonas_mire: line(374, 3, 1.27, 0.57),
  oona_vell: targetZone('area', 276, 108, 3, 1.24, 0.54, 'glitched'),
  // Bow volley, anvil shock and the axe of the elected clan chief.
  aelwen_starbough: volley(361, 3, 1.09, 0.45),
  brokk_embervein: radial(126, 3, 1.32, 0.61),
  goruk_ash_tusk: sweep(137, 108, 1.17, 0.47, 3),
  // The signal fires forward, the charge demolishes in a bounded patch, the archive disrupts interpretation.
  elise_varenne: volley(287, 2, 1.04, 0.41),
  tomas_grey: targetZone('projectile', 264, 107, 3, 1.33, 0.6),
  safiya_nadir: targetZone('area', 267, 83, 2, 1.28, 0.57, 'glitched')
}));

const manifestHeroes = new Map(ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => world.heroes
  .filter(hero => profiles.has(hero.id)).map(hero => [hero.id, hero])));

export function getOriginalMeleeSuper(actor) {
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const tuning = profiles.get(id);
  const source = manifestHeroes.get(id);
  if (!tuning || !source || actor.sourceType !== 'original' || actor.originalContent !== true
    || actor.universe !== source.universe || (actor.sourceUniverse && actor.sourceUniverse !== source.universe)
    || actor.name !== source.name || actor.weaponType !== source.weaponType || actor.loreRole !== source.loreRole
    || actor.isBoss || actor.isWorldBoss || actor.smashAttacks?.special || actor.rpgAttacks?.special) return null;
  // A supplied loadout can carry its own timing even with a familiar label.
  const fields = Object.keys(source.special);
  if (!actor.special || Object.keys(actor.special).length !== fields.length
    || !fields.every(field => actor.special[field] === source.special[field])) return null;
  return {
    special: { ...source.special, ...tuning, meterCost: 100 },
    sourceWork: `Multiverse Breach — ${source.universe}`,
    sourceReference: `src/game/originalUniversesManifest.json — ${id}: ${source.loreRole} ${source.special.name}.`,
    identityBasis: 'original-project-manifest'
  };
}
