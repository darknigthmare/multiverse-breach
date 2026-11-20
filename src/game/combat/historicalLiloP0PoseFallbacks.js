const idleColumns = Object.freeze([2, 3]);
const walkColumns = Object.freeze([0, 3]);

// Existing Lilo art includes unrelated props and adjacent-frame debris.
// Keep the clear idle and walk cells and let the combat effects show the action.
export const HISTORICAL_LILO_P0_POSE_FALLBACKS = Object.freeze([
  Object.freeze({
    heroId: 'lilo_pelekai',
    universe: 'Lilo & Stitch',
    sheet: '/sprites/generated/heroes/lilo-stitch/lilo-pelekai.png',
    layout: Object.freeze({
      columns: 4,
      rows: 4,
      rowByState: Object.freeze({ idle: 0, run: 1, attack: 0, support: 0, special: 0, defense: 0, hit: 0, dead: 0 }),
      columnsByRow: Object.freeze([idleColumns, walkColumns]),
      baseline: 244,
      adaptedLegacyFallback: true,
      sourcePhaseByState: Object.freeze({ run: 'legacy-run' })
    })
  })
]);
