// Insidious — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'insidious',
    universe: 'Insidious',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'The Further Red Door',
    boss: 'Lipstick-Face Demon Lair',
    cast: [
      ['josh_lambert', 'Josh Lambert', 'horror'],
      ['elise_rainier', 'Elise Rainier', 'hacker'],
      ['renai_lambert', 'Renai Lambert', 'tactical']
    ],
    enemies: ['Further Shade', 'Long-Haired Fiend', 'KeyFace Captive'],
    bosses: ['Bride in Black', 'Lipstick-Face Demon'],
    gear: [
      ['gas_lantern', 'Further Gas Lantern', 'Lanterne a gaz du Lointain'],
      ['dice', 'Elise s Loaded Dice', 'Des charges d Elise'],
      ['red_door_key', 'Red Door Key', 'Cle de la porte rouge']
    ],
    event: ['astral_tether', 'Astral Tether Recall', 'Rappel du lien astral', 'Elise follows the silver tether and pulls every displaced ally out of the Further.', 'Elise suit le lien d argent et ramene chaque allie deplace hors du Lointain.'],
    origin: ['The Lambert family and Elise Rainier confront astral projection, possessed bodies, and entities waiting in the Further.', 'La famille Lambert et Elise Rainier affrontent projection astrale, corps possedes et entites qui attendent dans le Lointain.'],
    breach: ['the Further lies between portals and begins intercepting heroes during loading transitions, so A.R.C.A. must anchor both body and spirit.', 'le Lointain se trouve entre les portails et intercepte les heros pendant les transitions, obligeant A.R.C.A. a ancrer corps et esprit.'],
    motif: 'hauntedset',
    colors: ['#220d0d', '#040101', '#bf302b']
  }));
}
