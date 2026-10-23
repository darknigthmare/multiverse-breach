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
const registry = json('src/game/combat/summonAnimationsWave7.generated.json');
const baseline = json('docs/combat-fidelity-wave7-2026-10-20/baseline.json');
const historicalAssets = json('docs/combat-fidelity-wave7-2026-10-20/runtime-baseline.json').summonAssets;
const cases = [
  { id: 'ff7-bahamut-megaflare', version: /Final Fantasy VII \(1997\)/, caller: 'aerith_ff7', key: 'Final Fantasy VII::Bahamut::Megaflare', kind: 'summon' },
  { id: 'guilty-gear-yamada-great-yamada-attack', version: /Xrd REV 2/, caller: 'may_gg', key: 'Guilty Gear::Yamada::Great Yamada Attack', kind: 'summon' },
  { id: 'skullgirls-black-egrets-inferno-brigade', version: /2023-onward/, caller: 'skullgirls_parasoul', key: 'Skullgirls::Black Egrets::Inferno Brigade', kind: 'reinforcement' }
];
let vite, EngineRpg, HEROES_DB, resolveUniverseSummon, getAssets, resolveAsset, getFrame, drawEffects;
const engines = [], noop = () => {};
before(async () => {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?summon-wave7'));
  ({ HEROES_DB, } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveUniverseSummon } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ drawSummonChoreographyEffects: drawEffects } = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js'));
  ({ getSummonAnimationAssets: getAssets, resolveSummonAnimationAsset: resolveAsset, getSummonAnimationFrame: getFrame } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js'));
});
after(async () => { engines.forEach(engine => engine.dispose()); await vite?.close(); });
const hero = id => { const found = HEROES_DB.find(h => h.id === id); assert.ok(found, id); return found; };
const dummy = id => ({ id, name: id, universe: 'Invocation Wave7 regression', weaponType: 'melee', primaryColor: '#abcedf', secondaryColor: '#bacade', stats: { hp: 100000, atk: 10, def: 10, spd: 1 }, simple: { name: 'Strike', type: 'melee', dmg: 1 }, secondary: { name: 'Shot', type: 'bullet', dmg: 1 }, defense: { name: 'Guard', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'Finish', type: 'bullet', dmg: 1 } });
const make = (caller, side = 'player') => {
  const own = [hero(caller)], others = ['first', 'second', 'third'].map(dummy);
  const players = side === 'player' ? own : others, enemies = side === 'enemy' ? own : others;
  const engine = new EngineRpg(1040, 520, players, { monsters: enemies, bosses: [], customRoster: enemies }, { add: noop }, noop, noop, { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engine.autoBattle = false; engine.enemyGlobalRecovery = 0; engines.push(engine);
  [...engine.heroes, ...engine.enemies].forEach(unit => { unit.currentHp = unit.maxHp = 100000; unit.atb = 100; unit.specialCharge = 100; unit.state = 'idle'; });
  return { engine, side, actor: (side === 'player' ? engine.heroes : engine.enemies)[0], targets: side === 'player' ? engine.enemies : engine.heroes };
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
    complete = true; naturalWidth = 1024; naturalHeight = 1024;
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

test('the three Wave7 identities resolve exactly, including physical reinforcement kind', () => {
  assert.equal(registry.entries.length, 3);
  assert.deepEqual(registry.entries.map(entry => entry.id).sort(), cases.map(item => item.id).sort());
  assert.deepEqual(registry.entries.map(entry => entry.key).sort(), cases.map(item => item.key).sort());
  assert.equal(historicalAssets.length, 4);
  const known = new Set(historicalAssets.map(entry => entry.key));
  assert.equal(known.size, 4);
  assert.equal(getAssets().filter(entry => known.has(entry.key)).length, 4);
  for (const original of historicalAssets) assert.deepEqual(getAssets().find(entry => entry.key === original.key), original, original.key);
  assert.equal(resolveUniverseSummon(hero('cloud_ff7')).entityName, 'Ifrit');
  for (const item of cases) {
    const descriptor = resolveUniverseSummon(hero(item.caller)), asset = resolveAsset(descriptor);
    assert.equal(asset?.id, item.id); assert.match(asset.sourceWork, item.version);
    assert.equal(asset?.key, item.key); assert.equal(descriptor.kind, item.kind); assert.equal(asset.kind, item.kind);
    assert.equal(asset.canon1to1Verified, false); assert.equal(asset.visualValidation.canon1to1Verified, false);
    for (const changed of [
      { ...descriptor, universe: 'Wrong universe' }, { ...descriptor, entityName: 'Wrong entity' },
      { ...descriptor, action: { ...descriptor.action, name: 'Wrong action' } },
      { ...descriptor, kind: item.kind === 'reinforcement' ? 'summon' : 'reinforcement' },
      { ...descriptor, entityRender: { ...descriptor.entityRender, asset: { ...descriptor.entityRender.asset, key: 'Wrong key' } } }
    ]) assert.equal(resolveAsset(changed), null);
    const context = make(item.caller), scene = start(context), choreography = context.engine.getSummonSceneState().choreography;
    assert.equal(getFrame({ ...scene, actor: { ...scene.actor, universe: 'Wrong universe' } }, choreography), null);
  }
});

test('48 actual RGBA cells have distinct pixels, clear margins, baseline244 and common entity scale', async () => {
  for (const entry of registry.entries) {
    const bytes = read('public' + entry.sheet);
    assert.equal(sha(bytes), entry.sha256); assert.equal(sha(read(entry.sourceImage)), entry.sourceImageSha256);
    assert.equal(entry.frames, 16); assert.equal(entry.normalization.baseline, 244); assert.equal(entry.normalization.sharedScaleAcrossAllPhases, true);
    assert.ok(entry.normalization.rows.every(row => row.scale === entry.normalization.scale && row.baseline === 244 && row.crossedVisiblePixels === 0));
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual([info.width, info.height, info.channels], [1024, 1024, 4]);
    const allHashes = [];
    for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
      const pixels = Buffer.alloc(256 * 256 * 4); let visible = 0, bottom = -1;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const offset = ((row * 256 + y) * 1024 + col * 256 + x) * 4, alpha = data[offset + 3];
        if (alpha) data.copy(pixels, (y * 256 + x) * 4, offset, offset + 4);
        if (alpha > 4) { visible++; bottom = Math.max(bottom, y); }
        if (x < 10 || x >= 246 || y < 10 || y >= 246) assert.equal(alpha, 0, `${entry.id}/${row}/${col}: clipped cell margin`);
      }
      assert.ok(visible > 300 && visible < 45000); assert.ok(bottom <= 244);
      const digest = sha(pixels); allHashes.push(digest); assert.equal(digest, entry.visualValidation.phaseReviews[row].frameHashes[col]);
    }
    assert.equal(new Set(allHashes).size, 16, entry.id);
  }
});

test('the four previous native entities and all28 legacy four-frame sheets retain their captured bytes and complete metadata', () => {
  for (const file of [
    'src/game/combat/entityAssets.generated.json',
    'src/game/combat/summonAnimationsWave5.generated.json',
    'src/game/combat/summonAnimationsWave6.generated.json',
    'docs/combat-fidelity-wave6-2026-10-20/summon-provenance.json'
  ]) assert.equal(sha(read(file)), baseline.inputHashes[file], file);
  const legacy = json('src/game/combat/entityAssets.generated.json').entries;
  assert.equal(legacy.length, 28);
  for (const entry of legacy) { assert.equal(entry.frames, 4); assert.equal(sha(read('public' + entry.sheet)), entry.sha256); }
  assert.equal(historicalAssets.length, 4);
  for (const entry of historicalAssets) {
    assert.equal(entry.frames, 16);
    assert.equal(sha(read('public' + entry.sheet)), entry.sha256);
    assert.equal(sha(read(entry.sourceImage)), entry.sourceImageSha256);
    if (entry.referenceImage) assert.equal(sha(read(entry.referenceImage)), entry.referenceAssetSha256);
    assert.deepEqual(getAssets().find(asset => asset.key === entry.key), entry, entry.key);
  }
});

for (const side of ['player', 'enemy']) test(`${side} three native entities render all16 cells, spend once, pause and impact only on attack col2`, () => readyImages(() => {
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
        assert.deepEqual(draw.slice(2, 6), [frame.col * 256, frame.row * 256, 256, 256]);
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
    targets.forEach((target, i) => assert.equal(afterHp[i] < originalHp[i], committedIds.includes(target.battleId)));
    tick(engine, 100); assert.equal(impacts, 1); assert.deepEqual(hp(targets), afterHp); assert.equal(queueCalls, 1);
    actor.atb = 100; actor.specialCharge = 100; assert.equal(engine.summon(actor, side), false);
  }
}));

for (const side of ['player', 'enemy']) test(`${side} the three entities retain target identities through death and cannot cause late interrupted impacts`, () => {
  for (const item of cases) {
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


test('native Bahamut uses its mouth charge and beam once while retaining target light and the procedural fallback', () => readyImages(() => {
  const atOrigin = (op, origin) => ['moveTo', 'lineTo', 'ellipse'].includes(op[0]) && Math.abs(op[1] - origin.x) < 1e-8 && Math.abs(op[2] - origin.y) < 1e-8;
  for (const side of ['player', 'enemy']) {
    const context = make('aerith_ff7', side), scene = start(context), first = context.engine.getSummonSceneState().choreography;
    for (const tick of [first.arrivalEndTick + 3, first.attackStartTick + 3, scene.impactTick]) {
      scene.tick = tick;
      const state = context.engine.getSummonSceneState().choreography, before = JSON.stringify(scene);
      const native = recorder(); context.engine.drawSummonScene(native.ctx); native.balanced();
      assert.ok(native.calls.some(op => op[0] === 'drawImage' && op[1].src.includes('summon-animations-wave7/bahamut.png')));
      assert.equal(native.calls.some(op => atOrigin(op, state.origin)), false, 'legacy muzzle duplicates native charge or beam');
      if (tick === scene.impactTick) assert.ok(native.calls.some(op => op[0] === 'ellipse'), 'native beam lost its target contact light');
      const fallback = recorder(); drawEffects(fallback.ctx, state, 'behind'); drawEffects(fallback.ctx, state, 'front'); fallback.balanced();
      assert.ok(fallback.calls.some(op => atOrigin(op, state.origin)), 'procedural fallback disappeared');
      assert.equal(JSON.stringify(scene), before);
    }
  }
}));
