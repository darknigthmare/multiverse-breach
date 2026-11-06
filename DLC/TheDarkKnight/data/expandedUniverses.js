// The Dark Knight — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'dark_knight',
    universe: 'The Dark Knight',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'The Dark Knight',
    stage: 'Gotham Ferry Dilemma',
    boss: 'Joker Chaos Network',
    cast: [
      ['batman_tdk', 'Batman', 'tactical'],
      ['jim_gordon_tdk', 'James Gordon', 'marine'],
      ['lucius_fox_tdk', 'Lucius Fox', 'hacker']
    ],
    enemies: ['Joker Mask Robber', 'Gotham Mob Gunman', 'Corrupt SWAT Officer'],
    bosses: ['Two-Face', 'The Joker'],
    gear: [
      ['grapple', 'Pneumatic Grapnel', 'Grappin pneumatique'],
      ['sonar', 'Gotham Sonar Lens', 'Lentille sonar de Gotham'],
      ['batarang', 'Dark Knight Batarang', 'Batarang du Chevalier noir']
    ],
    event: ['ferry_choice', 'Gotham Ferry Choice', 'Choix des ferries de Gotham', 'Civilians reject the Joker s game, cleansing fear and restoring the squad s resolve.', 'Les civils refusent le jeu du Joker, dissipent la peur et restaurent la resolution de l escouade.'],
    origin: ['Batman, Gordon, and Dent confront a Joker campaign built to prove that Gotham s rules collapse under enough fear.', 'Batman, Gordon et Dent affrontent une campagne du Joker destinee a prouver que les regles de Gotham s effondrent sous la peur.'],
    breach: ['the Joker turns portal selection into social experiments, while Batman refuses to let A.R.C.A. trade surveillance for certainty.', 'le Joker transforme la selection des portails en experiences sociales, tandis que Batman refuse qu A.R.C.A. echange la surveillance contre la certitude.'],
    motif: 'arcanecity',
    colors: ['#111b25', '#020304', '#d3a84a']
  }));
}
