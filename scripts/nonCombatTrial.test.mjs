import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import {
  EngineNonCombatTrial,
  NON_COMBAT_TRIAL_TYPES,
  inferNonCombatTrial,
  makeNonCombatPolicyFromThreat
} from '../src/game/nonCombatTrial.js';
import { LORE_WORLD_BOSS_POLICIES } from '../src/game/loreWorldBossOverrides.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { getExpandedStages } from '../src/game/expandedUniverses.js';

const hubSource = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const indexCssSource = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

const hero = id => ({
  id,
  name: id,
  category: 'tactical',
  stats: { hp: 100, atk: 10, def: 5, spd: 5 },
  primaryColor: '#39c5bb',
  secondaryColor: '#ffffff',
  weaponType: 'focus'
});

const makePolicy = (objective, trial = {}) => ({
  type: 'policy',
  policy: 'nonCombatFinal',
  source: 'test',
  universe: 'Test Universe',
  objective: { fr: objective, en: objective },
  nonCombatTrial: trial
});

test('pure resolver recognizes every supported neutral trial family', () => {
  const cases = [
    ['Casser la voiture avant la fin du temps.', 'break-object'],
    ['Toucher toutes les cibles du stand de tir.', 'hit-targets'],
    ['Récupérer les huit pages.', 'collect'],
    ['Activer chaque relais.', 'switches'],
    ['Libérer puis sauver la victime.', 'rescue'],
    ['Survivre et protéger le refuge jusqu’au matin.', 'survive'],
    ['Atteindre la sortie et évacuer.', 'escape'],
    ['Rassembler les preuves et obtenir les aveux.', 'evidence'],
    ['Find Bubba and trigger the level exit.', 'escape']
  ];

  for (const [objective, expected] of cases) {
    assert.equal(inferNonCombatTrial(makePolicy(objective)).type, expected, objective);
  }
  assert.deepEqual(NON_COMBAT_TRIAL_TYPES, [
    'break-object',
    'hit-targets',
    'collect',
    'switches',
    'rescue',
    'survive',
    'escape',
    'evidence',
    'escape-evidence'
  ]);
  assert.equal(inferNonCombatTrial({ policy: 'combat', objective: 'Defeat the fighter.' }), null);
});

test('cure inference recognizes complete medical verbs with punctuation and mixed case', () => {
  for (const objective of [
    'Cure Manchas.',
    'The antidotal dose cures Manchas.',
    'Keep the cured patient safe.',
    'Finish curing Manchas.',
    'CURE: Manchas.'
  ]) {
    assert.equal(inferNonCombatTrial(makePolicy(objective)).type, 'rescue', objective);
  }
});

test('secure and procure wording never becomes a cure-based rescue', () => {
  const cases = [
    ['Secure the fourth nuclear warhead and disarm its transfer system.', 'switches'],
    ['The warhead is secured; disable the transfer system.', 'switches'],
    ['Secure the evidence.', 'evidence'],
    ['Procure evidence and identify the suspect.', 'evidence'],
    ['Secure the exit.', 'escape'],
    ['Keep the secured shelter protected until morning.', 'survive'],
    ['Procure the items and collect every page.', 'collect'],
    ['The route is obscure; activate the relay.', 'switches']
  ];
  for (const [objective, expected] of cases) {
    assert.equal(inferNonCombatTrial(makePolicy(objective)).type, expected, objective);
  }
});

test('other rescue terms and the composite and authored type priorities remain unchanged', () => {
  for (const objective of [
    'Rescue the captive.', 'Sauver la victime.', 'Libérer la victime.',
    'Free the captive.', 'Guérir Manchas.', 'Deliver the antidote.',
    'Pacify the patient.', 'Apaiser la victime.', 'Retrouver la famille.',
    'Find the family.', 'Rescue the captive and activate the relay.'
  ]) {
    assert.equal(inferNonCombatTrial(makePolicy(objective)).type, 'rescue', objective);
  }
  assert.equal(inferNonCombatTrial(makePolicy('Escape/evidence, then cure the patient.')).type, 'escape-evidence');
  assert.equal(inferNonCombatTrial(makePolicy('Cure the patient.', { type: 'switches' })).type, 'switches');
  assert.equal(inferNonCombatTrial(makePolicy('Secure the transfer.', { type: 'rescue' })).type, 'rescue');
  const explicit = makeNonCombatPolicyFromThreat('Test', {
    nonCombat: true, trialType: 'rescue', objective: 'Secure the transfer.'
  });
  assert.equal(explicit.trialType, 'rescue');
});

test('Fourth Warhead Transfer resolves through the real threat adapter to switches, not a person to rescue', () => {
  const stage = getExpandedStages().find(candidate => candidate.id === 922560111);
  assert.ok(stage, 'Fourth Warhead Transfer stage');
  assert.equal(stage.finalePolicy.victoryCondition, 'warhead-secured');
  assert.equal(stage.finalePolicy.objective.en, 'Secure the fourth nuclear warhead and disarm its transfer system.');
  assert.equal(stage.finalePolicy.trialType, 'switches');
  assert.equal(stage.nonCombatTrial.type, 'switches');
  assert.ok(stage.nonCombatTrial.objects.length > 0);
  assert.equal(stage.nonCombatTrial.objects.every(object => object.kind === 'switch'), true);
  assert.equal(stage.nonCombatTrial.objects.some(object => object.kind === 'rescue-target'), false);
});

test('Carpathian Train keeps its evidence objective instead of a secure substring rescue', () => {
  const stage = getExpandedStages().find(candidate => candidate.id === 34381);
  assert.ok(stage, 'Carpathian Train stage');
  assert.match(stage.finalePolicy.objective.en, /Expose Providence, secure the train route/);
  assert.equal(stage.nonCombatTrial.type, 'evidence');
  assert.equal(stage.nonCombatTrial.objects.at(-1).kind, 'submission');
  assert.equal(stage.nonCombatTrial.objects.some(object => object.kind === 'rescue-target'), false);
});

test('Renato Manchas remains a real cure rescue encounter after word-boundary matching', () => {
  const stage = getExpandedStages().find(candidate => candidate.id === 987724964);
  assert.ok(stage, 'Renato Manchas stage');
  assert.equal(stage.finalePolicy.victoryCondition, 'cure');
  assert.equal(stage.finalePolicy.objective.en, 'Cure Manchas with a Night Howler antidote dart.');
  assert.equal(stage.finalePolicy.trialType, 'rescue');
  assert.equal(stage.nonCombatTrial.type, 'rescue');
  assert.equal(stage.nonCombatTrial.objects.filter(object => object.kind === 'rescue-target').length, 1);
});

test('all historical finale policies resolve to interactive objects without combat stats', () => {
  assert.equal(Object.keys(LORE_WORLD_BOSS_POLICIES).length, 55);
  for (const [universe, policy] of Object.entries(LORE_WORLD_BOSS_POLICIES)) {
    const trial = inferNonCombatTrial(policy, { universe });
    assert.ok(trial, `${universe} policy must resolve`);
    assert.ok(trial.objects.length > 0, `${universe} trial objects`);
    for (const object of trial.objects) {
      assert.equal('hp' in object, false, `${universe}/${object.id} hp`);
      assert.equal('atk' in object, false, `${universe}/${object.id} atk`);
    }
  }
});

test('legacy performers and pursuit abstractions no longer appear in the enemy catalog', () => {
  for (const universe of ['Vocaloid', 'Slender Man', 'Digital Circus']) {
    assert.deepEqual(ENEMIES_DB[universe].monsters, [], `${universe} monsters`);
    assert.deepEqual(ENEMIES_DB[universe].bosses, [], `${universe} bosses`);
    assert.equal(ENEMIES_DB[universe].worldBoss, null, `${universe} world boss`);
    assert.ok(ENEMIES_DB[universe].finalePolicy, `${universe} finale policy`);
  }
  assert.equal(ENEMIES_DB['Le Cinquième Element'].worldBoss, null);
  assert.ok(ENEMIES_DB['Le Cinquième Element'].monsters.length > 0);
});

test('explicit composite evidence extraction and custom neutral objects stay deterministic', () => {
  const trial = inferNonCombatTrial(makePolicy('Recover proof and escape.', {
    type: 'escape/evidence',
    id: 'proof-run',
    targetCount: 4,
    timeLimitFrames: 300
  }));

  assert.equal(trial.id, 'proof-run');
  assert.equal(trial.type, 'escape-evidence');
  assert.equal(trial.timeLimitFrames, 300);
  assert.equal(trial.objects.filter(object => object.kind === 'evidence').length, 3);
  assert.equal(trial.objects.at(-1).kind, 'extraction');
  assert.equal('hp' in trial.objects[0], false);
  assert.equal('atk' in trial.objects[0], false);
  assert.equal(Object.isFrozen(trial), true);
});

test('threat adapter copies objective identity but strips combat statistics', () => {
  const policy = makeNonCombatPolicyFromThreat('Zootopia', {
    id: 'bellwether',
    name: 'Mayor Dawn Bellwether',
    hp: 9999,
    atk: 999,
    nonCombat: true,
    entityType: 'investigation-world-boss',
    victoryCondition: 'expose-confession-and-arrest',
    objective: 'Record the confession and deliver the evidence.',
    visualAnchor: 'Recorder and evidence board'
  });

  assert.equal(policy.nonCombat, true);
  assert.equal(policy.trialType, 'evidence');
  assert.equal(policy.legacyWorldBossId, 'bellwether');
  assert.equal(policy.nonCombatTrial.type, 'evidence');
  assert.equal(policy.objective.en, 'Record the confession and deliver the evidence.');
  assert.notEqual(policy.objective.fr, policy.objective.en);
  assert.equal('hp' in policy, false);
  assert.equal('atk' in policy, false);
  assert.equal(makeNonCombatPolicyFromThreat('Combat', { name: 'Fighter', hp: 50, atk: 5 }), null);
});

test('threat adapter creates distinct actionable FR/EN objectives without recycling lore', () => {
  const legacy = makeNonCombatPolicyFromThreat('Legacy Rescue', {
    id: 'legacy-captive',
    name: 'Captive',
    nonCombat: true,
    entityType: 'rescue-trial',
    lore: {
      fr: 'Cette personne raconte une histoire ancienne.',
      en: 'This person tells an old story.'
    }
  });
  assert.equal(legacy.trialType, 'rescue');
  assert.notEqual(legacy.objective.fr, legacy.objective.en);
  assert.notEqual(legacy.objective.fr, legacy.threat?.lore?.fr);
  assert.notEqual(legacy.objective.fr, 'Cette personne raconte une histoire ancienne.');
  assert.notEqual(legacy.objective.en, 'This person tells an old story.');

  const english = makeNonCombatPolicyFromThreat('Investigation', {
    id: 'english-proof',
    nonCombat: true,
    entityType: 'investigation-trial',
    objective: 'Collect the evidence and expose the conspiracy.'
  });
  assert.equal(english.trialType, 'evidence');
  assert.equal(english.objective.en, 'Collect the evidence and expose the conspiracy.');
  assert.notEqual(english.objective.fr, english.objective.en);
});

test('break-object engine is interactive, has no opponents, and reports integrity victory', () => {
  const completions = [];
  const engine = new EngineNonCombatTrial(
    640,
    360,
    [hero('one'), hero('two')],
    makePolicy('Casser la voiture.', {
      type: 'break-object',
      integrity: 3,
      timeLimitFrames: 120
    }),
    { add() {} },
    () => {},
    (result, summary) => completions.push([result, summary]),
    { universe: 'Street Trial' }
  );

  assert.deepEqual(engine.enemies, []);
  assert.equal(engine.getActiveOpponent(), null);
  assert.equal(engine.triggerCombatEvent(), false);
  assert.equal(engine.setActiveHero('two'), true);
  const active = engine.getActiveHero();
  const object = engine.objects[0];
  active.x = object.x - 20;
  active.facing = 1;

  assert.equal(engine.triggerMeleeAction('player', 'AttackLight'), true);
  assert.equal(object.integrity, 2);
  assert.equal(engine.beginChargedMeleeAttack(), true);
  for (let index = 0; index < 25; index++) engine.update({});
  assert.equal(engine.releaseChargedMeleeAttack(), true);

  assert.equal(engine.gameOver, true);
  assert.equal(completions.length, 1);
  assert.equal(completions[0][0], 'victory');
  assert.equal(completions[0][1].mode, 'Trial');
  assert.equal(completions[0][1].objects[0].integrity, 0);
  assert.equal('hp' in completions[0][1].objects[0], false);
  assert.equal('atk' in completions[0][1].objects[0], false);
});

test('hit-targets accepts ranged abilities while collect and ordered escape use contact', () => {
  const targetEngine = new EngineNonCombatTrial(
    640,
    360,
    [hero('shooter')],
    makePolicy('Toucher les cibles.', { type: 'hit-targets', targetCount: 2 }),
    null,
    null,
    null,
    { universe: 'Targets' }
  );
  const shooter = targetEngine.getActiveHero();
  shooter.x = 20;
  shooter.facing = 1;
  assert.equal(targetEngine.triggerAbility(shooter, 'secondary'), true);
  assert.equal(targetEngine.objects.filter(object => object.completed).length, 1);

  const escapeCompletions = [];
  const escapeEngine = new EngineNonCombatTrial(
    640,
    360,
    [hero('runner')],
    makePolicy('Atteindre la sortie.', { type: 'escape', targetCount: 3 }),
    null,
    null,
    (result, summary) => escapeCompletions.push([result, summary]),
    { universe: 'Escape' }
  );
  const runner = escapeEngine.getActiveHero();
  for (const checkpoint of escapeEngine.objects) {
    runner.x = checkpoint.x;
    runner.y = checkpoint.y;
    escapeEngine.update({});
  }
  assert.equal(escapeCompletions[0][0], 'victory');
  assert.equal(escapeCompletions[0][1].progressPct, 100);
});

test('abilities cannot activate or destroy neutral objectives from arbitrary distance', () => {
  const engine = new EngineNonCombatTrial(
    640,
    360,
    [hero('remote')],
    makePolicy('Casser la voiture.', {
      type: 'break-object',
      integrity: 6,
      mistakeLimit: 10
    }),
    null,
    null,
    null,
    { universe: 'Distance' }
  );
  const active = engine.getActiveHero();
  const object = engine.objects[0];
  active.x = 24;
  active.facing = 1;

  assert.equal(engine.triggerAbility(active, 'special'), false);
  assert.equal(object.integrity, 6);
  active.x = object.x - 45;
  assert.equal(engine.triggerAbility(active, 'special'), true);
  assert.equal(object.integrity, 3);
});

test('survive uses safety progress instead of damage and can end in victory or defeat', () => {
  const victory = [];
  const survivor = new EngineNonCombatTrial(
    640,
    360,
    [hero('survivor')],
    makePolicy('Survivre.', { type: 'survive', durationFrames: 3, timeLimitFrames: 5 }),
    null,
    null,
    (result, summary) => victory.push([result, summary]),
    { universe: 'Survival' }
  );
  survivor.getActiveHero().x = survivor.objects[0].x;
  survivor.update({});
  survivor.update({});
  survivor.update({});
  assert.equal(victory[0][0], 'victory');
  assert.equal(victory[0][1].progressPct, 100);
  assert.equal('damageTaken' in victory[0][1], false);
  assert.ok(victory[0][1].objects.every(object => object.completed), 'victory summary must not show safe zones as incomplete');

  const defeat = [];
  const unsafe = new EngineNonCombatTrial(
    640,
    360,
    [hero('unsafe')],
    makePolicy('Survivre.', { type: 'survive', durationFrames: 1000, timeLimitFrames: 1001 }),
    null,
    null,
    (result, summary) => defeat.push([result, summary]),
    { universe: 'Unsafe' }
  );
  unsafe.safetyProgress = 0.05;
  unsafe.getActiveHero().x = unsafe.width / 2;
  unsafe.update({});
  assert.equal(defeat[0][0], 'defeat');
  assert.equal(defeat[0][1].safetyProgress, 0);
});

test('trial HUD guidance exposes range, order, mistakes, and gated objectives', () => {
  const engine = new EngineNonCombatTrial(
    640,
    360,
    [hero('investigator')],
    makePolicy('Rassembler les preuves puis rejoindre la sortie.', {
      type: 'escape-evidence',
      targetCount: 3
    }),
    null,
    null,
    null,
    { universe: 'Guidance' }
  );
  const active = engine.getActiveHero();
  const extraction = engine.objects.find(object => object.kind === 'extraction');
  assert.equal(engine.trial.mistakeLimit, 8);
  assert.equal(engine.isObjectLocked(extraction), true);
  active.x = extraction.x;
  active.y = extraction.y;
  engine.update({});
  assert.equal(extraction.completed, false, 'locked extraction cannot auto-complete');

  active.x = 24;
  active.facing = -1;
  assert.equal(engine.triggerAbility(active, 'secondary'), false);
  assert.match(engine.getObjectiveText('fr'), /erreurs 1\/8/i);
  assert.match(engine.feedback.fr, /Hors portée|mauvais ordre/);
  assert.match(engine.getInteractionHint('fr'), /REJOINS|APPROCHE-TOI/);
});

test('Extinction Zone contracts keep real objectives, bounded resources, aiming, and undistorted mobile canvas', () => {
  [
    'EXTINCTION_BEACON_TARGET = 3',
    "type: 'beacon'",
    'beaconsStabilized',
    'reserveAmmo',
    'skillCooldown',
    'EXTINCTION_INFESTATION_TARGET_FRAMES',
    'beginCanvasAim',
    'moveCanvasAim',
    'getRunObjectiveText',
    'fpsBackdropRef'
  ].forEach(marker => assert.ok(hubSource.includes(marker), `Extinction runtime missing ${marker}`));
  assert.match(hubSource, /effect: 'heal'/);
  assert.match(hubSource, /effect: 'ammo'/);
  assert.match(hubSource, /state\.hp\s*\/\s*Math\.max\(1, state\.maxHp/);
  assert.match(indexCssSource, /\.extinction-panel-active \.fps-royale-canvas[\s\S]*?aspect-ratio: 84 \/ 43/);
  assert.doesNotMatch(indexCssSource, /\.extinction-panel-active \.fps-royale-canvas\s*\{[^}]*min-height:\s*52dvh/);
});

test('survive fails without active-zone participation even while guarding', () => {
  const completions = [];
  const engine = new EngineNonCombatTrial(
    640,
    360,
    [hero('inactive')],
    makePolicy('Survivre.', {
      type: 'survive',
      durationFrames: 6,
      timeLimitFrames: 8
    }),
    null,
    null,
    (result, summary) => completions.push([result, summary]),
    { universe: 'Inactive Survival' }
  );
  const active = engine.getActiveHero();
  active.x = engine.width / 2;
  engine.setMeleeShield('player', true);
  for (let frame = 0; frame < 6; frame++) engine.update({ guard: true });

  assert.equal(completions[0][0], 'defeat');
  assert.equal(completions[0][1].participationFrames, 0);
  assert.ok(completions[0][1].requiredParticipationFrames > 0);
});

test('pause and dispose halt simulation', () => {
  const engine = new EngineNonCombatTrial(
    640,
    360,
    [hero('paused')],
    makePolicy('Toucher les cibles.', { type: 'hit-targets' }),
    null,
    null,
    null,
    { universe: 'Pause' }
  );
  engine.setPaused(true);
  engine.update({ right: true });
  assert.equal(engine.elapsedFrames, 0);
  engine.setPaused(false);
  engine.update({ right: true });
  assert.equal(engine.elapsedFrames, 1);
  engine.dispose();
  engine.update({ right: true });
  assert.equal(engine.elapsedFrames, 1);
});

test('canvas renderer works with the minimal neutral drawing surface', () => {
  const engine = new EngineNonCombatTrial(
    320,
    200,
    [hero('drawn')],
    makePolicy('Activer le relais.', { type: 'switches', targetCount: 1 }),
    null,
    null,
    null,
    { universe: 'Canvas' }
  );
  const methods = ['save', 'restore', 'translate', 'scale', 'rotate', 'fillRect', 'strokeRect', 'beginPath', 'arc', 'stroke', 'moveTo', 'lineTo', 'fillText'];
  const ctx = Object.fromEntries(methods.map(method => [method, () => {}]));
  assert.doesNotThrow(() => engine.draw(ctx, 12, 'fr'));
});
