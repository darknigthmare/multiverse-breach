import React, { useMemo, useState } from 'react';
import { getOfficialCostumes, getOriginalCostumes, getWardrobeEffects, wardrobeActorKey,
  resolveWardrobeEffect, wardrobeSelectionStatus } from '../game/wardrobe.js';
import './CharacterWardrobe.css';

const language = lang => lang === 'fr' ? 'fr' : 'en';
export function WardrobeContents({actor,lang='fr',selectedId=null,onSelect,readOnly=false}) {
  const l=language(lang),fr=l==='fr';
  const [section,setSection]=useState('official');
  const key=wardrobeActorKey(actor);
  const official=useMemo(()=>getOfficialCostumes(actor),[actor]);
  const originals=useMemo(()=>getOriginalCostumes(actor),[actor]);
  const effects=useMemo(()=>getWardrobeEffects(actor),[actor]);
  if(!key)return null;
  const groups={official,original:originals,effects};
  const selected=wardrobeSelectionStatus(actor,selectedId);
  return <div className="character-wardrobe__body">
    <p className="character-wardrobe__notice">{fr
      ? 'Officiel décrit la provenance, pas une validation 1:1 du sprite. Les costumes sont à produire ; seuls les effets au sol sont équipables. Aucun changement de statistiques.'
      : 'Official describes provenance, not 1:1 sprite approval. Outfits still need artwork; only ground effects can be equipped. No statistic changes.'}</p>
    <div className="character-wardrobe__sections" role="group" aria-label={fr?'Catégories du vestiaire':'Wardrobe categories'}>
      {[[ 'official',fr?'Officiels':'Official',official.length ],['original',fr?'Créations Nexus':'Nexus concepts',originals.length],['effects',fr?'Effets disponibles':'Available effects',effects.length]].map(([id,label,count])=>
        <button type="button" key={id} aria-pressed={section===id} onClick={()=>setSection(id)}>{label} <span>{count}</span></button>)}
    </div>
    {section==='official' && !official.length && <p role="status">{fr
      ? 'Aucun costume officiel documenté dans cette vague pour cette identité. Recherche encore à faire : cela ne veut pas dire qu’il n’en existe pas.'
      : 'No official outfit documented for this exact identity in this wave. Research remains open; this does not mean none exist.'}</p>}
    <div className="character-wardrobe__cards">
      {groups[section].map(item=><article className="character-wardrobe__card" key={item.id}>
        <h5>{item.name[l]}</h5>
        <span className="character-wardrobe__badge">{item.nature==='procedural-effect'
          ? (fr?'Effet procédural, pas un costume':'Procedural effect, not an outfit')
          : item.origin==='OFFICIAL' ? (fr?'Source officielle — graphismes à produire':'Official source — artwork pending')
          : (fr?'Concept original — graphismes à produire':'Original concept — artwork pending')}</span>
        {item.sourceWork && <p>{item.sourceWork}</p>}
        {item.nature==='official-palette' && <p>{fr?'Variante officielle de couleurs, pas une nouvelle tenue.':'Official color variant, not a new outfit.'}</p>}
        {item.nature==='official-hairstyle' && <p>{fr?'Coiffure uniquement, pas une tenue complète.':'Hairstyle only, not a full outfit.'}</p>}
        {item.nature==='official-accessory' && <p>{fr?'Accessoire uniquement.':'Accessory only.'}</p>}
        {item.brief && <p>{item.brief[l]}</p>}
        {item.identityRule && <p className="character-wardrobe__muted">{item.identityRule[l]}</p>}
        {item.origin==='OFFICIAL' && <>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{fr?'Consulter la source officielle':'Open the official source'}</a>
          <p className="character-wardrobe__muted">{fr?item.note:'Source confirms existence; incarnation compatibility, turnaround, sprite sheet and animation review remain pending.'}</p>
        </>}
        {item.equippable && !readOnly && onSelect
          ? <button type="button" aria-pressed={selectedId===item.id} onClick={()=>{
              if(resolveWardrobeEffect(actor,item.id))onSelect(item.id);
            }}>{selectedId===item.id?(fr?'Équipé':'Equipped'):(fr?'Équiper l’effet':'Equip effect')}</button>
          : <span className="character-wardrobe__muted">{item.equippable
              ? (fr?'Consultation uniquement — pas de sélection de skin ennemi':'Read only — no enemy skin selection')
              : (fr?'Non équipable : aucune planche dédiée livrée':'Not equippable: no dedicated sheet delivered')}</span>}
      </article>)}
    </div>
    {section==='original' && <details className="character-wardrobe__contract"><summary>{fr?'Identité et réception artistique':'Identity and artwork acceptance'}</summary>
      <p>{actor.incarnation || (fr?'Incarnation à préciser avant production.':'Lock the incarnation before production.')}</p>
      <p>{actor.visualAnchor || (fr?'Référence multi-vues à fournir ; aucune morphologie humaine présumée.':'Supply a turnaround reference; humanoid anatomy is not assumed.')}</p>
      <p>{fr?'Comparer silhouette, visage/casque, vêtements, couleurs, marquages, accessoires et toutes les poses. Pour les plans communs, valider l’adaptation au corps avant génération.':'Compare silhouette, face/helmet, clothing, colors, markings, accessories and all poses. Shared briefs require body-fit approval before generation.'}</p>
    </details>}
    {!readOnly && onSelect && <div className="character-wardrobe__footer">
      <button type="button" onClick={()=>onSelect(null)}>{fr?'Revenir à l’apparence d’origine':'Restore origin appearance'}</button>
      <p>{fr?'Les effets Nexus sont désactivés dans les scènes à incarnation verrouillée.':'Nexus effects are disabled in incarnation-locked scenes.'}</p>
      {selected==='ASSET_PENDING' && <p role="status">{fr?'La sélection sauvegardée attend ses graphismes : l’apparence d’origine est utilisée.':'Saved selection needs artwork: origin appearance is used.'}</p>}
    </div>}
  </div>;
}

export default function CharacterWardrobe(props) {
  const [open,setOpen]=useState(false);
  const fr=props.lang!=='en';
  return <details className="character-wardrobe" onToggle={event=>setOpen(event.currentTarget.open)}>
    <summary>{fr?'Vestiaire : costumes et créations Nexus':'Wardrobe: outfits and Nexus concepts'}</summary>
    {open && <WardrobeContents key={wardrobeActorKey(props.actor)} {...props}/>}
  </details>;
}
