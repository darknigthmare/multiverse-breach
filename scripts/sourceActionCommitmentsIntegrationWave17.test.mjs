import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { captureRpgActionCommitment, captureSourceActionContract } from '../src/game/rpgActionCommitment.js';

let vite, Rpg, Tactics, captureTacticsAttackCommitment;
const engines = [];
const actor = id => ({ id, name: id, sourceId: id, sourceHeroId: `${id}-selected`, universe: 'QA',
  stats: { hp: 400, atk: 40, def: 0, spd: 1 }, hp: 400, atk: 40, def: 0, spd: 1,
  weapon: 'gun', weaponType: 'gun',
  simple: { name: 'Committed shot', type: 'bullet', dmg: 1, targeting: { nonlethal: true },
    tacticsProfile: { shape: 'single', range: 6 } },
  secondary: { name: 'Heavy shot', type: 'bullet', dmg: 2, cd: 3 },
  special: { name: 'Limit shot', type: 'bullet', dmg: 3 },
  defense: { name: 'Guard', type: 'shield', reduce: .4, dur: 1 } });
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg: Rpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineTactics: Tactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ captureTacticsAttackCommitment } = await vite.ssrLoadModule('/src/game/tacticsAttackCommitment.js')); 
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
function fixture(mode) {
  const roster = ['e0', 'e1', 'e2'].map(actor);
  const Engine = mode === 'RPG' ? Rpg : Tactics;
  const engine = new Engine(760, 420, ['p0', 'p1', 'p2'].map(actor),
    { customRoster: roster, monsters: roster, bosses: [] }, { add() {} }, () => {}, () => {},
    { universe: 'QA', mode, disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine);
  const caster = engine.heroes[0], target = engine.enemies[0];
  if (mode === 'RPG') {
    Object.assign(caster, { atb: 100, cooldown: 100, specialCharge: 0 });
  } else {
    engine.timers.clear(); engine.tiles = []; engine.obstacles = [];
    engine.escortUnit = null; engine.protectedArtifact = null; engine.objective = 'rout';
    engine.cols = 10; engine.rows = 8; engine.autoBattle = false;
    engine.missionProfile = { ...engine.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
    engine.heroes.forEach((unit, i) => Object.assign(unit, { gridX: 1, gridY: 1 + i * 2,
      currentHp: 400, state: 'idle', stateTimer: 0, cooldown: 100, specialCharge: 0 }));
    engine.enemies.forEach((unit, i) => Object.assign(unit, { gridX: 3, gridY: 1 + i * 2,
      currentHp: 400, state: 'idle', stateTimer: 0, cooldown: 100, specialCharge: 0 }));
    engine.turnQueue = [{ unit: caster, type: 'hero' }]; engine.startTurn(); engine.timers.clear();
    engine.movementBudget = 0; engine.movementSpent = 0;
  }
  const launch = () => {
    if (mode === 'RPG') assert.equal(engine.executeRpgAction(engine.getActionContext(caster, 'simple'), [target.battleId]), true);
    else { engine.runHeroAI(); assert.equal(engine.actionPhase, 'resolving'); }
  };
  const settle = () => {
    for (let i = 0; i < 35; i++) {
      if (mode === 'RPG') engine.advanceActions(); else engine.advanceScheduledActions();
    }
  };
  return { engine, caster, target, launch, settle };
}
for (const mode of ['RPG', 'Tactics']) {
  for (const member of ['caster', 'target']) test(`${mode}: changed ${member} sourceHeroId cannot inherit the same battle ID and numbers`, () => {
    const f = fixture(mode), unit = f[member], originalId = unit.battleId, sourceId = unit.sourceId;
    f.launch();
    unit.sourceHeroId = `${unit.sourceHeroId}-different`;
    assert.equal(unit.battleId, originalId); assert.equal(unit.sourceId, sourceId);
    const hp = f.target.currentHp, otherHp = f.engine.enemies[1].currentHp;
    f.settle();
    assert.equal(f.target.currentHp, hp); assert.equal(f.engine.enemies[1].currentHp, otherHp, 'no substitute recipient');
  });
  test(`${mode}: an unchanged source contract resolves once while HP, buffs and display metadata stay live`, () => {
    const f = fixture(mode); f.launch();
    f.caster.name = 'Translated display name'; f.caster.stats.atk = 70; f.caster.atk = 70;
    f.caster.presentation = { arbitrary: () => true }; f.target.currentHp = 250;
    f.settle(); assert.ok(f.target.currentHp < 250);
    const hp = f.target.currentHp; f.settle(); assert.equal(f.target.currentHp, hp);
  });
  test(`${mode}: changing selected nonlethal metadata invalidates a pending shot`, () => {
    const f = fixture(mode); f.launch(); f.caster.simple.targeting.nonlethal = false;
    f.settle(); assert.equal(f.target.currentHp, 400);
  });
}

// Exercise the selected source contract separately from each mode's timing,
// including nested in-place edits that a shallow object comparison would miss.
const selectedProfile = () => ({ sourceHeroId: 'kirito_sao', universe: 'Sword Art Online',
  effect: 'damage', multiplier: 4.5,
  action: { type: 'melee', dmg: 4.5, cd: 3, animationDuration: 3.6, hitAt: .8, targeting: {
    hitSequence: { kind: 'starburst-stream', hitCount: 16, firstAt: .8, lastAt: 3.05,
      releaseWindow: { start: 0, end: .09 }, nativeRecoveryAfter: 3.2 }
  } } });
const controlProfile = () => ({ sourceHeroId: 'tail_concerto_waffle', universe: 'Tail Concerto',
  effect: 'control', multiplier: 0, controlKind: 'bubble-capture', nonlethal: true,
  controlDuration: 1.25, tacticsTurns: 1, requiresExplicitTargetEligibility: true,
  action: { type: 'control', dmg: 0, cd: 3 } });
const okarunProfile = () => ({ sourceHeroId: 'oken_dandadan', universe: 'Dandadan',
  effect: 'damage', multiplier: 4.2, action: { type: 'melee', dmg: 4.2, cd: 3,
    targeting: { sourceOkarunAllOutWave17: true, maxAllOutUses: 2 } } });
const jadeProfile = () => ({ sourceHeroId: 'beyond_good_evil_jade', universe: 'Beyond Good & Evil',
  name: 'Gyrodisk de Jade', effect: 'damage', multiplier: 2.4, delivery: 'projectile',
  sourceAbility: { slot: 'secondary' }, action: { type: 'bullet', dmg: 2.4, cd: 3 } });
const changes = [
  ['Jade action admission name', jadeProfile, p => { p.name = 'Different action'; }],
  ['Jade selected slot', jadeProfile, p => { p.sourceAbility.slot = 'special'; }],
  ['source effect', controlProfile, p => { p.effect = 'damage'; }],
  ['control turn bound', controlProfile, p => { p.tacticsTurns = 2; }],
  ['control kind', controlProfile, p => { p.controlKind = 'possession'; }],
  ['control duration', controlProfile, p => { p.controlDuration = 2; }],
  ['explicit eligibility', controlProfile, p => { p.requiresExplicitTargetEligibility = false; }],
  ['source use limit', okarunProfile, p => { p.action.targeting.maxAllOutUses = 3; }],
  ['sequence kind', selectedProfile, p => { p.action.targeting.hitSequence.kind = 'liberate'; }],
  ['sequence count', selectedProfile, p => { p.action.targeting.hitSequence.hitCount = 7; }],
  ['sequence release start', selectedProfile, p => { p.action.targeting.hitSequence.firstAt = .9; }],
  ['sequence release window', selectedProfile, p => { p.action.targeting.hitSequence.releaseWindow.end = .2; }],
  ['sequence recovery', selectedProfile, p => { p.action.targeting.hitSequence.nativeRecoveryAfter = 3.4; }],
  ['selected animation timing', selectedProfile, p => { p.action.animationDuration = 4; }]
];
for (const mode of ['RPG', 'Tactics']) for (const [label, make, change] of changes) {
  test(`${mode}: selected source ${label} cannot mutate in place during a commitment`, () => {
    const profile = make(), caster = actor('caster'), target = actor('target');
    const engine = { heroes: [caster], enemies: [target], obstacles: [], actorLifetimes: new WeakMap(),
      getActionContext: () => ({ profile }), getActionDefinition: () => profile.action,
      getAttackProfile: () => profile, getActionBaseDamage: () => 40, isActiveCombatant: () => true };
    caster.currentHp = target.currentHp = 400; caster.state = target.state = 'idle'; caster.simple = profile.action;
    const commitment = mode === 'RPG'
      ? captureRpgActionCommitment(engine, { actor: caster, abilityType: 'simple', side: 'player', profile }, [target])
      : captureTacticsAttackCommitment(engine, caster, 'simple', [{ unit: target }], 'hero');
    const valid = mode === 'RPG' ? commitment.casterValid : commitment.canResolve;
    assert.equal(valid(), true); change(profile); assert.equal(valid(), false);
  });
}
test('zero sequence values are preserved and unrelated callbacks are excluded from the source contract', () => {
  const profile = selectedProfile(); profile.action.targeting.hitSequence.hitCount = 0;
  const matches = captureSourceActionContract(profile, profile.action);
  profile.visual = { progress: .7, draw() {} }; profile.action.onHit = () => {};
  assert.equal(matches(profile, profile.action), true);
  profile.action.targeting.hitSequence.hitCount = 1;
  assert.equal(matches(profile, profile.action), false);
});
