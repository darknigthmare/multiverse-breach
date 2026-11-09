import assert from 'node:assert/strict';
import fs from 'node:fs';
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { Server } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createServer } from './fixtures/ssrTestServer.mjs';

test('two real SSR servers preserve transforms while isolating caches without sockets or file watchers', async t => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'multiverse-ssr-isolation-fixture-'));
  const servers = [];
  t.after(async () => {
    await Promise.allSettled(servers.map(server => server.close()));
    await rm(fixtureRoot, { recursive: true, force: true });
  });
  const listen = t.mock.method(Server.prototype, 'listen', () => {
    throw new Error('SSR test servers must not open a network listener');
  });
  const watch = t.mock.method(fs, 'watch', () => {
    throw new Error('immutable SSR fixtures must not create file watchers');
  });
  const watchFile = t.mock.method(fs, 'watchFile', () => {
    throw new Error('immutable SSR fixtures must not poll files');
  });
  await writeFile(path.join(fixtureRoot, 'fixture.mjs'), [
    'let calls = 0;',
    'export const next = () => ++calls;',
    'export const defined = __SSR_FIXTURE_VALUE__;',
    "export const transformed = 'before-fixture-transform';"
  ].join('\n'));
  const sharedCache = path.join(fixtureRoot, 'caller-cache');
  const watchOptions = [{ ignored: ['**/ignored-fixture/**'], interval: 1234 }, null];
  const results = await Promise.allSettled(['first', 'second'].map(async label => {
    const server = await createServer({
      root: fixtureRoot,
      configFile: false,
      appType: 'custom',
      logLevel: 'silent',
      cacheDir: sharedCache,
      define: { __SSR_FIXTURE_VALUE__: JSON.stringify(label) },
      optimizeDeps: { entries: ['fixture.mjs'] },
      plugins: [{
        name: 'ssr-isolation-fixture-transform',
        transform(source, id) {
          if (id === path.join(fixtureRoot, 'fixture.mjs')) {
            return source.replace('before-fixture-transform', 'after-fixture-transform');
          }
        }
      }],
      server: {
        middlewareMode: true,
        ws: true,
        hmr: true,
        watch: watchOptions[label === 'first' ? 0 : 1],
        headers: { 'X-SSR-Fixture': label }
      }
    });
    servers.push(server);
    return server;
  }));
  for (const result of results) {
    if (result.status === 'rejected') throw result.reason;
  }
  const orderedServers = results.map(result => result.value);
  const caches = orderedServers.map(server => server.config.cacheDir);
  assert.equal(new Set(caches).size, 2);
  for (const [index, server] of orderedServers.entries()) {
    assert.notEqual(server.config.cacheDir, sharedCache);
    await access(server.config.cacheDir);
    assert.equal(server.config.server.middlewareMode, true);
    assert.equal(server.config.server.ws, false);
    assert.equal(server.config.server.hmr, false);
    assert.notEqual(server.config.server.watch, null, 'Vite keeps its module resolver cache');
    assert.equal(server.config.server.watch.ignored(fixtureRoot), true);
    assert.equal(server.config.server.watch.ignored(path.join(fixtureRoot, 'fixture.mjs')), true);
    assert.equal(server.config.server.watch.interval, index === 0 ? 1234 : undefined);
    assert.equal(server.config.server.headers['X-SSR-Fixture'], ['first', 'second'][index]);
    assert.ok(server.environments.client.depsOptimizer, 'the existing dependency optimizer stays enabled');
  }
  const modules = await Promise.all(orderedServers.map(server => server.ssrLoadModule('/fixture.mjs')));
  assert.deepEqual(modules.map(module => module.defined), ['first', 'second']);
  assert.deepEqual(modules.map(module => module.transformed), ['after-fixture-transform', 'after-fixture-transform']);
  assert.deepEqual(modules.map(module => module.next()), [1, 1]);
  assert.deepEqual(modules.map(module => module.next()), [2, 2]);
  assert.equal(listen.mock.callCount(), 0);
  assert.equal(watch.mock.callCount(), 0);
  assert.equal(watchFile.mock.callCount(), 0);
  for (const server of orderedServers) assert.deepEqual(server.watcher.getWatched(), {});

  const closing = orderedServers.map(server => server.close());
  for (const [index, server] of orderedServers.entries()) {
    assert.equal(server.close(), closing[index], 'simultaneous closes share one operation');
  }
  await Promise.all(closing);
  await Promise.all(orderedServers.map(server => server.close()));
  for (const cacheDir of caches) await assert.rejects(access(cacheDir), { code: 'ENOENT' });
  await assert.rejects(access(sharedCache), { code: 'ENOENT' });
  assert.equal(listen.mock.callCount(), 0);
  assert.equal(watch.mock.callCount(), 0);
  assert.equal(watchFile.mock.callCount(), 0);
});

test('an SSR server creation failure preserves the error and removes its isolated cache', async t => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'multiverse-ssr-failure-fixture-'));
  t.after(() => rm(fixtureRoot, { recursive: true, force: true }));
  const listen = t.mock.method(Server.prototype, 'listen', () => {
    throw new Error('a failed SSR server must not open a network listener');
  });
  const expected = new Error('intentional fixture configuration failure');
  let cacheDir;
  await assert.rejects(createServer({
    root: fixtureRoot,
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
    plugins: [{
      name: 'ssr-isolation-fixture-failure',
      async configResolved(config) {
        cacheDir = config.cacheDir;
        await access(cacheDir);
        throw expected;
      }
    }]
  }), error => error === expected);
  assert.equal(typeof cacheDir, 'string');
  await assert.rejects(access(cacheDir), { code: 'ENOENT' });
  assert.equal(listen.mock.callCount(), 0);
});
