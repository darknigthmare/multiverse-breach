// Day of the Dead — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'day_of_the_dead',
    universe: 'Day of the Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Florida Underground Bunker',
    boss: 'Captain Rhodes Bunker Collapse',
    cast: [
      ['sarah_bowman_dotd', 'Sarah Bowman', 'hacker'],
      ['john_dotd', 'John', 'marine'],
      ['bill_mcdemott_dotd', 'Bill McDermott', 'tactical']
    ],
    enemies: ['Bunker Zombie', 'Mine Shaft Horde', 'Laboratory Specimen'],
    bosses: ['Captain Rhodes', 'Bunker Horde'],
    gear: [
      ['bub_headphones', 'Bub s Headphones', 'Casque de Bub'],
      ['lab_recorder', 'Logan Research Recorder', 'Enregistreur de recherche de Logan'],
      ['flare', 'Mine Shaft Flare', 'Fusee de puits de mine']
    ],
    event: ['bub_salute', 'Bub Recognition Protocol', 'Protocole de reconnaissance de Bub', 'Bub draws the dead away from living allies and disrupts the bunker command chain.', 'Bub detourne les morts des allies vivants et brise la chaine de commandement du bunker.'],
    origin: ['Scientists and soldiers fracture inside an underground bunker while the dead dominate the surface and Bub begins to remember.', 'Scientifiques et soldats se divisent dans un bunker souterrain tandis que les morts dominent la surface et que Bub commence a se souvenir.'],
    breach: ['A.R.C.A. discovers that retained zombie memory can anchor a Trame, but Rhodes tries to weaponize every sentient trace.', 'A.R.C.A. decouvre que la memoire residuelle des zombies peut ancrer une Trame, mais Rhodes tente de militariser chaque trace consciente.'],
    motif: 'facility',
    colors: ['#241a13', '#040302', '#d98b45']
  }));
}
