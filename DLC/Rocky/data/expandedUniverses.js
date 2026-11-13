// Rocky — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'rocky',
    universe: 'Rocky',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Philadelphia Championship Ring',
    boss: 'Ivan Drago Exhibition',
    cast: [
      ['rocky_balboa', 'Rocky Balboa', 'slayer'],
      ['apollo_creed', 'Apollo Creed', 'tactical'],
      ['adrian_balboa', 'Adrian Balboa', 'hacker']
    ],
    enemies: ['Club Boxer', 'Promoter Enforcer', 'Training Echo'],
    bosses: ['Clubber Lang', 'Ivan Drago'],
    gear: [
      ['gloves', 'Italian Stallion Gloves', 'Gants de l Etalon italien'],
      ['robe', 'Championship Robe', 'Peignoir de championnat'],
      ['training_hat', 'Mickey s Training Hat', 'Bonnet d entrainement de Mickey']
    ],
    event: ['distance', 'Go the Distance', 'Tenir jusqu au bout', 'Rocky survives a knockout blow, restores the team, and answers with a final-round combination.', 'Rocky survit a un coup fatal, releve l equipe et repond par une combinaison du dernier round.'],
    origin: ['Rocky Balboa turns a once-in-a-lifetime title shot into a long story about endurance, dignity, love, and earning one more round.', 'Rocky Balboa transforme une chance unique de titre en une longue histoire d endurance, de dignite, d amour et de round supplementaire.'],
    breach: ['the Nexus Arena measures heroes only by victory, so Rocky fights to prove that surviving with integrity is also a stabilizing result.', 'l Arene du Nexus ne mesure les heros que par la victoire, et Rocky combat pour prouver que tenir avec integrite stabilise aussi une Trame.'],
    motif: 'facility',
    colors: ['#1f2025', '#040405', '#d34b3f']
  }));
}
