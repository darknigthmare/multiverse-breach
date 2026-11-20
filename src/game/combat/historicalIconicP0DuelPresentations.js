import { getHeroSpriteSheetSrc } from '../spriteAssets.js';
import { drawP0CanonParticle } from '../canonP0ParticleRenderer.js';
import { getHistoricalIconicFighterSource } from './historicalIconicP0FighterActions.js';
import { HISTORICAL_ICONIC_P0_POSE_FALLBACKS } from './historicalIconicP0PoseFallbacks.js';
import { HISTORICAL_LILO_P0_POSE_FALLBACKS } from './historicalLiloP0PoseFallbacks.js';

const allowedSheets = new Map([...HISTORICAL_ICONIC_P0_POSE_FALLBACKS, ...HISTORICAL_LILO_P0_POSE_FALLBACKS]
  .map(pose => [pose.heroId, pose]));

const beat = (at, state, frame, x = 0, y = 0, opacity = 1) => ({ at, state, frame, x, y, opacity });
const scene = (name, englishName, duration, reducedMotionAt, beats, effect = { kind: 'none', startsAt: 0, endsAt: 1 }) => ({
  name, englishName, duration, reducedMotionAt, beats, effect
});
const sequences = {
  lilo_pelekai: {
    intro: scene('Lilo s’arrête et observe', 'Lilo stops to look around', 1.7, .68, [beat(0, 'run', 0, -39), beat(.24, 'run', 1, -20),
      beat(.45, 'run', 0, -7), beat(.68, 'idle', 0), beat(1, 'idle', 1)]),
    outro: scene('Lilo rejoint les siens', 'Lilo heads back to her family', 1.9, 0, [beat(0, 'idle', 1), beat(.34, 'run', 1, -9),
      beat(.54, 'run', 0, -34), beat(.78, 'run', 1, -68), beat(1, 'run', 0, -95, 0, .3)]),
    fatality: scene('Lilo garde un souvenir du duel', 'Lilo takes a keepsake photo', 2.4, .7, [beat(0, 'idle', 0), beat(.25, 'idle', 1),
      beat(.49, 'idle', 0, 4), beat(.7, 'idle', 1), beat(1, 'idle', 0)],
    { kind: 'iconic-camera-shutter', startsAt: .45, endsAt: .56 }),
    victory: scene('Lilo se détend après le duel', 'Lilo relaxes after the duel', 1.9, 0, [beat(0, 'idle', 1), beat(.33, 'idle', 0, 4),
      beat(.67, 'idle', 1, -3), beat(1, 'idle', 1)]),
    defeat: scene('Lilo recule et retrouve son calme', 'Lilo steps back and settles', 1.9, .8, [beat(0, 'idle', 0), beat(.27, 'idle', 1, -9),
      beat(.52, 'idle', 0, -4), beat(.8, 'idle', 0), beat(1, 'idle', 0)]),
    roundVictory: scene('Lilo reprend confiance', 'Lilo regains her confidence', 1.3, 0, [beat(0, 'idle', 0), beat(.33, 'idle', 1, 6),
      beat(.65, 'idle', 0), beat(1, 'idle', 1)]),
    roundDefeat: scene('Lilo marque une pause', 'Lilo takes a breath', 1.3, .67, [beat(0, 'idle', 1), beat(.25, 'idle', 0, -5),
      beat(.67, 'idle', 0), beat(1, 'idle', 1)])
  },
  jack_sparrow_potc: {
    intro: scene('Jack s’avance à pas mesurés', 'Jack advances with measured steps', 1.7, .68, [beat(0, 'run', 0, -52), beat(.26, 'run', 1, -32),
      beat(.46, 'run', 0, -12), beat(.68, 'idle', 0), beat(1, 'idle', 1)]),
    outro: scene('Jack quitte le terrain de biais', 'Jack sidles out of the arena', 1.9, 0, [beat(0, 'idle', 0), beat(.3, 'run', 0, -8),
      beat(.5, 'run', 1, -35), beat(.68, 'run', 0, -66), beat(.88, 'run', 1, -103), beat(1, 'run', 0, -125, 0, .24)]),
    fatality: scene('Jack reprend ses distances', 'Jack backs away', 2.4, .73, [beat(0, 'idle', 0), beat(.21, 'hit', 1, 8),
      beat(.44, 'idle', 1, -14), beat(.73, 'idle', 0), beat(1, 'idle', 0)]),
    victory: scene('Jack retrouve son aplomb', 'Jack regains his composure', 1.9, 0, [beat(0, 'idle', 0), beat(.28, 'hit', 1, -7),
      beat(.59, 'idle', 1, 4), beat(1, 'idle', 0)]),
    defeat: scene('Jack cède du terrain', 'Jack gives ground', 1.9, 0, [beat(0, 'hit', 1), beat(.31, 'hit', 0, -12),
      beat(.63, 'hit', 1, -17), beat(1, 'hit', 1, -17)]),
    roundVictory: scene('Jack rétablit sa position', 'Jack steadies his stance', 1.3, .66, [beat(0, 'idle', 1), beat(.33, 'hit', 1, 4),
      beat(.66, 'idle', 0), beat(1, 'idle', 1)]),
    roundDefeat: scene('Jack chancelle puis se stabilise', 'Jack staggers and catches himself', 1.3, .66, [beat(0, 'hit', 0), beat(.37, 'hit', 1, -8),
      beat(.66, 'idle', 0), beat(1, 'idle', 1)])
  },
  roger_rabbit: {
    intro: scene('Roger arrive d’un pas bondissant', 'Roger bounces into the arena', 1.7, .7, [beat(0, 'run', 0, -49), beat(.22, 'run', 1, -27, -10),
      beat(.44, 'run', 0, -11, -2), beat(.7, 'idle', 0), beat(1, 'idle', 1)]),
    outro: scene('Roger file vers les coulisses', 'Roger scurries backstage', 1.9, 0, [beat(0, 'idle', 1), beat(.3, 'run', 0, -4),
      beat(.46, 'run', 1, -29, -9), beat(.67, 'run', 0, -75), beat(.83, 'run', 1, -108, -9),
      beat(1, 'run', 0, -140, 0, .2)]),
    fatality: scene('Roger conclut par une cabriole', 'Roger finishes with a hop', 2.4, .72, [beat(0, 'idle', 1), beat(.23, 'run', 0, -8),
      beat(.46, 'run', 1, 18, -18), beat(.62, 'idle', 0, 12), beat(.72, 'idle', 1), beat(1, 'idle', 0)]),
    victory: scene('Roger rebondit sur place', 'Roger bounces on the spot', 1.9, 0, [beat(0, 'idle', 0), beat(.31, 'idle', 1, 6, -7),
      beat(.49, 'idle', 0), beat(.69, 'idle', 1, -4, -5), beat(1, 'idle', 0)]),
    defeat: scene('Roger accuse le coup', 'Roger reels from the blow', 1.9, 0, [beat(0, 'hit', 0), beat(.3, 'hit', 0, -10, -5),
      beat(.61, 'hit', 0, -15), beat(1, 'hit', 0, -15)]),
    roundVictory: scene('Roger reprend pied avec un bond', 'Roger springs back onto his feet', 1.3, 0, [beat(0, 'idle', 1), beat(.32, 'idle', 0, 4, -7),
      beat(.66, 'idle', 0), beat(1, 'idle', 1)]),
    roundDefeat: scene('Roger se redresse', 'Roger straightens up', 1.3, .72, [beat(0, 'hit', 0), beat(.34, 'hit', 0, -8, -3),
      beat(.72, 'idle', 0), beat(1, 'idle', 1)])
  }
};
const bodyScales = { lilo_pelekai: .8, jack_sparrow_potc: 1, roger_rabbit: .91 };

export function resolveHistoricalIconicP0DuelPresentation(actor, phase) {
  const heroId = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const pose = allowedSheets.get(heroId);
  if (!pose || !getHistoricalIconicFighterSource(actor)) return null;
  const spec = Object.hasOwn(sequences[heroId], phase) ? sequences[heroId][phase] : null;
  if (!spec || spec.beats.some(({ state }) => getHeroSpriteSheetSrc({ ...actor, state }, 'melee') !== pose.sheet)) return null;
  const name = spec.name;
  return {
    id: `${heroId}:${phase}:reviewed-duel-poses`, heroId, universe: pose.universe, phase, name,
    nameLocalized: { fr: name, en: spec.englishName }, sourceAction: name,
    sourceReference: `${actor.incarnation} · poses vérifiées dans les planches du projet. ${actor.referenceUrl}`,
    sourceAsset: { sheet: pose.sheet, columns: pose.layout.columns, rows: pose.layout.rows, baseline: pose.layout.baseline },
    duration: spec.duration, reducedMotionAt: spec.reducedMotionAt,
    beats: spec.beats.map(item => ({ ...item, scale: bodyScales[heroId] })), effect: { ...spec.effect },
    missingAssets: ['Dedicated source-reviewed phase art and source choreography remain open.'],
    provenance: { kind: 'historical-iconic-duel-presentation', canonicalSequence: false, networkVerified: false,
      dedicatedPhaseArtwork: false, fullSource1to1Verified: false, visualFidelity: 'authored-motion-on-reviewed-legacy-cells' },
    actor: { ...actor }
  };
}

export function drawHistoricalIconicDuelEffect(ctx, sample, x, feetY, facing) {
  if (sample.effect.kind !== 'iconic-camera-shutter') return false;
  ctx.save();
  ctx.globalAlpha *= Math.sin(sample.effect.progress * Math.PI) * .65;
  drawP0CanonParticle(ctx, { type: 'camera_flash', x: x + facing * 32, y: feetY - 104, color: '#fff4d8', size: 14 });
  ctx.restore();
  return true;
}
