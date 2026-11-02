import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDisplayPreferences } from '../src/game/displayPreferences.js';
import { createReducedMotionReader } from '../src/game/reducedMotion.js';

const setup = (systemReduced = false) => {
  const root = { dataset: {}, style: { setProperty() {} } };
  const query = { matches: systemReduced };
  let queryCount = 0;
  const view = { matchMedia(value) {
    assert.equal(value, '(prefers-reduced-motion: reduce)');
    queryCount++;
    return query;
  } };
  return { root, query, view, queryCount: () => queryCount };
};

test('Canvas presentation honors the in-game reduced-motion setting immediately', () => {
  const environment = setup();
  const reduced = createReducedMotionReader(environment);
  applyDisplayPreferences({ motion: 'system' }, environment.root);
  assert.equal(reduced(), false);
  // Apply a session-only choice directly; storage is not needed for rendering.
  applyDisplayPreferences({ motion: 'reduced' }, environment.root);
  assert.equal(reduced(), true);
  applyDisplayPreferences({ motion: 'system' }, environment.root);
  assert.equal(reduced(), false);
});

test('returning to system mode never overrides an OS request for reduced motion', () => {
  const environment = setup(true);
  const reduced = createReducedMotionReader(environment);
  for (const motion of ['reduced', 'system']) {
    applyDisplayPreferences({ motion }, environment.root);
    assert.equal(reduced(), true);
  }
});

test('the same reader sees live OS preference changes during a presentation', () => {
  const environment = setup();
  const reduced = createReducedMotionReader(environment);
  assert.equal(reduced(), false);
  environment.query.matches = true;
  assert.equal(reduced(), true);
  environment.query.matches = false;
  assert.equal(reduced(), false);
  applyDisplayPreferences({ motion: 'reduced' }, environment.root);
  assert.equal(reduced(), true);
});

test('one media query serves repeated animation frames without caching a stale boolean', () => {
  const environment = setup();
  const reduced = createReducedMotionReader(environment);
  for (let frame = 0; frame < 600; frame++) {
    environment.query.matches = frame >= 300;
    assert.equal(reduced(), frame >= 300);
  }
  assert.equal(environment.queryCount(), 1);
});

test('headless and older browser contexts preserve the local choice without matchMedia', () => {
  assert.equal(createReducedMotionReader({ view: null, root: null })(), false);
  const root = { dataset: { gameMotion: 'reduced' } };
  const reduced = createReducedMotionReader({ view: {}, root });
  assert.equal(reduced(), true);
  root.dataset.gameMotion = 'system';
  assert.equal(reduced(), false);
});

test('readers stay scoped to their own document and media query', () => {
  const first = setup();
  const second = setup();
  const firstReduced = createReducedMotionReader(first);
  const secondReduced = createReducedMotionReader(second);
  applyDisplayPreferences({ motion: 'reduced' }, first.root);
  assert.equal(firstReduced(), true);
  assert.equal(secondReduced(), false);
});
