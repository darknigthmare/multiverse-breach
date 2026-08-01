import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GAME_CANVAS_COSMETIC_PRESENTATION_MODES,
  getGameCanvasCosmeticAtlas,
  getGameCanvasCosmeticDurationMs,
  getGameCanvasCosmeticFacing,
  getGameCanvasCosmeticFrame,
  supportsGameCanvasCosmeticPresentation
} from '../src/game/gameCanvasCosmeticPresentation.js';

const atlas = {
  sheet: '/visuals/cosmetics/openai/universes/test/atlas.webp',
  columns: 4,
  rows: 1,
  frames: 4,
  row: 0
};

test('cosmetic atlas presentations stay scoped to GameCanvas RPG, Tactics and Smash', () => {
  assert.deepEqual(GAME_CANVAS_COSMETIC_PRESENTATION_MODES, ['RPG', 'Tactics', 'Smash']);
  for (const mode of GAME_CANVAS_COSMETIC_PRESENTATION_MODES) {
    assert.equal(supportsGameCanvasCosmeticPresentation(mode), true);
  }
  for (const mode of ['combat', 'kart', 'fps', 'nexus', 'hub', 'profile', undefined]) {
    assert.equal(supportsGameCanvasCosmeticPresentation(mode), false);
  }
});

test('intro, KO and victory resolve only their production atlas payload', () => {
  const cosmetic = { animation: atlas, visual: { ...atlas, sheet: '/ko.webp' } };
  assert.equal(getGameCanvasCosmeticAtlas('intro', cosmetic), atlas);
  assert.equal(getGameCanvasCosmeticAtlas('victory', cosmetic), atlas);
  assert.equal(getGameCanvasCosmeticAtlas('ko', cosmetic).sheet, '/ko.webp');
  assert.equal(getGameCanvasCosmeticAtlas('assist', cosmetic), null);
  assert.equal(getGameCanvasCosmeticAtlas('intro', { animation: { frames: 4 } }), null);
});

test('atlas frames advance once across the configured cosmetic duration', () => {
  assert.equal(getGameCanvasCosmeticFrame(atlas, -20, 1600), 0);
  assert.equal(getGameCanvasCosmeticFrame(atlas, 399, 1600), 0);
  assert.equal(getGameCanvasCosmeticFrame(atlas, 400, 1600), 1);
  assert.equal(getGameCanvasCosmeticFrame(atlas, 800, 1600), 2);
  assert.equal(getGameCanvasCosmeticFrame(atlas, 1200, 1600), 3);
  assert.equal(getGameCanvasCosmeticFrame(atlas, 1600, 1600), 3);
  assert.equal(getGameCanvasCosmeticFrame({ ...atlas, frames: 8 }, 1600, 1600), 3);
});

test('presentation duration and facing reuse the equipped cosmetic metadata', () => {
  assert.equal(getGameCanvasCosmeticDurationMs('intro', { animation: { durationMs: 1700 } }), 1700);
  assert.equal(getGameCanvasCosmeticDurationMs('ko', { visual: { durationMs: 300 } }), 500);
  assert.equal(getGameCanvasCosmeticDurationMs('victory', {}), 1800);
  assert.equal(getGameCanvasCosmeticFacing('intro', 'opponent'), -1);
  assert.equal(getGameCanvasCosmeticFacing('victory', 'player'), 1);
  assert.equal(getGameCanvasCosmeticFacing('ko', 'opponent'), 1);
});
