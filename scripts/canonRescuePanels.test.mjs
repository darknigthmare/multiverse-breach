import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
let AliensRescuePanel;
let PiratesCursePanel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: AliensRescuePanel } = await vite.ssrLoadModule('/src/components/AliensRescuePanel.jsx'));
  ({ default: PiratesCursePanel } = await vite.ssrLoadModule('/src/components/PiratesCursePanel.jsx'));
});
after(async () => { await vite?.close(); });

const hero = { id: 'arca_anchor', battleId: 'hero:0:arca_anchor', name: 'Anchor', currentHp: 120, atb: 100, state: 'idle' };
const rescue = {
  id: 'aliens-1986-newt-rescue', phase: 'rescue', rescued: false, complete: false,
  carrierId: null,
  heroes: [{ id: hero.battleId, name: hero.name, nearNewt: true, nearExit: false }],
  commands: { rescueNewt: true, evacuate: false }
};
const escape = {
  ...rescue, phase: 'escape', rescued: true, carrierId: hero.battleId,
  heroes: [{ id: hero.battleId, name: hero.name, nearNewt: false, nearExit: true }],
  commands: { rescueNewt: false, evacuate: true }
};
const curse = {
  bossId: 'enemy:boss:barbossa', phase: 'coins', curseActive: true,
  totalPieces: 882, returnedPieces: 880, finalCoinsCollected: false,
  willBloodReady: false, jackBloodReady: false, commandPending: null, ritualPending: false,
  commands: { collectFinalCoins: true, coordinateWill: false, restoreChest: false }
};
const renderRescue = overrides => renderToStaticMarkup(React.createElement(AliensRescuePanel, { hero, encounter: rescue, ...overrides }));
const renderCurse = overrides => renderToStaticMarkup(React.createElement(PiratesCursePanel, { hero, encounter: curse, ...overrides }));
const disabledButtons = html => (html.match(/<button[^>]*disabled=""/g) || []).length;
const buttons = tree => {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(buttons);
  return [...(tree.type === 'button' ? [tree] : []), ...buttons(tree.props?.children)];
};

test('source rescue panels are absent when their encounters are missing', () => {
  for (const encounter of [null, undefined, {}]) {
    assert.equal(renderRescue({ encounter }), '');
    assert.equal(renderCurse({ encounter }), '');
  }
  assert.equal(renderRescue({ encounter: { ...rescue, id: 'ordinary-battle' } }), '');
});

test('Newt can be freed only by the selected idle hero near her marker', () => {
  const html = renderRescue();
  assert.match(html, /aria-label="Aliens : sauvetage de Newt"/);
  assert.match(html, /Près du repère NEWT/);
  assert.match(html, /aria-live="polite"/);
  assert.equal(disabledButtons(html), 1);
  const acts = buttons(AliensRescuePanel({ hero, encounter: rescue }));
  assert.equal(acts[0].props.disabled, false);
  assert.equal(acts[1].props.disabled, true);
});

test('the rescue panel identifies duplicate catalogue heroes by battle ID', () => {
  const encounter = {
    ...rescue,
    heroes: [
      { id: hero.id, nearNewt: true },
      { id: hero.battleId, nearNewt: false }
    ]
  };
  assert.equal(disabledButtons(renderRescue({ encounter })), 2);
  assert.match(renderRescue({ encounter }), /Marchez vers le repère NEWT/);
});

test('the rescue panel supports runtime ID and catalogue ID identity fallbacks', () => {
  for (const localHero of [{ ...hero, battleId: undefined, runtimeId: 'hero-runtime' }, { ...hero, battleId: undefined }]) {
    const id = localHero.runtimeId || localHero.id;
    const encounter = { ...rescue, heroes: [{ id, name: localHero.name, nearNewt: true }] };
    assert.equal(disabledButtons(renderRescue({ hero: localHero, encounter })), 1);
  }
});

test('distance and engine command restrictions block freeing Newt independently', () => {
  for (const encounter of [
    { ...rescue, heroes: [{ id: hero.battleId, nearNewt: false }] },
    { ...rescue, heroes: [] },
    { ...rescue, commands: { rescueNewt: false, evacuate: true } },
    { ...rescue, commands: undefined }
  ]) assert.equal(disabledButtons(renderRescue({ encounter })), 2);
});

test('rescue cannot skip the preceding hive waves, or repeat after rescue and completion', () => {
  for (const encounter of [
    { ...rescue, phase: 'search' },
    { ...rescue, rescued: true },
    { ...rescue, phase: 'complete', complete: true },
    { ...rescue, phase: 'escape' }
  ]) assert.equal(disabledButtons(renderRescue({ encounter })), 2);
  assert.match(renderRescue({ encounter: { ...rescue, phase: 'search' } }), /Traversez les vagues de la ruche/);
});

test('pause, intro, dead heroes, movement and other busy states block both rescue actions', () => {
  for (const override of [
    { paused: true }, { inputLocked: true }, { hero: null },
    { hero: { ...hero, currentHp: 0 } }, { hero: { ...hero, state: 'attack' } },
    { hero: { ...hero, state: 'move' } }, { hero: { ...hero, actionPending: true } }
  ]) {
    assert.equal(disabledButtons(renderRescue(override)), 2, JSON.stringify(override));
    assert.equal(disabledButtons(renderRescue({ encounter: escape, ...override })), 2, JSON.stringify(override));
  }
});

test('the Smash rescue interaction does not require RPG ATB', () => {
  assert.equal(disabledButtons(renderRescue({ hero: { ...hero, atb: 0 } })), 1);
  assert.equal(disabledButtons(renderRescue({ hero: { ...hero, atb: undefined } })), 1);
});

test('evacuation requires the living carrier of Newt near the actual exit', () => {
  const html = renderRescue({ encounter: escape });
  assert.equal(disabledButtons(html), 1);
  assert.match(html, /Newt accompagne Anchor/);
  const acts = buttons(AliensRescuePanel({ hero, encounter: escape }));
  assert.equal(acts[0].props.disabled, true);
  assert.equal(acts[1].props.disabled, false);
  for (const encounter of [
    { ...escape, carrierId: 'another-hero' },
    { ...escape, heroes: [{ id: hero.battleId, nearExit: false }] },
    { ...escape, commands: { evacuate: false } },
    { ...escape, rescued: false }
  ]) assert.equal(disabledButtons(renderRescue({ encounter })), 2);
});

test('the rescue panel explains switching back to the carrier and walking to the exit', () => {
  assert.match(renderRescue({ encounter: { ...escape, carrierId: 'other' } }), /Sélectionnez le porteur de Newt/);
  assert.match(renderRescue({ encounter: { ...escape, heroes: [{ id: hero.battleId, nearExit: false }] } }), /Marchez avec Newt vers le repère ÉVACUATION/);
});

test('source rescue callbacks send exact commands and blocked callbacks do nothing', () => {
  const received = [];
  const onCommand = command => received.push(command);
  buttons(AliensRescuePanel({ hero, encounter: rescue, onCommand })).forEach(button => button.props.onClick());
  buttons(AliensRescuePanel({ hero, encounter: escape, onCommand })).forEach(button => button.props.onClick());
  buttons(AliensRescuePanel({ hero, encounter: rescue, paused: true, onCommand })).forEach(button => button.props.onClick());
  assert.deepEqual(received, ['rescue-newt', 'evacuate']);
});

test('English rescue instructions distinguish the hive escape from the later Sulaco duel', () => {
  const html = renderRescue({ lang: 'en' });
  assert.match(html, /aria-label="Aliens: Newt rescue"/);
  assert.match(html, /Free Newt/);
  assert.match(html, /Escape the Queen rather than kill her/);
  assert.match(html, /power-loader duel aboard the Sulaco happens later/);
  assert.match(renderRescue({ lang: 'en', encounter: escape }), /Evacuate with Newt/);
});

test('completed rescue reports success and blocks further actions', () => {
  const html = renderRescue({ encounter: { ...escape, phase: 'complete', complete: true } });
  assert.equal(disabledButtons(html), 2);
  assert.match(html, /Newt sauvée · Évacuation réussie/);
  assert.doesNotMatch(html, /Sélectionnez le porteur/);
});

test('the Pirates panel shows 880 of 882 coins, the two missing coins and source donors', () => {
  const html = renderCurse();
  assert.match(html, /aria-label="Isla de Muerta : malédiction de Barbossa"/);
  assert.match(html, /880\/882/);
  assert.match(html, /Will Turner, fils de Bootstrap Bill Turner/);
  assert.match(html, /Jack Sparrow fournissent leurs offrandes de sang/);
  assert.match(html, /survivent aux coups/);
  assert.match(html, /aria-live="polite"/);
  assert.equal(disabledButtons(html), 2);
});

test('only the correct sequential Pirates command is enabled in each phase', () => {
  const phases = [
    ['coins', 'collectFinalCoins', 0],
    ['offerings', 'coordinateWill', 1],
    ['restore', 'restoreChest', 2]
  ];
  for (const [phase, key, index] of phases) {
    const encounter = { ...curse, phase, commands: { [key]: true } };
    const acts = buttons(PiratesCursePanel({ hero, encounter }));
    assert.deepEqual(acts.map(button => button.props.disabled), [0, 1, 2].map(i => i !== index));
    assert.equal(disabledButtons(renderCurse({ encounter })), 2);
  }
});

test('mismatched phase cannot enable an out-of-order Pirates action', () => {
  assert.equal(disabledButtons(renderCurse({ encounter: { ...curse, phase: 'restore' } })), 3);
  assert.equal(disabledButtons(renderCurse({ encounter: { ...curse, commands: { restoreChest: true } } })), 3);
});

test('pause, targeting, spent ATB and dead or busy actors block all Pirates commands', () => {
  for (const override of [
    { paused: true }, { targeting: true }, { hero: null },
    { hero: { ...hero, atb: 99 } }, { hero: { ...hero, currentHp: 0 } },
    { hero: { ...hero, state: 'attack' } }, { hero: { ...hero, actionPending: true } }
  ]) assert.equal(disabledButtons(renderCurse(override)), 3, JSON.stringify(override));
});

test('a pending coin or ritual action blocks repeated Pirates commands', () => {
  for (const encounter of [
    { ...curse, commandPending: 'collect-final-coins' },
    { ...curse, ritualPending: true },
    { ...curse, commands: undefined },
    { ...curse, commands: { collectFinalCoins: false } }
  ]) assert.equal(disabledButtons(renderCurse({ encounter })), 3);
  assert.match(renderCurse({ encounter: { ...curse, commandPending: 'collect-final-coins' } }), /Action en cours/);
});

test('Pirates callbacks send the three engine actions and cannot trigger disabled steps', () => {
  const received = [];
  const onCommand = command => received.push(command);
  for (const [phase, key] of [['coins', 'collectFinalCoins'], ['offerings', 'coordinateWill'], ['restore', 'restoreChest']]) {
    const encounter = { ...curse, phase, commands: { [key]: true } };
    buttons(PiratesCursePanel({ hero, encounter, onCommand })).forEach(button => button.props.onClick());
  }
  buttons(PiratesCursePanel({ hero, encounter: curse, targeting: true, onCommand })).forEach(button => button.props.onClick());
  assert.deepEqual(received, ['collect-final-coins', 'coordinate-will', 'restore-chest']);
});

test('restored treasure disables the ritual and keeps the source shot as the duel ending', () => {
  const encounter = {
    ...curse, phase: 'mortal', curseActive: false, returnedPieces: 882,
    finalCoinsCollected: true, willBloodReady: true, jackBloodReady: true,
    commands: { collectFinalCoins: true, coordinateWill: true, restoreChest: true }
  };
  const html = renderCurse({ encounter });
  assert.equal(disabledButtons(html), 3);
  assert.match(html, /882\/882/);
  assert.match(html, /Malédiction levée : Barbossa est mortel/);
  assert.match(html, /Le tir de Jack termine le duel/);
  assert.match(html, /Les autres pirates deviennent mortels/);
  assert.match(html, /Offrandes de Will et Jack prêtes/);
  assert.doesNotMatch(html, /Sélectionnez un héros vivant/);
});

test('English Pirates text keeps Will’s lineage and Jack’s payment separate from the squad', () => {
  const html = renderCurse({ lang: 'en' });
  assert.match(html, /Will Turner, son of Bootstrap Bill Turner/);
  assert.match(html, /Jack Sparrow provide their blood offerings/);
  assert.match(html, /Your squad coordinates these assistants/);
  assert.match(html, /taking his coin makes him immortal until restitution; Will and other heroes remain mortal/);
  assert.match(html, /Collect the final two coins/);
  assert.match(html, /Coordinate Will and Jack/);
  assert.match(html, /Have Will restore the coins/);
  assert.match(renderCurse({ lang: 'en', encounter: { ...curse, phase: 'restore' } }), /Jack shoots Barbossa, then Will returns both coins/);
});
