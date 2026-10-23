import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
if (!process.argv.includes('--after-production-freeze')) throw new Error('Wait for root final production/import freeze, then pass --after-production-freeze.');
const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
function productionSnapshot() {
  const pending = [path.join(repositoryRoot, 'src/components/GameCanvas.jsx')], files = new Set();
  while (pending.length) {
    const file = pending.pop();
    if (files.has(file)) continue;
    files.add(file);
    if (!/\.[cm]?jsx?$/.test(file)) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)(['"])(\.[^'"]+)\1/g)) {
      const reference = path.resolve(path.dirname(file), match[2]);
      const dependency = [reference, `${reference}.js`, `${reference}.jsx`, `${reference}.json`].find(candidate => /\.(?:[cm]?jsx?|json)$/.test(candidate) && existsSync(candidate));
      if (dependency) pending.push(dependency);
    }
  }
  for (const id of ['spike', 'ronon', 'greer', 'roland', 'furiosa', 'korben', 'lancelot']) files.add(path.join(repositoryRoot, `public/sprites/generated/summon-animations-wave11/${id}.png`));
  for (const registry of ['characterAnimationsWave11PartB.generated.json', 'characterSpriteCorrectionsWave11PartB.generated.json']) {
    for (const entry of JSON.parse(readFileSync(path.join(repositoryRoot, 'src/game/combat', registry))).entries) files.add(path.join(repositoryRoot, 'public', entry.sheet));
  }
  return [...files].sort().map(file => ({ path: path.relative(repositoryRoot, file), sha256: createHash('sha256').update(readFileSync(file)).digest('hex') }));
}
const sourceFilesBefore = productionSnapshot();
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pageErrors = [], rows = [];
page.on('pageerror', error => pageErrors.push(error.message));
const cases = [
  { id: 'buffy_summers', partner: 'spike_buffy', slug: 'spike', entity: 'Spike', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'harry_potter', ally: 'ron_weasley', partner: 'hermione_granger', slug: 'hermione', entity: 'Hermione Granger', kind: 'reinforcement', label: 'RENFORT', effect: 'guard', fallback: true },
  { id: 'sheppard_sga', partner: 'ronon_dex', slug: 'ronon', entity: 'Ronon Dex', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'rush_sgu', partner: 'greer_sgu', slug: 'greer', entity: 'Ronald Greer', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'lilith_borderlands', partner: 'roland_bl', slug: 'roland', entity: 'Roland', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'max', partner: 'furiosa', slug: 'furiosa', entity: 'Furiosa', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'leeloo', partner: 'korben', slug: 'korben', entity: 'Korben Dallas', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' },
  { id: 'arthur_kaamelott', partner: 'lancelot_kaamelott', slug: 'lancelot', entity: 'Lancelot', kind: 'reinforcement', label: 'RENFORT', effect: 'damage' }
];
try {
  for (const item of cases.flatMap(entry => ['player', 'enemy'].map(side => ({ ...entry, side })))) {
    await page.goto(process.env.SUMMON_ANIMATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
    const identity = await page.evaluate(async item => {
      const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
      const mainSource = await (await fetch('/src/main.jsx')).text();
      const reactUrl = source.match(/from ["'](\/node_modules\/\.vite\/deps\/react\.js[^"']*)["']/)?.[1];
      const domUrl = mainSource.match(/from ["'](\/node_modules\/\.vite\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
      if (!reactUrl || !domUrl) throw new Error('Could not resolve the application React singleton URLs');
      const reactModule = await import(reactUrl), React = reactModule.default || reactModule;
      const domModule = await import(domUrl), { createRoot } = domModule.default || domModule;
      const engineUrl = source.match(/from ["'](\/src\/game\/engineRpg\.js[^"']*)["']/)?.[1];
      if (!engineUrl) throw new Error('Could not resolve the exact GameCanvas EngineRpg module URL');
      const { EngineRpg } = await import(engineUrl), { default: GameCanvas } = await import('/src/components/GameCanvas.jsx');
      const { HEROES_DB } = await import('/src/game/heroes.js');
      const { resolveUniverseSummon } = await import('/src/game/combatIdentity.js');
      const caller = HEROES_DB.find(hero => hero.id === item.id), descriptor = resolveUniverseSummon(caller);
      if (descriptor.entityName !== item.entity || descriptor.kind !== item.kind) throw new Error('Wrong actual caller identity');
      const update = EngineRpg.prototype.update, execute = EngineRpg.prototype.executeSummon;
      EngineRpg.prototype.update = function (...args) {
        if (!this.summonReviewPrepared) {
          this.summonReviewPrepared = true; this.autoBattle = false;
          this.heroes.forEach(unit => { unit.atb = item.side === 'player' && unit === this.heroes[0] ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          this.enemies.forEach(unit => { unit.atb = item.side === 'enemy' && unit === this.enemies[0] ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          window.summonReviewActor = () => item.side === 'enemy' ? this.enemies[0] : this.heroes[0];
          window.summonReviewTargets = () => item.side === 'enemy' ? this.heroes : this.enemies;
          window.summonReviewAllies = () => item.side === 'enemy' ? this.enemies : this.heroes;
          if (item.effect === 'guard') window.summonReviewAllies().forEach((unit, index) => { unit.currentHp = index === 0 ? 40000 : 60000; });
          window.summonEngine = this;
        }
        return update.apply(this, args);
      };
      // Stop the real simulation at the commit, before browser latency could
      // skip arrival cells. No tick, target, cost or damage code is replaced.
      EngineRpg.prototype.executeSummon = function (...args) { const result = execute.apply(this, args); if (result) this.setPaused(true); return result; };
      const opponent = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
      const ally = item.ally ? HEROES_DB.find(hero => hero.id === item.ally) : null;
      const ownRoster = [caller, ...(ally ? [ally] : [])], opposingRoster = [opponent];
      const enemyRoster = item.side === 'enemy' ? ownRoster : opposingRoster;
      const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: enemyRoster, bosses: [], customRoster: enemyRoster } };
      const stage = { id: 760006, name: 'Invocation review ordinary room', universe: caller.universe, mode: 'RPG', difficulty: 'Training', disableItems: true, customBattle };
      const props = { lang: 'fr', playerProfile: { name: 'Contrôle invocation' }, activeTeam: (item.side === 'enemy' ? opposingRoster : ownRoster).map(hero => hero.id), stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
      const host = document.body.appendChild(document.createElement('div')); document.getElementById('root').style.display = 'none';
      function ReviewSession() {
        const [paused, setPaused] = React.useState(false);
        return React.createElement(React.Fragment, null,
          React.createElement('button', { type: 'button', id: 'summon-review-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le contrôle' : 'Pause de contrôle'),
          React.createElement(GameCanvas, { ...props, sessionPaused: paused }));
      }
      window.summonRoot = createRoot(host); window.summonRoot.render(React.createElement(ReviewSession));
      window.summonEngineClass = EngineRpg;
      return { engineUrl, reactUrl, domUrl, side: item.side, caller: caller.id, universe: caller.universe, entity: descriptor.entityName, kind: descriptor.kind, sourceKey: [descriptor.universe, descriptor.entityName, descriptor.action.name].join('::'), sourceHeroId: descriptor.sourceHeroId, performerHeroId: descriptor.performer.id, effect: descriptor.action.targeting.effect, cloudEntity: resolveUniverseSummon(opponent).entityName };
    }, item);
    const command = page.getByRole('button', { name: new RegExp(`${item.label}.*${item.entity}`) });
    await command.waitFor({ timeout: 20000 });
    await command.click();
    await page.getByRole('button', { name: 'Confirmer les cibles' }).waitFor();
    const selection = await page.evaluate(() => { const engine = window.summonEngine, actor = window.summonReviewActor(); return { atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed, targeting: engine.getTargetingState().summon.entityName }; });
    assert.deepEqual([selection.atb, selection.charge, selection.used], [100, 100, false]);
    await page.getByRole('button', { name: 'Annuler sans coût' }).click();
    assert.deepEqual(await page.evaluate(() => { const actor = window.summonReviewActor(); return [actor.atb, actor.specialCharge, actor.summonUsed]; }), [100, 100, false]);
    await page.keyboard.press(item.side === 'enemy' ? 'Numpad5' : 'u');
    await page.getByRole('button', { name: 'Confirmer les cibles' }).click();
    await page.waitForFunction(() => window.summonEngine?.isSummonSceneActive());
    await page.getByRole('button', { name: 'Pause de contrôle' }).click();
    await page.waitForFunction(() => window.summonEngine.paused === true);
    const pause = await page.evaluate(() => {
      const engine = window.summonEngine, snapshot = JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp), allies: window.summonReviewAllies() });
      for (let i = 0; i < 90; i++) engine.update();
      return { unchanged: snapshot === JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp), allies: window.summonReviewAllies() }), tick: engine.activeSummon.tick, atb: window.summonReviewActor().atb, charge: window.summonReviewActor().specialCharge, used: window.summonReviewActor().summonUsed };
    });
    assert.equal(pause.unchanged, true); assert.deepEqual([pause.tick, pause.atb, pause.charge, pause.used], [0, 0, 0, true]);
    const native = await page.evaluate(async item => {
      const engine = window.summonEngine;
      const { getHeroSpriteSheetSrc } = await import('/src/game/spriteAssets.js');
      const { HEROES_DB } = await import('/src/game/heroes.js');
      const sheet = item.fallback ? getHeroSpriteSheetSrc(HEROES_DB.find(hero => hero.id === item.partner)) : `/sprites/generated/summon-animations-wave11/${item.slug}.png`;
      const image = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = sheet; });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), drawImage = ctx.drawImage.bind(ctx);
      const calls = [], frames = [], hpChanges = [], effectEvents = []; let currentTick = engine.activeSummon.tick, lastHp = window.summonReviewTargets()[0].currentHp, impactImage;
      ctx.drawImage = (image, ...args) => {
        if (new URL(image.src).pathname === sheet) calls.push({ tick: currentTick, row: item.fallback ? args[1] / args[3] : args[1] / 256, col: item.fallback ? args[0] / args[2] : args[0] / 512, sw: args[2], sh: args[3], facing: Math.sign(ctx.getTransform().a), dw: args[6], dh: args[7] });
        return drawImage(image, ...args);
      };
      const units = values => values.map(unit => ({ id: unit.battleId || unit.id, hp: unit.currentHp, buffTicks: unit.rpgBuffTicks || 0, buffMultiplier: unit.rpgBuffMultiplier || 1, guardTicks: unit.rpgGuardTicks || 0, guardReduce: unit.rpgGuardReduce || 0 }));
      const initialAllies = units(window.summonReviewAllies()), initialEnemies = units(window.summonReviewTargets());
      const applyImpact = engine.applyRpgImpact;
      engine.applyRpgImpact = function (actor, profile, targets, color, abilityType) {
        const beforeAllies = units(window.summonReviewAllies()), beforeEnemies = units(window.summonReviewTargets());
        const result = applyImpact.call(this, actor, profile, targets, color, abilityType);
        if (abilityType === 'summon') effectEvents.push({ tick: this.activeSummon.tick, effect: profile.effect, name: profile.name, partner: profile.summon.performer.id, targetIds: targets.map(unit => unit.battleId || unit.id), beforeAllies, beforeEnemies, afterAllies: units(window.summonReviewAllies()), afterEnemies: units(window.summonReviewTargets()) });
        return result;
      };
      const initialCosts = { atb: window.summonReviewActor().atb, charge: window.summonReviewActor().specialCharge, used: window.summonReviewActor().summonUsed }, impactTick = engine.activeSummon.impactTick;
      while (engine.activeSummon) {
        currentTick = engine.activeSummon.tick;
        const state = engine.getSummonSceneState(); frames.push({ tick: currentTick, frame: state.entityAnimationFrame, impacted: state.impacted, kind: state.kind });
        engine.draw(ctx, currentTick, 'fr');
        if (currentTick === impactTick) impactImage = canvas.toDataURL('image/png');
        engine.setPaused(false); engine.update(); engine.setPaused(true);
        const hp = window.summonReviewTargets()[0].currentHp;
        if (hp !== lastHp) hpChanges.push({ tick: currentTick + 1, before: lastHp, after: hp });
        lastHp = hp;
      }
      ctx.drawImage = drawImage;
      // Native Chromium pixels, not just a recorded scale call: all16 cells
      // must reflect exactly, including each genuine roster partner and complete weapon reach.
      let pixelMirrorChecks = 0;
      for (let row = 0; row < (item.fallback ? 0 : 4); row++) for (let col = 0; col < 4; col++) {
        const left = document.createElement('canvas'), right = document.createElement('canvas'); left.width = right.width = 512; left.height = right.height = 256;
        const lc = left.getContext('2d'), rc = right.getContext('2d');
        lc.drawImage(image, col * 512, row * 256, 512, 256, 0, 0, 512, 256);
        rc.translate(512, 0); rc.scale(-1, 1); rc.drawImage(image, col * 512, row * 256, 512, 256, 0, 0, 512, 256);
        const l = lc.getImageData(0, 0, 512, 256).data, r = rc.getImageData(0, 0, 512, 256).data;
        for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) for (let channel = 0; channel < 4; channel++) if (l[(y * 512 + x) * 4 + channel] !== r[(y * 512 + 511 - x) * 4 + channel]) throw new Error('Native pixel mirror mismatch');
        pixelMirrorChecks++;
      }
      const recharged = window.summonReviewActor(); recharged.atb = 100; recharged.specialCharge = 100;
      const canSummonAgain = engine.summon(recharged, item.side);
      return { bodyKind: item.fallback ? 'legacy-fallback' : 'native16', newNativeCells: item.fallback ? 0 : 16, fallbackReason: item.fallback ? 'Explicit image-generation refusal; existing modest school-uniform row0 reused, no new native atlas or beam' : null, sheet, initialCosts, impactTick, frames, calls, hpChanges, effectEvents, initialAllies, initialEnemies, finalAllies: units(window.summonReviewAllies()), finalEnemies: units(window.summonReviewTargets()), canSummonAgain, activeAfter: engine.isSummonSceneActive(), pixelMirrorChecks, impactImage };
    }, item);
    if (!item.fallback) {
      assert.equal(new Set(native.frames.map(row => row.frame.index)).size, 16);
      assert.equal(new Set(native.calls.map(row => `${row.row}:${row.col}`)).size, 16);
      assert.ok(native.calls.every(call => call.sw === 512 && call.sh === 256 && call.facing === (item.side === 'player' ? 1 : -1)));
      assert.ok(native.calls.every(call => Math.abs(call.dw / call.dh - 2) < 1e-8));
      assert.equal(native.frames.find(row => row.tick === native.impactTick).frame.index, 10);
    } else {
      assert.ok(native.frames.every(row => row.frame === null));
      assert.ok(native.calls.length > 0 && native.calls.every(call => call.row === 0));
      assert.equal(native.newNativeCells, 0);
    }
    assert.equal(identity.sourceHeroId, item.partner); assert.equal(identity.performerHeroId, item.partner);
    assert.equal(native.effectEvents.length, 1); assert.equal(native.effectEvents[0].tick, native.impactTick);
    assert.equal(native.effectEvents[0].effect, item.effect); assert.equal(native.effectEvents[0].partner, item.partner);
    if (item.effect === 'damage') { assert.equal(native.hpChanges.length, 1); assert.equal(native.hpChanges[0].tick, native.impactTick); }
    else {
      assert.equal(native.hpChanges.length, 0);
      assert.deepEqual(native.finalEnemies.map(unit => unit.hp), native.initialEnemies.map(unit => unit.hp));
      assert.deepEqual(native.finalAllies.map(unit => unit.hp), native.initialAllies.map(unit => unit.hp));
      assert.equal(native.finalAllies.length, 2);
      assert.ok(native.finalAllies.every(unit => unit.guardTicks > 0 && unit.guardReduce > 0 && unit.buffTicks === 0));
      assert.deepEqual(new Set(native.effectEvents[0].targetIds), new Set(native.initialAllies.map(unit => unit.id)));
    }
    assert.equal(native.pixelMirrorChecks, item.fallback ? 0 : 16); assert.equal(native.canSummonAgain, false); assert.equal(native.activeAfter, false);
    writeFileSync(new URL(`summon-wave11-${item.slug}-${item.side}-impact.png`, import.meta.url), Buffer.from(native.impactImage.split(',')[1], 'base64')); delete native.impactImage;
    await page.getByRole('button', { name: 'Reprendre le contrôle' }).click();
    await page.waitForFunction(() => window.summonEngine.paused === false);
    assert.equal(await command.isDisabled(), true);
    const buttonText = await command.textContent(); assert.match(buttonText, /Déjà utilisé/);
    await page.evaluate(() => window.summonRoot.unmount());
    console.log(JSON.stringify({ completed: rows.length + 1, caller: item.id, side: item.side, kind: native.bodyKind, effects: native.effectEvents.length, hpImpacts: native.hpChanges.length }));
    rows.push({ identity, selection, pause, native, buttonText, uiSequence: `GameCanvas ${item.side} button → cancel without cost → keyboard ${item.side === 'enemy' ? 'Numpad5' : 'U'} → target confirmation button → sessionPaused control → deterministic production updates/rendering → resume → used command disabled` });
  }
  assert.deepEqual(pageErrors, []);
  const nativeCells = side => rows.filter(row => row.identity.side === side && row.native.bodyKind === 'native16').reduce((n, row) => n + new Set(row.native.calls.map(call => `${call.row}:${call.col}`)).size, 0);
  const offensiveRows = rows.filter(row => row.identity.effect === 'damage'), supportRows = rows.filter(row => row.identity.effect === 'guard');
  assert.deepEqual(productionSnapshot(), sourceFilesBefore, 'Production inputs changed during browser verification.');
  const result = {
    date: '2026-10-23', browser: 'local Chromium', actualGameCanvasFlows: rows.length,
    actualEngineUrlResolvedFromGameCanvas: true, bothSidesThroughGameCanvasControls: true,
    nativeFlows: rows.filter(row => row.native.bodyKind === 'native16').length, fallbackFlows: rows.filter(row => row.native.bodyKind === 'legacy-fallback').length,
    distinctSourceCells: new Set(rows.filter(row => row.native.bodyKind === 'native16').flatMap(row => row.native.calls.map(call => `${row.native.sheet}:${call.row}:${call.col}`))).size,
    nativeCells: nativeCells('player'), opposingNativeCells: nativeCells('enemy'),
    nativePixelMirrorChecks: rows.reduce((n, row) => n + row.native.pixelMirrorChecks, 0),
    allEffectsOnce: rows.every(row => row.native.effectEvents.length === 1),
    offensiveFlows: offensiveRows.length, offensiveHpImpacts: offensiveRows.reduce((n, row) => n + row.native.hpChanges.length, 0),
    supportFlows: supportRows.length, supportEffectEvents: supportRows.reduce((n, row) => n + row.native.effectEvents.length, 0),
    supportDamageImpacts: supportRows.reduce((n, row) => n + row.native.hpChanges.length, 0),
    supportAlliedHpUnchanged: supportRows.every(row => JSON.stringify(row.native.initialAllies.map(unit => unit.hp)) === JSON.stringify(row.native.finalAllies.map(unit => unit.hp))),
    productionFilesChangedByHarness: false,
    productionInputsStableDuringRun: true,
    sourceSnapshotScope: 'Recursively resolved literal relative JS/JSX/JSON imports reachable from GameCanvas, plus the seven new native reinforcement PNGs and the twenty frozen Part B native32/base16 PNGs. This does not snapshot remote dependencies or claim every dynamically constructed import.',
    sourceFiles: sourceFilesBefore,
    pauseMethod: 'A review host sets the real GameCanvas sessionPaused prop. Commit pauses EngineRpg at tick0 before browser latency; scene progression uses synchronous real production updates/rendering, never synthetic damage, guard values or animation indices.',
    source1to1Verified: false, pageErrors, rows
  };
  assert.equal(result.actualGameCanvasFlows, 16); assert.equal(result.distinctSourceCells, 112);
  assert.equal(result.nativeCells, 112); assert.equal(result.opposingNativeCells, 112); assert.equal(result.nativePixelMirrorChecks, 224);
  assert.equal(result.allEffectsOnce, true); assert.deepEqual([result.offensiveFlows, result.offensiveHpImpacts], [14, 14]);
  assert.deepEqual([result.supportFlows, result.supportEffectEvents, result.supportDamageImpacts], [2, 2, 0]); assert.equal(result.supportAlliedHpUnchanged, true);
  writeFileSync(new URL('summon-wave11-result.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ flows: result.actualGameCanvasFlows, nativeCells: result.nativeCells, pixelMirrors: result.nativePixelMirrorChecks, opposingNativeCells: result.opposingNativeCells, effects: rows.map(row => row.native.effectEvents.length), offensiveHpImpacts: result.offensiveHpImpacts, supportDamageImpacts: result.supportDamageImpacts, pageErrors }));
} catch (error) {
  writeFileSync(new URL('summon-wave11-harness-diagnostic.json', import.meta.url), JSON.stringify({ error: String(error), pageErrors, body: await page.locator('body').innerText() }, null, 2) + '\n');
  await page.screenshot({ path: new URL('summon-wave11-harness-diagnostic.png', import.meta.url).pathname, fullPage: true });
  throw error;
} finally { await browser.close(); }
