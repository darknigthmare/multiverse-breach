import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import sharp from 'sharp';

// These tests use Chromium's real Image decoder and Canvas implementation.
// The reviewed rectangle must already exist; missing delivery is a failure.
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let vite, browser, page, atlas, region, sourceAlpha;

before(async () => {
  const registry = JSON.parse(await readFile('src/game/combat/characterAnimationsWave17PartC.generated.json'));
  const anchors = JSON.parse(await readFile('src/game/combat/nativeSuperAnchorsWave17PartC.generated.json'));
  atlas = registry.entries.find(entry => entry.heroId === 'joe_gomamon');
  region = anchors.joe_gomamon?.projectileRegion;
  assert.ok(atlas && region, 'Actual Joe/Gomamon atlas and reviewed fish rectangle are still pending');
  assert.equal(region.reviewed, true); assert.equal(region.newDrawing, false);
  assert.equal(region.kind, 'actual-native-fish-group'); assert.equal(region.fishCount, 3);
  assert.equal(region.phase, 'super'); assert.equal(region.row, 7);
  assert.equal(region.column, 2); assert.equal(region.col, 2); assert.equal(region.coordinateSpace, 'atlas');
  assert.equal(region.sheet, atlas.sheet); assert.equal(region.atlasSha256, atlas.sha256);
  const bytes = await readFile('public' + atlas.sheet);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), region.atlasSha256);
  const dimensions = await sharp(bytes).metadata();
  assert.equal(dimensions.width, 1024); assert.equal(dimensions.height, 2048);
  const { left, top, width, height } = region.rect;
  assert.ok([left, top, width, height].every(Number.isInteger));
  assert.ok(left >= 512 && top >= 1792 && width > 0 && height > 0 && left + width <= 768 && top + height <= 2048);
  const { data } = await sharp(bytes).extract(region.rect).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  sourceAlpha = Array.from(data.filter((_value, index) => index % 4 === 3));
  assert.ok(sourceAlpha.some(alpha => alpha > 24), 'The actual reviewed fish crop is empty');
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent',
    cacheDir: '/tmp/w17-projectile-region-browser-tests',
    plugins: [{ name: 'static-projectile-test-inputs', configResolved(config) { config.server.watch = null; } }],
    server: { host: '127.0.0.1', port: Number(process.env.WAVE17_PROJECTILE_TEST_PORT || 5194), strictPort: true, hmr: false, watch: null } });
  await vite.listen();
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  page = await browser.newPage();
  await page.route('**/__w17_projectile_test__', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Actual native fish crop test</title>' }));
  await page.goto(vite.resolvedUrls.local[0] + '__w17_projectile_test__');
  await page.evaluate(async sheet => {
    const renderer = await import('/src/game/renderer.js');
    renderer.preloadSpriteSheetSrcs([sheet]);
    const image = new Image(); image.src = sheet; await image.decode();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    window.recordFishDraw = draw => {
      const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 640;
      const ctx = canvas.getContext('2d'), calls = [], paths = [], original = ctx.drawImage.bind(ctx);
      ctx.drawImage = (image, ...args) => {
        const matrix = ctx.getTransform();
        calls.push({ sheet: new URL(image.currentSrc || image.src).pathname, args,
          decoded: image.complete && image.naturalWidth > 0,
          transform: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f } });
        return original(image, ...args);
      };
      for (const method of ['arc', 'ellipse', 'lineTo', 'closePath']) {
        const originalMethod = ctx[method].bind(ctx);
        ctx[method] = (...args) => { paths.push(method); return originalMethod(...args); };
      }
      const returned = draw(ctx), matrix = ctx.getTransform();
      return { returned, calls, paths, canvas, balanced: matrix.a === 1 && matrix.d === 1 && matrix.e === 0 && matrix.f === 0 && ctx.globalAlpha === 1 };
    };
  }, atlas.sheet);
});
after(async () => { await browser?.close(); await vite?.close(); });

test('the real renderer decodes the source PNG and draws only its reviewed crop in both facings', async () => {
  const samples = [];
  for (const facing of [1, -1]) {
    const result = await page.evaluate(async ({ region, facing }) => {
      const { drawNativeProjectileRegionWave17 } = await import('/src/game/combat/nativeProjectileRegionWave17.js');
      const { width, height } = region.rect, x = 256 + (width % 2) / 2, y = 256 + (height % 2) / 2;
      const result = window.recordFishDraw(ctx => drawNativeProjectileRegionWave17(ctx, region, x, y, 1, facing));
      return { returned: result.returned, calls: result.calls, paths: result.paths, balanced: result.balanced,
        pixels: Array.from(result.canvas.getContext('2d').getImageData(x - width / 2, y - height / 2, width, height).data) };
    }, { region, facing });
    assert.equal(result.returned, true); assert.equal(result.balanced, true); assert.deepEqual(result.paths, []);
    assert.equal(result.calls.length, 1);
    const draw = result.calls[0], { left, top, width, height } = region.rect;
    assert.equal(draw.sheet, atlas.sheet); assert.equal(draw.decoded, true);
    assert.deepEqual(draw.args.slice(0, 4), [left, top, width, height]);
    assert.equal(draw.transform.a, facing); assert.equal(draw.transform.d, 1);
    samples.push(result.pixels);
  }
  const { width, height } = region.rect;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const index = (y * width + x) * 4, opposite = (y * width + width - x - 1) * 4;
    assert.equal(samples[0][index + 3], sourceAlpha[y * width + x], 'Canvas alpha differs from the real PNG crop');
    for (let channel = 0; channel < 4; channel++) assert.equal(samples[0][index + channel], samples[1][opposite + channel], 'Mirroring changed a source pixel');
  }
});

test('altered SHA, row, column, fish count or rectangle cannot draw another body region', async () => {
  const result = await page.evaluate(async region => {
    const { drawNativeProjectileRegionWave17 } = await import('/src/game/combat/nativeProjectileRegionWave17.js');
    const variants = [null, { ...region, reviewed: false }, { ...region, reviewed: 'yes' }, { ...region, newDrawing: true },
      { ...region, kind: 'orb' }, { ...region, fishCount: 2 }, { ...region, phase: 'fatality' }, { ...region, row: 6 },
      { ...region, column: 1 }, { ...region, col: 1 }, { ...region, coordinateSpace: 'cell' },
      { ...region, atlasSha256: '0'.repeat(64) }, { ...region, sheet: region.sheet + '.unbound' },
      { ...region, rect: { left: 512, top: 1792, width: 256, height: 256 } },
      { ...region, rect: { ...region.rect, left: 768 } }, { ...region, rect: { ...region.rect, top: 1791 } },
      { ...region, rect: { ...region.rect, width: region.rect.width - 1 } },
      { ...region, rect: { ...region.rect, left: region.rect.left + .25 } }];
    const results = variants.map(value => window.recordFishDraw(ctx => drawNativeProjectileRegionWave17(ctx, value, 256, 256, 1, 1)));
    for (const [x, y, scale, facing] of [[NaN, 256, 1, 1], [256, Infinity, 1, 1], [256, 256, 0, 1], [256, 256, NaN, 1], [256, 256, 1, 0]])
      results.push(window.recordFishDraw(ctx => drawNativeProjectileRegionWave17(ctx, region, x, y, scale, facing)));
    return results.map(result => ({ returned: result.returned, draws: result.calls.length, balanced: result.balanced }));
  }, region);
  assert.equal(result.length, 23);
  assert.ok(result.every(row => row.returned === false && row.draws === 0 && row.balanced));
});

for (const facing of [1, -1]) test(`Joe facing${facing}: actual fish pixels replace generic flight and accepted RPG/Melee release feedback`, async () => {
  const result = await page.evaluate(async ({ facing, region }) => {
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const { resolveMeleeSuper } = await import('/src/game/combatIdentity.js');
    const { getNativeSuperVisualStateWave17, drawNativeSuperVisualsWave17 } = await import('/src/game/combat/nativeSuperVisualsWave17.js');
    const actor = { ...structuredClone(HEROES_DB.find(hero => hero.id === 'joe_gomamon')), x: 180, y: 360, facing, currentHp: 73, meter: 100 };
    const profile = resolveMeleeSuper(actor), target = { x: actor.x + facing * 240, y: actor.y, currentHp: 90 };
    const duration = profile.duration, hitAt = profile.hitAt;
    const render = (elapsed, contact = true, tracked = false) => {
      const action = { duration, hitAt, elapsed, facing }, before = JSON.stringify({ actor, profile, target, action });
      const state = getNativeSuperVisualStateWave17({ actor, profile, action, target, height: 72,
        contactVisual: contact ? { confirmed: true, x: target.x, y: target.y } : { confirmed: false },
        ...(tracked ? { projectileVisual: { phase: 'flight', x: 320, y: 260, elapsed: .05, duration: .3 } } : {}) });
      const result = window.recordFishDraw(ctx => drawNativeSuperVisualsWave17(ctx, state));
      return { calls: result.calls, paths: result.paths, balanced: result.balanced,
        pure: JSON.stringify({ actor, profile, target, action }) === before, phase: state.nativeAnchor?.col, release: state.release };
    };
    return { tracked: render(hitAt + .02, true, true), accepted: render(hitAt + .02),
      preparation: render(hitAt - .02), miss: render(hitAt + .02, false), expired: render(hitAt + (duration - hitAt) * .6) };
  }, { facing, region });
  for (const key of ['tracked', 'accepted']) {
    const sample = result[key]; assert.equal(sample.calls.length, 1, key);
    assert.equal(sample.calls[0].sheet, atlas.sheet);
    assert.deepEqual(sample.calls[0].args.slice(0, 4), [region.rect.left, region.rect.top, region.rect.width, region.rect.height]);
    assert.equal(Math.sign(sample.calls[0].transform.a), facing);
    assert.deepEqual(sample.paths, [], key + ': flight painted an orb, line or replacement creature');
    assert.equal(sample.phase, 2); assert.equal(sample.balanced, true); assert.equal(sample.pure, true);
  }
  for (const key of ['preparation', 'miss', 'expired']) {
    assert.equal(result[key].calls.length, 0, key + ': fish crop escaped its actual release/contact window');
    assert.equal(result[key].balanced, true); assert.equal(result[key].pure, true);
  }
});
