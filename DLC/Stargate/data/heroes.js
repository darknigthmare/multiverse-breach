// Stargate — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'oneill',
    name: 'Jack O\'Neill',
    universe: 'Stargate',
    category: 'marine',
    primaryColor: '#1f382b',
    secondaryColor: '#c0c0c0',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 135, atk: 14, def: 8, spd: 6 },
    simple: { name: 'P90 Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Zat Blast', type: 'zap', cd: 6, dmg: 1.6 },
    defense: { name: 'Iris Block', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Stargate Wormhole', type: 'vortex', dmg: 4.8 }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'gdo_key',
    universe: 'Stargate',
    name: { en: 'SGC GDO Iris Transmitter', fr: 'Transmetteur GDO iris SGC' },
    desc: {
      fr: 'Emetteur d identification SG-1 utilise avant de franchir la Porte vers la Terre. Dans une Breche, il devient une ancre defensive: ouvrir seulement aux signatures reconnues et fermer l iris aux faux dieux.',
      en: 'SG-1 identification transmitter used before crossing the Gate back to Earth. In a Breach, it becomes a defensive anchor: open only for recognized signatures and close the iris to false gods.'
    },
    boost: { def: 9 },
    cost: 100
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'naquadah_fuel',
    universe: 'Stargate',
    name: { en: 'Naquadah Power Cell', fr: 'Cellule energetique au naquadah' },
    desc: {
      fr: 'Cellule de naquadah capable d alimenter technologies Goa uld ou dispositifs Tau ri modifies. A.R.C.A. la surveille: puissance enorme, surcharge facile, mais parfaite pour recalculer une adresse de Trame.',
      en: 'Naquadah cell able to power Goa uld technology or modified Tau ri devices. A.R.C.A. monitors it closely: huge power, easy overload, but perfect for recalculating a Thread address.'
    },
    boost: { atk: 8, hp: 40 },
    cost: 110
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'staff_weapon',
    universe: 'Stargate',
    name: { en: 'Serpent Guard Staff Focusing Tip', fr: 'Embout focaliseur de lance serpent' },
    desc: {
      fr: 'Fragment de lance Jaffa recupere sur une garde Goa uld. Son signal rappelle la difference essentielle de Stargate: une arme concue pour terroriser peut devenir outil de liberation entre les mains d un Jaffa libre.',
      en: 'Jaffa staff fragment recovered from a Goa uld guard. Its signal recalls Stargate core difference: a weapon built to terrify can become a liberation tool in the hands of a free Jaffa.'
    },
    boost: { spd: 2 },
    cost: 80
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_sg_shield',
    name: { en: 'SGC Iris Lockdown', fr: 'Verrouillage iris SGC' },
    desc: {
      en: 'Closes an SGC iris window over the breach. For a short time, hostile signatures cannot cross cleanly, Goa uld beams scatter, and the squad gains a protected fallback route.',
      fr: 'Ferme une fenetre d iris SGC sur la breche. Pendant un court instant, les signatures hostiles ne passent plus proprement, les tirs Goa uld se dispersent et l escouade gagne une route de repli protegee.'
    },
    effect: 'iris_invuln'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'tealc', name: 'Teal\'c', cat: 'slayer', color: '#d35400' },
    { id: 'sam_carter', name: 'Samantha Carter', cat: 'hacker', color: '#9b59b6' },
    { id: 'daniel_jackson', name: 'Daniel Jackson', cat: 'hacker', color: '#d9b36c' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'hammond_sgc', name: 'General Hammond', cat: 'tactical', color: '#7f8c8d' },
    { id: 'vala_mal_doran', name: 'Vala Mal Doran', cat: 'slayer', color: '#9b59b6' },
    { id: 'cam_mitchell', name: 'Cameron Mitchell', cat: 'marine', color: '#34495e' }
  ]);
}

export function createHeroOverrides() {
  return ({
    simple: { name: 'P90 SG-1 Burst', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Zat nik tel Shot', type: 'zap', cd: 6, dmg: 1.65 },
    defense: { name: 'Iris Command Lock', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Stargate Tactical Withdrawal', type: 'vortex', dmg: 4.7, color: '#6ed0ff' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'laser',
    weaponColor: '#6ed0ff',
    simple: { name: 'Naquadah Field Pulse', type: 'energy', dmg: 1.0 },
    secondary: { name: 'Chevron Recalculation', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Goa uld Shield Inversion', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Naquadah Overload Window', type: 'energy_aoe', dmg: 4.6, color: '#9b59b6' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'staff',
    weaponColor: '#d35400',
    simple: { name: 'Jaffa Staff Blast', type: 'plasma', dmg: 1.1 },
    secondary: { name: 'First Prime Charge', type: 'melee', cd: 6, dmg: 1.9 },
    defense: { name: 'Kree Guard Stance', type: 'shield', dur: 2.0, reduce: 0.82 },
    special: { name: 'Free Jaffa Uprising', type: 'plasma_aoe', dmg: 4.8, color: '#d35400' }
  });
}

export function createHeroOverrides4() {
  return ({
    weaponType: 'tablet',
    weaponColor: '#d9b36c',
    simple: { name: 'Glyph Marking Shot', type: 'bullet', dmg: 0.95 },
    secondary: { name: 'Ancient Translation Break', type: 'hack', cd: 6, dmg: 1.45 },
    defense: { name: 'Diplomatic Delay', type: 'shield', dur: 1.8, reduce: 0.74 },
    special: { name: 'Ascended Archive Flash', type: 'light_aoe', dmg: 4.3, color: '#d9b36c' }
  });
}
