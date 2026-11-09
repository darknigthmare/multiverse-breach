// Zombi — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'zombi',
    universe: 'Zombi',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Matul Island Hospital Outbreak',
    boss: 'Conquistador Grave Horde',
    cast: [
      ['peter_west_zombi', 'Peter West', 'tactical'],
      ['anne_bowles_zombi', 'Anne Bowles', 'hacker'],
      ['brian_hull_zombi', 'Brian Hull', 'marine']
    ],
    enemies: ['Matul Island Zombie', 'Underwater Corpse', 'Hospital Dead'],
    bosses: ['Conquistador Zombie', 'Matul Cemetery Horde'],
    gear: [
      ['signal_flare', 'Matul Signal Flare', 'Fusee de signal Matul'],
      ['doctor_notes', 'Dr. Menard Notes', 'Notes du docteur Menard'],
      ['boat_rifle', 'Island Boat Rifle', 'Fusil du bateau']
    ],
    event: ['shark_struggle', 'Underwater Shark Struggle', 'Lutte sous-marine contre le requin', 'An underwater dead diverts the largest biological threat in a violent collision.', 'Un mort sous-marin detourne la plus grande menace biologique dans une collision violente.'],
    origin: ['A Caribbean island epidemic raises decomposing dead around Dr. Menard s hospital, old graves, and a doomed escape by sea.', 'Une epidemie insulaire caribeenne releve des morts decomposes autour de l hopital du docteur Menard, de vieilles tombes et d une fuite condamnee par la mer.'],
    breach: ['the Matul infection travels through salt water pooled beneath the portals and reaches sealed sectors without opening a door.', 'l infection de Matul voyage dans l eau salee accumulee sous les portails et atteint des secteurs scelles sans ouvrir de porte.'],
    motif: 'hauntedset',
    colors: ['#1f2418', '#030403', '#a9b06a']
  }));
}
