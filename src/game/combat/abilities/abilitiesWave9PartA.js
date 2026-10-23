import { action, defend, guard, hit, shot } from './rules.js';

const universe = 'Gears of War';
const sourceWork = 'Gears of War 2 (2008)';
const special = (ability, color) => ({ ...ability, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, sourceReference, simple, secondary, defense, superAction) => ({
  sourceHeroId, universe, sourceWork, sourceReference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special: superAction
});

// Explicit GoW2 loadouts, not dialogue converted into powers. A multi-shot
// visual is condensed to the engine's single authored impact. No extra hits,
// resurrection, invented physiology, Fabricator or later-era robot is added.
export const ABILITIES_WAVE9_PART_A = Object.freeze({
  marcus: kit('marcus',
    'GoW2 Marcus Fenix wears his dark bandana and COG armor and uses the Mk2 Lancer. The Hammer of Dawn is an external orbital satellite particle beam, guided by a handheld laser designator; the carried device does not emit the destructive beam. Manual armory entry and source-role adaptation; targeting/timing are bounded gameplay adaptations.',
    shot('Lancer Fire', 1, { range: 640 }),
    hit('Chainsaw Lunge', 2.2, { range: 170 }),
    defend('Roadie Cover', 0.8, { duration: 2.5 }),
    special(action('Hammer of Dawn', 'beam_aoe', 5, 'damage', 'beam', 'area', 640,
      { areaRadius: 135, maxTargets: 8 }), '#ff6a39')),
  dom: kit('dom',
    'GoW2 Dominic Santiago uses physical COG firearms: Mk2 Lancer cover fire and a Gnasher shotgun at short range. Maria is a person and a story motivation, not a magical charge or damaging entity. The selected Gnasher volley is a condensed authored weapon action with one engine impact; personal cover guards Dom only.',
    shot('Lancer Cover Fire', 1, { range: 640 }),
    shot('Gnasher Breach Shot', 1.8, { range: 330, shape: 'cone', coneAngle: 40, maxTargets: 3 }),
    defend('Couvert rapproché de Dom', 0.8, { duration: 2 }),
    special(shot('Salve de Gnasher de Dom', 4.6, { range: 330, shape: 'cone', coneAngle: 40, maxTargets: 3 }), '#e2ad5c')),
  cole: kit('cole',
    'GoW2 Augustus Cole fights with physical COG weapons and his muscular body. The selected loadout uses Lancer fire and a short Gnasher shot; his Cole Train/whole grain dialogue and former Thrashball career are not a projectile or magical ultimate. The Lancer assault is an authored burst condensed to one engine impact. Personal brace protects Cole only.',
    shot('Tir de Lancer de Cole', 1.1, { range: 640 }),
    shot('Tir rapproché de Gnasher de Cole', 1.9, { range: 330, shape: 'cone', coneAngle: 40, maxTargets: 3 }),
    defend('Garde personnelle de Cole', 0.65, { duration: 2 }),
    special(shot('Assaut au Lancer de Cole', 4.8, { range: 640, shape: 'line', lineWidth: 48, maxTargets: 3 }), '#e7b65c'))
});

export const ABILITY_REVISIONS_WAVE9_PART_A = Object.freeze({
  baird: {
    universe, sourceWork,
    versionNote: 'Selected young GoW2 Baird: short blond hair, forehead goggles and COG equipment. Replace the later Judgment/GoW4 fortification framing with maintenance of existing COG equipment; no Fabricator, deployable turret or autonomous robot. Protection is a role-based support adaptation, not biological healing or a named official super.',
    secondary: { cd: 6, ...guard('Vérification de l’équipement COG', { duration: 2.5, reduce: 0.3 }) },
    special: special(guard('Maintenance du matériel COG', { duration: 5, reduce: 0.45 }), '#86b8cf')
  },
  hoffman_cog: {
    universe, sourceWork,
    versionNote: 'Selected GoW2 Colonel Victor Hoffman with his COG beret and armor. His existing command-based defense order remains zero-damage allied protection, an adaptation of military leadership rather than a magical shield or a newer-era ability.'
  }
});
