import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { resolveEquippedCombatEvent } from '../src/game/combatEventItem.js';

let vite, types;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const [{ EngineRpg }, { EngineTactics }, { EngineSmash }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js'), vite.ssrLoadModule('/src/game/engineTactics.js'), vite.ssrLoadModule('/src/game/engineSmash.js')
  ]);
  types = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash };
});
afterEach(() => engines.splice(0).forEach(e => e.dispose?.()));
after(async () => { await vite?.close(); });
function make(mode) {
  const hero = { id: 'carrier', name: 'Carrier', universe: 'Nexus de Convergence', category: 'test', stats: { hp: 200, atk: 20, def: 0, spd: 5 },
    simple: { type: 'melee', dmg: 1 }, secondary: { type: 'bullet', dmg: 1, cd: 3 }, defense: { reduce: 0.4, dur: 2 }, special: { type: 'melee', dmg: 2 } };
  const enemy = { id: 'test-enemy', name: 'Test', hp: 1000, atk: 5, def: 0, spd: 1, weapon: 'melee' };
  const e = new types[mode](760, 420, [hero], { monsters: [enemy], bosses: [], customRoster: [enemy] }, { add() {} }, () => {}, () => {},
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  if (mode === 'Smash') e.syncPreMatchFromServer(3000);
  engines.push(e); return e;
}
for (const mode of ['RPG', 'Tactics', 'Smash']) {
  test(`${mode} successful artifact activation returns true to the UI`, () => {
    const e = make(mode); e.heroes[0].currentHp = 50;
    assert.equal(e.triggerCombatEvent('heal_squad'), true);
    assert.equal(e.heroes[0].currentHp, 200);
  });
  for (const state of ['paused', 'disposed', 'gameOver']) test(`${mode} artifacts reject ${state} without effects`, () => {
    const e = make(mode); e.heroes[0].currentHp = 50; e[state] = true;
    assert.equal(e.triggerCombatEvent('heal_squad'), false);
    assert.equal(e.heroes[0].currentHp, 50);
  });
  test(`${mode} malformed artifact effects do not trigger default attacks`, () => {
    const e = make(mode); const hp = e.enemies.map(unit => unit.currentHp);
    for (const effect of [null, '', ' ', undefined, 12]) assert.equal(e.triggerCombatEvent(effect), false);
    assert.deepEqual(e.enemies.map(unit => unit.currentHp), hp);
  });
}
const catalog = { Local: { id: 'local-event', effect: 'iris_invuln' }, Other: { id: 'other-event', effect: 'heal_squad' } };
test('equipped crossover event resolves by exact ID and respects hidden/disabled catalog entries', () => {
  assert.equal(resolveEquippedCombatEvent('other-event', catalog), catalog.Other);
  assert.equal(resolveEquippedCombatEvent('invented-event', catalog), null);
  assert.equal(resolveEquippedCombatEvent('other-event', catalog, new Set(['Other'])), null);
  assert.equal(resolveEquippedCombatEvent('other-event', catalog, new Set(), new Set(['other-event'])), null);
});
const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
const handler = source.slice(source.indexOf('  const handleActivateEventItem ='), source.indexOf('  const swapActiveHero ='));
for (const scenario of ['success', 'rejected', 'paused', 'dead', 'disabled', 'no-items', 'targeting']) {
  test(`actual GameCanvas event handler: ${scenario}, correct artifact and one synchronous use`, () => {
    const effects = []; const notifications = []; const latch = { current: false };
    const engine = { heroes: [{ id: 'carrier', currentHp: scenario === 'dead' ? 0 : 200 }],
      getTargetingState: () => scenario === 'targeting', triggerCombatEvent: effect => { effects.push(effect); return scenario !== 'rejected'; } };
    const run = new Function('engineRef', 'sessionPausedRef', 'eventItemUsedRef', 'eventItemUsed', 'battleCompleted', 'stage',
      'HEROES_DB', 'activeHeroId', 'hiddenUniverseSet', 'equippedEventItems', 'EVENT_ITEMS_DB', 'disabledGearSet', 'resolveEquippedCombatEvent', 'setEventItemUsed',
      `${handler}; return handleActivateEventItem;`)(
      { current: engine }, { current: scenario === 'paused' }, latch, false, false, { mode: 'RPG', disableItems: scenario === 'no-items' },
      [{ id: 'carrier', universe: 'Local' }], 'carrier', new Set(), { carrier: 'other-event' }, catalog,
      new Set(scenario === 'disabled' ? ['other-event'] : []), resolveEquippedCombatEvent, used => notifications.push(used));
    run(); run();
    if (scenario === 'success') { assert.deepEqual(effects, ['heal_squad']); assert.deepEqual(notifications, [true]); }
    else if (scenario === 'rejected') { assert.deepEqual(effects, ['heal_squad', 'heal_squad']); assert.equal(latch.current, false); }
    else { assert.deepEqual(effects, []); assert.equal(latch.current, false); }
  });
}
