import { existsSync, readFileSync, statSync } from 'node:fs';
import { REQUESTED_UNIVERSE_WAVE } from '../src/game/requestedUniverseWave.js';
import { RECENT_UNIVERSE_LEVELS } from '../src/game/recentUniverseLevels.js';
import { LORE_WORLD_BOSS_OVERRIDES, LORE_WORLD_BOSS_POLICIES } from '../src/game/loreWorldBossOverrides.js';
import { STAGE_ARC_LORE_PROFILES, STAGE_LORE_PROFILES } from '../src/game/stageLoreProfiles.js';
import {
  OC_CAMPAIGN_ACTS,
  OC_CAMPAIGN_CHAPTERS,
  OC_CAMPAIGN_ENDINGS,
  OC_CAMPAIGN_MISSIONS,
  OC_FINAL_MISSION_ID,
  OC_ORIGIN_LOCKS,
  getOcCampaignProgress
} from '../src/game/ocCampaign.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';

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
const regulationImagePreviewSource = read('../src/components/RegulationImagePreview.jsx');
const ocCampaignSource = read('../src/game/ocCampaign.js');
const characterPlaquesSource = read('../src/game/characterPlaques.js');
const featuredUniverseSource = read('../src/game/featuredUniversePacks.js');
const expandedUniversesSource = read('../src/game/expandedUniverses.js');
const loreAccuratePacksSource = read('../src/game/loreAccuratePacks.js');
const loreDescriptionsSource = read('../src/game/loreDescriptions.js');
const narrativeSystemsSource = read('../src/game/narrativeSystems.js');
const missionStageProjectionSource = read('../src/game/missions/missionStageProjection.js');
const storySource = `${hubSource}\n${ocCampaignSource}`;
const gameCanvasSource = read('../src/components/GameCanvas.jsx');
const rpgEngineSource = read('../src/game/engineRpg.js');
const raceModeSource = read('../src/components/RaceMode.jsx');
const fighterModeSource = read('../src/components/FighterMode.jsx');
const fighterEngineSource = read('../src/game/engineFighter.js');
const smashEngineSource = read('../src/game/engineSmash.js');
const raceEngineSource = read('../src/game/engineRace.js');
const spriteAssetsSource = read('../src/game/spriteAssets.js');
const rendererSource = read('../src/game/renderer.js');
const smashArenasSource = read('../src/game/smashArenas.js');
const tacticsEngineSource = read('../src/game/engineTactics.js');
const tacticsBattlefieldsSource = read('../src/game/tacticsBattlefields.js');
const recentUniverseLevelsSource = read('../src/game/recentUniverseLevels.js');
const recentUniverseTextureAssetsSource = read('../src/game/recentUniverseTextureAssets.js');
const recentTextureSources = JSON.parse(read('../public/textures/recent-universes/openai-level-texture-sources.json'));
const recentTacticsTextureSources = JSON.parse(read('../public/textures/recent-universes/openai-tactics-perspective-sources.json'));
const spriteChecklistSource = read('../SPRITE_CONVERSION_CHECKLIST.txt');
const spriteReferenceSource = read('../public/sprites/generated/sprite-reference-sources.json');
const manifest = JSON.parse(read('../public/sprites/generated/sprite-manifest.json'));
const generatedStageAssets = JSON.parse(read('../src/game/generatedStageAssets.json'));
const featuredVisualManifest = JSON.parse(read('../public/images/generated/featured-visual-manifest.json'));
const featuredVisualPrompts = read('../public/images/generated/featured-openai-visual-prompts.jsonl').trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
const manifestOutputs = new Set((manifest.entries || []).filter(entry => entry.available).map(entry => entry.output));
const stageLoreProfiles = [...Object.values(STAGE_LORE_PROFILES), ...Object.values(STAGE_ARC_LORE_PROFILES)];
const generatedStageLoreProfiles = stageLoreProfiles.filter(profile => profile.auditStatus !== 'ORIGINAL-OC');
const originalOcStageLoreProfiles = stageLoreProfiles.filter(profile => profile.auditStatus === 'ORIGINAL-OC');
const worldBossUniverses = new Set(Object.keys(LORE_WORLD_BOSS_OVERRIDES));
const worldBossPolicyUniverses = new Set(Object.keys(LORE_WORLD_BOSS_POLICIES));

const expectedOcHeroIds = [
  'arca_mirelle',
  'arca_bastion',
  'arca_nova',
  'arca_marrow',
  'arca_sable',
  'arca_loom',
  'arca_tessera',
  'arca_quillon',
  'arca_nadir',
  'arca_elyra',
  'arca_oryn'
];
const expectedOcEnemyNames = [
  'echo-sans-auteur',
  'archiviste-rompu',
  'noeud-de-paradoxe',
  'fragment-vagabond',
  'drone-a-r-c-a-corrompu',
  'pelerin-de-la-fausse-sortie',
  'greffier-du-voile',
  'juge-des-trames',
  'cartographe-des-portes-mortes',
  'avatar-du-sans-auteur',
  'moteur-de-convergence-instable',
  'reflet-de-vie-possible',
  'courtier-du-regret',
  'usurpateur-des-vies-possibles',
  'scribe-du-registre-noir',
  'porte-verrou-endeuille',
  'intendant-du-sacrifice-muet',
  'indexeur-des-contradictions',
  'guide-de-l-issue-parfaite',
  'conservateur-des-causes-absentes',
  'rature-du-seuil-blanc',
  'simulacre-sans-choix',
  'heraut-de-la-paix-illisible',
  'vigie-de-la-coordonnee-x',
  'contre-temoin-de-veyr',
  'arbitre-de-la-cause-unique'
];
const expectedOcItemIds = ['arca-signal-lens', 'nexus-anchor-coil', 'origin-shard-guard'];
const expectedOcProceduralThreats = ['Double ideal de Marrow', 'Matrice de Substitution'];
const expectedOcDeferredSprites = ['Double ideal de Marrow'];
const expectedOcOriginLocks = ['name', 'contradiction', 'scar', 'debt', 'return', 'choice'];
const expectedChuckySpriteOutputs = [
  '/sprites/generated/heroes/chucky/chucky.png',
  '/sprites/generated/heroes/chucky/tiffany.png',
  '/sprites/generated/heroes/chucky/glen.png',
  '/sprites/generated/heroes/chucky/tiffany-human-bride.png',
  '/sprites/generated/heroes/chucky/tiffany-human-wedding.png',
  '/sprites/generated/heroes/chucky/tiffany-human-all-black-1998.png',
  '/sprites/generated/heroes/chucky/tiffany-voluptuous-original-au.png',
  '/sprites/generated/heroes/chucky/tiffany-leather-jacket-bride-1998.png',
  '/sprites/generated/heroes/chucky/tiffany-dark-haired-wedding-belle-au.png',
  '/sprites/generated/heroes/chucky/tiffany-burned-bald-damage-au.png',
  '/sprites/generated/heroes/chucky/tiffany-human-two-piece-bikini-au.png',
  '/sprites/generated/heroes/chucky/tiffany-doll-two-piece-bikini-au.png',
  '/sprites/generated/heroes/chucky/tiffany-street-siren-au.png',
  '/sprites/generated/heroes/chucky/tiffany-synthetic-companion-doll-au.png',
  '/sprites/generated/heroes/chucky/tiffany-leather-mistress-au.png',
  '/sprites/generated/heroes/chucky/tiffany-street-siren-doll-au.png',
  '/sprites/generated/heroes/chucky/tiffany-synthetic-companion-doll-form-au.png',
  '/sprites/generated/heroes/chucky/tiffany-leather-mistress-doll-au.png',
  '/sprites/generated/heroes/chucky/jennifer-tilly-seed.png',
  '/sprites/generated/heroes/chucky/jennifer-tilly-seed-glamour.png',
  '/sprites/generated/bosses/chucky/charles-lee-ray-human.png',
  '/sprites/generated/bosses/chucky/bride-chucky-1998.png',
  '/sprites/generated/bosses/chucky/buddi-chucky-2019.png',
  '/sprites/generated/bosses/chucky/good-chucky-season-2.png',
  '/sprites/generated/bosses/chucky/buff-chucky-season-2.png',
  '/sprites/generated/bosses/chucky/colonel-chucky-season-2.png',
  '/sprites/generated/bosses/chucky/belle-chucky-season-2.png',
  '/sprites/generated/bosses/chucky/christmas-chucky-season-2.png',
  '/sprites/generated/bosses/chucky/old-chucky-season-3.png'
];
const expectedChuckyExpansionRoster = [
  'Tiffany Valentine - Human (Bride)',
  'Tiffany Valentine - Gothic Bride',
  'Tiffany Valentine - All-Black Gothic (1998)',
  'Tiffany Valentine - Voluptuous Original (Adult AU)',
  'Tiffany Doll - Leather Jacket Bride (1998)',
  'Tiffany Doll - Dark-Haired Wedding Belle (AU)',
  'Tiffany Doll - Burned and Bald (Damage AU)',
  'Tiffany Valentine - Two-Piece Bikini (Adult AU)',
  'Tiffany Doll - Two-Piece Bikini (Adult AU)',
  'Tiffany Valentine - Street Siren (Adult AU)',
  'Tiffany Valentine - Synthetic Doll (Adult AU)',
  'Tiffany Valentine - Leather Mistress (Adult AU)',
  'Tiffany Doll - Street Siren (Adult AU)',
  'Tiffany Doll - Synthetic Companion (Adult AU)',
  'Tiffany Doll - Leather Mistress (Adult AU)',
  'Jennifer Tilly (Seed of Chucky)',
  'Jennifer Tilly - Seed Glamour Costume',
  'Charles Lee Ray - Human (1988)',
  'Bride Chucky (1998)',
  'Buddi Chucky (2019 Remake)',
  'Good Chucky - Scout (Season 2)',
  'Buff Chucky - Hulk (Season 2)',
  'Colonel Chucky (Season 2)',
  'Belle Disguise Chucky (Season 2)',
  'Christmas Chucky (Season 2)',
  'Old Chucky (Season 3)'
];
const expectedFeaturedUniverses = [
  'Tomba',
  'Woodruff',
  'Hellraiser',
  'A Nightmare on Elm Street',
  'The Ring',
  'The Grudge'
];
const expectedStargateSpriteOutputs = [
  '/sprites/generated/bosses/stargate/replicator-insect-drone.png',
  '/sprites/generated/bosses/stargate/kull-warrior-prototype.png',
  '/sprites/generated/bosses/stargate/anubis-jackal-guard-1994.png',
  '/sprites/generated/bosses/stargate/jaffa-serpent-guard.png',
  '/sprites/generated/heroes/stargate/bratac.png'
];
const expectedStygianInquisitionSpriteOutputs = [
  '/sprites/generated/bosses/hellraiser/the-auditor-judgment.png',
  '/sprites/generated/bosses/hellraiser/the-assessor-judgment.png',
  '/sprites/generated/bosses/hellraiser/the-jury-judgment.png',
  '/sprites/generated/bosses/hellraiser/the-cleaners-judgment.png',
  '/sprites/generated/bosses/hellraiser/the-butcher-judgment.png',
  '/sprites/generated/bosses/hellraiser/the-surgeon-judgment.png'
];
const expectedDandadanSpriteOutputs = [
  '/sprites/generated/heroes/dandadan/momo-ayase.png',
  '/sprites/generated/heroes/dandadan/oken-dandadan.png',
  '/sprites/generated/heroes/dandadan/aira-dandadan.png',
  '/sprites/generated/heroes/dandadan/jiji-dandadan.png',
  '/sprites/generated/heroes/dandadan/seiko-dandadan.png',
  '/sprites/generated/heroes/dandadan/turbo-granny-cat.png'
];
const expectedFrenchComedySpriteOutputs = [
  '/sprites/generated/heroes/les-inconnus/inconnus-trio.png',
  '/sprites/generated/heroes/les-inconnus/bernard-inconnus.png',
  '/sprites/generated/heroes/les-inconnus/didier-inconnus.png',
  '/sprites/generated/heroes/rrrrrrr/pierre-rrr.png',
  '/sprites/generated/heroes/rrrrrrr/guy-rrr.png',
  '/sprites/generated/heroes/rrrrrrr/chef-cheveux-sales.png',
  '/sprites/generated/heroes/la-cite-de-la-peur/odile-deray.png',
  '/sprites/generated/heroes/la-cite-de-la-peur/simon-jeremi.png',
  '/sprites/generated/heroes/la-cite-de-la-peur/serge-karamazov.png'
];
const expectedRequestedUniverseWave = [
  'Chainsaw Man',
  'Cyberpunk: Edgerunners',
  'Demon Slayer',
  'Parasyte',
  'Steins;Gate',
  'Zero Escape: The Nonary Games',
  "JoJo's Bizarre Adventure",
  'Rurouni Kenshin',
  'Tokyo Ghoul',
  'Cowboy Bebop',
  'Dragon Ball Z',
  'Elfen Lied',
  'Fullmetal Alchemist',
  'Gantz',
  'Psycho-Pass',
  'Mashle',
  'Solo Leveling',
  'Frieren: Beyond Journeys End',
  'Deadman Wonderland',
  'Devilman',
  'Neon Genesis Evangelion',
  'Naruto',
  'Naruto Shippuden',
  'Boruto: Naruto Next Generations',
  'Boruto: Two Blue Vortex',
  'One Punch Man',
  'Sword Art Online: Gun Gale Online',
  'Sword Art Online',
  'Les Aventures de Saturnin',
  'MagiC JacK',
  'Teen Titans',
  'Godzilla',
  'Solar Opposites',
  'Siren Head'
];
const pendingRecentTextureUniverses = new Set(['Solar Opposites', 'Siren Head']);
const expectedSupplementalOpenAiSpriteOutputs = [
  '/sprites/generated/bosses/matrix/breach-singularity-core.png',
  '/sprites/generated/bosses/the-matrix/sentinel-squid-drone.png',
  '/sprites/generated/bosses/the-matrix/twin-ghost-exile.png',
  '/sprites/generated/heroes/the-matrix/agent-smith.png',
  '/sprites/generated/heroes/the-matrix/niobe-matrix.png',
  '/sprites/generated/heroes/the-matrix/tank-matrix.png',
  '/sprites/generated/heroes/the-matrix/oracle-matrix.png',
  '/sprites/generated/heroes/the-matrix/link-matrix.png',
  '/sprites/generated/heroes/the-matrix/seraph.png',
  '/sprites/generated/bosses/the-matrix/matrix-security-swat-program.png',
  '/sprites/generated/bosses/the-matrix/agent-brown-program.png',
  '/sprites/generated/bosses/the-matrix/agent-thompson-program.png',
  '/sprites/generated/bosses/the-matrix/merovingian-guard.png',
  '/sprites/generated/bosses/toxic-avenger/toxic-thug.png',
  '/sprites/generated/bosses/toxic-avenger/sludge-mutant.png',
  '/sprites/generated/bosses/toxic-avenger/corporate-dump-guard.png',
  '/sprites/generated/bosses/toxic-avenger/tromaville-bully-pack.png',
  '/sprites/generated/bosses/toxic-avenger/radiation-barrel-beast.png',
  '/sprites/generated/bosses/cells-at-work/pneumococcus-germ.png',
  '/sprites/generated/bosses/cells-at-work/cedar-pollen-allergen.png',
  '/sprites/generated/bosses/cells-at-work/cancer-cell-scout.png',
  '/sprites/generated/bosses/cells-at-work/influenza-virus-swarm.png',
  '/sprites/generated/bosses/cells-at-work/killer-t-cell-drill.png',
  '/sprites/generated/heroes/cells-at-work/red-blood-cell-courier-ae3803.png',
  '/sprites/generated/heroes/cells-at-work/white-blood-cell-long-hair.png',
  '/sprites/generated/heroes/cells-at-work/white-blood-cell-short-hair.png',
  '/sprites/generated/heroes/cells-at-work/neutrophil-u1146-combat.png',
  '/sprites/generated/heroes/cells-at-work/platelet-squad-leader.png',
  '/sprites/generated/heroes/cells-at-work/macrophage-cleaner.png',
  '/sprites/generated/bosses/cells-at-work/cancer-cell-true-form.png',
  '/sprites/generated/bosses/the-batman-who-laughs/robined-crow.png',
  '/sprites/generated/bosses/the-batman-who-laughs/dark-metal-drone.png',
  '/sprites/generated/bosses/the-batman-who-laughs/jokerized-bat-guard.png',
  '/sprites/generated/bosses/the-batman-who-laughs/dark-robin-swarm.png',
  '/sprites/generated/bosses/uzumaki/spiral-snail-student.png',
  '/sprites/generated/bosses/uzumaki/twisted-hair-storm.png',
  '/sprites/generated/bosses/uzumaki/cremation-smoke-coil.png',
  '/sprites/generated/bosses/uzumaki/azami-spiral-eye.png',
  '/sprites/generated/bosses/uzumaki/lighthouse-coil.png',
  '/sprites/generated/bosses/inuyashiki/cyber-weapon-trace.png',
  '/sprites/generated/bosses/inuyashiki/media-panic-mob.png',
  '/sprites/generated/bosses/inuyashiki/drone-police-unit.png',
  '/sprites/generated/bosses/inuyashiki/airport-missile-lock.png',
  '/sprites/generated/bosses/inuyashiki/hiro-remote-kill-pattern.png',
  '/sprites/generated/heroes/hellraiser/pinhead.png',
  '/sprites/generated/heroes/hellraiser/chatterer.png',
  '/sprites/generated/heroes/hellraiser/butterball.png',
  '/sprites/generated/heroes/hellraiser/female-cenobite.png',
  '/sprites/generated/heroes/hellraiser/kirsty.png',
  '/sprites/generated/heroes/hellraiser/julia-cotton.png',
  '/sprites/generated/heroes/hellraiser/joey-summerskill.png',
  '/sprites/generated/bosses/hellraiser/skinless-frank-cotton.png',
  '/sprites/generated/bosses/hellraiser/eremite-puzzle-guardian.png',
  '/sprites/generated/bosses/hellraiser/labyrinth-chain-corridor.png',
  '/sprites/generated/bosses/hellraiser/channard-cenobite.png',
  '/sprites/generated/bosses/hellraiser/the-engineer.png',
  '/sprites/generated/bosses/hellraiser/leviathan-diamond.png',
  '/sprites/generated/heroes/aural-vampire/exo-chika-av.png',
  '/sprites/generated/heroes/aural-vampire/raveman-av.png',
  '/sprites/generated/heroes/little-big/ilya-prusikin-lb.png',
  '/sprites/generated/heroes/little-big/sonya-tayurskaya-lb.png',
  '/sprites/generated/heroes/karune-cal/karune-cal-avatar.png',
  '/sprites/generated/heroes/karune-cal/calcium-endoskeleton.png'
];

assert(dlcSource.includes("BASE_GAME_UNIVERSES = ['Nexus de Convergence']"), 'Base OC universe must remain Nexus de Convergence.');
assert(
  dlcSource.includes('DEFAULT_HIDDEN_UNIVERSES')
  && dlcSource.includes('getDlcUniverseKeys()'),
  'DLC universes must be hidden by default.'
);
assert(
  missionStageProjectionSource.includes('UNIVERSE_ARC_FINAL_STAGE_BASE_ID = 40000')
  && missionStageProjectionSource.includes('UNIVERSE_ARC_FINAL_STAGE_BASE_ID + arcIndex'),
  'Universe narrative arcs must preserve their reserved 40000 final stage range.'
);
assert(
  missionStageProjectionSource.includes('MISSION_TEAM_SIZE = 3')
  && missionStageProjectionSource.includes('UNIVERSE_ARC_PHASE_STAGE_BASE_ID = 46000')
  && missionStageProjectionSource.includes('UNIVERSE_ARC_PHASE_STAGE_BASE_ID + (arcIndex * 10) + phaseIndex'),
  'Universe arc preludes must stay within the reserved 46000 range and three-signature cell limit.'
);
assert(!hubSource.includes('id: 9500 + index'), 'Universe narrative arcs must not collide with generated personal arcs.');
['41001', '41002', '41003', '41004'].forEach(stageId => {
  assert(narrativeSystemsSource.includes(`stageId: ${stageId}`), `Missing reserved trio stage ID ${stageId}.`);
});
['9601', '9602', '9603', '9604'].forEach(stageId => {
  assert(!narrativeSystemsSource.includes(`stageId: ${stageId}`), `Trio stage ID ${stageId} still collides with a personal arc.`);
});
assert(appSource.includes('inventory.includes(`universe_arc_${arc.id}`)') && appSource.includes('inventory.includes(arc.rewardItemId)'), 'Narrative stage ID migration must preserve proven arc rewards.');
assert(REQUESTED_UNIVERSE_WAVE.length === expectedRequestedUniverseWave.length, 'The requested anime, creator, hero, and kaiju wave must contain the expected universes.');
assert(new Set(REQUESTED_UNIVERSE_WAVE.map(entry => entry.universe)).size === REQUESTED_UNIVERSE_WAVE.length, 'The requested universe wave must not contain duplicate universe names.');
expectedRequestedUniverseWave.forEach(universe => {
  const entry = REQUESTED_UNIVERSE_WAVE.find(candidate => candidate.universe === universe);
  assert(entry, `Missing requested universe ${universe}.`);
  assert(entry.hero?.length === 3 && entry.allies?.length >= 2, `${universe} must expose at least three playable signatures.`);
  assert(entry.monsters?.length === 3 && entry.bosses?.length === 2 && (entry.worldBoss || entry.boss), `${universe} must expose a complete threat roster.`);
  assert(entry.gear?.length === 3 && entry.event?.length === 5, `${universe} must expose three gear pieces and one lore event.`);
  assert(entry.stageVariants?.length === 2, `${universe} must expose three distinct stages including the primary stage.`);
  const missionModes = new Set([entry.mode, ...entry.stageVariants.map(variant => Array.isArray(variant) ? variant[0] : variant.mode)]);
  assert(['RPG', 'Tactics', 'Smash'].every(mode => missionModes.has(mode)), `${universe} must expose RPG, Tactics, and Melee mission stages.`);
  const levelProfile = RECENT_UNIVERSE_LEVELS[universe];
  assert(levelProfile?.combat && levelProfile?.melee && levelProfile?.rpg && levelProfile?.tactics, `${universe} must expose complete Combat, Melee, RPG, and Tactics level profiles.`);
  assert(levelProfile.melee.separatePlatformTexture && levelProfile.tactics.gridAligned, `${universe} must use isolated melee platform textures and grid-aligned tactics tiles.`);
  if (pendingRecentTextureUniverses.has(universe)) return;
  const textureEntry = recentTextureSources.entries.find(candidate => candidate.universe === universe);
  assert(textureEntry?.available, `${universe} must expose an available OpenAI level texture atlas.`);
  assert(textureEntry.sourcePage && textureEntry.visualAnchor, `${universe} texture atlas must retain canon source provenance.`);
  const textureUrl = new URL(`../public/textures/recent-universes/${entry.key}-openai-atlas.webp`, import.meta.url);
  assert(existsSync(textureUrl) && statSync(textureUrl).size > 100000, `${universe} OpenAI level texture atlas is missing or unexpectedly small.`);
  const tacticsTextureEntry = recentTacticsTextureSources.entries.find(candidate => candidate.universe === universe);
  assert(tacticsTextureEntry?.available, `${universe} must expose an available three-quarter Tactics terrain.`);
  assert(tacticsTextureEntry.camera === 'elevated-three-quarter-rectangular-grid', `${universe} Tactics terrain must use the gameplay camera.`);
  const tacticsTextureUrl = new URL(`../public/textures/recent-universes/${entry.key}-openai-tactics-3q.webp`, import.meta.url);
  assert(existsSync(tacticsTextureUrl) && statSync(tacticsTextureUrl).size > 80000, `${universe} three-quarter Tactics terrain is missing or unexpectedly small.`);
});
assert(Object.keys(RECENT_UNIVERSE_LEVELS).length === REQUESTED_UNIVERSE_WAVE.length, 'Every recent universe must have exactly one cross-mode level profile.');
const generatedRecentTextureCount = REQUESTED_UNIVERSE_WAVE.length - pendingRecentTextureUniverses.size;
assert(recentTextureSources.counts.universes === generatedRecentTextureCount && recentTextureSources.counts.available === generatedRecentTextureCount, 'Every non-pending recent universe texture atlas must be generated and available.');
assert(recentTacticsTextureSources.counts.universes === generatedRecentTextureCount && recentTacticsTextureSources.counts.available === generatedRecentTextureCount, 'Every non-pending recent universe must expose a generated three-quarter Tactics terrain.');
assert(recentUniverseTextureAssetsSource.includes('MODE_QUADRANTS') && recentUniverseTextureAssetsSource.includes('drawRecentUniverseTextureCover'), 'Recent OpenAI texture atlases must expose deterministic per-mode crops.');
assert(recentUniverseLevelsSource.includes('platformTexture') && recentUniverseLevelsSource.includes('tileTexture'), 'Recent level profiles must expose separate melee platform and tactics tile textures.');
assert(smashEngineSource.includes('platformTextureCanvasCache') && smashEngineSource.includes('makeTextureCanvas'), 'Melee must render platform-local textures from real collision geometry.');
assert(smashEngineSource.includes('getRecentUniverseTexturePattern') && smashEngineSource.includes('dlcSuppressedArena'), 'Melee must use OpenAI platform textures without leaking disabled DLC assets.');
assert(tacticsEngineSource.includes('drawTileTexture') && tacticsBattlefieldsSource.includes('tileTheme'), 'Tactics must render texture details inside the real battlefield cells.');
assert(tacticsEngineSource.includes("drawRecentUniverseTextureCover(") && tacticsEngineSource.includes("'stretch'") && tacticsEngineSource.includes('dlcSuppressedArena'), 'Tactics must map one continuous three-quarter OpenAI terrain beneath the real grid without leaking disabled DLC assets.');
assert(rendererSource.includes("drawRecentUniverseTextureCover(ctx, universe, 'RPG'") && fighterEngineSource.includes("drawRecentUniverseTextureCover(ctx, this.universe, 'Combat'"), 'RPG and Combat must render their dedicated OpenAI floor quadrants.');
assert(fighterModeSource.includes("drawUniverseBackground(ctx, arenaUniverse") && fighterModeSource.includes("'Combat'"), 'Combat mode must select its level from the active roster universe.');
assert(gameCanvasSource.includes('handleBattleComplete, arenaStage);') && rpgEngineSource.includes('heroLanes'), 'RPG mode must align combatants with the active universe floor lanes.');

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

const numberedOcActs = OC_CAMPAIGN_ACTS.filter(act => act.number > 0);
assert(numberedOcActs.length === 5, 'The OC campaign must contain five complete numbered acts.');
assert(
  numberedOcActs.every((act, index) => act.number === index + 1 && act.missionIds.length > 0 && act.finaleMissionId),
  'Each OC act must have ordered playable missions and an explicit finale.'
);
assert(OC_CAMPAIGN_MISSIONS.length === 12, 'The complete five-act OC campaign must expose twelve playable operations.');
assert(
  OC_CAMPAIGN_MISSIONS.every((mission, index) => (
    mission.id === 8801 + index
    && mission.sequence === index + 1
    && OC_CAMPAIGN_CHAPTERS.some(chapter => chapter.id === mission.chapterId)
    && OC_CAMPAIGN_ACTS.some(act => act.id === mission.actId)
  )),
  'OC campaign IDs, sequence, chapters, and acts must form one coherent playable route.'
);
assert(
  ['RPG', 'Tactics', 'Smash'].every(mode => OC_CAMPAIGN_MISSIONS.some(mission => mission.mode === mode)),
  'The complete OC campaign must preserve RPG, Tactics, and Smash coverage.'
);
assert(
  hubSource.includes('OC_CAMPAIGN_MISSIONS.map') && !hubSource.includes('id: 8801,'),
  'HubScreen must derive the playable OC stage registry from the canonical mission list.'
);
const ocMissionIds = OC_CAMPAIGN_MISSIONS.map(mission => mission.id);
const completeOcProgress = getOcCampaignProgress(ocMissionIds, 'seal');
assert(
  completeOcProgress.complete && completeOcProgress.completedCount === OC_CAMPAIGN_MISSIONS.length,
  'Completing every OC operation and an ending must close the campaign.'
);
assert(
  OC_CAMPAIGN_MISSIONS.every(mission => (
    mission.displayName?.fr
    && mission.displayName?.en
    && mission.storyBeat?.intro?.fr
    && mission.storyBeat?.outro?.en
    && mission.rewardItemId
    && mission.rewardItemName?.fr
    && mission.enemyRosterExclusive === true
    && Array.isArray(mission.scenes)
    && mission.scenes.length >= 3
    && existsSync(new URL(`../public${mission.image}`, import.meta.url))
  )),
  'Every OC operation must be localized, rewarded, narratively staged, exclusive, and backed by existing key art.'
);
const nexusEnemySectionStart = enemiesSource.indexOf("'Nexus de Convergence':");
const nexusEnemySectionEnd = enemiesSource.indexOf("\n  'Gears of War':", nexusEnemySectionStart);
assert(
  nexusEnemySectionStart >= 0 && nexusEnemySectionEnd > nexusEnemySectionStart,
  'The Nexus enemy registry must remain a distinct base-game section.'
);
const nexusEnemySection = enemiesSource.slice(nexusEnemySectionStart, nexusEnemySectionEnd);
const nexusMonsterSectionEnd = nexusEnemySection.indexOf('bosses: [');
const nexusBossSectionEnd = nexusEnemySection.indexOf('worldBoss:');
assert(
  nexusMonsterSectionEnd > 0 && nexusBossSectionEnd > nexusMonsterSectionEnd,
  'The Nexus registry must preserve separate standard enemy and boss pools.'
);
const parseOcActEntries = section => [...section.matchAll(
  /id:\s*'(oc_act([1-5])_[^']+)'[\s\S]*?actId:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'/g
)].map(match => ({
  id: match[1],
  actNumber: Number(match[2]),
  actId: match[3],
  name: match[4]
}));
const ocActStandardEnemies = parseOcActEntries(nexusEnemySection.slice(0, nexusMonsterSectionEnd));
const ocActBosses = parseOcActEntries(nexusEnemySection.slice(nexusMonsterSectionEnd, nexusBossSectionEnd));
const ocActEnemyIds = [...ocActStandardEnemies, ...ocActBosses].map(enemy => enemy.id);
assert(ocActStandardEnemies.length === 10, 'The five OC acts must add exactly ten original standard enemies.');
assert(ocActBosses.length === 5, 'The five OC acts must add exactly five original bosses.');
assert(new Set(ocActEnemyIds).size === 15, 'Original OC act enemy IDs must be unique.');
numberedOcActs.forEach(act => {
  const actStandards = ocActStandardEnemies.filter(enemy => enemy.actId === act.id);
  const actBosses = ocActBosses.filter(enemy => enemy.actId === act.id);
  const actMissions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.actId === act.id);
  assert(
    actStandards.length === 2 && actStandards.every(enemy => enemy.actNumber === act.number),
    `OC act ${act.number} must own exactly two original standard enemies.`
  );
  assert(
    actBosses.length === 1 && actBosses[0].actNumber === act.number,
    `OC act ${act.number} must own exactly one original boss.`
  );
  actStandards.forEach(enemy => {
    assert(
      actMissions.some(mission => mission.enemyRoster?.includes(enemy.name)),
      `Original OC standard enemy ${enemy.id} must be wired to an act ${act.number} mission.`
    );
  });
  assert(
    actMissions.some(mission => mission.bossName === actBosses[0].name),
    `Original OC boss ${actBosses[0].id} must be wired to an act ${act.number} mission.`
  );
});
const ocRewardHeroMissions = OC_CAMPAIGN_MISSIONS.filter(mission => mission.rewardHeroId);
const ocRewardHeroIds = ocRewardHeroMissions.map(mission => mission.rewardHeroId);
assert(ocRewardHeroMissions.length === 5, 'The five numbered OC acts must expose five reward heroes.');
assert(new Set(ocRewardHeroIds).size === 5, 'OC campaign reward hero IDs must be unique.');
numberedOcActs.forEach(act => {
  assert(
    ocRewardHeroMissions.filter(mission => mission.actId === act.id).length === 1,
    `OC act ${act.number} must grant exactly one reward hero.`
  );
});
ocRewardHeroMissions.forEach(mission => {
  assert(
    heroesSource.includes(`id: '${mission.rewardHeroId}'`)
    && heroesSource.includes(`name: '${mission.rewardHeroName?.fr}'`),
    `OC reward hero ${mission.rewardHeroId} must resolve in the playable hero registry.`
  );
  assert(
    characterPlaquesSource.includes(`  ${mission.rewardHeroId}: {`),
    `OC reward hero ${mission.rewardHeroId} must own an explicit character plaque.`
  );
});
const nexusMonsterNames = [...new Set(OC_CAMPAIGN_MISSIONS.flatMap(mission => mission.enemyRoster || []))];
const nexusWorldBossName = 'Moteur de Convergence Instable';
const nexusBossNames = [...new Set(
  OC_CAMPAIGN_MISSIONS
    .map(mission => mission.bossName)
    .filter(name => name && name !== nexusWorldBossName)
)];
const nexusEnemies = {
  monsters: nexusMonsterNames.map(name => ({ name, hp: 80, atk: 10, def: 5, spd: 8 })),
  bosses: nexusBossNames.map(name => ({ name, hp: 420, atk: 18, def: 10, spd: 5 })),
  worldBoss: { name: nexusWorldBossName, hp: 1150, atk: 27, def: 14, spd: 3 }
};
OC_CAMPAIGN_MISSIONS.forEach(mission => {
  assert(enemiesSource.includes(mission.bossName), `Nexus enemy data must contain OC boss ${mission.bossName}.`);
  const resolved = resolveStageEnemyData({
    stage: mission,
    monsters: nexusEnemies.monsters,
    bosses: nexusEnemies.bosses,
    worldBoss: nexusEnemies.worldBoss
  });
  const resolvedBoss = resolved.worldBoss || resolved.bosses[0];
  assert(resolvedBoss?.name === mission.bossName, `OC mission ${mission.id} must play its announced boss ${mission.bossName}.`);
});
assert(
  OC_CAMPAIGN_MISSIONS.at(-1)?.id === OC_FINAL_MISSION_ID
  && OC_CAMPAIGN_MISSIONS.at(-1)?.campaignFinale === true,
  'The final OC operation must be the explicit campaign finale.'
);
assert(
  OC_CAMPAIGN_ENDINGS.length === 4
  && ['seal', 'converge', 'break', 'surrender'].every(id => OC_CAMPAIGN_ENDINGS.some(ending => ending.id === id)),
  'Act V must conclude with all four canonical endings.'
);

assert(enemiesSource.includes("'Nexus de Convergence'"), 'Base OC enemy table is missing.');
assert(enemiesSource.includes('Pelerin de la Fausse Sortie') && enemiesSource.includes('Cartographe des Portes Mortes'), 'Chapter IV OC threats must remain connected to the Nexus enemy roster.');
expectedOcProceduralThreats.forEach(name => {
  assert(enemiesSource.includes(name), `Missing playable OC threat ${name}.`);
});
assert(enemiesSource.includes('origin_forge_double') && enemiesSource.includes('spriteFilter') && rendererSource.includes('origin_forge_matrix'), 'Origin Foundry threats must keep distinct animated derived/procedural visuals.');
const originFoundryMission = OC_CAMPAIGN_MISSIONS.find(mission => mission.id === 8803);
const actOneOriginalStandards = ocActStandardEnemies.filter(enemy => enemy.actId === 'arrivals');
assert(
  originFoundryMission?.enemyRoster?.includes('Matrice de Substitution')
  && actOneOriginalStandards.every(enemy => originFoundryMission.enemyRoster.includes(enemy.name)),
  'The Origin Foundry climax must prioritize its two Act I threats and the substitution matrix.'
);
expectedOcOriginLocks.forEach(lockId => {
  assert(ocCampaignSource.includes(`originLockId: '${lockId}'`), `Missing OC Origin Lock ${lockId}.`);
});
assert(ocCampaignSource.includes('export const OC_ORIGIN_LOCKS') && hubSource.includes('oc-origin-locks-track'), 'The six Origin Locks must remain centralized and visible in the OC chronicle.');
assert(OC_ORIGIN_LOCKS.length === expectedOcOriginLocks.length, 'The complete campaign must preserve the six Origin Locks.');
assert((ocCampaignSource.match(/enemyRosterExclusive: true/g) || []).length === OC_CAMPAIGN_MISSIONS.length, 'Every OC operation must keep an exclusive lore roster.');
assert(gameCanvasSource.includes('resolveStageEnemyData'), 'GameCanvas must enforce exact mission rosters and canonical bosses.');
assert(spriteChecklistSource.includes('[ ] Double ideal de Marrow'), 'Deferred Marrow double generation must remain visible in the conversion checklist.');
assert(spriteChecklistSource.includes('[x] Matrice de Substitution'), 'The completed Matrice de Substitution sheet must remain visible in the conversion checklist.');
assert(manifestOutputs.has('/sprites/generated/bosses/nexus-de-convergence/matrice-de-substitution.png'), 'Missing Matrice de Substitution OpenAI sprite.');
[
  '/sprites/generated/heroes/tomba/tomba-hero.png',
  '/sprites/generated/heroes/tomba/charles-tomba.png',
  '/sprites/generated/heroes/tomba/tabby-tomba.png',
  '/sprites/generated/bosses/tomba/koma-pig-patrol.png',
  '/sprites/generated/bosses/tomba/biting-plant-cluster.png',
  '/sprites/generated/bosses/tomba/needlegator-ravine-pack.png',
  '/sprites/generated/bosses/tomba/fire-evil-pig.png',
  '/sprites/generated/bosses/tomba/stormy-evil-pig.png',
  '/sprites/generated/bosses/tomba/real-evil-pig.png'
].forEach(output => {
  assert(manifestOutputs.has(output), `Missing Tomba OpenAI sprite ${output}.`);
});
assert(spriteChecklistSource.includes('[x] Trois plaquettes heros OpenAI: Tomba, Charles et Tabby'), 'The completed Tomba hero batch must remain visible in the conversion checklist.');
assert(spriteChecklistSource.includes('[x] Six plaquettes ennemis / boss OpenAI: Koma Pig, Biting Plant, Needlegator, Fire Evil Pig, Stormy Evil Pig et Real Evil Pig'), 'The completed Tomba threat batch must remain visible in the conversion checklist.');
expectedSupplementalOpenAiSpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing supplemental OpenAI sprite ${output}.`);
});
assert(spriteChecklistSource.includes('63 nouvelles plaquettes 4 colonnes x 4 lignes'), 'The supplemental OpenAI sprite batch must remain documented in the conversion checklist.');
assert(spriteChecklistSource.includes('[ ] The Grim Knight: generation OpenAI bloquee'), 'The deferred Grim Knight sprite must remain explicit instead of receiving a false substitute.');
expectedChuckySpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing Chucky OpenAI sprite ${output}.`);
  assert(spriteReferenceSource.includes(output), `Missing Chucky reference trace for ${output}.`);
});
expectedChuckyExpansionRoster.forEach(name => {
  assert(loreAccuratePacksSource.includes(name), `Missing Chucky incarnation ${name}.`);
});
assert(enemiesSource.includes("spriteSource: '/sprites/generated/heroes/chucky/chucky.png'") && enemiesSource.includes("spriteSource: '/sprites/generated/heroes/chucky/tiffany.png'"), 'Chucky and Tiffany doll bosses must use their dedicated OpenAI sheets.');
assert(rendererSource.includes("Chucky: '/backgrounds/chucky-play-pals-breach-openai-v2.png'"), 'Chucky stages must use the dedicated Play Pals Breach background.');
assert(spriteChecklistSource.includes('[x] Vingt-six nouvelles plaquettes Chucky') && spriteChecklistSource.includes('[x] Les trois equivalents en corps de poupee Tiffany') && spriteChecklistSource.includes('Tiffany humaine et Tiffany poupee en maillot deux pieces Adult AU') && spriteChecklistSource.includes('Buddi Chucky du remake 2019'), 'The completed Chucky expansion must remain visible in the conversion checklist.');
expectedStargateSpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing Stargate OpenAI sprite ${output}.`);
  assert(spriteReferenceSource.includes(output), `Missing Stargate reference trace for ${output}.`);
});
expectedStygianInquisitionSpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing Stygian Inquisition OpenAI sprite ${output}.`);
  assert(spriteReferenceSource.includes(output), `Missing Stygian Inquisition reference trace for ${output}.`);
});
[
  'The Auditor (Judgment)',
  'The Assessor (Judgment)',
  'The Jury (Judgment)',
  'The Cleaners (Judgment)',
  'The Butcher (Judgment)',
  'The Surgeon (Judgment)'
].forEach(name => {
  assert(loreAccuratePacksSource.includes(name), `Missing Stygian Inquisition entity ${name}.`);
  assert(featuredUniverseSource.includes(name), `Missing Stygian Inquisition lore entry ${name}.`);
});
assert(manifestOutputs.has('/sprites/generated/bosses/hellraiser/surgeon-cenobite.png'), 'The Hellseeker Surgeon Cenobite sprite must remain available.');
assert(spriteChecklistSource.includes('Le Surgeon de Judgment reste distinct du Surgeon Cenobite'), 'The two Surgeon incarnations must remain explicitly separated in the checklist.');
assert(loreAccuratePacksSource.includes("hero('bratac', 'Master Bra\\'tac'") && characterPlaquesSource.includes('bratac:'), 'Master Bra tac must remain playable and documented.');
assert(enemiesSource.includes("name: 'Anubis Jackal Guard (1994)'") && enemiesSource.includes("weapon: 'kull_blaster'"), 'The 1994 Jackal Guard and Anubis Kull Warrior must remain separate canon entities.');
assert(spriteChecklistSource.includes('Validation technique: 5 plaquettes transparentes, 16/16 cellules non vides'), 'The completed Stargate batch must remain documented in the conversion checklist.');
expectedDandadanSpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing Dandadan OpenAI sprite ${output}.`);
  assert(spriteReferenceSource.includes(output), `Missing Dandadan reference trace for ${output}.`);
});
assert(loreAccuratePacksSource.includes("hero('jiji_dandadan', 'Jiji'") && loreAccuratePacksSource.includes("hero('seiko_dandadan', 'Seiko Ayase'") && loreAccuratePacksSource.includes("hero('turbo_granny_cat', 'Turbo Granny - Maneki-neko'"), 'Jiji, Seiko, and Turbo Granny cat must remain playable Dandadan signatures.');
assert(loreAccuratePacksSource.includes('momo_ayase: loadout') && loreAccuratePacksSource.includes('oken_dandadan: loadout') && loreAccuratePacksSource.includes('aira_dandadan: loadout'), 'The three original Dandadan signatures must keep their lore-specific loadouts.');
assert(spriteChecklistSource.includes('Validation technique: 6 plaquettes transparentes, 16/16 cellules non vides'), 'The completed Dandadan character batch must remain documented in the conversion checklist.');
expectedFrenchComedySpriteOutputs.forEach(output => {
  assert(manifestOutputs.has(output), `Missing French comedy OpenAI sprite ${output}.`);
  assert(spriteReferenceSource.includes(output), `Missing French comedy reference trace for ${output}.`);
});
assert(expandedUniversesSource.includes("hero: ['inconnus_trio', 'Pascal Legitimus'") && expandedUniversesSource.includes("['bernard_inconnus', 'Bernard Campan'") && expandedUniversesSource.includes("['didier_inconnus', 'Didier Bourdon'"), 'Les Inconnus must expose the three named comedians without replacing their save-compatible IDs.');
assert(expandedUniversesSource.includes("hero: ['pierre_rrr', 'Pierre - Chef des Cheveux Propres'") && expandedUniversesSource.includes("['chef_cheveux_sales', 'Tonton - Chef des Cheveux Sales'"), 'RRRrrrr!!! must keep its exact clean-hair and dirty-hair identities.');
assert(loreAccuratePacksSource.includes('inconnus_trio: loadout') && loreAccuratePacksSource.includes('pierre_rrr: loadout') && loreAccuratePacksSource.includes('odile_deray: loadout'), 'The French comedy signatures must keep their lore-specific loadouts.');
assert(spriteChecklistSource.includes('[x] Les Inconnus - trio principal OpenAI') && spriteChecklistSource.includes('[x] RRRrrrr!!! - trio principal OpenAI') && spriteChecklistSource.includes('[x] La Cite de la Peur - trio principal OpenAI'), 'The three completed French comedy batches must remain documented in the conversion checklist.');
expectedFeaturedUniverses.forEach(universe => {
  const universeEntries = (manifest.entries || []).filter(entry => entry.universe === universe);
  const visualEntries = (featuredVisualManifest.entries || []).filter(entry => entry.universe === universe);
  const count = kind => universeEntries.filter(entry => entry.kind === kind).length;
  assert(featuredUniverseSource.includes(`universe: '${universe}'`), `Missing featured universe pack ${universe}.`);
  assert(count('hero') >= 3, `${universe} must expose at least three playable characters.`);
  assert(count('enemy') >= 3, `${universe} must expose at least three canon threats.`);
  assert(count('boss') >= 3, `${universe} must expose two bosses and one world boss.`);
  const expectedItemCount = universe === 'Hellraiser' ? 8 : 5;
  assert(count('item') >= expectedItemCount, `${universe} must expose its complete gear, event, and summon visual set.`);
  assert(visualEntries.filter(entry => entry.kind === 'universe-icon').length === 1, `${universe} must expose one dedicated universe icon route.`);
  assert(visualEntries.filter(entry => entry.kind === 'stage-backdrop').length === 3, `${universe} must expose dedicated RPG, Tactics, and Smash backdrop routes.`);
});
assert(featuredVisualManifest.counts.icons === 6 && featuredVisualManifest.counts.backdrops === 18 && featuredVisualManifest.counts.total === 24, 'Featured visual manifest must track six icons and eighteen mode backdrops.');
assert(featuredVisualPrompts.length === featuredVisualManifest.counts.missing, 'Featured OpenAI prompt queue must contain only missing visual assets.');
assert(new Set(featuredVisualPrompts.map(entry => entry.output)).size === featuredVisualPrompts.length, 'Featured OpenAI visual prompts must not duplicate output paths.');
assert((featuredVisualManifest.entries || []).some(entry => entry.output === '/backgrounds/hellraiser-rpg-openai.png' && entry.available), 'Existing Hellraiser RPG OpenAI backdrop must remain available.');
assert(featuredUniverseSource.includes('FEATURED_UNIVERSE_NARRATIVE_ARCS') && narrativeSystemsSource.includes('FEATURED_UNIVERSE_NARRATIVE_ARCS'), 'Featured universe arcs must remain connected to narrative systems.');
assert(featuredUniverseSource.includes('FEATURED_CHARACTER_PLAQUES') && characterPlaquesSource.includes('FEATURED_CHARACTER_PLAQUES'), 'Featured character origin and Breach dossiers must remain connected.');
assert(featuredUniverseSource.includes('FEATURED_STAGE_LORE') && loreDescriptionsSource.includes('FEATURED_STAGE_LORE'), 'Featured RPG, Tactics, and Smash stages must keep their specific lore descriptions.');
assert(featuredUniverseSource.includes('FEATURED_GEAR_LORE') && featuredUniverseSource.includes('FEATURED_ENEMY_LORE'), 'Featured items and threats must keep their canon-specific lore maps.');
assert(featuredUniverseSource.includes('FEATURED_UNIVERSE_ICONS') && featuredUniverseSource.includes('FEATURED_BACKDROPS'), 'Featured universes must keep dedicated icon and stage backdrop routes.');
assert(expandedUniversesSource.includes('FEATURED_UNIVERSE_PACKS') && expandedUniversesSource.includes('FEATURED_STAGE_LORE'), 'Featured content packs must remain injected into expanded universes.');
assert(!loreAccuratePacksSource.includes("id: 'pinhead_cenobite'") && !loreAccuratePacksSource.includes("id: 'chatterer_cenobite'"), 'Hellraiser must not reintroduce duplicate Pinhead or Chatterer hero ids.');
assert(!featuredUniverseSource.includes("hero('toshio_saeki'"), 'Toshio must remain a Grudge threat instead of a playable hero.');
assert(hubSource.includes('ARC_UNLOCK_RULES.personalMinLevel'), 'Narrative arc level gates must stay wired.');
assert(hubSource.includes('getUniverseArcRosterStatus'), 'Universe arc roster gates must stay wired.');
assert(hubSource.includes('getTrioArcRosterStatus'), 'Trio arc roster gates must stay wired.');
assert(hubSource.includes('isCurrentStoryChapterStage'), 'Story mode must filter portals by the active chapter.');
assert(hubSource.includes('storyChapterStages'), 'Story mode count must be based on the active chapter pool.');
assert(
  hubSource.includes('isOcStoryStage')
  && hubSource.includes('getOcMissionForStage')
  && hubSource.includes('getOcCampaignMission(stage?.id)'),
  'Main story must be restricted to canonical OC campaign stages.'
);
assert(hubSource.includes('completedOcStoryClears'), 'Story chapter progression must count only completed OC story stages.');
assert(storySource.includes("worlds remain side archives") || storySource.includes('DLC remain side archives') || storySource.includes('Side universes may now join the Nexus'), 'Story copy must describe licensed universes as side archives, not campaign requirements.');
assert(hubSource.includes('finalGameBoss: true') && hubSource.includes('dlcStage: true'), 'Meta final boss must be flagged as DLC/meta content outside the OC story.');
assert(hubSource.includes('insertBeforeMetaStage'), 'Stage injection must keep OC/DLC arcs before the meta final boss.');
assert(hubSource.includes('stage.finalGameBoss') && !hubSource.includes('stage.id === 38') && !hubSource.includes('id !== 38'), 'Hub logic must use finalGameBoss metadata instead of hard-coded stage id 38.');
assert(
  storySource.includes('storyBeat')
  && hubSource.includes('storyBeatLabel')
  && hubSource.includes('Nexus OC scene'),
  'OC campaign stages must expose narrative intro/outro beats.'
);
assert(ocCampaignSource.includes('OC_CAMPAIGN_MISSIONS') && ocCampaignSource.includes('OC_CAMPAIGN_CHAPTERS'), 'OC campaign canon must stay centralized in its dedicated narrative module.');
assert(hubSource.includes('<OcCampaignChronicle'), 'Story mode must expose the dedicated OC campaign chronicle.');
assert(hubSource.includes("label: { fr: 'Campagne OC'"), 'Story tab must be labelled as an OC campaign.');
assert(hubSource.includes('Separation histoire') && hubSource.includes('visibleDlcStages'), 'Admin diagnostics must separate OC story stages from active DLC stages.');
assert(gameCanvasSource.includes('stage.finalGameBoss') && !gameCanvasSource.includes('stage.id === 38'), 'GameCanvas must route final combat through finalGameBoss metadata.');
assert(appSource.includes('activeStage.finalGameBoss') && !appSource.includes('activeStage.id === 38'), 'App rewards must route final bonuses through finalGameBoss metadata.');
assert(tacticsBattlefieldsSource.includes('stage.finalGameBoss'), 'Tactics battlefields must recognize metadata-based final boss arenas.');
assert(hubSource.includes('completedStages={completedStages}'), 'Portal screen must receive progression to hide future chapter banners.');
assert(hubSource.includes("{ id: 'race'") && hubSource.includes('<RaceMode'), 'Hub must expose the playable Race/Kart tab.');
assert(hubSource.includes("{ id: 'fighter'") && hubSource.includes('<FighterMode'), 'Hub must expose the standalone A.R.C.A. Fighter tab.');
assert(hubSource.includes("isUniverseVisible(hero.universe) && !isAssetDisabled('heroes', hero.id)"), 'Fighter roster must respect admin universe and hero visibility.');
assert(fighterModeSource.includes('new EngineFighter') && fighterModeSource.includes('fighter-touch-controls'), 'Fighter screen must instantiate its engine and expose responsive controls.');
assert(fighterModeSource.includes("triggerPlayerAction('tag'") && fighterModeSource.includes("['1', '2', '3']"), 'Fighter screen must expose manual three-slot tag controls.');
assert(fighterEngineSource.includes('fighters: playerHeroes.slice(0, 3)') && fighterEngineSource.includes('activeIndex: 0'), 'Fighter engine must keep one active combatant in a three-signature cell.');
assert(fighterEngineSource.includes('requestTag(side, index, forced = false)') && fighterEngineSource.includes("this.requestTag(side, next.index, true)"), 'Fighter engine must support manual and forced K.O. replacements.');
assert(fighterEngineSource.includes('guardBreak') && fighterEngineSource.includes('comboWindow') && fighterEngineSource.includes('meterCost: 100'), 'Fighter engine must retain guard break, combos, and rupture meter rules.');
assert(fighterEngineSource.includes('spawnProjectile') && fighterEngineSource.includes('crouching') && fighterEngineSource.includes('targetHalfHeight'), 'Fighter engine must retain ranged attacks and crouch evasion.');
assert(hubSource.includes('recordFighterMatch') && hubSource.includes('fighterCareer'), 'Fighter results must feed long-term progression and career records.');
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
assert(spriteAssetsSource.includes('arca-bastion-universal-v1.png') && spriteAssetsSource.includes('BASTION_COMPLETE_SPRITE_PACK'), 'Bastion must keep his complete universal OC sprite pack routing.');
assert(spriteAssetsSource.includes('arca-nova-universal-v1.png') && spriteAssetsSource.includes('NOVA_COMPLETE_SPRITE_PACK'), 'Nova must keep her complete universal OC sprite pack routing.');
assert(spriteAssetsSource.includes('arca-marrow-universal-v1.png') && spriteAssetsSource.includes('MARROW_COMPLETE_SPRITE_PACK'), 'Marrow must keep his complete universal OC sprite pack routing.');
assert(spriteAssetsSource.includes('SABLE_COMPLETE_SPRITE_PACK') && spriteAssetsSource.includes('LOOM_COMPLETE_SPRITE_PACK'), 'Sable and Loom must expose their OpenAI sheets as complete universal packs.');
assert(characterPlaquesSource.includes('arca_nova') && characterPlaquesSource.includes('Observatoire Veyr'), 'Nova must keep her detailed OC origin and Breach dossier.');
assert(characterPlaquesSource.includes('arca_marrow') && characterPlaquesSource.includes('Chasseur de sceaux'), 'Marrow must keep his detailed OC origin and Breach dossier.');
assert(characterPlaquesSource.includes('arca_sable') && characterPlaquesSource.includes('Cartographe des routes assumees'), 'Sable must keep her detailed OC origin and Breach dossier.');
assert(characterPlaquesSource.includes('arca_loom') && characterPlaquesSource.includes('Tisseuse de lignes de vie'), 'Loom must keep her detailed OC origin and Breach dossier.');
assert(rpgEngineSource.includes("drawPixelSprite(ctx, h.x, h.y, h, animTime, h.facing") && rpgEngineSource.includes("drawPixelEnemy(ctx, e.x, e.y, e, animTime, e.facing"), 'RPG rendering must respect live unit orientation.');
assert(tacticsEngineSource.includes("drawPixelSprite(ctx, unit.x, unit.y, unit, animTime, unit.facing") && tacticsEngineSource.includes("drawPixelEnemy(ctx, unit.x, unit.y, unit, animTime, unit.facing"), 'Tactics rendering must respect live unit orientation.');
assert(rendererSource.includes('drawBoss = (ctx, x, y, boss, animTime, facing = -1)') && rendererSource.includes('ctx.scale(facing, 1)'), 'Boss rendering must accept live orientation instead of forcing left.');
assert(hubSource.includes('const previousNpcX = npc.x') && hubSource.includes('const horizontalTravel = npc.x - previousNpcX'), 'Mosaic City NPC facing must follow actual horizontal travel.');
const dedicatedOcChapterKeyArts = [
  '/images/campaign-oc/chapter-04-broken-portal-yard-v1.png',
  '/images/campaign-oc/chapter-05-white-threshold-v1.png',
  '/images/campaign-oc/chapter-06-route-x-v1.png',
  '/images/campaign-oc/chapter-07-veyr-observatory-v1.png',
  '/images/campaign-oc/chapter-08-primordial-breach-v1.png'
];
dedicatedOcChapterKeyArts.forEach(assetRoute => {
  assert(
    ocCampaignSource.includes(assetRoute)
    && existsSync(new URL(`../public${assetRoute}`, import.meta.url)),
    `Dedicated OC chapter key art must exist and remain wired: ${assetRoute}.`
  );
});
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
assert(raceEngineSource.includes('getProjectedTrackSegments') && raceEngineSource.includes('normalizeTrackObjects') && raceEngineSource.includes('closestPointOnPath'), 'Race rear camera, physics, and objects must be anchored to the same track geometry.');
assert(raceEngineSource.includes('getRearRoadVisualWidth') && raceEngineSource.includes('cameraWidthBoost') && raceEngineSource.includes('kartW = 218'), 'Race rear camera must keep a real track scale where the kart is smaller than the road.');
assert(raceEngineSource.includes('roadWidth * 0.9') && raceEngineSource.includes('Math.max(this.track.offroadDrag, 0.965)'), 'Race driving must keep forgiving kart-road physics instead of killing speed on small visual/track offsets.');
assert(raceModeSource.includes('race-track-selector') && raceModeSource.includes('setTrackId') && raceModeSource.includes('trackList.map'), 'Race tab must let the player switch between available kart tracks.');
assert(raceModeSource.includes('keyPulseRef') && raceModeSource.includes('pulseVirtualKey'), 'Race controls must keep short keyboard and touch inputs alive long enough for the engine loop.');
assert(raceModeSource.includes('autoAccelerateRef') && raceModeSource.includes('recoverPlayer') && raceModeSource.includes('data-track-factor'), 'Race controls must provide assisted acceleration, manual recovery, and visible track-lock telemetry.');
assert(raceEngineSource.includes('lapArmed') && raceEngineSource.includes('previousRouteProgress') && raceEngineSource.includes('previousProgress - routeProgress > 0.28'), 'Race laps must use ordered route gates so figure-eight and portal tracks cannot become impossible to finish.');
assert(raceEngineSource.includes('getTrackPointAhead(road, lookAhead)') && raceEngineSource.includes('assistStrength'), 'Race steering must use a forward route target for player stability and AI navigation.');
assert(raceEngineSource.includes('startBoostWindow') && raceEngineSource.includes('driftCharge') && raceEngineSource.includes('Mini-turbo violet'), 'Race mode must include start boost and charged mini-turbo handling.');
assert(raceEngineSource.includes("zone.type === 'jump'") && raceEngineSource.includes("zone.type === 'portal'") && raceEngineSource.includes("zone.type === 'slow'"), 'Race mode must include jump, portal, and slow interactive surfaces.');
assert(raceEngineSource.includes('drawProjectedSurfaceZone') && raceEngineSource.includes('TRICK BOOST') && raceEngineSource.includes('CHARGE MINI-TURBO'), 'Race mode must render readable surface and driving feedback.');
assert(raceEngineSource.includes('useKartItem') && raceEngineSource.includes('shouldAiUseItem') && raceEngineSource.includes('findMirrorSwapTarget'), 'Race mode must support shared player/AI item usage and advanced A.R.C.A. cache effects.');
assert(raceEngineSource.includes("'anchor'") && raceEngineSource.includes("'mirror'") && raceEngineSource.includes("'pulse'"), 'Race item pool must include anchor, mirror, and pulse cache types.');
assert(raceEngineSource.includes('updateObjectiveState') && raceEngineSource.includes('getObjectiveStatus') && raceModeSource.includes('race-objective-card'), 'Race mode must expose active objectives in engine and UI.');
assert(raceEngineSource.includes('KART_GARAGE_UPGRADES') && raceEngineSource.includes('computeGarageStats') && raceEngineSource.includes('garageParts'), 'Race mode must expose garage upgrades and race rewards.');
assert(raceEngineSource.includes('buildTrackFragments') && raceEngineSource.includes('fragmentPickups') && raceEngineSource.includes('collectTrackFragments'), 'Race tracks must expose collectible fragments anchored to real track geometry.');
assert(raceEngineSource.includes('applySlipstream') && raceEngineSource.includes('ASPIRATION ACTIVE'), 'Race mode must include rear-camera slipstream feedback behind rivals.');
assert(raceModeSource.includes('multiverse-breach-kart-career') && raceModeSource.includes('buyUpgrade') && raceModeSource.includes('race-career-card'), 'Race tab must persist kart career and expose upgrade purchases.');
assert(raceModeSource.includes('bestTimes') && raceModeSource.includes('completedObjectives') && raceModeSource.includes('race-upgrade-list'), 'Race career must track records, objective clears, and garage upgrade UI.');
assert(rendererSource.includes('drawMirelleItemVfx') && rendererSource.includes('MIRELLE_COMPLETE_SPRITES.itemsVfx'), 'Combat renderer must use Mirelle item/VFX sheet during gameplay states.');
assert(gameCanvasSource.includes('heroSpriteContext'), 'GameCanvas must preload mode-specific hero sprites.');
assert(hubSource.includes("drawPixelSprite(ctx, 150, 182, selectedHero, 0, 1, 178, 'nexus')"), 'Roster must render Mirelle with Nexus/collection sheet.');
assert(hubSource.includes("drawPixelSprite(ctx, x, y + 24") && hubSource.includes('false, hero)'), 'Mosaic City Nexus NPCs must render real hero sprites instead of color fallback blocks.');
assert(hubSource.includes("drawPixelSprite(ctx, 56, 98, hero, 0, 1, 88, 'hud')") && hubSource.includes("drawPixelSprite(ctx, 38, 70, hero, 0, 1, 62, 'hud')"), 'Resonance hero icons must use cropped HUD avatars.');
assert(hubSource.includes('fpsHandsRef') && hubSource.includes('MIRELLE_COMPLETE_SPRITES.fpsHands'), 'FPS mode must use Mirelle FPS hands and effects sheets.');
assert(
  hubSource.includes("kind: completePack ? 'pack' : 'hero'") &&
  regulationImagePreviewSource.includes('preview.sheets'),
  'Admin sprite preview must render complete hero sprite packs.'
);
assert(hubSource.includes('getUniverseArchiveDiagnostic') && hubSource.includes('blockedCollectionUniverses') && hubSource.includes('Trames en reserve ou verrouillees'), 'A.R.C.A. Regulation must expose diagnostic reasons for hidden or locked universes.');
assert(hubSource.includes('incompleteCollectionUniverses') && hubSource.includes('Trames a completer'), 'A.R.C.A. Regulation must flag visible universes with missing active heroes, threats, or stages.');
assert(hubSource.includes("id: 'anchorProfile'") && hubSource.includes("activeTab === 'anchorProfile'"), 'Player identity and friend-code tools must live in a dedicated Anchor record instead of team management.');
assert(hubSource.includes('spriteReadyCount') && hubSource.includes('IA {row.spriteReadyCount}/{row.spriteTotalCount}'), 'Admin universe rows must summarize OpenAI sprite coverage per universe.');
[
  'Serj Tankian',
  'Daron Malakian',
  'Shavo Odadjian',
  'John Dolmayan'
].forEach(name => {
  assert(JSON.stringify(manifest).includes(name), `System of a Down manifest missing canon member ${name}.`);
});
[
  'SOAD Frontline Voice',
  'Staccato Guitarist',
  'Groove Bassist'
].forEach(name => {
  assert(!JSON.stringify(manifest).includes(name), `System of a Down manifest still references generic prompt ${name}.`);
});
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
assert(Object.keys(STAGE_LORE_PROFILES).length >= 260, 'Every expanded universe must have a canonical stage lore profile.');
assert(generatedStageLoreProfiles.length === 295, 'Generated stage lore registry must preserve 265 universe profiles and 30 arc profiles.');
assert(originalOcStageLoreProfiles.length === 3, 'Stage lore registry must preserve exactly three original OC DLC profiles.');
assert(stageLoreProfiles.filter(profile => profile.generationBlocked).length === 0, 'Resolved stage sources must not remain generation-blocked.');
assert(
  manifest.counts?.stages === (generatedStageLoreProfiles.length + originalOcStageLoreProfiles.length) * 4,
  'OpenAI manifest must expose all four stage views for every generated and original OC lore profile.',
);
assert(
  generatedStageAssets.counts?.backdrops === manifest.availableCounts?.stages,
  'Generated stage runtime registry must match the available stage backdrop count in the OpenAI manifest.',
);
assert(manifest.counts?.finales === worldBossPolicyUniverses.size, 'OpenAI manifest must expose every non-combat or set-piece finale kit.');
const manifestItemEntries = (manifest.entries || []).filter(entry => entry.kind === 'item');
assert(
  manifest.counts?.items === manifestItemEntries.length
  && new Set(manifestItemEntries.map(entry => entry.output)).size === manifestItemEntries.length
  && manifestItemEntries.length >= 661,
  'OpenAI manifest must expose a unique item prompt for every complete lore item contract without regressing the established catalog.',
);
worldBossPolicyUniverses.forEach(universe => {
  assert(!worldBossUniverses.has(universe), `${universe} cannot be both a combat world boss and a finale policy.`);
});
assert(worldBossUniverses.has('Ecco the Dolphin'), 'Ecco the Dolphin must resolve to the canonical Vortex Queen world boss.');
assert(gameCanvasSource.includes('drawItemIcon'), 'Collectible lore items must render their OpenAI icon on the battlefield.');
assert(spriteAssetsSource.includes('if (item.icon) return item.icon'), 'Collectible lore items must prefer their curated icon path over a generated fallback ID.');
assert(rendererSource.includes('getGeneratedStageBackdropSrc'), 'Renderer must prefer generated canonical stage backdrops when available.');
assert(smashEngineSource.includes('getGeneratedStageTexturePattern') && smashEngineSource.includes("'platforms'"), 'Melee platforms must consume their generated standalone texture atlas.');
assert(tacticsEngineSource.includes('drawGeneratedStageTextureCover') && tacticsEngineSource.includes("'tiles'"), 'Tactics maps must consume their generated battlefield and tile atlas.');
assert(
  battleItemsSource.includes('const loreItems = EQUIP_ITEMS_DB.filter') &&
  battleItemsSource.includes('name: loreItem?.name || { fr, en }') &&
  battleItemsSource.includes('sourceItemId: loreItem.id'),
  'Featured battle item overrides must inherit the canonical lore item names and OpenAI icon metadata.',
);

console.log(JSON.stringify({
  baseUniverse: 'Nexus de Convergence',
  ocHeroes: expectedOcHeroIds.length,
  ocThreatSprites: expectedOcEnemyNames.length,
  ocProceduralThreats: expectedOcProceduralThreats.length,
  ocOriginLocks: expectedOcOriginLocks.length,
  ocCampaignActs: numberedOcActs.length,
  ocCampaignMissions: OC_CAMPAIGN_MISSIONS.length,
  ocCampaignEndings: OC_CAMPAIGN_ENDINGS.length,
  ocCampaignRewardHeroes: ocRewardHeroIds.length,
  ocActStandardEnemies: ocActStandardEnemies.length,
  ocActBosses: ocActBosses.length,
  ocDeferredSprites: expectedOcDeferredSprites.length,
  ocItemSprites: expectedOcItemIds.length,
  chuckyOpenAiSprites: expectedChuckySpriteOutputs.length,
  chuckyExpansionIncarnations: expectedChuckyExpansionRoster.length,
  chuckyDeferredSprites: 0,
  chuckyUniverseBackground: 'play-pals-breach-openai-v2',
  stargateOpenAiSprites: expectedStargateSpriteOutputs.length,
  stygianInquisitionOpenAiSprites: expectedStygianInquisitionSpriteOutputs.length,
  dandadanOpenAiSprites: expectedDandadanSpriteOutputs.length,
  frenchComedyOpenAiSprites: expectedFrenchComedySpriteOutputs.length,
  featuredUniverses: expectedFeaturedUniverses.length,
  supplementalOpenAiSprites: expectedSupplementalOpenAiSpriteOutputs.length,
  featuredVisuals: featuredVisualManifest.counts,
  recentUniverseLevelProfiles: Object.keys(RECENT_UNIVERSE_LEVELS).length,
  recentUniverseLevelModes: ['Combat', 'Melee', 'RPG', 'Tactics'],
  recentUniverseOpenAiTextureAtlases: recentTextureSources.counts.available,
  recentUniverseTacticsPerspectiveTextures: recentTacticsTextureSources.counts.available,
  requiredBaseModes: ['RPG', 'Tactics', 'Smash'],
  dlcDefault: 'hidden',
  storyChapterPortals: 'active-chapter-only',
  factionArcCompletion: 'expanded',
  fighterMode: 'playable-hub-tab',
  fighterGameplay: ['flat-arena', 'one-active-fighter', 'three-slot-tag', 'guard-break', 'combos', 'specials', 'projectiles', 'crouch', 'ai-difficulties'],
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
  tacticsRewardLoop: 'grade-bonus',
  stageLoreProfiles: stageLoreProfiles.length,
  stageLoreViews: manifest.counts.stages,
  worldBossLoreOverrides: worldBossUniverses.size,
  worldBossFinalePolicies: worldBossPolicyUniverses.size,
  loreItemPrompts: manifest.counts.items
}, null, 2));
