// Zorro — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'zorro',
    universe: 'Zorro',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Los Angeles Pueblo Uprising',
    boss: 'Montero Hacienda Siege',
    cast: [
      ['diego_de_la_vega_zorro', 'Diego de la Vega', 'tactical'],
      ['alejandro_murrieta_zorro', 'Alejandro Murrieta', 'slayer'],
      ['elena_montera_zorro', 'Elena Montero', 'hacker']
    ],
    enemies: ['Spanish Lancer', 'Montero Guard', 'Mine Overseer'],
    bosses: ['Captain Love', 'Don Rafael Montero'],
    gear: [
      ['rapier', 'Zorro Rapier', 'Rapiere de Zorro'],
      ['mask', 'Black Zorro Mask', 'Masque noir de Zorro'],
      ['whip', 'Hacienda Whip', 'Fouet de l hacienda']
    ],
    event: ['mark_z', 'Mark of Z', 'Marque du Z', 'Zorro disarms the enemy command and marks its route, granting allies a critical opening.', 'Zorro desarme le commandement ennemi et marque sa route, offrant une ouverture critique aux allies.'],
    origin: ['Behind a black mask, Zorro defends the people of California against corrupt governors, soldiers, and landowners.', 'Derriere un masque noir, Zorro defend le peuple de Californie contre gouverneurs corrompus, soldats et grands proprietaires.'],
    breach: ['the Sans-Auteur forges the Z on civilian homes to turn a symbol of resistance into a warrant, so both Zorros must reclaim its meaning.', 'le Sans-Auteur contrefait le Z sur les maisons civiles pour transformer un symbole de resistance en mandat, et les deux Zorros doivent en reprendre le sens.'],
    motif: 'arcanecity',
    colors: ['#1d1916', '#030303', '#d6ad55']
  }));
}
