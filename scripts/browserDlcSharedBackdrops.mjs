import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { buildDlcDistributionPlan, resolveDlcSelection } from './dlcDistribution.mjs';
import { readDlcSharedDependencies, REVIEWED_SHARED_POLICY } from './dlcSharedAssetDependencies.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const dependencies = readDlcSharedDependencies({ root, required: true });
const name = process.env.DLC_BACKDROP_PROFILE || 'base';
if (!['base', 'halo', 'consumers'].includes(name)) throw new Error('Unknown backdrop fixture profile');
const packIds = name === 'base' ? [] : name === 'halo' ? ['halo'] : [...new Set(dependencies.assets.flatMap(asset => asset.packIds))];
const profile = { schemaVersion: 1, mode: name === 'base' ? 'base' : 'selected', packIds, sharedPolicy: REVIEWED_SHARED_POLICY };
const plan = buildDlcDistributionPlan({ root, selection: resolveDlcSelection({ manifests: DLC_PACK_MANIFESTS, profile }) });
const assets = new Map(plan.assets.map(asset => [asset.publicPath, asset.sourcePath]));
const fixture = path.resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || path.join(root, '.tmp/dlc-backdrops-' + name));
const evidence = path.resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || path.join(root, '.tmp/dlc-backdrops-evidence', name));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'],
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const report = { profile: name, browser: browser.version(), scope: 'Real transformed renderer and real repository media served only from the selected distribution plan; not a complete exported App playthrough.',
  excludedShared: plan.excludedSharedAssets.map(asset => asset.publicPath), decoded: [], renders: [], errors: [], missing: [], status: 'running' };
try {
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.missing.push(response.url()); });
  await context.route('http://dlc-backdrops.test/**', async route => {
    const url = new URL(route.request().url());
    const canonical = assets.get(url.pathname);
    const file = canonical ? path.join(root, canonical) : path.resolve(fixture, '.' + url.pathname);
    const relative = path.relative(canonical ? root : fixture, file);
    if (relative === '..' || relative.startsWith('..' + path.sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
    try { await route.fulfill({ body: await readFile(file), contentType: types[path.extname(file)] || 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: 'Not included in the selected distribution' }); }
  });
  await page.goto('http://dlc-backdrops.test/scripts/fixtures/dlc-shared-backdrops.html');
  await page.waitForFunction(() => Boolean(window.__sharedDlcBackdrops));
  const state = await page.evaluate(() => ({ installation: window.__sharedDlcBackdrops.installation,
    cases: window.__sharedDlcBackdrops.cases, optional: window.__sharedDlcBackdrops.optional }));
  assert.deepEqual(state.installation.installedPackIds, plan.selection.packIds);
  assert.equal(state.optional.length, name === 'consumers' ? 14 : 0);
  for (const src of [...new Set(['/backgrounds/halo-tactics-openai.png', '/backgrounds/stargate-rpg-openai.png',
    ...state.optional, ...state.cases.map(entry => entry.src).filter(Boolean)])]) {
    assert.ok(assets.has(src), 'actual renderer requests a delivered asset: ' + src);
    report.decoded.push(await page.evaluate(src => window.__sharedDlcBackdrops.decode(src), src));
  }
  for (const entry of state.cases) {
    const rendered = await page.evaluate(entry => window.__sharedDlcBackdrops.render(entry), entry);
    report.renders.push(rendered);
    assert.equal(rendered.pixel[3], 255, 'scene paints an opaque backdrop');
    if (entry.src) {
      assert.equal(rendered.renderedImage, true, entry.universe + ' renders its actual image');
      assert.ok(rendered.draws.some(draw => draw.src && new URL(draw.src).pathname === entry.src && draw.width > 0 && draw.height > 0));
    }
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.missing, []);
  await page.screenshot({ path: path.join(evidence, 'renderer.png') });
  report.status = 'passed';
  await context.close();
} catch (error) { report.error = error.message; throw error; }
finally {
  await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
console.log(JSON.stringify({ profile: name, status: report.status, decoded: report.decoded.length,
  renders: report.renders.length, omittedShared: report.excludedShared.length }));
