import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { collectCommonUiAssetReferences, extractStaticPublicAssetPaths } from './dlcCommonUiAssets.mjs';
import { buildDlcDistributionPlan } from './dlcDistribution.mjs';

const extract = source => extractStaticPublicAssetPaths({ sourcePath: 'index.html', source });

test('entry HTML observes local media URLs and normalizes only the inventory paths', () => {
  const html = `<!doctype html><html><head>
    <link rel="icon" href="/icons/menu%20art.png?v=1&amp;theme=dark#icon">
    <link rel="preload" as="image" imagesrcset="/images/one.png 1x, /images/two.png 2x">
    <link rel="stylesheet" href="/src/index.css">
    <style>/* url(/images/comment.png) */ .hero { background:url('/images/panel.webp?rev=2'); }</style>
    </head><body>
    <img alt="a > b" src=/images/body.png?revision=3>
    <video poster='/images/poster.png'><source src="/video/intro.webm#scene"></video>
    <div style="background-image: url(&quot;/images/inline.png&quot;)"></div>
    <img src="&#47;images&#47;entity&#46;png">
    <script type="module" src="/src/main.jsx"></script>
    </body></html>`;
  assert.deepEqual(extract(html), ['/icons/menu art.png', '/images/body.png', '/images/entity.png',
    '/images/inline.png', '/images/one.png', '/images/panel.webp', '/images/poster.png', '/images/two.png', '/video/intro.webm']);
});

test('entry HTML does not infer media from scripts, comments, remote URLs, routes or templates', () => {
  assert.deepEqual(extract(`
    <!-- <img src="/images/comment.png"> -->
    <script>const example='<img src="/images/script.png">';</script>
    <textarea><img src="/images/text.png"></textarea>
    <title><img src="/images/title.png"></title>
    <a href="/images/help.html">Help</a><link rel="canonical" href="/page.html">
    <img src="https://example.test/images/remote.png"><img src="//cdn.test/images/remote.png">
    <img src="/images/\${universe}/hero.png"><img src="/api/profile">
    <img src="https://example.test/first.png" src="/images/ignored-duplicate.png">
    <input type="text" src="/images/ignored-input.png">
  `), []);
  assert.deepEqual(extract('<base href="https://cdn.test/"><img src="/images/remote-base.png">'), []);
});

test('entry HTML refuses encoded traversal and malformed local media URLs', () => {
  assert.throws(() => extract('<img src="/images/%2e%2e/private.png">'), /Unsafe common UI asset URL/);
  assert.throws(() => extract('<img src="/images/bad%ZZ.png">'), /Invalid common UI asset URL/);
});

test('a local HTML image absent from the public inventory fails the base plan', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'dlc-html-inventory-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, 'DLC'));
  mkdirSync(path.join(root, 'src'));
  writeFileSync(path.join(root, 'DLC/shared-assets.json'), JSON.stringify({ schemaVersion: 1, assets: [] }));
  writeFileSync(path.join(root, 'index.html'), '<link rel="icon" href="/images/missing.png?rev=1#icon">');
  assert.deepEqual(collectCommonUiAssetReferences({ root }), [{ publicPath: '/images/missing.png', sourcePath: 'index.html' }]);
  assert.throws(() => buildDlcDistributionPlan({ root, selection: [] }), /Undeclared common UI asset: index.html -> \/images\/missing.png/);
  rmSync(path.join(root, 'index.html'));
  const outside = path.join(root, 'outside.html');
  writeFileSync(outside, '<img src="/images/outside.png">');
  symlinkSync(outside, path.join(root, 'index.html'));
  assert.throws(() => collectCommonUiAssetReferences({ root }), /symlink/);
});
