// The Mummy — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'the_mummy',
    universe: 'The Mummy',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'La Momie',
    stage: 'Hamunaptra City of the Dead',
    boss: 'Imhotep Ten Plagues Ritual',
    cast: [
      ['rick_oconnell_mummy', 'Rick O Connell', 'slayer'],
      ['evelyn_carnahan_mummy', 'Evelyn Carnahan', 'hacker'],
      ['ardeth_bay_mummy', 'Ardeth Bay', 'tactical']
    ],
    enemies: ['Mummified Priest', 'Scarab Swarm', 'Anubis Warrior'],
    bosses: ['The Scorpion King', 'Imhotep'],
    gear: [
      ['amun_ra', 'Book of Amun-Ra', 'Livre d Amon-Ra'],
      ['book_dead', 'Book of the Dead', 'Livre des Morts'],
      ['key', 'Hamunaptra Puzzle Key', 'Cle-puzzle d Hamunaptra']
    ],
    event: ['plagues', 'Ten Plagues Reversal', 'Renversement des dix plaies', 'Evelyn reads the counter-rite while Rick and Ardeth hold the ritual circle.', 'Evelyn lit le contre-rite tandis que Rick et Ardeth tiennent le cercle rituel.'],
    origin: ['Rick, Evelyn, and Ardeth confront resurrected priest Imhotep, cursed books, Hamunaptra, and ancient armies.', 'Rick, Evelyn et Ardeth affrontent le pretre ressuscite Imhotep, des livres maudits, Hamunaptra et des armees antiques.'],
    breach: ['the Book of the Dead reads erased universes as names awaiting resurrection, while the Book of Amun-Ra can return only one Trame at a time.', 'le Livre des Morts lit les univers effaces comme des noms a ressusciter, tandis que le Livre d Amon-Ra ne peut ramener qu une Trame a la fois.'],
    motif: 'castle',
    colors: ['#332716', '#070503', '#d9a547']
  }));
}
