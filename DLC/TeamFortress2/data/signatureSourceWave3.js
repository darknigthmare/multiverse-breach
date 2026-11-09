// Team Fortress 2 — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ hero }) {
  return (hero('Team Fortress 2', 'team_fortress_2_medic', 'ÜberCharge', 'ÜberCharge — Stock Medi Gun', 'healing', 320, 'tf-stock-medigun', {
    effect: 'guard', kind: 'support', protection: 'stock-uber', durationTicks: 480, shape: 'single', directional: false,
    note: 'Stock Medi Gun: caster and at most one patient, eight gameplay seconds of protection against dispatched combat hits. No group damage, resurrection, critical boost, overheal, patient flashing, flag rules or immunity to world/direct status damage. Existing special-meter economy is an adaptation.'
  }));
}
