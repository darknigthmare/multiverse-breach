import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BOOSTER_CARD_COUNT,
  createBoosterRewards,
  getBoosterFreeDrawRates
} from '../src/game/portalBoosterEngine.js';

const rarities = {
  common: {
    id: 'common',
    label: 'Stable',
    color: '#9fb6bb',
    weight: 58,
    duplicateRefund: 18
  },
  rare: {
    id: 'rare',
    label: 'Rare',
    color: '#3498db',
    weight: 28,
    duplicateRefund: 25
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    color: '#9b59b6',
    weight: 11,
    duplicateRefund: 35
  }
};

const reward = (kind, id, universe, rarity = rarities.common) => ({
  kind,
  id,
  name: id,
  universe,
  rarity
});

test('creates five indexed cards with a hero and a rare-or-better reward', () => {
  const candidates = [
    reward('equipment', 'pulse-rifle', 'Alien'),
    reward('stage', 'sulaco', 'Alien'),
    reward('equipment', 'bfg', 'Doom', rarities.rare),
    reward('mode', 'rip-and-tear', 'Doom'),
    reward('hero', 'ripley', 'Alien'),
    reward('hero', 'doomslayer', 'Doom', rarities.epic)
  ];

  const cards = createBoosterRewards({
    candidates,
    ownedIds: ['pulse-rifle'],
    rng: () => 0
  });

  assert.equal(BOOSTER_CARD_COUNT, 5);
  assert.equal(cards.length, BOOSTER_CARD_COUNT);
  assert.deepEqual(cards.map(card => card.cardIndex), [0, 1, 2, 3, 4]);
  assert.ok(cards.some(card => card.kind === 'hero'));
  assert.ok(cards.some(card => ['rare', 'epic', 'anomaly'].includes(card.rarity.id)));
  assert.equal(new Set(cards.map(card => card.id)).size, BOOSTER_CARD_COUNT);

  const duplicate = cards.find(card => card.id === 'pulse-rifle');
  assert.equal(duplicate.wasDuplicate, true);
  assert.equal(duplicate.shardsReturned, rarities.common.duplicateRefund);
  assert.ok(cards.filter(card => card.id !== 'pulse-rifle').every(card => card.shardsReturned === 0));
});

test('uses every unique candidate before repeating a reward', () => {
  const candidates = [
    reward('hero', 'hero-a', 'Thread A'),
    reward('equipment', 'gear-b', 'Thread A', rarities.rare),
    reward('stage', 'stage-c', 'Thread A')
  ];

  const cards = createBoosterRewards({
    candidates,
    ownedIds: [],
    rng: () => 0
  });

  assert.equal(new Set(cards.slice(0, candidates.length).map(card => card.id)).size, candidates.length);
  assert.equal(new Set(cards.map(card => card.id)).size, candidates.length);
  assert.ok(cards.slice(0, candidates.length).every(card => card.wasDuplicate === false));
  assert.ok(cards.slice(candidates.length).every(card => card.wasDuplicate === true));
});

test('pity prioritizes an unowned hero from the supplied scope', () => {
  const candidates = [
    reward('hero', 'owned-hero', 'Thread A'),
    reward('hero', 'new-hero', 'Thread B'),
    reward('equipment', 'rare-gear', 'Thread A', rarities.rare),
    reward('stage', 'stage-a', 'Thread A'),
    reward('mode', 'mode-a', 'Thread A')
  ];

  const cards = createBoosterRewards({
    candidates,
    ownedIds: ['owned-hero'],
    pityReady: true,
    rng: () => 0
  });

  assert.equal(cards[0].id, 'new-hero');
  assert.equal(cards[0].wasDuplicate, false);
  assert.ok(cards.every(card => candidates.some(candidate => candidate.id === card.id)));
});

test('a mixed booster spreads rewards across two universes when possible', () => {
  const candidates = [
    reward('hero', 'hero-a', 'Thread A'),
    reward('equipment', 'rare-a', 'Thread A', rarities.rare),
    reward('stage', 'stage-a', 'Thread A'),
    reward('equipment', 'gear-b', 'Thread B'),
    reward('mode', 'mode-b', 'Thread B'),
    reward('stage', 'stage-b', 'Thread B')
  ];

  const cards = createBoosterRewards({
    candidates,
    preferUniverseSpread: true,
    rng: () => 0
  });

  assert.ok(new Set(cards.map(card => card.universe)).size >= 2);
});

test('never selects a reward outside the candidates received by the engine', () => {
  const scopedCandidates = [
    reward('hero', 'scoped-hero', 'Scoped Thread', rarities.epic),
    reward('equipment', 'scoped-gear', 'Scoped Thread')
  ];

  const cards = createBoosterRewards({
    candidates: scopedCandidates,
    ownedIds: new Set(),
    rng: () => 0.75
  });
  const scopedIds = new Set(scopedCandidates.map(candidate => candidate.id));

  assert.equal(cards.length, BOOSTER_CARD_COUNT);
  assert.ok(cards.every(card => scopedIds.has(card.id)));
  assert.ok(cards.every(card => card.universe === 'Scoped Thread'));
});

test('a targeted OC pack guarantees a rare non-character reward', () => {
  const candidates = [
    reward('hero', 'oc-a', 'Nexus', rarities.epic),
    reward('hero', 'oc-b', 'Nexus', rarities.rare),
    reward('equipment', 'stable-gear', 'Nexus'),
    reward('stageMusic', 'rare-theme', 'Nexus', rarities.rare),
    reward('portalEffect', 'epic-portal', 'Nexus', rarities.epic),
    reward('equipment', 'stable-gear-b', 'Nexus')
  ];

  const cards = createBoosterRewards({
    candidates,
    guaranteeNonHeroRare: true,
    rng: () => 0
  });

  assert.equal(cards.length, BOOSTER_CARD_COUNT);
  assert.ok(cards.some(card => card.kind === 'hero'));
  assert.ok(cards.some(card => (
    card.kind !== 'hero' && ['rare', 'epic', 'anomaly'].includes(card.rarity.id)
  )));
});

test('free draws choose a rarity tier before sharing odds inside that tier', () => {
  const anomaly = {
    id: 'anomaly',
    label: 'Anomaly',
    color: '#ffb000',
    weight: 3,
    duplicateRefund: 50
  };
  const candidates = [
    ...Array.from(
      { length: 20 },
      (_, index) => reward('equipment', `common-${index}`, 'Nexus', rarities.common)
    ),
    reward('equipment', 'rare-one', 'Nexus', rarities.rare),
    reward('equipment', 'epic-one', 'Nexus', rarities.epic),
    reward('fieldSuper', 'anomaly-one', 'Nexus', anomaly)
  ];
  const rates = getBoosterFreeDrawRates(candidates);
  const commonRate = Array.from({ length: 20 }, (_, index) => rates.get(`common-${index}`))
    .reduce((total, rate) => total + rate, 0);

  assert.ok(Math.abs(commonRate - 0.58) < 1e-12);
  assert.ok(Math.abs(rates.get('rare-one') - 0.28) < 1e-12);
  assert.ok(Math.abs(rates.get('epic-one') - 0.11) < 1e-12);
  assert.ok(Math.abs(rates.get('anomaly-one') - 0.03) < 1e-12);
  assert.ok(Math.abs(
    [...rates.values()].reduce((total, rate) => total + rate, 0) - 1
  ) < 1e-12);
});
