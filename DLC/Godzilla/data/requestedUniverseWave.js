// Godzilla — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'godzilla_showa_millennium_legendary',
    universe: 'Godzilla',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Expert',
    titleFr: 'Godzilla',
    stage: 'Tokyo Kaiju Cataclysm',
    boss: 'Destoroyah Oxygen Destroyer',
    hero: ['godzilla_1954', 'Original Godzilla 1954', 'marine'],
    allies: [['godzilla_millennium', 'Godzilla Millennium', 'slayer'], ['legendary_godzilla', 'Legendary Godzilla', 'marine']],
    monsters: ['JSDF Maser Tank Line', 'MutO Breach Parasite', 'Xilien Control Drone'],
    bosses: ['Shin Godzilla Evolution', 'Biollante Rose Beast'],
    worldBoss: 'Destoroyah Oxygen Destroyer',
    gear: [['oxygen_destroyer_trace', 'Oxygen Destroyer Trace', 'Trace d Oxygen Destroyer', { atk: 12, def: 3 }], ['g_cell_sample', 'G-Cell Sample', 'Echantillon de cellules G', { hp: 95, atk: 5 }], ['maser_battery_pack', 'Maser Battery Pack', 'Batterie Maser', { atk: 8, spd: 2 }]],
    event: ['evt_atomic_breath_chain', 'Atomic Breath Chain', 'Chaine de souffle atomique', 'Godzilla channels one atomic breath line while allies evacuate breach civilians and hold anti-kaiju fire lanes.', 'Godzilla canalise une ligne de souffle atomique pendant que les allies evacuents les civils de breche et tiennent les couloirs anti-kaiju.'],
    theme: 'Godzilla eras kept distinct: 1954 nuclear horror, Millennium aggression, Legendary alpha presence, Shin mutation, Biollante G-cells, and Destoroyah born from the Oxygen Destroyer',
    desc: { en: 'The kaiju roster keeps each continuity as a readable combat identity instead of reducing every Godzilla form to one generic monster.', fr: 'Le roster kaiju garde chaque continuite comme identite de combat lisible au lieu de reduire toutes les formes de Godzilla a un monstre generique.' },
    motif: 'wasteland',
    colors: ['#142126', '#020405', '#63e6ff'],
    stageVariants: [['Tactics', 'Shin Godzilla Evacuation Grid', 'Expert', 'Shin Godzilla Evolution'], ['RPG', 'Biollante Lake Ashinoko Bloom', 'Very Hard', 'Biollante Rose Beast']]
  });
}
