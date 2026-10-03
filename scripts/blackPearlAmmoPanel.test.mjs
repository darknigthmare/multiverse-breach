import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';

let vite, Panel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Panel } = await vite.ssrLoadModule('/src/components/BlackPearlAmmoPanel.jsx'));
});
after(async () => { await vite?.close(); });
const hero = { ...getHeroById('jack_sparrow_potc'), currentHp: 100, sourceAmmoRemaining: 1, cooldown: 0 };
const props = { hero, mode: 'Smash', hasTarget: true };
const buttons = tree => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(buttons)
  : [...(tree.type === 'button' ? [tree] : []), ...buttons(tree.props?.children)];
const render = overrides => renderToStaticMarkup(React.createElement(Panel, { ...props, ...overrides }));
const action = overrides => buttons(Panel({ ...props, ...overrides }))[0];

test('the source Jack shot is a visible Smash button in both languages', () => {
  assert.match(render(), /Tirer la balle réservée/);
  assert.match(render(), /1\/1/);
  assert.match(render({ lang: 'en' }), /Fire the reserved shot/);
  assert.equal(action().props.disabled, false);
});
test('an enabled shot calls the real secondary callback once', () => {
  let calls = 0;
  action({ onShoot: () => calls++ }).props.onClick();
  assert.equal(calls, 1);
});
for (const [name, override] of Object.entries({
  paused: { paused: true }, intro: { inputLocked: true }, action: { busy: true }, range: { hasTarget: false },
  curse: { curseActive: true }, dead: { hero: { ...hero, currentHp: 0 } },
  spent: { hero: { ...hero, sourceAmmoRemaining: 0 } }, cooldown: { hero: { ...hero, cooldown: 1 } }
})) test(`the shot cannot be issued while ${name}`, () => {
  let calls = 0;
  const button = action({ ...override, onShoot: () => calls++ });
  assert.equal(button.props.disabled, true);
  button.props.onClick();
  assert.equal(calls, 0);
});
test('other modes show the reserve and use their existing targeting buttons', () => {
  for (const mode of ['RPG', 'Tactics']) {
    assert.match(render({ mode }), /1\/1/);
    assert.equal(action({ mode }), undefined);
  }
});
test('spent reserve gives sword and next-battle guidance', () => {
  assert.match(render({ hero: { ...hero, sourceAmmoRemaining: 0 } }), /Balle utilisée.*Continuez à l’épée/s);
  assert.match(render({ lang: 'en', hero: { ...hero, sourceAmmoRemaining: 0 } }), /Shot used.*next battle/s);
});
test('the panel never grants a firearm to another identity or incarnation', () => {
  for (const other of [null, getHeroById('will_turner_potc'), getHeroById('elizabeth_swann_potc'),
    { ...hero, incarnation: 'Dead Man’s Chest' }, { ...hero, universe: 'Halo' }, { ...hero, canonCombatPresentation: false }]) {
    assert.equal(render({ hero: other }), '');
  }
});

test('P2 has a distinct visible reserve and calls only the opponent shot callback', () => {
  const opponent = { ...hero, id: 'p2-jack_sparrow_potc-0', sourceId: hero.id };
  const html = render({ hero: opponent, side: 'P2' });
  assert.match(html, /P2 · Pistolet/);
  let opponentCalls = 0;
  action({ hero: opponent, side: 'P2', onShoot: () => opponentCalls++ }).props.onClick();
  assert.equal(opponentCalls, 1);
  assert.equal(action({ hero: { ...opponent, sourceAmmoRemaining: 0 }, side: 'P2' }).props.disabled, true);
});
