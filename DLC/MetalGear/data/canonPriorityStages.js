// Metal Gear — definitions consumed by src/game/canonPriorityStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonPriorityStages() {
  return (Object.freeze({
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
    referenceUrl: 'https://www.konami.com/mg/archive/mgs/',
    referenceUrls: Object.freeze(['https://www.konami.com/mg/archive/mgs/', 'https://archive.org/download/mgs-1-screenplay/MGS1_Screenplay_djvu.txt', 'https://www.supercheats.com/playstation/walkthroughs/metalgearsolid-walkthrough05.txt', 'https://archive.org/details/metal-gear-solid-official-mission-handbook-1998-kitsunebi', 'https://metalgear.konami.net/manual/mc1/mgs1/pc/en/page16.html']),
    gameplayAdaptation: 'Shared mission Stinger targets the radome, then the open cockpit. Body attacks cannot win. Two 360-HP pools, a stationary tactical target, two-to-six-cell range, resupply, turn timing and offscreen Gray Fox assistance adapt MGS (1998). Genome soldiers represent the approach; victory disables REX without killing Liquid or requiring their deaths. The later fistfight is outside this mission. Machine guns, missiles, belly laser and feet use visible danger cells. Three shared chaff grenades disperse radar salvos for two REX attacks; manual cockpit missiles remain dangerous. Footprints, salvo damage and chaff turns are adaptations, not original measurements; five seconds is the original grenade fuse, not jam duration.',
    visualAnchor: 'Shadow Moses underground REX hangar, gray bipedal Metal Gear REX with railgun and radome, industrial gantries and Genome Soldiers. No Arsenal Gear, RAY, Gekko or FROG troops from later games.',
    visualReviewStatus: 'pending'
  }));
}
