import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  ATLAS_HEIGHT,
  ATLAS_WIDTH,
  CELL_GUARD_PIXELS,
  CELL_SIZE,
  inspectAtlasCellGuards,
  parseCosmeticAtlasCellGuardArguments
} from './cosmeticAtlasCellGuardAudit.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

const buildGuardedPixels = (violations = []) => {
  const channels = 4;
  const data = Buffer.alloc(ATLAS_WIDTH * ATLAS_HEIGHT * channels);
  for (let column = 0; column < 4; column += 1) {
    for (let y = 32; y < CELL_SIZE - 32; y += 1) {
      for (let x = 32; x < CELL_SIZE - 32; x += 1) {
        const offset = (y * ATLAS_WIDTH + column * CELL_SIZE + x) * channels;
        data[offset] = 40 + column * 20;
        data[offset + 1] = 100;
        data[offset + 2] = 180;
        data[offset + 3] = 255;
      }
    }
  }
  for (const { column, x, y, alpha = 255 } of violations) {
    data[(y * ATLAS_WIDTH + column * CELL_SIZE + x) * channels + 3] = alpha;
  }
  return { data, channels };
};

test('pure alpha guard inspection accepts a clean atlas and locates exact edge violations', () => {
  const clean = buildGuardedPixels();
  const accepted = inspectAtlasCellGuards({
    ...clean,
    width: ATLAS_WIDTH,
    height: ATLAS_HEIGHT
  });
  assert.equal(accepted.status, 'ok');
  assert.equal(accepted.cells.length, 4);

  const thresholdAcceptedPixels = buildGuardedPixels([
    { column: 0, x: 50, y: CELL_GUARD_PIXELS - 1, alpha: 16 }
  ]);
  const thresholdAccepted = inspectAtlasCellGuards({
    ...thresholdAcceptedPixels,
    width: ATLAS_WIDTH,
    height: ATLAS_HEIGHT
  });
  assert.equal(thresholdAccepted.status, 'ok');

  const contaminated = buildGuardedPixels([
    { column: 1, x: 100, y: CELL_GUARD_PIXELS - 1, alpha: 17 },
    { column: 2, x: CELL_SIZE - 1, y: 100 }
  ]);
  const rejected = inspectAtlasCellGuards({
    ...contaminated,
    width: ATLAS_WIDTH,
    height: ATLAS_HEIGHT
  });
  assert.equal(rejected.status, 'violation');
  assert.deepEqual(rejected.cells[1].violatingEdges, ['top']);
  assert.equal(rejected.cells[1].edges.top.maximumAlpha, 17);
  assert.deepEqual(rejected.cells[2].violatingEdges, ['right']);
  assert.deepEqual(
    rejected.cells[2].edges.right.firstNonTransparentPixel,
    { x: CELL_SIZE - 1, y: 100, alpha: 255 }
  );
  const wrongDimensions = inspectAtlasCellGuards({
    data: Buffer.alloc(512 * ATLAS_HEIGHT * 4),
    width: 512,
    height: ATLAS_HEIGHT,
    channels: 4
  });
  assert.equal(wrongDimensions.status, 'violation');
  assert.deepEqual(wrongDimensions.dimensions, { width: 512, height: 256, channels: 4 });
  assert.equal(wrongDimensions.cells.length, 0);
});

test('CLI arguments support repeatable filters and strict complete coverage', () => {
  assert.deepEqual(parseCosmeticAtlasCellGuardArguments([
    '--universe', 'Star Wars',
    '--universe=digimon',
    '--require-complete=47',
    '--guard-alpha-threshold=8'
  ]), {
    guardAlphaThreshold: 8,
    help: false,
    requiredCompleteCount: 47,
    universes: ['Star Wars', 'digimon']
  });
  assert.equal(
    parseCosmeticAtlasCellGuardArguments(['--require-complete']).requiredCompleteCount,
    380
  );
  assert.throws(
    () => parseCosmeticAtlasCellGuardArguments(['--guard-alpha-threshold=17']),
    /0 to 16/
  );
});

test('CLI emits JSON and exits nonzero for a violation', () => {
  const result = spawnSync(process.execPath, [
    path.join(projectRoot, 'scripts', 'cosmeticAtlasCellGuardAudit.mjs'),
    '--universe=universe-that-does-not-exist'
  ], { cwd: projectRoot, encoding: 'utf8' });
  assert.equal(result.status, 1, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'violation');
  assert.equal(report.globalViolations[0].type, 'universe-filter-no-match');
});
