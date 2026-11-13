// Hexen — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ enemy }) {
  return (enemy('Hexen', 'Centaur', 'Missile-reflecting shield', 'Centaur — Sword Strike', 'slash', 80, 'hexen-centaur', {
    enemyId: 'hexen_centaur', note: 'A_CentaurAttack close-range sword attack. This adds an offensive signature only: shield reflection is not re-created, converted to an energy attack or marked complete.'
  }));
}
