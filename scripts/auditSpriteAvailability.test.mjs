import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSpriteAvailability } from './buildSpriteAvailability.mjs';
const manifestText = readFileSync(new URL('../public/sprites/generated/sprite-manifest.json', import.meta.url), 'utf8');
const manifest = JSON.parse(manifestText);
const runtimeText = readFileSync(new URL('../public/sprites/generated/sprite-availability.json', import.meta.url), 'utf8');
const runtime = JSON.parse(runtimeText);

test('runtime availability matches every available path and source, including aliases', () => {
  assert.deepEqual(runtime, buildSpriteAvailability(manifest));
  const expected = new Map(manifest.entries.filter(entry => entry.available).map(entry => [entry.output, entry.source || null]));
  const actual = new Map(runtime.groups.flatMap(group => group.outputs.map(output => [output, group.source])));
  assert.equal(actual.size, expected.size);
  for (const [output, source] of expected) assert.equal(actual.get(output), source, output);
});

test('unknown and unavailable entries are not promoted; duplicate paths keep the original map semantics', () => {
  const index = buildSpriteAvailability({ entries: [
    { output: '/a', available: true, source: 'first' },
    { output: '/missing', available: false },
    { output: '/a', available: true, source: 'last' },
    { output: '/a', available: false, source: 'ignored' },
    { output: '/no-source', available: true }
  ] });
  const map = new Map(index.groups.flatMap(group => group.outputs.map(output => [output, group.source])));
  assert.equal(map.get('/a'), 'last'); assert.equal(map.get('/no-source'), null);
  assert.equal(map.has('/missing'), false); assert.equal(index.count, 2);
});

test('UI index removes provenance details without deleting or rewriting the full manifest', () => {
  assert.ok(Buffer.byteLength(runtimeText) < Buffer.byteLength(manifestText) * 0.1);
  assert.deepEqual(Object.keys(runtime).sort(), ['count', 'groups', 'version']);
  for (const group of runtime.groups) assert.deepEqual(Object.keys(group).sort(), ['outputs', 'source']);
  assert.ok(manifest.entries.some(entry => entry.provenanceStatus));
  const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(hub, /import\s+spriteManifest/);
  assert.match(hub, /sprite-availability\.json/);
  for (const mode of ['RaceMode', 'FighterMode', 'CustomBattleMode']) {
    assert.ok(hub.includes(`const ${mode} = lazy(`), mode);
    assert.match(hub, new RegExp(`<Suspense[^]*?<${mode}`));
  }
});
