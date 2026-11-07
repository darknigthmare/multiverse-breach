// Ash vs Evil Dead — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'ash_vs_evil_dead',
    universe: 'Ash vs Evil Dead',
    mediaType: 'series',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'Elk Grove Deadite Festival',
    boss: 'Kandar the Destroyer',
    cast: [
      ['ash_williams_aveds', 'Ash Williams', 'slayer'],
      ['pablo_bolivar_aveds', 'Pablo Simon Bolivar', 'hacker'],
      ['kelly_maxwell_aveds', 'Kelly Maxwell', 'tactical']
    ],
    enemies: ['Elk Grove Deadite', 'Kandarian Spawn', 'Demonic Delta'],
    bosses: ['Ruby Knowby', 'Baal'],
    gear: [
      ['boomstick', 'Ash s Boomstick', 'Boomstick d Ash'],
      ['chainsaw_hand', 'Chainsaw Hand', 'Main tronconneuse'],
      ['pablo_talisman', 'El Brujo Talisman', 'Talisman d El Brujo']
    ],
    event: ['delta', 'Delta 88 Deadite Run', 'Charge Deadite de la Delta 88', 'The Delta smashes through the horde while Pablo seals the trail and Kelly covers the exit.', 'La Delta traverse la horde pendant que Pablo scelle la trace et que Kelly couvre la sortie.'],
    origin: ['Decades after the cabin, Ash accidentally unleashes the Kandarian evil again and fights beside Pablo, Kelly, and the complicated Ruby.', 'Des decennies apres la cabane, Ash libere encore le mal kandarien et combat avec Pablo, Kelly et l ambigue Ruby.'],
    breach: ['the Necronomicon mistakes A.R.C.A. records for blank pages and begins writing Deadite futures directly into mission logs.', 'le Necronomicon prend les rapports A.R.C.A. pour des pages vierges et ecrit des futurs Deadites directement dans les journaux de mission.'],
    motif: 'hauntedset',
    colors: ['#22110d', '#040201', '#e34a2d']
  }));
}
