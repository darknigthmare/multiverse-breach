import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
if (!preliminary && !process.argv.includes('--after-production-freeze')) throw new Error('Use --preliminary while integration changes, or --after-production-freeze after the final root signal.');
const reportPrefix = preliminary ? 'summon-wave16-preliminary' : 'summon-wave16';
const startedAt = new Date().toISOString();
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const freezePath='docs/combat-fidelity-wave16-2026-10-28/production-freeze.json';
const freezeBytes=preliminary?null:readFileSync(path.join(repositoryRoot,freezePath));
if(freezeBytes){const freeze=JSON.parse(freezeBytes);assert.equal(freeze.productionFrozen,true);assert.ok(Date.parse(freeze.createdAt)<=Date.parse(startedAt));}
function productionSnapshot() {
  const pending = [path.join(repositoryRoot, 'src/components/GameCanvas.jsx')], files = new Set();
  while (pending.length) {
    const file = pending.pop();
    if (files.has(file)) continue;
    files.add(file);
    if (!/\.[cm]?jsx?$/.test(file)) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)(['"])(\.[^'"]+)\1/g)) {
      const reference = path.resolve(path.dirname(file), match[2]);
      const dependency = [reference, `${reference}.js`, `${reference}.jsx`, `${reference}.json`].find(candidate => /\.(?:[cm]?jsx?|json)$/.test(candidate) && existsSync(candidate));
      if (dependency) pending.push(dependency);
    }
  }
  for (const id of ['crash','mugman','faye','alphonse','starfire','bt7274','fox-devil']) files.add(path.join(repositoryRoot, `public/sprites/generated/summon-animations-wave16/${id}.png`));
  for (const registry of ['A', 'B', 'C'].flatMap(part => [`characterAnimationsWave16Part${part}.generated.json`, `characterSpriteCorrectionsWave16Part${part}.generated.json`])) {
    if (!existsSync(path.join(repositoryRoot, 'src/game/combat', registry))) continue;
    for (const entry of JSON.parse(readFileSync(path.join(repositoryRoot, 'src/game/combat', registry))).entries) files.add(path.join(repositoryRoot, 'public', entry.sheet));
  }
  return [...files].sort().map(file => ({ path: path.relative(repositoryRoot, file), sha256: createHash('sha256').update(readFileSync(file)).digest('hex') }));
}
const sourceFilesBefore = productionSnapshot();
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let browserClosed = false;
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pageErrors = [], rows = [], artifacts = [];
page.on('pageerror', error => pageErrors.push(error.message));
const cases = [
 {id:'coco_bandicoot',partner:'crash_bandicoot',slug:'crash',entity:'Crash Bandicoot',kind:'reinforcement',label:'RENFORT',role:'melee',effect:'damage'},
 {id:'cuphead_cuphead',ally:'cuphead_ms_chalice',partner:'cuphead_mugman',slug:'mugman',entity:'Mugman',kind:'reinforcement',label:'RENFORT',role:'support',effect:'guard'},
 {id:'spike_spiegel',partner:'faye_valentine',slug:'faye',entity:'Faye Valentine',kind:'reinforcement',label:'RENFORT',role:'gun',effect:'damage'},
 {id:'edward_elric',partner:'alphonse_elric',slug:'alphonse',entity:'Alphonse Elric',kind:'reinforcement',label:'RENFORT',role:'melee',effect:'damage'},
 {id:'raven_tt',partner:'starfire_tt',slug:'starfire',entity:'Starfire',kind:'reinforcement',label:'RENFORT',role:'hand',effect:'damage'},
 {id:'sarah_briggs_tf2',partner:'bt_7274_tf2',slug:'bt7274',entity:'BT-7274',kind:'reinforcement',label:'RENFORT',role:'gun',effect:'damage'},
 {id:'aki_hayakawa',partner:null,slug:'fox-devil',entity:'Fox Devil',kind:'summon',label:'INVOCATION',role:'bite',effect:'damage'}
];
try {
  for (const item of cases.flatMap(entry => ['player', 'enemy'].map(side => ({ ...entry, side })))) {
    await page.goto(process.env.SUMMON_ANIMATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
    const identity = await page.evaluate(async item => {
      const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
      const mainSource = await (await fetch('/src/main.jsx')).text();
      const reactUrl = source.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react\.js[^"']*)["']/)?.[1];
      const domUrl = mainSource.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
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
          this.heroes.forEach(unit => { unit.atb = item.side === 'player' && unit === this.heroes[0] ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          this.enemies.forEach(unit => { unit.atb = item.side === 'enemy' && unit === this.enemies[0] ? 100 : -100000; unit.specialCharge = 100; unit.currentHp = unit.maxHp = 100000; });
          window.summonReviewActor = () => item.side === 'enemy' ? this.enemies[0] : this.heroes[0];
          window.summonReviewTargets = () => item.side === 'enemy' ? this.heroes : this.enemies;
          window.summonReviewAllies = () => item.side === 'enemy' ? this.enemies : this.heroes;
          if (item.effect !== 'damage') window.summonReviewAllies().forEach((unit, index) => { unit.currentHp = index === 0 ? 40000 : 60000; });
          window.summonEngine = this;
        }
        return update.apply(this, args);
      };
      // Stop the real simulation at the commit, before browser latency could
      // skip arrival cells. No tick, target, cost or damage code is replaced.
      EngineRpg.prototype.executeSummon = function (...args) { const result = execute.apply(this, args); if (result) this.setPaused(true); return result; };
      const opponent = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
      const ally = item.ally ? HEROES_DB.find(hero => hero.id === item.ally) : null;
      const ownRoster = [caller, ...(ally ? [ally] : [])], opposingRoster = [opponent];
      const enemyRoster = item.side === 'enemy' ? ownRoster : opposingRoster;
      const customBattle = { singleRoster: true, opponentControl: 'p2', items: false, enemyData: { monsters: enemyRoster, bosses: [], customRoster: enemyRoster } };
      const stage = { id: 760006, name: 'Invocation review ordinary room', universe: caller.universe, mode: 'RPG', difficulty: 'Training', disableItems: true, customBattle };
      const props = { lang: 'fr', playerProfile: { name: 'Contrôle invocation' }, activeTeam: (item.side === 'enemy' ? opposingRoster : ownRoster).map(hero => hero.id), stage, heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true };
      const host = document.body.appendChild(document.createElement('div')); document.getElementById('root').style.display = 'none';
      function ReviewSession() {
        const [paused, setPaused] = React.useState(false);
        return React.createElement(React.Fragment, null,
          React.createElement('button', { type: 'button', id: 'summon-review-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le contrôle' : 'Pause de contrôle'),
          React.createElement(GameCanvas, { ...props, sessionPaused: paused }));
      }
      window.summonRoot = createRoot(host); window.summonRoot.render(React.createElement(ReviewSession));
      window.summonEngineClass = EngineRpg;
      return { engineUrl, reactUrl, domUrl, side: item.side, caller: caller.id, universe: caller.universe, entity: descriptor.entityName, kind: descriptor.kind, sourceKey: [descriptor.universe, descriptor.entityName, descriptor.action.name].join('::'), sourceHeroId: descriptor.sourceHeroId, performerHeroId: descriptor.performer?.id || null, effect: descriptor.action.targeting.effect, cloudEntity: resolveUniverseSummon(opponent).entityName };
    }, item);
    const command = page.getByRole('button', { name: new RegExp(`${item.label}.*${item.entity}`) });
    await command.waitFor({ timeout: 20000 });
    await command.click();
    await page.getByRole('button', { name: 'Confirmer les cibles' }).waitFor();
    const selection = await page.evaluate(() => { const engine = window.summonEngine, actor = window.summonReviewActor(); return { atb: actor.atb, charge: actor.specialCharge, used: actor.summonUsed, targeting: engine.getTargetingState().summon.entityName }; });
    assert.deepEqual([selection.atb, selection.charge, selection.used], [100, 100, false]);
    if (item.role === 'support') {
      selection.sourceProtectionLabel = await page.getByRole('region', { name: 'Ciblage RPG' }).innerText();
      assert.match(selection.sourceProtectionLabel, /INVULNÉRABLE · 4,85 s/);
      assert.match(selection.sourceProtectionLabel, /l’appelant uniquement/);
      assert.doesNotMatch(selection.sourceProtectionLabel, /GARDE\s*40%|3 s/);
      const capture = new URL(`${reportPrefix}-${item.slug}-${item.side}-targeting.png`, import.meta.url);
      await page.getByRole('region', { name: 'Ciblage RPG' }).screenshot({ path: capture.pathname });
      artifacts.push({ path: path.relative(repositoryRoot, fileURLToPath(capture)),
        sha256: createHash('sha256').update(readFileSync(capture)).digest('hex'), bytes: readFileSync(capture).length });
    }
    await page.getByRole('button', { name: 'Annuler sans coût' }).click();
    assert.deepEqual(await page.evaluate(() => { const actor = window.summonReviewActor(); return [actor.atb, actor.specialCharge, actor.summonUsed]; }), [100, 100, false]);
    await page.keyboard.press(item.side === 'enemy' ? 'Numpad5' : 'u');
    await page.getByRole('button', { name: 'Confirmer les cibles' }).click();
    await page.waitForFunction(() => window.summonEngine?.isSummonSceneActive());
    await page.getByRole('button', { name: 'Pause de contrôle' }).click();
    await page.waitForFunction(() => window.summonEngine.paused === true);
    const pause = await page.evaluate(() => {
      const engine = window.summonEngine, snapshot = JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp), allies: window.summonReviewAllies() });
      for (let i = 0; i < 90; i++) engine.update();
      return { unchanged: snapshot === JSON.stringify({ scene: engine.getSummonSceneState(), actor: window.summonReviewActor(), hp: window.summonReviewTargets().map(unit => unit.currentHp), allies: window.summonReviewAllies() }), tick: engine.activeSummon.tick, atb: window.summonReviewActor().atb, charge: window.summonReviewActor().specialCharge, used: window.summonReviewActor().summonUsed };
    });
    assert.equal(pause.unchanged, true); assert.deepEqual([pause.tick, pause.atb, pause.charge, pause.used], [0, 0, 0, true]);
    const native = await page.evaluate(async item => {
      const engine = window.summonEngine;
      const { getHeroSpriteSheetSrc } = await import('/src/game/spriteAssets.js');
      const { HEROES_DB } = await import('/src/game/heroes.js');
      const { projectNativeSummonEffectOriginWave16 } = await import('/src/game/combat/rosterSummonChoreographyWave16.js');
      const { resolveSummonAnimationAsset } = await import('/src/game/combat/summonAnimationCatalog.js');
      const asset = resolveSummonAnimationAsset(engine.activeSummon.descriptor);
      const sheet = item.fallback ? getHeroSpriteSheetSrc(HEROES_DB.find(hero => hero.id === item.partner)) : `/sprites/generated/summon-animations-wave16/${item.slug}.png`;
      const image = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = sheet; });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), drawImage = ctx.drawImage.bind(ctx);
      const calls = [], frames = [], hpChanges = [], effectEvents = []; let currentTick = engine.activeSummon.tick, lastHp = window.summonReviewTargets()[0].currentHp, impactImage;
      ctx.drawImage = (image, ...args) => {
        if (new URL(image.src).pathname === sheet) {
          const row = args[1] / 256, col = args[0] / 512, transform = ctx.getTransform();
          const output = asset.normalization.rows[row].frameBounds[col].output;
          const point = (x,y) => ({ x: transform.a*x + transform.c*y + transform.e, y: transform.b*x + transform.d*y + transform.f });
          const corners = [[output.left,output.top],[output.left+output.width,output.top],
            [output.left,output.top+output.height],[output.left+output.width,output.top+output.height]]
            .map(([x,y])=>point(args[4]+x/512*args[6],args[5]+y/256*args[7]));
          const anchor = asset.effectAnchors?.[['arrival','preparation','attack','recovery'][row]]?.[col];
          calls.push({ tick: currentTick, row, col, sw: args[2], sh: args[3], facing: Math.sign(transform.a), dw: args[6], dh: args[7], alpha: ctx.globalAlpha,
            bodyHeight: asset.normalization.bodyCalibration.outputBodyHeight / 256 * args[7],
            visibleBounds: {left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))},
            actualDrawnAnchor: anchor ? point(args[4]+anchor.x/512*args[6],args[5]+anchor.y/256*args[7]) : null,
            canvasWidth:canvas.width,canvasHeight:canvas.height });
        }
        return drawImage(image, ...args);
      };
      const units = values => values.map(unit => ({ id: unit.battleId || unit.id, hp: unit.currentHp, buffTicks: unit.rpgBuffTicks || 0, buffMultiplier: unit.rpgBuffMultiplier || 1, guardTicks: unit.rpgGuardTicks || 0, guardReduce: unit.rpgGuardReduce || 0, protection: unit.sourceProtectionWave16 ? {...unit.sourceProtectionWave16} : null }));
      const initialAllies = units(window.summonReviewAllies()), initialEnemies = units(window.summonReviewTargets());
      const applyImpact = engine.applyRpgImpact;
      engine.applyRpgImpact = function (actor, profile, targets, color, abilityType) {
        const beforeAllies = units(window.summonReviewAllies()), beforeEnemies = units(window.summonReviewTargets());
        const result = applyImpact.call(this, actor, profile, targets, color, abilityType);
        if (abilityType === 'summon') effectEvents.push({ tick: this.activeSummon.tick, effect: profile.effect, name: profile.name, partner: profile.summon.performer?.id || null, targetIds: targets.map(unit => unit.battleId || unit.id), beforeAllies, beforeEnemies, afterAllies: units(window.summonReviewAllies()), afterEnemies: units(window.summonReviewTargets()) });
        return result;
      };
      const initialCosts = { atb: window.summonReviewActor().atb, charge: window.summonReviewActor().specialCharge, used: window.summonReviewActor().summonUsed }, impactTick = engine.activeSummon.impactTick;
      while (engine.activeSummon) {
        currentTick = engine.activeSummon.tick;
        const state = engine.getSummonSceneState();
        const projected = projectNativeSummonEffectOriginWave16(state.choreography, asset, state.entityAnimationFrame);
        frames.push({ tick: currentTick, frame: state.entityAnimationFrame, impacted: state.impacted, kind: state.kind,
          performer: projected.performer, target: projected.target, targets: projected.targets,
          origin: projected.origin, sourceNativeContact: projected.sourceNativeContact, nativeMuzzleActive: projected.nativeMuzzleActive,
          nativeAnchor: asset.effectAnchors?.[state.entityAnimationFrame.phase]?.[state.entityAnimationFrame.col] || null });
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
      for (let row = 0; row < (item.fallback ? 0 : 4); row++) for (let col = 0; col < 4; col++) {
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
      return { bodyKind: item.fallback ? 'legacy-fallback' : 'native16', newNativeCells: item.fallback ? 0 : 16, fallbackReason: item.fallback ? 'Explicit image-generation refusal; existing art retained without new native poses' : null, sheet, initialCosts, impactTick, frames, calls, hpChanges, effectEvents, initialAllies, initialEnemies, finalAllies: units(window.summonReviewAllies()), finalEnemies: units(window.summonReviewTargets()), canSummonAgain, activeAfter: engine.isSummonSceneActive(), pixelMirrorChecks, impactImage };
    }, item);
    if (!item.fallback) {
      assert.equal(new Set(native.frames.map(row => row.frame.index)).size, 16);
      assert.equal(new Set(native.calls.map(row => `${row.row}:${row.col}`)).size, 16);
      assert.ok(native.calls.every(call => call.sw === 512 && call.sh === 256 && call.facing === (item.side === 'player' ? 1 : -1)));
      assert.ok(native.calls.every(call => Math.abs(call.dw / call.dh - 2) < 1e-8));
      assert.equal(native.frames.find(row => row.tick === native.impactTick).frame.index, 10);
    } else {
      assert.ok(native.frames.every(row => row.frame === null));
      assert.ok(native.calls.length > 0 && native.calls.every(call => [0, 1].includes(call.row)), JSON.stringify(native.calls));
      assert.ok(native.calls.some(call => call.tick === native.impactTick && call.row === 0), 'The declared fallback stays on its retained source row');
      assert.equal(native.newNativeCells, 0);
    }
    if (['melee','bite'].includes(item.role)) {
      const impactFrame = native.frames.find(frame => frame.tick === native.impactTick);
      assert.equal(impactFrame.sourceNativeContact?.accepted, true);
      assert.equal(impactFrame.sourceNativeContact?.column, 2);
      assert.ok(impactFrame.sourceNativeContact.distanceToTarget < 1e-8, `${item.slug}: actual physical anchor must reach accepted target`);
    }
    for (const call of native.calls.filter(call => call.alpha > .01)) {
      assert.ok(call.visibleBounds.left >= 0 && call.visibleBounds.right <= call.canvasWidth,
        `${item.slug}: complete source silhouette must fit horizontally`);
      assert.ok(call.visibleBounds.top >= 0 && call.visibleBounds.bottom <= call.canvasHeight,
        `${item.slug}: complete source silhouette must fit vertically`);
    }
    for (const frame of native.frames) {
      assert.equal(frame.nativeMuzzleActive, !!frame.nativeAnchor && ['gun','hand'].includes(item.role) && frame.frame.phase === 'attack' && frame.frame.col === 2);
      if (!frame.nativeAnchor) continue;
      const actual = native.calls.find(call => call.tick === frame.tick)?.actualDrawnAnchor;
      assert.ok(actual, 'source anchor must appear in an actual canvas draw');
      assert.ok(Math.hypot(actual.x-frame.origin.x,actual.y-frame.origin.y) < .001,
        'projected release/contact must match the actual rendered anatomical pixel: '+JSON.stringify({subject:item.slug,side:item.side,tick:frame.tick,frame:frame.frame,actual,projected:frame.origin,performer:frame.performer,draw:native.calls.find(call=>call.tick===frame.tick)}));
      const p = frame.performer, a = frame.nativeAnchor, dx = (a.x - 256) / 256 * p.size * p.facing,
        dy = Math.round(p.size / 2 - 244 / 256 * p.size) - p.size / 2 + a.y / 256 * p.size, angle = p.rotation || 0;
      assert.ok(Math.abs(frame.origin.x - p.x - dx * Math.cos(angle) + dy * Math.sin(angle)) < 1e-8);
      assert.ok(Math.abs(frame.origin.y - p.y - dx * Math.sin(angle) - dy * Math.cos(angle)) < 1e-8);
    }
    if (item.partner) assert.equal(identity.sourceHeroId, item.partner);
    assert.equal(identity.performerHeroId, item.partner);
    assert.equal(native.effectEvents.length, 1); assert.equal(native.effectEvents[0].tick, native.impactTick);
    assert.equal(native.effectEvents[0].effect, item.effect); assert.equal(native.effectEvents[0].partner, item.partner);
    if (item.effect === 'damage') { assert.equal(native.hpChanges.length, 1); assert.equal(native.hpChanges[0].tick, native.impactTick); }
    else {
      assert.equal(native.hpChanges.length, 0);
      assert.deepEqual(native.finalEnemies.map(unit => unit.hp), native.initialEnemies.map(unit => unit.hp));
      assert.deepEqual(native.finalAllies.map(unit => unit.hp), native.initialAllies.map(unit => unit.hp));
      assert.equal(native.finalAllies.length, 2);
      assert.ok(native.finalAllies.every(unit => unit.buffTicks === 0 && unit.guardTicks === 0));
      assert.equal(native.finalAllies[0].protection?.kind, 'mugman-super-art-ii');
      assert.ok(native.finalAllies[0].protection.remaining > 0 && native.finalAllies[0].protection.remaining <= 4.85);
      assert.equal(native.finalAllies[1].protection, null);
      assert.deepEqual(native.effectEvents[0].targetIds, [native.initialAllies[0].id]);
    }
    assert.equal(native.pixelMirrorChecks, item.fallback ? 0 : 16); assert.equal(native.canSummonAgain, false); assert.equal(native.activeAfter, false);
    const captureUrl = new URL(`${reportPrefix}-${item.slug}-${item.side}-impact.png`, import.meta.url);
    writeFileSync(captureUrl, Buffer.from(native.impactImage.split(',')[1], 'base64')); delete native.impactImage;
    const captureBytes = readFileSync(captureUrl);
    artifacts.push({ path: path.relative(repositoryRoot, fileURLToPath(captureUrl)),
      sha256: createHash('sha256').update(captureBytes).digest('hex'), bytes: captureBytes.length });
    await page.getByRole('button', { name: 'Reprendre le contrôle' }).click();
    await page.waitForFunction(() => window.summonEngine.paused === false);
    assert.equal(await command.isDisabled(), true);
    const buttonText = await command.textContent(); assert.match(buttonText, /Déjà utilisé/);
    await page.evaluate(() => window.summonRoot.unmount());
    console.log(JSON.stringify({ completed: rows.length + 1, caller: item.id, side: item.side, kind: native.bodyKind, effects: native.effectEvents.length, hpImpacts: native.hpChanges.length }));
    rows.push({ identity, selection, pause, native, buttonText, uiSequence: `GameCanvas ${item.side} button → cancel without cost → keyboard ${item.side === 'enemy' ? 'Numpad5' : 'U'} → target confirmation button → sessionPaused control → deterministic production updates/rendering → resume → used command disabled` });
  }
  assert.deepEqual(pageErrors, []);
  const nativeCells = side => rows.filter(row => row.identity.side === side && row.native.bodyKind === 'native16').reduce((n, row) => n + new Set(row.native.calls.map(call => `${call.row}:${call.col}`)).size, 0);
  const offensiveRows = rows.filter(row => row.identity.effect === 'damage'), supportRows = rows.filter(row => row.identity.effect !== 'damage');
  const sourceFilesAfter = productionSnapshot();
  const stableInputs = JSON.stringify(sourceFilesAfter) === JSON.stringify(sourceFilesBefore);
  if (!preliminary) assert.equal(stableInputs, true, 'Production inputs changed during browser verification.');
  const result = {
    date: '2026-10-28', startedAt, finishedAt: new Date().toISOString(), preliminary, finalProductionFreezeClaimed: !preliminary,
    productionFreezePath:preliminary?null:freezePath,productionFreezeSha256:freezeBytes?createHash('sha256').update(freezeBytes).digest('hex'):null,
    harness: 'docs/combat-fidelity-wave16-2026-10-28/summon-wave16-browser.mjs',
    harnessSha256: createHash('sha256').update(readFileSync(fileURLToPath(import.meta.url))).digest('hex'),
    passed: true, browser: 'local Chromium', actualGameCanvasFlows: rows.length,
    actualEngineUrlResolvedFromGameCanvas: true, bothSidesThroughGameCanvasControls: true,
    nativeFlows: rows.filter(row => row.native.bodyKind === 'native16').length, fallbackFlows: rows.filter(row => row.native.bodyKind === 'legacy-fallback').length,
    distinctSourceCells: new Set(rows.filter(row => row.native.bodyKind === 'native16').flatMap(row => row.native.calls.map(call => `${row.native.sheet}:${call.row}:${call.col}`))).size,
    nativeCells: nativeCells('player'), opposingNativeCells: nativeCells('enemy'),
    nativePixelMirrorChecks: rows.reduce((n, row) => n + row.native.pixelMirrorChecks, 0),
    allEffectsOnce: rows.every(row => row.native.effectEvents.length === 1),
    offensiveFlows: offensiveRows.length, offensiveHpImpacts: offensiveRows.reduce((n, row) => n + row.native.hpChanges.length, 0),
    supportFlows: supportRows.length, supportEffectEvents: supportRows.reduce((n, row) => n + row.native.effectEvents.length, 0),
    supportDamageImpacts: supportRows.reduce((n, row) => n + row.native.hpChanges.length, 0),
    supportAlliedHpUnchanged: supportRows.every(row => JSON.stringify(row.native.initialAllies.map(unit => unit.hp)) === JSON.stringify(row.native.finalAllies.map(unit => unit.hp))),
    productionFilesChangedByHarness: false,
    productionInputsStableDuringRun: stableInputs,
    sourceSnapshotScope: 'Recursively resolved literal relative JS/JSX/JSON imports reachable from GameCanvas, plus the seven new native source PNGs and currently registered W16 native32/base16 PNGs. Preliminary passes do not claim final production freeze. This does not snapshot remote dependencies or claim every dynamically constructed import.',
    titanToHumanBodyRatio: Object.fromEntries(['player','enemy'].map(side => {
      const own = rows.filter(row=>row.identity.side===side);
      const titan = own.find(row=>row.identity.caller==='sarah_briggs_tf2').native.calls[0].bodyHeight;
      const human = own.find(row=>row.identity.caller==='spike_spiegel').native.calls[0].bodyHeight;
      assert.ok(Math.abs(titan/human-3)<1e-8);
      return [side,titan/human];
    })),
    allNativeSilhouettesFitCanvas: true,
    actualAnatomicalCanvasProjectionChecked: true,
    anatomicalProjectionTolerancePixels: .001,
    sourceFiles: sourceFilesBefore, sourceFilesAfter,
    pauseMethod: 'A review host sets the real GameCanvas sessionPaused prop. Commit pauses EngineRpg at tick0 before browser latency; scene progression uses synchronous real production updates/rendering, never synthetic damage, buff values or animation indices.',
    source1to1Verified: false, pageErrors, rows, artifacts
  };
  assert.equal(result.actualGameCanvasFlows, 14); assert.equal(result.distinctSourceCells, 112);
  assert.equal(result.nativeCells, 112); assert.equal(result.opposingNativeCells, 112); assert.equal(result.nativePixelMirrorChecks, 224);
  assert.equal(result.allEffectsOnce, true); assert.deepEqual([result.offensiveFlows, result.offensiveHpImpacts], [12, 12]);
  assert.deepEqual([result.supportFlows, result.supportEffectEvents, result.supportDamageImpacts], [2, 2, 0]); assert.equal(result.supportAlliedHpUnchanged, true);
  await browser.close(); browserClosed = true;
  result.browserClosedAt = new Date().toISOString(); result.allBrowserWindowsClosed = true;
  result.finishedAt = new Date().toISOString();
  writeFileSync(new URL(`${reportPrefix}-result.json`, import.meta.url), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ flows: result.actualGameCanvasFlows, nativeCells: result.nativeCells, pixelMirrors: result.nativePixelMirrorChecks, opposingNativeCells: result.opposingNativeCells, effects: rows.map(row => row.native.effectEvents.length), offensiveHpImpacts: result.offensiveHpImpacts, supportDamageImpacts: result.supportDamageImpacts, pageErrors }));
} catch (error) {
  writeFileSync(new URL(`${reportPrefix}-harness-diagnostic.json`, import.meta.url), JSON.stringify({ error: String(error), pageErrors, browserClosed,
    body: browserClosed ? 'Browser already closed after successful checks.' : await page.locator('body').innerText() }, null, 2) + '\n');
  if (!browserClosed) await page.screenshot({ path: new URL(`${reportPrefix}-harness-diagnostic.png`, import.meta.url).pathname, fullPage: true });
  throw error;
} finally { if (!browserClosed) await browser.close(); }
