// Gears of War — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
    id: 1,
    name: 'Lightmass Bomb Train / RAAM',
    universe: 'Gears of War',
    mode: 'RPG',
    difficulty: 'Easy',
    goldPrize: 40,
    shardPrize: 15,
    bossName: 'General RAAM',
    canonicalBossName: 'General RAAM',
    enemyRoster: Object.freeze(['Locust Drone', 'Theron Guard', 'General RAAM']),
    enemyRosterExclusive: true,
    incarnation: 'Gears of War (2006) - Lightmass Bomb train finale',
    referenceUrl: 'https://en.wikipedia.org/wiki/Gears_of_War_(video_game)',
    referenceUrls: Object.freeze(['https://en.wikipedia.org/wiki/Gears_of_War_(video_game)', 'https://www.supercheats.com/xbox360/walkthroughs/gearsofwar-walkthrough01.txt', 'https://www.supercheats.com/xbox360/walkthroughs/gearsofwar-walkthrough03.txt']),
    visualAnchor: 'The moving Lightmass Bomb train at night, linked industrial freight cars with low cover and exposed walkways. General RAAM is a huge pale Locust in dark armored plates, carrying his Troika and surrounded by Kryll. No Pendulum Wars Aspho Fields, Skorge, Kantus, Tickers or Brumak in this encounter.',
    gameplayAdaptation: 'RPG waves condense the train assault and RAAM duel. Kryll shield blocks ordinary damage; frag grenades disperse it, swarm departures expose RAAM, and lit cover protects from the swarm. ATB commands, the shared grenade supply, durations and cover positions adapt the original real-time cover shooter.',
    visualReviewStatus: 'pending'
  }));
}
