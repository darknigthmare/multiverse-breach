import wave11A from './characterAnimationsWave11PartA.generated.json' with { type: 'json' };
import wave11B from './characterAnimationsWave11PartB.generated.json' with { type: 'json' };
import wave11C from './characterAnimationsWave11PartC.generated.json' with { type: 'json' };
import wave11D from './characterAnimationsWave11PartD.generated.json' with { type: 'json' };
import registry from './characterAnimations.generated.json' with { type: 'json' };
import wave2A from './characterAnimationsWave2PartA.generated.json' with { type: 'json' };
import wave2B from './characterAnimationsWave2PartB.generated.json' with { type: 'json' };
import wave3A from './characterAnimationsWave3PartA.generated.json' with { type: 'json' };
import wave3B from './characterAnimationsWave3PartB.generated.json' with { type: 'json' };
import wave3C from './characterAnimationsWave3PartC.generated.json' with { type: 'json' };
import wave4A from './characterAnimationsWave4PartA.generated.json' with { type: 'json' };
import wave4B from './characterAnimationsWave4PartB.generated.json' with { type: 'json' };
import wave4C from './characterAnimationsWave4PartC.generated.json' with { type: 'json' };
import wave5B from './characterAnimationsWave5PartB.generated.json' with { type: 'json' };
import wave5A from './characterAnimationsWave5PartA.generated.json' with { type: 'json' };
import wave5C from './characterAnimationsWave5PartC.generated.json' with { type: 'json' };
import wave6A from './characterAnimationsWave6PartA.generated.json' with { type: 'json' };
import wave6B from './characterAnimationsWave6PartB.generated.json' with { type: 'json' };
import wave6C from './characterAnimationsWave6PartC.generated.json' with { type: 'json' };
import wave7A from './characterAnimationsWave7PartA.generated.json' with { type: 'json' };
import wave7B from './characterAnimationsWave7PartB.generated.json' with { type: 'json' };
import wave7C from './characterAnimationsWave7PartC.generated.json' with { type: 'json' };
import wave8B from './characterAnimationsWave8PartB.generated.json' with { type: 'json' };
import wave8A from './characterAnimationsWave8PartA.generated.json' with { type: 'json' };
import wave8C from './characterAnimationsWave8PartC.generated.json' with { type: 'json' };
import wave8D from './characterAnimationsWave8PartD.generated.json' with { type: 'json' };

import wave9B from './characterAnimationsWave9PartB.generated.json' with { type: 'json' };

import wave9C from './characterAnimationsWave9PartC.generated.json' with { type: 'json' };

import wave9A from './characterAnimationsWave9PartA.generated.json' with { type: 'json' };

import wave9D from './characterAnimationsWave9PartD.generated.json' with { type: 'json' };

import wave10A from './characterAnimationsWave10PartA.generated.json' with { type: 'json' };

import wave10B from './characterAnimationsWave10PartB.generated.json' with { type: 'json' };

import wave10C from './characterAnimationsWave10PartC.generated.json' with { type: 'json' };

import wave10D from './characterAnimationsWave10PartD.generated.json' with { type: 'json' };

const phaseNames = new Set(['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super']);
const assets = new Map();
for (const entry of [...registry.entries, ...wave2A.entries, ...wave2B.entries, ...wave3A.entries, ...wave3B.entries, ...wave3C.entries, ...wave4A.entries, ...wave4B.entries, ...wave4C.entries, ...wave5A.entries, ...wave5B.entries, ...wave5C.entries, ...wave6A.entries, ...wave6B.entries, ...wave6C.entries, ...wave7A.entries, ...wave7B.entries, ...wave7C.entries, ...wave8A.entries, ...wave8B.entries, ...wave8C.entries, ...wave8D.entries, ...wave9A.entries, ...wave9B.entries, ...wave9C.entries, ...wave9D.entries, ...wave10D.entries, ...wave10C.entries, ...wave10B.entries, ...wave10A.entries, ...wave11A.entries, ...wave11B.entries, ...wave11C.entries, ...wave11D.entries]) {
  const id = entry.heroId || entry.id;
  if (!id || assets.has(id)) throw new Error(`Invalid or duplicate character animation identity: ${id}`);
  const phases = Object.freeze(Object.fromEntries(Object.entries(entry.phases).map(([phase, spec]) => [phase, Object.freeze({ ...spec })])));
  assets.set(id, Object.freeze({ ...entry, heroId: id, phases }));
}
const allAssets = Object.freeze([...assets.values()]);
export const getCharacterAnimationAssets = () => allAssets;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function resolveCharacterAnimationAsset(actor) {
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const entry = assets.get(id);
  return entry?.universe === actor?.universe ? entry : null;
}

export function getCharacterAnimationFrame(actor, options = {}) {
  const asset = resolveCharacterAnimationAsset(actor);
  if (!asset) return null;
  const action = actor?.action;
  const automaticPhase = action?.superProfile || action?.type === 'super' ? 'super'
    : ['intro', 'outro', 'victory', 'defeat'].includes(actor?.state) ? actor.state
      : actor?.state === 'special' && !action?.abilityProfile ? 'super' : null;
  const phase = options.phase || actor?.presentationPhase || automaticPhase;
  const spec = phaseNames.has(phase) ? asset.phases[phase] : null;
  if (!spec || !Number.isFinite(spec.row) || spec.row < 0 || spec.row >= asset.rows) return null;
  const duration = Number(action?.duration || actor?.meleePresentation?.duration || spec.duration) || (phase === 'super' ? 1.1 : 1.9);
  const progressValue = options.progress ?? actor?.presentationProgress
    ?? (Number.isFinite(action?.elapsed) ? action.elapsed / duration
      : Number(options.elapsedSeconds ?? actor?.stateElapsed ?? 0) / duration);
  const progress = clamp(Number(progressValue) || 0, 0, 1);
  // Vincent's human preparation plays before the separate Chaos body takes
  // over (.28–.82). All four native preparation poses remain reachable; the
  // final human pose is restored after the projected transformation ends.
  const poseProgress = asset.heroId === 'vincent_ff7' && phase === 'fatality'
    ? progress < 0.28 ? progress / 0.28 : progress >= 0.82 ? 1 : progress
    : progress;
  const frames = Math.min(asset.columns, Math.max(1, Number(spec.frames) || 4));
  const impactProgress = clamp(Number(options.impactProgress ?? actor?.presentationImpactProgress ?? (action?.hitAt / duration)) || 0.5, 0.05, 0.9);
  const column = phase === 'super' && frames === 4
    ? progress < impactProgress * 0.55 ? 0 : progress < impactProgress ? 1 : progress < Math.min(0.95, impactProgress + (1 - impactProgress) * 0.65) ? 2 : 3
    : Math.min(frames - 1, Math.floor(poseProgress * frames));
  return {
    asset, phase, progress, impactProgress, row: Math.floor(spec.row),
    col: column,
    frames, columns: asset.columns, rows: asset.rows,
    fidelity: 'native-generated-character-animation', canonicalAnimationVerified: false
  };
}
