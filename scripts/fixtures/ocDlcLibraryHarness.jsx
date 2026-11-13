// Actual Hub/library and catalogue. Parent state is prepared before mounting;
// reserve and briefing actions remain the ordinary Hub callbacks.
import React, { StrictMode, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import HubScreen from '../../src/components/HubScreen.jsx';
import { OC_DLC_PACKS } from '../../src/game/ocDlcPacks.js';
import { OC_DLC_SAVE_METADATA } from '../../src/game/dlcContentIdentity.js';
import '../../src/index.css';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const completedStages = params.get('progress') === 'completed'
  ? [...(OC_DLC_SAVE_METADATA[0]?.missionIds || [])] : params.get('progress') === 'partial' ? [47001] : [];
const initial = { gold: 50000, breachShards: 400, eventTokens: 120,
  unlockedHeroes: ['player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova', ...OC_DLC_PACKS.flatMap(pack => pack.heroes.map(hero => hero.id))],
  heroLevels: {}, activeTeam: ['player_anchor', 'arca_mirelle', 'arca_bastion'], inventory: [],
  equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {}, activityProgress: {},
  portalCollection: {}, publicProfile: {}, hiddenUniverses: params.get('reserve') === 'all' ? OC_DLC_SAVE_METADATA.map(pack => pack.universe) : [], disabledAssets: {} };
const audit = { initial: structuredClone(initial), model: initial, completedStages, launches: [], changes: [] };
window.__ocLibraryQA = audit;

function Harness() {
  const [model, setModel] = useState(initial);
  const navigation = useRef({ activeTab: 'missions', missionScreen: 'ocDlc', missionWorkspaceView: 'library' });
  const setters = useMemo(() => Object.fromEntries(Object.keys(initial).map(key => [
    `set${key[0].toUpperCase()}${key.slice(1)}`, update => setModel(previous => {
      const value = typeof update === 'function' ? update(previous[key]) : update;
      audit.changes.push({ key, before: structuredClone(previous[key]), after: structuredClone(value) });
      return { ...previous, [key]: value };
    })
  ])), []);
  audit.model = model;
  audit.navigationRef = navigation;
  return <HubScreen lang={lang} initialTab="missions" hubNavigationRef={navigation} {...model} {...setters}
    playerProfile={{ name: 'Ancre QA' }} completedStages={completedStages}
    audioSettings={{ muted: true, musicVolume: 0, sfxVolume: 0 }}
    onChangeAudioSetting={() => {}} onToggleMute={() => {}}
    onLaunchStage={stage => audit.launches.push(stage.id)} onGoToPortal={() => {}} />;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
