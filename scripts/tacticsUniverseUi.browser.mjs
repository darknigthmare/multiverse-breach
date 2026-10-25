// Exercise the actual CustomBattleMode → GameCanvas → EngineTactics path.
// The only runtime hook observes the real engine instance; no rule, position,
// movement cost, projection, targeting or rendering implementation is replaced.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-integration-freeze'), 'Use --preliminary or --after-integration-freeze');
assert.ok(preliminary || !process.env.TACTICS_UNIVERSE_ONLY, 'Final proof must exercise every source sector and both legacy controls');
const startedAt = new Date().toISOString();
const output = process.env.TACTICS_UNIVERSE_PROOF_DIR || `/tmp/tactics-universe-proof/${startedAt.replace(/[^0-9]/g, '')}`;
fs.mkdirSync(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const harnessPath = fileURLToPath(import.meta.url);
const harnessBytesAtStart = fs.readFileSync(harnessPath);
const harnessSha256AtStart = sha(harnessBytesAtStart);
const harnessSnapshotPath = path.join(output, 'harness.mjs');
fs.writeFileSync(harnessSnapshotPath, harnessBytesAtStart);
function snapshot() {
  const files = {};
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:jsx?|json)$/.test(entry.name)) files[path.relative(root, file)] = sha(fs.readFileSync(file));
    }
  }
  visit(path.join(root, 'src'));
  return files;
}
const sourceHashesBefore = snapshot();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pageErrors = [], rows = [], artifacts = [{ path: harnessSnapshotPath, sha256: harnessSha256AtStart, bytes: harnessBytesAtStart.length }];
page.on('pageerror', error => pageErrors.push(error.message));
async function capture(name, locator) {
  const target = path.join(output, name + '.png');
  if (locator) await locator.screenshot({ path: target });
  else await page.screenshot({ path: target, fullPage: true });
  artifacts.push({ path: target, sha256: sha(fs.readFileSync(target)), bytes: fs.statSync(target).size });
}
async function mount() {
  await page.goto(process.env.TACTICS_UI_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const main = await (await fetch('/src/main.jsx')).text();
    const reactUrl = source.match(/from ["'](\/node_modules\/\.vite\/deps\/react\.js[^"']*)["']/)?.[1];
    const domUrl = main.match(/from ["'](\/node_modules\/\.vite\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
    const engineUrl = source.match(/from ["'](\/src\/game\/engineTactics\.js[^"']*)["']/)?.[1];
    if (!reactUrl || !domUrl || !engineUrl) throw new Error('Application singleton/module URLs were not resolved');
    const react = await import(reactUrl), React = react.default || react;
    const dom = await import(domUrl), { createRoot } = dom.default || dom;
    const { EngineTactics } = await import(engineUrl);
    const { getSpriteSheetLayout } = await import('/src/game/spriteAssets.js');
    const { default: CustomBattleMode } = await import('/src/components/CustomBattleMode.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    window.terrainUiGeometry = await import('/src/game/tacticsTerrainRenderer.js');
    window.terrainUiCanvasImages = [];
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
      if ((this.canvas.getAttribute('aria-label') || '').startsWith('Plateau tactique')) {
        const url = image?.currentSrc || image?.src;
        if (url && !window.terrainUiCanvasImages.includes(url)) window.terrainUiCanvasImages.push(url);
      }
      return originalDrawImage.call(this, image, ...args);
    };
    const startTurn = EngineTactics.prototype.startTurn;
    EngineTactics.prototype.startTurn = function (...args) {
      window.terrainUiEngine = this;
      return startTurn.apply(this, args);
    };
    // Observe the real unit renderer and Canvas transform. Delegation preserves
    // every pixel/rule; no renderer, actor coordinate or movement is substituted.
    const drawTacticsUnit = EngineTactics.prototype.drawTacticsUnit;
    window.terrainUiCloudDraws = [];
    EngineTactics.prototype.drawTacticsUnit = function (ctx, entry, ...args) {
      const unit = entry.unit;
      if ((unit.sourceHeroId || unit.sourceId || unit.id) !== 'cloud_ff7') return drawTacticsUnit.call(this, ctx, entry, ...args);
      const original = ctx.drawImage;
      ctx.drawImage = function (image, ...coordinates) {
        const matrix = ctx.getTransform(), layout = getSpriteSheetLayout(new URL(image.src).pathname);
        const baseline = layout.baseline ?? 232;
        const [sx, sy, sw, sh, dx, dy, dw, dh] = coordinates;
        window.terrainUiCloudDraws.push({ surfaceId: unit.surfaceId, gridZ: unit.gridZ,
          moving: !!unit.terrainMotion, renderZ: unit.terrainRenderPosition?.z ?? unit.gridZ,
          pivot: { x: unit.x, y: unit.y }, sheet: new URL(image.src).pathname,
          source: [sx, sy, sw, sh], baseline,
          projectedFeetY: matrix.f + matrix.b * (dx + dw / 2) + matrix.d * (dy + baseline / sh * dh) });
        window.terrainUiCloudDraws = window.terrainUiCloudDraws.slice(-200);
        return original.call(ctx, image, ...coordinates);
      };
      try { return drawTacticsUnit.call(this, ctx, entry, ...args); }
      finally { ctx.drawImage = original; }
    };
    const props = {
      lang: 'fr', playerProfile: { name: 'Contrôle terrain' }, heroes: HEROES_DB,
      unlockedHeroes: ['cloud_ff7', 'isaac'], activeTeam: ['cloud_ff7'],
      heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {},
      heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true
    };
    const host = document.body.appendChild(document.createElement('div'));
    host.style.padding = '8px';
    document.getElementById('root').style.display = 'none';
    function Session() {
      const [paused, setPaused] = React.useState(false);
      const [collection, setCollection] = React.useState({ archives: [], customBattlePreset: { mode: 'Tactics', playerTeamIds: ['cloud_ff7'], opponentControl: 'p2', items: false, tacticsBattlefieldId: 'auto' } });
      window.terrainUiCollection = collection;
      return React.createElement(React.Fragment, null,
        React.createElement('button', { type: 'button', id: 'terrain-ui-review-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le terrain' : 'Pause du terrain'),
        React.createElement(CustomBattleMode, { ...props, portalCollection: collection, setPortalCollection: setCollection, sessionPaused: paused }));
    }
    window.terrainUiRoot = createRoot(host);
    window.terrainUiRoot.render(React.createElement(Session));
  });
  await page.getByLabel('TERRAIN TACTIQUE', { exact: true }).waitFor();
}
const actorSnapshot = () => {
  const engine = window.terrainUiEngine;
  return JSON.stringify({ actors: [...engine.heroes, ...engine.enemies].map(unit => [unit.id, unit.runtimeId, unit.gridX, unit.gridY, unit.surfaceId, unit.currentHp]), spent: engine.movementSpent, phase: engine.actionPhase });
};

let failure = null, browserClosedAt = null;
const ids = ['ff7_mt_nibel_tactics', 'ff13_archylte_steppe_tactics', 'ff15_vesperpool_tactics', 'lotr_caradhras_tactics', 'lotr_ithilien_tactics', 'darksouls_darkroot_tactics', 'masseffect_therum_tactics', 'halo_valhalla_tactics'];
try {
  for (const fieldId of (process.env.TACTICS_UNIVERSE_ONLY ? process.env.TACTICS_UNIVERSE_ONLY.split(',') : [...ids, 'nexus_skybridge', 'training_grid'])) {
    await mount();
    const field = page.getByLabel('TERRAIN TACTIQUE', { exact: true });
    for (const id of ids) assert.equal(await field.locator(`option[value="${id}"]`).count(), 1, id);
    await field.selectOption(fieldId);
    await page.waitForFunction(id => window.terrainUiCollection.customBattlePreset.tacticsBattlefieldId === id, fieldId);
    await page.getByRole('button', { name: /^LANCER TACTIQUE/ }).click();
    const canvas = page.getByLabel(/^Plateau tactique/);
    await canvas.waitFor({ timeout: 30000 });
    await page.waitForFunction(id => window.terrainUiEngine?.battlefield?.id === id && !window.terrainUiEngine.paused, fieldId);
    if (fieldId !== 'training_grid') await page.getByRole('button', { name: /Taille de Buster Sword/ }).waitFor();
    const actual = await page.evaluate(() => {
      const e = window.terrainUiEngine, f = e.battlefield;
      const points = e.terrain.surfaces.flatMap(surface => window.terrainUiGeometry.getSurfacePolygon(surface, e.verticalTerrain ? e.verticalTerrain.project : (x,y) => e.getPerspectivePoint(x,y)));
      return { fieldId: f.id, mode: e.stage.mode, universe: e.stage.universe, layoutId: f.layoutId,
        biome: e.tacticsEnvironment.biome, environment: e.tacticsEnvironment, vertical: !!e.verticalTerrain,
        camera: e.getCameraState(), cellW: e.cellW, cellH: e.cellH,
        boardBounds: { left: Math.min(...points.map(p=>p.x)), right: Math.max(...points.map(p=>p.x)), top: Math.min(...points.map(p=>p.y)), bottom: Math.max(...points.map(p=>p.y)) },
        source: f.source, materials: [...new Set(e.terrain.surfaces.map(s=>s.materialId))],
        scenery: [...new Set(e.obstacles.map(o=>o.sceneryKind).filter(Boolean))],
        levels: e.getTerrainViewState().levels || [], movementRange: e.movementRange.length,
        objective: e.getObjectiveText(), canvasWidth: e.width, canvasHeight: e.height };
    });
    assert.equal(actual.fieldId, fieldId);
    assert.equal(actual.environment.usesSharedBackdrop, false);
    if (ids.includes(fieldId)) {
      assert.equal(actual.environment.sourceSpecific, true); assert.equal(actual.vertical, true);
      assert.equal(actual.universe, actual.source.universe);
      assert.ok(actual.levels.length > 1); assert.ok(actual.movementRange > 0);
      assert.ok(actual.boardBounds.left >= -1 && actual.boardBounds.right <= actual.canvasWidth+1, 'Source board must fit horizontally: '+JSON.stringify(actual));
      const panel = page.getByRole('region', { name: 'Hauteurs et cases du terrain' });
      await panel.waitFor();
      assert.ok((await panel.innerText()).includes(actual.source.work));
      assert.ok((await panel.innerText()).includes(actual.objective));
      const original = await page.evaluate(actorSnapshot);
      const cut = panel.getByLabel('Coupe du terrain', { exact: true });
      await cut.selectOption(String(actual.levels[0]));
      assert.equal(await page.evaluate(actorSnapshot), original);
      await cut.selectOption('all');
      await panel.getByRole('button', { name: 'Zoomer le plateau', exact: true }).click();
      assert.ok(await page.evaluate(() => window.terrainUiEngine.getCameraState().zoom) > actual.camera.zoom);
      await panel.getByRole('button', { name: /^Recadrer/ }).click();
      assert.equal(await page.evaluate(actorSnapshot), original);
      const inspected = await page.evaluate(() => {
        const e=window.terrainUiEngine, previous=e.getTerrainViewState().selectedSurface?.id;
        for (const cell of [...e.movementRange].sort((a,b)=>a.cost-b.cost)) {
          if (!cell.surfaceId || cell.surfaceId===e.activeUnit.surfaceId) continue;
          const surface=e.terrain.byId.get(cell.surfaceId), point=e.gridToScreen(surface.x,surface.y,true,surface.id);
          if (point.x<10 || point.x>e.width-10 || point.y<10 || point.y>e.height-10 || e.screenToGrid(point.x,point.y)?.surfaceId!==surface.id) continue;
          return { id:surface.id, point, cost:cell.cost, previous };
        }
        throw new Error('No reachable cell is pickable at its actual projected centre');
      });
      const rect=await canvas.boundingBox();
      await canvas.click({position:{x:inspected.point.x*rect.width/actual.canvasWidth,y:inspected.point.y*rect.height/actual.canvasHeight}});
      await page.waitForFunction(id=>window.terrainUiEngine.getTerrainViewState().selectedSurface?.id===id, inspected.id);
      assert.equal(await page.evaluate(actorSnapshot), original, 'Inspection must not spend AP or change actors');
      const selected=await page.evaluate(()=>window.terrainUiEngine.getTerrainViewState().selectedSurface);
      assert.equal(selected.id, inspected.id);
      rows.push({check:'real-canvas-picking-and-view-controls',fieldId,inspected,passed:true});
      if (fieldId==='ff7_mt_nibel_tactics') {
        const before=await page.evaluate(()=>window.terrainUiEngine.movementSpent);
        await page.keyboard.press('Enter');
        await page.waitForFunction(id=>window.terrainUiEngine.activeUnit?.surfaceId===id, inspected.id);
        await page.waitForFunction(()=>window.terrainUiEngine.actionPhase!=='moving');
        const after=await page.evaluate(()=>({spent:window.terrainUiEngine.movementSpent,surfaceId:window.terrainUiEngine.activeUnit.surfaceId,lastMove:window.terrainUiEngine.verticalTerrain.lastMove}));
        assert.equal(after.spent-before, inspected.cost);
        rows.push({check:'real-new-sector-movement-uses-reachable-route-and-exact-AP',fieldId,before,after,passed:true});
      }
    } else assert.equal(actual.environment.sourceSpecific, false);
    await page.getByRole('button', { name: 'Pause du terrain', exact: true }).click();
    await page.waitForFunction(()=>window.terrainUiEngine.paused===true);
    const images=await page.evaluate(()=>window.terrainUiCanvasImages.map(url=>new URL(url).pathname));
    assert.equal(images.some(url=>/background|generated\/stages|stage-backdrop|stage-textures/.test(url)),false,'A shared stage image was drawn in Tactics: '+images.join(','));
    rows.push({check:'real-custom-source-sector-launch-with-dedicated-environment',...actual,images,passed:true});
    await capture(fieldId+'-desktop',canvas);
    console.log(JSON.stringify({ fieldId, desktop: true, passed: true }));
    if(ids.includes(fieldId)){
      await page.setViewportSize({width:375,height:812});
      const panel=page.getByRole('region',{name:'Hauteurs et cases du terrain'});
      const mobile=await panel.evaluate(element=>({left:element.getBoundingClientRect().left,right:element.getBoundingClientRect().right,width:innerWidth,controls:[...element.querySelectorAll('button,select')].map(control=>({width:control.getBoundingClientRect().width,height:control.getBoundingClientRect().height}))}));
      assert.ok(mobile.left>=0&&mobile.right<=mobile.width+1,'Terrain controls overflow on mobile');
      assert.ok(mobile.controls.every(control=>control.width>0&&control.height>=39));
      await capture(fieldId+'-mobile');
      rows.push({check:'mobile375-source-board-and-touch-controls',fieldId,...mobile,passed:true});
      await page.setViewportSize({width:1440,height:1100});
    }
  }
  assert.deepEqual(pageErrors,[]);
} catch(error){
  failure=error.stack||String(error);
  try{await capture('failure');}catch{}
} finally{
  await browser.close(); browserClosedAt=new Date().toISOString();
}
const escaped = value => String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const reviewedSectors = rows.filter(row => row.check === 'real-custom-source-sector-launch-with-dedicated-environment' && ids.includes(row.fieldId));
const gallery = '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Terrains Tactics — contrôle en jeu</title>'
  + '<style>body{margin:0;padding:24px;background:#101d24;color:#e5efea;font:16px/1.5 system-ui}main{max-width:1450px;margin:auto}h1{font-size:28px}article{margin:28px 0;padding:20px;border:1px solid #52796f;border-radius:10px;background:#182a31}h2{margin:0 0 6px;font-size:22px}p{margin:6px 0 18px;color:#bcd2ca}img{display:block;max-width:100%;height:auto;border:1px solid #4a6767}.desktop{width:100%}.mobile{max-width:375px;margin:16px 0}summary{cursor:pointer;padding-top:12px}small{color:#b6c8c3}</style>'
  + '<main><h1>Terrains Tactics — contrôle en jeu</h1><p>' + (preliminary ? 'Contrôle préliminaire' : 'Contrôle après gel des sources') + ' : ' + reviewedSectors.length + ' secteurs lancés depuis le mode personnalisé. Reliefs, matières et environnements dédiés sont visibles dans le vrai GameCanvas. Ces grilles sont des adaptations originales de lieux des œuvres citées ; elles ne sont pas des plans officiels reproduits à l’identique.</p>'
  + reviewedSectors.map(row => '<article><h2>' + escaped(row.source.location) + '</h2><p>' + escaped(row.source.universe) + ' · ' + escaped(row.source.work) + '<br>' + escaped(row.objective) + '</p><img class="desktop" alt="Vue de jeu du terrain ' + escaped(row.source.location) + '" src="' + row.fieldId + '-desktop.png"><details><summary>Vue mobile à 375 pixels</summary><img class="mobile" alt="Commandes et plateau sur mobile" src="' + row.fieldId + '-mobile.png"></details><small>Profil et topologie propres à Tactics · aucune image de fond empruntée aux autres moteurs.</small></article>').join('')
  + '</main></html>';
const galleryPath = path.join(output, 'index.html');
fs.writeFileSync(galleryPath, gallery);
artifacts.push({ path: galleryPath, sha256: sha(fs.readFileSync(galleryPath)), bytes: fs.statSync(galleryPath).size });
const sourceHashesAfter = snapshot();
const stable = JSON.stringify(sourceHashesBefore) === JSON.stringify(sourceHashesAfter);
const harnessStableDuringRun = harnessSha256AtStart === sha(fs.readFileSync(harnessPath));
if (!preliminary && !stable) failure ||= 'Production inputs changed during the final UI browser run';
if (!preliminary && !harnessStableDuringRun) failure ||= 'UI browser harness changed during the final verification';
const report = {
  passed: !failure, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(),
  allBrowserWindowsClosed: true, harness: path.relative(root, harnessPath), harnessSha256: harnessSha256AtStart,
  harnessStableDuringRun,
  actualCustomBattleLaunches: rows.filter(row => row.check === 'real-custom-source-sector-launch-with-dedicated-environment').length,
  actualSourceSectorLaunches: rows.filter(row => row.check === 'real-custom-source-sector-launch-with-dedicated-environment' && ids.includes(row.fieldId)).length,
  actualLegacyControlLaunches: rows.filter(row => row.check === 'real-custom-source-sector-launch-with-dedicated-environment' && !ids.includes(row.fieldId)).length,
  sourceHashesBefore, sourceHashesAfter, productionInputsStableDuringRun: stable,
  pageErrors, rows, artifacts, failure
};
fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, preliminary, actualCustomBattleLaunches: report.actualCustomBattleLaunches, checks: rows.length, stable, output, failure }));
process.exitCode = report.passed ? 0 : 1;
