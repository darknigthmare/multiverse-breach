// Les Visiteurs du Futur — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Les Visiteurs du Futur',
    mediaType: 'series',
    faction: 'sciFi',
    stageName: 'Temporal Brigade Breach',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Time Paradox Reactor',
    title: { en: 'The Visitors from the Future', fr: 'Les Visiteurs du Futur' },
    desc: { en: 'French temporal chaos turns apocalypse prevention, paradoxes, and bricolage sci-fi into a breach.', fr: 'Le chaos temporel francais transforme prevention d apocalypse, paradoxes et SF bricolee en breche.' },
    hero: { id: 'visiteur_futur', name: 'Le Visiteur', cat: 'hacker', color: '#4aa3df' },
    allies: [{ id: 'raph_visiteur', name: 'Raph', cat: 'tactical', color: '#657786' }, { id: 'constance_visiteur', name: 'Constance', cat: 'marine', color: '#b0835a' }],
    monsters: ['Temporal Cop', 'Paradox Duplicate', 'Future Ruin Drone'],
    bosses: ['Missionnaires Cell', 'Brigade Temporelle Lock'],
    worldBoss: 'Time Paradox Reactor',
    gear: [['vdf_beacon', 'Temporal Beacon', 'Balise temporelle', { spd: 2, atk: 4 }], ['vdf_coat', 'Visitor Coat', 'Manteau du Visiteur', { def: 5, hp: 55 }], ['vdf_paradox_note', 'Paradox Note', 'Note paradoxe', { atk: 7 }]],
    event: ['evt_vdf_reset', 'Timeline Correction', 'Correction temporelle', 'A future warning rewinds the last enemy buff.', 'Un avertissement du futur rembobine le dernier buff ennemi.'],
    decor: { sky: ['#152532', '#030609'], floor: 'rgba(78, 140, 180, 0.16)', grid: 'rgba(85, 220, 255, 0.26)', motif: 'code', accent: '#55dcff' }
  });
}
