// Lilo & Stitch — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'lilo_stitch',
    universe: 'Lilo & Stitch',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'Lilo & Stitch',
    stage: 'Kauai Galactic Federation Pursuit',
    boss: 'Gantu Prisoner Transport',
    cast: [
      ['stitch_626', 'Stitch', 'slayer'],
      ['lilo_pelekai', 'Lilo Pelekai', 'hacker'],
      ['nani_pelekai', 'Nani Pelekai', 'tactical']
    ],
    enemies: ['Federation Security Bot', 'Experiment Pod Drone', 'Gantu Trooper'],
    bosses: ['Captain Gantu', 'Jumba Experiment Swarm'],
    gear: [
      ['plasma_blaster', 'Experiment 626 Plasma Blaster', 'Blaster plasma de l Experience 626'],
      ['experiment_pod', 'Experiment Pod', 'Capsule d experience'],
      ['ohana_photo', 'Ohana Photograph', 'Photographie Ohana']
    ],
    event: ['ohana', 'Ohana Rescue', 'Sauvetage Ohana', 'The family refuses to leave anyone behind, pulling a defeated ally back before Stitch clears the route.', 'La famille refuse d abandonner qui que ce soit, ramene un allie vaincu puis laisse Stitch nettoyer la route.'],
    origin: ['Genetic experiment 626 escapes to Kauai and learns from Lilo and Nani that family means nobody is left behind.', 'L experience genetique 626 fuit vers Kauai et apprend avec Lilo et Nani que la famille signifie que personne n est abandonne.'],
    breach: ['A.R.C.A. classifies Stitch as an anomaly, but Lilo forces the organization to recognize him as family before he becomes another contained weapon.', 'A.R.C.A. classe Stitch comme anomalie, mais Lilo oblige l organisation a le reconnaitre comme famille avant qu il ne redevienne une arme confinee.'],
    motif: 'shipdeck',
    colors: ['#12334a', '#020709', '#55b7e8']
  }));
}
