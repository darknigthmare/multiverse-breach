// Deliberately scoped film continuities; drawings/mechanics remain adaptations.
const define = (name, kind, effect, delivery, sourceWork, sourceReference, weaponType) => ({
  universe: 'Predator', name, kind, effect, delivery, sourceWork, sourceReference, weaponType,
  source1to1Verified: false, canonicalVerified: false, networkVerified: false
});
const film1987 = 'Predator (1987), original film continuity';
const film1990 = 'Predator 2 (1990), original film continuity';
const source1987 = 'https://www.20thcenturystudios.com/movies/predator';
const source1990 = 'https://www.20thcenturystudios.com/movies/predator-2';
export const COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_B = Object.freeze({
  predator: define('Estoc aux lames de poignet du Jungle Hunter', 'wristblade', 'damage', 'melee', film1987, source1987, 'wristblade'),
  city_hunter: define('Estoc à la combi-stick du City Hunter', 'spear', 'damage', 'melee', film1990, source1990, 'spear'),
  dutch: define('Rafale au M16 de Dutch', 'rifle', 'damage', 'projectile', film1987, source1987, 'gun'),
  anna_predator: define('Indication du passage sûr par Anna', 'safe-route', 'guard', 'support', film1987, source1987, 'unarmed'),
  billy_predator: define('Taille à la machette de Billy', 'machete', 'damage', 'melee', film1987, source1987, 'slash'),
  mac_predator: define('Rafale au M60 de Mac', 'machinegun', 'damage', 'projectile', film1987, source1987, 'gun'),
  harrigan_predator: define('Tir ajusté du pistolet de Harrigan', 'pistol', 'damage', 'projectile', film1990, source1990, 'gun'),
  greyback_yautja: define('Reconnaissance du chasseur par Greyback', 'elder-trophy', 'guard', 'support', film1990, source1990, 'claw'),
  naru: define('Taille au tomahawk à corde de Naru', 'hatchet', 'damage', 'melee', 'Prey (2022), adult Naru during the hunt', 'https://www.20thcenturystudios.com/movies/prey', 'axe'),
  royce_predators_core: define('Tir de l’AA-12 de Royce', 'shotgun', 'damage', 'projectile', 'Predators (2010), Royce with his AA-12', 'https://www.20thcenturystudios.com/movies/predators', 'gun')
});
