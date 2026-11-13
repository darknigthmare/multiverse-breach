// Counter-Strike — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Ace Clutch Boss': 'missionObjective:eliminateTeam',
      'Defuse Timer Singularity': 'missionObjective:defuseBomb'
    },
    fr: 'Counter-Strike repose sur des objectifs et des equipes, pas sur un boss individuel invente.',
    en: 'Counter-Strike is built around objectives and teams rather than an invented individual boss.'
  }));
}
