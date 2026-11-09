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

test('the installed static C-Rex has recorded provenance without granting animation or canonical approval', async () => {
  // Keep this catalog contract usable in source-only checkouts; test:character-png
  // validates PNG bytes, geometry and rendering in the full artwork checkout.
  const manifest = JSON.parse(await readFile(new URL('../public/sprites/generated/sprite-manifest.json', import.meta.url), 'utf8'));
  const entry = manifest.entries.find(entry => entry.kind === 'boss' && entry.output === output);
  assert.ok(entry, 'the canonical boss must remain in the production inventory');
  assert.equal(entry.available, true);
  assert.equal(entry.source, 'openai');
  assert.equal(entry.provenanceStatus, 'recorded-static-imagegen');
  assert.equal(entry.provenanceRecord, 'docs/assets/CRUSTACEOUS_REX_STATIC_2026-10-29.json');
  const provenance = JSON.parse(await readFile(new URL(`../${entry.provenanceRecord}`, import.meta.url), 'utf8'));
  assert.equal(provenance.id, entry.id);
  assert.equal(provenance.output, output);
  assert.equal(provenance.fileAvailable, true);
  assert.equal(entry.generationId, provenance.generation.generationId);
  assert.equal(entry.outputSha256, provenance.image.sha256);
  assert.equal(entry.referenceUrl, runtime.referenceUrl);
  assert.equal(entry.visualAnchor, runtime.visualAnchor);
  assert.equal(entry.frameCount, 1);
  assert.equal(entry.animated, false);
  assert.equal(entry.animationStatus, 'pending');
  assert.equal(entry.visualReviewStatus, 'close-to-reference');
  assert.equal(entry.canonicalFidelityApproved, false);
  assert.equal(entry.exactOneToOneStatus, 'unverified');
  assert.equal(provenance.canonicalFidelityApproved, false);
  assert.equal(provenance.visualReview.exactOneToOneStatus, 'unverified');
  assert.equal(runtime.visualReviewStatus, 'pending');
  const ledger = (await readFile(new URL('../public/sprites/generated/openai-asset-ledger.jsonl', import.meta.url), 'utf8'))
    .trim().split('\n').map(line => JSON.parse(line));
  assert.equal(ledger.some(record => record.output === output), false, 'a static installation must not invent historical animation evidence');
});
