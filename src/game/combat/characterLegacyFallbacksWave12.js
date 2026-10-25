// Morty's explicit generation refusal is retained. This reuses one accepted
// calm cell and creates no new native animation, base atlas or dedicated phase.
export const LEGACY_POSE_FALLBACKS_WAVE12 = Object.freeze([
  {
    heroId: 'morty', universe: 'Rick & Morty',
    sheet: '/sprites/generated/heroes/rick-morty/morty.png',
    layout: {
      columns: 4, rows: 4,
      rowByState: { idle: 0, run: 0, attack: 0, support: 0, special: 0, defense: 0, hit: 0, dead: 0 },
      baseline: 244,
      renderScaleByRow: { 0: 190 / 232, 1: 190 / 232, 2: 190 / 232, 3: 190 / 232 },
      adaptedLegacyFallback: true, adaptedSupportStates: ['support', 'defense', 'special'],
      sourcePhaseByState: { idle: 'legacy-idle', run: 'legacy-idle', attack: 'legacy-idle',
        support: 'legacy-idle', special: 'legacy-idle', defense: 'legacy-idle', hit: 'legacy-idle', dead: 'legacy-idle' },
      countedAsDedicatedBase16: false, countedAsDedicatedSuperOrFinale: false,
      source1to1Verified: false, fixedColumn: 0
    }
  }
]);
