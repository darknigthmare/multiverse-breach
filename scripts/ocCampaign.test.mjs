import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import {
  OC_CAMPAIGN_ACTS,
  OC_CAMPAIGN_CHAPTERS,
  OC_CAMPAIGN_ENDINGS,
  OC_CAMPAIGN_EPILOGUE,
  OC_CAMPAIGN_MISSIONS,
  OC_FINAL_MISSION_ID,
  OC_ORIGIN_LOCKS,
  getNextOcCampaignMission,
  getOcCampaignEnding,
  getOcCampaignMission,
  getOcCampaignProgress
} from '../src/game/ocCampaign.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const appSource = readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf8');
const hubSource = readFileSync(path.join(projectRoot, 'src/components/HubScreen.jsx'), 'utf8');
const portalSource = readFileSync(path.join(projectRoot, 'src/components/PortalScreen.jsx'), 'utf8');
const gameCanvasSource = readFileSync(path.join(projectRoot, 'src/components/GameCanvas.jsx'), 'utf8');
const spriteManifestPath = path.join(projectRoot, 'public/sprites/generated/sprite-manifest.json');
const stageAssetRegistryPath = path.join(projectRoot, 'src/game/generatedStageAssets.json');
const campaignKeyArtPromptPath = path.join(projectRoot, 'public/images/campaign-oc/openai-key-art-prompts.jsonl');
const riftDossierPromptPath = path.join(projectRoot, 'public/images/rift-dossiers/openai/openai-prompts.jsonl');
let vite;
let App;
let smashArenas;
let tacticsBattlefields;
let smashEngine;
let enemiesDb;
let heroesDb;
let characterPlaques;

const readPngMetadata = (filePath) => {
  const source = readFileSync(filePath);
  assert.equal(source.subarray(1, 4).toString('ascii'), 'PNG', `${filePath}: expected PNG`);
  assert.equal(source.subarray(12, 16).toString('ascii'), 'IHDR', `${filePath}: missing IHDR`);
  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20),
    colorType: source.readUInt8(25)
  };
};

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  const [
    appModule,
    smashArenaModule,
    tacticsModule,
    smashEngineModule,
    enemiesModule,
    heroesModule,
    plaquesModule
  ] = await Promise.all([
    vite.ssrLoadModule('/src/App.jsx?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/smashArenas.js?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/tacticsBattlefields.js?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/engineSmash.js?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/enemies.js?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/heroes.js?oc-campaign-tests'),
    vite.ssrLoadModule('/src/game/characterPlaques.js?oc-campaign-tests')
  ]);
  App = appModule.default;
  smashArenas = smashArenaModule;
  tacticsBattlefields = tacticsModule;
  smashEngine = smashEngineModule;
  enemiesDb = enemiesModule.ENEMIES_DB;
  heroesDb = heroesModule.HEROES_DB;
  characterPlaques = plaquesModule.CHARACTER_PLAQUES;
});

after(async () => {
  await vite?.close();
});

test('the OC chronicle covers a prologue and five complete acts', () => {
  const numberedActs = OC_CAMPAIGN_ACTS.filter(act => act.number > 0);
  assert.deepEqual(numberedActs.map(act => act.number), [1, 2, 3, 4, 5]);
  assert.equal(OC_CAMPAIGN_ACTS.some(act => act.number === 0 && act.id === 'prologue'), true);

  numberedActs.forEach(act => {
    assert.ok(act.title.fr && act.title.en);
    assert.ok(act.summary.fr && act.summary.en);
    assert.ok(act.conclusion.fr && act.conclusion.en);
    assert.ok(act.missionIds.length > 0);
    assert.ok(act.missionIds.includes(act.finaleMissionId));
    act.missionIds.forEach(id => {
      assert.equal(getOcCampaignMission(id)?.actId, act.id);
    });
  });
});

test('all twelve operations form one localized, rewarded, playable route', () => {
  assert.equal(OC_CAMPAIGN_MISSIONS.length, 12);
  const rewardIds = new Set();

  OC_CAMPAIGN_MISSIONS.forEach((mission, index) => {
    assert.equal(mission.id, 8801 + index);
    assert.equal(mission.sequence, index + 1);
    assert.ok(OC_CAMPAIGN_CHAPTERS.some(chapter => chapter.id === mission.chapterId));
    assert.ok(OC_CAMPAIGN_ACTS.some(act => act.id === mission.actId));
    assert.ok(mission.displayName.fr && mission.displayName.en);
    assert.ok(mission.objective.fr && mission.objective.en);
    assert.ok(mission.missionRule.fr && mission.missionRule.en);
    assert.ok(mission.storyBeat.intro.fr && mission.storyBeat.outro.en);
    assert.ok(Array.isArray(mission.scenes) && mission.scenes.length >= 3);
    assert.equal(mission.enemyRosterExclusive, true);
    assert.ok(mission.rewardItemId && mission.rewardItemName.fr && mission.rewardItemName.en);
    assert.equal(rewardIds.has(mission.rewardItemId), false, `duplicate reward ${mission.rewardItemId}`);
    rewardIds.add(mission.rewardItemId);
    assert.equal(existsSync(path.join(projectRoot, 'public', mission.image.replace(/^\//, ''))), true);
  });

  assert.deepEqual(
    [...new Set(OC_CAMPAIGN_MISSIONS.map(mission => mission.mode))].sort(),
    ['RPG', 'Smash', 'Tactics']
  );
  assert.deepEqual(OC_ORIGIN_LOCKS.map(lock => lock.id), ['name', 'contradiction', 'scar', 'debt', 'return', 'choice']);
  assert.equal(OC_CAMPAIGN_MISSIONS.at(-1).id, OC_FINAL_MISSION_ID);
  assert.equal(OC_CAMPAIGN_MISSIONS.at(-1).campaignFinale, true);
  assert.ok(getOcCampaignMission(8803).enemyRoster.includes('Double ideal de Marrow'));
  assert.ok(getOcCampaignMission(8803).enemyRoster.includes('Matrice de Substitution'));
});

test('all twelve rift dossiers use unique mission-specific OpenAI artwork', () => {
  const promptEntries = readFileSync(riftDossierPromptPath, 'utf8')
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));
  const dossierArt = OC_CAMPAIGN_MISSIONS.map(mission => mission.dossierArt);
  const campaignMissionIds = new Set(OC_CAMPAIGN_MISSIONS.map(mission => mission.id));
  const campaignPromptEntries = promptEntries.filter(entry => (
    campaignMissionIds.has(entry.missionId)
  ));

  assert.equal(new Set(dossierArt).size, OC_CAMPAIGN_MISSIONS.length);
  assert.equal(campaignPromptEntries.length, OC_CAMPAIGN_MISSIONS.length);

  OC_CAMPAIGN_MISSIONS.forEach((mission) => {
    assert.match(mission.dossierArt, /^\/images\/rift-dossiers\/openai\/mission-\d+-.+-v1\.png$/);
    const filePath = path.join(projectRoot, 'public', mission.dossierArt.replace(/^\//, ''));
    assert.equal(existsSync(filePath), true, `${mission.id}: missing dossier art`);
    assert.deepEqual(
      readPngMetadata(filePath),
      { width: 1672, height: 941, colorType: 2 },
      `${mission.id}: dossier art must be a 1672x941 RGB PNG`
    );

    const promptEntry = campaignPromptEntries.find(entry => entry.missionId === mission.id);
    assert.ok(promptEntry, `${mission.id}: missing OpenAI prompt provenance`);
    assert.equal(promptEntry.output, mission.dossierArt);
    assert.equal(promptEntry.kind, 'rift-dossier-thumbnail');
    assert.equal(promptEntry.generation?.provider, 'OpenAI');
    assert.equal(promptEntry.generation?.interface, 'built-in image_gen');
    assert.equal(promptEntry.image?.sha256.length, 64);
    assert.match(promptEntry.prompt, /32-bit/i);
  });
});

test('the complete OC campaign uses OpenAI visuals without player-facing fallbacks', () => {
  const manifest = JSON.parse(readFileSync(spriteManifestPath, 'utf8'));
  const registry = JSON.parse(readFileSync(stageAssetRegistryPath, 'utf8'));
  const keyArtPrompts = readFileSync(campaignKeyArtPromptPath, 'utf8')
    .trim()
    .split('\n')
    .map(line => JSON.parse(line));
  const requiredOutputs = [
    '/sprites/generated/heroes/nexus-de-convergence/player-anchor.png',
    '/sprites/generated/items/nexus-de-convergence/evt-nexus-anchor-pulse.png',
    '/sprites/generated/items/nexus-de-convergence/nexus-de-convergence-summon.png',
    '/backgrounds/lore-stages/nexus-de-convergence/combat.webp',
    '/backgrounds/lore-stages/nexus-de-convergence/melee.webp',
    '/backgrounds/lore-stages/nexus-de-convergence/rpg.webp',
    '/backgrounds/lore-stages/nexus-de-convergence/tactics.webp'
  ];

  requiredOutputs.forEach(output => {
    const entry = manifest.entries.find(candidate => candidate.output === output);
    assert.ok(entry, `missing manifest contract for ${output}`);
    assert.equal(entry.available, true, `${output} must be available`);
    assert.equal(entry.source, 'openai', `${output} must retain OpenAI provenance`);
    assert.equal(existsSync(path.join(projectRoot, 'public', output.replace(/^\//, ''))), true);
  });

  assert.equal(
    registry.byProfile?.['Nexus de Convergence']?.Melee?.platformTexturePath,
    '/backgrounds/lore-stages/nexus-de-convergence/melee-platforms.webp'
  );
  assert.equal(
    registry.byProfile?.['Nexus de Convergence']?.Tactics?.tileTexturePath,
    '/backgrounds/lore-stages/nexus-de-convergence/tactics-tiles.webp'
  );
  assert.equal(new Set(OC_CAMPAIGN_CHAPTERS.map(chapter => chapter.image)).size, OC_CAMPAIGN_CHAPTERS.length);
  assert.equal(keyArtPrompts.length, 3);
  keyArtPrompts.forEach(entry => {
    assert.equal(entry.source, 'openai');
    assert.ok(OC_CAMPAIGN_CHAPTERS.some(chapter => chapter.id === entry.chapterId && chapter.image === entry.output));
    assert.equal(existsSync(path.join(projectRoot, 'public', entry.output.replace(/^\//, ''))), true);
  });
});

test('campaign progression advances only through the ordered OC prefix', () => {
  const ids = OC_CAMPAIGN_MISSIONS.map(mission => mission.id);
  assert.equal(getNextOcCampaignMission([]).id, ids[0]);

  ids.forEach((id, index) => {
    const prefix = ids.slice(0, index);
    assert.equal(getNextOcCampaignMission(prefix).id, id);
    const noisyPrefix = [...prefix, 90000, 40001, 777777];
    assert.equal(getNextOcCampaignMission(noisyPrefix).id, id);
  });

  assert.equal(getNextOcCampaignMission(ids), null);
  assert.equal(getOcCampaignProgress(ids, null).missionsComplete, true);
  assert.equal(getOcCampaignProgress(ids, null).complete, false);
  assert.equal(getOcCampaignProgress(ids, 'seal').complete, true);
  assert.match(hubSource, /return getMissingPreviousOcMissions\(ocMission\)\.length === 0/);
});

test('each numbered act wires two original standard enemies and one original boss', () => {
  const nexus = enemiesDb['Nexus de Convergence'];
  const numberedActs = OC_CAMPAIGN_ACTS.filter(act => act.number > 0);
  const originalStandards = nexus.monsters.filter(enemy => /^oc_act[1-5]_/.test(enemy.id || ''));
  const originalBosses = nexus.bosses.filter(enemy => /^oc_act[1-5]_/.test(enemy.id || ''));
  const allOriginalIds = [...originalStandards, ...originalBosses].map(enemy => enemy.id);

  assert.equal(originalStandards.length, 10);
  assert.equal(originalBosses.length, 5);
  assert.equal(new Set(allOriginalIds).size, 15);

  numberedActs.forEach(act => {
    const actStandards = originalStandards.filter(enemy => enemy.actId === act.id);
    const actBosses = originalBosses.filter(enemy => enemy.actId === act.id);
    const actMissions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.actId === act.id);

    assert.equal(actStandards.length, 2, `${act.id}: expected two original standard enemies`);
    assert.equal(actBosses.length, 1, `${act.id}: expected one original boss`);
    actStandards.forEach(enemy => {
      assert.ok(
        actMissions.some(mission => mission.enemyRoster.includes(enemy.name)),
        `${enemy.id}: standard enemy is not wired to an ${act.id} mission`
      );
    });
    const bossMission = actMissions.find(mission => mission.bossName === actBosses[0].name);
    assert.ok(bossMission, `${actBosses[0].id}: boss is not wired to an ${act.id} mission`);
    assert.ok(
      bossMission.missionRule.fr.includes(actBosses[0].name)
      && bossMission.missionRule.en.includes(actBosses[0].name),
      `${actBosses[0].id}: boss must be described by the mission rules`
    );
  });
});

test('five unique campaign reward heroes resolve to complete explicit plaques', () => {
  const rewardMissions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.rewardHeroId);
  const rewardHeroIds = rewardMissions.map(mission => mission.rewardHeroId);
  const numberedActs = OC_CAMPAIGN_ACTS.filter(act => act.number > 0);

  assert.equal(rewardMissions.length, 5);
  assert.equal(new Set(rewardHeroIds).size, 5);
  numberedActs.forEach(act => {
    assert.equal(
      rewardMissions.filter(mission => mission.actId === act.id).length,
      1,
      `${act.id}: expected exactly one reward hero`
    );
  });

  rewardMissions.forEach(mission => {
    const hero = heroesDb.find(candidate => candidate.id === mission.rewardHeroId);
    const plaque = characterPlaques[mission.rewardHeroId];

    assert.ok(hero, `${mission.rewardHeroId}: unresolved reward hero`);
    assert.equal(hero.name, mission.rewardHeroName.fr);
    assert.equal(hero.name, mission.rewardHeroName.en);
    assert.equal(hero.universe, 'Nexus de Convergence');
    assert.equal(hero.campaignExclusive, true);
    assert.equal(hero.campaignActId, mission.actId);
    assert.equal(hero.unlockMissionId, mission.id);
    assert.ok(
      mission.scenes.some(scene => (
        scene.speaker?.fr?.toLowerCase().includes(hero.name.split(' ')[0].toLowerCase())
        && scene.speaker?.en?.toLowerCase().includes(hero.name.split(' ')[0].toLowerCase())
      )),
      `${mission.rewardHeroId}: reward hero must speak in the recruitment mission`
    );
    assert.ok(plaque, `${mission.rewardHeroId}: missing explicit character plaque`);
    assert.ok(plaque.rank.fr && plaque.rank.en);
    assert.ok(plaque.role.fr && plaque.role.en);
    assert.ok(plaque.dossier.fr && plaque.dossier.en);
    assert.ok(plaque.breachLore.fr && plaque.breachLore.en);
    assert.ok(Array.isArray(plaque.tags) && plaque.tags.length > 0);
  });

  assert.match(characterPlaques.arca_tessera.dossier.fr, /Archives statiques/);
  assert.match(characterPlaques.arca_tessera.dossier.en, /Static Archives/);
  assert.match(characterPlaques.arca_tessera.breachLore.fr, /rejoint la cellule apres le verdict des Archives/);
});

test('every operation resolves the exact announced canonical boss', () => {
  const nexus = enemiesDb['Nexus de Convergence'];
  OC_CAMPAIGN_MISSIONS.forEach(mission => {
    const enemyData = resolveStageEnemyData({
      stage: mission,
      monsters: nexus.monsters,
      bosses: nexus.bosses,
      worldBoss: nexus.worldBoss
    });
    const boss = enemyData.worldBoss || enemyData.bosses[0];
    assert.equal(boss?.name, mission.bossName, `wrong boss for ${mission.id}`);
    assert.deepEqual(
      enemyData.monsters.map(enemy => enemy.name),
      mission.enemyRoster.filter(name => nexus.monsters.some(enemy => enemy.name === name))
    );
  });
  assert.match(gameCanvasSource, /resolveStageEnemyData/);
});

test('explicit Smash and Tactics mission profiles reach runtime', () => {
  OC_CAMPAIGN_MISSIONS.filter(mission => mission.mode === 'Smash').forEach(mission => {
    assert.ok(mission.smashArenaId, `missing Smash arena override for ${mission.id}`);
    assert.equal(smashArenas.createSmashArena(mission, 960, 540).id, mission.smashArenaId);
  });
  OC_CAMPAIGN_MISSIONS.filter(mission => mission.mode === 'Tactics').forEach(mission => {
    assert.ok(mission.tacticsBattlefieldId, `missing Tactics battlefield override for ${mission.id}`);
    assert.equal(tacticsBattlefields.getTacticsBattlefield(mission).id, mission.tacticsBattlefieldId);
  });

  const finalMission = getOcCampaignMission(OC_FINAL_MISSION_ID);
  const arena = smashArenas.createSmashArena(finalMission, 960, 540);
  assert.equal(arena.id, 'oc_authorless_finale');
  assert.equal(arena.objective, 'boss');
  assert.equal(arena.objectiveNodes.length, 3);

  const nexus = enemiesDb['Nexus de Convergence'];
  const enemyData = resolveStageEnemyData({
    stage: finalMission,
    monsters: nexus.monsters,
    bosses: nexus.bosses,
    worldBoss: nexus.worldBoss
  });
  const hero = {
    id: 'test_anchor',
    name: 'Test Anchor',
    universe: 'Nexus de Convergence',
    primaryColor: '#39c5bb',
    secondaryColor: '#ffffff',
    stats: { hp: 180, atk: 18, def: 9, spd: 8 },
    simple: { name: 'Strike', dmg: 1 },
    secondary: { name: 'Burst', dmg: 1.3, cd: 3 },
    defense: { name: 'Guard', reduce: 0.4, dur: 1 },
    special: { name: 'Rupture', dmg: 1.8 }
  };
  const engine = new smashEngine.EngineSmash(
    960,
    540,
    [hero],
    enemyData,
    { add() {} },
    () => {},
    () => {},
    finalMission
  );
  engine.enemies = [];
  engine.wave = engine.maxWaves;
  engine.spawnEnemy();
  assert.equal(engine.enemies[0].name, finalMission.bossName);
  assert.equal(engine.enemies[0].isBoss, true);
  engine.enemies[0].maxHp = 100;
  engine.enemies[0].currentHp = 49;
  engine.updateArenaObjective();
  assert.equal(engine.objectiveNodes.filter(node => node.sealed).length, 2);
});

test('Act V exposes four persistent, localized endings and full epilogues', () => {
  assert.deepEqual(OC_CAMPAIGN_ENDINGS.map(ending => ending.id), ['seal', 'converge', 'break', 'surrender']);
  const rewardIds = new Set();
  OC_CAMPAIGN_ENDINGS.forEach(ending => {
    assert.equal(getOcCampaignEnding(ending.id), ending);
    assert.ok(ending.title.fr && ending.title.en);
    assert.ok(ending.summary.fr && ending.consequence.en);
    assert.ok(ending.profileTitle.fr && ending.profileTitle.en);
    assert.ok(ending.rewardItemId && ending.rewardItemName.fr);
    assert.ok(Array.isArray(ending.scenes) && ending.scenes.length >= 3);
    assert.equal(rewardIds.has(ending.rewardItemId), false);
    rewardIds.add(ending.rewardItemId);
  });
  assert.ok(OC_CAMPAIGN_EPILOGUE.title.fr && OC_CAMPAIGN_EPILOGUE.intro.en);
  assert.ok(OC_CAMPAIGN_EPILOGUE.credits.length >= 8);
});

test('save migration derives OC state and preserves only a valid completed ending', () => {
  const ids = OC_CAMPAIGN_MISSIONS.map(mission => mission.id);
  const partial = App.normalizeSavePayload({
    saveVersion: 7,
    completedStages: [...ids.slice(0, 4), 90000, 40001],
    ocCampaignState: { endingId: 'seal', epilogueSeen: true }
  }, { existing: true });
  assert.equal(partial.saveVersion, 9);
  assert.deepEqual(partial.ocCampaignState.completedMissionIds, ids.slice(0, 4));
  assert.equal(partial.ocCampaignState.endingId, null);
  assert.equal(partial.ocCampaignState.nextMissionId, ids[4]);
  assert.equal(partial.ocCampaignState.recoveredLockIds.length, 4);
  assert.ok(partial.unlockedHeroes.includes('arca_tessera'));
  assert.ok(partial.unlockedHeroes.includes('arca_quillon'));
  assert.equal(partial.heroLevels.arca_tessera, 1);
  assert.equal(partial.heroLevels.arca_quillon, 1);

  const complete = App.normalizeSavePayload({
    saveVersion: 7,
    completedStages: ids,
    ocCampaignState: {
      endingId: 'converge',
      endingHistory: ['seal', 'converge'],
      completedAt: '2026-07-27T12:00:00.000Z',
      epilogueSeen: true,
      completionRewardClaimed: true
    }
  }, { existing: true });
  assert.equal(complete.ocCampaignState.finalMissionComplete, true);
  assert.equal(complete.ocCampaignState.endingId, 'converge');
  assert.deepEqual(complete.ocCampaignState.endingHistory, ['seal', 'converge']);
  assert.equal(complete.ocCampaignState.epilogueSeen, true);
  ['arca_tessera', 'arca_quillon', 'arca_nadir', 'arca_elyra', 'arca_oryn'].forEach(heroId => {
    assert.ok(complete.unlockedHeroes.includes(heroId), `${heroId}: completed legacy save must recover campaign recruit`);
    assert.equal(complete.heroLevels[heroId], 1, `${heroId}: recovered recruit must start at level 1`);
  });

  const stringBacked = App.normalizeSavePayload({
    saveVersion: 7,
    completedStages: ids.map(String)
  }, { existing: true });
  assert.deepEqual(stringBacked.completedStages, ids);
  assert.equal(stringBacked.ocCampaignState.finalMissionComplete, true);
  ['arca_tessera', 'arca_quillon', 'arca_nadir', 'arca_elyra', 'arca_oryn'].forEach(heroId => {
    assert.ok(stringBacked.unlockedHeroes.includes(heroId), `${heroId}: string-backed save must recover campaign recruit`);
    assert.equal(stringBacked.heroLevels[heroId], 1, `${heroId}: string-backed recruit must start at level 1`);
  });
});

test('the UI consumes canonical story beats, grants endings, and supports replay', () => {
  assert.match(appSource, /if \(stage\.storyBeat\)/);
  assert.match(
    appSource,
    /const backdrop = stage\.stageArt \|\| stage\.image \|\| getOpenAiBackdropSrc/
  );
  assert.match(appSource, /currentScreen === 'campaignEnding'/);
  assert.match(appSource, /completionRewardClaimed: true/);
  assert.match(appSource, /OC_CAMPAIGN_SKIN_ID/);
  assert.match(appSource, /ending\.rewardItemId/);
  assert.match(appSource, /activeStage\.rewardHeroId/);
  assert.match(hubSource, /const BASE_OC_STAGES = OC_CAMPAIGN_MISSIONS\.map/);
  assert.match(hubSource, /stage\?\.dossierArt[\s\S]*stage\?\.stageArt[\s\S]*stage\?\.image/);
  assert.match(hubSource, /selectedMission\.recruitLore/);
  assert.match(hubSource, /Recrue ZERO/);
  assert.match(portalSource, /HEROES_DB\.filter\(hero => !hero\.campaignExclusive\)/);
  assert.match(hubSource, /onReplayEnding/);
});
