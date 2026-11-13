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
  if (!actor || actor.universe !== 'Star Wars' || typeof actor.id !== 'string' || !actor.id) return null;
  // Combat projections can have a technical ID while the source ID still owns
  // their bitmap. Follow the sprite resolver's alias precedence, without
  // accepting malformed aliases or inferring an incarnation from the alias.
  const sourceId = actor.sourceHeroId || actor.sourceId || actor.id;
  for (const id of [actor.id, sourceId]) {
    if (typeof id !== 'string' || !Object.hasOwn(QUARANTINED_CANON_SPRITES, id)) continue;
    const record = QUARANTINED_CANON_SPRITES[id];
    // The same ID can be reused in custom contexts: never quarantine other
    // incarnations based on a name alone.
    if (actor.incarnation === record.incarnation) return record;
  }
  return null;
}

// A separate, bounded review of an already delivered correction. The original
// rejected asset and getQuarantinedCanonSprite remain unchanged. These hashes
// pin repository/build inputs; they are not a browser cryptographic attestation.
export const REVIEWED_KOTOR_I_REVAN_CORRECTION = Object.freeze({
  actorId: 'darth_revan', universe: 'Star Wars',
  incarnation: 'Star Wars: Knights of the Old Republic I - masked Darth Revan (Legends Sith)',
  sheet: '/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png',
  sha256: 'c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf',
  sourceImageSha256: '82d719a4a639896dd39c37d9b19e3dc87f23ffb6f3ddbc2d7e9193039604e03b',
  sourceWork: 'Star Wars: Knights of the Old Republic (2003), masked Darth Revan in the selected dark-side armour',
  baseline: 244, renderScale: 1.6067213893363068,
  portrait: Object.freeze({ x: 100, y: 116, width: 58, height: 72 }),
  review: 'single-red-corrected-16-pose-family',
  fullSource1to1Verified: false
});

/** Only the exact inspected correction can replace the KI placeholder. */
export function getReviewedQuarantineCorrection(actor, candidate) {
  const approved = REVIEWED_KOTOR_I_REVAN_CORRECTION;
  if (actor?.id !== approved.actorId || actor.universe !== approved.universe || actor.incarnation !== approved.incarnation
    || [actor.sourceHeroId, actor.sourceId].some(id => id !== undefined && id !== '' && id !== approved.actorId)
    || getQuarantinedCanonSprite(actor) !== QUARANTINED_CANON_SPRITES.darth_revan
    || candidate?.heroId !== approved.actorId || candidate.universe !== approved.universe
    || candidate.sheet !== approved.sheet || candidate.sha256 !== approved.sha256
    || candidate.sourceImageSha256 !== approved.sourceImageSha256 || candidate.sourceWork !== approved.sourceWork
    || candidate.width !== 1024 || candidate.height !== 1024 || candidate.columns !== 4 || candidate.rows !== 4 || candidate.frames !== 16
    || candidate.normalization?.baseline !== approved.baseline || !Array.isArray(candidate.normalization?.rows) || candidate.normalization.rows.length !== 4
    || candidate.normalization.rows.some(row => row?.renderScale !== approved.renderScale)) return null;
  for (const [index, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    if (candidate.states?.[state]?.row !== index || candidate.states[state].frames !== 4 || candidate.states[state].columns !== 4) return null;
  }
  return approved;
}
