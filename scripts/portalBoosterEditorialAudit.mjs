import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

import { getOcBoosterContentUpdate } from '../src/game/ocBoosterContentUpdates.js';
import { ORIGINAL_WORLD_BOOSTERS } from '../src/game/portalBoosterCatalog.js';
import { resolvePortalBoosterEditorialWave } from '../src/game/portalBoosterEditorialWaves.js';

const NEXUS_UNIVERSE = 'Nexus de Convergence';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true }
});

let heroes;
let makeBoosterCandidates;
try {
  const heroModule = await vite.ssrLoadModule('/src/game/heroes.js');
  const portalModule = await vite.ssrLoadModule('/src/components/PortalScreen.jsx');
  heroes = heroModule.HEROES_DB.filter(hero => !hero.campaignExclusive);
  makeBoosterCandidates = portalModule.default.makeBoosterCandidates;
} finally {
  await vite.close();
}

const universes = [...new Set(heroes.map(hero => hero.universe).filter(Boolean))]
  .filter(universe => universe !== NEXUS_UNIVERSE)
  .sort((universeA, universeB) => universeA.localeCompare(universeB));
const originalPackByUniverse = new Map(
  ORIGINAL_WORLD_BOOSTERS.map(pack => [pack.universe, pack])
);
const counts = {
  runtimeUniverses: universes.length,
  authoredWaves: 0,
  deterministicWaves: 0,
  completeWaves: 0,
  featuredCards: 0
};

for (const universe of universes) {
  const authoredPack = originalPackByUniverse.get(universe);
  const banner = authoredPack || {
    id: `universe:${universe}`,
    scope: 'universe',
    universe,
    color: '#39c5bb',
    rewardKinds: null,
    chaseRewardId: null,
    match: hero => hero.universe === universe
  };
  const candidates = makeBoosterCandidates({
    banner,
    visibleHeroes: heroes,
    disabledGearIds: new Set()
  });
  const authoredUpdate = getOcBoosterContentUpdate(banner.id);
  const wave = resolvePortalBoosterEditorialWave({
    packId: banner.id,
    universe,
    candidates,
    authoredUpdate
  });
  if (authoredUpdate) counts.authoredWaves++;
  else counts.deterministicWaves++;

  const featuredCardIds = wave?.featuredCardIds || wave?.newCardIds || [];
  const candidateById = new Map(candidates.map(candidate => [candidate.id, candidate]));
  if (featuredCardIds.length !== 5) {
    errors.push(`${universe}: expected 5 editorial cards, received ${featuredCardIds.length}`);
    continue;
  }
  if (new Set(featuredCardIds).size !== 5) {
    errors.push(`${universe}: editorial card ids are not unique`);
    continue;
  }

  const invalidIds = featuredCardIds.filter(id => {
    const candidate = candidateById.get(id);
    return !candidate || candidate.universe !== universe;
  });
  if (invalidIds.length > 0) {
    errors.push(`${universe}: cards outside the real exclusive pool: ${invalidIds.join(', ')}`);
    continue;
  }

  counts.completeWaves++;
  counts.featuredCards += featuredCardIds.length;
}

console.log(JSON.stringify({
  ...counts,
  missingWaves: counts.runtimeUniverses - counts.completeWaves,
  errors
}, null, 2));

if (errors.length > 0) process.exitCode = 1;
