import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
let EngineRpg;
let HEROES_DB;
let ENEMIES_DB;
let CANONICAL_CAPTURE_NPC_WAVE17;
let resolveUniverseSummon;
let getRpgActionProfile;
let getRpgEligibleTargets;
let resolveRpgTargets;
const engines = [];
const noop = () => {};
const heroData = id => ({
  id, name: id, universe: 'RPG invocation regression', category: 'summon-regression',
  weaponType: 'melee', primaryColor: '#39c5bb', secondaryColor: '#ff9900',
  stats: { hp: 1000, atk: 30, def: 20, spd: 5 },
  simple: { name: 'Strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Shot', type: 'bullet', dmg: 1.5, cd: 3 },
  defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 2 },
  special: { name: 'Finisher', type: 'bullet', dmg: 2 }
});
const enemyData = id => ({ ...heroData(id), hp: 10000, atk: 30, def: 20, spd: 5, weapon: 'melee' });
const makeEngine = (heroes, enemies = ['alpha', 'beta', 'gamma'].map(enemyData), control = 'p2') => {
  const engine = new EngineRpg(760, 420, heroes, {
    monsters: enemies, bosses: [], customRoster: enemies
  }, { add: noop }, noop, noop, {
    universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: control }
  });
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.atb = 100; unit.specialCharge = 100; });
  engine.enemyGlobalRecovery = 0;
  engines.push(engine);
  return engine;
};
const hero = id => {
  const found = HEROES_DB.find(unit => unit.id === id);
  assert.ok(found, `missing catalog hero ${id}`);
  return found;
};
const tick = (engine, count = 1) => { for (let frame = 0; frame < count; frame++) engine.update(); };
const costs = actor => ({ atb: actor.atb, charge: actor.specialCharge, cooldown: actor.cooldown, used: actor.summonUsed });
const id = actor => actor.battleId;
const medicalCaller = (effect, extra = {}) => ({
  ...heroData('medical-caller-' + effect),
  secondary: {
    name: 'Medical deployment ' + effect, type: 'summon', dmg: 2,
    rpgProfile: { effect, targetSide: 'ally', shape: 'single', range: 1000, ...extra }
  }
});

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?rpg-summon-tests'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js?rpg-summon-tests'));
  ({ ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js?rpg-summon-tests'));
  ({ CANONICAL_CAPTURE_NPC_WAVE17 } = await vite.ssrLoadModule('/src/game/combat/sourceCaptureEnemyCatalogWave17.js?rpg-summon-tests'));
  ({ resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js?rpg-summon-tests'));
  ({ getRpgActionProfile, getRpgEligibleTargets, resolveRpgTargets } = await vite.ssrLoadModule('/src/game/rpgTargeting.js?rpg-summon-tests'));
});

after(async () => {
  engines.forEach(engine => engine.dispose());
  await vite?.close();
});

for (const side of ['player', 'enemy']) test('RPG summon selection and cancellation never spend resources for ' + side, () => {
  const engine = side === 'player'
    ? makeEngine([hero('cloud_ff7')])
    : makeEngine([heroData('player')], [{ ...hero('cloud_ff7'), hp: 10000 }]);
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const before = costs(actor);
  const originalSpecial = actor.special.name;
  const effectiveSpecial = engine.getActionContext(actor, 'special', side).profile.action.name;
  assert.equal(engine.getSummonState(actor, side).ready, true);
  assert.equal(engine.summon(actor, side), true);
  assert.equal(engine.getTargetingState().abilityType, 'summon');
  assert.equal(engine.getTargetingState().summon.entityName, 'Ifrit');
  assert.deepEqual(costs(actor), before);
  assert.equal(engine.beginTargeting(actor, 'special', side), false);
  assert.equal(engine.cancelTargeting(), true);
  assert.deepEqual(costs(actor), before);
  assert.equal(actor.special.name, originalSpecial);
  assert.equal(engine.getActionContext(actor, 'special', side).profile.action.name, effectiveSpecial);
});

test('RPG summon requires both full gauges, commits once and remains separate from the special', () => {
  const engine = makeEngine([hero('cloud_ff7')]);
  const actor = engine.heroes[0];
  actor.atb = 99;
  assert.equal(engine.summon(actor), false);
  actor.atb = 100;
  actor.specialCharge = 99;
  assert.equal(engine.summon(actor), false);
  actor.specialCharge = 100;
  assert.equal(engine.summon(actor), true);
  assert.equal(engine.confirmTargeting(), true);
  assert.deepEqual(costs(actor), { atb: 0, charge: 0, cooldown: 0, used: true });
  assert.equal(engine.confirmTargeting(), false);
  assert.equal(engine.triggerAbility(actor, 'special'), false);
  tick(engine, engine.getSummonSceneState().durationTicks);
  actor.atb = 100;
  actor.specialCharge = 100;
  assert.equal(engine.getSummonState(actor).reason, 'used');
  assert.equal(engine.summon(actor), false);
  assert.equal(engine.triggerAbility(actor, 'special'), true);
});

test('RPG cinematic has one impact at the exact simulation tick and a completed return', () => {
  const engine = makeEngine([hero('cloud_ff7')]);
  const actor = engine.heroes[0];
  const hp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.summon(actor), true);
  const previewIds = engine.getTargetingState().previewTargetIds;
  assert.equal(engine.confirmTargeting(), true);
  const scene = engine.getSummonSceneState();
  const caption = engine.getSummonCaption();
  assert.deepEqual(caption, { kind: 'summon', entityName: 'Ifrit', actionName: 'Hellfire' });
  assert.equal(scene.performerId, null, 'a different hero was used as an Ifrit sprite');
  assert.equal(scene.assetMissing, false);
  assert.equal(scene.entityAssetId, 'ff7-ifrit');
  assert.deepEqual(scene.entityFrame, { index: 0, phase: 'arrival' });
  assert.deepEqual(scene.targetIds, previewIds);
  tick(engine, scene.impactTick - 1);
  assert.deepEqual(engine.getSummonSceneState().entityFrame, { index: 1, phase: 'preparation' });
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  tick(engine);
  const after = engine.enemies.map(unit => unit.currentHp);
  assert.ok(after.some((value, index) => value < hp[index]));
  assert.equal(engine.getSummonSceneState().impacted, true);
  assert.strictEqual(engine.getSummonCaption(), caption, 'a new animation frame must not announce the title again');
  assert.deepEqual(engine.getSummonSceneState().entityFrame, { index: 2, phase: 'impact' });
  tick(engine, scene.durationTicks - scene.impactTick);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), after, 'an invocation impacted twice');
  assert.equal(engine.isSummonSceneActive(), false);
  assert.equal(engine.getSummonSceneState(), null);
  assert.equal(engine.getSummonCaption(), null);
  assert.equal(actor.actionPending, false);
  assert.equal(actor.state, 'idle');
  assert.equal(actor.x, actor.homeX);
  assert.equal(actor.y, actor.homeY);
});

test('RPG summon pause freezes the scene and queued attacks without late wall-time effects', () => {
  const engine = makeEngine([hero('cloud_ff7')]);
  const actor = engine.heroes[0];
  engine.triggerEnemyAbility(engine.enemies[0], 'simple', [id(actor)]);
  const queuedTicks = engine.actionQueue[0].ticks;
  engine.summon(actor);
  engine.confirmTargeting();
  tick(engine, 15);
  assert.equal(engine.actionQueue[0].ticks, queuedTicks);
  const beforePause = engine.getSummonSceneState();
  const hp = engine.enemies.map(unit => unit.currentHp);
  engine.setPaused(true);
  tick(engine, 500);
  assert.deepEqual(engine.getSummonSceneState(), beforePause);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  engine.setPaused(false);
  tick(engine, beforePause.impactTick - beforePause.tick);
  assert.equal(engine.getSummonSceneState().impacted, true);
  assert.equal(engine.actionQueue[0].ticks, queuedTicks);
});

for (const end of ['dispose', 'gameOver', 'dead-caller']) test('RPG summon cancels safely on ' + end, () => {
  const engine = makeEngine([hero('cloud_ff7')]);
  const actor = engine.heroes[0];
  engine.summon(actor);
  engine.confirmTargeting();
  tick(engine, 5);
  const hp = engine.enemies.map(unit => unit.currentHp);
  if (end === 'dispose') engine.dispose();
  else if (end === 'gameOver') engine.gameOver = true;
  else { actor.currentHp = 0; actor.state = 'dead'; }
  tick(engine, 300);
  assert.equal(engine.isSummonSceneActive(), false);
  assert.equal(actor.actionPending, false);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  assert.equal(engine.actionQueue.length, 0);
});

test('RPG invocation cannot silently acquire a replacement for an invalidated target', () => {
  const caller = {
    ...heroData('single-deployment'),
    secondary: { name: 'Directed deployment', type: 'summon', dmg: 2, rpgProfile: { effect: 'damage', shape: 'single', range: 1000 } }
  };
  const engine = makeEngine([caller]);
  const actor = engine.heroes[0];
  engine.summon(actor);
  engine.selectTarget(id(engine.enemies[1]));
  const before = costs(actor);
  engine.enemies[1].currentHp = 0;
  engine.enemies[1].state = 'dead';
  assert.equal(engine.confirmTargeting(), false);
  assert.deepEqual(costs(actor), before);
  engine.cancelTargeting();
  engine.summon(actor);
  engine.selectTarget(id(engine.enemies[2]));
  engine.confirmTargeting();
  const hp = engine.enemies[0].currentHp;
  engine.enemies[2].currentHp = 0;
  engine.enemies[2].state = 'dead';
  tick(engine, 200);
  assert.equal(engine.enemies[0].currentHp, hp);
});

for (const source of ['arca_loom', 'arca_bastion']) test('RPG catalog deployment preserves ' + source + ' support semantics', () => {
  const engine = makeEngine([hero(source), heroData('patient')]);
  const actor = engine.heroes[0];
  const patient = engine.heroes[1];
  patient.currentHp -= 100;
  const beforeHp = patient.currentHp;
  const enemyHp = engine.enemies.map(unit => unit.currentHp);
  const effect = source === 'arca_loom' ? 'heal' : 'guard';
  assert.equal(engine.summon(actor), true);
  const state = engine.getTargetingState();
  assert.equal(state.effect, effect);
  assert.equal(state.eligibleTargets.every(unit => unit.side === 'player'), true);
  assert.equal(engine.selectTarget(id(patient)), true);
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, engine.getSummonSceneState().impactTick);
  if (effect === 'heal') assert.ok(patient.currentHp > beforeHp);
  else assert.ok(patient.rpgGuardTicks > 0);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), enemyHp);
});

for (const [source, effect] of [
  ['arca_bastion', 'guard'], ['arca_loom', 'heal'], ['arca_tessera', 'damage'], ['arca_nadir', 'damage']
]) test(`Nexus ${source} renders its applied ${effect} for either camp`, () => {
  for (const side of ['player', 'enemy']) {
    const caller = hero(source);
    const engine = side === 'player'
      ? makeEngine([caller, heroData('ally')])
      : makeEngine([heroData('opponent')], [{ ...caller, hp: 10000 }, enemyData('ally')]);
    const party = side === 'player' ? engine.heroes : engine.enemies;
    const opponents = side === 'player' ? engine.enemies : engine.heroes;
    const target = effect === 'damage' ? opponents[0] : party[1];
    if (effect === 'heal') target.currentHp -= 100;
    const hp = target.currentHp;
    const actor = party[0];
    assert.equal(engine.summon(actor, side), true);
    assert.equal(engine.selectTarget(id(target)), true);
    assert.equal(engine.confirmTargeting(), true);
    const scene = engine.activeSummon;
    tick(engine, scene.impactTick - 1);
    assert.equal(target.currentHp, hp);
    assert.equal(Boolean(target.rpgGuardTicks), false);
    assert.ok(engine.getSummonSceneState().choreography.visuals.every(cue => cue.stage !== 'contact'));
    const impactPosition = [target.x, target.y];
    tick(engine);
    if (effect === 'damage') assert.ok(target.currentHp < hp);
    else if (effect === 'heal') assert.ok(target.currentHp > hp);
    else assert.ok(target.rpgGuardTicks > 0);
    const state = engine.getSummonSceneState().choreography;
    assert.deepEqual(state.targets.map(({ id, x, y }) => [id, x, y]), [[id(target), ...impactPosition]]);
    assert.ok(state.visuals.some(cue => cue.stage === 'contact'));
    target.x += 5;
    assert.deepEqual(engine.getSummonSceneState().choreography.targets, state.targets);
    const postImpactHp = target.currentHp;
    tick(engine, scene.durationTicks - scene.impactTick);
    assert.equal(target.currentHp, postImpactHp);
    assert.equal(engine.getSummonSceneState(), null);
  }
});

test('Nexus invocation draws no success on fully absorbed, full-HP or replaced targets', () => {
  for (const [source, failure] of [
    ['arca_tessera', 'shield'], ['arca_loom', 'full-hp'], ['arca_bastion', 'replacement']
  ]) {
    const engine = makeEngine([hero(source), heroData('ally')]);
    const target = failure === 'shield' ? engine.enemies[0] : engine.heroes[1];
    if (failure === 'shield') target.battleItemShield = target.maxHp;
    if (failure === 'full-hp') target.currentHp -= 100;
    assert.equal(engine.summon(engine.heroes[0]), true);
    assert.equal(engine.selectTarget(id(target)), true);
    assert.equal(engine.confirmTargeting(), true);
    if (failure === 'full-hp') target.currentHp = target.maxHp;
    if (failure === 'replacement') engine.heroes[1] = { ...target };
    const hp = target.currentHp;
    tick(engine, engine.activeSummon.impactTick);
    assert.equal(target.currentHp, hp);
    if (failure === 'replacement') assert.ok(!target.rpgGuardTicks && !engine.heroes[1].rpgGuardTicks);
    if (failure === 'shield') assert.ok(target.battleItemShield < target.maxHp);
    assert.deepEqual(engine.getSummonSceneState().choreography.targets, []);
  }
});

test('Nexus probe keeps its route and visible KO contact at the impact position', () => {
  const engine = makeEngine([hero('arca_nadir')]);
  const target = engine.enemies[0];
  target.x -= 36;
  target.currentHp = 1;
  const impactX = target.x;
  assert.equal(engine.summon(engine.heroes[0]), true);
  assert.equal(engine.selectTarget(id(target)), true);
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, engine.activeSummon.impactTick);
  assert.equal(target.currentHp, 0);
  assert.notEqual(target.x, impactX, 'the engine moves the KO back to formation');
  const choreography = engine.getSummonSceneState().choreography;
  const contact = choreography.targets.find(entry => entry.id === id(target));
  assert.equal(contact?.x, impactX);
  assert.equal(choreography.target.x, impactX);
});

for (const side of ['player', 'enemy']) test(`RPG keeps the return of a finishing invocation visible for ${side}`, () => {
  const engine = side === 'player'
    ? makeEngine([hero('arca_nadir')], [enemyData('last-enemy')])
    : makeEngine([heroData('last-hero')], [{ ...hero('arca_nadir'), hp: 10000 }]);
  const [actor, target] = side === 'player'
    ? [engine.heroes[0], engine.enemies[0]] : [engine.enemies[0], engine.heroes[0]];
  target.currentHp = 1;
  const completions = [];
  engine.onComplete = result => completions.push(result);
  assert.equal(engine.summon(actor, side), true);
  assert.equal(engine.selectTarget(id(target)), true);
  assert.equal(engine.confirmTargeting(), true);
  const { durationTicks, impactTick } = engine.getSummonSceneState();
  tick(engine, impactTick);
  assert.equal(target.currentHp, 0);
  assert.equal(engine.getSummonSceneState()?.phase, 'attack');
  assert.deepEqual(engine.getSummonSceneState().choreography.targets.map(entry => entry.id), [id(target)]);
  assert.deepEqual(completions, []);
  tick(engine, durationTicks - impactTick - 1);
  assert.equal(engine.getSummonSceneState()?.phase, 'return');
  assert.equal(engine.gameOver, false);
  tick(engine);
  assert.equal(engine.isSummonSceneActive(), false);
  assert.equal(actor.actionPending, false);
  tick(engine, 250);
  assert.deepEqual(completions, [side === 'player' ? 'victory' : 'defeat']);
});

test('RPG shows a neutral manifestation when a declared invocation atlas cannot draw', () => {
  const engine = makeEngine([hero('arca_nadir')]);
  assert.equal(engine.summon(engine.heroes[0]), true);
  assert.equal(engine.confirmTargeting(), true);
  tick(engine, 1);
  const calls = [];
  const ctx = Object.fromEntries(['save', 'restore', 'fillRect', 'translate', 'beginPath', 'ellipse', 'stroke', 'drawImage']
    .map(name => [name, () => calls.push(name)]));
  const before = engine.getSummonSceneState();
  assert.equal(before.entityAssetId, 'nexus-return-probe');
  engine.drawSummonScene(ctx, 'fr', false);
  assert.equal(calls.filter(name => name === 'ellipse').length, 3);
  assert.equal(calls.includes('drawImage'), false);
  assert.deepEqual(engine.getSummonSceneState(), before);
});

test('RPG explicit revival, buff and cleansing deployments keep their declared effect', () => {
  for (const effect of ['revive', 'buff', 'cleanse']) {
    const engine = makeEngine([medicalCaller(effect, { reviveRatio: 0.5, cleanses: effect === 'cleanse' }), heroData('patient')]);
    const patient = engine.heroes[1];
    if (effect === 'revive') { patient.currentHp = 0; patient.state = 'dead'; }
    else patient.statusEffects.infected = 120;
    const enemyHp = engine.enemies.map(unit => unit.currentHp);
    assert.equal(engine.summon(engine.heroes[0]), true);
    assert.equal(engine.getTargetingState().effect, effect);
    engine.selectTarget(id(patient));
    assert.equal(engine.confirmTargeting(), true);
    tick(engine, engine.getSummonSceneState().impactTick);
    if (effect === 'revive') assert.equal(patient.currentHp, patient.maxHp * 0.5);
    else if (effect === 'buff') assert.ok(patient.rpgBuffTicks > 0);
    else assert.deepEqual(patient.statusEffects, { infected: 0, glitched: 0, radiated: 0 });
    assert.deepEqual(engine.enemies.map(unit => unit.currentHp), enemyHp);
  }
});

test('RPG automatic sides use the same invocation resolver and keep manual targeting closed', () => {
  for (const side of ['player', 'enemy']) {
    const engine = side === 'player'
      ? makeEngine([hero('cloud_ff7')])
      : makeEngine([heroData('player')], [{ ...hero('cloud_ff7'), hp: 10000 }], 'cpu');
    engine.autoBattle = side === 'player';
    tick(engine);
    const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
    assert.equal(engine.getSummonSceneState()?.side, side);
    assert.equal(actor.summonUsed, true);
    assert.equal(engine.targeting, null);
  }
});

test('RPG auto falls back to the original special when a healing invocation has no eligible ally', () => {
  const engine = makeEngine([medicalCaller('heal')]);
  const actor = engine.heroes[0];
  assert.equal(resolveUniverseSummon(actor).action.targeting.effect, 'heal');
  assert.equal(engine.getSummonState(actor).reason, 'no-eligible-target');
  engine.autoBattle = true;
  tick(engine);
  assert.equal(actor.summonUsed, false);
  assert.equal(engine.isSummonSceneActive(), false);
  assert.equal(actor.actionPending, true);
  assert.equal(actor.specialCharge, 0);
  assert.equal(actor.cooldown, 0);
});

test('RPG every catalog invocation can resolve its authored effect from the combat formation', () => {
  let count = 0;
  for (const catalogHero of HEROES_DB) {
    const descriptor = resolveUniverseSummon(catalogHero);
    if (!descriptor) continue;
    count++;
    const actor = { ...catalogHero, battleId: 'caller', x: 106, y: 277, currentHp: 100, maxHp: 200, statusEffects: { infected: 100 } };
    const profile = getRpgActionProfile(actor, 'summon', 'player', { width: 760, height: 420 });
    const ally = { battleId: 'ally', x: 152, y: 328, currentHp: profile.effect === 'revive' ? 0 : 100, maxHp: 200, statusEffects: { infected: 100 } };
    const genericFoe = { battleId: 'foe', x: 562, y: 277, currentHp: 1000, maxHp: 1000 };
    // A source-restricted control does not authorize an arbitrary opponent.
    // Use the actual historical Slig, explicitly authorized episode21 Shinya,
    // or canonical Tail Concerto kitten, while still rejecting generic foes.
    const bubbleCapture = profile.controlKind === 'bubble-capture';
    const sourceTarget = profile.controlKind === 'possession'
      ? ENEMIES_DB.Oddworld.monsters.find(unit => unit.id === 'oddworld_slig')
      : profile.controlKind === 'paralyzer' ? { ...hero('shinya_kogami'), paralyzerEligible: true }
      : bubbleCapture ? CANONICAL_CAPTURE_NPC_WAVE17 : null;
    if (sourceTarget) assert.deepEqual(getRpgEligibleTargets({ actor, profile, allies: [actor, ally], opponents: [genericFoe] }), []);
    const foe = sourceTarget ? { ...sourceTarget, ...genericFoe,
      ...(bubbleCapture ? { x: actor.x + Math.min(96, profile.range / 2), y: actor.y,
        currentHp: sourceTarget.hp, maxHp: sourceTarget.hp } : {}) } : genericFoe;
    if (bubbleCapture) {
      assert.deepEqual(getRpgEligibleTargets({ actor, profile, allies: [actor, ally], opponents: [{ ...foe, isBoss: true }] }), []);
      assert.deepEqual(getRpgEligibleTargets({ actor, profile, allies: [actor, ally], opponents: [{ ...foe, x: actor.x + profile.range + 1 }] }), []);
    }
    const eligibleTargets = getRpgEligibleTargets({ actor, profile, allies: [actor, ally], opponents: [foe] });
    const selectedTargetIds = profile.shape === 'group' ? [] : eligibleTargets.slice(0, profile.minTargets).map(id);
    assert.equal(resolveRpgTargets({ actor, profile, eligibleTargets, selectedTargetIds }).valid, true, `${catalogHero.id}: ${descriptor.action.name} cannot reach its targets`);
    assert.equal(descriptor.universe, catalogHero.universe);
    if (descriptor.performer) assert.equal(descriptor.performer.universe, catalogHero.universe);
  }
  assert.ok(count > 1900, 'catalog invocation coverage unexpectedly collapsed');
});

test('RPG reinforcement uses its existing partner identity and matches buffed damage preview', () => {
  const partnerCaller = HEROES_DB.find(unit => {
    const descriptor = resolveUniverseSummon(unit);
    return descriptor?.performer && descriptor.performer.id !== unit.id && descriptor.action.targeting.effect === 'damage';
  });
  assert.ok(partnerCaller);
  const engine = makeEngine([partnerCaller]);
  const actor = engine.heroes[0];
  actor.rpgBuffTicks = 300;
  actor.rpgBuffMultiplier = 2;
  const descriptor = resolveUniverseSummon(actor);
  engine.summon(actor);
  const estimates = engine.getTargetingState().estimates;
  const hp = new Map(engine.enemies.map(unit => [id(unit), unit.currentHp]));
  engine.confirmTargeting();
  const scene = engine.getSummonSceneState();
  assert.equal(scene.performerId, descriptor.performer.id);
  assert.equal(scene.universe, actor.universe);
  tick(engine, scene.impactTick);
  for (const estimate of estimates) {
    const target = engine.enemies.find(unit => id(unit) === estimate.id);
    const damage = hp.get(estimate.id) - target.currentHp;
    assert.ok(damage >= estimate.min && damage <= estimate.max, `${damage} is outside ${estimate.min}–${estimate.max}`);
  }
});
