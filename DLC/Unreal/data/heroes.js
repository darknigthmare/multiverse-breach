// Unreal — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'malcolm',
    name: 'Malcolm',
    universe: 'Unreal',
    category: 'tactical',
    primaryColor: '#95a5a6',
    secondaryColor: '#3498db',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 140, atk: 16, def: 9, spd: 6 },
    simple: { name: 'Shock Rifle Beam', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Flak Cannon Blast', type: 'shotgun', cd: 6, dmg: 1.9 },
    defense: { name: 'Shield Belt Shield', type: 'shield', dur: 2.5, reduce: 0.8 },
    special: { name: 'Redeemer Nuke', type: 'rocket', dmg: 5.6 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'shield_belt', universe: 'Unreal', name: { en: 'High Volt Shield Belt', fr: 'Ceinture à Bouclier UT' }, boost: { hp: 70, def: 10 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'jump_boots', universe: 'Unreal', name: { en: 'Anti-Gravity Jump Boots', fr: 'Bottes Anti-Gravité' }, boost: { spd: 4 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'udamage_power', universe: 'Unreal', name: { en: 'Double Damage U-Damage', fr: 'Amplificateur U-Damage' }, boost: { atk: 15 }, cost: 150 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_ut_redeemer',
    name: { en: 'Redeemer Missile', fr: 'Missile Rédempteur' },
    desc: { en: 'Launches a slow thermonuclear missile. Deals 350 damage to all enemies, cleaning the screen.', fr: 'Tire un missile thermonucléaire Rédempteur lent infligeant 350 dégâts à tout le monde.' },
    effect: 'redeemer_blast'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'malcolm', name: 'Malcolm', cat: 'marine', color: '#e67e22' },
    { id: 'brock', name: 'Brock', cat: 'slayer', color: '#c0392b' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'lauren_unreal', name: 'Lauren', cat: 'slayer', color: '#e74c3c' },
    { id: 'xan_krigor', name: 'Xan Kriegor', cat: 'hacker', color: '#f1c40f' },
    { id: 'prism_unreal', name: 'Prism', cat: 'tactical', color: '#9b59b6' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'krieg_unreal', name: 'Kragoth', cat: 'slayer', color: '#7f8c8d', simpleName: 'Shock Rifle Combo', secondaryName: 'Ripper Disc Return', defenseName: 'Dodge Jump Guard', specialName: 'Godlike Streak' }
  ]);
}
