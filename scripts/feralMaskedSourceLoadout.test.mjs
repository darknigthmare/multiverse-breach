import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { FERAL_MASKED_SOURCE_LOADOUT_KEY, resolveMaskedFeralSourceLoadout } from '../src/game/combat/sourceLoadoutFeralMasked20261113.js';

let vite, heroes, enemies, identity, rpg, EngineRpg, EngineTactics, EngineSmash, EngineFighter, sourceScenes;
const engines = [];
const clone = value => structuredClone(value);
const hero = () => heroes.find(actor => actor.id === 'feral_predator' && actor.universe === 'Prey');
const targets = Array.from({ length: 3 }, (_, index) => ({
  id: `feral-loadout-target-${index}`, name: `Target ${index}`, hp: 10000, atk: 1, def: 0, spd: 1,
  weapon: 'melee', color: '#808080'
}));
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  identity = await vite.ssrLoadModule('/src/game/combatIdentity.js');
  rpg = await vite.ssrLoadModule('/src/game/rpgTargeting.js');
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  sourceScenes = await vite.ssrLoadModule('/src/game/sourceSceneStages.js');
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose?.()));
after(async () => { await vite?.close(); });

const provenance = profile => {
  assert.equal(profile.provenance.kind, 'explicit-source-loadout-adaptation');
  assert.equal(profile.provenance.sourceLoadoutKey, FERAL_MASKED_SOURCE_LOADOUT_KEY);
  assert.equal(profile.provenance.identityAuthored, true);
  assert.equal(profile.provenance.canonicalVerified, false);
  assert.equal(profile.provenance.source1to1Verified, false);
  assert.equal(profile.provenance.networkVerified, false);
  assert.equal(profile.provenance.genericCatalogIdentity, false);
  assert.equal(profile.provenance.gameplayAdaptation, true);
};

test('the current raw Feral source and archived source dispatch remain unchanged', () => {
  const pinned = {
    'DLC/Prey/data/expandedUniverses.js': '55fb2809dc97f908c141cb2b0ac05955a1ed89c43f5990489db04f3c612d26cc',
    'src/game/combat/sourceKitPriority.js': 'af6f0143d5325b2287de5e86a4345508c1b54a02494d94afb4b67b55e82ac738',
    'src/game/combat/abilities/abilitiesLot3.js': '1495d3e2f9a4511acf7ee64084e6a645b8d06d49f8e583f6b6cd6eaeb10968cf',
    'src/game/combat/completion/capabilitiesLot3.js': '356e872bd2e646eab15d2e761c11f98b7f5c9a3fd0f01a7c85395f23a5efdd06'
  };
  for (const [path, sha] of Object.entries(pinned)) {
    assert.equal(createHash('sha256').update(readFileSync(new URL(`../${path}`, import.meta.url))).digest('hex'), sha, path);
  }
  assert.equal(hero().special.name, 'Feral Predator Origin Burst');
  assert.equal(hero().special.type, 'origin_aoe');
});

test('all four effective actions use the selected physical loadout with independent game timings', () => {
  const source = hero(), before = JSON.stringify(source);
  const loadout = resolveMaskedFeralSourceLoadout(source);
  assert.ok(loadout);
  for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    const profile = identity.resolveCombatAbility(source, slot);
    provenance(profile);
    assert.equal(profile.name, loadout[slot].name);
    assert.equal(profile.sourceAbility.type, slot === 'defense' ? 'shield' : 'melee');
    assert.equal(profile.effect, slot === 'defense' ? 'guard' : 'damage');
    assert.equal(profile.delivery, slot === 'defense' ? 'support' : 'melee');
    assert.equal(profile.targetSide, slot === 'defense' ? 'self' : 'enemy');
    assert.equal(profile.multiplier, slot === 'defense' ? 0 : source[slot].dmg);
    assert.equal(profile.shape, 'single'); assert.equal(profile.maxTargets, 1);
    assert.ok(profile.hitAt > 0 && profile.hitAt < profile.duration);
    assert.equal(rpg.getRpgCombatantAbility(source, slot).name, profile.name);
    assert.ok(!/combistick|spear|plasma|projectile|heal/i.test(profile.name));
  }
  const shield = identity.resolveCombatAbility(source, 'defense');
  assert.equal(shield.guardReduce, 0.75); assert.equal(shield.effectDuration, 2);
  assert.equal(JSON.stringify(source), before);
});

test('different actors, incarnations, equipment, custom actions and prepared signatures cannot enter this override', () => {
  const modifications = [
    source => { source.id = 'other-feral'; },
    source => { source.sourceHeroId = 'predator'; },
    source => { source.sourceId = 'city_hunter'; },
    source => { source.universe = 'Predator'; },
    source => { source.sourceUniverse = 'Predator'; },
    source => { source.incarnation = 'Prey (2022) - unmasked Feral Predator'; },
    source => { source.sourceIncarnation = 'Bear Blood Feral'; },
    source => { source.continuityScope = 'A different hunt'; },
    source => { source.weaponType = 'spear'; },
    source => { source.equipment.push('Combistick'); },
    source => { source.equipment.pop(); },
    source => { source.equipment[2] = source.equipment[1]; },
    source => { source.referenceUrl = 'https://avp.fandom.com/wiki/Feral_Predator'; },
    source => { source.canonStatus = 'unreviewed'; },
    source => { source.sourceSignatureKey = 'feral_predator'; }
  ];
  for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    modifications.push(source => { source[slot].name = 'Custom physical action'; });
    modifications.push(source => { source[slot].dmg = 99; });
    modifications.push(source => { source[slot].sourceSignatureKey = 'feral_predator'; });
    modifications.push(source => { source[slot].rpgProfile = { delivery: 'projectile' }; });
    modifications.push(source => { source[slot].tactics = { range: 7 }; });
    modifications.push(source => { source[slot].attackProfile = { effect: 'heal' }; });
  }
  for (const key of ['rpgAttacks', 'tacticsAttacks', 'smashAttacks', 'fighterAttacks']) {
    modifications.push(source => { source[key] = { simple: { range: 9 } }; });
  }
  for (const change of modifications) {
    const source = clone(hero()); change(source);
    const before = JSON.stringify(source);
    assert.equal(resolveMaskedFeralSourceLoadout(source), null, change.toString());
    assert.equal(JSON.stringify(source), before);
  }
  const custom = clone(hero()); custom.special = { name: 'Custom guard', type: 'shield', dmg: 0, targeting: { effect: 'guard', targetSide: 'self' } };
  assert.equal(identity.resolveMeleeSuper(custom).name, 'Custom guard');
  assert.equal(identity.resolveMeleeSuper(custom).effect, 'guard');
});

test('technical source projections keep the exact loadout, while a non-incarnated legacy caller retains Lot 3', () => {
  for (const sourceKey of ['sourceId', 'sourceHeroId']) {
    const source = { ...clone(hero()), id: 'p2:feral_predator:0', [sourceKey]: 'feral_predator', sourceUniverse: 'Prey' };
    provenance(identity.resolveMeleeSuper(source));
  }
  // Minimal legacy API caller, not a relabelled film-edition snapshot.
  const legacy = { id: 'feral_predator', universe: 'Prey',
    ...Object.fromEntries(['simple', 'secondary', 'defense', 'special'].map(slot => [slot, clone(hero()[slot])])) };
  assert.equal(resolveMaskedFeralSourceLoadout(legacy), null);
  assert.equal(identity.resolveCombatAbility(legacy, 'simple').name, 'Frappe de la combistick du Feral');
  assert.equal(identity.resolveCombatAbility(legacy, 'secondary').name, 'Estoc du chasseur Feral');
  assert.equal(identity.resolveCombatAbility(legacy, 'defense').name, 'Bouclier rétractable de l’avant-bras');
  assert.equal(identity.resolveMeleeSuper(legacy).name, 'Estoc de la combistick féroce');
  assert.equal(identity.resolveMeleeSuper(legacy).range, 220);
});

const makeEngine = (mode, vertical = false, sourceActor = hero()) => {
  const calls = [], sounds = [];
  const Engine = { RPG: EngineRpg, Tactics: EngineTactics, Melee: EngineSmash }[mode];
  const engine = new Engine(960, 600, [clone(sourceActor)], { monsters: clone(targets), bosses: [], customRoster: clone(targets) },
    { add: (...args) => calls.push(args) }, cue => sounds.push(cue), () => {}, {
      universe: 'Nexus de Convergence', disableHazards: true,
      ...(mode === 'Tactics' ? { tacticsBattlefieldId: vertical ? 'nexus_skybridge' : 'training_grid' } : {}),
      customBattle: { singleRoster: true, opponentControl: 'p2' }
    });
  engines.push(engine); engine.calls = calls; engine.sounds = sounds;
  const actor = engine.heroes[0];
  Object.assign(actor, { state: 'idle', stateTimer: 0, atb: 100, specialCharge: 100, cooldown: 0 });
  if (mode === 'RPG') engine.enemyGlobalRecovery = 99999;
  if (mode === 'Melee') {
    engine.syncPreMatchFromServer(3000);
    Object.assign(actor, { x: 100, y: 300, facing: 1 });
    engine.enemies.forEach((unit, index) => Object.assign(unit, { x: [140, 160, 450][index], y: 300, state: 'idle' }));
  }
  if (mode === 'Tactics') {
    Object.assign(engine, { obstacles: [], escortUnit: null, protectedArtifact: null, objective: 'rout',
      activeUnit: actor, activeUnitType: 'hero', actionPhase: 'action', selectedAction: null, selectedActionExplicit: false });
    if (vertical) {
      const place = (unit, id) => {
        const surface = engine.terrain.byId.get(id); assert.ok(surface, id);
        Object.assign(unit, { surfaceId: id, gridX: surface.x, gridY: surface.y, gridZ: surface.z });
      };
      place(actor, 'ground:4:3');
      ['ground:5:3', 'bridge:5:3', 'ground:7:3'].forEach((id, index) => place(engine.enemies[index], id));
      engine.syncActorsToCamera();
    } else {
      Object.assign(engine, { cols: 10, rows: 8, tiles: [] });
      Object.assign(actor, { gridX: 2, gridY: 2 });
      engine.enemies.forEach((unit, index) => Object.assign(unit, { gridX: [3, 5, 7][index], gridY: 2 }));
    }
  }
  calls.length = 0; sounds.length = 0;
  return engine;
};
const noForeignEffects = engine => {
  assert.ok(!engine.calls.some(call => ['laser_line', 'glitch', 'heal'].includes(call[7])));
  assert.ok(!engine.sounds.some(cue => ['shoot', 'laser', 'heal'].includes(cue)));
};

for (const slot of ['simple', 'secondary', 'special']) {
  test(`RPG ${slot}: selected wrist contact damages one identity without a projectile`, () => {
    const engine = makeEngine('RPG'), actor = engine.heroes[0], target = engine.enemies[2];
    const hp = engine.enemies.map(unit => unit.currentHp);
    assert.equal(rpg.getRpgActionProfile(actor, slot, 'player', { width: 960, height: 600 }).delivery, 'melee');
    assert.equal(engine.triggerAbility(actor, slot, [target.battleId]), true);
    for (let tick = 0; tick < 80; tick++) engine.update();
    engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 2));
    noForeignEffects(engine);
  });
  for (const vertical of [false, true]) test(`Tactics ${vertical ? 'vertical' : 'flat'} ${slot}: wrist contact is one cell and one victim`, () => {
    const engine = makeEngine('Tactics', vertical), actor = engine.heroes[0], target = engine.enemies[0];
    const hp = engine.enemies.map(unit => unit.currentHp), profile = engine.getAttackProfile(actor, slot);
    assert.equal(profile.delivery, 'melee'); assert.equal(profile.effect, 'damage');
    assert.equal(profile.range, 1); assert.equal(profile.maxTargets, 1);
    assert.equal(engine.selectAction(slot), true);
    const result = vertical ? engine.handleSurfaceClick(target.surfaceId) : engine.handleCellClick(target.gridX, target.gridY);
    assert.equal(result.handled, true);
    engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 0));
    noForeignEffects(engine);
  });
  test(`Melee ${slot}: authored physical contact does not damage the second nearby opponent`, () => {
    const engine = makeEngine('Melee'), actor = engine.heroes[0], hp = engine.enemies.map(unit => unit.currentHp);
    assert.equal(engine.triggerAbility(actor, slot), true);
    for (let tick = 0; tick < 120; tick++) engine.update();
    engine.enemies.forEach((unit, index) => assert.equal(unit.currentHp < hp[index], index === 0));
    noForeignEffects(engine);
  });
}

test('a separate vertical projectile kit keeps its original gun cue and ranged action', () => {
  const rifle = {
    id: 'qa-vertical-rifle', name: 'QA rifle', universe: 'QA', weaponType: 'rifle',
    stats: { hp: 500, atk: 12, def: 5, spd: 6 },
    simple: { name: 'Conventional shot', type: 'bullet', dmg: 1,
      tactics: { effect: 'damage', delivery: 'ranged', shape: 'single', range: 5, maxTargets: 1 } },
    secondary: { name: 'Conventional second shot', type: 'bullet', dmg: 1.5, cd: 3 },
    defense: { name: 'Ordinary guard', type: 'shield', reduce: 0.4, dur: 1 },
    special: { name: 'Conventional heavy shot', type: 'bullet', dmg: 2 }
  };
  const engine = makeEngine('Tactics', true, rifle), actor = engine.heroes[0], target = engine.enemies[0];
  const hp = target.currentHp;
  assert.equal(engine.getAttackProfile(actor, 'simple').delivery, 'ranged');
  assert.equal(engine.selectAction('simple'), true);
  assert.equal(engine.handleSurfaceClick(target.surfaceId).handled, true);
  assert.ok(target.currentHp < hp);
  assert.ok(engine.sounds.includes('shoot'));
});

for (const mode of ['RPG', 'Tactics']) for (const vertical of mode === 'Tactics' ? [false, true] : [false]) {
  test(`${mode}${mode === 'Tactics' ? vertical ? ' vertical' : ' flat' : ''}: the left shield guards self with zero outgoing damage or healing`, () => {
    const engine = makeEngine(mode, vertical), actor = engine.heroes[0], hp = engine.enemies.map(unit => unit.currentHp);
    const ownHp = actor.currentHp;
    if (mode === 'RPG') assert.equal(engine.triggerAbility(actor, 'defense', [actor.battleId]), true);
    else {
      const profile = engine.getAttackProfile(actor, 'defense');
      assert.equal(profile.effect, 'guard'); assert.equal(profile.targetSide, 'self'); assert.equal(profile.multiplier, 0);
      assert.equal(engine.getActionBaseDamage(actor, 'defense'), 0);
      assert.equal(engine.selectAction('defense'), true);
      assert.equal((vertical ? engine.handleSurfaceClick(actor.surfaceId) : engine.handleCellClick(actor.gridX, actor.gridY)).handled, true);
    }
    assert.equal(actor.currentHp, ownHp);
    assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
    noForeignEffects(engine);
  });
}

test('Melee left shield retains a bounded physical guard without outgoing damage or healing', async () => {
  const engine = makeEngine('Melee'), actor = engine.heroes[0];
  const ownHp = actor.currentHp, hp = engine.enemies.map(unit => unit.currentHp);
  assert.equal(engine.triggerAbility(actor, 'defense'), true);
  assert.equal(actor.currentHp, ownHp);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  assert.equal(engine.setMeleeShield('player', true), true);
  actor.perfectShieldWindow = 0;
  const { absorbMeleeGuardHit } = await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js');
  const guard = absorbMeleeGuardHit(actor, { damage: 20, guardDamage: 8 });
  assert.equal(guard.guarded, true); assert.equal(guard.perfect, false); assert.equal(guard.damageScale, 0.25);
  assert.deepEqual(engine.enemies.map(unit => unit.currentHp), hp);
  noForeignEffects(engine);
});

const ordinaryFighter = id => ({ id, name: id, universe: 'QA', stats: { hp: 1000, atk: 10, def: 0, spd: 5 } });
for (const side of ['player', 'cpu']) for (const type of ['light', 'heavy', 'special', 'super']) {
  test(`Fighter ${side}/${type}: the selected wrist kit remains physical against the active opponent only`, () => {
    const engine = new EngineFighter(960, 600,
      side === 'player' ? [clone(hero()), ordinaryFighter('p-reserve')] : [ordinaryFighter('p'), ordinaryFighter('p-reserve')],
      side === 'cpu' ? [clone(hero()), ordinaryFighter('c-reserve')] : [ordinaryFighter('c'), ordinaryFighter('c-reserve')],
      { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
    engines.push(engine); engine.countdown = 0;
    const actor = engine.getActive(side), victim = engine.getOpponent(side);
    Object.assign(actor, { x: 350, y: engine.groundY, meter: 100 });
    Object.assign(victim, { x: 410, y: engine.groundY, currentHp: 10000, maxHp: 10000 });
    const bench = engine.getTeam(victim.side).fighters[1], benchHp = bench.currentHp;
    assert.equal(engine.tryAction(side, type), true);
    assert.equal(actor.action.delivery, 'melee'); assert.equal(actor.action.effect, 'damage');
    for (let tick = 0; tick < 140; tick++) { engine.hitStop = 0; engine.updateActions(1 / 60); }
    assert.ok(victim.currentHp < 10000);
    assert.equal(bench.currentHp, benchHp); assert.equal(engine.projectiles.length, 0);
  });
}

test('Fighter held guard uses the left shield reduction without an offensive ability', () => {
  const engine = new EngineFighter(960, 600, [clone(hero())], [ordinaryFighter('opponent')], { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  engines.push(engine); engine.countdown = 0;
  const actor = engine.getActive('player'), opponent = engine.getActive('cpu'), hp = opponent.currentHp;
  assert.equal(engine.updateGuarding('player', true, true), true);
  assert.equal(actor.guardReduction, 0.75); assert.equal(opponent.currentHp, hp);
  assert.equal(identity.resolveCombatAbility(actor, 'defense').multiplier, 0);
});

test('Naru’s actual initiative slot uses the portrait only for the scene actor, centered inside its 28×24 badge', async () => {
  const sceneApi = await vite.ssrLoadModule('/src/game/sourceSceneEncounter.js');
  const stage = sourceScenes.SOURCE_SCENE_STAGES.find(value => value.id === 50106);
  const naru = heroes.find(actor => actor.id === 'naru_prey' && actor.universe === 'Prey');
  const scene = sceneApi.createSourceSceneEncounter(stage, [naru], enemies.Prey);
  const previous = globalThis.Image, made = [], draws = [];
  globalThis.Image = class { complete = false; naturalWidth = 0; naturalHeight = 0; constructor() { made.push(this); } };
  const ctx = new Proxy({ drawImage(...args) { draws.push(args); } }, {
    get: (object, key) => key in object ? object[key] : () => {}, set: (object, key, value) => { object[key] = value; return true; }
  });
  try {
    const draw = entry => EngineTactics.prototype.drawTimelineBust.call({ sourceScene: scene }, ctx, entry, 10, 20, 28, 24);
    const entry = { unit: scene.actor, type: 'hero' };
    draw(entry);
    const portrait = made.find(image => image.src === '/sprites/source-scenes/prey-2022/naru-portrait-20261113.png');
    assert.ok(portrait); assert.ok(!draws.some(args => args[0] === portrait), 'loading portrait retains the old bust fallback');
    portrait.naturalWidth = 256; portrait.naturalHeight = 256; portrait.onload();
    draw(entry);
    const portraitDraw = draws.find(args => args[0] === portrait);
    assert.deepEqual(portraitDraw.slice(1), [12, 20, 24, 24]);
    const count = draws.filter(args => args[0] === portrait).length;
    draw({ unit: { ...scene.actor }, type: 'hero' }); draw({ unit: scene.actor, type: 'enemy' });
    assert.equal(draws.filter(args => args[0] === portrait).length, count, 'same-name clones and enemy slots cannot borrow the portrait');
  } finally {
    if (previous === undefined) delete globalThis.Image; else globalThis.Image = previous;
  }
});
