// Predator — definitions consumed by src/game/signatureSourceWave4.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave4Rows({ disc, hero }) {
  return (hero('Predator', 'city_hunter', 'Los Angeles Trophy Hunt', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc));
}

export function createSignatureWave4Rows2({ disc, enemy }) {
  return (enemy('Predator', 'City Hunter Predator', 'Smart Disc Throw', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc));
}

export function createSignatureWave4Rows3({ blade, enemy }) {
  return (enemy('Predator', 'Berserker Predator', 'Berserk Rage Slash', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade));
}

export function createSignatureWave4Rows4({ enemy }) {
  return (enemy('Predator', 'Feral Predator', 'Bone Mask Shield Slam', 'Feral — Wrist Shield Strike', 'slash', 88, 'pred-feral', { note: 'Deployed wrist shield used at contact range. No plasma caster, force field, automatic reflection or ranged damage is added.' }));
}
