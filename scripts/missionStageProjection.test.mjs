import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import {
  MISSION_TEAM_SIZE,
  UNIVERSE_ARC_FINAL_STAGE_BASE_ID,
  partitionMissionSources,
  projectUniverseArcDeploymentPhases
} from '../src/game/missions/missionStageProjection.js';
import { autoComposeMissionTeam, evaluateMissionAccess } from '../src/game/missions/missionAccessRules.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const withRealUniverseArcs = async callback => {
  const vite = await createServer({
    root: projectRoot,
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true }
  });
  try {
    const [narrativeModule, heroesModule] = await Promise.all([
      vite.ssrLoadModule('/src/game/narrativeSystems.js'),
      vite.ssrLoadModule('/src/game/heroes.js')
    ]);
    return await callback(narrativeModule.UNIVERSE_NARRATIVE_ARCS, heroesModule.HEROES_DB);
  } finally {
    await vite.close();
  }
};

test('source partitioning is balanced, deterministic, and never exceeds the squad', () => {
  assert.deepEqual(partitionMissionSources(['A', 'B', 'C', 'D']), [['A', 'B'], ['C', 'D']]);
  assert.deepEqual(partitionMissionSources(['A', 'B', 'C', 'D', 'E']), [['A', 'B', 'C'], ['D', 'E']]);
  assert.deepEqual(partitionMissionSources(['A', 'A', 'B']), [['A', 'B']]);
});

test('every real universe arc projects playable rules and retains its legacy final ID', async () => {
  await withRealUniverseArcs((UNIVERSE_NARRATIVE_ARCS, HEROES_DB) => {
    const playableUniverses = new Set(HEROES_DB.map(hero => hero.universe));
    UNIVERSE_NARRATIVE_ARCS.forEach((arc, arcIndex) => {
      arc.universes.forEach(universe => {
        assert.equal(playableUniverses.has(universe), true, `${arc.id} source ${universe}`);
      });
      const phases = projectUniverseArcDeploymentPhases(arc, arcIndex);
      const heroDb = [...new Set(arc.universes)].map((universe, heroIndex) => ({
        id: `${arc.id}-hero-${heroIndex}`,
        name: `${universe} Operator`,
        universe
      }));
      assert.ok(phases.length > 0, arc.id);
      assert.equal(phases.at(-1).runtimeStageId, UNIVERSE_ARC_FINAL_STAGE_BASE_ID + arcIndex, arc.id);
      assert.equal(phases.at(-1).isArcFinalPhase, true, arc.id);
      assert.deepEqual(phases.flatMap(phase => phase.sourceUniverses), [...new Set(arc.universes)], arc.id);
      phases.forEach((phase, phaseIndex) => {
        const ruleSize = phase.requiredTeam.type === 'sources'
          ? phase.requiredTeam.sourceUniverses.length
          : 1;
        assert.ok(ruleSize <= MISSION_TEAM_SIZE, `${arc.id} phase ${phaseIndex + 1}`);
        assert.equal(phase.requiredTeam.arcId, arc.id);
        assert.equal(phase.previousArcStageId, phaseIndex ? phases[phaseIndex - 1].runtimeStageId : null);
        const stage = {
          arcId: phase.arcId,
          universeArc: phase.universeArc,
          requiredTeam: phase.requiredTeam
        };
        const ownedHeroIds = heroDb.map(hero => hero.id);
        const composition = autoComposeMissionTeam(stage, { heroDb, ownedHeroIds, activeTeam: [] });
        assert.equal(composition.composed, true, `${arc.id} phase ${phaseIndex + 1} auto-compose`);
        assert.equal(evaluateMissionAccess(stage, {
          heroDb,
          ownedHeroIds,
          activeTeam: composition.team,
          baseAccess: true
        }).allowed, true, `${arc.id} phase ${phaseIndex + 1} access`);
      });
    });
    const oversizedIds = ['stargate_chain', 'lab_disasters', 'watcher_hellmouth', 'anime_judgment_cell'];
    oversizedIds.forEach(arcId => {
      const arcIndex = UNIVERSE_NARRATIVE_ARCS.findIndex(arc => arc.id === arcId);
      const phases = projectUniverseArcDeploymentPhases(UNIVERSE_NARRATIVE_ARCS[arcIndex], arcIndex);
      assert.equal(phases.length, 2, arcId);
      assert.ok(phases.every(phase => phase.sourceUniverses.length <= MISSION_TEAM_SIZE), arcId);
    });
  });
});
