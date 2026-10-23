// Reuse accepted presentation poses when a native correction is blocked.
// This declares no new PNG, base16 atlas, super/finale row or melee45 state.
// The six real Janine phases remain the only delivered native phase artwork.
export function buildPresentationFallbacksWave10(entries) {
  const asset = entries.find(entry => entry.heroId === 'janine_gb' && entry.universe === 'Ghostbusters');
  if (!asset || asset.frames !== 24 || asset.phases.super || asset.phases.fatality) return [];
  const sourcePhaseByState = {
    idle: 'intro', run: 'outro', attack: 'intro', support: 'intro', special: 'intro',
    defense: 'roundDefeat', hit: 'roundDefeat', dead: 'defeat'
  };
  if (Object.values(sourcePhaseByState).some(phase => !asset.phases[phase])) return [];
  return [{ heroId: asset.heroId, universe: asset.universe, sheet: asset.sheet,
    layout: {
      columns: asset.columns, rows: asset.rows,
      rowByState: Object.fromEntries(Object.entries(sourcePhaseByState).map(([state, phase]) => [state, asset.phases[phase].row])),
      baseline: asset.normalization.baseline,
      renderScaleByRow: Object.fromEntries(asset.normalization.rows.map((row, index) => [index, row.renderScale ?? 1])),
      adaptedPresentationFallback: true, sourcePhaseByState,
      countedAsDedicatedBase16: false, countedAsDedicatedSuperOrFinale: false,
      source1to1Verified: false
    }
  }];
}
