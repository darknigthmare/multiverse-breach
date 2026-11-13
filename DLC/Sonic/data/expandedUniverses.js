// Sonic — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'sonic',
    universe: 'Sonic',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Green Hill Death Egg Run',
    boss: 'Eggman Death Egg Robot',
    cast: [
      ['sonic_hedgehog', 'Sonic', 'slayer'],
      ['miles_tails_prower', 'Miles Tails Prower', 'hacker'],
      ['knuckles_echidna', 'Knuckles', 'marine']
    ],
    enemies: ['Moto Bug', 'Egg Pawn', 'E-100 Robot'],
    bosses: ['Metal Sonic', 'Dr. Eggman'],
    gear: [
      ['speed_shoes', 'Speed Shoes', 'Chaussures de vitesse'],
      ['chaos_emerald', 'Chaos Emerald', 'Emeraude du Chaos'],
      ['power_ring', 'Power Ring', 'Anneau de puissance']
    ],
    event: ['super_sonic', 'Super Sonic Chaos Rush', 'Charge Chaos de Super Sonic', 'Seven emeralds transform Sonic and turn portal turbulence into a screen-crossing strike.', 'Sept emeraudes transforment Sonic et convertissent la turbulence du portail en frappe traversant tout l ecran.'],
    origin: ['Sonic and his friends defend their world s freedom and Chaos Emeralds from Eggman s machines and reality-scale schemes.', 'Sonic et ses amis defendent la liberte de leur monde et les Emeraudes du Chaos contre les machines et projets d Eggman.'],
    breach: ['rings begin forming stable micro-portals, and Eggman chains them into a Death Egg route through every unlocked universe.', 'les anneaux deviennent des micro-portails stables, et Eggman les relie en route Death Egg a travers chaque univers debloque.'],
    motif: 'arcanecity',
    colors: ['#12365c', '#02070b', '#f2d83e']
  }));
}
