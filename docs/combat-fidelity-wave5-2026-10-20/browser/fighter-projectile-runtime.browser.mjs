import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory = path.resolve('docs/combat-fidelity-wave5-2026-10-20/browser');
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
page.setDefaultTimeout(15000);
const pageErrors = [], consoleErrors = [], failedRequests = [], results = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
try {
  await page.goto(process.env.BROWSER_BASE_URL || 'http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  console.log(JSON.stringify({ stage: 'page-loaded' }));
  await page.evaluate(async () => {
    const source = await (await fetch('/src/components/FighterMode.jsx')).text();
    const mainSource = await (await fetch('/src/main.jsx')).text();
    const reactUrl = source.match(/from "(\/node_modules\/\.vite\/deps\/react\.js[^"]*)"/)[1];
    const domUrl = mainSource.match(/from "(\/node_modules\/\.vite\/deps\/react-dom_client\.js[^"]*)"/)[1];
    const reactModule = await import(reactUrl), React = reactModule.default || reactModule;
    const domModule = await import(domUrl), { createRoot } = domModule.default || domModule;
    const engineUrl = source.match(/from "(\/src\/game\/engineFighter\.js[^"]*)"/)[1];
    const { EngineFighter } = await import(engineUrl);
    const { default: FighterMode } = await import('/src/components/FighterMode.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    window.browserFighterEngineUrl = engineUrl;
    document.getElementById('root').style.display = 'none';
    const originalUpdate = EngineFighter.prototype.update;
    EngineFighter.prototype.update = function (...args) {
      const probe = window.fighterProjectileProbe;
      if (!this.browserPrepared) {
        this.browserPrepared = true; this.countdown = 0;
        probe.engine = this;
        const actor = this.getActive(probe.side), target = this.getOpponent(probe.side);
        actor.x = probe.side === 'player' ? 140 : 820; actor.y = this.groundY; actor.vx = 0; actor.vy = 0;
        actor.facing = probe.side === 'player' ? 1 : -1; actor.meter = 100;
        target.x = actor.x + actor.facing * 600; target.y = this.groundY; target.vx = 0; target.vy = 0;
        target.maxHp = 100000; target.currentHp = 100000; target.facing = -actor.facing;
        probe.initialHp = target.currentHp; probe.previousHp = target.currentHp; probe.initialTargetX = target.x;
      }
      const result = originalUpdate.apply(this, args);
      const actor = this.getActive(probe.side), target = this.getOpponent(probe.side);
      if (actor.action?.type === 'super' && !probe.cast) probe.cast = { name: actor.action.identity.name,
        elapsed: actor.action.elapsed, hitAt: actor.action.hitAt, meter: actor.meter, hp: target.currentHp };
      if (target.currentHp < probe.previousHp) {
        probe.hits++;
        probe.collision = { hpBefore: probe.previousHp, hpAfter: target.currentHp,
          impact: this.projectileVisualImpacts.map(impact => ({ x: impact.x, y: impact.y, elapsed: impact.elapsed })),
          elapsed: this.elapsed, actorActionElapsed: actor.action?.elapsed ?? null };
      }
      probe.previousHp = target.currentHp;
      probe.trace.push({ tick: probe.trace.length, elapsed: this.elapsed, actionElapsed: actor.action?.elapsed ?? null,
        hp: target.currentHp, meter: actor.meter, projectiles: this.projectiles.map(projectile => ({
          x: projectile.x, y: projectile.y, age: projectile.visualElapsed,
          travelProgress: Math.abs(projectile.x - projectile.visualOriginX) / projectile.visualFlightDistance })),
        impacts: this.projectileVisualImpacts.map(impact => ({ x: impact.x, y: impact.y, elapsed: impact.elapsed })) });
      return result;
    };
    const wrapDraw = (method, kind) => {
      const original = EngineFighter.prototype[method];
      EngineFighter.prototype[method] = function (ctx, subject) {
        const probe = window.fighterProjectileProbe;
        const source = subject?.action?.identity;
        if (source?.sourceHeroId !== probe.id) return original.call(this, ctx, subject);
        const calls = [], saved = {};
        for (const key of ['ellipse', 'arc', 'fillRect', 'moveTo', 'lineTo']) {
          saved[key] = ctx[key]; ctx[key] = function (...args) { calls.push([key, ...args]); return saved[key].apply(this, args); };
        }
        try { return original.call(this, ctx, subject); }
        finally {
          for (const [key, value] of Object.entries(saved)) ctx[key] = value;
          probe.drawTrace.push({ kind, elapsed: this.elapsed, hp: this.getOpponent(probe.side).currentHp,
            actorX: this.getActive(probe.side).x, projectileX: kind === 'flight' ? subject.x : null,
            projectileY: kind === 'flight' ? subject.y : null, impactX: kind === 'impact' ? subject.x : null,
            calls });
          if (kind === 'impact' && !probe.impactObjects.has(subject)) {
            probe.impactObjects.add(subject); probe.impactEvents++;
          }
        }
      };
    };
    wrapDraw('drawPersonalSuper', 'launch'); wrapDraw('drawProjectile', 'flight'); wrapDraw('drawProjectileImpact', 'impact');
    window.mountFighterProjectileCase = async (id, side) => {
      window.browserFighterRoot?.unmount(); window.browserFighterHost?.remove();
      const dummy = { id: 'projectile-browser-dummy', name: 'Training target', universe: 'Nexus de Convergence',
        primaryColor: '#7188a0', secondaryColor: '#aabbd0', stats: { hp: 5000, atk: 10, def: 8, spd: 5 }, weaponType: 'melee' };
      const heroes = [...HEROES_DB, dummy];
      const customConfig = { autoStart: true, opponentControl: 'p2', roundsToWin: 2,
        playerTeamIds: [side === 'player' ? id : dummy.id], opponentTeamIds: [side === 'cpu' ? id : dummy.id] };
      const props = { lang: 'fr', heroes, unlockedHeroes: [id, dummy.id], activeTeam: customConfig.playerTeamIds,
        customConfig, dedicatedSession: true, heroLevels: {}, portalCollection: {}, hiddenUniverses: [], disabledAssets: {} };
      window.fighterProjectileProbe = { id, side, trace: [], drawTrace: [], hits: 0, impactEvents: 0, impactObjects: new WeakSet() };
      window.browserFighterPausedApplied = false;
      function Harness() {
        const [paused, setPaused] = React.useState(false);
        window.setBrowserFighterPaused = setPaused;
        React.useEffect(() => { window.browserFighterPausedApplied = paused; }, [paused]);
        return React.createElement(FighterMode, { ...props, sessionPaused: paused });
      }
      window.browserFighterHost = document.body.appendChild(document.createElement('div'));
      window.browserFighterRoot = createRoot(window.browserFighterHost);
      window.browserFighterRoot.render(React.createElement(Harness));
    };
    window.fighterProjectileSnapshot = () => {
      const probe = window.fighterProjectileProbe, engine = probe.engine;
      return JSON.stringify({ elapsed: engine.elapsed, traceLength: probe.trace.length, actor: engine.getActive(probe.side),
        target: engine.getOpponent(probe.side), projectiles: engine.projectiles, impacts: engine.projectileVisualImpacts });
    };
  });
  for (const id of ['boruto_uzumaki', 'leon']) for (const side of ['player', 'cpu']) {
    console.log(JSON.stringify({ stage: 'mount', id, side }));
    await page.evaluate(async ({ id, side }) => window.mountFighterProjectileCase(id, side), { id, side });
    await page.locator('canvas[aria-label="Arene de combat A.R.C.A. jouable"]').waitFor();
    await page.waitForFunction(() => !!window.fighterProjectileProbe.engine);
    const key = side === 'player' ? 'r' : 'o';
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press(key);
    await page.waitForFunction(() => !!window.fighterProjectileProbe.cast, { timeout: 5000 });
    await page.waitForFunction(() => window.fighterProjectileProbe.engine.projectiles.some(projectile =>
      Math.abs(projectile.x - projectile.visualOriginX) / projectile.visualFlightDistance >= 0.52));
    await page.evaluate(() => window.setBrowserFighterPaused(true));
    await page.waitForFunction(() => window.browserFighterPausedApplied);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const beforePause = await page.evaluate(() => ({ state: window.fighterProjectileSnapshot(),
      canvas: document.querySelector('canvas[aria-label="Arene de combat A.R.C.A. jouable"]').toDataURL() }));
    await page.waitForTimeout(250);
    const afterPause = await page.evaluate(() => ({ state: window.fighterProjectileSnapshot(),
      canvas: document.querySelector('canvas[aria-label="Arene de combat A.R.C.A. jouable"]').toDataURL() }));
    assert.deepEqual(afterPause, beforePause, `${id}/${side}: real session pause changed simulation or the rendered canvas`);
    const flightCapture = path.join(directory, `fighter-projectile-${id}-${side}-paused.png`);
    await page.screenshot({ path: flightCapture, fullPage: true });
    await page.evaluate(() => window.setBrowserFighterPaused(false));
    await page.waitForFunction(() => window.fighterProjectileProbe.hits === 1 && window.fighterProjectileProbe.impactEvents === 1);
    await page.evaluate(() => window.setBrowserFighterPaused(true));
    await page.waitForFunction(() => window.browserFighterPausedApplied);
    const contactCapture = path.join(directory, `fighter-projectile-${id}-${side}-impact.png`);
    await page.screenshot({ path: contactCapture, fullPage: true });
    await page.evaluate(() => window.setBrowserFighterPaused(false));
    await page.waitForFunction(() => { const p = window.fighterProjectileProbe; return p.hits === 1
      && p.engine.projectiles.length === 0 && p.engine.projectileVisualImpacts.length === 0 && !p.engine.getActive(p.side).action; });
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => {
      const p = window.fighterProjectileProbe;
      return { id: p.id, side: p.side, engineUrl: window.browserFighterEngineUrl, initialHp: p.initialHp,
        initialTargetX: p.initialTargetX, cast: p.cast, hits: p.hits, impactEvents: p.impactEvents, collision: p.collision,
        finalHp: p.engine.getOpponent(p.side).currentHp, trace: p.trace, drawTrace: p.drawTrace };
    });
    assert.equal(result.cast.meter, 0); assert.equal(result.cast.hp, result.initialHp);
    assert.ok(result.cast.elapsed < result.cast.hitAt); assert.equal(result.hits, 1); assert.equal(result.impactEvents, 1);
    assert.equal(result.finalHp, result.collision.hpAfter);
    assert.equal(result.collision.impact.length, 1); assert.equal(result.collision.impact[0].x, result.initialTargetX);
    assert.ok(result.trace.filter(frame => frame.projectiles.length).every(frame => frame.hp === result.initialHp));
    assert.ok(result.drawTrace.filter(frame => frame.kind === 'impact').every(frame => frame.hp < result.initialHp));
    assert.ok(result.drawTrace.filter(frame => frame.kind === 'launch').every(frame => frame.calls.every(call =>
      !['ellipse', 'lineTo', 'fillRect'].includes(call[0]) || Math.abs(call[1] - frame.actorX) < 142)));
    const flight = result.drawTrace.filter(frame => frame.kind === 'flight'); assert.ok(flight.length > 5);
    if (id === 'boruto_uzumaki') {
      assert.ok(flight.some(frame => frame.calls.some(call => call[0] === 'ellipse')));
      assert.ok(flight.some(frame => !frame.calls.some(call => ['ellipse', 'arc', 'fillRect'].includes(call[0]))));
      for (const frame of flight) for (const call of frame.calls) if (call[0] === 'ellipse') {
        assert.equal(call[1], frame.projectileX); assert.equal(call[2], frame.projectileY);
      }
    } else for (const frame of flight) {
      const rocket = frame.calls.find(call => call[0] === 'fillRect'); assert.ok(rocket);
      assert.equal(rocket[1] + rocket[3] / 2, frame.projectileX);
    }
    const tracePath = path.join(directory, `fighter-projectile-${id}-${side}-trace.json`);
    await fs.writeFile(tracePath, `${JSON.stringify(result, null, 2)}\n`);
    const { trace, drawTrace, ...summary } = result;
    results.push({ ...summary, key: key.toUpperCase(), pause: { durationMs: 250, stateUnchanged: true, canvasUnchanged: true },
      frames: trace.length, drawFrames: drawTrace.length, flightCapture, contactCapture, tracePath, passed: true });
  }
  await page.evaluate(() => window.browserFighterRoot.unmount());
  assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  const report = { passed: true, flow: 'Actual FighterMode, local P1/P2 keyboard R/O, live projectile geometry, real sessionPaused prop, one confirmed collision/HP change and expiry.',
    note: 'L is the secondary command in FighterMode; R/O exercise the100% supers. Test setup only seeds the meter, positions and durable target HP, then uses the unmodified gameplay loop and keyboard handlers.',
    results, pageErrors, consoleErrors, failedRequests };
  await fs.writeFile(path.join(directory, 'fighter-projectile-result.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report));
} catch (error) {
  const diagnostic = await page.evaluate(() => {
    const p = window.fighterProjectileProbe, e = p?.engine;
    return { id: p?.id, side: p?.side, cast: p?.cast, hits: p?.hits, trace: p?.trace?.slice(-8), engineFound: !!e,
      phase: e?.getSnapshot().phase, actor: e?.getActive(p.side), target: e?.getOpponent(p.side) };
  }).catch(() => null);
  await fs.writeFile(path.join(directory, 'fighter-projectile-failure.json'), `${JSON.stringify({ error: error.message, stack: error.stack, diagnostic, results, pageErrors, consoleErrors, failedRequests }, null, 2)}\n`);
  await page.screenshot({ path: path.join(directory, 'fighter-projectile-failure.png'), fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
