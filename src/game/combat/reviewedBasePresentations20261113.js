import { getReviewedQuarantinedHeroSprite } from '../spriteAssets.js';
import { REVIEWED_KOTOR_I_REVAN_CORRECTION } from '../canonicalSpriteQuarantine.js';

const beat = (at, state, frame, x = 0, opacity = 1) => ({ at, state, frame, x, y: 0, scale: 1, opacity });
const phases = Object.freeze({
  intro: Object.freeze({
    name: 'Revan rejoint sa garde, sabre rouge abaissé', duration: 1.8,
    beats: [beat(0, 'run', 0, -28), beat(.16, 'run', 1, -20), beat(.32, 'run', 2, -12),
      beat(.48, 'run', 3, -3), beat(.6, 'idle', 0), beat(.74, 'idle', 1), beat(.88, 'idle', 2), beat(1, 'idle', 3)]
  }),
  outro: Object.freeze({
    name: 'Revan se détourne et quitte le duel', duration: 2.1,
    beats: [beat(0, 'idle', 0), beat(.14, 'idle', 1), beat(.28, 'run', 0, -4),
      beat(.44, 'run', 1, -38), beat(.6, 'run', 2, -73), beat(.76, 'run', 3, -108),
      beat(.9, 'run', 0, -137, .5), beat(1, 'run', 1, -160, .2)]
  }),
  victory: Object.freeze({
    name: 'Revan conserve sa garde après le duel', duration: 1.9,
    beats: [beat(0, 'idle', 0), beat(.25, 'idle', 1), beat(.5, 'idle', 2), beat(.75, 'idle', 3), beat(1, 'idle', 0)]
  })
});

export const hasReviewedBasePresentationSource20261113 = actor =>
  getReviewedQuarantinedHeroSprite(actor) === REVIEWED_KOTOR_I_REVAN_CORRECTION;

/**
 * Authored motion on the exact already-reviewed KOTOR I base16. This is not a
 * new phase atlas or a recreation of an original game's cinematic. In
 * particular, it never selects the archived W13 phase atlas or supplies a finisher.
 */
export function resolveReviewedBasePresentation20261113(actor, phase) {
  const reviewed = getReviewedQuarantinedHeroSprite(actor);
  const spec = phases[phase];
  if (reviewed !== REVIEWED_KOTOR_I_REVAN_CORRECTION || !spec) return null;
  return {
    id: `${reviewed.actorId}:${phase}:reviewed-base16-20261113`,
    heroId: reviewed.actorId, universe: reviewed.universe, phase,
    name: spec.name, sourceAction: spec.name,
    sourceReference: 'Star Wars: Knights of the Old Republic (2003), selected masked KOTOR I Revan; single red blade and broad costume checked against https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii. Movement and timing are authored adaptations of the reviewed base16, not source cinematic frames.',
    sourceAsset: { sheet: reviewed.sheet, sha256: reviewed.sha256, columns: 4, rows: 4, baseline: reviewed.baseline },
    duration: spec.duration, beats: spec.beats.map(entry => ({ ...entry })),
    effect: { kind: 'none', startsAt: 0, endsAt: 1 },
    missingAssets: ['Dedicated source-reviewed intro/outro/victory phase artwork remains undelivered.',
      'Original cinematic timing and source choreography remain unverified.'],
    provenance: { kind: 'reviewed-base16-presentation', canonicalSequence: false, networkVerified: false,
      dedicatedPhaseArtwork: false, fullSource1to1Verified: false,
      visualFidelity: 'authored-motion-on-reviewed-base16-not-native-phase-art' },
    actor: { ...actor }
  };
}

export function resolveReviewedBasePresentationFrame20261113(actor, phase, state, column) {
  const reviewed = getReviewedQuarantinedHeroSprite(actor);
  if (reviewed !== REVIEWED_KOTOR_I_REVAN_CORRECTION || !phases[phase] || !['idle', 'run'].includes(state)) return null;
  return {
    kind: 'reviewed-character-base16', actorId: reviewed.actorId, sheet: reviewed.sheet,
    state, requestedState: state, row: state === 'run' ? 1 : 0,
    col: Math.max(0, Math.min(3, Math.floor(column))), columns: 4, rows: 4,
    dedicatedPhaseAsset: false
  };
}
