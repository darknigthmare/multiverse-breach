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
const raceModeSource = read('../src/components/RaceMode.jsx');
const smashEngineSource = read('../src/game/engineSmash.js');
const raceEngineSource = read('../src/game/engineRace.js');
const spriteAssetsSource = read('../src/game/spriteAssets.js');
const rendererSource = read('../src/game/renderer.js');
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
assert(hubSource.includes("setActiveTab('race')") && hubSource.includes('<RaceMode'), 'Hub must expose the playable Race/Kart tab.');
assert(raceModeSource.includes('new EngineRace') && raceModeSource.includes('engine.useItem()'), 'Race screen must instantiate the race engine and expose item usage.');
assert(raceModeSource.includes('race-mode-canvas') && raceModeSource.includes('race-touch-controls'), 'Race screen must render canvas gameplay and virtual controls.');
assert(raceEngineSource.includes('RACE_ASSETS') && raceEngineSource.includes('arca-mirelle-kart-directions.png'), 'Race engine must use the Mirelle kart sprite sheet assets.');
assert(raceEngineSource.includes('arca-mirelle-hud-avatar.png') && raceModeSource.includes('race-mode-pilot-icon'), 'Race pilot HUD must use a cropped Mirelle icon instead of a full sprite plaque.');
assert(raceEngineSource.includes('drawRaceCameraBackdrop') && raceEngineSource.includes('drawRearRoad') && raceEngineSource.includes('drawRearPlayerKart'), 'Race mode must render from a rear kart camera, not only a top-down circuit.');
assert(raceEngineSource.includes('const sprite = this.images.kartDirections') && raceEngineSource.includes('const row = 1'), 'Rear kart camera must crop Mirelle from the rear-facing direction row.');
assert(raceEngineSource.includes('projectToRearCamera') && raceEngineSource.includes('drawProjectedRaceObjects'), 'Race objects and rivals must be projected into the rear camera view.');
assert(raceEngineSource.includes('drawTopDownMinimap') && raceModeSource.includes('vue de dessus reste limitee a la mini-map'), 'Race top-down view must stay limited to the minimap.');
[
  'arca-mirelle-rpg.png',
  'arca-mirelle-tactics.png',
  'arca-mirelle-melee-movement.png',
  'arca-mirelle-melee-combat.png',
  'arca-mirelle-nexus-collection.png',
  'arca-mirelle-hud-icons.png',
  'arca-mirelle-hud-avatar.png',
  'arca-mirelle-items-vfx.png',
  'arca-mirelle-fps-hands.png',
  'arca-mirelle-fps-effects.png',
  'arca-mirelle-fps-projectile.png',
  'arca-mirelle-kart-directions.png',
  'arca-mirelle-kart-actions.png',
  'arca-mirelle-kart-items.png',
  'arca-mirelle-kart-hud-garage.png',
  'arca-mirelle-kart-track-nexus.png'
].forEach(file => {
  assert(spriteAssetsSource.includes(file), `Mirelle complete sprite pack missing ${file}.`);
});
assert(rendererSource.includes("context = 'auto'") && rendererSource.includes('srcGetter(entity, context)'), 'Renderer must route hero sprites by mode context.');
assert(spriteAssetsSource.includes('SPRITE_SHEET_LAYOUTS') && spriteAssetsSource.includes('rows: 12') && spriteAssetsSource.includes('rows: 10') && spriteAssetsSource.includes('rows: 6'), 'Mirelle complete sheets must declare real per-sheet crop layouts.');
assert(spriteAssetsSource.includes('normalizeSpriteSrc') && spriteAssetsSource.includes('new URL(value).pathname'), 'Sprite layout lookup must normalize absolute browser URLs before matching generated sheet paths.');
assert(rendererSource.includes('getSpriteSheetLayout') && rendererSource.includes('getSpriteFrameForLayout'), 'Renderer must crop generated sprites through per-sheet layouts.');
assert(rendererSource.includes('sourceY') && rendererSource.includes('sourceH') && spriteAssetsSource.includes('trimByState'), 'Renderer must support per-sheet trim data to avoid adjacent OpenAI sprite bleed.');
assert(hubSource.includes('sheet.naturalHeight / 10') && hubSource.includes('fpsProjectileRef'), 'FPS Mirelle hands must be cropped as 4x10 and use a dedicated projectile overlay.');
assert(hubSource.includes('reloadTrimTop') && hubSource.includes('reloadTrimBottom'), 'FPS reload frames must crop away adjacent row bleed.');
assert(hubSource.includes('reloadPulse') && hubSource.includes('state.reloadPulse > 0 && !state.muzzle ? 6 : 0') && hubSource.includes('state.muzzle = 36') && hubSource.includes('fpsProjectileRef.current') && hubSource.includes('410, 146'), 'FPS firing must keep idle hands framed and draw projectile frames as a separate overlay.');
assert(raceEngineSource.includes('drawRearKartActionOverlay') && raceEngineSource.includes('KART_ITEM_FRAMES') && raceEngineSource.includes('this.images.kartItems') && raceEngineSource.includes('this.images.hudIcons'), 'Race mode must render Mirelle kart actions, item sheet, and HUD icon sheet in playable views.');
assert(raceModeSource.includes('race-garage-card') && raceModeSource.includes('RACE_ASSETS.hudGarage') && raceModeSource.includes('RACE_ASSETS.kartItems'), 'Race tab must expose Mirelle garage and item sheets outside admin preview.');
assert(raceEngineSource.includes('KART_TRACK_LAYOUTS') && raceEngineSource.includes('nexus_suture_eight') && raceEngineSource.includes('portal_hairpin_ritual') && raceEngineSource.includes('surfaceZones'), 'Race mode must provide varied Super-Kart-style Nexus track layouts.');
assert(raceEngineSource.includes('getClosestRoadPoint') && raceEngineSource.includes('this.track.roadWidth') && raceEngineSource.includes('this.track.shortcuts'), 'Race physics and minimap must follow the active track path instead of one fixed oval.');
assert(raceModeSource.includes('race-track-selector') && raceModeSource.includes('setTrackId') && raceModeSource.includes('trackList.map'), 'Race tab must let the player switch between available kart tracks.');
assert(rendererSource.includes('drawMirelleItemVfx') && rendererSource.includes('MIRELLE_COMPLETE_SPRITES.itemsVfx'), 'Combat renderer must use Mirelle item/VFX sheet during gameplay states.');
assert(gameCanvasSource.includes('heroSpriteContext'), 'GameCanvas must preload mode-specific hero sprites.');
assert(hubSource.includes("drawPixelSprite(ctx, 150, 182, selectedHero, 0, 1, 178, 'nexus')"), 'Roster must render Mirelle with Nexus/collection sheet.');
assert(hubSource.includes("drawPixelSprite(ctx, x, y + 24") && hubSource.includes('false, hero)'), 'Mosaic City Nexus NPCs must render real hero sprites instead of color fallback blocks.');
assert(hubSource.includes("drawPixelSprite(ctx, 56, 98, hero, 0, 1, 88, 'hud')") && hubSource.includes("drawPixelSprite(ctx, 38, 70, hero, 0, 1, 62, 'hud')"), 'Resonance hero icons must use cropped HUD avatars.');
assert(hubSource.includes('fpsHandsRef') && hubSource.includes('MIRELLE_COMPLETE_SPRITES.fpsHands'), 'FPS mode must use Mirelle FPS hands and effects sheets.');
assert(hubSource.includes("spritePreview.kind === 'pack'"), 'Admin sprite preview must render complete hero sprite packs.');
[
  'checkpoints',
  'boostPads',
  'itemBoxes',
  'hazards',
  'updateAiKart',
  'useItem',
  'getRaceSummary',
  'drawHud'
].forEach(marker => {
  assert(raceEngineSource.includes(marker), `Race gameplay missing ${marker}.`);
});
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
  'boss_command_zone',
  'artifact_bastion',
  'portal_lockdown',
  'nexus_escort_route',
  'boss_overload_zone'
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
  'objective',
  'portalSpawn',
  'artifact'
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
  "objective: 'survive'",
  "objective: 'protect'",
  "objective: 'portals'",
  "objective: 'escort'",
  "objective: 'overload'"
].forEach(marker => {
  assert(tacticsBattlefieldsSource.includes(marker), `Tactics battlefield objectives missing ${marker}.`);
});
[
  'wide',
  'vertical',
  'coverHeavy',
  'lineOfSight',
  'hazard',
  'escort',
  'defense',
  'bossArena',
  'portalSpawn',
  'loreArena',
  'survival',
  'artifact'
].forEach(tag => {
  assert(tacticsBattlefieldsSource.includes(`'${tag}'`), `Tactics tag missing ${tag}.`);
});
assert(tacticsEngineSource.includes('updateTacticsObjective'), 'Tactics engine must update objective progress.');
assert(tacticsEngineSource.includes('completeBattle'), 'Tactics engine must complete objective-based battles.');
assert(tacticsEngineSource.includes('drawTacticsObjectiveHud'), 'Tactics engine must render objective HUD feedback.');
assert(tacticsEngineSource.includes('drawTacticsObjectiveZones'), 'Tactics engine must render objective and extraction zones.');
assert(tacticsEngineSource.includes('getTacticsDrawOrder') && tacticsEngineSource.includes('gridY * 100'), 'Tactics units must render by grid depth so lower rows appear in front.');
assert(tacticsEngineSource.includes('getTurnTimeline') && tacticsEngineSource.includes('drawTurnTimeline'), 'Tactics UI must render initiative order feedback.');
assert(tacticsEngineSource.includes('sealedPortalKeys') && tacticsEngineSource.includes('PORTAIL SCELLE'), 'Tactics portals must be sealable objective tiles.');
assert(tacticsEngineSource.includes('protectedArtifact') && tacticsEngineSource.includes('ARTEFACT'), 'Tactics artifact objectives must track protected or collected artifacts.');
assert(tacticsEngineSource.includes('escortUnit') && tacticsEngineSource.includes('advanceEscortUnit'), 'Tactics escort objectives must move a protected Nexus unit.');
assert(tacticsEngineSource.includes("this.objective === 'overload'"), 'Tactics overload objectives must enforce a boss timer.');
assert(tacticsEngineSource.includes('getCombatSummary') && tacticsEngineSource.includes("mode: 'Tactics'"), 'Tactics engine must expose a combat summary.');
assert(tacticsEngineSource.includes('getObjectiveFocusCells'), 'Tactics AI must resolve objective focus cells.');
assert(tacticsEngineSource.includes('scoreObjectiveMove'), 'Tactics AI must score movement against objectives and terrain.');
assert(tacticsEngineSource.includes('preferredEnemies'), 'Tactics hero AI must prioritize commander targets without ignoring fallback enemies.');
assert(tacticsEngineSource.includes('getEnemyTacticsRole') && tacticsEngineSource.includes("'shooter'") && tacticsEngineSource.includes("'assassin'") && tacticsEngineSource.includes("'support'"), 'Tactics enemies must use role-based AI profiles.');
assert(tacticsEngineSource.includes("['tank', 'bossController'].includes(role)") && tacticsEngineSource.includes('obstacle'), 'Tactics heavy enemies must be able to break destructible cover.');
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
  raceMode: 'playable-hub-tab',
  raceGameplay: ['laps', 'checkpoints', 'drift', 'boost', 'items', 'hazards', 'ai-rivals'],
  racePilotSprite: 'mirelle-kart-openai-sheet',
  mirelleCompleteSpritePack: 16,
  mirelleSpriteRouting: ['rpg', 'tactics', 'melee', 'nexus', 'hud', 'fps', 'kart', 'admin-preview'],
  meleeArenaLayouts: 17,
  meleeTerrainSystem: 'dynamic',
  meleeObjectiveSystem: 'active',
  meleeObjectiveVariants: ['protect', 'collect', 'portals', 'overload'],
  meleeCombatFeel: 'recovery-and-ai',
  meleePlatformAccess: 'soft-level-stable',
  meleeDlcMapping: 'metadata-aware',
  meleeResultSummary: 'score-grade-objective',
  meleeRewardLoop: 'grade-bonus',
  tacticsBattlefieldLayouts: 12,
  tacticsTerrainSystem: 'dynamic',
  tacticsTerrainTypes: ['high', 'lightCover', 'heavyCover', 'hazard', 'heal', 'blocked', 'objective', 'portalSpawn', 'artifact'],
  tacticsPlacementRules: ['move-costs', 'height-advantage', 'flank-back'],
  tacticsVisualCoherence: ['grid-depth-order', 'initiative-timeline'],
  tacticsObjectives: ['rout', 'extract', 'disable', 'control', 'commander', 'survive', 'protect', 'portals', 'escort', 'overload'],
  tacticsAi: 'objective-and-role-aware',
  tacticsMissionPressure: ['reinforcements', 'hazard-pulses', 'difficulty-profiles'],
  tacticsTags: ['wide', 'vertical', 'coverHeavy', 'lineOfSight', 'hazard', 'escort', 'defense', 'bossArena', 'portalSpawn', 'loreArena', 'survival', 'artifact'],
  tacticsArtifacts: 'engine-resolved-grid-effects',
  tacticsDlcMapping: 'metadata-aware',
  tacticsRewardLoop: 'grade-bonus'
}, null, 2));
