// Halo — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
    id: 2,
    name: 'Metropolis / Scarab Boarding',
    universe: 'Halo',
    mode: 'Tactics',
    tacticsBattlefieldId: 'metropolis_scarab_deck',
    difficulty: 'Easy',
    goldPrize: 40,
    shardPrize: 15,
    bossName: 'Covenant Scarab Mech',
    canonicalBossName: 'Protos-pattern Scarab',
    enemyRoster: Object.freeze(['Covenant Grunt', 'Jackal Sniper', 'Elite Minor', 'Covenant Scarab Mech']),
    enemyRosterExclusive: true,
    incarnation: 'Halo 2 (2004) - Metropolis, New Mombasa',
    referenceUrl: 'https://www.halopedia.org/Metropolis',
    referenceUrls: Object.freeze(['https://www.halopedia.org/Metropolis', 'https://www.halopedia.org/Protos-pattern_Scarab']),
    visualAnchor: 'New Mombasa streets, concrete canals and elevated building catwalks around the Halo 2 Protos-pattern Scarab. Huge four-legged purple-gray Covenant walker, flat upper deck, arched gangway, passenger cabin and forward ultra-heavy focus cannon. No Halo ring, Halo 3 Deutoros exposed rear core, Prometheans, Flood or hostile Guilty Spark.',
    gameplayAdaptation: 'Board the Halo 2 Scarab through the catwalk and neutralize its Grunt and Elite crew. The Protos hull is invulnerable; its HP and the approach sniper are not victory targets. The turn-based grid, fixed walker, route and crew count adapt Metropolis; no Halo 3 rear core is used.',
    visualReviewStatus: 'pending'
  }));
}
