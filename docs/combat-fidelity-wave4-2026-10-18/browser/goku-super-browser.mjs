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
    const opponent = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
    const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [opponent], bosses: [], customRoster: [opponent] } };
    const stage = { id: 770008, name: 'Goku Kamehameha check', universe: 'Dragon Ball Z', mode: 'Smash', difficulty: 'Training', skipPreMatchInTraining: true, disableItems: true, disableHazards: true, customBattle };
    document.getElementById('root').style.display = 'none';
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    window.browserRoot.render(React.createElement(GameCanvas, { lang: 'fr', playerProfile: { name: 'Ancre' }, activeTeam: ['goku_dbz'], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true }));
  });
  const gauge = page.getByRole('progressbar', { name: 'Super Kamehameha' });
  await gauge.waitFor({ timeout: 15000 });
  await page.waitForFunction(() => window.browserSmash?.heroes[0].specialCharge === 100);
  assert.equal(await gauge.getAttribute('value'), '100');
  await page.waitForTimeout(150);
  await page.keyboard.down('l');
  await page.waitForTimeout(80);
  await page.keyboard.up('l');
  await page.waitForFunction(() => !!window.browserSmash?.browserImpact, { timeout: 10000 });
  const impact = await page.evaluate(() => ({ start: window.browserSmash.browserCast, hit: window.browserSmash.browserImpact, gameOver: window.browserSmash.gameOver }));
  assert.equal(impact.start.name, 'Kamehameha');
  assert.equal(impact.start.charge, 0);
  assert.equal(impact.start.hp, 100000);
  assert.ok(impact.start.elapsed < impact.start.hitAt);
  assert.ok(impact.hit.elapsed >= impact.hit.hitAt);
  assert.ok(impact.hit.hp < impact.start.hp);
  assert.equal(impact.hit.charge, 0);
  assert.equal(impact.gameOver, false);
  await page.waitForFunction(() => document.querySelector('progress[aria-label="Super Kamehameha"]')?.value === 0);
  await page.screenshot({ path: '/tmp/goku-wave4-super.png', fullPage: true });
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
  assert.equal(final.profile, 'Kamehameha');
  assert.equal(final.hitCount, 1);
  assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length, 'any console error must be accounted for by the blocked font request');
  await page.evaluate(() => window.browserRoot.unmount());
  const trace = await page.evaluate(() => window.browserSmash.browserSuperTrace);
  await fs.writeFile('/tmp/goku-wave4-super-trace.json', JSON.stringify(trace, null, 2));
  const engineUrl = await page.evaluate(() => window.browserEngineURL);
  const report = { engineUrl, flow: 'GameCanvas Smash → Goku DBZ → panneau Kamehameha 100 % → clavier L → startup sans dégât → impact après hitAt → charge 0 % → aucun second impact', impact, sameInput, final, pageErrors, consoleErrors, failedRequests, screenshot: '/tmp/goku-wave4-super.png' };
  await fs.writeFile('/tmp/goku-wave4-super-result.json', JSON.stringify({ passed: true, ...report }, null, 2));
  console.log(JSON.stringify({ passed: true, ...report }));
} finally {
  await browser.close();
}
