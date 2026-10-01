import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { applyCanonP0SourceKit } from '../src/game/canonP0SourceKits.js';
import { resolveCanonHeroAttackEffect } from '../src/game/canonHeroAttackEffects.js';
import { resolveP0CanonAttackEffect } from '../src/game/canonP0AttackEffects.js';

const CASES = [
  ['saturnin_duck', 'special', 'spark'], ['lilo_pelekai', 'simple', 'camera_flash'],
  ['stitch_626', 'special', 'spark'], ['mj_performer', 'special', 'spark'],
  ['rhythm_guard_mj', 'secondary', 'music'], ['jack_sparrow_potc', 'secondary', 'bullet'],
  ['roger_rabbit', 'secondary', 'spark'], ['cyber_spider_electro_beam', 'simple', 'electric_beam'],
  ['cyber_spider_flamethrower', 'simple', 'flame'], ['cyber_spider_kelly', 'special', 'spark'],
  ['raven_tt', 'special', 'shadow_wisp'], ['starfire_tt', 'simple', 'starbolt'],
  ['batman_tdk', 'secondary', 'batarang'], ['harry', 'simple', 'spell_bolt'],
  ['hermione', 'secondary', 'spell_bolt'], ['batman_n52', 'secondary', 'batarang'],
  ['harley_n52', 'special', 'spark'], ['joker_n52', 'special', 'toxin_cloud'],
  ['grim_knight', 'secondary', 'bullet']
];
const engines = [];
let vite;
let EngineRpg;
let EngineTactics;
let EngineSmash;
let ParticleSystem;
const threats = Array.from({ length: 3 }, (_, index) => ({
  id: `p0-effect-target-${index}`, name: `Target ${index}`, hp: 10000,
  atk: 1, def: 0, spd: 1, weapon: 'melee', color: '#808080'
}));
const makeEngine = (mode, heroId) => {
  const hero = applyCanonP0SourceKit(getHeroById(heroId));
  const calls = [];
  const sounds = [];
  const Engine = { RPG: EngineRpg, Tactics: EngineTactics, Smash: EngineSmash }[mode];
  const engine = new Engine(760, 420, [hero], { monsters: threats, bosses: [], customRoster: threats },
    { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, {
      universe: 'Nexus de Convergence', disableHazards: true,
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine);
  engine.calls = calls;
  engine.sounds = sounds;
  const actor = engine.heroes[0];
  Object.assign(actor, { state: 'idle', atb: 100, specialCharge: 100, cooldown: 0 });
  if (mode === 'RPG') engine.enemyGlobalRecovery = 9999;
  else if (mode === 'Tactics') {
    Object.assign(engine, { cols: 10, rows: 8, tiles: [], obstacles: [], escortUnit: null,
      protectedArtifact: null, objective: 'rout', activeUnit: actor, activeUnitType: 'hero',
      actionPhase: 'action', selectedAction: null });
    Object.assign(actor, { gridX: 2, gridY: 2 });
    engine.enemies.forEach((unit, index) => Object.assign(unit,
      { gridX: [3, 5, 8][index], gridY: 2 }));
  } else {
    engine.syncPreMatchFromServer(3000);
    Object.assign(actor, { x: 100, y: 300, facing: 1, state: 'idle' });
    engine.enemies.forEach((unit, index) => Object.assign(unit,
      { x: [140, 160, 450][index], y: 300, currentHp: 10000, maxHp: 10000, state: 'idle' }));
  }
  calls.length = 0;
  sounds.length = 0;
  return engine;
};
const particleKinds = engine => engine.calls.map(call => call[7]);
const costs = actor => ({ cooldown: actor.cooldown, charge: actor.specialCharge, atb: actor.atb });

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  [{ EngineRpg }, { EngineTactics }, { EngineSmash }, { ParticleSystem }] = await Promise.all([
    vite.ssrLoadModule('/src/game/engineRpg.js?p0-runtime-effects'),
    vite.ssrLoadModule('/src/game/engineTactics.js?p0-runtime-effects'),
    vite.ssrLoadModule('/src/game/engineSmash.js?p0-runtime-effects'),
    vite.ssrLoadModule('/src/game/renderer.js?p0-runtime-effects')
  ]);
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

for (const [heroId, ability, expectedParticle] of CASES) {
  for (const mode of ['RPG', 'Tactics', 'Smash']) test(`${mode} ${heroId} executes its source action with typed feedback and one victim`, () => {
    const engine = makeEngine(mode, heroId);
    const actor = engine.heroes[0];
    const hp = engine.enemies.map(unit => unit.currentHp);
    let victimIndex = 0;
    const sourceEffect = resolveCanonHeroAttackEffect(actor, ability);
    assert.ok(sourceEffect, 'the source kit did not opt into its presentation');
    if (expectedParticle === 'spark') assert.equal(sourceEffect.kind, 'melee');
    if (mode === 'RPG') {
      victimIndex = 2;
      assert.equal(engine.triggerAbility(actor, ability, [engine.enemies[victimIndex].battleId]), true);
      assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp, 'RPG impact applied before its simulation delay');
      for (let tick = 0; tick < 18; tick++) engine.update();
    } else if (mode === 'Tactics') {
      const profile = engine.getAttackProfile(actor, ability);
      assert.equal(profile.maxTargets, 1);
      assert.equal(engine.selectAction(ability), true);
      if (profile.delivery === 'melee') {
        const originalCosts = costs(actor);
        assert.equal(engine.handleCellClick(5, 2).handled, false);
        assert.deepEqual(costs(actor), originalCosts, 'rejected distant contact spent resources');
      } else victimIndex = 1;
      const victim = engine.enemies[victimIndex];
      assert.equal(engine.handleCellClick(victim.gridX, victim.gridY).handled, true);
    } else assert.equal(engine.triggerAbility(actor, ability), true);
    engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === victimIndex,
      `${mode} ${heroId} wrong damage identity ${index}`));
    assert.ok(particleKinds(engine).includes(expectedParticle), `missing ${expectedParticle} feedback`);
    if (expectedParticle === 'spark') assert.ok(engine.calls.some(call => call[7] === 'spark' && call[4] === sourceEffect.color),
      'only a generic damage spark was emitted instead of the declared contact cue');
    assert.ok(!particleKinds(engine).includes('laser_line'), 'an unrelated generic laser was emitted');
    assert.ok(!particleKinds(engine).includes('glitch'), 'a generic group flash replaced the source action');
    if (expectedParticle === 'starbolt') assert.ok(engine.calls.some(call => call[7] === 'starbolt' && call[4] === '#63ef72'));
    if (expectedParticle === 'spell_bolt') assert.ok(engine.calls.some(call => call[7] === 'spell_bolt' && /^#e[0-9a-f]{5}$/i.test(call[4])));
    if (heroId === 'jack_sparrow_potc') assert.ok(particleKinds(engine).includes('smoke'));
  });
}

test('P0 presentation requires both the source identity and its explicit opt-in flag', () => {
  const source = applyCanonP0SourceKit(getHeroById('lilo_pelekai'));
  assert.equal(resolveCanonHeroAttackEffect({ ...source, canonCombatPresentation: false }, 'simple'), null);
  assert.equal(resolveCanonHeroAttackEffect({ ...source, id: 'unreviewed-legacy', sourceId: null }, 'simple'), null);
  assert.equal(resolveP0CanonAttackEffect(source, { ...source.simple, canonPresentation: { kind: null } }).kind, 'cameraFlash');
});

test('typed particles render their actual shapes and restore canvas state, including sound direction', () => {
  const particles = new ParticleSystem();
  const types = ['bullet', 'smoke', 'batarang', 'camera_flash', 'shadow_wisp', 'starbolt',
    'spell_bolt', 'patronus', 'electric_beam', 'flame', 'thrown_prop', 'sound_call'];
  types.forEach(type => particles.add(100, 200, -6, 0, '#63ef72', 12, 24, type));
  const operations = [];
  const ctx = new Proxy({ globalAlpha: 1 }, {
    get: (object, key) => key in object ? object[key] : (...args) => operations.push([key, ...args]),
    set: (object, key, value) => { object[key] = value; return true; }
  });
  particles.draw(ctx);
  assert.ok(operations.some(([name]) => name === 'ellipse'), 'glowing source particles fell back to generic squares');
  assert.ok(operations.some(([name]) => name === 'closePath'), 'Batarang/flame outlines were not drawn');
  assert.ok(operations.some(([name]) => name === 'stroke'), 'flash/electrical ray shapes were not drawn');
  assert.equal(operations.filter(([name]) => name === 'save').length, operations.filter(([name]) => name === 'restore').length);
  const call = new ParticleSystem();
  call.add(100, 200, -6, 0, '#63ef72', 12, 24, 'sound_call');
  operations.length = 0;
  call.draw(ctx);
  assert.ok(operations.some(([name, angle]) => name === 'rotate' && angle === Math.PI), 'leftward sound feedback faces right');
});

test('non-opt-in legacy kits preserve their actual RPG, Tactics and Smash presentation paths', () => {
  const rpg = makeEngine('RPG', 'masterchief');
  assert.equal(resolveCanonHeroAttackEffect(rpg.heroes[0], 'secondary'), null);
  assert.equal(rpg.triggerAbility(rpg.heroes[0], 'secondary', [rpg.enemies[1].battleId]), true);
  assert.ok(particleKinds(rpg).includes('laser_line'));
  const tactics = makeEngine('Tactics', 'masterchief');
  assert.equal(tactics.selectAction('special'), true);
  assert.equal(tactics.handleCellClick(5, 2).handled, true);
  assert.ok(particleKinds(tactics).includes('glitch'));
  const smash = makeEngine('Smash', 'masterchief');
  smash.triggerAbility(smash.heroes[0], 'special');
  assert.ok(smash.enemies.every(unit => unit.currentHp < unit.maxHp));
  assert.ok(particleKinds(smash).includes('glitch'));
});

test('Smash P2 normalizes its source identity and preserves Starfire’s green single-target attack', () => {
  const engine = makeEngine('Smash', 'starfire_tt');
  const starfire = engine.heroes[0];
  Object.assign(starfire, { id: 'p2:starfire_tt:0', sourceId: 'starfire_tt', x: 500, facing: -1 });
  const targets = engine.enemies;
  targets.forEach((target, index) => Object.assign(target, { x: [400, 390, 550][index] }));
  engine.heroes = targets;
  engine.enemies = [starfire];
  engine.isLocalP2 = true;
  engine.activeOpponentId = starfire.id;
  assert.equal(engine.triggerOpponentAbility('simple'), true);
  assert.equal(targets[0].currentHp < targets[0].maxHp, true);
  assert.equal(targets[1].currentHp, targets[1].maxHp);
  assert.equal(targets[2].currentHp, targets[2].maxHp);
  assert.ok(engine.calls.some(call => call[7] === 'starbolt' && call[4] === '#63ef72'));
});

test('RPG P2 controls use the same camera flash without giving Lilo an alien ray', () => {
  const source = applyCanonP0SourceKit(getHeroById('lilo_pelekai'));
  const threat = { ...source, hp: source.stats.hp, atk: source.stats.atk,
    def: source.stats.def, spd: source.stats.spd };
  const calls = [];
  const engine = new EngineRpg(760, 420, ['han_solo', 'luke', 'vader'].map(getHeroById),
    { monsters: [threat], bosses: [], customRoster: [threat] },
    { add: (...args) => calls.push(args) }, () => {}, () => {}, {
      universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine);
  engine.calls = calls;
  engine.enemyGlobalRecovery = 9999;
  const lilo = engine.enemies[0];
  lilo.atb = 100;
  const targets = engine.heroes;
  const hp = targets.map(unit => unit.currentHp);
  assert.equal(engine.triggerEnemyAbility(lilo, 'simple', [targets[1].battleId]), true);
  for (let tick = 0; tick < 18; tick++) engine.update();
  targets.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 1));
  assert.ok(particleKinds(engine).includes('camera_flash'));
  assert.ok(!particleKinds(engine).includes('laser_line'));
});

test('Tactics P2 uses Raven’s single-target shadow presentation from the same source action', () => {
  const engine = makeEngine('Tactics', 'raven_tt');
  const raven = engine.heroes[0];
  const targets = engine.enemies;
  engine.heroes = targets;
  engine.enemies = [raven];
  engine.activeUnit = raven;
  engine.activeUnitType = 'enemy';
  const hp = targets.map(unit => unit.currentHp);
  assert.equal(engine.selectAction('special'), true);
  assert.equal(engine.handleCellClick(5, 2).handled, true);
  targets.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 1));
  assert.ok(particleKinds(engine).includes('shadow_wisp'));
  assert.ok(!particleKinds(engine).some(kind => ['laser_line', 'glitch'].includes(kind)));
});

for (const [id, action, kind] of [
  ['han_solo', 'simple', 'blaster'], ['luke', 'secondary', 'telekinesis'],
  ['vader', 'special', 'forceChoke'], ['bob_minions', 'secondary', 'banana'],
  ['kevin_minions', 'secondary', 'banana'], ['stuart_minions', 'secondary', 'music']
]) test(`${id} keeps its previously verified presentation without the new P0 opt-in flag`, () => {
  assert.equal(resolveCanonHeroAttackEffect(getHeroById(id), action).kind, kind);
});
