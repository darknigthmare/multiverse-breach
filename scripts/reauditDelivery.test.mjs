import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { getBuildIdentity, buildIdentityPlugin } from './buildIdentity.mjs';
const sha='a'.repeat(40), other='b'.repeat(40), read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
for(const env of ['production','preview','development'])test(`build identity: verified Vercel provenance for ${env}`,()=>{
  const id=getBuildIdentity({VERCEL_GIT_COMMIT_SHA:sha,VERCEL_ENV:env,GITHUB_SHA:other},()=>{throw Error('must not call git');});
  assert.deepEqual(id,{schemaVersion:1,commit:sha,shortCommit:sha.slice(0,8),environment:env});assert.equal(Object.isFrozen(id),true);
});
for(const value of ['','master','a'.repeat(39),'";alert(1)//','__proto__'])test(`build identity: invalid SHA ${JSON.stringify(value)}`,()=>{
  const id=getBuildIdentity({VERCEL_GIT_COMMIT_SHA:value,GITHUB_SHA:other,CI:'true',TOKEN:'not-for-publication'});
  assert.equal(id.commit,other);assert.equal(id.environment,'ci');assert.equal(JSON.stringify(id).includes('TOKEN'),false);
});
test('source exports without Git do not invent a commit or echo arbitrary environment values',()=>{
  const id=getBuildIdentity({VERCEL_ENV:'secret',PASSWORD:'secret'},()=>{throw Error('no Git');});
  assert.equal(id.commit,null);assert.equal(id.shortCommit,'unknown');assert.equal(JSON.stringify(id).includes('secret'),false);
});
test('emitted metadata is identical to the compile-time UI identity',()=>{
  const id=getBuildIdentity({},()=>sha);let file;
  buildIdentityPlugin(id).generateBundle.call({emitFile:f=>{file=f;}});
  assert.equal(file.fileName,'build-info.json');assert.deepEqual(JSON.parse(file.source),id);
  assert.match(read('vite.config.js'),/__MULTIVERSE_BUILD__: JSON.stringify\(identity\)/);
  assert.match(read('src/App.jsx'),/currentScreen === 'title' && <BuildIdentity/);
});
test('delivery gate runs the npm lifecycle with full checkout, never bypasses prebuild',()=>{
  const w=read('.github/workflows/production-build.yml');
  assert.match(w,/npm run build/);assert.doesNotMatch(w,/sparse-checkout|continue-on-error|ignore-scripts|pull_request_target/);
  assert.match(w,/contents: read/);assert.match(w,/persist-credentials: false/);
  const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json'));
  assert.equal(pkg.engines.node,'22.x');assert.equal(lock.packages[''].engines.node,'22.x');
  assert.match(pkg.scripts.prebuild,/test:reaudit/);assert.match(pkg.scripts.prebuild,/check:progression/);
});
test('codex QA actor selection fails rather than substituting a different identity',()=>{
  const fixture=read('scripts/fixtures/signatureCodexHarness.jsx');
  assert.match(fixture,/if \(!hero\) throw new Error/);assert.doesNotMatch(fixture,/\|\| HEROES_DB.find/);
  const browser=read('scripts/browserSignatureCodex.py');assert.match(browser,/resolvedActor'\) == actor/);
  assert.ok(browser.indexOf('results.append(failure)') < browser.indexOf("label+'-FAILED.png'"));
});
