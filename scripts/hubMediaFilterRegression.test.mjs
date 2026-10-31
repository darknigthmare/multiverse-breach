import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');

test('collection diagnostics can label hidden media types before the helper declaration', () => {
  const diagnostic = source.split('\n').find(line =>
    line.includes('if (lore && !matchesMediaFilter(lore.mediaType)) reasons.push(')
  );
  const helper = source.match(/function getMediaTypeLabel\(mediaType\) \{[\s\S]*?\n  \}/)?.[0];
  assert.ok(diagnostic, 'the production filter diagnostic must still be exercised');
  assert.ok(helper, 'the label helper must be a hoisted declaration, not a temporal-dead-zone const');
  assert.ok(source.indexOf(diagnostic) < source.indexOf(helper), 'the test covers the early diagnostic path');

  // Execute production expressions in their original source order. This
  // reproduces the filter crash without mounting the entire 525-world hub.
  const renderDiagnostic = new Function('lang', 'mediaFilter', 'lore', [
    'const reasons = [];',
    "const matchesMediaFilter = type => mediaFilter === 'all' || type === mediaFilter || (mediaFilter === 'movie' && type === 'series');",
    diagnostic,
    helper,
    'return reasons;'
  ].join('\n'));
  assert.deepEqual(renderDiagnostic('fr', 'movie', { mediaType: 'game' }), ['Filtre media actif: Movie']);
  assert.deepEqual(renderDiagnostic('en', 'movie', { mediaType: 'game' }), ['Active media filter: Movie']);
  assert.deepEqual(renderDiagnostic('fr', 'music', { mediaType: 'game' }), ['Filtre media actif: Musique']);
  assert.deepEqual(renderDiagnostic('en', 'music', { mediaType: 'game' }), ['Active media filter: Music']);
  assert.deepEqual(renderDiagnostic('fr', 'movie', { mediaType: 'series' }), [], 'movie filter includes TV series');
  assert.deepEqual(renderDiagnostic('fr', 'all', { mediaType: 'game' }), [], 'no warning on the all-media filter');
});
