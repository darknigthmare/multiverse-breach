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
const hubSource = read('../src/components/HubScreen.jsx');
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

console.log(JSON.stringify({
  baseUniverse: 'Nexus de Convergence',
  ocHeroes: expectedOcHeroIds.length,
  ocThreatSprites: expectedOcEnemyNames.length,
  ocItemSprites: expectedOcItemIds.length,
  requiredBaseModes: ['RPG', 'Tactics', 'Smash'],
  dlcDefault: 'hidden',
  storyChapterPortals: 'active-chapter-only',
  factionArcCompletion: 'expanded'
}, null, 2));
