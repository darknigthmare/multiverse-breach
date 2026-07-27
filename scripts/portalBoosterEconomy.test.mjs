import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_DUPLICATE_REFUND_RATIO,
  PORTAL_BOOSTER_PRICES,
  capDuplicateRefunds,
  getBoosterPrice
} from '../src/game/portalBoosterEconomy.js';
import { PERMANENT_OC_BOOSTERS } from '../src/game/portalBoosterCatalog.js';
import { createBoosterRewards } from '../src/game/portalBoosterEngine.js';

const duplicateReward = (cardIndex, shardsReturned) => ({
  id: `duplicate-${cardIndex}`,
  kind: cardIndex === 0 ? 'hero' : 'equipment',
  rarity: {
    id: cardIndex === 0 ? 'rare' : 'anomaly',
    weight: 3,
    duplicateRefund: shardsReturned
  },
  wasDuplicate: true,
  shardsReturned,
  cardIndex
});

test('broad and targeted packs use the transparent price grid', () => {
  assert.equal(PORTAL_BOOSTER_PRICES.broad, 80);
  assert.equal(PORTAL_BOOSTER_PRICES.targeted, 100);
  assert.equal(getBoosterPrice({ priceTier: 'broad' }), 80);
  assert.equal(getBoosterPrice({ priceTier: 'targeted' }), 100);
  assert.ok(PERMANENT_OC_BOOSTERS.every(pack => getBoosterPrice(pack) === 100));
});

test('five anomaly echoes on a broad pack refund 56 and never create currency', () => {
  const price = PORTAL_BOOSTER_PRICES.broad;
  const rewards = Array.from(
    { length: 5 },
    (_, cardIndex) => duplicateReward(cardIndex, 50)
  );
  const capped = capDuplicateRefunds(rewards, price);
  const refund = capped.reduce((total, reward) => total + reward.shardsReturned, 0);

  assert.equal(refund, Math.floor(price * MAX_DUPLICATE_REFUND_RATIO));
  assert.equal(refund, 56);
  assert.equal(price - refund, 24);
  assert.ok(capped.every(reward => reward.shardsReturned <= reward.rawShardsReturned));
});

test('largest-remainder apportionment is deterministic and preserves non-echoes', () => {
  const rewards = [
    duplicateReward(0, 50),
    duplicateReward(1, 32),
    duplicateReward(2, 20),
    duplicateReward(3, 12),
    {
      ...duplicateReward(4, 50),
      id: 'new-card',
      wasDuplicate: false
    }
  ];
  const first = capDuplicateRefunds(rewards, 80);
  const second = capDuplicateRefunds(rewards, 80);

  assert.deepEqual(first, second);
  assert.equal(first.reduce((sum, reward) => sum + reward.shardsReturned, 0), 56);
  assert.equal(first[4].rawShardsReturned, 0);
  assert.equal(first[4].shardsReturned, 0);
});

test('a raw refund below the cap remains unchanged', () => {
  const rewards = [
    duplicateReward(0, 12),
    duplicateReward(1, 20),
    {
      ...duplicateReward(2, 50),
      id: 'new-card',
      wasDuplicate: false
    }
  ];
  const capped = capDuplicateRefunds(rewards, 100);

  assert.deepEqual(capped.map(reward => reward.shardsReturned), [12, 20, 0]);
  assert.deepEqual(capped.map(reward => reward.rawShardsReturned), [12, 20, 0]);
});

test('settlement does not alter selected card IDs, order or guarantees', () => {
  const rare = {
    id: 'rare',
    weight: 28,
    duplicateRefund: 20
  };
  const common = {
    id: 'common',
    weight: 58,
    duplicateRefund: 12
  };
  const candidates = [
    { id: 'hero-a', kind: 'hero', rarity: common, universe: 'Nexus' },
    { id: 'hero-b', kind: 'hero', rarity: rare, universe: 'Nexus' },
    { id: 'rare-stage', kind: 'archive', rarity: rare, universe: 'Nexus' },
    { id: 'gear-a', kind: 'equipment', rarity: common, universe: 'Nexus' },
    { id: 'gear-b', kind: 'equipment', rarity: common, universe: 'Nexus' },
    { id: 'hud-a', kind: 'hud', rarity: rare, universe: 'Nexus' }
  ];
  const selected = createBoosterRewards({
    candidates,
    ownedIds: candidates.map(candidate => candidate.id),
    guaranteeNonHeroRare: true,
    rng: () => 0
  });
  const settled = capDuplicateRefunds(selected, 100);

  assert.deepEqual(settled.map(reward => reward.id), selected.map(reward => reward.id));
  assert.deepEqual(
    settled.map(reward => reward.cardIndex),
    selected.map(reward => reward.cardIndex)
  );
  assert.ok(settled.some(reward => reward.kind === 'hero'));
  assert.ok(settled.some(reward => (
    reward.kind !== 'hero' && reward.rarity.id === 'rare'
  )));
  assert.ok(
    settled.reduce((sum, reward) => sum + reward.shardsReturned, 0)
      <= Math.floor(100 * MAX_DUPLICATE_REFUND_RATIO)
  );
});
