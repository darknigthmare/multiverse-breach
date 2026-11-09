// Predator — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'predator',
    name: 'Jungle Hunter',
    universe: 'Predator',
    incarnation: 'Predator (1987) - Jungle Hunter',
    referenceUrl: 'https://www.20thcenturystudios.com/movies/predator',
    visualAnchor: 'The original 1987 Jungle Hunter: silver biomask, mottled skin, dreadlocks, netted body suit, asymmetrical armor, wristblades and shoulder plasma caster. No City Hunter smart disc, combi-stick or later-film equipment.',
    canonStatus: 'source-locked-gameplay-adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Wristblades', 'Shoulder plasma caster', 'Biomask', 'Cloaking device'],
    category: 'marine',
    primaryColor: '#5c524d',
    secondaryColor: '#00ff00',
    weaponType: 'wristblade',
    weaponColor: '#a9a9a9',
    stats: { hp: 140, atk: 18, def: 9, spd: 6 },
    simple: { name: 'Wristblade Slash', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Plasma Caster', type: 'plasma', cd: 5, dmg: 1.9 },
    defense: { name: 'Cloaking Device', type: 'dodge', dur: 2.5, reduce: 0.85 },
    special: { name: 'Unmasked Jungle Duel', type: 'melee_aoe', dmg: 4.8 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'medicomp', universe: 'Predator', name: { en: 'Yautja Medicomp', fr: 'Kit de Soin Yautja' }, boost: { hp: 90 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'bio_helmet', universe: 'Predator', name: { en: 'Thermal Bio-Helmet', fr: 'Bio-Casque Thermique' }, boost: { atk: 8, def: 4 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'gauntlet_pad', universe: 'Predator', name: { en: 'Computer Gauntlet', fr: 'Gantelet Ordinateur' }, boost: { spd: 2 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_pred_bomb',
    name: { en: 'Wrist-Gauntlet Bomb', fr: 'Bombe de Poignet Yautja' },
    desc: { en: 'Activates self-destruct countdown: deals 300 damage to all units on screen in 3 seconds.', fr: 'Déclenche le compte à rebours de bombe Yautja : inflige 300 dégâts à tous après 3 secondes.' },
    effect: 'self_destruct'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'city_hunter', name: 'City Hunter', cat: 'slayer', color: '#d35400' },
    { id: 'dutch', name: 'Dutch Schaefer', cat: 'tactical', color: '#16a085' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'anna_predator', name: 'Anna Gonsalves', cat: 'tactical', color: '#8f6f45' },
    { id: 'billy_predator', name: 'Billy Sole', cat: 'slayer', color: '#3d5c3d' },
    { id: 'mac_predator', name: 'Mac Eliot', cat: 'marine', color: '#4b6043' },
    { id: 'harrigan_predator', name: 'Mike Harrigan', cat: 'tactical', color: '#6c5f54' },
    { id: 'greyback_yautja', name: 'Greyback Elder', cat: 'marine', color: '#6b604c' }
  ]);
}
