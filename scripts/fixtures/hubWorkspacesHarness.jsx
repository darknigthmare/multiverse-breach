// Actual production Hub and production catalogues. Only initial ownership and
// parent save state are prepared; actions use the ordinary Hub callbacks.
import React, { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import HubScreen from '../../src/components/HubScreen.jsx';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB } from '../../src/game/heroes.js';
import { PROFILE_TITLE_CATALOG } from '../../src/game/universeUnlockables.js';
import '../../src/index.css';

const params = new URLSearchParams(location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
document.documentElement.lang = lang;
const allowedTabs = ['inventory', 'shop', 'party', 'roster', 'codex', 'anchorProfile', 'admin'];
const initialTab = allowedTabs.includes(params.get('tab')) ? params.get('tab') : 'inventory';
const owned = params.get('owned') === 'none' ? [] : ['player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova', 'cloud_ff7'];
const relics = EQUIP_ITEMS_DB.slice(0, 4).map(item => item.id);
const events = Object.values(EVENT_ITEMS_DB).slice(0, 2).map(item => item.id);
const initialModel = {
  gold: 50000, breachShards: 400, eventTokens: params.get('funds') === 'empty' ? 0 : 120, unlockedHeroes: owned,
  heroLevels: {}, activeTeam: owned.slice(0, 3), inventory: [...relics, ...events],
  equippedGear: {}, equippedEventItems: {}, heroTalents: {}, heroSkins: {},
  activityProgress: {}, portalCollection: params.get('rewards') === 'owned' ? { profileTitles: PROFILE_TITLE_CATALOG.slice(0, 2).map(item => item.id) } : {}, publicProfile: {}, hiddenUniverses: [], disabledAssets: {}
};
const audit = { changes: [], launches: [], portalVisits: 0, initialTab, lang };
window.__hubQA = audit;

function Harness() {
  const [model, setModel] = useState(initialModel);
  const previousModel = useRef(initialModel);
  const setters = useMemo(() => Object.fromEntries(Object.keys(initialModel).map(key => [
    `set${key[0].toUpperCase()}${key.slice(1)}`,
    update => setModel(previous => {
      const value = typeof update === 'function' ? update(previous[key]) : update;
      return { ...previous, [key]: value };
    })
  ])), []);
  useEffect(() => {
    for (const key of Object.keys(initialModel)) {
      if (model[key] !== previousModel.current[key]) {
        audit.changes.push({ key, before: structuredClone(previousModel.current[key]), after: structuredClone(model[key]) });
      }
    }
    previousModel.current = model;
  }, [model]);
  audit.model = model;
  return <HubScreen lang={lang} initialTab={initialTab} {...model} {...setters}
    playerProfile={{ name: 'Ancre QA' }} completedStages={[]}
    audioSettings={{ muted: true, musicVolume: 0, sfxVolume: 0 }}
    onChangeAudioSetting={() => {}} onToggleMute={() => {}}
    onLaunchStage={stage => audit.launches.push(stage.id)}
    onGoToPortal={() => { audit.portalVisits++; }} />;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
