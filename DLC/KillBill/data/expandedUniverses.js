// Kill Bill — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'kill_bill',
    universe: 'Kill Bill',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'House of Blue Leaves Showdown',
    boss: 'Bill Five Point Palm Duel',
    cast: [
      ['beatrix_kiddo_kb', 'Beatrix Kiddo', 'slayer'],
      ['sofie_fatale_kb', 'Sofie Fatale', 'hacker'],
      ['hattori_hanzo_kb', 'Hattori Hanzo', 'tactical']
    ],
    enemies: ['Crazy 88 Fighter', 'Yakuza Bodyguard', 'Deadly Viper Assassin'],
    bosses: ['O-Ren Ishii', 'Bill'],
    gear: [
      ['hanzo_sword', 'Hattori Hanzo Sword', 'Sabre Hattori Hanzo'],
      ['five_point_manual', 'Five Point Palm Manual', 'Manuel des cinq points'],
      ['yellow_suit', 'Yellow Tracksuit', 'Survetement jaune']
    ],
    event: ['black_mamba', 'Black Mamba Rampage', 'Assaut Black Mamba', 'Beatrix crosses the enemy line in a precise sequence that ignores counterattacks.', 'Beatrix traverse la ligne ennemie dans une sequence precise qui ignore les contre-attaques.'],
    origin: ['The Bride hunts the Deadly Viper Assassination Squad through a revenge story shaped by discipline, betrayal, and chosen family.', 'La Mariee traque le Detachement international des viperes assassines dans une vengeance faite de discipline, trahison et famille choisie.'],
    breach: ['her death list begins rewriting itself with multiversal names, and Beatrix must decide which targets are people and which are Authorless forgeries.', 'sa liste de mort se reecrit avec des noms multiversels, et Beatrix doit distinguer les personnes des contrefacons du Sans-Auteur.'],
    motif: 'arcanecity',
    colors: ['#2a2410', '#050401', '#f0d638']
  }));
}
