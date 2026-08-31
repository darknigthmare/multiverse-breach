import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pickRpgTarget } from '../src/game/rpgTargetingPresentation.js';

test('canvas picks only an eligible runtime target, never empty space', () => {
  const targeting = { eligibleTargets: [{ id: 'enemy:1:same', x: 100, y: 100 }, { id: 'enemy:2:same', x: 200, y: 100 }] };
  assert.equal(pickRpgTarget(targeting, 110, 105), 'enemy:1:same');
  assert.equal(pickRpgTarget(targeting, 190, 100), 'enemy:2:same');
  assert.equal(pickRpgTarget(targeting, 150, 100), null);
  assert.equal(pickRpgTarget(targeting, NaN, 100), null);
  assert.equal(pickRpgTarget(null, 100, 100), null);
});

test('GameCanvas manual RPG commands preview and confirm instead of firing immediately', () => {
  const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
  const handler = source.slice(source.indexOf('const handleActiveHeroAbility'), source.indexOf('const handleCancelTacticsAction'));
  const rpg = handler.slice(handler.indexOf("stage.mode === 'RPG'"), handler.indexOf("stage.mode === 'Tactics'"));
  assert.match(rpg, /beginTargeting\(activeEnemy, type, 'enemy'\)/);
  assert.match(rpg, /beginTargeting\(activeH, type, 'player'\)/);
  assert.doesNotMatch(rpg, /trigger(?:Enemy)?Ability/);
  assert.match(source, /<RpgTargetingPanel/);
  assert.match(source, /confirmTargeting\(\)/);
  assert.match(source, /simulationClock\.advance/);
  assert.match(source, /preMatchDeltaMs: COMBAT_STEP_MS/);
  assert.doesNotMatch(source, /combatTime\+\+/);
});
