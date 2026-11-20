import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { EngineFighter } = await import('../src/game/engineFighter.js');

const dummy = { id: 'training', name: 'Training', universe: 'Test', weaponType: 'melee',
  stats: { hp: 250, atk: 18, def: 8, spd: 7 }, simple: { name: 'Training strike', type: 'melee', dmg: 1 } };
const advance = (engine, seconds) => {
  for (let step = 0; step < Math.round(seconds * 60); step += 1) engine.update(1 / 60);
};
const mount = (id, side, distance, source = getHeroById(id)) => {
  const particles = [];
  const sounds = [];
  const heroTeam = [source, { ...dummy, id: 'own-reserve' }];
  const otherTeam = [dummy, { ...dummy, id: 'other-reserve' }];
  const engine = new EngineFighter(960, 540, side === 'player' ? heroTeam : otherTeam,
    side === 'cpu' ? heroTeam : otherTeam, { add: (...args) => particles.push(args) },
    cue => sounds.push(cue), () => {}, { opponentControl: 'p2' });
  engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getOpponent(side);
  actor.x = side === 'player' ? 220 : 740;
  target.x = actor.x + (side === 'player' ? distance : -distance);
  return { engine, actor, target, particles, sounds, fire: command => engine.triggerSideAction(side, command) };
};

for (const side of ['player', 'cpu']) {
  test(`Duel ${side} Jack spends the shared gun reserve only at projectile release and retains it between rounds`, () => {
    const id = 'jack_sparrow_potc';
    const { engine, actor, target, particles, sounds, fire } = mount(id, side, 225);
    const hp = target.currentHp;
    const command = side === 'cpu' ? 'special' : 'heavy';
    actor.meter = 30;
    assert.deepEqual(engine.getSnapshot()[side].fighters[0].reservedShot, { remaining: 1, capacity: 1 });
    assert.equal(fire(command), true);
    assert.equal(actor.action.identity.name, getHeroById(id).secondary.name);
    assert.equal(actor.action.identity.provenance.identityAuthored, false);
    assert.equal(actor.action.range, 300);
    advance(engine, actor.action.hitAt / 2);
    assert.equal(actor.sourceAmmoRemaining, 1);
    assert.equal(engine.projectiles.length, 0);
    assert.equal(sounds.includes('shoot'), false);
    assert.equal(target.currentHp, hp);
    for (let step = 0; step < 60 && engine.projectiles.length === 0; step++) engine.update(1 / 60);
    const projectile = engine.projectiles[0];
    assert.equal(projectile.canonParticleType, 'bullet');
    assert.equal(projectile.maxRange, 300);
    assert.equal(projectile.radius, 3);
    assert.equal(target.currentHp, hp);
    assert.equal(actor.sourceAmmoRemaining, 0);
    assert.deepEqual(engine.getSnapshot()[side].fighters[0].reservedShot, { remaining: 0, capacity: 1 });
    assert.equal(particles.filter(row => row[7] === 'smoke').length, 1);
    assert.equal(particles.some(row => row[7] === 'laser_line'), false);
    advance(engine, 1.4);
    assert.ok(target.currentHp < hp);
    assert.equal(engine.projectiles.length, 0);
    assert.equal(sounds.filter(sound => sound === 'shoot').length, 1);
    assert.equal(engine.triggerSideAction(side, 'tag', 1), true);
    advance(engine, 5.6);
    assert.equal(engine.triggerSideAction(side, 'tag', 0), true);
    assert.equal(engine.getActive(side).sourceAmmoRemaining, 0);
    assert.equal(engine.endRound('victory'), true);
    advance(engine, 6);
    assert.equal(engine.roundNumber, 2);
    const fighter = engine.getActive(side);
    fighter.meter = 100;
    assert.equal(fighter.sourceAmmoRemaining, 0);
    assert.equal(fire('heavy'), false);
    assert.equal(fire('special'), false);
    assert.equal(fighter.meter, 100);
    assert.equal(fire('light'), true);
    assert.equal(fighter.action.identity.name, getHeroById(id).simple.name);
    assert.equal(fighter.action.delivery, 'melee');
    engine.dispose();
    const fresh = mount(id, side, 225, actor);
    assert.equal(fresh.actor.sourceAmmoRemaining, 1);
    fresh.engine.dispose();
  });
}

test('Duel interrupted windup and paused input do not spend the flintlock shot', () => {
  const { engine, actor, target, particles, sounds, fire } = mount('jack_sparrow_potc', 'player', 168);
  engine.setPaused(true);
  assert.equal(fire('heavy'), false);
  engine.setPaused(false);
  assert.equal(fire('heavy'), true);
  advance(engine, actor.action.hitAt / 2);
  engine.applyHit(target, actor, { base: 14, type: 'light', facing: -1, range: 90, guardDamage: 5, knockback: 0 });
  assert.equal(actor.action, null);
  advance(engine, 1);
  assert.equal(actor.sourceAmmoRemaining, 1);
  assert.equal(engine.projectiles.length, 0);
  assert.equal(particles.some(row => row[7] === 'smoke'), false);
  assert.equal(sounds.includes('shoot'), false);
  engine.dispose();
});

test('Duel a spent shot can miss physically and cannot become a generic shot', () => {
  const { engine, actor, target, fire } = mount('jack_sparrow_potc', 'player', 305);
  const hp = target.currentHp;
  assert.equal(fire('heavy'), true);
  advance(engine, 1.4);
  assert.equal(actor.sourceAmmoRemaining, 0);
  assert.equal(target.currentHp, hp);
  assert.equal(engine.projectiles.length, 0);
  engine.dispose();
});

for (const [id, command, near, far, kind] of [
  ['lilo_pelekai', 'light', 205, 305, 'camera_flash'],
  ['roger_rabbit', 'heavy', 66, 75, 'spark']
]) {
  test(`Duel ${id} commits the exact ${kind} effect with bounded reach and no projectile`, () => {
    for (const [side, distance] of [['player', near], ['cpu', far]]) {
      const { engine, actor, target, particles, fire } = mount(id, side, distance);
      const hp = target.currentHp;
      const reserve = engine.getTeam(side === 'player' ? 'cpu' : 'player').fighters[1];
      assert.equal(fire(command), true);
      const slot = command === 'light' ? 'simple' : 'secondary';
      assert.equal(actor.action.identity.name, getHeroById(id)[slot].name);
      assert.equal(actor.action.identity.provenance.identityAuthored, false);
      assert.equal(actor.action.identity.delivery, id === 'lilo_pelekai' ? 'beam' : 'melee');
      advance(engine, actor.action.hitAt / 2);
      assert.equal(target.currentHp, hp);
      assert.equal(particles.length, 0);
      const exactEffectCount = () => particles.filter(row => row[7] === kind && row[2] === 0 && row[3] === 0).length;
      advance(engine, 1.2);
      const connects = distance === near;
      assert.equal(target.currentHp < hp, connects);
      assert.equal(exactEffectCount(), Number(connects) + Number(id === 'lilo_pelekai'));
      assert.equal(engine.projectiles.length, 0);
      assert.equal(particles.some(row => row[7] === 'laser_line'), false);
      assert.equal(reserve.currentHp, reserve.maxHp);
      engine.dispose();
    }
  });
}

test('Duel renamed, foreign and conflicting editions keep their ordinary actions and hide the source reserve', () => {
  const id = 'jack_sparrow_potc';
  const source = getHeroById(id);
  for (const edited of [
    { ...source, universe: 'Other universe' },
    { ...source, incarnation: 'A later film' },
    { ...source, sourceHeroId: id, sourceId: 'another_source' },
    { ...source, secondary: { ...source.secondary, name: 'Other command' } },
    { ...source, secondary: { ...source.secondary, canonPresentation: { kind: 'melee' } } }
  ]) {
    const { engine, actor, fire } = mount(id, 'player', 150, edited);
    assert.equal(engine.getSnapshot().player.fighters[0].reservedShot, undefined);
    assert.equal(fire('heavy'), true);
    assert.equal(actor.action.canonSourceAbility, undefined);
    assert.equal(actor.action.reservedShot, undefined);
    engine.dispose();
  }
});
