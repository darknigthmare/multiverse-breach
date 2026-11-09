// Vocaloid — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'miku',
    name: 'Hatsune Miku',
    universe: 'Vocaloid',
    category: 'hacker',
    primaryColor: '#39c5bb',
    secondaryColor: '#e0007a',
    weaponType: 'leek',
    weaponColor: '#2ecc71',
    stats: { hp: 110, atk: 12, def: 6, spd: 9 },
    simple: { name: 'Leek Slap', type: 'melee', dmg: 0.9 },
    secondary: { name: 'Soundwave Blast', type: 'sound', cd: 5, dmg: 1.5 },
    defense: { name: 'Hologram Shield', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'World is Mine Chorus', type: 'music', dmg: 4.7 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'miku_ribbon', universe: 'Vocaloid', name: { en: 'Pink Twin Hair Ribbons', fr: 'Rubans Cheveux de Miku' }, boost: { hp: 50, spd: 4 }, cost: 110 });
}

export function createEquipItemsDb2() {
  return ({ id: 'onion_sword', universe: 'Vocaloid', name: { en: 'Sharp Spring Onion', fr: 'Poireau Tranchant' }, boost: { atk: 10 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'glowstick', universe: 'Vocaloid', name: { en: 'Cyber Concert Glowstick', fr: 'Bâton Lumineux de Concert' }, boost: { def: 6 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_vocal_leek',
    name: { en: 'Giant Concert Speaker', fr: 'Haut-parleur de Concert' },
    desc: { en: 'Blasts J-Pop music that heals the squad for 80 HP and increases their Speed stat by 20% for the battle.', fr: 'Diffuse de la musique de concert : soigne l\'escouade de 80 PV et augmente la vitesse de 20%.' },
    effect: 'concert_buff'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'rin', name: 'Kagamine Rin', cat: 'tactical', color: '#f1c40f' },
    { id: 'luka', name: 'Megurine Luka', cat: 'slayer', color: '#ff7675' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'len', name: 'Kagamine Len', cat: 'slayer', color: '#f5d742' },
    { id: 'meiko', name: 'MEIKO', cat: 'marine', color: '#c0392b' },
    { id: 'kaito', name: 'KAITO', cat: 'tactical', color: '#2980b9' },
    { id: 'gumi', name: 'GUMI', cat: 'hacker', color: '#2ecc71' }
  ]);
}
