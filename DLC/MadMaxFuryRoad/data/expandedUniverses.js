// Mad Max: Fury Road — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'mad_max_fury_road',
    universe: 'Mad Max: Fury Road',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Mad Max: Fury Road',
    stage: 'Fury Road War Rig Pursuit',
    boss: 'Immortan Joe Citadel Convoy',
    cast: [
      ['max_rockatansky_fr', 'Max Rockatansky', 'slayer'],
      ['furiosa_fr', 'Imperator Furiosa', 'tactical'],
      ['nux_fr', 'Nux', 'marine']
    ],
    enemies: ['War Boy', 'Polecat Raider', 'Bullet Farmer Gunner'],
    bosses: ['Rictus Erectus', 'Immortan Joe'],
    gear: [
      ['interceptor_wheel', 'Interceptor Steering Wheel', 'Volant de l Interceptor'],
      ['war_rig_harpoon', 'War Rig Harpoon', 'Harpon du War Rig'],
      ['green_seed', 'Green Place Seed Bag', 'Sac de graines du Lieu Vert']
    ],
    event: ['turn_around', 'Furiosa Turnaround', 'Demi-tour de Furiosa', 'The War Rig reverses the entire chase, crushing pursuers and opening the Citadel route.', 'Le War Rig inverse toute la poursuite, ecrase les poursuivants et ouvre la route de la Citadelle.'],
    origin: ['Furiosa, Max, and escaped captives cross the wasteland in a War Rig while Immortan Joe sends every war party after them.', 'Furiosa, Max et les captives en fuite traversent le desert en War Rig tandis qu Immortan Joe lance toutes ses bandes a leur poursuite.'],
    breach: ['portal fuel makes convoys effectively endless, so Furiosa chooses to seize the Nexus Citadel rather than keep fleeing through new wastelands.', 'le carburant de portail rend les convois presque infinis, et Furiosa choisit de prendre la Citadelle du Nexus plutot que de fuir de desert en desert.'],
    motif: 'wasteland',
    colors: ['#3a2112', '#070301', '#e27a2f']
  }));
}
