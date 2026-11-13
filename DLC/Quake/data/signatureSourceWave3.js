// Quake — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ enemy }) {
  return (enemy('Quake', 'Makron — Quake II', 'Jorg exoskeleton assault', 'Makron — Hyperblaster Sweep', 'barrage', 390, 'q2-makron', {
    enemyId: 'quake_franchise_makron_q2', requiredContinuity: 'Quake II (1997)', hits: 5, shape: 'multi', distribution: 'cycle',
    note: 'MakronHyperblaster attack family. Five contacts are condensed, not the original frame table. No Jorg spawn, phase transition, BFG scanning or telefrag bypass is added.'
  }));
}
