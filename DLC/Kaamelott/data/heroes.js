// Kaamelott — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'leodagan_kaamelott', name: 'Leodagan', cat: 'marine', color: '#5d4037' },
    { id: 'guenievre_kaamelott', name: 'Guenièvre', cat: 'hacker', color: '#f5cba7' },
    { id: 'lancelot_kaamelott', name: 'Lancelot', cat: 'slayer', color: '#d7dbdd' },
    { id: 'merlin_kaamelott', name: 'Merlin', cat: 'hacker', color: '#7d3c98' },
    { id: 'bohort_kaamelott', name: 'Bohort', cat: 'tactical', color: '#f9e79f' }
  ]);
}

export function createHeroOverrides() {
  return ({
    weaponType: 'sword',
    weaponColor: '#d6b465',
    simple: { name: 'Excalibur Order Cut', type: 'melee', dmg: 1.08 },
    secondary: { name: 'Round Table Command', type: 'tactical', cd: 6, dmg: 1.55 },
    defense: { name: 'Royal Weariness Guard', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Grail Quest Rally', type: 'support_aoe', dmg: 4.35, color: '#d6b465' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'sword',
    weaponColor: '#8ecae6',
    simple: { name: 'Oblique Logic Strike', type: 'melee', dmg: 0.98 },
    secondary: { name: 'Welsh Rule Misread', type: 'confuse', cd: 6, dmg: 1.45 },
    defense: { name: 'Lucky Misunderstanding', type: 'dodge', dur: 2.0, reduce: 0.84 },
    special: { name: 'C est Pas Faux Loop', type: 'mind_aoe', dmg: 4.2, color: '#8ecae6' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'ration',
    weaponColor: '#b88746',
    simple: { name: 'Vannes Table Hit', type: 'melee', dmg: 1.02 },
    secondary: { name: 'Snack Break Hold', type: 'heal', cd: 7, dmg: 1.25 },
    defense: { name: 'Karadoc Ration Guard', type: 'shield', dur: 2.4, reduce: 0.84 },
    special: { name: 'Clan Survival Feast', type: 'support_aoe', dmg: 4.15, color: '#b88746' }
  });
}
