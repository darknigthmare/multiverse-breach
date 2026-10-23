import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const pageErrors = [], consoleErrors = [], failedRequests = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('console', e => { if (e.type() === 'error') consoleErrors.push(e.text()); });
page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
try {
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default;
    const dom = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { createRoot } = dom.default || dom;
    const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const engineUrl = source.match(/from "(\/src\/game\/engineSmash\.js[^"]*)"/)[1];
    const { EngineSmash } = await import(engineUrl);
    const { default: GameCanvas } = await import('/src/components/GameCanvas.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const originalUpdate = EngineSmash.prototype.update;
    window.movementTrace = { updates: [], draws: [], phase: 'warmup', engineUrl };
    EngineSmash.prototype.update = function (...args) {
      if (!this.browserPrepared) {
        this.browserPrepared = true;
        this.platforms = [{ x1: 0, x2: this.width, y: this.groundY, type: 'ground' }];
        const h = this.heroes[0], e = this.enemies[0];
        Object.assign(h, { x: 200, y: this.groundY, vx: 0, vy: 0, facing: 1 });
        Object.assign(e, { x: this.width - 70, y: this.groundY, vx: 0, vy: 0, facing: -1, maxHp: 100000, currentHp: 100000 });
        window.browserSmash = this;
      }
      if (window.movementTrace.freeze) return;
      const result = originalUpdate.apply(this, args);
      const h = this.heroes[0], t = window.movementTrace;
      t.updates.push({ phase: t.phase, state: h.state, elapsed: h.stateElapsed, x: h.x, y: h.y, vx: h.vx, vy: h.vy, facing: h.facing, time: performance.now() });
      return result;
    };
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      const src = args[0]?.src || '';
      if (args.length === 9 && /melee-arthur-wave11\/arthur-(motion-a|motion-b|defense)\.png/.test(src) && window.browserSmash) {
        const h = window.browserSmash.heroes[0], t = window.movementTrace;
        t.draws.push({ phase: t.phase, state: h.state, elapsed: h.stateElapsed, col: args[1] / 256, row: args[2] / 256, sheet: src.split('/').at(-1), vx: h.vx, facing: h.facing });
      }
      return draw.apply(this, args);
    };
    const opponent = HEROES_DB.find(h => h.id === 'cloud_ff7');
    const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [opponent], bosses: [], customRoster: [opponent] } };
    const stage = { id: 770012, name: 'Arthur wave11 movement check', universe: 'Kaamelott', mode: 'Smash', difficulty: 'Training', skipPreMatchInTraining: true, disableItems: true, disableHazards: true, customBattle };
    document.getElementById('root').style.display = 'none';
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    const stableProps = { lang: 'fr', playerProfile: { name: 'Ancre' }, activeTeam: ['arthur_kaamelott'], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
    window.setBrowserPaused = paused => window.browserRoot.render(React.createElement(GameCanvas, { ...stableProps, sessionPaused: paused }));
    window.setBrowserPaused(false);
  });
  await page.waitForFunction(() => window.browserSmash?.heroes[0].state === 'idle', { timeout: 15000 });
  await page.waitForTimeout(700);
  await page.evaluate(() => { window.movementTrace.phase = 'jump'; });
  await page.keyboard.down('d');
  await page.keyboard.down('Space');
  await page.waitForTimeout(80);
  await page.keyboard.up('Space');
  await page.waitForFunction(() => window.movementTrace.updates.some(x => x.phase === 'jump' && x.state === 'land') && window.browserSmash.heroes[0].state === 'run', { timeout: 10000 });
  await page.evaluate(() => { window.movementTrace.phase = 'turn'; });
  await page.keyboard.up('d');
  await page.keyboard.down('q');
  await page.waitForFunction(() => window.movementTrace.updates.some(x => x.phase === 'turn' && x.state === 'turn') && window.browserSmash.heroes[0].state === 'run', { timeout: 5000 });
  await page.keyboard.up('q');
  await page.screenshot({ path: 'docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement.png', fullPage: true });
  await page.evaluate(() => { window.beforePauseEngine = window.browserSmash; window.setBrowserPaused(true); });
  await page.waitForTimeout(100);
  const pauseBefore = await page.evaluate(() => { const h = window.browserSmash.heroes[0]; return { state: h.state, stateElapsed: h.stateElapsed, x: h.x, y: h.y, vx: h.vx, vy: h.vy, hp: h.currentHp }; });
  const pauseEngine = await page.evaluate(() => window.browserSmash === window.beforePauseEngine);
  await page.waitForTimeout(300);
  const pauseAfter = await page.evaluate(() => { const h = window.browserSmash.heroes[0]; return { state: h.state, stateElapsed: h.stateElapsed, x: h.x, y: h.y, vx: h.vx, vy: h.vy, hp: h.currentHp }; });
  assert.deepEqual(pauseAfter, pauseBefore, 'sessionPaused preserves actor state and physics through rendering');
  assert.equal(pauseEngine, true);
  await page.screenshot({ path: 'docs/combat-fidelity-wave11-2026-10-23/browser/arthur-pause.png', fullPage: true });
  const pause = { mechanism: 'GameCanvas real sessionPaused prop through root.render; stable stage/team props and engine instance', before: pauseBefore, after: pauseAfter, durationMs: 300, unchanged: true };
  const trace = await page.evaluate(() => window.movementTrace);
  const states = ['jumpRise', 'fall', 'land', 'turn'];
  const summary = Object.fromEntries(states.map(state => {
    const updates = trace.updates.filter(x => x.state === state && x.phase !== 'warmup');
    const draws = trace.draws.filter(x => x.state === state && x.phase !== 'warmup');
    return [state, { updates: updates.length, draws: draws.length, elapsed: updates.map(x => x.elapsed), columns: [...new Set(draws.map(x => x.col))].sort(), velocities: [...new Set(updates.map(x => x.vx))], facings: [...new Set(updates.map(x => x.facing))] }];
  }));
  const report = { flow: 'Real GameCanvas Smash: keyboard D+Space, hold D through landing, switch to Q', engineUrl: trace.engineUrl, summary, pause, pageErrors, consoleErrors, failedRequests, screenshot: 'docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement.png' };
  await fs.writeFile('docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement-result.json', JSON.stringify(report, null, 2));
  await fs.writeFile('docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement-trace.json', JSON.stringify(trace, null, 2));
  for (const state of ['jumpRise', 'fall']) { assert.deepEqual(summary[state].columns, [0, 1, 2, 3], `${state} draws four poses`); assert.ok(Math.max(...summary[state].elapsed) > 0.05, `${state} clock advances`); }
  for (const state of ['land', 'turn']) assert.deepEqual(summary[state].columns, [0, 1, 2, 3], `${state} draws four poses`);
  assert.ok(summary.land.velocities.every(v => v > 0), 'movement remains active during landing');
  assert.ok(summary.turn.velocities.every(v => v < 0), 'movement remains active during turn');
  assert.ok(summary.turn.facings.every(f => f === -1), 'facing updates immediately during turn');
  assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(r => r.url.startsWith('https://fonts.googleapis.com/') && r.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  await fs.writeFile('docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement-result.json', JSON.stringify({ passed: true, ...report }, null, 2));
  console.log(JSON.stringify({ passed: true, ...report }));
  await page.evaluate(() => window.browserRoot.unmount());
} catch (error) {
  const debug = await page.evaluate(() => ({ body: document.body.innerText.slice(-2000), prepared: !!window.browserSmash, state: window.browserSmash?.heroes[0]?.state, trace: window.movementTrace })).catch(() => null);
  await fs.writeFile('docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement-failure.json', JSON.stringify({ error: error.message, pageErrors, consoleErrors, failedRequests, debug }, null, 2));
  await page.screenshot({ path: 'docs/combat-fidelity-wave11-2026-10-23/browser/arthur-movement-failure.png', fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
