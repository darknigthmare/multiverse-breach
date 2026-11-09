// Two real GameCanvas and two real FighterMode sessions. Only initial fixture
// bodies/positions and observer pause breakpoints are supplied by this harness.
// Every capture is commanded through the actual UI, never an engine API call.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import {
  repositoryRoot, waveDirectory, sha, readBytes, writeJson,
  snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts
} from '../browser/presentation-input-integrity.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'));
const startedAt = new Date().toISOString();
const directory = `${waveDirectory}/capture-npc`;
const harness = `${directory}/tactics-fighter.browser.mjs`;
const attempt = `${directory}/attempts/${preliminary ? 'preliminary' : 'final'}-${startedAt.replace(/[^0-9]/g, '')}`;
const options = { preliminary, extraFiles: [harness, `${directory}/plan-before.json`, `${directory}/plan-amendment-before-cyan-fixture.json`, `${directory}/start-server.mjs`, `${waveDirectory}/browser/presentation-input-integrity.mjs`] };
const before = await snapshotPresentationInputs(options);
await writeJson(`${attempt}/inputs-before.json`, before);
await fs.writeFile(`${repositoryRoot}/${attempt}/harness.mjs`, await readBytes(harness));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const rows = [], captures = [], pageErrors = [], consoleErrors = [], httpErrors = [], failedRequests = [];
let failure = null, browserClosedAt = null, page;
async function capture(name) {
  const file = `${attempt}/${name}.png`;
  await page.screenshot({ path: `${repositoryRoot}/${file}`, fullPage: true });
  captures.push(file);
}
const baseUrl = process.env.CAPTURE_NPC_REVIEW_URL || 'http://127.0.0.1:5244/';
try {
  for (const mode of ['Tactics', 'Fighter']) for (const side of ['player', 'enemy']) {
    page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });
    const caseId = `${mode.toLowerCase()}-${side}`;
    page.on('pageerror', error => pageErrors.push({ caseId, message: error.message }));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push({ caseId, message: message.text() }); });
    page.on('response', response => { if (response.status() >= 400) httpErrors.push({ caseId, url: response.url(), status: response.status() }); });
    page.on('requestfailed', request => failedRequests.push({ caseId, url: request.url(), failure: request.failure()?.errorText }));
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    const mounted = await page.evaluate(async ({ mode, side }) => {
      const componentPath = mode === 'Tactics' ? '/src/components/GameCanvas.jsx' : '/src/components/FighterMode.jsx';
      const source = await (await fetch(componentPath)).text(), main = await (await fetch('/src/main.jsx')).text();
      const reactUrl = source.match(/from ["']([^"']*\/deps\/react\.js[^"']*)["']/)?.[1];
      const domUrl = main.match(/from ["']([^"']*\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
      const engineName = mode === 'Tactics' ? 'EngineTactics' : 'EngineFighter';
      const engineUrl = source.match(new RegExp('from ["\\\']([^"\\\']*\\/engine' + mode + '\\.js[^"\\\']*)["\\\']'))?.[1];
      if (!reactUrl || !domUrl || !engineUrl) throw new Error('Actual component singleton URLs unavailable: ' + JSON.stringify({ reactUrl, domUrl, engineUrl }));
      const react = await import(reactUrl), React = react.default || react;
      const dom = await import(domUrl), { createRoot } = dom.default || dom;
      const { default: Component } = await import(componentPath);
      const { [engineName]: Engine } = await import(engineUrl);
      const { HEROES_DB } = await import('/src/game/heroes.js');
      const { CANONICAL_CAPTURE_NPC_WAVE17, getSourceCaptureEnemyAssetsWave17 } = await import('/src/game/combat/sourceCaptureEnemyCatalogWave17.js');
      const { getCharacterAnimationAssets } = await import('/src/game/combat/characterAnimationCatalog.js');
      const { getHeroSpriteSheetSrc } = await import('/src/game/spriteAssets.js');
      const waffle = HEROES_DB.find(hero => hero.id === 'tail_concerto_waffle');
      const cyan = HEROES_DB.find(hero => hero.id === 'tail_concerto_cyan');
      const placeholder = HEROES_DB.find(hero => hero.id === 'noble_six');
      if (!waffle || !placeholder || !cyan) throw new Error('Initial canonical roster fixture absent');
      const npc = structuredClone(CANONICAL_CAPTURE_NPC_WAVE17), asset = getSourceCaptureEnemyAssetsWave17()[0];
      if (!asset || asset.sourceEnemyId !== npc.id || asset.frames !== 16) throw new Error('Exact canonical NPC16 binding absent');
      const image = new Image(); image.src = asset.sheet; await image.decode();
      const pngBytes = await (await fetch(asset.sheet)).arrayBuffer();
      const pngSha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', pngBytes))].map(n => n.toString(16).padStart(2, '0')).join('');
      if (pngSha256 !== asset.sha256 || image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) throw new Error('Native NPC PNG bytes/decode mismatch');
      const nativeWaffle = getCharacterAnimationAssets().find(entry => entry.heroId === waffle.id) || null;
      const f = window.captureNpcFixture = { mode, side, actor: null, target: null, engine: null,
        prepared: false, autoCapturePaused: false, autoReleasePaused: false, events: [], draws: [], asset,
        canonicalNpc: npc, decodedNpc: { sheet: asset.sheet, sha256: pngSha256, width: image.naturalWidth, height: image.naturalHeight },
        nativeWaffle: nativeWaffle ? { sheet: nativeWaffle.sheet, sha256: nativeWaffle.sha256, frames: nativeWaffle.frames } : null,
        waffleBaseSheet: getHeroSpriteSheetSrc(waffle, mode === 'Tactics' ? 'tactics' : 'melee') };
      const snapshot = () => {
        const t = f.target;
        return { id: t.id, sourceEnemyId: t.sourceEnemyId, universe: t.universe, name: t.name,
          currentHp: t.currentHp, maxHp: t.maxHp, x: t.x, y: t.y, gridX: t.gridX ?? null, gridY: t.gridY ?? null,
          gridZ: t.gridZ ?? null, surfaceId: t.surfaceId ?? null, side: t.side ?? null,
          inHeroes: f.mode === 'Tactics' ? f.engine.heroes.includes(t) : f.engine.teams.player.fighters.includes(t),
          inEnemies: f.mode === 'Tactics' ? f.engine.enemies.includes(t) : f.engine.teams.cpu.fighters.includes(t),
          capture: t.sourceBubbleCaptureWave17 ? JSON.parse(JSON.stringify(t.sourceBubbleCaptureWave17)) : null,
          visualSeconds: t.sourceBubbleCaptureVisualSecondsWave17 ?? null,
          releasedSeconds: t.sourceKittenReleaseSecondsWave17 ?? 0 };
      };
      window.captureNpcSnapshot = snapshot;
      const prepare = engine => {
        if (f.prepared) return; f.prepared = true; f.engine = engine;
        if (mode === 'Tactics') {
          if (side === 'enemy') {
            const previous = engine.heroes[0];
            engine.heroes[0] = { ...npc, battleId: previous.battleId.replace(placeholder.id, npc.id),
              runtimeId: `tactics-player-${npc.id}`, currentHp: npc.hp, maxHp: npc.hp,
              stats: { ...npc.stats }, x: 0, y: 0, gridX: previous.gridX, gridY: previous.gridY,
              surfaceId: previous.surfaceId, state: 'idle', stateTimer: 0, cooldown: 0, specialCharge: 0,
              facing: 1, statusEffects: { infected: 0, glitched: 0, radiated: 0 }, archetypeSynergiesPrepared: true };
          }
          f.actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
          f.target = side === 'player' ? engine.enemies[0] : engine.heroes[0];
          for (const [body, x] of [[f.actor, side === 'player' ? 0 : 1], [f.target, side === 'player' ? 1 : 0]]) {
            const support = engine.terrain.surfaces.find(surface => surface.x === x && surface.y === 4 && surface.z === 0);
            if (!support) throw new Error('Initial fixture ground support absent');
            Object.assign(body, { gridX: support.x, gridY: support.y, gridZ: support.z, surfaceId: support.id });
          }
          engine.syncActorsToCamera(); engine.rebuildTurnQueue();
        } else {
          f.actor = engine.getActive(side === 'player' ? 'player' : 'cpu');
          f.target = engine.getActive(side === 'player' ? 'cpu' : 'player');
          const facing = side === 'player' ? 1 : -1;
          Object.assign(f.actor, { x: engine.width / 2 - facing * 75, y: engine.groundY, vx: 0, vy: 0, facing });
          Object.assign(f.target, { x: engine.width / 2 + facing * 75, y: engine.groundY, vx: 0, vy: 0, facing: -facing });
        }
        f.initial = snapshot();
        f.events.push({ kind: 'initial-canonical-fixture', snapshot: f.initial });
      };
      const originalUpdate = Engine.prototype.update;
      Engine.prototype.update = function (...args) {
        prepare(this);
        const result = originalUpdate.apply(this, args);
        if (f.target?.sourceBubbleCaptureWave17?.active && !f.captureEntered) {
          f.captureEntered = snapshot(); f.events.push({ kind: 'capture-state-entered', snapshot: f.captureEntered });
        }
        if (f.captureEntered && !f.target?.sourceBubbleCaptureWave17?.active && !f.releaseEntered) {
          f.releaseEntered = snapshot(); f.events.push({ kind: 'capture-state-released', snapshot: f.releaseEntered });
        }
        return result;
      };
      if (mode === 'Tactics') {
        const originalStart = Engine.prototype.startTurn;
        Engine.prototype.startTurn = function (...args) { prepare(this); return originalStart.apply(this, args); };
      }
      const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
        const result = originalDrawImage.call(this, image, ...args);
        const label = this.canvas.getAttribute('aria-label') || '';
        const sheet = image?.currentSrc || image?.src || '';
        if (sheet.endsWith(asset.sheet) && /Plateau tactique|Arene de combat/.test(label) && args.length === 8) {
          const [sx, sy, sw, sh, dx, dy, dw, dh] = args, row = Math.round(sy / asset.frameHeight), col = Math.round(sx / asset.frameWidth);
          const phase = Object.entries(asset.phases).find(([, value]) => value.row === row)?.[0];
          const draw = { row, col, phase, sx, sy, sw, sh, dx, dy, dw, dh, transform: [...this.getTransform().toFloat64Array()] };
          f.draws.push(draw); f.draws = f.draws.slice(-5000);
          if (phase === 'captured' && !f.autoCapturePaused) {
            f.autoCapturePaused = true; f.events.push({ kind: 'observer-pause-after-native-captured-draw', draw, snapshot: snapshot() });
            queueMicrotask(() => window.captureNpcPause(true));
          } else if (phase === 'released' && f.autoCapturePaused && !f.autoReleasePaused) {
            f.autoReleasePaused = true; f.events.push({ kind: 'observer-pause-after-native-released-draw', draw, snapshot: snapshot() });
            queueMicrotask(() => window.captureNpcPause(true));
          }
        }
        return result;
      };
      const host = document.body.appendChild(document.createElement('div'));
      document.getElementById('root').style.display = 'none';
      const players = side === 'player' ? mode === 'Tactics' ? [waffle, cyan] : [waffle] : mode === 'Fighter' ? [npc] : [placeholder];
      const enemies = side === 'player' ? [npc] : mode === 'Tactics' ? [waffle, cyan] : [waffle];
      const props = mode === 'Tactics' ? {
        lang: 'fr', playerProfile: { name: 'Capture NPC W17' }, activeTeam: players.map(hero => hero.id),
        stage: { id: 771104, universe: 'Tail Concerto', name: 'Capture non létale · vrai chaton', mode: 'Tactics', difficulty: 'Training',
          tacticsBattlefieldId: 'nexus_skybridge', disableItems: true, disableHazards: true,
          customBattle: { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: enemies, bosses: [], customRoster: enemies } } },
        heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [],
        hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true
      } : {
        lang: 'fr', heroes: [waffle, npc], unlockedHeroes: [waffle.id, npc.id], activeTeam: players.map(hero => hero.id),
        customConfig: { autoStart: true, playerTeamIds: players.map(hero => hero.id), opponentTeamIds: enemies.map(hero => hero.id),
          opponentControl: 'p2', roundsToWin: 2, cosmetics: {} },
        heroLevels: {}, fighterCareer: {}, portalCollection: {}, hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true
      };
      function Session() {
        const [paused, setPaused] = React.useState(false);
        window.captureNpcPause = setPaused;
        return React.createElement(React.Fragment, null,
          React.createElement('button', { type: 'button', id: 'npc-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre la capture NPC' : 'Pause de la capture NPC'),
          React.createElement(Component, { ...props, sessionPaused: paused }));
      }
      window.captureNpcRoot = createRoot(host); window.captureNpcRoot.render(React.createElement(Session));
      return { mode, side, component: componentPath, npcAsset: f.decodedNpc, nativeWaffle: f.nativeWaffle, waffleBaseSheet: f.waffleBaseSheet };
    }, { mode, side });
    await page.waitForFunction(() => window.captureNpcFixture?.prepared === true);
    const canvas = mode === 'Tactics' ? page.getByLabel(/^Plateau tactique/) : page.getByLabel('Arene de combat A.R.C.A. jouable', { exact: true });
    await canvas.waitFor();
    await page.waitForFunction(() => new Set(window.captureNpcFixture.draws.filter(draw => draw.phase === 'idle').map(draw => draw.col)).size === 4);
    if (mode === 'Fighter') {
      await page.waitForFunction(() => window.captureNpcFixture.engine.countdown <= 0);
      await page.waitForFunction(() => new Set(window.captureNpcFixture.draws.filter(draw => draw.phase === 'run').map(draw => draw.col)).size === 4);
    } else {
      for (let skipped = 0; skipped < 4; skipped++) {
        if (await page.evaluate(() => window.captureNpcFixture.engine.activeUnit === window.captureNpcFixture.actor)) break;
        await page.waitForFunction(() => window.captureNpcFixture.engine.actionPhase !== 'end');
        await page.getByRole('button', { name: /FINIR LE TOUR/ }).click();
        await page.waitForFunction(() => window.captureNpcFixture.engine.actionPhase !== 'end');
      }
      assert.equal(await page.evaluate(() => window.captureNpcFixture.engine.activeUnit === window.captureNpcFixture.actor), true, 'The real turn queue must reach Waffle');
    }
    await capture(`${caseId}-before`);
    if (mode === 'Tactics') {
      await page.getByRole('button', { name: /Bulle d’arrestation du Police Robo/ }).click();
      const point = await page.evaluate(() => { const f = window.captureNpcFixture; return f.engine.gridToScreen(f.target.gridX, f.target.gridY, true, f.target.surfaceId); });
      const rect = await canvas.boundingBox(), dimensions = await canvas.evaluate(node => ({ width: node.width, height: node.height }));
      await canvas.click({ position: { x: point.x * rect.width / dimensions.width, y: point.y * rect.height / dimensions.height } });
      await page.keyboard.press('Enter');
    } else await page.keyboard.press(side === 'player' ? 'f' : 'p');
    await page.waitForFunction(() => window.captureNpcFixture.autoCapturePaused && window.captureNpcFixture.target.sourceBubbleCaptureWave17?.active, { timeout: 15000 });
    await page.getByRole('button', { name: 'Reprendre la capture NPC', exact: true }).waitFor();
    const captured = await page.evaluate(() => window.captureNpcSnapshot());
    assert.equal(captured.sourceEnemyId, 'tail_concerto_red_vest_kitten');
    assert.equal(captured.capture.nonlethal, true); assert.equal(captured.capture.lift, 0);
    assert.equal(captured.capture.changesFaction, false); assert.equal(captured.capture.inputProxy, null);
    const initial = await page.evaluate(() => window.captureNpcFixture.initial);
    assert.equal(captured.currentHp, initial.currentHp); assert.equal(captured.y, initial.y);
    assert.equal(captured.inHeroes, initial.inHeroes); assert.equal(captured.inEnemies, initial.inEnemies);
    await capture(`${caseId}-captured`);
    await page.waitForTimeout(180);
    assert.deepEqual(await page.evaluate(() => window.captureNpcSnapshot()), captured, 'Observer hold must not advance capture');
    await page.getByRole('button', { name: 'Reprendre la capture NPC', exact: true }).click();
    await page.waitForFunction(() => new Set(window.captureNpcFixture.draws.filter(draw => draw.phase === 'captured').map(draw => draw.col)).size === 4);
    // A real user pause, separately recorded from the observer breakpoints.
    await page.getByRole('button', { name: 'Pause de la capture NPC', exact: true }).click();
    const userPause = await page.evaluate(() => window.captureNpcSnapshot());
    await page.waitForTimeout(200);
    assert.deepEqual(await page.evaluate(() => window.captureNpcSnapshot()), userPause, 'User pause must preserve simulation capture state');
    await page.getByRole('button', { name: 'Reprendre la capture NPC', exact: true }).click();
    if (mode === 'Tactics') {
      await page.waitForFunction(() => window.captureNpcFixture.engine.activeUnit?.id === 'tail_concerto_cyan' && window.captureNpcFixture.engine.actionPhase === 'move');
      await page.getByRole('button', { name: /FINIR LE TOUR/ }).click();
    }
    await page.waitForFunction(() => window.captureNpcFixture.autoReleasePaused && !window.captureNpcFixture.target.sourceBubbleCaptureWave17?.active);
    await page.getByRole('button', { name: 'Reprendre la capture NPC', exact: true }).waitFor();
    const released = await page.evaluate(() => window.captureNpcSnapshot());
    assert.equal(released.currentHp, initial.currentHp); assert.equal(released.y, initial.y);
    assert.equal(released.inHeroes, initial.inHeroes); assert.equal(released.inEnemies, initial.inEnemies);
    assert.equal(released.capture.endedBy, mode === 'Tactics' ? 'target-turn-consumed' : 'expired');
    await capture(`${caseId}-released`);
    await page.getByRole('button', { name: 'Reprendre la capture NPC', exact: true }).click();
    await page.waitForFunction(() => new Set(window.captureNpcFixture.draws.filter(draw => draw.phase === 'released').map(draw => draw.col)).size === 4);
    const observed = await page.evaluate(() => {
      const f = window.captureNpcFixture;
      return { initial: f.initial, current: window.captureNpcSnapshot(), events: f.events,
        phases: Object.fromEntries(Object.keys(f.asset.phases).map(phase => [phase, [...new Set(f.draws.filter(draw => draw.phase === phase).map(draw => draw.col))].sort()])),
        draws: f.draws, actorId: f.actor.sourceHeroId || f.actor.id, targetName: f.target.name };
    });
    rows.push({ ...mounted, caseId, passed: true, actualInterface: mode === 'Tactics' ? 'GameCanvas' : 'FighterMode',
      actualCommand: mode === 'Tactics' ? 'French ability button + actual projected canvas click + Enter' : side === 'player' ? 'FighterMode key F' : 'FighterMode key P',
      captured, userPause, released, ...observed, noHpDamage: true, noLift: true, storedTeamsUnchanged: true,
      actualNativeCellsObserved: Object.values(observed.phases).reduce((sum, cols) => sum + cols.length, 0),
      newWaffleArtworkClaimed: !!mounted.nativeWaffle?.sheet.includes('wave17'), source1to1Verified: false });
    console.log(JSON.stringify({ caseId, passed: true, phases: observed.phases }));
    await page.close(); page = null;
  }
  assert.equal(rows.length, 4); assert.deepEqual(pageErrors, []); assert.deepEqual(httpErrors, []);
} catch (error) {
  failure = error.stack || String(error);
  if (page) { try { await capture('failure'); await writeJson(`${attempt}/failure-state.json`, await page.evaluate(() => ({ fixture: window.captureNpcFixture ? { mode: window.captureNpcFixture.mode, side: window.captureNpcFixture.side, prepared: window.captureNpcFixture.prepared, events: window.captureNpcFixture.events, draws: window.captureNpcFixture.draws.slice(-30), target: window.captureNpcFixture.target, actor: window.captureNpcFixture.actor, phase: window.captureNpcFixture.engine?.actionPhase } : null, text: document.body.innerText }))); } catch {} }
} finally { await browser.close(); browserClosedAt = new Date().toISOString(); }
let integrity;
try { integrity = await finishPresentationIntegrity(before, options); } catch (error) { failure ||= error.stack || String(error); }
await writeJson(`${attempt}/inputs-after.json`, integrity?.after || null);
const artifacts = await hashPresentationArtifacts([...captures, `${attempt}/harness.mjs`, `${attempt}/inputs-before.json`, `${attempt}/inputs-after.json`]);
const report = { passed: !failure, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(),
  allBrowserWindowsClosed: true, actualGameCanvasFlows: rows.filter(row => row.mode === 'Tactics').length,
  actualFighterModeFlows: rows.filter(row => row.mode === 'Fighter').length, rows, captures, artifacts,
  pageErrors, consoleErrors, httpErrors, failedRequests, harness, harnessSha256: sha(await readBytes(harness)),
  productionInputsStableDuringRun: integrity?.stable ?? false, sourceHashesBefore: before.hashes, sourceHashesAfter: integrity?.after.hashes || {},
  productionFreezePath: before.productionFreezePath, productionFreezeSha256: before.productionFreezeSha256,
  runtimeOrigin: baseUrl, failure, source1to1Verified: false };
await writeJson(`${attempt}/result.json`, report);
if (!preliminary && !failure) await writeJson(`${directory}/tactics-fighter-final-result.json`, report);
console.log(JSON.stringify({ passed: report.passed, preliminary, attempt, gameCanvas: report.actualGameCanvasFlows, fighterMode: report.actualFighterModeFlows, failure }));
if (failure) process.exitCode = 1;
