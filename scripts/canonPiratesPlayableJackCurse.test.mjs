import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { getExpandedStages } from '../src/game/expandedUniverses.js';
import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { applyEncounterOrDirectDamage } from '../src/game/encounterDamage.js';
import { BLACK_PEARL_JACK_INCARNATION, getBlackPearlSourceAmmunition } from '../src/game/canonBlackPearlSourceKits.js';
import * as PiratesCurse from '../src/game/canonPiratesCurseEncounter.js';

const stage = getExpandedStages().find(entry => entry.id === 269);
const engines = [];
let vite;
let EngineRpg;

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?canon-playable-jack-curse'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

function makeEngine({ stageOverride = {}, heroes = ['jack_sparrow_potc', 'will_turner_potc', 'elizabeth_swann_potc'] } = {}) {
  const selected = { ...stage, ...stageOverride };
  const data = resolveStageEnemyData({ stage: selected, ...ENEMIES_DB[selected.universe] });
  const calls = [];
  const completions = [];
  const sources = heroes.map(hero => structuredClone(typeof hero === 'string' ? getHeroById(hero) : hero));
  const engine = new EngineRpg(760, 420, sources, data, { add: (...args) => calls.push(args) }, () => {}, result => completions.push(result), selected);
  engines.push(engine);
  engine.enemyGlobalRecovery = 99999;
  engine.heroes.forEach(ready);
  return Object.assign(engine, { calls, completions });
}
function makeCustomJackEnemyEngine(opponentControl = 'p2') {
  const source = structuredClone(getHeroById('jack_sparrow_potc'));
  const threat = {
    ...source, id: 'p2-jack_sparrow_potc', sourceId: 'jack_sparrow_potc',
    hp: source.stats.hp, atk: source.stats.atk, def: source.stats.def, spd: source.stats.spd
  };
  const selected = { ...stage, customBattle: { singleRoster: true, opponentControl } };
  const data = { monsters: [threat], bosses: [], customRoster: [threat] };
  const calls = [];
  const engine = new EngineRpg(760, 420, [structuredClone(getHeroById('will_turner_potc'))], data,
    { add: (...args) => calls.push(args) }, () => {}, () => {}, selected);
  engines.push(engine);
  engine.enemyGlobalRecovery = 99999;
  [...engine.heroes, ...engine.enemies].forEach(ready);
  return Object.assign(engine, { calls });
}
function ready(actor) { return Object.assign(actor, { atb: 100, state: 'idle', stateTimer: 0, actionPending: false }); }
function advance(engine, ticks) { for (let index = 0; index < ticks; index++) engine.update(); }
function command(engine, action, index = 0) {
  ready(engine.heroes[index]);
  assert.equal(engine.triggerPiratesCurseAction(action, engine.heroes[index]), true);
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks);
}
function collect(engine, index = 0) { command(engine, 'collect-final-coins', index); }
function restore(engine, index = 0) {
  collect(engine, index);
  command(engine, 'coordinate-will', index);
  command(engine, 'restore-chest', index);
}
const boss = engine => engine.enemies.find(enemy => enemy.name === 'Hector Barbossa');
const curseProtected = (engine, target) => PiratesCurse.isPiratesCursedHero(engine.piratesCurseEncounter, target, engine.heroes);
const resources = hero => ({ atb: hero.atb, cooldown: hero.cooldown, specialCharge: hero.specialCharge, ammo: hero.sourceAmmoRemaining, state: hero.state, actionPending: hero.actionPending });

test('the actual playable 2003 Jack source kit exposes a single reserved pistol shot without changing base stats', () => {
  const hero = getHeroById('jack_sparrow_potc');
  assert.equal(hero.incarnation, BLACK_PEARL_JACK_INCARNATION);
  assert.equal(hero.canonCombatPresentation, true);
  assert.deepEqual([hero.stats.hp, hero.stats.atk, hero.stats.def, hero.stats.spd], [100, 12, 6, 6]);
  const ammo = getBlackPearlSourceAmmunition(hero, 'secondary');
  assert.equal(ammo.maxShots, 1);
  assert.equal(ammo.resetPolicy, 'new-battle');
  assert.equal(getBlackPearlSourceAmmunition(hero, 'simple'), null);
});

test('Jack is mortal before the queued coin collection lands and becomes cursed at its actual impact', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  jack.currentHp = 70;
  assert.equal(curseProtected(engine, jack), false);
  assert.equal(applyEncounterOrDirectDamage(engine, jack, 7, { kind: 'field-super' }), 7);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', jack), true);
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks - 1);
  assert.equal(curseProtected(engine, jack), false);
  assert.equal(applyEncounterOrDirectDamage(engine, jack, 6, { kind: 'field-super' }), 6);
  advance(engine, 1);
  assert.equal(curseProtected(engine, jack), true);
  assert.deepEqual(engine.getPiratesCurseEncounterState().cursedHeroIds, [jack.battleId]);
  assert.equal(jack.currentHp, 57);
});

test('sword hits on cursed playable Jack cannot spend a shield, apply infection, weaken defense or feed lifesteal', () => {
  const engine = makeEngine();
  collect(engine);
  const jack = engine.heroes[0];
  const attacker = boss(engine);
  jack.battleItemShield = 35;
  jack.currentHp = 48;
  attacker.talent = 'lifedrain';
  attacker.currentHp = 100;
  assert.equal(engine.applyDamage(attacker, jack, 99999, 'infected'), 0);
  assert.equal(jack.currentHp, 48);
  assert.equal(jack.battleItemShield, 35);
  assert.equal(jack.statusEffects.infected, 0);
  assert.equal(attacker.currentHp, 100);
  const defense = jack.stats.def;
  attacker.talent = 'suppressing_fire';
  assert.equal(engine.applyDamage(attacker, jack, 99999, 'radiated'), 0);
  assert.equal(jack.stats.def, defense);
  assert.equal(jack.statusEffects.radiated, 0);
});

for (const context of [
  { kind: 'battle-item', absorbBattleItemShield: true },
  { kind: 'field-super' },
  { kind: 'anomaly', nonlethal: true }
]) {
  test(`external ${context.kind} damage cannot bypass the playable Jack curse or spend his pickup shield`, () => {
    const engine = makeEngine();
    collect(engine);
    const jack = engine.heroes[0];
    jack.battleItemShield = 35;
    const hp = jack.currentHp;
    assert.equal(applyEncounterOrDirectDamage(engine, jack, 99999, context), 0);
    assert.equal(jack.currentHp, hp);
    assert.equal(jack.battleItemShield, 35);
    assert.equal(engine.gameOver, false);
  });
}

test('already active infection advances its timer but cannot remove HP from a cursed Jack', () => {
  const engine = makeEngine();
  collect(engine);
  const [jack, will] = engine.heroes;
  jack.currentHp = 40;
  will.currentHp = 40;
  jack.statusEffects.infected = 61;
  will.statusEffects.infected = 61;
  advance(engine, 1);
  assert.deepEqual([jack.currentHp, jack.statusEffects.infected], [40, 60]);
  assert.deepEqual([will.currentHp, will.statusEffects.infected], [37, 60]);
});

test('a legacy direct death restores the positive HP held at collection instead of healing Jack to his maximum', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  jack.currentHp = 23;
  collect(engine);
  Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 });
  advance(engine, 1);
  assert.equal(jack.currentHp, 23);
  assert.equal(jack.state, 'idle');
  assert.equal(jack.stateTimer, 0);
  assert.equal(engine.gameOver, false);
  assert.deepEqual(engine.getPiratesCurseEncounterState().cursedHeroIds, [jack.battleId]);
});

test('a queued legacy HP write cannot bypass the curse and defeat the last living Jack in the same simulation tick', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  jack.currentHp = 19;
  collect(engine);
  engine.heroes.slice(1).forEach(hero => Object.assign(hero, { currentHp: 0, state: 'dead', stateTimer: 999 }));
  engine.scheduleAction(() => Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 }), 16);
  advance(engine, 1);
  assert.equal(jack.currentHp, 19);
  assert.equal(jack.state, 'idle');
  assert.equal(engine.gameOver, false);
  assert.deepEqual(engine.completions, []);
});

test('a coin-bound Jack coordinator survives a legacy death before the queued source payment inspects him', () => {
  const engine = makeEngine();
  collect(engine);
  const jack = engine.heroes[0];
  ready(jack);
  assert.equal(engine.triggerPiratesCurseAction('coordinate-will', jack), true);
  Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 });
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks);
  assert.ok(jack.currentHp > 0);
  assert.equal(engine.getPiratesCurseEncounterState().willBloodReady, true);
  assert.equal(engine.getPiratesCurseEncounterState().jackBloodReady, true);
});

test('a legacy write earlier in the same due-callback batch cannot cancel the coin-bound Jack source payment', () => {
  const engine = makeEngine();
  collect(engine);
  const jack = engine.heroes[0];
  ready(jack);
  engine.scheduleAction(() => Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 }),
    PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks * 1000 / 60);
  assert.equal(engine.triggerPiratesCurseAction('coordinate-will', jack), true);
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks);
  assert.ok(jack.currentHp > 0);
  assert.equal(engine.getPiratesCurseEncounterState().willBloodReady, true);
  assert.equal(engine.getPiratesCurseEncounterState().jackBloodReady, true);
  assert.equal(engine.getPiratesCurseEncounterState().commandPending, null);
  assert.equal(jack.actionPending, false);
});

test('confirmed enemy attacks and manual previews recognize the same protected playable Jack', () => {
  const engine = makeEngine();
  collect(engine);
  engine.opponentControl = 'p2';
  const jack = engine.heroes[0];
  const attacker = boss(engine);
  ready(attacker);
  assert.equal(engine.beginTargeting(attacker, 'simple', 'enemy'), true);
  assert.equal(engine.selectTarget(jack.battleId), true);
  const preview = engine.getTargetingState();
  assert.deepEqual([preview.estimates[0].amount, preview.estimates[0].min, preview.estimates[0].max], [0, 0, 0]);
  assert.equal(preview.estimates[0].blockedByAztecCurse, true);
  const hp = jack.currentHp;
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(attacker.atb, 0);
  advance(engine, 18);
  assert.equal(jack.currentHp, hp);
  assert.equal(attacker.actionPending, false);
});

test('collecting the source coins never revives Jack who was already dead at impact', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 });
  collect(engine, 1);
  assert.equal(jack.currentHp, 0);
  assert.equal(curseProtected(engine, jack), false);
  assert.deepEqual(engine.getPiratesCurseEncounterState().cursedHeroIds, []);
  advance(engine, 60);
  assert.equal(jack.currentHp, 0);
  assert.equal(engine.gameOver, false);
});

test('a Jack killed while another actor collects the coins is not captured or revived at collection impact', () => {
  const engine = makeEngine();
  const [jack, will] = engine.heroes;
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', will), true);
  assert.equal(applyEncounterOrDirectDamage(engine, jack, 99999, { kind: 'field-super' }), jack.maxHp);
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks);
  assert.equal(jack.currentHp, 0);
  assert.equal(curseProtected(engine, jack), false);
  assert.deepEqual(engine.getPiratesCurseEncounterState().cursedHeroIds, []);
});

test('each living exact-source Jack is bound by its battle identity without sharing HP with another copy', () => {
  const engine = makeEngine({ heroes: ['jack_sparrow_potc', 'jack_sparrow_potc', 'will_turner_potc'] });
  const [first, second] = engine.heroes;
  first.currentHp = 17;
  second.currentHp = 51;
  collect(engine, 2);
  assert.notEqual(first.battleId, second.battleId);
  assert.equal(curseProtected(engine, first), true);
  assert.equal(curseProtected(engine, second), true);
  assert.deepEqual(new Set(engine.getPiratesCurseEncounterState().cursedHeroIds), new Set([first.battleId, second.battleId]));
  first.currentHp = 0;
  second.currentHp = 0;
  advance(engine, 1);
  assert.deepEqual([first.currentHp, second.currentHp], [17, 51]);
});

test('a runtime actor with the exact sourceId is recognized while an unattached copy cannot borrow its curse', () => {
  const source = { ...getHeroById('jack_sparrow_potc'), id: 'runtime-jack-source', sourceId: 'jack_sparrow_potc' };
  const engine = makeEngine({ heroes: [source, 'will_turner_potc'] });
  collect(engine, 1);
  const jack = engine.heroes[0];
  assert.equal(curseProtected(engine, jack), true);
  assert.equal(curseProtected(engine, { ...jack }), false);
  assert.equal(curseProtected(engine, boss(engine)), false);
});

for (const override of [
  { incarnation: 'Pirates of the Caribbean: Dead Man’s Chest (2006) - Captain Jack Sparrow' },
  { universe: 'Halo' },
  { canonCombatPresentation: false },
  { id: 'unrelated-pirate' }
]) {
  test(`a mismatched playable source identity remains mortal after collection: ${JSON.stringify(override)}`, () => {
    const source = { ...getHeroById('jack_sparrow_potc'), ...override };
    const engine = makeEngine({ heroes: [source, 'will_turner_potc'] });
    collect(engine, 1);
    const actor = engine.heroes[0];
    assert.equal(curseProtected(engine, actor), false);
    assert.equal(applyEncounterOrDirectDamage(engine, actor, 13, { kind: 'field-super' }), 13);
    assert.deepEqual(engine.getPiratesCurseEncounterState().cursedHeroIds, []);
  });
}

test('Will, Elizabeth and unrelated allies keep their ordinary damage rules while Jack holds his source coin', () => {
  const engine = makeEngine();
  collect(engine);
  for (const actor of engine.heroes.slice(1)) {
    assert.equal(curseProtected(engine, actor), false);
    const hp = actor.currentHp;
    assert.equal(applyEncounterOrDirectDamage(engine, actor, 11, { kind: 'field-super' }), 11);
    assert.equal(actor.currentHp, hp - 11);
  }
});

for (const stageOverride of [
  { id: 270 }, { incarnation: 'Dead Man’s Chest (2006)' },
  { customBattle: {} }, { isCustomBattle: true }, { isCustom: true }
]) {
  test(`source curse protection does not leak to a different or custom stage: ${JSON.stringify(stageOverride)}`, () => {
    const engine = makeEngine({ stageOverride });
    const jack = engine.heroes[0];
    assert.equal(engine.piratesCurseEncounter, null);
    assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', jack), false);
    assert.equal(curseProtected(engine, jack), false);
    assert.equal(applyEncounterOrDirectDamage(engine, jack, 10, { kind: 'field-super' }), 10);
  });
}

test('pause and a pending collection cannot grant the source curse before simulation resumes', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  jack.atb = 99;
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', jack), false);
  ready(jack);
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', jack), true);
  engine.setPaused(true);
  advance(engine, 60);
  assert.equal(curseProtected(engine, jack), false);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  engine.setPaused(false);
  advance(engine, PiratesCurse.PIRATES_CURSE_RULES.commandImpactTicks);
  assert.equal(curseProtected(engine, jack), true);
});

test('restoration makes playable Jack mortal immediately even while the enemy final-shot transaction remains locked', () => {
  const engine = makeEngine();
  restore(engine, 1);
  const jack = engine.heroes[0];
  const state = engine.getPiratesCurseEncounterState();
  assert.equal(state.curseActive, false);
  assert.equal(state.sourceShotFired, true);
  assert.equal(state.sourceShotResolved, false);
  assert.equal(state.cinematicLocked, true);
  assert.equal(curseProtected(engine, jack), false);
  assert.deepEqual(state.cursedHeroIds, []);
  assert.equal(applyEncounterOrDirectDamage(engine, jack, 15, { kind: 'field-super' }), 15);
  const hp = boss(engine).currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, boss(engine), 99999, { kind: 'field-super' }), 0);
  assert.equal(boss(engine).currentHp, hp);
});

test('a raw Jack death after restoration is final and is not repaired by the enemy cinematic lock', () => {
  const engine = makeEngine();
  restore(engine, 1);
  const jack = engine.heroes[0];
  Object.assign(jack, { currentHp: 0, state: 'dead', stateTimer: 999 });
  advance(engine, 1);
  assert.equal(jack.currentHp, 0);
  assert.equal(jack.state, 'dead');
  assert.equal(engine.getPiratesCurseEncounterState().sourceShotResolved, true);
  advance(engine, 121);
  assert.deepEqual(engine.completions, ['victory']);
});

test('a living cursed Jack prevents an impossible defeat before restitution, then becomes mortal for the finale', () => {
  const engine = makeEngine();
  collect(engine);
  engine.heroes.forEach(hero => Object.assign(hero, { currentHp: 0, state: 'dead', stateTimer: 999 }));
  advance(engine, 1);
  assert.ok(engine.heroes[0].currentHp > 0);
  assert.ok(engine.heroes.slice(1).every(hero => hero.currentHp === 0));
  assert.equal(engine.gameOver, false);
  command(engine, 'coordinate-will');
  command(engine, 'restore-chest');
  assert.equal(curseProtected(engine, engine.heroes[0]), false);
  applyEncounterOrDirectDamage(engine, engine.heroes[0], 99999, { kind: 'field-super' });
  advance(engine, 122);
  assert.deepEqual(engine.completions, ['defeat']);
});

test('the source ritual still wins once with Barbossa dead and the remaining crew alive, consuming the reserved shot', () => {
  const engine = makeEngine();
  restore(engine);
  assert.equal(engine.heroes[0].sourceAmmoRemaining, 0);
  advance(engine, 122);
  assert.equal(engine.wave, 1);
  assert.equal(engine.maxWaves, 1);
  assert.equal(boss(engine).currentHp, 0);
  assert.ok(engine.enemies.filter(enemy => enemy !== boss(engine)).every(enemy => enemy.currentHp === enemy.maxHp));
  assert.deepEqual(engine.completions, ['victory']);
  advance(engine, 240);
  assert.deepEqual(engine.completions, ['victory']);
});

test('manual or automatic pistol attempts against the source cursed enemies reserve the only shot without spending resources', () => {
  const engine = makeEngine();
  const jack = engine.heroes[0];
  jack.specialCharge = 45;
  const before = resources(jack);
  assert.equal(jack.sourceAmmoRemaining, 1);
  assert.equal(engine.beginTargeting(jack, 'secondary'), false);
  assert.equal(engine.targeting, null);
  assert.equal(engine.triggerAbility(jack, 'secondary', [boss(engine).battleId]), false);
  assert.deepEqual(resources(jack), before);
  collect(engine, 1);
  ready(jack);
  const afterCollection = resources(jack);
  assert.equal(engine.beginTargeting(jack, 'secondary'), false);
  assert.deepEqual(resources(jack), afterCollection);
});

test('manual pistol targeting outside the source curse spends no shot until confirmation and can be cancelled safely', () => {
  const engine = makeEngine({ stageOverride: { id: 270 } });
  const jack = engine.heroes[0];
  const before = resources(jack);
  assert.equal(engine.beginTargeting(jack, 'secondary'), true);
  assert.equal(jack.sourceAmmoRemaining, 1);
  assert.deepEqual(resources(jack), before);
  engine.cancelTargeting();
  assert.deepEqual(resources(jack), before);
  assert.equal(engine.beginTargeting(jack, 'secondary'), true);
  const target = engine.enemies[0];
  assert.equal(engine.selectTarget(target.battleId), true);
  const hp = target.currentHp;
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(jack.sourceAmmoRemaining, 0);
  assert.equal(jack.atb, 0);
  assert.ok(jack.cooldown > 0);
  advance(engine, 18);
  assert.ok(target.currentHp < hp);
});

test('a spent pistol cannot reopen targeting or spend ATB, charge or cooldown after becoming ready again', () => {
  const engine = makeEngine({ stageOverride: { id: 270 } });
  const jack = engine.heroes[0];
  assert.equal(engine.triggerAbility(jack, 'secondary', [engine.enemies[0].battleId]), true);
  advance(engine, 35);
  ready(jack);
  jack.cooldown = 0;
  const before = resources(jack);
  assert.equal(engine.beginTargeting(jack, 'secondary'), false);
  assert.equal(engine.targeting, null);
  assert.equal(engine.triggerAbility(jack, 'secondary'), false);
  assert.deepEqual(resources(jack), before);
  assert.equal(engine.triggerAbility(jack, 'simple', [engine.enemies[0].battleId]), true);
});

test('a new RPG battle receives its own single pistol reserve without rewriting the shared hero definition', () => {
  const hero = getHeroById('jack_sparrow_potc');
  const original = structuredClone(hero);
  const first = makeEngine({ stageOverride: { id: 270 }, heroes: [hero, 'will_turner_potc'] });
  assert.equal(first.triggerAbility(first.heroes[0], 'secondary', [first.enemies[0].battleId]), true);
  assert.equal(first.heroes[0].sourceAmmoRemaining, 0);
  const second = makeEngine({ stageOverride: { id: 270 }, heroes: [hero, 'will_turner_potc'] });
  assert.equal(second.heroes[0].sourceAmmoRemaining, 1);
  assert.deepEqual(hero, original);
});

test('a later-film Jack or an unrelated hero is not subjected to the source pistol reserve', () => {
  const later = { ...getHeroById('jack_sparrow_potc'), incarnation: 'Pirates of the Caribbean: At World’s End (2007)' };
  const engine = makeEngine({ heroes: [later, 'will_turner_potc'] });
  const actor = engine.heroes[0];
  assert.equal(getBlackPearlSourceAmmunition(actor, 'secondary'), null);
  assert.equal(engine.beginTargeting(actor, 'secondary'), true);
  engine.cancelTargeting();
  assert.equal(engine.heroes[1].sourceAmmoRemaining == null, true);
});

test('custom P2 source Jack receives one finite pistol round without inheriting the stage 269 curse', () => {
  const engine = makeCustomJackEnemyEngine();
  const jack = engine.enemies[0];
  assert.equal(jack.sourceId, 'jack_sparrow_potc');
  assert.equal(getBlackPearlSourceAmmunition(jack, 'secondary').maxShots, 1);
  assert.equal(jack.sourceAmmoRemaining, 1);
  assert.equal(engine.piratesCurseEncounter, null);
  const hp = jack.currentHp;
  assert.equal(applyEncounterOrDirectDamage(engine, jack, 9, { kind: 'field-super' }), 9);
  assert.equal(jack.currentHp, hp - 9);
  assert.equal(jack.sourceAmmoRemaining, 1);
});

test('custom P2 pistol selection and cancellation keep the reserve until a confirmed enemy attack lands', () => {
  const engine = makeCustomJackEnemyEngine();
  const jack = engine.enemies[0];
  const hero = engine.heroes[0];
  const before = resources(jack);
  assert.equal(engine.beginTargeting(jack, 'secondary', 'enemy'), true);
  assert.equal(engine.selectTarget(hero.battleId), true);
  assert.deepEqual(resources(jack), before);
  engine.cancelTargeting();
  assert.deepEqual(resources(jack), before);
  assert.equal(engine.beginTargeting(jack, 'secondary', 'enemy'), true);
  assert.equal(engine.selectTarget(hero.battleId), true);
  const hp = hero.currentHp;
  assert.equal(engine.confirmTargeting(), true);
  assert.equal(jack.sourceAmmoRemaining, 0);
  assert.equal(jack.atb, 0);
  assert.ok(jack.cooldown > 0);
  assert.equal(hero.currentHp, hp);
  advance(engine, 18);
  assert.ok(hero.currentHp < hp);
  assert.equal(Number.isFinite(jack.sourceAmmoRemaining), true);
});

test('a spent custom P2 pistol rejects new targeting and direct orders without losing resources while swordplay remains usable', () => {
  const engine = makeCustomJackEnemyEngine();
  const jack = engine.enemies[0];
  const hero = engine.heroes[0];
  assert.equal(engine.triggerEnemyAbility(jack, 'secondary', [hero.battleId]), true);
  advance(engine, 35);
  ready(jack);
  jack.cooldown = 0;
  const before = resources(jack);
  assert.equal(engine.beginTargeting(jack, 'secondary', 'enemy'), false);
  assert.equal(engine.targeting, null);
  assert.equal(engine.triggerEnemyAbility(jack, 'secondary', [hero.battleId]), false);
  assert.deepEqual(resources(jack), before);
  const hp = hero.currentHp;
  assert.equal(engine.triggerEnemyAbility(jack, 'simple', [hero.battleId]), true);
  assert.equal(jack.sourceAmmoRemaining, 0);
  advance(engine, 12);
  assert.ok(hero.currentHp < hp);
});

test('custom CPU Jack fires once then chooses swordplay through the normal enemy action loop', () => {
  const engine = makeCustomJackEnemyEngine('cpu');
  const jack = engine.enemies[0];
  const hero = engine.heroes[0];
  engine.enemyGlobalRecovery = 0;
  const firstHp = hero.currentHp;
  advance(engine, 1);
  assert.equal(jack.sourceAmmoRemaining, 0);
  assert.equal(jack.atb, 0);
  assert.ok(jack.cooldown > 0);
  assert.ok(engine.calls.some(call => call[7] === 'bullet'));
  advance(engine, 35);
  assert.ok(hero.currentHp < firstHp);
  ready(jack);
  jack.cooldown = 0;
  engine.enemyGlobalRecovery = 0;
  engine.calls.length = 0;
  const secondHp = hero.currentHp;
  advance(engine, 1);
  assert.equal(jack.sourceAmmoRemaining, 0);
  assert.equal(jack.atb, 0);
  assert.equal(jack.cooldown, 0);
  assert.ok(!engine.calls.some(call => call[7] === 'bullet'));
  assert.ok(engine.calls.some(call => call[7] === 'spark'));
  advance(engine, 12);
  assert.ok(hero.currentHp < secondHp);
  assert.equal(Number.isFinite(jack.sourceAmmoRemaining), true);
});

test('disposing a pending coin collection cannot bind or resurrect a playable Jack', () => {
  const engine = makeEngine();
  assert.equal(engine.triggerPiratesCurseAction('collect-final-coins', engine.heroes[0]), true);
  engine.dispose();
  advance(engine, 60);
  assert.equal(engine.getPiratesCurseEncounterState().finalCoinsCollected, false);
  assert.equal(curseProtected(engine, engine.heroes[0]), false);
});
