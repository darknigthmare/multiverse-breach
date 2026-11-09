import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// This is the independent actor captured before W10 authored its source kit.
// It must never relabel the current P0 actor to manufacture native admission.
const bytes = readFileSync(new URL('../docs/combat-fidelity-wave10-2026-10-23/batch-plan-before.json', import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'), '2f762f261a6f35d3326903e314fa32288c20cea0a4585cabf137b6d1202012ba');
const plan = JSON.parse(bytes);
assert.equal(plan.heroes.length, 40);
const frozen = plan.heroes.find(row => row.hero.id === 'ripley_aliens');
assert.equal(frozen.super.name, 'P-5000 Power Loader');

export function historicalWave10Actor(current) {
  if (current.id !== 'ripley_aliens') return current;
  assert.equal(current.universe, 'Aliens');
  assert.equal(current.incarnation, 'Aliens (1986) - LV-426 / Sulaco');
  assert.deepEqual(current.equipment, ['M41A pulse rifle', 'M240 incinerator', 'Caterpillar P-5000 power loader']);
  assert.deepEqual(current.special, { name: 'Power Loader Smash', type: 'melee_aoe', dmg: 4.2 });
  assert.equal(frozen.hero.universe, current.universe);
  assert.equal(frozen.hero.incarnation, undefined);
  return structuredClone(frozen.hero);
}
