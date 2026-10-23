import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const pageErrors = [];
const consoleErrors = [];
const failedRequests = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
try {
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const reactModule = await import('/node_modules/.vite/deps/react.js');
    const React = reactModule.default || reactModule;
    const domModule = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { createRoot } = domModule.default || domModule;
    const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const smashUrl = source.match(/from "(\/src\/game\/engineSmash\.js[^"]*)"/)[1];
    const { EngineSmash } = await import(smashUrl);
    window.browserEngineURL = smashUrl;
    const { default: GameCanvas } = await import('/src/components/GameCanvas.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const originalUpdate = EngineSmash.prototype.update;
    EngineSmash.prototype.update = function (...args) {
      if (!this.browserPrepared) {
        this.browserPrepared = true;
        const hero = this.heroes[0];
        const enemy = this.enemies[0];
        hero.specialCharge = 100;
        hero.x = 260; hero.y = this.groundY; hero.vx = 0; hero.vy = 0; hero.facing = 1;
        enemy.maxHp = 100000; enemy.currentHp = 100000;
        enemy.x = 340; enemy.y = this.groundY; enemy.vx = 0; enemy.vy = 0; enemy.facing = -1;
        window.browserSmash = this;
        this.browserSuperTrace = []; this.browserSuperHitCount = 0; this.browserPreviousHp = enemy.currentHp;
      }
      if (this.browserFreeze) return;
      const result = originalUpdate.apply(this, args);
      const actor = this.heroes[0];
      const hp = this.enemies[0].currentHp;
      if (hp < this.browserPreviousHp) this.browserSuperHitCount++;
      this.browserPreviousHp = hp;
      this.browserSuperTrace.push({ state: actor.state, elapsed: actor.action?.elapsed ?? null, hitAt: actor.action?.hitAt ?? null, charge: actor.specialCharge, hp, hitApplied: actor.action?.hitApplied ?? false });
      if (actor.action?.id === 'super') {
        this.browserCast ??= { name: actor.action.superProfile.name, charge: actor.specialCharge, hp: this.enemies[0].currentHp, elapsed: actor.action.elapsed, hitAt: actor.action.hitAt };
        if (actor.action.hitApplied && !this.browserImpact) {
          this.browserImpact = { name: actor.action.superProfile.name, charge: actor.specialCharge, hp: this.enemies[0].currentHp, elapsed: actor.action.elapsed, hitAt: actor.action.hitAt };
          this.browserFreeze = true;
        }
      }
      return result;
    };
    window.browserSuperDraws = [];
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
      const hero = window.browserSmash?.heroes[0];
      if (args.length === 8 && hero?.action?.id === 'super' && /(?:combat-character-animations-wave10\/freeman|melee-freeman-wave10\/freeman-[^/]+)\.png/.test(image?.src || '')) {
        window.browserSuperDraws.push({sheet: new URL(image.src).pathname,row: args[1]/256,column: args[0]/256,sourceRect: args.slice(0,4),elapsed:hero.action.elapsed,hitAt:hero.action.hitAt,phase:hero.presentationPhase || null,actionId:hero.action.id,state:hero.state,imageComplete:image.complete,naturalWidth:image.naturalWidth});
      }
      return originalDrawImage.call(this,image,...args);
    };
    const opponent = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
    const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [opponent], bosses: [], customRoster: [opponent] } };
    const stage = { id: 770013, name: 'Freeman Pistolet antigravité surchargé check', universe: 'Half-Life', mode: 'Smash', difficulty: 'Training', skipPreMatchInTraining: true, disableItems: true, disableHazards: true, customBattle };
    document.getElementById('root').style.display = 'none';
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    window.browserRoot.render(React.createElement(GameCanvas, { lang: 'fr', playerProfile: { name: 'Ancre' }, activeTeam: ['freeman'], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true }));
  });
  const gauge = page.getByRole('progressbar', { name: 'Super Pistolet antigravité surchargé' });
  await gauge.waitFor({ timeout: 15000 });
  await page.waitForFunction(() => window.browserSmash?.heroes[0].specialCharge === 100);
  assert.equal(await gauge.getAttribute('value'), '100');
  await page.waitForTimeout(150);
  await page.keyboard.down('l');
  await page.waitForTimeout(80);
  await page.keyboard.up('l');
  await page.waitForFunction(() => !!window.browserSmash?.browserImpact, { timeout: 10000 });
  const impact = await page.evaluate(() => ({ start: window.browserSmash.browserCast, hit: window.browserSmash.browserImpact, gameOver: window.browserSmash.gameOver }));
  assert.equal(impact.start.name, 'Pistolet antigravité surchargé');
  assert.equal(impact.start.charge, 0);
  assert.equal(impact.start.hp, 100000);
  assert.ok(impact.start.elapsed < impact.start.hitAt);
  assert.ok(impact.hit.elapsed >= impact.hit.hitAt);
  assert.ok(impact.hit.hp < impact.start.hp);
  assert.equal(impact.hit.charge, 0);
  assert.equal(impact.gameOver, false);
  await page.waitForFunction(() => document.querySelector('progress[aria-label="Super Pistolet antigravité surchargé"]')?.value === 0);
  await page.screenshot({ path: 'docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super.png', fullPage: true });
  const sameInput = await page.evaluate(() => {
    const engine = window.browserSmash;
    const before = engine.enemies[0].currentHp;
    const retriggered = engine.triggerMeleeAction('player', 'Special');
    engine.browserFreeze = false;
    return { before, retriggered, charge: engine.heroes[0].specialCharge };
  });
  assert.equal(sameInput.retriggered, false);
  assert.equal(sameInput.charge, 0);
  await page.waitForFunction(() => !window.browserSmash.heroes[0].action && !window.browserSmash.heroes[0].meleeRecoveryTimer);
  await page.waitForTimeout(300);
  const final = await page.evaluate(() => ({ hitCount: window.browserSmash.browserSuperHitCount, hp: window.browserSmash.enemies[0].currentHp, charge: window.browserSmash.heroes[0].specialCharge, action: window.browserSmash.heroes[0].action, profile: window.browserSmash.getMeleeSuper().name }));
  assert.equal(final.hp, impact.hit.hp);
  assert.equal(final.charge, 0);
  assert.equal(final.action, null);
  assert.equal(final.profile, 'Pistolet antigravité surchargé');
  assert.equal(final.hitCount, 1);
  assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length, 'any console error must be accounted for by the blocked font request');
  await page.evaluate(() => window.browserRoot.unmount());
  const trace = await page.evaluate(() => window.browserSmash.browserSuperTrace);
  await fs.writeFile('docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super-trace.json', JSON.stringify(trace, null, 2));
  assert.ok(trace.filter(step => step.elapsed !== null && step.elapsed < step.hitAt).every(step => step.hp === 100000), 'no damage before hitAt anywhere in startup');
  const actualDraws = await page.evaluate(() => window.browserSuperDraws);
  const sourceDraws = {count:actualDraws.length,sheets:[...new Set(actualDraws.map(frame=>frame.sheet))],rows:[...new Set(actualDraws.map(frame=>frame.row))],columns:[...new Set(actualDraws.map(frame=>frame.column))].sort()};
  await fs.writeFile('docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super-draws.json',JSON.stringify(actualDraws,null,2));
  assert.deepEqual(sourceDraws.sheets,['/sprites/generated/combat-character-animations-wave10/freeman.png'],'cold boot uses dedicated native Pistolet antigravité surchargé atlas from first super draw');
  assert.deepEqual(sourceDraws.rows,[7]);
  assert.deepEqual(sourceDraws.columns,[0,1,2,3]);
  const engineUrl = await page.evaluate(() => window.browserEngineURL);
  const report = { engineUrl, sourceDraws, coldBoot:'Fresh Chromium process and page; no test preload; only production GameCanvas boot prepares sprites.', flow: 'GameCanvas Smash → Freeman HL2 2004 → panneau Pistolet antigravité surchargé 100 % → clavier L → startup sans dégât → impact après hitAt → charge 0 % → aucun second impact', impact, sameInput, final, pageErrors, consoleErrors, failedRequests, screenshot: 'docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super.png' };
  await fs.writeFile('docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super-result.json', JSON.stringify({ passed: true, ...report }, null, 2));
  console.log(JSON.stringify({ passed: true, ...report }));
} catch (error) {
  const diagnostic = { error: error.message, stack: error.stack, pageErrors, consoleErrors, failedRequests };
  await fs.writeFile('docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super-failure.json', JSON.stringify(diagnostic, null, 2));
  await page.screenshot({ path: 'docs/combat-fidelity-wave10-2026-10-23/browser/freeman-super-failure.png', fullPage: true }).catch(() => {});
  throw error;
} finally {
  await browser.close();
}
