// Dino Crisis — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'regina',
    name: 'Regina',
    universe: 'Dino Crisis',
    category: 'horror',
    primaryColor: '#a52a2a',
    secondaryColor: '#1a1a1a',
    weaponType: 'gun',
    weaponColor: '#696969',
    stats: { hp: 125, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Glock Fire', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Grenade Dart', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Evasive Backflip', type: 'dodge', dur: 1.8, reduce: 0.8 },
    special: { name: 'T-Rex Breach Bite', type: 'dino', dmg: 4.9 }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'plug_tool',
    universe: 'Dino Crisis',
    name: { en: 'Ibis Island Key Plug', fr: 'Prise de cle Ibis Island' },
    desc: {
      fr: 'Module de securite des laboratoires Third Energy. En gameplay, il represente les routes verrouillees de Dino Crisis: ouvrir la bonne porte au bon moment vaut parfois plus qu un tir.',
      en: 'Security module from Third Energy laboratories. In gameplay, it represents Dino Crisis locked routes: opening the right door at the right time can matter more than a shot.'
    },
    boost: { def: 6, spd: 2 },
    cost: 90
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'hemo_pack',
    universe: 'Dino Crisis',
    name: { en: 'Hemostatic Field Patch', fr: 'Patch hemostatique de terrain' },
    desc: {
      fr: 'Soin d urgence pour morsures et griffures profondes. A.R.C.A. le classe comme ressource de survie rapide, coherente avec les poursuites de raptors et les replis sous alarme.',
      en: 'Emergency treatment for deep bites and claw wounds. A.R.C.A. classifies it as a fast survival resource, coherent with raptor chases and alarmed retreats.'
    },
    boost: { hp: 80 },
    cost: 80
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'sl_carbine',
    universe: 'Dino Crisis',
    name: { en: 'SORT Carbine Stabilizer', fr: 'Stabilisateur carabine SORT' },
    desc: {
      fr: 'Piece d arme adaptee aux engagements courts contre specimens rapides. Elle transforme le tir mobile de Regina et Dylan en controle de couloir anti-raptor.',
      en: 'Weapon part adapted for short engagements against fast specimens. It turns Regina and Dylan mobile fire into anti-raptor corridor control.'
    },
    boost: { atk: 10 },
    cost: 110
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_dc_lure',
    name: { en: 'Third Energy Pheromone Lure', fr: 'Leurre pheromone Third Energy' },
    desc: {
      en: 'Projects a controlled prehistoric scent through a Third Energy pulse. Raptors rush the enemy line, tear open exposed targets, then the SORT beacon cuts the signal before the pack turns on the squad.',
      fr: 'Projette une piste prehistorique controlee via une impulsion Third Energy. Des raptors chargent la ligne ennemie, ouvrent les cibles exposees, puis la balise SORT coupe le signal avant que la meute ne se retourne contre l escouade.'
    },
    effect: 'raptor_stampede'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'dylan', name: 'Dylan Morton', cat: 'tactical', color: '#27ae60' },
    { id: 'rick_dc', name: 'Rick', cat: 'hacker', color: '#e74c3c' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'gail_dc', name: 'Gail', cat: 'marine', color: '#34495e' },
    { id: 'paula_dc2', name: 'Paula', cat: 'slayer', color: '#d35400' },
    { id: 'dr_kirk', name: 'Dr. Kirk', cat: 'hacker', color: '#7f8c8d' },
    { id: 'david_dc2', name: 'David Fork', cat: 'tactical', color: '#3d7a4b' }
  ]);
}

export function createHeroOverrides() {
  return ({
    weaponType: 'gun',
    weaponColor: '#2a2a2a',
    simple: { name: 'SORT Glock Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Tranquilizer Dart', type: 'projectile', cd: 6, dmg: 1.55 },
    defense: { name: 'Key Card Reposition', type: 'dodge', dur: 1.9, reduce: 0.8 },
    special: { name: 'Third Energy Extraction', type: 'temporal_aoe', dmg: 4.6, color: '#ff6b56' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#24412f',
    simple: { name: 'TRAT Rifle Cover', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Shotgun Raptor Stop', type: 'shotgun', cd: 6, dmg: 1.8 },
    defense: { name: 'Survivor Escort Guard', type: 'shield', dur: 2.0, reduce: 0.78 },
    special: { name: 'Edward City Heavy Line', type: 'explosive_aoe', dmg: 4.7, color: '#27ae60' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'terminal',
    weaponColor: '#e74c3c',
    simple: { name: 'Security Terminal Zap', type: 'hack', dmg: 0.95 },
    secondary: { name: 'Door Lockout Trap', type: 'trap', cd: 6, dmg: 1.45 },
    defense: { name: 'SORT System Bypass', type: 'shield', dur: 1.8, reduce: 0.76 },
    special: { name: 'Third Energy Shutdown', type: 'hack_aoe', dmg: 4.25, color: '#e74c3c' }
  });
}
