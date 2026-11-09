import { DLC_PACK_MANIFESTS } from '../../DLC/index.js';
import profile from '../../DLC/distribution.json' with { type: 'json' };

/** Installation is a property of the distribution, never a save preference. */
export function createDlcInstallation({ manifests, profile: suppliedProfile }) {
  if (suppliedProfile?.schemaVersion !== 1
    || !['all', 'base', 'selected'].includes(suppliedProfile.mode)
    || suppliedProfile.sharedPolicy !== 'preserve-all'
    || Object.keys(suppliedProfile).some(key => !['schemaVersion', 'mode', 'packIds', 'sharedPolicy'].includes(key))
    || !Array.isArray(suppliedProfile.packIds)
    || suppliedProfile.packIds.some(id => typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id))
    || new Set(suppliedProfile.packIds).size !== suppliedProfile.packIds.length
    || ((suppliedProfile.mode === 'selected') !== (suppliedProfile.packIds.length > 0))) {
    throw new Error('Invalid DLC installation profile');
  }
  const ordered = [...manifests].sort((a, b) => a.catalogOrder - b.catalogOrder);
  const byId = new Map();
  const byUniverse = new Map();
  for (const manifest of ordered) {
    if (byId.has(manifest.id) || byUniverse.has(manifest.universe)) throw new Error('Duplicate DLC identity');
    byId.set(manifest.id, manifest);
    byUniverse.set(manifest.universe, manifest);
  }
  for (const id of suppliedProfile.packIds) {
    if (!byId.has(id)) throw new Error(`Unknown DLC pack: ${id}`);
  }
  const included = new Set(suppliedProfile.mode === 'all' ? byId.keys() : suppliedProfile.packIds);
  const installedPackIds = Object.freeze(ordered.filter(pack => included.has(pack.id)).map(pack => pack.id));
  const installedRuntimeUniverses = Object.freeze(ordered.filter(pack => included.has(pack.id) && pack.registration === 'runtime').map(pack => pack.universe));
  const summary = Object.freeze({
    mode: suppliedProfile.mode, installedPackIds, installedRuntimeUniverses,
    installedCount: installedPackIds.length, availableCount: ordered.length
  });
  return Object.freeze({
    isUniverseInstalled: universe => !byUniverse.has(universe) || included.has(byUniverse.get(universe).id),
    isDlcPackInstalled: id => byId.has(id) && included.has(id),
    getInstalledDlcUniverseKeys: () => [...installedRuntimeUniverses],
    getInstalledDlcPackIds: () => [...installedPackIds],
    getDlcInstallationSummary: () => summary
  });
}
const installation = createDlcInstallation({ manifests: DLC_PACK_MANIFESTS, profile });
export const isUniverseInstalled = installation.isUniverseInstalled;
export const isDlcPackInstalled = installation.isDlcPackInstalled;
export const getInstalledDlcUniverseKeys = installation.getInstalledDlcUniverseKeys;
export const getInstalledDlcPackIds = installation.getInstalledDlcPackIds;
export const getDlcInstallationSummary = installation.getDlcInstallationSummary;
