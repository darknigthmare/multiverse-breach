// Half-Life — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
    id: 10,
    name: 'Xen / Nihilanth Chamber',
    universe: 'Half-Life',
    mode: 'Smash',
    smashArenaId: 'xen_nihilanth_chamber',
    difficulty: 'Medium',
    goldPrize: 75,
    shardPrize: 25,
    bossName: 'Alien Nihilanth Core',
    canonicalBossName: 'Nihilanth',
    enemyRoster: Object.freeze(['Vortigaunt Shock Trooper', 'Alien Nihilanth Core']),
    enemyRosterExclusive: true,
    incarnation: 'Half-Life (1998) - Xen, Nihilanth finale',
    referenceUrl: 'https://combineoverwiki.net/wiki/Nihilanth',
    referenceUrls: Object.freeze(['https://combineoverwiki.net/wiki/Nihilanth', 'https://github.com/ValveSoftware/halflife/blob/0fc8913c542d6ba129ca8bede1505e7d2e8b4b4b/dlls/nihilanth.cpp']),
    visualAnchor: 'Nihilanth\'s vast organic rock cavern on Xen, with suspended ledges and three healing crystals. A massive levitating creature with a huge head, undersized legs, two main arms and a vestigial third chest arm; orange energy spheres orbit its head, purple projectiles and green teleport spheres. Its crown opens to reveal the brain weak point. Enslaved Vortigaunts wear shackles. No Black Mesa test chamber, Strider, Combine soldier, Advisor, Antlion or Race X.',
    gameplayAdaptation: 'Destroy three healing crystals, weaken the boss and its replenishable reserve of twenty orange spheres, and hit the brain after the head opens. Body hits cannot kill Nihilanth. Platforms, crystal HP, healing intervals and purple projectile timing adapt the source encounter to Smash; green teleport spheres, teleport rooms and summoned reinforcements remain unimplemented.',
    visualReviewStatus: 'pending'
  }));
}
