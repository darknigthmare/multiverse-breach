import { getQuarantinedCanonSprite as getArchivedQuarantine, QUARANTINED_CANON_SPRITES } from './canonicalSpriteQuarantine.js';
import { HISTORICAL_DC_P0_SPRITE_QUARANTINES } from './historicalDcP0SpriteQuarantine.js';
import { HISTORICAL_LILO_STITCH_P0_SPRITE_QUARANTINES } from './historicalLiloStitchP0SpriteQuarantine.js';
import { HISTORICAL_SPIDER_P0_SPRITE_QUARANTINES } from './historicalSpiderP0SpriteQuarantine.js';
import { HISTORICAL_STAR_WARS_P0_SPRITE_QUARANTINES } from './historicalStarWarsP0SpriteQuarantine.js';
import { HISTORICAL_WIZARD_MINION_P0_SPRITE_QUARANTINES } from './historicalWizardMinionP0SpriteQuarantine.js';

export const HISTORICAL_P0_SPRITE_QUARANTINES = Object.freeze([
  ...HISTORICAL_DC_P0_SPRITE_QUARANTINES,
  ...HISTORICAL_LILO_STITCH_P0_SPRITE_QUARANTINES,
  ...HISTORICAL_SPIDER_P0_SPRITE_QUARANTINES,
  ...HISTORICAL_STAR_WARS_P0_SPRITE_QUARANTINES,
  ...HISTORICAL_WIZARD_MINION_P0_SPRITE_QUARANTINES
]);
const rejectedByActorId = new Map(HISTORICAL_P0_SPRITE_QUARANTINES.map(record => [record.actorId, record]));

// CG history pins the legacy register byte for byte. Gameplay also checks the
// newly inspected sheets, even when an engine projects a side-specific ID.
export function getQuarantinedCanonSprite(actor) {
  if (!actor || typeof actor.id !== 'string' || !actor.id) return null;
  const sourceId = actor.sourceHeroId || actor.sourceId || actor.id;
  const exactRecord = rejectedByActorId.get(actor.id);
  const sourceRecord = rejectedByActorId.get(sourceId);
  for (const record of [exactRecord, sourceRecord]) {
    if (record && actor.universe === record.universe && actor.incarnation === record.incarnation) return record;
  }
  const legacyCandidate = Object.hasOwn(QUARANTINED_CANON_SPRITES, actor.id)
    || (typeof sourceId === 'string' && Object.hasOwn(QUARANTINED_CANON_SPRITES, sourceId));
  return legacyCandidate ? getArchivedQuarantine(actor) : null;
}
