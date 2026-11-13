// Heart Eyes — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'heart_eyes',
    universe: 'Heart Eyes',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Seattle Valentine Drive-In',
    boss: 'Heart Eyes Killer Chapel Trap',
    cast: [
      ['ally_mccabe_he', 'Ally McCabe', 'tactical'],
      ['jay_simmonds_he', 'Jay Simmonds', 'slayer'],
      ['monica_he', 'Monica', 'hacker']
    ],
    enemies: ['Heart-Mask Copycat', 'Valentine Stalker', 'Drive-In Ambusher'],
    bosses: ['Heart Eyes Killer Duo', 'Chapel Heart Eyes Killer'],
    gear: [
      ['mask_lens', 'Heart Eyes Mask Lens', 'Lentille du masque Heart Eyes'],
      ['arrow', 'Chapel Arrow', 'Fleche de la chapelle'],
      ['campaign_mockup', 'Ally Campaign Mockup', 'Maquette de campagne d Ally']
    ],
    event: ['fake_couple', 'False Couple Decoy', 'Leurre du faux couple', 'Ally and Jay bait every copycat into one visible route, then reverse the Valentine trap.', 'Ally et Jay attirent chaque imitateur sur une seule route visible puis retournent le piege de Saint-Valentin.'],
    origin: ['Co-workers Ally McCabe and Jay Simmonds are mistaken for a couple and hunted across Seattle by the Valentine slasher called Heart Eyes.', 'Les collegues Ally McCabe et Jay Simmonds sont pris pour un couple et traques dans Seattle par le tueur de Saint-Valentin Heart Eyes.'],
    breach: ['the mask reads cross-universe synergy as romance and starts targeting compatible hero pairs before they can form arc teams.', 'le masque lit les synergies inter-univers comme des romances et cible les duos compatibles avant qu ils puissent former des equipes d arc.'],
    motif: 'hauntedset',
    colors: ['#2a101b', '#050103', '#ec3e68']
  }));
}
