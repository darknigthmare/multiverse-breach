import { beginBrowserReceipt, closeBrowserWithReceipt } from './senua-browser-receipt.mjs';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const outputBase = process.env.SENUA_BROWSER_OUTPUT || 'docs/combat-fidelity-wave16-2026-10-28/senua-sources/browser';
await fs.mkdir(outputBase, { recursive: true });
const receipt = await beginBrowserReceipt(import.meta.url);
let observedReport = null;
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
      t.updates.push({ phase: t.phase, state: h.state, elapsed: h.stateElapsed, x: h.x, y: h.y, vx: h.vx, vy: h.vy, facing: h.facing, enemyHp: this.enemies[0].currentHp, time: performance.now() });
      return result;
    };
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      const src = args[0]?.src || '';
      if (args.length === 9 && /senua-melee-wave16\/senua-[^/]+\.png/.test(src) && window.browserSmash) {
        const h = window.browserSmash.heroes[0], t = window.movementTrace;
        t.draws.push({ phase: t.phase, state: h.state, elapsed: h.stateElapsed, col: args[1] / 256, row: args[2] / 256, sheet: src.split('/').at(-1), vx: h.vx, facing: h.facing });
      }
      return draw.apply(this, args);
    };
    const opponent = HEROES_DB.find(h => h.id === 'cloud_ff7');
    const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [opponent], bosses: [], customRoster: [opponent] } };
    const stage = { id: 770013, name: 'Senua wave16 movement check', universe: 'Hellblade: Senua’s Sacrifice', mode: 'Smash', difficulty: 'Training', skipPreMatchInTraining: true, disableItems: true, disableHazards: true, customBattle };
    document.getElementById('root').style.display = 'none';
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    const stableProps = { lang: 'fr', playerProfile: { name: 'Ancre' }, activeTeam: ['hellblade_senua'], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
    window.setBrowserPaused = paused => window.browserRoot.render(React.createElement(GameCanvas, { ...stableProps, sessionPaused: paused }));
    window.setBrowserPaused(false);
  });
  await page.waitForFunction(()=>window.browserSmash?.heroes[0].state==='idle');
  await page.evaluate(()=>{window.movementTrace.phase='keyboard';});

  await page.keyboard.down('i'); await page.waitForTimeout(900);
  await page.waitForFunction(()=>window.browserSmash.heroes[0].state==='shieldHold');
  await page.keyboard.up('i');
  await page.waitForFunction(()=>window.movementTrace.updates.some(s=>s.state==='shieldExit')&&window.browserSmash.heroes[0].state==='idle');
  const trace=await page.evaluate(()=>window.movementTrace);
  const summary={keyboard:'KeyI',states:{}};
  for(const state of ['shieldEnter','shieldHold','shieldExit']){const draws=trace.draws.filter(s=>s.state===state);summary.states[state]={draws:draws.length,columns:[...new Set(draws.map(s=>s.col))].sort()};assert.ok(draws.length>0);}
  assert.deepEqual(summary.states.shieldHold.columns,[0,1,2,3]);assert.ok(trace.updates.every(s=>s.enemyHp===100000));
  assert.deepEqual(pageErrors,[]);
  await page.screenshot({path:outputBase+'/senua-guard.png',fullPage:true});
  await fs.writeFile(outputBase+'/senua-guard-trace.json',JSON.stringify(trace,null,2));
  observedReport={passed:true,keyboard:true,summary,pageErrors,consoleErrors,failedRequests,screenshot:outputBase+'/senua-guard.png'};
  await page.evaluate(()=>window.browserRoot.unmount());
}catch(error){await fs.writeFile(outputBase+'/senua-guard-failure.json',JSON.stringify({error:error.message,pageErrors},null,2));throw error;}finally{await closeBrowserWithReceipt(browser,receipt,observedReport,outputBase+'/senua-guard-result.json',Boolean(process.env.SENUA_BROWSER_OUTPUT));}
