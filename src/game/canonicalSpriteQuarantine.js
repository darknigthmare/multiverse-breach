/**
 * Runtime visual-safety gate for assets that have failed an actual source-art
 * inspection. These are provisional game silhouettes, not certified art.
 *
 * Record origin: docs/excel/star-wars-edition-sprite-review-2026-11-01.csv
 * and scripts/auditCanonicalStarWarsSprites.mjs, GitHub artifact 13103845643.
 * The complete original PNGs stay on disk for back-office review.
 *
 * An updated PNG must be reviewed and this gate deliberately removed in a
 * documented source-art correction. Merely replacing bytes is not approval.
 */
export const QUARANTINED_CANON_SPRITES = Object.freeze({
  ahsoka_padawan: Object.freeze({
    universe: 'Star Wars',
    incarnation: 'The Clone Wars - early Padawan, age fourteen',
    asset: '/sprites/generated/heroes/star-wars/ahsoka-padawan.png',
    sha256: '1a7f3488717f94d3789982e6acb1f7e961f9298c4b065cbdd3f8af89c9448b3c',
    reason: 'WRONG_FANTASY_MAGE_STAFF_NO_GREEN_SABER'
  }),
  ahsoka: Object.freeze({
    universe: 'Star Wars',
    incarnation: 'The Clone Wars - Season 7, Siege of Mandalore',
    asset: '/sprites/generated/heroes/star-wars/ahsoka.png',
    sha256: 'd5c49fd412868d187aca84241af1a191ffa55337a248982f2e79edd0daff22f3',
    reason: 'WRONG_FANTASY_ROBES_NO_TWIN_BLUE_SABERS'
  }),
  darth_revan: Object.freeze({
    universe: 'Star Wars',
    incarnation: 'Star Wars: Knights of the Old Republic I - masked Darth Revan (Legends Sith)',
    asset: '/sprites/generated/heroes/star-wars/darth-revan.png',
    sha256: '78200992ef619c3e7d16907db20496df67b018c1fb99697bcf75dce3ea43169c',
    reason: 'KOTOR_I_WRONG_RED_PURPLE_PAIR'
  })
});

/**
 * Only the identified Star Wars incarnation is gated. No database, save ID,
 * gameplay stats, abilities or other hero appearance is modified.
 *
 * This guard is deliberately not controlled by a saved cosmetic flag: an
 * unreviewed skin cannot accidentally turn known-bad source art back on.
 */
export function getQuarantinedCanonSprite(actor) {
  if (!actor || actor.universe !== 'Star Wars' || typeof actor.id !== 'string') return null;
  const record = QUARANTINED_CANON_SPRITES[actor.id];
  if (!record) return null;
  // The same ID can be reused in custom contexts: never quarantine other
  // incarnations based on a name alone.
  if (actor.incarnation !== record.incarnation) return null;
  return record;
}
