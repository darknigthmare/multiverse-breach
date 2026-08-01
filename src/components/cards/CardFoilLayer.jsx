import React from 'react';

const SUPPORTED_FINISHES = new Set([
  'holo-thread',
  'portal-foil',
  'negative-archive',
  'animated'
]);

function CardFoilLayer({ finishId = 'standard' }) {
  if (!SUPPORTED_FINISHES.has(finishId)) return null;

  return (
    <span
      className={`tcg-card-foil tcg-card-foil-${finishId}`}
      aria-hidden="true"
    />
  );
}

export default React.memo(CardFoilLayer);
