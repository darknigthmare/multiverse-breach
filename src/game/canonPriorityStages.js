// Historical stage IDs and threat names stay stable for saves and sprite catalogs.
// Explicit rosters also make the battle use the selected local boss instead of
// the universe-wide world boss from a different game or period.
export const CANON_PRIORITY_STAGES = Object.freeze({
  shadowMoses: Object.freeze({
    id: 12,
    name: 'Shadow Moses REX Hangar',
    universe: 'Metal Gear',
    mode: 'Tactics',
    tacticsBattlefieldId: 'shadow_moses_rex_hangar',
    difficulty: 'Hard',
    goldPrize: 90,
    shardPrize: 30,
    bossName: 'Metal Gear REX Shadow',
    canonicalBossName: 'Metal Gear REX',
    enemyRoster: Object.freeze(['Genome Soldier Patrol', 'Metal Gear REX Shadow']),
    enemyRosterExclusive: true,
    incarnation: 'Metal Gear Solid (1998) - Shadow Moses',
    referenceUrl: 'https://www.konami.com/mg/history/us/en/',
    visualAnchor: 'Shadow Moses underground REX hangar, gray bipedal Metal Gear REX with railgun and radome, industrial gantries and Genome Soldiers. No Arsenal Gear, RAY, Gekko or FROG troops from later games.',
    visualReviewStatus: 'pending'
  }),
  legatesCamp: Object.freeze({
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
  })
});
