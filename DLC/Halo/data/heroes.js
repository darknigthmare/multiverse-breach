// Halo — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'masterchief',
    name: 'Master Chief',
    universe: 'Halo',
    category: 'marine',
    primaryColor: '#2e5c1e',
    secondaryColor: '#ff9900',
    weaponType: 'gun',
    weaponColor: '#1c1c1c',
    stats: { hp: 150, atk: 16, def: 10, spd: 5 },
    simple: { name: 'Assault Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Plasma Grenade', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Bubble Shield', type: 'shield', dur: 3.0, reduce: 0.9 },
    special: { name: 'Spartan Laser', type: 'beam', dmg: 4.5, color: '#ff3333' }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'mjolnir_shield',
    universe: 'Halo',
    name: { en: 'MJOLNIR Mk VI Shield Lattice', fr: 'Maille de bouclier MJOLNIR Mk VI' },
    desc: {
      fr: 'Fragment de sous-systeme energetique inspire de l armure MJOLNIR du Spartan-II: il ne rend pas invincible, il restaure la logique Halo du bouclier rechargeable et de l avancee sous feu controle.',
      en: 'Energy subsystem fragment inspired by Spartan-II MJOLNIR armor: it does not make the wearer invincible, it restores Halo logic of rechargeable shielding and controlled advance under fire.'
    },
    boost: { hp: 50, def: 8 },
    cost: 100
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'cortana_chip',
    universe: 'Halo',
    name: { en: 'Cortana Matrix Shard', fr: 'Eclat de matrice Cortana' },
    desc: {
      fr: 'Eclat de donnees tactiques sauve d une interface UNSC/Forerunner. A.R.C.A. l utilise comme aide de ciblage: prediction de trajectoire, lecture Covenant et verrouillage de noyau de faille.',
      en: 'Tactical data shard saved from a UNSC/Forerunner interface. A.R.C.A. uses it as targeting support: trajectory prediction, Covenant pattern reading, and rift-core lock.'
    },
    boost: { atk: 10 },
    cost: 120
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'magnum_ammo',
    universe: 'Halo',
    name: { en: 'M6D AP Magazine', fr: 'Chargeur perforant M6D' },
    desc: {
      fr: 'Chargeur calibre 12.7mm associe au magnum M6D de l ere Installation 04. Dans une faille, chaque tir sert de repere UNSC: court, net, fiable quand la Trame brouille les armes lourdes.',
      en: '12.7mm magazine tied to the M6D magnum from the Installation 04 era. In a rift, each shot acts as a UNSC anchor: short, clean, reliable when the Thread scrambles heavy weapons.'
    },
    boost: { spd: 2 },
    cost: 90
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_halo_warthog',
    name: { en: 'M12 Warthog LZ Beacon', fr: 'Balise LZ Warthog M12' },
    desc: {
      en: 'Marks a temporary UNSC landing lane. A remote M12 Warthog crosses the breach, suppresses Covenant infantry, knocks back light targets, and briefly opens an extraction corridor.',
      fr: 'Marque une ligne d atterrissage UNSC temporaire. Un Warthog M12 traverse la breche, cloue l infanterie Covenant, repousse les cibles legeres et ouvre brievement un couloir d extraction.'
    },
    effect: 'warthog_run'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'arbiter', name: 'The Arbiter', cat: 'slayer', color: '#95a5a6' },
    { id: 'johnson', name: 'Sgt. Avery Johnson', cat: 'tactical', color: '#27ae60' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'cortana', name: 'Cortana', cat: 'hacker', color: '#4dd2ff' },
    { id: 'noble_six', name: 'Noble Six', cat: 'marine', color: '#566573' },
    { id: 'buck_odst', name: 'Edward Buck', cat: 'tactical', color: '#34495e' },
    { id: 'kelly_087', name: 'Kelly-087', cat: 'slayer', color: '#1f7a3f' },
    { id: 'linda_058', name: 'Linda-058', cat: 'tactical', color: '#255f3f' }
  ]);
}
