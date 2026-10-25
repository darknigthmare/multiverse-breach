import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';

const root = new URL('../../', import.meta.url), dir = new URL('./', import.meta.url);
const prefix = 'docs/combat-fidelity-wave13-2026-10-24/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const preliminary = !process.argv.includes('--after-production-freeze');
const startedAt = new Date().toISOString();
const registry = json('src/game/combat/summonAnimationsWave13.generated.json');
const frozenHistorical = json(prefix + 'rpg-historical-assets-before.json');
const cases = [
  { caller: 'hicks', partner: 'ripley', id: 'alien-ripley-wave13', role: 'gun', effect: 'damage' },
  { caller: 'ripley', partner: 'hicks', id: 'alien-hicks-wave13', role: 'gun', effect: 'damage' },
  { caller: 'chell', partner: 'atlas', id: 'portal-atlas-wave13', role: 'support', effect: 'buff' },
  { caller: 'death_dw', partner: 'vimes_dw', id: 'discworld-vimes-wave13', role: 'melee', effect: 'damage', contactDistance: 48 },
  { caller: 'ocelot_mgs', partner: 'meryl_mgs', id: 'metalgear-meryl-wave13', role: 'gun', effect: 'damage' },
  { caller: 'tess_tlou', partner: 'joel_tlou', id: 'lastofus-joel-wave13', role: 'gun', effect: 'damage' }
];
const sourcePaths = ['src/game/engineRpg.js', 'src/game/combatIdentity.js', 'src/game/combat/summonAnimationCatalog.js',
  'src/game/combat/summonAnimationState.js', 'src/game/combat/summonChoreography.js',
  'src/game/combat/rosterSummonChoreographyWave13.js', 'src/game/combat/rosterReinforcementsWave13.js',
  'src/game/combat/combatSourceDefinitionsWave13.js', 'src/game/combat/abilities/abilitiesWave13Definitions.js', 'src/game/combat/abilities/catalog.js',
  'src/game/combat/abilities/abilitiesWave13.js', 'src/game/heroes.js', 'src/game/combat/entityAssets.js',
  'src/game/combat/summonAnimationsWave13.generated.json', 'scripts/buildSummonAnimationsWave13.mjs',
  ...registry.entries.map(asset => 'public' + asset.sheet)];
const sourceHashesBefore = Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))]));
const rows = [], engines = [];
let vite, EngineRpg, HEROES_DB, resolveUniverseSummon, resolveAsset, getAssets, getFrame, getChoreography, projectOrigin, projectPrevious;
const noop = () => {};
const originalImage = globalThis.Image;
const hp = units => units.map(unit => unit.currentHp);
const costs = actor => ({ atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed });
const tick = (engine, count) => { for (let n = 0; n < count; n++) engine.update(); };
const hero = id => { const value = HEROES_DB.find(hero => hero.id === id); assert.ok(value, id); return value; };
const dummy = id => ({ id, name: id, universe: 'W13 adversarial fixture', weaponType: 'melee', primaryColor: '#abcdee',
  stats: { hp: 100000, atk: 10, def: 10, spd: 1 }, simple: { name: 'Fixture strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Fixture throw', type: 'bullet', dmg: 1 }, defense: { name: 'Fixture cover', type: 'shield', reduce: 0.4, dur: 1 },
  special: { name: 'Fixture special', type: 'melee', dmg: 1 } });
const make = (item, side) => {
  const own = [hero(item.caller), dummy('companion')], opposition = [dummy('first'), dummy('second'), dummy('third')];
  const players = side === 'player' ? own : opposition, opponents = side === 'enemy' ? own : opposition;
  const engine = new EngineRpg(1040, 520, players, { monsters: opponents, bosses: [], customRoster: opponents },
    { add: noop }, noop, noop, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false; engine.enemyGlobalRecovery = 0; engines.push(engine);
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.currentHp = unit.maxHp = 100000;
    unit.atb = 100; unit.specialCharge = 100; unit.state = 'idle'; unit.statusEffects = { infected: 0, glitched: 0, radiated: 0 }; });
  return { engine, side, actor: (side === 'player' ? engine.heroes : engine.enemies)[0],
    allies: side === 'player' ? engine.heroes : engine.enemies, targets: side === 'player' ? engine.enemies : engine.heroes };
};
const start = context => { assert.equal(context.engine.summon(context.actor, context.side), true);
  assert.equal(context.engine.confirmTargeting(), true); return context.engine.activeSummon; };
const recorder = () => {
  const calls = [], stack = []; let props = { globalAlpha: 0.8, lineWidth: 3, fillStyle: '#987654' }; const original = { ...props };
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key in props) return props[key];
      if (key === 'save') return () => { stack.push({ ...props }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); props = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { args.filter(value => typeof value === 'number').forEach(value => assert.ok(Number.isFinite(value))); calls.push([key, ...args]); };
    }, set(_, key, value) { props[key] = value; return true; }
  });
  return { ctx, calls, balanced: () => { assert.equal(stack.length, 0); assert.deepEqual(props, original); } };
};

before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, watch: null } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ resolveSummonAnimationAsset: resolveAsset, getSummonAnimationAssets: getAssets, getSummonAnimationFrame: getFrame } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js'));
  ({ getSummonChoreographyState: getChoreography } = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js'));
  ({ projectNativeSummonEffectOriginWave13: projectOrigin } = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave13.js'));
  ({ projectNativeSummonEffectOriginWave12: projectPrevious } = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave12.js'));
  assert.equal(registry.entries.length, 6);
  // Exact later cohort exclusion preserves the W13 total of43 historical assets.
  const wave14AssetIds = new Set(['lotr-aragorn-wave14','lotr-legolas-wave14','darksouls-solaire-wave14','halo-noble-six-wave14','masseffect-mordin-wave14','tombraider-lara-wave14']);
  assert.equal(getAssets().filter(asset => !wave14AssetIds.has(asset.id)).length, 43);
  assert.equal(frozenHistorical.registries.length, 104); assert.equal(frozenHistorical.png.length, 556);
  for (const record of [...frozenHistorical.registries, ...frozenHistorical.png]) {
    const path = record.path || 'public' + record.sheet;
    assert.equal(sha(read(path)), record.sha256, path);
  }
  for (const path of frozenHistorical.registries.filter(record => /summonAnimationsWave/.test(record.path)).map(record => record.path)) {
    for (const original of json(path).entries) assert.deepEqual(getAssets().find(asset => asset.key === original.key), original, original.key);
  }
  for (const asset of registry.entries) {
    assert.equal(sha(read('public' + asset.sheet)), asset.sha256);
    assert.equal(sha(read(asset.sourceImage)), asset.sourceImageSha256);
    assert.equal(asset.visualValidation.distinctCells, 16);
    const { data, info } = await sharp(read('public' + asset.sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual([info.width, info.height, info.channels], [2048, 1024, 4]);
    if (asset.nativeRole !== 'gun') { assert.equal(asset.effectAnchors, null); continue; }
    for (const [phase, anchors] of Object.entries(asset.effectAnchors)) for (const [col, anchor] of anchors.entries()) {
      if (!anchor) continue;
      const row = ['arrival', 'preparation', 'attack', 'recovery'].indexOf(phase);
      assert.ok(data[((row * 256 + anchor.y) * 2048 + col * 512 + anchor.x) * 4 + 3] > 24);
      assert.equal(anchor.visuallyReviewed, true);
    }
  }
  // SSR draw recording is separate from the real Chromium pixel proof.
  globalThis.Image = class { complete = true; naturalWidth = 2048; naturalHeight = 1024;
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); } get src() { return this._src; } };
});
after(async () => {
  for (const engine of engines) engine.dispose(); await vite?.close(); globalThis.Image = originalImage;
  const sourceHashesAfter = Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))]));
  const stable = JSON.stringify(sourceHashesBefore) === JSON.stringify(sourceHashesAfter);
  if (!preliminary) assert.equal(stable, true);
  const report = { date: '2026-10-24', startedAt, finishedAt: new Date().toISOString(), preliminary, finalProductionFreezeClaimed: !preliminary,
    validator: prefix + 'summon-runtime-validation.mjs', validatorSha256: sha(read(prefix + 'summon-runtime-validation.mjs')),
    passed: rows.length === 12 && rows.every(row => row.passed), actualSsrEngineFlows: rows.length,
    historicalPngPreserved: 556, historicalRegistriesPreserved: 104, sourceHashesBefore, sourceHashesAfter,
    productionInputsStableDuringRun: stable, offensiveFlows: rows.filter(row => row.effect === 'damage').length,
    supportFlows: rows.filter(row => row.effect !== 'damage').length, buffFlows: rows.filter(row => row.effect === 'buff').length, guardFlows: rows.filter(row => row.effect === 'guard').length, shieldCases: rows.filter(row => row.shieldRejected).length,
    deadTargetCases: rows.filter(row => row.deadTargetRejected).length, removedTargetCases: rows.filter(row => row.removedTargetRejected).length,
    callerAbortCases: rows.filter(row => row.deadCallerAborted && row.removedCallerAborted).length * 2,
    rows, source1to1Verified: false };
  if (process.env.W13_RPG_WRITE_REPORT !== '0') fs.writeFileSync(new URL(preliminary ? 'summon-runtime-preliminary-result.json' : 'summon-runtime-result.json', dir), JSON.stringify(report, null, 2) + '\n');
});

for (const item of cases) for (const side of ['player', 'enemy']) test(`${side}: ${item.id}, real targets/cost/contact and native origin`, () => {
  const context = make(item, side), { engine, actor, allies, targets } = context;
  const descriptor = resolveUniverseSummon(hero(item.caller)), asset = resolveAsset(descriptor);
  assert.equal(asset?.id, item.id); assert.equal(descriptor.performer.id, item.partner);
  assert.equal(descriptor.sourceHeroId, item.partner); assert.equal(descriptor.action.sourceHeroId, item.partner);
  assert.equal(descriptor.universe, hero(item.caller).universe); assert.equal(descriptor.performer.universe, descriptor.universe);
  assert.equal(descriptor.kind, 'reinforcement'); assert.equal(descriptor.performerRole, 'reinforcement');
  assert.equal(resolveAsset({ ...descriptor, universe: 'Wrong world' }), null);
  assert.equal(resolveAsset({ ...descriptor, sourceHeroId: item.caller }), null);
  assert.equal(resolveAsset({ ...descriptor, action: { ...descriptor.action, name: 'Wrong action' } }), null);
  assert.equal(resolveAsset({ ...descriptor, performer: { ...descriptor.performer, universe: 'Wrong world' } }), null);
  assert.equal(resolveAsset({ ...descriptor, performerRole: 'caller' }), null);
  const acceptedClone = { ...descriptor, performer: { ...descriptor.performer, id: 'enemy_' + item.partner, sourceHeroId: item.partner } };
  assert.equal(resolveAsset(acceptedClone)?.id, item.id);
  assert.equal(engine.summon(actor, side), true); assert.deepEqual(costs(actor), { atb: 100, charge: 100, used: false });
  assert.equal(engine.cancelTargeting(), true); assert.deepEqual(costs(actor), { atb: 100, charge: 100, used: false });
  if (item.effect !== 'damage') { allies[0].currentHp = 40000; allies[1].currentHp = 60000; }
  const beforeTargets = hp(targets), beforeAllies = hp(allies), scene = start(context);
  assert.equal(scene.profile.effect, item.effect);
  assert.deepEqual(costs(actor), { atb: 0, charge: 0, used: true });
  let impacts = 0; const apply = engine.applyRpgImpact.bind(engine);
  engine.applyRpgImpact = (...args) => { if (args[4] === 'summon') impacts++; return apply(...args); };
  tick(engine, scene.impactTick - 1); assert.equal(impacts, 0);
  assert.deepEqual(hp(targets), beforeTargets); assert.deepEqual(hp(allies), beforeAllies);
  const frozen = JSON.stringify({ actor, allies, targets, scene });
  engine.setPaused(true); tick(engine, 60); assert.equal(JSON.stringify({ actor, allies, targets, scene }), frozen);
  engine.setPaused(false); engine.update(); assert.equal(impacts, 1);
  const impactView = engine.getSummonSceneState();
  if (item.effect === 'damage') {
    assert.ok(targets.some((target, i) => target.currentHp < beforeTargets[i]));
    assert.ok(scene.visualContacts.length > 0);
    if (item.contactDistance) {
      assert.ok(Math.abs(Math.abs(impactView.choreography.performer.x - impactView.choreography.target.x) - item.contactDistance) < 1e-8);
      assert.ok(Math.abs(impactView.choreography.performer.y - impactView.choreography.target.y) < 1e-8);
    }
    const contacts = JSON.parse(JSON.stringify(scene.visualContacts));
    const visualTargets = JSON.parse(JSON.stringify(impactView.choreography.targets));
    for (const target of targets.filter(target => contacts.some(contact => contact.id === target.battleId))) {
      target.x += 333; target.y += 77; target.currentHp = 0; target.state = 'dead';
    }
    assert.deepEqual(scene.visualContacts, contacts);
    assert.deepEqual(engine.getSummonSceneState().choreography.targets, visualTargets);
  } else {
    assert.equal(scene.profile.multiplier, 0); assert.deepEqual(hp(targets), beforeTargets); assert.deepEqual(hp(allies), beforeAllies);
    assert.ok(allies.every(unit => unit.rpgBuffTicks > 0 && unit.rpgBuffMultiplier > 1));
    assert.ok(targets.every(unit => !unit.rpgBuffTicks)); assert.equal(asset.effectAnchors, null);
  }
  const snapshot = JSON.stringify({ actor, allies, targets, scene }), draw = recorder();
  for (let n = 0; n < 4; n++) engine.drawSummonScene(draw.ctx);
  draw.balanced(); assert.equal(JSON.stringify({ actor, allies, targets, scene }), snapshot);
  assert.ok(draw.calls.some(call => call[0] === 'drawImage' && call[1].src === asset.sheet));
  const indices = new Set(), anchorPhases = new Set();
  for (let t = 0; t < scene.durationTicks; t++) {
    const sampled = { ...scene, tick: t }, raw = getChoreography(sampled, engine), frame = getFrame(sampled, raw);
    indices.add(frame.index);
    const rawBytes = JSON.stringify(raw), adjusted = projectOrigin(raw, asset, frame), anchor = asset.effectAnchors?.[frame.phase]?.[frame.col];
    assert.equal(JSON.stringify(raw), rawBytes); assert.equal(adjusted.nativeMuzzleActive, !!anchor);
    if (!anchor) continue;
    anchorPhases.add(frame.phase + ':' + frame.col);
    const p = raw.performer, dx = (anchor.x - 256) / 256 * p.size * p.facing, dy = (anchor.y - 244) / 256 * p.size, a = p.rotation || 0;
    assert.ok(Math.abs(adjusted.origin.x - p.x - dx * Math.cos(a) + dy * Math.sin(a)) < 1e-8);
    assert.ok(Math.abs(adjusted.origin.y - p.y - dx * Math.sin(a) - dy * Math.cos(a)) < 1e-8);
  }
  assert.equal(indices.size, 16); assert.equal(anchorPhases.size, item.role === 'gun' ? 6 : 0);
  const previous = { performer: { x: 4, y: 7 }, origin: { x: 9, y: 11 }, visuals: [] };
  assert.deepEqual(projectOrigin(previous, { id: 'old-entry' }, { phase: 'attack', col: 2 }), projectPrevious(previous, { id: 'old-entry' }, { phase: 'attack', col: 2 }));
  tick(engine, scene.durationTicks - scene.tick); assert.equal(impacts, 1); assert.equal(engine.activeSummon, null);
  actor.atb = actor.specialCharge = 100; actor.state = 'idle'; assert.equal(engine.summon(actor, side), false);
  const result = { caller: item.caller, partner: item.partner, side, assetId: item.id, effect: item.effect, passed: true,
    samplerCells: indices.size, muzzleFrames: anchorPhases.size, impacts, contactDistance: item.contactDistance || null };
  if (item.effect === 'damage') {
    for (const invalid of ['shield', 'dead', 'removed']) {
      const adverse = make(item, side), before = hp(adverse.targets), active = start(adverse);
      if (invalid === 'shield') adverse.targets.forEach(unit => { unit.battleItemShield = 100000; });
      else if (invalid === 'dead') active.targets.forEach(unit => { unit.currentHp = 0; unit.state = 'dead'; });
      else {
        if (side === 'player') adverse.engine.enemies = adverse.engine.enemies.filter(unit => !active.targets.includes(unit));
        else adverse.engine.heroes = adverse.engine.heroes.filter(unit => !active.targets.includes(unit));
      }
      const expectedHp = invalid === 'dead' ? hp(adverse.targets) : before;
      tick(adverse.engine, active.impactTick + 1);
      assert.deepEqual(hp(adverse.targets), expectedHp, invalid + ': invalid target was damaged or retargeted');
      assert.deepEqual(active.visualContacts, []);
      result[invalid === 'shield' ? 'shieldRejected' : invalid === 'dead' ? 'deadTargetRejected' : 'removedTargetRejected'] = true;
    }
  }
  for (const abort of ['dead', 'removed']) {
    const interrupted = make(item, side), before = hp(interrupted.targets), active = start(interrupted);
    if (abort === 'dead') { interrupted.actor.currentHp = 0; interrupted.actor.state = 'dead'; }
    else if (side === 'player') interrupted.engine.heroes = interrupted.engine.heroes.filter(unit => unit !== interrupted.actor);
    else interrupted.engine.enemies = interrupted.engine.enemies.filter(unit => unit !== interrupted.actor);
    tick(interrupted.engine, active.durationTicks + 1);
    assert.equal(interrupted.engine.activeSummon, null); assert.equal(interrupted.actor.actionPending, false);
    assert.deepEqual(hp(interrupted.targets), before); assert.equal(interrupted.actor.summonUsed, true);
    result[abort === 'dead' ? 'deadCallerAborted' : 'removedCallerAborted'] = true;
  }
  rows.push(result);
});
