// System of a Down — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Mediator rupture tempo', 'Tempo Break Pick', 'Fragment de riff syncopé: en melee il coupe une charge ennemie, en tactique il augmente le cout de deplacement des cibles prises dans la cassure.'],
      ['Banniere anti-guerre', 'Anti-War Protest Banner', 'Ancre de protestation: protege une zone, resiste aux diffusions de controle et transforme la colere en garde collective.'],
      ['Ampli Toxicity', 'Toxicity Feedback Amp', 'Ampli de feedback instable: renvoie les ordres ennemis en bruit, charge les attaques vocales et marque les propagandes hostiles.']
    ],
    summon: ['Choeur de protestation', 'Protest Chorus', 'Invocation temporaire: un choeur de resonance couvre l escouade, brise les slogans du Sans-Auteur et ralentit les ennemis synchronises.'],
    ultimate: ['Cassure Toxicity', 'Toxicity Breakdown', 'Attaque ultime: la scene coupe la mesure, les broadcasts ennemis se figent, puis voix, guitare et basse frappent en collision rythmique.']
  });
}
