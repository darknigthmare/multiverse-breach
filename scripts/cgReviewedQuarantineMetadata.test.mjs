import assert from 'node:assert/strict';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { getCgQuarantineVisualFlags, getCgQuarantineWorldScope, getCgReviewedQuarantineSprite } from './cgReviewedQuarantineMetadata.mjs';
import { evidenceForSubject } from './buildCgRosterProductionPlan.mjs';

const hero = HEROES_DB.find(item => item.id === 'darth_revan');
const old = getQuarantinedCanonSprite(hero);
const selected = getHeroSpriteSheetSrc(hero);

test('metadata reports the exact reviewed current sprite without granting artistic approval', () => {
  const review = getCgReviewedQuarantineSprite(hero, selected);
  assert.equal(review.path, '/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png');
  assert.equal(review.sha256, 'c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf');
  assert.equal(review.selectedInRuntime, true);
  assert.equal(review.archivalOnly, false);
  assert.equal(review.runtimeEligible, true);
  assert.equal(review.visualFidelityApproved, false);
  assert.equal(review.canonicalFidelityApproved, false);
  assert.equal(review.fullSource1to1Verified, false);
  assert.equal(review.incarnation, hero.incarnation);
  assert.notEqual(review.path, old.asset);
});

test('the rejected asset and unrelated old candidates remain archival when a correction is selected', () => {
  const correction = getCgReviewedQuarantineSprite(hero, selected);
  const flags = getCgQuarantineVisualFlags(old.asset, old, correction);
  assert.equal(flags.selectedInRuntime, false);
  assert.equal(flags.archivalOnly, true);
  assert.equal(flags.runtimeEligible, false);
  assert.match(flags.status, /^OLD-quarantined/);
  assert.equal(flags.quarantineReason, old.reason);
  assert.equal(getCgQuarantineVisualFlags('/sprites/unrelated.png', old, correction).archivalOnly, true);
  assert.equal(getCgQuarantineVisualFlags(selected, old, correction).selectedInRuntime, true);
});

test('no reviewed selection is inferred from a wrong path, edition, universe, alias or display name', () => {
  for (const path of [null, '', old.asset, selected + '?variant=other', '/sprites/unknown.png']) {
    assert.equal(getCgReviewedQuarantineSprite(hero, path), null);
  }
  for (const actor of [{ ...hero, incarnation: 'Star Wars: The Old Republic' }, { ...hero, universe: 'Other universe' },
    { ...hero, id: 'other_revan' }, { ...hero, sourceHeroId: 'other_revan' }, { ...hero, sourceId: 'other_revan' }]) {
    assert.equal(getCgReviewedQuarantineSprite(actor, selected), null);
  }
  assert.deepEqual(getCgQuarantineVisualFlags(selected, null, null), {});
});

test('other quarantined actors retain their old annotations and gain no correction', () => {
  for (const id of ['ahsoka', 'ahsoka_padawan']) {
    const actor = HEROES_DB.find(item => item.id === id), quarantine = getQuarantinedCanonSprite(actor);
    assert.equal(getCgReviewedQuarantineSprite(actor, getHeroSpriteSheetSrc(actor)), null);
    const flags = getCgQuarantineVisualFlags(quarantine.asset, quarantine, null);
    assert.equal(flags.archivalOnly, true);
    assert.equal(flags.selectedInRuntime, false);
  }
});

test('the production evidence keeps both current and rejected images with distinct provenance', () => {
  const dossier = { candidatsReferencesLocalesAudit: [old.asset, selected, '/sprites/old-project-candidate.png'] };
  const before = structuredClone(dossier);
  const identity = evidenceForSubject(hero, dossier);
  assert.deepEqual(dossier, before);
  assert.equal(identity.runtimeSpriteCorrection.path, selected);
  assert.equal(identity.visualFidelityApproved, false);
  assert.equal(identity.runtimeSpriteQuarantine.asset, old.asset);
  assert.equal(identity.localCandidates.filter(item => item.selectedInRuntime).length, 1);
  const current = identity.localCandidates.find(item => item.path === selected);
  assert.equal(current.archivalOnly, false);
  assert.equal(current.visualFidelityApproved, false);
  assert.match(current.role, /^current-reviewed/);
  assert.equal(identity.localCandidates.find(item => item.path === old.asset).archivalOnly, true);
  assert.ok(identity.missing.some(item => item.includes('seul le correctif précisément revu')));
  assert.equal(identity.evidenceStatus, 'needs-reference');
});

test('the exact KOTOR I edition uses a documented place without inventing visual architecture', () => {
  const scope = getCgQuarantineWorldScope(hero);
  assert.match(scope.world.locations[0], /Forge Stellaire.*Knights of the Old Republic \(2003\)/);
  assert.equal(scope.world.period, hero.incarnation);
  assert.deepEqual(scope.world.architecture, []);
  assert.deepEqual(scope.world.palette, []);
  assert.deepEqual(scope.world.props, []);
  assert.ok(scope.world.boundaries.some(line => line.includes('aucune image indépendante')));
  assert.match(scope.referenceUrl, /^https:\/\/en\.wikipedia\.org/);
  for (const other of [{ ...hero, incarnation: 'Star Wars: The Old Republic' }, { ...hero, universe: 'Other universe' },
    { ...hero, id: 'alias' }, { ...hero, sourceId: 'other_revan' }]) assert.equal(getCgQuarantineWorldScope(other), null);
});
