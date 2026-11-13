// Fallout — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
    id: 22,
    name: 'Hoover Dam / Legate Camp Breach',
    universe: 'Fallout',
    mode: 'Smash',
    difficulty: 'Very Hard',
    goldPrize: 170,
    shardPrize: 50,
    bossName: 'Legate Lanius General',
    canonicalBossName: 'Legate Lanius',
    enemyRoster: Object.freeze(['Legate Lanius General']),
    enemyRosterExclusive: true,
    incarnation: 'Fallout: New Vegas (2010) - Second Battle of Hoover Dam',
    referenceUrl: 'https://fallout.fandom.com/wiki/Legate_Lanius',
    visualAnchor: 'Legate Lanius at the Legate camp east of Hoover Dam, wearing his steel face mask and Legion armor with the Blade of the East. Desert cliffs, tents and palisades; no Liberty Prime or New Vegas Strip casino arena.',
    gameplayAdaptation: 'Breach residue fills regular enemy waves; Lanius is the source-locked duel opponent.',
    visualReviewStatus: 'pending'
  }));
}
