import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';
import { grantBattleItemShield } from '../src/game/battleItemShield.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { EngineFighter } = await import('../src/game/engineFighter.js');

const dummy = { id: 'wizard-dummy', name: 'Training', universe: 'Test', weaponType: 'melee',
  stats: { hp: 250, atk: 18, def: 8, spd: 7 }, simple: { name: 'Training strike', type: 'melee', dmg: 1 } };
const advance = (engine, ticks) => {
  for (let step = 0; step < ticks; step++) engine.update(1 / 60);
};
const until = (engine, predicate) => {
  for (let step = 0; step < 120 && !predicate(); step++) advance(engine, 1);
  assert.ok(predicate(), 'the expected combat event was reached in two seconds');
};

function mount(t, id, side = 'player', { gap = 245, hero = getHeroById(id) } = {}) {
  const particles = [];
  const sounds = [];
  const ownTeam = [hero, { ...dummy, id: 'own-reserve' }];
  const otherTeam = [dummy, { ...dummy, id: 'other-reserve' }];
  const engine = new EngineFighter(960, 540, side === 'player' ? ownTeam : otherTeam,
    side === 'cpu' ? ownTeam : otherTeam, { add: (...args) => particles.push(args) }, sound => sounds.push(sound), () => {},
    { opponentControl: 'p2' });
  t.after(() => engine.dispose());
  engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getOpponent(side);
  const reserve = engine.getTeam(target.side).fighters[1];
  const facing = side === 'player' ? 1 : -1;
  actor.x = side === 'player' ? 185 : 775;
  target.x = actor.x + facing * gap;
  reserve.x = actor.x + facing * 110;
  actor.meter = 100;
  return { engine, actor, target, particles, sounds, reserve, input: command => engine.triggerSideAction(side, command) };
}

const spells = {
  harry: { light: ['Expelliarmus', '#ed6456', 0.24], heavy: ['Stupefy', '#e35c5c', 0.62],
    special: ['Stupefy', '#e35c5c', 0.62], super: ['Dumbledore s Army Stupefy Duel', '#e35c5c', 0.92] },
  hermione: { light: ['Stupefy', '#e35c5c', 0.62], heavy: ['Expelliarmus', '#ed6456', 0.42],
    special: ['Expelliarmus', '#ed6456', 0.24], super: ['Dumbledore s Army Stunning Duel', '#e35c5c', 0.92] }
};

for (const [id, commands] of Object.entries(spells)) for (const side of ['player', 'cpu']) {
  test(`Duel ${side} ${id} launches each named spell and strikes only the active opponent`, t => {
    for (const [command, [name, color, hitstun]] of Object.entries(commands)) {
      const { engine, actor, target, particles, sounds, reserve, input } = mount(t, id, side);
      assert.equal(input(command), true);
      assert.equal(actor.action.identity?.name, name);
      assert.equal(actor.action.identity.provenance.identityAuthored, false);
      assert.equal(actor.action.delivery, 'projectile');
      assert.equal(actor.action.range, 300);
      assert.equal(actor.meter, command === 'super' ? 0 : command === 'special' ? 70 : 100);
      advance(engine, Math.floor(actor.action.hitAt * 30));
      assert.equal(engine.projectiles.length, 0);
      assert.equal(target.currentHp, target.maxHp);
      until(engine, () => engine.projectiles.length === 1);
      const bolt = engine.projectiles[0];
      assert.equal(bolt.canonParticleType, 'spell_bolt');
      assert.equal(bolt.color, color);
      assert.equal(bolt.maxRange, 300);
      assert.equal(bolt.vx, side === 'player' ? 520 : -520);
      assert.equal(target.currentHp, target.maxHp);

      const draws = [];
      const ctx = new Proxy({ ellipse: (...args) => draws.push([ctx.fillStyle, ...args]) }, {
        get: (object, key) => key in object ? object[key] : () => {}
      });
      engine.drawProjectile(ctx, bolt);
      assert.deepEqual(draws.map(draw => draw.slice(0, 3)), [[color, bolt.x, bolt.y]]);
      assert.ok(draws[0][3] > draws[0][4]);
      assert.ok(!particles.some(particle => ['laser_line', 'patronus'].includes(particle[7])));

      until(engine, () => target.currentHp < target.maxHp);
      assert.equal(engine.projectiles.length, 0);
      assert.equal(target.hitstun, hitstun);
      assert.equal(reserve.currentHp, reserve.maxHp);
      assert.deepEqual(sounds, ['shield', 'hit']);
      const hpAfterHit = target.currentHp;
      advance(engine, 120);
      assert.equal(target.currentHp, hpAfterHit);
      assert.equal(target.hitstun, 0);
    }
  });
}

for (const condition of ['outside range', 'item shield', 'guard']) {
  test(`Stupefy does not stun when the opponent is ${condition}`, t => {
    const { engine, target, input } = mount(t, 'hermione', 'cpu', { gap: condition === 'outside range' ? 301 : 245 });
    if (condition === 'item shield') grantBattleItemShield(target, 10000);
    if (condition === 'guard') assert.equal(engine.setSideInput(target.side, { guard: true }), true);
    assert.equal(input('light'), true);
    until(engine, () => engine.projectiles.length === 1);
    until(engine, () => engine.projectiles.length === 0);
    assert.equal(target.hitstun, 0);
    assert.equal(target.currentHp < target.maxHp, condition === 'guard');
  });
}

test('Duel rejects different wizard editions and altered action or equipment provenance', t => {
  const harry = getHeroById('harry');
  for (const actor of [getHeroById('harry_potter'), getHeroById('hermione_granger'),
    { ...harry, universe: 'Other universe' }, { ...harry, incarnation: 'Film of 2009' },
    { ...harry, sourceHeroId: 'harry', sourceId: 'hermione' }, { ...harry, weaponType: 'staff' },
    { ...harry, equipment: [harry.equipment[1]] },
    { ...harry, simple: { ...harry.simple, name: 'Other spell' } },
    { ...harry, simple: { ...harry.simple, canonPresentation: { kind: 'spell', color: '#00ff00' } } }]) {
    const { actor: runtime, input } = mount(t, actor.id, 'player', { hero: actor });
    assert.equal(input('light'), true);
    assert.notEqual(runtime.action.canonSourceFeedback?.kind, 'spell');
  }
});

test('the exact projected P2 alias retains its own source spell', t => {
  const hermione = getHeroById('hermione');
  const { actor, input } = mount(t, 'hermione', 'cpu', { hero: { ...hermione, id: 'p2:hermione:0', sourceId: 'hermione' } });
  assert.equal(input('light'), true);
  assert.equal(actor.action.identity?.sourceHeroId, 'hermione');
  assert.equal(actor.action.identity?.name, 'Stupefy');
  assert.equal(actor.action.canonSourceFeedback.kind, 'spell');
});
