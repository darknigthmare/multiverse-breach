import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { ENEMIES_DB } from '../src/game/enemies.js';
import { LORE_BOSS_OVERRIDES } from '../src/game/loreBossOverrides.js';
import { getEnemySpriteSheetSrc } from '../src/game/spriteAssets.js';

const universe = 'Godzilla The Animated Series';
const output = '/sprites/generated/bosses/godzilla-the-animated-series/crustaceous-rex.png';
const source = LORE_BOSS_OVERRIDES[universe].find(boss => boss.name === 'Crustaceous Rex');
const runtime = ENEMIES_DB[universe].bosses.find(boss => boss.name === source.name);

test('the actual C-Rex encounter preserves its existing roster, sprite identity and balance', () => {
  assert.deepEqual(ENEMIES_DB[universe].bosses.map(boss => boss.name), ['Cyber-Godzilla', 'Crustaceous Rex']);
  assert.equal(ENEMIES_DB[universe].monsters.length, 3);
  assert.deepEqual([runtime.hp, runtime.atk, runtime.spd, runtime.color], [625, 28, 5, '#4dff88']);
  assert.equal(source.output, output);
  assert.equal(runtime.spriteSource, output);
  assert.equal(getEnemySpriteSheetSrc({ ...runtime, universe }), output);
});

test('the runtime creature uses Sony-sourced long forelimbs and flower-head anatomy', () => {
  assert.equal(runtime.referenceUrl, 'https://www.scifijapan.com/anime-animation/godzilla-the-series');
  for (const requirement of [/olive-brown/, /ochre/, /elongated segmented forelimbs/, /claw-fingered walking hands/, /small hind limbs/, /red flower-like mouth/, /numerous flexible head tentacles/]) {
    assert.match(runtime.visualAnchor, requirement);
  }
  assert.doesNotMatch(runtime.visualAnchor, /exactly four|enormous claws|low amphibious stance|red-brown giant/i);
  assert.match(runtime.visualAnchor, /rather than ordinary crab pincers/);
});

test('future runtime prompts separate adapted moves from canonical appearance and keep visual review pending', () => {
  assert.equal(runtime.weapon, 'clawed_forelimbs');
  assert.equal(runtime.combatMechanicsStatus, 'game-adaptation');
  assert.equal(runtime.visualReviewStatus, 'pending');
  assert.match(runtime.spritePrompt, /Gameplay adaptation: clawed_forelimbs/);
  assert.doesNotMatch(runtime.spritePrompt, /Canonical combat identity:|exposes vulnerable tissue|below 40 percent|exactly four|Crustacean Crushing Grip/);
  assert.match(runtime.spritePrompt, /intact shell and original anatomy/);
  assert.equal(LORE_BOSS_OVERRIDES[universe][0].visualReviewStatus, undefined, 'an existing Cyber-Godzilla bitmap gains no unearned review status');
});

test('the archived real generation evidence cannot be mistaken for an installed or approved sprite', async () => {
  const report = JSON.parse(await readFile(new URL('../docs/openai-generation-prompts-2026-10-01/missing-boss-crustaceous-rex-attempts.json', import.meta.url), 'utf8'));
  assert.equal(report.id, 'godzilla-the-animated-series-crustaceous-rex');
  assert.equal(report.installed, false);
  assert.equal(report.status, 'generated-quality-blocked');
  assert.equal(report.attempts.length, 2);
  for (const attempt of report.attempts) {
    assert.equal(attempt.technicalReview.productionContractPassed, false);
    assert.match(attempt.technicalReview.sha256, /^[a-f0-9]{64}$/);
    assert.notEqual(attempt.technicalReview.width, 1024);
  }
});
