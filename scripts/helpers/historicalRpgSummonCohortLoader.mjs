import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

let configuration;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function initialize(data) {
  assert.equal(new URL(data.targetUrl).protocol, 'file:');
  assert.equal(data.historicalViewKeys.length, data.historicalViewCount);
  assert.equal(new Set(data.historicalViewKeys).size, data.historicalViewCount);
  assert.equal(new Set(data.excludedKeys).size, data.excludedKeys.length);
  assert.equal(data.historicalViewKeys.length + data.excludedKeys.length, data.liveCount);
  assert.ok(data.historicalViewKeys.every(key => !data.excludedKeys.includes(key)));
  assert.ok(data.postBaselineKeys.every(key => data.excludedKeys.includes(key)));
  assert.ok(Array.isArray(data.historicalActors));
  if (data.historicalActors.length) {
    assert.equal(data.historicalActors.length, 1);
    assert.equal(data.historicalActors[0].id, 'ripley');
    assert.equal(data.historicalActors[0].universe, 'Alien');
    assert.ok(data.targetUrl.endsWith('/combat-fidelity-wave13-2026-10-24/summon-runtime-validation.mjs'));
  }
  configuration = data;
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url !== configuration.targetUrl) return result;
  assert.equal(result.format, 'module');
  const source = typeof result.source === 'string' ? result.source : Buffer.from(result.source).toString('utf8');
  assert.equal(sha(source), configuration.validatorSha256, 'Frozen historical validator SHA mismatch');
  const needle = configuration.countExpression;
  assert.equal(source.split(needle).length - 1, 1, 'Expected exactly one historical count expression');
  assert.ok(needle.startsWith('getAssets()'));
  const scopedAssets = `getAssets().filter(asset => ${JSON.stringify(configuration.historicalViewKeys)}.includes(asset.key))`;
  // Scope the historical asset count without changing its literal43/49/55.
  // All real Vite imports, resolvers and gameplay assertions remain intact.
  const replacement = scopedAssets + needle.slice('getAssets()'.length);
  let projected = source.replace(needle, replacement);
  if (configuration.historicalActors.length) {
    const engineImport = "  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));";
    assert.equal(projected.split(engineImport).length - 1, 1, 'Historical actor projection must precede the unique engine import');
    // This validator owns a fresh Vite graph. Install the exact frozen actor
    // before EngineRpg/combatIdentity construct their performer identity maps.
    // getHeroById reads the exported array; verify it observes the same object.
    const projection = `  {
    const cohort = await vite.ssrLoadModule('/src/game/heroes.js');
    const previous = [...cohort.HEROES_DB], serialized = previous.map(actor => JSON.stringify(actor));
    const frozenActors = ${JSON.stringify(configuration.historicalActors)};
    assert.equal(previous.length, 1911, 'Historical fixture keeps the complete current roster');
    for (const frozen of frozenActors) {
      const matches = previous.filter(actor => actor.id === frozen.id);
      assert.equal(matches.length, 1); assert.equal(matches[0].universe, frozen.universe);
      assert.equal(matches[0].incarnation, 'Alien (1979) - Nostromo / Narcissus', 'The current source version remains independently tested');
      const index = previous.indexOf(matches[0]);
      cohort.HEROES_DB[index] = structuredClone(frozen);
      assert.equal(cohort.getHeroById(frozen.id), cohort.HEROES_DB[index], 'No stale getter cache may retain the current incarnation');
      assert.deepEqual(cohort.getHeroById(frozen.id), frozen);
    }
    assert.equal(cohort.HEROES_DB.length, previous.length);
    let unchanged = 0;
    for (let index = 0; index < previous.length; index++) {
      if (frozenActors.some(actor => actor.id === previous[index].id)) continue;
      assert.equal(cohort.HEROES_DB[index], previous[index]);
      assert.equal(JSON.stringify(cohort.HEROES_DB[index]), serialized[index]); unchanged++;
    }
    assert.equal(unchanged, 1910, 'Every other current actor is unchanged');
  }
`;
    projected = projected.replace(engineImport, projection + engineImport);
    projected += `\nafter(() => assert.deepEqual(Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))])), sourceHashesBefore, 'Historical projection must not modify production source files'));\n`;
  }
  return { ...result, source: projected };
}
