import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getHeroSpriteSheetSources } from '../src/game/spriteAssets.js';
import { getDisciplineCostumes, DISCIPLINE_UNIVERSE } from '../src/game/disciplineSprites.js';

let vite;
let moduleSerial = 0;
const originalImage = globalThis.Image;
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
});
after(async () => {
  if (originalImage === undefined) delete globalThis.Image;
  else globalThis.Image = originalImage;
  await vite?.close();
});

const nexusHeroes = ['player_anchor', 'arca_mirelle', 'arca_bastion'].map(id => ({ id, universe: 'Nexus de Convergence' }));
// Controlled image decoding metadata from the existing Nexus PNGs. These are
// renderer contracts, not an asset/fidelity audit or a native browser capture.
const nexusMetadata = new Map(nexusHeroes.map((hero, i) => [
  getHeroSpriteSheetSources(hero, 'nexus')[0], [[1024, 1024], [845, 1862], [1254, 1254]][i]
]));

async function loadRenderer({ pending = new Set(), failed = new Set(), metadata = nexusMetadata } = {}) {
  const requested = [], images = new Map();
  globalThis.Image = class {
    set src(value) {
      this.currentSrc = value;
      this.complete = false;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      requested.push(value);
      images.set(value, this);
      this.resolve = () => {
        [this.naturalWidth, this.naturalHeight] = metadata.get(value) || [1254, 1254];
        this.complete = true;
        this.onload?.();
      };
      this.reject = () => { this.complete = true; this.onerror?.(); };
      if (failed.has(value)) this.reject();
      else if (!pending.has(value)) this.resolve();
    }
    get src() { return this.currentSrc; }
  };
  return { ...(await vite.ssrLoadModule(`/src/game/renderer.js?generated-bounds=${++moduleSerial}`)), requested, images };
}

function canvas() {
  const images = [], calls = [], stack = [];
  let transform = { a: 1, b: 0, c: 0, d: 1, x: 0, y: 0 };
  const context = {
    canvas: { isConnected: true },
    save() { stack.push({ ...transform }); },
    restore() { transform = stack.pop(); },
    translate(x, y) { transform.x += transform.a * x + transform.c * y; transform.y += transform.b * x + transform.d * y; },
    scale(x, y) { transform.a *= x; transform.b *= x; transform.c *= y; transform.d *= y; },
    rotate(angle) {
      const { a, b, c, d } = transform, sin = Math.sin(angle), cos = Math.cos(angle);
      Object.assign(transform, { a: a * cos + c * sin, b: b * cos + d * sin, c: c * cos - a * sin, d: d * cos - b * sin });
    },
    drawImage(image, sx, sy, sw, sh, x, y, width, height) {
      const points = [[x, y], [x + width, y], [x, y + height], [x + width, y + height]].map(([px, py]) => ({
        x: transform.a * px + transform.c * py + transform.x,
        y: transform.b * px + transform.d * py + transform.y
      }));
      const left = Math.min(...points.map(p => p.x)), top = Math.min(...points.map(p => p.y));
      images.push({ src: image.currentSrc, source: { sx, sy, sw, sh }, rect: {
        x: left, y: top, width: Math.max(...points.map(p => p.x)) - left, height: Math.max(...points.map(p => p.y)) - top
      } });
    }
  };
  return { images, calls, ctx: new Proxy(context, { get(target, key) {
    return key in target ? target[key] : (...args) => { calls.push([key, ...args]); };
  } }) };
}

const sameRect = (actual, expected, detail) => {
  assert.ok(actual, detail);
  for (const key of ['x', 'y', 'width', 'height']) {
    assert.ok(Math.abs(actual[key] - expected[key]) < 1e-8, `${detail}: ${key} ${actual[key]} != ${expected[key]}`);
  }
};

test('generated bounds match real drawImage rectangles for Anchor, Mirelle and wide Bastion in both City states and facings', async () => {
  const { drawPixelSprite, getGeneratedSpriteBounds, requested } = await loadRenderer();
  const mirelleWidths = new Map();
  for (const hero of nexusHeroes) for (const state of ['idle', 'run']) for (const facing of [-1, 1]) for (const tick of [0, 13, 51]) {
    const actor = { ...hero, state }, before = structuredClone(actor);
    const { ctx, images, calls } = canvas();
    const x = 547.25, y = 338.5 + 24 + Math.sin(tick * 0.12 + x * 0.01) * 1.4;
    drawPixelSprite(ctx, x, y, actor, tick, facing, 78, 'nexus');
    assert.equal(images.length, 1, 'the production generated-sheet draw is the comparison oracle');
    const requestCount = requested.length, callCount = calls.length;
    const bounds = getGeneratedSpriteBounds(x, y, actor, tick, 78, 'nexus');
    sameRect(bounds, images[0].rect, `${hero.id}/${state}/${facing}/${tick}`);
    assert.equal(requested.length, requestCount, 'reading must not start another image request');
    assert.equal(calls.length, callCount, 'reading must not invoke drawing or effects');
    assert.deepEqual(actor, before, 'no actor or save fields are changed');
    if (hero.id === 'arca_mirelle') mirelleWidths.set(state, bounds.width);
    if (hero.id === 'arca_bastion') assert.equal(bounds.width, 156, 'wide sheet is not reduced to a fixed player radius');
  }
  assert.ok(mirelleWidths.get('run') > mirelleWidths.get('idle'), 'the current-state crop changes the protected width');
});

test('a bounds read stays null before loading and while pending, then follows the actual onload redraw without requesting an image', async () => {
  const actor = { ...nexusHeroes[1], state: 'run' }, source = getHeroSpriteSheetSources(actor, 'nexus')[0];
  const { drawPixelSprite, getGeneratedSpriteBounds, requested, images: loaded } = await loadRenderer({ pending: new Set([source]) });
  assert.equal(getGeneratedSpriteBounds(100, 150, actor, 13, 78, 'nexus'), null);
  assert.deepEqual(requested, [], 'reading a missing cache entry is side-effect free');
  const { ctx, images } = canvas();
  drawPixelSprite(ctx, 100, 150, actor, 13, 1, 78, 'nexus');
  assert.equal(images.length, 0);
  assert.equal(getGeneratedSpriteBounds(100, 150, actor, 13, 78, 'nexus'), null);
  assert.deepEqual(requested, [source]);
  loaded.get(source).resolve();
  assert.equal(images.length, 1, 'the original renderer callback performs its existing redraw');
  sameRect(getGeneratedSpriteBounds(100, 150, actor, 13, 78, 'nexus'), images[0].rect, 'loaded current crop');
  assert.deepEqual(requested, [source]);
});

test('pending first candidate hides a cached fallback, and a real load error changes the measured source without rewriting the selected variant', async () => {
  const base = { id: 'discipline_saori_otokawa', universe: DISCIPLINE_UNIVERSE, state: 'idle' };
  const costume = getDisciplineCostumes(base).find(row => !row.isDefault);
  assert.ok(costume);
  const actor = { ...base, disciplineSpriteId: costume.id };
  const sources = getHeroSpriteSheetSources(actor, 'nexus');
  assert.ok(sources.length > 1);
  const metadata = new Map(sources.map((src, index) => [src, index ? [1536, 1024] : [1254, 1254]]));
  const { drawPixelSprite, getGeneratedSpriteBounds, requested, images: loaded } = await loadRenderer({ pending: new Set([sources[0]]), metadata });
  const cachedFallback = canvas();
  drawPixelSprite(cachedFallback.ctx, 100, 150, base, 0, 1, 78, 'nexus');
  assert.equal(cachedFallback.images.length, 1);
  const { ctx, images } = canvas();
  drawPixelSprite(ctx, 100, 150, actor, 0, -1, 78, 'nexus');
  const requestsBeforeRead = [...requested];
  assert.equal(images.length, 0);
  assert.equal(getGeneratedSpriteBounds(100, 150, actor, 0, 78, 'nexus'), null, 'loading first choice still owns the draw');
  assert.deepEqual(requested, requestsBeforeRead);
  loaded.get(sources[0]).reject();
  assert.equal(images.length, 1, 'the existing error callback draws the actual next source');
  assert.equal(images[0].src, sources[1]);
  sameRect(getGeneratedSpriteBounds(100, 150, actor, 0, 78, 'nexus'), images[0].rect, 'selected fallback');
  assert.equal(actor.disciplineSpriteId, costume.id);
  const after = [...requested];
  getGeneratedSpriteBounds(100, 150, actor, 0, 78, 'nexus');
  assert.deepEqual(requested, after);
});

test('fully unavailable generated art returns null while the existing procedural draw continues', async () => {
  const actor = { ...nexusHeroes[0], state: 'run' }, sources = getHeroSpriteSheetSources(actor, 'nexus');
  const { drawPixelSprite, getGeneratedSpriteBounds, requested } = await loadRenderer({ failed: new Set(sources) });
  const { ctx, images, calls } = canvas();
  drawPixelSprite(ctx, 100, 150, actor, 13, 1, 78, 'nexus');
  assert.equal(images.length, 0);
  assert.ok(calls.some(call => call[0] === 'fillRect'), 'procedural art remains unchanged');
  assert.equal(getGeneratedSpriteBounds(100, 150, actor, 13, 78, 'nexus'), null);
  assert.deepEqual(requested, sources);
});
