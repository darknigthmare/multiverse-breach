// Doom — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'doomslayer',
    name: 'Doom Slayer',
    universe: 'Doom',
    category: 'slayer',
    primaryColor: '#27ae60',
    secondaryColor: '#c0392b',
    weaponType: 'doomblade',
    weaponColor: '#bdc3c7',
    stats: { hp: 170, atk: 22, def: 11, spd: 5 },
    simple: { name: 'Super Shotgun Blast', type: 'shotgun', dmg: 1.4 },
    secondary: { name: 'Flame Belch', type: 'fire', cd: 6, dmg: 1.8 },
    defense: { name: 'Ice Bomb Cover', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'BFG 9000 Burst', type: 'beam_aoe', dmg: 6.0, color: '#39ff14' }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'crucible_guard', universe: 'Doom', name: { en: 'Crucible Hilt Plating', fr: 'Plaquage de Creuset' }, boost: { atk: 18 }, cost: 160 });
}

export function createEquipItemsDb2() {
  return ({ id: 'praetor_helm', universe: 'Doom', name: { en: 'Praetor Armored Helmet', fr: 'Casque d\'Armure Praetor' }, boost: { hp: 80, def: 9 }, cost: 130 });
}

export function createEquipItemsDb3() {
  return ({ id: 'argent_cell', universe: 'Doom', name: { en: 'Unstable Argent Cell', fr: 'Cellule d\'Énergie Argent' }, boost: { hp: 40, atk: 10 }, cost: 120 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_doom_quad',
    name: { en: 'Quad Damage Powerup', fr: 'Power-Up Quad Damage' },
    desc: { en: 'Increases squad Attack power by 100% (double damage) for 10 seconds.', fr: 'Double les dégâts de toutes les attaques de l\'escouade pendant 10 secondes.' },
    effect: 'quad_damage'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'hayden', name: 'Samuel Hayden', cat: 'hacker', color: '#bdc3c7' },
    { id: 'doom_marine', name: 'UAC Marine', cat: 'marine', color: '#27ae60' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'vega_doom', name: 'VEGA', cat: 'hacker', color: '#85c1e9' },
    { id: 'night_sentinel', name: 'Night Sentinel', cat: 'slayer', color: '#d4ac0d' },
    { id: 'doom_marine_classic', name: 'Classic Doom Marine', cat: 'marine', color: '#27ae60' }
  ]);
}
