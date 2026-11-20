import { getP0HeroSourceId } from './canonP0AttackEffects.js';

const incarnation = 'Star Wars: The Empire Strikes Back (1980) - Bespin Sith Lord';

export function isBespinVader(actor) {
  return (actor?.sourceHeroId || getP0HeroSourceId(actor)) === 'vader'
    && actor.universe === 'Star Wars' && (!actor.sourceUniverse || actor.sourceUniverse === actor.universe)
    && actor.incarnation === incarnation;
}

const tacticsActions = new Map([
  ['simple', { name: 'Red Lightsaber Cut', type: 'melee', delivery: 'melee', range: 1 }],
  ['secondary', { name: 'Bespin Debris Telekinesis', type: 'gravity', delivery: 'ranged', range: 3 }],
  ['special', { name: 'Force Choke', type: 'gravity', delivery: 'ranged', range: 5 }],
  ['defense', { name: 'Lightsaber Parry', type: 'shield', delivery: 'self', range: 0 }]
]);

export function getBespinVaderTacticsAbility(actor, slot) {
  if (!isBespinVader(actor)) return null;
  const action = actor[slot];
  const expected = tacticsActions.get(slot);
  if (!expected || action?.name !== expected.name || action.type !== expected.type) return null;
  const guard = slot === 'defense';
  return {
    sourceAbility: action,
    name: action.name,
    effect: guard ? 'guard' : 'damage',
    delivery: expected.delivery,
    tacticsRange: expected.range,
    shape: 'single',
    targetSide: guard ? 'self' : 'enemy',
    multiplier: guard ? 0 : action.dmg,
    effectDuration: action.dur,
    guardReduce: action.reduce
  };
}
