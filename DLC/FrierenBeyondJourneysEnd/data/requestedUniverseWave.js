// Frieren: Beyond Journeys End — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'frieren',
    universe: 'Frieren: Beyond Journeys End',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Frieren',
    stage: 'Northern Plateau Journey',
    boss: 'Demon King Memory',
    hero: ['frieren_elf', 'Frieren', 'hacker'],
    allies: [['fern_mage', 'Fern', 'tactical'], ['stark_warrior', 'Stark', 'marine']],
    monsters: ['Dungeon Mimic', 'Demon Mage', 'Northern Plateau Monster'],
    bosses: ['Aura the Guillotine', 'Macht of El Dorado'],
    gear: [['frieren_grimoire', 'Frierens Collected Grimoire', 'Grimoire collectionne de Frieren', { atk: 9, def: 5 }], ['fern_staff', 'Ferns Staff', 'Baton de Fern', { atk: 10, spd: 1 }], ['stark_axe', 'Starks Great Axe', 'Grande hache de Stark', { atk: 11, hp: 45 }]],
    event: ['evt_zoltraak', 'Zoltraak Barrage', 'Barrage de Zoltraak', 'Frieren and Fern use ordinary modern magic with exceptional concealment, timing, and efficiency.', 'Frieren et Fern emploient une magie moderne ordinaire avec une dissimulation, un timing et une efficacite exceptionnels.' ],
    theme: 'post-quest remembrance, patient magic study, demon deception, and the long northern road to Aureole',
    desc: { en: 'The journey measures decades, memories, mana concealment, and small spells rather than constant escalation.', fr: 'Le voyage se mesure en decennies, souvenirs, dissimulation de mana et petits sorts plutot qu en escalade constante.' },
    motif: 'wasteland',
    colors: ['#24324a', '#05070a', '#bfa6ff'],
    stageVariants: [['Tactics', 'First-Class Mage Exam Ruins', 'Hard', 'Aura the Guillotine'], ['Smash', 'El Dorado Golden Domain', 'Very Hard', 'Macht of El Dorado']]
  });
}
