// Exact bindings to already delivered artwork. These do not certify its visual
// fidelity or transfer a body to another film, organism or gameplay identity.
// See docs/audits/generated-enemy-pack-alien-1979-2026-07-19.md.
export const ENEMY_SPRITE_BINDINGS = Object.freeze({
  'Chestburster Larva': Object.freeze({
    universe: 'Alien',
    incarnation: 'Alien (1979)',
    weapon: 'inner_jaw',
    sheet: '/sprites/generated/bosses/alien-1979/chestburster-larva.png',
    sha256: '8d990dd806e32e5dc82ebd4c9fc21ac8e7b1216d488b2f9ee74aba0243c896eb',
    visualFidelityApproved: false
  }),
  'Synthetic Ash Protocol': Object.freeze({
    universe: 'Alien',
    incarnation: 'Alien (1979)',
    weapon: 'corporate_override',
    sheet: '/sprites/generated/bosses/alien-1979/synthetic-ash-protocol.png',
    sha256: 'a306ce4f242d4751211a8fd721ff8cf69dd488c89c333b8c473042202931447d',
    visualFidelityApproved: false
  })
});

export function getBoundEnemySpriteSrc(enemy) {
  if (!enemy || typeof enemy.name !== 'string' || !Object.hasOwn(ENEMY_SPRITE_BINDINGS, enemy.name)) return '';
  const binding = ENEMY_SPRITE_BINDINGS[enemy.name];
  const universe = enemy.universe || enemy.sourceUniverse;
  if (universe !== binding.universe || enemy.incarnation !== binding.incarnation || enemy.weapon !== binding.weapon) return '';
  return binding.sheet;
}
