import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import '../../src/components/HubImmersion.css';
import MosaicCharacterMissions from '../../src/components/MosaicCharacterMissions.jsx';
import MosaicResidentConversation from '../../src/components/MosaicResidentConversation.jsx';
import ImmersiveDrawer from '../../src/components/ImmersiveDrawer.jsx';
import GameSystemMenu from '../../src/components/GameSystemMenu.jsx';
import { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import { MOSAIC_CHARACTER_MISSIONS, normalizeMosaicCharacterMissions, localizeCityMission,
  startMosaicCharacterMission, restartMosaicCharacterMission, resolveMosaicCharacterMission,
  getMosaicCharacterMissionObjective } from '../../src/game/mosaicCharacterMissions.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getCharacterPlaque } from '../../src/game/characterPlaques.js';
import { getMosaicResidentDialogue } from '../../src/game/mosaicResidentDialogue.js';
import { journalCases, journalHeroes, journalProgress, journalRecord, prerequisiteCase, followupCase } from './mosaicContractJournalData.mjs';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const authored = MOSAIC_CHARACTER_MISSIONS.find(mission => mission.id === params.get('story'));
const districtId = { 'Nexus de Convergence': 'universe-nexus-de-convergence', Halo: 'universe-halo', Alien: 'universe-alien' }[authored?.universe];
const missions = authored ? MOSAIC_CHARACTER_MISSIONS.filter(mission => mission.universe === authored.universe)
  .map(mission => ({ ...mission, districtId, anchorId: `${districtId}-core` })) : journalCases;
const currentStory = authored && missions.find(mission => mission.id === authored.id);
const hero = authored && HEROES_DB.find(item => item.id === authored.heroId);
const npcStep = authored?.steps.find(step => step.type === 'npc' && step.dialogue);
const qa = { state: null, calls: [], closed: 0, source: missions, prerequisiteId: prerequisiteCase.id, followupId: followupCase.id,
  story: authored && { id: authored.id, request: localizeCityMission(authored.request, lang), location: localizeCityMission(authored.location, lang),
    title: localizeCityMission(authored.title, lang), heroName: hero?.name, reply: localizeCityMission(npcStep?.dialogue, lang) } };
window.__contractJournalQA = qa;

export function Fixture() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('journal');
  const [replyPhase, setReplyPhase] = useState('offer');
  const [progress, setProgress] = useState(() => {
    if (!currentStory) return journalProgress({ prerequisiteComplete: params.get('prerequisite') === 'complete' });
    const records = params.get('visit') === 'legacy' ? { [currentStory.id]: journalRecord(currentStory, currentStory.steps.length,
      currentStory.steps.find(step => step.type === 'decision').choices.find(choice => choice.valid).id) } : {};
    return normalizeMosaicCharacterMissions({ lastMissionId: currentStory.id, records });
  });
  const nextAction = currentStory ? getMosaicCharacterMissionObjective(progress, currentStory, lang).text : '';
  useEffect(() => { qa.state = { open, progress, view, replyPhase, nextAction }; }, [open, progress, view, replyPhase, nextAction]);
  const conversation = hero && { ...(getMosaicResidentDialogue(hero, getCharacterPlaque(hero), lang) || { heroId: hero.id, name: hero.name, topics: [] }),
    questExchange: { missionId: currentStory.id, title: qa.story.title, line: replyPhase === 'offer' ? qa.story.request : qa.story.reply, phase: replyPhase } };
  return <>
    <GameDisplayPreferencesSync /><GameSystemMenu lang={lang} />
    <main style={{ padding: 48 }}><h1>{lang === 'fr' ? 'Recette du journal de Cité' : 'City journal verification'}</h1>
      <p>{lang === 'fr' ? 'Présentation préparée du carnet et des conversations. Aucun compte ni déplacement en ville ; les demandes et répliques du mode récit viennent des missions réelles.' : 'Prepared journal and conversation presentation. No account or City movement; story-mode requests and replies come from the actual missions.'}</p>
      <button type="button" data-testid="open-contract-journal" onClick={() => { setView('journal'); setOpen(true); }}>{lang === 'fr' ? 'Ouvrir le journal' : 'Open journal'}</button>
      {conversation && <button type="button" data-testid="open-authored-reply" onClick={() => { setView('reply'); setOpen(true); }}>{lang === 'fr' ? 'Voir la conversation préparée' : 'View the prepared conversation'}</button>}
    </main>
    <MosaicResidentConversation open={open && view === 'reply'} conversation={conversation} lang={lang}
      location={qa.story?.location} nextAction={nextAction} onClose={() => { qa.closed += 1; setOpen(false); }}
      onOpenJournal={() => setView('journal')}
      onAcceptMission={id => { qa.calls.push({ type: 'offer', id }); const result = startMosaicCharacterMission(progress, currentStory, lang); if (result.changed) { setProgress(result.progress); setReplyPhase('active'); } return result; }} />
    <ImmersiveDrawer open={open && view === 'journal'} onClose={() => { qa.closed += 1; setOpen(false); }} lang={lang} className="mosaic-terminal-drawer"
      title={lang === 'fr' ? 'Terminal de poche A.R.C.A.' : 'A.R.C.A. pocket terminal'} scrollLabel={lang === 'fr' ? 'Journal et services de la Cité' : 'City journal and services'}>
      <div className="nexus-play-copy"><MosaicCharacterMissions missions={missions} heroes={authored ? HEROES_DB : journalHeroes} lang={lang} progress={progress}
        onAccept={id => { qa.calls.push({ type: 'accept', id }); const result = startMosaicCharacterMission(progress, missions.find(item => item.id === id), lang); if (result.changed) setProgress(result.progress); return result; }}
        onApproach={id => qa.calls.push({ type: 'approach', id })}
        onResolve={(id, choice) => { qa.calls.push({ type: 'resolve', id, choice }); const result = resolveMosaicCharacterMission(progress, missions.find(item => item.id === id), choice, lang); if (result.changed) setProgress(result.progress); return result; }}
        onReplay={id => { qa.calls.push({ type: 'replay', id }); const result = restartMosaicCharacterMission(progress, missions.find(item => item.id === id), lang); if (result.changed) setProgress(result.progress); return result; }}
      /></div>
    </ImmersiveDrawer>
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Fixture /></StrictMode>);
