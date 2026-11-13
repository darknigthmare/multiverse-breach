// Isolated QA entry: actual GameCanvas, EngineTactics, controls and art loaders.
// No production debug hook, prepared mission progress or injected victory.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../src/game/engineTactics.js';
import { SOURCE_SCENE_STAGES, getSourceSceneCompanionCell } from '../../src/game/sourceSceneStages.js';
import { sourceSceneRoute } from '../../src/game/sourceSceneEncounter.js';
import { getSourceSceneBackdropArt } from '../../src/game/sourceSceneArtAssets.js';
import { getSourceSceneMaskedFeralSprite } from '../../src/game/sourceSceneThreatAssets.js';
import { NARU_PREY_PORTRAIT_ART } from '../../src/game/sourceScenePreyPortraitAssets.js';
import { PREY_BONE_MASK_FRONT_ART, getSourceSceneBoneMaskArt } from '../../src/game/sourceScenePreyPropAssets.js';
import '../../src/index.css';
import './combatHarness.css';

const query = new URLSearchParams(location.search);
const stage = SOURCE_SCENE_STAGES.find(s => s.id === Number(query.get('stage') || 50106));
if (!stage || ![50104, 50105, 50106].includes(stage.id)) throw new Error('Unknown source-art QA stage');
const team = [stage.sceneLead.id];
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const audit = { engine: null, results: [], draws: {}, frame: 0, updates: 0, anomalyMessages: [], initialStorage: JSON.stringify(Object.entries(localStorage)) };
window.__sourceSceneArtAudit = audit;
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) { audit.engine = this; audit.updates++; return update.apply(this, args); };
const draw = EngineTactics.prototype.draw;
EngineTactics.prototype.draw = function (...args) { audit.frame++; return draw.apply(this, args); };
const drawImage = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
  const src = image?.currentSrc || image?.src || '';
  if (src.includes('/source-scenes/') || src.includes('feral-predator')) {
    const path = new URL(src, location.href).pathname;
    const prior = audit.draws[path] || { calls: 0 };
    const callsInFrame = prior.lastFrame === audit.frame ? prior.callsInFrame + 1 : 1;
    audit.draws[path] = { calls: prior.calls + 1, lastFrame: audit.frame, callsInFrame,
      maxCallsInFrame: Math.max(prior.maxCallsInFrame || 0, callsInFrame), lastArgs: args };
  }
  return drawImage.call(this, image, ...args);
};
new MutationObserver(() => {
  for (const toast of document.querySelectorAll('.combat-anomaly-toast')) {
    const message = toast.textContent.trim();
    if (message && !audit.anomalyMessages.includes(message)) audit.anomalyMessages.push(message);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
audit.snapshot = () => {
  const engine = audit.engine, scene = engine?.sourceScene;
  const companion = scene?.definition.field.props.find(p => p.id === 'sarii');
  return {
    stageId: stage.id, backdrop: getSourceSceneBackdropArt(stage), draws: audit.draws,
    updates: audit.updates, anomalyMessages: audit.anomalyMessages,
    actor: scene?.actor ? { id: scene.actor.id, gridX: scene.actor.gridX, gridY: scene.actor.gridY,
      currentHp: scene.actor.currentHp, maxHp: scene.actor.maxHp } : null,
    companion: companion ? getSourceSceneCompanionCell(scene, companion) : null,
    maskedThreat: getSourceSceneMaskedFeralSprite(scene),
    additionalArt: { naruPortrait: NARU_PREY_PORTRAIT_ART.path, boneMask: PREY_BONE_MASK_FRONT_ART.path,
      boneMaskRole: getSourceSceneBoneMaskArt(scene, 'carried') ? 'carried'
        : getSourceSceneBoneMaskArt(scene, 'mounted') ? 'mounted' : null },
    source: engine?.getSourceSceneState(), nativeCommandAvailable: engine?.canCommandActiveUnit(),
    turnPhase: engine?.actionPhase, movementRemaining: engine ? engine.movementBudget - engine.movementSpent : null,
    disposed: engine?.disposed, resultCount: audit.results.length,
    storageIntact: JSON.stringify(Object.entries(localStorage)) === audit.initialStorage
  };
};
audit.routeTo = cell => sourceSceneRoute(audit.engine, cell);

function Harness() {
  const [paused, setPaused] = useState(false), [mounted, setMounted] = useState(true);
  return <>
    <header className="combat-qa-toolbar">
      <span>QA {stage.id}: native source scene, scoped reference art; film geometry unverified.</span>
      <button id="qa-pause" onClick={() => setPaused(value => !value)}>{paused ? 'Resume QA' : 'Pause QA'}</button>
      <button id="qa-unmount" onClick={() => setMounted(false)}>Unmount QA</button>
    </header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA' }} activeTeam={team} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      sessionPaused={paused} onBattleEnd={(...result) => audit.results.push(result)}
      onSessionComplete={(...result) => audit.results.push(result)} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
