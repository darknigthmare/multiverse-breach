import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeGeneratedSource } from './installGeneratedBitmapBatch.mjs';

test('batch normalizer refuses an unknown asset kind', async () => {
  await assert.rejects(
    () => normalizeGeneratedSource('unused-source.png', 'unknown-kind'),
    /Unsupported generated bitmap kind: unknown-kind/u
  );
});
