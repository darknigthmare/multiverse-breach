// The Expendables — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'the_expendables',
    universe: 'The Expendables',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Hard',
    titleFr: 'Expendables',
    stage: 'Vilena Palace Demolition',
    boss: 'Stonebanks Arms Convoy',
    cast: [
      ['barney_ross_exp', 'Barney Ross', 'tactical'],
      ['lee_christmas_exp', 'Lee Christmas', 'slayer'],
      ['gunner_jensen_exp', 'Gunner Jensen', 'marine']
    ],
    enemies: ['Vilena Soldier', 'Stonebanks Mercenary', 'Armored Convoy Gunner'],
    bosses: ['General Garza', 'Conrad Stonebanks'],
    gear: [
      ['throwing_knife', 'Lee Christmas Throwing Knife', 'Couteau de lancer de Lee Christmas'],
      ['revolver', 'Barney Ross Revolver', 'Revolver de Barney Ross'],
      ['demolition_pack', 'Toll Road Demolition Pack', 'Pack de demolition de Toll Road']
    ],
    event: ['team_assault', 'Expendables Full-Team Assault', 'Assaut complet des Expendables', 'The full team breaches from every entrance and demolishes the boss cover before the counterattack.', 'Toute l equipe entre par chaque acces et detruit la couverture du boss avant la contre-attaque.'],
    origin: ['Barney Ross leads veteran mercenaries through impossible rescue and demolition jobs held together by loyalty and old debts.', 'Barney Ross mene des mercenaires veterans dans des missions impossibles de sauvetage et demolition liees par la loyaut et de vieilles dettes.'],
    breach: ['A.R.C.A. marks several universes expendable to save the core, and the team turns its weapons on the policy rather than abandon civilians.', 'A.R.C.A. marque plusieurs univers comme sacrifiables pour sauver le noyau, et l equipe retourne ses armes contre cette politique plutot que d abandonner les civils.'],
    motif: 'fortress',
    colors: ['#29251d', '#050504', '#c67d42']
  }));
}
