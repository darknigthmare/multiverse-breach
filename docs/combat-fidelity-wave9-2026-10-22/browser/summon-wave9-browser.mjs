import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pageErrors = [], rows = [];
page.on('pageerror', error => pageErrors.push(error.message));
const cases = [
  { id: 'marcus', partner: 'dom', slug: 'dom', entity: 'Dom Santiago', kind: 'reinforcement', label: 'RENFORT' },
  { id: 'shepard', partner: 'garrus', slug: 'garrus', entity: 'Garrus Vakarian', kind: 'reinforcement', label: 'RENFORT' },
  { id: 'motoko', partner: 'batou', slug: 'batou', entity: 'Batou', kind: 'reinforcement', label: 'RENFORT' },
  { id: 'chris_redfield', partner: 'leon', slug: 'leon', entity: 'Leon S. Kennedy', kind: 'reinforcement', label: 'RENFORT' }
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
          this.heroes.forEach(unit => { unit.atb = item.side === 'player' ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          this.enemies.forEach(unit => { unit.atb = item.side === 'enemy' ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          window.summonReviewActor = () => item.side === 'enemy' ? this.enemies[0] : this.heroes[0];
          window.summonReviewTargets = () => item.side === 'enemy' ? this.heroes : this.enemies;
          window.summonEngine = this;
        }
        return update.apply(this, args);
      };
      // Stop the real simulation at the commit, before browser latency could
      // skip arrival cells. No tick, target, cost or damage code is replaced.
      EngineRpg.prototype.executeSummon = function (...args) { const result = execute.apply(this, args); if (result) this.setPaused(true); return result; };
      const opponent = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
      const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [item.side === 'enemy' ? caller : opponent], bosses: [], customRoster: [item.side === 'enemy' ? caller : opponent] } };
      const stage = { id: 760006, name: 'Invocation review ordinary room', universe: caller.universe, mode: 'RPG', difficulty: 'Training', disableItems: true, customBattle };
      const props = { lang: 'fr', playerProfile: { name: 'Contrôle invocation' }, activeTeam: [item.side === 'enemy' ? opponent.id : caller.id], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
      const host = document.body.appendChild(document.createElement('div')); document.getElementById('root').style.display = 'none';
      function ReviewSession() {
        const [paused, setPaused] = React.useState(false);
        return React.createElement(React.Fragment, null,
          React.createElement('button', { type: 'button', id: 'summon-review-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le contrôle' : 'Pause de contrôle'),
          React.createElement(GameCanvas, { ...props, sessionPaused: paused }));
      }
      window.summonRoot = createRoot(host); window.summonRoot.render(React.createElement(ReviewSession));
      window.summonEngineClass = EngineRpg;
      return { engineUrl, reactUrl, domUrl, side: item.side, caller: caller.id, universe: caller.universe, entity: descriptor.entityName, kind: descriptor.kind, sourceKey: [descriptor.universe, descriptor.entityName, descriptor.action.name].join('::'), sourceHeroId: descriptor.sourceHeroId, performerHeroId: descriptor.performer.id, cloudEntity: resolveUniverseSummon(opponent).entityName };
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
      const engine = window.summonEngine, snapshot = JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp) });
      for (let i = 0; i < 90; i++) engine.update();
      return { unchanged: snapshot === JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp) }), tick: engine.activeSummon.tick, atb: window.summonReviewActor().atb, charge: window.summonReviewActor().specialCharge, used: window.summonReviewActor().summonUsed };
    });
    assert.equal(pause.unchanged, true); assert.deepEqual([pause.tick, pause.atb, pause.charge, pause.used], [0, 0, 0, true]);
    const native = await page.evaluate(async item => {
      const engine = window.summonEngine, sheet = `/sprites/generated/summon-animations-wave9/${item.slug}.png`;
      const image = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = sheet; });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), drawImage = ctx.drawImage.bind(ctx);
      const calls = [], frames = [], hpChanges = []; let currentTick = engine.activeSummon.tick, lastHp = window.summonReviewTargets()[0].currentHp, impactImage;
      ctx.drawImage = (image, ...args) => {
        if (new URL(image.src).pathname === sheet) calls.push({ tick: currentTick, row: args[1] / 256, col: args[0] / 512, sw: args[2], sh: args[3], facing: Math.sign(ctx.getTransform().a), dw: args[6], dh: args[7] });
        return drawImage(image, ...args);
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
      for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
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
      return { sheet, initialCosts, impactTick, frames, calls, hpChanges, canSummonAgain, activeAfter: engine.isSummonSceneActive(), pixelMirrorChecks, impactImage };
    }, item);
    assert.equal(new Set(native.frames.map(row => row.frame.index)).size, 16);
    assert.equal(new Set(native.calls.map(row => `${row.row}:${row.col}`)).size, 16);
    assert.ok(native.calls.every(call => call.sw === 512 && call.sh === 256 && call.facing === (item.side === 'player' ? 1 : -1)));
    assert.ok(native.calls.every(call => Math.abs(call.dw / call.dh - 2) < 1e-8));
    assert.equal(identity.sourceHeroId, item.partner); assert.equal(identity.performerHeroId, item.partner);
    assert.equal(native.frames.find(row => row.tick === native.impactTick).frame.index, 10);
    assert.equal(native.hpChanges.length, 1); assert.equal(native.hpChanges[0].tick, native.impactTick);
    assert.equal(native.pixelMirrorChecks, 16); assert.equal(native.canSummonAgain, false); assert.equal(native.activeAfter, false);
    writeFileSync(new URL(`summon-wave9-${item.slug}-${item.side}-impact.png`, import.meta.url), Buffer.from(native.impactImage.split(',')[1], 'base64')); delete native.impactImage;
    await page.getByRole('button', { name: 'Reprendre le contrôle' }).click();
    await page.waitForFunction(() => window.summonEngine.paused === false);
    assert.equal(await command.isDisabled(), true);
    const buttonText = await command.textContent(); assert.match(buttonText, /Déjà utilisé/);
    await page.evaluate(() => window.summonRoot.unmount());
    rows.push({ identity, selection, pause, native, buttonText, uiSequence: `GameCanvas ${item.side} button → cancel without cost → keyboard ${item.side === 'enemy' ? 'Numpad5' : 'U'} → target confirmation button → sessionPaused control → deterministic production updates/rendering → resume → used command disabled` });
  }
  assert.deepEqual(pageErrors, []);
  const result = { date: '2026-10-22', browser: 'local Chromium', actualGameCanvasFlows: rows.length, actualEngineUrlResolvedFromGameCanvas: true, bothSidesThroughGameCanvasControls: true, distinctSourceCells: 64, nativeCells: rows.filter(r => r.identity.side === 'player').reduce((n, r) => n + new Set(r.native.calls.map(call => `${call.row}:${call.col}`)).size, 0), nativePixelMirrorChecks: rows.reduce((n, r) => n + r.native.pixelMirrorChecks, 0), opposingNativeCells: rows.filter(r => r.identity.side === 'enemy').reduce((n, r) => n + new Set(r.native.calls.map(call => `${call.row}:${call.col}`)).size, 0), oneImpactEach: rows.every(r => r.native.hpChanges.length === 1), productionFilesChangedByHarness: false, pauseMethod: 'A small host control sets the real GameCanvas sessionPaused prop. Commit pauses EngineRpg at tick0 before browser latency; scene progression then uses synchronous real engine updates, never synthetic damage or frame indices.', source1to1Verified: false, pageErrors, rows };
  writeFileSync(new URL('summon-wave9-result.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ flows: result.actualGameCanvasFlows, nativeCells: result.nativeCells, pixelMirrors: result.nativePixelMirrorChecks, opposingNativeCells: result.opposingNativeCells, impacts: rows.map(row => row.native.hpChanges.length), pageErrors }));
} catch (error) {
  writeFileSync(new URL('summon-wave9-harness-diagnostic.json', import.meta.url), JSON.stringify({ error: String(error), pageErrors, body: await page.locator('body').innerText() }, null, 2) + '\n');
  await page.screenshot({ path: new URL('summon-wave9-harness-diagnostic.png', import.meta.url).pathname, fullPage: true });
  throw error;
} finally { await browser.close(); }
