import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import sharp from 'sharp';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';
import { CG_GALLERY_CATALOG } from '../src/game/cg/cgRosterCatalog.js';
import {
  CG_REVISION_REGISTRY,
  createCgRevisionRegistry,
  resolveCgVersions,
  resolveCurrentCgMedia
} from '../src/game/cg/cgRevisions.js';

const definition = CG_CATALOG.find(({ characterId, type }) => characterId === 'arbiter' && type === 'characterSolo');
const progression = { unlockedHeroes: ['arbiter'] };
const correction = (overrides = {}) => ({
  cgId: definition.id,
  revisionId: 'fidelity-2026-10-18',
  imagePath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-18.webp',
  thumbnailPath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-18-thumb.webp',
  sourcePath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-18.png',
  publishedAt: '2026-10-18',
  backgroundId: 'arbiter-solo-temple-courtyard',
  promptId: 'arbiter-character-solo-fidelity-2026-10-18',
  promptSummary: { fr: 'Harnais argent et anatomie fidèle dans la cour du temple.', en: 'Faithful silver harness and anatomy in a temple courtyard.' },
  sourceRefs: ['/cg/halo/arbiter/character-solo-openai-v1.png'],
  ...overrides
});
const registryFor = (...revisions) => createCgRevisionRegistry({ schemaVersion: 1, revisions });

test('an empty revision registry preserves all eighty-three identities, media and hero unlocks', () => {
  const registry = registryFor();
  assert.equal(CG_CATALOG.length, 83);
  assert.deepEqual(Object.keys(registry), []);
  assert.ok(Object.isFrozen(registry));
  assert.ok(Object.isFrozen(CG_REVISION_REGISTRY));
  for (const entry of CG_CATALOG) {
    const owned = { unlockedHeroes: [entry.characterId] };
    assert.deepEqual(resolveCurrentCgMedia(entry, owned, registry), {
      imagePath: entry.imagePath,
      thumbnailPath: entry.thumbnailPath
    });
    const versions = resolveCgVersions(entry, owned, registry);
    assert.equal(versions.length, 1);
    assert.equal(versions[0].revisionId, 'catalog-original');
    assert.equal(versions[0].isCurrent, true);
  }
});

test('the corrected image becomes current while exact original paths and metadata remain available', () => {
  const before = structuredClone(definition);
  const input = correction();
  const registry = registryFor(input);
  const versions = resolveCgVersions(definition, progression, registry);
  assert.deepEqual(versions.map(({ revisionId, isCurrent }) => ({ revisionId, isCurrent })), [
    { revisionId: input.revisionId, isCurrent: true },
    { revisionId: 'catalog-original', isCurrent: false }
  ]);
  assert.equal(versions[0].sourcePath, input.sourcePath);
  assert.equal(versions[0].promptSummary.fr, input.promptSummary.fr);
  assert.equal(versions[0].publishedAt, '2026-10-18');
  assert.equal(versions[1].imagePath, definition.imagePath);
  assert.equal(versions[1].thumbnailPath, definition.thumbnailPath);
  assert.equal(versions[1].sourcePath, definition.imagePath.replace(/\.webp$/, '.png'));
  assert.strictEqual(versions[1].promptSummary, definition.promptSummary);
  assert.strictEqual(versions[1].sourceRefs, definition.sourceRefs);
  assert.deepEqual(resolveCurrentCgMedia(definition, progression, registry), {
    imagePath: input.imagePath,
    thumbnailPath: input.thumbnailPath
  });
  assert.deepEqual(definition, before);
  assert.ok(Object.isFrozen(versions));
  assert.ok(versions.every(Object.isFrozen));
  assert.ok(Object.isFrozen(registry[definition.id]));
  assert.ok(Object.isFrozen(registry[definition.id][0].promptSummary));
  assert.ok(Object.isFrozen(registry[definition.id][0].sourceRefs));
  assert.notStrictEqual(registry[definition.id][0].promptSummary, input.promptSummary);
});

test('successive corrections retain every prior version in newest-first display order', () => {
  const first = correction();
  const second = correction({
    revisionId: 'fidelity-2026-10-19',
    imagePath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-19.webp',
    thumbnailPath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-19-thumb.webp',
    sourcePath: '/cg/halo/arbiter/revisions/character-solo-fidelity-2026-10-19.png',
    publishedAt: '2026-10-19'
  });
  const versions = resolveCgVersions(definition, progression, registryFor(first, second));
  assert.deepEqual(versions.map(({ revisionId }) => revisionId), [second.revisionId, first.revisionId, 'catalog-original']);
  assert.equal(versions.filter(({ isCurrent }) => isCurrent).length, 1);
});

test('locked heroes expose no original or revision paths and skins still cannot unlock them', () => {
  const registry = registryFor(correction());
  for (const save of [{}, { unlockedHeroes: [] }, { inventory: ['arbiter'], heroSkins: ['arbiter'] }]) {
    assert.deepEqual(resolveCgVersions(definition, save, registry), []);
    assert.deepEqual(resolveCurrentCgMedia(definition, save, registry), { imagePath: null, thumbnailPath: null });
  }
});

test('revision registration rejects overwrites, traversal, unknown identities and out-of-order history', () => {
  assert.throws(() => createCgRevisionRegistry({ schemaVersion: 2, revisions: [] }), /schemaVersion 1/);
  assert.throws(() => registryFor(correction({ cgId: 'cg:unknown' })), /Unknown CG revision identity/);
  assert.throws(() => registryFor(correction({ revisionId: 'catalog-original' })), /revisionId/);
  assert.throws(() => registryFor(correction(), correction()), /Duplicate CG revision/);
  assert.throws(() => registryFor(correction({ imagePath: definition.imagePath })), /preserve existing files/);
  assert.throws(() => registryFor(correction({ sourcePath: definition.imagePath.replace(/\.webp$/, '.png') })), /preserve existing files/);
  assert.throws(() => registryFor(correction({ thumbnailPath: correction().imagePath })), /preserve existing files/);
  assert.throws(() => registryFor(correction({ imagePath: '/cg/halo/arbiter/../../external.webp' })), /local .webp asset/);
  assert.throws(() => registryFor(correction({ sourcePath: 'https://example.com/source.png' })), /local .png asset/);
  assert.throws(() => registryFor(correction({ imagePath: '/cg/halo/masterchief/new.webp' })), /inside \/cg\/halo\/arbiter/);
  assert.throws(() => registryFor(correction({ publishedAt: '2026-01-01' })), /publication order/);
  assert.throws(() => registryFor(correction({ publishedAt: '18/10/2026' })), /YYYY-MM-DD/);
  assert.throws(() => registryFor(correction({ promptSummary: { es: 'Una corrección.' } })), /localized fr or en/);
  assert.throws(() => registryFor(correction({ sourceRefs: [] })), /at least one reference/);
});

test('background identities cannot be shared by different CG illustrations', () => {
  const next = CG_CATALOG.find(({ characterId, type }) => characterId === 'arbiter' && type === 'victoryPose');
  assert.throws(() => registryFor(correction(), correction({
    cgId: next.id,
    imagePath: '/cg/halo/arbiter/revisions/victory-fidelity-2026-10-18.webp',
    thumbnailPath: '/cg/halo/arbiter/revisions/victory-fidelity-2026-10-18-thumb.webp',
    sourcePath: '/cg/halo/arbiter/revisions/victory-fidelity-2026-10-18.png'
  })), /Each CG must use a different backgroundId/);
});

test('every published revision delivers distinct source bytes and complete RGB portrait assets', async () => {
  const revisions = Object.values(CG_REVISION_REGISTRY).flat();
  const sourceDigests = new Set();
  if (revisions.length) {
    for (const entry of CG_GALLERY_CATALOG) {
      const source = await readFile(new URL(`../public${entry.imagePath.replace(/\.webp$/, '.png')}`, import.meta.url));
      sourceDigests.add(createHash('sha256').update(source).digest('hex'));
    }
  }
  for (const revision of revisions) {
    for (const [field, format, width, height] of [
      ['sourcePath', 'png', null, null],
      ['imagePath', 'webp', 1536, 2048],
      ['thumbnailPath', 'webp', 384, 512]
    ]) {
      const asset = new URL(`../public${revision[field]}`, import.meta.url);
      const bytes = await readFile(asset);
      assert.ok(bytes.length > 0, `${revision[field]} must not be empty`);
      const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
      assert.equal(metadata.format, format, `${revision[field]} format`);
      assert.equal(metadata.channels, 3, `${revision[field]} must be RGB`);
      assert.equal(metadata.hasAlpha, false, `${revision[field]} must not have alpha`);
      assert.equal(metadata.width * 4, metadata.height * 3, `${revision[field]} exact 3:4 ratio`);
      if (width) {
        assert.equal(metadata.width, width, `${revision[field]} width`);
        assert.equal(metadata.height, height, `${revision[field]} height`);
      } else {
        assert.ok(metadata.width >= 1000 && metadata.height >= 1300, `${revision[field]} source detail`);
        const digest = createHash('sha256').update(bytes).digest('hex');
        assert.equal(sourceDigests.has(digest), false, `${revision[field]} must be a distinct correction`);
        sourceDigests.add(digest);
      }
    }
  }
});

let vite;
let CgGallery;
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null } });
  ({ default: CgGallery } = await vite.ssrLoadModule('/src/components/cg/CgGallery.jsx'));
});
after(async () => { await vite?.close(); });

test('the gallery renders the correction thumbnail under the original CG card and retains a variant note', () => {
  const input = correction();
  const html = renderToStaticMarkup(React.createElement(CgGallery, {
    entries: [definition],
    unlockedHeroes: ['arbiter'],
    revisionRegistry: registryFor(input)
  }));
  assert.equal((html.match(/<article /g) || []).length, 1);
  assert.ok(html.includes(`src="${input.thumbnailPath}"`));
  assert.ok(!html.includes(`src="${definition.thumbnailPath}"`));
  assert.match(html, /1 variante\(s\) antérieure\(s\)/);
  assert.match(html, /1\/1 déverrouillées/);
});

test('locked and regulated gallery cards never request correction media', () => {
  const input = correction();
  const registry = registryFor(input);
  const render = (props) => renderToStaticMarkup(React.createElement(CgGallery, { entries: [definition], revisionRegistry: registry, ...props }));
  const locked = render({ unlockedHeroes: [] });
  assert.match(locked, /HÉROS REQUIS/);
  assert.equal(locked.includes(input.imagePath), false);
  assert.equal(locked.includes(input.thumbnailPath), false);
  assert.equal(locked.includes(definition.imagePath), false);
  const regulated = render({ unlockedHeroes: ['arbiter'], hiddenUniverses: ['Halo'] });
  assert.equal(regulated.includes(input.thumbnailPath), false);
  assert.equal((regulated.match(/<article /g) || []).length, 0);
});

test('the date filter offers the current correction date even for a locked hero without exposing media', () => {
  const input = correction({ publishedAt: '2026-10-18' });
  const registry = registryFor(input);
  for (const unlockedHeroes of [[], ['arbiter']]) {
    const html = renderToStaticMarkup(React.createElement(CgGallery, {
      entries: [definition],
      unlockedHeroes,
      revisionRegistry: registry
    }));
    assert.ok(html.includes('<option value="2026-10-18">2026-10-18</option>'));
    assert.equal(html.includes(`<option value="${definition.publishedAt}">${definition.publishedAt}</option>`), false);
    if (unlockedHeroes.length === 0) {
      assert.match(html, /HÉROS REQUIS/);
      for (const mediaPath of [input.imagePath, input.thumbnailPath, input.sourcePath, definition.imagePath, definition.thumbnailPath]) {
        assert.equal(html.includes(mediaPath), false, `${mediaPath} must stay absent while locked`);
      }
    }
  }
  const versions = resolveCgVersions(definition, progression, registry);
  assert.deepEqual(versions.map(version => version.publishedAt), ['2026-10-18', definition.publishedAt], 'Historical variant dates must remain intact.');
});
