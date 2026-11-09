// A serialized, already prepared upstream signature is an existing source
// version. Use its pinned catalog contract explicitly in legacy adapter tests;
// default HEROES_DB actors continue to select the reviewed native source kit.
export function preparedLegacySignature(actor, definition) {
  if (!actor || !definition || actor.universe !== definition.universe) {
    throw new Error('A prepared legacy fixture needs its matching source definition');
  }
  const source = structuredClone(actor);
  const previous = source.special;
  const support = definition.effect === 'heal' || definition.effect === 'guard';
  const multiplier = Number.isFinite(previous?.dmg) ? previous.dmg
    : source.isBoss || source.isWorldBoss ? 2.5 : 1.5;
  source.special = {
    ...(previous && typeof previous === 'object' ? previous : {}),
    name: definition.name,
    type: support ? definition.effect === 'guard' ? 'shield' : 'heal'
      : definition.kind === 'summon' ? 'summon' : definition.delivery === 'melee' ? 'melee' : 'beam',
    dmg: support ? 0 : multiplier,
    healRatio: definition.healRatio || 0,
    sourceSignatureKey: definition.key,
    rpgProfile: {
      effect: definition.effect,
      targetSide: support ? 'ally' : 'enemy',
      shape: definition.shape === 'single' ? 'single' : 'group',
      healRatio: definition.healRatio || 0
    },
    smashProfile: {
      delivery: definition.delivery,
      shape: definition.shape,
      range: definition.range,
      verticalRange: definition.shape === 'group' ? 180 : 42,
      maxTargets: definition.shape === 'single' ? 1 : 8,
      directional: support ? false : definition.directional,
      knockback: definition.hits > 1 ? 0 : definition.delivery === 'melee' ? 24 : 12
    }
  };
  source.versusSpecialName = definition.name;
  source.sourceSignature = {
    key: definition.key,
    fidelity: definition.fidelity,
    referenceUrl: definition.referenceUrl
  };
  return source;
}
