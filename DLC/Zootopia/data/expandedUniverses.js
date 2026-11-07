// Zootopia — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'zootopia',
    universe: 'Zootopia',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Zootopie',
    stage: 'Zootopia Night Howler Case',
    boss: 'Bellwether Fear Conspiracy',
    cast: [
      ['judy_hopps', 'Judy Hopps', 'tactical'],
      ['nick_wilde', 'Nick Wilde', 'hacker'],
      ['chief_bogo', 'Chief Bogo', 'marine']
    ],
    enemies: ['Night Howler Shooter', 'Savage Predator', 'Conspiracy Guard'],
    bosses: ['Doug Laboratory Cell', 'Dawn Bellwether'],
    gear: [
      ['carrot_recorder', 'Carrot Recorder Pen', 'Stylo-carotte enregistreur'],
      ['fox_repellent', 'Fox Repellent Can', 'Spray anti-renard'],
      ['night_howler', 'Night Howler Antidote', 'Antidote aux hurleurs nocturnes']
    ],
    event: ['case_break', 'Hopps-Wilde Case Break', 'Resolution Hopps-Wilde', 'Judy secures the evidence while Nick draws the mastermind into confessing the active scheme.', 'Judy securise les preuves tandis que Nick pousse le cerveau du complot a avouer le plan actif.'],
    origin: ['Judy Hopps and Nick Wilde expose a plot using Night Howlers to turn a diverse mammal city against itself.', 'Judy Hopps et Nick Wilde revelent un complot utilisant les hurleurs nocturnes pour dresser une ville de mammiferes diverse contre elle-meme.'],
    breach: ['predator and prey classifications leak into A.R.C.A. combat roles, and Bellwether weaponizes those labels to split mixed squads.', 'les classifications predateur et proie contaminent les roles de combat A.R.C.A., et Bellwether arme ces etiquettes pour diviser les escouades mixtes.'],
    motif: 'arcanecity',
    colors: ['#17374a', '#03070a', '#e45f5d']
  }));
}
