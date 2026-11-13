// Alien — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
    id: 3,
    name: "Hadley's Hope / Atmosphere Processor Hive",
    // The historical Alien key remains stable for saves and enemy sprite paths.
    universe: 'Alien',
    mode: 'Smash',
    smashArenaId: 'hadleys_processor_hive',
    difficulty: 'Easy',
    goldPrize: 45,
    shardPrize: 15,
    bossName: 'Alien Queen',
    canonicalBossName: 'Alien Queen',
    enemyRoster: Object.freeze(['Warrior Xenomorph', 'Skittering Facehugger', 'Egg Chamber Sac', 'Alien Queen']),
    enemyRosterExclusive: true,
    incarnation: "Aliens (1986) - Hadley's Hope atmosphere processor, LV-426",
    referenceUrl: 'https://en.wikipedia.org/wiki/Aliens_(film)',
    referenceUrls: Object.freeze(['https://www.20thcenturystudios.com/movies/aliens', 'https://en.wikipedia.org/wiki/Aliens_(film)', 'https://imsdb.com/scripts/Aliens.html']),
    visualAnchor: 'The LV-426 atmosphere processor near Hadley\'s Hope: industrial grated walkways overtaken by dark biomechanical resin, eggs and the Queen\'s nest. The Queen has a broad crown-like cranial crest, two large arms and two small chest arms, digitigrade legs and a long tail. Warrior Xenomorphs have ridged heads. No Predalien, dog Runner, Ash, Praetorian or Sulaco power-loader bay in this location.',
    gameplayAdaptation: 'Rescue Newt at the nest marker, then reach the evacuation marker with her living carrier. Queen damage is nonlethal and her defeat cannot win this hive mission. Combat waves, the 2D route, interaction markers and carrier-loss condition adapt the film rescue; Newt is not a damageable combatant. The separate Sulaco tactical reconstruction (50101) follows this rescue; source choreography and artwork remain partial.',
    visualReviewStatus: 'pending'
  }));
}
