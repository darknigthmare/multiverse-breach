// Source-version curation. Mechanics and generated art remain declared adaptations.
const source = (universe, name, kind, effect, delivery, sourceWork, sourceReference, weaponType) =>
  Object.freeze({ universe, name, kind, effect, delivery, sourceWork, sourceReference, weaponType,
    source1to1Verified: false, canonicalVerified: false, networkVerified: false });

export const COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_C = Object.freeze({
  ash_williams: source('Evil Dead', 'Enchaînement à la tronçonneuse d’Ash', 'chainsaw', 'damage', 'melee',
    'Army of Darkness (1992), Ash Williams avant le retour à S-Mart', 'https://en.wikipedia.org/wiki/Army_of_Darkness', 'chainsaw'),
  annie_knowby: source('Evil Dead', 'Lecture des passages par Annie', 'book-reading', 'guard', 'support',
    'Evil Dead II (1987), Annie Knowby humaine et vivante', 'https://en.wikipedia.org/wiki/Evil_Dead_II', 'book'),
  henry_red_ed: source('Evil Dead', 'Passe d’armes de Henry le Rouge', 'sword', 'damage', 'melee',
    'Army of Darkness (1992), Henry le Rouge, guerrier humain médiéval', 'https://en.wikipedia.org/wiki/Army_of_Darkness', 'sword'),
  pablo_evil_dead: source('Evil Dead', 'Consignes de protection de Pablo', 'ritual-support', 'guard', 'support',
    'Ash vs Evil Dead, saison 1 (2015), Pablo Bolivar avant les révélations ultérieures', 'https://en.wikipedia.org/wiki/Ash_vs_Evil_Dead', 'unarmed'),
  kelly_evil_dead: source('Evil Dead', 'Tir de couverture de Kelly', 'shotgun', 'damage', 'projectile',
    'Ash vs Evil Dead, saison 1 (2015), Kelly Maxwell humaine', 'https://en.wikipedia.org/wiki/Ash_vs_Evil_Dead', 'shotgun'),
  ruby_evil_dead: source('Evil Dead', 'Garde au poignard de Ruby', 'dagger-guard', 'guard', 'support',
    'Ash vs Evil Dead, saison 1 (2015), Ruby aux cheveux roses', 'https://en.wikipedia.org/wiki/Ash_vs_Evil_Dead', 'dagger'),
  isaac: source('Dead Space', 'Tir ajusté du Plasma Cutter', 'plasma-cutter', 'damage', 'projectile',
    'Dead Space (2008), Isaac Clarke et RIG d’ingénieur niveau 3', 'https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)', 'plasma_cutter'),
  carver: source('Dead Space', 'Rafale du fusil de Carver', 'military-rifle', 'damage', 'projectile',
    'Dead Space 3 (2013), John Carver et son RIG de soldat', 'https://en.wikipedia.org/wiki/Dead_Space_3', 'gun'),
  ellie: source('Dead Space', 'Tir de couverture d’Ellie', 'rifle', 'damage', 'projectile',
    'Dead Space 2 (2011), Ellie Langford en tenue civile de pilote', 'https://en.wikipedia.org/wiki/Dead_Space_2', 'gun'),
  nicole_brennan: source('Dead Space', 'Consignes médicales de Nicole', 'medical-coordination', 'guard', 'support',
    'Dead Space (2008), Nicole Brennan humaine, vivante et en tenue médicale', 'https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)', 'unarmed')
});
