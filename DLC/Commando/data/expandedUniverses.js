// Commando — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'commando',
    universe: 'Commando',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Val Verde Island Assault',
    boss: 'Arius Compound Siege',
    cast: [
      ['john_matrix_commando', 'John Matrix', 'marine'],
      ['cindy_commando', 'Cindy', 'tactical'],
      ['general_kirby_commando', 'General Kirby', 'hacker']
    ],
    enemies: ['Val Verde Mercenary', 'Mall Kidnapper', 'Island Guard'],
    bosses: ['Arius', 'Bennett'],
    gear: [
      ['launcher', 'M202 FLASH Launcher', 'Lance-roquettes M202 FLASH'],
      ['saw', 'Compound Circular Saw', 'Scie circulaire du complexe'],
      ['knife', 'Bennett Throwing Knife', 'Couteau de lancer de Bennett']
    ],
    event: ['gear_up', 'Matrix Gear-Up', 'Armement de Matrix', 'Matrix equips the full assault rack and clears every exposed firing lane.', 'Matrix equipe tout l arsenal d assaut et nettoie chaque ligne de tir exposee.'],
    origin: ['Retired Colonel John Matrix assaults a private army to rescue his kidnapped daughter from Arius and Bennett.', 'Le colonel retraite John Matrix attaque une armee privee pour sauver sa fille enlevee par Arius et Bennett.'],
    breach: ['Jenny s trace is copied into several hostage markers, forcing Matrix to identify the real signal before his one-man assault destroys an innocent Trame.', 'la trace de Jenny est copiee dans plusieurs marqueurs d otage, obligeant Matrix a identifier le vrai signal avant que son assaut solitaire ne detruise une Trame innocente.'],
    motif: 'fortress',
    colors: ['#28301c', '#050604', '#d17c3e']
  }));
}
