import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let vite;
let EngineRpg;
let HEROES_DB;
let getRpgActionProfile;
let getRpgCombatantAbility;
let resolveMeleeSuper;
let resolveUniverseSummon;
let resolveSummonChoreography;
let completion;
const engines = [];
const noop = () => {};
const unit = id => ({
  id, name: id, universe: 'Authored RPG regression', category: 'test',
  primaryColor: '#88bbee', secondaryColor: '#cc9977', weaponType: 'melee',
  stats: { hp: 5000, atk: 40, def: 10, spd: 3 },
  simple: { name: 'Basic custom strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Custom skill', type: 'bullet', dmg: 1.4, cd: 5 },
  defense: { name: 'Custom guard', type: 'shield', reduce: 0.5, dur: 2 },
  special: { name: 'Custom special', type: 'bullet', dmg: 2 }
});
const hero = id => {
  const found = HEROES_DB.find(value => value.id === id);
  assert.ok(found, `missing actual catalog hero ${id}`);
  return found;
};
const makeEngine = (players, opponents = [unit('enemy-one'), unit('enemy-two'), unit('enemy-three')]) => {
  const engine = new EngineRpg(760, 420, players, {
    monsters: opponents, bosses: [], customRoster: opponents
  }, { add: noop }, noop, noop, {
    universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' }
  });
  [...engine.heroes, ...engine.enemies].forEach(actor => { actor.atb = 100; actor.specialCharge = 100; });
  engine.autoBattle = false;
  engines.push(engine);
  return engine;
};
const finishAction = (engine, actor) => {
  let remaining = 600;
  while (actor.actionPending && remaining-- > 0) engine.update();
  assert.equal(actor.actionPending, false, 'confirmed special never completed');
};
const id = actor => actor.battleId;
const costs = actor => ({ atb: actor.atb, charge: actor.specialCharge, cooldown: actor.cooldown });
const tick = (engine, count = 1) => { for (let frame = 0; frame < count; frame++) engine.update(); };

before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?rpg-authored-tests'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js?rpg-authored-tests'));
  ({ getRpgActionProfile, getRpgCombatantAbility } = await vite.ssrLoadModule('/src/game/rpgTargeting.js?rpg-authored-tests'));
  ({ resolveMeleeSuper, resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js?rpg-authored-tests'));
  ({ resolveSummonChoreography } = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js?rpg-authored-tests'));
  ({ COMBAT_CAPABILITY_COMPLETION: completion } = await vite.ssrLoadModule('/src/game/combat/completion/catalog.js?rpg-authored-tests'));
});
after(async () => {
  engines.forEach(engine => engine.dispose());
  await vite?.close();
});

test('RPG all authored catalog specials resolve the same identity and effect as their source capability', () => {
  assert.ok(Object.keys(completion).length >= 1089);
  for (const heroId of Object.keys(completion)) {
    const actor = hero(heroId);
    const original = JSON.stringify(actor.special);
    const source = resolveMeleeSuper(actor);
    const ability = getRpgCombatantAbility(actor, 'special');
    const profile = getRpgActionProfile(actor, 'special', 'player', { width: 760, height: 420 });
    assert.equal(ability.name, source.name, heroId);
    assert.equal(profile.name, source.name, heroId);
    assert.equal(profile.effect, source.effect, heroId);
    assert.equal(profile.targetSide, source.targetSide, heroId);
    assert.equal(profile.shape, source.shape, heroId);
    assert.equal(profile.multiplier, source.multiplier, heroId);
    assert.doesNotMatch(profile.name, /Origin Burst|Signature Strike|Breach Technique/i, heroId);
    assert.equal(JSON.stringify(actor.special), original, `${heroId}: resolution mutated the catalog`);
  }
});

test('RPG custom actors retain exact action objects and authored IDs cannot cross universes', () => {
  const custom = {
    ...unit('custom-healer'),
    special: { name: 'Player-created field aid', type: 'heal', dmg: 0, targeting: { effect: 'heal', targetSide: 'ally', shape: 'single', range: 333, healRatio: 0.42 } }
  };
  assert.equal(getRpgCombatantAbility(custom, 'special'), custom.special);
  assert.equal(getRpgCombatantAbility(custom, 'secondary'), custom.secondary);
  assert.equal(getRpgActionProfile(custom, 'special').range, 333);
  assert.equal(getRpgActionProfile(custom, 'special').healRatio, 0.42);
  const wrongUniverse = { ...custom, id: 'stark_warrior' };
  assert.equal(getRpgCombatantAbility(wrongUniverse, 'special'), wrongUniverse.special);
  assert.equal(getRpgActionProfile(wrongUniverse, 'special').name, 'Player-created field aid');
  const customMelee = { ...unit('custom-short-range'), special: { name: 'Custom local strike', type: 'melee', dmg: 3, targeting: { range: 70 } } };
  assert.equal(getRpgActionProfile(customMelee, 'special').range, 70, 'the authored approach adaptation changed custom targeting');
});

test('RPG side-prefixed P2 actors resolve authored abilities through exact source identity', () => {
  const source = hero('ado_avatar');
  const opponent = { ...source, id: 'cpu:ado_avatar', sourceHeroId: source.id };
  const profile = getRpgActionProfile(opponent, 'special', 'enemy');
  assert.equal(profile.name, completion.ado_avatar.special.name);
  assert.equal(profile.effect, 'buff');
  assert.equal(profile.targetSide, 'ally');
  assert.equal(profile.multiplier, 0);
});

for (const side of ['player', 'enemy']) test('RPG authored melee special approaches the selected opponent and applies real damage for ' + side, () => {
  const engine = side === 'player'
    ? makeEngine([hero('stark_warrior')])
    : makeEngine([unit('player-one'), unit('player-two'), unit('player-three')], [hero('stark_warrior')]);
  const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
  const opponents = side === 'player' ? engine.enemies : engine.heroes;
  const hp = opponents.map(target => target.currentHp);
  const sourceRange = completion.stark_warrior.special.targeting.range;
  const originalSpecial = JSON.stringify(actor.special);
  assert.ok(Math.hypot(opponents[2].x - actor.x, opponents[2].y - actor.y) > sourceRange);
  assert.equal(engine.beginTargeting(actor, 'special', side), true);
  assert.equal(engine.selectTarget(id(opponents[2])), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.abilityName, 'Lightning Strike');
  assert.equal(preview.delivery, 'melee');
  assert.equal(preview.effect, 'damage');
  assert.deepEqual(preview.previewTargetIds, [id(opponents[2])]);
  assert.equal(preview.profile.action.targeting.range, sourceRange, 'source range metadata was rewritten');
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(actor.atb, 0);
  assert.equal(actor.specialCharge, 0);
  assert.notEqual(actor.x, actor.homeX, 'the melee actor never approached the target');
  finishAction(engine, actor);
  assert.equal(opponents[0].currentHp, hp[0]);
  assert.equal(opponents[1].currentHp, hp[1]);
  assert.ok(opponents[2].currentHp < hp[2]);
  const dealt = hp[2] - opponents[2].currentHp;
  assert.ok(dealt >= preview.estimates[0].min && dealt <= preview.estimates[0].max);
  assert.equal(actor.x, actor.homeX);
  assert.equal(actor.y, actor.homeY);
  assert.equal(JSON.stringify(actor.special), originalSpecial);
});

for (const side of ['player', 'enemy']) test('RPG authored medical special heals its own eligible squad without damaging opponents for ' + side, () => {
  const team = [hero('fear_jin_sun_kwon'), unit('patient'), unit('healthy')];
  const engine = side === 'player' ? makeEngine(team) : makeEngine([unit('opponent')], team);
  const allies = side === 'player' ? engine.heroes : engine.enemies;
  const opponents = side === 'player' ? engine.enemies : engine.heroes;
  const actor = allies[0];
  const patient = allies[1];
  patient.currentHp -= 1000;
  const patientBefore = patient.currentHp;
  const opponentHp = opponents.map(target => target.currentHp);
  const before = costs(actor);
  assert.equal(engine.beginTargeting(actor, 'special', side), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.abilityName, 'Triage de l’équipe F.E.A.R.');
  assert.equal(preview.effect, 'heal');
  assert.deepEqual(preview.previewTargetIds, [id(patient)]);
  assert.equal(preview.eligibleTargets.every(target => target.side === side), true);
  assert.deepEqual(costs(actor), before);
  assert.equal(engine.confirmTargeting(), true);
  finishAction(engine, actor);
  assert.ok(patient.currentHp > patientBefore);
  assert.equal(patient.currentHp - patientBefore, preview.estimates[0].amount);
  assert.deepEqual(opponents.map(target => target.currentHp), opponentHp);
});

test('RPG authored performer support buffs allies and never becomes an offensive generic burst', () => {
  const engine = makeEngine([hero('ado_avatar'), unit('audience-ally')]);
  const actor = engine.heroes[0];
  const hp = engine.enemies.map(target => target.currentHp);
  assert.match(actor.special.name, /Origin Burst/);
  assert.equal(engine.beginTargeting(actor, 'special'), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.abilityName, completion.ado_avatar.special.name);
  assert.equal(preview.effect, 'buff');
  assert.equal(preview.delivery, 'support');
  assert.equal(preview.estimates.every(estimate => estimate.amount === 0), true);
  engine.confirmTargeting();
  finishAction(engine, actor);
  assert.equal(engine.heroes.every(ally => ally.rpgBuffTicks > 0 && ally.rpgBuffMultiplier > 1), true);
  assert.deepEqual(engine.enemies.map(target => target.currentHp), hp);
});

test('RPG Mei Zhen ancestor invocation uses the authored support correction and retains its exact entity and choreography', () => {
  const actor = hero('mei_zhen');
  const original = JSON.stringify(actor.secondary);
  assert.equal(actor.secondary.type, 'summon', 'the regression fixture must retain the original catalog summon');
  const descriptor = resolveUniverseSummon(actor);
  const profile = getRpgActionProfile(actor, 'summon');
  assert.equal(descriptor.id, 'mei_zhen:summon:mei_zhen:secondary');
  assert.equal(descriptor.kind, 'summon');
  assert.equal(descriptor.entityName, 'Pas de l’Ancêtre');
  assert.equal(descriptor.action.name, 'Pas de l’Ancêtre');
  assert.equal(descriptor.sourceAbility.slot, 'secondary');
  assert.equal(descriptor.sourceAbility.cd, 6);
  assert.equal(descriptor.provenance.identityAuthored, true);
  assert.match(descriptor.provenance.sourceReference, /sans devenir des soldats/);
  assert.equal(descriptor.action.targeting.effect, 'buff');
  assert.equal(descriptor.action.targeting.targetSide, 'ally');
  assert.equal(descriptor.action.targeting.shape, 'group');
  assert.equal(descriptor.action.dmg, 0);
  assert.equal(profile.effect, 'buff');
  assert.equal(profile.multiplier, 0);
  assert.equal(profile.buffMultiplier, 1.12);
  assert.equal(profile.duration, 3);
  assert.equal(descriptor.entityRender.assetMissing, false);
  assert.equal(descriptor.entityRender.asset.id, 'mandate-ancestor');
  assert.equal(descriptor.entityRender.asset.key, 'Mandate of Nine Heavens::Pas de l’Ancêtre::Pas de l’Ancêtre');
  assert.equal(resolveSummonChoreography(descriptor).id, 'mandate-ancestor');
  assert.equal(resolveSummonChoreography(descriptor).path, 'ancestor-guidance');
  assert.equal(JSON.stringify(actor.secondary), original, 'resolution changed the source catalog ability');
});

for (const side of ['player', 'enemy']) test('RPG Mei Zhen invocation applies one allied buff through a paused complete cinematic for ' + side, () => {
  const team = [hero('mei_zhen'), unit('ancestor-ally-one'), unit('ancestor-ally-two')];
  const engine = side === 'player' ? makeEngine(team) : makeEngine([unit('opponent-one'), unit('opponent-two')], team);
  const allies = side === 'player' ? engine.heroes : engine.enemies;
  const opponents = side === 'player' ? engine.enemies : engine.heroes;
  const actor = allies[0];
  const originalCosts = costs(actor);
  const alliedHp = allies.map(target => target.currentHp);
  const opponentHp = opponents.map(target => target.currentHp);
  const impacts = [];
  const applyImpact = engine.applyRpgImpact.bind(engine);
  engine.applyRpgImpact = (source, profile, targets, color, abilityType) => {
    impacts.push({ source: id(source), effect: profile.effect, targets: targets.map(id), abilityType });
    return applyImpact(source, profile, targets, color, abilityType);
  };

  assert.equal(engine.getSummonState(actor, side).ready, true);
  assert.equal(engine.summon(actor, side), true);
  const preview = engine.getTargetingState();
  assert.equal(preview.effect, 'buff');
  assert.equal(preview.profile.targetSide, 'ally');
  assert.equal(preview.profile.shape, 'group');
  assert.deepEqual(preview.previewTargetIds, allies.map(id));
  assert.equal(preview.eligibleTargets.every(target => target.side === side), true);
  assert.equal(preview.estimates.every(estimate => estimate.amount === 0), true);
  assert.deepEqual(costs(actor), originalCosts, 'target selection spent summon resources');
  assert.equal(engine.confirmTargeting(), true);
  assert.deepEqual(costs(actor), { atb: 0, charge: 0, cooldown: 0 });
  assert.equal(actor.summonUsed, true);

  const scene = engine.getSummonSceneState();
  assert.equal(scene.side, side);
  assert.equal(scene.entityAssetId, 'mandate-ancestor');
  assert.equal(scene.choreography.id, 'mandate-ancestor');
  assert.equal(scene.choreography.path, 'ancestor-guidance');
  assert.equal(scene.choreography.effect, 'buff');
  assert.equal(scene.choreography.side, side === 'enemy' ? -1 : 1);
  assert.deepEqual(scene.entityFrame, { index: 0, phase: 'arrival' });
  tick(engine, scene.choreography.arrivalEndTick);
  assert.deepEqual(engine.getSummonSceneState().entityFrame, { index: 1, phase: 'preparation' });
  const paused = engine.getSummonSceneState();
  engine.setPaused(true);
  tick(engine, scene.durationTicks * 2);
  assert.deepEqual(engine.getSummonSceneState(), paused);
  assert.equal(impacts.length, 0);
  assert.equal(allies.every(target => (target.rpgBuffTicks ?? 0) === 0), true);
  assert.deepEqual(opponents.map(target => target.currentHp), opponentHp);
  engine.setPaused(false);

  tick(engine, scene.impactTick - paused.tick - 1);
  assert.equal(impacts.length, 0);
  tick(engine);
  assert.deepEqual(impacts, [{ source: id(actor), effect: 'buff', targets: allies.map(id), abilityType: 'summon' }]);
  assert.equal(allies.every(target => target.rpgBuffTicks === 180 && target.rpgBuffMultiplier === 1.12), true);
  assert.equal(opponents.every(target => (target.rpgBuffTicks ?? 0) === 0), true);
  assert.deepEqual(allies.map(target => target.currentHp), alliedHp);
  assert.deepEqual(opponents.map(target => target.currentHp), opponentHp);
  assert.deepEqual(engine.getSummonSceneState().entityFrame, { index: 2, phase: 'impact' });

  const returnTick = scene.choreography.returnStartTick + 1;
  tick(engine, returnTick - scene.impactTick);
  assert.deepEqual(engine.getSummonSceneState().entityFrame, { index: 3, phase: 'return' });
  tick(engine, scene.durationTicks - returnTick);
  assert.equal(impacts.length, 1, 'the ancestor applied its support effect more than once');
  assert.equal(engine.getSummonSceneState(), null);
  assert.equal(actor.actionPending, false);
  assert.equal(actor.state, 'idle');
  assert.equal(actor.x, actor.homeX);
  assert.equal(actor.y, actor.homeY);
  assert.deepEqual(opponents.map(target => target.currentHp), opponentHp);
  actor.atb = 100;
  actor.specialCharge = 100;
  assert.equal(engine.getSummonState(actor, side).reason, 'used');
  assert.equal(engine.summon(actor, side), false, 'a complete return allowed a second invocation');
});

test('RPG authored cleansing and revival retain their eligible target rules and apply their real effect', () => {
  for (const [heroId, effect] of [['ysolde_quarz', 'cleanse'], ['herbert_west', 'revive']]) {
    const engine = makeEngine([hero(heroId), unit('patient')]);
    const actor = engine.heroes[0];
    const patient = engine.heroes[1];
    const originalCosts = costs(actor);
    assert.equal(engine.beginTargeting(actor, 'special'), false, `${heroId}: no eligible target should mean no action`);
    assert.deepEqual(costs(actor), originalCosts);
    if (effect === 'revive') { patient.currentHp = 0; patient.state = 'dead'; }
    else patient.statusEffects.infected = 100;
    const enemyHp = engine.enemies.map(target => target.currentHp);
    assert.equal(engine.beginTargeting(actor, 'special'), true);
    assert.equal(engine.getTargetingState().effect, effect);
    assert.deepEqual(engine.getTargetingState().previewTargetIds, [id(patient)]);
    engine.confirmTargeting();
    finishAction(engine, actor);
    if (effect === 'revive') assert.equal(patient.currentHp, Math.round(patient.maxHp * completion[heroId].special.targeting.reviveRatio));
    else assert.deepEqual(patient.statusEffects, { infected: 0, glitched: 0, radiated: 0 });
    assert.deepEqual(engine.enemies.map(target => target.currentHp), enemyHp);
  }
});

test('GameCanvas RPG command labels use the same authored ability helper as targeting', () => {
  const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('const getCombatantMove');
  const handler = source.slice(start, source.indexOf('const toggleAuto', start));
  assert.match(handler, /stage\.mode === 'RPG'/);
  assert.match(handler, /getRpgCombatantAbility\(combatant, type\)/);
  assert.ok(handler.indexOf('getRpgCombatantAbility') < handler.indexOf('return combatant[type]'));
  assert.match(source, /getCombatantMove\(activeHeroObj, 'special'\)\.name\.toUpperCase\(\)/);
});
