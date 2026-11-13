// Predators — definitions consumed by src/game/signatureSourceWave4.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave4Rows({ blade, hero }) {
  return (hero('Predators', 'berserker_predator', 'Berserker Predator Origin Burst', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade));
}

export function createSignatureWave4Rows2({ blade, enemy }) {
  return (enemy('Predators', 'Berserker Predator / Mr. Black', 'Decapitation tell', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade));
}

export function createSignatureWave4Rows3({ blade, enemy }) {
  return (enemy('Predators', 'Falconer Predator', 'Falconer Predator Breach Pattern', 'Falconer — Wrist Blade Duel', 'slash', 92, 'pred-falconer', blade));
}
