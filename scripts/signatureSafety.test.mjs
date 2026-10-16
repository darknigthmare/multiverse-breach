import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let vite, EngineRpg, EngineSmash, installSignatureDirector, heroes, events;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  ({ HEROES_DB: heroes, EVENT_ITEMS_DB: events } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
const tick = (engine, count = 1) => {
  for (let i = 0; i < count; i++) engine.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 });
};
const make = (mode = 'RPG', heroId = 'cloud_ff7', count = 2) => {
  const template = heroes.find(hero => hero.id === heroId);
  assert.ok(template, heroId);
  const foes = Array.from({ length: count }, (_, i) => ({
    id: `safety-target-${i}`, name: `Safety target ${i}`, universe: 'Nexus de Convergence',
    hp: 10000, atk: 1, def: 0, spd: 1, color: '#888'
  }));
  const stage = { mode, universe: 'Nexus de Convergence', disableHazards: true,
    customBattle: { singleRoster: true, opponentControl: 'p2' } };
  const engine = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [template],
    { customRoster: foes, monsters: foes, bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  engine.syncPreMatchFromServer?.(3000); engine.completeMeleeIntros?.();
  engine.heroes.forEach(actor => Object.assign(actor, { state: 'idle', stateTimer: 0,
    atb: 100, specialCharge: 100, action: null, x: 200, y: 250, facing: 1 }));
  engine.enemies.forEach((actor, i) => Object.assign(actor, { state: 'idle', x: 225 + i * 20, y: 250 }));
  installSignatureDirector(engine, { mode }); engines.push(engine); return engine;
};

for (const mode of ['RPG', 'Smash']) for (const time of [5, 65]) {
  test(`${mode}: a nonlethal interruption releases only its own cast lock at tick ${time}`, () => {
    const e = make(mode); const actor = e.heroes[0];
    assert.equal(e.signatureDirector.triggerInvocation(events['Final Fantasy VII'], actor), true);
    tick(e, time);
    e.applyDamage(e.enemies[0], actor, 1);
    assert.ok(actor.currentHp > 0);
    const hitState = actor.state;
    assert.notEqual(hitState, 'signature');
    assert.equal(e.signatureDirector.busy, false);
    assert.equal(actor.actionPending, false);
    assert.equal(actor.state, hitState, 'cancelling an invocation erased the incoming hit state');
    const hp = e.enemies.map(enemy => enemy.currentHp);
    tick(e, 150);
    assert.deepEqual(e.enemies.map(enemy => enemy.currentHp), hp, 'an interrupted invocation continued striking');
  });
}

test('melee: a super never acquires a different target after the confirmed target dies', () => {
  const e = make('Smash', 'liquid_snake'); const actor = e.heroes[0];
  assert.equal(e.triggerAbility(actor, 'special'), true);
  const replacement = e.enemies[1]; const hp = replacement.currentHp;
  e.applyDamage(actor, e.enemies[0], 100000);
  tick(e, 42);
  assert.equal(replacement.currentHp, hp);
  assert.equal(e.signatureDirector.busy, false);
  assert.equal(actor.actionPending, false);
  assert.equal(actor.specialCharge, 0, 'cancellation refunded an already reserved super');
});

test('melee: moved targets are revalidated against the actual source range before impact', () => {
  const e = make('Smash', 'liquid_snake', 1); const actor = e.heroes[0]; const target = e.enemies[0];
  assert.equal(e.triggerAbility(actor, 'special'), true);
  target.x = 730; const hp = target.currentHp;
  tick(e, 42);
  assert.equal(target.currentHp, hp);
  assert.equal(e.signatureDirector.busy, false);
  assert.equal(actor.actionPending, false);
});

test('melee: P2 cannot swap the actor to steal a prepared super or its reserved meter', () => {
  const e = make('Smash', 'liquid_snake');
  const template = heroes.find(hero => hero.id === 'liquid_snake');
  for (const enemy of e.enemies) Object.assign(enemy, { ...template, id: enemy.id, sourceId: template.id,
    currentHp: 10000, maxHp: 10000, specialCharge: 100, state: 'idle', action: null,
    x: 230, y: 250, facing: -1 });
  const caster = e.getActiveOpponent(); const other = e.enemies.find(enemy => enemy !== caster);
  assert.equal(e.triggerOpponentAbility('special'), true);
  assert.equal(e.setActiveOpponent(other.id), false);
  assert.equal(e.getActiveOpponent(), caster);
  tick(e, 42);
  assert.equal(other.specialCharge, 100);
  assert.equal(caster.specialCharge, 0);
});

test('melee: direct active-opponent replacement cancels the old cinematic instead of firing with the new actor', () => {
  const e = make('Smash', 'liquid_snake');
  const template = heroes.find(hero => hero.id === 'liquid_snake');
  for (const enemy of e.enemies) Object.assign(enemy, { ...template, id: enemy.id, sourceId: template.id,
    currentHp: 10000, maxHp: 10000, specialCharge: 100, state: 'idle', action: null,
    x: 230, y: 250, facing: -1 });
  const caster = e.getActiveOpponent(); const other = e.enemies.find(enemy => enemy !== caster);
  assert.equal(e.triggerOpponentAbility('special'), true);
  e.activeOpponentId = other.id;
  const hp = e.heroes[0].currentHp; tick(e, 42);
  assert.equal(e.heroes[0].currentHp, hp);
  assert.equal(other.specialCharge, 100);
  assert.equal(caster.actionPending, false);
});

for (const mode of ['RPG', 'Smash']) test(`${mode}: a snark's final local blast remains after its struck target dies`, () => {
  const e = make(mode, 'freeman'); const actor = e.heroes[0];
  // Kill both targets on the first bite. The last attack locations still explode.
  e.enemies.forEach(target => { target.currentHp = 1; });
  const hits = []; const original = e.applyDamage;
  e.applyDamage = (...args) => { hits.push(args); return original(...args); };
  assert.equal(e.signatureDirector.triggerInvocation(events['Half-Life'], actor), true);
  tick(e, 100);
  const friendly = hits.filter(([, defender]) => defender === actor);
  assert.equal(friendly.length, 1, 'the caster must not get artificial immunity because the prey died');
  assert.equal(friendly[0][2], 18);
  assert.notEqual(actor.state, 'idle', 'the cinematic erased its own final blast hit reaction');
  assert.notEqual(actor.state, 'signature');
  assert.equal(actor.actionPending, false);
});

test('RPG: cancelling an unrelated director scene never erases a committed native summon callback', () => {
  const e = make('RPG', 'arca_bastion'); const actor = e.heroes[0];
  assert.equal(e.executeRpgAction(e.getActionContext(actor, 'secondary', 'player'), [actor.battleId]), true);
  tick(e, 42);
  assert.ok(actor.actionPending, 'native delayed action should own the lock after reveal');
  e.signatureDirector.cancel();
  assert.ok(actor.actionPending, 'the director cleared a lock already transferred to the native engine');
  tick(e, 35);
  assert.equal(actor.actionPending, false);
  assert.ok(actor.rpgGuardTicks > 0);
});

test('RPG: direct nonlethal state interruption is cleaned on the next simulation tick', () => {
  const e = make(); const actor = e.heroes[0];
  e.signatureDirector.triggerInvocation(events['Final Fantasy VII'], actor);
  actor.state = 'hit'; actor.stateTimer = 15;
  tick(e);
  assert.equal(e.signatureDirector.busy, false);
  assert.equal(actor.actionPending, false);
  assert.equal(actor.state, 'hit');
});

test('Smash: source Nihilanth crystals receive summon hits without inventing enemy kills or bypassing the closed head', async () => {
  const { CANON_PRIORITY_STAGES } = await vite.ssrLoadModule('/src/game/canonPriorityStages.js');
  const { ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js');
  const { resolveStageEnemyData } = await vite.ssrLoadModule('/src/game/stageEnemyResolver.js');
  const stage = { ...CANON_PRIORITY_STAGES.xenNihilanth, disableHazards: true, stageEventIntensity: 'off' };
  const data = resolveStageEnemyData({ stage, ...ENEMIES_DB[stage.universe] });
  const engine = new EngineSmash(960, 540, [heroes.find(hero => hero.id === 'freeman')], data,
    { add() {} }, () => {}, () => {}, stage);
  engines.push(engine); engine.syncPreMatchFromServer(3000); engine.completeMeleeIntros();
  Object.assign(engine.heroes[0], { maxHp: 50000, currentHp: 50000 });
  for (let i = 0; engine.wave < engine.maxWaves && i < 10; i++) {
    engine.enemies.forEach(enemy => Object.assign(enemy, { currentHp: 0, state: 'dead', stateTimer: 0 }));
    tick(engine);
  }
  assert.ok(engine.nihilanthEncounter.boss);
  Object.assign(engine.heroes[0], { state: 'idle', action: null, charging: false, guarding: false, ledge: null });
  installSignatureDirector(engine, { mode: 'Smash' });
  const kills = engine.defeatedEnemies;
  assert.equal(engine.signatureDirector.triggerInvocation(events['Half-Life'], engine.heroes[0]), true);
  tick(engine, 100);
  assert.ok(engine.nihilanthEncounter.crystals.every(crystal => crystal.currentHp === 0));
  assert.equal(engine.defeatedEnemies, kills);
  assert.ok(engine.nihilanthEncounter.boss.currentHp > 0);
  assert.equal(engine.nihilanthEncounter.headOpen, false, 'summon bypassed the source head-opening sequence');
});

test('every explicit actor binding completes in both native engines with one item usage', async t => {
  const { SIGNATURE_INVOCATIONS } = await vite.ssrLoadModule('/src/game/signatureCatalog.js');
  for (const definition of Object.values(SIGNATURE_INVOCATIONS)) for (const actorId of definition.actors) {
    for (const mode of ['RPG', 'Smash']) await t.test(`${mode} ${definition.universe} ${actorId}`, () => {
      const engine = make(mode, actorId);
      const actor = engine.heroes[0]; const event = events[definition.universe];
      assert.equal(engine.signatureDirector.triggerInvocation(event, actor), true);
      tick(engine, definition.windupTicks + definition.revealTicks
        + (definition.hits - 1) * definition.hitGapTicks + definition.outroTicks);
      assert.equal(engine.signatureDirector.busy, false);
      assert.equal(actor.actionPending, false);
      // Restore readiness only for the retry probe; the separate blast tests
      // require the real hit reaction to survive the cinematic.
      Object.assign(actor, { atb: 100, state: 'idle', action: null, charging: false, guarding: false, ledge: null });
      assert.equal(engine.signatureDirector.eventReadiness(event, actor).reason, 'spent');
    });
  }
});
