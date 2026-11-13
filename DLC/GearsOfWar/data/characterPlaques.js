// Gears of War — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'COG-01',
    rank: { fr: 'Sergent veteran', en: 'Veteran Sergeant' },
    role: { fr: 'Assaut lourd et couverture', en: 'Heavy assault and cover' },
    callSign: 'Fenix',
    origin: { fr: 'Sera - Coalition des Gouvernements Unis', en: 'Sera - Coalition of Ordered Governments' },
    dossier: {
      fr: 'Veteran de la guerre Locuste, Marcus tient la ligne quand une breche devient un front. Sa plaquette le classe comme pilier blindage, tir soutenu et avancee sous pression.',
      en: 'Locust War veteran, Marcus holds the line when a breach turns into a front. His plaque marks him for armor, suppressive fire, and pressure advances.'
    },
    doctrine: { fr: 'Lancer, couverture COG, frappe orbitale Hammer of Dawn.', en: 'Lancer, COG cover, Hammer of Dawn orbital strike.' },
    tags: ['COG', 'Lancer', 'Cover', 'Heavy']
  });
}
