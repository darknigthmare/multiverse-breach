import registry from './characterFormsWave4.generated.json' with { type: 'json' };

const assets = Object.freeze(registry.entries.map(entry => {
  if (entry.id !== 'vincent-chaos' || entry.heroId !== 'vincent_ff7' || entry.universe !== 'Final Fantasy VII'
    || entry.columns !== 4 || entry.rows !== 4 || entry.frames !== 16) throw new Error('Invalid native character form');
  const states = Object.fromEntries(['idle', 'run', 'attack', 'hit'].map((state, row) => {
    if (entry.states?.[state]?.row !== row) throw new Error(`Invalid native character form state: ${state}`);
    return [state, Object.freeze({ ...entry.states[state] })];
  }));
  return Object.freeze({ ...entry, states: Object.freeze(states) });
}));
export const getCharacterFormAssets = () => assets;
export function resolveCharacterFormAsset(actor, formId = 'vincent-chaos') {
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  return assets.find(entry => entry.id === formId && entry.heroId === id && entry.universe === actor?.universe) || null;
}
