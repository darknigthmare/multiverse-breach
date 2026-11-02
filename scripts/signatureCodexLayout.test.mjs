import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
let vite, Panel, actor;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Panel } = await vite.ssrLoadModule('/src/components/SignatureCodexPanel.jsx'));
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  actor = HEROES_DB.find(hero => hero.id === 'cloud_ff7');
});
after(async () => vite?.close());
for (const lang of ['fr', 'en']) test(`${lang}: full paragraphs override compact-manifest truncation`, () => {
  const html = renderToStaticMarkup(React.createElement(Panel, { actor, lang }));
  const paragraphs = [...html.matchAll(/<p style="([^"]+)"/g)];
  assert.equal(paragraphs.length, 4);
  for (const [, style] of paragraphs) {
    assert.match(style, /font-size:12px/);
    assert.match(style, /white-space:normal/);
    assert.match(style, /overflow:visible/);
    assert.match(style, /text-overflow:clip/);
  }
});
test('full reward descriptions wrap without restyling every compact pack card', () => {
  const css = readFileSync(new URL('../src/components/SignatureCodexPanel.css', import.meta.url), 'utf8');
  assert.match(css, /\.booster-dossier-dialog \.booster-reward-manifest-group > p/);
  assert.match(css, /white-space: normal/);
  assert.match(css, /overflow: visible/);
  assert.match(css, /text-overflow: clip/);
});
