import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { parseCgRosterProductionMode } = await import('./buildCgRosterProductionPlan.mjs');

test('production modes preserve strict full-media check and explicit metadata-only routing', () => {
  assert.equal(parseCgRosterProductionMode([]), 'write');
  assert.equal(parseCgRosterProductionMode(['--write']), 'write');
  assert.equal(parseCgRosterProductionMode(['--check']), 'check');
  assert.equal(parseCgRosterProductionMode(['--check-metadata']), 'check-metadata');
});

test('conflicting or unknown CLI modes fail before any build or write', () => {
  for (const args of [ ['--check', '--check-metadata'], ['--check-metadata', '--write'], ['--write', '--check'],
    ['--check-metadata', '--check-metadata'], ['--metadata-check'], ['--check', '--unknown'] ]) {
    assert.throws(() => parseCgRosterProductionMode(args));
  }
});
