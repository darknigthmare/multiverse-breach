// Halo — definitions consumed by src/game/signatureSourceWave4.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave4Rows({ hero }) {
  return (hero('Halo', 'arbiter', 'Great Schism Strike', 'Arbiter — Energy Sword Strike', 'slash', 94, 'halo-arbiter', { color: '#8fcaff', note: 'Halo 2 Great Schism energy-sword family, not the orange Prophets Bane or Killer Instinct guest moveset. No free cloak or lunge teleport.' }));
}

export function createSignatureWave4Rows2({ hero }) {
  return (hero('Halo', 'linda_058', 'Linda-058 Origin Burst', 'Linda-058 — Nornfang Precision Shot', 'beam', 430, 'halo-linda', { note: 'Linda personal sniper weapon. One effective shot; no Warzone damage boost, explosive area damage, guaranteed headshot or instant kill.' }));
}

export function createSignatureWave4Rows3({ enemy, halo }) {
  return (enemy('Halo', 'Covenant Grunt', null, 'Grunt — Plasma Pistol Burst', 'barrage', 260, 'halo-weapons', { hits: 3, color: '#95ed65', note: halo }));
}

export function createSignatureWave4Rows4({ enemy, halo }) {
  return (enemy('Halo', 'Elite Minor', null, 'Elite — Plasma Rifle Burst', 'barrage', 320, 'halo-weapons', { hits: 4, color: '#88d2ff', note: halo }));
}

export function createSignatureWave4Rows5({ enemy, halo }) {
  return (enemy('Halo', 'Jackal Sniper', null, 'Jackal — Beam Rifle Shot', 'beam', 410, 'halo-weapons', { color: '#c8a6ff', note: halo }));
}
