// The existing sheets are recognizable in these cells. Their old attack rows
// introduce unrelated props and effects, so actions reuse inspected poses.
// The runtime still owns the sword, flintlock and physical contact effects.
export const HISTORICAL_ICONIC_P0_POSE_FALLBACKS = Object.freeze([
  {
    heroId: 'jack_sparrow_potc',
    universe: 'Pirates of the Caribbean',
    incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Captain Jack Sparrow',
    sheet: '/sprites/generated/heroes/pirates-of-the-caribbean/jack-sparrow-potc.png',
    layout: {
      columns: 4,
      rows: 4,
      rowByState: { idle: 0, run: 1, attack: 3, support: 0, special: 3, defense: 3, hit: 3, dead: 3 },
      columnsByRow: [[2, 3], [0, 1], null, [1, 3]],
      trimByRow: { 1: { top: 20 } },
      baseline: 244,
      adaptedLegacyFallback: true,
      sourcePhaseByState: {
        idle: 'legacy-idle', run: 'legacy-run', attack: 'legacy-hit', support: 'legacy-idle',
        special: 'legacy-hit', defense: 'legacy-hit', hit: 'legacy-hit', dead: 'legacy-hit'
      },
      countedAsDedicatedBase16: false,
      countedAsDedicatedSuperOrFinale: false,
      source1to1Verified: false
    }
  },
  {
    heroId: 'roger_rabbit',
    universe: 'Roger Rabbit',
    incarnation: 'Who Framed Roger Rabbit (1988) - Roger, Maroon Cartoon Studio toon',
    sheet: '/sprites/generated/heroes/roger-rabbit/roger-rabbit.png',
    layout: {
      columns: 4,
      rows: 4,
      rowByState: { idle: 0, run: 1, attack: 0, support: 0, special: 0, defense: 3, hit: 3, dead: 3 },
      columnsByRow: [[1, 3], [0, 1], null, [1]],
      trimByRow: { 1: { top: 20 } },
      baseline: 244,
      adaptedLegacyFallback: true,
      sourcePhaseByState: {
        idle: 'legacy-idle', run: 'legacy-run', attack: 'legacy-idle', support: 'legacy-idle',
        special: 'legacy-idle', defense: 'legacy-hit', hit: 'legacy-hit', dead: 'legacy-hit'
      },
      countedAsDedicatedBase16: false,
      countedAsDedicatedSuperOrFinale: false,
      source1to1Verified: false
    }
  }
]);
