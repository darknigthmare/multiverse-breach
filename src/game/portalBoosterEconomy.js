export const PORTAL_BOOSTER_PRICES = Object.freeze({
  broad: 80,
  targeted: 100
});

export const MAX_DUPLICATE_REFUND_RATIO = 0.7;

export const getBoosterPrice = (banner) => (
  PORTAL_BOOSTER_PRICES[banner?.priceTier] || PORTAL_BOOSTER_PRICES.targeted
);

const toRefundAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
};

/**
 * Caps duplicate conversion after rewards have been selected, so pack scope,
 * guarantees, card order and pity behavior remain unchanged.
 */
export const capDuplicateRefunds = (rewards, price) => {
  if (!Array.isArray(rewards)) {
    throw new TypeError('rewards must be an array.');
  }

  const normalizedPrice = Number(price);
  if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
    throw new TypeError('price must be a finite non-negative number.');
  }

  const normalizedRewards = rewards.map(reward => {
    const rawShardsReturned = reward?.wasDuplicate
      ? toRefundAmount(reward.shardsReturned)
      : 0;
    return {
      ...reward,
      rawShardsReturned,
      shardsReturned: rawShardsReturned
    };
  });
  const rawTotal = normalizedRewards.reduce(
    (total, reward) => total + reward.rawShardsReturned,
    0
  );
  const refundCap = Math.floor(normalizedPrice * MAX_DUPLICATE_REFUND_RATIO);

  if (rawTotal <= refundCap || rawTotal === 0) return normalizedRewards;

  const allocations = normalizedRewards.map((reward, index) => {
    if (reward.rawShardsReturned === 0) {
      return { index, awarded: 0, remainder: 0, cardIndex: reward.cardIndex ?? index };
    }
    const exactShare = (reward.rawShardsReturned * refundCap) / rawTotal;
    return {
      index,
      awarded: Math.floor(exactShare),
      remainder: exactShare - Math.floor(exactShare),
      cardIndex: reward.cardIndex ?? index
    };
  });
  let remaining = refundCap - allocations.reduce(
    (total, allocation) => total + allocation.awarded,
    0
  );

  allocations
    .filter(allocation => normalizedRewards[allocation.index].rawShardsReturned > 0)
    .sort((left, right) => (
      right.remainder - left.remainder
      || left.cardIndex - right.cardIndex
      || left.index - right.index
    ))
    .forEach(allocation => {
      if (remaining <= 0) return;
      allocation.awarded += 1;
      remaining -= 1;
    });

  const awardedByIndex = new Map(
    allocations.map(allocation => [allocation.index, allocation.awarded])
  );
  return normalizedRewards.map((reward, index) => ({
    ...reward,
    shardsReturned: Math.min(
      reward.rawShardsReturned,
      awardedByIndex.get(index) || 0
    )
  }));
};
