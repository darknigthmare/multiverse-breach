import assert from 'node:assert/strict';
import test from 'node:test';

import { createCardCatalogFromPortalCandidates } from '../src/game/cards/cardCatalog.js';
import {
  CARD_COLLECTION_SAVE_VERSION,
  migrateCardCollectionSave,
  migrateCardSaveWithDiagnostics
} from '../src/game/cards/cardSaveMigration.js';
import {
  buildCardId,
  buildCardSetId,
  createCardDefinition
} from '../src/game/cards/cardSchema.js';

const migratedAt = '2026-07-31T15:00:00.000Z';

test('legacy portal rewards create cards retroactively without removing gameplay ownership', () => {
  const candidates = [
    {
      id: 'hero:alpha', rewardId: 'alpha', kind: 'hero', universe: 'Thread A',
      rarity: { id: 'common' }, data: { hero: { id: 'alpha', portrait: '/alpha.png' } }
    },
    {
      id: 'equipment:blade', rewardId: 'blade', kind: 'equipment', universe: 'Thread A',
      rarity: { id: 'rare' }, data: { item: { id: 'blade', icon: '/blade.png' } }
    },
    {
      id: 'archive:Thread A:RPG', rewardId: 'archive:Thread A:RPG', kind: 'archive',
      universe: 'Thread A', rarity: { id: 'rare' }, data: { image: '/stage.png', mode: 'RPG' }
    },
    {
      id: 'portal-effect:Thread A', rewardId: 'portal-effect:Thread A', kind: 'portalEffect',
      universe: 'Thread A', rarity: { id: 'epic' },
      data: { unlockable: { id: 'portal-effect:Thread A', visual: { sheet: '/portal.webp' } } }
    }
  ];
  const cardCatalog = createCardCatalogFromPortalCandidates(candidates);
  const history = Array.from({ length: 120 }, (_, index) => ({
    rewardId: `reward-${index}`,
    at: `${index}`,
    verboseUnusedField: 'drop-me'
  }));
  const legacySave = {
    saveVersion: 8,
    breachShards: 444,
    unlockedHeroes: ['alpha'],
    inventory: ['blade'],
    portalStats: { pulls: 2, history },
    portalCollection: {
      archives: [{ id: 'archive:Thread A:RPG', universe: 'Thread A', image: '/stage.png' }],
      portalEffects: ['portal-effect:Thread A'],
      history: [{ rewardId: 'misplaced', at: 'old' }],
      setProgress: { old: { claimedMilestones: ['10', 25, 999] } }
    }
  };

  const firstResult = migrateCardSaveWithDiagnostics(legacySave, {
    cardCatalog,
    migratedAt
  });
  const first = firstResult.save;
  assert.equal(first.saveVersion, CARD_COLLECTION_SAVE_VERSION);
  assert.equal(Object.keys(first.portalCollection.cards).length, 4);
  assert.ok(Object.values(first.portalCollection.cards).every((entry) => entry.copies === 1));
  assert.equal(first.portalCollection.history, undefined);
  assert.equal(first.portalStats.history.length, 100);
  assert.equal(first.portalStats.history[0].verboseUnusedField, undefined);
  assert.deepEqual(first.portalCollection.setProgress.old.claimedMilestones, [10, 25]);
  assert.deepEqual(first.unlockedHeroes, ['alpha']);
  assert.deepEqual(first.inventory, ['blade']);
  assert.equal(first.breachShards, 444);
  assert.deepEqual(first.portalCollection.portalEffects, ['portal-effect:Thread A']);
  assert.equal(firstResult.migratedCardIds.length, 4);

  const second = migrateCardCollectionSave(first, {
    cardCatalog,
    migratedAt: '2026-08-01T15:00:00.000Z'
  });
  assert.deepEqual(second, first);
});

test('ambiguous duplicated legacy hero ids are diagnosed instead of guessed', () => {
  const rewardId = 'shared';
  const definitions = ['Thread A', 'Thread B'].map((universe) => createCardDefinition({
    id: buildCardId({ universe, kind: 'hero', rewardId }),
    setId: buildCardSetId({ universe, edition: 'base-01' }),
    number: 1,
    universe,
    characterId: rewardId,
    kind: 'character',
    rewardKind: 'hero',
    rewardId,
    rarityId: 'stable'
  }));
  const result = migrateCardSaveWithDiagnostics({
    saveVersion: 8,
    unlockedHeroes: [rewardId],
    portalCollection: {},
    portalStats: { history: [] }
  }, { cardDefinitions: definitions, migratedAt });

  assert.deepEqual(result.save.portalCollection.cards, {});
  assert.ok(result.diagnostics.some((diagnostic) => (
    diagnostic.code === 'ambiguous-legacy-reward'
  )));
});
