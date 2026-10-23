import wave11 from './summonAnimationsWave11.generated.json' with { type: 'json' };
import wave10 from './summonAnimationsWave10.generated.json' with { type: 'json' };
import registry from './summonAnimationsWave5.generated.json' with { type: 'json' };
import wave6 from './summonAnimationsWave6.generated.json' with { type: 'json' };
import wave7 from './summonAnimationsWave7.generated.json' with { type: 'json' };
import wave8 from './summonAnimationsWave8.generated.json' with { type: 'json' };
import wave9 from './summonAnimationsWave9.generated.json' with { type: 'json' };
import { sampleSummonAnimationFrame } from './summonAnimationState.js';

const phaseNames = ['arrival', 'preparation', 'attack', 'recovery'];
const assets = new Map();
for (const entry of [...registry.entries, ...wave6.entries, ...wave7.entries, ...wave8.entries, ...wave9.entries, ...wave10.entries, ...wave11.entries]) {
  const key = [entry.universe, entry.entityName, entry.actionName].join('::');
  if (entry.key !== key || assets.has(key) || entry.columns !== 4 || entry.rows !== 4 || entry.frames !== 16)
    throw new Error(`Invalid or duplicate native summon animation: ${entry.id}`);
  const phases = Object.fromEntries(phaseNames.map((phase, row) => {
    if (entry.phases?.[phase]?.row !== row || entry.phases[phase].frames !== 4) throw new Error(`Invalid native summon phase: ${key}:${phase}`);
    return [phase, Object.freeze({ ...entry.phases[phase] })];
  }));
  assets.set(key, Object.freeze({ ...entry, phases: Object.freeze(phases) }));
}
const all = Object.freeze([...assets.values()]);
export const getSummonAnimationAssets = () => all;
export function resolveSummonAnimationAsset(descriptor) {
  if (!['summon', 'reinforcement'].includes(descriptor?.kind)) return null;
  const key = [descriptor.universe, descriptor.entityName, descriptor.action?.name].join('::');
  const entry = assets.get(key);
  if (entry?.bodySource === 'roster-performer') {
    const performer = descriptor.performer;
    const performerId = performer?.sourceHeroId || performer?.sourceId || performer?.id;
    return entry.kind === 'reinforcement' && descriptor.kind === 'reinforcement'
      && !descriptor.entityRender?.asset
      && descriptor.performerRole === 'reinforcement' && performerId === entry.performerHeroId
      && performer?.universe === entry.universe && descriptor.sourceHeroId === entry.performerHeroId
      && descriptor.action?.sourceHeroId === entry.performerHeroId ? entry : null;
  }
  return entry && (entry.kind || 'summon') === descriptor.kind && descriptor.entityRender?.asset?.key === key ? entry : null;
}
export function getSummonAnimationFrame(scene, choreography) {
  if (scene?.actor?.universe !== scene?.descriptor?.universe) return null;
  const asset = resolveSummonAnimationAsset(scene?.descriptor);
  return sampleSummonAnimationFrame(scene, asset, choreography);
}
