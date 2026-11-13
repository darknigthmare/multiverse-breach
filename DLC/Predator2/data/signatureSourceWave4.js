// Predator 2 — definitions consumed by src/game/signatureSourceWave4.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave4Rows({ disc, hero }) {
  return (hero('Predator 2', 'city_hunter_p2', 'City Hunter Origin Burst', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc));
}
