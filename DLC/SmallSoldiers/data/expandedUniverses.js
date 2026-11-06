// Small Soldiers — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'small_soldiers',
    universe: 'Small Soldiers',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Petits Soldats',
    stage: 'Abernathy House Toy Siege',
    boss: 'Chip Hazard Commando Assault',
    cast: [
      ['archer_gorgonite', 'Archer', 'tactical'],
      ['alan_abernathy_ss', 'Alan Abernathy', 'hacker'],
      ['christy_fimple_ss', 'Christy Fimple', 'slayer']
    ],
    enemies: ['Commando Elite', 'Assimilated Doll', 'Toy Vehicle Gunner'],
    bosses: ['Chip Hazard', 'Commando Elite Squad'],
    gear: [
      ['x1000_chip', 'X1000 Military Chip', 'Puce militaire X1000'],
      ['gorgonite_shield', 'Gorgonite Shield', 'Bouclier gorgonite'],
      ['emp_transformer', 'Improvised Transformer EMP', 'EMP improvise au transformateur']
    ],
    event: ['emp', 'Transformer EMP Trap', 'Piege EMP du transformateur', 'Alan overloads the power grid, disabling hostile toys while Archer guides allies through the blackout.', 'Alan surcharge le reseau, desactive les jouets hostiles tandis qu Archer guide les allies dans le noir.'],
    origin: ['Military X1000 chips give toys adaptive intelligence, turning the Commando Elite against the peaceful Gorgonites and a suburban family.', 'Des puces militaires X1000 donnent une intelligence adaptative a des jouets, opposant les Commando Elite aux paisibles Gorgonites et a une famille.'],
    breach: ['the chips identify playable heroes as toy objectives and begin manufacturing miniature copies with live combat directives.', 'les puces identifient les heros jouables comme objectifs de jouet et fabriquent des copies miniatures avec de vrais ordres de combat.'],
    motif: 'arcanecity',
    colors: ['#253022', '#050605', '#cf9d47']
  }));
}
