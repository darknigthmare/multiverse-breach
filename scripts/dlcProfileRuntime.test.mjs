import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const packByDirectory = new Map(DLC_PACK_MANIFESTS.map(pack => [pack.directory, pack]));
const packByUniverse = new Map(DLC_PACK_MANIFESTS.map(pack => [pack.universe, pack]));
const plain = value => JSON.parse(JSON.stringify(value));

async function createProfileServer(mode, packIds) {
  const profile = { schemaVersion: 1, mode, packIds, sharedPolicy: 'preserve-all' };
  const installed = new Set(mode === 'all' ? DLC_PACK_MANIFESTS.map(pack => pack.id) : packIds);
  const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: installed });
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [{
      name: 'dlc-profile-runtime-regression',
      enforce: 'pre',
      transform(source, id) {
        if (id.split('?')[0] === root + '/DLC/distribution.json') return { code: JSON.stringify(profile), map: null };
        if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
        const result = transformer.transform(source, id);
        return result ? { code: result.code, map: null } : null;
      }
    }, react()],
    server: { middlewareMode: true, watch: null },
    appType: 'custom'
  });
  return { server, installed };
}

test('complete and reduced profiles instantiate the real game catalogs and React app', async t => {
  let complete;
  for (const [label, mode, packIds] of [
    ['all', 'all', []],
    ['base', 'base', []],
    ['Halo', 'selected', ['halo']],
    // Exercise nonzero FG4 validation, a late expanded-stage ID, and a partial
    // canonical roster wave in the same distribution.
    ['mixed', 'selected', ['halo', 'steins-gate', 'trololo']]
  ]) {
    await t.test(label, async context => {
      const { server, installed } = await createProfileServer(mode, packIds);
      try {
        const heroes = await server.ssrLoadModule('/src/game/heroes.js');
        const enemies = await server.ssrLoadModule('/src/game/enemies.js');
        const expanded = await server.ssrLoadModule('/src/game/expandedUniverses.js');
        const narrative = await server.ssrLoadModule('/src/game/narrativeSystems.js');
        await server.ssrLoadModule('/src/game/dlcConfig.js');
        const installation = await server.ssrLoadModule('/src/game/dlcInstallation.js');
        const app = await server.ssrLoadModule('/src/App.jsx');
        assert.equal(typeof app.default, 'function');
        assert.deepEqual(new Set(installation.getInstalledDlcPackIds()), installed);
        const archiveLore = await server.ssrLoadModule('/src/game/canonicalArchiveLore.js');
        const loreEntries = archiveLore.CANONICAL_STAGE_ARCHIVE_LORE;
        assert.equal(loreEntries.length, mode === 'all' ? 6 : installed.has('halo') ? 1 : 0);
        assert.equal(archiveLore.getCanonicalArchiveStageLore(null), null);
        assert.equal(archiveLore.getCanonicalArchiveStageLore({ id: -1, universe: 'Absent DLC' }), null);
        for (const entry of loreEntries) {
          assert.ok(installation.isUniverseInstalled(entry.source.universe));
          assert.equal(archiveLore.getCanonicalArchiveStageLore(entry.source), entry);
        }

        if (label === 'base' || label === 'Halo') {
          // Importing App alone cannot catch undefined optional entries used
          // while Hub constructs its legacy stage list during an actual render.
          const hub = await server.ssrLoadModule('/src/components/HubScreen.jsx');
          const playerState = await server.ssrLoadModule('/src/game/dlcPlayerState.js');
          const saved = app.default.normalizeSavePayload({
            saveVersion: 8, lang: 'en',
            unlockedHeroes: ['player_anchor', 'masterchief', 'neris_vale'],
            activeTeam: ['masterchief', 'player_anchor', 'neris_vale'],
            hiddenUniverses: ['Halo', 'Thalassa Mnémique'],
            completedStages: [47001],
            portalStats: { pulls: 2 },
            onboarding: { profileCreated: true, prologueCompleted: true }
          }, { existing: true });
          const selectedBeforeRender = [...saved.activeTeam];
          const playableTeam = playerState.projectPlayableTeam(saved.activeTeam, {
            heroes: heroes.HEROES_DB, unlockedHeroIds: saved.unlockedHeroes,
            hiddenUniverses: saved.hiddenUniverses,
            isUniverseInstalled: installation.isUniverseInstalled
          });
          const props = {
            ...saved, activeTeam: playableTeam, unavailableTeamCount: 2,
            campaignProgress: saved.ocCampaignState,
            audioSettings: { muted: true, musicVolume: 0, sfxVolume: 0 }
          };
          for (const key of Object.keys(saved)) props['set' + key[0].toUpperCase() + key.slice(1)] = () => {};
          for (const tab of ['missions', 'party', 'admin']) {
            const html = renderToString(React.createElement(hub.default, { ...props, initialTab: tab }));
            assert.ok(html.includes('OPERATIONS'), label + '/' + tab + ' renders real Hub navigation');
            if (tab === 'admin') {
              assert.ok(html.includes('data-dlc-installation-mode="' + mode + '"'));
              assert.ok(html.includes('data-dlc-pack="halo" data-pack-installed="' + installed.has('halo') + '"'));
            }
          }
          const campaign = await server.ssrLoadModule('/src/game/ocCampaign.js');
          const briefing = renderToString(React.createElement(hub.default, {
            ...props, initialTab: 'missions',
            hubNavigationRef: { current: {
              activeTab: 'missions', missionScreen: 'story', missionWorkspaceView: 'map',
              briefingStageId: campaign.OC_CAMPAIGN_MISSIONS[0].id
            } }
          }));
          assert.ok(briefing.includes('data-testid="selected-briefing-deploy"'), label + ' renders a real base mission briefing');
          assert.deepEqual(saved.activeTeam, selectedBeforeRender, 'Rendering never rewrites dormant saved slots');
        }

        // A missing optional fallback must not crash base encounters or rewards.
        const fallbackEnemies = installed.has('halo') ? enemies.ENEMIES_DB.Halo : enemies.ENEMIES_DB['Nexus de Convergence'];
        const fallbackEvent = installed.has('halo') ? heroes.EVENT_ITEMS_DB.Halo : heroes.EVENT_ITEMS_DB['Nexus de Convergence'];
        assert.ok(fallbackEnemies?.monsters.length && fallbackEnemies?.bosses.length);
        assert.ok(fallbackEvent?.id);
        assert.equal(enemies.getMonstersForUniverse('__unknown__'), fallbackEnemies.monsters);
        assert.equal(enemies.getBossesForUniverse('__unknown__'), fallbackEnemies.bosses);
        assert.equal(enemies.getWorldBossForUniverse('__unknown__'), fallbackEnemies.worldBoss);
        assert.deepEqual(enemies.getEnemiesForUniverse('__unknown__'), {
          enemy: fallbackEnemies.monsters[0], boss: fallbackEnemies.bosses[0]
        });
        assert.equal(heroes.getEventItemForUniverse('__unknown__'), fallbackEvent);

        const blackPearl = await server.ssrLoadModule('/src/game/canonBlackPearlSourceKits.js');
        const savedJack = { id: 'jack_sparrow_potc', incarnation: blackPearl.BLACK_PEARL_JACK_INCARNATION, universe: blackPearl.BLACK_PEARL_SOURCE_UNIVERSE, canonCombatPresentation: true };
        const ammunition = blackPearl.getBlackPearlSourceAmmunition(savedJack);
        if (mode === 'all') assert.ok(ammunition?.actionIds.length);
        else assert.equal(ammunition, null, 'a saved optional actor cannot recover an uninstalled source kit');

        const stages = expanded.getExpandedStages();
        const snapshot = {
          heroes: new Map(heroes.HEROES_DB.map(hero => [hero.id, plain(hero)])),
          stages: new Map(stages.map(stage => [stage.id, plain(stage)])),
          characterArcs: new Map(narrative.CHARACTER_NARRATIVE_ARCS.map(arc => [arc.id, plain(arc)]))
        };
        assert.equal(snapshot.heroes.size, heroes.HEROES_DB.length, 'hero IDs remain unique');
        assert.equal(snapshot.stages.size, stages.length, 'expanded stage IDs remain unique');
        assert.ok(heroes.HEROES_DB.some(hero => hero.universe === 'Nexus de Convergence'));
        if (mode === 'all') {
          complete = snapshot;
        } else {
          assert.ok(complete, 'the complete profile must be evaluated first');
          for (const hero of heroes.HEROES_DB) {
            const pack = packByUniverse.get(hero.universe);
            assert.ok(!pack || installed.has(pack.id), 'uninstalled hero remained: ' + hero.id);
            assert.deepEqual(plain(hero), complete.heroes.get(hero.id), 'retained hero changed: ' + hero.id);
          }
          for (const stage of stages) {
            assert.deepEqual(plain(stage), complete.stages.get(stage.id), 'retained stage or ID changed: ' + stage.id);
          }
          for (const arc of narrative.CHARACTER_NARRATIVE_ARCS) {
            assert.deepEqual(plain(arc), complete.characterArcs.get(arc.id), 'retained character arc or ID changed: ' + arc.id);
          }
        }

        const graph = server.environments.ssr.moduleGraph.idToModuleMap;
        let packModules = 0;
        for (const node of graph.values()) {
          const filename = node.id?.split('?')[0];
          if (!filename?.startsWith(root + '/DLC/')) continue;
          const directory = filename.slice(root.length + 1).split('/').slice(0, 2).join('/');
          const pack = packByDirectory.get(directory);
          if (!pack) continue;
          packModules++;
          assert.ok(installed.has(pack.id), 'excluded module entered the SSR graph: ' + filename);
        }
        if (mode === 'base') assert.equal(packModules, 0, 'the base module graph contains no optional pack modules');
        if (mode !== 'base') assert.ok(packModules > 0);
        context.diagnostic(JSON.stringify({ heroes: heroes.HEROES_DB.length, enemies: Object.keys(enemies.ENEMIES_DB).length, expandedStages: stages.length, packModules }));
      } finally {
        await server.close();
      }
    });
  }
});
