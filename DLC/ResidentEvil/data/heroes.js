// Resident Evil — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'leon',
    name: 'Leon S. Kennedy',
    universe: 'Resident Evil',
    category: 'horror',
    primaryColor: '#1d2a44',
    secondaryColor: '#b0c4de',
    weaponType: 'gun',
    weaponColor: '#000000',
    stats: { hp: 130, atk: 13, def: 8, spd: 6 },
    simple: { name: 'Matilda Handgun', type: 'bullet', dmg: 0.9 },
    secondary: { name: 'Shotgun Blast', type: 'shotgun', cd: 6, dmg: 1.6 },
    defense: { name: 'Combat Roll', type: 'dodge', dur: 1.5, reduce: 0.8 },
    special: { name: 'RPG-7 Rocket', type: 'rocket', dmg: 5.2 }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'green_herb',
    universe: 'Resident Evil',
    name: { en: 'Green Herb First-Aid Mix', fr: 'Melange de premiers soins herbe verte' },
    desc: {
      fr: 'Plante medicale iconique des zones de survie Resident Evil. A.R.C.A. la traite comme une ancre de soin: elle rappelle la logique des ressources rares, du soin manuel et de la survie entre deux couloirs infectes.',
      en: 'Iconic medical plant from Resident Evil survival zones. A.R.C.A. treats it as a healing anchor: it restores the logic of scarce resources, manual recovery, and survival between infected corridors.'
    },
    boost: { hp: 100 },
    cost: 80
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'stars_badge',
    universe: 'Resident Evil',
    name: { en: 'S.T.A.R.S. Field Badge', fr: 'Insigne de terrain S.T.A.R.S.' },
    desc: {
      fr: 'Insigne lie aux equipes Special Tactics And Rescue Service de Raccoon City. Dans la Breche, il renforce les protocoles de fouille, de couverture et de protection des survivants face aux B.O.W.',
      en: 'Badge tied to Raccoon City Special Tactics And Rescue Service teams. In the Breach, it reinforces search, cover, and survivor-protection protocols against B.O.W. threats.'
    },
    boost: { def: 8 },
    cost: 100
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'laser_sight',
    universe: 'Resident Evil',
    name: { en: 'R.P.D. Custom Laser Sight', fr: 'Viseur laser custom R.P.D.' },
    desc: {
      fr: 'Module de precision adapte aux armes de poing de crise. Il transforme chaque munition en decision: viser le point faible, economiser les chargeurs et stopper une mutation avant qu elle ne franchisse la porte.',
      en: 'Precision module adapted for crisis sidearms. It turns every bullet into a decision: aim for the weak point, conserve magazines, and stop a mutation before it crosses the door.'
    },
    boost: { atk: 9 },
    cost: 110
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_re_cure',
    name: { en: 'Anti-Viral Vaccine Case', fr: 'Mallette vaccin antiviral' },
    desc: {
      en: 'Deploys an emergency anti-viral kit derived from Raccoon City crisis protocols. It stabilizes the squad, slows infection logic, and denies Umbrella-style specimen conversion for a short window.',
      fr: 'Deploie un kit antiviral d urgence derive des protocoles de crise de Raccoon City. Il stabilise l escouade, ralentit la logique d infection et refuse la conversion des allies en specimens Umbrella pendant une courte fenetre.'
    },
    effect: 'heal_squad'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'jill', name: 'Jill Valentine', cat: 'tactical', color: '#2980b9' },
    { id: 'wesker', name: 'Albert Wesker', cat: 'slayer', color: '#2c3e50' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'chris_redfield', name: 'Chris Redfield', cat: 'marine', color: '#2e4053' },
    { id: 'claire_redfield', name: 'Claire Redfield', cat: 'tactical', color: '#b03a2e' },
    { id: 'ada_wong', name: 'Ada Wong', cat: 'hacker', color: '#c0392b' },
    { id: 'rebecca_chambers', name: 'Rebecca Chambers', cat: 'hacker', color: '#27ae60' },
    { id: 'barry_burton', name: 'Barry Burton', cat: 'marine', color: '#7f8c8d' },
    { id: 'carlos_oliveira', name: 'Carlos Oliveira', cat: 'marine', color: '#34495e' }
  ]);
}

export function createHeroOverrides() {
  return ({
    weaponType: 'gun',
    weaponColor: '#1b1f2a',
    simple: { name: 'S.T.A.R.S. Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Lockpick Counterroute', type: 'tactical', cd: 7, dmg: 1.5 },
    defense: { name: 'Last Escape Dodge', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Anti-Nemesis Mine Line', type: 'trap_aoe', dmg: 4.4, color: '#79d0ff' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#050505',
    simple: { name: 'Samurai Edge Precision', type: 'bullet', dmg: 1.15 },
    secondary: { name: 'Uroboros Dash', type: 'melee', cd: 6, dmg: 2.0 },
    defense: { name: 'Viral Reflex Step', type: 'dodge', dur: 1.8, reduce: 0.88 },
    special: { name: 'Uroboros Selection Burst', type: 'dark_aoe', dmg: 4.9, color: '#d7f26b' }
  });
}
