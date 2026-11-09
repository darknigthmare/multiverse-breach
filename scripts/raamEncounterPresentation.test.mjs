import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
let RaamEncounterPanel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: RaamEncounterPanel } = await vite.ssrLoadModule('/src/components/RaamEncounterPanel.jsx'));
});
after(async () => { await vite?.close(); });
const hero = { id: 'marcus', battleId: 'hero:0:marcus', currentHp: 120, atb: 100, state: 'idle' };
const encounter = {
  bossId: 'enemy:boss:raam', shieldActive: true, grenadesRemaining: 4,
  heroes: [{ id: hero.battleId, inLightCover: true }],
  commands: { frag: true, takeLightCover: true, leaveLightCover: true }
};
const render = overrides => renderToStaticMarkup(React.createElement(RaamEncounterPanel, { hero, encounter, ...overrides }));
const disabledButtons = html => (html.match(/<button[^>]*disabled=""/g) || []).length;

test('ordinary battles do not display source encounter commands', () => {
  assert.equal(render({ encounter: null }), '');
  assert.equal(render({ encounter: {} }), '');
});
test('ready hero in lit cover is identified by battle ID and may throw or leave', () => {
  const html = render();
  assert.match(html, /RAAM protégé par les Kryll/);
  assert.match(html, /Grenades frag.*4/);
  assert.match(html, /À couvert dans la lumière/);
  assert.match(html, /Quitter la lumière/);
  assert.doesNotMatch(html, /Rejoindre la lumière/);
  assert.equal(disabledButtons(html), 0);
  assert.match(html, /aria-live="polite"/);
});
test('no frag supply blocks only the frag action', () => {
  const html = render({ encounter: { ...encounter, grenadesRemaining: 0 } });
  assert.equal(disabledButtons(html), 1);
  assert.match(html, /Grenades frag.*0/);
});
test('pause, targeting, spent ATB and dead or busy actors block commands', () => {
  for (const override of [
    { paused: true }, { targeting: true }, { hero: { ...hero, atb: 99 } },
    { hero: { ...hero, currentHp: 0 } }, { hero: { ...hero, state: 'attack' } }, { hero: null }
  ]) assert.equal(disabledButtons(render(override)), 2, JSON.stringify(override));
});
test('runtime command restrictions are enforced even when the actor is ready', () => {
  assert.equal(disabledButtons(render({ encounter: { ...encounter, commands: { frag: false, leaveLightCover: false } } })), 2);
  assert.equal(disabledButtons(render({ encounter: { ...encounter, commands: undefined } })), 2);
});
test('English instructions expose the weakness and correctly distinguish swarm from gunfire', () => {
  const html = render({ lang: 'en', encounter: { ...encounter, shieldActive: false, heroes: [] } });
  assert.match(html, /RAAM exposed: attack now/);
  assert.match(html, /Outside lit cover/);
  assert.match(html, /Take lit cover/);
  assert.match(html, /not Troika gunfire/);
});
