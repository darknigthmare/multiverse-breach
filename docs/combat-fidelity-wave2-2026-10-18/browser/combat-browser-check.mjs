import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const reactModule = await import('/node_modules/.vite/deps/react.js');
    const React = reactModule.default || reactModule;
    const domModule = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { createRoot } = domModule.default || domModule;
    const canvasSource = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rpgUrl = canvasSource.match(/from "(\/src\/game\/engineRpg\.js[^"]*)"/)[1];
    const { EngineRpg } = await import(rpgUrl);
    const { default: GameCanvas } = await import('/src/components/GameCanvas.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const originalUpdate = EngineRpg.prototype.update;
    EngineRpg.prototype.update = function (...args) {
      if (!this.browserCheckPrepared) {
        this.browserCheckPrepared = true;
        this.heroes.forEach(hero => { hero.atb = 100; hero.specialCharge = 100; });
        this.enemies.forEach(enemy => { enemy.atb = -1000; enemy.maxHp = 100000; enemy.currentHp = 100000; });
        window.browserRpg = this;
      }
      return originalUpdate.apply(this, args);
    };
    const opponent = HEROES_DB.find(hero => hero.id === 'tifa_ff7');
    const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: [opponent], bosses: [], customRoster: [opponent] } };
    const stage = { id: 770001, name: 'Midgar reactor', universe: 'Final Fantasy VII', mode: 'RPG', difficulty: 'Training', disableItems: true, customBattle };
    document.getElementById('root').style.display = 'none';
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    window.browserRoot.render(React.createElement(GameCanvas, { lang: 'fr', playerProfile: { name: 'Ancre' }, activeTeam: ['cloud_ff7'], stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true }));
  });
  const summonButton = page.getByRole('button', { name: /INVOCATION.*Ifrit/ });
  await summonButton.waitFor({ timeout: 15000 });
  await summonButton.click();
  assert.equal(await page.getByRole('button', { name: 'Confirmer les cibles' }).count(), 1);
  let state = await page.evaluate(() => ({ atb: window.browserRpg.heroes[0].atb, charge: window.browserRpg.heroes[0].specialCharge, used: window.browserRpg.heroes[0].summonUsed }));
  assert.equal(state.atb, 100);
  assert.equal(state.charge, 100);
  assert.equal(state.used, false);
  await page.getByRole('button', { name: 'Annuler sans coût' }).click();
  await page.keyboard.press('u');
  await page.getByRole('button', { name: 'Confirmer les cibles' }).click();
  await page.waitForFunction(() => window.browserRpg.isSummonSceneActive());
  const early = await page.evaluate(() => {
    const engine = window.browserRpg;
    engine.setPaused(true);
    const before = engine.getSummonSceneState().tick;
    for (let i = 0; i < 20; i++) engine.update();
    const after = engine.getSummonSceneState().tick;
    engine.setPaused(false);
    return { before, after, scene: engine.getSummonSceneState(), charge: engine.heroes[0].specialCharge, atb: engine.heroes[0].atb, used: engine.heroes[0].summonUsed };
  });
  assert.equal(early.before, early.after);
  assert.equal(early.charge, 0);
  assert.equal(early.atb, 0);
  assert.equal(early.used, true);
  await page.evaluate(() => { for (let i = 0; i < 85; i++) window.browserRpg.update(); });
  await page.screenshot({ path: '/tmp/multiverse-ff7-summon.png', fullPage: true });
  const final = await page.evaluate(() => {
    const engine = window.browserRpg;
    for (let i = 0; i < 300; i++) engine.update();
    return { active: engine.isSummonSceneActive(), hp: engine.enemies[0].currentHp, summon: engine.getSummonState(engine.heroes[0]), canSummonAgain: engine.summon(engine.heroes[0]) };
  });
  assert.equal(final.active, false);
  assert.ok(final.hp < 100000);
  assert.equal(final.canSummonAgain, false);
  await page.evaluate(() => window.browserRoot.unmount());
  console.log(JSON.stringify({ flow: 'GameCanvas → bouton invocation → annulation → clavier U → confirmation → scène FF7 → impact → verrou une utilisation', early, final, errors }));
  await page.evaluate(async () => {
    const reactModule = await import('/node_modules/.vite/deps/react.js');
    const React = reactModule.default || reactModule;
    const domModule = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { createRoot } = domModule.default || domModule;
    const fighterSource = await (await fetch('/src/components/FighterMode.jsx')).text();
    const fighterUrl = fighterSource.match(/from "(\/src\/game\/engineFighter\.js[^"]*)"/)[1];
    const { EngineFighter } = await import(fighterUrl);
    const { default: FighterMode } = await import('/src/components/FighterMode.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const originalUpdate = EngineFighter.prototype.update;
    EngineFighter.prototype.update = function (...args) { window.browserFighter = this; return originalUpdate.apply(this, args); };
    window.browserCompletions = [];
    const host = document.body.appendChild(document.createElement('div'));
    window.browserRoot = createRoot(host);
    window.browserRoot.render(React.createElement(FighterMode, { lang: 'fr', heroes: HEROES_DB, unlockedHeroes: ['cloud_ff7', 'tifa_ff7'], activeTeam: ['cloud_ff7'], heroLevels: {}, fighterCareer: {}, portalCollection: {}, hiddenUniverses: [], disabledAssets: {}, customConfig: { autoStart: true, opponentControl: 'p2', playerTeamIds: ['cloud_ff7'], opponentTeamIds: ['tifa_ff7'] }, onMatchComplete: result => window.browserCompletions.push(result), dedicatedSession: true }));
  });
  await page.waitForFunction(() => window.browserFighter?.getSnapshot().phase === 'intro');
  await page.screenshot({ path: '/tmp/multiverse-fighter-intro.png', fullPage: true });
  const firstRound = await page.evaluate(() => {
    const engine = window.browserFighter;
    engine.countdown = 0;
    const target = engine.getActive('cpu'); target.currentHp = 1; target.invulnerable = 0;
    engine.applyHit(engine.getActive('player'), target, { type: 'heavy', base: 999, guardDamage: 20, knockback: 200 });
    for (let i = 0; i < 60; i++) engine.update(1 / 60);
    return { phase: engine.getSnapshot().phase, roundWins: engine.roundWins, finished: engine.finished, completions: window.browserCompletions.length };
  });
  assert.equal(firstRound.phase, 'roundResult');
  assert.equal(firstRound.finished, false);
  assert.equal(firstRound.completions, 0);
  await page.screenshot({ path: '/tmp/multiverse-fighter-round-one.png', fullPage: true });
  const finisher = await page.evaluate(() => {
    const engine = window.browserFighter;
    for (let i = 0; i < 300; i++) engine.update(1 / 60);
    const target = engine.getActive('cpu'); target.currentHp = 1; target.invulnerable = 0;
    engine.applyHit(engine.getActive('player'), target, { type: 'heavy', base: 999, guardDamage: 20, knockback: 200 });
    for (let i = 0; i < 60; i++) engine.update(1 / 60);
    return { phase: engine.getSnapshot().phase, roundWins: engine.roundWins, completions: window.browserCompletions.length };
  });
  assert.equal(finisher.phase, 'fatality');
  assert.equal(finisher.completions, 0);
  await page.screenshot({ path: '/tmp/multiverse-fighter-finisher.png', fullPage: true });
  const complete = await page.evaluate(() => {
    const engine = window.browserFighter;
    for (let i = 0; i < 650; i++) engine.update(1 / 60);
    return { phase: engine.getSnapshot().phase, result: engine.result, completions: window.browserCompletions.length, roundWins: engine.roundWins };
  });
  assert.equal(complete.completions, 1);
  assert.equal(complete.result, 'victory');
  await page.evaluate(() => window.browserRoot.unmount());
  console.log(JSON.stringify({ flow: 'FighterMode → intro → KO manche 1 → victoire/défaite → reprise manche 2 → KO → finale → victoire → outro → résultat unique', firstRound, finisher, complete, errors }));
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
