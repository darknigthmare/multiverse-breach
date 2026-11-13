// Evolution — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Evolution',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Arizona Meteor Lab',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Rapid Evolution Colony',
    title: { en: 'Evolution', fr: 'Evolution' },
    desc: {
      en: 'A meteor-borne alien ecosystem evolves at impossible speed, turning science, shampoo, and panic into weapons.',
      fr: 'Un ecosysteme alien venu d une meteorite evolue a vitesse impossible entre science, shampooing et panique.'
    },
    hero: { id: 'ira_kane', name: 'Ira Kane', cat: 'hacker', color: '#6ab04c' },
    allies: [
      { id: 'harry_block', name: 'Harry Block', cat: 'tactical', color: '#3498db' },
      { id: 'wayne_green', name: 'Wayne Grey', cat: 'marine', color: '#e67e22' }
    ],
    monsters: ['Flatworm Specimen', 'Flying Alien Drake', 'Cave Primate Mutant'],
    bosses: ['Selenium Burst Nest', 'Giant Amoeba Growth'],
    worldBoss: 'Rapid Evolution Colony',
    gear: [
      ['evo_selenium_shampoo', 'Selenium Shampoo', 'Shampooing selenium', { atk: 10 }],
      ['evo_meteor_chip', 'Meteorite Core Chip', 'Fragment meteorite', { hp: 65, def: 4 }],
      ['evo_lab_spray', 'Lab Decon Sprayer', 'Pulverisateur decontamination', { def: 6, spd: 1 }]
    ],
    event: ['evt_evo_selenium', 'Selenium Cascade', 'Cascade de selenium', 'A selenium burst burns alien cells and cleanses the squad.', 'Une vague de selenium brule les cellules aliens et purifie l escouade.'],
    decor: { sky: ['#2b4631', '#050904'], floor: 'rgba(116, 170, 76, 0.16)', grid: 'rgba(106, 176, 76, 0.32)', motif: 'facility', accent: '#6ab04c' }
  });
}
