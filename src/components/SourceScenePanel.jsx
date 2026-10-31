import React from 'react';
import './SourceScenePanel.css';
const cellName=cell=>`${String.fromCharCode(65+cell.x)}${cell.y+1}`;
export default function SourceScenePanel({scene,lang='fr',locked=false,onCommand}) {
  if(!scene)return null;
  const fr=lang==='fr',language=fr?'fr':'en';
  const reason={position:fr?'Rejoindre la case':'Reach this cell',prerequisite:fr?'Étapes préalables requises':'Prerequisites required',inactive:fr?'Commandes indisponibles':'Commands unavailable',empty:fr?'Indisponible / épuisé':'Unavailable / exhausted',done:fr?'Terminé':'Done'};
  return <section className="source-scene-panel" aria-label={scene.name[language]}>
    <h3>{scene.name[language]}</h3>
    <p>{scene.objective[language].objective}</p>
    {scene.sourceBeat?.[language]&&<p className="source-scene-beat" aria-live="polite">{scene.sourceBeat[language]}</p>}
    <p className="source-scene-status" aria-live="polite">
      {scene.complete?(fr?'Objectif terminé':'Objective complete'):scene.failed?(fr?'Rencontre échouée':'Encounter failed'):
        `${fr?'Étapes':'Steps'} ${scene.progress}/${scene.target} · ${fr?'Tours':'Turns'} ${scene.turns}/${scene.turnLimit}`}
      {!scene.complete&&!scene.failed&&scene.danger.length>0&&<span> · {fr?'Danger à la fin du tour':'Danger at turn end'} : {scene.danger.map(cellName).join(', ')}</span>}
      {!scene.complete&&!scene.failed&&scene.thermalConcealment&&<span> · {fr?'Camouflage thermique : actif':'Thermal concealment: active'}</span>}
      {!scene.complete&&!scene.failed&&typeof scene.escapeTurnsRemaining==='number'&&<span> · {scene.countdownLabel?.[language]|| (fr?'AUTODESTRUCTION':'SELF-DESTRUCT')} : {scene.escapeTurnsRemaining} {fr?'fins de tour':'turn endings'}</span>}
    </p>
    <div className="source-scene-commands">
      {scene.commands.map(c=><button key={c.id} type="button" disabled={locked||!c.enabled}
        onClick={()=>onCommand(c.id,scene.turnToken)} title={reason[c.reason]||c.label[language]}>
        <strong>{c.done?'✓ ':''}{c.label[language]}</strong>
        <span>{c.anywhere?`${fr?'Diversions restantes':'Decoys remaining'} : ${scene.decoys}`:`${fr?'Case':'Cell'} ${cellName(c.cell)}`}</span>
        {!c.enabled&&!c.done&&<span>{reason[c.reason]||''}</span>}
      </button>)}
    </div>
    <details><summary>{fr?'Adaptation et limites de fidélité':'Adaptation and fidelity limits'}</summary>
      <p>{scene.objective[language].adaptation}</p></details>
  </section>;
}
