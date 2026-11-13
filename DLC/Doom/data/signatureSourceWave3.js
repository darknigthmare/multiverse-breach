// Doom — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ enemy }) {
  return (enemy('Doom', 'Leaping Pinky Demon', null, 'Pinky — Bite', 'slash', 75, 'doom-pinky', {
    note: 'Classic demon bite (A_SargAttack). The catalog word Leaping does not grant a projectile, a jump super or Doom Eternal armor. Short-range damage remains a Nexus adaptation.'
  }));
}
