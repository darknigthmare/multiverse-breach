import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let vite, EngineFighter, EngineRpg, EngineSmash, HEROES_DB;
const originalImage = globalThis.Image, noop = () => {}, engines = [];
const ids = ['kirito_sao', 'aya_brea', 'bt_7274_tf2'];
const expected = { kirito_sao: 16, aya_brea: 7, bt_7274_tf2: 14 };
const hero = id => { const value = HEROES_DB.find(unit => unit.id === id); assert.ok(value, id); return value; };
const dummy = () => ({ id: 'sequence-target', name: 'Sequence target', universe: 'W16 test arena', weaponType: 'melee',
  stats: { hp: 100000, atk: 8, def: 0, spd: 1 }, simple: { name: 'Fixture strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Fixture shot', type: 'projectile', dmg: 1, cd: 3 },
  defense: { name: 'Fixture guard', type: 'guard', reduce: .4, dur: 1 },
  special: { name: 'Fixture special', type: 'melee', dmg: 1 } });

before(async () => {
  globalThis.Image = class { constructor() { this.complete = true; this.naturalWidth = 1024; this.naturalHeight = 2048; } };
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: { ignored: ['**/*'] } } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
after(async () => { engines.forEach(engine => engine.dispose?.()); await vite?.close(); globalThis.Image = originalImage; });

for (const id of ids) for (const side of ['player', 'enemy']) {
  test(`W16 Fighter ${side} ${id} emits its complete bounded sequence through the actual action clock`, () => {
    const unit = hero(id), enemy = dummy();
    const engine = new EngineFighter(1100, 600, side === 'player' ? [unit] : [enemy], side === 'enemy' ? [unit] : [enemy],
      { add: noop }, noop, noop, { opponentControl: 'p2' });
    engines.push(engine); engine.countdown = 0;
    const fighterSide = side === 'player' ? 'player' : 'cpu', actor = engine.getActive(fighterSide), target = engine.getOpponent(fighterSide);
    const direction = side === 'player' ? 1 : -1;
    actor.x = side === 'player' ? 260 : 840; target.x = actor.x + direction * (id === 'bt_7274_tf2' ? 390 : 100);
    actor.facing = direction; target.facing = -direction;
    for (const body of [actor, target]) { body.currentHp = body.maxHp = 100000; body.hitstun = 0; }
    actor.meter = 100; actor.attackPower = 40;
    const releases = [], contacts = [], spawn = engine.spawnProjectile, impact = engine.applyHit;
    engine.spawnProjectile = function(source, action) { if (source === actor) releases.push(action.sequenceIndex); return spawn.call(this, source, action); };
    engine.applyHit = function(source, victim, action, ...rest) {
      if (source === actor && action.sequenceParent) contacts.push(action.sequenceIndex);
      return impact.call(this, source, victim, action, ...rest);
    };
    assert.equal(engine.tryAction(fighterSide, 'super'), true);
    const action = actor.action;
    let remaining = 1200;
    while (actor.action === action && remaining-- > 0) engine.update(1 / 60);
    assert.ok(remaining > 0, 'the real action must finish, including accepted-hit stop frames');
    for (let frame = 0; frame < 60; frame++) engine.update(1 / 60);
    const observed = id === 'bt_7274_tf2' ? releases : id === 'kirito_sao' ? action.sourceBladeContactsWave16.map(contact => contact.index) : contacts;
    assert.equal(observed.length, expected[id]); assert.equal(new Set(observed).size, expected[id]);
    assert.ok(target.currentHp < target.maxHp);
    assert.ok(action.sequenceDamageBudgets[target.runtimeId].spent <= action.sequenceDamageBudgets[target.runtimeId].limit);
    if (id === 'kirito_sao') assert.ok(action.sourceBladeContactsWave16.filter(contact => contact.acceptedDamage).every(contact => contact.physicalOverlap));
  });

  test(`W16 RPG ${side} ${id} resolves separate timed contacts and spends once`, () => {
    const unit = hero(id), enemy = dummy();
    const own = side === 'player' ? [unit] : [enemy], other = side === 'enemy' ? [unit] : [enemy];
    const engine = new EngineRpg(1100, 600, own, { monsters: other, bosses: [], customRoster: other }, { add: noop }, noop, noop,
      { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
    engines.push(engine); engine.autoBattle = false; engine.enemyGlobalRecovery = 0;
    const actor = (side === 'player' ? engine.heroes : engine.enemies)[0], target = (side === 'player' ? engine.enemies : engine.heroes)[0];
    for (const body of [...engine.heroes, ...engine.enemies]) { body.currentHp = body.maxHp = 100000; body.atb = 0; body.specialCharge = 100; }
    actor.x = side === 'player' ? 400 : 700; target.x = side === 'player' ? 700 : 400;
    actor.y = target.y = 350;
    actor.atb = 100;
    const releases = [], impact = engine.applyRpgImpact;
    engine.applyRpgImpact = function(source, profile, ...rest) {
      if (source === actor && profile.sequenceParent) releases.push(profile.sequenceIndex);
      return impact.call(this, source, profile, ...rest);
    };
    const targetId = target.battleId || target.runtimeId || target.id;
    assert.equal(side === 'player' ? engine.triggerAbility(actor, 'special', [targetId])
      : engine.triggerEnemyAbility(actor, 'special', [targetId]), true);
    assert.equal(actor.specialCharge, 0);
    const sequence = actor.rpgSourceSequence; assert.ok(sequence);
    for (let frame = 0; frame < 530; frame++) engine.update();
    assert.equal(releases.length, expected[id]); assert.equal(new Set(releases).size, expected[id]);
    assert.equal(actor.actionPending, false); assert.ok(target.currentHp < target.maxHp);
    assert.ok(sequence.sequenceDamageBudgets[targetId].spent <= sequence.sequenceDamageBudgets[targetId].limit);
  });

  test(`W16 Melee ${side} ${id} uses the native action schedule without changing its selected targets`, () => {
    const unit = hero(id), enemy = dummy();
    const own = side === 'player' ? [unit] : [enemy], other = side === 'enemy' ? [unit] : [enemy];
    const engine = new EngineSmash(1100, 600, own, { monsters: other, bosses: [], customRoster: other }, { add: noop }, noop, noop,
      { id: 'w16-sequence', universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true,
        customBattle: { singleRoster: true, opponentControl: 'p2' } });
    engines.push(engine); engine.syncPreMatchFromServer(3000);
    const actor = (side === 'player' ? engine.heroes : engine.enemies)[0], target = (side === 'player' ? engine.enemies : engine.heroes)[0];
    actor.x = side === 'player' ? 350 : 750; target.x = actor.x + (side === 'player' ? 1 : -1) * 100;
    actor.y = target.y = engine.arena.groundY; actor.facing = side === 'player' ? 1 : -1;
    for (const body of [...engine.heroes, ...engine.enemies]) { body.currentHp = body.maxHp = 100000; body.state = 'idle'; body.stateElapsed = 0; body.action = null; body.specialCharge = 100; }
    const releases = [], resolve = engine.resolveMeleeSuperHit;
    engine.resolveMeleeSuperHit = function(source, action) {
      if (source === actor && action.sourceSequenceImpact) releases.push(action.sourceSequenceImpact.index);
      return resolve.call(this, source, action);
    };
    assert.equal(engine.triggerMeleeSuper(actor), true);
    const action = actor.action;
    engine.completeMeleeIntros();
    for (let frame = 0; frame < Math.ceil((action.duration + .1) * 60); frame++) engine.update();
    assert.equal(releases.length, expected[id]); assert.equal(new Set(releases).size, expected[id]);
    assert.ok(target.currentHp < target.maxHp);
    assert.ok(action.sequenceDamageBudgets[target.battleId || target.runtimeId || target.id].spent
      <= action.sequenceDamageBudgets[target.battleId || target.runtimeId || target.id].limit);
  });
}
function kiritoPhysicalFixture(mode, side) {
  const kirito = hero('kirito_sao'), opposition = dummy(), player = side === 'player' ? kirito : opposition, enemy = side === 'enemy' ? kirito : opposition;
  const engine = mode === 'fighter' ? new EngineFighter(1100, 650, [player], [enemy], { add: noop }, noop, noop, { opponentControl: 'p2' })
    : new EngineSmash(1100, 650, [player], { monsters: [enemy], bosses: [], customRoster: [enemy] }, { add: noop }, noop, noop,
      { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine); if (mode === 'fighter') engine.countdown = 0; else { engine.syncPreMatchFromServer(3000); engine.completeMeleeIntros(); }
  const commandSide = side === 'player' ? 'player' : 'cpu';
  const actor = mode === 'fighter' ? engine.getActive(commandSide) : (side === 'player' ? engine.heroes : engine.enemies)[0];
  const target = mode === 'fighter' ? engine.getOpponent(commandSide) : (side === 'player' ? engine.enemies : engine.heroes)[0];
  const direction = side === 'player' ? 1 : -1;
  for (const body of [actor,target]) { body.currentHp = body.maxHp = 100000; body.state = 'idle'; body.action = null; body.stateTimer = 0; body.meter = body.specialCharge = 100; body.vx = body.vy = 0; }
  actor.x = side === 'player' ? 400 : 700; target.x = actor.x + direction * 100;
  actor.y = target.y = mode === 'fighter' ? engine.groundY : engine.arena.groundY;
  actor.facing = direction; target.facing = -direction;
  const start = { x: actor.x, y: actor.y }, tick = () => mode === 'fighter' ? engine.update(1/60) : engine.update();
  assert.equal(mode === 'fighter' ? engine.tryAction(commandSide,'super') : engine.triggerMeleeSuper(actor), true);
  const action = actor.action;
  const finish = () => { let frames=0; while (actor.action === action && frames++ < 1000) tick(); assert.ok(frames < 1000); };
  return { engine, actor, target, start, direction, tick, action, finish };
}
for (const mode of ['fighter','melee']) for (const side of ['player','enemy']) {
  test(`Kirito ${mode}/${side}: bounded physical approach pauses and only real blade/hurtbox intersections deal damage`, () => {
    const c = kiritoPhysicalFixture(mode,side), initial = JSON.stringify({ actor:c.actor,target:c.target });
    c.engine.paused = true; for(let n=0;n<30;n++)c.tick(); assert.equal(JSON.stringify({actor:c.actor,target:c.target}),initial); c.engine.paused=false;
    c.finish(); const contacts=c.action.sourceBladeContactsWave16;
    assert.equal(c.action.sequenceCursor,16); assert.equal(contacts.length,16);
    assert.ok(contacts.some(contact=>contact.acceptedDamage));
    assert.ok(contacts.filter(contact=>contact.acceptedDamage).every(contact=>contact.physicalOverlap));
    assert.ok(c.action.sourceBladeApproachWave16.attempted<=80.00001);
    assert.ok(Math.abs(c.actor.x-c.start.x)<=80.00001); assert.equal(c.action.facing,c.direction);
    assert.ok(c.target.currentHp<c.target.maxHp);
  });
  test(`Kirito ${mode}/${side}: an escaping target cannot redirect the committed approach or receive remote damage`, () => {
    const c=kiritoPhysicalFixture(mode,side); for(let n=0;n<5;n++)c.tick();
    c.target.x=c.start.x+c.direction*400; c.finish();
    assert.equal(c.target.currentHp,c.target.maxHp); assert.equal(c.action.facing,c.direction);
    assert.equal(c.action.sourceBladeApproachWave16.cancelled,true);
    assert.ok(Math.abs(c.actor.x-c.start.x)<=80.00001);
  });
}
for (const side of ['player','enemy']) test(`Kirito melee/${side}: a visible platform blocks the physical body approach and produces no hidden sword hit`, () => {
  const c=kiritoPhysicalFixture('melee',side), near=c.start.x+c.direction*35,far=c.start.x+c.direction*50;
  c.engine.platforms.push({x1:Math.min(near,far),x2:Math.max(near,far),y:c.start.y-35,thickness:12,type:'fixture-visible-platform'});
  c.finish(); assert.equal(c.action.sourceBladeApproachWave16.blockedByPlatform,true);
  assert.equal(c.target.currentHp,c.target.maxHp); assert.ok(Math.abs(c.actor.x-c.start.x)<35);
});
