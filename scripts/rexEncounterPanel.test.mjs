import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
let RexEncounterPanel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: RexEncounterPanel } = await vite.ssrLoadModule('/src/components/RexEncounterPanel.jsx'));
});
after(async () => { await vite?.close(); });

const hero = { id: 'snake', battleId: 'hero:0:snake', currentHp: 120, state: 'idle' };
const encounter = {
  id: 'mgs1998_shadow_moses_rex', phase: 'radome', completed: false,
  radomeHp: 360, radomeMaxHp: 360, cockpitHp: 360, cockpitMaxHp: 360,
  bodyProtected: true, grayFoxAssistance: false,
  targetCell: { x: 7, y: 3 }, activeHeroId: hero.battleId,
  commands: { selectStinger: true }, stingerProfile: { range: 6, minRange: 2 },
  inRange: true, lineOfSight: true, targetLegal: true, selectedAction: null
};
const render = overrides => renderToStaticMarkup(React.createElement(RexEncounterPanel, { hero, encounter, ...overrides }));
const buttons = tree => {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(buttons);
  return [...(tree.type === 'button' ? [tree] : []), ...buttons(tree.props?.children)];
};
const action = overrides => buttons(RexEncounterPanel({ hero, encounter, ...overrides }))[0];

test('only a recognized source REX encounter displays the tactical panel', () => {
  for (const candidate of [null, undefined, {}, { ...encounter, id: 'ordinary-rex' }, { ...encounter, phase: 'unknown' }]) {
    assert.equal(render({ encounter: candidate }), '');
  }
});

test('the radome phase identifies both target pools and the actual REX grid cell', () => {
  const html = render();
  assert.match(html, /aria-label="Shadow Moses : radome et cockpit de REX"/);
  assert.match(html, /Phase 1 : détruire le radome/);
  assert.match(html, /<dt>Radome<\/dt><dd>360\/360<\/dd>/);
  assert.match(html, /<dt>Cockpit<\/dt><dd>360\/360<\/dd>/);
  assert.match(html, /Cellule de REX.*H4/);
  assert.match(html, /Portée du Stinger.*2–6 cases/);
  assert.match(html, /ligne de vue dégagée requise/);
  assert.match(html, /aria-live="polite"/);
  assert.equal(action().props.disabled, false);
});

test('the Stinger button prepares a target without claiming it fired a missile', () => {
  const html = render();
  assert.match(html, /Préparer le Stinger/);
  assert.match(html, /Préparez le Stinger, puis cliquez sur la cellule de REX/);
  assert.match(html, /Les attaques sur le blindage ne terminent pas la mission/);
  assert.equal(action().props['aria-pressed'], false);
});

test('target coordinates use the same visible column-letter and row-number labels as the grid', () => {
  assert.match(render({ encounter: { ...encounter, targetCell: { x: 0, y: 0 } } }), /Cellule de REX.*A1/);
  assert.match(render({ lang: 'en', encounter: { ...encounter, targetCell: { x: 9, y: 5 } } }), /REX cell.*J6/);
});

test('selected Stinger targeting shows its cancel action and subsequent grid-click guidance', () => {
  const html = render({ selectedAction: 'rex_stinger' });
  assert.match(html, /Annuler la visée du Stinger/);
  assert.match(html, /Cliquez maintenant sur la cellule de REX pour tirer au Stinger/);
  assert.equal(action({ selectedAction: 'rex_stinger' }).props['aria-pressed'], true);
});

test('snapshot targeting is used unless an explicit current UI selection is supplied', () => {
  const selectedEncounter = { ...encounter, selectedAction: 'rex_stinger' };
  assert.equal(action({ encounter: selectedEncounter }).props['aria-pressed'], true);
  assert.equal(action({ encounter: selectedEncounter, selectedAction: null }).props['aria-pressed'], false);
});

test('the cockpit phase exposes the remaining pool and summarizes Gray Fox assistance', () => {
  const html = render({ encounter: { ...encounter, phase: 'cockpit', radomeHp: 0, cockpitHp: 225, grayFoxAssistance: true } });
  assert.match(html, /Phase 2 : viser le cockpit ouvert/);
  assert.match(html, /<dt>Radome<\/dt><dd>0\/360<\/dd>/);
  assert.match(html, /<dt>Cockpit<\/dt><dd>225\/360<\/dd>/);
  assert.match(html, /Gray Fox aide à exposer le cockpit/);
  assert.match(html, /Son intervention est résumée pour cette mission tactique/);
});

test('a completed encounter disables targeting and states that Liquid survives', () => {
  const html = render({ encounter: { ...encounter, phase: 'complete', completed: true, radomeHp: 0, cockpitHp: 0 } });
  assert.match(html, /Metal Gear REX désactivé/);
  assert.match(html, /Liquid Snake survit à la destruction de REX/);
  assert.match(html, /Son duel au corps à corps se déroule après cette mission/);
  assert.doesNotMatch(html, /Cliquez maintenant|Préparez le Stinger, puis|Cellule de REX/);
  assert.equal(action({ encounter: { ...encounter, phase: 'complete' } }).props.disabled, true);
  assert.equal(action({ encounter: { ...encounter, completed: true } }).props.disabled, true);
});

test('the English panel retains source targets, missile selection and line-of-sight rules', () => {
  const html = render({ lang: 'en' });
  assert.match(html, /aria-label="Shadow Moses: REX radome and cockpit"/);
  assert.match(html, /Phase 1: destroy the radome/);
  assert.match(html, /Stinger range.*2–6 cells/);
  assert.match(html, /clear line of sight required/);
  assert.match(html, /A Stinger is supplied for this mission/);
  assert.match(html, /Ready the Stinger, then click REX/);
  assert.match(render({ lang: 'en', selectedAction: 'rex_stinger' }), /Cancel Stinger targeting/);
  assert.match(render({ lang: 'en', encounter: { ...encounter, phase: 'cockpit' } }), /Phase 2: target the open cockpit/);
});

test('English completion distinguishes disabling REX from the later fistfight', () => {
  const html = render({ lang: 'en', encounter: { ...encounter, phase: 'complete' } });
  assert.match(html, /Metal Gear REX disabled/);
  assert.match(html, /Liquid Snake survives REX/);
  assert.match(html, /His fistfight takes place after this mission/);
});

test('pause, a dead actor or a different active actor blocks Stinger selection', () => {
  for (const overrides of [
    { paused: true }, { hero: null }, { hero: { ...hero, currentHp: 0 } },
    { hero: { ...hero, currentHp: Number.NaN } }, { hero: { ...hero, currentHp: '120' } },
    { encounter: { ...encounter, activeHeroId: null } },
    { encounter: { ...encounter, activeHeroId: 'hero:1:other' } }
  ]) assert.equal(action(overrides).props.disabled, true);
  assert.match(render({ paused: true }), /Reprenez la mission pour agir/);
  assert.match(render({ hero: null }), /Attendez le tour d’un héros vivant/);
});

test('runtime battle identity prevents selection by another copy of the catalogue hero', () => {
  assert.equal(action({ hero: { ...hero, battleId: 'hero:1:snake' } }).props.disabled, true);
  assert.equal(action({ encounter: { ...encounter, activeHeroId: hero.id } }).props.disabled, true);
});

test('runtime and catalogue identity fallbacks identify the active tactical unit', () => {
  for (const localHero of [{ ...hero, battleId: undefined, runtimeId: 'runtime:snake' }, { ...hero, battleId: undefined }]) {
    const id = localHero.runtimeId || localHero.id;
    assert.equal(action({ hero: localHero, encounter: { ...encounter, activeHeroId: id } }).props.disabled, false);
  }
});

test('only an affirmative engine command permits preparing the mission Stinger', () => {
  for (const commands of [undefined, {}, { selectStinger: false }, { selectStinger: 'true' }]) {
    assert.equal(action({ encounter: { ...encounter, commands } }).props.disabled, true);
  }
  assert.match(render({ encounter: { ...encounter, commands: { selectStinger: false } } }), /Attendez la fin de l’action en cours/);
});

test('the tactical command does not require RPG ATB or another hero weapon cooldown', () => {
  assert.equal(action({ hero: { ...hero, atb: 0, cooldown: 100, specialCharge: 0 } }).props.disabled, false);
});

test('targeting outside range may be prepared and cancelled but instructs the user to move', () => {
  const distantEncounter = { ...encounter, inRange: false, targetLegal: false };
  assert.equal(action({ encounter: distantEncounter }).props.disabled, false);
  assert.match(render({ encounter: distantEncounter }), /Placez le héros à portée avant de viser/);
  assert.match(render({ encounter: distantEncounter, selectedAction: 'rex_stinger' }), /Annulez la visée pour vous déplacer à portée/);
  assert.doesNotMatch(render({ encounter: distantEncounter }), /Cible à portée et ligne de vue dégagée/);
});

test('a blocked line of sight requires repositioning rather than a claimed legal missile', () => {
  const blockedEncounter = { ...encounter, lineOfSight: false, targetLegal: false };
  assert.equal(action({ encounter: blockedEncounter }).props.disabled, false);
  assert.match(render({ encounter: blockedEncounter }), /Déplacez le héros pour dégager la ligne de vue/);
  assert.match(render({ encounter: blockedEncounter, selectedAction: 'rex_stinger' }), /Annulez la visée puis déplacez-vous/);
  assert.match(render({ lang: 'en', encounter: blockedEncounter, selectedAction: 'rex_stinger' }), /Cancel targeting, then move to clear the line of sight/);
});

test('malformed target cells and range profiles cannot enable a source command', () => {
  for (const targetCell of [undefined, {}, { x: -1, y: 3 }, { x: 7, y: Number.NaN }, { x: 7.5, y: 3 }]) {
    const candidate = { ...encounter, targetCell };
    assert.equal(action({ encounter: candidate }).props.disabled, true);
    assert.match(render({ encounter: candidate }), /La cible REX est indisponible/);
  }
  for (const stingerProfile of [undefined, {}, { minRange: 2, range: 1 }, { minRange: -1, range: 6 }, { minRange: 2, range: Number.POSITIVE_INFINITY }]) {
    assert.equal(action({ encounter: { ...encounter, stingerProfile } }).props.disabled, true);
  }
});

test('malformed target pools display an unavailable value instead of invented HP', () => {
  for (const patch of [
    { radomeHp: Number.NaN }, { radomeMaxHp: 0 }, { radomeHp: -1 }, { radomeHp: 361 },
    { cockpitHp: undefined }, { cockpitMaxHp: Number.POSITIVE_INFINITY }
  ]) {
    const candidate = { ...encounter, ...patch };
    assert.equal(action({ encounter: candidate }).props.disabled, true);
    assert.match(render({ encounter: candidate }), /<dd>—<\/dd>/);
  }
});

test('allowed callbacks only request selection and blocked callbacks do nothing', () => {
  const received = [];
  const onSelectStinger = (...args) => received.push(args);
  action({ onSelectStinger }).props.onClick();
  action({ onSelectStinger, selectedAction: 'rex_stinger' }).props.onClick();
  for (const overrides of [{ paused: true }, { hero: null }, { encounter: { ...encounter, phase: 'complete' } }, { encounter: { ...encounter, commands: {} } }]) {
    action({ onSelectStinger, ...overrides }).props.onClick();
  }
  assert.deepEqual(received, [[], []]);
  assert.doesNotThrow(() => action().props.onClick());
});

test('the compact panel CSS supports wrapping, fluid controls and a visible keyboard focus', async () => {
  const css = await readFile(new URL('../src/components/RexEncounterPanel.css', import.meta.url), 'utf8');
  assert.match(css, /min-width:\s*0/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.rex-encounter-panel-action\s*\{[^}]*width:\s*100%/);
  assert.match(css, /white-space:\s*normal/);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
});
