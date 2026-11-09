// Samantha Oups! — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Samantha Oups!',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Appartement Oups Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Oups Catastrophe Loop',
    title: { en: 'Samantha Oups!', fr: 'Samantha Oups!' },
    desc: { en: 'French sketch chaos turns domestic accidents, loud misunderstandings, and friendship panic into a comedy breach.', fr: 'Le chaos de sketch francais transforme accidents domestiques, malentendus bruyants et panique amicale en breche comique.' },
    hero: { id: 'samantha_oups', name: 'Samantha', cat: 'hacker', color: '#ff8fbd' },
    allies: [{ id: 'chantal_oups', name: 'Chantal', cat: 'tactical', color: '#8fd3ff' }, { id: 'voisine_oups', name: 'Voisine Oups', cat: 'horror', color: '#d6c278' }],
    monsters: ['Falling Shelf', 'Misheard Order', 'Apartment Prop Swarm'],
    bosses: ['Neighbor Complaint Wave', 'Kitchen Disaster'],
    worldBoss: 'Oups Catastrophe Loop',
    gear: [['oups_phone', 'Misunderstood Phone', 'Telephone mal compris', { spd: 2, atk: 4 }], ['oups_apron', 'Chaos Apron', 'Tablier chaos', { hp: 70 }], ['oups_keys', 'Lost Keys', 'Cles perdues', { def: 4, spd: 1 }]],
    event: ['evt_oups_confusion', 'Oups Confusion', 'Confusion Oups', 'A comedy misunderstanding scrambles enemy targeting.', 'Un malentendu comique brouille le ciblage ennemi.'],
    decor: { sky: ['#2f2130', '#070408'], floor: 'rgba(255, 143, 189, 0.15)', grid: 'rgba(143, 211, 255, 0.24)', motif: 'cinema', accent: '#8fd3ff' }
  });
}
