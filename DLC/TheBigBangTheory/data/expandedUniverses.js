// The Big Bang Theory — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'big_bang_theory',
    universe: 'The Big Bang Theory',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'The Big Bang Theory',
    stage: 'Apartment 4A Physics Paradox',
    boss: 'Infinite Roommate Agreement',
    cast: [
      ['sheldon_cooper_tbbt', 'Sheldon Cooper', 'hacker'],
      ['leonard_hofstadter_tbbt', 'Leonard Hofstadter', 'tactical'],
      ['penny_tbbt', 'Penny', 'slayer']
    ],
    enemies: ['Broken Equation', 'University Rival', 'Comic Store Queue'],
    bosses: ['Kripke Robot Duel', 'Roommate Agreement Singularity'],
    gear: [
      ['whiteboard', 'Caltech Whiteboard', 'Tableau blanc du Caltech'],
      ['napkin', 'Signed Leonard Nimoy Napkin', 'Serviette signee Leonard Nimoy'],
      ['spot', 'Sheldon s Spot Marker', 'Marqueur de la place de Sheldon']
    ],
    event: ['bazinga', 'Bazinga Misdirection', 'Diversion Bazinga', 'Sheldon predicts the obvious response, while Penny solves the human problem the model ignored.', 'Sheldon predit la reponse evidente tandis que Penny resout le probleme humain ignore par le modele.'],
    origin: ['Four scientists and their friends turn Pasadena apartments, Caltech, fandom, and relationships into a long social experiment.', 'Quatre scientifiques et leurs proches transforment appartements de Pasadena, Caltech, fandom et relations en longue experience sociale.'],
    breach: ['Sheldon treats portal behavior as a solvable theory until friendship variables repeatedly invalidate his perfect model.', 'Sheldon traite les portails comme une theorie soluble jusqu a ce que les variables d amitie invalident sans cesse son modele parfait.'],
    motif: 'facility',
    colors: ['#203047', '#040609', '#e15c45']
  }));
}
