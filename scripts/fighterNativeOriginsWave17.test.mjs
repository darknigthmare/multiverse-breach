import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { WAVE_17_PARTS } from '../src/game/combat/cohortWave17.js';

let vite, EngineFighter, heroes, resolveMeleeSuper, getVisual;
const noop = () => {}, ids = [...WAVE_17_PARTS.A, ...WAVE_17_PARTS.B];
const dummy = id => ({ id, name: id, universe: 'W17 projectile fixture', weaponType: 'melee',
  stats: { hp: 10000, atk: 10, def: 2, spd: 1 }, simple: { name: 'Contact', type: 'melee', dmg: 1 },
  special: { name: 'Special', type: 'melee', dmg: 1 }, defense: { name: 'Guard', type: 'guard', reduce: .4, dur: 1 } });

before(async () => {
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent',
    cacheDir: '/tmp/w17-fighter-native-origin-tests',
    plugins: [{ name: 'static-test-inputs', configResolved(config) { config.server.watch = null; } }],
    server: { middlewareMode: true, hmr: false, watch: null } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveMeleeSuper } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ getCharacterSuperVisualState: getVisual } = await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js'));
});
after(async () => { await vite?.close(); });

function make(id, side) {
  const own = [structuredClone(heroes.find(hero => hero.id === id)), dummy('benched-ally')];
  const other = [dummy('visible-opponent')], facing = side === 'player' ? 1 : -1;
  const engine = new EngineFighter(1100, 700, side === 'player' ? own : other,
    side === 'player' ? other : own, { add: noop }, noop, noop, { opponentControl: 'p2' });
  engine.countdown = 0;
  const actor = engine.getActive(side), target = engine.getActive(side === 'player' ? 'cpu' : 'player');
  actor.x = 420; target.x = actor.x + facing * 240; actor.facing = facing; actor.meter = 100;
  return { engine, actor, target };
}

for (const side of ['player', 'cpu']) test(`W17 ${side}: all A/B physical projectiles launch at the measured native release point`, () => {
  let checked = 0;
  for (const id of ids) {
    const profile = resolveMeleeSuper(heroes.find(hero => hero.id === id));
    if (profile.effect !== 'damage' || profile.delivery !== 'projectile') continue;
    const { engine, actor, target } = make(id, side);
    try {
      assert.equal(engine.tryAction(side, 'super'), true, id);
      const action = actor.action;
      engine.updateActions(action.hitAt);
      assert.equal(engine.projectiles.length, 1, id);
      const shot = engine.projectiles[0], visual = getVisual({ actor, profile, action, target, height: 142 });
      assert.equal(visual.family, 'native-wave17', id);
      assert.equal(visual.nativeMuzzleActive, true, id);
      assert.equal(visual.nativeAnchor.col, 2, id);
      assert.ok(Math.hypot(shot.x - visual.origin.x, shot.y - visual.origin.y) < 1e-9,
        id + ': physical release differs from the native artwork');
      checked++;
    } finally { engine.dispose(); }
  }
  assert.equal(checked, 25);
});

for (const side of ['player', 'cpu']) test(`W17 ${side}: Medic cannot channel to himself or an invisible benched ally`, () => {
  const { engine, actor } = make('team_fortress_2_medic', side);
  try {
    assert.equal(engine.getActive(side), actor);
    const actors = engine.getSourceActorsWave16(), before = actors.map(unit => unit.currentHp);
    assert.equal(engine.tryAction(side, 'super'), false);
    assert.equal(actor.meter, 100);
    assert.equal(actor.action, null);
    assert.equal(actor.sourceMediGunWave17, undefined);
    assert.deepEqual(actors.map(unit => unit.currentHp), before);
  } finally { engine.dispose(); }
});
