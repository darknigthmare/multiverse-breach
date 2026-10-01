import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { applyCanonBlackPearlSourceKit } from '../src/game/canonBlackPearlSourceKits.js';

let vite;
let EngineSmash;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?black-pearl-smash-ammo'));
});
after(async () => { await vite?.close(); });

const sourceJack = () => applyCanonBlackPearlSourceKit(getHeroById('jack_sparrow_potc'));
const threat = { id: 'ammo-test-threat', name: 'Threat', hp: 10000, atk: 1, def: 0, spd: 1, weapon: 'melee' };
function makeEngine({ heroes = [sourceJack()], unlock = true, campaign = false, opponent = null } = {}) {
  const calls = [];
  const sounds = [];
  const stage = { universe: 'Nexus de Convergence', disableHazards: true,
    ...(!campaign ? { customBattle: { singleRoster: true, opponentControl: opponent ? 'p2' : 'cpu' } } : {}) };
  const roster = opponent ? [opponent] : [threat];
  const engine = new EngineSmash(760, 420, heroes, { monsters: [threat], bosses: [], customRoster: roster },
    { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, stage);
  if (unlock) engine.syncPreMatchFromServer(3000);
  engine.heroes.forEach((hero, index) => Object.assign(hero, {
    x: 100 + index * 10, y: 300, vx: 0, vy: 0, facing: 1,
    ...(unlock ? { state: 'idle', stateTimer: 0 } : {}), specialCharge: 0
  }));
  engine.enemies.forEach(enemy => Object.assign(enemy, { x: 250, y: 300, vx: 0, vy: 0,
    ...(unlock ? { state: 'idle', stateTimer: 0 } : {}) }));
  engine.particleCalls = calls;
  engine.soundCues = sounds;
  calls.length = 0;
  sounds.length = 0;
  return engine;
}
const snapshot = (engine, actor = engine.heroes[0]) => ({
  state: actor.state, stateTimer: actor.stateTimer, cooldown: actor.cooldown,
  charge: actor.specialCharge, ammo: actor.sourceAmmoRemaining,
  x: actor.x, y: actor.y, vx: actor.vx, vy: actor.vy,
  partyHp: engine.heroes.map(hero => hero.currentHp),
  targetHp: engine.enemies.map(enemy => enemy.currentHp),
  particles: engine.particleCalls.length, sounds: engine.soundCues.length
});
const shoot = (engine, actor = engine.heroes[0]) => engine.triggerAbility(actor, 'secondary');

test('Jack 2003 has one runtime bullet and a real manual secondary damages one in-range target', () => {
  const template = sourceJack();
  const before = structuredClone(template);
  const engine = makeEngine({ heroes: [template] });
  const actor = engine.heroes[0];
  const target = engine.enemies[0];
  const hp = target.currentHp;
  assert.equal(actor.sourceAmmoRemaining, 1);
  assert.equal(shoot(engine), true);
  assert.equal(actor.sourceAmmoRemaining, 0);
  assert.ok(target.currentHp < hp);
  assert.equal(actor.cooldown, actor.secondary.cd * 60);
  assert.ok(engine.particleCalls.some(call => call[7] === 'bullet'));
  assert.ok(engine.particleCalls.some(call => call[7] === 'smoke'));
  assert.equal(engine.particleCalls.some(call => call[7] === 'laser_line'), false);
  assert.deepEqual(template, before, 'battle ammunition leaked into the shared authored hero');
});

test('cooldown expiration does not reload the reserve and exhausted input spends no state or resource', () => {
  // A neutral local opponent keeps the full simulation running through the
  // cooldown without campaign AI ending this ammunition check by ringout.
  const engine = makeEngine({ opponent: threat });
  const actor = engine.heroes[0];
  assert.equal(shoot(engine), true);
  const cooldown = actor.cooldown;
  for (let tick = 0; tick <= cooldown; tick++) engine.update({});
  assert.equal(engine.gameOver, false);
  assert.equal(actor.cooldown, 0);
  assert.equal(actor.sourceAmmoRemaining, 0);
  const before = snapshot(engine);
  assert.equal(shoot(engine), false);
  assert.deepEqual(snapshot(engine), before);
});

for (const [description, mutate] of [
  ['target beyond the 300-pixel range', engine => { engine.enemies[0].x = 410; }],
  ['target behind Jack', engine => { engine.enemies[0].x = 50; }],
  ['target outside the vertical reach', engine => { engine.enemies[0].y = 350; }],
  ['dead target', engine => { engine.enemies[0].currentHp = 0; engine.enemies[0].state = 'dead'; }],
  ['dead actor', engine => { engine.heroes[0].currentHp = 0; engine.heroes[0].state = 'dead'; }],
  ['paused battle', engine => { engine.setPaused(true); }],
  ['battle already over', engine => { engine.gameOver = true; }],
  ['actor in hit stun', engine => { engine.heroes[0].state = 'hitStun'; engine.heroes[0].stateTimer = 20; }],
  ['actor in a committed melee action', engine => { engine.heroes[0].action = { id: 'simple' }; }],
  ['cooldown still active', engine => { engine.heroes[0].cooldown = 5; }]
]) test(`${description} rejects the reserved shot without consuming a bullet or any combat state`, () => {
  const engine = makeEngine();
  mutate(engine);
  const before = snapshot(engine);
  assert.notEqual(shoot(engine), true);
  assert.deepEqual(snapshot(engine), before);
  assert.equal(engine.heroes[0].sourceAmmoRemaining, 1);
});

test('the pre-match lock rejects the shot and the same untouched bullet becomes usable after match start', () => {
  const engine = makeEngine({ unlock: false });
  assert.equal(engine.isMatchInputLocked(), true);
  const before = snapshot(engine);
  assert.notEqual(shoot(engine), true);
  assert.deepEqual(snapshot(engine), before);
  engine.syncPreMatchFromServer(3000);
  assert.equal(shoot(engine), true);
  assert.equal(engine.heroes[0].sourceAmmoRemaining, 0);
});

test('direct profiled entry cannot spend or fire a paused, unstarted or detached source actor', () => {
  for (const lock of ['paused', 'unstarted', 'detached']) {
    const engine = makeEngine({ unlock: lock !== 'unstarted' });
    const actor = engine.heroes[0];
    if (lock === 'paused') engine.setPaused(true);
    if (lock === 'detached') engine.heroes = [];
    const before = snapshot(engine, actor);
    assert.equal(engine.triggerProfiledAbility(actor, 'secondary', engine.enemies), false, lock);
    assert.deepEqual(snapshot(engine, actor), before, lock);
  }
});

test('sword actions, special, defense and hero switches leave a spent reserve empty', () => {
  const engine = makeEngine({ heroes: [sourceJack(), getHeroById('will_turner_potc')] });
  const actor = engine.heroes[0];
  assert.equal(shoot(engine), true);
  engine.enemies[0].x = actor.x + 30;
  engine.triggerAbility(actor, 'simple');
  actor.specialCharge = 100;
  assert.equal(engine.triggerAbility(actor, 'special'), true);
  engine.triggerAbility(actor, 'defense');
  assert.equal(engine.setActiveHero(engine.heroes[1].id), true);
  assert.equal(engine.setActiveHero(actor.id), true);
  assert.equal(actor.sourceAmmoRemaining, 0);
});

test('an actual campaign wave advance does not reload Jack', () => {
  const engine = makeEngine({ campaign: true });
  const actor = engine.heroes[0];
  assert.equal(shoot(engine), true);
  const previousWave = engine.wave;
  engine.enemies.forEach(enemy => { enemy.currentHp = 0; enemy.stateTimer = 0; });
  engine.update({});
  assert.equal(engine.wave, previousWave + 1);
  assert.equal(actor.sourceAmmoRemaining, 0);
});

test('each runtime clone has its own reserve, and a fresh battle explicitly restores its one shot', () => {
  const first = sourceJack();
  const clone = { ...sourceJack(), id: 'jack-party-clone', sourceId: 'jack_sparrow_potc' };
  const engine = makeEngine({ heroes: [first, clone] });
  assert.deepEqual(engine.heroes.map(actor => actor.sourceAmmoRemaining), [1, 1]);
  assert.equal(shoot(engine, engine.heroes[0]), true);
  assert.deepEqual(engine.heroes.map(actor => actor.sourceAmmoRemaining), [0, 1]);
  assert.equal(engine.setActiveHero(clone.id), true);
  assert.equal(shoot(engine, engine.getActiveHero()), true);
  assert.deepEqual(engine.heroes.map(actor => actor.sourceAmmoRemaining), [0, 0]);
  const fresh = makeEngine({ heroes: [engine.heroes[0]] });
  assert.equal(fresh.heroes[0].sourceAmmoRemaining, 1, 'new-battle reset is the declared gameplay adaptation');
  assert.equal(engine.heroes[0].sourceAmmoRemaining, 0, 'fresh battle mutated the old runtime');
});

test('local P2 source IDs enforce the same single bullet and preserve the other party reserve', () => {
  const engine = makeEngine({ opponent: sourceJack() });
  const player = engine.heroes[0];
  const opponent = engine.enemies[0];
  Object.assign(opponent, { x: 250, y: 300, facing: -1 });
  assert.equal(opponent.sourceId, 'jack_sparrow_potc');
  assert.equal(opponent.sourceAmmoRemaining, 1);
  const playerHp = player.currentHp;
  assert.equal(engine.triggerOpponentAbility('secondary'), true);
  assert.ok(player.currentHp < playerHp);
  assert.equal(opponent.sourceAmmoRemaining, 0);
  assert.equal(player.sourceAmmoRemaining, 1);
  opponent.cooldown = 0;
  const before = snapshot(engine, opponent);
  assert.equal(engine.triggerOpponentAbility('secondary'), false);
  assert.deepEqual(snapshot(engine, opponent), before);
});

for (const [description, override] of [
  ['another Jack incarnation', { incarnation: 'Pirates of the Caribbean: Dead Man s Chest (2006) - Captain Jack Sparrow' }],
  ['another universe', { universe: 'Nexus de Convergence' }],
  ['absent universe', { universe: undefined }],
  ['another source identity', { id: 'custom-jack-lookalike', sourceId: 'custom-jack-lookalike' }],
  ['unreviewed combat presentation', { canonCombatPresentation: false }]
]) test(`${description} retains the reusable generic secondary without a source reserve`, () => {
  const engine = makeEngine({ heroes: [{ ...sourceJack(), ...override }] });
  const actor = engine.heroes[0];
  assert.equal(Object.hasOwn(actor, 'sourceAmmoRemaining'), false);
  assert.equal(shoot(engine), true);
  actor.cooldown = 0;
  assert.equal(shoot(engine), true);
});

test('Will and Elizabeth keep their physical reusable secondaries without receiving Jack ammunition', () => {
  for (const id of ['will_turner_potc', 'elizabeth_swann_potc']) {
    const engine = makeEngine({ heroes: [getHeroById(id)] });
    const actor = engine.heroes[0];
    engine.enemies[0].x = 140;
    assert.equal(Object.hasOwn(actor, 'sourceAmmoRemaining'), false, id);
    assert.equal(shoot(engine), true, id);
    actor.cooldown = 0;
    assert.equal(shoot(engine), true, id);
  }
});
