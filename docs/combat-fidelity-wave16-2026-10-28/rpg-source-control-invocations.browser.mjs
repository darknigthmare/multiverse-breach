import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const docs = 'docs/combat-fidelity-wave16-2026-10-28';
const harness = docs + '/rpg-source-control-invocations.browser.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const startedAt = new Date().toISOString();
const final = process.argv.includes('--after-production-freeze');
if (!final && !process.argv.includes('--preliminary')) throw new Error('Choose --preliminary or --after-production-freeze');
const prefix = 'rpg-source-control-invocations-' + (final ? 'final' : 'preliminary');
const freezePath = docs + '/production-freeze.json';
let freezeSha256 = null;
if (final) {
  const bytes = await fs.readFile(freezePath), freeze = JSON.parse(bytes);
  assert.equal(freeze.productionFrozen, true);
  assert.ok(Date.parse(freeze.createdAt) <= Date.parse(startedAt));
  freezeSha256 = hash(bytes);
}
async function sourceFiles(directory) {
  return (await Promise.all((await fs.readdir(directory, { withFileTypes: true })).map(file => file.isDirectory()
    ? sourceFiles(path.join(directory, file.name))
    : /\.(?:js|jsx|json)$/.test(file.name) ? [path.join(directory, file.name)] : []))).flat();
}
const sourcePaths = [...await sourceFiles('src/game'), 'src/components/GameCanvas.jsx', 'src/components/RpgTargetingPanel.jsx', harness];
const subjectIds = new Set(['oddworld_munch_telecommande', 'oddworld_stranger_live_ammo', 'oddworld_abe_possession',
  'shinya_kogami', 'nobuchika_ginoza', 'akane_tsunemori', 'noble_six']);
const subjectPngs = [];
for (const file of sourcePaths.filter(file => file.endsWith('.generated.json'))) {
  const registry = JSON.parse(await fs.readFile(file));
  for (const entry of Array.isArray(registry.entries) ? registry.entries : []) {
    if (subjectIds.has(entry.heroId || entry.sourceHeroId || entry.id) && entry.sheet?.startsWith('/')) subjectPngs.push('public' + entry.sheet);
  }
}
const tracked = [...new Set([...sourcePaths, ...subjectPngs, 'public/sprites/generated/bosses/oddworld/slig.png'])].sort();
const inputs = () => Promise.all(tracked.map(async file => ({ path: file, sha256: hash(await fs.readFile(file)) })));
const sourceFilesBefore = await inputs(), rows = [], artifacts = [], pageErrors = [];
const cases = [
  { callerId: 'oddworld_munch_telecommande', performerId: 'oddworld_abe_possession', entity: 'Abe', kind: 'possession' },
  { callerId: 'oddworld_stranger_live_ammo', performerId: 'oddworld_abe_possession', entity: 'Abe', kind: 'possession' },
  { callerId: 'shinya_kogami', performerId: 'akane_tsunemori', entity: 'Akane Tsunemori', kind: 'paralyzer' },
  { callerId: 'nobuchika_ginoza', performerId: 'akane_tsunemori', entity: 'Akane Tsunemori', kind: 'paralyzer' }
];
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let page, browserClosed = false;
async function artifact(file) { return { path: file, sha256: hash(await fs.readFile(file)), bytes: (await fs.stat(file)).size }; }
try {
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', error => pageErrors.push(error.message));
  for (const entry of cases) for (const side of ['player', 'enemy']) {
    const item = { ...entry, side }, slug = item.callerId + '-' + side;
    await page.goto(process.env.BROWSER_BASE_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
    const mounted = await page.evaluate(async item => {
      const component = await (await fetch('/src/components/GameCanvas.jsx')).text();
      const main = await (await fetch('/src/main.jsx')).text();
      const reactUrl = component.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react\.js[^"']*)["']/)?.[1];
      const domUrl = main.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
      const engineUrl = component.match(/from ["'](\/src\/game\/engineRpg\.js[^"']*)["']/)?.[1];
      if (!reactUrl || !domUrl || !engineUrl) throw new Error('Actual GameCanvas singleton URLs missing');
      const react = await import(reactUrl), React = react.default || react;
      const dom = await import(domUrl), { createRoot } = dom.default || dom;
      const { EngineRpg } = await import(engineUrl);
      const { default: GameCanvas } = await import('/src/components/GameCanvas.jsx');
      const { HEROES_DB } = await import('/src/game/heroes.js');
      const { ENEMIES_DB } = await import('/src/game/enemies.js');
      const { resolveUniverseSummon } = await import('/src/game/combatIdentity.js');
      const { getHeroSpriteSheetSrc } = await import('/src/game/spriteAssets.js');
      const hero = id => { const h = HEROES_DB.find(h => h.id === id); if (!h) throw new Error(id); return h; };
      const caller = hero(item.callerId), descriptor = resolveUniverseSummon(caller);
      if (descriptor?.kind !== 'reinforcement' || descriptor.sourceHeroId !== item.performerId
        || descriptor.performer?.id !== item.performerId || descriptor.action?.sourceHeroId !== item.performerId) throw new Error('Exact authored reinforcement identity missing');
      const slig = item.kind === 'possession' ? structuredClone(ENEMIES_DB.Oddworld.monsters.find(body => body.id === 'oddworld_slig')) : null;
      const own = [caller], opposition = [hero(item.kind === 'paralyzer' ? 'shinya_kogami' : 'noble_six'),
        ...(slig ? [hero('shinya_kogami')] : [])];
      const configure = engine => {
        engine.autoBattle = false; engine.enemyGlobalRecovery = 100000;
        const allies = item.side === 'player' ? engine.heroes : engine.enemies;
        const targets = item.side === 'player' ? engine.enemies : engine.heroes;
        const actor = allies[0], facing = item.side === 'player' ? 1 : -1;
        if (slig) {
          const previous = targets[0];
          targets[0] = { ...slig, stats: { hp: slig.hp, atk: slig.atk, def: slig.def || 5, spd: slig.spd || 5 },
            battleId: previous.battleId.replace(/noble_six/, 'oddworld_slig'), runtimeId: previous.runtimeId.replace(/noble_six/, 'oddworld_slig'),
            currentHp: slig.hp, maxHp: slig.hp, atb: 99.99, specialCharge: 0, cooldown: 0,
            state: 'idle', stateTimer: 0, actionPending: false, facing: -facing,
            statusEffects: { infected: 0, glitched: 0, radiated: 0 } };
        }
        for (const unit of [...engine.heroes, ...engine.enemies]) {
          unit.atb = -100000; unit.specialCharge = 100; unit.state = 'idle'; unit.actionPending = false;
          unit.cooldown = 0; unit.statusEffects = { infected: 0, glitched: 0, radiated: 0 };
        }
        actor.x = actor.homeX = item.side === 'player' ? 400 : 640;
        actor.y = actor.homeY = 350; actor.atb = 100; actor.facing = facing;
        targets.forEach((unit, index) => { unit.x = unit.homeX = actor.x + facing * (180 + index * 90); unit.y = unit.homeY = 350; });
        if (slig) targets[0].atb = 99.99;
        else targets[0].paralyzerEligible = true;
        return { engine, actor, allies, targets };
      };
      const originalUpdate = EngineRpg.prototype.update;
      const originalSummon = EngineRpg.prototype.executeSummon;
      const originalAction = EngineRpg.prototype.executeRpgAction;
      EngineRpg.prototype.update = function (...args) {
        if (!this.invocationFixturePrepared) {
          this.invocationFixturePrepared = true;
          const prepared = configure(this);
          window.sourceInvocation = { ...prepared, item, events: [], ready: true,
            callerIdentity: JSON.stringify({ id: prepared.actor.id, sourceHeroId: prepared.actor.sourceHeroId,
              sourceId: prepared.actor.sourceId, universe: prepared.actor.universe, name: prepared.actor.name,
              battleId: prepared.actor.battleId, runtimeId: prepared.actor.runtimeId, side: item.side }),
            targetStoredTeam: this.heroes.includes(prepared.targets[0]), originalDescriptor: descriptor };
        }
        return originalUpdate.apply(this, args);
      };
      EngineRpg.prototype.executeSummon = function (...args) { const result = originalSummon.apply(this, args); if (result) this.setPaused(true); return result; };
      EngineRpg.prototype.executeRpgAction = function (context, ...args) {
        const result = originalAction.call(this, context, ...args);
        if (result && context.profile?.action?.sourceSligRifle) this.setPaused(true);
        return result;
      };
      const enemies = item.side === 'enemy' ? own : opposition, players = item.side === 'enemy' ? opposition : own;
      const stage = { id: 760126, name: 'Invocations de contrôle · corps et propriétaire réels', universe: caller.universe,
        mode: 'RPG', difficulty: 'Training', disableItems: true,
        customBattle: { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: enemies, bosses: [], customRoster: enemies } } };
      const props = { lang: 'fr', playerProfile: { name: 'Contrôle invocation W16' }, activeTeam: players.map(h => h.id), stage,
        heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [],
        hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
      document.getElementById('root').style.display = 'none'; const host = document.body.appendChild(document.createElement('div'));
      function Review() {
        const [paused, setPaused] = React.useState(false);
        return React.createElement(React.Fragment, null,
          React.createElement('button', { type: 'button', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le contrôle' : 'Pause de contrôle'),
          React.createElement(GameCanvas, { ...props, sessionPaused: paused }));
      }
      window.sourceInvocationRoot = createRoot(host);
      window.sourceInvocationRoot.render(React.createElement(Review));
      window.sourceInvocationAdversarial = reason => {
        const enemyRoster = item.side === 'enemy' ? own : opposition;
        const e = new EngineRpg(1040, 460, item.side === 'enemy' ? opposition : own,
          { monsters: enemyRoster, bosses: [], customRoster: enemyRoster }, { add() {} }, () => {}, () => {},
          { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
        try {
          e.invocationFixturePrepared = true;
          const { actor, targets } = configure(e), target = targets[0];
          if (!e.summon(actor, item.side) || !e.confirmTargeting()) throw new Error('Adversarial real summon failed');
          e.setPaused(false);
          let ticks = 0; while (e.activeSummon && ticks++ < 500) { e.update(); e.setPaused(false); }
          if (!target.sourceControlWave16?.active) throw new Error('No real active source control before owner cleanup');
          if (reason === 'death') actor.currentHp = 0;
          else { const team = item.side === 'player' ? e.heroes : e.enemies; team.splice(team.indexOf(actor), 1); }
          e.update();
          return { reason, realRecast: true, activeBefore: true, ended: target.sourceControlWave16?.active === false,
            noProxy: e.getRpgPossessionCommandState(item.side) === null, state: target.sourceControlWave16 };
        } finally { e.dispose(); }
      };
      return { engineUrl, reactUrl, domUrl, sourceKey: [descriptor.universe, descriptor.entityName, descriptor.action.name].join('::'),
        callerId: caller.id, performerId: descriptor.performer.id, callerSheet: getHeroSpriteSheetSrc(caller, 'rpg'),
        performerSheet: getHeroSpriteSheetSrc(descriptor.performer, 'rpg'), historicalSlig: slig };
    }, item);
    await page.waitForFunction(() => window.sourceInvocation?.ready);
    const command = page.getByRole('button', { name: new RegExp('RENFORT.*' + item.entity) });
    await command.waitFor({ timeout: 25000 });
    const rejection = await page.evaluate(() => {
      const c = window.sourceInvocation, { actor, targets, engine, item } = c, target = targets[0];
      const key = item.kind === 'possession' ? 'possessionEligible' : 'paralyzerEligible', original = target[key];
      const costs = () => ({ atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed });
      const before = costs(); target[key] = false;
      const state = engine.getSummonState(actor, item.side), accepted = engine.summon(actor, item.side);
      const after = costs(); target[key] = original;
      if (accepted || JSON.stringify(before) !== JSON.stringify(after) || state.reason !== 'no-eligible-target') throw new Error('Ineligible target spent invocation resources');
      return { accepted, before, after, reason: state.reason, exactEligibilityField: key };
    });
    await command.click(); await page.getByRole('button', { name: 'Confirmer les cibles' }).waitFor();
    const preview = await page.evaluate(() => {
      const c = window.sourceInvocation, t = c.engine.getTargetingState();
      return { effect: t.effect, valid: t.valid, profile: t.profile, eligibleTargets: t.eligibleTargets,
        estimates: t.estimates, atb: c.actor.atb, charge: c.actor.specialCharge, used: c.actor.summonUsed };
    });
    assert.equal(preview.effect, 'control'); assert.equal(preview.valid, true); assert.equal(preview.eligibleTargets.length, 1);
    assert.equal(preview.atb, 100); assert.equal(preview.charge, 100); assert.equal(preview.used, false);
    assert.ok(preview.estimates.every(e => e.amount === 0));
    const panelText = await page.getByRole('region', { name: 'Ciblage RPG' }).innerText();
    const selectionPath = `${docs}/${prefix}-${slug}-selection.png`;
    await page.screenshot({ path: selectionPath, fullPage: true }); artifacts.push(await artifact(selectionPath));
    await page.getByRole('button', { name: 'Annuler sans coût' }).click();
    assert.deepEqual(await page.evaluate(() => { const { actor } = window.sourceInvocation; return [actor.atb, actor.specialCharge, actor.summonUsed]; }), [100, 100, false]);
    await command.click(); await page.getByRole('button', { name: 'Confirmer les cibles' }).click();
    await page.getByRole('button', { name: 'Pause de contrôle' }).click();
    await page.waitForFunction(() => window.sourceInvocation.engine.paused === true);
    const observed = await page.evaluate(async item => {
      const c = window.sourceInvocation, { engine, actor, targets } = c, target = targets[0];
      const identity = () => JSON.stringify({ id: actor.id, sourceHeroId: actor.sourceHeroId, sourceId: actor.sourceId,
        universe: actor.universe, name: actor.name, battleId: actor.battleId, runtimeId: actor.runtimeId, side: item.side });
      const state = () => JSON.stringify({ actor, targets, summon: engine.getSummonSceneState(), queue: engine.actionQueue });
      const paused = state(); for (let n = 0; n < 90; n++) engine.update(); if (state() !== paused) throw new Error('Paused invocation changed');
      const initialCostsOnce = actor.atb === 0 && actor.specialCharge === 0 && actor.summonUsed === true;
      if (!initialCostsOnce) throw new Error('Invocation did not pay exactly its initial gauges');
      const hp = target.currentHp, y = target.y;
      const { getHeroSpriteSheetSrc } = await import('/src/game/spriteAssets.js');
      const { getCharacterAnimationAssets } = await import('/src/game/combat/characterAnimationCatalog.js');
      const performerSheets = [...new Set([getHeroSpriteSheetSrc(c.originalDescriptor.performer, 'rpg'),
        ...getCharacterAnimationAssets().filter(a => a.heroId === item.performerId).map(a => a.sheet)])];
      const sheets = [...performerSheets, getHeroSpriteSheetSrc(actor, 'rpg'),
        ...targets.map(unit => unit.sourceEnemyId === 'oddworld_slig' ? '/sprites/generated/bosses/oddworld/slig.png' : getHeroSpriteSheetSrc(unit, 'rpg'))];
      await Promise.all(sheets.map(async sheet => { const image = new Image(); image.src = sheet; await image.decode(); }));
      const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), originalDraw = ctx.drawImage.bind(ctx);
      const performerDraws = [];
      let traceTick = 0;
      ctx.drawImage = (image, ...args) => {
        const sheet = new URL(image.src).pathname;
        if (engine.activeSummon && performerSheets.includes(sheet)) performerDraws.push({ tick: traceTick, sheet,
          sourceCell: args.slice(0, 4), destination: args.slice(4), facing: Math.sign(ctx.getTransform().a) });
        return originalDraw(image, ...args);
      };
      const step = count => { for (let n = 0; n < count; n++) { engine.setPaused(false); engine.update(); engine.setPaused(true); traceTick++; engine.draw(ctx, 0, 'fr'); } };
      let ticks = 0, atImpact = null, firstActive = null;
      let atImpactImage = null;
      while (engine.activeSummon && ticks++ < 500) {
        step(1);
        if (target.sourceControlWave16?.active && target.sourceControlWave16.phase === 'active' && !firstActive) firstActive = structuredClone(target.sourceControlWave16);
        if (engine.activeSummon?.impacted && !atImpact) {
          atImpact = { state: structuredClone(target.sourceControlWave16), hp: target.currentHp, y: target.y };
          atImpactImage = canvas.toDataURL('image/png');
        }
      }
      ctx.drawImage = originalDraw;
      if (!performerDraws.length) throw new Error('Actual authorized performer PNG was never drawn in cinematic');
      if (engine.activeSummon || !target.sourceControlWave16?.active) throw new Error('Source control did not persist after cinematic cleanup');
      const postScene = structuredClone(target.sourceControlWave16), invocation = postScene.sourceInvocationWave16;
      if (!invocation || invocation.performerId !== item.performerId || invocation.callerHeroId !== item.callerId
        || invocation.callerId !== actor.battleId) throw new Error('Persistent exact caller/performer authorization missing');
      const afterPause = state(); for (let n = 0; n < 90; n++) engine.update(); if (state() !== afterPause) throw new Error('Post-cinematic control changed during pause');
      if (identity() !== c.callerIdentity || target.currentHp !== hp || target.y !== y) throw new Error('Source control mutated caller identity, target HP or Y');
      const draw = ctx.drawImage.bind(ctx), draws = [];
      ctx.drawImage = (image, ...args) => { draws.push({ sheet: new URL(image.src).pathname, sourceCell: args.slice(0, 4), destination: args.slice(4) }); return draw(image, ...args); };
      engine.draw(ctx, 0, 'fr'); ctx.drawImage = draw;
      if (item.kind === 'possession' && !draws.some(d => d.sheet === '/sprites/generated/bosses/oddworld/slig.png')) throw new Error('Actual historical Slig PNG not drawn');
      const image = item.kind === 'paralyzer' ? atImpactImage : canvas.toDataURL('image/png');
      let mechanicalProof;
      if (item.kind === 'possession') {
        step(1);
        engine.setPaused(false);
        const proxy = engine.getRpgPossessionCommandState(item.side);
        engine.setPaused(true);
        if (!proxy || proxy.controllerId !== actor.battleId || proxy.bodyId !== target.battleId || !proxy.ready) throw new Error('Real Slig command unavailable after cinematic');
        mechanicalProof = { persistsAfterSummon: true, currentSummonGone: engine.activeSummon === null, originalTeamUnchanged: engine.heroes.includes(target) === c.targetStoredTeam,
          sourcePerformerAuthorization: invocation, firstActive, atImpact, postScene, commandState: proxy, historicalBody: target.sourceEnemyId };
      } else {
        const actualControl = postScene.kind === 'paralyzer' && postScene.phase === 'active';
        const noProxy = engine.getRpgPossessionCommandState(item.side) === null;
        step(100);
        mechanicalProof = { actualControl, zeroHpChange: target.currentHp === hp, noLift: target.y === y, noProxy,
          expired: target.sourceControlWave16.active === false && target.sourceControlWave16.endedBy === 'expired',
          sourcePerformerAuthorization: invocation, atImpact, postScene, finalState: target.sourceControlWave16 };
        if (!Object.values({ actualControl, noProxy, expired: mechanicalProof.expired, zeroHpChange: mechanicalProof.zeroHpChange, noLift: mechanicalProof.noLift }).every(Boolean)) throw new Error('Paralyzer did not retain its zero-damage grounded duration');
      }
      return { initialCostsOnce, pauseStable: true, callerIdentityUnchanged: identity() === c.callerIdentity,
        rejectedIneligibleNoCost: true, ticks, bodyEvidence: { draws, performerDraws, performerSheets,
          authorizedPerformerReallyDrawn: true, existingArtworkOnly: true, newNative16Claimed: false }, mechanicalProof, image };
    }, item);
    const effectPath = `${docs}/${prefix}-${slug}-effect.png`;
    if (item.kind === 'possession') {
      await page.getByRole('button', { name: 'Reprendre le contrôle' }).click();
      await page.waitForFunction(() => window.sourceInvocation.engine.paused === false);
      const rifle = page.getByRole('button', { name: 'Tir du fusil du Slig possédé' });
      await rifle.waitFor(); await rifle.click(); await page.getByRole('button', { name: 'Confirmer les cibles' }).waitFor();
      const selection = await page.evaluate(() => {
        const c = window.sourceInvocation, t = c.engine.getTargetingState();
        return { actorId: t.actorId, name: t.abilityName, ownerCharge: c.actor.specialCharge, bodyAtb: c.targets[0].atb, targetIds: t.eligibleTargets.map(t => t.id) };
      });
      assert.equal(selection.ownerCharge, 0); assert.equal(selection.bodyAtb, 100); assert.match(selection.name, /fusil du Slig/);
      await page.getByRole('button', { name: 'Annuler sans coût' }).click();
      await rifle.click(); await page.getByRole('button', { name: 'Confirmer les cibles' }).click();
      await page.getByRole('button', { name: 'Pause de contrôle' }).click();
      await page.waitForFunction(() => window.sourceInvocation.engine.paused === true);
      const shot = await page.evaluate(() => {
        const c = window.sourceInvocation, { engine, actor, targets } = c, body = targets[0], victim = targets[1], before = victim.currentHp;
        if (body.atb !== 0 || actor.specialCharge !== 0) throw new Error('Rifle should spend only the real Slig body ATB');
        for (let n = 0; n < 15; n++) { engine.setPaused(false); engine.update(); engine.setPaused(true); }
        if (!(victim.currentHp < before) || body.rpgPossessedRifleLastReleaseWave16?.nativePoint?.col !== 2) throw new Error('Actual rifle release missing');
        const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx), sourceCells = [];
        ctx.drawImage = (image, ...args) => { if (new URL(image.src).pathname === '/sprites/generated/bosses/oddworld/slig.png') sourceCells.push(args.slice(0, 4)); return draw(image, ...args); };
        engine.draw(ctx, 0, 'fr'); ctx.drawImage = draw;
        if (!sourceCells.some(c => c[0] === 512 && c[1] === 256 && c[2] === 256 && c[3] === 256)) throw new Error('Real native Slig attack cell2 not drawn');
        return { before, after: victim.currentHp, ownerCharge: actor.specialCharge, bodyAtb: body.atb,
          nativeRelease: body.rpgPossessedRifleLastReleaseWave16, sourceCells, image: canvas.toDataURL('image/png') };
      });
      observed.image = shot.image; delete shot.image;
      observed.mechanicalProof.actualGameCanvasRifleCommand = true;
      observed.mechanicalProof.actualGameCanvasRifleSelection = selection;
      observed.mechanicalProof.actualGameCanvasRifleShot = shot;
      await page.getByRole('button', { name: 'Reprendre le contrôle' }).click();
      await page.waitForFunction(() => window.sourceInvocation.engine.paused === false);
      await page.getByRole('button', { name: 'Libérer le Slig' }).click();
      const release = await page.evaluate(() => {
        const c = window.sourceInvocation;
        return { inactive: c.targets[0].sourceControlWave16.active === false, noProxy: c.engine.getRpgPossessionCommandState(c.item.side) === null,
          originalTeamUnchanged: c.engine.heroes.includes(c.targets[0]) === c.targetStoredTeam };
      });
      assert.ok(release.inactive && release.noProxy && release.originalTeamUnchanged);
      observed.mechanicalProof.released = true;
      observed.mechanicalProof.cleanup = true;
      observed.mechanicalProof.release = release;
    }
    await fs.writeFile(effectPath, Buffer.from(observed.image.split(',')[1], 'base64')); delete observed.image;
    artifacts.push(await artifact(effectPath));
    const ownerCleanup = await page.evaluate(() => ['death', 'removal'].map(reason => window.sourceInvocationAdversarial(reason)));
    assert.ok(ownerCleanup.every(r => r.ended && r.noProxy));
    observed.mechanicalProof.ownerCleanup = true;
    observed.mechanicalProof.ownerCleanupCases = ownerCleanup;
    rows.push({ callerId: item.callerId, side, performerId: item.performerId, kind: item.kind, passed: true, mounted, preview, panelText,
      rejection, ...observed });
    await page.evaluate(() => window.sourceInvocationRoot.unmount());
    console.log(JSON.stringify({ completed: rows.length, callerId: item.callerId, side, kind: item.kind }));
  }
  const sourceFilesAfter = await inputs(), stable = JSON.stringify(sourceFilesBefore) === JSON.stringify(sourceFilesAfter);
  if (final) assert.equal(stable, true);
  assert.deepEqual(pageErrors, []); assert.equal(rows.length, 8); assert.equal(artifacts.length, 16);
  await browser.close(); browserClosed = true;
  const browserClosedAt = new Date().toISOString(), finishedAt = new Date().toISOString();
  const report = { passed: true, preliminary: !final, phase: final ? 'final' : 'preliminary', startedAt, finishedAt, browserClosedAt,
    allBrowserWindowsClosed: true, harness, harnessSha256: hash(await fs.readFile(harness)), finalProductionFreezeClaimed: final,
    productionFreezePath: final ? freezePath : null, productionFreezeSha256: freezeSha256,
    actualGameCanvasFlows: 8, sourceControlInvocationFlows: 8, selectionCaptures: 8, effectCaptures: 8,
    actualAdversarialEngineRecasts: rows.reduce((n, r) => n + r.mechanicalProof.ownerCleanupCases.length, 0),
    allInitialCostsOnce: rows.every(r => r.initialCostsOnce), allPausesStable: rows.every(r => r.pauseStable),
    allCallerIdentitiesUnchanged: rows.every(r => r.callerIdentityUnchanged), allIneligibleRejectedWithoutCost: rows.every(r => r.rejectedIneligibleNoCost),
    sourceFiles: sourceFilesBefore, sourceFilesAfter, productionInputsStableDuringRun: stable, artifacts, rows, pageErrors,
    method: 'Eight real GameCanvas invocation selection/cancel/confirmation flows, four exact authored callers in both camps. Only fixture roster positions, eligible typed historical Slig and explicitly eligible Kogami are prepared. Production simulation is paused at commit then advanced synchronously. Possession survives cinematic cleanup and its real Slig rifle and release are commanded through GameCanvas buttons. Sixteen additional explicitly separated adversarial EngineRpg recasts verify owner death/removal; those are not counted as additional GameCanvas flows. Existing real PNG bodies are traced without any new native16 artwork claim.',
    source1to1Verified: false };
  await fs.writeFile(`${docs}/${prefix}-result.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: true, flows: rows.length, artifacts: artifacts.length, stable, pageErrors }));
} catch (error) {
  await fs.writeFile(`${docs}/${prefix}-failure.json`, JSON.stringify({ startedAt, error: String(error), pageErrors, rows, artifacts, browserClosed }, null, 2) + '\n');
  if (page && !browserClosed) await page.screenshot({ path: `${docs}/${prefix}-failure.png`, fullPage: true });
  throw error;
} finally { if (!browserClosed) await browser.close(); }
