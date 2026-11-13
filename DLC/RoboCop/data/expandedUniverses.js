// RoboCop — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'robocop',
    universe: 'RoboCop',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Old Detroit OCP Siege',
    boss: 'ED-209 Directive Lock',
    worldBoss: 'OCP Delta City Mainframe',
    cast: [
      ['robocop_murphy', 'Alex Murphy / RoboCop', 'marine'],
      ['anne_lewis_rc', 'Anne Lewis', 'tactical'],
      ['dr_lazarus_rc', 'Dr. Marie Lazarus', 'hacker']
    ],
    enemies: ['OCP Security Trooper', 'Street Gang Gunner', 'Reprogrammed Police Unit'],
    bosses: ['ED-209', 'RoboCain'],
    gear: [
      ['auto9', 'Auto-9', 'Auto-9'],
      ['data_spike', 'RoboCop Data Spike', 'Pointe de donnees RoboCop'],
      ['prime_directives', 'Prime Directive Wafer', 'Plaquette des directives prioritaires']
    ],
    event: ['dead_or_alive', 'Dead or Alive Arrest', 'Arrestation mort ou vif', 'Murphy marks every armed hostile, disarms the front line, and arrests the surviving threat.', 'Murphy marque chaque hostile arme, desarme la premiere ligne et arrete la menace survivante.'],
    origin: ['OCP turns murdered officer Alex Murphy into RoboCop while Old Detroit is sold as a corporate product.', 'OCP transforme l officier assassine Alex Murphy en RoboCop tandis que le vieux Detroit est vendu comme un produit corporatif.'],
    breach: ['A.R.C.A. directives collide with Murphy s prime directives, and OCP tries to patent the Anchor as public-security hardware.', 'les directives A.R.C.A. entrent en conflit avec les directives prioritaires de Murphy, et OCP tente de breveter l Ancre comme materiel de securite publique.'],
    motif: 'arcanecity',
    colors: ['#16232c', '#030506', '#77c9e8']
  }));
}
