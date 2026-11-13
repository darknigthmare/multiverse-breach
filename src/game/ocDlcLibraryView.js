import { normalizeCatalogQuery } from './catalogPagination.js';

export function getOcDlcLibraryEntries({ packs, metadata, completedStages = [], hiddenUniverses = [], isInstalled, canOpenMission, resolvePack = pack => pack }) {
  const completed = new Set(completedStages.map(String));
  const hidden = new Set(hiddenUniverses);
  const loadedIds = new Set(packs.map(pack => pack.id));
  const sources = [...packs.map(resolvePack), ...metadata.filter(pack => !loadedIds.has(pack.id))];
  return sources.map(pack => {
    const loaded = loadedIds.has(pack.id);
    const included = loaded && isInstalled(pack.universe);
    const active = included && !hidden.has(pack.universe);
    const missions = loaded ? pack.missions : [];
    const missionIds = loaded ? missions.map(mission => mission.id) : pack.missionIds;
    const completedCount = missionIds.filter(id => completed.has(String(id))).length;
    const complete = missionIds.length > 0 && completedCount === missionIds.length;
    const nextMission = missions.find(mission => !completed.has(String(mission.id)) && canOpenMission(mission, completedStages)) || null;
    const targetMission = nextMission || (complete ? missions.at(-1) : null);
    return { pack, loaded, included, active, state: !included ? 'absent' : active ? 'active' : 'reserve',
      savedReserve: hidden.has(pack.universe), missionIds, completedCount, complete, targetMission,
      targetUnlocked: Boolean(active && targetMission && (complete || canOpenMission(targetMission, completedStages))) };
  });
}

export function filterOcDlcLibraryEntries(entries, { query = '', status = 'all' } = {}) {
  const words = normalizeCatalogQuery(query).split(/\s+/).filter(Boolean);
  const localized = value => typeof value === 'string' ? value : Object.values(value || {}).join(' ');
  return entries.filter(entry => {
    if (status !== 'all' && (status === 'completed' ? !entry.complete : entry.state !== status)) return false;
    const pack = entry.pack;
    const text = normalizeCatalogQuery([pack.universe, localized(pack.title), localized(pack.desc), localized(pack.actLabel),
      ...(pack.missions || []).map(mission => localized(mission.displayName || mission.name))].join(' '));
    return words.every(word => text.includes(word));
  });
}
