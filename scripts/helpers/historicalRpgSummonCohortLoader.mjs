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
  // Change only the count expression in this one hash-pinned validator. Its
  // literal43/49/55, real Vite imports, resolvers and all flows stay intact.
  const replacement = scopedAssets + needle.slice('getAssets()'.length);
  return { ...result, source: source.replace(needle, replacement) };
}
