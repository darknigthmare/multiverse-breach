import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const fail = (message) => {
  throw new Error(message);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const heroesSource = read('../src/game/heroes.js');
const enemiesSource = read('../src/game/enemies.js');
const battleItemsSource = read('../src/game/battleItems.js');
const dlcSource = read('../src/game/dlcConfig.js');
const appSource = read('../src/App.jsx');
const hubSource = read('../src/components/HubScreen.jsx');
const gameCanvasSource = read('../src/components/GameCanvas.jsx');
const smashEngineSource = read('../src/game/engineSmash.js');
const smashArenasSource = read('../src/game/smashArenas.js');
const tacticsEngineSource = read('../src/game/engineTactics.js');
const tacticsBattlefieldsSource = read('../src/game/tacticsBattlefields.js');
const manifest = JSON.parse(read('../public/sprites/generated/sprite-manifest.json'));
const manifestOutputs = new Set((manifest.entries || []).filter(entry => entry.available).map(entry => entry.output));

const expectedOcHeroIds = ['arca_mirelle', 'arca_bastion', 'arca_nova', 'arca_marrow', 'arca_sable', 'arca_loom'];
const expectedOcEnemyNames = [
  'echo-sans-auteur',
  'archiviste-rompu',
  'noeud-de-paradoxe',
  'fragment-vagabond',
  'drone-a-r-c-a-corrompu',
  'greffier-du-voile',
  'juge-des-trames',
  'avatar-du-sans-auteur',
  'moteur-de-convergence-instable'
];
const expectedOcItemIds = ['arca-signal-lens', 'nexus-anchor-coil', 'origin-shard-guard'];

assert(dlcSource.includes("BASE_GAME_UNIVERSES = ['Nexus de Convergence']"), 'Base OC universe must remain Nexus de Convergence.');
assert(dlcSource.includes('DEFAULT_HIDDEN_UNIVERSES = getDlcUniverseKeys()'), 'DLC universes must be hidden by default.');

expectedOcHeroIds.forEach(heroId => {
  assert(heroesSource.includes(`id: '${heroId}'`), `Missing OC hero ${heroId}.`);
  assert(manifestOutputs.has(`/sprites/generated/heroes/nexus-de-convergence/${heroId.replaceAll('_', '-')}.png`), `Missing OC hero sprite ${heroId}.`);
});

expectedOcEnemyNames.forEach(enemySlug => {
  assert(manifestOutputs.has(`/sprites/generated/bosses/nexus-de-convergence/${enemySlug}.png`), `Missing OC enemy/boss sprite ${enemySlug}.`);
});

expectedOcItemIds.forEach(itemId => {
  assert(
    battleItemsSource.includes(itemId.replaceAll('-', '_')) || manifestOutputs.has(`/sprites/generated/items/nexus-de-convergence/${itemId}.png`),
    `Missing OC battle item ${itemId}.`
  );
  assert(manifestOutputs.has(`/sprites/generated/items/nexus-de-convergence/${itemId}.png`), `Missing OC item sprite ${itemId}.`);
});

[
  ['8801', 'RPG'],
  ['8802', 'Tactics'],
  ['8803', 'Smash']
].forEach(([stageId, mode]) => {
  assert(hubSource.includes(`id: ${stageId}`), `Base OC stage ${stageId} is missing.`);
  assert(hubSource.includes(`mode: '${mode}'`), `Base OC stage ${stageId} should preserve ${mode} coverage.`);
});

assert(enemiesSource.includes("'Nexus de Convergence'"), 'Base OC enemy table is missing.');
assert(hubSource.includes('ARC_UNLOCK_RULES.personalMinLevel'), 'Narrative arc level gates must stay wired.');
assert(hubSource.includes('getUniverseArcRosterStatus'), 'Universe arc roster gates must stay wired.');
assert(hubSource.includes('getTrioArcRosterStatus'), 'Trio arc roster gates must stay wired.');
assert(hubSource.includes('isCurrentStoryChapterStage'), 'Story mode must filter portals by the active chapter.');
assert(hubSource.includes('storyChapterStages'), 'Story mode count must be based on the active chapter pool.');
assert(hubSource.includes('completedStages={completedStages}'), 'Portal screen must receive progression to hide future chapter banners.');
[
  'absurd_b_movie_front',
  'kaiju_disaster_protocol',
  'manga_war_council',
  'screen_archive_fracture',
  'infection_mutation_cordon'
].forEach(arcId => {
  assert(hubSource.includes(`id: '${arcId}'`) && hubSource.includes(`${arcId}: {`), `Missing completed faction arc ${arcId}.`);
});

[
  'training_flat',
  'triplat_duel',
  'vertical_tower',
  'split_pit',
  'asym_hunt',
  'boss_coliseum',
  'concert_stage',
  'containment_lab',
  'hive_corridor',
  'city_rooftops',
  'absurd_party',
  'arcane_ruins',
  'war_front',
  'artifact_bastion',
  'artifact_sweep',
  'portal_lockdown',
  'boss_overload'
].forEach(arenaId => {
  assert(smashArenasSource.includes(`${arenaId}: {`), `Missing melee arena layout ${arenaId}.`);
});
assert(smashArenasSource.includes('EXPANDED_UNIVERSE_SIGNATURES'), 'Melee arena selection must use expanded universe metadata.');
assert(smashArenasSource.includes('getUniverseSignature'), 'Melee arena selection must keep a signature lookup helper.');
assert(smashArenasSource.includes('stageName') && smashArenasSource.includes('mediaType') && smashArenasSource.includes('faction'), 'Melee arena selection must inspect expanded universe stage metadata.');
assert(smashEngineSource.includes('createSmashArena(stage, width, height)'), 'Melee engine must build arena layouts from the active stage.');
assert(smashEngineSource.includes('applyArenaHazards'), 'Melee engine must keep terrain hazards wired.');
assert(smashEngineSource.includes('getObjectiveText'), 'Melee engine must expose arena objective text.');
assert(smashEngineSource.includes('updateArenaObjective'), 'Melee engine must update active arena objectives.');
assert(smashEngineSource.includes('drawObjectiveHud'), 'Melee engine must render objective progress feedback.');
assert(smashEngineSource.includes('isTouchingActiveHazard'), 'Melee objectives must react to active terrain hazards.');
assert(smashEngineSource.includes('recoverFromArenaFall'), 'Melee engine must provide fall recovery for platform arenas.');
assert(smashEngineSource.includes('updateStuckTracker'), 'Melee engine must include anti-stuck movement recovery.');
assert(smashEngineSource.includes('getLandingPlatform') && smashEngineSource.includes('alreadyStanding'), 'Melee platform collision must keep actors standing on soft levels.');
assert(smashEngineSource.includes('getEnemyBehavior'), 'Melee enemies must use behavior profiles.');
assert(smashEngineSource.includes('airJumps'), 'Melee actors must keep limited air recovery jumps.');
assert(smashEngineSource.includes('getCombatSummary'), 'Melee engine must expose a combat summary for progression feedback.');
assert(smashEngineSource.includes('completionReported'), 'Melee engine must report battle completion only once.');
assert(smashEngineSource.includes('damageDealt') && smashEngineSource.includes('hazardHits') && smashEngineSource.includes('itemTriggers'), 'Melee summary must track damage, terrain risk, and item usage.');
assert(smashEngineSource.includes("objective === 'protect'"), 'Melee engine must support protect-the-artifact objectives.');
assert(smashEngineSource.includes("objective === 'collect'"), 'Melee engine must support collect-artifacts objectives.');
assert(smashEngineSource.includes("objective === 'portals'"), 'Melee engine must support portal cleanup objectives.');
assert(smashEngineSource.includes("objective === 'overload'"), 'Melee engine must support boss overload objectives.');
assert(smashEngineSource.includes('drawObjectiveNodes'), 'Melee engine must render active objective nodes.');
assert(smashArenasSource.includes('objectiveTarget'), 'Melee arenas must declare objective targets.');
assert(smashArenasSource.includes('getSmashObjectiveLabel'), 'Melee arenas must expose objective labels.');
assert(smashArenasSource.includes('forceBaseArena') && smashArenasSource.includes('dlcSuppressedArena'), 'Melee arena selection must support admin/DLC fallback to Nexus terrain.');
assert(gameCanvasSource.includes('getSmashPickupPositions'), 'Melee pickups must use arena-safe positions.');
assert(gameCanvasSource.includes('new EngineSmash(width, height, squadHeroes, enemyData, particles, (type) => sound.playSfx(type), handleBattleComplete, arenaStage)'), 'GameCanvas must pass resolved stage metadata into melee mode.');
assert(gameCanvasSource.includes('battleSummary'), 'GameCanvas must preserve melee combat summary data.');
assert(gameCanvasSource.includes('smashResultLines'), 'GameCanvas must render melee summary feedback on battle end.');
assert(gameCanvasSource.includes('hiddenUniverses') && gameCanvasSource.includes('dlcSuppressedArena'), 'GameCanvas must suppress DLC-specific melee arenas when universes are hidden.');
assert(appSource.includes('smashMasteryBonus'), 'App rewards must include capped melee mastery bonuses.');
assert(appSource.includes("activeStage.mode === 'Smash'") && appSource.includes('battleSummary?.mode === \'Smash\''), 'Melee mastery rewards must be limited to Smash results.');

[
  'training_grid',
  'urban_crossfire',
  'facility_lockdown',
  'ruined_highground',
  'war_frontline',
  'horror_chokepoint',
  'cyber_vertical_node',
  'boss_command_zone'
].forEach(battlefieldId => {
  assert(tacticsBattlefieldsSource.includes(`${battlefieldId}: {`), `Missing tactics battlefield layout ${battlefieldId}.`);
});
[
  'heroSpawns',
  'monsterSpawns',
  'bossSpawns',
  'worldBossSpawn',
  'lightCover',
  'heavyCover',
  'hazard',
  'heal',
  'blocked',
  'objective'
].forEach(marker => {
  assert(tacticsBattlefieldsSource.includes(marker), `Tactics battlefield system missing ${marker}.`);
});
assert(tacticsBattlefieldsSource.includes('EXPANDED_UNIVERSE_SIGNATURES'), 'Tactics battlefield selection must use expanded universe metadata.');
assert(tacticsBattlefieldsSource.includes('forceBaseArena') && tacticsBattlefieldsSource.includes('dlcSuppressedArena'), 'Tactics battlefield selection must support admin/DLC fallback to Nexus terrain.');
assert(tacticsBattlefieldsSource.includes('getTacticsPickupPositions'), 'Tactics battlefields must expose terrain-safe pickup positions.');
assert(tacticsBattlefieldsSource.includes('getTacticsMissionProfile') && tacticsBattlefieldsSource.includes('reinforcementEvery') && tacticsBattlefieldsSource.includes('hazardPulseEvery'), 'Tactics battlefields must expose difficulty-based mission pressure profiles.');
assert(tacticsEngineSource.includes('getTacticsBattlefield'), 'Tactics engine must load battlefield layouts from stage metadata.');
assert(tacticsEngineSource.includes('this.battlefield'), 'Tactics engine must keep the active battlefield profile.');
assert(tacticsEngineSource.includes('getTileAt'), 'Tactics engine must inspect terrain tiles.');
assert(tacticsEngineSource.includes('isBlockedTile'), 'Tactics engine must block movement through blocked terrain.');
assert(tacticsEngineSource.includes('applyStartTileEffect'), 'Tactics engine must apply terrain start-of-turn effects.');
assert(tacticsEngineSource.includes('getTileMoveCost'), 'Tactics movement must support terrain movement costs.');
assert(tacticsEngineSource.includes('getTileFill'), 'Tactics engine must render terrain types distinctly.');
assert(tacticsEngineSource.includes('getCoverReduction') && tacticsEngineSource.includes('heavyCover'), 'Tactics engine must apply cover from terrain tiles.');
assert(tacticsEngineSource.includes('getFacingBonus') && tacticsEngineSource.includes('FLANK') && tacticsEngineSource.includes('BACK'), 'Tactics damage must support flank and back attacks.');
assert(tacticsEngineSource.includes('getTerrainDamageModifier') && tacticsEngineSource.includes('HIGH') && tacticsEngineSource.includes('RISK'), 'Tactics damage must support height advantage and hazard penalties.');
[
  "objective: 'rout'",
  "objective: 'extract'",
  "objective: 'disable'",
  "objective: 'control'",
  "objective: 'commander'",
  "objective: 'survive'"
].forEach(marker => {
  assert(tacticsBattlefieldsSource.includes(marker), `Tactics battlefield objectives missing ${marker}.`);
});
assert(tacticsEngineSource.includes('updateTacticsObjective'), 'Tactics engine must update objective progress.');
assert(tacticsEngineSource.includes('completeBattle'), 'Tactics engine must complete objective-based battles.');
assert(tacticsEngineSource.includes('drawTacticsObjectiveHud'), 'Tactics engine must render objective HUD feedback.');
assert(tacticsEngineSource.includes('drawTacticsObjectiveZones'), 'Tactics engine must render objective and extraction zones.');
assert(tacticsEngineSource.includes('getCombatSummary') && tacticsEngineSource.includes("mode: 'Tactics'"), 'Tactics engine must expose a combat summary.');
assert(tacticsEngineSource.includes('getObjectiveFocusCells'), 'Tactics AI must resolve objective focus cells.');
assert(tacticsEngineSource.includes('scoreObjectiveMove'), 'Tactics AI must score movement against objectives and terrain.');
assert(tacticsEngineSource.includes('preferredEnemies'), 'Tactics hero AI must prioritize commander targets without ignoring fallback enemies.');
assert(tacticsEngineSource.includes('applyTacticsMissionPressure'), 'Tactics engine must apply long-term mission pressure.');
assert(tacticsEngineSource.includes('spawnTacticsReinforcement'), 'Tactics engine must spawn difficulty-gated reinforcements.');
assert(tacticsEngineSource.includes('applyHazardPulse'), 'Tactics engine must pulse hazardous terrain on advanced profiles.');
assert(tacticsEngineSource.includes('applyTacticalBattleItem') && tacticsEngineSource.includes('tacticalItemsUsed') && tacticsEngineSource.includes('tacticalItemImpact'), 'Tactics engine must resolve tactical artifact effects and summarize impact.');
assert(gameCanvasSource.includes('getTacticsPickupPositions'), 'GameCanvas must place Tactics pickups through battlefield-safe positions.');
assert(gameCanvasSource.includes('new EngineTactics(width, height, squadHeroes, enemyData, particles, (type) => sound.playSfx(type), handleBattleComplete, arenaStage)'), 'GameCanvas must pass resolved stage metadata into tactics mode.');
assert(gameCanvasSource.includes("['Smash', 'Tactics'].includes(stage.mode)") && gameCanvasSource.includes('dlcSuppressedArena'), 'GameCanvas must suppress DLC-specific tactics fields when universes are hidden.');
assert(gameCanvasSource.includes('tacticsResultLines'), 'GameCanvas must render Tactics result summary feedback.');
assert(gameCanvasSource.includes('reinforcementsCalled') && gameCanvasSource.includes('hazardPulses'), 'GameCanvas must display Tactics pressure results.');
assert(gameCanvasSource.includes('applyTacticalBattleItem') && gameCanvasSource.includes('Tactical artifacts'), 'GameCanvas must route Tactics artifacts through the Tactics engine and display them.');
assert(appSource.includes('tacticsMasteryBonus'), 'App rewards must include capped Tactics mastery bonuses.');

console.log(JSON.stringify({
  baseUniverse: 'Nexus de Convergence',
  ocHeroes: expectedOcHeroIds.length,
  ocThreatSprites: expectedOcEnemyNames.length,
  ocItemSprites: expectedOcItemIds.length,
  requiredBaseModes: ['RPG', 'Tactics', 'Smash'],
  dlcDefault: 'hidden',
  storyChapterPortals: 'active-chapter-only',
  factionArcCompletion: 'expanded',
  meleeArenaLayouts: 17,
  meleeTerrainSystem: 'dynamic',
  meleeObjectiveSystem: 'active',
  meleeObjectiveVariants: ['protect', 'collect', 'portals', 'overload'],
  meleeCombatFeel: 'recovery-and-ai',
  meleePlatformAccess: 'soft-level-stable',
  meleeDlcMapping: 'metadata-aware',
  meleeResultSummary: 'score-grade-objective',
  meleeRewardLoop: 'grade-bonus',
  tacticsBattlefieldLayouts: 8,
  tacticsTerrainSystem: 'dynamic',
  tacticsTerrainTypes: ['high', 'lightCover', 'heavyCover', 'hazard', 'heal', 'blocked', 'objective'],
  tacticsPlacementRules: ['move-costs', 'height-advantage', 'flank-back'],
  tacticsObjectives: ['rout', 'extract', 'disable', 'control', 'commander', 'survive'],
  tacticsAi: 'objective-aware',
  tacticsMissionPressure: ['reinforcements', 'hazard-pulses', 'difficulty-profiles'],
  tacticsArtifacts: 'engine-resolved-grid-effects',
  tacticsDlcMapping: 'metadata-aware',
  tacticsRewardLoop: 'grade-bonus'
}, null, 2));
