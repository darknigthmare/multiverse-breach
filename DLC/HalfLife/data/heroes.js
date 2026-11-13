// Half-Life — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'freeman',
    name: 'Gordon Freeman',
    universe: 'Half-Life',
    incarnation: 'Half-Life 2 (2004) - HEV Mark V / Citadel',
    referenceUrl: 'https://www.half-life.com/en/halflife2',
    visualAnchor: 'Half-Life 2 Gordon Freeman: brown hair, beard, rectangular glasses, orange and gray HEV Mark V suit, crowbar and zero-point energy field manipulator. No HEV Mark IV, long-jump module or gluon gun from Half-Life (1998).',
    canonStatus: 'source-locked-gameplay-adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Crowbar', 'HEV Mark V suit', 'Gravity Gun'],
    category: 'hacker',
    primaryColor: '#e65c00',
    secondaryColor: '#4f5d73',
    weaponType: 'crowbar',
    weaponColor: '#8b0000',
    stats: { hp: 145, atk: 15, def: 11, spd: 5 },
    simple: { name: 'Crowbar Whack', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Blast', type: 'gravity', cd: 6, dmg: 1.7 },
    defense: { name: 'HEV Shield Charge', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Overcharged Gravity Gun', type: 'beam', dmg: 4.7, color: '#33ccff' }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'hev_battery',
    universe: 'Half-Life',
    name: { en: 'HEV Auxiliary Battery', fr: 'Batterie auxiliaire HEV' },
    desc: {
      fr: 'Module energetique de combinaison Hazardous Environment. Dans une Breche, il restaure la logique Half-Life du bouclier numerique, des alertes vocales et de la survie scientifique sous incident dimensionnel.',
      en: 'Hazardous Environment suit power module. In a Breach, it restores Half-Life logic: digital armor, suit warnings, and scientific survival during a dimensional incident.'
    },
    boost: { hp: 80, def: 5 },
    cost: 90
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'snark_cage',
    universe: 'Half-Life',
    name: { en: 'Xen Snark Containment Cage', fr: 'Cage de confinement snark Xen' },
    desc: {
      fr: 'Cage de laboratoire contenant des snarks de Xen. A.R.C.A. l emploie comme ancre offensive instable: courte fenetre de chaos biologique, morsures rapides et pression sur les lignes Combine.',
      en: 'Laboratory cage containing Xen snarks. A.R.C.A. uses it as an unstable offensive anchor: short biological chaos window, fast bites, and pressure against Combine lines.'
    },
    boost: { atk: 9 },
    cost: 100
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'longjump_mod',
    universe: 'Half-Life',
    name: { en: 'HEV Long Jump Module', fr: 'Module de saut long HEV' },
    desc: {
      fr: 'Module de mobilite Black Mesa concu pour traverser les espaces hostiles de Xen. Dans Multiverse Breach, il sert a franchir une rupture, quitter une case menacee ou transformer une fuite en repositionnement tactique.',
      en: 'Black Mesa mobility module designed to cross hostile Xen spaces. In Multiverse Breach, it crosses ruptures, exits threatened tiles, or turns retreat into tactical repositioning.'
    },
    boost: { spd: 3 },
    cost: 120
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_hl_snarks',
    name: { en: 'Xen Snark Release Case', fr: 'Boite de liberation snark Xen' },
    desc: {
      en: 'Opens a controlled Xen containment case. Snarks flood the breach for a short window, harassing Combine or alien targets while the HEV signal marks a safe fallback route.',
      fr: 'Ouvre une caisse de confinement Xen sous controle. Des snarks envahissent brievement la breche, harcelent les cibles Combine ou aliennes pendant que le signal HEV marque une route de repli sure.'
    },
    effect: 'spawn_snarks'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'barney', name: 'Barney Calhoun', cat: 'tactical', color: '#3498db' },
    { id: 'shephard', name: 'Adrian Shephard', cat: 'marine', color: '#7f8c8d' },
    { id: 'alyx_vance', name: 'Alyx Vance', cat: 'hacker', color: '#8e6f4e' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'eli_vance', name: 'Eli Vance', cat: 'hacker', color: '#6e4f39' },
    { id: 'kleiner', name: 'Dr. Kleiner', cat: 'hacker', color: '#bdc3c7' },
    { id: 'vortigaunt_ally', name: 'Vortigaunt Ally', cat: 'hacker', color: '#6f8f4f' },
    { id: 'dog_hl2', name: 'Dog', cat: 'marine', color: '#95a5a6' }
  ]);
}

export function createHeroOverrides() {
  return ({
    simple: { name: 'Crowbar Vector', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Punt', type: 'gravity', cd: 6, dmg: 1.8 },
    defense: { name: 'HEV Aux Power', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Overcharged Gravity Gun', type: 'beam', dmg: 4.8, color: '#33ccff' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#1f2d36',
    simple: { name: 'Black Mesa 9mm Cover', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Resistance Crossfire', type: 'bullet', cd: 7, dmg: 1.7 },
    defense: { name: 'Security Door Hold', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'City 17 Evac Route', type: 'support_aoe', dmg: 4.1, color: '#3498db' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'gun',
    weaponColor: '#2f3b32',
    simple: { name: 'HECU Rifle Burst', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Pipe Wrench Breach', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Marine Cover Order', type: 'shield', dur: 2.1, reduce: 0.78 },
    special: { name: 'Race X Suppression', type: 'explosive_aoe', dmg: 4.6, color: '#7f8c8d' }
  });
}

export function createHeroOverrides4() {
  return ({
    weaponType: 'gun',
    weaponColor: '#3a2c25',
    simple: { name: 'Resistance Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Combine Lock Hack', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Gravity Glove Pull', type: 'dodge', dur: 1.9, reduce: 0.8 },
    special: { name: 'Dog Breach Assist', type: 'summon_aoe', dmg: 4.5, color: '#8e6f4e' }
  });
}
