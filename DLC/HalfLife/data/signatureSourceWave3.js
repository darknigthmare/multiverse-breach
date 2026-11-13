// Half-Life — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ hero }) {
  return (hero('Half-Life', 'dog_hl2', 'Dog Origin Burst', 'Dog — Mechanical Strike', 'slash', 95, 'hl2-dog', {
    note: 'Mechanical close-range strike, not a rifle, energy blast or summoned robot army. Object-grabbing, throwing and scripted Strider wrestling remain separate work.',
    basicCorrection: { legacyName: 'Dog Signature Strike', name: 'Dog Mechanical Strike', type: 'melee', delivery: 'melee', range: 80, weaponType: 'fists' }
  }));
}
