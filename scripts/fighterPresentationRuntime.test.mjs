import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let vite;
let EngineFighter;
const noop = () => {};
const particles = { add: noop };
const hero = (id, special = {}) => ({
  id, name: id, universe: 'Test Universe',
  primaryColor: '#39c5bb', secondaryColor: '#ffea00', weaponType: 'melee',
  stats: { hp: 180, atk: 18, def: 9, spd: 15 },
  simple: { name: 'Strike', type: 'melee', dmg: 1 },
  special: { name: 'Named blade technique', type: 'melee', dmg: 2, ...special }
});
const advance = (engine, seconds) => {
  for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 60) engine.update(1 / 60);
};
const makeEngine = (onComplete = noop, options = {}) => new EngineFighter(
  960, 540, [hero('player'), hero('reserve')], [hero('opponent')], particles, noop, onComplete,
  { opponentControl: 'p2', ...options }
);
const canvasContext = () => {
  const labels = [];
  const methods = {
    fillText(text) { labels.push(String(text)); },
    createLinearGradient() { return { addColorStop: noop }; },
    createRadialGradient() { return { addColorStop: noop }; }
  };
  return new Proxy(methods, {
    get(target, key) { return key === 'labels' ? labels : target[key] || noop; },
    set(target, key, value) { target[key] = value; return true; }
  });
};
const knockOutCpu = engine => {
  const attacker = engine.getActive('player');
  const target = engine.getActive('cpu');
  target.currentHp = 1;
  target.invulnerable = 0;
  engine.applyHit(attacker, target, { type: 'heavy', base: 999, guardDamage: 20, knockback: 200 });
  advance(engine, 1.2);
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?presentation-tests'));
});
after(async () => { await vite?.close(); });

test('character introductions freeze combat, controls and the round timer before the countdown', () => {
  const engine = makeEngine();
  const snapshot = engine.getSnapshot();
  assert.equal(snapshot.phase, 'intro');
  assert.equal(snapshot.presentation.entries[0].fighterId, 'player');
  assert.equal(snapshot.presentation.entries[1].fighterId, 'opponent');
  assert.equal(snapshot.presentation.entries[0].identity.sourceHeroId, 'player');
  engine.getActive('player').meter = 100;
  engine.getActive('cpu').meter = 100;
  assert.equal(engine.triggerPlayerAction('super'), false);
  assert.equal(engine.triggerSideAction('cpu', 'light'), false);
  const positions = [engine.getActive('player').x, engine.getActive('cpu').x];
  engine.setInput({ right: true });
  engine.setSideInput('cpu', { left: true });
  advance(engine, 1);
  assert.equal(engine.timer, 99);
  assert.deepEqual([engine.getActive('player').x, engine.getActive('cpu').x], positions);
  advance(engine, engine.characterIntroDuration + 0.1);
  assert.equal(engine.getSnapshot().phase, 'countdown');
  assert.equal(engine.timer, 99);
  advance(engine, 4);
  assert.equal(engine.getSnapshot().phase, 'running');
  assert.ok(engine.timer < 99);
});

test('the first round shows both outcomes without completing or rewarding the match', () => {
  const completed = [];
  const engine = makeEngine((...args) => completed.push(args));
  engine.countdown = 0;
  knockOutCpu(engine);
  assert.equal(engine.finished, false);
  assert.equal(engine.result, null);
  assert.deepEqual(engine.roundWins, { player: 1, cpu: 0 });
  const snapshot = engine.getSnapshot();
  assert.equal(snapshot.phase, 'roundResult');
  assert.deepEqual(snapshot.presentation.entries.map(entry => entry.actorPhase), ['roundVictory', 'roundDefeat']);
  assert.equal(engine.triggerSideAction('cpu', 'super'), false);
  assert.equal(completed.length, 0);
  assert.deepEqual(engine.getSummary().rewards, { gold: 0, shards: 0, seasonXp: 0 });
});

test('round restart restores both rosters and resources with the score preserved', () => {
  const engine = makeEngine(noop, {
    fieldSuper: { id: 'field', color: '#ffffff', effect: { damage: 20 } },
    cosmetics: { npcAssist: { id: 'assist', effect: {} } }
  });
  engine.countdown = 0;
  engine.getActive('player').meter = 73;
  engine.getActive('player').guard = 16;
  engine.getActive('player').superBuffSeconds = 50;
  engine.getActive('player').superBuffMultiplier = 1.6;
  engine.fieldSuperUsed = true;
  engine.fieldSuperCharge = 0;
  engine.assists.player.used = true;
  engine.assists.player.charge = 0;
  engine.teams.player.fighters[1].currentHp = 0;
  engine.endRound('victory');
  advance(engine, 1.5);
  assert.equal(engine.roundNumber, 2);
  assert.equal(engine.getSnapshot().phase, 'countdown');
  assert.deepEqual(engine.roundWins, { player: 1, cpu: 0 });
  for (const team of Object.values(engine.teams)) {
    assert.equal(team.activeIndex, 0);
    for (const member of team.fighters) {
      assert.equal(member.currentHp, member.maxHp);
      assert.equal(member.guard, 100);
      assert.equal(member.meter, 0);
      assert.equal(member.superBuffSeconds, 0);
      assert.equal(member.superGuardSeconds, 0);
    }
  }
  assert.equal(engine.fieldSuperUsed, false);
  assert.equal(engine.fieldSuperCharge, 20);
  assert.equal(engine.assists.player.used, false);
  assert.equal(engine.assists.player.charge, 40);
  assert.equal(engine.getSummary().fieldSuperUsed, true, 'match report retains first-round resource usage');
});

test('a lost opening round does not finish the match and the player can win the next two', () => {
  const completed = [];
  const engine = makeEngine((...args) => completed.push(args));
  engine.countdown = 0;
  engine.endRound('defeat');
  assert.equal(engine.getSnapshot().presentation.entries[0].actorPhase, 'roundDefeat');
  advance(engine, 1.5);
  engine.countdown = 0;
  engine.endRound('victory');
  advance(engine, 1.5);
  engine.countdown = 0;
  engine.endRound('victory');
  assert.equal(engine.finished, true);
  assert.equal(engine.result, 'victory');
  assert.deepEqual(engine.roundWins, { player: 2, cpu: 1 });
  assert.equal(completed.length, 0);
  advance(engine, 9);
  assert.equal(completed.length, 1);
  assert.equal(completed[0][1].rounds.length, 3);
});

test('finale, victory and outro use the winner identity and cannot deal further damage', () => {
  const completed = [];
  const engine = makeEngine((...args) => completed.push(args));
  engine.countdown = 0;
  engine.endRound('victory');
  advance(engine, 1.5);
  engine.countdown = 0;
  engine.endRound('victory');
  assert.equal(engine.getSnapshot().phase, 'fatality');
  const finisher = engine.getSnapshot().presentation.entries[0];
  assert.equal(finisher.fighterId, 'player');
  assert.equal(finisher.identity.sourceAbility.name, 'Named blade technique');
  assert.match(finisher.identity.description, /adaptée/);
  assert.equal(finisher.identity.provenance.canonicalSequence, false);
  const hp = engine.getActive('cpu').currentHp;
  const damage = engine.stats.player.damage;
  engine.applyHit(engine.getActive('player'), engine.getActive('cpu'), { type: 'super', base: 999, knockback: 300, guardDamage: 30 });
  assert.equal(engine.getActive('cpu').currentHp, hp);
  assert.equal(engine.stats.player.damage, damage);
  const seen = new Set();
  for (let frame = 0; frame < 600; frame += 1) {
    seen.add(engine.getSnapshot().phase);
    engine.update(1 / 60);
  }
  assert.ok(seen.has('fatality'));
  assert.ok(seen.has('victory'));
  assert.ok(seen.has('outro'));
  assert.equal(completed.length, 1);
  assert.equal(engine.endRound('victory'), false);
  assert.equal(engine.finish('defeat'), false);
  advance(engine, 4);
  assert.equal(completed.length, 1);
});

test('support supers heal their intended team without damaging the opponent', () => {
  const engine = new EngineFighter(960, 540,
    [hero('healer', { name: 'Healing light', type: 'heal_aoe', healRatio: 0.4 }), hero('ally')],
    [hero('opponent')], particles, noop, noop, { opponentControl: 'p2' });
  engine.countdown = 0;
  const caster = engine.getActive('player');
  caster.meter = 100;
  engine.teams.player.fighters.forEach(member => { member.currentHp = member.maxHp * 0.4; });
  const opponentHp = engine.getActive('cpu').currentHp;
  assert.equal(engine.tryAction('player', 'super'), true);
  advance(engine, 0.7);
  assert.ok(engine.teams.player.fighters.every(member => member.currentHp >= member.maxHp * 0.79));
  assert.equal(engine.getActive('cpu').currentHp, opponentHp);
  assert.equal(engine.stats.player.damage, 0);
});

test('the presentation renderer displays the character, universe and real source ability through every phase', () => {
  const engine = makeEngine(noop, { roundsToWin: 1 });
  let ctx = canvasContext();
  engine.draw(ctx, 0);
  assert.ok(ctx.labels.includes('player'));
  assert.ok(ctx.labels.some(label => label.includes('Test Universe · Named blade technique')));
  engine.countdown = 0;
  engine.endRound('victory');
  for (const expectedPhase of ['fatality', 'victory', 'outro']) {
    assert.equal(engine.getSnapshot().phase, expectedPhase);
    ctx = canvasContext();
    engine.draw(ctx, engine.elapsed * 60);
    assert.ok(ctx.labels.some(label => label.includes('player')));
    const duration = engine.presentation.remaining;
    advance(engine, duration + 0.02);
  }
});
