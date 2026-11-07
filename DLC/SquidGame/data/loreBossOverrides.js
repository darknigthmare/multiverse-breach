// Squid Game — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Young-hee Doll',
      weapon: 'motion_detection',
      special: 'Red Light Detection',
      phases: ['Scans for movement during red-light windows', 'Shortens the green-light windows and rotates the head faster'],
      lore: {
        fr: 'Young-hee est l automate geant du jeu Un, deux, trois, soleil.',
        en: 'Young-hee is the giant automaton used for Red Light, Green Light.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/squid-game-young-hee-doll',
      visualAnchor: 'Exact giant schoolgirl robot, yellow-orange dress, pigtails, white socks and rotating sensor eyes from Squid Game.'
    },
    {
      name: 'Jang Deok-su',
      weapon: 'brutal_brawling',
      special: 'Dormitory Riot',
      phases: ['Uses heavy punches, grapples and shoves', 'Becomes reckless and chains attacks when isolated'],
      lore: {
        fr: 'Deok-su est un gangster violent parmi les participants.',
        en: 'Deok-su is a violent gangster among the contestants.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/squid-game-cast-guide',
      visualAnchor: 'Exact Heo Sung-tae likeness as player 101, green tracksuit, facial scar and human proportions; no armor or weapon.'
    }
  ]);
}
