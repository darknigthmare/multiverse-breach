// John Wick — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'john_wick',
    universe: 'John Wick',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'Continental High Table Contract',
    boss: 'Marquis Sunrise Duel',
    cast: [
      ['john_wick', 'John Wick', 'slayer'],
      ['caine_jw', 'Caine', 'tactical'],
      ['bowery_king_jw', 'Bowery King', 'hacker']
    ],
    enemies: ['High Table Assassin', 'Armored Enforcer', 'Osaka Tracker'],
    bosses: ['Zero', 'Marquis Vincent de Gramont'],
    gear: [
      ['combat_pistol', 'Wick Combat Pistol', 'Pistolet de combat de Wick'],
      ['marker', 'Blood Oath Marker', 'Marqueur de serment de sang'],
      ['gold_coin', 'Continental Gold Coin', 'Piece d or du Continental']
    ],
    event: ['baba_yaga', 'Baba Yaga Focus', 'Concentration Baba Yaga', 'John chains precise shots, grapples, and reloads until every marked contract target falls.', 'John enchaine tirs precis, projections et rechargements jusqu a la chute de chaque cible sous contrat.'],
    origin: ['John Wick is dragged back into a global assassin society governed by markers, Continental rules, and the High Table.', 'John Wick est ramene dans une societe mondiale d assassins gouvernee par marqueurs, regles du Continental et Grande Table.'],
    breach: ['the High Table declares ownership over inter-universe contracts, while John searches for a way to make his final freedom persist across every copy.', 'la Grande Table revendique les contrats inter-univers, tandis que John cherche une liberte finale qui persiste dans chaque copie.'],
    motif: 'arcanecity',
    colors: ['#101923', '#020304', '#d6b15a']
  }));
}
