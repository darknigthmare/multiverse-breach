// The Predator — definitions consumed by src/game/signatureSourceWave4.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave4Rows({ blade, hero }) {
  return (hero('The Predator', 'fugitive_predator', 'Fugitive Predator Origin Burst', 'Fugitive — Wrist Blade Combination', 'slash', 92, 'pred-fugitive', blade));
}

export function createSignatureWave4Rows2({ blade, enemy }) {
  return (enemy('The Predator', 'Fugitive Predator', 'Fugitive Predator Breach Pattern', 'Fugitive — Wrist Blade Combination', 'slash', 92, 'pred-fugitive', blade));
}

export function createSignatureWave4Rows3({ enemy }) {
  return (enemy('The Predator', 'Assassin Predator / Upgrade Predator', 'Extraction denial', 'Assassin — Wrist Cannon', 'barrage', 340, 'pred-assassin', { note: 'Wrist-mounted cannon from the licensed film representation; no regeneration, armored-phase switch or whole-map attack.' }));
}
