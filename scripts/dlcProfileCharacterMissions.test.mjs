import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { MOSAIC_CHARACTER_MISSIONS } from '../src/game/mosaicCharacterMissions.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const missionPacks = DLC_PACK_MANIFESTS.filter(pack => ['halo', 'alien'].includes(pack.id));
const baseUniverse = 'Nexus de Convergence';
const modulePath = 'data/mosaicCharacterMissions.js';
const adapterPath = 'src/game/mosaicCharacterMissions.js';

// Exercise the actual source transformation with uninstalled directories
// physically absent. This fixture makes no claim about export media payloads.
async function loadProfile(context, packIds) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dlc-city-missions-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: packIds });
  await mkdir(path.join(directory, 'src/game'), { recursive: true });
  await writeFile(path.join(directory, 'package.json'), '{"type":"module"}\n');
  const source = await readFile(path.join(root, adapterPath), 'utf8');
  const result = transformer.transform(source, path.join(root, adapterPath));
  await writeFile(path.join(directory, adapterPath), result?.code || source);
  await copyFile(path.join(root, 'src/game/mosaicCityRuntime.js'), path.join(directory, 'src/game/mosaicCityRuntime.js'));
  await copyFile(path.join(root, 'src/game/mosaicCharacterFollowups.js'), path.join(directory, 'src/game/mosaicCharacterFollowups.js'));
  for (const pack of missionPacks) {
    if (!packIds.includes(pack.id)) continue;
    assert.ok(pack.modules.some(module => module.path === modulePath && module.runtimeAdapter === adapterPath),
      'the export registry must declare the mission module for ' + pack.id);
    const relative = path.join(pack.directory, modulePath);
    await mkdir(path.dirname(path.join(directory, relative)), { recursive: true });
    await copyFile(path.join(root, relative), path.join(directory, relative));
  }
  const api = await import(pathToFileURL(path.join(directory, adapterPath)));
  return { api, directory };
}

function catalogContext(universe) {
  const missions = MOSAIC_CHARACTER_MISSIONS.filter(mission => mission.universe === universe);
  const districtId = 'fixture-' + universe;
  return {
    district: { id: districtId, universe },
    anchor: { id: districtId + '::anchor', action: 'anchor', universe },
    residents: [...new Set(missions.flatMap(mission => mission.steps.filter(step => step.type === 'npc').map(step => step.targetId)))].map(id => ({ id, universe })),
    exhibits: [...new Set(missions.flatMap(mission => mission.steps.filter(step => step.type === 'exhibit').map(step => step.targetId)))].map(id => ({ id })),
    unlockedHeroIds: missions.map(mission => mission.heroId)
  };
}

test('City contracts follow their installed packs and dormant dossiers resume after source-only removal', async context => {
  assert.equal(missionPacks.length, 2);
  const witnesses = missionPacks.map(pack => {
    const mission = MOSAIC_CHARACTER_MISSIONS.find(entry => entry.universe === pack.universe);
    assert.ok(mission, 'the complete catalog must contain a City contract for ' + pack.universe);
    return mission;
  });
  const rawProgress = {
    version: 1, activeId: witnesses[1].id, futureVersion: 3,
    records: Object.fromEntries(witnesses.map(mission => [mission.id, {
      heroId: mission.heroId, universe: mission.universe, districtId: catalogContext(mission.universe).district.id,
      completedStepIds: mission.steps.slice(0, Math.min(1, mission.steps.findIndex(step => step.type === 'decision'))).map(step => step.id),
      choiceId: null, completed: false, futureField: { retained: true }
    }]))
  };
  let retained = structuredClone(rawProgress);
  for (const packIds of [[], ['halo'], ['alien'], ['halo', 'alien']]) {
    await context.test(packIds.join('+') || 'base', async profileContext => {
      const { api, directory } = await loadProfile(profileContext, packIds);
      const includedUniverses = new Set([baseUniverse, ...missionPacks.filter(pack => packIds.includes(pack.id)).map(pack => pack.universe)]);
      assert.deepEqual(api.MOSAIC_CHARACTER_MISSIONS, MOSAIC_CHARACTER_MISSIONS.filter(mission => includedUniverses.has(mission.universe)),
        'retained contracts keep their IDs, source universe, steps and text');
      retained = api.normalizeMosaicCharacterMissions(JSON.parse(JSON.stringify(retained)));
      assert.deepEqual(retained, rawProgress, 'removing a source pack must preserve its saved dossier and unknown fields');
      for (const pack of missionPacks) {
        const expected = MOSAIC_CHARACTER_MISSIONS.filter(mission => mission.universe === pack.universe);
        const catalog = api.getMosaicCharacterMissionCatalog(catalogContext(pack.universe));
        assert.deepEqual(catalog.map(mission => mission.id), packIds.includes(pack.id) ? expected.map(mission => mission.id) : []);
        const witness = witnesses.find(mission => mission.universe === pack.universe);
        const mission = catalog.find(item => item.id === witness.id);
        if (packIds.includes(pack.id)) {
          const resumed = api.startMosaicCharacterMission(retained, mission).progress;
          assert.deepEqual(resumed.records, rawProgress.records, 'reinstallation resumes the same saved steps');
          assert.equal(api.getMosaicCharacterMissionObjective(resumed, mission).index, rawProgress.records[witness.id].completedStepIds.length);
        } else {
          await assert.rejects(stat(path.join(directory, pack.directory)), { code: 'ENOENT' });
          const unavailable = api.startMosaicCharacterMission(retained, mission);
          assert.equal(unavailable.reason, 'unavailable');
          assert.equal(unavailable.progress, retained);
          assert.deepEqual(api.getMosaicCharacterMissionZones(retained, catalog), []);
        }
      }
    });
  }
});
