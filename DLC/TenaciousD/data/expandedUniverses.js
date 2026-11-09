// Tenacious D — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Tenacious D',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Pick of Destiny Riff Rift',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Rock Demon Showdown',
    title: { en: 'Tenacious D and the Pick of Destiny', fr: 'Tenacious D and the Pick of Destiny' },
    desc: { en: 'Rock mythology, absurd quests, demon riffs, and the Pick turn stage noise into weaponized resonance.', fr: 'Mythologie rock, quetes absurdes, riffs demoniaques et Mediator changent le bruit de scene en resonance armee.' },
    hero: { id: 'jb_tenacious', name: 'JB', cat: 'slayer', color: '#2c2c2c' },
    allies: [{ id: 'kg_tenacious', name: 'KG', cat: 'hacker', color: '#7d4f2a' }, { id: 'lee_tenacious', name: 'Lee Superfan', cat: 'tactical', color: '#9b8b54' }],
    monsters: ['Open Mic Heckler', 'Rock Cult Roadie', 'Demon Groupie'],
    bosses: ['Sasquatch Jam Spirit', 'Pick Guardian'],
    worldBoss: 'Rock Demon Showdown',
    gear: [['td_pick', 'Pick of Destiny Chip', 'Eclat du Mediator du Destin', { atk: 11 }], ['td_guitar', 'Acoustic Battle Guitar', 'Guitare acoustique de combat', { atk: 7, spd: 1 }], ['td_stage_pass', 'Backstage Pass', 'Pass backstage', { hp: 65, def: 3 }]],
    event: ['evt_td_master_exploder', 'Master Exploder Riff', 'Riff Master Exploder', 'A legendary riff blasts the lane and boosts music personas.', 'Un riff legendaire explose la ligne et renforce les personas musicales.'],
    decor: { sky: ['#2b0f0f', '#060101'], floor: 'rgba(190, 54, 34, 0.18)', grid: 'rgba(255, 196, 64, 0.3)', motif: 'speaker', accent: '#ffc440' }
  });
}
