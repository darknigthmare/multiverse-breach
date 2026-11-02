import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { getRpgSourceEffectPresentation as present, getRpgSourceStatusPresentation as status } from '../src/game/rpgTargetingPresentation.js';

let vite, Panel;
before(async () => {
  vite = await createServer({ configFile: false, publicDir: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, watch: null } });
  ({ default: Panel } = await vite.ssrLoadModule('/src/components/RpgTargetingPanel.jsx'));
});
after(async () => { await vite?.close(); });
const targeting = profile => ({ actorId: 'caller', actorName: 'Caller', abilityName: 'Source action', effect: profile.effect || 'guard',
  profile, side: 'player', shape: 'single', selectedTargetIds: ['target'], previewTargetIds: ['target'], maxTargets: 1,
  eligibleTargets: [{ id: 'target', name: 'Target', hp: 40, maxHp: 100 }],
  estimates: [{ id: 'target', effect: profile.effect || 'guard', amount: 999, min: 900, max: 1000 }], valid: true });
const render = state => renderToStaticMarkup(React.createElement(Panel, { targeting: state, lang: 'fr', paused: false, wait: true,
  onWaitChange() {}, onSelect() {}, onConfirm() {}, onCancel() {} }));

test('Mugman displays source duration and an honest caller-only relay without an invented damage estimate', () => {
  const state = targeting({ invulnerabilityKind: 'mugman-super-art-ii', invulnerabilityDuration: 4.85, duration: 3, guardReduce: .4 });
  state.summon = { kind: 'reinforcement', entityName: 'Mugman' };
  const html = render(state);
  assert.match(html, /INVULNÉRABLE · 4,85 s/); assert.match(html, /l’appelant uniquement/);
  assert.doesNotMatch(html, /900–1000|40%|3 s/);
  assert.equal(present(state, 'en').label, 'INVULNERABLE · 4.85 s');
});
test('Shield Pal persists for one hit and ignores a generic duration fallback', () => {
  const html = render(targeting({ shieldKind: 'shield-pal-one-hit', shieldHits: 1, duration: 3 }));
  assert.match(html, /SHIELD PAL · 1 coup/); assert.match(html, /Persiste jusqu’au prochain coup/);
  assert.doesNotMatch(html, /3 s|900–1000/);
});
test('Yukikaze presents a conditional physical retaliation without guaranteed damage', () => {
  const html = render(targeting({ counterKind: 'yukikaze', counterWindowDuration: 1.1, counterMultiplier: 4.8 }));
  assert.match(html, /CONTRE CONDITIONNEL · 1,1 s/); assert.match(html, /riposte doit ensuite toucher/);
  assert.match(html, /prises ne déclenchent pas/); assert.doesNotMatch(html, /900–1000/);
});
test('Paralyzer and Abe explain explicit target eligibility, source channel and zero damage', () => {
  const paralyzer = render(targeting({ effect: 'control', controlKind: 'paralyzer', controlDuration: 1.5 }));
  assert.match(paralyzer, /PARALYZER · 1,5 s/); assert.match(paralyzer, /épisode 21/);
  assert.match(paralyzer, /explicitement éligible/); assert.doesNotMatch(paralyzer, /900–1000/);
  const abe = render(targeting({ effect: 'control', controlKind: 'possession', controlDuration: 2, channelDuration: 1.1 }));
  assert.match(abe, /Slig éligible uniquement/); assert.match(abe, /Chant de 1,1 s/);
  assert.match(abe, /sans changer de camp/); assert.doesNotMatch(abe, /900–1000/);
});
test('previous Maya Phaselock and Val healing estimates retain their existing labels and amounts', () => {
  const maya = targeting({ effect: 'control', controlKind: 'phaselock', controlDuration: 2.4 });
  maya.estimates[0].amount = 0; assert.equal(present(maya), null);
  assert.match(render(maya), /Immobilisation · 2,4 s/);
  const val = targeting({ effect: 'heal' }); val.estimates[0] = { id: 'target', effect: 'heal', amount: 60, min: 60, max: 60 };
  assert.equal(present(val), null); assert.match(render(val), /Soin 60/);
});
test('canvas source status uses runtime remaining time, charges and channel state', () => {
  assert.equal(status({ sourceProtectionWave16: { active: true, kind: 'mugman-super-art-ii', remaining: 4.25 } }), 'INVULNÉRABLE 4,25 s');
  assert.equal(status({ sourceProtectionWave16: { active: true, kind: 'shield-pal-one-hit', charges: 1, remaining: null } }), 'SHIELD PAL · 1 coup');
  assert.equal(status({ sourceProtectionWave16: { active: true, kind: 'yukikaze', remaining: .5 } }), 'CONTRE EN ATTENTE 0,5 s');
  assert.equal(status({ sourceControlWave16: { active: true, kind: 'possession', phase: 'channeling', channelRemaining: .75 } }), 'CHANT 0,75 s');
  assert.equal(status({ sourceControlWave16: { active: true, kind: 'paralyzer', phase: 'active', remaining: 1.25 } }), 'PARALYZER 1,25 s');
  assert.equal(status({ sourceProtectionWave16: { active: false, kind: 'mugman-super-art-ii', remaining: 0 } }), null);
  assert.equal(present({ abilityName: 'Mugman', profile: {} }), null);
});
