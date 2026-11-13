// The Purge — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'the_purge',
    universe: 'The Purge',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'American Nightmare',
    stage: 'Purge Night Emergency Route',
    boss: 'NFFA Death Squad Broadcast',
    cast: [
      ['leo_barnes_purge', 'Leo Barnes', 'slayer'],
      ['charlene_roan_purge', 'Charlene Roan', 'tactical'],
      ['dante_bishop_purge', 'Dante Bishop', 'hacker']
    ],
    enemies: ['Purge Mask Hunter', 'NFFA Mercenary', 'Auction Guard'],
    bosses: ['Big Daddy Purger', 'NFFA Death Squad Commander'],
    gear: [
      ['siren_radio', 'Purge Siren Radio', 'Radio de sirene de la Purge'],
      ['armored_car', 'Emergency Armored Plate', 'Plaque blindee d urgence'],
      ['resistance_beacon', 'Resistance Beacon', 'Balise de la resistance']
    ],
    event: ['siren_end', 'Purge Siren Ceasefire', 'Cessez-le-feu de la sirene', 'A.R.C.A. forces the legal timer to zero, disarming rule-bound hunters and exposing NFFA units.', 'A.R.C.A. force le compteur legal a zero, desarme les chasseurs lies aux regles et expose les unites NFFA.'],
    origin: ['The NFFA legalizes one annual night of violence to enforce social control while survivors and resistance cells expose the system.', 'La NFFA legalise une nuit annuelle de violence pour imposer un controle social tandis que survivants et resistance revelent le systeme.'],
    breach: ['a Purge broadcast declares one Nexus sector lawless forever, and A.R.C.A. must restore protection without becoming another authoritarian enforcer.', 'une diffusion de la Purge declare un secteur du Nexus hors-la-loi pour toujours, et A.R.C.A. doit restaurer la protection sans devenir une autre force autoritaire.'],
    motif: 'arcanecity',
    colors: ['#20121c', '#040203', '#d5485f']
  }));
}
