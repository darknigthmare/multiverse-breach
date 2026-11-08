// Isolated real scenes. Prepared ownership; no account, cloud or disk save.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MosaicCityHub, ExtinctionRoyale } from '../../src/components/HubScreen.jsx';
import { HEROES_DB } from '../../src/game/heroes.js';
import { createPlayerHero } from '../../src/game/playerHero.js';
import { MOSAIC_CHARACTER_MISSIONS, getMosaicCharacterMissionStep, localizeCityMission } from '../../src/game/mosaicCharacterMissions.js';
import { getMosaicMissionOperation } from '../../src/game/mosaicMissionOperations.js';
import { getMosaicZoneAnchor, getMosaicSceneObstacles, MOSAIC_INTERACTION_RANGE } from '../../src/game/mosaicCityRuntime.js';
import '../../src/index.css';
import './combatHarness.css';
const params = new URLSearchParams(globalThis.__sceneQaParams || location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
const mode = params.get('mode') === 'fps' ? 'fps' : 'city';
const catalog = [createPlayerHero({name:'QA'}), ...(params.get('catalog') === 'full' ? HEROES_DB
  : params.get('catalog') === 'city-contracts' ? HEROES_DB.filter(h => h.universe === 'Nexus de Convergence' || ['masterchief', 'ripley'].includes(h.id))
  : params.get('catalog') === 'nexus' ? HEROES_DB.filter(h => h.universe === 'Nexus de Convergence')
    : HEROES_DB.filter(h => ['arca_mirelle','arca_bastion','arca_nova'].includes(h.id)))];
const audit = { reports: [], services: [], saves: [], reconnaissanceSaves: [], characterMissionSaves: [], mounted: true, mode };
audit.preparedHeroIds = Object.freeze(catalog.map(hero => hero.id));
window.__sceneQA = audit;
// Test environment only: the bot fixes randomness before START, while gameplay
// remains driven by the real scene and input events. Each replay gets a fresh
// browser context. The production scene never imports this fixture.
audit.prepareReplay = seed => {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Expected a uint32 scenario seed');
  if (mode !== 'fps' || audit.state()?.phase !== 'ready') throw new Error('Seed the FPS fixture before starting the run');
  let value = seed, calls = 0;
  Math.random = () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), value | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    calls++;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
  audit.replayRandom = () => ({ algorithm: 'mulberry32-v1', seed, calls, state: value });
  return audit.replayRandom();
};
// Observe actual decoding, rather than counting requests as loaded artwork.
audit.media = [];
const NativeImage = window.Image;
window.Image = class extends NativeImage {
  set src(value) {
    const item = {src: value, loaded: false, failed: false}; audit.media.push(item);
    this.addEventListener('load', () => { item.loaded = this.naturalWidth > 0; }, {once:true});
    this.addEventListener('error', () => { item.failed = true; }, {once:true});
    super.src = value;
  }
  get src() { return super.src; }
};
// React test-only introspection avoids introducing mutable debug APIs into the game.
const getSceneFiber = () => {
  const node = document.querySelector(mode === 'city' ? '.mosaic-rpg-panel' : '.extinction-panel');
  const key = node && Object.keys(node).find(k => k.startsWith('__reactFiber$'));
  let fiber = node?.[key];
  while (fiber && fiber.type?.name !== (mode === 'city' ? 'MosaicCityHub' : 'ExtinctionRoyale')) fiber = fiber.return;
  return fiber;
};
const readSceneRef = predicate => {
  let hook = getSceneFiber()?.memoizedState;
  while (hook) {
    const value = hook.memoizedState?.current;
    if (value && predicate(value)) return value;
    hook = hook.next;
  }
  return null;
};
audit.state = () => readSceneRef(value => mode === 'city'
  ? value.player && value.camera && value.npcs : value.phase && value.enemies && 'px' in value);
audit.hudLayout = () => readSceneRef(value => value.fpsRadar && value.cityMinimap && Number.isFinite(value.unitsPerCssPixel));
audit.fpsViewLayout = () => readSceneRef(value => value.kind === 'extinction-view-layout');
// Read the actual nearby zone ref; this never chooses or moves a target.
audit.nearbyCityZone = () => {
  if (mode !== 'city') return null;
  const zone = readSceneRef(value => typeof value.id === 'string' && typeof value.action === 'string'
    && ['x', 'y', 'w', 'h'].every(key => Number.isFinite(value[key])));
  const player = audit.state()?.player;
  if (!zone || !player) return null;
  const anchor = getMosaicZoneAnchor(zone);
  return { type: 'zone', id: zone.id, action: zone.action, universe: zone.universe, ...anchor,
    range: MOSAIC_INTERACTION_RANGE.zone, distance: Math.hypot(player.x - anchor.x, player.y - anchor.y) };
};
// Observe the requested live zone, even before a remounted scene's first tick.
// React may retain the host node's previous fiber: the observer must identify
// the live obstacle memo by reference, then also match the terminal footprint.
audit.cityZone = id => {
  if (mode !== 'city' || typeof id !== 'string') return null;
  const state = audit.state(), fiber = getSceneFiber();
  if (!state?.player || !Array.isArray(state.obstacles)) return null;
  for (const candidate of [fiber, fiber?.alternate]) {
    const values = [];
    let hook = candidate?.memoizedState;
    while (hook) {
      if (Array.isArray(hook.memoizedState)) values.push(hook.memoizedState[0]);
      hook = hook.next;
    }
    if (!values.includes(state.obstacles)) continue;
    for (const value of values) {
      const zone = Array.isArray(value) && value.find(item => item?.id === id && typeof item.action === 'string'
        && typeof item.universe === 'string' && ['x', 'y', 'w', 'h'].every(key => Number.isFinite(item[key])));
      if (zone) {
        const expected = getMosaicSceneObstacles(null, [zone])[0];
        const footprint = expected && state.obstacles.find(item => ['id', 'x', 'y', 'w', 'h'].every(key => item[key] === expected[key]));
        if (footprint) {
          const anchor = getMosaicZoneAnchor(zone);
          return { type: 'zone', id: zone.id, action: zone.action, universe: zone.universe, ...anchor,
            range: MOSAIC_INTERACTION_RANGE.zone, distance: Math.hypot(state.player.x - anchor.x, state.player.y - anchor.y),
            source: 'live-zone-with-footprint', footprint: { ...footprint } };
        }
      }
    }
  }
  return null;
};
// Residents move independently. Read the requested resident before the click,
// rather than inferring its earlier location from a later dialogue snapshot.
audit.cityNpc = id => {
  if (mode !== 'city' || typeof id !== 'string') return null;
  const state = audit.state();
  const npc = Array.isArray(state?.npcs) && state.npcs.find(item => item?.hero?.id === id);
  if (!state?.player || !npc || typeof npc.hero.universe !== 'string'
    || !['x', 'y'].every(key => Number.isFinite(npc[key]) && Number.isFinite(state.player[key]))) return null;
  return { type: 'npc', id: npc.hero.id, action: 'talk', universe: npc.hero.universe,
    x: npc.x, y: npc.y, range: MOSAIC_INTERACTION_RANGE.npc,
    distance: Math.hypot(state.player.x - npc.x, state.player.y - npc.y), source: 'live-npc' };
};
// Expected identity comes from the authored contract, independently of the
// physical observation above. Step names are not a type system (return-marrow
// is a resident interaction even though it does not start with "meet-").
audit.cityContractTarget = ({ missionId, stepId, districtId } = {}) => {
  const mission = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === missionId);
  const step = mission?.steps.find(item => item.id === stepId);
  if (!step || typeof districtId !== 'string' || !districtId) return null;
  const action = { npc: 'talk', exhibit: 'exhibit', marker: 'character-mission', anchor: 'anchor' }[step.type];
  if (!action || (['npc', 'exhibit'].includes(step.type) && (typeof step.targetId !== 'string' || !step.targetId))) return null;
  const type = step.type === 'npc' ? 'npc' : 'zone';
  const id = type === 'npc' ? step.targetId : step.type === 'exhibit' ? `${districtId}::exhibit::${step.targetId}`
    : step.type === 'anchor' ? `${districtId}-core` : `${mission.id}::${step.id}`;
  return { type, id, action, universe: mission.universe, range: MOSAIC_INTERACTION_RANGE[type] };
};
// Capture the effective authored operation before interaction. Branches are
// resolved from the already committed record; this observer writes no state,
// creates no receipt and does not infer success from the rendered object.
audit.cityContractOperation = ({ missionId, stepId, districtId } = {}) => {
  if (mode !== 'city' || typeof districtId !== 'string' || !districtId) return null;
  const source = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === missionId);
  const index = source?.steps.findIndex(step => step.id === stepId);
  if (!source || index < 0) return null;
  const mission = { ...source, districtId, anchorId: `${districtId}-core` };
  const step = getMosaicCharacterMissionStep(audit.characterMissions, mission, index);
  const operation = getMosaicMissionOperation(step);
  const target = audit.cityContractTarget({ missionId, stepId, districtId });
  if (!operation || !target) return null;
  const saved = audit.characterMissions?.records?.[missionId];
  return { missionId, stepId, index, districtId, universe: mission.universe, sourceType: step.type,
    targetId: target.id, kind: operation.kind, x: step.type === 'marker' ? step.x : null,
    y: step.type === 'marker' ? step.y : null, label: localizeCityMission(operation.label, lang),
    propName: localizeCityMission(operation.propName, lang), completedText: localizeCityMission(operation.completedText, lang),
    originChoiceId: saved?.originChoiceId || null, choiceId: saved?.choiceId || null,
    originStoryRevision: mission.requiresMissionId ? saved?.originStoryRevision || 1 : null,
    branchChoiceId: step.byChoice ? saved?.choiceId || null : null, source: 'effective-mission-step' };
};
audit.snapshot = () => {
  const s = audit.state(); if (!s) return null;
  return mode === 'city' ? {t:s.t, player:{...s.player}, camera:{...s.camera}, keys:{...s.keys}, destination:s.destination,
    npcs:s.npcs.map(n=>({id:n.hero.id,x:n.x,y:n.y})), missionObjects: structuredClone(s.missionObjects || [])}
    : {phase:s.phase, runId:s.runId,t:s.t,hp:s.hp,ammo:s.ammo,px:s.px,py:s.py,angle:s.angle,keys:{...s.moveKeys}, result:s.result};
};
audit.failRender = () => {
  const canvas=document.querySelector(mode === 'city' ? '.mosaic-rpg-canvas' : '.fps-royale-canvas');
  const ctx=canvas.getContext('2d'), original=ctx.fillRect;
  ctx.fillRect=function(){ ctx.fillRect=original; throw new Error('QA intentional scene draw failure'); };
};
export function Harness(){
  const [paused,setPaused]=useState(false), [dedicated,setDedicated]=useState(mode==='city');
  const [mounted,setMounted]=useState(true), [revision,setRevision]=useState(0);
  const [saved,setSaved]=useState(null), [guide,setGuide]=useState(null);
  const [reconnaissance,setReconnaissance]=useState(null);
  const [characterMissions,setCharacterMissions]=useState(null);
  const [exit,setExit]=useState(0);
  audit.remount=()=>setMounted(true);audit.revision=revision;audit.saved=saved;
  audit.reconnaissance=reconnaissance;
  audit.characterMissions=characterMissions;
  // Test-only prepared entry points; production has no writable QA hook.
  audit.setLocation=location=>setSaved(location);
  const service=(name,universe)=>{audit.services.push({service:name,universe,savedAtNavigation:audit.saves.at(-1)});setMounted(false);};
  const props={lang,heroes:catalog.map(h=>({...h,stats:{...h.stats}})),unlockedHeroes:params.get('owned') === 'none' ? [] : catalog.map(h=>h.id),sessionPaused:paused,sessionExitRequest:exit,
    onSessionEnd:r=>{audit.reports.push(r);if(r.reason!=='completed')setDedicated(false);}};
  return <><header className="combat-qa-toolbar" style={{zIndex:200}}><p>QA — prepared profile; no real save.</p>
    <button id="qa-render" onClick={()=>setRevision(v=>v+1)}>Render</button><button id="qa-pause" onClick={()=>setPaused(v=>!v)}>Pause</button>
    <button id="qa-unmount" onClick={()=>{setMounted(false);audit.mounted=false;}}>Unmount</button>
    <button id="qa-exit" onClick={()=>setExit(v=>v+1)}>Exit</button></header>
    <main className={`hub-screen ${dedicated?'is-dedicated-game':''}`} style={{paddingTop:60}}>
    {mounted && (mode==='city'?<MosaicCityHub {...props} completedStages={[]} stages={[]} playerProfile={{name:'QA'}} tutorialProgress={guide}
      reconnaissanceProgress={reconnaissance} onReconnaissanceProgress={v=>{audit.reconnaissanceSaves.push(structuredClone(v));setReconnaissance(v);}}
      characterMissionProgress={characterMissions} onCharacterMissionProgress={v=>{audit.characterMissionSaves.push(structuredClone(v));setCharacterMissions(v);}}
      onTutorialProgress={v=>setGuide(v)} savedLocation={saved} onLocationChange={v=>{audit.saves.push(v);setSaved(v);}}
      onOpenMissions={u=>service('missions',u)} onOpenCodex={u=>service('codex',u)}
      onOpenService={(name,u)=>service(name,u)}/>
      :<ExtinctionRoyale {...props} onSessionStart={()=>setDedicated(true)} career={{runs:0}}/>)}</main></>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness/></StrictMode>);
