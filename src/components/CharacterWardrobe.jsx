import React, { useMemo, useState } from 'react';
import { getOfficialCostumes, getOriginalCostumes, getWardrobeEffects, getWardrobeResearchTargets,
  wardrobeActorKey, resolveWardrobeEffect, wardrobeSelectionStatus, isSafeWardrobeReference } from '../game/wardrobe.js';
import { filterWardrobeEntries } from '../game/wardrobeProduction.js';
import { getWardrobeOwnership, getWardrobeBoosterRoutes } from '../game/wardrobeBoosterRewards.js';
import { getDisciplineCostumes, resolveDisciplineCostume, DISCIPLINE_PROVENANCE_LABELS, DISCIPLINE_CATEGORY_LABELS } from '../game/disciplineSprites.js';
import './CharacterWardrobe.css';

export function WardrobeContents({actor,lang='fr',selectedId=null,onSelect,readOnly=false,inventory=[]}) {
  const l=lang==='fr'?'fr':'en',fr=l==='fr';
  const produced=useMemo(()=>getDisciplineCostumes(actor),[actor]);
  const [section,setSection]=useState(produced.length?'produced':'official');
  const [query,setQuery]=useState('');
  const key=wardrobeActorKey(actor);
  const official=useMemo(()=>getOfficialCostumes(actor),[actor]);
  const originals=useMemo(()=>getOriginalCostumes(actor),[actor]);
  const effects=useMemo(()=>getWardrobeEffects(actor),[actor]);
  const research=useMemo(()=>getWardrobeResearchTargets(actor),[actor]);
  if(!key)return null;
  const groups={produced,official,original:originals,effects};
  const visible=filterWardrobeEntries(groups[section],query);
  const selected=wardrobeSelectionStatus(actor,selectedId);
  const routes=getWardrobeBoosterRoutes(actor);
  return <div className="character-wardrobe__body">
    <p className="character-wardrobe__notice">{produced.length
      ? (fr
        ? 'Les tenues livrées utilisent des sprites statiques en pied. Leur provenance distingue les références des adaptations. Les tenues et effets disponibles sont équipables, sans changement de statistiques ; les concepts restent à produire.'
        : 'Delivered outfits use static full-body sprites. Their provenance distinguishes references from adaptations. Available outfits and effects can be equipped without statistic changes; concepts still need artwork.')
      : (fr
        ? 'Officiel décrit la provenance, pas une validation 1:1 du sprite. Les costumes sont à produire ; seuls les effets au sol sont équipables. Aucun changement de statistiques.'
        : 'Official describes provenance, not 1:1 sprite approval. Outfits still need artwork; only ground effects can be equipped. No statistic changes.')}</p>
    <div className="character-wardrobe__sections" role="group" aria-label={fr?'Catégories du vestiaire':'Wardrobe categories'}>
      {[...(produced.length?[[ 'produced',fr?'Tenues disponibles':'Available outfits',produced.length ]]:[]),[ 'official',fr?'Officiels':'Official',official.length ],['original',fr?'Créations Nexus':'Nexus concepts',originals.length],['effects',fr?'Effets disponibles':'Available effects',effects.length]].map(([id,label,count])=>
        <button type="button" key={id} aria-pressed={section===id} onClick={()=>{setSection(id);setQuery('');}}>{label} <span>{count}</span></button>)}
    </div>
    <label style={{display:'block',marginBottom:12}}>{fr?'Rechercher une tenue ou une époque':'Search an outfit or era'}
      <input type="search" value={query} maxLength={200} onChange={e=>setQuery(e.target.value)}
        style={{display:'block',width:'100%',boxSizing:'border-box',minHeight:44,font:'inherit',marginTop:5}}
        placeholder={fr?'Nom, collection, jeu…':'Name, collection, game…'}/>
    </label>
    {section==='official' && !official.length && <p role="status">{fr
      ? 'Aucun costume officiel documenté dans cette vague pour cette identité. Recherche encore à faire : cela ne veut pas dire qu’il n’en existe pas.'
      : 'No official outfit documented for this exact identity in this wave. Research remains open; this does not mean none exist.'}</p>}
    {!!groups[section].length && !visible.length && <p role="status">{fr?'Aucun résultat pour ce filtre.':'No result for this filter.'}</p>}
    <div className="character-wardrobe__cards">
      {visible.map(item=><article className="character-wardrobe__card" key={item.id}>
        <h5>{item.name[l]}</h5>
        {item.nature==='generated-static-costume' && <img className="character-wardrobe__sprite" src={item.src} alt={item.name[l]} loading="lazy" />}
        {!['procedural-effect','generated-static-costume'].includes(item.nature) && <div className="character-wardrobe__ownership">
          <strong>{getWardrobeOwnership(item,inventory)==='UNLOCKED_ARTWORK_PENDING'
            ? (fr?'Droit débloqué — graphismes à produire':'Entitlement unlocked — artwork pending')
            : (fr?'À débloquer dans les boosters correspondants':'Unlock in the matching boosters')}</strong>
          <p>{fr?'Trame du porteur':'Wearer’s universe'} : {actor.universe}.
            {' '}{fr?'Obtenu comme bonus gratuit, en plus des cinq cartes. Ne débloque pas le personnage.':'Granted as a free bonus in addition to the five cards. Does not unlock the character.'}</p>
          <details><summary>{fr?'Boosters compatibles':'Compatible boosters'}</summary><ul>{routes.map(id=><li key={id}>{id}</li>)}</ul></details>
        </div>}
        <span className="character-wardrobe__badge">{item.nature==='generated-static-costume'
          ? `${DISCIPLINE_PROVENANCE_LABELS[item.provenance][l]} · ${DISCIPLINE_CATEGORY_LABELS[item.category][l]}`
          : item.nature==='procedural-effect'
          ? (fr?'Effet procédural, pas un costume':'Procedural effect, not an outfit')
          : item.origin==='OFFICIAL' ? (fr?'Source officielle — graphismes à produire':'Official source — artwork pending')
          : (fr?'Concept original — graphismes à produire':'Original concept — artwork pending')}</span>
        {item.sourceWork && <p>{item.sourceWork}</p>}
        {item.nature==='official-palette' && <p>{fr?'Variante officielle de couleurs, pas une nouvelle tenue.':'Official color variant, not a new outfit.'}</p>}
        {item.nature==='official-hairstyle' && <p>{fr?'Coiffure uniquement, pas une tenue complète.':'Hairstyle only, not a full outfit.'}</p>}
        {item.nature==='official-model' && <p>{fr?'Modèle alternatif officiel : le porteur et ses capacités restent inchangés.':'Official alternate model: the wearer and abilities remain unchanged.'}</p>}
        {item.nature==='official-accessory' && <p>{fr?'Accessoire uniquement.':'Accessory only.'}</p>}
        {item.brief && <p>{item.brief[l]}</p>}
        {item.visualSpec && <p>{item.visualSpec[l]}</p>}
        {item.identityRule && <p className="character-wardrobe__muted">{item.identityRule[l]}</p>}
        {item.origin==='OFFICIAL' && <>
          {isSafeWardrobeReference(item.sourceUrl) && <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{fr?'Consulter la source officielle':'Open the official source'}</a>}
          <p className="character-wardrobe__muted">{fr?item.note:(item.noteEn || 'Source confirms existence; incarnation compatibility, turnaround, sprite sheet and animation review remain pending.')}</p>
        </>}
        {item.production && <details className="character-wardrobe__contract"><summary>{fr?'Fabrication et critères de réception':'Production and acceptance criteria'}</summary>
          <p>{item.production.focus[l]}</p>
          <ol>{item.production.tasks.map(t=><li key={t.key}>{t.name[l]} — {fr?'à faire':'to do'}</li>)}</ol>
          <p>{item.production.acceptance[l]}</p>
          <p>{item.production.proofRule[l]}</p>
          <dl>{item.production.fidelityCriteria.map(c=><React.Fragment key={c.key}><dt>{c.name[l]}</dt><dd>{c.max} {fr?'points — non noté':'points — not scored'}</dd></React.Fragment>)}</dl>
        </details>}
        {item.equippable && !readOnly && onSelect
          ? <button type="button" aria-pressed={selectedId===item.id} onClick={()=>{
              if(resolveWardrobeEffect(actor,item.id) || resolveDisciplineCostume(actor,item.id))onSelect(item.id);
            }}>{selectedId===item.id?(fr?'Équipé':'Equipped')
              : item.nature==='generated-static-costume'?(fr?'Équiper la tenue':'Equip outfit'):(fr?'Équiper l’effet':'Equip effect')}</button>
          : <span className="character-wardrobe__muted">{item.equippable
              ? (fr?'Consultation uniquement — pas de sélection de skin ennemi':'Read only — no enemy skin selection')
              : (fr?'Non équipable : aucune planche dédiée livrée':'Not equippable: no dedicated sheet delivered')}</span>}
      </article>)}
    </div>
    {!!research.length && <details className="character-wardrobe__contract"><summary>{fr?'Pistes non confirmées et conflits de sources':'Unconfirmed research and source conflicts'}</summary>
      {research.map(row=><div key={row.entryId}><p>{row.question[l]}</p>
        {isSafeWardrobeReference(row.sourceUrl) && <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer">{fr?'Examiner cette source':'Examine this source'}</a>}
        <p>{fr?'Cette piste n’ajoute pas un costume officiel confirmé.':'This research target does not add a confirmed official outfit.'}</p></div>)}
    </details>}
    {section==='original' && <details className="character-wardrobe__contract"><summary>{fr?'Identité et réception artistique':'Identity and artwork acceptance'}</summary>
      <p>{actor.incarnation || (fr?'Incarnation à préciser avant production.':'Lock the incarnation before production.')}</p>
      <p>{actor.visualAnchor || (fr?'Référence multi-vues à fournir ; aucune morphologie humaine présumée.':'Supply a turnaround reference; humanoid anatomy is not assumed.')}</p>
    </details>}
    {!readOnly && onSelect && <div className="character-wardrobe__footer">
      <button type="button" onClick={()=>onSelect(null)}>{fr?'Revenir à l’apparence d’origine':'Restore origin appearance'}</button>
      <p>{fr?'Les tenues et effets sélectionnés sont désactivés dans les scènes à incarnation verrouillée.':'Selected outfits and effects are disabled in incarnation-locked scenes.'}</p>
      {selected==='ASSET_PENDING' && <p role="status">{fr?'La sélection sauvegardée attend ses graphismes : l’apparence d’origine est utilisée.':'Saved selection needs artwork: origin appearance is used.'}</p>}
    </div>}
  </div>;
}

export default function CharacterWardrobe(props) {
  const [open,setOpen]=useState(false);
  const fr=props.lang!=='en';
  return <details className="character-wardrobe" onToggle={event=>{
    if(event.target===event.currentTarget)setOpen(event.currentTarget.open);
  }}>
    <summary>{fr?'Vestiaire : costumes et créations Nexus':'Wardrobe: outfits and Nexus concepts'}</summary>
    {open && <WardrobeContents key={wardrobeActorKey(props.actor)} {...props}/>}
  </details>;
}
