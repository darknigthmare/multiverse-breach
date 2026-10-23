import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const registry = json('src/game/combat/summonAnimationsWave11.generated.json');
const baseline = json('docs/combat-fidelity-wave11-2026-10-23/baseline.json');
const historicalAssets = json('docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json').summonAssets;
const cases = [
  { id: 'buffy-spike', version: /Buffy saison7/, caller: 'buffy_summers', partner: 'spike_buffy', key: 'Buffy the Vampire Slayer::Spike::Enchaînement vampirique de Spike', kind: 'reinforcement', effect: 'damage' },
  { id: 'atlantis-ronon', version: /Stargate Atlantis saison3/, caller: 'sheppard_sga', partner: 'ronon_dex', key: 'Stargate Atlantis::Ronon Dex::Tir du pistolet satedan de Ronon', kind: 'reinforcement', effect: 'damage' },
  { id: 'sgu-greer', version: /Stargate Universe saison1/, caller: 'rush_sgu', partner: 'greer_sgu', key: 'Stargate Universe::Ronald Greer::Rafale de couverture de Greer', kind: 'reinforcement', effect: 'damage' },
  { id: 'borderlands-roland', version: /Borderlands \(2009/, caller: 'lilith_borderlands', partner: 'roland_bl', key: 'Borderlands::Roland::Rafale du fusil de Roland', kind: 'reinforcement', effect: 'damage' },
  { id: 'madmax-furiosa', version: /Fury Road \(2015/, caller: 'max', partner: 'furiosa', key: 'Mad Max::Furiosa::Tir de précision de Furiosa', kind: 'reinforcement', effect: 'damage' },
  { id: 'fifth-korben', version: /Cinquième Élément \(1997/, caller: 'leeloo', partner: 'korben', key: 'Le Cinquième Element::Korben Dallas::Rafale du pistolet de Korben', kind: 'reinforcement', effect: 'damage' },
  { id: 'kaamelott-lancelot', version: /Kaamelott LivreIII/, caller: 'arthur_kaamelott', partner: 'lancelot_kaamelott', key: 'Kaamelott::Lancelot::Passe d’armes de Lancelot', kind: 'reinforcement', effect: 'damage' }
];
const support = { caller: 'harry_potter', partner: 'hermione_granger', effect: 'guard' };
let vite, EngineRpg, HEROES_DB, resolveUniverseSummon, getAssets, resolveAsset, getFrame, projectOrigin, getHeroSpriteSheetSrc, resolveCharacterAnimationAsset, SUMMON_CHOREOGRAPHIES, getSummonChoreographyState, reinforcementBindings;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?summon-wave11'));
  ({ resolveCharacterAnimationAsset } = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
  ({ getHeroSpriteSheetSrc } = await vite.ssrLoadModule('/src/game/spriteAssets.js'));
  ({ HEROES_DB, } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ SUMMON_CHOREOGRAPHIES, getSummonChoreographyState } = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js'));
  ({ ROSTER_REINFORCEMENTS_WAVE11: reinforcementBindings } = await vite.ssrLoadModule('/src/game/combat/rosterReinforcementsWave11.js'));
  ({ projectNativeSummonEffectOriginWave11: projectOrigin } = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave11.js'));
  ({ getSummonAnimationAssets: getAssets, resolveSummonAnimationAsset: resolveAsset, getSummonAnimationFrame: getFrame } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });
const hero = id => { const found = HEROES_DB.find(h => h.id === id); assert.ok(found, id); return found; };
const dummy = id => ({ id, name: id, universe: 'Invocation Wave11 regression', weaponType: 'melee', primaryColor: '#abcedf', secondaryColor: '#bacade', stats: { hp: 100000, atk: 10, def: 10, spd: 1 }, simple: { name: 'Strike', type: 'melee', dmg: 1 }, secondary: { name: 'Shot', type: 'bullet', dmg: 1 }, defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'Finish', type: 'bullet', dmg: 1 } });
const make = (caller, side = 'player', companions = 0) => {
  const own = [hero(caller), ...Array.from({ length: companions }, (_, i) => dummy('ally-' + i))], others = ['first', 'second', 'third'].map(dummy);
  const players = side === 'player' ? own : others, enemies = side === 'enemy' ? own : others;
  const engine = new EngineRpg(1040, 520, players, { monsters: enemies, bosses: [], customRoster: enemies }, { add: noop }, noop, noop, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false; engine.enemyGlobalRecovery = 0; engines.push(engine);
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.currentHp = unit.maxHp = 100000; unit.atb = 100; unit.specialCharge = 100; unit.state = 'idle'; });
  return { engine, side, actor: (side === 'player' ? engine.heroes : engine.enemies)[0], targets: side === 'player' ? engine.enemies : engine.heroes, allies: side === 'player' ? engine.heroes : engine.enemies };
};
const costs = actor => ({ atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed });
const hp = targets => targets.map(target => target.currentHp);
const tick = (engine, count) => { for (let i = 0; i < count; i++) engine.update(); };
const start = context => {
  assert.equal(context.engine.summon(context.actor, context.side), true);
  assert.equal(context.engine.confirmTargeting(), true);
  return context.engine.activeSummon;
};
const readyImages = callback => {
  const original = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 2048; naturalHeight = 1024;
    set src(value) { this._src = value; this.currentSrc = value; this.onload?.(); }
    get src() { return this._src; }
  };
  try { return callback(); } finally { globalThis.Image = original; }
};
const recorder = () => {
  const calls = [], stack = []; let props = { globalAlpha: 0.8, lineWidth: 3, fillStyle: '#987654' }; const original = { ...props };
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key in props) return props[key];
      if (key === 'save') return () => { stack.push({ ...props }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length); props = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { args.filter(a => typeof a === 'number').forEach(n => assert.ok(Number.isFinite(n))); calls.push([key, ...args]); };
    },
    set(_, key, value) { props[key] = value; return true; }
  });
  return { ctx, calls, balanced: () => { assert.equal(stack.length, 0); assert.deepEqual(props, original); } };
};

test('seven native roster partners require exact performer/source identities, universe, action and reinforcement role', () => {
  assert.equal(registry.entries.length, 7);
  assert.deepEqual(registry.entries.map(entry => entry.id).sort(), cases.map(item => item.id).sort());
  assert.deepEqual(registry.entries.map(entry => entry.key).sort(), cases.map(item => item.key).sort());
  assert.equal(historicalAssets.length, 23);
  const known = new Set(historicalAssets.map(entry => entry.key));
  assert.equal(known.size, 23);
  assert.equal(getAssets().filter(entry => known.has(entry.key)).length, 23);
  for (const original of historicalAssets) assert.deepEqual(getAssets().find(entry => entry.key === original.key), original, original.key);
  assert.equal(resolveUniverseSummon(hero('cloud_ff7')).entityName, 'Ifrit');
  for (const item of cases) {
    const descriptor = resolveUniverseSummon(hero(item.caller)), asset = resolveAsset(descriptor);
    assert.equal(asset?.id, item.id); assert.match(asset.sourceWork, item.version);
    assert.equal(asset.bodySource, 'roster-performer'); assert.equal(asset.performerHeroId, item.partner);
    assert.equal(descriptor.performer.id, item.partner); assert.equal(descriptor.sourceHeroId, item.partner); assert.equal(descriptor.action.sourceHeroId, item.partner);
    assert.equal(descriptor.performerRole, 'reinforcement'); assert.equal(descriptor.entityRender?.asset, undefined);
    assert.equal(asset?.key, item.key); assert.equal(descriptor.kind, item.kind); assert.equal(asset.kind, item.kind);
    assert.equal(asset.canon1to1Verified, false); assert.equal(asset.visualValidation.canon1to1Verified, false);
    for (const changed of [
      { ...descriptor, universe: 'Wrong universe' }, { ...descriptor, entityName: 'Wrong entity' },
      { ...descriptor, action: { ...descriptor.action, name: 'Wrong action' } },
      { ...descriptor, kind: item.kind === 'reinforcement' ? 'summon' : 'reinforcement' },
      { ...descriptor, entityRender: { ...descriptor.entityRender, asset: { key: item.key } } },
      { ...descriptor, sourceHeroId: item.caller },
      { ...descriptor, action: { ...descriptor.action, sourceHeroId: item.caller } },
      { ...descriptor, performerRole: 'caller' },
      { ...descriptor, performer: { ...descriptor.performer, id: item.caller } },
      { ...descriptor, performer: { ...descriptor.performer, universe: 'Wrong universe' } },
      { ...descriptor, performer: { ...descriptor.performer, sourceHeroId: 'foreign-source' } },
      { ...descriptor, performer: { ...descriptor.performer, sourceId: 'foreign-source' } }
    ]) assert.equal(resolveAsset(changed), null);
    assert.equal(resolveAsset({ ...descriptor, performer: { ...descriptor.performer, id: 'enemy_' + item.partner, sourceHeroId: item.partner } })?.id, item.id);
    assert.equal(resolveAsset(resolveUniverseSummon(hero(item.partner))), null, 'partner must not summon itself through a borrowed body');
    const context = make(item.caller), scene = start(context), choreography = context.engine.getSummonSceneState().choreography;
    assert.equal(getFrame({ ...scene, actor: { ...scene.actor, universe: 'Wrong universe' } }, choreography), null);
  }
});

test('112 actual wide RGBA cells have distinct pixels, clear margins, baseline244 and common entity scale', async () => {
  for (const entry of registry.entries) {
    const bytes = read('public' + entry.sheet);
    assert.equal(sha(bytes), entry.sha256); assert.equal(sha(read(entry.sourceImage)), entry.sourceImageSha256);
    assert.equal(entry.frames, 16); assert.equal(entry.normalization.baseline, 244); assert.equal(entry.normalization.sharedScaleAcrossAllPhases, true);
    assert.deepEqual([entry.frameWidth, entry.frameHeight], [512, 256]);
    assert.equal(entry.normalization.bodyCalibration.targetBodyHeight, 190);
    assert.equal(entry.normalization.bodyCalibration.outputBodyHeight, 190);
    assert.equal(entry.normalization.bodyCalibration.constrainedByEnvelope, false);
    assert.ok(entry.normalization.rows.every(row => row.scale === entry.normalization.scale && row.baseline === 244 && row.crossedVisiblePixels === 0));
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual([info.width, info.height, info.channels], [2048, 1024, 4]);
    const allHashes = [];
    for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
      const pixels = Buffer.alloc(512 * 256 * 4); let visible = 0, bottom = -1;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
        const offset = ((row * 256 + y) * 2048 + col * 512 + x) * 4, alpha = data[offset + 3];
        if (alpha) data.copy(pixels, (y * 512 + x) * 4, offset, offset + 4);
        if (alpha > 4) { visible++; bottom = Math.max(bottom, y); }
        if (x < 10 || x >= 502 || y < 10 || y >= 246) assert.equal(alpha, 0, `${entry.id}/${row}/${col}: clipped cell margin`);
      }
      assert.ok(visible > 300 && visible < 65000); assert.ok(bottom <= 244);
      const digest = sha(pixels); allHashes.push(digest); assert.equal(digest, entry.visualValidation.phaseReviews[row].frameHashes[col]);
    }
    assert.equal(new Set(allHashes).size, 16, entry.id);
  }
});

test('the twenty-three previous native entities and all28 legacy four-frame sheets retain their captured bytes and complete metadata', () => {
  for (const file of [
    'src/game/combat/entityAssets.generated.json',
    'src/game/combat/summonAnimationsWave5.generated.json',
    'src/game/combat/summonAnimationsWave6.generated.json',
    'src/game/combat/summonAnimationsWave7.generated.json',
    'src/game/combat/summonAnimationsWave8.generated.json',
    'src/game/combat/summonAnimationsWave9.generated.json',
    'src/game/combat/summonAnimationsWave10.generated.json',
    'docs/combat-fidelity-wave10-2026-10-23/summon-provenance.json',
    'docs/combat-fidelity-wave9-2026-10-22/summon-provenance.json',
    'docs/combat-fidelity-wave8-2026-10-20/summon-provenance.json',
    'docs/combat-fidelity-wave7-2026-10-20/summon-provenance.json',
    'docs/combat-fidelity-wave6-2026-10-20/summon-provenance.json'
  ]) assert.equal(sha(read(file)), baseline.inputHashes[file], file);
  const legacy = json('src/game/combat/entityAssets.generated.json').entries;
  assert.equal(legacy.length, 28);
  for (const entry of legacy) { assert.equal(entry.frames, 4); assert.equal(sha(read('public' + entry.sheet)), entry.sha256); }
  assert.equal(historicalAssets.length, 23);
  for (const entry of historicalAssets) {
    assert.equal(entry.frames, 16);
    assert.equal(sha(read('public' + entry.sheet)), entry.sha256);
    assert.equal(sha(read(entry.sourceImage)), entry.sourceImageSha256);
    if (entry.referenceImage) {
      const referenceHash = entry.referenceAssetSha256 ?? entry.referenceImageSha256;
      assert.match(referenceHash, /^[a-f0-9]{64}$/);
      assert.equal(sha(read(entry.referenceImage)), referenceHash);
    }
    assert.deepEqual(getAssets().find(asset => asset.key === entry.key), entry, entry.key);
  }
});

for (const side of ['player', 'enemy']) test(`${side} seven native roster partners render all16 cells, spend once, pause and impact only on attack col2`, () => readyImages(() => {
  for (const item of cases) {
    const context = make(item.caller, side), { engine, actor, targets } = context;
    actor.atb = 99; assert.equal(engine.summon(actor, side), false); actor.atb = 100;
    actor.specialCharge = 99; assert.equal(engine.summon(actor, side), false); actor.specialCharge = 100;
    const originalCosts = costs(actor); assert.equal(engine.summon(actor, side), true); assert.deepEqual(costs(actor), originalCosts);
    assert.equal(engine.cancelTargeting(), true); assert.deepEqual(costs(actor), originalCosts);
    const scene = start(context), asset = resolveAsset(scene.descriptor), first = engine.getSummonSceneState(), originalHp = hp(targets);
    assert.equal(asset.key, item.key); assert.equal(first.kind, item.kind); assert.deepEqual(costs(actor), { atb: 0, charge: 0, used: true });
    assert.equal(engine.confirmTargeting(), false); assert.equal(engine.summon(actor, side), false);
    const committedIds = [...first.targetIds], timing = first.entityAnimationFrame;
    assert.ok(timing); assert.ok(committedIds.length);
    let impacts = 0, queueCalls = 0; const apply = engine.applyRpgImpact.bind(engine);
    engine.applyRpgImpact = (...args) => { impacts++; return apply(...args); };
    engine.scheduleAction(() => { queueCalls++; }, 1000); const queuedTicks = engine.actionQueue[0].ticks;
    const cells = new Set();
    while (engine.activeSummon) {
      const view = engine.getSummonSceneState(), frame = view.entityAnimationFrame;
      assert.equal(view.entityAnimationAssetId, asset.id); assert.deepEqual(view.targetIds, committedIds);
      assert.equal(impacts, scene.tick >= scene.impactTick ? 1 : 0);
      if (frame.phase === 'attack' && scene.tick < scene.impactTick) assert.ok(frame.col < 2);
      if (scene.tick === scene.impactTick) assert.deepEqual([frame.row, frame.col], [2, 2]);
      if (!cells.has(frame.index)) {
        const snapshot = JSON.stringify({ actor, targets, tick: scene.tick, queue: engine.actionQueue });
        const r = recorder(); engine.drawSummonScene(r.ctx); r.balanced();
        const draw = r.calls.find(call => call[0] === 'drawImage' && call[1].src === asset.sheet); assert.ok(draw, `${asset.id}/${frame.index}`);
        assert.deepEqual(draw.slice(2, 6), [frame.col * 512, frame.row * 256, 512, 256]);
        assert.ok(Math.abs(draw[8] / draw[9] - 2) < 1e-8, 'wide sprite was squeezed to a square');
        assert.ok(r.calls.some(call => call[0] === 'scale' && call[1] === (side === 'player' ? 1 : -1) && call[2] === 1));
        assert.equal(JSON.stringify({ actor, targets, tick: scene.tick, queue: engine.actionQueue }), snapshot);
        engine.setPaused(true); tick(engine, 20); const paused = recorder(); engine.drawSummonScene(paused.ctx); paused.balanced(); assert.deepEqual(paused.calls, r.calls);
        assert.equal(JSON.stringify({ actor, targets, tick: scene.tick, queue: engine.actionQueue }), snapshot); engine.setPaused(false); cells.add(frame.index);
      }
      assert.equal(queueCalls, 0); assert.equal(engine.actionQueue[0].ticks, queuedTicks);
      engine.update();
    }
    assert.equal(cells.size, 16, asset.id); assert.equal(impacts, 1); assert.equal(actor.actionPending, false);
    assert.equal(actor.x, actor.homeX); assert.equal(actor.y, actor.homeY);
    const afterHp = hp(targets);
    targets.forEach((target, i) => assert.equal(afterHp[i] < originalHp[i], item.effect === 'damage' && committedIds.includes(target.battleId)));
    if (item.effect === 'buff') { assert.deepEqual(afterHp, originalHp); assert.ok(actor.rpgBuffTicks > 0); assert.equal(actor.rpgBuffSource.name, scene.profile.name); assert.equal(actor.rpgBuffMultiplier, scene.profile.buffMultiplier); }
    tick(engine, 100); assert.equal(impacts, 1); assert.deepEqual(hp(targets), afterHp); assert.equal(queueCalls, 1);
    actor.atb = 100; actor.specialCharge = 100; assert.equal(engine.summon(actor, side), false);
  }
}));

for (const side of ['player', 'enemy']) test(`${side} the seven offensive roster partners retain target identities through death and cannot cause late interrupted impacts`, () => {
  for (const item of cases.filter(item => item.effect === 'damage')) {
    const context = make(item.caller, side), { engine, actor, targets } = context;
    targets[2].currentHp = 0; targets[2].state = 'dead'; const scene = start(context), committed = [...engine.getSummonSceneState().targetIds];
    assert.ok(committed.includes(targets[0].battleId)); assert.equal(committed.includes(targets[2].battleId), false);
    targets[1].currentHp = 0; targets[1].state = 'dead'; targets[2].currentHp = targets[2].maxHp; targets[2].state = 'idle';
    const untouched = targets[2].currentHp; tick(engine, scene.impactTick);
    assert.deepEqual(engine.getSummonSceneState().targetIds, committed); assert.equal(targets[1].currentHp, 0); assert.equal(targets[2].currentHp, untouched);
    assert.ok(targets[0].currentHp < targets[0].maxHp); assert.equal(actor.summonUsed, true);
    for (const end of ['dispose', 'gameOver', 'dead-caller', 'removed-caller', 'finishSummon']) {
      const interrupted = make(item.caller, side), e = interrupted.engine; start(interrupted); tick(e, 3); const beforeHp = hp(interrupted.targets);
      let impacts = 0; const apply = e.applyRpgImpact.bind(e); e.applyRpgImpact = (...args) => { impacts++; return apply(...args); };
      if (end === 'dispose') e.dispose();
      else if (end === 'gameOver') e.gameOver = true;
      else if (end === 'dead-caller') { interrupted.actor.currentHp = 0; interrupted.actor.state = 'dead'; }
      else if (end === 'removed-caller') { if (side === 'player') e.heroes = []; else e.enemies = []; }
      else e.finishSummon();
      tick(e, 400); assert.equal(e.activeSummon, null); assert.equal(interrupted.actor.actionPending, false);
      assert.equal(impacts, 0); assert.deepEqual(hp(interrupted.targets), beforeHp); assert.equal(interrupted.actor.summonUsed, true);
    }
  }
});


test('all seven new native sources and five weapon apertures track each phase/column and facing with no travel from lowered or empty weapons', () => {
  for (const item of cases) for (const side of ['player', 'enemy']) {
    const asset = registry.entries.find(entry => entry.performerHeroId === item.partner);
    const context = make(item.caller, side), scene = start(context), seen = new Set();
    for (let tick = 0; tick < scene.durationTicks; tick++) {
      scene.tick = tick;
      const view = context.engine.getSummonSceneState(), raw = view.choreography, frame = view.entityAnimationFrame;
      if (seen.has(frame.index)) continue;
      seen.add(frame.index);
      const before = JSON.stringify(raw), adjusted = projectOrigin(raw, asset, frame), anchor = asset.effectAnchors?.[frame.phase]?.[frame.col];
      assert.equal(JSON.stringify(raw), before);
      assert.equal(adjusted.nativeMuzzleActive, !!anchor);
      if (!anchor) continue;
      const performer = raw.performer, dx = (anchor.x - 256) / 256 * performer.size * performer.facing, dy = (anchor.y - 244) / 256 * performer.size, angle = performer.rotation || 0;
      assert.ok(Math.abs(adjusted.origin.x - performer.x - dx * Math.cos(angle) + dy * Math.sin(angle)) < 1e-8);
      assert.ok(Math.abs(adjusted.origin.y - performer.y - dx * Math.sin(angle) - dy * Math.cos(angle)) < 1e-8);
    }
    assert.equal(seen.size, 16);
  }
  const control = { performer: { x: 4, y: 7 }, origin: { x: 9, y: 11 }, visuals: [] };
  assert.equal(projectOrigin(control, {}, {phase:'attack',col:2}), control, 'historical sampler path must stay unchanged');
});

test('a pending native sheet falls back to the exact roster partner instead of an entity surrogate', () => readyImages(() => {
  for (const item of cases) {
    const context = make(item.caller), scene = start(context); scene.tick = scene.impactTick;
    const asset = resolveAsset(scene.descriptor), initial = recorder(); context.engine.drawSummonScene(initial.ctx); initial.balanced();
    const native = initial.calls.find(call => call[0] === 'drawImage' && call[1].src === asset.sheet); assert.ok(native);
    const image = native[1], oldWidth = image.naturalWidth; image.naturalWidth = 0;
    try {
      const fallback = recorder(); context.engine.drawSummonScene(fallback.ctx); fallback.balanced();
      assert.equal(fallback.calls.some(call => call[0] === 'drawImage' && call[1].src === asset.sheet), false);
      const expectedSheets = new Set([getHeroSpriteSheetSrc(hero(item.partner)), resolveCharacterAnimationAsset(hero(item.partner))?.sheet].filter(Boolean));
      assert.ok(fallback.calls.some(call => call[0] === 'drawImage' && expectedSheets.has(call[1].src)), item.id + ' lost its genuine roster partner: ' + JSON.stringify(fallback.calls.filter(call => call[0] === 'drawImage').map(call => call[1].src)));
    } finally { image.naturalWidth = oldWidth; }
  }
}));

test('all 28 historical entity path labels, source references and 280 sampled geometries remain identical', () => {
  assert.equal(baseline.entities.entries.length, 28);
  const priorKeys = new Set([...baseline.entities.entries.map(entry => entry.key), ...cases.map(entry => entry.key)]);
  assert.equal(Object.keys(SUMMON_CHOREOGRAPHIES).filter(key => priorKeys.has(key)).length, 35);
  for (const original of baseline.entities.entries) {
    const spec = SUMMON_CHOREOGRAPHIES[original.key]; assert.ok(spec, original.id);
    assert.equal(spec.path, original.path); assert.equal(spec.sourceReference, original.sourceReference);
    const scene = { actor: { id: 'caller', x: 140, y: 330 }, targets: [{ id: 'target', x: 600, y: 330 }], choreography: spec, side: 'player', durationTicks: 192, impactTick: 99 };
    const samples = original.sampledGeometry.map(({tick}) => getSummonChoreographyState({ ...scene, tick }, { width: 760, height: 420 }));
    // The immutable baseline is JSON: signed zero is serialized as zero.
    assert.deepEqual(JSON.parse(JSON.stringify(samples.map(sample => ({ tick: sample.tick, ...sample.performer })))), original.sampledGeometry, original.id);
    assert.deepEqual([...new Set(samples.map(sample => sample.poseIndex))], original.poseIndices);
    assert.deepEqual([...new Set(samples.flatMap(sample => sample.visuals.map(visual => visual.kind)))], original.effectKinds);
  }
});

test('forty callers use a real same-universe partner, with28 native bindings and12 declared fallback partners', () => {
  const entries = Object.entries(reinforcementBindings);
  assert.equal(entries.length, 40);
  let native = 0, alternate = 0;
  for (const [id, binding] of entries) {
    const caller = hero(id), descriptor = resolveUniverseSummon(caller);
    assert.equal(descriptor.kind, 'reinforcement');
    assert.equal(descriptor.universe, caller.universe);
    assert.equal(descriptor.performer.universe, caller.universe);
    assert.equal(descriptor.performer.id, binding.performerHeroId);
    assert.notEqual(descriptor.performer.id, id);
    assert.equal(descriptor.action.sourceHeroId, binding.performerHeroId);
    assert.equal(descriptor.sourceHeroId, binding.performerHeroId);
    const asset = resolveAsset(descriptor);
    if (asset && registry.entries.some(entry => entry.id === asset.id)) native++;
    else { alternate++; assert.ok(getHeroSpriteSheetSrc(descriptor.performer)); }
  }
  assert.deepEqual([native, alternate], [28, 12]);
});

test('the outside-batch Shephard legacy Dog call keeps its explicit raw action after Alyx personal-kit corrections', () => {
  const descriptor = resolveUniverseSummon(hero('shephard'));
  assert.equal(descriptor.universe, 'Half-Life');
  assert.equal(descriptor.entityName, 'Dog Breach Assist');
  assert.equal(descriptor.action.name, 'Dog Breach Assist');
  assert.notEqual(descriptor.action.name, resolveUniverseSummon(hero('freeman')).action.name);
  assert.equal(resolveAsset(descriptor), null);
});

for (const side of ['player', 'enemy']) test(`${side} Hermione legacy Protego guards real allies once without healing, harming enemies or a fictitious native asset`, () => readyImages(() => {
  const item = support, context = make(item.caller, side, 1), { engine, actor, allies, targets } = context;
  allies[0].currentHp = 40000; allies[1].currentHp = 60000;
  const initialAlliedHp = hp(allies), initialEnemyHp = hp(targets);
  const scene = start(context), ids = [...engine.getSummonSceneState().targetIds], asset = resolveAsset(scene.descriptor);
  assert.deepEqual(new Set(ids), new Set(allies.map(unit => unit.battleId)));
  assert.equal(scene.profile.effect, 'guard'); assert.equal(scene.profile.multiplier, 0);
  assert.equal(scene.profile.summon.action.sourceHeroId, item.partner);
  assert.equal(scene.profile.summon.action.targeting.targetSide, 'ally');
  assert.equal(asset, null);
  assert.equal(engine.getSummonSceneState().entityAnimationFrame, null);
  assert.equal(engine.getSummonSceneState().entityAnimationAssetId, null);
  assert.match(scene.choreography.sourceReference, /refused/);
  let effects = 0; const apply = engine.applyRpgImpact.bind(engine);
  engine.applyRpgImpact = (...args) => { effects++; return apply(...args); };
  tick(engine, scene.impactTick - 1);
  assert.equal(effects, 0); assert.ok(allies.every(unit => !unit.rpgGuardTicks));
  const beforePause = JSON.stringify({ scene: engine.getSummonSceneState(), allies, targets, costs: costs(actor) });
  engine.setPaused(true); tick(engine, 80);
  assert.equal(JSON.stringify({ scene: engine.getSummonSceneState(), allies, targets, costs: costs(actor) }), beforePause);
  engine.setPaused(false); engine.update();
  assert.equal(effects, 1); assert.deepEqual(hp(allies), initialAlliedHp); assert.deepEqual(hp(targets), initialEnemyHp);
  for (const unit of allies) {
    assert.equal(unit.rpgGuardTicks, Math.round(scene.profile.duration * 60));
    assert.equal(unit.rpgGuardReduce, scene.profile.guardReduce);
    assert.ok(!unit.rpgBuffTicks);
  }
  assert.ok(targets.every(unit => !unit.rpgBuffTicks && !unit.rpgGuardTicks));
  const raw = engine.getSummonSceneState(), projected = projectOrigin(raw.choreography, asset, raw.entityAnimationFrame);
  assert.notEqual(projected.nativeMuzzleActive, true);
  const r = recorder(), snapshot = JSON.stringify({ allies, targets, scene: engine.activeSummon });
  engine.drawSummonScene(r.ctx); r.balanced();
  const oldSheet = getHeroSpriteSheetSrc(hero(item.partner));
  assert.ok(r.calls.some(call => call[0] === 'drawImage' && call[1].src === oldSheet && call[3] === 0), 'actual non-offensive old Hermione row0 is reused');
  assert.equal(JSON.stringify({ allies, targets, scene: engine.activeSummon }), snapshot);
  tick(engine, scene.durationTicks - scene.tick); assert.equal(effects, 1);
  assert.deepEqual(hp(allies), initialAlliedHp); assert.deepEqual(hp(targets), initialEnemyHp);
  assert.deepEqual(costs(actor), { atb: 0, charge: 0, used: true });
}));

for (const side of ['player', 'enemy']) test(`${side} all seven native offensive partners need HP-lowering contact and retain accepted coordinates after target KO`, () => readyImages(() => {
  for (const item of cases.filter(item => item.effect === 'damage')) {
    const blocked = make(item.caller, side);
    blocked.targets.forEach(unit => { unit.battleItemShield = 100000; });
    const beforeHp = hp(blocked.targets), scene = start(blocked);
    assert.deepEqual(scene.visualContacts, []);
    tick(blocked.engine, scene.impactTick);
    assert.deepEqual(hp(blocked.targets), beforeHp);
    assert.deepEqual(scene.visualContacts, []);
    assert.deepEqual(blocked.engine.getSummonSceneState().choreography.targets, []);

    const accepted = make(item.caller, side), active = start(accepted);
    tick(accepted.engine, active.impactTick);
    assert.ok(active.visualContacts.length > 0);
    const contacts = JSON.parse(JSON.stringify(active.visualContacts));
    const originalGeometry = JSON.parse(JSON.stringify(accepted.engine.getSummonSceneState().choreography.targets));
    for (const unit of accepted.targets) if (contacts.some(contact => contact.id === unit.battleId)) {
      unit.x += 333; unit.y += 77; unit.currentHp = 0; unit.state = 'dead';
    }
    assert.deepEqual(active.visualContacts, contacts);
    assert.deepEqual(accepted.engine.getSummonSceneState().choreography.targets, originalGeometry);
    const snapshot = JSON.stringify({ actor: accepted.actor, targets: accepted.targets, scene: active });
    const r = recorder(); accepted.engine.drawSummonScene(r.ctx); r.balanced();
    assert.equal(JSON.stringify({ actor: accepted.actor, targets: accepted.targets, scene: active }), snapshot);
    accepted.engine.setPaused(true); tick(accepted.engine, 70);
    assert.equal(JSON.stringify({ actor: accepted.actor, targets: accepted.targets, scene: active }), snapshot);
    accepted.engine.dispose();
  }
}));

