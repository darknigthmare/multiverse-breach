// Isolated real scenes. Prepared ownership; no account, cloud or disk save.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MosaicCityHub, ExtinctionRoyale } from '../../src/components/HubScreen.jsx';
import { HEROES_DB } from '../../src/game/heroes.js';
import { createPlayerHero } from '../../src/game/playerHero.js';
import '../../src/index.css';
import './combatHarness.css';
const params = new URLSearchParams(globalThis.__sceneQaParams || location.search);
const lang = params.get('lang') === 'en' ? 'en' : 'fr';
const mode = params.get('mode') === 'fps' ? 'fps' : 'city';
const catalog = [createPlayerHero({name:'QA'}), ...(params.get('catalog') === 'full' ? HEROES_DB : HEROES_DB.filter(h => ['arca_mirelle','arca_bastion','arca_nova'].includes(h.id)))];
const audit = { reports: [], services: [], saves: [], mounted: true, mode };
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
audit.state = () => {
  const node = document.querySelector(mode === 'city' ? '.mosaic-rpg-panel' : '.extinction-panel');
  const key = node && Object.keys(node).find(k => k.startsWith('__reactFiber$'));
  let fiber = node?.[key];
  while (fiber && fiber.type?.name !== (mode === 'city' ? 'MosaicCityHub' : 'ExtinctionRoyale')) fiber = fiber.return;
  let hook = fiber?.memoizedState;
  while (hook) {
    const value = hook.memoizedState?.current;
    if (value && (mode === 'city' ? value.player && value.camera && value.npcs : value.phase && value.enemies && 'px' in value)) return value;
    hook = hook.next;
  }
  return null;
};
audit.snapshot = () => {
  const s = audit.state(); if (!s) return null;
  return mode === 'city' ? {t:s.t, player:{...s.player}, camera:{...s.camera}, keys:{...s.keys}, destination:s.destination, npcs:s.npcs.map(n=>({id:n.hero.id,x:n.x,y:n.y}))}
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
  const [exit,setExit]=useState(0);
  audit.remount=()=>setMounted(true);audit.revision=revision;audit.saved=saved;
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
      onTutorialProgress={v=>setGuide(v)} savedLocation={saved} onLocationChange={v=>{audit.saves.push(v);setSaved(v);}}
      onOpenMissions={u=>service('missions',u)} onOpenCodex={u=>service('codex',u)}
      onOpenService={(name,u)=>service(name,u)}/>
      :<ExtinctionRoyale {...props} onSessionStart={()=>setDedicated(true)} career={{runs:0}}/>)}</main></>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness/></StrictMode>);
