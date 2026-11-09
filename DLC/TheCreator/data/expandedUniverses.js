// The Creator — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'the_creator',
    universe: 'The Creator',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'New Asia NOMAD Target Corridor',
    boss: 'NOMAD Orbital Strike Core',
    cast: [
      ['joshua_taylor_creator', 'Joshua Taylor', 'marine'],
      ['alphie_creator', 'Alphie', 'hacker'],
      ['harun_creator', 'Harun', 'tactical']
    ],
    enemies: ['US Army Exosuit', 'NOMAD Targeting Drone', 'Anti-AI Commando'],
    bosses: ['Colonel Howell Strike Team', 'NOMAD Orbital Platform'],
    gear: [
      ['simulant_core', 'Simulant Memory Core', 'Noyau memoire de simulant'],
      ['nomad_beacon', 'NOMAD Target Beacon', 'Balise de ciblage NOMAD'],
      ['new_asia_emp', 'New Asia EMP Charge', 'Charge EMP de Nouvelle-Asie']
    ],
    event: ['alphie_pulse', 'Alphie Technology Pulse', 'Impulsion technologique d Alphie', 'Alphie disables every hostile machine long enough for Joshua to open an evacuation route.', 'Alphie desactive toutes les machines hostiles assez longtemps pour que Joshua ouvre une route d evacuation.'],
    origin: ['Joshua escorts the childlike AI Alphie through a war between humanity, simulants, New Asia, and the orbital weapon NOMAD.', 'Joshua escorte l IA enfant Alphie dans une guerre entre humains, simulants, Nouvelle-Asie et l arme orbitale NOMAD.'],
    breach: ['Alphie can close portals as if they were machines, making her both A.R.C.A. s best stabilizer and NOMAD s priority target.', 'Alphie peut fermer les portails comme des machines, ce qui fait d elle la meilleure stabilisatrice d A.R.C.A. et la cible prioritaire de NOMAD.'],
    motif: 'facility',
    colors: ['#1a2e35', '#030607', '#ef6f46']
  }));
}
