import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';

let vite, EngineTactics, EngineRpg, heroes, ids, resolveAbility, getFrame, npc;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent',
    cacheDir: '/tmp/w17-tactics-integration-vite', server: { middlewareMode: true, hmr: false, watch: null } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ WAVE_17_REVIEWED_IDS: ids } = await vite.ssrLoadModule('/src/game/combat/cohortWave17.js'));
  ({ resolveCombatAbility: resolveAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ getCharacterAnimationFrame: getFrame } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  ({ CANONICAL_CAPTURE_NPC_WAVE17: npc } = await vite.ssrLoadModule('/src/game/combat/sourceCaptureEnemyCatalogWave17.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
const hero = id => structuredClone(heroes.find(h => h.id === id));
const dummy = id => ({ id, name: id, universe: 'Nexus de Convergence', weaponType: 'rifle',
  stats: { hp: 20000, atk: 20, def: 0, spd: 1 }, simple: { name: 'Fixture shot', type: 'projectile', dmg: 1 },
  secondary: { name: 'Fixture second', type: 'projectile', dmg: 1, cd: 3 }, special: { name: 'Fixture special', type: 'projectile', dmg: 1 },
  defense: { name: 'Fixture guard', type: 'guard', reduce: .3, dur: 1 } });
const stop = e => { for (const timer of e.timers) clearTimeout(timer); e.timers.clear(); };
function place(e, unit, x, y) {
  Object.assign(unit, { gridX: x, gridY: y });
  if (e.verticalTerrain) {
    const surface = e.terrain.byId.get(`ground:${x}:${y}`); assert.ok(surface);
    Object.assign(unit, { gridZ: surface.z, surfaceId: surface.id });
  }
  e.syncActorsToCamera();
}
function make(id, field, side, target = dummy('target')) {
  const own = [hero(id), dummy('ally')], foes = [structuredClone(target), dummy('spare')];
  const players = side === 'hero' ? own : foes, opponents = side === 'hero' ? foes : own;
  const e = new EngineTactics(1050, 700, players, { monsters: opponents, bosses: [], customRoster: opponents },
    { add: noop }, noop, noop, { universe: 'Nexus de Convergence', tacticsBattlefieldId: field, disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); stop(e); e.obstacles = [];
  const [actor, ally] = side === 'hero' ? e.heroes : e.enemies;
  const [opponent, spare] = side === 'hero' ? e.enemies : e.heroes;
  const y = e.verticalTerrain ? 5 : 2;
  for (const unit of [...e.heroes, ...e.enemies]) { unit.currentHp = unit.maxHp = 20000; unit.atb = -100000; }
  place(e, actor, 2, y); place(e, opponent, 3, y); place(e, ally, 2, y + 1); place(e, spare, 5, y);
  actor.specialCharge = 100; e.activeUnit = actor; e.activeUnitType = side; e.actionPhase = 'action';
  e.selectedAction = 'special'; e.selectedActionExplicit = true;
  return { e, actor, ally, target: opponent, spare, side, y };
}
function step(e, count) { for (let i = 0; i < count; i++) { e.update(); stop(e); } }
function cast(f, target = f.target, slot = 'special') {
  f.e.selectedAction = slot;
  return f.e.handleCellClick(target.gridX, target.gridY, target.surfaceId);
}
function release(f) {
  const action = f.e.sourceTacticsWave16.action; assert.ok(action);
  const hp = [...f.e.heroes, ...f.e.enemies].map(u => u.currentHp), turns = f.e.turnsElapsed;
  const effects = () => structuredClone([...f.e.heroes, ...f.e.enemies].map(u => ({
    beam: u.sourceMediGunWave17, capture: u.sourceBubbleCaptureWave17, photo: u.sourcePhotographicEvidenceWave17,
    guard: u.tacticsGuardTicks, buff: u.tacticsBuffTicks, allOutUses: u.sourceOkarunAllOutUsesWave17
  })));
  const before = effects();
  assert.equal(f.actor.specialCharge, 0);
  f.e.setPaused(true); step(f.e, 60);
  assert.equal(action.elapsed, 0); assert.deepEqual([...f.e.heroes, ...f.e.enemies].map(u => u.currentHp), hp);
  assert.deepEqual(effects(), before);
  assert.equal(f.actor.specialCharge, 0); assert.equal(f.e.turnsElapsed, turns);
  f.e.setPaused(false); step(f.e, Math.ceil(action.hitAt * 60) - 1);
  assert.deepEqual([...f.e.heroes, ...f.e.enemies].map(u => u.currentHp), hp, 'no effect during preparation');
  assert.deepEqual(effects(), before, 'capture, beam, reveal, guard, buff and all-out resource wait for release');
  step(f.e, 1); assert.equal(action.released, true); assert.equal(f.actor.specialCharge, 0);
  return action;
}

for (const field of ['training_grid', 'nexus_skybridge']) for (const side of ['hero', 'enemy']) {
  const label = `${field}/${side}`;
  test(`${label}: all 125 reviewed source actors retain typed profiles and converted grid ranges`, () => {
    const f = make('tomba_hero', field, side);
    assert.equal(ids.length, 125);
    for (const id of ids) for (const slot of ['simple', 'secondary', 'defense', 'special']) {
      const unit = { ...hero(id), currentHp: 100, maxHp: 100 };
      const source = resolveAbility(unit, slot), actual = f.e.getAttackProfile(unit, slot); assert.ok(source, `${id}/${slot}`);
      for (const key of ['sourceHeroId', 'universe', 'name', 'effect', 'delivery', 'targetSide', 'multiplier'])
        assert.equal(actual[key], source[key], `${id}/${slot}/${key}`);
      const expectedRange = source.targetSide === 'self' ? 0 : Math.max(1, Math.min(source.delivery === 'melee' ? 3 : 8,
        Math.ceil(source.range / (source.delivery === 'melee' ? 100 : 140))));
      assert.equal(actual.range, expectedRange, `${id}/${slot}/range`);
      assert.equal(actual.sourceAbility.sourceHeroId, id);
      assert.equal(actual.provenance.canonicalVerified, false); assert.equal(actual.provenance.networkVerified, false);
    }
  });
  test(`${label}: ordinary guard, healing and buff preserve their typed support effects at release`, () => {
    for (const effect of ['guard', 'heal', 'buff']) {
      const id = ids.find(id => {
        const profile = resolveAbility(hero(id), 'special');
        return profile.effect === effect && !profile.sourceMediGunWave17 && !profile.informationOnly;
      });
      assert.ok(id, effect);
      const f = make(id, field, side), profile = f.e.getAttackProfile(f.actor, 'special');
      const target = profile.targetSide === 'self' ? f.actor : f.ally;
      if (effect === 'heal') target.currentHp = 10000;
      const hp = target.currentHp;
      assert.equal(cast(f, target).handled, true); release(f);
      if (effect === 'heal') assert.ok(target.currentHp > hp);
      if (effect === 'guard') { assert.ok(target.tacticsGuardTicks > 0); assert.equal(target.tacticsGuardReduce, profile.guardReduce); }
      if (effect === 'buff') { assert.ok(target.tacticsBuffTicks > 0); assert.equal(target.tacticsBuffMultiplier, profile.buffMultiplier); }
    }
  });
  test(`${label}: ordinary damage has one real release, pause, cost and turn`, () => {
    const f = make('tomba_hero', field, side), hp = f.target.currentHp, turn = f.e.turnsElapsed;
    assert.equal(cast(f).handled, true); const action = release(f);
    assert.ok(f.target.currentHp < hp); const settled = f.target.currentHp;
    step(f.e, Math.ceil(action.duration * 60));
    assert.equal(f.target.currentHp, settled); assert.equal(f.actor.specialCharge, 0); assert.equal(f.e.turnsElapsed, turn + 1);
  });
  test(`${label}: Waffle captures the real eligible kitten only at release, for one target turn`, () => {
    const rejected = make('tail_concerto_waffle', field, side);
    assert.equal(cast(rejected).handled, false); assert.equal(rejected.actor.specialCharge, 100);
    const f = make('tail_concerto_waffle', field, side, npc), hp = f.target.currentHp;
    const position = [f.target.gridX, f.target.gridY, f.target.gridZ, f.target.y];
    assert.equal(cast(f).handled, true); assert.equal(f.target.sourceBubbleCaptureWave17, undefined); release(f);
    assert.equal(f.target.sourceBubbleCaptureWave17.active, true); assert.equal(f.target.currentHp, hp);
    assert.deepEqual([f.target.gridX, f.target.gridY, f.target.gridZ, f.target.y], position);
    assert.equal(f.target.sourceControlWave16?.inputProxy, undefined);
    step(f.e, 100); assert.equal(f.target.sourceBubbleCaptureWave17.active, true);
    f.e.turnQueue = [{ unit: f.target, type: side === 'hero' ? 'enemy' : 'hero' }]; f.e.startTurn(); stop(f.e);
    assert.equal(f.target.sourceBubbleCaptureWave17.active, false); assert.equal(f.target.currentHp, hp);
  });
  test(`${label}: stock beam starts at release, heals 24 HP/s and never performs a ratio burst`, () => {
    const f = make('team_fortress_2_medic', field, side); f.ally.currentHp = 10000;
    assert.equal(cast(f, f.actor).handled, false); assert.equal(f.actor.specialCharge, 100);
    assert.equal(cast(f, f.ally).handled, true); assert.equal(f.actor.sourceMediGunWave17, undefined); release(f);
    const started = f.ally.currentHp; assert.ok(Math.abs(started - 10000 - .4) < 1e-8);
    step(f.e, 60); assert.ok(Math.abs(f.ally.currentHp - started - 24) < 1e-8);
    assert.equal(f.actor.sourceMediGunWave17.connected, true); assert.equal(f.actor.specialCharge, 0);
  });
  test(`${label}: Jade's camera releases information without a buff or HP mutation`, () => {
    const f = make('beyond_good_evil_jade', field, side), hp = f.target.currentHp;
    assert.equal(cast(f).handled, true); assert.equal(f.target.sourcePhotographicEvidenceWave17, undefined); release(f);
    assert.equal(f.target.sourcePhotographicEvidenceWave17.active, true); assert.equal(f.target.currentHp, hp);
    assert.equal(f.target.tacticsBuffTicks || 0, 0); assert.equal(f.actor.tacticsBuffTicks || 0, 0);
  });
  test(`${label}: Melody's prepared action damages only through the accepted physical cardinal step`, () => {
    const f = make('crypt_necrodancer_melody', field, side), hp = f.target.currentHp;
    const from = { x: f.actor.gridX, y: f.actor.gridY, z: f.actor.gridZ || 0 };
    assert.equal(cast(f).handled, true); release(f); step(f.e, 15);
    const contact = f.actor.sourceLuteLastStepWave17; assert.ok(contact);
    assert.deepEqual(contact.from, from); assert.equal(Math.abs(contact.to.x - from.x) + Math.abs(contact.to.y - from.y), 1);
    assert.equal(contact.to.z, from.z); assert.ok(f.target.currentHp < hp);
    const settled = f.target.currentHp; f.e.applyDamage(f.actor, f.target, 900); assert.equal(f.target.currentHp, settled);
  });
  test(`${label}: Okarun's two actual releases count hits and misses; interruption and denied third cost no use`, () => {
    const f = make('oken_dandadan', field, side);
    assert.equal(cast(f).handled, true); step(f.e, 3); f.e.applyDamage(f.target, f.actor, 50); step(f.e, 80);
    assert.equal(f.actor.sourceOkarunAllOutUsesWave17 || 0, 0);
    for (let use = 1; use <= 2; use++) {
      f.actor.specialCharge = 100; f.actor.state = 'idle'; f.e.activeUnit = f.actor; f.e.activeUnitType = side; f.e.actionPhase = 'action';
      place(f.e, f.target, 3, f.y); assert.equal(cast(f).handled, true);
      if (use === 2) place(f.e, f.target, 7, f.y);
      const hp = f.target.currentHp; release(f);
      assert.equal(f.actor.sourceOkarunAllOutUsesWave17, use);
      if (use === 1) assert.ok(f.target.currentHp < hp); else assert.equal(f.target.currentHp, hp);
      step(f.e, 100);
    }
    f.actor.specialCharge = 100; f.e.activeUnit = f.actor; f.e.actionPhase = 'action'; place(f.e, f.target, 3, f.y);
    assert.equal(cast(f).handled, false); assert.equal(f.actor.specialCharge, 100); assert.equal(f.actor.sourceOkarunAllOutUsesWave17, 2);
  });
}

for (const side of ['hero', 'enemy']) test(`RPG/${side}: Melody's real moving actor retains the native lute four-pose clock`, () => {
  const source = hero('crypt_necrodancer_melody'), target = dummy('rpg-target');
  const own = side === 'hero' ? [source] : [target], foes = side === 'hero' ? [target] : [source];
  const e = new EngineRpg(1100, 600, own, { monsters: foes, bosses: [], customRoster: foes }, { add: noop }, noop, noop,
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } }); engines.push(e);
  const actor = side === 'hero' ? e.heroes[0] : e.enemies[0], opponent = side === 'hero' ? e.enemies[0] : e.heroes[0];
  for (const unit of [...e.heroes, ...e.enemies]) { unit.currentHp = unit.maxHp = 10000; unit.atb = -100000; }
  actor.x = actor.homeX = 288; actor.y = actor.homeY = 352; actor.atb = 100; actor.specialCharge = 100;
  opponent.x = opponent.homeX = 416; opponent.y = opponent.homeY = 352; e.enemyGlobalRecovery = 100000;
  const context = e.getActionContext(actor, 'special', side === 'hero' ? 'player' : 'enemy');
  assert.equal(e.executeRpgGoldenLuteMovementWave17(context, opponent), true);
  const move = actor.sourceRpgLuteMoveWave17, poses = new Set(), hp = opponent.currentHp;
  e.setPaused(true); for (let i = 0; i < 40; i++) e.update(); assert.equal(move.tick, 0); assert.equal(actor.x, 288); e.setPaused(false);
  for (let i = 0; i < 18; i++) {
    const view = e.getRpgPresentationActor(actor), frame = getFrame(view); assert.ok(frame);
    assert.equal(frame.asset.heroId, 'crypt_necrodancer_melody'); assert.equal(frame.asset.columns, 4); assert.equal(frame.asset.rows, 8);
    assert.equal(view.x, actor.x); assert.equal(view.y, actor.y); assert.equal(actor.state, 'run'); poses.add(frame.col); e.update();
  }
  assert.deepEqual([...poses], [0, 1, 2, 3]); assert.equal(actor.x, 352); assert.ok(opponent.currentHp < hp);
  assert.equal(actor.sourceRpgLuteMoveWave17, null); assert.equal(e.getRpgPresentationActor(actor).presentationPhase, undefined);
  const forged = { ...actor, universe: 'Wrong universe', state: 'run', actionPending: true, sourceRpgLuteMoveWave17: move };
  assert.equal(e.getRpgPresentationActor(forged).presentationPhase, undefined);
});
