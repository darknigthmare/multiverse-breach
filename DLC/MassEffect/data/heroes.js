// Mass Effect — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'shepard',
    name: 'Commander Shepard',
    universe: 'Mass Effect',
    category: 'marine',
    primaryColor: '#34495e',
    secondaryColor: '#e74c3c',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 145, atk: 16, def: 10, spd: 6 },
    simple: { name: 'Omni-Blade / Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Singularity Field', type: 'gravity', cd: 7, dmg: 1.8 },
    defense: { name: 'Tech Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Mako Strike', type: 'melee_aoe', dmg: 5.1 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'omni_gel', universe: 'Mass Effect', name: { en: 'Omni-Gel Pack', fr: 'Pack d\'Omni-Gel' }, boost: { hp: 100 }, cost: 80 });
}

export function createEquipItemsDb2() {
  return ({ id: 'n7_chestplate', universe: 'Mass Effect', name: { en: 'N7 Heavy Carbon Armor', fr: 'Plastron Carbone N7' }, boost: { def: 10 }, cost: 130 });
}

export function createEquipItemsDb3() {
  return ({ id: 'element_zero', universe: 'Mass Effect', name: { en: 'Refined Element Zero', fr: 'Élément Zéro Purifié' }, boost: { atk: 10, spd: 1 }, cost: 120 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_me_mako',
    name: { en: 'Mako Airdrop Beacon', fr: 'Balise Airdrop du Mako' },
    desc: { en: 'Drops a heavy Mako armored vehicle onto the field, dealing 220 crash damage to all enemies.', fr: 'Largue un blindé Mako lourd écrasant tous les ennemis au sol (220 dégâts).' },
    effect: 'mako_drop'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'garrus', name: 'Garrus Vakarian', cat: 'tactical', color: '#0984e3' },
    { id: 'liara', name: 'Liara T\'Soni', cat: 'hacker', color: '#74b9ff' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'tali', name: 'Tali Zorah', cat: 'hacker', color: '#8e44ad' },
    { id: 'wrex', name: 'Urdnot Wrex', cat: 'marine', color: '#7b241c' },
    { id: 'ashley_williams', name: 'Ashley Williams', cat: 'marine', color: '#34495e' },
    { id: 'mordin', name: 'Mordin Solus', cat: 'hacker', color: '#95a5a6' }
  ]);
}
