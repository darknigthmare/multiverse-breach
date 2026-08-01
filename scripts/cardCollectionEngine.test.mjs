import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DUPLICATE_MODES,
  addCardToCollection,
  appendOpeningHistory,
  claimSetMilestone,
  getSetMilestoneState
} from '../src/game/cards/cardCollectionEngine.js';
import { createCardSetDefinition } from '../src/game/cards/cardSchema.js';
import { DEFAULT_SET_COMPLETION_REWARDS } from '../src/game/cards/cardSetCatalog.js';

const card = (id, rarityId = 'stable') => ({ id, rarityId });

test('copies 2-4 increase mastery and copy 5+ auto-converts only to thread dust', () => {
  const source = { cards: {}, setProgress: {}, breachShards: 321 };
  const first = addCardToCollection(source, card('card:a'), {
    copies: 4,
    obtainedAt: '2026-07-31T10:00:00.000Z'
  });

  assert.equal(first.entry.copies, 4);
  assert.equal(first.entry.masteryLevel, 3);
  assert.equal(first.dustGained, 0);
  assert.deepEqual(first.entry.finishesOwned, [
    'standard', 'holo-thread', 'portal-foil', 'negative-archive'
  ]);
  assert.deepEqual(source.cards, {});

  const fifth = addCardToCollection(first.portalCollection, card('card:a'), {
    obtainedAt: '2026-07-31T11:00:00.000Z'
  });
  assert.equal(fifth.entry.copies, 4);
  assert.equal(fifth.convertedCopies, 1);
  assert.equal(fifth.dustGained, 1);
  assert.equal(fifth.portalCollection.threadDust, 1);
  assert.equal(fifth.portalCollection.breachShards, 321);
  assert.equal('fragmentsRefunded' in fifth, false);
});

test('keep mode retains up to nine copies and converts the tenth', () => {
  const result = addCardToCollection({}, card('card:rare', 'rare'), {
    copies: 10,
    duplicateMode: DUPLICATE_MODES.KEEP,
    obtainedAt: '2026-07-31T12:00:00.000Z'
  });

  assert.equal(result.entry.copies, 9);
  assert.equal(result.keptCopies, 9);
  assert.equal(result.convertedCopies, 1);
  assert.equal(result.dustGained, 3);
  assert.equal(result.portalCollection.duplicateMode, 'keep');
});

test('set milestones 10/25/50/75/90/100 can each be claimed once', () => {
  const cardIds = Array.from({ length: 20 }, (_, index) => `card:${index + 1}`);
  const setDefinition = createCardSetDefinition({
    id: 'set:test:base-01',
    universe: 'Test',
    edition: 'base-01',
    cardIds,
    completionRewards: DEFAULT_SET_COMPLETION_REWARDS
  });
  let portalCollection = {
    cards: Object.fromEntries(cardIds.map((cardId) => [cardId, { copies: 1 }])),
    setProgress: {}
  };

  assert.deepEqual(getSetMilestoneState(portalCollection, setDefinition).claimableMilestones,
    [10, 25, 50, 75, 90, 100]);
  for (const milestone of [10, 25, 50, 75, 90, 100]) {
    const first = claimSetMilestone({ portalCollection, setDefinition, milestone });
    assert.equal(first.claimed, true);
    assert.equal(first.reward.milestone, milestone);
    portalCollection = first.portalCollection;
    const duplicate = claimSetMilestone({ portalCollection, setDefinition, milestone });
    assert.equal(duplicate.claimed, false);
    assert.equal(duplicate.reason, 'already-claimed');
  }
  assert.deepEqual(
    portalCollection.setProgress[setDefinition.id].claimedMilestones,
    [10, 25, 50, 75, 90, 100]
  );
});

test('opening history is compact, external to collection, and capped at 100', () => {
  const portalStats = {
    packsOpened: 20,
    history: Array.from({ length: 100 }, (_, index) => ({
      rewardId: `old-${index}`,
      at: `${index}`,
      ignoredLargeField: 'not persisted'
    }))
  };
  const next = appendOpeningHistory(portalStats, {
    rewardId: 'new',
    cardId: 'card:new',
    at: 'now',
    ignoredLargeField: 'not persisted'
  });

  assert.equal(next.history.length, 100);
  assert.equal(next.history[0].rewardId, 'new');
  assert.equal('ignoredLargeField' in next.history[0], false);
  assert.equal('portalCollection' in next, false);
});
