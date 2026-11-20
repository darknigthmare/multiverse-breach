// Actual Vite/React fixture; no production build or asset copy is performed.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { getContainedCanvasViewport } from '../../../../src/game/combatViewport.js';
const root = fileURLToPath(new URL('../../../../', import.meta.url)), dir = new URL('./', import.meta.url);
const require = createRequire(import.meta.url);
const playwrightModule = process.env.PLAYWRIGHT_MODULE_PATH || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium';
const { chromium } = require(playwrightModule);
const fixturePath = '/docs/assets/p0-p1-p2-continuation-11-2026-11-20/tactics/harness.jsx';
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="${fixturePath}"></script></html>`;
const server = await createServer({ root, configFile: false, plugins: [react(), {
  name: 'ashline-loopback-fixture', configureServer(vite) {
    vite.middlewares.use(async (request, response, next) => {
      if (request.url !== '/') return next();
      response.setHeader('content-type', 'text/html'); response.end(await vite.transformIndexHtml('/', html));
    });
  }
}], cacheDir: path.join(os.tmpdir(), 'pass11-ashline-vite-cache'),
define: { __MULTIVERSE_BUILD__: '{}' },
optimizeDeps: { entries: [fileURLToPath(new URL('harness.jsx', dir))] },
server: { host: '127.0.0.1', port: 0, watch: null, hmr: false }, logLevel: 'error' });
await server.listen();
const url = server.resolvedUrls.local[0];
let browser; const cases = [];
try {
  browser = await chromium.launch({ executablePath: chromiumExecutable, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disk-cache-size=1', '--media-cache-size=1'] });
  for (const width of process.argv.includes('--desktop-only') ? [1280] : [1280, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage(); page.setDefaultTimeout(20000);
    const errors = [], missingAssets = [];
    let plan = null;
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() === 404) missingAssets.push(new URL(response.url()).pathname); });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByRole('tab', { name: 'ARENA' }).click();
      const terrain = page.getByRole('combobox', { name: 'TACTICAL TERRAIN', exact: true });
      assert.equal(await terrain.inputValue(), 'auto');
      await terrain.selectOption('iron_ashline_radio_ridge_tactics');
      await page.getByRole('tab', { name: 'RULES' }).click();
      await page.getByRole('button', { name: /LAUNCH TACTICS/ }).click();
      await page.waitForFunction(() => window.__ashline?.engine?.activeUnit && !window.__ashline.engine.paused);
      assert.equal(await page.evaluate(() => window.__ashline.engine.battlefield.id), 'iron_ashline_radio_ridge_tactics');
      // Local P2 is advanced using the real button; no actor is moved by a fixture setter.
      for (let turn = 0; turn < 5 && await page.evaluate(() => window.__ashline.engine.activeUnitType !== 'hero'); turn++) {
        await page.getByRole('button', { name: /END TURN/ }).click();
        await page.waitForTimeout(250);
      }
      await page.waitForFunction(() => window.__ashline.engine.activeUnitType === 'hero');
      // The standard terrain inspector starts expanded over the western cells.
      // Close it through its real disclosure before sending any canvas pointer.
      await page.locator('.combat-terrain-overlay > summary').click();
      const moves = [];
      for (let turn = 0; turn < 10; turn++) {
        plan = await page.evaluate(() => {
        const e = window.__ashline.engine, a = e.activeUnit, goal = `${e.battlefield.id}:ground:5:5`;
        const route = e.getReachableCells(a, Infinity).find(entry => entry.surfaceId === goal);
        const reachable = new Map(e.movementRange.map(entry => [entry.surfaceId, entry]));
        const target = route.path.slice(1).reverse().map(id => reachable.get(id)).find(Boolean);
        const s = e.verticalTerrain.surface(target.surfaceId), p = e.verticalTerrain.project(s.x + 0.5, s.y + 0.5, s.z);
        return { surfaceId: s.id, cost: target.cost, p, budget: e.movementBudget, before: a.surfaceId };
      });
        const canvas = page.locator('canvas').first(), box = await canvas.boundingBox();
        const dimensions = await canvas.evaluate(el => ({ width: el.width, height: el.height }));
        const painted = getContainedCanvasViewport({ left: box.x, top: box.y, ...box }, dimensions.width, dimensions.height);
        if (!moves.length) {
          await page.mouse.click(painted.left + plan.p.x * painted.scale, painted.top + plan.p.y * painted.scale);
        } else {
          // The western stair tread can be covered by its neighboring face.
          // The existing focused-board cursor reaches the same address without
          // forcing a hidden pixel or changing the engine's selection directly.
          await canvas.focus();
          await page.keyboard.press('ArrowRight');
        }
        await page.waitForFunction(id => window.__ashline.engine.getTerrainViewState().selectedSurfaceId === id, plan.surfaceId);
        await page.keyboard.press('Enter');
        await page.waitForFunction(id => window.__ashline.engine.heroes[0].surfaceId === id && !window.__ashline.engine.heroes[0].terrainMotion, plan.surfaceId);
        assert.equal(await page.evaluate(() => window.__ashline.engine.movementSpent), plan.cost);
        moves.push({ ...plan, input: moves.length ? 'focused canvas ArrowRight then Enter' : 'native canvas click then Enter', arrivedZ: await page.evaluate(() => window.__ashline.engine.heroes[0].gridZ) });
        const serial = await page.evaluate(() => window.__ashline.engine.turnSerial);
        await page.getByRole('button', { name: /END TURN/ }).click();
        await page.waitForFunction(serial => window.__ashline.engine.turnSerial > serial, serial);
        if (plan.surfaceId.endsWith(':ground:5:5')) break;
        await page.getByRole('button', { name: /END TURN/ }).click();
        await page.waitForFunction(() => window.__ashline.engine.activeUnitType === 'hero' && window.__ashline.engine.actionPhase === 'move');
      }
      assert.equal(await page.evaluate(() => window.__ashline.engine.heroes[0].gridZ), -1);
      assert.equal(await page.evaluate(() => window.__ashline.engine.objectiveProgress), 1);
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => window.__ashline.engine.paused);
      const paused = await page.evaluate(() => ({ turn: window.__ashline.engine.turnSerial, ap: window.__ashline.engine.movementSpent, surface: window.__ashline.engine.heroes[0].surfaceId }));
      await page.waitForTimeout(180);
      assert.deepEqual(await page.evaluate(() => ({ turn: window.__ashline.engine.turnSerial, ap: window.__ashline.engine.movementSpent, surface: window.__ashline.engine.heroes[0].surfaceId })), paused);
      await page.locator('#qa-pause').click();
      const capture = `ashline-${width}.jpg`;
      await page.screenshot({ path: fileURLToPath(new URL(capture, dir)), type: 'jpeg', quality: 72, fullPage: true });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.locator('#qa-unmount').click();
      await page.waitForFunction(() => window.__ashline.engine.disposed);
      assert.equal(await page.evaluate(() => window.__ashline.engine.timers.size), 0);
      assert.deepEqual(errors, []);
      cases.push({ width, height: 900, actualLobby: true, automaticShownInLobby: true, automaticLaunched: false,
        launchChoice: 'explicit', realGameCanvas: true,
        canvasMoves: moves, radioTransmissions: 1, pauseStable: true, disposed: true, pageErrors: errors,
        missingCheckoutAssets: [...new Set(missingAssets)], capture, passed: true });
    } catch (error) {
      const diagnostic = await page.evaluate(() => {
        const e = window.__ashline?.engine;
        return { phase: e?.actionPhase, side: e?.activeUnitType, active: e?.activeUnit?.id,
          state: e?.activeUnit?.state, spent: e?.movementSpent, paused: e?.paused,
          surface: e?.heroes[0]?.surfaceId, view: e?.getTerrainViewState(),
          canvas: [...document.querySelectorAll('canvas')].map(c => ({ width: c.width, height: c.height, rect: c.getBoundingClientRect().toJSON() })) };
      }).catch(() => null);
      const attemptDirectory = path.join(os.tmpdir(), 'mvb-pass11-tactics-attempts');
      await fs.mkdir(attemptDirectory, { recursive: true });
      const attempt = path.join(attemptDirectory, `attempt-${Date.now()}-${width}`);
      await fs.writeFile(`${attempt}.json`, JSON.stringify({ error: error.message, plan, diagnostic, errors }, null, 2) + '\n');
      await page.screenshot({ path: `${attempt}.jpg`, type: 'jpeg', quality: 60 }).catch(() => {});
      throw error;
    } finally { await context.close(); }
  }
  await fs.writeFile(new URL('browser.json', dir), JSON.stringify({ passed: true, cases,
    scope: `${cases.length} real custom-lobby/GameCanvas journey(s) with original roster, native canvas click then focused-board arrows + Enter, AP, one radio transmission, pause, disposal. The full six-transmission victory is tested in Node, not claimed as a browser playthrough.`,
    officialSourceFrames: false, source1to1Verified: false }, null, 2) + '\n');
  console.log(JSON.stringify({ passed: true, cases: cases.length }));
} finally { await browser?.close(); await server.close(); }
