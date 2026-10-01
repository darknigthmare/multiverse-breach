import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { getCanonicalEncounterBriefing } from '../src/game/canonEncounterBriefing.js';

let vite;
let RiftBriefingPanel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ RiftBriefingPanel } = await vite.ssrLoadModule('/src/components/HubScreen.jsx?encounter-briefing'));
});
after(async () => { await vite?.close(); });
const render = (stage, lang) => renderToStaticMarkup(React.createElement(RiftBriefingPanel, {
  stage, lang, isUnlocked: () => false,
  getStageModifier: () => ({ name: { fr: 'Aucune', en: 'None' }, desc: { fr: 'Aucune anomalie.', en: 'No anomaly.' }, color: '#fff' }),
  getStageArc: () => null, getLootRarity: () => ({ label: 'NORMAL', color: '#fff' }),
  getBossIntel: () => ({ name: stage.bossName }),
  getRichBreachBrief: () => 'Contexte source. Seconde phrase. Directive A.R.C.A.: neutraliser le boss.',
  getMissionLaunchBrief: () => ['Contexte générique.', 'Directive A.R.C.A.: neutraliser le boss.'],
  onLaunch() {}, onClose() {}
}));
for (const stage of [CANON_PRIORITY_STAGES.lightmassTrain, CANON_PRIORITY_STAGES.metropolisScarab, CANON_PRIORITY_STAGES.xenNihilanth]) {
  for (const lang of ['fr', 'en']) {
    test(`the real stage ${stage.id} briefing exposes its playable objective and adaptation in ${lang}, even while locked`, () => {
      const html = render(stage, lang);
      const brief = getCanonicalEncounterBriefing(stage, lang);
      assert.ok(html.includes(brief.objective));
      assert.ok(html.includes(brief.adaptation));
      assert.match(html, /data-testid="selected-briefing-deploy"[^>]*disabled=""/);
      assert.doesNotMatch(html, /Directive A.R.C.A.: neutraliser le boss/);
      if (stage.id === 1) assert.match(html, /Kryll.*frag.*Troika/s);
      if (stage.id === 2) assert.match(html, lang === 'fr' ? /abordage.*Grunt.*Élite.*invulnérable/s : /boarding.*Grunt.*Elite.*invulnerable/s);
      if (stage.id === 10) assert.match(html, lang === 'fr' ? /trois cristaux.*cerveau.*corps/s : /three healing crystals.*brain.*Body/s);
    });
  }
}
test('source rules do not replace unrelated incarnations, custom battles or other stage objectives', () => {
  const stage = CANON_PRIORITY_STAGES.lightmassTrain;
  for (const other of [null, {}, { ...stage, customBattle: true }, { ...stage, isCustomBattle: true },
    { ...stage, incarnation: 'Gears 3' }, { ...stage, universe: 'Halo' }, { ...stage, mode: 'Smash' },
    CANON_PRIORITY_STAGES.hadleysQueen, CANON_PRIORITY_STAGES.shadowMoses]) {
    assert.equal(getCanonicalEncounterBriefing(other, 'fr'), null);
  }
  assert.match(render(CANON_PRIORITY_STAGES.hadleysQueen, 'fr'), /Directive A.R.C.A.: neutraliser le boss/);
});
