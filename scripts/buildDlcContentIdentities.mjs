import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { PROJECT_ROOT, readDlcManifests } from './buildDlcRegistry.mjs';
import { getArcReplayDescriptor } from '../src/game/missions/arcReplayMigration.js';

export function appendStableIndexes(previous = {}, keys = []) {
  const result = { ...previous };
  const used = new Set();
  for (const [key, value] of Object.entries(result)) {
    if (!key || !Number.isSafeInteger(value) || value < 0 || used.has(value)) throw new Error('Invalid historical DLC index');
    used.add(value);
  }
  let next = used.size ? Math.max(...used) + 1 : 0;
  const seen = new Set();
  for (const key of keys) {
    if (typeof key !== 'string' || !key || seen.has(key)) throw new Error(`Duplicate or invalid content identity: ${key}`);
    seen.add(key);
    if (!Object.hasOwn(result, key)) result[key] = next++;
  }
  return result;
}

export function mergeReplayIdentities(previous = [], current = []) {
  const records = new Map();
  for (const item of [...previous, ...current]) {
    if (!item?.arcId || !Array.isArray(item.finalStageIds) || !item.finalStageIds.length) throw new Error('Invalid replay identity');
    const old = records.get(item.arcId);
    records.set(item.arcId, {
      ...old, ...item,
      finalStageIds: [...new Set([...(old?.finalStageIds || []), ...item.finalStageIds])]
    });
  }
  return [...records.values()];
}

export async function buildDlcContentIdentities({ root = PROJECT_ROOT, previous } = {}) {
  const profile = JSON.parse(readFileSync(path.join(root, 'DLC/distribution.json'), 'utf8'));
  if (profile.mode !== 'all') throw new Error('Content identities must be generated from a complete all profile');
  readDlcManifests(root);
  const prior = previous || JSON.parse(readFileSync(path.join(root, 'DLC/content-identities.json'), 'utf8'));
  if (prior.schemaVersion !== 1) throw new Error('Unsupported content identity schema');
  const vite = await createServer({ configFile: false, root, logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const heroes = await vite.ssrLoadModule('/src/game/heroes.js');
    const expanded = await vite.ssrLoadModule('/src/game/expandedUniverses.js');
    const narrative = await vite.ssrLoadModule('/src/game/narrativeSystems.js');
    const oc = await vite.ssrLoadModule('/src/game/ocDlcPacks.js');
    const generated = narrative.CHARACTER_NARRATIVE_ARCS.filter(arc => arc.rewardItemId?.startsWith('char_auto_'));
    const indexes = {
      expandedUniverses: appendStableIndexes(prior.indexes.expandedUniverses, expanded.EXPANDED_UNIVERSES.map(item => item.universe)),
      generatedCharacterArcs: appendStableIndexes(prior.indexes.generatedCharacterArcs, generated.map(arc => arc.heroId)),
      universeArcs: appendStableIndexes(prior.indexes.universeArcs, narrative.UNIVERSE_NARRATIVE_ARCS.map(arc => arc.id))
    };
    const currentArcs = [
      ...narrative.CHARACTER_NARRATIVE_ARCS.map(arc => getArcReplayDescriptor(
        arc.rewardItemId?.startsWith('char_auto_') ? { ...arc, stageId: 9300 + indexes.generatedCharacterArcs[arc.heroId] } : arc
      )).filter(Boolean),
      ...narrative.TRIO_NARRATIVE_ARCS.map(getArcReplayDescriptor).filter(Boolean),
      ...narrative.FUSION_MISSIONS.map(mission => ({ arcId: mission.id, finalStageIds: [mission.stageId] })),
      ...narrative.UNIVERSE_NARRATIVE_ARCS.map(arc => ({
        arcId: arc.id, finalStageIds: [40000 + indexes.universeArcs[arc.id]], rewardItemId: `universe_arc_${arc.id}`
      }))
    ];
    const packs = new Map((prior.ocPacks || []).map(pack => [pack.id, pack]));
    for (const pack of oc.OC_DLC_PACKS) {
      const old = packs.get(pack.id);
      packs.set(pack.id, { id: pack.id, universe: pack.universe, missionIds: [...new Set([...(old?.missionIds || []), ...pack.missions.map(mission => mission.id)])] });
    }
    return {
      schemaVersion: 1,
      baselineCommit: prior.baselineCommit,
      indexes,
      knownHeroIds: [...new Set([...(prior.knownHeroIds || []), ...heroes.HEROES_DB.map(hero => hero.id)])],
      ocPacks: [...packs.values()],
      arcReplayDefinitions: mergeReplayIdentities(prior.arcReplayDefinitions, currentArcs)
    };
  } finally {
    await vite.close();
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => !['--check', '--write'].includes(arg)) || (args.includes('--check') && args.includes('--write'))) {
      throw new Error('Usage: node scripts/buildDlcContentIdentities.mjs [--check | --write]');
    }
    const file = path.join(PROJECT_ROOT, 'DLC/content-identities.json');
    const data = await buildDlcContentIdentities();
    const expected = JSON.stringify(data, null, 2) + '\n';
    if (args.includes('--write')) writeFileSync(file, expected);
    else if (readFileSync(file, 'utf8') !== expected) throw new Error('DLC identities are stale. Run npm run dlc:identities:write from the complete catalogue.');
    console.log(`DLC identities: ${data.knownHeroIds.length} heroes, ${data.arcReplayDefinitions.length} replay arcs, ${data.ocPacks.length} OC saves.`);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}
