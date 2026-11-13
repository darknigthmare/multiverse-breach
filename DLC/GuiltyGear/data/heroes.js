// Guilty Gear — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'solbadguy',
    name: 'Sol Badguy',
    universe: 'Guilty Gear',
    category: 'slayer',
    primaryColor: '#e74c3c',
    secondaryColor: '#f39c12',
    weaponType: 'greatsword',
    weaponColor: '#2c3e50',
    stats: { hp: 155, atk: 19, def: 10, spd: 5 },
    simple: { name: 'Gunflame Sweep', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Bandit Revolver', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Faultless Defense', type: 'shield', dur: 2.0, reduce: 0.85 },
    special: { name: 'Dragon Install Burst', type: 'fire_aoe', dmg: 5.3 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'outrage_fragment', universe: 'Guilty Gear', name: { en: 'Outrage Blade Fragment', fr: 'Fragment d\'Outrage' }, boost: { atk: 15 }, cost: 130 });
}

export function createEquipItemsDb2() {
  return ({ id: 'gear_core', universe: 'Guilty Gear', name: { en: 'Gear Cell Core', fr: 'Noyau Cellulaire Gear' }, boost: { hp: 80, def: 6 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'metal_belt', universe: 'Guilty Gear', name: { en: 'Heavy Metal Buckle Belt', fr: 'Ceinture à Boucle Rock' }, boost: { def: 8, spd: 1 }, cost: 95 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_gg_flame',
    name: { en: 'Junkyard Dog Spark', fr: 'Étincelle de Junkyard Dog' },
    desc: { en: 'Launches a fire wave across the floor dealing 130 damage and setting enemies on fire.', fr: 'Lance une vague de feu au sol infligeant 130 dégâts et brûlant les cibles.' },
    effect: 'fire_wave'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'ky', name: 'Ky Kiske', cat: 'tactical', color: '#3498db' },
    { id: 'may_gg', name: 'May', cat: 'marine', color: '#ff7675' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'dizzy_gg', name: 'Dizzy', cat: 'hacker', color: '#76d7c4' },
    { id: 'millia_gg', name: 'Millia Rage', cat: 'slayer', color: '#f7dc6f' },
    { id: 'axl_gg', name: 'Axl Low', cat: 'tactical', color: '#f4d03f' },
    { id: 'baiken_gg', name: 'Baiken', cat: 'slayer', color: '#e74c3c' }
  ]);
}
