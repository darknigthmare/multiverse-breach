import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES_DB as BASE_HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB, SYNERGIES_DB } from '../game/heroes';
import { getTranslation } from '../game/translation';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import sound from '../game/soundEngine';
import { CORE_CODEX_ENTRIES, LORE_DB, NARRATIVE_ACTS } from '../game/lore';
import { ENEMIES_DB, getFinalGameBoss } from '../game/enemies';
import { EXPANDED_EVENT_SHOP_ITEMS, EXPANDED_FACTION_UNIVERSES, EXPANDED_STAGE_ID_BY_UNIVERSE, getExpandedStages } from '../game/expandedUniverses';
import { getCharacterPlaque } from '../game/characterPlaques';
import { createPlayerHero } from '../game/playerHero';
import { ARC_CAMPAIGN_DETAILS, CHARACTER_NARRATIVE_ARCS, FUSION_MISSIONS, META_NEXUS_RECOMMENDATIONS, REPUTATION_TRACKS, SKIN_CATALOG, SPECIAL_EVENTS, TRIO_NARRATIVE_ARCS, UNIVERSE_NARRATIVE_ARCS } from '../game/narrativeSystems';
import { getEnemySpriteSheetSrc, getHeroCompleteSpritePack, getHeroSpriteSheetSrc, getItemSpriteSrc, MIRELLE_COMPLETE_SPRITES } from '../game/spriteAssets';
import { getBattleItemsForUniverse } from '../game/battleItems';
import { getBattleItemLoreDescription, getEnemyLoreDescription, getEventLoreDescription, getGearLoreDescription, getStageLoreDescription, getUniverseLoreDescription } from '../game/loreDescriptions';
import spriteManifest from '../../public/sprites/generated/sprite-manifest.json';
import { DEFAULT_HIDDEN_UNIVERSES, isBaseGameUniverse } from '../game/dlcConfig';
import RaceMode from './RaceMode';

const ARC_UNLOCK_RULES = {
  personalMinLevel: 3,
  universeMinHeroes: 3,
  universeMinLevel: 4,
  trioMinLevel: 5
};

const getLocalizedText = (entry, lang, fallback = '') => {
  if (!entry) return fallback;
  if (typeof entry === 'string') return entry;
  return entry[lang] || entry.fr || entry.en || fallback;
};

const getUniverseHubId = universe => `universe-${String(universe || 'nexus').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'nexus'}`;

const getUniverseHubColor = universe => {
  const hue = [...String(universe || 'Nexus')].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  return `hsl(${hue} 70% 52%)`;
};

const UNIVERSE_HUB_PLACES = {
  'Resident Evil': { fr: 'Raccoon City', en: 'Raccoon City', mood: 'rues contaminees, barricades R.P.D., pharmacies pillees', type: 'city' },
  Halo: { fr: 'Avant-poste UNSC', en: 'UNSC Outpost', mood: 'hangars blindes, balises Forerunner, silhouettes de dropship', type: 'military' },
  'Half-Life': { fr: 'Secteur Black Mesa', en: 'Black Mesa Sector', mood: 'labos coupes, conduits HEV, resonances oranges', type: 'lab' },
  Stargate: { fr: 'Salle de Porte SGC', en: 'SGC Gate Room', mood: 'rampe metallique, chevrons actifs, consoles A.R.C.A.', type: 'gate' },
  'Silent Hill': { fr: 'Quartier Brumeux', en: 'Fog District', mood: 'asphalte humide, sirenes lointaines, enseignes eteintes', type: 'fog' },
  Doom: { fr: 'Bastion UAC', en: 'UAC Bastion', mood: 'acier rouge, runes chaudes, sas de confinement', type: 'industrial' },
  'Metal Gear': { fr: 'Plateforme Shadow Moses', en: 'Shadow Moses Platform', mood: 'neige tactique, caisses militaires, radars brouilles', type: 'military' },
  'Final Fantasy VII': { fr: 'Secteur Mako', en: 'Mako Sector', mood: 'reacteurs verts, rails suspendus, fumee industrielle', type: 'reactor' },
  'Tomb Raider': { fr: 'Crypte de la Relique', en: 'Relic Crypt', mood: 'pierres anciennes, torches basses, pieges scelles', type: 'ruins' },
  'Spider-Man PS1': { fr: 'Toits de Manhattan', en: 'Manhattan Rooftops', mood: 'toits plats, antennes, panneaux lumineux', type: 'rooftop' },
  'The Simpsons': { fr: 'Rue de Springfield', en: 'Springfield Street', mood: 'maisons colorees, centrale au loin, enseignes absurdes', type: 'suburb' },
  Futurama: { fr: 'New New York', en: 'New New York', mood: 'tubes de transport, neons, livraisons orbitales', type: 'futureCity' }
};

const getUniverseHubPlace = (universe, lang = 'fr') => {
  const direct = UNIVERSE_HUB_PLACES[universe];
  if (direct) return { ...direct, name: direct[lang] || direct.fr || direct.en };
  const lower = String(universe || '').toLowerCase();
  if (lower.includes('stargate')) return { ...UNIVERSE_HUB_PLACES.Stargate, name: lang === 'fr' ? `Salle de Porte ${universe}` : `${universe} Gate Room` };
  if (lower.includes('final fantasy')) return { ...UNIVERSE_HUB_PLACES['Final Fantasy VII'], name: lang === 'fr' ? `District Cristal ${universe}` : `${universe} Crystal District` };
  if (lower.includes('resident')) return { ...UNIVERSE_HUB_PLACES['Resident Evil'], name: 'Raccoon City' };
  return {
    name: lang === 'fr' ? `Quartier ${universe || 'Nexus'}` : `${universe || 'Nexus'} District`,
    mood: lang === 'fr' ? 'decor reconstruit par la Trame, balises A.R.C.A. et fragments locaux' : 'Thread-built scenery, A.R.C.A. beacons, and local fragments',
    type: 'generic'
  };
};

const getArcUniverses = (arc, allHeroes = []) => {
  if (Array.isArray(arc?.universes) && arc.universes.length) return arc.universes;
  const hero = allHeroes.find(item => item.id === arc?.heroId);
  return hero?.universe ? [hero.universe] : ['Nexus de Convergence'];
};

const getLinkedStagesForArc = (arc, allStages = [], allHeroes = []) => {
  const arcStage = allStages.find(stage => stage.id === arc?.stageId || stage.universeArc?.id === arc?.id || stage.characterArc?.id === arc?.id || stage.trioArc?.id === arc?.id);
  const universes = new Set(getArcUniverses(arc, allHeroes));
  const worldStages = allStages
    .filter(stage => stage.id !== 38)
    .filter(stage => !stage.universeArc && !stage.characterArc && !stage.trioArc && !stage.fusionMission)
    .filter(stage => universes.has(stage.universe) || stage.sourceUniverses?.some(source => universes.has(source)))
    .sort((a, b) => a.id - b.id);
  const ordered = [...worldStages.slice(0, Math.max(3, arc?.missions?.length || 3))];
  if (arcStage && !ordered.some(stage => stage.id === arcStage.id)) ordered.push(arcStage);
  return ordered;
};

const buildArcTimeline = (arc, linkedStages = [], completedStages = [], lang = 'fr') => {
  const missions = Array.isArray(arc?.missions) && arc.missions.length ? arc.missions : [];
  const bossStage = linkedStages.find(stage => stage.id === arc?.stageId) || linkedStages[linkedStages.length - 1];
  const bossName = arc?.bossName || bossStage?.bossName;
  const bossCompleted = bossStage ? completedStages.includes(bossStage.id) : false;
  const nodes = [
    {
      type: 'intro',
      label: lang === 'fr' ? 'INTRO' : 'INTRO',
      text: getLocalizedText(arc?.intro, lang),
      status: completedStages.some(stageId => linkedStages.some(stage => stage.id === stageId)) ? 'done' : 'active'
    }
  ];

  missions.forEach((mission, index) => {
    const stage = linkedStages[index] || bossStage;
    const missionDone = stage ? completedStages.includes(stage.id) : false;
    nodes.push({
      type: 'mission',
      label: `${lang === 'fr' ? 'MISSION' : 'MISSION'} ${index + 1}`,
      text: getLocalizedText(mission, lang),
      stage,
      status: missionDone ? 'done' : 'active'
    });
    if (index < missions.length - 1) {
      nodes.push({
        type: 'interlude',
        label: lang === 'fr' ? 'INTERLUDE' : 'INTERLUDE',
        text: lang === 'fr'
          ? `A.R.C.A. recale les coordonnees de ${stage?.universe || getArcUniverses(arc)[0]} avant l ouverture suivante.`
          : `A.R.C.A. recalibrates ${stage?.universe || getArcUniverses(arc)[0]} coordinates before the next opening.`,
        status: missionDone ? 'done' : 'locked'
      });
    }
  });

  if (bossName) {
    nodes.push({
      type: 'bossIntro',
      label: lang === 'fr' ? 'INTRO BOSS' : 'BOSS INTRO',
      text: lang === 'fr'
        ? `Le noyau de l arc se manifeste: ${bossName}. La Trame cesse de fuir et choisit un champion.`
        : `The arc core manifests: ${bossName}. The Thread stops leaking and chooses a champion.`,
      stage: bossStage,
      status: missions.every((_, index) => {
        const stage = linkedStages[index];
        return !stage || completedStages.includes(stage.id);
      }) ? 'active' : 'locked'
    });
    nodes.push({
      type: 'boss',
      label: lang === 'fr' ? 'BOSS' : 'BOSS',
      text: lang === 'fr'
        ? `Affronter ${bossName} pour sceller la consequence majeure de l arc.`
        : `Face ${bossName} to seal the arc major consequence.`,
      stage: bossStage,
      status: bossCompleted ? 'done' : 'active'
    });
  }

  nodes.push({
    type: 'outro',
    label: lang === 'fr' ? 'OUTRO' : 'OUTRO',
    text: getLocalizedText(arc?.outro, lang, getLocalizedText(arc?.reward, lang)),
    status: bossName ? (bossCompleted ? 'done' : 'locked') : (nodes.some(node => node.type === 'mission' && node.status !== 'done') ? 'locked' : 'done')
  });

  return nodes;
};

function NarrativeArcSequencePanel({ lang, arcs, stages, completedStages, onSelectStage }) {
  if (!arcs?.length) return null;
  return (
    <div style={{
      padding: '14px',
      marginBottom: '14px',
      border: '1px solid rgba(255,177,92,0.24)',
      background: 'rgba(255,177,92,0.055)',
      borderRadius: '5px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#ffb15c', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {lang === 'fr' ? 'Routes narratives liees a la carte' : 'Map-linked narrative routes'}
          </div>
          <div style={{ fontSize: '10px', color: '#d8c5af', lineHeight: 1.35, marginTop: '3px' }}>
            {lang === 'fr'
              ? 'Un arc n est plus une mission isolee: intro, missions, interludes, intro boss, boss puis sortie. Les noeuds mission/boss ouvrent leur faille associee.'
              : 'An arc is no longer a single mission: intro, missions, interludes, boss intro, boss, then outro. Mission/boss nodes open their linked rift.'}
          </div>
        </div>
        <span style={{ color: '#ffeb3b', fontSize: '10px' }}>{arcs.length} {lang === 'fr' ? 'arcs visibles' : 'visible arcs'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '10px' }}>
        {arcs.map(arc => {
          const linkedStages = getLinkedStagesForArc(arc, stages, BASE_HEROES_DB);
          const timeline = buildArcTimeline(arc, linkedStages, completedStages, lang);
          const doneCount = timeline.filter(node => node.status === 'done').length;
          const ratio = timeline.length ? doneCount / timeline.length : 0;
          return (
            <div key={arc.id} style={{ padding: '11px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '7px' }}>
                <strong style={{ color: ratio >= 1 ? '#2ecc71' : '#ffb15c', fontSize: '11px' }}>{getLocalizedText(arc.title, lang, arc.id)}</strong>
                <span style={{ color: '#ffeb3b', fontSize: '9px' }}>{doneCount}/{timeline.length}</span>
              </div>
              <div style={{ height: '5px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: ratio >= 1 ? '#2ecc71' : '#ffb15c' }} />
              </div>
              <div style={{ display: 'grid', gap: '5px' }}>
                {timeline.map((node, index) => {
                  const clickable = node.stage && onSelectStage;
                  const color = node.status === 'done' ? '#2ecc71' : node.status === 'locked' ? '#666' : node.type.includes('boss') ? '#e74c3c' : '#39c5bb';
                  return (
                    <button
                      key={`${arc.id}-${node.type}-${index}`}
                      type="button"
                      disabled={!clickable}
                      onClick={() => clickable && onSelectStage(node.stage)}
                      className="btn-retro"
                      style={{
                        textAlign: 'left',
                        borderColor: color,
                        color,
                        background: node.status === 'done' ? 'rgba(46,204,113,0.07)' : node.status === 'locked' ? 'rgba(255,255,255,0.015)' : 'rgba(57,197,187,0.05)',
                        padding: '7px',
                        fontSize: '9px',
                        lineHeight: 1.3,
                        cursor: clickable ? 'pointer' : 'default'
                      }}
                    >
                      <b>{node.label}</b>{node.stage ? ` #${node.stage.id}` : ''} - {node.text}
                    </button>
                  );
                })}
              </div>
              <div style={{ color: '#ffeb3b', fontSize: '9px', marginTop: '7px', lineHeight: 1.3 }}>
                {lang === 'fr' ? 'Recompense' : 'Reward'}: {getLocalizedText(arc.reward, lang, getLocalizedText(arc.rewardItemName, lang, 'Trace Nexus'))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NarrativeArcGroupBrowser({
  lang,
  groups,
  selectedGroupId,
  onSelectGroup,
  onBackToGroups,
  onOpenArc,
  stages,
  completedStages,
  categoryColor = '#ffb15c',
  getStageUnlockRequirementText
}) {
  const [groupQuery, setGroupQuery] = useState('');
  const normalizedGroupQuery = groupQuery.trim().toLowerCase();
  const filteredGroups = normalizedGroupQuery
    ? groups.filter(group => [group.label, group.desc, group.kicker, group.primaryUniverse]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(normalizedGroupQuery)))
    : groups;
  const visibleGroups = filteredGroups.slice(0, 120);
  const selectedGroup = groups.find(group => group.id === selectedGroupId) || null;
  const getPrimaryArcStage = (arc) => (
    stages.find(stage => stage.universeArc?.id === arc?.id || stage.characterArc?.id === arc?.id || stage.trioArc?.id === arc?.id)
    || getLinkedStagesForArc(arc, stages, BASE_HEROES_DB)[0]
  );

  if (!selectedGroup) {
    return (
      <div className="arc-browser-shell" style={{ '--arc-browser-color': categoryColor }}>
        <div className="arc-browser-head">
          <div>
            <div className="portal-focus-kicker">
              {lang === 'fr' ? 'CARTE DE LECTURE A.R.C.A.' : 'A.R.C.A. READING MAP'}
            </div>
            <h4>{lang === 'fr' ? 'Choisir une vue narrative' : 'Choose a narrative view'}</h4>
          </div>
          <span>{filteredGroups.length}/{groups.length} {lang === 'fr' ? 'cartes' : 'cards'}</span>
        </div>
        <div className="arc-browser-tools">
          <input
            value={groupQuery}
            onChange={(event) => setGroupQuery(event.target.value)}
            placeholder={lang === 'fr' ? 'Filtrer par univers, heros ou trio...' : 'Filter by universe, hero, or trio...'}
            aria-label={lang === 'fr' ? 'Filtrer les cartes narratives' : 'Filter narrative cards'}
          />
          {filteredGroups.length > visibleGroups.length && (
            <span>
              {lang === 'fr'
                ? `${visibleGroups.length} cartes affichees - affine le filtre pour trouver une signature precise.`
                : `${visibleGroups.length} cards shown - refine the filter to find a precise signature.`}
            </span>
          )}
        </div>
        <div className="arc-group-grid">
          {visibleGroups.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              padding: '18px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '6px',
              color: '#aaa',
              fontSize: '11px',
              lineHeight: 1.45
            }}>
              {lang === 'fr'
                ? 'Aucune trame narrative disponible pour ton compte dans cette vue. Recrute les personnages requis, monte leurs niveaux, ou stabilise plus de breches.'
                : 'No narrative Thread is available for your account in this view. Recruit the required characters, raise their levels, or stabilize more breaches.'}
            </div>
          )}
          {visibleGroups.map(group => {
            const firstArcStage = group.arcs
              .map(getPrimaryArcStage)
              .find(Boolean);
            const requirementText = firstArcStage && getStageUnlockRequirementText
              ? getStageUnlockRequirementText(firstArcStage)
              : '';
            const doneCount = group.arcs.reduce((sum, arc) => {
              const timeline = buildArcTimeline(arc, getLinkedStagesForArc(arc, stages, BASE_HEROES_DB), completedStages, lang);
              return sum + timeline.filter(node => node.status === 'done').length;
            }, 0);
            const totalCount = group.arcs.reduce((sum, arc) => {
              const timeline = buildArcTimeline(arc, getLinkedStagesForArc(arc, stages, BASE_HEROES_DB), completedStages, lang);
              return sum + timeline.length;
            }, 0);
            const ratio = totalCount ? Math.min(1, doneCount / totalCount) : 0;
            const backdrop = group.backdrop || getOpenAiBackdropSrc(group.primaryUniverse || group.label, 'RPG');
            return (
              <button
                key={group.id}
                type="button"
                className="arc-group-card"
                onClick={() => onSelectGroup(group.id)}
                title={lang === 'fr' ? `Ouvre la vue narrative ${group.label}.` : `Open ${group.label} narrative view.`}
                style={{
                  '--arc-group-color': group.color || categoryColor,
                  backgroundImage: backdrop
                    ? `linear-gradient(90deg, rgba(5,4,12,0.96), rgba(5,4,12,0.72), rgba(5,4,12,0.38)), url(${backdrop})`
                    : `linear-gradient(90deg, rgba(5,4,12,0.98), ${group.color || categoryColor}22)`
                }}
              >
                <span className="arc-group-kicker">{group.kicker}</span>
                <strong>{group.label}</strong>
                <span className="arc-group-desc">{group.desc}</span>
                {requirementText && (
                  <span className="arc-chapter-requirement">{requirementText}</span>
                )}
                <span className="arc-group-progress">
                  <span>{group.arcs.length} {lang === 'fr' ? 'arc(s)' : 'arc(s)'}</span>
                  <b>{doneCount}/{totalCount}</b>
                </span>
                <span className="arc-group-bar">
                  <i style={{ width: `${Math.round(ratio * 100)}%` }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="arc-browser-shell" style={{ '--arc-browser-color': selectedGroup.color || categoryColor }}>
      <div className="arc-browser-head">
        <button type="button" className="btn-retro" onClick={onBackToGroups}>
          {lang === 'fr' ? 'RETOUR AUX CARTES' : 'BACK TO CARDS'}
        </button>
        <div>
          <div className="portal-focus-kicker">{selectedGroup.kicker}</div>
          <h4>{selectedGroup.label}</h4>
          <p>{selectedGroup.desc}</p>
        </div>
        <span>{selectedGroup.arcs.length} {lang === 'fr' ? 'arc(s)' : 'arc(s)'}</span>
      </div>
      <div className="arc-chapter-grid">
        {selectedGroup.arcs.map(arc => {
          const linkedStages = getLinkedStagesForArc(arc, stages, BASE_HEROES_DB);
          const primaryStage = getPrimaryArcStage(arc);
          const requirementText = primaryStage && getStageUnlockRequirementText
            ? getStageUnlockRequirementText(primaryStage)
            : '';
          const timeline = buildArcTimeline(arc, linkedStages, completedStages, lang);
          const doneCount = timeline.filter(node => node.status === 'done').length;
          const ratio = timeline.length ? Math.min(1, doneCount / timeline.length) : 0;
          return (
            <button
              key={arc.id}
              type="button"
              className="arc-chapter-card"
              onClick={() => onOpenArc(arc)}
              title={lang === 'fr' ? 'Ouvre le chapitre complet de cet arc.' : 'Open this arc full chapter.'}
              style={{ '--arc-chapter-color': selectedGroup.color || categoryColor }}
            >
              <span className="arc-chapter-topline">
                <b>{doneCount}/{timeline.length}</b>
                <i>{lang === 'fr' ? 'OUVRIR CHAPITRE' : 'OPEN CHAPTER'}</i>
              </span>
              <strong>{getLocalizedText(arc.title, lang, arc.id)}</strong>
              <span className="arc-chapter-intro">{getLocalizedText(arc.intro, lang)}</span>
              {requirementText && (
                <span className="arc-chapter-requirement">{requirementText}</span>
              )}
              <span className="arc-group-bar">
                <i style={{ width: `${Math.round(ratio * 100)}%` }} />
              </span>
              <span className="arc-chapter-nodes">
                {timeline.map((node, index) => (
                  <em key={`${arc.id}-node-${index}`} className={node.status === 'done' ? 'done' : node.type.includes('boss') ? 'boss' : ''}>
                    {node.label}{node.stage ? ` #${node.stage.id}` : ''}
                  </em>
                ))}
              </span>
              <span className="arc-chapter-reward">
                {lang === 'fr' ? 'Recompense' : 'Reward'}: {getLocalizedText(arc.reward, lang)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NarrativeArcDetailPage({ lang, arc, stages, completedStages, introDone, onCompleteIntro, onSelectStage, onBack, isStageUnlocked }) {
  if (!arc) return null;
  const linkedStages = getLinkedStagesForArc(arc, stages, BASE_HEROES_DB);
  const timeline = buildArcTimeline(arc, linkedStages, completedStages, lang);
  const universes = getArcUniverses(arc, BASE_HEROES_DB);
  const cinematicFrames = universes.slice(0, 3).map((universe, index) => ({
    universe,
    src: getOpenAiBackdropSrc(universe, ['RPG', 'Tactics', 'Smash'][index % 3]),
    color: getUniverseHubColor(universe)
  }));
  while (cinematicFrames.length < 3) {
    const universe = universes[0] || 'Nexus de Convergence';
    cinematicFrames.push({ universe, src: getOpenAiBackdropSrc(universe, 'RPG'), color: getUniverseHubColor(universe) });
  }

  let previousPlayableDone = introDone;
  const detailedTimeline = timeline.map(node => {
    const isPlayable = Boolean(node.stage) && ['mission', 'boss'].includes(node.type);
    const hardLocked = node.type !== 'intro' && !introDone;
    const sequenceLocked = isPlayable && !previousPlayableDone;
    const stageLocked = node.stage && isStageUnlocked && !isStageUnlocked(node.stage);
    const unlocked = node.type === 'intro' || (!hardLocked && !sequenceLocked && !stageLocked);
    const done = node.type === 'intro' ? introDone : node.stage ? completedStages.includes(node.stage.id) : node.status === 'done';
    if (isPlayable) previousPlayableDone = done;
    return { ...node, unlocked, done, stageLocked };
  });

  const doneCount = detailedTimeline.filter(node => node.done).length;
  const ratio = detailedTimeline.length ? Math.round((doneCount / detailedTimeline.length) * 100) : 0;
  const rewardText = getLocalizedText(arc.reward, lang, getLocalizedText(arc.rewardItemName, lang, 'Trace Nexus'));

  return (
    <div className="arc-detail-page">
      <div className="arc-detail-header">
        <button type="button" className="btn-retro" onClick={onBack} title={lang === 'fr' ? 'Retourne a la carte des arcs.' : 'Return to the arc map.'}>
          {lang === 'fr' ? 'RETOUR CARTE' : 'BACK TO MAP'}
        </button>
        <div>
          <div className="portal-focus-kicker">{lang === 'fr' ? 'ROUTE NARRATIVE / ARC DEDIE' : 'NARRATIVE ROUTE / DEDICATED ARC'}</div>
          <h3>{getLocalizedText(arc.title, lang, arc.id)}</h3>
          <p>{getLocalizedText(arc.intro, lang)}</p>
        </div>
        <div className="arc-progress-badge">
          <strong>{ratio}%</strong>
          <span>{doneCount}/{detailedTimeline.length}</span>
        </div>
      </div>

      <div className="arc-cinematic-card">
        <div className="arc-cinematic-strip">
          {cinematicFrames.map((frame, index) => (
            <div
              key={`${arc.id}-frame-${index}`}
              className="arc-cinematic-frame"
              style={{
                '--arc-color': frame.color,
                backgroundImage: frame.src
                  ? `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.82)), url(${frame.src})`
                  : `radial-gradient(circle, ${frame.color}44, #050209 72%)`,
                animationDelay: `${index * 0.18}s`
              }}
            >
              <span>{frame.universe}</span>
            </div>
          ))}
        </div>
        <div className="arc-cinematic-copy">
          <strong>{introDone ? (lang === 'fr' ? 'Intro stabilisee' : 'Intro stabilized') : (lang === 'fr' ? 'Intro verrou initial' : 'Intro initial lock')}</strong>
          <p>
            {lang === 'fr'
              ? 'La scenette fixe le contexte de l arc avant toute mission. Une fois l intro lue, A.R.C.A. ouvre la premiere coordonnee jouable.'
              : 'The scene sets the arc context before any mission. Once the intro is read, A.R.C.A. opens the first playable coordinate.'}
          </p>
          <button
            type="button"
            className="btn-retro"
            onClick={onCompleteIntro}
            disabled={introDone}
            title={lang === 'fr' ? 'Marque l intro comme lue et debloque la premiere mission de cet arc.' : 'Mark the intro as read and unlock this arc first mission.'}
            style={{ borderColor: introDone ? '#2ecc71' : '#ffeb3b', color: introDone ? '#2ecc71' : '#ffeb3b' }}
          >
            {introDone ? (lang === 'fr' ? 'INTRO LUE' : 'INTRO READ') : (lang === 'fr' ? 'LIRE INTRO' : 'READ INTRO')}
          </button>
        </div>
      </div>

      <div className="arc-detail-timeline">
        {detailedTimeline.map((node, index) => {
          const color = node.done ? '#2ecc71' : !node.unlocked ? '#666' : node.type.includes('boss') ? '#e74c3c' : node.type === 'interlude' ? '#ffb15c' : '#39c5bb';
          const canLaunch = node.stage && node.unlocked && !node.done;
          return (
            <div key={`${arc.id}-detail-${node.type}-${index}`} className="arc-detail-node" style={{ '--arc-color': color }}>
              <div className="arc-detail-node-head">
                <span>{node.label}</span>
                <b>{node.done ? (lang === 'fr' ? 'STABLE' : 'STABLE') : node.unlocked ? (lang === 'fr' ? 'OUVERT' : 'OPEN') : (lang === 'fr' ? 'VERROUILLE' : 'LOCKED')}</b>
              </div>
              <p>{node.text}</p>
              {node.stage && (
                <div className="arc-detail-stage">
                  <span>#{node.stage.id} / {node.stage.mode} / {node.stage.bossName}</span>
                  <button
                    type="button"
                    className="btn-retro"
                    disabled={!canLaunch}
                    onClick={() => onSelectStage(node.stage)}
                    title={canLaunch
                      ? (lang === 'fr' ? 'Lance cette mission de l arc.' : 'Start this arc mission.')
                      : node.done
                        ? (lang === 'fr' ? 'Mission deja terminee.' : 'Mission already completed.')
                        : node.stageLocked
                          ? (lang === 'fr' ? 'Mission verrouillee par progression globale.' : 'Mission locked by global progress.')
                          : (lang === 'fr' ? 'Termine l etape precedente pour debloquer cette mission.' : 'Complete the previous step to unlock this mission.')}
                    style={{ borderColor: color, color }}
                  >
                    {node.done ? (lang === 'fr' ? 'TERMINE' : 'DONE') : canLaunch ? (lang === 'fr' ? 'LANCER' : 'START') : (lang === 'fr' ? 'SCELLE' : 'SEALED')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="arc-detail-reward">
        <strong>{lang === 'fr' ? 'Recompense finale' : 'Final reward'}</strong>
        <span>{rewardText}</span>
      </div>
    </div>
  );
}

function FactionArcBrowser({ lang, arcProgress, onClaimArcReward }) {
  return (
    <div style={{
      display: 'grid',
      gap: '12px',
      marginBottom: '14px'
    }}>
      <div style={{
        padding: '14px',
        border: '1px solid rgba(255,235,59,0.22)',
        background: 'rgba(255,235,59,0.06)',
        borderRadius: '5px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#ffeb3b', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {lang === 'fr' ? 'THEATRE DES FACTIONS' : 'FACTION THEATER'}
            </div>
            <div style={{ fontSize: '10px', color: '#d8d1a3', marginTop: '4px', lineHeight: 1.4 }}>
              {lang === 'fr'
                ? 'Ces arcs sont des conflits transversaux: ils ne remplacent pas la campagne principale et ne polluent plus le mode histoire.'
                : 'These arcs are cross-faction conflicts: they no longer replace or clutter the main story mode.'}
            </div>
          </div>
          <span style={{ fontSize: '10px', color: '#fff', border: '1px solid rgba(255,235,59,0.34)', padding: '4px 8px', borderRadius: '3px' }}>
            {arcProgress.length} {lang === 'fr' ? 'arcs indexes' : 'indexed arcs'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {arcProgress.map(arc => {
          const ratio = arc.total ? arc.completed / arc.total : 0;
          const phase = ratio === 1
            ? (lang === 'fr' ? 'Arc stabilise' : 'Arc stabilized')
            : ratio >= 0.66
              ? (lang === 'fr' ? 'Finale approche' : 'Finale incoming')
              : ratio >= 0.33
                ? (lang === 'fr' ? 'Conflit ouvert' : 'Open conflict')
                : (lang === 'fr' ? 'Signal faible' : 'Weak signal');
          return (
            <div key={arc.id} style={{
              padding: '11px',
              border: `1px solid ${ratio === 1 ? arc.color : 'rgba(255,255,255,0.08)'}`,
              background: ratio === 1 ? `${arc.color}18` : 'rgba(0,0,0,0.18)',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
                <strong style={{ fontSize: '12px', color: arc.color }}>{arc.title[lang]}</strong>
                <span style={{ fontSize: '10px', color: '#ddd' }}>{arc.completed}/{arc.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '7px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: '#cfd8dc' }}>{arc.faction?.[lang]}</span>
                <span style={{ fontSize: '8px', color: arc.color, border: `1px solid ${arc.color}66`, padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>{phase}</span>
              </div>
              <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', marginBottom: '7px' }}>
                <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: arc.color }} />
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35 }}>{arc.premise[lang]}</div>
              {arc.intro && (
                <div style={{ fontSize: '9px', color: '#ffeb3b', lineHeight: 1.35, marginTop: '6px' }}>
                  Intro: {arc.intro[lang]}
                </div>
              )}
              <div style={{ fontSize: '10px', color: '#d0d0d0', lineHeight: 1.35, marginTop: '7px' }}>{arc.stakes?.[lang]}</div>
              <div style={{ fontSize: '9px', color: '#9adbd6', lineHeight: 1.35, marginTop: '6px' }}>{arc.gameplay?.[lang]}</div>
              {arc.missions && (
                <div style={{ display: 'grid', gap: '3px', marginTop: '7px' }}>
                  {arc.missions.slice(0, 3).map((mission, idx) => (
                    <span key={`${arc.id}-mission-${idx}`} style={{ fontSize: '9px', color: '#cfcfcf', lineHeight: 1.25 }}>
                      {idx + 1}. {mission[lang]}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '9px', color: '#888', marginTop: '5px' }}>{arc.reward[lang]} - {arc.finale?.[lang]}</div>
              {arc.rewards && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {arc.rewards.map(reward => (
                    <span key={reward.name[lang]} style={{ fontSize: '8px', color: '#fff', border: `1px solid ${arc.color}66`, padding: '1px 5px', borderRadius: '3px' }}>
                      {reward.name[lang]}
                    </span>
                  ))}
                </div>
              )}
              {arc.claimReward && (
                <button
                  onClick={() => onClaimArcReward(arc)}
                  disabled={!arc.complete || arc.claimed}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Recupere la recompense finale de cet arc si toutes ses missions sont terminees.' : 'Claim this arc final reward if all its missions are complete.'}
                  style={{
                    marginTop: '8px',
                    padding: '5px 8px',
                    fontSize: '9px',
                    borderColor: arc.claimed ? '#2ecc71' : arc.complete ? arc.color : '#444',
                    color: arc.claimed ? '#2ecc71' : arc.complete ? arc.color : '#666'
                  }}
                >
                  {arc.claimed
                    ? (lang === 'fr' ? 'ARC SCELLE' : 'ARC SEALED')
                    : arc.complete
                      ? (lang === 'fr' ? 'SCELLER ARC' : 'SEAL ARC')
                      : (lang === 'fr' ? 'ARC INSTABLE' : 'ARC UNSTABLE')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MosaicCityHub({ lang, heroes, unlockedHeroes, completedStages, stages = [], playerProfile, onOpenMissions, onOpenCodex }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    t: 0,
    player: { x: 780, y: 520, speed: 2.35, facing: 1 },
    camera: { x: 0, y: 0 },
    destination: null,
    keys: {},
    npcs: []
  });
  const nearHeroRef = useRef(null);
  const nearPortalRef = useRef(null);
  const nearZoneRef = useRef(null);
  const [nearHeroId, setNearHeroId] = useState(null);
  const [nearZoneId, setNearZoneId] = useState(null);
  const [selectedHeroId, setSelectedHeroId] = useState(null);
  const [currentZone, setCurrentZone] = useState('atrium');
  const [currentDistrict, setCurrentDistrict] = useState('atrium');
  const nearHeroIdRef = useRef(null);
  const currentZoneRef = useRef('atrium');
  const currentDistrictRef = useRef('atrium');
  const [hubLog, setHubLog] = useState(lang === 'fr'
    ? 'A.R.C.A. maintient la Cite-Mosaique stable. Deplace ton Ancre et synchronise les signatures proches.'
    : 'A.R.C.A. keeps Mosaic City stable. Move your Anchor and synchronize nearby signatures.');
  const unlockedSet = useMemo(() => new Set(unlockedHeroes), [unlockedHeroes]);
  const safeHeroes = useMemo(() => (heroes || []).filter(Boolean), [heroes]);
  const ownedHeroes = useMemo(() => safeHeroes.filter(hero => unlockedSet.has(hero.id)).slice(0, 24), [safeHeroes, unlockedSet]);
  const unlockedUniverses = useMemo(() => Array.from(new Set(ownedHeroes.map(hero => hero.universe))).slice(0, 10), [ownedHeroes]);
  const visibleThreadUniverses = useMemo(() => {
    const fallback = ['Nexus de Convergence', 'Halo', 'Half-Life', 'Resident Evil', 'Stargate'];
    return (unlockedUniverses.length ? unlockedUniverses : fallback).slice(0, 10);
  }, [unlockedUniverses]);
  const universeStageStats = useMemo(() => {
    const stats = {};
    stages.forEach(stage => {
      const keys = [stage.universe, ...(stage.sourceUniverses || [])].filter(Boolean);
      keys.forEach(universe => {
        if (!stats[universe]) stats[universe] = { total: 0, cleared: 0 };
        stats[universe].total += 1;
        if (completedStages.includes(stage.id)) stats[universe].cleared += 1;
      });
    });
    return stats;
  }, [completedStages, stages]);
  const districts = useMemo(() => {
    const threadUniversePortals = visibleThreadUniverses.map((universe, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      return {
        id: `to-${getUniverseHubId(universe)}`,
        target: getUniverseHubId(universe),
        universe,
        x: 570 + col * 560,
        y: 250 + row * 255,
        label: universe,
        color: getUniverseHubColor(universe),
        spawn: { x: 820, y: 760 }
      };
    });
    const universeDistricts = Object.fromEntries(threadUniversePortals.map(portal => [
      portal.target,
      {
        id: portal.target,
        label: getUniverseHubPlace(portal.universe, lang).name,
        universe: portal.universe,
        place: getUniverseHubPlace(portal.universe, lang),
        role: lang === 'fr' ? `lieu reconstruit depuis ${portal.universe}` : `${portal.universe} reconstructed place`,
        color: portal.color,
        worldW: 1920,
        worldH: 1180,
        spawn: { x: 820, y: 760 },
        portals: [
          {
            id: `back-${portal.target}`,
            target: 'threads',
            x: 820,
            y: 910,
            label: lang === 'fr' ? 'Retour Galerie' : 'Back to Gallery',
            color: '#9b59b6',
            spawn: { x: portal.x, y: Math.min(1180, portal.y + 86) }
          }
        ]
      }
    ]));
    return {
    atrium: {
      id: 'atrium',
      label: lang === 'fr' ? 'Atrium des Ancres' : 'Anchor Atrium',
      role: lang === 'fr' ? 'carrefour central' : 'central crossroads',
      color: '#39c5bb',
      worldW: 1680,
      worldH: 1080,
      spawn: { x: 780, y: 520 },
      portals: [
        { id: 'to-threads', target: 'threads', x: 1420, y: 520, label: lang === 'fr' ? 'Portails de Trame' : 'Thread Portals', color: '#9b59b6', spawn: { x: 220, y: 700 } },
        { id: 'to-archives', target: 'archives', x: 780, y: 155, label: lang === 'fr' ? 'Archives A.R.C.A.' : 'A.R.C.A. Archives', color: '#ffea00', spawn: { x: 820, y: 760 } },
        { id: 'to-forge', target: 'forge', x: 780, y: 915, label: lang === 'fr' ? 'Atelier d Ancrage' : 'Anchor Workshop', color: '#ff4500', spawn: { x: 820, y: 260 } }
      ]
    },
    threads: {
      id: 'threads',
      label: lang === 'fr' ? 'Galerie des Trames' : 'Thread Gallery',
      role: lang === 'fr' ? 'salles des univers debloques' : 'unlocked universe rooms',
      color: '#9b59b6',
      worldW: 2200,
      worldH: 1260,
      spawn: { x: 220, y: 700 },
      portals: [
        { id: 'to-atrium', target: 'atrium', x: 105, y: 700, label: lang === 'fr' ? 'Retour Atrium' : 'Back to Atrium', color: '#39c5bb', spawn: { x: 1340, y: 520 } },
        ...threadUniversePortals
      ]
    },
    archives: {
      id: 'archives',
      label: lang === 'fr' ? 'Archives A.R.C.A.' : 'A.R.C.A. Archives',
      role: lang === 'fr' ? 'memoire, codex et arcs' : 'memory, codex, and arcs',
      color: '#ffea00',
      worldW: 1640,
      worldH: 980,
      spawn: { x: 820, y: 760 },
      portals: [
        { id: 'to-atrium', target: 'atrium', x: 820, y: 880, label: lang === 'fr' ? 'Retour Atrium' : 'Back to Atrium', color: '#39c5bb', spawn: { x: 780, y: 245 } }
      ]
    },
    forge: {
      id: 'forge',
      label: lang === 'fr' ? 'Atelier d Ancrage' : 'Anchor Workshop',
      role: lang === 'fr' ? 'equipement, soins et preparation' : 'gear, recovery, and prep',
      color: '#ff4500',
      worldW: 1640,
      worldH: 980,
      spawn: { x: 820, y: 260 },
      portals: [
        { id: 'to-atrium', target: 'atrium', x: 820, y: 105, label: lang === 'fr' ? 'Retour Atrium' : 'Back to Atrium', color: '#39c5bb', spawn: { x: 780, y: 820 } }
      ]
    },
    ...universeDistricts
  };
  }, [lang, visibleThreadUniverses]);
  const district = districts[currentDistrict] || districts.atrium;
  const zones = useMemo(() => {
    const source = visibleThreadUniverses;
    if (district.universe) {
      const universe = district.universe;
      const lore = LORE_DB[universe] || {};
      const place = district.place || getUniverseHubPlace(universe, lang);
      const stats = universeStageStats[universe] || { total: 0, cleared: 0 };
      const progressLabel = stats.total
        ? `${stats.cleared}/${stats.total} ${lang === 'fr' ? 'failles' : 'rifts'}`
        : (lang === 'fr' ? 'aucune faille indexee' : 'no indexed rift');
      return [
        {
          id: `${district.id}-anchor`,
          universe,
          action: 'talk',
          label: lang === 'fr' ? `Place ${place.name}` : `${place.name} Plaza`,
          x: 610,
          y: 280,
          w: 640,
          h: 280,
          color: district.color,
          role: lang === 'fr' ? 'heros compatibles et dialogues' : 'compatible heroes and dialogue'
        },
        {
          id: `${district.id}-memory`,
          universe,
          action: 'codex',
          label: lang === 'fr' ? 'Codex local' : 'Local Codex',
          x: 190,
          y: 710,
          w: 430,
          h: 205,
          color: '#ffea00',
          role: lore.mediaType ? `${lore.mediaType} / ${progressLabel}` : progressLabel
        },
        {
          id: `${district.id}-breach`,
          universe,
          action: 'mission',
          label: lang === 'fr' ? 'Balise mission' : 'Mission Beacon',
          x: 1245,
          y: 710,
          w: 430,
          h: 205,
          color: '#e74c3c',
          role: lang === 'fr' ? `lancer une faille de ${universe}` : `launch a ${universe} rift`
        },
        {
          id: `${district.id}-core`,
          universe,
          action: 'anchor',
          label: lang === 'fr' ? 'Ancre de stabilite' : 'Stability Anchor',
          x: 760,
          y: 875,
          w: 400,
          h: 150,
          color: '#39c5bb',
          role: place.mood
        }
      ];
    }
    if (currentDistrict === 'threads') {
      return source.slice(0, 10).map((universe, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return {
          id: `thread-${index}`,
          universe,
          label: universe,
          x: 360 + col * 560,
          y: 165 + row * 255,
          w: 420,
          h: 168,
          color: getUniverseHubColor(universe),
          role: lang === 'fr' ? 'Portail vers salle dediee' : 'Portal to dedicated room'
        };
      });
    }
    if (currentDistrict === 'archives') {
      return [
        { id: 'codex', universe: 'A.R.C.A.', label: lang === 'fr' ? 'Codex vivant' : 'Living Codex', x: 270, y: 165, w: 460, h: 210, color: '#ffea00', role: lang === 'fr' ? 'archives des mondes' : 'world archives' },
        { id: 'arcs', universe: 'A.R.C.A.', label: lang === 'fr' ? 'Chambre des arcs' : 'Arc Chamber', x: 900, y: 165, w: 460, h: 210, color: '#d9b6ff', role: lang === 'fr' ? 'memoire narrative' : 'narrative memory' },
        { id: 'replay', universe: 'A.R.C.A.', label: lang === 'fr' ? 'Salle des relectures' : 'Signal Replay', x: 585, y: 520, w: 470, h: 170, color: '#39c5bb', role: lang === 'fr' ? 'signaux et briefings' : 'signals and briefings' }
      ];
    }
    if (currentDistrict === 'forge') {
      return [
        { id: 'recovery', universe: 'Nexus', label: lang === 'fr' ? 'Baies de repli' : 'Retreat Bays', x: 245, y: 500, w: 420, h: 190, color: '#2ecc71', role: lang === 'fr' ? 'fatigue et soins' : 'fatigue and recovery' },
        { id: 'gear', universe: 'Nexus', label: lang === 'fr' ? 'Etablis reliques' : 'Relic Benches', x: 975, y: 500, w: 420, h: 190, color: '#ff4500', role: lang === 'fr' ? 'equipement futur' : 'future gear' },
        { id: 'training', universe: 'Nexus', label: lang === 'fr' ? 'Simulateur court' : 'Short Simulator', x: 610, y: 230, w: 420, h: 160, color: '#3498db', role: lang === 'fr' ? 'tests de role' : 'role tests' }
      ];
    }
    const threadRooms = source.slice(0, 3).map((universe, index) => {
      return {
        id: `atrium-thread-${index}`,
        universe,
        label: universe,
        x: 190 + index * 470,
        y: 675,
        w: 300,
        h: 138,
        color: getUniverseHubColor(universe),
        role: lang === 'fr' ? 'Apercu de Trame' : 'Thread preview'
      };
    });
    return [
      { id: 'atrium', universe: 'Nexus', label: lang === 'fr' ? 'Atrium central' : 'Central Atrium', x: 550, y: 360, w: 470, h: 260, color: '#39c5bb', role: lang === 'fr' ? 'zone stable' : 'stable zone' },
      { id: 'gate-hall', universe: 'Nexus', label: lang === 'fr' ? 'Hall des portails' : 'Portal Hall', x: 1180, y: 360, w: 330, h: 260, color: '#9b59b6', role: lang === 'fr' ? 'depart vers quartiers' : 'district departures' },
      ...threadRooms
    ];
  }, [currentDistrict, district, lang, universeStageStats, visibleThreadUniverses]);

  const selectedHero = ownedHeroes.find(hero => hero.id === selectedHeroId) || null;
  const nearHero = ownedHeroes.find(hero => hero.id === nearHeroId) || null;
  const leadHero = selectedHero || nearHero || ownedHeroes[0];
  const playerName = playerProfile?.pseudo || playerProfile?.name || playerProfile?.username || (lang === 'fr' ? 'Ancre Joueur' : 'Player Anchor');
  const currentZoneData = zones.find(zone => zone.id === currentZone) || district;
  const nearZoneData = zones.find(zone => zone.id === nearZoneId) || null;
  const districtStats = district.universe ? (universeStageStats[district.universe] || { total: 0, cleared: 0 }) : null;
  const districtProgress = districtStats?.total ? districtStats.cleared / districtStats.total : 0;
  const districtStateLabel = !district.universe
    ? (lang === 'fr' ? 'nexus stable' : 'stable nexus')
    : districtProgress >= 0.6
      ? (lang === 'fr' ? 'salle lumineuse' : 'bright room')
      : districtProgress > 0
        ? (lang === 'fr' ? 'salle en stabilisation' : 'stabilizing room')
        : (lang === 'fr' ? 'salle brumeuse' : 'fogged room');

  useEffect(() => {
    const districtHeroes = district.universe
      ? [
        ...ownedHeroes.filter(hero => hero.universe === district.universe),
        ...ownedHeroes.filter(hero => hero.universe !== district.universe)
      ]
      : ownedHeroes;
    stateRef.current.npcs = districtHeroes.slice(0, 18).map((hero, index) => {
      const zone = zones[index % Math.max(1, zones.length)] || district;
      const compatibleCount = districtHeroes.filter(other => other.id !== hero.id && (other.universe === hero.universe || other.category === hero.category)).length;
      const routine = compatibleCount && index % 4 === 1 ? 'talk' : index % 3 === 0 ? 'walk' : 'idle';
      return {
        hero,
        x: zone.x + 34 + ((index * 41) % Math.max(60, zone.w - 68)),
        y: zone.y + 32 + ((index * 29) % Math.max(38, zone.h - 54)),
        baseX: zone.x + 34 + ((index * 41) % Math.max(60, zone.w - 68)),
        baseY: zone.y + 32 + ((index * 29) % Math.max(38, zone.h - 54)),
        zoneId: zone.id,
        routine,
        reaction: completedStages.length > 0 && index % 5 === 0,
        phase: index * 0.73,
        facing: index % 2 ? -1 : 1
      };
    });
  }, [completedStages.length, district, ownedHeroes, zones]);

  const switchDistrict = useCallback((portal) => {
    const target = districts[portal.target] || districts.atrium;
    const spawn = portal.spawn || target.spawn;
    currentDistrictRef.current = target.id;
    currentZoneRef.current = target.id;
    nearHeroRef.current = null;
    nearHeroIdRef.current = null;
    nearPortalRef.current = null;
    nearZoneRef.current = null;
    stateRef.current.player.x = spawn.x;
    stateRef.current.player.y = spawn.y;
    stateRef.current.destination = null;
    stateRef.current.camera = {
      x: Math.max(0, Math.min(target.worldW - 960, spawn.x - 480)),
      y: Math.max(0, Math.min(target.worldH - 540, spawn.y - 270))
    };
    setNearHeroId(null);
    setNearZoneId(null);
    setCurrentDistrict(target.id);
    setCurrentZone(target.id);
    setHubLog(lang === 'fr'
      ? `Transition de portail: ${target.label}. ${target.universe ? 'Salle d univers dediee ouverte dans la Galerie des Trames.' : 'La camera suit ton Ancre dans une zone plus large.'}`
      : `Portal transition: ${target.label}. ${target.universe ? 'Dedicated universe room opened inside the Thread Gallery.' : 'The camera now follows your Anchor through a larger zone.'}`);
    sound.playSfx('special');
  }, [districts, lang]);

  const interactWithNearby = useCallback(() => {
    const state = stateRef.current;
    if (nearPortalRef.current) {
      switchDistrict(nearPortalRef.current);
      return;
    }
    if (nearZoneRef.current?.action === 'mission') {
      setHubLog(lang === 'fr'
        ? `Balise de ${nearZoneRef.current.universe} activee. A.R.C.A. ouvre la carte des failles sur les arcs et missions liees.`
        : `${nearZoneRef.current.universe} beacon activated. A.R.C.A. opens the rift map for linked arcs and missions.`);
      sound.playSfx('special');
      onOpenMissions?.(nearZoneRef.current.universe);
      return;
    }
    if (nearZoneRef.current?.action === 'codex') {
      setHubLog(lang === 'fr'
        ? `Codex local ouvert: ${nearZoneRef.current.universe}. Les archives restent in-lore sous forme de dossier A.R.C.A.`
        : `Local Codex opened: ${nearZoneRef.current.universe}. Archives stay in-lore as an A.R.C.A. file.`);
      sound.playSfx('confirm');
      onOpenCodex?.(nearZoneRef.current.universe);
      return;
    }
    if (nearZoneRef.current?.action === 'anchor') {
      const stats = universeStageStats[nearZoneRef.current.universe] || { total: 0, cleared: 0 };
      setHubLog(lang === 'fr'
        ? `Ancre locale: ${nearZoneRef.current.universe}. Stabilite ${stats.cleared}/${stats.total || '?'}; la salle gagne en lumiere quand ses failles sont scellees.`
        : `Local anchor: ${nearZoneRef.current.universe}. Stability ${stats.cleared}/${stats.total || '?'}; the room brightens as its rifts are sealed.`);
      sound.playSfx('click');
      return;
    }
    const target = nearHeroRef.current || state.npcs
      .map(npc => ({ npc, dist: Math.hypot(npc.x - state.player.x, npc.y - state.player.y) }))
      .filter(entry => entry.dist < 58)
      .sort((a, b) => a.dist - b.dist)[0]?.npc?.hero;
    if (!target) {
      setHubLog(lang === 'fr'
        ? 'Aucune signature assez proche. Approche un heros ou une salle de Trame.'
        : 'No signature is close enough. Move near a hero or a Thread room.');
      sound.playSfx('click');
      return;
    }
    setSelectedHeroId(target.id);
    const compatible = state.npcs
      .map(npc => npc.hero)
      .filter(hero => hero.id !== target.id && (hero.universe === target.universe || hero.category === target.category))
      .slice(0, 2)
      .map(hero => hero.name);
    const stats = universeStageStats[target.universe] || { total: 0, cleared: 0 };
    setHubLog(lang === 'fr'
      ? `${target.name} synchronise sa Trame avec ${playerName}. ${compatible.length ? `Discussion compatible avec ${compatible.join(' / ')}. ` : ''}${target.universe}: ${stats.cleared}/${stats.total || '?'} faille(s) stabilisee(s).`
      : `${target.name} synchronizes their Thread with ${playerName}. ${compatible.length ? `Compatible discussion with ${compatible.join(' / ')}. ` : ''}${target.universe}: ${stats.cleared}/${stats.total || '?'} stabilized rift(s).`);
    sound.playSfx('confirm');
  }, [lang, onOpenCodex, onOpenMissions, playerName, switchDistrict, universeStageStats]);

  useEffect(() => {
    const onKeyDown = event => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        stateRef.current.keys[key] = true;
        stateRef.current.destination = null;
        event.preventDefault();
      }
      if (key === 'e') {
        interactWithNearby();
      }
    };
    const onKeyUp = event => {
      stateRef.current.keys[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [interactWithNearby]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let rafId = 0;
    const drawPixelPerson = (x, y, color, accent, facing = 1, label = '', isPlayer = false, hero = null) => {
      if (hero?.id) {
        const bob = Math.sin(stateRef.current.t * 0.12 + x * 0.01) * 1.4;
        const spriteState = hero.state || (Math.abs(Math.sin(stateRef.current.t * 0.018 + x * 0.01)) > 0.62 ? 'run' : 'idle');
        ctx.fillStyle = 'rgba(0,0,0,0.42)';
        ctx.fillRect(x - 18, y + 21, 36, 7);
        drawPixelSprite(ctx, x, y + 24 + bob, { ...hero, state: spriteState }, stateRef.current.t, facing, isPlayer ? 78 : 68, 'nexus');
        ctx.fillStyle = isPlayer ? '#ffea00' : '#e8ffff';
        ctx.font = '10px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 42 + bob);
        ctx.textAlign = 'left';
        return;
      }
      const bob = Math.sin(stateRef.current.t * 0.12 + x * 0.01) * 1.6;
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      ctx.fillRect(x - 13, y + 17, 26, 6);
      ctx.fillStyle = accent || '#ffffff';
      ctx.fillRect(x - 7, y - 21 + bob, 14, 10);
      ctx.fillStyle = color || '#39c5bb';
      ctx.fillRect(x - 9, y - 10 + bob, 18, 24);
      ctx.fillRect(x - 15 * facing, y - 6 + bob, 8, 15);
      ctx.fillStyle = '#151515';
      ctx.fillRect(x - 8, y + 14 + bob, 6, 12);
      ctx.fillRect(x + 2, y + 14 + bob, 6, 12);
      ctx.fillStyle = isPlayer ? '#ffea00' : '#e8ffff';
      ctx.font = '10px "Share Tech Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y - 28 + bob);
      ctx.textAlign = 'left';
    };
    const drawUniverseScenery = (activeDistrict, progress) => {
      if (!activeDistrict.universe) return;
      const place = activeDistrict.place || getUniverseHubPlace(activeDistrict.universe, lang);
      const bright = Math.min(0.34, 0.08 + progress * 0.28);
      ctx.save();
      ctx.globalAlpha = 0.32 + progress * 0.28;
      ctx.fillStyle = activeDistrict.color;
      if (place.type === 'city') {
        ctx.fillRect(0, 585, activeDistrict.worldW, 180);
        ctx.fillStyle = 'rgba(0,0,0,0.54)';
        for (let i = 0; i < 9; i += 1) ctx.fillRect(120 + i * 185, 250 + (i % 3) * 28, 105, 250 - (i % 2) * 44);
        ctx.fillStyle = '#ffea00';
        ctx.fillRect(720, 360, 170, 28);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('R.P.D.', 762, 379);
        ctx.strokeStyle = '#d8f7ff';
        for (let x = 80; x < activeDistrict.worldW; x += 190) {
          ctx.beginPath();
          ctx.moveTo(x, 674);
          ctx.lineTo(x + 74, 674);
          ctx.stroke();
        }
      } else if (['military', 'industrial', 'reactor'].includes(place.type)) {
        for (let i = 0; i < 8; i += 1) {
          ctx.strokeStyle = i % 2 ? activeDistrict.color : '#777';
          ctx.strokeRect(170 + i * 190, 260 + (i % 3) * 95, 120, 72);
        }
        ctx.fillStyle = activeDistrict.color;
        ctx.globalAlpha = 0.18 + progress * 0.22;
        ctx.fillRect(240, 600, activeDistrict.worldW - 480, 74);
      } else if (place.type === 'gate') {
        ctx.strokeStyle = activeDistrict.color;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(930, 410, 130, Math.PI * 0.08, Math.PI * 1.92);
        ctx.stroke();
        for (let i = 0; i < 9; i += 1) {
          ctx.fillStyle = i % 2 ? '#ffea00' : activeDistrict.color;
          ctx.fillRect(820 + Math.cos(i) * 120, 400 + Math.sin(i) * 120, 18, 18);
        }
      } else if (place.type === 'fog') {
        ctx.fillStyle = '#d8f7ff';
        for (let i = 0; i < 12; i += 1) ctx.fillRect(80 + i * 160, 350 + Math.sin(stateRef.current.t * 0.02 + i) * 70, 120, 16);
      } else {
        for (let i = 0; i < 12; i += 1) {
          ctx.strokeStyle = activeDistrict.color;
          ctx.strokeRect(160 + i * 135, 270 + (i % 4) * 105, 82, 58);
        }
      }
      if (progress < 0.35) {
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = '#d8f7ff';
        for (let i = 0; i < 14; i += 1) ctx.fillRect(40 + i * 150, 170 + Math.sin(stateRef.current.t * 0.018 + i) * 160, 180, 22);
      } else {
        ctx.globalAlpha = bright;
        ctx.fillStyle = activeDistrict.color;
        ctx.fillRect(30, 30, activeDistrict.worldW - 60, activeDistrict.worldH - 60);
      }
      ctx.restore();
    };

    const loop = () => {
      const state = stateRef.current;
      state.t += 1;
      const keys = state.keys;
      let dx = 0;
      let dy = 0;
      if (keys.arrowleft || keys.a) dx -= 1;
      if (keys.arrowright || keys.d) dx += 1;
      if (keys.arrowup || keys.w) dy -= 1;
      if (keys.arrowdown || keys.s) dy += 1;

      if (state.destination && !dx && !dy) {
        const toX = state.destination.x - state.player.x;
        const toY = state.destination.y - state.player.y;
        const dist = Math.hypot(toX, toY);
        if (dist > 4) {
          dx = toX / dist;
          dy = toY / dist;
        } else {
          state.destination = null;
        }
      }

      if (dx || dy) {
        const len = Math.hypot(dx, dy) || 1;
        state.player.x = Math.max(34, Math.min(district.worldW - 34, state.player.x + (dx / len) * state.player.speed));
        state.player.y = Math.max(42, Math.min(district.worldH - 36, state.player.y + (dy / len) * state.player.speed));
        state.player.facing = dx < 0 ? -1 : dx > 0 ? 1 : state.player.facing;
      }

      state.camera.x += (Math.max(0, Math.min(district.worldW - canvas.width, state.player.x - canvas.width / 2)) - state.camera.x) * 0.12;
      state.camera.y += (Math.max(0, Math.min(district.worldH - canvas.height, state.player.y - canvas.height / 2)) - state.camera.y) * 0.12;

      let activeZone = district;
      zones.forEach(zone => {
        if (state.player.x >= zone.x && state.player.x <= zone.x + zone.w && state.player.y >= zone.y && state.player.y <= zone.y + zone.h) {
          activeZone = zone;
        }
      });
      if (activeZone.id !== currentZoneRef.current) {
        currentZoneRef.current = activeZone.id;
        setCurrentZone(activeZone.id);
      }
      const nearestZone = zones
        .map(zone => ({
          zone,
          dist: Math.hypot(zone.x + zone.w / 2 - state.player.x, zone.y + zone.h / 2 - state.player.y)
        }))
        .filter(entry => entry.dist < Math.max(entry.zone.w, entry.zone.h) * 0.58)
        .sort((a, b) => a.dist - b.dist)[0]?.zone || null;
      nearZoneRef.current = nearestZone?.action ? nearestZone : null;
      if ((nearestZone?.id || null) !== nearZoneRef.current?.lastId) {
        nearZoneRef.current = nearestZone?.action ? { ...nearestZone, lastId: nearestZone.id } : null;
        setNearZoneId(nearestZone?.action ? nearestZone.id : null);
      }

      state.npcs.forEach(npc => {
        if (npc.routine === 'walk') {
          npc.x = npc.baseX + Math.sin(state.t * 0.014 + npc.phase) * 46;
          npc.y = npc.baseY + Math.cos(state.t * 0.011 + npc.phase) * 22;
        } else if (npc.routine === 'talk') {
          npc.x = npc.baseX + Math.sin(state.t * 0.01 + npc.phase) * 8;
          npc.y = npc.baseY + Math.cos(state.t * 0.012 + npc.phase) * 5;
        } else {
          npc.x = npc.baseX + Math.sin(state.t * 0.018 + npc.phase) * 14;
          npc.y = npc.baseY + Math.cos(state.t * 0.014 + npc.phase) * 8;
        }
        npc.facing = Math.sin(state.t * 0.018 + npc.phase) > 0 ? 1 : -1;
      });

      const nearest = state.npcs
        .map(npc => ({ npc, dist: Math.hypot(npc.x - state.player.x, npc.y - state.player.y) }))
        .filter(entry => entry.dist < 58)
        .sort((a, b) => a.dist - b.dist)[0]?.npc || null;
      const nearestId = nearest?.hero?.id || null;
      nearHeroRef.current = nearest?.hero || null;
      if (nearestId !== nearHeroIdRef.current) {
        nearHeroIdRef.current = nearestId;
        setNearHeroId(nearestId);
      }
      const nearestPortal = (district.portals || [])
        .map(portal => ({ portal, dist: Math.hypot(portal.x - state.player.x, portal.y - state.player.y) }))
        .filter(entry => entry.dist < 72)
        .sort((a, b) => a.dist - b.dist)[0]?.portal || null;
      nearPortalRef.current = nearestPortal;

      const sky = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      sky.addColorStop(0, '#120821');
      sky.addColorStop(0.52, '#05030b');
      sky.addColorStop(1, '#10151f');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(57,197,187,0.07)';
      ctx.lineWidth = 1;
      for (let x = -(state.camera.x % 24); x < canvas.width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -(state.camera.y % 24); y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(-state.camera.x, -state.camera.y);

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.strokeRect(10, 10, district.worldW - 20, district.worldH - 20);
      ctx.fillStyle = district.color;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(18, 18, district.worldW - 36, district.worldH - 36);
      ctx.globalAlpha = 1;
      drawUniverseScenery(district, districtProgress);
      if (district.universe) {
        const lore = LORE_DB[district.universe];
        const place = district.place || getUniverseHubPlace(district.universe, lang);
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = district.color;
        for (let i = 0; i < 9; i += 1) {
          ctx.beginPath();
          ctx.arc(260 + i * 150, 170 + Math.sin(state.t * 0.025 + i) * 18, 34 + (i % 3) * 16, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,0.48)';
        ctx.fillRect(92, 78, 580, 88);
        ctx.strokeStyle = district.color;
        ctx.strokeRect(92, 78, 580, 88);
        ctx.fillStyle = district.color;
        ctx.font = '18px "Press Start 2P"';
        ctx.fillText(String(place.name).toUpperCase().slice(0, 22), 112, 112);
        ctx.fillStyle = '#d8f7ff';
        ctx.font = '11px "Share Tech Mono"';
        ctx.fillText(String(place.mood || lore?.desc?.[lang] || district.role).slice(0, 88), 112, 140);
      }

      zones.forEach(zone => {
        const pulse = 0.08 + Math.sin(state.t * 0.035 + zone.x) * 0.025;
        const zoneDimmed = district.universe && districtProgress < 0.15 && zone.action !== 'mission';
        const zoneActive = zone.id === activeZone.id || zone.id === nearZoneRef.current?.id;
        ctx.save();
        ctx.globalAlpha = zoneDimmed ? 0.06 : zoneActive ? 0.25 : 0.11;
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = zoneDimmed ? 0.34 : zoneActive ? 1 : 0.55;
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = zoneActive ? 3 : 1;
        ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = zoneActive ? 0.34 : 0.16;
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x + 8, zone.y + zone.h - 18, zone.w - 16, 6 + pulse * 20);
        ctx.restore();
        ctx.fillStyle = '#f6ffff';
        ctx.font = '12px "Share Tech Mono"';
        ctx.fillText(zone.label.toUpperCase().slice(0, 26), zone.x + 12, zone.y + 20);
        ctx.fillStyle = zone.color;
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText(zone.role.toUpperCase().slice(0, 24), zone.x + 12, zone.y + 36);
        if (zone.action && zoneActive) {
          ctx.fillStyle = '#ffea00';
          ctx.fillText((lang === 'fr' ? 'E: INTERAGIR' : 'E: INTERACT'), zone.x + 12, zone.y + zone.h - 28);
        }
      });

      (district.portals || []).forEach(portal => {
        const pulse = 1 + Math.sin(state.t * 0.08 + portal.x) * 0.08;
        ctx.save();
        ctx.translate(portal.x, portal.y);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = portal.color;
        ctx.lineWidth = nearestPortal?.id === portal.id ? 5 : 3;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(-62, 42, 124, 24);
        ctx.fillStyle = nearestPortal?.id === portal.id ? '#ffea00' : portal.color;
        ctx.font = '10px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(portal.label.toUpperCase().slice(0, 20), 0, 58);
        ctx.restore();
        ctx.textAlign = 'left';
      });

      ctx.strokeStyle = 'rgba(255,234,0,0.2)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      if (currentDistrict === 'atrium') {
        ctx.moveTo(780, 285);
        ctx.lineTo(780, 915);
        ctx.moveTo(520, 520);
        ctx.lineTo(1420, 520);
      } else if (currentDistrict === 'threads') {
        ctx.moveTo(105, 700);
        ctx.lineTo(1980, 700);
        ctx.moveTo(320, 300);
        ctx.lineTo(1900, 300);
        ctx.moveTo(320, 965);
        ctx.lineTo(1900, 965);
      } else if (district.universe) {
        ctx.moveTo(820, 910);
        ctx.lineTo(820, 430);
        ctx.moveTo(390, 735);
        ctx.lineTo(1250, 735);
        ctx.moveTo(530, 430);
        ctx.lineTo(1110, 430);
      } else {
        ctx.moveTo(220, 760);
        ctx.lineTo(1420, 760);
        ctx.moveTo(820, 120);
        ctx.lineTo(820, 880);
      }
      ctx.stroke();

      state.npcs
        .slice()
        .sort((a, b) => a.y - b.y)
        .forEach(npc => {
          const hero = npc.hero;
          drawPixelPerson(npc.x, npc.y, hero.primaryColor, hero.secondaryColor, npc.facing, String(hero.name || '?').slice(0, 8), false, hero);
          if (npc.routine === 'talk' || npc.reaction) {
            ctx.fillStyle = npc.reaction ? '#ffea00' : '#d8f7ff';
            ctx.font = '9px "Share Tech Mono"';
            ctx.fillText(npc.reaction ? (lang === 'fr' ? 'arc scelle?' : 'arc sealed?') : (lang === 'fr' ? 'discussion' : 'talk'), npc.x - 22, npc.y - 52);
          }
          if (nearest?.hero?.id === hero.id) {
            ctx.strokeStyle = '#ffea00';
            ctx.lineWidth = 2;
            ctx.strokeRect(npc.x - 18, npc.y - 32, 36, 62);
            ctx.fillStyle = '#ffea00';
            ctx.font = '10px "Share Tech Mono"';
            ctx.fillText(lang === 'fr' ? 'E: synchro' : 'E: sync', npc.x - 26, npc.y - 39);
          }
        });

      drawPixelPerson(state.player.x, state.player.y, '#39c5bb', '#ffea00', state.player.facing, playerName.slice(0, 10), true);

      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.68)';
      ctx.fillRect(12, 12, 290, 64);
      ctx.strokeStyle = '#39c5bb';
      ctx.strokeRect(12, 12, 290, 64);
      ctx.fillStyle = '#39c5bb';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillText(lang === 'fr' ? 'CITE-MOSAIQUE' : 'MOSAIC CITY', 24, 34);
      ctx.fillStyle = '#fff';
      ctx.font = '11px "Share Tech Mono"';
      ctx.fillText(`${lang === 'fr' ? 'Zone' : 'Zone'}: ${activeZone.label}`, 24, 57);
      if (district.universe) {
        ctx.fillStyle = districtProgress >= 0.6 ? '#2ecc71' : districtProgress > 0 ? '#ffeb3b' : '#aaa';
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText(districtStateLabel.toUpperCase().slice(0, 30), 24, 72);
      }
      if (nearestPortal) {
        ctx.fillStyle = '#ffea00';
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText(lang === 'fr' ? `E: ${nearestPortal.label}` : `E: ${nearestPortal.label}`, 24, district.universe ? 88 : 72);
      } else if (nearZoneRef.current?.action) {
        ctx.fillStyle = '#ffea00';
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText(lang === 'fr' ? `E: ${nearZoneRef.current.label}` : `E: ${nearZoneRef.current.label}`, 24, district.universe ? 88 : 72);
      }

      ctx.fillStyle = 'rgba(0,0,0,0.58)';
      ctx.fillRect(canvas.width - 292, 12, 280, 64);
      ctx.strokeStyle = '#ffea00';
      ctx.strokeRect(canvas.width - 292, 12, 280, 64);
      ctx.fillStyle = '#ffea00';
      ctx.font = '10px "Share Tech Mono"';
      ctx.fillText(`${ownedHeroes.length} signatures / ${unlockedUniverses.length} trames`, canvas.width - 276, 34);
      ctx.fillStyle = '#d8f7ff';
      ctx.fillText(`${completedStages.length} ${lang === 'fr' ? 'breches scellees' : 'sealed breaches'}`, canvas.width - 276, 56);

      const miniW = 154;
      const miniH = 92;
      const miniX = canvas.width - miniW - 14;
      const miniY = canvas.height - miniH - 14;
      ctx.fillStyle = 'rgba(0,0,0,0.62)';
      ctx.fillRect(miniX, miniY, miniW, miniH);
      ctx.strokeStyle = district.color;
      ctx.strokeRect(miniX, miniY, miniW, miniH);
      const sx = miniW / district.worldW;
      const sy = miniH / district.worldH;
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.strokeRect(miniX + state.camera.x * sx, miniY + state.camera.y * sy, canvas.width * sx, canvas.height * sy);
      (district.portals || []).forEach(portal => {
        ctx.fillStyle = portal.color;
        ctx.beginPath();
        ctx.arc(miniX + portal.x * sx, miniY + portal.y * sy, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = '#ffea00';
      ctx.fillRect(miniX + state.player.x * sx - 2, miniY + state.player.y * sy - 2, 4, 4);

      rafId = window.requestAnimationFrame(loop);
    };
    loop();
    return () => window.cancelAnimationFrame(rafId);
  }, [completedStages.length, currentDistrict, district, districtProgress, districtStateLabel, lang, ownedHeroes.length, playerName, unlockedUniverses.length, zones]);

  const moveToPointer = event => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX + stateRef.current.camera.x;
    const y = (event.clientY - rect.top) * scaleY + stateRef.current.camera.y;
    const closePortal = (district.portals || []).find(portal => Math.hypot(portal.x - x, portal.y - y) < 46);
    if (closePortal) {
      switchDistrict(closePortal);
      return;
    }
    const closeNpc = stateRef.current.npcs.find(npc => Math.hypot(npc.x - x, npc.y - y) < 34);
    if (closeNpc) {
      nearHeroRef.current = closeNpc.hero;
      nearHeroIdRef.current = closeNpc.hero.id;
      setNearHeroId(closeNpc.hero.id);
      interactWithNearby();
      return;
    }
    const closeZone = zones.find(zone => zone.action && x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h);
    if (closeZone) {
      nearZoneRef.current = { ...closeZone, lastId: closeZone.id };
      setNearZoneId(closeZone.id);
      stateRef.current.destination = { x: closeZone.x + closeZone.w / 2, y: closeZone.y + closeZone.h / 2 };
      if (Math.hypot(stateRef.current.player.x - (closeZone.x + closeZone.w / 2), stateRef.current.player.y - (closeZone.y + closeZone.h / 2)) < Math.max(closeZone.w, closeZone.h) * 0.48) {
        interactWithNearby();
      } else {
        sound.playSfx('click');
      }
      return;
    }
    stateRef.current.destination = { x, y };
    sound.playSfx('click');
  };

  const setVirtualKey = (key, active) => {
    stateRef.current.keys[key] = active;
    if (active) stateRef.current.destination = null;
  };

  return (
    <div className="glass-panel nexus-play-panel mosaic-rpg-panel">
      <div className="nexus-play-copy">
        <div className="portal-focus-kicker">{lang === 'fr' ? 'CITE-MOSAIQUE / RPG VIVANT' : 'MOSAIC CITY / LIVING RPG'}</div>
        <h3>{lang === 'fr' ? 'Cite-Mosaique' : 'Mosaic City'}</h3>
        <p>
          {lang === 'fr'
            ? 'Un hub RPG navigable: ton Ancre explore des quartiers plus grands que l ecran. La Galerie des Trames contient maintenant des portails d univers ouvrant une salle dediee a chaque monde debloque.'
            : 'A navigable RPG hub: your Anchor explores districts larger than the screen. The Thread Gallery now contains universe portals that open a dedicated room for each unlocked world.'}
        </p>
        <div className="nexus-play-stats">
          <span>{ownedHeroes.length} {lang === 'fr' ? 'signatures' : 'signatures'}</span>
          <span>{unlockedUniverses.length} {lang === 'fr' ? 'Trames visibles' : 'visible Threads'}</span>
          <span>{completedStages.length} {lang === 'fr' ? 'breches scellees' : 'sealed breaches'}</span>
          <span>{district.label}</span>
          <span>{currentZoneData?.label || 'Nexus'}</span>
        </div>
        {district.universe && (
          <div className="mosaic-room-intel">
            <strong>{district.label}</strong>
            <span>{district.universe} / {districtStateLabel}</span>
            <small>{district.place?.mood || getUniverseHubPlace(district.universe, lang).mood}</small>
            <em>{districtStats?.cleared || 0}/{districtStats?.total || 0} {lang === 'fr' ? 'failles locales stabilisees' : 'local rifts stabilized'}</em>
          </div>
        )}
        {leadHero && (
          <div className="nexus-play-intel">
            <strong>{leadHero.name || 'Ancre'}</strong>
            <span>{leadHero.universe} / {leadHero.category}</span>
            <small>{lang === 'fr' ? 'Synchronisation proche disponible dans la Cite.' : 'Nearby synchronization available in the City.'}</small>
          </div>
        )}
        {nearZoneData?.action && (
          <div className="mosaic-room-actions">
            <button className="btn-retro" onClick={interactWithNearby} title={lang === 'fr' ? 'Execute l action de la zone proche.' : 'Run the nearby zone action.'}>
              {nearZoneData.action === 'mission'
                ? (lang === 'fr' ? 'OUVRIR MISSIONS' : 'OPEN MISSIONS')
                : nearZoneData.action === 'codex'
                  ? (lang === 'fr' ? 'OUVRIR CODEX' : 'OPEN CODEX')
                  : (lang === 'fr' ? 'INTERAGIR' : 'INTERACT')}
            </button>
            <span>{nearZoneData.label}</span>
          </div>
        )}
        <div className="mosaic-rpg-log">
          <strong>{lang === 'fr' ? 'Journal de Trame' : 'Thread Log'}</strong>
          <span>{hubLog}</span>
        </div>
        <div className="mosaic-rpg-controls">
          <span>{lang === 'fr' ? 'WASD/fleches: explorer. E: parler ou entrer dans un portail. Tap/clic: destination ou portail.' : 'WASD/arrows: explore. E: talk or enter a portal. Tap/click: destination or portal.'}</span>
          <button className="btn-retro" onClick={interactWithNearby} title={lang === 'fr' ? 'Interagit avec le heros ou le portail le plus proche.' : 'Interact with the nearest hero or portal.'}>
            {lang === 'fr' ? 'SYNCHRONISER' : 'SYNCHRONIZE'}
          </button>
        </div>
      </div>
      <div className="mosaic-rpg-stage">
        <canvas ref={canvasRef} width="960" height="540" className="nexus-hub-canvas mosaic-rpg-canvas" onPointerDown={moveToPointer} />
        <div className="mosaic-mobile-pad">
          <button title={lang === 'fr' ? 'Deplace le heros vers le haut.' : 'Move the hero upward.'} onPointerDown={() => setVirtualKey('arrowup', true)} onPointerUp={() => setVirtualKey('arrowup', false)} onPointerLeave={() => setVirtualKey('arrowup', false)}>UP</button>
          <button title={lang === 'fr' ? 'Deplace le heros vers la gauche.' : 'Move the hero left.'} onPointerDown={() => setVirtualKey('arrowleft', true)} onPointerUp={() => setVirtualKey('arrowleft', false)} onPointerLeave={() => setVirtualKey('arrowleft', false)}>LEFT</button>
          <button title={lang === 'fr' ? 'Interagit avec le heros ou portail proche.' : 'Interact with the nearby hero or portal.'} onClick={interactWithNearby}>{lang === 'fr' ? 'SYNC' : 'SYNC'}</button>
          <button title={lang === 'fr' ? 'Deplace le heros vers la droite.' : 'Move the hero right.'} onPointerDown={() => setVirtualKey('arrowright', true)} onPointerUp={() => setVirtualKey('arrowright', false)} onPointerLeave={() => setVirtualKey('arrowright', false)}>RIGHT</button>
          <button title={lang === 'fr' ? 'Deplace le heros vers le bas.' : 'Move the hero downward.'} onPointerDown={() => setVirtualKey('arrowdown', true)} onPointerUp={() => setVirtualKey('arrowdown', false)} onPointerLeave={() => setVirtualKey('arrowdown', false)}>DOWN</button>
        </div>
      </div>
    </div>
  );
}

function ExtinctionRoyale({ lang, heroes, unlockedHeroes }) {
  const canvasRef = useRef(null);
  const fpsHandsRef = useRef(null);
  const fpsProjectileRef = useRef(null);
  const unlockedSet = useMemo(() => new Set(unlockedHeroes), [unlockedHeroes]);
  const safeHeroes = useMemo(() => (heroes || []).filter(Boolean), [heroes]);
  const playableHeroes = useMemo(() => safeHeroes.filter(hero => unlockedSet.has(hero.id)).slice(0, 40), [safeHeroes, unlockedSet]);
  const [selectedHeroId, setSelectedHeroId] = useState(() => playableHeroes[0]?.id || safeHeroes[0]?.id || '');
  const [runMode, setRunMode] = useState('extraction');
  const [runSnapshot, setRunSnapshot] = useState({ phase: 'ready', hp: 100, ammo: 24, kills: 0, wave: 1, loot: 0, result: null, rewards: null });
  const selectedHero = playableHeroes.find(hero => hero.id === selectedHeroId) || playableHeroes[0] || safeHeroes[0] || null;
  const stateRef = useRef({
    phase: 'ready',
    hp: 100,
    armor: 0,
    ammo: 24,
    maxAmmo: 24,
    kills: 0,
    wave: 1,
    enemies: [],
    loot: [],
    t: 0,
    zone: 1,
    muzzle: 0,
    reloadPulse: 0,
    px: 0,
    py: 0,
    angle: 0,
    vx: 0,
    vy: 0,
    turnVel: 0,
    moveKeys: {},
    dash: 0,
    scan: 0,
    turret: 0,
    fragments: [],
    objective: null,
    result: null,
    rewards: null
  });

  const roleProfile = useMemo(() => ({
    marine: { hp: 1.18, armor: 28, ammo: 1.35, dmg: 1.05, perk: lang === 'fr' ? 'Armure et munitions renforces' : 'Extra armor and ammunition' },
    slayer: { hp: 1.03, armor: 8, ammo: 1, dmg: 1.25, perk: lang === 'fr' ? 'Degats proches et dash agressif' : 'Close damage and aggressive dash' },
    hacker: { hp: 0.92, armor: 6, ammo: 1.05, dmg: 0.95, perk: lang === 'fr' ? 'Scan, ralentissement et pieges' : 'Scan, slow, and traps' },
    horror: { hp: 1.08, armor: 10, ammo: 0.95, dmg: 1.08, perk: lang === 'fr' ? 'Vol de vie sur executions' : 'Lifedrain on executions' },
    tactical: { hp: 1.04, armor: 18, ammo: 1.12, dmg: 1, perk: lang === 'fr' ? 'Radar, couverture et tourelle courte' : 'Radar, cover, and short turret' }
  }), [lang]);

  const weaponProfile = useMemo(() => {
    const category = selectedHero?.category || 'marine';
    if (selectedHero?.weaponType === 'melee' || category === 'slayer') return { name: lang === 'fr' ? 'Plaquette FPS: lame/shotgun de rupture' : 'FPS plaque: rupture blade/shotgun', color: '#ff5a36', fireRate: 1, spread: 0.18 };
    if (category === 'hacker') return { name: lang === 'fr' ? 'Plaquette FPS: outil de scan anormal' : 'FPS plaque: anomaly scan tool', color: '#39c5bb', fireRate: 0.85, spread: 0.08 };
    if (category === 'tactical') return { name: lang === 'fr' ? 'Plaquette FPS: carabine A.R.C.A.' : 'FPS plaque: A.R.C.A. carbine', color: '#9b59b6', fireRate: 1, spread: 0.1 };
    if (category === 'horror') return { name: lang === 'fr' ? 'Plaquette FPS: relique sombre' : 'FPS plaque: dark relic', color: '#8e44ad', fireRate: 0.9, spread: 0.16 };
    return { name: lang === 'fr' ? 'Plaquette FPS: fusil d Ancre' : 'FPS plaque: Anchor rifle', color: '#ffea00', fireRate: 1, spread: 0.12 };
  }, [lang, selectedHero]);

  const universeFragments = useMemo(() => {
    const pool = Array.from(new Set(safeHeroes.map(hero => hero.universe).filter(Boolean)));
    const seed = selectedHeroId.length + runMode.length;
    return [0, 1, 2].map(index => pool[(seed + index * 7) % Math.max(1, pool.length)] || ['Raccoon City', 'Halo', 'Silent Hill'][index]);
  }, [runMode, safeHeroes, selectedHeroId]);

  const objectives = useMemo(() => ({
    extraction: lang === 'fr' ? 'Stabiliser 3 balises puis survivre au Champion de Trame.' : 'Stabilize 3 beacons, then survive the Thread Champion.',
    last_signal: lang === 'fr' ? 'Dernier Signal: eliminer toutes les signatures hostiles avant dissolution.' : 'Last Signal: eliminate every hostile signature before dissolution.',
    infestation: lang === 'fr' ? 'Infestation: tenir le plus longtemps possible face aux essaims.' : 'Infestation: hold as long as possible against swarms.',
    hunt: lang === 'fr' ? 'Chasse au Champion: faire apparaitre et abattre le noyau local.' : 'Champion Hunt: expose and kill the local core.'
  }), [lang]);

  useEffect(() => {
    if (typeof Image === 'undefined') return undefined;
    const hands = new Image();
    const projectile = new Image();
    hands.src = MIRELLE_COMPLETE_SPRITES.fpsHands;
    projectile.src = MIRELLE_COMPLETE_SPRITES.fpsProjectile;
    fpsHandsRef.current = hands;
    fpsProjectileRef.current = projectile;
    return () => {
      fpsHandsRef.current = null;
      fpsProjectileRef.current = null;
    };
  }, []);

  const buildEnemies = useCallback((wave = 1, champion = false) => {
    const archetypes = [
      { kind: 'Traqueur', color: '#e74c3c', hp: 28, speed: 0.0025, dmg: 4, size: 1 },
      { kind: 'Sniper', color: '#f1c40f', hp: 22, speed: 0.0015, dmg: 7, size: 0.86 },
      { kind: 'Briseur', color: '#9b59b6', hp: 48, speed: 0.0018, dmg: 6, size: 1.18 },
      { kind: 'Essaim', color: '#2ecc71', hp: 16, speed: 0.0032, dmg: 2, size: 0.72 }
    ];
    const count = champion ? 1 : 6 + wave * 2;
    return Array.from({ length: count }, (_, index) => {
      const base = champion
        ? { kind: 'Champion de Trame', color: '#ffffff', hp: 180 + wave * 35, speed: 0.0014, dmg: 10, size: 1.55 }
        : archetypes[(index + wave) % archetypes.length];
      return {
        ...base,
        id: `${base.kind}-${wave}-${index}-${Date.now()}`,
        wx: (index - count / 2) * 1.25 + Math.sin(index * 1.7) * 0.65,
        wy: 4.2 + (index % 5) * 2.15 + wave * 0.35,
        maxHp: base.hp + wave * 5,
        hp: base.hp + wave * 5,
        fragment: universeFragments[index % universeFragments.length],
        shotTimer: 0
      };
    });
  }, [universeFragments]);

  const buildLoot = useCallback((wave = 1) => ([
    { id: `heal-${wave}`, type: 'normal', label: lang === 'fr' ? 'Cache soin' : 'Heal cache', wx: -2.8, wy: 3.8 + wave * 0.6, color: '#2ecc71' },
    { id: `ammo-${wave}`, type: 'normal', label: lang === 'fr' ? 'Munitions' : 'Ammo', wx: 2.6, wy: 4.8 + wave * 0.55, color: '#ffea00' },
    { id: `summon-${wave}`, type: 'summon', label: lang === 'fr' ? 'PNJ temporaire' : 'Temporary NPC', wx: -0.9, wy: 6.4 + wave * 0.7, color: '#39c5bb' },
    { id: `ultimate-${wave}`, type: 'ultimate', label: lang === 'fr' ? 'Ultime univers' : 'Universe ultimate', wx: 1.25, wy: 8.1 + wave * 0.8, color: '#e74c3c' }
  ]), [lang]);

  const projectWorld = useCallback((entity, state) => {
    const dx = (entity.wx || 0) - (state.px || 0);
    const dy = (entity.wy || 0) - (state.py || 0);
    const sin = Math.sin(state.angle || 0);
    const cos = Math.cos(state.angle || 0);
    const camX = dx * cos - dy * sin;
    const camZ = dx * sin + dy * cos;
    return { camX, camZ, aim: camZ > 0 ? camX / camZ : 99, dist: Math.hypot(dx, dy) };
  }, []);

  const startRun = useCallback(() => {
    if (!selectedHero) return;
    const stats = selectedHero.stats || { hp: 120, atk: 12, def: 6, spd: 5 };
    const role = roleProfile[selectedHero.category] || roleProfile.marine;
    const maxAmmo = Math.round(24 * role.ammo);
    const next = {
      phase: 'running',
      hp: Math.min(260, Math.max(85, Math.round(stats.hp * 0.75 * role.hp))),
      maxHp: Math.min(260, Math.max(85, Math.round(stats.hp * 0.75 * role.hp))),
      armor: role.armor,
      ammo: maxAmmo,
      maxAmmo,
      kills: 0,
      wave: 1,
      enemies: buildEnemies(1),
      loot: buildLoot(1),
      t: 0,
      zone: 1,
      muzzle: 0,
      reloadPulse: 0,
      px: 0,
      py: 0,
      angle: 0,
      vx: 0,
      vy: 0,
      turnVel: 0,
      moveKeys: {},
      dash: 0,
      scan: selectedHero.category === 'hacker' ? 240 : 0,
      turret: selectedHero.category === 'tactical' ? 420 : 0,
      fragments: universeFragments,
      objective: objectives[runMode],
      result: null,
      rewards: null
    };
    stateRef.current = next;
    setRunSnapshot({ phase: next.phase, hp: next.hp, ammo: next.ammo, kills: 0, wave: 1, loot: 0, result: null, rewards: null });
    sound.playSfx('levelup');
  }, [buildEnemies, buildLoot, objectives, roleProfile, runMode, selectedHero, universeFragments]);

  const finishRun = useCallback((result) => {
    const state = stateRef.current;
    if (state.phase === 'ended') return;
    const victory = result === 'victory';
    const rewards = {
      gold: victory ? 70 + state.wave * 22 + state.kills * 3 : 18 + state.kills,
      shards: victory ? 24 + state.wave * 7 : 7 + Math.floor(state.kills / 2),
      modeXp: victory ? 120 + state.wave * 30 : 35 + state.kills * 4,
      title: victory
        ? (lang === 'fr' ? 'Extraction A.R.C.A. reussie' : 'A.R.C.A. extraction successful')
        : (lang === 'fr' ? 'Repli d Ancre: donnees conservees' : 'Anchor retreat: contact data preserved')
    };
    state.phase = 'ended';
    state.result = result;
    state.rewards = rewards;
    setRunSnapshot({ phase: 'ended', hp: state.hp, ammo: state.ammo, kills: state.kills, wave: state.wave, loot: state.loot.filter(item => item.used).length, result, rewards });
    sound.playSfx(victory ? 'victory' : 'defeat');
  }, [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedHero) return undefined;
    const ctx = canvas.getContext('2d');
    let rafId = 0;
    const loop = () => {
      const state = stateRef.current;
      if (state.phase === 'running') {
        state.t += 1;
      }
      state.zone = state.phase === 'running' ? Math.max(0.22, 1 - state.t / (runMode === 'infestation' ? 9000 : 6200)) : state.zone;
      state.muzzle = Math.max(0, state.muzzle - 1);
      state.reloadPulse = Math.max(0, (state.reloadPulse || 0) - 1);
      state.dash = Math.max(0, state.dash - 1);
      state.scan = Math.max(0, state.scan - 1);
      state.turret = Math.max(0, state.turret - 1);

      if (state.phase === 'running') {
        const keys = state.moveKeys || {};
        const turnInput = (keys.turnRight ? 1 : 0) - (keys.turnLeft ? 1 : 0);
        const forwardInput = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0);
        const strafeInput = (keys.strafeRight ? 1 : 0) - (keys.strafeLeft ? 1 : 0);
        const speedStat = Math.max(4, Math.min(12, selectedHero.stats?.spd || 6));
        const moveSpeed = 0.034 + speedStat * 0.0028 + (selectedHero.category === 'slayer' ? 0.006 : 0);
        state.turnVel = state.turnVel * 0.72 + turnInput * 0.035;
        state.angle += state.turnVel;
        const sin = Math.sin(state.angle);
        const cos = Math.cos(state.angle);
        const inputScale = forwardInput && strafeInput ? 0.72 : 1;
        const ax = (sin * forwardInput + cos * strafeInput) * moveSpeed * inputScale;
        const ay = (cos * forwardInput - sin * strafeInput) * moveSpeed * inputScale;
        state.vx = state.vx * 0.78 + ax;
        state.vy = state.vy * 0.78 + ay;
        state.px = Math.max(-7.5, Math.min(7.5, state.px + state.vx));
        state.py = Math.max(-1.4, Math.min(28, state.py + state.vy));

        state.enemies = state.enemies.map((enemy, index) => {
          const slow = state.scan > 0 ? 0.55 : 1;
          const dx = state.px - enemy.wx;
          const dy = state.py - enemy.wy;
          const distance = Math.max(0.2, Math.hypot(dx, dy));
          const pressure = enemy.kind === 'Sniper' ? 0.003 : enemy.speed * 10.5 * slow * (1.05 - state.zone * 0.24);
          const orbit = enemy.kind === 'Sniper' ? Math.sin(state.t * 0.02 + index) * 0.025 : Math.sin(state.t * 0.014 + index) * 0.01;
          return {
            ...enemy,
            wx: enemy.wx + (dx / distance) * pressure + orbit,
            wy: enemy.wy + (dy / distance) * pressure
          };
        });
        if (state.t % 70 === 0) {
          const pressure = state.enemies
            .filter(enemy => enemy.hp > 0 && Math.hypot(enemy.wx - state.px, enemy.wy - state.py) < 1.25)
            .reduce((sum, enemy) => sum + enemy.dmg, 0);
          if (pressure > 0) {
            const absorbed = Math.min(state.armor, Math.ceil(pressure * 0.5));
            state.armor -= absorbed;
            state.hp = Math.max(0, state.hp - Math.max(1, pressure - absorbed));
          }
        }
        if (state.t % 110 === 0 && state.zone < 0.55) {
          state.hp = Math.max(0, state.hp - Math.ceil((0.58 - state.zone) * 12));
        }
        if (state.turret > 0 && state.t % 34 === 0) {
          const target = state.enemies
            .filter(enemy => enemy.hp > 0)
            .sort((a, b) => projectWorld(a, state).dist - projectWorld(b, state).dist)[0];
          if (target) {
            target.hp -= 14;
            if (target.hp <= 0) state.kills += 1;
          }
        }
        if (state.enemies.every(enemy => enemy.hp <= 0)) {
          const nextWave = state.wave + 1;
          if (state.enemies.some(enemy => enemy.kind === 'Champion de Trame')) {
            finishRun('victory');
          } else if ((runMode === 'extraction' && nextWave >= 4) || (runMode === 'hunt' && state.wave >= 2) || (runMode === 'last_signal' && nextWave >= 5)) {
            state.enemies = buildEnemies(nextWave, true);
            state.wave = nextWave;
          } else {
            state.wave = nextWave;
            state.enemies = buildEnemies(nextWave, runMode === 'hunt' && nextWave >= 3);
            state.loot = [...state.loot.filter(item => !item.used), ...buildLoot(nextWave)];
          }
        }
        if (state.hp <= 0) finishRun('defeat');
        if (state.t % 18 === 0) {
          setRunSnapshot({
            phase: state.phase,
            hp: state.hp,
            ammo: state.ammo,
            kills: state.kills,
            wave: state.wave,
            loot: state.loot.filter(item => item.used).length,
            result: state.result,
            rewards: state.rewards
          });
        }
      }

      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.54);
      sky.addColorStop(0, state.fragments?.[0] ? '#201235' : '#151515');
      sky.addColorStop(1, '#050209');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const bandColors = ['#162845', '#231339', '#381515'];
      (state.fragments || universeFragments).forEach((fragment, index) => {
        ctx.fillStyle = bandColors[index % bandColors.length];
        ctx.fillRect(index * canvas.width / 3, canvas.height * 0.54, canvas.width / 3 + 2, canvas.height * 0.46);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.font = '11px "Share Tech Mono"';
        ctx.fillText(String(fragment).toUpperCase().slice(0, 16), index * canvas.width / 3 + 16, canvas.height * 0.6);
      });
      ctx.strokeStyle = 'rgba(255,234,0,0.22)';
      for (let i = -8; i <= 8; i++) {
        const x = canvas.width / 2 + i * 48 + Math.sin(state.angle) * 58 - state.px * 18;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.54);
        ctx.lineTo(canvas.width / 2 + i * 170 + Math.sin(state.angle) * 220 - state.px * 28, canvas.height);
        ctx.stroke();
      }
      const floorOffset = ((state.py * 18) % 28 + 28) % 28;
      for (let y = canvas.height * 0.58 + floorOffset; y < canvas.height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(231,76,60,0.72)';
      ctx.lineWidth = 6;
      ctx.strokeRect((1 - state.zone) * 140, (1 - state.zone) * 70, canvas.width - (1 - state.zone) * 280, canvas.height - (1 - state.zone) * 140);
      if (state.zone < 0.62) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.22, (0.64 - state.zone) * 0.5)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        for (let y = 0; y < canvas.height; y += 9) ctx.fillRect(0, y, canvas.width, 2);
      }

      state.loot
        .filter(item => !item.used)
        .map(item => ({ item, projection: projectWorld(item, state) }))
        .filter(({ projection }) => projection.camZ > 0.25 && Math.abs(projection.aim) < 1.3)
        .sort((a, b) => b.projection.camZ - a.projection.camZ)
        .forEach(({ item, projection }) => {
          const scale = Math.min(1.4, 1 / projection.camZ);
          const x = canvas.width / 2 + projection.aim * canvas.width * 0.78;
          const y = canvas.height * 0.67 + 46 * scale;
          ctx.fillStyle = item.color;
          ctx.fillRect(x - 12 * scale, y - 12 * scale, 24 * scale, 24 * scale);
          ctx.fillStyle = '#fff';
          ctx.font = `${Math.max(8, 12 * scale)}px "Share Tech Mono"`;
          ctx.fillText(item.type.toUpperCase().slice(0, 3), x - 12 * scale, y - 17 * scale);
        });

      state.enemies
        .filter(enemy => enemy.hp > 0)
        .map(enemy => ({ enemy, projection: projectWorld(enemy, state) }))
        .filter(({ projection }) => projection.camZ > 0.24 && Math.abs(projection.aim) < 1.45)
        .sort((a, b) => b.projection.camZ - a.projection.camZ)
        .forEach(({ enemy, projection }) => {
          const scale = Math.min(1.8, 1 / projection.camZ);
          const x = canvas.width / 2 + projection.aim * canvas.width * 0.78;
          const y = canvas.height * 0.58 - 28 * scale;
          const w = 52 * scale * enemy.size;
          const h = 94 * scale * enemy.size;
          ctx.fillStyle = 'rgba(0,0,0,0.42)';
          ctx.fillRect(x - w * 0.5, y + h * 0.86, w, 8 * scale);
          ctx.fillStyle = enemy.color;
          ctx.fillRect(x - w * 0.35, y, w * 0.7, h);
          ctx.fillStyle = '#fff';
          ctx.fillRect(x - w * 0.18, y + h * 0.16, w * 0.12, h * 0.08);
          ctx.fillRect(x + w * 0.06, y + h * 0.16, w * 0.12, h * 0.08);
          ctx.fillStyle = '#111';
          ctx.fillRect(x - w * 0.4, y - 8, w * 0.8, 4);
          ctx.fillStyle = enemy.kind === 'Champion de Trame' ? '#ffea00' : '#e74c3c';
          ctx.fillRect(x - w * 0.4, y - 8, w * 0.8 * Math.max(0, enemy.hp / enemy.maxHp), 4);
          ctx.fillStyle = '#fff';
          ctx.font = `${Math.max(7, 10 * scale)}px "Share Tech Mono"`;
          ctx.fillText(enemy.kind.toUpperCase().slice(0, 12), x - w * 0.42, y - 13);
        });

      ctx.fillStyle = 'rgba(0,0,0,0.66)';
      ctx.fillRect(0, 0, canvas.width, 48);
      ctx.fillStyle = state.hp < 35 ? '#e74c3c' : '#2ecc71';
      ctx.fillRect(18, 17, Math.max(0, state.hp) * 1.2, 10);
      ctx.strokeStyle = '#2ecc71';
      ctx.strokeRect(18, 17, 308, 10);
      ctx.fillStyle = '#3498db';
      ctx.fillRect(18, 30, Math.max(0, state.armor) * 2.2, 5);
      ctx.fillStyle = '#fff';
      ctx.font = '12px "Share Tech Mono"';
      ctx.fillText(`${selectedHero.name} / HP ${Math.round(state.hp)} / ARM ${Math.round(state.armor)} / AMMO ${state.ammo} / W${state.wave} / K${state.kills}`, 18, 45);
      ctx.fillStyle = '#ffea00';
      ctx.fillText(state.objective || objectives[runMode], canvas.width - 390, 31);

      ctx.strokeStyle = state.muzzle ? '#ffea00' : 'rgba(255,255,255,0.72)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 12, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 12, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 12);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + 12);
      ctx.stroke();

      ctx.fillStyle = 'rgba(0,0,0,0.52)';
      ctx.fillRect(canvas.width - 116, 58, 92, 92);
      ctx.strokeStyle = '#39c5bb';
      ctx.strokeRect(canvas.width - 116, 58, 92, 92);
      ctx.fillStyle = '#ffea00';
      ctx.fillRect(canvas.width - 72 + state.px * 3.2, 103 - state.py * 1.4, 4, 4);
      ctx.strokeStyle = '#ffea00';
      ctx.beginPath();
      ctx.moveTo(canvas.width - 70 + state.px * 3.2, 105 - state.py * 1.4);
      ctx.lineTo(canvas.width - 70 + state.px * 3.2 + Math.sin(state.angle) * 16, 105 - state.py * 1.4 - Math.cos(state.angle) * 16);
      ctx.stroke();

      if (selectedHero?.id === 'arca_mirelle' && fpsHandsRef.current?.complete && fpsHandsRef.current.naturalWidth) {
        const sheet = fpsHandsRef.current;
        const frameW = sheet.naturalWidth / 4;
        const frameH = sheet.naturalHeight / 10;
        const row = state.reloadPulse > 0 && !state.muzzle ? 6 : 0;
        const reloadTrimTop = row === 6 ? 40 : 0;
        const reloadTrimBottom = row === 6 ? 6 : 0;
        const sourceH = frameH - reloadTrimTop - reloadTrimBottom;
        const col = Math.floor(state.t / 12) % 4;
        const handW = 300;
        const handH = 188;
        ctx.drawImage(
          sheet,
          col * frameW,
          row * frameH + reloadTrimTop,
          frameW,
          sourceH,
          canvas.width / 2 - handW / 2 - state.turnVel * 430 + state.vx * 85,
          canvas.height - handH - 4,
          handW,
          handH
        );
        if (state.muzzle && fpsProjectileRef.current?.complete && fpsProjectileRef.current.naturalWidth) {
          const projectileSheet = fpsProjectileRef.current;
          ctx.globalAlpha = 0.88;
          ctx.drawImage(projectileSheet, 0, 0, projectileSheet.naturalWidth, projectileSheet.naturalHeight, canvas.width / 2 - 205, canvas.height / 2 - 94, 410, 146);
          ctx.globalAlpha = 1;
        }
      } else {
        ctx.fillStyle = selectedHero.primaryColor || '#444';
        ctx.fillRect(canvas.width / 2 - 80 - state.turnVel * 430 + state.vx * 85, canvas.height - 116, 160, 96);
        ctx.fillStyle = weaponProfile.color;
        ctx.fillRect(canvas.width / 2 - 34 - state.turnVel * 430 + state.vx * 85, canvas.height - 100, 68, 28);
        if (state.muzzle) {
          ctx.fillStyle = '#ffea00';
          ctx.fillRect(canvas.width / 2 - 14, canvas.height - 126, 28, 28);
        }
      }
      if (state.phase !== 'running') {
        ctx.fillStyle = 'rgba(0,0,0,0.72)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffea00';
        ctx.font = '18px "Press Start 2P"';
        ctx.fillText(state.phase === 'ended' ? (state.rewards?.title || 'RUN END') : 'ZONE D EXTINCTION', 46, canvas.height / 2 - 16);
        ctx.fillStyle = '#d8f7ff';
        ctx.font = '13px "Share Tech Mono"';
        ctx.fillText(state.phase === 'ended'
          ? `Kills ${state.kills} / Wave ${state.wave} / XP ${state.rewards?.modeXp || 0}`
          : (lang === 'fr' ? 'Choisis un heros puis demarre une compression de Trame.' : 'Choose a hero, then start a Thread compression run.'),
          48,
          canvas.height / 2 + 18
        );
      }
      rafId = window.requestAnimationFrame(loop);
    };
    loop();
    return () => window.cancelAnimationFrame(rafId);
  }, [buildEnemies, buildLoot, finishRun, lang, objectives, projectWorld, runMode, selectedHero, universeFragments, weaponProfile.color]);

  const fire = () => {
    const state = stateRef.current;
    if (state.phase !== 'running') {
      startRun();
      return;
    }
    if (!state.ammo) return;
    state.ammo -= 1;
    state.muzzle = 36;
    const role = roleProfile[selectedHero?.category] || roleProfile.marine;
    const target = state.enemies
      .filter(enemy => enemy.hp > 0)
      .map(enemy => ({ enemy, projection: projectWorld(enemy, state) }))
      .filter(({ projection }) => projection.camZ > 0.24 && Math.abs(projection.aim) < 0.2 + weaponProfile.spread)
      .sort((a, b) => (Math.abs(a.projection.aim) + a.projection.camZ * 0.035) - (Math.abs(b.projection.aim) + b.projection.camZ * 0.035))[0]?.enemy;
    if (target) {
      const closeBonus = selectedHero?.category === 'slayer' && projectWorld(target, state).dist < 2.2 ? 1.45 : 1;
      target.hp -= Math.round(34 * role.dmg * closeBonus);
      if (target.hp <= 0) {
        state.kills += 1;
        if (selectedHero?.category === 'horror') state.hp = Math.min(state.maxHp, state.hp + 8);
      }
    }
    sound.playSfx('confirm');
  };

  const reload = () => {
    stateRef.current.ammo = stateRef.current.maxAmmo || 24;
    stateRef.current.reloadPulse = 12;
    sound.playSfx('coin');
  };

  const setMoveKey = (key, active) => {
    const state = stateRef.current;
    state.moveKeys = { ...(state.moveKeys || {}), [key]: active };
  };

  const activateRoleSkill = () => {
    const state = stateRef.current;
    if (state.phase !== 'running') return;
    if (selectedHero?.category === 'slayer' && state.dash <= 0) {
      state.px = Math.max(-7.5, Math.min(7.5, state.px + Math.sin(state.angle) * 2.4));
      state.py = Math.max(-1.4, Math.min(28, state.py + Math.cos(state.angle) * 2.4));
      state.dash = 220;
    } else if (selectedHero?.category === 'hacker') {
      state.scan = 360;
    } else if (selectedHero?.category === 'tactical') {
      state.turret = 520;
    } else if (selectedHero?.category === 'marine') {
      state.armor += 18;
    } else if (selectedHero?.category === 'horror') {
      state.hp = Math.min(state.maxHp, state.hp + 20);
    }
    sound.playSfx('special');
  };

  const collectLoot = () => {
    const state = stateRef.current;
    if (state.phase !== 'running') return;
    const item = state.loot.find(candidate => !candidate.used && Math.hypot(candidate.wx - state.px, candidate.wy - state.py) < 1.25);
    if (!item) return;
    item.used = true;
    if (item.type === 'normal') {
      state.hp = Math.min(state.maxHp, state.hp + 24);
      state.ammo = state.maxAmmo;
      state.reloadPulse = 10;
    } else if (item.type === 'summon') {
      state.turret = Math.max(state.turret, 500);
    } else if (item.type === 'ultimate') {
      state.enemies.forEach(enemy => { enemy.hp -= 95; });
      state.kills += state.enemies.filter(enemy => enemy.hp <= 0 && !enemy.counted).length;
      state.enemies.forEach(enemy => { if (enemy.hp <= 0) enemy.counted = true; });
    }
    sound.playSfx(item.type === 'ultimate' ? 'special' : 'coin');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'z' || key === 'arrowup') {
        setMoveKey('forward', true);
        event.preventDefault();
      } else if (key === 's' || key === 'arrowdown') {
        setMoveKey('back', true);
        event.preventDefault();
      } else if (key === 'a' || key === 'q') {
        setMoveKey('strafeLeft', true);
        event.preventDefault();
      } else if (key === 'd') {
        setMoveKey('strafeRight', true);
        event.preventDefault();
      } else if (key === 'arrowleft') {
        setMoveKey('turnLeft', true);
        event.preventDefault();
      } else if (key === 'arrowright') {
        setMoveKey('turnRight', true);
        event.preventDefault();
      } else if (key === ' ' || key === 'enter') {
        fire();
        event.preventDefault();
      } else if (key === 'r') {
        reload();
        event.preventDefault();
      } else if (key === 'e') {
        collectLoot();
        event.preventDefault();
      } else if (key === 'shift') {
        activateRoleSkill();
        event.preventDefault();
      }
    };
    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'z' || key === 'arrowup') {
        setMoveKey('forward', false);
      } else if (key === 's' || key === 'arrowdown') {
        setMoveKey('back', false);
      } else if (key === 'a' || key === 'q') {
        setMoveKey('strafeLeft', false);
      } else if (key === 'd') {
        setMoveKey('strafeRight', false);
      } else if (key === 'arrowleft') {
        setMoveKey('turnLeft', false);
      } else if (key === 'arrowright') {
        setMoveKey('turnRight', false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  });

  return (
    <div className="glass-panel nexus-play-panel extinction-panel">
      <div className="nexus-play-copy">
        <div className="portal-focus-kicker">{lang === 'fr' ? 'ZONE D EXTINCTION / FPS ROYALE' : 'EXTINCTION ZONE / FPS ROYALE'}</div>
        <h3>{lang === 'fr' ? 'Zone d Extinction' : 'Extinction Zone'}</h3>
        <p>
          {lang === 'fr'
            ? 'Simulation dangereuse A.R.C.A.: les Trames trop instables sont compressees avant d envahir la Cite-Mosaique. Choisis une signature, loot, survis aux vagues, evite la Marge Blanche et force une extraction.'
            : 'Dangerous A.R.C.A. simulation: unstable Threads are compressed before they invade Mosaic City. Pick a signature, loot, survive waves, avoid the White Margin, and force extraction.'}
        </p>
        <select value={runMode} onChange={event => setRunMode(event.target.value)} className="nexus-select">
          <option value="extraction">{lang === 'fr' ? 'Solo Extraction' : 'Solo Extraction'}</option>
          <option value="last_signal">{lang === 'fr' ? 'Dernier Signal' : 'Last Signal'}</option>
          <option value="infestation">{lang === 'fr' ? 'Infestation' : 'Infestation'}</option>
          <option value="hunt">{lang === 'fr' ? 'Chasse au Champion' : 'Champion Hunt'}</option>
        </select>
        <select value={selectedHero?.id || ''} onChange={event => setSelectedHeroId(event.target.value)} className="nexus-select">
          {playableHeroes.map(hero => (
            <option key={hero.id} value={hero.id}>{hero.name} / {hero.universe}</option>
          ))}
        </select>
        <div className="nexus-play-intel">
          <strong>{weaponProfile.name}</strong>
          <span>{selectedHero?.category || 'marine'} - {(roleProfile[selectedHero?.category] || roleProfile.marine).perk}</span>
          <small>{universeFragments.join(' / ')} - {lang === 'fr' ? 'Z/W avancer, S reculer, A/Q-D strafes, fleches gauche/droite tourner' : 'W/Z forward, S back, A/Q-D strafe, left/right arrows turn'}</small>
        </div>
        <div className="nexus-play-stats">
          <span>{runSnapshot.phase === 'running' ? (lang === 'fr' ? 'RUN ACTIVE' : 'RUN ACTIVE') : (lang === 'fr' ? 'PRET' : 'READY')}</span>
          <span>HP {Math.round(runSnapshot.hp || 0)}</span>
          <span>WAVE {runSnapshot.wave}</span>
          <span>KILLS {runSnapshot.kills}</span>
        </div>
        {runSnapshot.rewards && (
          <div className="nexus-play-intel">
            <strong>{runSnapshot.rewards.title}</strong>
            <span>+{runSnapshot.rewards.gold} Or / +{runSnapshot.rewards.shards} Fragments / +{runSnapshot.rewards.modeXp} XP</span>
          </div>
        )}
        <div className="nexus-play-actions">
          <button className="btn-retro" onClick={startRun} title={lang === 'fr' ? 'Lance ou recommence une run Zone d Extinction.' : 'Start or restart an Extinction Zone run.'}>{runSnapshot.phase === 'running' ? (lang === 'fr' ? 'RESTART' : 'RESTART') : (lang === 'fr' ? 'DEMARRER RUN' : 'START RUN')}</button>
          <button className="btn-retro" onClick={fire} title={lang === 'fr' ? 'Tire avec l arme FPS du heros selectionne.' : 'Fire the selected hero FPS weapon.'}>{lang === 'fr' ? 'TIRER' : 'FIRE'}</button>
          <button className="btn-retro" onClick={reload} title={lang === 'fr' ? 'Recharge les munitions au maximum.' : 'Refill ammunition to maximum.'}>{lang === 'fr' ? 'RECHARGER' : 'RELOAD'}</button>
          <button className="btn-retro" onClick={activateRoleSkill} title={lang === 'fr' ? 'Active la capacite speciale liee au role du heros.' : 'Activate the selected hero role ability.'}>{lang === 'fr' ? 'ROLE' : 'ROLE'}</button>
          <button className="btn-retro" onClick={collectLoot} title={lang === 'fr' ? 'Ramasse l objet proche si tu es assez pres.' : 'Pick up the nearby item if you are close enough.'}>{lang === 'fr' ? 'LOOT' : 'LOOT'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour avancer.' : 'Hold to move forward.'} onPointerDown={() => setMoveKey('forward', true)} onPointerUp={() => setMoveKey('forward', false)} onPointerLeave={() => setMoveKey('forward', false)}>{lang === 'fr' ? 'AVANT' : 'FORWARD'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour reculer.' : 'Hold to move backward.'} onPointerDown={() => setMoveKey('back', true)} onPointerUp={() => setMoveKey('back', false)} onPointerLeave={() => setMoveKey('back', false)}>{lang === 'fr' ? 'RECUL' : 'BACK'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour se deplacer lateralement a gauche.' : 'Hold to strafe left.'} onPointerDown={() => setMoveKey('strafeLeft', true)} onPointerUp={() => setMoveKey('strafeLeft', false)} onPointerLeave={() => setMoveKey('strafeLeft', false)}>{lang === 'fr' ? 'STRAFE G' : 'STRAFE L'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour se deplacer lateralement a droite.' : 'Hold to strafe right.'} onPointerDown={() => setMoveKey('strafeRight', true)} onPointerUp={() => setMoveKey('strafeRight', false)} onPointerLeave={() => setMoveKey('strafeRight', false)}>{lang === 'fr' ? 'STRAFE D' : 'STRAFE R'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour tourner la camera vers la gauche.' : 'Hold to turn the camera left.'} onPointerDown={() => setMoveKey('turnLeft', true)} onPointerUp={() => setMoveKey('turnLeft', false)} onPointerLeave={() => setMoveKey('turnLeft', false)}>{lang === 'fr' ? 'TOURNER G' : 'TURN L'}</button>
          <button className="btn-retro" title={lang === 'fr' ? 'Maintenir pour tourner la camera vers la droite.' : 'Hold to turn the camera right.'} onPointerDown={() => setMoveKey('turnRight', true)} onPointerUp={() => setMoveKey('turnRight', false)} onPointerLeave={() => setMoveKey('turnRight', false)}>{lang === 'fr' ? 'TOURNER D' : 'TURN R'}</button>
        </div>
      </div>
      <canvas ref={canvasRef} width="840" height="430" className="fps-royale-canvas" onClick={fire} />
    </div>
  );
}

function MultiverseRiftMap({
  lang,
  stages,
  allStages = stages,
  completedStages,
  isStageUnlocked,
  onSelectStage,
  onSelectArc,
  narrativeArcs = [],
  mapKicker,
  mapTitle,
  mapDescription,
  getStageStatus,
  getStageUnlockRequirementText,
  getStageRewardPreview,
  selectedStageId,
  viewType = 'story'
}) {
  const modeMeta = useMemo(() => ({
    RPG: { color: '#3498db', label: 'RPG', ring: 'ATB' },
    Tactics: { color: '#9b59b6', label: lang === 'fr' ? 'TACTIQUE' : 'TACTICS', ring: 'GRID' },
    Smash: { color: '#e74c3c', label: 'SMASH', ring: 'BURST' }
  }), [lang]);

  const portalNodes = useMemo(() => stages.slice(0, 42).map((stage, index) => {
    const modeIndex = ['RPG', 'Tactics', 'Smash'].indexOf(stage.mode);
    const angle = ((index * 137.508) % 360) * Math.PI / 180;
    const ring = 22 + (index % 4) * 9 + modeIndex * 4;
    const x = 50 + Math.cos(angle) * ring;
    const y = 50 + Math.sin(angle) * (ring * 0.64);
    return {
      stage,
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(12, Math.min(88, y)),
      size: stage.difficulty?.includes('Final') ? 78 : stage.difficulty === 'Expert' ? 62 : stage.difficulty === 'Very Hard' ? 56 : 48,
      delay: `${-(index % 9) * 0.24}s`,
      meta: modeMeta[stage.mode] || modeMeta.RPG
    };
  }), [stages, modeMeta]);

  const counts = portalNodes.reduce((acc, node) => {
    acc[node.stage.mode] = (acc[node.stage.mode] || 0) + 1;
    return acc;
  }, {});
  const sealedCount = portalNodes.filter(node => completedStages.includes(node.stage.id)).length;
  const unlockedCount = portalNodes.filter(node => isStageUnlocked(node.stage)).length;
  const lockedCount = Math.max(0, portalNodes.length - unlockedCount);
  const nextOpenNode = portalNodes.find(node => !completedStages.includes(node.stage.id) && isStageUnlocked(node.stage));
  const hiddenNodeCount = Math.max(0, stages.length - portalNodes.length);

  const arcRoutes = narrativeArcs.slice(0, 12).map((arc, index) => {
    const linkedStages = getLinkedStagesForArc(arc, allStages, BASE_HEROES_DB);
    const timeline = buildArcTimeline(arc, linkedStages, completedStages, lang);
    const angle = ((index * 47) % 360) * Math.PI / 180;
    const radius = 31 + (index % 3) * 8;
    return {
      arc,
      timeline,
      linkedStages,
      x: Math.max(10, Math.min(90, 50 + Math.cos(angle) * radius)),
      y: Math.max(16, Math.min(84, 50 + Math.sin(angle) * radius * 0.58)),
      color: index % 3 === 0 ? '#ffb15c' : index % 3 === 1 ? '#9b59b6' : '#39c5bb'
    };
  });

  const viewTone = {
    story: { color: '#39c5bb', label: lang === 'fr' ? 'Campagne' : 'Campaign' },
    universe: { color: '#ffb15c', label: lang === 'fr' ? 'Atlas univers' : 'Universe atlas' },
    personal: { color: '#9b59b6', label: lang === 'fr' ? 'Dossiers heros' : 'Hero files' },
    trio: { color: '#2ecc71', label: lang === 'fr' ? 'Cellules trio' : 'Trio cells' },
    fusion: { color: '#ff5f7e', label: lang === 'fr' ? 'Hybrides' : 'Hybrid rifts' }
  }[viewType] || { color: '#39c5bb', label: 'A.R.C.A.' };

  return (
    <div className="rift-universe-map" style={{ '--rift-view-color': viewTone.color }}>
      <div className="rift-map-copy">
        <div className="portal-focus-kicker">{mapKicker || (lang === 'fr' ? 'CARTE DES FAILLES / CAMPAGNE' : 'RIFT MAP / CAMPAIGN')}</div>
        <h4>{mapTitle || (lang === 'fr' ? 'Portails actifs du multivers' : 'Active multiverse portals')}</h4>
        <p>
          {mapDescription || (lang === 'fr'
            ? 'Les breches ne sont plus seulement une grille: A.R.C.A. les projette comme des portails physiques. En ecran d arc, les routes relient intro, missions, interludes et boss.'
            : 'Breaches are no longer only a grid: A.R.C.A. projects them as physical portals. In arc screens, routes link intro, missions, interludes, and boss.')}
        </p>
        <div className="rift-map-legend">
          <span style={{ '--rift-color': viewTone.color }}>
            {viewTone.label}
          </span>
          {Object.entries(modeMeta).map(([mode, meta]) => (
            <span key={mode} style={{ '--rift-color': meta.color }}>
              {meta.label}: {counts[mode] || 0}
            </span>
          ))}
          {arcRoutes.length > 0 && (
            <span style={{ '--rift-color': '#ffb15c' }}>
              {lang === 'fr' ? 'ROUTES ARC' : 'ARC ROUTES'}: {arcRoutes.length}
            </span>
          )}
        </div>
        <div className="rift-map-status-grid">
          <span>
            <b>{sealedCount}</b>
            {lang === 'fr' ? 'scellees' : 'sealed'}
          </span>
          <span>
            <b>{unlockedCount}</b>
            {lang === 'fr' ? 'ouvertes' : 'open'}
          </span>
          <span>
            <b>{lockedCount}</b>
            {lang === 'fr' ? 'verrouillees' : 'locked'}
          </span>
        </div>
        {nextOpenNode && (
          <button
            type="button"
            className="rift-next-action"
            onClick={() => onSelectStage(nextOpenNode.stage)}
            title={lang === 'fr'
              ? 'Selectionne la prochaine faille jouable non stabilisee.'
              : 'Select the next playable unstabilized rift.'}
          >
            <strong>{lang === 'fr' ? 'Prochaine coordonnee' : 'Next coordinate'}</strong>
            <span>#{nextOpenNode.stage.id} {nextOpenNode.stage.displayName?.[lang] || nextOpenNode.stage.name}</span>
          </button>
        )}
        {hiddenNodeCount > 0 && (
          <div className="rift-map-overflow-note">
            {lang === 'fr'
              ? `${hiddenNodeCount} breche(s) supplementaire(s) archivees pour garder la carte lisible. Affine les filtres pour les inspecter.`
              : `${hiddenNodeCount} additional breach(es) archived to keep the map readable. Refine filters to inspect them.`}
          </div>
        )}
      </div>
      <div className="rift-map-stage" aria-label={lang === 'fr' ? 'Carte visuelle des failles' : 'Visual rift map'}>
        <div className="rift-map-core">
          <strong>NEXUS</strong>
          <span>{lang === 'fr' ? 'Ancre centrale' : 'Central Anchor'}</span>
        </div>
        {portalNodes.length === 0 && arcRoutes.length === 0 && (
          <div className="rift-map-empty-state">
            <strong>{lang === 'fr' ? 'Aucune coordonnee visible' : 'No visible coordinate'}</strong>
            <span>
              {lang === 'fr'
                ? 'Cette vue ne contient aucune faille disponible avec les filtres, les DLC actifs et les prerequis actuels.'
                : 'This view has no visible rift with the current filters, active DLC, and requirements.'}
            </span>
          </div>
        )}
        {arcRoutes.map(route => {
          const doneCount = route.timeline.filter(node => node.status === 'done').length;
          const ratio = route.timeline.length ? doneCount / route.timeline.length : 0;
          return (
            <button
              key={`arc-route-${route.arc.id}`}
              type="button"
              className={`rift-arc-route ${ratio >= 1 ? 'sealed' : ''}`}
              style={{
                '--rift-x': `${route.x}%`,
                '--rift-y': `${route.y}%`,
                '--rift-color': route.color
              }}
              onClick={() => onSelectArc ? onSelectArc(route.arc) : undefined}
              title={lang === 'fr'
                ? `Ouvre la page dediee de cet arc: ${getLocalizedText(route.arc.title, lang, route.arc.id)}.`
                : `Open this arc dedicated page: ${getLocalizedText(route.arc.title, lang, route.arc.id)}.`}
            >
              <i />
              <b>{Math.round(ratio * 100)}%</b>
              <span>{route.timeline.find(node => node.status !== 'done')?.label || (lang === 'fr' ? 'OUTRO' : 'OUTRO')}</span>
            </button>
          );
        })}
        {portalNodes.map(node => {
          const completed = completedStages.includes(node.stage.id);
          const locked = !isStageUnlocked(node.stage);
          const status = getStageStatus ? getStageStatus(node.stage) : {
            id: completed ? 'sealed' : locked ? 'locked' : 'available',
            label: completed ? (lang === 'fr' ? 'Scellee' : 'Sealed') : locked ? (lang === 'fr' ? 'Verrouillee' : 'Locked') : (lang === 'fr' ? 'Disponible' : 'Available')
          };
          const rewardPreview = getStageRewardPreview ? getStageRewardPreview(node.stage).join(' / ') : '';
          const requirement = locked && getStageUnlockRequirementText ? getStageUnlockRequirementText(node.stage) : '';
          return (
            <button
              key={node.stage.id}
              type="button"
              className={`rift-portal-node ${completed ? 'sealed' : ''} ${locked ? 'locked' : ''} ${selectedStageId === node.stage.id ? 'selected' : ''}`}
              style={{
                '--rift-x': `${node.x}%`,
                '--rift-y': `${node.y}%`,
                '--rift-size': `${node.size}px`,
                '--rift-color': node.meta.color,
                '--rift-delay': node.delay
              }}
              onClick={() => onSelectStage(node.stage)}
              title={[
                `${node.stage.universe} - ${node.stage.name} - ${node.stage.mode}`,
                status.label,
                requirement,
                rewardPreview
              ].filter(Boolean).join(' | ')}
            >
              <i />
              <b>{node.stage.id}</b>
              <span>{node.meta.ring}</span>
              <em>{status.short || status.label}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RiftBriefingPanel({
  lang,
  stage,
  isUnlocked,
  onLaunch,
  onClose,
  getStageModifier,
  getStageArc,
  getLootRarity,
  getBossIntel,
  getRichBreachBrief,
  getLockedReason,
  getStageRewardPreview,
  getMissionLaunchBrief,
  getMissionOutcomePreview
}) {
  if (!stage) {
    return (
      <div className="rift-briefing-panel rift-briefing-empty">
        <div>
          <div className="portal-focus-kicker">{lang === 'fr' ? 'INSPECTEUR A.R.C.A.' : 'A.R.C.A. INSPECTOR'}</div>
          <div className="rift-briefing-title">{lang === 'fr' ? 'Aucune faille selectionnee' : 'No rift selected'}</div>
          <div className="rift-briefing-copy">
            {lang === 'fr'
              ? 'Selectionne un portail sur la carte pour lire son briefing, ses recompenses, ses pre requis et ses consequences de Trame.'
              : 'Select a portal on the map to read its briefing, rewards, requirements, and Thread consequences.'}
          </div>
        </div>
      </div>
    );
  }
  const modifier = getStageModifier(stage);
  const stageArc = getStageArc(stage);
  const rarity = getLootRarity(stage);
  const bossIntel = getBossIntel(stage);
  const backdrop = getOpenAiBackdropSrc(stage.universe, stage.mode);
  const rewardPreview = getStageRewardPreview ? getStageRewardPreview(stage) : [];
  const launchBrief = getMissionLaunchBrief ? getMissionLaunchBrief(stage) : [];
  const outcomePreview = getMissionOutcomePreview ? getMissionOutcomePreview(stage) : [];
  const lockedReason = !isUnlocked(stage) && getLockedReason ? getLockedReason(stage) : '';

  return (
    <div className="rift-briefing-panel">
      <div
        className="rift-briefing-art"
        style={{
          backgroundImage: backdrop
            ? `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.35)), url(${backdrop})`
            : 'linear-gradient(135deg, rgba(57,197,187,0.18), rgba(155,89,182,0.14))'
        }}
      />
      <div>
        <div className="portal-focus-kicker">
          {lang === 'fr' ? 'INSPECTEUR DE FAILLE' : 'RIFT INSPECTOR'}
        </div>
        <div className="rift-briefing-title">
          #{stage.id} {stage.displayName?.[lang] || stage.name}
        </div>
        <div className="rift-briefing-copy">
          {getRichBreachBrief(stage)}
        </div>
        {launchBrief.length > 0 && (
          <div className="rift-briefing-block">
            <strong>{lang === 'fr' ? 'Intro de lancement' : 'Launch intro'}</strong>
            {launchBrief.map((line, index) => <span key={index}>{line}</span>)}
          </div>
        )}
        <div className="rift-briefing-row">
          <span>{lang === 'fr' ? 'Univers' : 'Universe'}: <strong>{stage.sourceUniverses?.join(' / ') || stage.universe}</strong></span>
          <span>Boss: <strong>{bossIntel?.name || stage.bossName}</strong></span>
        </div>
        <div className="rift-briefing-row">
          <span style={{ color: modifier.color }}>{modifier.name[lang]}: {modifier.desc[lang]}</span>
        </div>
        {stageArc && (
          <div className="rift-briefing-row">
            <span style={{ color: stageArc.color }}>{stageArc.title[lang]}: {stageArc.premise[lang]}</span>
          </div>
        )}
        <div className="rift-briefing-row">
          <span style={{ color: rarity.color }}>
            {lang === 'fr' ? 'Signature estimee' : 'Estimated signature'}: {rarity.label}
          </span>
          <span>{bossIntel?.special || (lang === 'fr' ? 'Anomalie non cataloguée' : 'Uncatalogued anomaly')}</span>
        </div>
        {rewardPreview.length > 0 && (
          <div className="rift-briefing-block reward">
            <strong>{lang === 'fr' ? 'Cache prevue' : 'Expected cache'}</strong>
            {rewardPreview.map((line, index) => <span key={index}>{line}</span>)}
          </div>
        )}
        {lockedReason && (
          <div className="rift-briefing-block locked">
            <strong>{lang === 'fr' ? 'Prerequis verrouilles' : 'Locked requirements'}</strong>
            <span>{lockedReason}</span>
          </div>
        )}
        {outcomePreview.length > 0 && (
          <div className="rift-briefing-block consequence">
            <strong>{lang === 'fr' ? 'Consequences A.R.C.A.' : 'A.R.C.A. consequences'}</strong>
            {outcomePreview.map((line, index) => <span key={index}>{line}</span>)}
          </div>
        )}
      </div>
      <div className="rift-briefing-actions">
        <button
          onClick={() => onLaunch(stage)}
          disabled={!isUnlocked(stage)}
          className="btn-retro"
          title={isUnlocked(stage)
            ? (lang === 'fr' ? 'Lance la mission affichee dans l inspecteur.' : 'Start the mission shown in this inspector.')
            : (lang === 'fr' ? 'Mission verrouillee: stabilise plus de breches pour la debloquer.' : 'Mission locked: stabilize more breaches to unlock it.')}
        >
          {isUnlocked(stage) ? getTranslation(lang, 'deploySquad') : (lang === 'fr' ? 'SCELLE' : 'SEALED')}
        </button>
        <button
          onClick={onClose}
          className="btn-retro"
          title={lang === 'fr' ? 'Ferme l inspecteur de faille.' : 'Close the rift inspector.'}
        >
          {lang === 'fr' ? 'FERMER' : 'CLOSE'}
        </button>
      </div>
    </div>
  );
}

export default function HubScreen({
  lang,
  playerProfile,
  publicProfile,
  setPublicProfile,
  gold, setGold,
  breachShards, setBreachShards,
  eventTokens, setEventTokens,
  unlockedHeroes,
  heroLevels, setHeroLevels,
  activeTeam, setActiveTeam,
  completedStages,
  inventory, setInventory,
  equippedGear, setEquippedGear,
  equippedEventItems, setEquippedEventItems,
  heroTalents, setHeroTalents,
  heroSkins, setHeroSkins,
  hiddenUniverses = [],
  setHiddenUniverses,
  disabledAssets = {},
  setDisabledAssets,
  activityProgress = {},
  setActivityProgress,
  onLaunchStage,
  onGoToPortal
}) {
  const [activeTab, setActiveTab] = useState('missions');
  const [selectedHeroId, setSelectedHeroId] = useState(unlockedHeroes[0]);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'game' | 'movie' | 'manga' | 'music'
  const [missionModeFilter, setMissionModeFilter] = useState('all'); // 'all' | 'RPG' | 'Tactics' | 'Smash'
  const [missionScreen, setMissionScreen] = useState('index'); // 'index' | 'story' | 'universeArcs' | 'personalArcs' | 'trioArcs' | 'fusionMissions'
  const [missionSeed, setMissionSeed] = useState(() => Date.now());
  const [showMissionArchive, setShowMissionArchive] = useState(false);
  const [briefingStageId, setBriefingStageId] = useState(null);
  const [selectedNarrativeArcId, setSelectedNarrativeArcId] = useState(null);
  const [selectedNarrativeGroupId, setSelectedNarrativeGroupId] = useState(null);
  const [completedArcIntros, setCompletedArcIntros] = useState(() => activityProgress?.arcIntros || {});
  const [nexusMessage, setNexusMessage] = useState(null);
  const [codexView, setCodexView] = useState('canon');
  const [adminUniverseSearch, setAdminUniverseSearch] = useState('');
  const [expandedAdminUniverses, setExpandedAdminUniverses] = useState({});
  const [selectedCollectionUniverse, setSelectedCollectionUniverse] = useState(null);
  const hubContentMax = 'min(1500px, calc(100vw - 32px))';
  const [spritePreview, setSpritePreview] = useState(null);
  const hiddenUniverseSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const disabledAssetSets = useMemo(() => ({
    heroes: new Set(disabledAssets.heroes || []),
    enemies: new Set(disabledAssets.enemies || []),
    gear: new Set(disabledAssets.gear || []),
    stages: new Set(disabledAssets.stages || [])
  }), [disabledAssets]);
  useEffect(() => {
    setCompletedArcIntros(activityProgress?.arcIntros || {});
  }, [activityProgress?.arcIntros]);
  const isAssetDisabled = useCallback((type, id) => disabledAssetSets[type]?.has(String(id)), [disabledAssetSets]);
  const getEnemyAdminKey = useCallback((universe, enemy) => `${universe}::${enemy?.name || 'unknown'}`, []);
  const getStageAdminKey = useCallback((stage) => String(stage?.id), []);
  const getUniverseFaction = useCallback((universe) => {
    const direct = Object.entries(EXPANDED_FACTION_UNIVERSES)
      .find(([, universes]) => universes.includes(universe));
    if (direct) return direct[0];
    const mediaType = LORE_DB[universe]?.mediaType;
    if (mediaType === 'music') return 'stage';
    if (mediaType === 'manga') return 'arcane';
    if (['Alien', 'Predator', 'Prometheus', 'Stargate', 'Halo', 'Mass Effect', 'Gears of War', 'Star Wars', 'The Fifth Element'].includes(universe)) return 'sciFi';
    if (['Resident Evil', 'Silent Hill', 'Saw', 'Hellraiser', 'Dead Space', 'Chucky', 'Slender Man'].includes(universe)) return 'horror';
    if (['The Matrix', 'Portal', 'Ghost in the Shell', 'Digital Circus', 'Digimon'].includes(universe)) return 'cyber';
    if (['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'].includes(universe)) return 'tactical';
    if (['Mad Max', 'Fallout'].includes(universe)) return 'apocalypse';
    return 'unknown';
  }, []);
  const setAssetDisabled = useCallback((type, id, hidden) => {
    if (!setDisabledAssets) return;
    const key = String(id);
    setDisabledAssets(prev => {
      const next = {
        heroes: Array.isArray(prev?.heroes) ? [...prev.heroes] : [],
        enemies: Array.isArray(prev?.enemies) ? [...prev.enemies] : [],
        gear: Array.isArray(prev?.gear) ? [...prev.gear] : [],
        stages: Array.isArray(prev?.stages) ? [...prev.stages] : []
      };
      const bucket = new Set(next[type] || []);
      if (hidden) bucket.add(key);
      else bucket.delete(key);
      next[type] = Array.from(bucket).sort();
      return next;
    });
    sound.playSfx(hidden ? 'click' : 'coin');
  }, [setDisabledAssets]);
  const spriteOutputMap = useMemo(
    () => {
      const map = new Map((spriteManifest.entries || []).filter(entry => entry.available).map(entry => [entry.output, entry]));
      Object.values(MIRELLE_COMPLETE_SPRITES).forEach(output => {
        map.set(output, { output, available: true, source: 'openai-complete-pack' });
      });
      return map;
    },
    []
  );
  const getHeroSpriteInfo = useCallback((hero) => {
    const completePack = getHeroCompleteSpritePack(hero);
    const src = completePack?.[0]?.src || getHeroSpriteSheetSrc(hero, 'nexus');
    const entry = spriteOutputMap.get(src);
    return {
      src,
      ready: Boolean(entry) || Boolean(completePack?.length),
      source: entry?.source || (completePack ? 'openai-complete-pack' : null),
      kind: completePack ? 'pack' : 'hero',
      sheets: completePack || null
    };
  }, [spriteOutputMap]);
  const getEnemySpriteInfo = useCallback((enemy, universe) => {
    const src = getEnemySpriteSheetSrc({ ...enemy, universe });
    const entry = spriteOutputMap.get(src);
    return { src, ready: Boolean(entry), source: entry?.source || null };
  }, [spriteOutputMap]);
  const getItemSpriteInfo = useCallback((item) => {
    const src = getItemSpriteSrc(item);
    const entry = spriteOutputMap.get(src);
    return { src, ready: Boolean(entry), source: entry?.source || null, kind: 'item' };
  }, [spriteOutputMap]);
  const isUniverseVisible = useCallback(
    (universe) => !universe || universe === 'Nexus de Convergence' || !hiddenUniverseSet.has(universe),
    [hiddenUniverseSet]
  );
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const collectionBonusCount = inventory.filter(itemId => (
    itemId.startsWith('collection_reward_')
    || itemId.startsWith('arc_reward_')
    || itemId.startsWith('arc_')
    || itemId.startsWith('fusion_')
  )).length;
  const playerHero = createPlayerHero(playerProfile);
  const applySkin = useCallback((hero) => {
    const skin = SKIN_CATALOG[heroSkins?.[hero.id]];
    return skin ? { ...hero, ...skin.colors, activeSkin: skin } : hero;
  }, [heroSkins]);
  const ALL_HEROES_DB = useMemo(() => [playerHero, ...BASE_HEROES_DB].map(applySkin), [applySkin, playerHero]);
  const HEROES_DB = useMemo(
    () => ALL_HEROES_DB.filter(hero => (
      hero.id === playerHero.id
      || (isUniverseVisible(hero.universe) && !isAssetDisabled('heroes', hero.id))
    )),
    [ALL_HEROES_DB, isUniverseVisible, isAssetDisabled, playerHero.id]
  );
  const ALL_UNIVERSE_KEYS = Object.keys(LORE_DB);
  const DLC_UNIVERSE_KEYS = ALL_UNIVERSE_KEYS.filter(universe => !isBaseGameUniverse(universe));

  useEffect(() => {
    if (!setActiveTeam) return;
    setActiveTeam(prev => {
      const filtered = prev.filter(heroId => {
        const hero = ALL_HEROES_DB.find(item => item.id === heroId);
        return !hero || hero.id === playerHero.id || (isUniverseVisible(hero.universe) && !isAssetDisabled('heroes', hero.id));
      });
      if (filtered.length === prev.length) return prev;
      return filtered.length > 0 ? filtered : [playerHero.id];
    });
  }, [ALL_HEROES_DB, hiddenUniverses, isUniverseVisible, isAssetDisabled, playerHero.id, setActiveTeam]);

  const BREACH_MODIFIERS = [
    {
      id: 'gravity',
      name: { fr: 'Gravité instable', en: 'Unstable Gravity' },
      desc: { fr: 'Les ennemis frappent plus fort, mais les récompenses montent.', en: 'Enemies hit harder, but rewards are higher.' },
      enemyAtk: 1.12,
      reward: 1.15,
      color: '#f39c12'
    },
    {
      id: 'boss_rage',
      name: { fr: 'Boss enragé', en: 'Enraged Boss' },
      desc: { fr: 'Le boss gagne des PV et charge plus vite ses attaques.', en: 'The boss gains HP and pressures the squad harder.' },
      bossHp: 1.18,
      reward: 1.25,
      color: '#e74c3c'
    },
    {
      id: 'naquadah',
      name: { fr: 'Résonance Naquadah', en: 'Naquadah Resonance' },
      desc: { fr: 'Les héros gagnent un léger bonus défensif.', en: 'Heroes gain a small defensive boost.' },
      heroDef: 1.1,
      reward: 1,
      color: '#39c5bb'
    },
    {
      id: 'thin_rift',
      name: { fr: 'Faille mince', en: 'Thin Rift' },
      desc: { fr: 'Les ennemis sont plus rapides, les Fragments augmentent.', en: 'Enemies move faster, breach Shards increase.' },
      enemySpd: 1.12,
      reward: 1.18,
      color: '#9b59b6'
    }
  ];

  const DAILY_CONTRACTS = [
    { id: 'artifacts', mode: 'items', focus: 'ITEMS', text: { fr: 'Activer 3 artefacts de terrain', en: 'Activate 3 field artifacts' } },
    { id: 'rpg', mode: 'RPG', focus: 'ATB', text: { fr: 'Stabiliser une faille RPG', en: 'Stabilize one RPG breach' } },
    { id: 'tactics', mode: 'Tactics', focus: 'GRID', text: { fr: 'Gagner une mission tactique', en: 'Win one tactics mission' } },
    { id: 'smash', mode: 'Smash', focus: 'BURST', text: { fr: 'Fermer une brèche Smash', en: 'Close one Smash breach' } },
    { id: 'codex', mode: 'any', focus: 'LORE', text: { fr: 'Décrypter un nouveau boss dans le codex', en: 'Decrypt a new boss codex entry' } }
  ];

  const FACTION_RULES = [
    { id: 'sci_fi', stat: 'hp', label: 'Sci-Fi Marines', universes: ['Halo', 'Gears of War', 'Mass Effect', 'Stargate', 'Alien', 'Predator', ...EXPANDED_FACTION_UNIVERSES.sciFi], bonus: '+8% HP' },
    { id: 'horror', stat: 'atk', label: 'Horreur cosmique', universes: ['Silent Hill', 'Resident Evil', 'Dead Space', 'Hellraiser', 'Saw', ...EXPANDED_FACTION_UNIVERSES.horror], bonus: '+8% ATK' },
    { id: 'cyber', stat: 'spd', label: 'IA & Cyber', universes: ['The Matrix', 'Portal', 'Ghost in the Shell', 'Digital Circus', ...EXPANDED_FACTION_UNIVERSES.cyber], bonus: '+8% SPD' },
    { id: 'arcane', stat: 'def', label: 'Mages & Occulte', universes: ['Harry Potter', 'Yu-Gi-Oh', 'Negima', 'Rosario + Vampire', 'BlazBlue', ...EXPANDED_FACTION_UNIVERSES.arcane], bonus: '+8% DEF' }
  ];
  const UNIQUE = (items) => Array.from(new Set(items.filter(Boolean)));
  const MUSIC_ARC_UNIVERSES = UNIQUE(['Vocaloid', 'Rammstein', 'System of a Down', 'Rob Zombie', 'Daft Punk', 'Oliver Tree', 'Linkin Park', 'Michael Jackson', 'Moonwalker', 'Die Antwoord', ...Object.keys(LORE_DB).filter(universe => LORE_DB[universe]?.mediaType === 'music')]);
  const ABSURD_ARC_UNIVERSES = UNIQUE(['Velocipastor', 'Rubber', 'Killer Tomatoes from Outer Space', 'Sharknado', 'Sausage Party', 'Spermageddon', 'Kung Pow', 'Pingu', 'Pee-wee', 'Kazaam', 'Spoof Movie', 'Grrrrrrrrrrrrrrrrr', 'Les Feebles', 'Roger Rabbit', 'Les Tuche', 'Camera Cafe', 'Samantha Oups', 'Les Chevaliers du Fiel', 'Les Inconnus', 'La Cite de la Peur', 'Les Visiteurs']);
  const KAIJU_DISASTER_ARC_UNIVERSES = UNIQUE(['Godzilla The Animated Series', 'Cloverfield', 'Tremors', 'The War of the Worlds', 'War of the Worlds - Steven Spielberg', 'Mars Attacks', 'Skyline', 'Iron Sky', ...EXPANDED_FACTION_UNIVERSES.sciFi.filter(universe => /Godzilla|Cloverfield|Sharknado|Tremor|Mars|War of the World|Skyline|Iron Sky|Starship/.test(universe))]);
  const MANGA_WAR_ARC_UNIVERSES = UNIQUE(['Attack on Titan', 'Tanya the Evil', 'Death Note', 'Dandadan', 'Another', 'Gunnm', 'Battle Royale', 'Overlord', 'Dungeon Meshi', 'Spy x Family', 'Uzumaki', 'Inuyashiki', 'Negima', 'Rosario + Vampire', 'Les Brigades immunitaires', ...Object.keys(LORE_DB).filter(universe => LORE_DB[universe]?.mediaType === 'manga')]);
  const INFECTION_CONTAINMENT_ARC_UNIVERSES = UNIQUE(['Resident Evil', 'Silent Hill', 'The Thing', 'Virus', 'Rec', 'Sinister', 'House of the Dead', 'Evil Dead', 'Puppet Master', 'The Collector', 'Terrifier', 'M3GAN', 'Toxic Avenger', 'SCP', ...EXPANDED_FACTION_UNIVERSES.horror.filter(universe => /Resident|Silent|Thing|Virus|Rec|Dead|Evil|Puppet|Collector|Terrifier|Sinister|SCP|Re-Animator|Cthulhu|Necronomicon/.test(universe))]);
  const SCREEN_ARCHIVE_ARC_UNIVERSES = UNIQUE(['Kaamelott', 'Noob', 'Le Visiteur du Futur', 'Malcolm in the Middle', 'Defiance', 'Starship Troopers', 'Banlieue 13', 'Le Cinquieme Element', 'Ghostbusters', 'The Ring', 'The Grudge', 'From', ...Object.keys(LORE_DB).filter(universe => ['movie', 'series'].includes(LORE_DB[universe]?.mediaType))]);

  const LOOT_RARITIES = [
    { id: 'common', label: 'Commun', color: '#9aa0a6', threshold: 0 },
    { id: 'rare', label: 'Rare', color: '#3498db', threshold: 8 },
    { id: 'epic', label: 'Epique', color: '#9b59b6', threshold: 14 },
    { id: 'legendary', label: 'Legendaire', color: '#f1c40f', threshold: 18 },
    { id: 'anomaly', label: 'Anomalie', color: '#ff4500', threshold: 24 }
  ];

  const BASE_OC_STAGES = [
    {
      id: 8801,
      name: 'Atrium Primer Lock',
      displayName: { fr: 'Atrium - Premier verrou', en: 'Atrium - Primer Lock' },
      universe: 'Nexus de Convergence',
      mode: 'RPG',
      difficulty: 'Easy',
      goldPrize: 45,
      shardPrize: 20,
      bossName: 'Greffier du Voile',
      baseGameStage: true
    },
    {
      id: 8802,
      name: 'Archive Static Corridor',
      displayName: { fr: 'Archive - Couloir statique', en: 'Archive - Static Corridor' },
      universe: 'Nexus de Convergence',
      mode: 'Tactics',
      difficulty: 'Easy',
      goldPrize: 55,
      shardPrize: 22,
      bossName: 'Juge des Trames',
      baseGameStage: true
    },
    {
      id: 8803,
      name: 'Origin Shard Foundry',
      displayName: { fr: 'Fonderie des Eclats d Origine', en: 'Origin Shard Foundry' },
      universe: 'Nexus de Convergence',
      mode: 'Smash',
      difficulty: 'Medium',
      goldPrize: 70,
      shardPrize: 28,
      bossName: 'Avatar du Sans-Auteur',
      baseGameStage: true
    },
    {
      id: 8804,
      name: 'A.R.C.A. Black Ledger',
      displayName: { fr: 'Grand registre noir A.R.C.A.', en: 'A.R.C.A. Black Ledger' },
      universe: 'Nexus de Convergence',
      mode: 'RPG',
      difficulty: 'Medium',
      goldPrize: 85,
      shardPrize: 32,
      bossName: 'Moteur de Convergence Instable',
      baseGameStage: true
    },
    {
      id: 8805,
      name: 'Broken Portal Yard',
      displayName: { fr: 'Cour des portails brises', en: 'Broken Portal Yard' },
      universe: 'Nexus de Convergence',
      mode: 'Tactics',
      difficulty: 'Hard',
      goldPrize: 105,
      shardPrize: 40,
      tokenPrize: 1,
      bossName: 'Juge des Trames',
      baseGameStage: true
    },
    {
      id: 8806,
      name: 'Sans-Auteur Threshold',
      displayName: { fr: 'Seuil du Sans-Auteur', en: 'Sans-Auteur Threshold' },
      universe: 'Nexus de Convergence',
      mode: 'Smash',
      difficulty: 'Hard',
      goldPrize: 125,
      shardPrize: 50,
      tokenPrize: 1,
      bossName: 'Avatar du Sans-Auteur',
      baseGameStage: true
    }
  ];

  // Franchise stages are DLC; base OC stages above remain playable with every DLC hidden.
  const STAGES = [
    { id: 1, name: 'Asphix Locust Outpost', universe: 'Gears of War', mode: 'RPG', difficulty: 'Easy', goldPrize: 40, shardPrize: 15, bossName: 'Brumak' },
    { id: 2, name: 'Installation 04 Ring', universe: 'Halo', mode: 'Tactics', difficulty: 'Easy', goldPrize: 40, shardPrize: 15, bossName: 'Scarab Mech' },
    { id: 3, name: 'LV-426 Colony Hive', universe: 'Alien', mode: 'Smash', difficulty: 'Easy', goldPrize: 45, shardPrize: 15, bossName: 'Predalien' },
    { id: 4, name: 'Val Verde Jungle Temple', universe: 'Predator', mode: 'RPG', difficulty: 'Easy', goldPrize: 50, shardPrize: 20, bossName: 'Bad Blood Alpha' },
    { id: 5, name: 'Raccoon City Police Dept', universe: 'Resident Evil', mode: 'Tactics', difficulty: 'Easy', goldPrize: 50, shardPrize: 20, bossName: 'Super Tyrant' },
    { id: 6, name: 'Toluca Lake Fog Sector', universe: 'Silent Hill', mode: 'RPG', difficulty: 'Medium', goldPrize: 60, shardPrize: 20, bossName: 'The God' },
    { id: 7, name: 'Ibis Dinosaur Facility', universe: 'Dino Crisis', mode: 'Smash', difficulty: 'Medium', goldPrize: 65, shardPrize: 25, bossName: 'Spinosaurus' },
    { id: 8, name: 'Zion Digital Pipeline', universe: 'The Matrix', mode: 'Tactics', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Deus Ex Machina' },
    { id: 9, name: 'Abydos Pyramids Breach', universe: 'Stargate', mode: 'RPG', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Anubis Flagship Nexus' },
    { id: 10, name: 'Anomalous Materials Lab', universe: 'Half-Life', mode: 'Smash', difficulty: 'Medium', goldPrize: 75, shardPrize: 25, bossName: 'Combine Strider' },
    { id: 11, name: 'Aperture Enrichment Center', universe: 'Portal', mode: 'RPG', difficulty: 'Medium', goldPrize: 80, shardPrize: 30, bossName: 'Central AI' },
    { id: 12, name: 'Shadow Moses Warehouse', universe: 'Metal Gear', mode: 'Tactics', difficulty: 'Hard', goldPrize: 90, shardPrize: 30, bossName: 'Metal Gear RAY' },
    { id: 13, name: 'First World Bank Vault', universe: 'Payday', mode: 'Smash', difficulty: 'Hard', goldPrize: 95, shardPrize: 30, bossName: 'SWAT Turret Van' },
    { id: 14, name: 'Neon Shibuya Stage', universe: 'Vocaloid', mode: 'RPG', difficulty: 'Hard', goldPrize: 100, shardPrize: 35, bossName: 'Stage Core' },
    { id: 15, name: 'Dominos Duel Arena', universe: 'Yu-Gi-Oh', mode: 'Tactics', difficulty: 'Hard', goldPrize: 110, shardPrize: 35, bossName: 'Obelisk Tormentor' },
    { id: 16, name: 'Babylon Gear Engine', universe: 'Guilty Gear', mode: 'Smash', difficulty: 'Hard', goldPrize: 120, shardPrize: 40, bossName: 'Megadeath Gear' },
    { id: 17, name: 'Kagutsuchi Hierarchical City', universe: 'BlazBlue', mode: 'RPG', difficulty: 'Hard', goldPrize: 125, shardPrize: 40, bossName: 'Mu-12 Core' },
    { id: 18, name: 'Black Forest Page Rift', universe: 'Slender Man', mode: 'Tactics', difficulty: 'Hard', goldPrize: 130, shardPrize: 40, bossName: 'Woods Nexus' },
    { id: 19, name: 'Good Guy Toy Warehouse', universe: 'Chucky', mode: 'Smash', difficulty: 'Hard', goldPrize: 140, shardPrize: 45, bossName: 'Assembly Core' },
    { id: 20, name: 'Labyrinth Cenobite Chamber', universe: 'Hellraiser', mode: 'RPG', difficulty: 'Very Hard', goldPrize: 150, shardPrize: 45, bossName: 'Leviathan God' },
    { id: 21, name: 'Citadel Presidium Hub', universe: 'Mass Effect', mode: 'Tactics', difficulty: 'Very Hard', goldPrize: 160, shardPrize: 50, bossName: 'Human-Reaper Larva' },
    { id: 22, name: 'New Vegas Strip Breach', universe: 'Fallout', mode: 'Smash', difficulty: 'Very Hard', goldPrize: 170, shardPrize: 50, bossName: 'Liberty Prime' },
    { id: 23, name: 'Nekravol Argent Tower', universe: 'Doom', mode: 'RPG', difficulty: 'Expert', goldPrize: 200, shardPrize: 60, bossName: 'Icon of Sin' },
    { id: 24, name: 'Liandri Tournament Grid', universe: 'Unreal', mode: 'Tactics', difficulty: 'Expert', goldPrize: 220, shardPrize: 70, bossName: 'Skaarj Warlord' },
    
    // --- NEW 13 STAGES ---
    { id: 25, name: 'Hogwarts Great Hall Breach', universe: 'Harry Potter', mode: 'RPG', difficulty: 'Easy', goldPrize: 45, shardPrize: 15, bossName: 'Lord Voldemort' },
    { id: 26, name: 'Death Star Trench Corridor', universe: 'Star Wars', mode: 'Smash', difficulty: 'Medium', goldPrize: 70, shardPrize: 25, bossName: 'Darth Vader' },
    { id: 27, name: 'Fhloston Paradise Cruise', universe: 'Le Cinquième Element', mode: 'Tactics', difficulty: 'Medium', goldPrize: 75, shardPrize: 25, bossName: 'The Ultimate Evil' },
    { id: 30, name: 'Rick\'s Garage Laboratory', universe: 'Rick & Morty', mode: 'Smash', difficulty: 'Hard', goldPrize: 110, shardPrize: 35, bossName: 'Federal Prison AI Core' },
    { id: 28, name: 'Cindy\'s Haunted Living Room', universe: 'Scary Movie', mode: 'RPG', difficulty: 'Medium', goldPrize: 60, shardPrize: 20, bossName: 'Ghostface Wassup Slasher' },
    { id: 29, name: 'USG Ishimura Mining Deck', universe: 'Dead Space', mode: 'Tactics', difficulty: 'Hard', goldPrize: 100, shardPrize: 30, bossName: 'Giant Hive Mind' },
    { id: 31, name: 'Digital Tent Theater', universe: 'Digital Circus', mode: 'RPG', difficulty: 'Medium', goldPrize: 65, shardPrize: 20, bossName: 'Caine Ringmaster AI' },
    { id: 32, name: 'File Island Binary Field', universe: 'Digimon', mode: 'Tactics', difficulty: 'Hard', goldPrize: 115, shardPrize: 35, bossName: 'Apocalymon Void Core' },
    { id: 33, name: 'Nerve Gas Bathroom Dungeon', universe: 'Saw', mode: 'Smash', difficulty: 'Hard', goldPrize: 100, shardPrize: 30, bossName: 'Jigsaw Classroom Trap Hub' },
    { id: 34, name: 'Yokai Academy Courtyard', universe: 'Rosario + Vampire', mode: 'RPG', difficulty: 'Hard', goldPrize: 120, shardPrize: 40, bossName: 'Alucard Dragon Colossus' },
    { id: 35, name: 'Mahora Academy Tree Breach', universe: 'Negima', mode: 'Tactics', difficulty: 'Hard', goldPrize: 125, shardPrize: 40, bossName: 'Mage of the Beginning God' },
    { id: 36, name: 'New Port City Network Node', universe: 'Ghost in the Shell', mode: 'Smash', difficulty: 'Hard', goldPrize: 130, shardPrize: 40, bossName: 'Think Tank Tachikoma Core' },
    { id: 37, name: 'Fury Road Desert Outpost', universe: 'Mad Max', mode: 'RPG', difficulty: 'Very Hard', goldPrize: 155, shardPrize: 45, bossName: 'The Gigahorse Interceptor Rig' },
    
    // 38th final stage
    { id: 38, name: 'Final Omniverse Singularity', universe: 'Matrix', mode: 'RPG', difficulty: 'Final World Boss', goldPrize: 500, shardPrize: 150, bossName: 'Breach Singularity Core' }
  ];
  const FUSION_STAGES = FUSION_MISSIONS.map(mission => ({
    id: mission.stageId,
    name: mission.title.en,
    displayName: mission.title,
    universe: mission.primaryUniverse,
    sourceUniverses: mission.universes,
    mode: mission.mode,
    difficulty: mission.difficulty,
    goldPrize: mission.goldPrize,
    shardPrize: mission.shardPrize,
    tokenPrize: mission.tokenPrize,
    bossName: mission.bossName,
    unlockClears: mission.unlockClears,
    rewardItemId: mission.itemId,
    rewardItemName: mission.item,
    fusionMission: mission
  }));
  const CHARACTER_STAGES = CHARACTER_NARRATIVE_ARCS.map(arc => ({
    id: arc.stageId,
    name: arc.title.en,
    displayName: arc.title,
    universe: arc.heroId === 'player_anchor' ? 'Nexus de Convergence' : (BASE_HEROES_DB.find(hero => hero.id === arc.heroId)?.universe || 'Nexus de Convergence'),
    mode: arc.mode,
    difficulty: arc.difficulty,
    goldPrize: 150,
    shardPrize: 60,
    tokenPrize: 2,
    bossName: arc.bossName,
    rewardItemId: arc.rewardItemId,
    rewardItemName: arc.reward,
    characterArc: arc
  }));
  const UNIVERSE_ARC_STAGES = UNIVERSE_NARRATIVE_ARCS.map((arc, index) => ({
    id: 9500 + index,
    name: arc.title.en,
    displayName: arc.title,
    universe: arc.universes[0],
    sourceUniverses: arc.universes,
    mode: ['RPG', 'Tactics', 'Smash'][index % 3],
    difficulty: 'Universe Arc',
    goldPrize: 180 + index * 20,
    shardPrize: 75 + index * 10,
    tokenPrize: 3,
    bossName: arc.bossName || `${arc.title.fr} Core`,
    rewardItemId: `universe_arc_${arc.id}`,
    rewardItemName: arc.reward,
    universeArc: arc,
    unlockClears: 4 + index * 2
  }));
  const TRIO_STAGES = TRIO_NARRATIVE_ARCS.map(arc => ({
    id: arc.stageId,
    name: arc.title.en,
    displayName: arc.title,
    universe: arc.universes[0],
    sourceUniverses: arc.universes,
    mode: arc.mode,
    difficulty: arc.difficulty,
    goldPrize: 220,
    shardPrize: 95,
    tokenPrize: 4,
    bossName: arc.bossName,
    rewardItemId: arc.rewardItemId,
    rewardItemName: arc.reward,
    trioArc: arc
  }));
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...BASE_OC_STAGES);
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...getExpandedStages());
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...FUSION_STAGES);
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...UNIVERSE_ARC_STAGES);
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...CHARACTER_STAGES);
  STAGES.splice(STAGES.findIndex(stage => stage.id === 38), 0, ...TRIO_STAGES);
  const isStageVisibleByAdmin = (stage) => {
    if (stage.id === 38) return true;
    if (stage.sourceUniverses) return stage.sourceUniverses.every(isUniverseVisible);
    return isUniverseVisible(stage.universe);
  };
  const ADMIN_VISIBLE_STAGES = STAGES.filter(stage => isStageVisibleByAdmin(stage) && !isAssetDisabled('stages', getStageAdminKey(stage)));
  const NORMAL_STAGE_COUNT = ADMIN_VISIBLE_STAGES.filter(stage => stage.id !== 38 && !stage.characterArc).length;
  const TOTAL_UNIVERSE_COUNT = ALL_UNIVERSE_KEYS.filter(isUniverseVisible).length;
  const FINAL_STAGE_REQUIRED_CLEARS = Math.max(18, Math.ceil(NORMAL_STAGE_COUNT * 0.45));
  const META_RANK_THRESHOLDS = {
    strike: Math.max(8, Math.ceil(NORMAL_STAGE_COUNT * 0.15)),
    veteran: Math.max(16, Math.ceil(NORMAL_STAGE_COUNT * 0.4)),
    omega: Math.max(24, Math.ceil(NORMAL_STAGE_COUNT * 0.65))
  };

  const STORY_CHAPTERS = [
    {
      id: 'first_lock',
      unlockClears: 0,
      name: { fr: 'Chapitre I - Premier verrou', en: 'Chapter I - First Lock' },
      desc: {
        fr: 'Les premieres breches sont instables mais lisibles. Le reseau cherche des mondes-pivots pour trianguler la Singularity.',
        en: 'The first breaches are unstable but readable. The network searches for anchor worlds to triangulate the Singularity.'
      },
      focus: { fr: 'Ouvrir les paliers Medium et Hard.', en: 'Open Medium and Hard tiers.' }
    },
    {
      id: 'faction_war',
      unlockClears: 6,
      name: { fr: 'Chapitre II - Guerre des signatures', en: 'Chapter II - Signature War' },
      desc: {
        fr: 'Les univers ne fuient plus seuls: des familles de breches commencent a resonner entre elles.',
        en: 'Worlds no longer leak alone: families of breaches begin resonating with each other.'
      },
      focus: { fr: 'Composer des equipes par faction et decrypter les boss locaux.', en: 'Build faction teams and decrypt local bosses.' }
    },
    {
      id: 'deep_archive',
      unlockClears: 12,
      name: { fr: 'Chapitre III - Archives profondes', en: 'Chapter III - Deep Archives' },
      desc: {
        fr: 'Les failles anciennes revelent des variantes de films, sagas et lignes temporelles qui se contredisent.',
        en: 'Older breaches reveal movie variants, sagas, and timelines that contradict each other.'
      },
      focus: { fr: 'Finir des collections de franchise pour gagner des caches.', en: 'Complete franchise collections to earn caches.' }
    },
    {
      id: 'singularity_wake',
      unlockClears: 20,
      name: { fr: 'Chapitre IV - Eveil de la Singularity', en: 'Chapter IV - Singularity Wake' },
      desc: {
        fr: 'Le noyau final absorbe les patterns de chasse, d horreur, de magie et de scene musicale.',
        en: 'The final core absorbs hunt, horror, magic, and music-stage patterns.'
      },
      focus: { fr: 'Stabiliser assez de breches pour forcer l ouverture finale.', en: 'Stabilize enough breaches to force the final opening.' }
    },
    {
      id: 'omniverse_endgame',
      unlockClears: FINAL_STAGE_REQUIRED_CLEARS,
      name: { fr: 'Chapitre V - Noyau Omniverse', en: 'Chapter V - Omniverse Core' },
      desc: {
        fr: 'Les archives convergent: chaque monde stabilise retire une couche de defense au Breach Singularity Core.',
        en: 'The archives converge: every stabilized world strips a defensive layer from the Breach Singularity Core.'
      },
      focus: { fr: 'Optimiser reliques, synergies et objets evenementiels.', en: 'Optimize relics, synergies, and event items.' }
    }
  ];

  const NARRATIVE_ARCS = [
    {
      id: 'xeno_yautja_war',
      color: '#7ee8dc',
      title: { fr: 'Guerre Xeno-Yautja', en: 'Xeno-Yautja War' },
      premise: {
        fr: 'Weyland-Yutani, les ruches xenomorphes et les clans Yautja contaminent les memes coordonnees de chasse.',
        en: 'Weyland-Yutani, xenomorph hives, and Yautja clans contaminate the same hunting coordinates.'
      },
      universes: ['Alien', 'Aliens', 'Alien 3', 'Alien Resurrection', 'Prometheus', 'Alien: Covenant', 'Alien: Romulus', 'Predator', 'Predator 2', 'Predators', 'The Predator', 'Prey', 'Predator: Killer of Killers', 'Predator: Badlands', 'Alien vs Predator', 'Aliens vs Predator: Requiem'],
      reward: { fr: 'Cache acide/plasma', en: 'Acid/plasma cache' }
    },
    {
      id: 'dark_gotham',
      color: '#d63b3b',
      title: { fr: 'Noeud Gotham noir', en: 'Dark Gotham Node' },
      premise: {
        fr: 'Les variantes Joker et Batman contaminent la logique morale des failles avec du metal noir et des toxines.',
        en: 'Joker and Batman variants corrupt breach morality with dark metal and toxins.'
      },
      universes: ['Joker New 52', 'The Batman Who Laughs'],
      reward: { fr: 'Intel peur/critique', en: 'Fear/crit intel' }
    },
    {
      id: 'stage_resonance',
      color: '#f1c40f',
      title: { fr: 'Resonance de scene', en: 'Stage Resonance' },
      premise: {
        fr: 'Les groupes et univers musicaux transforment les failles en arene rythmique et amplifient les anomalies.',
        en: 'Bands and music worlds turn breaches into rhythm arenas and amplify anomalies.'
      },
      universes: MUSIC_ARC_UNIVERSES,
      reward: { fr: 'Bonus tempo et vitesse', en: 'Tempo and speed bonus' }
    },
    {
      id: 'arcane_paradox',
      color: '#d9b86b',
      title: { fr: 'Paradoxe arcane', en: 'Arcane Paradox' },
      premise: {
        fr: 'Magie absurde, quete du Graal, donjons et MMORPG francais se branchent sur les memes runes de stabilisation.',
        en: 'Absurd magic, Grail quests, dungeons, and French MMORPG codes connect to the same stabilization runes.'
      },
      universes: UNIQUE(['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire', ...EXPANDED_FACTION_UNIVERSES.arcane]),
      reward: { fr: 'Cache rune et defense', en: 'Rune and defense cache' }
    },
    {
      id: 'hell_circus',
      color: '#ff5b6e',
      title: { fr: 'Cabaret infernal', en: 'Infernal Cabaret' },
      premise: {
        fr: 'Hazbin Hotel, Digital Circus et les univers d horreur transforment la redemption en spectacle de breche.',
        en: 'Hazbin Hotel, Digital Circus, and horror worlds turn redemption into breach theater.'
      },
      universes: UNIQUE(['Hazbin Hotel', 'Digital Circus', 'Hellraiser', 'Saw', 'Chucky', 'Silent Hill', 'Scary Movie', ...EXPANDED_FACTION_UNIVERSES.horror.filter(universe => /Hotel|Circus|Hell|Saw|Chucky|Silent|Scary|Rocky|Elvira|Rob Zombie|House of 1000/.test(universe))]),
      reward: { fr: 'Cache controle et peur', en: 'Control and fear cache' }
    },
    {
      id: 'frontline_sci_fi',
      color: '#63d7ff',
      title: { fr: 'Front militaire sci-fi', en: 'Sci-Fi Military Front' },
      premise: {
        fr: 'Les soldats, pilotes, commandants et explorateurs spatiaux forment la ligne de defense principale contre le noyau.',
        en: 'Soldiers, pilots, commanders, and space explorers form the main defensive line against the core.'
      },
      universes: UNIQUE(['Gears of War', 'Halo', 'Stargate', 'Mass Effect', 'Star Wars', 'Le Cinquième Element', ...EXPANDED_FACTION_UNIVERSES.sciFi]),
      reward: { fr: 'Cache tactique et blindage', en: 'Tactical and armor cache' }
    },
    {
      id: 'containment_labs',
      color: '#65d7de',
      title: { fr: 'Protocoles de confinement', en: 'Containment Protocols' },
      premise: {
        fr: 'Laboratoires, stations et incidents biologiques imposent une logique de survie, d isolement et de purge.',
        en: 'Labs, stations, and biological incidents force survival, isolation, and purge logic.'
      },
      universes: UNIQUE(['Resident Evil', 'Dino Crisis', 'Dead Space', 'Half-Life', 'Portal', ...INFECTION_CONTAINMENT_ARC_UNIVERSES]),
      reward: { fr: 'Cache laboratoire et purge', en: 'Laboratory and purge cache' }
    },
    {
      id: 'cyber_reality',
      color: '#41ffac',
      title: { fr: 'Realites codees', en: 'Coded Realities' },
      premise: {
        fr: 'IA, realites virtuelles, cybercerveaux et mondes digitaux prouvent que la breche peut aussi corrompre le code.',
        en: 'AI, virtual realities, cyberbrains, and digital worlds prove the breach can also corrupt code.'
      },
      universes: UNIQUE(['The Matrix', 'Ghost in the Shell', 'Rick & Morty', 'Digimon', ...EXPANDED_FACTION_UNIVERSES.cyber]),
      reward: { fr: 'Cache cyber et vitesse', en: 'Cyber and speed cache' }
    },
    {
      id: 'duel_and_arena',
      color: '#e67e22',
      title: { fr: 'Duel, tournoi et braquage', en: 'Duel, Tournament, and Heist' },
      premise: {
        fr: 'Infiltration, cartes, arènes et braquages transforment les breches en defis de precision.',
        en: 'Infiltration, cards, arenas, and heists turn breaches into precision challenges.'
      },
      universes: ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'],
      reward: { fr: 'Cache technique et critique', en: 'Technique and critical cache' }
    },
    {
      id: 'wasteland_hellfront',
      color: '#ff4f2b',
      title: { fr: 'Front enfer et wasteland', en: 'Hell and Wasteland Front' },
      premise: {
        fr: 'Les mondes ruines, infernaux et motorises testent la capacite du reseau a survivre sans structure.',
        en: 'Ruined, hellish, and motorized worlds test whether the network can survive without structure.'
      },
      universes: ['Fallout', 'Doom', 'Mad Max'],
      reward: { fr: 'Cache apocalypse', en: 'Apocalypse cache' }
    },
    {
      id: 'urban_legends',
      color: '#cbd8c8',
      title: { fr: 'Legendes et icones d horreur', en: 'Horror Icons and Legends' },
      premise: {
        fr: 'Entites, tueurs, jeux pieges et cauchemars donnent au Multivers ses signatures de peur les plus lisibles.',
        en: 'Entities, killers, traps, and nightmares give the Multiverse its clearest fear signatures.'
      },
      universes: UNIQUE(['Slender Man', 'Resident Evil', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Scary Movie', ...EXPANDED_FACTION_UNIVERSES.horror]),
      reward: { fr: 'Cache peur et controle', en: 'Fear and control cache' }
    },
    {
      id: 'absurd_b_movie_front',
      color: '#ff9f43',
      title: { fr: 'Front B-movie et absurdites', en: 'B-Movie and Absurdity Front' },
      premise: {
        fr: 'Les univers volontairement idiots, parodiques ou impossibles prouvent que le Sans-Auteur peut aussi attaquer par le non-sens.',
        en: 'Deliberately silly, parodic, or impossible worlds prove the Authorless can also attack through nonsense.'
      },
      universes: ABSURD_ARC_UNIVERSES,
      reward: { fr: 'Cache parodie et chaos controle', en: 'Parody and controlled chaos cache' }
    },
    {
      id: 'kaiju_disaster_protocol',
      color: '#4fd7ff',
      title: { fr: 'Protocole kaiju et catastrophe', en: 'Kaiju and Disaster Protocol' },
      premise: {
        fr: 'Monstres geants, invasions et catastrophes de masse forcent A.R.C.A. a penser en evacuation plutot qu en duel.',
        en: 'Giant monsters, invasions, and mass disasters force A.R.C.A. to think in evacuations rather than duels.'
      },
      universes: KAIJU_DISASTER_ARC_UNIVERSES,
      reward: { fr: 'Cache evacuation et frappe lourde', en: 'Evacuation and heavy strike cache' }
    },
    {
      id: 'manga_war_council',
      color: '#b56dff',
      title: { fr: 'Conseil manga des guerres de destin', en: 'Manga Council of Fate Wars' },
      premise: {
        fr: 'Les mondes manga et anime imposent des lois d arc: rivalites, fronts militaires, maledictions, carnets et transformations.',
        en: 'Manga and anime worlds impose arc laws: rivalries, war fronts, curses, notebooks, and transformations.'
      },
      universes: MANGA_WAR_ARC_UNIVERSES,
      reward: { fr: 'Cache transformation et rivalite', en: 'Transformation and rivalry cache' }
    },
    {
      id: 'screen_archive_fracture',
      color: '#ff5b6e',
      title: { fr: 'Fracture des archives ecran', en: 'Screen Archive Fracture' },
      premise: {
        fr: 'Films, series, sitcoms et comedies francaises deviennent des archives instables ou le ton change plus vite que les regles.',
        en: 'Films, series, sitcoms, and French comedies become unstable archives where tone shifts faster than rules.'
      },
      universes: SCREEN_ARCHIVE_ARC_UNIVERSES,
      reward: { fr: 'Cache archive ecran', en: 'Screen archive cache' }
    },
    {
      id: 'infection_mutation_cordon',
      color: '#61ff59',
      title: { fr: 'Cordon infection et mutation', en: 'Infection and Mutation Cordon' },
      premise: {
        fr: 'Virus, parasites, morts releves, jouets hostiles et toxines imposent un cordon sanitaire autour de la Cite-Mosaique.',
        en: 'Viruses, parasites, raised dead, hostile toys, and toxins impose a quarantine cordon around Mosaic City.'
      },
      universes: INFECTION_CONTAINMENT_ARC_UNIVERSES,
      reward: { fr: 'Cache vaccin et purge', en: 'Vaccine and purge cache' }
    }
  ];

  const ARC_DETAIL_BY_ID = {
    xeno_yautja_war: {
      faction: { fr: 'Alliance du Nexus vs Libres-Fractures de chasse', en: 'Nexus Alliance vs Hunting Free-Fractures' },
      stakes: {
        fr: 'Si cette ligne tombe, les ruches apprennent a utiliser le Voile comme nid et les Yautja transforment le Nexus en reserve de chasse infinie.',
        en: 'If this line falls, hives learn to use the Veil as a nest and Yautja clans turn the Nexus into an endless hunting preserve.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: tenir la ligne blindee, isoler le noyau dominant, employer les traces acide/plasma et contenir les essaims rapides.',
        en: 'A.R.C.A. directive: hold the armored line, isolate the dominant core, use acid/plasma traces, and contain fast swarms.'
      },
      finale: { fr: 'Sceller le Nid-Trophee avant qu il ne ponde dans plusieurs Trames a la fois.', en: 'Seal the Trophy-Hive before it breeds across several Threads at once.' }
    },
    dark_gotham: {
      faction: { fr: 'Effaces et Trone Brise', en: 'Erased and Broken Throne' },
      stakes: {
        fr: 'Gotham devient une experience morale: chaque victoire nourrit soit l ordre brutal, soit le chaos contagieux.',
        en: 'Gotham becomes a moral experiment: every victory feeds either brutal order or contagious chaos.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: frapper vite, verrouiller la peur et finir la scene avant que le rire noir ne gagne en masse.',
        en: 'A.R.C.A. directive: strike fast, lock fear, and finish the scene before the black laugh gains mass.'
      },
      finale: { fr: 'Briser le rire noir sans donner au Sans-Auteur une preuve que toute histoire finit en nihilisme.', en: 'Break the black laugh without proving to the Authorless that every story ends in nihilism.' }
    },
    stage_resonance: {
      faction: { fr: 'Personas de Resonance et Archivistes', en: 'Resonance Personas and Archivists' },
      stakes: {
        fr: 'La musique maintient des Trames entieres en vie; si le rythme se corrompt, les souvenirs collectifs deviennent des armes.',
        en: 'Music keeps entire Threads alive; if rhythm corrupts, collective memory becomes a weapon.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: synchroniser le tempo, armer les artefacts de scene et relancer les signatures avant extinction du rythme.',
        en: 'A.R.C.A. directive: synchronize tempo, arm stage artifacts, and cycle signatures before rhythm collapse.'
      },
      finale: { fr: 'Transformer la Scene Fantome en balise qui repousse le silence du Sans-Auteur.', en: 'Turn the Ghost Stage into a beacon that pushes back the Authorless silence.' }
    },
    arcane_paradox: {
      faction: { fr: 'Archivistes, Mages et Occulte', en: 'Archivists, Mages, and Occult' },
      stakes: {
        fr: 'Les runes de plusieurs mondes se contredisent et menacent de redefinir les lois internes du Nexus.',
        en: 'Runes from several worlds contradict each other and threaten to redefine the Nexus internal laws.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: privilegier les sceaux defensifs, le controle et les reliques qui reforment la loi locale au lieu de simplement blesser.',
        en: 'A.R.C.A. directive: favor defensive seals, control, and relics that rebuild local law instead of merely wounding.'
      },
      finale: { fr: 'Recomposer un Grimoire d Equilibre sans laisser Veyr reecrire la carte des ruptures.', en: 'Rebuild a Grimoire of Balance without letting Veyr rewrite the rupture map.' }
    },
    hell_circus: {
      faction: { fr: 'Citadelle Blanche vs Cabaret infernal', en: 'White Citadel vs Infernal Cabaret' },
      stakes: {
        fr: 'Redemption, punition et spectacle fusionnent; les heros risquent de devenir des roles joues pour toujours.',
        en: 'Redemption, punishment, and spectacle fuse; heroes risk becoming roles performed forever.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: garder le controle, purifier les roles imposes et amortir les mutations de phase.',
        en: 'A.R.C.A. directive: keep control, cleanse imposed roles, and blunt phase mutations.'
      },
      finale: { fr: 'Fermer le rideau sans effacer ceux qui cherchent encore une sortie.', en: 'Close the curtain without erasing those still looking for an exit.' }
    },
    frontline_sci_fi: {
      faction: { fr: 'Alliance du Nexus', en: 'Nexus Alliance' },
      stakes: {
        fr: 'C est la ligne militaire officielle du Nexus: si elle casse, aucune zone stable ne protege les civils de la Cite-Mosaique.',
        en: 'This is the official military line of the Nexus: if it breaks, no stable zone protects Mosaic City civilians.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: renforcer les lignes de vie, croiser deux signatures sci-fi ou plus et confier les reliques de blindage aux porteurs de front.',
        en: 'A.R.C.A. directive: reinforce lifelines, cross two or more sci-fi signatures, and assign armor relics to front holders.'
      },
      finale: { fr: 'Construire le Rempart Atrium, premiere vraie defense contre le Noyau final.', en: 'Build the Atrium Bulwark, the first real defense against the final Core.' }
    },
    containment_labs: {
      faction: { fr: 'Protocoles de confinement A.R.C.A.', en: 'A.R.C.A. Containment Protocols' },
      stakes: {
        fr: 'Les incidents scientifiques prouvent que la Premiere Breche peut contaminer la biologie, le temps, la matiere et les IA.',
        en: 'Scientific incidents prove the First Breach can contaminate biology, time, matter, and AI.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: survivre aux contaminations, affaiblir les mutations et alterner Resonance/Grille pour tenir les engagements longs.',
        en: 'A.R.C.A. directive: survive contamination, weaken mutations, and alternate Resonance/Grid protocols for long engagements.'
      },
      finale: { fr: 'Isoler le Laboratoire Zero avant qu il ne fabrique des copies infectees d autres heros.', en: 'Isolate Laboratory Zero before it manufactures infected copies of other heroes.' }
    },
    cyber_reality: {
      faction: { fr: 'IA & Cyber', en: 'AI & Cyber' },
      stakes: {
        fr: 'La Zone 404 revele que certaines breches ne sont pas des lieux, mais des permissions systeme volees.',
        en: 'Zone 404 reveals that some breaches are not places, but stolen system permissions.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: gagner l initiative, interrompre les permissions volees et croiser deux signatures cyber ou plus pour accelerer le reseau.',
        en: 'A.R.C.A. directive: seize initiative, interrupt stolen permissions, and cross two or more cyber signatures to accelerate the network.'
      },
      finale: { fr: 'Installer un pare-feu narratif pour empecher le Sans-Auteur d effacer les traces memoire.', en: 'Install a narrative firewall to stop the Authorless from erasing memory traces.' }
    },
    duel_and_arena: {
      faction: { fr: 'Libres-Fractures', en: 'Free-Fractures' },
      stakes: {
        fr: 'Ces mondes refusent la guerre frontale: ils imposent contrat, duel, tournoi, braquage et regles locales.',
        en: 'These worlds reject frontal war: they impose contracts, duels, tournaments, heists, and local rules.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: respecter les regles locales, viser les failles de contrat et adapter la cellule au protocole de rupture.',
        en: 'A.R.C.A. directive: respect local rules, target contract faults, and adapt the cell to the rupture protocol.'
      },
      finale: { fr: 'Gagner le Tournoi des Regles et forcer le Nexus a respecter les lois de chaque Trame.', en: 'Win the Tournament of Rules and force the Nexus to respect each Thread law.' }
    },
    wasteland_hellfront: {
      faction: { fr: 'Trone Brise', en: 'Broken Throne' },
      stakes: {
        fr: 'La fin du monde attire les mondes qui connaissent deja la ruine; ils veulent survivre, pas etre sauves.',
        en: 'The end of the world attracts worlds that already know ruin; they want to survive, not be saved.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: encaisser la ruine, employer les reliques apocalypse et renverser les noyaux lourds avant epuisement.',
        en: 'A.R.C.A. directive: endure ruin, use apocalypse relics, and overturn heavy cores before exhaustion.'
      },
      finale: { fr: 'Transformer le Wasteland en avant-poste au lieu de le laisser devenir le futur par defaut.', en: 'Turn the Wasteland into an outpost instead of letting it become the default future.' }
    },
    urban_legends: {
      faction: { fr: 'Effaces', en: 'Erased' },
      stakes: {
        fr: 'La peur est la nourriture la plus facile du Sans-Auteur: elle efface les details et laisse seulement une silhouette.',
        en: 'Fear is the Authorless easiest food: it erases detail and leaves only a silhouette.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: refuser la peur, purifier les pieges et frapper les silhouettes avant qu elles ne deviennent des blancs d archive.',
        en: 'A.R.C.A. directive: refuse fear, cleanse traps, and strike silhouettes before they become archive blanks.'
      },
      finale: { fr: 'Nommer les monstres pour les empecher de devenir des blancs dans les archives.', en: 'Name the monsters to stop them from becoming blanks in the archives.' }
    },
    absurd_b_movie_front: {
      faction: { fr: 'Libres-Fractures absurdes', en: 'Absurd Free-Fractures' },
      intro: { fr: 'A.R.C.A. confirme que le non-sens peut stabiliser une Trame aussi fort qu une prophetie.', en: 'A.R.C.A. confirms nonsense can stabilize a Thread as strongly as prophecy.' },
      stakes: {
        fr: 'Les mondes loufoques cassent les protocoles: si A.R.C.A. les ignore, ils deviennent des failles imprevisibles impossibles a classer.',
        en: 'Absurd worlds break protocols: if A.R.C.A. ignores them, they become unpredictable rifts impossible to classify.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: utiliser les modes courts, accepter les modificateurs absurdes et convertir le chaos en bonus de relance.',
        en: 'A.R.C.A. directive: use short modes, accept absurd modifiers, and convert chaos into reroll bonuses.'
      },
      missions: [
        { fr: 'Classer trois anomalies parodiques sans les forcer dans une faction serieuse.', en: 'Classify three parody anomalies without forcing them into a serious faction.' },
        { fr: 'Transformer une breche gag en zone de diversion pour proteger les civils.', en: 'Turn a gag breach into a diversion zone to protect civilians.' },
        { fr: 'Sceller le Tribunal du Non-Sens avant qu il ne reecrive les recompenses.', en: 'Seal the Nonsense Tribunal before it rewrites rewards.' }
      ],
      outro: { fr: 'Le rire reste dangereux, mais il appartient maintenant a une archive lisible.', en: 'Laughter remains dangerous, but it now belongs to a readable archive.' },
      finale: { fr: 'Faire du ridicule une arme controlee contre le Sans-Auteur.', en: 'Turn ridicule into a controlled weapon against the Authorless.' },
      rewards: [
        { id: 'arc_absurd_skin_glitch_jester', type: 'skin', name: { fr: 'Apparence Bouffon Glitch', en: 'Glitch Jester Appearance' } },
        { id: 'arc_absurd_item_parody_stamp', type: 'item', name: { fr: 'Tampon de Parodie A.R.C.A.', en: 'A.R.C.A. Parody Stamp' } }
      ],
      claimReward: { gold: 360, shards: 75, tokens: 5 }
    },
    kaiju_disaster_protocol: {
      faction: { fr: 'Alliance du Nexus - Cellule evacuation', en: 'Nexus Alliance - Evacuation Cell' },
      intro: { fr: 'Les capteurs ne parlent plus de boss: ils parlent de masse, de panique et de villes entieres a deplacer.', en: 'Sensors no longer speak of bosses: they speak of mass, panic, and entire cities to move.' },
      stakes: {
        fr: 'Quand un kaiju ou une invasion franchit le Voile, gagner le duel ne suffit pas: il faut sauver la carte autour du combat.',
        en: 'When a kaiju or invasion crosses the Veil, winning the duel is not enough: the map around the fight must survive.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: prioriser les tanks, les soutiens tactiques et les reliques de zone pour tenir les combats longs.',
        en: 'A.R.C.A. directive: prioritize tanks, tactical supports, and zone relics to hold long fights.'
      },
      missions: [
        { fr: 'Baliser une route d evacuation pendant qu un monstre geant traverse la breche.', en: 'Mark an evacuation route while a giant monster crosses the breach.' },
        { fr: 'Detourner une invasion martienne vers une zone sans civils.', en: 'Redirect a Martian invasion toward a civilian-free zone.' },
        { fr: 'Stabiliser une carcasse de kaiju avant contamination de la Cite-Mosaique.', en: 'Stabilize a kaiju carcass before Mosaic City contamination.' }
      ],
      outro: { fr: 'Les grosses menaces ne disparaissent pas; elles ont maintenant des couloirs de crise.', en: 'Huge threats do not vanish; they now have crisis corridors.' },
      finale: { fr: 'Transformer la catastrophe en protocole d evacuation reproductible.', en: 'Turn disaster into a repeatable evacuation protocol.' },
      rewards: [
        { id: 'arc_kaiju_skin_response_armor', type: 'skin', name: { fr: 'Apparence Cellule H.E.A.T.', en: 'H.E.A.T. Cell Appearance' } },
        { id: 'arc_kaiju_item_evac_beacon', type: 'item', name: { fr: 'Balise Evacuation Kaiju', en: 'Kaiju Evac Beacon' } }
      ],
      claimReward: { gold: 520, shards: 95, tokens: 4 }
    },
    manga_war_council: {
      faction: { fr: 'Archivistes des arcs de destin', en: 'Fate Arc Archivists' },
      intro: { fr: 'Les Trames manga n ouvrent pas seulement des mondes: elles imposent des arcs, des rivalites et des transformations.', en: 'Manga Threads do not only open worlds: they impose arcs, rivalries, and transformations.' },
      stakes: {
        fr: 'Si ces lois d arc se melangent sans cadre, chaque mission peut devenir une guerre finale avant que le joueur soit pret.',
        en: 'If these arc laws mix without structure, every mission can become a final war before the player is ready.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: monter les niveaux, respecter les prerequis de personnages et reserver les trios aux conflits de synergie.',
        en: 'A.R.C.A. directive: raise levels, respect character prerequisites, and reserve trios for synergy conflicts.'
      },
      missions: [
        { fr: 'Isoler un carnet, une malediction ou un front militaire avant contamination d un autre arc.', en: 'Isolate a notebook, curse, or military front before it contaminates another arc.' },
        { fr: 'Forcer une transformation a rester un choix tactique et pas une reecriture permanente.', en: 'Force a transformation to remain a tactical choice, not a permanent rewrite.' },
        { fr: 'Sceller le Conseil des Rivaux sans effacer leurs histoires d origine.', en: 'Seal the Council of Rivals without erasing their origin stories.' }
      ],
      outro: { fr: 'Les arcs manga restent intenses, mais ils ne sautent plus les etapes de progression.', en: 'Manga arcs remain intense, but no longer skip progression steps.' },
      finale: { fr: 'Transformer les tropes de destin en routes jouables et coherentes.', en: 'Turn fate tropes into playable, coherent routes.' },
      rewards: [
        { id: 'arc_manga_skin_rival_mark', type: 'skin', name: { fr: 'Marque de Rivalite', en: 'Rival Mark' } },
        { id: 'arc_manga_item_arc_seal', type: 'item', name: { fr: 'Sceau de Chapitre Manga', en: 'Manga Chapter Seal' } }
      ],
      claimReward: { gold: 500, shards: 105, tokens: 5 }
    },
    screen_archive_fracture: {
      faction: { fr: 'Archivistes ecran et Cite-Mosaique', en: 'Screen Archivists and Mosaic City' },
      intro: { fr: 'Les archives ecran changent de ton brutalement: sitcom, comedie, SF, drame et horreur partagent parfois la meme adresse.', en: 'Screen archives shift tone brutally: sitcom, comedy, sci-fi, drama, and horror sometimes share the same address.' },
      stakes: {
        fr: 'Sans tri, les portails de films et series deviennent un bruit de fond qui casse l immersion et dilue le lore central.',
        en: 'Without sorting, film and series portals become background noise that breaks immersion and dilutes core lore.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: classer par ton, masquer les DLC inactifs et ouvrir seulement les archives utiles au chapitre courant.',
        en: 'A.R.C.A. directive: classify by tone, hide inactive DLC, and open only archives useful to the current chapter.'
      },
      missions: [
        { fr: 'Recoller une archive comique sans lui retirer son absurdité.', en: 'Repair a comedy archive without removing its absurdity.' },
        { fr: 'Separer une menace de serie d un portail de campagne principale.', en: 'Separate a series threat from a main campaign portal.' },
        { fr: 'Graver un index ecran pour empecher les doublons de Trame.', en: 'Engrave a screen index to prevent Thread duplicates.' }
      ],
      outro: { fr: 'Chaque archive ecran garde son ton sans envahir les autres pages.', en: 'Every screen archive keeps its tone without invading other pages.' },
      finale: { fr: 'Faire des films et series une bibliotheque, pas un tas de portails.', en: 'Make films and series a library, not a pile of portals.' },
      rewards: [
        { id: 'arc_screen_skin_archive_projectionist', type: 'skin', name: { fr: 'Apparence Projectionniste', en: 'Projectionist Appearance' } },
        { id: 'arc_screen_item_tone_index', type: 'item', name: { fr: 'Index de Tonalite', en: 'Tone Index' } }
      ],
      claimReward: { gold: 430, shards: 90, tokens: 4 }
    },
    infection_mutation_cordon: {
      faction: { fr: 'Confinement A.R.C.A. - Biohazard', en: 'A.R.C.A. Containment - Biohazard' },
      intro: { fr: 'Certaines menaces ne veulent pas gagner: elles veulent se propager.', en: 'Some threats do not want to win: they want to spread.' },
      stakes: {
        fr: 'Infections, parasites et mutations peuvent transformer les heros debloques en vecteurs narratifs si le cordon tombe.',
        en: 'Infections, parasites, and mutations can turn unlocked heroes into narrative vectors if the cordon falls.'
      },
      gameplay: {
        fr: 'Directive A.R.C.A.: nettoyer les vagues, reduire les duplications hostiles et favoriser les artefacts de purge.',
        en: 'A.R.C.A. directive: clean waves, reduce hostile duplications, and favor purge artifacts.'
      },
      missions: [
        { fr: 'Fermer une zone infectee avant que ses ennemis entrent dans le pool commun.', en: 'Close an infected zone before its enemies enter the shared pool.' },
        { fr: 'Extraire un vaccin de Trame sous pression de boss evolutif.', en: 'Extract a Thread vaccine under evolving boss pressure.' },
        { fr: 'Sceller le Cordon Vert autour de la Cite-Mosaique.', en: 'Seal the Green Cordon around Mosaic City.' }
      ],
      outro: { fr: 'Le Nexus sait maintenant distinguer menace, porteur et remede.', en: 'The Nexus now knows how to distinguish threat, carrier, and cure.' },
      finale: { fr: 'Garder les infections jouables sans les laisser devenir le jeu entier.', en: 'Keep infections playable without letting them become the whole game.' },
      rewards: [
        { id: 'arc_infection_skin_green_cordon', type: 'skin', name: { fr: 'Apparence Cordon Vert', en: 'Green Cordon Appearance' } },
        { id: 'arc_infection_item_thread_vaccine', type: 'item', name: { fr: 'Vaccin de Trame', en: 'Thread Vaccine' } }
      ],
      claimReward: { gold: 470, shards: 100, tokens: 5 }
    }
  };

  const COLLECTION_REWARDS = [
    {
      id: 'alien_saga',
      title: { fr: 'Saga Alien complete', en: 'Complete Alien Saga' },
      universes: ['Alien', 'Aliens', 'Alien 3', 'Alien Resurrection', 'Prometheus', 'Alien: Covenant', 'Alien: Romulus'],
      reward: { gold: 650, shards: 120, tokens: 4 },
      bonus: { fr: 'Cache Weyland-Yutani: ressources, Fragments et Jetons.', en: 'Weyland-Yutani cache: resources, Shards, and Tokens.' }
    },
    {
      id: 'predator_hunts',
      title: { fr: 'Chasses Predator completees', en: 'Completed Predator Hunts' },
      universes: ['Predator', 'Predator 2', 'Predators', 'The Predator', 'Prey', 'Predator: Killer of Killers', 'Predator: Badlands'],
      reward: { gold: 620, shards: 105, tokens: 4 },
      bonus: { fr: 'Cache Yautja: prime de chasse et trophees.', en: 'Yautja cache: hunt bounty and trophies.' }
    },
    {
      id: 'avp_crossfire',
      title: { fr: 'Croisement AVP verrouille', en: 'AVP Crossfire Locked' },
      universes: ['Alien vs Predator', 'Aliens vs Predator: Requiem'],
      reward: { gold: 280, shards: 60, tokens: 3 },
      bonus: { fr: 'Cache pyramide: bonus court mais intense.', en: 'Pyramid cache: short but intense bonus.' }
    },
    {
      id: 'music_wave',
      title: { fr: 'Onde musicale stabilisee', en: 'Stabilized Music Wave' },
      universes: ['Rammstein', 'System of a Down', 'Rob Zombie', 'Daft Punk', 'Oliver Tree', 'Vocaloid'],
      reward: { gold: 520, shards: 90, tokens: 3 },
      bonus: { fr: 'Cache backstage: tempo, Fragments et Jetons.', en: 'Backstage cache: tempo, Shards, and Tokens.' }
    },
    {
      id: 'arcane_table',
      title: { fr: 'Table arcane reunie', en: 'Arcane Table Reunited' },
      universes: ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire'],
      reward: { gold: 420, shards: 85, tokens: 3 },
      bonus: { fr: 'Cache grimoire: stabilisation magique durable.', en: 'Grimoire cache: durable magical stabilization.' }
    },
    {
      id: 'dark_stage',
      title: { fr: 'Scene sombre controlee', en: 'Dark Stage Controlled' },
      universes: ['Joker New 52', 'The Batman Who Laughs', 'Hazbin Hotel', 'Digital Circus'],
      reward: { gold: 430, shards: 80, tokens: 3 },
      bonus: { fr: 'Cache theatre noir: controle, peur et anomalie.', en: 'Dark theater cache: control, fear, and anomaly.' }
    },
    {
      id: 'sci_fi_command',
      title: { fr: 'Commandement sci-fi', en: 'Sci-Fi Command' },
      universes: ['Gears of War', 'Halo', 'Stargate', 'Mass Effect', 'Star Wars', 'Le Cinquième Element'],
      reward: { gold: 600, shards: 110, tokens: 4 },
      bonus: { fr: 'Cache commandement: ressources lourdes et fragments.', en: 'Command cache: heavy resources and fragments.' }
    },
    {
      id: 'containment_protocol',
      title: { fr: 'Confinement biologique', en: 'Biological Containment' },
      universes: ['Resident Evil', 'Dino Crisis', 'Dead Space', 'Half-Life', 'Portal'],
      reward: { gold: 520, shards: 95, tokens: 3 },
      bonus: { fr: 'Cache confinement: bonus de survie et purge.', en: 'Containment cache: survival and purge bonus.' }
    },
    {
      id: 'coded_realities',
      title: { fr: 'Realites codees', en: 'Coded Realities' },
      universes: ['The Matrix', 'Ghost in the Shell', 'Rick & Morty', 'Digimon'],
      reward: { gold: 460, shards: 85, tokens: 3 },
      bonus: { fr: 'Cache code: vitesse, hack et stabilisation digitale.', en: 'Code cache: speed, hacking, and digital stabilization.' }
    },
    {
      id: 'arena_specialists',
      title: { fr: 'Specialistes d arene', en: 'Arena Specialists' },
      universes: ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'],
      reward: { gold: 560, shards: 95, tokens: 4 },
      bonus: { fr: 'Cache precision: critique, duel et tactique.', en: 'Precision cache: critical, duel, and tactics.' }
    },
    {
      id: 'apocalypse_front',
      title: { fr: 'Front apocalypse', en: 'Apocalypse Front' },
      universes: ['Fallout', 'Doom', 'Mad Max'],
      reward: { gold: 380, shards: 75, tokens: 3 },
      bonus: { fr: 'Cache apocalypse: violence brute et endurance.', en: 'Apocalypse cache: raw violence and endurance.' }
    },
    {
      id: 'horror_roster',
      title: { fr: 'Registre des icones horrifiques', en: 'Horror Icon Registry' },
      universes: ['Slender Man', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Scary Movie'],
      reward: { gold: 500, shards: 90, tokens: 3 },
      bonus: { fr: 'Cache horreur: peur, controle et anomalies classees.', en: 'Horror cache: fear, control, and classified anomalies.' }
    }
  ];

  const BREACH_TIMELINE = [
    {
      id: 't0',
      unlockClears: 0,
      title: { fr: 'T0 - Detection initiale', en: 'T0 - Initial Detection' },
      text: {
        fr: 'Les premiers mondes servent de balises. Chaque victoire transforme une faille sauvage en coordonnee stable.',
        en: 'The first worlds act as beacons. Each win turns a wild breach into a stable coordinate.'
      }
    },
    {
      id: 't1',
      unlockClears: 6,
      title: { fr: 'T1 - Regroupement par signatures', en: 'T1 - Signature Grouping' },
      text: {
        fr: 'Les univers commencent a se regrouper: science-fiction militaire, horreur, cyber-realite et magie.',
        en: 'Universes begin clustering: military sci-fi, horror, cyber-reality, and magic.'
      }
    },
    {
      id: 't2',
      unlockClears: 12,
      title: { fr: 'T2 - Multiplication des variantes', en: 'T2 - Variant Multiplication' },
      text: {
        fr: 'Les films d une meme franchise forment des timelines independantes, chacune avec son noyau et son boss.',
        en: 'Films from the same franchise form independent timelines, each with its own core and boss.'
      }
    },
    {
      id: 't3',
      unlockClears: 20,
      title: { fr: 'T3 - Resonance culturelle', en: 'T3 - Cultural Resonance' },
      text: {
        fr: 'Les mondes musicaux et comiques prouvent que la Singularity absorbe aussi les codes de scene, de ton et de mythe.',
        en: 'Music and comedy worlds prove the Singularity also absorbs stage, tone, and myth codes.'
      }
    },
    {
      id: 't4',
      unlockClears: FINAL_STAGE_REQUIRED_CLEARS,
      title: { fr: 'T4 - Ouverture du noyau', en: 'T4 - Core Opening' },
      text: {
        fr: 'Assez de coordonnees sont stabilisees pour attaquer le Breach Singularity Core sans perdre le reseau.',
        en: 'Enough coordinates are stabilized to strike the Breach Singularity Core without losing the network.'
      }
    }
  ];

  const UNIVERSE_MODIFIERS = {
    Alien: { id: 'acid_blood', name: { fr: 'Sang acide', en: 'Acid Blood' }, desc: { fr: 'Les ennemis laissent des residus acides: recompenses +20%, boss plus agressif.', en: 'Enemies leave acidic residue: rewards +20%, boss more aggressive.' }, bossHp: 1.08, reward: 1.2, color: '#8adbe6' },
    Aliens: { id: 'sentry_corridor', name: { fr: 'Couloir sentinelle', en: 'Sentry Corridor' }, desc: { fr: 'La ruche attaque en vagues: Fragments +22%, ennemis plus rapides.', en: 'The hive attacks in waves: Shards +22%, enemies faster.' }, enemySpd: 1.1, reward: 1.22, color: '#78e3e6' },
    Prometheus: { id: 'black_pathogen', name: { fr: 'Pathogene noir', en: 'Black Pathogen' }, desc: { fr: 'Le pathogene instabilise les deux camps: boss +12% PV, cache +25%.', en: 'The pathogen destabilizes both sides: boss +12% HP, cache +25%.' }, bossHp: 1.12, reward: 1.25, color: '#78dcd7' },
    Predator: { id: 'honor_hunt', name: { fr: 'Chasse honorable', en: 'Honor Hunt' }, desc: { fr: 'Le duel Yautja valorise les victoires propres: Jetons possibles sur stage pair.', en: 'The Yautja duel values clean victories: possible Tokens on even stages.' }, reward: 1.16, color: '#9bff62' },
    Prey: { id: 'mud_camouflage', name: { fr: 'Camouflage de boue', en: 'Mud Camouflage' }, desc: { fr: 'Les embuscades protegent l escouade: defense +10%, recompense +10%.', en: 'Ambushes protect the squad: defense +10%, reward +10%.' }, heroDef: 1.1, reward: 1.1, color: '#e6af53' },
    'Joker New 52': { id: 'joker_toxin', name: { fr: 'Toxine Joker', en: 'Joker Toxin' }, desc: { fr: 'La panique augmente les degats ennemis et la signature de cache.', en: 'Panic raises enemy damage and cache signature.' }, enemyAtk: 1.14, reward: 1.24, color: '#4cdc5e' },
    'The Batman Who Laughs': { id: 'dark_metal', name: { fr: 'Metal noir', en: 'Dark Metal' }, desc: { fr: 'Le Multivers Noir durcit le boss: PV +18%, cache +30%.', en: 'The Dark Multiverse hardens the boss: HP +18%, cache +30%.' }, bossHp: 1.18, reward: 1.3, color: '#d62121' },
    Discworld: { id: 'octarine_leak', name: { fr: 'Fuite octarine', en: 'Octarine Leak' }, desc: { fr: 'La magie absurde plie les regles: Fragments +18%, defense +5%.', en: 'Absurd magic bends rules: Shards +18%, defense +5%.' }, heroDef: 1.05, reward: 1.18, color: '#e7d476' },
    Kaamelott: { id: 'table_dispute', name: { fr: 'Conseil dispute', en: 'Council Dispute' }, desc: { fr: 'Les ordres contradictoires ralentissent le rythme mais augmentent l or.', en: 'Contradictory orders slow the rhythm but increase Gold.' }, reward: 1.17, color: '#d6b465' },
    'Dungeon Meshi': { id: 'monster_cuisine', name: { fr: 'Cuisine de monstre', en: 'Monster Cuisine' }, desc: { fr: 'Chaque combat nourrit l escouade: defense +8%, cache +12%.', en: 'Every fight feeds the squad: defense +8%, cache +12%.' }, heroDef: 1.08, reward: 1.12, color: '#e2c36a' },
    Noob: { id: 'bugged_respawn', name: { fr: 'Respawn bugge', en: 'Bugged Respawn' }, desc: { fr: 'Le code d Olydri deraille: recompenses +20%, ennemis plus rapides.', en: 'Olydri code glitches: rewards +20%, enemies faster.' }, enemySpd: 1.08, reward: 1.2, color: '#6ad5ff' },
    Rammstein: { id: 'feuerzone', name: { fr: 'Feuerzone', en: 'Feuerzone' }, desc: { fr: 'La scene industrielle brule fort: attaque ennemie +10%, Jetons plus rentables.', en: 'The industrial stage burns hard: enemy attack +10%, richer Tokens.' }, enemyAtk: 1.1, reward: 1.2, color: '#ff692d' },
    'System of a Down': { id: 'tempo_break', name: { fr: 'Cassure tempo', en: 'Tempo Break' }, desc: { fr: 'Les ruptures rythmiques accelerent le combat: vitesse ennemie +12%, Fragments +20%.', en: 'Rhythm breaks accelerate combat: enemy speed +12%, Shards +20%.' }, enemySpd: 1.12, reward: 1.2, color: '#f1c40f' },
    'Rob Zombie': { id: 'grindhouse_cut', name: { fr: 'Montage grindhouse', en: 'Grindhouse Cut' }, desc: { fr: 'Les plans horrifiques amplifient le chaos: cache +22%.', en: 'Horror cuts amplify chaos: cache +22%.' }, reward: 1.22, color: '#ffa943' },
    'Daft Punk': { id: 'alive_sync', name: { fr: 'Synchronisation Alive', en: 'Alive Sync' }, desc: { fr: 'La grille lumineuse cadence l equipe: defense +6%, vitesse ennemie +6%, recompense +18%.', en: 'The light grid paces the squad: defense +6%, enemy speed +6%, reward +18%.' }, heroDef: 1.06, enemySpd: 1.06, reward: 1.18, color: '#ffc740' },
    'Oliver Tree': { id: 'viral_stunt', name: { fr: 'Cascade virale', en: 'Viral Stunt' }, desc: { fr: 'La faille devient imprevisible: recompense +15%.', en: 'The breach becomes unpredictable: reward +15%.' }, reward: 1.15, color: '#ff6f3c' },
    'Hazbin Hotel': { id: 'redemption_song', name: { fr: 'Refrain redemption', en: 'Redemption Refrain' }, desc: { fr: 'Le cabaret infernal renforce les controles: defense +8%, cache +15%.', en: 'The infernal cabaret reinforces control: defense +8%, cache +15%.' }, heroDef: 1.08, reward: 1.15, color: '#ffd35c' },
    'Alien 3': { id: 'penal_hive', name: { fr: 'Ruche penitentiaire', en: 'Penal Hive' }, desc: { fr: 'Le couloir ferme durcit chaque rencontre: boss +14% PV, cache +20%.', en: 'The sealed corridor hardens every fight: boss +14% HP, cache +20%.' }, bossHp: 1.14, reward: 1.2, color: '#b66a3c' },
    'Alien Resurrection': { id: 'clone_lab', name: { fr: 'Laboratoire clone', en: 'Clone Lab' }, desc: { fr: 'Les specimens hybrides accelerent les vagues: vitesse ennemie +9%, cache +22%.', en: 'Hybrid specimens accelerate waves: enemy speed +9%, cache +22%.' }, enemySpd: 1.09, reward: 1.22, color: '#7bd9c6' },
    'Alien: Covenant': { id: 'covenant_spores', name: { fr: 'Spores Covenant', en: 'Covenant Spores' }, desc: { fr: 'Les spores contaminent la zone: attaque ennemie +10%, cache +24%.', en: 'Spores contaminate the zone: enemy attack +10%, cache +24%.' }, enemyAtk: 1.1, reward: 1.24, color: '#c7d79a' },
    'Alien: Romulus': { id: 'romulus_salvage', name: { fr: 'Sauvetage Romulus', en: 'Romulus Salvage' }, desc: { fr: 'La station abandonnee augmente les prises de risque: boss +10% PV, cache +26%.', en: 'The abandoned station raises risk: boss +10% HP, cache +26%.' }, bossHp: 1.1, reward: 1.26, color: '#7fd7ff' },
    'Predator 2': { id: 'city_hunt', name: { fr: 'Chasse urbaine', en: 'City Hunt' }, desc: { fr: 'La jungle devient verticale: ennemis +8% vitesse, recompense +18%.', en: 'The jungle goes vertical: enemies +8% speed, reward +18%.' }, enemySpd: 1.08, reward: 1.18, color: '#f0a14a' },
    Predators: { id: 'game_preserve', name: { fr: 'Reserve de chasse', en: 'Game Preserve' }, desc: { fr: 'Le terrain est choisi par les chasseurs: boss +15% PV, cache +25%.', en: 'The hunters choose the ground: boss +15% HP, cache +25%.' }, bossHp: 1.15, reward: 1.25, color: '#8fbf55' },
    'The Predator': { id: 'upgrade_hunt', name: { fr: 'Chasseur upgrade', en: 'Upgrade Hunter' }, desc: { fr: 'L hybridation booste les menaces: attaque +12%, recompense +24%.', en: 'Hybridization boosts threats: attack +12%, reward +24%.' }, enemyAtk: 1.12, reward: 1.24, color: '#d36b44' },
    'Predator: Killer of Killers': { id: 'legendary_trophies', name: { fr: 'Trophees legendaires', en: 'Legendary Trophies' }, desc: { fr: 'Chaque epoque apporte un champion: boss +16% PV, cache +28%.', en: 'Each era brings a champion: boss +16% HP, cache +28%.' }, bossHp: 1.16, reward: 1.28, color: '#e1c15b' },
    'Predator: Badlands': { id: 'badlands_trial', name: { fr: 'Epreuve Badlands', en: 'Badlands Trial' }, desc: { fr: 'Les terres hostiles favorisent la survie: defense +9%, cache +16%.', en: 'Hostile lands favor survival: defense +9%, cache +16%.' }, heroDef: 1.09, reward: 1.16, color: '#d88a45' },
    'Alien vs Predator': { id: 'temple_crossfire', name: { fr: 'Temple croise', en: 'Temple Crossfire' }, desc: { fr: 'Le temple oppose ruche et clan: boss +12% PV, attaque +8%, cache +30%.', en: 'The temple pits hive against clan: boss +12% HP, attack +8%, cache +30%.' }, bossHp: 1.12, enemyAtk: 1.08, reward: 1.3, color: '#92f56d' },
    'Aliens vs Predator: Requiem': { id: 'requiem_outbreak', name: { fr: 'Epidemie Requiem', en: 'Requiem Outbreak' }, desc: { fr: 'La ville contaminee deborde: ennemis +10% vitesse, cache +27%.', en: 'The infected town overflows: enemies +10% speed, cache +27%.' }, enemySpd: 1.1, reward: 1.27, color: '#b6d86d' },
    'Gears of War': { id: 'cover_grind', name: { fr: 'Ligne de couverture', en: 'Cover Line' }, desc: { fr: 'Les positions lourdes renforcent l escouade: defense +12%, cache +12%.', en: 'Heavy positions reinforce the squad: defense +12%, cache +12%.' }, heroDef: 1.12, reward: 1.12, color: '#c44f3f' },
    Halo: { id: 'spartan_drop', name: { fr: 'Drop Spartan', en: 'Spartan Drop' }, desc: { fr: 'Le deploiement orbital booste l assaut: attaque heros +8%, cache +15%.', en: 'Orbital deployment boosts assault: hero attack +8%, cache +15%.' }, heroAtk: 1.08, reward: 1.15, color: '#78c95b' },
    'Resident Evil': { id: 'biohazard_lockdown', name: { fr: 'Confinement biohazard', en: 'Biohazard Lockdown' }, desc: { fr: 'Les infectes frappent plus fort: attaque +9%, cache +18%.', en: 'The infected hit harder: attack +9%, cache +18%.' }, enemyAtk: 1.09, reward: 1.18, color: '#65c76b' },
    'Silent Hill': { id: 'fog_shift', name: { fr: 'Brouillard changeant', en: 'Shifting Fog' }, desc: { fr: 'Le brouillard ralentit la lecture du terrain: boss +10% PV, cache +19%.', en: 'The fog obscures the field: boss +10% HP, cache +19%.' }, bossHp: 1.1, reward: 1.19, color: '#c4c0ad' },
    'Dino Crisis': { id: 'raptor_alarm', name: { fr: 'Alerte raptor', en: 'Raptor Alarm' }, desc: { fr: 'Les predateurs foncent sur les failles: vitesse +11%, cache +18%.', en: 'Predators rush breaches: speed +11%, cache +18%.' }, enemySpd: 1.11, reward: 1.18, color: '#7bc96f' },
    'The Matrix': { id: 'bullet_time', name: { fr: 'Bullet time', en: 'Bullet Time' }, desc: { fr: 'Le code ralentit la menace: defense +10%, cache +14%.', en: 'Code slows the threat: defense +10%, cache +14%.' }, heroDef: 1.1, reward: 1.14, color: '#39ff8a' },
    Stargate: { id: 'iris_protocol', name: { fr: 'Protocole iris', en: 'Iris Protocol' }, desc: { fr: 'Les equipes SG verrouillent la breche: defense +12%, recompense +15%.', en: 'SG teams lock the breach: defense +12%, reward +15%.' }, heroDef: 1.12, reward: 1.15, color: '#6ed0ff' },
    'Half-Life': { id: 'resonance_cascade', name: { fr: 'Cascade de resonance', en: 'Resonance Cascade' }, desc: { fr: 'Les portails Xen destabilisent le combat: boss +12% PV, cache +22%.', en: 'Xen portals destabilize combat: boss +12% HP, cache +22%.' }, bossHp: 1.12, reward: 1.22, color: '#f58d38' },
    Portal: { id: 'test_chamber', name: { fr: 'Salle de test', en: 'Test Chamber' }, desc: { fr: 'La logique Aperture optimise les routes: defense +6%, cache +16%.', en: 'Aperture logic optimizes routes: defense +6%, cache +16%.' }, heroDef: 1.06, reward: 1.16, color: '#5cc7ff' },
    'Metal Gear': { id: 'stealth_ops', name: { fr: 'Operation furtive', en: 'Stealth Ops' }, desc: { fr: 'L infiltration reduit les pertes: defense +9%, cache +15%.', en: 'Infiltration reduces losses: defense +9%, cache +15%.' }, heroDef: 1.09, reward: 1.15, color: '#8aa178' },
    Payday: { id: 'heist_timer', name: { fr: 'Chrono braquage', en: 'Heist Timer' }, desc: { fr: 'Plus le risque monte, plus le butin suit: attaque ennemie +8%, cache +21%.', en: 'The higher the risk, the richer the take: enemy attack +8%, cache +21%.' }, enemyAtk: 1.08, reward: 1.21, color: '#3f8fd2' },
    Vocaloid: { id: 'synth_chorus', name: { fr: 'Choeur synthetique', en: 'Synthetic Chorus' }, desc: { fr: 'Le tempo numerique stabilise l equipe: defense +6%, cache +14%.', en: 'Digital tempo stabilizes the team: defense +6%, cache +14%.' }, heroDef: 1.06, reward: 1.14, color: '#43d6df' },
    'Yu-Gi-Oh': { id: 'duel_phase', name: { fr: 'Phase de duel', en: 'Duel Phase' }, desc: { fr: 'Chaque victoire charge le deck: attaque heros +9%, cache +16%.', en: 'Each win charges the deck: hero attack +9%, cache +16%.' }, heroAtk: 1.09, reward: 1.16, color: '#f1c24d' },
    'Guilty Gear': { id: 'tension_meter', name: { fr: 'Jauge tension', en: 'Tension Meter' }, desc: { fr: 'Les duels explosent en puissance: attaque +10%, cache +17%.', en: 'Duels explode in power: attack +10%, cache +17%.' }, heroAtk: 1.1, reward: 1.17, color: '#ef5646' },
    BlazBlue: { id: 'azure_drive', name: { fr: 'Drive azur', en: 'Azure Drive' }, desc: { fr: 'L anomalie azur durcit le boss: PV +11%, cache +20%.', en: 'The azure anomaly hardens the boss: HP +11%, cache +20%.' }, bossHp: 1.11, reward: 1.2, color: '#4da6ff' },
    'Slender Man': { id: 'page_hunt', name: { fr: 'Chasse aux pages', en: 'Page Hunt' }, desc: { fr: 'La peur brouille les reperes: ennemis +8% vitesse, cache +18%.', en: 'Fear scrambles bearings: enemies +8% speed, cache +18%.' }, enemySpd: 1.08, reward: 1.18, color: '#d9d9d9' },
    Chucky: { id: 'killer_doll', name: { fr: 'Poupee tueuse', en: 'Killer Doll' }, desc: { fr: 'Les attaques surprises augmentent la pression: attaque +10%, cache +18%.', en: 'Surprise attacks raise pressure: attack +10%, cache +18%.' }, enemyAtk: 1.1, reward: 1.18, color: '#e65b42' },
    Hellraiser: { id: 'lament_config', name: { fr: 'Configuration du Lament', en: 'Lament Configuration' }, desc: { fr: 'La douleur devient ressource: boss +15% PV, cache +25%.', en: 'Pain becomes resource: boss +15% HP, cache +25%.' }, bossHp: 1.15, reward: 1.25, color: '#d6b36a' },
    'Mass Effect': { id: 'spectre_authority', name: { fr: 'Autorite Spectre', en: 'Spectre Authority' }, desc: { fr: 'Le commandement galactique coordonne mieux l equipe: defense +8%, cache +17%.', en: 'Galactic command coordinates the team better: defense +8%, cache +17%.' }, heroDef: 1.08, reward: 1.17, color: '#4cb4ff' },
    Fallout: { id: 'wasteland_scavenge', name: { fr: 'Recup wasteland', en: 'Wasteland Scavenge' }, desc: { fr: 'Chaque ruine cache des ressources: cache +20%, ennemis +6% attaque.', en: 'Every ruin hides resources: cache +20%, enemies +6% attack.' }, enemyAtk: 1.06, reward: 1.2, color: '#d7c15a' },
    Doom: { id: 'rip_and_tear', name: { fr: 'Rip and tear', en: 'Rip and Tear' }, desc: { fr: 'L enfer recompense l agression: attaque heros +12%, boss +10% PV.', en: 'Hell rewards aggression: hero attack +12%, boss +10% HP.' }, heroAtk: 1.12, bossHp: 1.1, reward: 1.18, color: '#ff4c32' },
    Unreal: { id: 'u_damage', name: { fr: 'U-Damage', en: 'U-Damage' }, desc: { fr: 'Les arenes amplifient les pics de degats: attaque +11%, cache +15%.', en: 'Arenas amplify damage spikes: attack +11%, cache +15%.' }, heroAtk: 1.11, reward: 1.15, color: '#ff8b32' },
    'Harry Potter': { id: 'protective_charm', name: { fr: 'Charme protecteur', en: 'Protective Charm' }, desc: { fr: 'La magie defensive stabilise la breche: defense +11%, cache +14%.', en: 'Defensive magic stabilizes the breach: defense +11%, cache +14%.' }, heroDef: 1.11, reward: 1.14, color: '#b68cff' },
    'Star Wars': { id: 'force_balance', name: { fr: 'Equilibre de la Force', en: 'Force Balance' }, desc: { fr: 'La Force renforce les actions decisives: attaque +8%, defense +6%, cache +15%.', en: 'The Force reinforces decisive actions: attack +8%, defense +6%, cache +15%.' }, heroAtk: 1.08, heroDef: 1.06, reward: 1.15, color: '#ffe066' },
    'Le Cinquième Element': { id: 'divine_language', name: { fr: 'Langage divin', en: 'Divine Language' }, desc: { fr: 'Les quatre elements alignent l escouade: defense +8%, cache +16%.', en: 'The four elements align the squad: defense +8%, cache +16%.' }, heroDef: 1.08, reward: 1.16, color: '#ffb563' },
    'Scary Movie': { id: 'parody_logic', name: { fr: 'Logique parodique', en: 'Parody Logic' }, desc: { fr: 'L absurde casse la menace: defense +7%, cache +15%.', en: 'Absurdity breaks the threat: defense +7%, cache +15%.' }, heroDef: 1.07, reward: 1.15, color: '#f2f2a0' },
    'Dead Space': { id: 'necromorph_pressure', name: { fr: 'Pression necromorphe', en: 'Necromorph Pressure' }, desc: { fr: 'La station isolee augmente la violence: attaque +12%, cache +24%.', en: 'The isolated station increases violence: attack +12%, cache +24%.' }, enemyAtk: 1.12, reward: 1.24, color: '#d17a42' },
    'Rick & Morty': { id: 'portal_gun', name: { fr: 'Pistolet portail', en: 'Portal Gun' }, desc: { fr: 'Les detours dimensionnels boostent le rendement: cache +19%, boss +7% PV.', en: 'Dimensional detours boost yield: cache +19%, boss +7% HP.' }, bossHp: 1.07, reward: 1.19, color: '#67e86b' },
    'Digital Circus': { id: 'abstract_glitch', name: { fr: 'Glitch abstrait', en: 'Abstract Glitch' }, desc: { fr: 'La scene digitale instabilise les ennemis: vitesse +7%, cache +17%.', en: 'The digital stage destabilizes enemies: speed +7%, cache +17%.' }, enemySpd: 1.07, reward: 1.17, color: '#ff6edb' },
    Digimon: { id: 'digivolution_chain', name: { fr: 'Chaine digivolution', en: 'Digivolution Chain' }, desc: { fr: 'Chaque combat charge la forme suivante: attaque +9%, cache +16%.', en: 'Each fight charges the next form: attack +9%, cache +16%.' }, heroAtk: 1.09, reward: 1.16, color: '#ffb43d' },
    Saw: { id: 'trap_room', name: { fr: 'Salle de piege', en: 'Trap Room' }, desc: { fr: 'Les choix difficiles augmentent les gains: boss +9% PV, cache +22%.', en: 'Hard choices increase gains: boss +9% HP, cache +22%.' }, bossHp: 1.09, reward: 1.22, color: '#b54335' },
    'Rosario + Vampire': { id: 'monster_class', name: { fr: 'Classe monstre', en: 'Monster Class' }, desc: { fr: 'Les clans surnaturels protegent l equipe: defense +9%, cache +15%.', en: 'Supernatural clans protect the team: defense +9%, cache +15%.' }, heroDef: 1.09, reward: 1.15, color: '#f07ab7' },
    Negima: { id: 'magister_pactio', name: { fr: 'Pactio Magister', en: 'Magister Pactio' }, desc: { fr: 'Les pactes magiques renforcent les combos: attaque +8%, cache +15%.', en: 'Magic pacts strengthen combos: attack +8%, cache +15%.' }, heroAtk: 1.08, reward: 1.15, color: '#b59cff' },
    'Ghost in the Shell': { id: 'cyberbrain_sync', name: { fr: 'Synchro cybercerveau', en: 'Cyberbrain Sync' }, desc: { fr: 'La coordination cybernetique anticipe les vagues: defense +8%, cache +18%.', en: 'Cybernetic coordination anticipates waves: defense +8%, cache +18%.' }, heroDef: 1.08, reward: 1.18, color: '#7fe7d7' },
    'Mad Max': { id: 'war_rig_run', name: { fr: 'Convoi War Rig', en: 'War Rig Run' }, desc: { fr: 'La route impose la vitesse et la survie: ennemis +8% vitesse, cache +19%.', en: 'The road demands speed and survival: enemies +8% speed, cache +19%.' }, enemySpd: 1.08, reward: 1.19, color: '#d98a3d' }
  };

  // List of high-tier items in the Event Shop
  const EVENT_SHOP_ITEMS = [
    { id: 'millennium_puzzle', name: { en: 'Millennium Puzzle', fr: 'Puzzle du Millénium' }, boost: { hp: 100, atk: 10, def: 5 }, tokenCost: 3 },
    { id: 'bandana_infinite', name: { en: 'Infinite Bandana', fr: 'Bandana Infini' }, boost: { atk: 12 }, tokenCost: 3 },
    { id: 'crucible_guard', name: { en: 'Crucible Hilt', fr: 'Creuset de Chasse' }, boost: { atk: 18 }, tokenCost: 4 },
    { id: 'udamage_power', name: { en: 'Amplificateur U-Damage', fr: 'Double Dégâts U-Damage' }, boost: { atk: 15 }, tokenCost: 4 },
    // Event Items (usable in combat)
    { id: 'evt_fo_nuke', name: { en: 'Fat Man Nuke Launcher', fr: 'Fat Man Lance-Nuke' }, isCombatEvent: true, universe: 'Fallout', tokenCost: 5 },
    { id: 'evt_doom_quad', name: { en: 'Quad Damage Powerup', fr: 'Multiplicateur Quad Damage' }, isCombatEvent: true, universe: 'Doom', tokenCost: 6 },
    { id: 'evt_ut_redeemer', name: { en: 'Redeemer Missile Targeter', fr: 'Viseur de Missile Rédempteur' }, isCombatEvent: true, universe: 'Unreal', tokenCost: 8 },
    ...EXPANDED_EVENT_SHOP_ITEMS
  ];
  const visibleEventShopItems = EVENT_SHOP_ITEMS.filter(item => (
    (!item.universe || isUniverseVisible(item.universe))
    && !isAssetDisabled('gear', item.id)
  ));
  const SHOP_ITEM_UNIVERSE_HINTS = {
    millennium_puzzle: 'Yu-Gi-Oh',
    bandana_infinite: 'Metal Gear',
    crucible_guard: 'Doom',
    udamage_power: 'Unreal'
  };
  const getShopItemUniverse = (item) => item.universe || SHOP_ITEM_UNIVERSE_HINTS[item.id] || null;
  const getShopItemAccent = (item) => {
    const universe = getShopItemUniverse(item);
    return UNIVERSE_MODIFIERS[universe]?.color
      || LORE_DB[universe]?.accent
      || (item.isCombatEvent ? '#ff4500' : '#39c5bb');
  };
  const getShopItemGlyph = (item) => {
    if (item.id.includes('nuke')) return 'NUKE';
    if (item.id.includes('quad') || item.id.includes('udamage')) return 'X4';
    if (item.id.includes('redeemer')) return 'MISSILE';
    if (item.id.includes('puzzle')) return 'SIGIL';
    if (item.id.includes('bandana')) return 'INF';
    if (item.id.includes('crucible')) return 'BLADE';
    return item.isCombatEvent ? 'TRIGGER' : 'RELIC';
  };
  const getShopItemSummary = (item) => {
    if (item.isCombatEvent) {
      const eventDetails = EVENT_ITEMS_DB[item.universe];
      return eventDetails
        ? getEventLore(eventDetails)
        : (lang === 'fr'
          ? `Declencheur de combat synchronise ${item.universe}.`
          : `${item.universe} synchronized combat trigger.`);
    }
    return lang === 'fr'
      ? getGearLoreDescription({
        item: {
          ...item,
          universe: getShopItemUniverse(item) || 'Nexus de Convergence',
          name: item.name,
          boost: item.boost || {}
        },
        lang,
        lore: LORE_DB[getShopItemUniverse(item)]
      })
      : getGearLoreDescription({
        item: {
          ...item,
          universe: getShopItemUniverse(item) || 'Nexus de Convergence',
          name: item.name,
          boost: item.boost || {}
        },
        lang,
        lore: LORE_DB[getShopItemUniverse(item)]
      });
  };

  const UNIVERSE_TO_STAGE_ID = {
    'Gears of War': 1, 'Halo': 2, 'Alien': 3, 'Predator': 4, 'Resident Evil': 5,
    'Silent Hill': 6, 'Dino Crisis': 7, 'The Matrix': 8, 'Stargate': 9, 'Half-Life': 10,
    'Portal': 11, 'Metal Gear': 12, 'Payday': 13, 'Vocaloid': 14, 'Yu-Gi-Oh': 15,
    'Guilty Gear': 16, 'BlazBlue': 17, 'Slender Man': 18, 'Chucky': 19, 'Hellraiser': 20,
    'Mass Effect': 21, 'Fallout': 22, 'Doom': 23, 'Unreal': 24, 'Harry Potter': 25,
    'Star Wars': 26, 'Le Cinquième Element': 27, 'Scary Movie': 28, 'Dead Space': 29,
    'Rick & Morty': 30, 'Digital Circus': 31, 'Digimon': 32, 'Saw': 33, 'Rosario + Vampire': 34,
    'Negima': 35, 'Ghost in the Shell': 36, 'Mad Max': 37
  };

  Object.assign(UNIVERSE_TO_STAGE_ID, EXPANDED_STAGE_ID_BY_UNIVERSE);

  const getHeroStats = (hero) => {
    const lvl = heroLevels[hero.id] || 1;
    const multiplier = 1 + (lvl - 1) * 0.1;
    let stats = {
      hp: Math.round(hero.stats.hp * multiplier),
      atk: Math.round(hero.stats.atk * multiplier),
      def: Math.round(hero.stats.def * multiplier),
      spd: Math.round(hero.stats.spd * (1 + (lvl - 1) * 0.03))
    };

    // 1. Universe completion passive stat bonus (+5% all stats)
    const ustageId = UNIVERSE_TO_STAGE_ID[hero.universe];
    if (ustageId && completedStages && completedStages.includes(ustageId)) {
      stats.hp = Math.round(stats.hp * 1.05);
      stats.atk = Math.round(stats.atk * 1.05);
      stats.def = Math.round(stats.def * 1.05);
      stats.spd = Math.round(stats.spd * 1.05);
    }

    // 2. Deployed Synergy multipliers
    const squadCats = activeTeam.map(id => HEROES_DB.find(h => h.id === id)?.category || '');
    const activeCatsCount = squadCats.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const synergyActive = activeCatsCount[hero.category] >= 2;
    if (synergyActive) {
      if (hero.category === 'marine') stats.hp = Math.round(stats.hp * 1.25);
      if (hero.category === 'slayer') stats.atk = Math.round(stats.atk * 1.20);
      if (hero.category === 'horror') stats.spd = Math.round(stats.spd * 1.15);
      if (hero.category === 'hacker') stats.spd = Math.round(stats.spd * 1.20);
      if (hero.category === 'tactical') stats.def = Math.round(stats.def * 1.20);
    }

    FACTION_RULES.forEach(rule => {
      const activeCount = activeTeam
        .map(id => HEROES_DB.find(h => h.id === id)?.universe)
        .filter(universe => rule.universes.includes(universe)).length;
      if (activeCount >= 2 && rule.universes.includes(hero.universe)) {
        stats[rule.stat] = Math.round(stats[rule.stat] * 1.08);
      }
    });

    // 3. Talent Mod boosts
    if (heroTalents && heroTalents[hero.id]) {
      const talent = heroTalents[hero.id];
      if (talent === 'incendiary') stats.atk = Math.round(stats.atk * 1.10);
      if (talent === 'vanguard') stats.def = Math.round(stats.def * 1.15);
      if (talent === 'survival_instinct') stats.hp = Math.round(stats.hp * 1.20);
      if (talent === 'critical_edge') stats.atk = Math.round(stats.atk * 1.20);
      if (talent === 'hyper_velocity') stats.spd = Math.round(stats.spd * 1.15);
      if (talent === 'atb_overdrive') stats.spd = Math.round(stats.spd * 1.20);
      if (talent === 'guardian_plates') stats.hp = Math.round(stats.hp * 1.20);
    }

    if (collectionBonusCount > 0) {
      const collectionFactor = 1 + Math.min(0.3, collectionBonusCount * 0.02);
      stats.hp = Math.round(stats.hp * collectionFactor);
      stats.atk = Math.round(stats.atk * collectionFactor);
      stats.def = Math.round(stats.def * collectionFactor);
      stats.spd = Math.round(stats.spd * collectionFactor);
    }

    // 4. Add equipped gear boosts
    const gearId = equippedGear[hero.id];
    if (gearId) {
      const isUpgraded = gearId.endsWith('_plus');
      const baseGearId = isUpgraded ? gearId.replace('_plus', '') : gearId;
      const gear = EQUIP_ITEMS_DB.find(it => it.id === baseGearId);
      if (gear && gear.boost) {
        const factor = isUpgraded ? 2 : 1;
        if (gear.boost.hp) stats.hp += gear.boost.hp * factor;
        if (gear.boost.atk) stats.atk += gear.boost.atk * factor;
        if (gear.boost.def) stats.def += gear.boost.def * factor;
        if (gear.boost.spd) stats.spd += gear.boost.spd * factor;
      }
    }
    return stats;
  };

  const getUpgradeCost = (heroId) => {
    const currentLvl = heroLevels[heroId] || 1;
    return currentLvl * 60;
  };

  const notifyNexus = (message, tone = 'info') => {
    setNexusMessage({ message, tone, stamp: Date.now() });
    window.clearTimeout(notifyNexus.timeoutId);
    notifyNexus.timeoutId = window.setTimeout(() => setNexusMessage(null), 3200);
  };

  const getLockedReason = (stage) => {
    const required = getStageRequiredClears(stage);
    const missing = Math.max(0, required - completedStages.length);
    const baseText = required > 0
      ? (lang === 'fr'
        ? `Progression Nexus: ${Math.min(completedStages.length, required)}/${required} breches stabilisees.`
        : `Nexus progress: ${Math.min(completedStages.length, required)}/${required} breaches stabilized.`)
      : null;
    if (stage.characterArc || stage.universeArc || stage.trioArc) {
      return getArcUnlockRequirementText(stage);
    }
    if (stage.fusionMission) {
      const sourceNeed = Math.min(2, stage.sourceUniverses?.length || 1);
      const sourceText = lang === 'fr'
        ? `Sources de fusion: ${getFusionSourceClears(stage)}/${sourceNeed} Trames sources deja stabilisees.`
        : `Fusion sources: ${getFusionSourceClears(stage)}/${sourceNeed} source Threads already stabilized.`;
      return [sourceText, baseText].filter(Boolean).join(' ');
    }
    if (stage.id === 38) {
      return [baseText, lang === 'fr'
        ? 'Final A.R.C.A.: le noyau Sans-Auteur reste masque tant que le reseau de failles principales n est pas assez stabilise.'
        : 'A.R.C.A. finale: the Authorless core stays masked until the main breach network is stabilized enough.'
      ].filter(Boolean).join(' ');
    }
    if (missing <= 0) {
      return lang === 'fr'
        ? `${stage.universe} est disponible: selectionne une equipe puis lance la mission.`
        : `${stage.universe} is available: select a team and launch the mission.`;
    }
    return lang === 'fr'
      ? `Coordonnees verrouillees: stabilise encore ${missing} breche${missing > 1 ? 's' : ''} pour ouvrir ${stage.universe}.`
      : `Coordinates locked: stabilize ${missing} more breach${missing > 1 ? 'es' : ''} to open ${stage.universe}.`;
  };

  const handleLevelUp = (heroId) => {
    const cost = getUpgradeCost(heroId);
    if (gold < cost) {
      notifyNexus(lang === 'fr' ? `Or insuffisant: ${cost} requis pour renforcer cette signature.` : `Not enough Gold: ${cost} required to reinforce this signature.`, 'warn');
      return;
    }

    setGold(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    notifyNexus(lang === 'fr' ? 'Signature heroique renforcee dans le Nexus.' : 'Heroic signature reinforced in the Nexus.', 'success');
    sound.playSfx('levelup');
  };

  const handleLevelUpPotion = (heroId) => {
    const cost = 20;
    if (breachShards < cost) {
      notifyNexus(lang === 'fr' ? 'Fragments insuffisants pour condenser une potion EXP.' : 'Not enough Shards to condense an EXP potion.', 'warn');
      return;
    }

    setBreachShards(prev => prev - cost);
    setHeroLevels(prev => ({
      ...prev,
      [heroId]: (prev[heroId] || 1) + 1
    }));
    notifyNexus(lang === 'fr' ? 'Potion convertie: niveau de signature augmente.' : 'Potion converted: signature level increased.', 'success');
    sound.playSfx('levelup');
  };

  const autoEquipRelics = () => {
    const availableRelics = EQUIP_ITEMS_DB.filter(r => inventory.includes(r.id) && !isAssetDisabled('gear', r.id));
    if (availableRelics.length === 0) {
      notifyNexus(lang === 'fr' ? 'Aucune relique standard disponible pour l auto-equipement.' : 'No standard relic available for auto-equip.', 'warn');
      sound.playSfx('click');
      return;
    }
    sound.playSfx('confirm');
    availableRelics.sort((a, b) => {
      const scoreA = (a.boost.atk || 0) * 1.5 + (a.boost.spd || 0) * 1.2 + (a.boost.def || 0) + (a.boost.hp || 0) * 0.1;
      const scoreB = (b.boost.atk || 0) * 1.5 + (b.boost.spd || 0) * 1.2 + (b.boost.def || 0) + (b.boost.hp || 0) * 0.1;
      return scoreB - scoreA;
    });

    const newEquipped = { ...equippedGear };
    activeTeam.forEach(heroId => {
      delete newEquipped[heroId];
    });

    let relicIdx = 0;
    activeTeam.forEach(heroId => {
      while (relicIdx < availableRelics.length) {
        const candidate = availableRelics[relicIdx];
        const isEquippedElsewhere = Object.keys(newEquipped).some(id => newEquipped[id] === candidate.id);
        if (!isEquippedElsewhere) {
          newEquipped[heroId] = candidate.id;
          relicIdx++;
          break;
        }
        relicIdx++;
      }
    });

    setEquippedGear(newEquipped);
    notifyNexus(lang === 'fr' ? 'Le Nexus a assigne les meilleures reliques a l escouade active.' : 'Nexus assigned the best relics to the active squad.', 'success');
  };

  const toggleActiveHero = (heroId) => {
    if (activeTeam.includes(heroId)) {
      if (activeTeam.length > 1) {
        setActiveTeam(prev => prev.filter(id => id !== heroId));
        sound.playSfx('click');
      } else {
        notifyNexus(lang === 'fr' ? 'Impossible: le Nexus exige au moins une unite active.' : 'Impossible: Nexus requires at least one active unit.', 'warn');
        sound.playSfx('click');
      }
    } else {
      if (activeTeam.length < 3) {
        setActiveTeam(prev => [...prev, heroId]);
        sound.playSfx('click');
      } else {
        notifyNexus(lang === 'fr' ? 'Escouade complete: retire une unite avant d en deployer une autre.' : 'Squad full: bench one unit before deploying another.', 'warn');
        sound.playSfx('click');
      }
    }
  };

  // Equip regular gear
  const equipItem = (heroId, itemId) => {
    setEquippedGear(prev => ({
      ...prev,
      [heroId]: itemId
    }));
    notifyNexus(lang === 'fr' ? 'Relique synchronisee avec la signature du heros.' : 'Relic synchronized with the hero signature.', 'success');
    sound.playSfx('levelup');
  };

  const unequipItem = (heroId) => {
    setEquippedGear(prev => ({
      ...prev,
      [heroId]: null
    }));
    sound.playSfx('click');
  };

  // Equip combat Event Item
  const equipEventItem = (heroId, itemId) => {
    const hero = HEROES_DB.find(h => h.id === heroId);
    const expectedEvent = hero ? EVENT_ITEMS_DB[hero.universe]?.id : null;
    if (expectedEvent !== itemId) {
      notifyNexus(lang === 'fr' ? 'Objet refuse: cette anomalie ne correspond pas au lore du heros.' : 'Item rejected: this anomaly does not match the hero lore.', 'warn');
      sound.playSfx('click');
      return;
    }
    setEquippedEventItems(prev => ({
      ...prev,
      [heroId]: itemId
    }));
    notifyNexus(lang === 'fr' ? 'Objet evenementiel arme pour la prochaine breche.' : 'Event item armed for the next breach.', 'success');
    sound.playSfx('levelup');
  };

  const unequipEventItem = (heroId) => {
    setEquippedEventItems(prev => ({
      ...prev,
      [heroId]: null
    }));
    sound.playSfx('click');
  };

  // Event shop purchase
  const buyShopItem = (item) => {
    if (isAssetDisabled('gear', item.id)) {
      notifyNexus(lang === 'fr' ? 'Prototype desactive par le panneau admin.' : 'Prototype disabled by the admin panel.', 'warn');
      return;
    }
    if (inventory.includes(item.id)) {
      notifyNexus(lang === 'fr' ? 'Prototype deja indexe dans l inventaire.' : 'Prototype already indexed in inventory.', 'warn');
      return;
    }
    if (eventTokens < item.tokenCost) {
      notifyNexus(lang === 'fr' ? `Jetons insuffisants: ${item.tokenCost} requis pour ce prototype.` : `Not enough Event Tokens: ${item.tokenCost} required for this prototype.`, 'warn');
      return;
    }

    setEventTokens(prev => prev - item.tokenCost);
    setInventory(prev => [...prev, item.id]);
    notifyNexus(lang === 'fr' ? 'Prototype transfere dans l inventaire Nexus.' : 'Prototype transferred into Nexus inventory.', 'success');
    sound.playSfx('levelup');
  };

  const getCompletedUniversesCount = (universes) => {
    return universes.filter(universe => {
      const stageId = UNIVERSE_TO_STAGE_ID[universe];
      return stageId && completedStages.includes(stageId);
    }).length;
  };

  const isCollectionComplete = (collection) => {
    if (Object.prototype.hasOwnProperty.call(collection, 'complete')) return Boolean(collection.complete);
    return getCompletedUniversesCount(collection.universes) === collection.universes.length;
  };
  const getCollectionMarkerId = (collection) => `collection_reward_${collection.id}`;
  const getArcMarkerId = (arc) => `arc_reward_${arc.id}`;

  const claimCollectionReward = (collection) => {
    const markerId = getCollectionMarkerId(collection);
    if (inventory.includes(markerId)) {
      notifyNexus(lang === 'fr' ? 'Cache deja reclamee: le bonus passif reste actif.' : 'Cache already claimed: passive bonus remains active.', 'warn');
      return;
    }
    if (!isCollectionComplete(collection)) {
      notifyNexus(lang === 'fr' ? 'Collection incomplete: stabilise tous les mondes lies a cette franchise.' : 'Collection incomplete: stabilize every linked franchise world.', 'warn');
      return;
    }

    setGold(prev => prev + collection.reward.gold);
    setBreachShards(prev => prev + collection.reward.shards);
    setEventTokens(prev => prev + collection.reward.tokens);
    setInventory(prev => [...prev, markerId]);
    notifyNexus(lang === 'fr' ? 'Cache de franchise ouverte: bonus passif permanent ajoute.' : 'Franchise cache opened: permanent passive bonus added.', 'success');
    sound.playSfx('levelup');
  };

  const claimArcReward = (arc) => {
    const markerId = getArcMarkerId(arc);
    const complete = arc.total > 0 && arc.completed >= arc.total;
    if (inventory.includes(markerId)) {
      notifyNexus(lang === 'fr' ? 'Arc deja recompense: les bonus restent actifs.' : 'Arc already rewarded: bonuses remain active.', 'warn');
      return;
    }
    if (!complete) {
      notifyNexus(lang === 'fr' ? 'Arc incomplet: stabilise toutes ses Trames avant de reclamer la cache.' : 'Arc incomplete: stabilize every Thread before claiming the cache.', 'warn');
      return;
    }

    const reward = arc.claimReward || { gold: 300, shards: 60, tokens: 2 };
    const rewardIds = (arc.rewards || []).map(item => item.id).filter(Boolean);
    setGold(prev => prev + reward.gold);
    setBreachShards(prev => prev + reward.shards);
    setEventTokens(prev => prev + reward.tokens);
    setInventory(prev => {
      const next = [...prev, markerId];
      rewardIds.forEach(itemId => {
        if (!next.includes(itemId)) next.push(itemId);
      });
      return next;
    });
    notifyNexus(lang === 'fr' ? 'Cache d arc ouverte: apparences, trace speciale et passif Nexus graves.' : 'Arc cache opened: appearances, special trace, and Nexus passive engraved.', 'success');
    sound.playSfx('levelup');
  };

  const handleFuseRelic = (baseItemId) => {
    if (gold < 150) {
      notifyNexus(lang === 'fr' ? 'Fusion refusee: 150 Or requis pour stabiliser la relique +.' : 'Fusion refused: 150 Gold required to stabilize the relic +.', 'warn');
      return;
    }

    const instancesIndices = [];
    inventory.forEach((invId, idx) => {
      if (invId === baseItemId) {
        instancesIndices.push(idx);
      }
    });

    if (instancesIndices.length < 3) {
      notifyNexus(lang === 'fr' ? 'Fusion impossible: trois exemplaires identiques sont requis.' : 'Fusion impossible: three matching copies required.', 'warn');
      return;
    }

    setGold(prev => prev - 150);

    const indicesToRemove = instancesIndices.slice(0, 3);
    setInventory(prev => {
      const copy = [...prev];
      indicesToRemove.sort((a, b) => b - a).forEach(idx => {
        copy.splice(idx, 1);
      });
      copy.push(`${baseItemId}_plus`);
      return copy;
    });

    sound.playSfx('levelup');
    notifyNexus(lang === 'fr' ? 'Relique fusionnee: version + ajoutee a l inventaire.' : 'Relic fused: + version added to inventory.', 'success');
  };

  const selectedHero = HEROES_DB.find(h => h.id === selectedHeroId) || HEROES_DB[0];
  const selectedHeroStats = getHeroStats(selectedHero);
  const selectedPlaque = getCharacterPlaque(selectedHero);
  const selectedLore = LORE_DB[selectedHero.universe];
  const selectedOriginBase = getUniverseLoreDescription({
    universe: selectedHero.universe,
    lang,
    lore: selectedLore,
    faction: getUniverseFaction(selectedHero.universe),
    cleared: completedStages.includes(UNIVERSE_TO_STAGE_ID[selectedHero.universe]),
    heroCount: HEROES_DB.filter(hero => hero.universe === selectedHero.universe).length,
    enemyCount: ENEMIES_DB[selectedHero.universe]
      ? [
        ...(ENEMIES_DB[selectedHero.universe].monsters || []),
        ...(ENEMIES_DB[selectedHero.universe].bosses || []),
        ENEMIES_DB[selectedHero.universe].worldBoss
      ].filter(Boolean).length
      : 0,
    relicCount: EQUIP_ITEMS_DB.filter(item => item.universe === selectedHero.universe).length,
    stageCount: 1,
    arcCount: CHARACTER_NARRATIVE_ARCS.filter(arc => arc.heroId === selectedHero.id).length
  });
  const selectedOriginCharacterLore = selectedPlaque.dossier?.[lang] || '';
  const selectedOriginLore = lang === 'fr'
    ? `Trame d origine: ${selectedHero.universe}. ${selectedOriginCharacterLore ? `${selectedOriginCharacterLore} ` : ''}${selectedOriginBase} A.R.C.A. conserve cette memoire pour que le heros ne devienne pas une copie vide pendant la Compression de Resonance.`
    : `Origin Thread: ${selectedHero.universe}. ${selectedOriginCharacterLore ? `${selectedOriginCharacterLore} ` : ''}${selectedOriginBase} A.R.C.A. preserves this memory so the hero does not become an empty copy during Resonance Compression.`;
  const breachRoleLore = {
    marine: {
      fr: 'Le Nexus l emploie comme point d ancrage: encaisser le premier choc, tenir la ligne et permettre aux signatures plus fragiles de charger leurs pouvoirs.',
      en: 'The Nexus uses this hero as an anchor: absorb the first impact, hold the line, and let more fragile signatures charge their powers.'
    },
    slayer: {
      fr: 'Son recodage favorise les ruptures courtes et violentes: entrer dans la breche, casser le champion local, puis repartir avant que le decor ne se referme.',
      en: 'The recode favors short violent ruptures: enter the breach, break the local champion, then leave before the scenery closes back in.'
    },
    horror: {
      fr: 'Sa valeur vient de la survie narrative: quand une breche tente d imposer peur, infection ou fatalite, cette signature sait rester debout assez longtemps pour inverser la scene.',
      en: 'The value comes from narrative survival: when a breach tries to impose fear, infection, or fate, this signature stays standing long enough to invert the scene.'
    },
    hacker: {
      fr: 'Le Nexus le branche aux couches instables du code-realite: analyser les regles locales, ralentir les anomalies et transformer une incoherence de lore en avantage tactique.',
      en: 'The Nexus plugs this hero into unstable code-reality layers: read local rules, slow anomalies, and turn lore inconsistency into tactical advantage.'
    },
    tactical: {
      fr: 'Son profil sert de chef de coupe: lire le terrain, prioriser les cibles et faire fonctionner ensemble des heros qui ne devraient jamais partager le meme champ de bataille.',
      en: 'The profile works as field command: read terrain, prioritize targets, and make heroes cooperate when they should never share the same battlefield.'
    }
  };
  const mediaPersonaLore = selectedLore?.mediaType === 'music'
    ? (lang === 'fr'
      ? ' Comme Persona de Resonance, sa presence vient de l impact culturel collectif: le Nexus stabilise un symbole vivant plutot qu un civil tire au hasard.'
      : ' As a Resonance Persona, the presence comes from collective cultural impact: the Nexus stabilizes a living symbol rather than a civilian pulled at random.')
    : '';
  const selectedBreachLore = selectedPlaque.breachLore?.[lang] || (lang === 'fr'
    ? `${selectedHero.name} n a pas ete arrache a sa Trame par hasard. Sa signature a resiste a la Premiere Breche assez longtemps pour qu A.R.C.A. la classe comme operateur ${selectedHero.category}. Dans notre lore, "${selectedHero.special?.name || selectedPlaque.role.fr}" n est pas seulement une competence: c est la maniere dont ce heros impose les lois de son monde d origine dans une breche que le Sans-Auteur tente de rendre muette. ${breachRoleLore[selectedHero.category]?.fr || breachRoleLore.tactical.fr}${mediaPersonaLore}`
    : `${selectedHero.name} was not pulled from the origin Thread by chance. The signature resisted the First Breach long enough for A.R.C.A. to classify it as a ${selectedHero.category} operator. In our lore, "${selectedHero.special?.name || selectedPlaque.role.en}" is not just a skill: it is how this hero forces origin-world laws into a breach the Authorless wants to silence. ${breachRoleLore[selectedHero.category]?.en || breachRoleLore.tactical.en}${mediaPersonaLore}`);
  const getAvailableSkinsForHero = (hero) => {
    const ownedSkinIds = ['default', ...inventory.filter(itemId => SKIN_CATALOG[itemId])];
    return ownedSkinIds
      .map(itemId => SKIN_CATALOG[itemId])
      .filter(Boolean)
      .filter((skin, index, list) => list.findIndex(item => item.id === skin.id) === index)
      .filter(skin => {
        if (skin.id === 'default') return true;
        if (skin.heroId) return skin.heroId === hero.id;
        return true;
      });
  };
  const selectedHeroSkins = getAvailableSkinsForHero(selectedHero);

  const formatBoostText = (boost) => Object.keys(boost || {})
    .map(key => `+${boost[key]} ${key.toUpperCase()}`)
    .join(' / ');

  const getGearDisplay = (gearId) => {
    if (!gearId) return null;
    const isUpgraded = gearId.endsWith('_plus');
    const baseId = isUpgraded ? gearId.replace('_plus', '') : gearId;
    if (isAssetDisabled('gear', baseId)) return null;
    const item = EQUIP_ITEMS_DB.find(it => it.id === baseId);
    if (!item) return null;
    const factor = isUpgraded ? 2 : 1;
    const boost = Object.fromEntries(Object.entries(item.boost || {}).map(([key, value]) => [key, value * factor]));
    return {
      ...item,
      id: gearId,
      isUpgraded,
      boost,
      name: isUpgraded ? { en: `${item.name.en} +`, fr: `${item.name.fr} +` } : item.name
    };
  };

  const getGearLore = (item) => {
    if (!item) return '';
    return getGearLoreDescription({ item, lang, lore: LORE_DB[item.universe] });
  };

  const getEventLore = (item) => {
    if (!item) return '';
    const sourceUniverse = item.universe
      || Object.entries(EVENT_ITEMS_DB).find(([, eventItem]) => eventItem.id === item.id)?.[0]
      || selectedHero.universe;
    return getEventLoreDescription({ item, lang, universe: sourceUniverse, lore: LORE_DB[sourceUniverse] });
  };

  const selectedEquippedGear = getGearDisplay(equippedGear[selectedHero.id]);
  const selectedEquippedEvent = equippedEventItems[selectedHero.id]
    ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[selectedHero.id] && !isAssetDisabled('gear', item.id))
    : null;

  // Filter items in inventory
  const getGearInInventory = () => {
    const list = [];
    inventory.forEach(invId => {
      const isUpgraded = invId.endsWith('_plus');
      const baseId = isUpgraded ? invId.replace('_plus', '') : invId;
      if (isAssetDisabled('gear', baseId)) return;
      const baseItem = EQUIP_ITEMS_DB.find(it => it.id === baseId);
      if (baseItem) {
        list.push({
          ...baseItem,
          id: invId,
          isUpgraded: isUpgraded,
          name: isUpgraded ? {
            en: `${baseItem.name.en} +`,
            fr: `${baseItem.name.fr} +`
          } : baseItem.name
        });
      }
    });
    return list;
  };

  const getEquippedGearName = (gearId) => {
    const item = getGearDisplay(gearId);
    return item ? item.name[lang] : '';
  };

  const getEventItemsInInventory = () => {
    const previewEventIds = new Set(['evt_hl_snarks', 'evt_halo_warthog', 'evt_re_cure']);
    // Keep preview event items bound to active universes only; hidden DLC must not leak into base OC inventory.
    return Object.keys(EVENT_ITEMS_DB)
      .filter(key => isUniverseVisible(key))
      .map(key => ({ ...EVENT_ITEMS_DB[key], universe: key }))
      .filter(it => !isAssetDisabled('gear', it.id))
      .filter(it => inventory.includes(it.id) || previewEventIds.has(it.id));
  };
  const SPECIAL_NEXUS_ITEMS = Object.fromEntries([
    ...FUSION_MISSIONS.map(mission => [
      mission.itemId,
      {
        id: mission.itemId,
        name: mission.item,
        desc: {
          fr: `${mission.item.fr} est une preuve de fusion extraite de ${mission.title.fr}. Elle garde la memoire croisee de ${mission.sourceUniverses?.join(' / ') || 'plusieurs Trames'} et sert de matrice pour apparences, passifs de faction, arcs scelles et futures missions hybrides.`,
          en: `${mission.item.en} is fusion proof extracted from ${mission.title.en}. It preserves crossed memory from ${mission.sourceUniverses?.join(' / ') || 'multiple Threads'} and acts as a matrix for appearances, faction passives, sealed arcs, and future hybrid missions.`
        }
      }
    ]),
    ...Object.entries(ARC_CAMPAIGN_DETAILS).flatMap(([arcId, arc]) => (arc.rewards || []).map(reward => [
      reward.id,
      {
        id: reward.id,
        name: reward.name,
        desc: {
          fr: `${reward.name.fr} est une trace de l arc ${arc.title?.fr || arcId}. Ce n est pas un trophee neutre: c est un marqueur de faction qui prouve que l Ancre a stabilise une portion durable du conflit Nexus.`,
          en: `${reward.name.en} is a trace from the ${arc.title?.en || arcId} arc. It is not a neutral trophy: it is a faction marker proving the Anchor stabilized a lasting part of the Nexus conflict.`
        }
      }
    ])),
    ...CHARACTER_NARRATIVE_ARCS.map(arc => [
      arc.rewardItemId,
      {
        id: arc.rewardItemId,
        name: arc.reward,
        desc: {
          fr: `${arc.reward.fr} vient de ${arc.title.fr}. Cette trace personnelle garde le dilemme propre au personnage et autorise le Nexus a debloquer une apparence, un titre ou un futur passif sans casser son lore.`,
          en: `${arc.reward.en} comes from ${arc.title.en}. This personal trace preserves the character-specific dilemma and lets the Nexus unlock an appearance, title, or future passive without breaking their lore.`
        }
      }
    ])
  ]);
  const getSpecialNexusItemsInInventory = () => inventory
    .map(itemId => SPECIAL_NEXUS_ITEMS[itemId])
    .filter(Boolean);
  const visibleUnlockedHeroes = HEROES_DB.filter(hero => unlockedHeroes.includes(hero.id));
  const inventoryGroups = [
    { id: 'all', label: { fr: 'Tout', en: 'All' }, count: getGearInInventory().length + getEventItemsInInventory().length + getSpecialNexusItemsInInventory().length },
    { id: 'gear', label: { fr: 'Reliques', en: 'Relics' }, count: getGearInInventory().length },
    { id: 'event', label: { fr: 'Evenements', en: 'Events' }, count: getEventItemsInInventory().length },
    { id: 'nexus', label: { fr: 'Nexus/apparences', en: 'Nexus/appearances' }, count: getSpecialNexusItemsInInventory().length }
  ];
  const visibleGearItems = inventoryFilter === 'all' || inventoryFilter === 'gear' ? getGearInInventory() : [];
  const visibleEventItems = inventoryFilter === 'all' || inventoryFilter === 'event' ? getEventItemsInInventory() : [];
  const visibleNexusItems = inventoryFilter === 'all' || inventoryFilter === 'nexus' ? getSpecialNexusItemsInInventory() : [];
  const generateShareCode = () => {
    const seed = `${playerProfile?.name || 'ANCHOR'}-${unlockedHeroes.length}-${completedStages.length}-${Date.now()}`
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '')
      .slice(0, 8);
    return `MB-${seed.padEnd(8, 'X')}-${String(unlockedHeroes.length).padStart(3, '0')}`;
  };
  const collectionSummary = {
    heroes: visibleUnlockedHeroes.length,
    totalHeroes: HEROES_DB.length,
    worlds: new Set(visibleUnlockedHeroes.map(hero => hero.universe)).size,
    arcs: CHARACTER_NARRATIVE_ARCS.filter(arc => {
      const hero = ALL_HEROES_DB.find(item => item.id === arc.heroId);
      return hero && isUniverseVisible(hero.universe) && inventory.includes(arc.rewardItemId);
    }).length,
    skins: Object.keys(heroSkins || {}).filter(heroId => heroSkins[heroId]).length
  };

  const getStageRequiredClears = (stage) => {
    if (stage.characterArc) return stage.characterArc.unlock?.type === 'clears' ? stage.characterArc.unlock.value : 0;
    if (stage.trioArc) return stage.trioArc.unlock?.type === 'clears' ? stage.trioArc.unlock.value : 0;
    if (stage.universeArc) return stage.unlockClears || 4;
    if (stage.fusionMission) return stage.unlockClears || 8;
    if (stage.id === 38) return FINAL_STAGE_REQUIRED_CLEARS;
    if (stage.difficulty === 'Medium') return 2;
    if (stage.difficulty === 'Hard') return 6;
    if (stage.difficulty === 'Very Hard') return 12;
    if (stage.difficulty === 'Expert') return 16;
    return 0;
  };
  const getFusionSourceClears = (stage) => (stage.sourceUniverses || [])
    .map(universe => UNIVERSE_TO_STAGE_ID[universe])
      .filter(Boolean)
      .filter(stageId => completedStages.includes(stageId)).length;
  const getHeroLevelValue = (heroId) => heroLevels[heroId] || 1;
  const getPersonalArcLevelRequirement = (arc) => Math.max(
    ARC_UNLOCK_RULES.personalMinLevel,
    arc?.unlock?.type === 'level' ? arc.unlock.value : 0
  );
  const getUniverseArcRosterStatus = (stage) => {
    const universes = stage.sourceUniverses?.length ? stage.sourceUniverses : [stage.universe];
    const candidates = universes.map(universe => {
      const universeHeroes = HEROES_DB.filter(hero => hero.universe === universe);
      const requiredCount = Math.min(ARC_UNLOCK_RULES.universeMinHeroes, Math.max(1, universeHeroes.length));
      const readyHeroes = universeHeroes.filter(hero => unlockedHeroes.includes(hero.id) && getHeroLevelValue(hero.id) >= ARC_UNLOCK_RULES.universeMinLevel);
      return {
        universe,
        requiredCount,
        readyCount: readyHeroes.length,
        totalCount: universeHeroes.length,
        ready: readyHeroes.length >= requiredCount
      };
    });
    const readyCandidate = candidates.find(candidate => candidate.ready);
    return readyCandidate || candidates.sort((a, b) => b.readyCount - a.readyCount)[0] || {
      universe: stage.universe,
      requiredCount: ARC_UNLOCK_RULES.universeMinHeroes,
      readyCount: 0,
      totalCount: 0,
      ready: false
    };
  };
  const getTrioArcRosterStatus = (stage) => {
    const heroIds = stage.trioArc?.heroIds || [];
    const readyHeroIds = heroIds.filter(heroId => unlockedHeroes.includes(heroId) && getHeroLevelValue(heroId) >= ARC_UNLOCK_RULES.trioMinLevel);
    return {
      requiredCount: heroIds.length,
      readyCount: readyHeroIds.length,
      ready: heroIds.length > 0 && readyHeroIds.length === heroIds.length
    };
  };
  const getStageForNarrativeArc = (arc) => (
    ADMIN_VISIBLE_STAGES.find(stage => stage.universeArc?.id === arc?.id || stage.characterArc?.id === arc?.id || stage.trioArc?.id === arc?.id)
  );
  const getArcUnlockRequirementText = (stage) => {
    const clearRequirement = getStageRequiredClears(stage);
    const clearText = clearRequirement > 0
      ? (lang === 'fr'
        ? `Progression Nexus: ${Math.min(completedStages.length, clearRequirement)}/${clearRequirement} breches stabilisees.`
        : `Nexus progress: ${Math.min(completedStages.length, clearRequirement)}/${clearRequirement} breaches stabilized.`)
      : null;

    if (stage.characterArc) {
      const hero = HEROES_DB.find(item => item.id === stage.characterArc.heroId);
      const requiredLevel = getPersonalArcLevelRequirement(stage.characterArc);
      const owned = hero ? unlockedHeroes.includes(hero.id) : false;
      const currentLevel = hero ? getHeroLevelValue(hero.id) : 0;
      const rosterText = lang === 'fr'
        ? `Condition personnelle: ${hero?.name || stage.characterArc.heroId} ${owned ? 'possede' : 'manquant'}, niveau ${currentLevel}/${requiredLevel}.`
        : `Personal condition: ${hero?.name || stage.characterArc.heroId} ${owned ? 'owned' : 'missing'}, level ${currentLevel}/${requiredLevel}.`;
      return [rosterText, clearText].filter(Boolean).join(' ');
    }

    if (stage.universeArc) {
      const roster = getUniverseArcRosterStatus(stage);
      const sourceNeed = Math.min(2, stage.sourceUniverses?.length || 1);
      const sourceText = lang === 'fr'
        ? `Sources stabilisees: ${getFusionSourceClears(stage)}/${sourceNeed}.`
        : `Stabilized sources: ${getFusionSourceClears(stage)}/${sourceNeed}.`;
      const rosterText = lang === 'fr'
        ? `Condition univers: ${roster.readyCount}/${roster.requiredCount} heros ${roster.universe} niveau ${ARC_UNLOCK_RULES.universeMinLevel}+ possedes.`
        : `Universe condition: ${roster.readyCount}/${roster.requiredCount} ${roster.universe} heroes level ${ARC_UNLOCK_RULES.universeMinLevel}+ owned.`;
      return [rosterText, sourceText, clearText].filter(Boolean).join(' ');
    }

    if (stage.trioArc) {
      const roster = getTrioArcRosterStatus(stage);
      const rosterText = lang === 'fr'
        ? `Condition trio: ${roster.readyCount}/${roster.requiredCount} membres possedes niveau ${ARC_UNLOCK_RULES.trioMinLevel}+.`
        : `Trio condition: ${roster.readyCount}/${roster.requiredCount} members owned at level ${ARC_UNLOCK_RULES.trioMinLevel}+.`;
      return [rosterText, clearText].filter(Boolean).join(' ');
    }

    return clearText || '';
  };
  const isStageUnlocked = (stage) => {
    const baseUnlocked = completedStages.length >= getStageRequiredClears(stage);
    if (!baseUnlocked) return false;
    if (stage.characterArc) {
      const arc = stage.characterArc;
      const hero = HEROES_DB.find(item => item.id === arc.heroId);
      if (!hero || !unlockedHeroes.includes(hero.id)) return false;
      return getHeroLevelValue(hero.id) >= getPersonalArcLevelRequirement(arc);
    }
    if (stage.trioArc) {
      return getTrioArcRosterStatus(stage).ready;
    }
    if (stage.universeArc) {
      return getFusionSourceClears(stage) >= Math.min(2, stage.sourceUniverses?.length || 1) && getUniverseArcRosterStatus(stage).ready;
    }
    if (stage.fusionMission) return getFusionSourceClears(stage) >= Math.min(2, stage.sourceUniverses?.length || 1);
    return true;
  };
  const isNarrativeArcAvailable = (arc) => {
    const stage = getStageForNarrativeArc(arc);
    return Boolean(stage && isStageUnlocked(stage));
  };
  const isUniverseArchiveAvailable = (universe) => {
    if (!isUniverseVisible(universe) || !matchesMediaFilter(LORE_DB[universe]?.mediaType)) return false;
    const stageId = UNIVERSE_TO_STAGE_ID[universe];
    if (!stageId) return true;
    const stage = ADMIN_VISIBLE_STAGES.find(entry => entry.id === stageId);
    return Boolean(stage && isStageUnlocked(stage));
  };
  const getBreachBrief = (stage) => {
    if (stage.trioArc) {
      const requirementText = getArcUnlockRequirementText(stage);
      return lang === 'fr'
        ? `${stage.displayName.fr}: ${stage.trioArc.intro.fr} Cellule requise: ${stage.trioArc.heroIds.join(' / ')}. ${requirementText} Trace trio: ${stage.rewardItemName.fr}.`
        : `${stage.displayName.en}: ${stage.trioArc.intro.en} Required cell: ${stage.trioArc.heroIds.join(' / ')}. ${requirementText} Trio trace: ${stage.rewardItemName.en}.`;
    }
    if (stage.universeArc) {
      const requirementText = getArcUnlockRequirementText(stage);
      return lang === 'fr'
        ? `${stage.displayName.fr}: ${stage.universeArc.intro.fr} ${requirementText} Recompense: ${stage.rewardItemName.fr}.`
        : `${stage.displayName.en}: ${stage.universeArc.intro.en} ${requirementText} Reward: ${stage.rewardItemName.en}.`;
    }
    if (stage.characterArc) {
      const requirementText = getArcUnlockRequirementText(stage);
      return lang === 'fr'
        ? `${stage.displayName.fr}: ${stage.characterArc.intro.fr} ${requirementText} Trace personnelle: ${stage.rewardItemName.fr}.`
        : `${stage.displayName.en}: ${stage.characterArc.intro.en} ${requirementText} Personal trace: ${stage.rewardItemName.en}.`;
    }
    if (stage.fusionMission) {
      return lang === 'fr'
        ? `${stage.displayName.fr}: ${stage.fusionMission.decor.fr} Sources stabilisees ${getFusionSourceClears(stage)}/${stage.sourceUniverses.length}. Trace speciale: ${stage.rewardItemName.fr}.`
        : `${stage.displayName.en}: ${stage.fusionMission.decor.en} Stabilized sources ${getFusionSourceClears(stage)}/${stage.sourceUniverses.length}. Special trace: ${stage.rewardItemName.en}.`;
    }
    const modeText = stage.mode === 'RPG'
      ? (lang === 'fr' ? 'assaut en profondeur' : 'deep strike')
      : stage.mode === 'Tactics'
        ? (lang === 'fr' ? 'contrôle tactique du terrain' : 'tactical field control')
        : (lang === 'fr' ? 'combat de plateforme rapide' : 'fast platform combat');
    return lang === 'fr'
      ? `Faille ${stage.universe}: ${modeText}. Neutralise ${stage.bossName} et stabilise les coordonnées.`
      : `${stage.universe} breach: ${modeText}. Neutralize ${stage.bossName} and stabilize the coordinates.`;
  };

  const getStageModifier = (stage) => {
    if (UNIVERSE_MODIFIERS[stage.universe]) return UNIVERSE_MODIFIERS[stage.universe];
    const index = Math.abs(Math.floor((stage.id * 17 + missionSeed) % BREACH_MODIFIERS.length));
    return BREACH_MODIFIERS[index];
  };

  const getRichBreachBrief = (stage) => {
    if (stage.trioArc || stage.universeArc) return getBreachBrief(stage);
    return getStageLoreDescription({
      stage,
      lang,
      lore: LORE_DB[stage.universe],
      modifier: getStageModifier(stage),
      sourceClears: getFusionSourceClears(stage),
      sourceTotal: stage.sourceUniverses?.length || 0,
      bossIntel: getBossIntel(stage)
    });
  };

  const getStageArc = (stage) => NARRATIVE_ARCS.find(arc => arc.universes.includes(stage.universe));

  const getLootRarity = (stage) => {
    const score = completedStages.length + getStageRequiredClears(stage) + (stage.id === 38 ? 12 : 0);
    return [...LOOT_RARITIES].reverse().find(rarity => score >= rarity.threshold) || LOOT_RARITIES[0];
  };

  const getStageTokenPrize = (stage) => {
    if (stage.id === 38) return 20;
    if (stage.isSurvival) return 3;
    return stage.id % 2 === 0 ? 5 : 0;
  };

  const getStageRewardPreview = (stage) => {
    const modifier = getStageModifier(stage);
    const rarity = getLootRarity(stage);
    const rewardFactor = modifier.reward || 1;
    const goldPrize = Math.round(stage.goldPrize * rewardFactor);
    const shardPrize = Math.round(stage.shardPrize * rewardFactor);
    const tokenPrize = getStageTokenPrize(stage);
    return [
      lang === 'fr' ? `+${goldPrize} Or` : `+${goldPrize} Gold`,
      lang === 'fr' ? `+${shardPrize} Fragments` : `+${shardPrize} Shards`,
      tokenPrize > 0 ? (lang === 'fr' ? `+${tokenPrize} Jetons` : `+${tokenPrize} Tokens`) : null,
      stage.rewardItemName ? (lang === 'fr'
        ? `Trace speciale: ${stage.rewardItemName.fr || stage.rewardItemName.en}`
        : `Special trace: ${stage.rewardItemName.en || stage.rewardItemName.fr}`) : null,
      lang === 'fr' ? `Signature ${rarity.label}` : `${rarity.label} signature`
    ].filter(Boolean);
  };

  const getStageStatus = (stage) => {
    if (completedStages.includes(stage.id)) {
      return {
        id: 'sealed',
        label: lang === 'fr' ? 'Scellee' : 'Sealed',
        short: lang === 'fr' ? 'SCELLEE' : 'SEALED'
      };
    }
    if (!isStageUnlocked(stage)) {
      return {
        id: 'locked',
        label: lang === 'fr' ? 'Verrouillee' : 'Locked',
        short: lang === 'fr' ? 'BLOQUEE' : 'LOCKED'
      };
    }
    const required = getStageRequiredClears(stage);
    return {
      id: required > 0 ? 'available' : 'new',
      label: required > 0
        ? (lang === 'fr' ? 'Disponible' : 'Available')
        : (lang === 'fr' ? 'Nouveau signal' : 'New signal'),
      short: required > 0
        ? (lang === 'fr' ? 'OUVERTE' : 'OPEN')
        : (lang === 'fr' ? 'SIGNAL' : 'SIGNAL')
    };
  };

  const getMissionLaunchBrief = (stage) => {
    const modifier = getStageModifier(stage);
    const source = stage.sourceUniverses?.join(' / ') || stage.universe;
    const modeText = stage.mode === 'RPG'
      ? (lang === 'fr' ? 'progression RPG en profondeur' : 'deep RPG progression')
      : stage.mode === 'Tactics'
        ? (lang === 'fr' ? 'lecture tactique du terrain' : 'tactical field reading')
        : (lang === 'fr' ? 'duel d impact rapide' : 'fast impact duel');
    return [
      lang === 'fr'
        ? `A.R.C.A. ouvre une fenetre ${stage.mode} sur ${source}: ${modeText}.`
        : `A.R.C.A. opens a ${stage.mode} window on ${source}: ${modeText}.`,
      lang === 'fr'
        ? `Objectif lore: neutraliser ${stage.bossName} sans laisser le Sans-Auteur effacer la scene d origine.`
        : `Lore objective: neutralize ${stage.bossName} before the Authorless erases the origin scene.`,
      lang === 'fr'
        ? `Anomalie active: ${modifier.name[lang]} modifie les regles de terrain.`
        : `Active anomaly: ${modifier.name[lang]} alters the field rules.`
    ];
  };

  const getMissionOutcomePreview = (stage) => {
    const traceName = stage.rewardItemName?.[lang] || stage.rewardItemName?.en || null;
    return [
      lang === 'fr'
        ? 'Victoire: la coordonnee est scellee, le journal A.R.C.A. archive la consequence et la progression long terme avance.'
        : 'Victory: the coordinate is sealed, the A.R.C.A. journal records the consequence, and long-term progression advances.',
      traceName
        ? (lang === 'fr' ? `Trace possible: ${traceName}.` : `Possible trace: ${traceName}.`)
        : (lang === 'fr' ? 'Trace possible: relique de terrain liee a l univers actif.' : 'Possible trace: field relic tied to the active universe.'),
      lang === 'fr'
        ? 'Defaite: donnees de contact conservees, adaptation defensive sur la prochaine tentative et instabilite douce de l equipe.'
        : 'Defeat: contact data is kept, defensive adaptation applies to the next attempt, and the team suffers soft instability.'
    ];
  };

  const getStageRewardScore = (stage) => {
    const modifier = getStageModifier(stage);
    const rewardFactor = modifier.reward || 1;
    return Math.round(stage.goldPrize * rewardFactor)
      + (Math.round(stage.shardPrize * rewardFactor) * 2)
      + (getStageTokenPrize(stage) * 55)
      + (stage.rewardItemId ? 120 : 0)
      + (completedStages.includes(stage.id) ? -80 : 0);
  };

  const prepareStage = (stage) => {
    const modifier = getStageModifier(stage);
    const rarity = getLootRarity(stage);
    const rewardFactor = modifier.reward || 1;
    const arcaAdaptation = activityProgress.defeatIntel?.[stage.id] || null;
    return {
      ...stage,
      modifier,
      lootRarity: rarity,
      arcaAdaptation,
      heroInstability: activityProgress.heroInstability || {},
      goldPrize: Math.round(stage.goldPrize * rewardFactor),
      shardPrize: Math.round(stage.shardPrize * rewardFactor),
      tokenPrize: getStageTokenPrize(stage),
      launchBrief: getMissionLaunchBrief(stage),
      outcomePreview: getMissionOutcomePreview(stage)
    };
  };

  const launchStage = (stage) => {
    if (!isStageUnlocked(stage)) {
      notifyNexus(getLockedReason(stage), 'warn');
      sound.playSfx('click');
      return;
    }
    onLaunchStage(prepareStage(stage));
  };

  const launchSurvival = () => {
    const base = missionDeck.find(stage => isStageUnlocked(stage)) || nextUnclearedStage || STAGES[0];
    const preparedBase = prepareStage(base);
    onLaunchStage({
      ...preparedBase,
      id: 9000 + base.id,
      name: lang === 'fr' ? `Survie de brèche: ${base.universe}` : `Breach Survival: ${base.universe}`,
      difficulty: 'Survival',
      isSurvival: true,
      goldPrize: Math.round(preparedBase.goldPrize * 1.4),
      shardPrize: Math.round(preparedBase.shardPrize * 1.35),
      tokenPrize: 3
    });
  };

  const selectedBriefingStage = briefingStageId
    ? ADMIN_VISIBLE_STAGES.find(stage => stage.id === briefingStageId)
    : null;

  const todayIndex = Math.floor(Date.now() / 86400000);
  const todayKey = new Date().toISOString().slice(0, 10);
  const startOfYear = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));
  const currentWeekNumber = Math.ceil((((new Date() - startOfYear) / 86400000) + startOfYear.getUTCDay() + 1) / 7);
  const currentWeekKey = `${new Date().getUTCFullYear()}-W${currentWeekNumber}`;
  const claimedDaily = activityProgress.dayKey === todayKey ? (activityProgress.claimedDaily || []) : [];
  const claimedWeekly = activityProgress.weekKey === currentWeekKey ? (activityProgress.claimedWeekly || []) : [];
  const claimedMilestones = activityProgress.claimedMilestones || [];
  const dailyContracts = DAILY_CONTRACTS
    .map((contract, idx) => DAILY_CONTRACTS[(todayIndex + idx) % DAILY_CONTRACTS.length])
    .slice(0, 3);
  const todayItemActivations = activityProgress.dayKey === todayKey ? (activityProgress.itemActivations || 0) : 0;
  const dailyModeWins = activityProgress.dayKey === todayKey ? (activityProgress.dailyModeWins || {}) : {};
  const weeklyWins = activityProgress.weekKey === currentWeekKey ? (activityProgress.weeklyWins || 0) : 0;
  const weeklyItemActivations = activityProgress.weekKey === currentWeekKey ? (activityProgress.weeklyItemActivations || 0) : 0;
  const isDailyContractDone = (contract) => {
    if (contract.mode === 'items') return todayItemActivations >= 3;
    if (contract.mode === 'any') return (dailyModeWins.any || 0) > 0;
    return (dailyModeWins[contract.mode] || 0) > 0;
  };
  const claimDailyContract = (contract) => {
    if (!setActivityProgress || !isDailyContractDone(contract) || claimedDaily.includes(contract.id)) return;
    setGold(prev => prev + 35);
    setBreachShards(prev => prev + 12);
    setActivityProgress(prev => ({
      ...prev,
      dayKey: todayKey,
      claimedDaily: [...(prev.dayKey === todayKey ? (prev.claimedDaily || []) : []), contract.id]
    }));
    notifyNexus(lang === 'fr' ? 'Contrat quotidien reclame: cache de terrain ajoutee.' : 'Daily contract claimed: field cache added.', 'success');
    sound.playSfx('levelup');
  };

  const activeFactionSynergies = FACTION_RULES.map(rule => {
    const count = activeTeam
      .map(id => HEROES_DB.find(hero => hero.id === id))
      .filter(hero => hero && !isAssetDisabled('heroes', hero.id))
      .map(hero => hero.universe)
      .filter(universe => rule.universes.includes(universe)).length;
    return { ...rule, count, active: count >= 2 };
  });

  const deployedHeroes = activeTeam
    .map(id => HEROES_DB.find(hero => hero.id === id))
    .filter(Boolean);
  const deployedStats = deployedHeroes.reduce((acc, hero) => {
    const stats = getHeroStats(hero);
    acc.hp += stats.hp;
    acc.atk += stats.atk;
    acc.def += stats.def;
    acc.spd += stats.spd;
    return acc;
  }, { hp: 0, atk: 0, def: 0, spd: 0 });
  const deployedCategories = deployedHeroes.reduce((acc, hero) => {
    acc[hero.category] = (acc[hero.category] || 0) + 1;
    return acc;
  }, {});
  const deployedSynergies = SYNERGIES_DB.filter(syn => (deployedCategories[syn.category] || 0) >= 2);
  const deployedFactionSynergies = activeFactionSynergies.filter(rule => rule.active);
  const equippedRelicCount = deployedHeroes.filter(hero => equippedGear[hero.id]).length;
  const equippedEventCount = deployedHeroes.filter(hero => equippedEventItems[hero.id]).length;
  const averageTeamLevel = deployedHeroes.length
    ? deployedHeroes.reduce((sum, hero) => sum + (heroLevels[hero.id] || 1), 0) / deployedHeroes.length
    : 0;
  const squadReadiness = Math.min(100, Math.round(
    (deployedHeroes.length / 3) * 38
    + Math.min(22, averageTeamLevel * 4)
    + deployedSynergies.length * 12
    + deployedFactionSynergies.length * 8
    + equippedRelicCount * 5
    + equippedEventCount * 3
  ));
  const squadGrade = squadReadiness >= 85 ? 'S'
    : squadReadiness >= 70 ? 'A'
      : squadReadiness >= 50 ? 'B'
        : 'C';
  const squadFocus = deployedStats.atk >= deployedStats.def && deployedStats.atk >= deployedStats.spd
    ? (lang === 'fr' ? 'Assaut direct' : 'Direct assault')
    : deployedStats.def >= deployedStats.spd
      ? (lang === 'fr' ? 'Ligne defensive' : 'Defensive line')
      : (lang === 'fr' ? 'Tempo rapide' : 'Fast tempo');
  const squadWarnings = [
    deployedHeroes.length < 3 && (lang === 'fr' ? 'Slot libre: ajoute un troisieme heros pour securiser les modes longs.' : 'Open slot: add a third hero to secure longer modes.'),
    deployedSynergies.length === 0 && (lang === 'fr' ? 'Aucune synergie archetype: double une categorie pour activer un bonus fort.' : 'No archetype synergy: double a category to activate a strong bonus.'),
    equippedRelicCount < deployedHeroes.length && (lang === 'fr' ? 'Relique manquante: auto-equipe pour convertir l inventaire en puissance directe.' : 'Missing relic: auto-equip to turn inventory into direct power.'),
    equippedEventCount === 0 && (lang === 'fr' ? 'Aucun objet evenementiel arme: les combats boss seront moins explosifs.' : 'No event item armed: boss fights will be less explosive.')
  ].filter(Boolean);
  const categoryLabels = {
    marine: { fr: 'Tank / front', en: 'Tank / front' },
    slayer: { fr: 'Burst degats', en: 'Burst damage' },
    horror: { fr: 'Survie / esquive', en: 'Survival / dodge' },
    hacker: { fr: 'Controle ATB', en: 'ATB control' },
    tactical: { fr: 'Defense / soutien', en: 'Defense / support' }
  };

  const currentChapter = [...STORY_CHAPTERS]
    .reverse()
    .find(chapter => completedStages.length >= chapter.unlockClears) || STORY_CHAPTERS[0];
  const nextChapter = STORY_CHAPTERS.find(chapter => completedStages.length < chapter.unlockClears);
  const getStoryChapterForStage = (stage) => {
    if (stage.id === 38) return STORY_CHAPTERS[STORY_CHAPTERS.length - 1];
    const requiredClears = getStageRequiredClears(stage);
    return [...STORY_CHAPTERS]
      .reverse()
      .find(chapter => requiredClears >= chapter.unlockClears) || STORY_CHAPTERS[0];
  };
  const isMainStoryStage = (stage) => (
    stage.id !== 38
    && !stage.characterArc
    && !stage.trioArc
    && !stage.universeArc
    && !stage.fusionMission
  );
  const isCurrentStoryChapterStage = (stage) => (
    isMainStoryStage(stage)
    && getStoryChapterForStage(stage).id === currentChapter.id
  );
  const getChapterStageCount = (chapter) => visibleStages.filter(stage => (
    isMainStoryStage(stage)
    && getStoryChapterForStage(stage).id === chapter.id
  )).length;
  const matchesMediaFilter = (mediaType) => (
    mediaFilter === 'all'
    || mediaType === mediaFilter
    || (mediaFilter === 'movie' && mediaType === 'series')
  );
  const arcProgress = NARRATIVE_ARCS.map(arc => ({
    ...arc,
    ...(ARC_DETAIL_BY_ID[arc.id] || {}),
    ...(ARC_CAMPAIGN_DETAILS[arc.id] || {}),
    completed: getCompletedUniversesCount(arc.universes),
    total: arc.universes.length
  })).map(arc => ({
    ...arc,
    complete: arc.total > 0 && arc.completed >= arc.total,
    claimed: inventory.includes(getArcMarkerId(arc))
  }));
  const collectionProgress = COLLECTION_REWARDS.map(collection => {
    const activeUniverses = collection.universes.filter(universe => (
      LORE_DB[universe]
      && isUniverseVisible(universe)
      && matchesMediaFilter(LORE_DB[universe]?.mediaType)
    ));
    const enabledUniverses = collection.universes.filter(universe => LORE_DB[universe] && isUniverseVisible(universe));
    const activeCompleted = getCompletedUniversesCount(activeUniverses);
    const enabledCompleted = getCompletedUniversesCount(enabledUniverses);
    const hiddenCount = collection.universes.length - enabledUniverses.length;
    const missingLore = collection.universes.filter(universe => !LORE_DB[universe]);
    const allCollectionUniversesVisible = hiddenCount === 0 && missingLore.length === 0;
    const complete = allCollectionUniversesVisible
      && enabledUniverses.length > 0
      && enabledCompleted >= enabledUniverses.length;
    return {
      ...collection,
      activeUniverses,
      enabledUniverses,
      hiddenCount,
      missingLore,
      completed: activeCompleted,
      total: activeUniverses.length,
      fullCompleted: enabledCompleted,
      fullTotal: enabledUniverses.length,
      complete,
      claimed: inventory.includes(getCollectionMarkerId(collection))
    };
  });
  const visibleCollectionProgress = collectionProgress.filter(collection => collection.total > 0);
  const selectedUniverseArchive = selectedCollectionUniverse ? (() => {
    const universe = selectedCollectionUniverse;
    const lore = LORE_DB[universe];
    const stageId = UNIVERSE_TO_STAGE_ID[universe];
    const stages = ADMIN_VISIBLE_STAGES
      .filter(stage => stage.universe === universe || stage.sourceUniverses?.includes(universe))
      .filter(stage => !stage.characterArc && !stage.trioArc && !stage.universeArc && !stage.fusionMission)
      .filter(isStageUnlocked);
    const heroes = HEROES_DB.filter(hero => hero.universe === universe);
    const allEnemies = ENEMIES_DB[universe]
      ? [
        ...(ENEMIES_DB[universe].monsters || []),
        ...(ENEMIES_DB[universe].bosses || []),
        ENEMIES_DB[universe].worldBoss
      ].filter(Boolean)
        .filter(enemy => !isAssetDisabled('enemies', getEnemyAdminKey(universe, enemy)))
      : [];
    const relics = EQUIP_ITEMS_DB.filter(item => item.universe === universe && !isAssetDisabled('gear', item.id));
    const eventItem = EVENT_ITEMS_DB[universe] && !isAssetDisabled('gear', EVENT_ITEMS_DB[universe].id)
      ? EVENT_ITEMS_DB[universe]
      : null;
    const battleItems = getBattleItemsForUniverse(universe).filter(item => !isAssetDisabled('gear', item.id));
    const universeArcs = UNIVERSE_NARRATIVE_ARCS
      .filter(arc => arc.universes.includes(universe))
      .filter(isNarrativeArcAvailable);
    const characterArcs = CHARACTER_NARRATIVE_ARCS.filter(arc => {
      const hero = ALL_HEROES_DB.find(item => item.id === arc.heroId);
      return hero?.universe === universe && isNarrativeArcAvailable(arc);
    });
    const franchiseCollections = visibleCollectionProgress.filter(collection => collection.enabledUniverses.includes(universe));
    const faction = getUniverseFaction(universe);
    const arcCount = universeArcs.length + characterArcs.length + franchiseCollections.length;
    return {
      universe,
      lore,
      faction,
      loreBrief: getUniverseLoreDescription({
        universe,
        lang,
        lore,
        faction,
        cleared: !stageId || completedStages.includes(stageId),
        heroCount: heroes.length,
        enemyCount: allEnemies.length,
        relicCount: relics.length + (eventItem ? 1 : 0) + battleItems.length,
        stageCount: stages.length,
        arcCount
      }),
      stageId,
      cleared: !stageId || completedStages.includes(stageId),
      hidden: hiddenUniverseSet.has(universe),
      heroes,
      allEnemies,
      relics,
      eventItem,
      battleItems,
      stages,
      universeArcs,
      characterArcs,
      franchiseCollections
    };
  })() : null;
  const timelineProgress = BREACH_TIMELINE.map(entry => ({
    ...entry,
    active: completedStages.length >= entry.unlockClears
  }));

  const totalHeroLevels = unlockedHeroes.reduce((sum, heroId) => sum + (heroLevels[heroId] || 1), 0);
  const metaRank = completedStages.length >= META_RANK_THRESHOLDS.omega
    ? 'Omega'
    : completedStages.length >= META_RANK_THRESHOLDS.veteran
      ? 'Veteran'
      : completedStages.length >= META_RANK_THRESHOLDS.strike
        ? 'Strike'
        : 'Initiate';
  const nextProgressGoal = completedStages.length < 2
    ? (lang === 'fr' ? 'Stabiliser 2 brèches pour ouvrir le palier Medium.' : 'Stabilize 2 breaches to open Medium tier.')
    : completedStages.length < 6
      ? (lang === 'fr' ? 'Atteindre 6 brèches pour débloquer le palier Hard.' : 'Reach 6 breaches to unlock Hard tier.')
      : completedStages.length < 12
        ? (lang === 'fr' ? 'Construire une équipe niveau 4+ avant le palier Very Hard.' : 'Build a level 4+ squad before Very Hard tier.')
        : completedStages.length < 16
          ? (lang === 'fr' ? 'Ouvrir le palier Expert et renforcer les reliques.' : 'Open the Expert tier and reinforce relics.')
          : completedStages.length < FINAL_STAGE_REQUIRED_CLEARS
            ? (lang === 'fr' ? `Stabiliser ${FINAL_STAGE_REQUIRED_CLEARS} brèches pour ouvrir le noyau final.` : `Stabilize ${FINAL_STAGE_REQUIRED_CLEARS} breaches to open the final core.`)
            : (lang === 'fr' ? 'Noyau final disponible: optimiser les builds et le codex.' : 'Final core available: optimize builds and codex.');

  const weeklyOperations = [
    {
      id: 'stabilize_5',
      title: { fr: 'Cycle hebdomadaire: 5 breches', en: 'Weekly cycle: 5 breaches' },
      done: weeklyWins >= 5,
      progress: weeklyWins,
      target: 5,
      reward: { gold: 180, shards: 70, tokens: 4 }
    },
    {
      id: 'collection_1',
      title: { fr: 'Cycle hebdomadaire: cache de collection', en: 'Weekly cycle: collection cache' },
      done: visibleCollectionProgress.some(collection => collection.claimed),
      progress: visibleCollectionProgress.filter(collection => collection.claimed).length,
      target: 1,
      reward: { gold: 120, shards: 45, tokens: 3 }
    },
    {
      id: 'squad_grade_a',
      title: { fr: 'Cycle hebdomadaire: cellule rang A', en: 'Weekly cycle: A-rank cell' },
      done: squadReadiness >= 70,
      progress: squadReadiness,
      target: 70,
      reward: { gold: 150, shards: 55, tokens: 3 }
    },
    {
      id: 'artifact_mastery',
      title: { fr: 'Cycle hebdomadaire: maitrise des artefacts', en: 'Weekly cycle: artifact mastery' },
      done: weeklyItemActivations >= 12,
      progress: weeklyItemActivations,
      target: 12,
      reward: { gold: 120, shards: 50, tokens: 4 }
    }
  ];
  const claimWeeklyOperation = (operation) => {
    if (!setActivityProgress || !operation.done || claimedWeekly.includes(operation.id)) return;
    setGold(prev => prev + operation.reward.gold);
    setBreachShards(prev => prev + operation.reward.shards);
    setEventTokens(prev => prev + operation.reward.tokens);
    setActivityProgress(prev => ({
      ...prev,
      weekKey: currentWeekKey,
      claimedWeekly: [...(prev.weekKey === currentWeekKey ? (prev.claimedWeekly || []) : []), operation.id]
    }));
    notifyNexus(lang === 'fr' ? 'Cycle hebdomadaire synchronise dans les archives.' : 'Weekly cycle synchronized into the archives.', 'success');
    sound.playSfx('levelup');
  };
  const seasonXp = activityProgress.seasonXp || 0;
  const seasonLevel = Math.max(1, Math.floor(seasonXp / 250) + 1);
  const seasonXpIntoLevel = seasonXp % 250;
  const seasonRewardBonus = Math.min(18, Math.floor(seasonXp / 500) * 2);
  const longTermMilestones = [
    {
      id: 'anchor_5_wins',
      title: { fr: 'Jalon: Ancre operationnelle', en: 'Milestone: Operational Anchor' },
      progress: activityProgress.lifetimeWins || 0,
      target: 5,
      reward: { gold: 120, shards: 35, tokens: 1 },
      lore: { fr: 'A.R.C.A. confirme que ton profil peut tenir une boucle de combat reguliere.', en: 'A.R.C.A. confirms your profile can hold a regular combat loop.' }
    },
    {
      id: 'anchor_20_wins',
      title: { fr: 'Jalon: Stabilisateur veteran', en: 'Milestone: Veteran Stabilizer' },
      progress: activityProgress.lifetimeWins || 0,
      target: 20,
      reward: { gold: 260, shards: 85, tokens: 3 },
      lore: { fr: 'Les archives cessent de te traiter comme un survivant et commencent a te traiter comme un commandant.', en: 'The archives stop treating you as a survivor and start treating you as a commander.' }
    },
    {
      id: 'anchor_50_wins',
      title: { fr: 'Jalon: Gardien du Voile', en: 'Milestone: Veil Guardian' },
      progress: activityProgress.lifetimeWins || 0,
      target: 50,
      reward: { gold: 600, shards: 180, tokens: 6 },
      lore: { fr: 'La defense du Nexus devient une campagne longue, pas une suite de failles isolees.', en: 'Nexus defense becomes a long campaign, not a chain of isolated rifts.' }
    },
    {
      id: 'anchor_12_week_items',
      title: { fr: 'Jalon: Logisticien de terrain', en: 'Milestone: Field Logistician' },
      progress: weeklyItemActivations,
      target: 12,
      reward: { gold: 160, shards: 60, tokens: 3 },
      lore: { fr: 'Les artefacts ramasses deviennent une vraie economie de combat.', en: 'Field artifacts become a real combat economy.' }
    },
    {
      id: 'anchor_7_streak',
      title: { fr: 'Jalon: Signal continu 7 jours', en: 'Milestone: 7-day Continuous Signal' },
      progress: activityProgress.loginStreak || 0,
      target: 7,
      reward: { gold: 300, shards: 120, tokens: 5 },
      lore: { fr: 'Le Nexus reconnait ta presence comme une ancre stable sur la duree.', en: 'The Nexus recognizes your presence as a stable long-term anchor.' }
    }
  ];
  const claimLongTermMilestone = (milestone) => {
    if (!setActivityProgress || milestone.progress < milestone.target || claimedMilestones.includes(milestone.id)) return;
    setGold(prev => prev + milestone.reward.gold);
    setBreachShards(prev => prev + milestone.reward.shards);
    setEventTokens(prev => prev + milestone.reward.tokens);
    setActivityProgress(prev => ({
      ...prev,
      claimedMilestones: [...(prev.claimedMilestones || []), milestone.id]
    }));
    notifyNexus(lang === 'fr' ? 'Jalon de Trame archive: caches transferees.' : 'Thread milestone archived: caches transferred.', 'success');
    sound.playSfx('levelup');
  };

  const getBossIntel = (stage) => {
    if (stage.id === 38) return getFinalGameBoss();
    return ENEMIES_DB[stage.universe]?.worldBoss || ENEMIES_DB[stage.universe]?.bosses?.[0];
  };
  const visibleCollectionUniverses = Object.keys(LORE_DB)
    .filter(isUniverseArchiveAvailable);
  const getMediaTypeLabel = (mediaType) => {
    if (mediaType === 'game') return 'Game';
    if (mediaType === 'movie') return 'Movie';
    if (mediaType === 'series') return lang === 'fr' ? 'Serie' : 'Series';
    if (mediaType === 'music') return lang === 'fr' ? 'Musique' : 'Music';
    return 'Web / Manga';
  };

  const finalStageUnlocked = completedStages.length >= getStageRequiredClears({ id: 38 });
  const visibleStages = ADMIN_VISIBLE_STAGES.filter(stage => {
    if (stage.id === 38) return true;
    if (stage.fusionMission && mediaFilter === 'all') return true;
    return matchesMediaFilter(LORE_DB[stage.universe]?.mediaType);
  });
  const unlockedVisibleStages = visibleStages.filter(stage => stage.id !== 38 && isStageUnlocked(stage));
  const adminDiagnostics = {
    ocHeroes: HEROES_DB.filter(hero => hero.universe === 'Nexus de Convergence').length,
    ocEnemies: [
      ...(ENEMIES_DB['Nexus de Convergence']?.monsters || []),
      ...(ENEMIES_DB['Nexus de Convergence']?.bosses || []),
      ENEMIES_DB['Nexus de Convergence']?.worldBoss
    ].filter(Boolean).filter(enemy => !isAssetDisabled('enemies', getEnemyAdminKey('Nexus de Convergence', enemy))).length,
    ocItems: getBattleItemsForUniverse('Nexus de Convergence').filter(item => !isAssetDisabled('gear', item.id)).length,
    visibleStages: visibleStages.filter(stage => stage.id !== 38).length,
    unlockedStages: unlockedVisibleStages.length,
    lockedStages: visibleStages.filter(stage => stage.id !== 38 && !isStageUnlocked(stage)).length,
    disabledAssets: (disabledAssets.heroes?.length || 0) + (disabledAssets.enemies?.length || 0) + (disabledAssets.gear?.length || 0) + (disabledAssets.stages?.length || 0),
    modes: ['RPG', 'Tactics', 'Smash'].map(mode => ({
      mode,
      visible: visibleStages.filter(stage => stage.mode === mode && stage.id !== 38).length,
      unlocked: unlockedVisibleStages.filter(stage => stage.mode === mode).length
    })),
    dlcVisible: DLC_UNIVERSE_KEYS.filter(universe => !hiddenUniverseSet.has(universe)).length,
    dlcHidden: DLC_UNIVERSE_KEYS.filter(universe => hiddenUniverseSet.has(universe)).length
  };
  useEffect(() => {
    if (selectedCollectionUniverse && !visibleCollectionUniverses.includes(selectedCollectionUniverse)) {
      setSelectedCollectionUniverse(null);
    }
  }, [selectedCollectionUniverse, visibleCollectionUniverses]);
  const adminUniverseRows = ALL_UNIVERSE_KEYS
    .map(universe => {
      const lore = LORE_DB[universe];
      const heroes = ALL_HEROES_DB.filter(hero => hero.universe === universe);
      const enemies = [
        ...(ENEMIES_DB[universe]?.monsters || []).map(enemy => ({ ...enemy, adminType: lang === 'fr' ? 'Monstre' : 'Monster' })),
        ...(ENEMIES_DB[universe]?.bosses || []).map(enemy => ({ ...enemy, adminType: 'Boss' })),
        ...(ENEMIES_DB[universe]?.worldBoss ? [{ ...ENEMIES_DB[universe].worldBoss, adminType: 'World Boss' }] : [])
      ];
      const gear = [
        ...EQUIP_ITEMS_DB.filter(item => item.universe === universe),
        ...(EVENT_ITEMS_DB[universe] ? [{ ...EVENT_ITEMS_DB[universe], universe, isCombatEvent: true }] : []),
        ...EVENT_SHOP_ITEMS.filter(item => item.universe === universe),
        ...getBattleItemsForUniverse(universe).map(item => ({ ...item, isBattleItem: true }))
      ].filter((item, index, list) => list.findIndex(candidate => candidate.id === item.id) === index);
      const stages = STAGES.filter(stage => stage.universe === universe || stage.sourceUniverses?.includes(universe));
      const disabledCount = (
        heroes.filter(hero => isAssetDisabled('heroes', hero.id)).length
        + enemies.filter(enemy => isAssetDisabled('enemies', getEnemyAdminKey(universe, enemy))).length
        + gear.filter(item => isAssetDisabled('gear', item.id)).length
        + stages.filter(stage => isAssetDisabled('stages', getStageAdminKey(stage))).length
      );
      return {
        universe,
        lore,
        baseGame: isBaseGameUniverse(universe),
        hidden: hiddenUniverseSet.has(universe),
        heroes,
        enemies,
        gear,
        stages,
        disabledCount,
        stageCount: stages.length,
        enemyCount: enemies.length,
        gearCount: gear.length
      };
    })
    .filter(row => {
      const query = adminUniverseSearch.trim().toLowerCase();
      if (!query) return true;
      return [
        row.universe,
        row.lore?.title?.fr,
        row.lore?.title?.en,
        row.lore?.mediaType
      ].filter(Boolean).some(value => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (a.baseGame !== b.baseGame) return a.baseGame ? -1 : 1;
      return a.universe.localeCompare(b.universe);
    });
  const hiddenUniverseCount = DLC_UNIVERSE_KEYS.filter(universe => hiddenUniverseSet.has(universe)).length;
  const visibleUniverseCount = DLC_UNIVERSE_KEYS.length - hiddenUniverseCount;
  const setUniverseHidden = (universe, hidden) => {
    if (!setHiddenUniverses || isBaseGameUniverse(universe)) return;
    setHiddenUniverses(prev => {
      const next = new Set(prev);
      if (hidden) next.add(universe);
      else next.delete(universe);
      return Array.from(next).sort();
    });
    sound.playSfx(hidden ? 'click' : 'coin');
  };
  const showAllUniverses = () => {
    setHiddenUniverses?.([]);
    notifyNexus(lang === 'fr' ? 'Tous les univers sont visibles.' : 'All universes are visible.', 'success');
    sound.playSfx('levelup');
  };
  const hideAllDlcUniverses = () => {
    if (!setHiddenUniverses) return;
    setHiddenUniverses(DEFAULT_HIDDEN_UNIVERSES);
    notifyNexus(
      lang === 'fr'
        ? 'Mode jeu de base restaure: seuls les contenus OC du Nexus restent actifs.'
        : 'Base game mode restored: only OC Nexus content remains active.',
      'success'
    );
    sound.playSfx('click');
  };
  const showAllDlcUniverses = () => {
    if (!setHiddenUniverses) return;
    setHiddenUniverses(prev => prev.filter(universe => !DLC_UNIVERSE_KEYS.includes(universe)));
    notifyNexus(lang === 'fr' ? 'Tous les DLC franchise sont actifs.' : 'All franchise DLC universes are active.', 'success');
    sound.playSfx('levelup');
  };
  const hideUniversesByMediaType = (mediaType) => {
    if (!setHiddenUniverses) return;
    const targets = DLC_UNIVERSE_KEYS.filter(universe => LORE_DB[universe]?.mediaType === mediaType);
    setHiddenUniverses(prev => Array.from(new Set([...prev, ...targets])).sort());
    notifyNexus(
      lang === 'fr'
        ? `Univers ${getMediaTypeLabel(mediaType).toLowerCase()} masques.`
        : `${getMediaTypeLabel(mediaType)} universes hidden.`,
      'warn'
    );
    sound.playSfx('click');
  };
  const showUniversesByMediaType = (mediaType) => {
    if (!setHiddenUniverses) return;
    const targets = new Set(DLC_UNIVERSE_KEYS.filter(universe => LORE_DB[universe]?.mediaType === mediaType));
    setHiddenUniverses(prev => prev.filter(universe => !targets.has(universe)));
    notifyNexus(
      lang === 'fr'
        ? `Univers ${getMediaTypeLabel(mediaType).toLowerCase()} reaffiches.`
        : `${getMediaTypeLabel(mediaType)} universes restored.`,
      'success'
    );
    sound.playSfx('coin');
  };
  const getMediaTypeTargets = (mediaType) => DLC_UNIVERSE_KEYS.filter(universe => LORE_DB[universe]?.mediaType === mediaType);
  const getMediaTypeHiddenCount = (mediaType) => getMediaTypeTargets(mediaType).filter(universe => hiddenUniverseSet.has(universe)).length;
  const toggleAdminUniverseOpen = (universe) => {
    setExpandedAdminUniverses(prev => ({ ...prev, [universe]: !prev[universe] }));
    sound.playSfx('click');
  };
  const finalStage = STAGES.find(stage => stage.id === 38);
  const isPersonalArcVisibleForRoster = (stage) => {
    return Boolean(stage.characterArc && isStageUnlocked(stage));
  };
  const isUniverseArcVisibleForRoster = (stage) => {
    return Boolean(stage.universeArc && isStageUnlocked(stage));
  };
  const isTrioArcVisibleForRoster = (stage) => {
    return Boolean(stage.trioArc && isStageUnlocked(stage));
  };
  const missionCategoryFilter = (stage) => {
    if (missionScreen === 'universeArcs') return isUniverseArcVisibleForRoster(stage);
    if (missionScreen === 'personalArcs') return Boolean(stage.characterArc) && isPersonalArcVisibleForRoster(stage);
    if (missionScreen === 'trioArcs') return isTrioArcVisibleForRoster(stage);
    if (missionScreen === 'fusionMissions') return Boolean(stage.fusionMission);
    if (missionScreen === 'factionArcs') return false;
    return isCurrentStoryChapterStage(stage);
  };
  const storyChapterStages = visibleStages.filter(isCurrentStoryChapterStage);
  const storyMissionCount = storyChapterStages.length;
  const universeArcMissionCount = visibleStages.filter(isUniverseArcVisibleForRoster).length;
  const personalArcMissionCount = visibleStages.filter(stage => stage.characterArc && isPersonalArcVisibleForRoster(stage)).length;
  const trioArcMissionCount = visibleStages.filter(isTrioArcVisibleForRoster).length;
  const fusionMissionCount = visibleStages.filter(stage => stage.fusionMission).length;
  const factionArcCount = arcProgress.length;
  const missionScreenMeta = {
    story: {
      label: { fr: 'Mode histoire', en: 'Story mode' },
      desc: { fr: 'Campagne principale: chapitre actif, carte des failles jouables, missions prioritaires et noyau final.', en: 'Main campaign: active chapter, playable rift map, priority missions, and final core.' },
      count: storyMissionCount,
      color: '#39c5bb'
    },
    factionArcs: {
      label: { fr: 'Arcs narratifs de faction', en: 'Faction narrative arcs' },
      desc: { fr: 'Conflits transversaux entre factions du Nexus, avec progression, traces et recompenses dediees.', en: 'Cross-faction Nexus conflicts with dedicated progress, traces, and rewards.' },
      count: factionArcCount,
      color: '#ffeb3b'
    },
    universeArcs: {
      label: { fr: 'Arcs narratifs par univers', en: 'Universe narrative arcs' },
      desc: { fr: 'Suites d univers lies par franchise, theme ou consequence de Trame.', en: 'Universe chains linked by franchise, theme, or Thread consequence.' },
      count: universeArcMissionCount,
      color: '#ffb15c'
    },
    personalArcs: {
      label: { fr: 'Arcs narratifs personnels', en: 'Personal narrative arcs' },
      desc: { fr: 'Missions centrees sur le dilemme propre de chaque heros possede.', en: 'Missions centered on each owned hero personal dilemma.' },
      count: personalArcMissionCount,
      color: '#9b59b6'
    },
    trioArcs: {
      label: { fr: 'Arcs narratifs trio', en: 'Trio narrative arcs' },
      desc: { fr: 'Cellules de trois personnages avec liens croises et histoire commune.', en: 'Three-character cells with crossed bonds and a shared story.' },
      count: trioArcMissionCount,
      color: '#2ecc71'
    },
    fusionMissions: {
      label: { fr: 'Failles fusionnees', en: 'Fused rifts' },
      desc: { fr: 'Missions hybrides ou plusieurs univers imposent leurs decors, ennemis et objets dans une meme breche.', en: 'Hybrid missions where several universes force their stages, enemies, and items into one breach.' },
      count: fusionMissionCount,
      color: '#ff5f7e'
    }
  };
  const selectedMissionMeta = missionScreenMeta[missionScreen] || missionScreenMeta.story;
  const missionPool = visibleStages.filter(stage => stage.id !== 38 && missionCategoryFilter(stage) && (missionModeFilter === 'all' || stage.mode === missionModeFilter));
  const isFactionArcScreen = missionScreen === 'factionArcs';
  const activeNarrativeArcs = missionScreen === 'universeArcs'
    ? UNIVERSE_NARRATIVE_ARCS.filter(arc => missionPool.some(stage => stage.universeArc?.id === arc.id) && isNarrativeArcAvailable(arc))
    : missionScreen === 'personalArcs'
      ? CHARACTER_NARRATIVE_ARCS.filter(arc => missionPool.some(stage => stage.characterArc?.id === arc.id) && isNarrativeArcAvailable(arc))
      : missionScreen === 'trioArcs'
        ? TRIO_NARRATIVE_ARCS.filter(arc => missionPool.some(stage => stage.trioArc?.id === arc.id) && isNarrativeArcAvailable(arc))
        : [];
  const narrativeArcScreenType = missionScreen === 'universeArcs'
    ? 'universe'
    : missionScreen === 'personalArcs'
      ? 'personal'
      : missionScreen === 'trioArcs'
        ? 'trio'
        : null;
  const narrativeArcGroups = (() => {
    const groupMap = new Map();
    const addToGroup = (id, seed, arc) => {
      const existing = groupMap.get(id) || { ...seed, arcs: [] };
      existing.arcs.push(arc);
      groupMap.set(id, existing);
    };

    if (narrativeArcScreenType === 'universe') {
      activeNarrativeArcs.forEach(arc => {
        getArcUniverses(arc, BASE_HEROES_DB).forEach(universe => {
          const color = getUniverseHubColor(universe);
          const place = getUniverseHubPlace(universe, lang);
          addToGroup(`universe-${universe}`, {
            id: `universe-${universe}`,
            label: universe,
            kicker: lang === 'fr' ? 'VUE UNIVERS' : 'UNIVERSE VIEW',
            desc: `${place.name} - ${place.mood}`,
            primaryUniverse: universe,
            color,
            backdrop: getOpenAiBackdropSrc(universe, 'RPG')
          }, arc);
        });
      });
    }

    if (narrativeArcScreenType === 'personal') {
      activeNarrativeArcs.forEach(arc => {
        const hero = BASE_HEROES_DB.find(item => item.id === arc.heroId);
        const label = hero?.name || getLocalizedText(arc.title, lang, arc.id);
        const universe = hero?.universe || getArcUniverses(arc, BASE_HEROES_DB)[0];
        addToGroup(`hero-${arc.heroId || arc.id}`, {
          id: `hero-${arc.heroId || arc.id}`,
          label,
          kicker: lang === 'fr' ? 'VUE PERSONNAGE' : 'CHARACTER VIEW',
          desc: hero
            ? `${hero.universe} - ${getLocalizedText(hero.role, lang, hero.category)}`
            : getLocalizedText(arc.intro, lang),
          primaryUniverse: universe,
          color: getUniverseHubColor(universe),
          backdrop: getOpenAiBackdropSrc(universe, 'RPG')
        }, arc);
      });
    }

    if (narrativeArcScreenType === 'trio') {
      activeNarrativeArcs.forEach(arc => {
        const heroes = (arc.heroIds || [])
          .map(heroId => BASE_HEROES_DB.find(item => item.id === heroId)?.name || heroId)
          .join(' / ');
        const universe = getArcUniverses(arc, BASE_HEROES_DB)[0];
        addToGroup(`trio-${arc.id}`, {
          id: `trio-${arc.id}`,
          label: heroes || getLocalizedText(arc.title, lang, arc.id),
          kicker: lang === 'fr' ? 'VUE TRIO' : 'TRIO VIEW',
          desc: getLocalizedText(arc.intro, lang),
          primaryUniverse: universe,
          color: getUniverseHubColor(universe),
          backdrop: getOpenAiBackdropSrc(universe, 'Tactics')
        }, arc);
      });
    }

    return Array.from(groupMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  })();
  const selectedNarrativeArc = activeNarrativeArcs.find(arc => arc.id === selectedNarrativeArcId) || null;
  const selectedNarrativeGroup = narrativeArcGroups.find(group => group.id === selectedNarrativeGroupId) || null;
  const focusedNarrativeArcIds = selectedNarrativeGroup
    ? new Set(selectedNarrativeGroup.arcs.map(arc => arc.id))
    : null;
  const focusedNarrativeArcs = focusedNarrativeArcIds
    ? activeNarrativeArcs.filter(arc => focusedNarrativeArcIds.has(arc.id))
    : activeNarrativeArcs;
  const focusedMissionPool = focusedNarrativeArcIds
    ? missionPool.filter(stage => {
      const arcId = stage.universeArc?.id || stage.characterArc?.id || stage.trioArc?.id;
      return focusedNarrativeArcIds.has(arcId);
    })
    : missionPool;
  useEffect(() => {
    setSelectedNarrativeArcId(null);
    setSelectedNarrativeGroupId(null);
  }, [missionScreen]);
  useEffect(() => {
    if (selectedNarrativeGroupId && !narrativeArcGroups.some(group => group.id === selectedNarrativeGroupId)) {
      setSelectedNarrativeGroupId(null);
    }
  }, [narrativeArcGroups, selectedNarrativeGroupId]);
  const getNarrativeGroupIdForArc = (arc) => {
    if (narrativeArcScreenType === 'universe') {
      const universe = getArcUniverses(arc, BASE_HEROES_DB)
        .find(candidate => narrativeArcGroups.some(group => group.id === `universe-${candidate}`));
      return universe ? `universe-${universe}` : null;
    }
    if (narrativeArcScreenType === 'personal') return `hero-${arc.heroId || arc.id}`;
    if (narrativeArcScreenType === 'trio') return `trio-${arc.id}`;
    return null;
  };
  const openNarrativeArc = (arc) => {
    const groupId = getNarrativeGroupIdForArc(arc);
    if (groupId && narrativeArcGroups.some(group => group.id === groupId)) {
      setSelectedNarrativeGroupId(groupId);
    }
    setSelectedNarrativeArcId(arc.id);
    setBriefingStageId(null);
    setShowMissionArchive(false);
    sound.playSfx('coin');
  };
  const closeNarrativeArc = () => {
    setSelectedNarrativeArcId(null);
    sound.playSfx('click');
  };
  const completeNarrativeIntro = (arc) => {
    setCompletedArcIntros(prev => ({ ...prev, [arc.id]: true }));
    setActivityProgress(prev => ({
      ...prev,
      arcIntros: {
        ...(prev?.arcIntros || {}),
        [arc.id]: true
      }
    }));
    notifyNexus(lang === 'fr'
      ? `Intro d arc stabilisee: ${getLocalizedText(arc.title, lang, arc.id)}. Premiere mission debloquee.`
      : `Arc intro stabilized: ${getLocalizedText(arc.title, lang, arc.id)}. First mission unlocked.`,
      'success'
    );
    sound.playSfx('levelup');
  };
  const unlockedMissionPool = missionPool.filter(isStageUnlocked);
  const scanPool = unlockedMissionPool.length > 0 ? unlockedMissionPool : missionPool.slice(0, 1);
  const nextUnclearedStage = scanPool.find(stage => !completedStages.includes(stage.id)) || scanPool[0];
  const seededMissionScore = (stage) => {
    const raw = Math.sin(stage.id * 9301 + missionSeed * 49297) * 10000;
    return raw - Math.floor(raw);
  };
  const randomMissionDeck = scanPool
    .filter(stage => stage.id !== nextUnclearedStage?.id)
    .sort((a, b) => seededMissionScore(a) - seededMissionScore(b))
    .slice(0, 4);
  const missionDeck = [nextUnclearedStage, ...randomMissionDeck].filter(Boolean).slice(0, 5);
  const arcaRouteCandidates = [
    nextUnclearedStage && {
      id: 'priority',
      stage: nextUnclearedStage,
      label: lang === 'fr' ? 'Priorite A.R.C.A.' : 'A.R.C.A. priority',
      reason: lang === 'fr'
        ? 'Prochaine faille non scellee la plus coherente pour avancer sans casser la progression.'
        : 'Next unsealed rift that advances progression cleanly.'
    },
    randomMissionDeck.find(stage => !completedStages.includes(stage.id)) && {
      id: 'field',
      stage: randomMissionDeck.find(stage => !completedStages.includes(stage.id)),
      label: lang === 'fr' ? 'Signal terrain' : 'Field signal',
      reason: lang === 'fr'
        ? 'Cible courte pour varier le mode et eviter la repetition de la campagne principale.'
        : 'Short target to vary the mode and avoid repeating the main campaign.'
    },
    unlockedMissionPool.length > 0 && {
      id: 'reward',
      stage: [...unlockedMissionPool].sort((a, b) => getStageRewardScore(b) - getStageRewardScore(a))[0],
      label: lang === 'fr' ? 'Cache rentable' : 'Best cache',
      reason: lang === 'fr'
        ? 'Meilleure estimation de recompense actuelle avec les modificateurs de faille.'
        : 'Best current reward estimate with active rift modifiers.'
    }
  ].filter(Boolean);
  const arcaRoute = arcaRouteCandidates.filter((route, index, list) => (
    route.stage && list.findIndex(candidate => candidate.stage?.id === route.stage.id) === index
  ));
  const riftJournal = (activityProgress.riftJournal || []).slice(0, 5);
  const clearedVisibleCount = missionPool.filter(stage => completedStages.includes(stage.id)).length;
  const isArcMissionScreen = Boolean(narrativeArcScreenType);
  const showModeFilters = missionScreen === 'story' || missionScreen === 'fusionMissions';
  const showStoryMissionTools = false;
  const riftMapCopy = narrativeArcScreenType === 'universe'
    ? {
      kicker: lang === 'fr' ? 'CARTE DES FAILLES / ATLAS DES UNIVERS' : 'RIFT MAP / UNIVERSE ATLAS',
      title: lang === 'fr' ? 'Univers instables detectes' : 'Unstable universes detected',
      desc: lang === 'fr'
        ? 'Clique une faille ou une route pour ouvrir l arc narratif lie a cet univers. Les chapitres restent dans cette vue, sans seconde carte concurrente.'
        : 'Select a rift or route to open the narrative arc tied to that universe. Chapters stay in this view without a competing second map.'
    }
    : narrativeArcScreenType === 'personal'
      ? {
        kicker: lang === 'fr' ? 'CARTE DES FAILLES / ARCS PERSONNELS' : 'RIFT MAP / PERSONAL ARCS',
        title: lang === 'fr' ? 'Trajectoires de personnages' : 'Character trajectories',
        desc: lang === 'fr'
          ? 'A.R.C.A. regroupe les failles par heros pour eviter l archive brute. Choisis un personnage, puis ouvre ses chapitres personnels.'
          : 'A.R.C.A. groups rifts by hero to avoid a raw archive. Choose a character, then open personal chapters.'
      }
      : narrativeArcScreenType === 'trio'
        ? {
          kicker: lang === 'fr' ? 'CARTE DES FAILLES / ARCS TRIO' : 'RIFT MAP / TRIO ARCS',
          title: lang === 'fr' ? 'Synergies de trio' : 'Trio synergies',
          desc: lang === 'fr'
            ? 'Les routes marquent les cellules ou trois signatures doivent agir ensemble. Chaque arc ouvre ses chapitres de synergie.'
            : 'Routes mark cells where three signatures must act together. Each arc opens its synergy chapters.'
        }
        : {
          kicker: lang === 'fr' ? 'CARTE DES FAILLES / CAMPAGNE' : 'RIFT MAP / CAMPAIGN',
          title: lang === 'fr' ? 'Portails actifs du multivers' : 'Active multiverse portals',
          desc: lang === 'fr'
            ? 'Clique une faille pour afficher son briefing juste sous la carte, ou lance une cible proposee dans la campagne.'
            : 'Select a rift to show its briefing directly under the map, or launch a proposed campaign target.'
        };
  const assetToggleStyle = (hidden) => ({
    fontSize: '9px',
    padding: '4px 7px',
    borderColor: hidden ? '#2ecc71' : '#e74c3c',
    color: hidden ? '#2ecc71' : '#e74c3c',
    minWidth: '76px'
  });
  const spriteButtonStyle = (ready) => ({
    border: `1px solid ${ready ? '#39c5bb' : '#444'}`,
    color: ready ? '#39c5bb' : '#666',
    background: ready ? 'rgba(57,197,187,0.08)' : 'rgba(255,255,255,0.02)',
    borderRadius: '3px',
    padding: '2px 5px',
    fontSize: '10px',
    cursor: ready ? 'pointer' : 'default',
    lineHeight: 1
  });
  const openSpritePreview = (info, title, subtitle) => {
    if (!info.ready) return;
    setSpritePreview({ src: info.src, title, subtitle, kind: info.kind });
    sound.playSfx('coin');
  };

  return (
    <div className="hub-screen" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle, #0e0722 0%, #03010b 100%)',
      color: '#fff',
      padding: '20px 40px',
      fontFamily: '"Share Tech Mono", monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* HUD Header */}
      <div style={{
        width: '100%',
        maxWidth: hubContentMax,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(57, 197, 187, 0.3)',
        marginBottom: '20px'
      }}>
        <div>
          <h1 className="cyber-title" style={{ fontSize: '24px', margin: 0, letterSpacing: '2px', textShadow: '0 0 10px #39c5bb' }}>
            {getTranslation(lang, 'hubTitle')}
          </h1>
          <span style={{ fontSize: '11px', color: '#ff4500' }}>{getTranslation(lang, 'sysStatus')}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ padding: '6px 12px', background: 'rgba(241, 196, 15, 0.1)', border: '1px solid #f1c40f', borderRadius: '4px', fontSize: '12px' }}>
            🪙 {getTranslation(lang, 'gold')}: <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>{gold}</span>
          </div>
          <div style={{ padding: '6px 12px', background: 'rgba(155, 89, 182, 0.1)', border: '1px solid #9b59b6', borderRadius: '4px', fontSize: '12px' }}>
            🌀 {getTranslation(lang, 'shards')}: <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>{breachShards}</span>
          </div>
          <div style={{ padding: '6px 12px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', borderRadius: '4px', fontSize: '12px' }}>
            🎫 {getTranslation(lang, 'tokens')}: <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{eventTokens}</span>
          </div>
        </div>
      </div>

      {nexusMessage && (
        <div style={{
          width: '100%',
          maxWidth: hubContentMax,
          marginBottom: '14px',
          padding: '10px 12px',
          border: `1px solid ${nexusMessage.tone === 'success' ? '#2ecc71' : nexusMessage.tone === 'warn' ? '#f1c40f' : '#39c5bb'}`,
          background: nexusMessage.tone === 'success' ? 'rgba(46,204,113,0.08)' : nexusMessage.tone === 'warn' ? 'rgba(241,196,15,0.08)' : 'rgba(57,197,187,0.08)',
          color: nexusMessage.tone === 'success' ? '#d8ffe4' : nexusMessage.tone === 'warn' ? '#fff3b0' : '#c8f7f4',
          borderRadius: '4px',
          fontSize: '12px',
          lineHeight: 1.4
        }}>
          <strong>{lang === 'fr' ? 'Journal Nexus' : 'Nexus Log'}:</strong> {nexusMessage.message}
        </div>
      )}

      {/* Navigation tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '25px', width: '100%', maxWidth: hubContentMax }}>
        <button
          onClick={() => { setActiveTab('missions'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'missions' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Ouvre la carte des missions et arcs narratifs.' : 'Open the mission map and narrative arcs.'}
        >
          {getTranslation(lang, 'tabMissions')}
        </button>
        <button
          onClick={() => { setActiveTab('mosaicHub'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'mosaicHub' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Ouvre le hub RPG exploratoire avec tes heros et portails.' : 'Open the explorable RPG hub with your heroes and portals.'}
        >
          {lang === 'fr' ? 'CITE-MOSAIQUE' : 'MOSAIC CITY'}
        </button>
        <button
          onClick={() => { setActiveTab('battleRoyale'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'battleRoyale' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Ouvre le mode FPS de survie Zone d Extinction.' : 'Open the Extinction Zone FPS survival mode.'}
        >
          {lang === 'fr' ? 'ZONE D EXTINCTION' : 'EXTINCTION ZONE'}
        </button>
        <button
          onClick={() => { setActiveTab('race'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'race' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Ouvre le prototype jouable de karting A.R.C.A.' : 'Open the playable A.R.C.A. karting prototype.'}
        >
          {lang === 'fr' ? 'COURSE' : 'RACE'}
        </button>
        <button
          onClick={() => { setActiveTab('roster'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'roster' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Consulte les heros debloques et leurs niveaux.' : 'View unlocked heroes and their levels.'}
        >
          {getTranslation(lang, 'tabRoster')}
        </button>
        <button
          onClick={() => { setActiveTab('party'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'party' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Compose ton equipe active pour les combats.' : 'Set your active combat team.'}
        >
          {getTranslation(lang, 'tabParty')}
        </button>
        <button
          onClick={() => { setActiveTab('inventory'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'inventory' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Equipe ou retire des reliques et objets evenementiels.' : 'Equip or remove relics and event items.'}
        >
          {getTranslation(lang, 'tabInventory')}
        </button>
        <button
          onClick={() => { setActiveTab('collection'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'collection' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Consulte les univers, ennemis, objets et traces collectionnes.' : 'View collected universes, enemies, items, and traces.'}
        >
          {lang === 'fr' ? 'COLLECTION' : 'COLLECTION'}
        </button>
        <button
          onClick={() => { setActiveTab('shop'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'shop' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Achete des objets avec tes ressources.' : 'Buy items with your resources.'}
        >
          {getTranslation(lang, 'tabShop')}
        </button>
        <button
          onClick={() => { setActiveTab('codex'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'codex' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Lis le lore, les arcs et les archives du jeu.' : 'Read lore, arcs, and game archives.'}
        >
          {getTranslation(lang, 'tabCodex')}
        </button>
        <button
          onClick={() => { setActiveTab('admin'); sound.playSfx('coin'); }}
          className={`btn-tab ${activeTab === 'admin' ? 'active-tab' : ''}`}
          title={lang === 'fr' ? 'Ouvre les outils pour masquer/afficher univers, stages et assets.' : 'Open tools to hide/show universes, stages, and assets.'}
          style={{ borderColor: activeTab === 'admin' ? '#ff4500' : '#555', color: activeTab === 'admin' ? '#ff4500' : undefined }}
        >
          ADMIN
        </button>
        <button
          onClick={onGoToPortal}
          className="btn-retro"
          title={lang === 'fr' ? 'Ouvre le portail de breche pour obtenir de nouveaux heros.' : 'Open the breach portal to obtain new heroes.'}
          style={{ marginLeft: 'auto', border: '1px solid #9b59b6', background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', fontSize: '13px' }}
        >
          {getTranslation(lang, 'btnPortal')}
        </button>
      </div>

      {/* Media Category Filter Bar */}
      {['missions', 'roster', 'codex', 'collection'].includes(activeTab) && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', width: '100%', maxWidth: hubContentMax, boxSizing: 'border-box', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '4px', border: '1px solid #222', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginRight: '5px' }}>
            {lang === 'fr' ? 'Filtre d archives :' : 'Archive filter:'}
          </span>
          <button
            onClick={() => { setMediaFilter('all'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'all' ? 'active-tab' : ''}`}
            title={lang === 'fr' ? 'Affiche tous les types d univers.' : 'Show every universe type.'}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'all' ? '#ffea00' : '#444' }}
          >
            {lang === 'fr' ? 'TOUT' : 'ALL'}
          </button>
          <button
            onClick={() => { setMediaFilter('game'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'game' ? 'active-tab' : ''}`}
            title={lang === 'fr' ? 'Filtre sur les univers de jeux video.' : 'Filter to video game universes.'}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'game' ? '#3498db' : '#444' }}
          >
            {lang === 'fr' ? 'JEUX VIDEO' : 'VIDEO GAMES'}
          </button>
          <button
            onClick={() => { setMediaFilter('movie'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'movie' ? 'active-tab' : ''}`}
            title={lang === 'fr' ? 'Filtre sur les univers films et series.' : 'Filter to movie and TV universes.'}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'movie' ? '#e74c3c' : '#444' }}
          >
            {lang === 'fr' ? 'FILMS & SERIES' : 'MOVIES & TV'}
          </button>
          <button
            onClick={() => { setMediaFilter('manga'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'manga' ? 'active-tab' : ''}`}
            title={lang === 'fr' ? 'Filtre sur les univers manga, anime et web.' : 'Filter to manga, anime, and web universes.'}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'manga' ? '#9b59b6' : '#444' }}
          >
            {lang === 'fr' ? 'MANGA & WEB' : 'MANGA & WEB'}
          </button>
          <button
            onClick={() => { setMediaFilter('music'); sound.playSfx('click'); }}
            className={`btn-retro ${mediaFilter === 'music' ? 'active-tab' : ''}`}
            title={lang === 'fr' ? 'Filtre sur les personas et univers musicaux.' : 'Filter to music personas and music universes.'}
            style={{ fontSize: '11px', padding: '5px 12px', borderColor: mediaFilter === 'music' ? '#f1c40f' : '#444' }}
          >
            {lang === 'fr' ? 'MUSIQUE' : 'MUSIC'}
          </button>
        </div>
      )}

      {/* Tab bodies */}
      <div style={{ width: '100%', maxWidth: hubContentMax, flex: 1 }}>

        {activeTab === 'mosaicHub' && (
          <MosaicCityHub
            lang={lang}
            heroes={HEROES_DB}
            unlockedHeroes={unlockedHeroes}
            completedStages={completedStages}
            stages={visibleStages}
            playerProfile={playerProfile}
            onOpenMissions={() => {
              setActiveTab('missions');
              setMissionScreen('universeArcs');
              setSelectedNarrativeArcId(null);
              sound.playSfx('coin');
            }}
            onOpenCodex={() => {
              setActiveTab('codex');
              setCodexView('universes');
              sound.playSfx('coin');
            }}
          />
        )}

        {activeTab === 'battleRoyale' && (
          <ExtinctionRoyale
            lang={lang}
            heroes={HEROES_DB}
            unlockedHeroes={unlockedHeroes}
          />
        )}

        {activeTab === 'race' && (
          <RaceMode
            lang={lang}
            playerProfile={playerProfile}
          />
        )}

        {/* Tab 1: Missions */}
        {activeTab === 'missions' && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#39c5bb' }}>
              {missionScreen === 'index'
                ? (lang === 'fr' ? 'ECRAN DES MISSIONS' : 'MISSION SCREEN')
                : selectedMissionMeta.label[lang].toUpperCase()}
            </h3>
            {missionScreen === 'index' ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{
                  padding: '12px',
                  border: '1px solid rgba(57,197,187,0.24)',
                  background: 'rgba(57,197,187,0.06)',
                  color: '#c8f7f4',
                  fontSize: '11px',
                  lineHeight: 1.45,
                  borderRadius: '4px'
                }}>
                  {lang === 'fr'
                    ? 'A.R.C.A. compartimente la carte des missions pour eviter la surcharge de Trame. Choisis un ecran: campagne principale, arcs de faction, arcs univers, arcs personnels ou cellules trio.'
                    : 'A.R.C.A. compartments the mission map to avoid Thread overload. Choose a screen: main campaign, faction arcs, universe arcs, personal arcs, or trio cells.'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
                  {Object.entries(missionScreenMeta).map(([key, entry]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setMissionScreen(key); setMissionSeed(Date.now()); setBriefingStageId(null); setSelectedNarrativeArcId(null); setSelectedNarrativeGroupId(null); setShowMissionArchive(false); sound.playSfx('coin'); }}
                      className="btn-retro"
                      title={lang === 'fr' ? `Ouvre cet ecran de missions: ${entry.label.fr}.` : `Open this mission screen: ${entry.label.en}.`}
                      style={{
                        minHeight: '154px',
                        padding: '14px',
                        textAlign: 'left',
                        borderColor: entry.color,
                        background: `${entry.color}10`,
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <span>
                        <span style={{ display: 'block', color: entry.color, fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>
                          {entry.label[lang]}
                        </span>
                        <span style={{ display: 'block', color: '#cfd8dc', fontSize: '10px', lineHeight: 1.4 }}>
                          {entry.desc[lang]}
                        </span>
                      </span>
                      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffeb3b', fontSize: '10px' }}>
                        <b>{entry.count} {key === 'factionArcs' ? (lang === 'fr' ? 'arcs' : 'arcs') : (lang === 'fr' ? 'missions' : 'missions')}</b>
                        <span>{lang === 'fr' ? 'OUVRIR' : 'OPEN'}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
            <div style={{
              marginBottom: '12px',
              padding: '10px 12px',
              border: '1px solid rgba(57,197,187,0.24)',
              background: 'rgba(57,197,187,0.06)',
              color: '#c8f7f4',
              fontSize: '11px',
              lineHeight: 1.45,
              borderRadius: '4px'
            }}>
              {selectedMissionMeta.desc[lang]}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => { setMissionScreen('index'); setBriefingStageId(null); setSelectedNarrativeArcId(null); setSelectedNarrativeGroupId(null); sound.playSfx('click'); }}
                className="btn-retro"
                title={lang === 'fr' ? 'Retourne au choix des categories de missions.' : 'Return to mission category selection.'}
                style={{ padding: '6px 10px', fontSize: '10px', borderColor: '#555', color: '#aaa' }}
              >
                {lang === 'fr' ? 'RETOUR AUX ECRANS' : 'BACK TO SCREENS'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px', color: '#aaa', fontSize: '12px' }}>
              <span>
                {isFactionArcScreen
                  ? (lang === 'fr'
                    ? `${arcProgress.length} arcs de faction indexes dans le theatre Nexus`
                    : `${arcProgress.length} faction arcs indexed in the Nexus theater`)
                  : (lang === 'fr'
                    ? `${clearedVisibleCount}/${missionPool.length} breches stabilisees dans cette vue${isArcMissionScreen ? '' : ` - ${missionDeck.length} cibles proposees`}`
                    : `${clearedVisibleCount}/${missionPool.length} breaches stabilized in this view${isArcMissionScreen ? '' : ` - ${missionDeck.length} proposed targets`}`)}
              </span>
              {!isArcMissionScreen && !isFactionArcScreen && (
                <button
                  onClick={() => { setMissionSeed(prev => prev + 1); sound.playSfx('click'); }}
                  className="btn-retro"
                  title={lang === 'fr' ? 'Regenere les missions proposees dans cette categorie.' : 'Refresh the proposed missions in this category.'}
                  style={{ padding: '7px 12px', fontSize: '11px', borderColor: '#39c5bb' }}
                >
                  {lang === 'fr' ? 'RELIRE LES SIGNAUX' : 'REREAD SIGNALS'}
                </button>
              )}
            </div>
            {showModeFilters && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['all', 'RPG', 'Tactics', 'Smash'].map(mode => (
                <button
                  key={mode}
                  onClick={() => { setMissionModeFilter(mode); setMissionSeed(Date.now()); sound.playSfx('click'); }}
                  className={`btn-retro ${missionModeFilter === mode ? 'active-tab' : ''}`}
                  title={mode === 'all'
                    ? (lang === 'fr' ? 'Affiche tous les modes de jeu.' : 'Show every game mode.')
                    : (lang === 'fr' ? `Affiche seulement les missions ${mode}.` : `Show only ${mode} missions.`)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '10px',
                    borderColor: missionModeFilter === mode ? '#39c5bb' : '#444',
                    color: missionModeFilter === mode ? '#39c5bb' : '#aaa'
                  }}
                >
                  {mode === 'all' ? 'ALL' : mode.toUpperCase()}
                </button>
              ))}
            </div>
            )}

            {selectedNarrativeArc ? (
              <NarrativeArcDetailPage
                lang={lang}
                arc={selectedNarrativeArc}
                stages={visibleStages}
                completedStages={completedStages}
                introDone={Boolean(completedArcIntros[selectedNarrativeArc.id])}
                onCompleteIntro={() => completeNarrativeIntro(selectedNarrativeArc)}
                onSelectStage={(stage) => launchStage(stage)}
                onBack={closeNarrativeArc}
                isStageUnlocked={isStageUnlocked}
              />
            ) : (
            <>
            {isFactionArcScreen ? (
              <FactionArcBrowser
                lang={lang}
                arcProgress={arcProgress}
                onClaimArcReward={claimArcReward}
              />
            ) : narrativeArcScreenType ? (
              <>
                <NarrativeArcGroupBrowser
                  lang={lang}
                  groups={narrativeArcGroups}
                  selectedGroupId={selectedNarrativeGroupId}
                  onSelectGroup={(groupId) => { setSelectedNarrativeGroupId(groupId); setBriefingStageId(null); sound.playSfx('coin'); }}
                  onBackToGroups={() => { setSelectedNarrativeGroupId(null); setBriefingStageId(null); sound.playSfx('click'); }}
                  onOpenArc={openNarrativeArc}
                  stages={visibleStages}
                  completedStages={completedStages}
                  categoryColor={selectedMissionMeta.color}
                  getStageUnlockRequirementText={getArcUnlockRequirementText}
                />
                {selectedNarrativeGroup && (
                  <div className="rift-focus-strip" style={{ '--rift-view-color': selectedNarrativeGroup.color || selectedMissionMeta.color }}>
                    <div>
                      <div className="portal-focus-kicker">
                        {lang === 'fr' ? 'FOCUS DE CARTE' : 'MAP FOCUS'}
                      </div>
                      <strong>{selectedNarrativeGroup.label}</strong>
                      <span>{selectedNarrativeGroup.desc}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-retro"
                      onClick={() => { setSelectedNarrativeGroupId(null); setBriefingStageId(null); sound.playSfx('click'); }}
                      title={lang === 'fr' ? 'Reaffiche toutes les vues narratives disponibles.' : 'Show every available narrative view again.'}
                    >
                      {lang === 'fr' ? 'TOUTES LES VUES' : 'ALL VIEWS'}
                    </button>
                  </div>
                )}
                <div className="rift-command-layout">
                  <MultiverseRiftMap
                    lang={lang}
                    stages={focusedMissionPool}
                    allStages={visibleStages}
                    completedStages={completedStages}
                    isStageUnlocked={isStageUnlocked}
                    onSelectStage={(stage) => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                    onSelectArc={openNarrativeArc}
                    narrativeArcs={focusedNarrativeArcs}
                    mapKicker={riftMapCopy.kicker}
                    mapTitle={riftMapCopy.title}
                    mapDescription={riftMapCopy.desc}
                    getStageStatus={getStageStatus}
                    getStageUnlockRequirementText={getArcUnlockRequirementText}
                    getStageRewardPreview={getStageRewardPreview}
                    selectedStageId={briefingStageId}
                    viewType={narrativeArcScreenType}
                  />
                <RiftBriefingPanel
                  lang={lang}
                  stage={selectedBriefingStage}
                    isUnlocked={isStageUnlocked}
                    onLaunch={launchStage}
                    onClose={() => setBriefingStageId(null)}
                    getStageModifier={getStageModifier}
                    getStageArc={getStageArc}
                    getLootRarity={getLootRarity}
                    getBossIntel={getBossIntel}
                    getRichBreachBrief={getRichBreachBrief}
                    getLockedReason={getLockedReason}
                    getStageRewardPreview={getStageRewardPreview}
                    getMissionLaunchBrief={getMissionLaunchBrief}
                    getMissionOutcomePreview={getMissionOutcomePreview}
                  />
                </div>
                <NarrativeArcSequencePanel
                  lang={lang}
                  arcs={focusedNarrativeArcs}
                  stages={visibleStages}
                  completedStages={completedStages}
                  onSelectStage={(stage) => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                />
              </>
            ) : (
              <>
                {arcaRoute.length > 0 && (
                  <div className="arca-route-panel">
                    <div>
                      <div className="portal-focus-kicker">{lang === 'fr' ? 'ROUTE A.R.C.A.' : 'A.R.C.A. ROUTE'}</div>
                      <h4>{lang === 'fr' ? 'Parcours recommande court' : 'Short recommended path'}</h4>
                    </div>
                    <div className="arca-route-list">
                      {arcaRoute.map(route => (
                        <button
                          key={route.id}
                          type="button"
                          className={`arca-route-card ${briefingStageId === route.stage.id ? 'selected' : ''}`}
                          onClick={() => { setBriefingStageId(route.stage.id); sound.playSfx('click'); }}
                          title={lang === 'fr' ? `Inspecte ${route.stage.displayName?.fr || route.stage.name}.` : `Inspect ${route.stage.displayName?.en || route.stage.name}.`}
                        >
                          <strong>{route.label}</strong>
                          <span>#{route.stage.id} {route.stage.displayName?.[lang] || route.stage.name}</span>
                          <em>{route.reason}</em>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="rift-command-layout">
                  <MultiverseRiftMap
                    lang={lang}
                    stages={missionPool}
                    allStages={visibleStages}
                    completedStages={completedStages}
                    isStageUnlocked={isStageUnlocked}
                    onSelectStage={(stage) => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                    onSelectArc={openNarrativeArc}
                    narrativeArcs={activeNarrativeArcs}
                    mapKicker={riftMapCopy.kicker}
                    mapTitle={riftMapCopy.title}
                    mapDescription={riftMapCopy.desc}
                    getStageStatus={getStageStatus}
                    getStageUnlockRequirementText={getLockedReason}
                    getStageRewardPreview={getStageRewardPreview}
                    selectedStageId={briefingStageId}
                    viewType={missionScreen === 'fusionMissions' ? 'fusion' : 'story'}
                  />
                  <RiftBriefingPanel
                    lang={lang}
                    stage={selectedBriefingStage}
                    isUnlocked={isStageUnlocked}
                    onLaunch={launchStage}
                    onClose={() => setBriefingStageId(null)}
                    getStageModifier={getStageModifier}
                    getStageArc={getStageArc}
                    getLootRarity={getLootRarity}
                    getBossIntel={getBossIntel}
                    getRichBreachBrief={getRichBreachBrief}
                    getLockedReason={getLockedReason}
                    getStageRewardPreview={getStageRewardPreview}
                    getMissionLaunchBrief={getMissionLaunchBrief}
                    getMissionOutcomePreview={getMissionOutcomePreview}
                  />
                </div>
                {riftJournal.length > 0 && (
                  <div className="rift-journal-panel">
                    <div className="portal-focus-kicker">{lang === 'fr' ? 'JOURNAL A.R.C.A.' : 'A.R.C.A. JOURNAL'}</div>
                    <div className="rift-journal-list">
                      {riftJournal.map(entry => (
                        <div key={entry.id} className={`rift-journal-entry ${entry.result}`}>
                          <strong>{entry.title}</strong>
                          <span>{entry.text}</span>
                          <em>{new Date(entry.at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')} - {entry.result === 'victory' ? (lang === 'fr' ? 'stabilisation' : 'stabilization') : (lang === 'fr' ? 'repli' : 'retreat')}</em>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {showStoryMissionTools && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.4fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#ffeb3b', marginBottom: '8px', fontWeight: 'bold' }}>
                  {lang === 'fr' ? 'SIGNAL DU JOUR' : 'DAILY SIGNAL'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#8fa5aa', lineHeight: 1.35, marginBottom: '2px' }}>
                    {lang === 'fr'
                    ? `Aujourd hui: ${activityProgress.dayKey === todayKey ? (activityProgress.dailyWins || 0) : 0} stabilisation(s), ${todayItemActivations} artefact(s).`
                      : `Today: ${activityProgress.dayKey === todayKey ? (activityProgress.dailyWins || 0) : 0} stabilization(s), ${todayItemActivations} artifact(s).`}
                  </div>
                  {dailyContracts.map(contract => {
                    const done = isDailyContractDone(contract);
                    const claimed = claimedDaily.includes(contract.id);
                    return (
                      <div key={contract.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '8px', fontSize: '10px', color: done ? '#2ecc71' : '#ccc' }}>
                        <span>{claimed ? (lang === 'fr' ? 'ARCHIVE' : 'ARCHIVED') : done ? (lang === 'fr' ? 'STABLE' : 'STABLE') : (lang === 'fr' ? 'SIGNAL' : 'SIGNAL')} - {contract.text[lang]} <strong style={{ color: '#ffeb3b' }}>{contract.focus}</strong></span>
                        <button
                          type="button"
                          onClick={() => claimDailyContract(contract)}
                          disabled={!done || claimed}
                          className="btn-retro"
                          title={lang === 'fr' ? 'Recupere la recompense si ce contrat quotidien est termine.' : 'Claim the reward if this daily contract is complete.'}
                          style={{ fontSize: '8px', padding: '3px 6px', borderColor: claimed ? '#2ecc71' : done ? '#ffeb3b' : '#444', color: claimed ? '#2ecc71' : done ? '#ffeb3b' : '#555' }}
                        >
                          {claimed ? (lang === 'fr' ? 'SCELLE' : 'SEALED') : (lang === 'fr' ? '+CACHE' : '+CACHE')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.24)', border: '1px solid rgba(57,197,187,0.16)', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#39c5bb', fontWeight: 'bold' }}>
                    {lang === 'fr' ? 'CARTE MULTIVERS' : 'MULTIVERSE MAP'}
                  </span>
                  <button onClick={launchSurvival} className="btn-retro" title={lang === 'fr' ? 'Lance une mission de survie rapide.' : 'Launch a quick survival mission.'} style={{ fontSize: '10px', padding: '4px 8px', borderColor: '#ff4500', color: '#ff8c00' }}>
                    {lang === 'fr' ? 'SURVIE' : 'SURVIVAL'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(20px, 1fr))', gap: '5px' }}>
                  {missionPool.map(stage => {
                    const isCompleted = completedStages.includes(stage.id);
                    const isLocked = !isStageUnlocked(stage);
                    return (
                      <button
                        key={stage.id}
                        onClick={() => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                        title={`${stage.universe} - ${stage.mode}`}
                        style={{
                          height: '20px',
                          borderRadius: '3px',
                          border: isCompleted ? '1px solid #2ecc71' : isLocked ? '1px solid #333' : '1px solid #39c5bb',
                          background: isCompleted ? '#2ecc7133' : isLocked ? '#111' : '#39c5bb22',
                          color: isLocked ? '#555' : '#ddd',
                          fontSize: '9px',
                          cursor: 'pointer'
                        }}
                      >
                        {stage.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            {missionScreen === 'legacyStoryMeta' && (
            <div style={{
              padding: '14px',
              marginBottom: '14px',
              background: 'rgba(57,197,187,0.05)',
              border: '1px solid rgba(57,197,187,0.22)',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Campagne de Trame A.R.C.A.' : 'A.R.C.A. Thread Campaign'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9fb6bb', marginTop: '3px' }}>
                    {lang === 'fr'
                      ? 'Memoire durable: presence, stabilisations, cycle actif, artefacts et jalons d Ancre.'
                      : 'Durable memory: presence, stabilizations, active cycle, artifacts, and Anchor milestones.'}
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#ffeb3b' }}>
                  {lang === 'fr'
                    ? `Prime de cycle: +${seasonRewardBonus}% ressources`
                    : `Cycle prime: +${seasonRewardBonus}% resources`}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                {[
                  { label: lang === 'fr' ? 'Grade de cycle' : 'Cycle grade', value: seasonLevel, color: '#ffeb3b', sub: `${seasonXpIntoLevel}/250 resonance` },
                  { label: lang === 'fr' ? 'Signal continu' : 'Continuous signal', value: `${activityProgress.loginStreak || 0}j`, color: '#39c5bb', sub: activityProgress.lastSeenDay || todayKey },
                  { label: lang === 'fr' ? 'Cycle actif' : 'Active cycle', value: `${weeklyWins}/5`, color: '#2ecc71', sub: lang === 'fr' ? 'stabilisations' : 'stabilizations' },
                  { label: lang === 'fr' ? 'Artefacts semaine' : 'Weekly artifacts', value: `${weeklyItemActivations}/12`, color: '#ff8c00', sub: lang === 'fr' ? 'economie terrain' : 'field economy' },
                  { label: lang === 'fr' ? 'Trames stabilisees' : 'Threads stabilized', value: activityProgress.lifetimeWins || 0, color: '#d9b6ff', sub: `${activityProgress.lifetimeAttempts || 0} ${lang === 'fr' ? 'contacts' : 'contacts'}` }
                ].map(metric => (
                  <div key={metric.label} style={{ padding: '9px', border: `1px solid ${metric.color}44`, background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                    <div style={{ color: metric.color, fontSize: '9px', textTransform: 'uppercase' }}>{metric.label}</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginTop: '3px' }}>{metric.value}</div>
                    <div style={{ color: '#8fa5aa', fontSize: '9px', marginTop: '2px' }}>{metric.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '8px' }}>
                {longTermMilestones.map(milestone => {
                  const ready = milestone.progress >= milestone.target;
                  const claimed = claimedMilestones.includes(milestone.id);
                  const ratio = Math.min(1, milestone.progress / milestone.target);
                  return (
                    <div key={milestone.id} style={{
                      padding: '10px',
                      border: claimed ? '1px solid #2ecc71' : ready ? '1px solid #ffeb3b' : '1px solid rgba(255,255,255,0.1)',
                      background: claimed ? 'rgba(46,204,113,0.06)' : ready ? 'rgba(255,235,59,0.06)' : 'rgba(0,0,0,0.18)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                        <strong style={{ color: ready ? '#ffeb3b' : '#ddd', fontSize: '10px' }}>{milestone.title[lang]}</strong>
                        <span style={{ color: claimed ? '#2ecc71' : '#aaa', fontSize: '9px' }}>{claimed ? (lang === 'fr' ? 'SCELLE' : 'SEALED') : `${Math.min(milestone.progress, milestone.target)}/${milestone.target}`}</span>
                      </div>
                      <div style={{ height: '5px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', margin: '7px 0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${ratio * 100}%`, height: '100%', background: claimed ? '#2ecc71' : '#ffeb3b' }} />
                      </div>
                      <div style={{ color: '#aaa', fontSize: '9px', lineHeight: 1.35 }}>{milestone.lore[lang]}</div>
                      <div style={{ color: '#d9d9d9', fontSize: '9px', marginTop: '6px' }}>
                        +{milestone.reward.gold} Or | +{milestone.reward.shards} Fragments | +{milestone.reward.tokens} Jetons
                      </div>
                      <button
                        type="button"
                        onClick={() => claimLongTermMilestone(milestone)}
                        disabled={!ready || claimed}
                        className="btn-retro"
                        title={lang === 'fr' ? 'Recupere la recompense de ce jalon si l objectif est atteint.' : 'Claim this milestone reward if the objective is complete.'}
                        style={{
                          marginTop: '7px',
                          padding: '5px 8px',
                          fontSize: '9px',
                          borderColor: claimed ? '#2ecc71' : ready ? '#ffeb3b' : '#444',
                          color: claimed ? '#2ecc71' : ready ? '#ffeb3b' : '#666'
                        }}
                      >
                        {claimed ? (lang === 'fr' ? 'ARCHIVE' : 'ARCHIVED') : ready ? (lang === 'fr' ? 'SCELLER' : 'SEAL') : (lang === 'fr' ? 'INSTABLE' : 'UNSTABLE')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {missionScreen === 'story' && (
            <div style={{
              padding: '14px',
              marginBottom: '14px',
              background: 'rgba(0,0,0,0.28)',
              border: '1px solid rgba(255,235,59,0.18)',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#ffeb3b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Lecture strategique Nexus' : 'Nexus Strategic Reading'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9fb6bb', marginTop: '3px' }}>
                    {lang === 'fr' ? 'Directives d Ancre, reputations, signaux actifs et failles fusionnees.' : 'Anchor directives, reputations, active signals, and fused rifts.'}
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#39c5bb' }}>
                  {lang === 'fr'
                    ? `${completedStages.length} breches stabilisees / statut ${metaRank} / ${collectionBonusCount} traces Nexus`
                    : `${completedStages.length} breaches stabilized / ${metaRank} status / ${collectionBonusCount} Nexus traces`}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div style={{ padding: '10px', border: '1px solid rgba(57,197,187,0.18)', background: 'rgba(57,197,187,0.05)', borderRadius: '4px' }}>
                  <strong style={{ color: '#39c5bb', fontSize: '10px', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Prochaines decisions' : 'Next decisions'}
                  </strong>
                  <div style={{ display: 'grid', gap: '5px', marginTop: '7px' }}>
                    {META_NEXUS_RECOMMENDATIONS.map(entry => (
                      <span key={entry.id} style={{ color: '#dceff0', fontSize: '10px', lineHeight: 1.35 }}>{entry.text[lang]}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(155,89,182,0.22)', background: 'rgba(155,89,182,0.05)', borderRadius: '4px' }}>
                  <strong style={{ color: '#d9b6ff', fontSize: '10px', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Reputation future' : 'Future reputation'}
                  </strong>
                  <div style={{ display: 'grid', gap: '5px', marginTop: '7px' }}>
                    {REPUTATION_TRACKS.slice(0, 5).map(track => (
                      <span key={track.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.3 }}>
                        <b>{track.label[lang]}</b>: {track.gameplay[lang]}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(255,140,0,0.22)', background: 'rgba(255,140,0,0.05)', borderRadius: '4px' }}>
                  <strong style={{ color: '#ffb15c', fontSize: '10px', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Missions fusionnees' : 'Fused missions'}
                  </strong>
                  <div style={{ display: 'grid', gap: '6px', marginTop: '7px' }}>
                    {FUSION_MISSIONS.map(mission => (
                      <span key={mission.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.3 }}>
                        <b>{mission.title[lang]}</b>: {mission.decor[lang]} {lang === 'fr' ? 'Item' : 'Item'}: {mission.item[lang]}.
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(46,204,113,0.22)', background: 'rgba(46,204,113,0.05)', borderRadius: '4px' }}>
                  <strong style={{ color: '#8dffb1', fontSize: '10px', textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Evenements saisonniers' : 'Seasonal events'}
                  </strong>
                  <div style={{ display: 'grid', gap: '5px', marginTop: '7px' }}>
                    {SPECIAL_EVENTS.map(event => (
                      <span key={event.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.3 }}>
                        <b>{event.title[lang]}</b>: {event.reward[lang]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {missionScreen === 'story' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px',
              marginBottom: '14px'
            }}>
              <div style={{
                padding: '14px',
                background: 'rgba(57,197,187,0.06)',
                border: '1px solid rgba(57,197,187,0.22)',
                borderRadius: '5px'
              }}>
                <div style={{ fontSize: '10px', color: '#39c5bb', textTransform: 'uppercase', marginBottom: '5px' }}>
                  {lang === 'fr' ? 'Chapitre actif' : 'Active chapter'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
                  {currentChapter.name[lang]}
                </div>
                <div style={{ fontSize: '11px', color: '#c8d6d6', lineHeight: 1.45, marginBottom: '8px' }}>
                  {currentChapter.desc[lang]}
                </div>
                <div style={{ fontSize: '10px', color: '#ffeb3b' }}>
                  {currentChapter.focus[lang]}
                </div>
                {nextChapter && (
                  <div style={{ marginTop: '8px', fontSize: '10px', color: '#8fa5aa' }}>
                    {lang === 'fr'
                      ? `Prochain chapitre a ${nextChapter.unlockClears} breches stabilisees.`
                      : `Next chapter at ${nextChapter.unlockClears} stabilized breaches.`}
                  </div>
                )}
                <div className="story-chapter-rail">
                  {STORY_CHAPTERS.map((chapter, index) => {
                    const active = chapter.id === currentChapter.id;
                    const open = completedStages.length >= chapter.unlockClears;
                    const chapterStageCount = getChapterStageCount(chapter);
                    return (
                      <div
                        key={chapter.id}
                        className={`story-chapter-node ${active ? 'active' : ''} ${open ? 'open' : 'locked'}`}
                      >
                        <span>{index + 1}</span>
                        <strong>{chapter.name[lang]}</strong>
                        <em>
                          {open
                            ? (active
                              ? (lang === 'fr' ? 'Chapitre projete dans les portails' : 'Chapter projected in portals')
                              : (lang === 'fr' ? 'Archive scellee' : 'Sealed archive'))
                            : (lang === 'fr' ? `${chapter.unlockClears} breches requises` : `${chapter.unlockClears} breaches required`)}
                        </em>
                        <b>{chapterStageCount} {lang === 'fr' ? 'failles' : 'rifts'}</b>
                      </div>
                    );
                  })}
                </div>
                <div className="story-chapter-rule">
                  {lang === 'fr'
                    ? 'Regle A.R.C.A.: les portails de campagne ne projettent que le chapitre actif. Les chapitres futurs restent hors champ pour eviter les spoilers de Trame et les sauts de progression.'
                    : 'A.R.C.A. rule: campaign portals only project the active chapter. Future chapters stay out of range to avoid Thread spoilers and progression skips.'}
                </div>
              </div>

              <div style={{
                display: 'none',
                padding: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '5px'
              }}>
                <div style={{ fontSize: '10px', color: '#ffeb3b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {lang === 'fr' ? 'Arcs narratifs de faction' : 'Faction narrative arcs'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                  {arcProgress.map(arc => {
                    const ratio = arc.total ? arc.completed / arc.total : 0;
                    const phase = ratio === 1
                      ? (lang === 'fr' ? 'Arc stabilise' : 'Arc stabilized')
                      : ratio >= 0.66
                        ? (lang === 'fr' ? 'Finale approche' : 'Finale incoming')
                        : ratio >= 0.33
                          ? (lang === 'fr' ? 'Conflit ouvert' : 'Open conflict')
                          : (lang === 'fr' ? 'Signal faible' : 'Weak signal');
                    return (
                      <div key={arc.id} style={{
                        padding: '9px',
                        border: `1px solid ${ratio === 1 ? arc.color : 'rgba(255,255,255,0.08)'}`,
                        background: ratio === 1 ? `${arc.color}18` : 'rgba(0,0,0,0.16)',
                        borderRadius: '4px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '11px', color: arc.color }}>{arc.title[lang]}</strong>
                          <span style={{ fontSize: '10px', color: '#ddd' }}>{arc.completed}/{arc.total}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', color: '#cfd8dc' }}>{arc.faction?.[lang]}</span>
                          <span style={{ fontSize: '8px', color: arc.color, border: `1px solid ${arc.color}66`, padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>{phase}</span>
                        </div>
                        <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                          <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: arc.color }} />
                        </div>
                        <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35 }}>{arc.premise[lang]}</div>
                        {arc.intro && (
                          <div style={{ fontSize: '9px', color: '#ffeb3b', lineHeight: 1.35, marginTop: '6px' }}>
                            {lang === 'fr' ? 'Intro: ' : 'Intro: '}{arc.intro[lang]}
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: '#d0d0d0', lineHeight: 1.35, marginTop: '7px' }}>{arc.stakes?.[lang]}</div>
                        <div style={{ fontSize: '9px', color: '#9adbd6', lineHeight: 1.35, marginTop: '6px' }}>{arc.gameplay?.[lang]}</div>
                        {arc.missions && (
                          <div style={{ display: 'grid', gap: '3px', marginTop: '7px' }}>
                            {arc.missions.slice(0, 3).map((mission, idx) => (
                              <span key={`${arc.id}-mission-${idx}`} style={{ fontSize: '9px', color: '#cfcfcf', lineHeight: 1.25 }}>
                                {idx + 1}. {mission[lang]}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: '9px', color: '#888', marginTop: '5px' }}>{arc.reward[lang]} - {arc.finale?.[lang]}</div>
                        {arc.rewards && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {arc.rewards.map(reward => (
                              <span key={reward.name[lang]} style={{ fontSize: '8px', color: '#fff', border: `1px solid ${arc.color}66`, padding: '1px 5px', borderRadius: '3px' }}>
                                {reward.name[lang]}
                              </span>
                            ))}
                          </div>
                        )}
                        {arc.claimReward && (
                          <button
                            onClick={() => claimArcReward(arc)}
                            disabled={!arc.complete || arc.claimed}
                            className="btn-retro"
                            title={lang === 'fr' ? 'Recupere la recompense finale de cet arc si toutes ses missions sont terminees.' : 'Claim this arc final reward if all its missions are complete.'}
                            style={{
                              marginTop: '7px',
                              padding: '4px 7px',
                              fontSize: '9px',
                              borderColor: arc.claimed ? '#2ecc71' : arc.complete ? arc.color : '#444',
                              color: arc.claimed ? '#2ecc71' : arc.complete ? arc.color : '#666'
                            }}
                          >
                            {arc.claimed
                              ? (lang === 'fr' ? 'ARC SCELLE' : 'ARC SEALED')
                              : arc.complete
                                ? (lang === 'fr' ? 'SCELLER ARC' : 'SEAL ARC')
                                : (lang === 'fr' ? 'ARC INSTABLE' : 'ARC UNSTABLE')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            {missionScreen === 'fusionMissions' && (
              <div style={{
                padding: '14px',
                marginBottom: '14px',
                background: 'rgba(255,95,126,0.06)',
                border: '1px solid rgba(255,95,126,0.24)',
                borderRadius: '5px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#ff8fa3', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Failles fusionnees' : 'Fused rifts'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#d9b6bf', marginTop: '3px' }}>
                      {lang === 'fr'
                        ? 'Ces breches melangent plusieurs univers: decor hybride, objet special, ennemi composite et regles locales instables.'
                        : 'These breaches mix several universes: hybrid stage, special item, composite enemy, and unstable local rules.'}
                    </div>
                  </div>
                  <div style={{ color: '#ffeb3b', fontSize: '10px' }}>
                    {FUSION_MISSIONS.length} {lang === 'fr' ? 'protocoles hybrides' : 'hybrid protocols'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {FUSION_MISSIONS.map(mission => (
                    <div key={mission.id} style={{ padding: '11px', border: '1px solid rgba(255,95,126,0.22)', background: 'rgba(0,0,0,0.18)', borderRadius: '4px' }}>
                      <strong style={{ color: '#ff8fa3', fontSize: '11px' }}>{mission.title[lang]}</strong>
                      <div style={{ color: '#cfcfcf', fontSize: '9px', lineHeight: 1.35, marginTop: '6px' }}>
                        {mission.decor[lang]}
                      </div>
                      <div style={{ color: '#ffeb3b', fontSize: '9px', lineHeight: 1.35, marginTop: '6px' }}>
                        {lang === 'fr' ? 'Objet' : 'Item'}: {mission.item[lang]}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {mission.universes.map(universe => (
                          <span key={`${mission.id}-${universe}`} style={{ border: '1px solid rgba(255,95,126,0.35)', color: '#ffd1da', fontSize: '8px', padding: '2px 5px', borderRadius: '3px' }}>
                            {universe}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missionScreen === 'legacyStoryMeta' && (
            <>
            <div style={{
              padding: '12px',
              marginBottom: '14px',
              background: 'rgba(155,89,182,0.07)',
              border: '1px solid rgba(155,89,182,0.28)',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                <strong style={{ color: '#d7b5ff', fontSize: '11px', textTransform: 'uppercase' }}>
                  {lang === 'fr' ? 'Cycles hebdomadaires' : 'Weekly cycles'}
                </strong>
                <span style={{ color: '#aaa', fontSize: '10px' }}>{currentWeekKey}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                {weeklyOperations.map(operation => {
                  const claimed = claimedWeekly.includes(operation.id);
                  const ratio = Math.min(1, (operation.progress || 0) / operation.target);
                  return (
                    <div key={operation.id} style={{ padding: '9px', border: operation.done ? '1px solid rgba(46,204,113,0.45)' : '1px solid rgba(255,255,255,0.08)', background: operation.done ? 'rgba(46,204,113,0.06)' : 'rgba(0,0,0,0.16)', borderRadius: '4px' }}>
                      <div style={{ fontSize: '10px', color: operation.done ? '#8dffb1' : '#ddd', fontWeight: 'bold', marginBottom: '5px' }}>{operation.title[lang]}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: '#8fa5aa', fontSize: '9px', marginBottom: '5px' }}>
                        <span>{lang === 'fr' ? 'Ancrage' : 'Anchoring'}</span>
                        <span>{Math.min(operation.progress || 0, operation.target)}/{operation.target}</span>
                      </div>
                      <div style={{ height: '5px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '7px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${ratio * 100}%`, height: '100%', background: operation.done ? '#2ecc71' : '#9b59b6' }} />
                      </div>
                      <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '7px' }}>
                        +{operation.reward.gold} Or | +{operation.reward.shards} Fragments | +{operation.reward.tokens} Jetons
                      </div>
                      <button
                        type="button"
                        onClick={() => claimWeeklyOperation(operation)}
                        disabled={!operation.done || claimed}
                        className="btn-retro"
                        title={lang === 'fr' ? 'Recupere la recompense hebdomadaire si l objectif est termine.' : 'Claim the weekly reward if the objective is complete.'}
                        style={{ fontSize: '9px', padding: '5px 8px', borderColor: claimed ? '#2ecc71' : operation.done ? '#ffeb3b' : '#444', color: claimed ? '#2ecc71' : operation.done ? '#ffeb3b' : '#666' }}
                      >
                        {claimed
                          ? (lang === 'fr' ? 'SCELLE' : 'SEALED')
                          : operation.done
                            ? (lang === 'fr' ? 'SCELLER' : 'SEAL')
                            : (lang === 'fr' ? 'INSTABLE' : 'UNSTABLE')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              padding: '14px',
              marginBottom: '14px',
              background: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,235,59,0.16)',
              borderRadius: '5px'
            }}>
              <div style={{ fontSize: '10px', color: '#ffeb3b', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Collections de franchise' : 'Franchise collections'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {visibleCollectionProgress.length === 0 && (
                  <div style={{ padding: '10px', border: '1px solid rgba(57,197,187,0.18)', background: 'rgba(57,197,187,0.05)', borderRadius: '4px', color: '#9fc', fontSize: '11px', lineHeight: 1.35 }}>
                    {lang === 'fr'
                      ? 'Aucune collection DLC active. Le jeu de base affiche seulement les archives OC du Nexus tant qu aucun DLC n est active depuis l admin.'
                      : 'No active DLC collection. The base game only shows OC Nexus archives until a DLC is enabled from admin.'}
                  </div>
                )}
                {visibleCollectionProgress.map(collection => {
                  const ratio = collection.total ? collection.completed / collection.total : 0;
                  const partialText = collection.hiddenCount > 0
                    ? (lang === 'fr' ? `${collection.hiddenCount} DLC masque(s)` : `${collection.hiddenCount} hidden DLC`)
                    : mediaFilter !== 'all'
                      ? (lang === 'fr' ? `${collection.fullCompleted}/${collection.fullTotal} actifs hors filtre` : `${collection.fullCompleted}/${collection.fullTotal} active outside filter`)
                      : '';
                  return (
                    <div key={collection.id} style={{
                      padding: '10px',
                      border: collection.complete ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.08)',
                      background: collection.complete ? 'rgba(46,204,113,0.07)' : 'rgba(255,255,255,0.02)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                        <strong style={{ fontSize: '11px', color: collection.complete ? '#2ecc71' : '#ddd' }}>{collection.title[lang]}</strong>
                        <span style={{ fontSize: '10px', color: '#ffeb3b' }}>{collection.completed}/{collection.total}</span>
                      </div>
                      {partialText && (
                        <div style={{ fontSize: '9px', color: '#ff8c00', marginTop: '4px' }}>
                          {partialText}
                        </div>
                      )}
                      <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', margin: '7px 0' }}>
                        <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: collection.complete ? '#2ecc71' : '#ffeb3b' }} />
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35 }}>{collection.bonus[lang]}</div>
                      <div style={{ fontSize: '10px', color: '#d9d9d9', marginTop: '6px' }}>
                        +{collection.reward.gold} Or | +{collection.reward.shards} Fragments | +{collection.reward.tokens} Jetons
                      </div>
                      <div style={{ fontSize: '9px', color: '#2ecc71', marginTop: '4px' }}>
                        {lang === 'fr' ? 'Passif permanent: +2% toutes stats.' : 'Permanent passive: +2% all stats.'}
                      </div>
                      <button
                        onClick={() => claimCollectionReward(collection)}
                        disabled={!collection.complete || collection.claimed}
                        className="btn-retro"
                        title={collection.complete
                          ? (lang === 'fr' ? 'Recupere la cache de collection si tous les elements requis sont obtenus.' : 'Claim the collection cache if every required element is obtained.')
                          : (lang === 'fr' ? 'Cache verrouillee: tous les univers de cette collection doivent etre actifs et stabilises.' : 'Cache locked: every universe in this collection must be active and stabilized.')}
                        style={{
                          marginTop: '8px',
                          padding: '5px 9px',
                          fontSize: '10px',
                          borderColor: collection.claimed ? '#2ecc71' : collection.complete ? '#ffeb3b' : '#444',
                          color: collection.claimed ? '#2ecc71' : collection.complete ? '#ffeb3b' : '#666'
                        }}
                      >
                        {collection.claimed
                          ? (lang === 'fr' ? 'SCELLE' : 'SEALED')
                          : collection.complete
                            ? (lang === 'fr' ? 'OUVRIR CACHE' : 'OPEN CACHE')
                            : (lang === 'fr' ? 'INSTABLE' : 'UNSTABLE')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              {activeFactionSynergies.map(rule => (
                <div key={rule.id} style={{
                  padding: '8px 10px',
                  border: rule.active ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.08)',
                  background: rule.active ? 'rgba(46,204,113,0.08)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: rule.active ? '#d9ffe5' : '#888'
                }}>
                  <strong>{rule.label}</strong> {rule.count}/2 - {rule.bonus}
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '8px',
              marginBottom: '14px',
              padding: '10px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '5px'
            }}>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#39c5bb' }}>{lang === 'fr' ? 'Statut d Ancre' : 'Anchor status'}:</strong> {metaRank}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#ffeb3b' }}>{lang === 'fr' ? 'Trames scellees' : 'Sealed Threads'}:</strong> {completedStages.length}/{STAGES.length}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                <strong style={{ color: '#9b59b6' }}>{lang === 'fr' ? 'Niveaux équipe' : 'Roster levels'}:</strong> {totalHeroLevels}
              </div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>
                {nextProgressGoal}
              </div>
            </div>
            </>
            )}
            {!isArcMissionScreen && !isFactionArcScreen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {missionDeck.map((stage) => {
                const isCompleted = completedStages.includes(stage.id);
                const requiredClears = getStageRequiredClears(stage);
                const isLocked = !isStageUnlocked(stage);
                const isPriority = stage.id === nextUnclearedStage?.id;
                const backdropSrc = getOpenAiBackdropSrc(stage.universe, stage.mode);
                const preparedStage = prepareStage(stage);
                const modifier = preparedStage.modifier;
                const rarity = preparedStage.lootRarity;
                const stageArc = getStageArc(stage);

                return (
                  <div key={stage.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    background: isLocked ? 'rgba(0,0,0,0.4)' : isCompleted ? 'rgba(46, 204, 113, 0.08)' : isPriority ? 'rgba(57,197,187,0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isLocked ? '1px solid #444' : isCompleted ? '1px solid #2ecc71' : isPriority ? '1px solid rgba(57,197,187,0.55)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '5px',
                    opacity: isLocked ? 0.45 : 1
                  }}>
                    {backdropSrc && (
                      <div style={{
                        width: '145px',
                        alignSelf: 'stretch',
                        minHeight: '94px',
                        flexShrink: 0,
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.32)), url(${backdropSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        imageRendering: 'pixelated'
                      }} />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          #{stage.id} {stage.displayName?.[lang] || stage.name}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          padding: '1px 5px',
                          background: stage.mode === 'Smash' ? '#e74c3c' : stage.mode === 'RPG' ? '#3498db' : '#9b59b6',
                          borderRadius: '2px'
                        }}>
                          {stage.mode === 'Smash' ? getTranslation(lang, 'modeSmash') : stage.mode === 'RPG' ? getTranslation(lang, 'modeRpg') : getTranslation(lang, 'modeTactics')}
                        </span>
                        <span style={{ color: modifier.color, border: `1px solid ${modifier.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                          {modifier.name[lang]}
                        </span>
                        <span style={{ color: rarity.color, border: `1px solid ${rarity.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                          Signature {rarity.label}
                        </span>
                        {stageArc && (
                          <span style={{ color: stageArc.color, border: `1px solid ${stageArc.color}`, padding: '1px 5px', fontSize: '9px', borderRadius: '2px' }}>
                            {stageArc.title[lang]}
                          </span>
                        )}
                        {isCompleted && <span style={{ color: '#2ecc71', fontSize: '11px', fontWeight: 'bold' }}>✓ STABILISE</span>}
                      </div>

                      <div style={{ fontSize: '12px', color: '#bbb', marginTop: '4px' }}>
                        Univers: <strong style={{ color: '#fff' }}>{stage.sourceUniverses?.join(' / ') || stage.universe}</strong> | Boss: <strong style={{ color: '#e74c3c' }}>{stage.bossName}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8fa5aa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {getRichBreachBrief(stage)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px', maxWidth: '560px', lineHeight: 1.35 }}>
                        {modifier.desc[lang]}
                      </div>
                      <div style={{ fontSize: '11px', color: '#ffeb3b', marginTop: '4px' }}>
                        Cache prevue: {preparedStage.goldPrize} Or | {preparedStage.shardPrize} Fragments {preparedStage.tokenPrize ? `| +${preparedStage.tokenPrize} Jetons` : ''}
                        {stage.rewardItemName ? ` | ${stage.rewardItemName[lang]}` : ''}
                      </div>
                    </div>

                    <div>
                      {isLocked ? (
                        <span style={{ fontSize: '11px', color: '#e74c3c' }}>
                          {lang === 'fr' ? `SCELLE (${requiredClears} breches)` : `SEALED (${requiredClears} breaches)`}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button
                            onClick={() => { setBriefingStageId(stage.id); sound.playSfx('click'); }}
                            className="btn-retro"
                            title={lang === 'fr' ? 'Ouvre les details de cette mission sans la lancer.' : 'Open this mission details without starting it.'}
                            style={{ padding: '6px 12px', borderColor: '#ffeb3b', color: '#ffeb3b', fontSize: '11px' }}
                          >
                            BRIEFING
                          </button>
                          <button
                            onClick={() => launchStage(stage)}
                            className="btn-retro"
                            title={lang === 'fr' ? 'Lance cette mission avec ton equipe active.' : 'Start this mission with your active team.'}
                            style={{
                              padding: '8px 16px',
                              background: '#39c5bb',
                              color: '#111',
                              fontSize: '12px'
                            }}
                          >
                            {getTranslation(lang, 'deploySquad')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            )}
            {missionScreen === 'story' && finalStage && currentChapter.id === 'omniverse_endgame' && (
              <div style={{
                marginTop: '14px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                background: finalStageUnlocked ? 'rgba(255, 234, 0, 0.08)' : 'rgba(0,0,0,0.28)',
                border: finalStageUnlocked ? '1px solid rgba(255,234,0,0.45)' : '1px solid #333',
                borderRadius: '5px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: finalStageUnlocked ? '#ffea00' : '#888', marginBottom: '4px' }}>
                    {lang === 'fr' ? 'ANOMALIE FINALE' : 'FINAL ANOMALY'}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>#{finalStage.id} {finalStage.name}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
                    {finalStageUnlocked
                      ? (lang === 'fr' ? 'Noyau Omniverse expose.' : 'Omniverse core exposed.')
                      : (lang === 'fr' ? `${Math.max(0, FINAL_STAGE_REQUIRED_CLEARS - completedStages.length)} brèches à stabiliser avant ouverture.` : `${Math.max(0, FINAL_STAGE_REQUIRED_CLEARS - completedStages.length)} breaches to stabilize before opening.`)}
                  </div>
                </div>
                <button
                  onClick={() => finalStageUnlocked && launchStage(finalStage)}
                  className="btn-retro"
                  disabled={!finalStageUnlocked}
                  title={finalStageUnlocked
                    ? (lang === 'fr' ? 'Lance le boss final de la campagne.' : 'Start the final campaign boss.')
                    : (lang === 'fr' ? 'Boss final verrouille: stabilise plus de breches.' : 'Final boss locked: stabilize more breaches.')}
                  style={{
                    padding: '8px 16px',
                    background: finalStageUnlocked ? '#ffea00' : 'rgba(255,255,255,0.04)',
                    color: finalStageUnlocked ? '#111' : '#777',
                    fontSize: '12px',
                    cursor: finalStageUnlocked ? 'pointer' : 'not-allowed'
                  }}
                >
                  {finalStageUnlocked ? getTranslation(lang, 'deploySquad') : (lang === 'fr' ? 'SCELLE' : 'SEALED')}
                </button>
              </div>
            )}
            {!isArcMissionScreen && !isFactionArcScreen && (
            <div style={{ marginTop: '14px' }}>
              <button
                onClick={() => { setShowMissionArchive(prev => !prev); sound.playSfx('click'); }}
                className="btn-retro"
                title={lang === 'fr' ? 'Affiche ou masque la liste complete des missions filtrees.' : 'Show or hide the complete filtered mission list.'}
                style={{ padding: '7px 11px', fontSize: '10px', borderColor: '#555' }}
              >
                {showMissionArchive
                  ? (lang === 'fr' ? 'REFERMER LES ARCHIVES' : 'CLOSE ARCHIVES')
                  : (lang === 'fr' ? `OUVRIR LES ARCHIVES (${missionPool.length})` : `OPEN ARCHIVES (${missionPool.length})`)}
              </button>

              {showMissionArchive && (
                <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px', maxHeight: '34vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {missionPool.map(stage => {
                    const isCompleted = completedStages.includes(stage.id);
                    return (
                      <button
                        key={stage.id}
                        onClick={() => isStageUnlocked(stage) ? launchStage(stage) : setBriefingStageId(stage.id)}
                        className="btn-retro"
                        title={isStageUnlocked(stage)
                          ? (lang === 'fr' ? 'Lance cette mission archivee.' : 'Start this archived mission.')
                          : (lang === 'fr' ? 'Mission verrouillee: ouvre le briefing pour voir les conditions.' : 'Mission locked: open the briefing to see requirements.')}
                        style={{
                          textAlign: 'left',
                          padding: '9px',
                          fontSize: '10px',
                          borderColor: isCompleted ? '#2ecc71' : 'rgba(255,255,255,0.12)',
                          color: isCompleted ? '#2ecc71' : '#ddd',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                      >
                        #{stage.id} {stage.universe}<br />
                        <span style={{ color: '#888' }}>{stage.mode} · {stage.difficulty}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            )}
            </>)}
              </>
            )}
          </div>
        )}

        {/* Tab 2: Roster */}
        {activeTab === 'roster' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            {/* List */}
            <div className="glass-panel" style={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#39c5bb' }}>{getTranslation(lang, 'recountedHeroes')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {HEROES_DB.filter(h => unlockedHeroes.includes(h.id) && matchesMediaFilter(LORE_DB[h.universe]?.mediaType)).map((hero) => {
                  const isSelected = hero.id === selectedHeroId;
                  const isActive = activeTeam.includes(hero.id);
                  const lvl = heroLevels[hero.id] || 1;
                  const plaque = getCharacterPlaque(hero);
                  return (
                    <div
                      key={hero.id}
                      onClick={() => { setSelectedHeroId(hero.id); sound.playSfx('click'); }}
                      style={{
                        padding: '10px',
                        background: isSelected ? 'rgba(57, 197, 187, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid #39c5bb' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '9px', color: hero.primaryColor, fontWeight: 'bold', letterSpacing: '0.08em' }}>
                          {plaque.clearance} / {hero.universe}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hero.name}</div>
                        <span style={{ fontSize: '10px', color: '#888' }}>{plaque.role[lang]}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '11px', color: '#39c5bb' }}>LVL {lvl}</div>
                        {isActive && <span style={{ fontSize: '8px', color: '#2ecc71' }}>● {getTranslation(lang, 'activeLabel')}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            {selectedHero && (
              <div className="glass-panel" style={{ padding: '20px', border: `2px solid ${selectedHero.primaryColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      {selectedPlaque.clearance} / {selectedPlaque.rank[lang]}
                    </div>
                    <h2 style={{ margin: '2px 0 0 0', fontSize: '22px' }}>{selectedHero.name}</h2>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: selectedHero.primaryColor, borderRadius: '3px', display: 'inline-block' }}>
                        {selectedHero.universe}
                      </span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#bbb' }}>
                        {selectedPlaque.role[lang]}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#39c5bb', fontWeight: 'bold' }}>
                    {getTranslation(lang, 'levelLabel')} {heroLevels[selectedHero.id] || 1}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.1fr', gap: '20px', marginTop: '15px' }}>
                  <div style={{
                    background: '#04020a',
                    minHeight: '260px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid ${selectedHero.primaryColor}33`,
                    overflow: 'hidden'
                  }}>
                    <canvas id="detailCanvas" width="300" height="250" style={{ width: '100%', maxWidth: '340px', height: '250px' }} ref={(el) => {
                      if (!el) return;
                      const ctx = el.getContext('2d');
                      ctx.clearRect(0, 0, 300, 250);
                      drawPixelSprite(ctx, 150, 182, selectedHero, 0, 1, 178, 'nexus');
                    }} />
                  </div>

                  <div>
                    <div style={{ marginBottom: '10px', padding: '10px', border: `1px solid ${selectedHero.primaryColor}55`, background: `${selectedHero.primaryColor}10`, borderRadius: '4px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: '11px', lineHeight: 1.35 }}>
                        <span style={{ color: '#777', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Indicatif' : 'Callsign'}</span>
                        <strong style={{ color: '#fff' }}>{selectedPlaque.callSign}</strong>
                        <span style={{ color: '#777', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Origine' : 'Origin'}</span>
                        <span style={{ color: '#bbb' }}>{selectedPlaque.origin[lang]}</span>
                      </div>
                    </div>
                    <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '3px' }}>{getTranslation(lang, 'attributes')}</h4>
                    <div style={{ fontSize: '13px', lineHeight: '22px' }}>
                      <div>MAX HP: <strong style={{ color: '#2ecc71', float: 'right' }}>{selectedHeroStats.hp}</strong></div>
                      <div>ATTACK: <strong style={{ color: '#e74c3c', float: 'right' }}>{selectedHeroStats.atk}</strong></div>
                      <div>DEFENSE: <strong style={{ color: '#3498db', float: 'right' }}>{selectedHeroStats.def}</strong></div>
                      <div>SPEED: <strong style={{ color: '#f1c40f', float: 'right' }}>{selectedHeroStats.spd}</strong></div>
                    </div>
                    <button
                      onClick={() => handleLevelUp(selectedHero.id)}
                      disabled={gold < getUpgradeCost(selectedHero.id)}
                      className={`btn-retro ${gold < getUpgradeCost(selectedHero.id) ? 'btn-disabled' : ''}`}
                      title={lang === 'fr'
                        ? `Depense ${getUpgradeCost(selectedHero.id)} Or pour augmenter ce heros d un niveau.`
                        : `Spend ${getUpgradeCost(selectedHero.id)} Gold to increase this hero by one level.`}
                      style={{ width: '100%', fontSize: '12px', padding: '8px', marginTop: '12px' }}
                    >
                      {getTranslation(lang, 'levelUpBtn')} (🪙 {getUpgradeCost(selectedHero.id)})
                    </button>
                    <button
                      onClick={() => handleLevelUpPotion(selectedHero.id)}
                      disabled={breachShards < 20}
                      className={`btn-retro ${breachShards < 20 ? 'btn-disabled' : ''}`}
                      title={lang === 'fr'
                        ? 'Depense 20 Fragments pour augmenter ce heros d un niveau.'
                        : 'Spend 20 Shards to increase this hero by one level.'}
                      style={{ 
                        width: '100%', 
                        fontSize: '11px', 
                        padding: '6px', 
                        marginTop: '8px',
                        background: 'rgba(155, 89, 182, 0.15)',
                        borderColor: '#9b59b6',
                        color: '#9b59b6'
                      }}
                    >
                      {getTranslation(lang, 'btnUsePotion')} (🌀 20)
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Lore Breach Multiverse' : 'Breach Multiverse lore'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedBreachLore}
                    </div>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Doctrine BP' : 'BP Doctrine'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.4, marginBottom: '8px' }}>
                      {selectedPlaque.doctrine[lang]}
                    </div>
                    {selectedPlaque.protocol && (
                      <div style={{ fontSize: '10px', color: '#9fd8ff', lineHeight: 1.35, marginBottom: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '7px' }}>
                        <strong style={{ color: '#39c5bb' }}>{lang === 'fr' ? 'Protocole' : 'Protocol'}:</strong> {selectedPlaque.protocol[lang]}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedPlaque.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '9px', padding: '2px 6px', border: `1px solid ${selectedHero.primaryColor}66`, color: '#ddd', borderRadius: '3px', background: `${selectedHero.primaryColor}12` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', border: `1px solid ${selectedHero.primaryColor}44`, background: `${selectedHero.primaryColor}0f`, borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: selectedHero.primaryColor, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Monde d origine' : 'Origin world'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedOriginLore}
                    </div>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#ff8c00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'fr' ? 'Dossier personnage' : 'Character dossier'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#d8d8d8', lineHeight: 1.45 }}>
                      {selectedPlaque.dossier[lang]}
                    </div>
                    {selectedPlaque.resonance && (
                      <div style={{ marginTop: '9px', fontSize: '11px', color: '#cfc3ff', lineHeight: 1.4 }}>
                        <strong style={{ color: '#9b59b6' }}>{lang === 'fr' ? 'Resonance' : 'Resonance'}:</strong> {selectedPlaque.resonance[lang]}
                      </div>
                    )}
                    {selectedPlaque.threat && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#ffb3aa', lineHeight: 1.4 }}>
                        <strong style={{ color: '#e74c3c' }}>{lang === 'fr' ? 'Risque' : 'Risk'}:</strong> {selectedPlaque.threat[lang]}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="equip-lore-card">
                    <div className="equip-lore-label">{getTranslation(lang, 'weaponRelic')}</div>
                    {selectedEquippedGear ? (
                      <>
                        <strong>{selectedEquippedGear.name[lang]}</strong>
                        <span>{formatBoostText(selectedEquippedGear.boost)}</span>
                        <p>{getGearLore(selectedEquippedGear)}</p>
                      </>
                    ) : (
                      <p>{lang === 'fr' ? 'Aucune relique armee: le heros combat avec sa signature de base.' : 'No armed relic: the hero fights with the base signature.'}</p>
                    )}
                  </div>
                  <div className="equip-lore-card event">
                    <div className="equip-lore-label">{getTranslation(lang, 'eventItem')}</div>
                    {selectedEquippedEvent ? (
                      <>
                        <strong>{selectedEquippedEvent.name[lang]}</strong>
                        <span>{selectedHero.universe}</span>
                        <p>{getEventLore(selectedEquippedEvent)}</p>
                      </>
                    ) : (
                      <p>{lang === 'fr' ? 'Aucun objet evenementiel synchronise pour cette fiche.' : 'No event item synchronized for this profile.'}</p>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '12px', padding: '12px', border: '1px solid rgba(57,197,187,0.18)', background: 'rgba(57,197,187,0.05)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {lang === 'fr' ? 'Apparence Nexus' : 'Nexus appearance'}
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '11px', color: '#aeb8c2', lineHeight: 1.35 }}>
                        {lang === 'fr'
                          ? 'Les apparences viennent des traces d arcs et stabilisent la signature visuelle du heros.'
                          : 'Appearances come from arc traces and stabilize the hero visual signature.'}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, fontSize: '10px', color: selectedHero.primaryColor, textTransform: 'uppercase' }}>
                      {selectedHero.activeSkin?.name?.[lang] || SKIN_CATALOG.default.name[lang]}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {selectedHeroSkins.map(skin => {
                      const activeSkinId = heroSkins?.[selectedHero.id] || 'default';
                      const isActive = activeSkinId === skin.id;
                      const skinPrimary = skin.colors.primaryColor || selectedHero.primaryColor || '#39c5bb';
                      const skinSecondary = skin.colors.secondaryColor || selectedHero.secondaryColor || '#ffffff';
                      return (
                        <button
                          key={skin.id}
                          type="button"
                          onClick={() => setHeroSkins(prev => ({
                            ...prev,
                            [selectedHero.id]: skin.id === 'default' ? null : skin.id
                          }))}
                          style={{
                            minHeight: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            border: `1px solid ${isActive ? skinPrimary : 'rgba(255,255,255,0.12)'}`,
                            borderRadius: '4px',
                            background: isActive ? `${skinPrimary}22` : 'rgba(0,0,0,0.25)',
                            color: '#f5f5f5',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{
                            width: '28px',
                            height: '28px',
                            flexShrink: 0,
                            borderRadius: '3px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            background: `linear-gradient(135deg, ${skinPrimary} 0 50%, ${skinSecondary} 50% 100%)`,
                            boxShadow: isActive ? `0 0 10px ${skinPrimary}66` : 'none'
                          }} />
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>
                              {skin.name[lang]}
                            </span>
                            <span style={{ display: 'block', marginTop: '2px', fontSize: '9px', color: isActive ? '#ffffff' : '#8f98a3', textTransform: 'uppercase' }}>
                              {isActive ? (lang === 'fr' ? 'Equipe' : 'Equipped') : (lang === 'fr' ? 'Disponible' : 'Available')}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Talent Mods Panel */}
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 235, 59, 0.02)', border: '1px solid rgba(255, 235, 59, 0.15)', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ffea00', textTransform: 'uppercase', textShadow: '0 0 3px #ffea00' }}>
                    🧬 {lang === 'fr' ? 'MODS CYBERNÉTIQUES (TALENTS)' : 'CYBERNETIC MODS (TALENTS)'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {(() => {
                      let options = [];
                      if (selectedHero.category === 'marine') {
                        options = [
                          { id: 'incendiary', name: { en: 'Incendiary Ammo', fr: 'Balles Incendiaires' }, desc: { en: '+10% ATK & Burn', fr: '+10% ATQ & Brûlure' } },
                          { id: 'vanguard', name: { en: 'Vanguard Shielding', fr: 'Bouclier d\'Avant-Garde' }, desc: { en: '+15% DEF & Shield', fr: '+15% DÉF & Bouclier' } }
                        ];
                      } else if (selectedHero.category === 'horror') {
                        options = [
                          { id: 'lifedrain', name: { en: 'Nanite Lifesteal', fr: 'Vol de Vie Nanite' }, desc: { en: '+10% Lifesteal', fr: '+10% Vol de vie' } },
                          { id: 'survival_instinct', name: { en: 'Survival Instinct', fr: 'Instinct de Survie' }, desc: { en: '+20% Max HP boost', fr: '+20% PV Max' } }
                        ];
                      } else if (selectedHero.category === 'slayer') {
                        options = [
                          { id: 'critical_edge', name: { en: 'Critical Edge', fr: 'Lame Critique' }, desc: { en: '+20% ATK, pierce DEF', fr: '+20% ATQ, perce-DEF' } },
                          { id: 'hyper_velocity', name: { en: 'Hyper Velocity', fr: 'Hyper Vélocité' }, desc: { en: '+15% Action Speed', fr: '+15% Vitesse' } }
                        ];
                      } else if (selectedHero.category === 'hacker') {
                        options = [
                          { id: 'atb_overdrive', name: { en: 'ATB Overdrive', fr: 'Surrégime ATB' }, desc: { en: '+20% ATB speed rate', fr: '+20% Vitesse ATB' } },
                          { id: 'reality_warp', name: { en: 'Reality Warp', fr: 'Altération Réalité' }, desc: { en: 'Stun/Glitch chance', fr: 'Chance d\'étourdir' } }
                        ];
                      } else if (selectedHero.category === 'tactical') {
                        options = [
                          { id: 'suppressing_fire', name: { en: 'Suppressing Fire', fr: 'Tir de Suppression' }, desc: { en: 'Attacks reduce target DEF', fr: 'Attaques réduisent la DEF cible' } },
                          { id: 'guardian_plates', name: { en: 'Guardian Plates', fr: 'Blindage Gardien' }, desc: { en: '+20% HP stats boost', fr: '+20% PV Max' } }
                        ];
                      }

                      const activeTalent = heroTalents[selectedHero.id];

                      return options.map(opt => {
                        const isActive = activeTalent === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              sound.playSfx('confirm');
                              setHeroTalents(prev => ({
                                ...prev,
                                [selectedHero.id]: isActive ? null : opt.id
                              }));
                            }}
                            style={{
                              padding: '10px',
                              background: isActive ? 'rgba(255, 235, 59, 0.15)' : 'rgba(0,0,0,0.3)',
                              border: isActive ? '2px solid #ffea00' : '1px solid #333',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: isActive ? '#fff' : '#aaa' }}>{opt.name[lang]}</div>
                            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>{opt.desc[lang]}</div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab 3: Party Setup */}
        {activeTab === 'party' && (
          <>
          <div className="glass-panel squad-panel" style={{ marginBottom: '14px' }}>
            <div className="squad-header">
              <div>
                <h3>{lang === 'fr' ? 'Carte d Ancre / futures cellules' : 'Anchor card / future cells'}</h3>
                <p>
                  {lang === 'fr'
                    ? 'Prepare une carte de commandant partageable: trace Nexus, collection et cellule active.'
                    : 'Prepare a shareable commander card: Nexus trace, collection, and active cell.'}
                </p>
              </div>
              <button
                className="btn-retro"
                onClick={() => setPublicProfile(prev => ({ ...prev, shareCode: prev?.shareCode || generateShareCode(), visibility: prev?.visibility === 'public' ? 'private' : 'public' }))}
                title={lang === 'fr' ? 'Active ou desactive la visibilite publique du profil et genere un code ami si besoin.' : 'Toggle public profile visibility and generate a friend code if needed.'}
                style={{ fontSize: '10px', borderColor: publicProfile?.visibility === 'public' ? '#2ecc71' : '#ffea00', color: publicProfile?.visibility === 'public' ? '#2ecc71' : '#ffea00' }}
              >
                {publicProfile?.visibility === 'public'
                  ? (lang === 'fr' ? 'Profil public' : 'Public profile')
                  : (lang === 'fr' ? 'Activer partage' : 'Enable share')}
              </button>
            </div>
            <div className="squad-command-grid" style={{ marginTop: '14px', marginBottom: 0 }}>
              <div className="squad-readiness-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Commandant' : 'Commander'}</div>
                <div className="squad-grade-row">
                  <div className="squad-grade">{String(playerProfile?.name || 'A').slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{playerProfile?.name || 'Ancre'}</strong>
                    <small>{publicProfile?.title || 'Prime Anchor'}</small>
                  </div>
                </div>
              </div>
              <div className="squad-plan-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Code ami' : 'Friend code'}</div>
                <p style={{ color: '#fff', fontSize: '15px', letterSpacing: '0.08em' }}>{publicProfile?.shareCode || (lang === 'fr' ? 'Non genere' : 'Not generated')}</p>
                <span>{lang === 'fr' ? 'Pret pour profil public, code ami et matchmaking plus tard.' : 'Ready for public profile, friend code, and later matchmaking.'}</span>
              </div>
              <div className="squad-section-card">
                <div className="squad-section-title">{lang === 'fr' ? 'Collection' : 'Collection'}</div>
                <div className="squad-stat-grid">
                  <div><span>{lang === 'fr' ? 'Heros' : 'Heroes'}</span><strong>{collectionSummary.heroes}/{collectionSummary.totalHeroes}</strong></div>
                  <div><span>{lang === 'fr' ? 'Mondes' : 'Worlds'}</span><strong>{collectionSummary.worlds}</strong></div>
                  <div><span>{lang === 'fr' ? 'Arcs' : 'Arcs'}</span><strong>{collectionSummary.arcs}</strong></div>
                  <div><span>{lang === 'fr' ? 'Apparences' : 'Appearances'}</span><strong>{collectionSummary.skins}</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel squad-panel">
            <div className="squad-header">
              <div>
                <h3>{getTranslation(lang, 'teamDeployTitle')}</h3>
                <p>{getTranslation(lang, 'teamDeploySub')}</p>
              </div>
              <button
                onClick={autoEquipRelics}
                className="btn-retro"
                title={lang === 'fr' ? 'Equipe automatiquement les meilleures reliques disponibles sur l equipe active.' : 'Automatically equip the best available relics on the active team.'}
                style={{ fontSize: '11px', padding: '7px 12px', background: 'rgba(57, 197, 187, 0.1)', borderColor: '#39c5bb', color: '#39c5bb' }}
              >
                {getTranslation(lang, 'btnAutoEquip')}
              </button>
            </div>

            <div className="squad-zone-title">
              <span>{lang === 'fr' ? 'Equipe active' : 'Active team'}</span>
              <small>{lang === 'fr' ? 'Les trois cartes qui partiront en mission.' : 'The three cards that will enter missions.'}</small>
            </div>
            <div className="squad-slot-grid">
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                const stats = hero ? getHeroStats(hero) : null;
                const gear = hero ? getGearDisplay(equippedGear[hero.id]) : null;
                const eventItem = hero && equippedEventItems[hero.id]
                  ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[hero.id])
                  : null;
                return (
                  <div key={idx} className={`squad-slot ${hero ? 'filled' : 'empty'}`} style={{ '--slot-color': hero?.primaryColor || '#444' }}>
                    {hero ? (
                      <>
                        <div className="squad-slot-top">
                          <span>Slot {idx + 1}</span>
                          <button onClick={() => toggleActiveHero(hero.id)} title={lang === 'fr' ? 'Retirer' : 'Remove'}>X</button>
                        </div>
                        <div className="squad-hero-row">
                          <div className="squad-hero-frame">
                            <canvas width="112" height="118" ref={(el) => {
                              if (!el) return;
                              const ctx = el.getContext('2d');
                              ctx.clearRect(0, 0, 112, 118);
                      drawPixelSprite(ctx, 56, 98, hero, 0, 1, 88, 'hud');
                            }} />
                          </div>
                          <div className="squad-hero-info">
                            <strong>{hero.name}</strong>
                            <small>{hero.universe}</small>
                            <em>{categoryLabels[hero.category]?.[lang] || hero.category}</em>
                          </div>
                        </div>
                        <div className="squad-mini-stats">
                          <span>HP {stats.hp}</span>
                          <span>ATK {stats.atk}</span>
                          <span>DEF {stats.def}</span>
                          <span>SPD {stats.spd}</span>
                        </div>
                        <div className="squad-loadout-line">
                          <span>{gear ? gear.name[lang] : (lang === 'fr' ? 'Relique vide' : 'No relic')}</span>
                          <span>{eventItem ? eventItem.name[lang] : (lang === 'fr' ? 'Event vide' : 'No event')}</span>
                        </div>
                        <button
                          onClick={() => { setSelectedHeroId(hero.id); setActiveTab('inventory'); sound.playSfx('click'); }}
                          className="btn-retro"
                          title={lang === 'fr' ? 'Ouvre l inventaire pour changer les reliques et objets de ce heros.' : 'Open inventory to change this hero relics and event items.'}
                          style={{ fontSize: '10px', padding: '4px 8px', width: '100%', marginTop: '8px' }}
                        >
                          {lang === 'fr' ? 'GERER EQUIPEMENT' : 'MANAGE GEAR'}
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{getTranslation(lang, 'emptySlot')}</span>
                        <small>{lang === 'fr' ? 'Choisis une reserve ci-dessous.' : 'Pick a reserve below.'}</small>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="squad-zone-title">
              <span>{lang === 'fr' ? 'Synthese tactique' : 'Tactical summary'}</span>
              <small>{lang === 'fr' ? 'Lecture A.R.C.A., resonances et failles tactiques.' : 'A.R.C.A. reading, resonances, and tactical faults.'}</small>
            </div>
            <div className="squad-command-grid">
              <div className="squad-readiness-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Lecture A.R.C.A.' : 'A.R.C.A. read'}</div>
                <div className="squad-grade-row">
                  <span className="squad-grade">{squadGrade}</span>
                  <div>
                    <strong>{squadReadiness}%</strong>
                    <small>{lang === 'fr' ? 'Preparation escouade' : 'Squad readiness'}</small>
                  </div>
                </div>
                <div className="squad-meter"><span style={{ width: `${squadReadiness}%` }} /></div>
                <p>{squadFocus}</p>
              </div>

              <div className="squad-stat-grid">
                <div><span>HP</span><strong>{deployedStats.hp}</strong></div>
                <div><span>ATK</span><strong>{deployedStats.atk}</strong></div>
                <div><span>DEF</span><strong>{deployedStats.def}</strong></div>
                <div><span>SPD</span><strong>{deployedStats.spd}</strong></div>
              </div>

              <div className="squad-plan-card">
                <div className="squad-kicker">{lang === 'fr' ? 'Plan Nexus' : 'Nexus plan'}</div>
                <p>
                  {lang === 'fr'
                    ? `${deployedHeroes.length}/3 heros deployes, ${deployedSynergies.length + deployedFactionSynergies.length} bonus actifs, ${equippedRelicCount}/${deployedHeroes.length || 3} reliques armees.`
                    : `${deployedHeroes.length}/3 heroes deployed, ${deployedSynergies.length + deployedFactionSynergies.length} active bonuses, ${equippedRelicCount}/${deployedHeroes.length || 3} relics armed.`}
                </p>
                <span>{nextProgressGoal}</span>
              </div>
            </div>

            <div className="squad-slot-grid squad-legacy-hidden">
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                const stats = hero ? getHeroStats(hero) : null;
                const gear = hero ? getGearDisplay(equippedGear[hero.id]) : null;
                const eventItem = hero && equippedEventItems[hero.id]
                  ? Object.values(EVENT_ITEMS_DB).find(item => item.id === equippedEventItems[hero.id])
                  : null;
                return (
                  <div key={idx} className={`squad-slot ${hero ? 'filled' : 'empty'}`} style={{ '--slot-color': hero?.primaryColor || '#444' }}>
                    {hero ? (
                      <>
                        <div className="squad-slot-top">
                          <span>Slot {idx + 1}</span>
                          <button onClick={() => toggleActiveHero(hero.id)} title={lang === 'fr' ? 'Retirer' : 'Remove'}>X</button>
                        </div>
                        <strong>{hero.name}</strong>
                        <small>{hero.universe} - {categoryLabels[hero.category]?.[lang] || hero.category}</small>
                        <div className="squad-mini-stats">
                          <span>HP {stats.hp}</span>
                          <span>ATK {stats.atk}</span>
                          <span>DEF {stats.def}</span>
                          <span>SPD {stats.spd}</span>
                        </div>
                        <div className="squad-loadout-line">
                          <span>{gear ? gear.name[lang] : (lang === 'fr' ? 'Relique vide' : 'No relic')}</span>
                          <span>{eventItem ? eventItem.name[lang] : (lang === 'fr' ? 'Event vide' : 'No event')}</span>
                        </div>
                        <button
                          onClick={() => { setSelectedHeroId(hero.id); setActiveTab('inventory'); sound.playSfx('click'); }}
                          className="btn-retro"
                          style={{ fontSize: '10px', padding: '4px 8px', width: '100%', marginTop: '8px' }}
                        >
                          {lang === 'fr' ? 'GERER EQUIPEMENT' : 'MANAGE GEAR'}
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{getTranslation(lang, 'emptySlot')}</span>
                        <small>{lang === 'fr' ? 'Choisis une reserve ci-dessous.' : 'Pick a reserve below.'}</small>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="squad-meta-grid">
              <div className="squad-section-card">
                <div className="squad-section-title">{getTranslation(lang, 'synergiesTitle')}</div>
                {deployedSynergies.length === 0 && deployedFactionSynergies.length === 0 ? (
                  <p className="squad-muted">{getTranslation(lang, 'noSynergies')}</p>
                ) : (
                  <div className="squad-bonus-list">
                    {deployedSynergies.map(syn => (
                      <div key={syn.id}>
                        <strong>{getTranslation(lang, syn.key)}</strong>
                        <span>{getTranslation(lang, syn.descKey)}</span>
                      </div>
                    ))}
                    {deployedFactionSynergies.map(rule => (
                      <div key={rule.id}>
                        <strong>{rule.label}</strong>
                        <span>{rule.bonus}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="squad-section-card warning">
                <div className="squad-section-title">{lang === 'fr' ? 'Directives A.R.C.A.' : 'A.R.C.A. directives'}</div>
                <div className="squad-warning-list">
                  {(squadWarnings.length ? squadWarnings : [lang === 'fr' ? 'Escouade stable: pousse les niveaux et vise les caches de collection.' : 'Stable squad: push levels and chase collection caches.']).map(item => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="squad-reserve-title">
              <h4>{getTranslation(lang, 'reserves')}</h4>
              <span>{lang === 'fr' ? 'Clique pour deployer ou retirer. Les cartes montrent la valeur actuelle avec bonus.' : 'Click to deploy or bench. Cards show current value with bonuses.'}</span>
            </div>
            <div className="squad-reserve-grid">
              {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map((hero) => {
                const isActive = activeTeam.includes(hero.id);
                const stats = getHeroStats(hero);
                const gear = getGearDisplay(equippedGear[hero.id]);
                const wouldPair = !isActive && deployedCategories[hero.category] === 1;
                return (
                  <div
                    key={hero.id}
                    onClick={() => toggleActiveHero(hero.id)}
                    className={`squad-reserve-card ${isActive ? 'active' : ''}`}
                    title={isActive
                      ? (lang === 'fr' ? 'Clique pour retirer ce heros de l equipe active.' : 'Click to remove this hero from the active team.')
                      : (lang === 'fr' ? 'Clique pour ajouter ce heros a l equipe active si une place est libre.' : 'Click to add this hero to the active team if a slot is free.')}
                    style={{ '--slot-color': hero.primaryColor }}
                  >
                    <div className="squad-reserve-head">
                      <strong>{hero.name}</strong>
                      <span>{isActive ? getTranslation(lang, 'deployed') : getTranslation(lang, 'standby')}</span>
                    </div>
                    <div className="squad-reserve-body">
                      <div className="squad-reserve-frame">
                        <canvas width="76" height="82" ref={(el) => {
                          if (!el) return;
                          const ctx = el.getContext('2d');
                          ctx.clearRect(0, 0, 76, 82);
                          drawPixelSprite(ctx, 38, 70, hero, 0, 1, 62, 'hud');
                        }} />
                      </div>
                      <div>
                        <small>{hero.universe}</small>
                        <em>{categoryLabels[hero.category]?.[lang] || hero.category}</em>
                      </div>
                    </div>
                    <div className="squad-reserve-stats">
                      <span>ATK {stats.atk}</span>
                      <span>DEF {stats.def}</span>
                      <span>SPD {stats.spd}</span>
                    </div>
                    <div className="squad-reserve-tags">
                      <span>LVL {heroLevels[hero.id] || 1}</span>
                      {gear && <span>{gear.name[lang]}</span>}
                      {wouldPair && <span>{lang === 'fr' ? 'Synergie +' : 'Synergy +'}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#39c5bb' }}>{getTranslation(lang, 'teamDeployTitle')}</h3>
                <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>{getTranslation(lang, 'teamDeploySub')}</p>
              </div>
              <button
                onClick={autoEquipRelics}
                className="btn-retro"
                title={lang === 'fr' ? 'Equipe automatiquement les meilleures reliques disponibles sur l equipe active.' : 'Automatically equip the best available relics on the active team.'}
                style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(57, 197, 187, 0.1)', borderColor: '#39c5bb', color: '#39c5bb' }}
              >
                {getTranslation(lang, 'btnAutoEquip')}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
              {[0, 1, 2].map((idx) => {
                const id = activeTeam[idx];
                const hero = HEROES_DB.find(h => h.id === id);
                return (
                  <div key={idx} style={{
                    height: '80px',
                    border: hero ? `2px solid ${hero.primaryColor}` : '2px dashed #444',
                    background: hero ? 'rgba(0,0,0,0.3)' : 'transparent',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}>
                    {hero ? (
                      <>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{hero.name}</div>
                        <span style={{ fontSize: '10px', color: '#888' }}>{hero.universe}</span>
                        <button
                          onClick={() => toggleActiveHero(hero.id)}
                          style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#555', fontSize: '12px' }}>{getTranslation(lang, 'emptySlot')}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Synergies */}
            <div style={{
              margin: '15px 0 25px 0',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid #333',
              borderRadius: '4px'
            }}>
              <div style={{ fontSize: '12px', color: '#ffea00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {getTranslation(lang, 'synergiesTitle')}
              </div>
              {(() => {
                const deployedHeroObjects = HEROES_DB.filter(h => activeTeam.includes(h.id));
                const activeCategoriesCount = deployedHeroObjects.reduce((acc, h) => {
                  acc[h.category] = (acc[h.category] || 0) + 1;
                  return acc;
                }, {});
                const activeTeamSynergies = SYNERGIES_DB.filter(syn => (activeCategoriesCount[syn.category] || 0) >= 2);

                if (activeTeamSynergies.length === 0) {
                  return <div style={{ fontSize: '11px', color: '#666' }}>{getTranslation(lang, 'noSynergies')}</div>;
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeTeamSynergies.map(syn => (
                      <div key={syn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2ecc71' }}>✔ {getTranslation(lang, syn.key)}</span>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>{getTranslation(lang, syn.descKey)}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px' }}>{getTranslation(lang, 'reserves')}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map((hero) => {
                const isActive = activeTeam.includes(hero.id);
                return (
                  <div
                    key={hero.id}
                    onClick={() => toggleActiveHero(hero.id)}
                    style={{
                      padding: '10px',
                      background: isActive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255,255,255,0.01)',
                      border: isActive ? '2px solid #2ecc71' : '1px solid #333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{hero.name}</div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>{hero.universe}</div>
                    <span style={{ fontSize: '9px', padding: '1px 4px', background: isActive ? '#2ecc71' : '#555', color: '#fff', borderRadius: '2px' }}>
                      {isActive ? getTranslation(lang, 'deployed') : getTranslation(lang, 'standby')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </>
        )}

        {activeTab === 'collection' && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#ffeb3b' }}>
                  {lang === 'fr' ? 'COLLECTION / ENCYCLOPEDIE' : 'COLLECTION / ENCYCLOPEDIA'}
                </h3>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  {lang === 'fr' ? 'Vue claire de ce qui est debloque, stabilise et exploitable en combat.' : 'Clear view of what is unlocked, stabilized, and usable in battle.'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: lang === 'fr' ? 'Heros' : 'Heroes', value: `${collectionSummary.heroes}/${collectionSummary.totalHeroes}`, color: '#39c5bb' },
                  { label: lang === 'fr' ? 'Mondes' : 'Worlds', value: completedStages.length, color: '#2ecc71' },
                  { label: 'Passifs', value: collectionBonusCount, color: '#ffeb3b' },
                  { label: 'Rang', value: metaRank, color: '#ff8c00' }
                ].map(card => (
                  <div key={card.label} style={{ minWidth: '92px', padding: '8px 10px', background: `${card.color}12`, border: `1px solid ${card.color}55`, borderRadius: '4px' }}>
                    <div style={{ fontSize: '9px', color: '#aaa', textTransform: 'uppercase' }}>{card.label}</div>
                    <strong style={{ color: card.color, fontSize: '14px' }}>{card.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '14px', border: '1px solid rgba(255,235,59,0.18)', background: 'rgba(255,235,59,0.04)', borderRadius: '5px' }}>
                <strong style={{ color: '#ffeb3b', fontSize: '11px', textTransform: 'uppercase' }}>
                  {lang === 'fr' ? 'Collections de franchise' : 'Franchise collections'}
                </strong>
                <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
                  {visibleCollectionProgress.length === 0 && (
                    <div style={{ padding: '9px', background: 'rgba(57,197,187,0.08)', border: '1px solid rgba(57,197,187,0.25)', borderRadius: '4px', color: '#9fc', fontSize: '10px', lineHeight: 1.35 }}>
                      {lang === 'fr'
                        ? 'Collections DLC masquees en mode base OC.'
                        : 'DLC collections are hidden in OC base mode.'}
                    </div>
                  )}
                  {visibleCollectionProgress.map(collection => {
                    const ratio = collection.total ? collection.completed / collection.total : 0;
                    const partialText = collection.hiddenCount > 0
                      ? (lang === 'fr' ? `${collection.hiddenCount} DLC masque(s)` : `${collection.hiddenCount} hidden DLC`)
                      : mediaFilter !== 'all'
                        ? (lang === 'fr' ? `${collection.fullCompleted}/${collection.fullTotal} actifs hors filtre` : `${collection.fullCompleted}/${collection.fullTotal} active outside filter`)
                        : '';
                    return (
                      <div key={collection.id} style={{ padding: '9px', border: collection.complete ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.08)', background: collection.complete ? 'rgba(46,204,113,0.06)' : 'rgba(0,0,0,0.16)', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ color: collection.complete ? '#2ecc71' : '#ddd', fontSize: '11px', fontWeight: 'bold' }}>{collection.title[lang]}</span>
                          <span style={{ color: '#ffeb3b', fontSize: '10px' }}>{collection.completed}/{collection.total}</span>
                        </div>
                        {partialText && (
                          <div style={{ fontSize: '9px', color: '#ff8c00', marginTop: '4px' }}>
                            {partialText}
                          </div>
                        )}
                        <div style={{ height: '4px', background: '#111', borderRadius: '4px', overflow: 'hidden', margin: '6px 0' }}>
                          <div style={{ width: `${Math.round(ratio * 100)}%`, height: '100%', background: collection.complete ? '#2ecc71' : '#ffeb3b' }} />
                        </div>
                        <div style={{ fontSize: '9px', color: '#aaa', lineHeight: 1.35 }}>{collection.bonus[lang]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '14px', border: '1px solid rgba(57,197,187,0.2)', background: 'rgba(57,197,187,0.04)', borderRadius: '5px' }}>
                <strong style={{ color: '#39c5bb', fontSize: '11px', textTransform: 'uppercase' }}>
                  {lang === 'fr' ? 'Memoire unifiee' : 'Unified memory'}
                </strong>
                <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
                  {[
                    { label: lang === 'fr' ? 'Objectif suivant' : 'Next goal', value: nextProgressGoal, color: '#ffeb3b' },
                    { label: lang === 'fr' ? 'Niveaux heros total' : 'Total hero levels', value: totalHeroLevels, color: '#9b59b6' },
                    { label: lang === 'fr' ? 'Ancrage escouade' : 'Squad anchor', value: `${squadReadiness}% / ${squadGrade}`, color: '#2ecc71' },
                    { label: lang === 'fr' ? 'Resonance escouade' : 'Squad resonance', value: squadFocus, color: '#39c5bb' }
                  ].map(entry => (
                    <div key={entry.label} style={{ padding: '9px', background: `${entry.color}10`, border: `1px solid ${entry.color}44`, borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#aaa', textTransform: 'uppercase' }}>{entry.label}</div>
                      <div style={{ fontSize: '11px', color: '#fff', lineHeight: 1.35 }}>{entry.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
              {visibleCollectionUniverses.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '18px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.18)', borderRadius: '5px', color: '#aaa', fontSize: '11px', lineHeight: 1.45 }}>
                  {lang === 'fr'
                    ? 'Aucun univers visible avec ce filtre. Change le filtre media ou reactive des univers dans ADMIN.'
                    : 'No universe visible with this filter. Change the media filter or reactivate worlds in ADMIN.'}
                </div>
              )}
              {visibleCollectionUniverses.map(universe => {
                const lore = LORE_DB[universe];
                const stageId = UNIVERSE_TO_STAGE_ID[universe];
                const cleared = !stageId || completedStages.includes(stageId);
                const heroes = HEROES_DB.filter(hero => hero.universe === universe);
                const activeBosses = [
                  ...(ENEMIES_DB[universe]?.bosses || []),
                  ENEMIES_DB[universe]?.worldBoss
                ].filter(Boolean).filter(enemy => !isAssetDisabled('enemies', getEnemyAdminKey(universe, enemy)));
                const boss = activeBosses[activeBosses.length - 1] || activeBosses[0];
                const battleItems = getBattleItemsForUniverse(universe).filter(item => !isAssetDisabled('gear', item.id));
                return (
                  <button
                    key={universe}
                    type="button"
                    onClick={() => { setSelectedCollectionUniverse(universe); sound.playSfx('coin'); }}
                    title={lang === 'fr' ? `Ouvre le dossier detaille de l univers ${universe}.` : `Open the detailed file for ${universe}.`}
                    style={{
                      padding: '12px',
                      border: cleared ? '1px solid rgba(46,204,113,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      background: cleared ? 'rgba(46,204,113,0.05)' : 'rgba(0,0,0,0.18)',
                      borderRadius: '5px',
                      color: 'inherit',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', marginBottom: '7px' }}>
                      <strong style={{ color: cleared ? '#2ecc71' : '#ddd', fontSize: '12px' }}>{lore.title[lang]}</strong>
                      <span style={{ fontSize: '8px', color: '#aaa', border: '1px solid #333', padding: '1px 5px', borderRadius: '3px' }}>{getMediaTypeLabel(lore.mediaType)}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: cleared ? '#9dffba' : '#777', marginBottom: '8px' }}>
                      {cleared ? (lang === 'fr' ? 'STABILISE' : 'STABILIZED') : (lang === 'fr' ? 'A STABILISER' : 'TO STABILIZE')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '8px' }}>
                      {heroes.length} {lang === 'fr' ? 'heros indexes' : 'indexed heroes'} | {boss ? boss.name : 'Boss ?'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {heroes.slice(0, 4).map(hero => (
                        <span key={hero.id} style={{ fontSize: '8px', color: '#fff', border: `1px solid ${hero.primaryColor}66`, background: `${hero.primaryColor}1a`, padding: '1px 5px', borderRadius: '3px' }}>{hero.name}</span>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gap: '3px' }}>
                      {battleItems.map(item => (
                        <div key={item.id} style={{ fontSize: '8px', color: '#cfcfcf', lineHeight: 1.25, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <img
                            src={getItemSpriteSrc(item)}
                            alt=""
                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            style={{ width: '16px', height: '16px', objectFit: 'contain', imageRendering: 'pixelated' }}
                          />
                          <span style={{ color: item.color, fontWeight: 'bold' }}>{item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : 'ITEM'}</span> {item.name[lang]}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '8px', color: '#39c5bb', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Ouvrir dossier univers' : 'Open universe file'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Inventory & Equipment */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.2fr', gap: '20px' }}>
            {/* Recruited list */}
            <div className="glass-panel" style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#39c5bb' }}>{getTranslation(lang, 'equipTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {HEROES_DB.filter(h => unlockedHeroes.includes(h.id)).map(h => {
                  const isSelected = h.id === selectedHeroId;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHeroId(h.id)}
                      style={{
                        padding: '10px',
                        background: isSelected ? 'rgba(57,197,187,0.12)' : 'rgba(0,0,0,0.2)',
                        border: isSelected ? '1px solid #39c5bb' : '1px solid #222',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{h.name}</div>
                      <span style={{ fontSize: '10px', color: '#888' }}>{h.universe}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory gear details */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              {selectedHero && (
                <>
                  <h3 style={{ margin: '0 0 12px 0', color: selectedHero.primaryColor }}>
                    {selectedHero.name.toUpperCase()} GEAR SLOTS
                  </h3>

                  {/* Equipped summary */}
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    {/* Weapon slot */}
                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px dashed #333' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{getTranslation(lang, 'weaponRelic')}</div>
                      {equippedGear[selectedHero.id] ? (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', margin: '4px 0' }}>
                            {getEquippedGearName(equippedGear[selectedHero.id])}
                          </div>
                          {selectedEquippedGear && (
                            <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '6px' }}>
                              {formatBoostText(selectedEquippedGear.boost)}<br />
                              {getGearLore(selectedEquippedGear)}
                            </div>
                          )}
                          <button onClick={() => unequipItem(selectedHero.id)} className="btn-retro" title={lang === 'fr' ? 'Retire cette relique du heros et la remet dans l inventaire.' : 'Remove this relic from the hero and return it to inventory.'} style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>AUCUNE RELIQUE</div>
                      )}
                    </div>

                    {/* Event item slot */}
                    <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px dashed #333' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{getTranslation(lang, 'eventItem')}</div>
                      {equippedEventItems[selectedHero.id] ? (
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px', margin: '4px 0' }}>
                            {selectedEquippedEvent?.name[lang]}
                          </div>
                          {selectedEquippedEvent && (
                            <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginBottom: '6px' }}>
                              {getEventLore(selectedEquippedEvent)}
                            </div>
                          )}
                          <button onClick={() => unequipEventItem(selectedHero.id)} className="btn-retro" title={lang === 'fr' ? 'Retire cet objet evenementiel du heros.' : 'Remove this event item from the hero.'} style={{ fontSize: '10px', padding: '3px 8px', borderColor: '#e74c3c', color: '#e74c3c' }}>
                            {getTranslation(lang, 'unequipBtn')}
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>AUCUN OBJET EVENEMENT</div>
                      )}
                    </div>
                  </div>

                  {/* List of items in Inventory */}
                  <h4 style={{ margin: '0 0 10px 0', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '13px' }}>
                    {getTranslation(lang, 'inventoryTitle')}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {inventoryGroups.map(group => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => setInventoryFilter(group.id)}
                        className="btn-retro"
                        title={lang === 'fr' ? `Filtre l inventaire sur: ${group.label.fr}.` : `Filter inventory to: ${group.label.en}.`}
                        style={{
                          fontSize: '9px',
                          padding: '5px 7px',
                          borderColor: inventoryFilter === group.id ? '#ffea00' : '#444',
                          color: inventoryFilter === group.id ? '#ffea00' : '#aaa'
                        }}
                      >
                        {group.label[lang]} ({group.count})
                      </button>
                    ))}
                  </div>
                  {visibleGearItems.length === 0 && visibleEventItems.length === 0 && visibleNexusItems.length === 0 ? (
                    <div style={{ color: '#555', fontSize: '12px' }}>{getTranslation(lang, 'noItems')}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '35vh', overflowY: 'auto' }}>
                      {/* Weapon Gear */}
                      {visibleGearItems.map(item => {
                        const isEquippedElsewhere = Object.keys(equippedGear).some(id => equippedGear[id] === item.id);
                        const isEquippedOnSelf = equippedGear[selectedHero.id] === item.id;
                        
                        return (
                          <div key={item.id} style={{
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{item.name[lang]}</div>
                              <span style={{ fontSize: '10px', color: '#888' }}>
                                Univers: {item.universe} | Boost: {formatBoostText(item.boost)}
                              </span>
                              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, marginTop: '3px', maxWidth: '520px' }}>
                                {getGearLore(item)}
                              </div>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipItem(selectedHero.id, item.id)}
                                disabled={isEquippedElsewhere}
                                className="btn-retro"
                                title={isEquippedElsewhere
                                  ? (lang === 'fr' ? 'Cette relique est deja equipee par un autre heros.' : 'This relic is already equipped by another hero.')
                                  : (lang === 'fr' ? 'Equipe cette relique sur le heros selectionne.' : 'Equip this relic on the selected hero.')}
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                              >
                                {isEquippedElsewhere ? 'ASSIGNEE' : getTranslation(lang, 'equipBtn')}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Event Items */}
                      {visibleEventItems.map(item => {
                        // Event items match hero universe to be equipped
                        const matchesUniverse = item.id === EVENT_ITEMS_DB[selectedHero.universe]?.id;
                        const isEquippedOnSelf = equippedEventItems[selectedHero.id] === item.id;

                        return (
                          <div key={item.id} style={{
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderColor: matchesUniverse ? '#ff4500' : '#222'
                          }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff4500' }}>
                                🌟 {item.name[lang]}
                              </div>
                              <span style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, display: 'block', maxWidth: '520px' }}>
                                {getEventLore(item)}
                              </span>
                            </div>

                            {!isEquippedOnSelf && (
                              <button
                                onClick={() => equipEventItem(selectedHero.id, item.id)}
                                disabled={!matchesUniverse}
                                className="btn-retro"
                                title={matchesUniverse
                                  ? (lang === 'fr' ? 'Equipe cet objet evenementiel compatible sur le heros selectionne.' : 'Equip this compatible event item on the selected hero.')
                                  : (lang === 'fr' ? 'Objet incompatible: il ne correspond pas a l univers de ce heros.' : 'Incompatible item: it does not match this hero universe.')}
                                style={{ fontSize: '11px', padding: '4px 10px', borderColor: matchesUniverse ? '#ff4500' : '#444', color: matchesUniverse ? '#ff4500' : '#444' }}
                              >
                                {matchesUniverse ? getTranslation(lang, 'equipBtn') : 'LORE INCOMPATIBLE'}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {visibleNexusItems.map(item => (
                        <div key={item.id} style={{
                          padding: '8px 12px',
                          background: 'rgba(255,235,59,0.04)',
                          border: '1px solid rgba(255,235,59,0.25)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ffeb3b' }}>
                              {item.name[lang]}
                            </div>
                            <span style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.35, display: 'block', maxWidth: '560px' }}>
                              {item.desc[lang]}
                            </span>
                          </div>
                          <span style={{ fontSize: '9px', color: '#ffeb3b', border: '1px solid rgba(255,235,59,0.35)', padding: '3px 6px', borderRadius: '3px' }}>
                            NEXUS
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Relic Fusion Station */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ff9900', textTransform: 'uppercase', textShadow: '0 0 3px #ff9900' }}>
                      ⚙️ {lang === 'fr' ? 'NOYAU DE FUSION DE RELIQUES' : 'RELIC FUSION CORE'}
                    </h4>
                    {(() => {
                      const counts = {};
                      inventory.forEach(invId => {
                        if (!invId.endsWith('_plus')) {
                          counts[invId] = (counts[invId] || 0) + 1;
                        }
                      });
                      const fusables = EQUIP_ITEMS_DB.filter(it => !isAssetDisabled('gear', it.id) && (counts[it.id] || 0) >= 3);

                      if (fusables.length === 0) {
                        return (
                          <div style={{ fontSize: '11px', color: '#666', background: 'rgba(0,0,0,0.2)', padding: '10px', border: '1px dashed #222', borderRadius: '4px' }}>
                            {lang === 'fr' ? 'Accumulez 3 exemplaires de la même relique standard dans votre inventaire pour réaliser une fusion (+100% de bonus).' : 'Accumulate 3 copies of the same standard relic in your inventory to perform a fusion (+100% bonus boosts).'}
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {fusables.map(item => {
                            const copies = counts[item.id];
                            const canAfford = gold >= 150;
                            return (
                              <div key={item.id} style={{
                                padding: '10px 14px',
                                background: 'rgba(255, 153, 0, 0.03)',
                                border: '1px solid rgba(255, 153, 0, 0.2)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff9900' }}>
                                    {item.name[lang]} ({copies} indexes)
                                  </div>
                                  <span style={{ fontSize: '10px', color: '#aaa' }}>
                                    Cible: {item.name[lang]} + (echo renforce)
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleFuseRelic(item.id)}
                                  disabled={!canAfford}
                                  className={`btn-retro ${!canAfford ? 'btn-disabled' : ''}`}
                                  title={lang === 'fr'
                                    ? 'Consomme 3 exemplaires de cette relique et 150 Or pour creer une version amelioree.'
                                    : 'Consume 3 copies of this relic and 150 Gold to create an upgraded version.'}
                                  style={{
                                    fontSize: '11px',
                                    padding: '5px 12px',
                                    borderColor: '#ff9900',
                                    color: '#ff9900',
                                    background: 'rgba(255, 153, 0, 0.1)'
                                  }}
                                >
                                  {lang === 'fr' ? `FUSIONNER (🪙 150)` : `FUSE (🪙 150)`}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Event Shop */}
        {activeTab === 'shop' && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#e74c3c' }}>
              {getTranslation(lang, 'tabShop')}
            </h3>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '20px' }}>
              {lang === 'fr' ? 'Depense tes jetons evenement pour acheter des prototypes, reliques rares et declencheurs de combat synchronises au Nexus.' : 'Spend Event Tokens on prototypes, rare relics, and combat triggers synchronized by the Nexus.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
              {visibleEventShopItems.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '18px', border: '1px solid rgba(231,76,60,0.22)', background: 'rgba(231,76,60,0.045)', borderRadius: '5px', color: '#ffb1a8', fontSize: '11px', lineHeight: 1.45 }}>
                  {lang === 'fr'
                    ? 'Aucun prototype disponible dans cette rotation. Verifie les univers masques dans ADMIN pour reouvrir le stock Nexus.'
                    : 'No prototype available in this rotation. Check hidden worlds in ADMIN to reopen Nexus stock.'}
                </div>
              )}
              {visibleEventShopItems.map(item => {
                const owned = inventory.includes(item.id);
                const visualUniverse = getShopItemUniverse(item);
                const accent = getShopItemAccent(item);
                const backdropSrc = visualUniverse ? getOpenAiBackdropSrc(visualUniverse, 'Smash') || getOpenAiBackdropSrc(visualUniverse, 'RPG') || getOpenAiBackdropSrc(visualUniverse, 'Tactics') : null;
                const canBuy = eventTokens >= item.tokenCost && !owned;
                return (
                  <div key={item.id} style={{
                    padding: 0,
                    background: owned ? 'rgba(46,204,113,0.045)' : 'rgba(255,255,255,0.018)',
                    border: `1px solid ${owned ? '#2ecc71' : `${accent}55`}`,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '322px',
                    boxShadow: owned ? '0 0 18px rgba(46,204,113,0.12)' : `0 0 18px ${accent}18`
                  }}>
                    <div style={{
                      position: 'relative',
                      minHeight: '142px',
                      backgroundImage: backdropSrc
                        ? `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.76)), url(${backdropSrc})`
                        : `radial-gradient(circle at 50% 34%, ${accent}66, rgba(0,0,0,0.1) 34%, rgba(0,0,0,0.85) 72%), linear-gradient(135deg, ${accent}28, #06050d)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderBottom: `1px solid ${accent}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                        opacity: 0.55
                      }} />
                      <div style={{
                        position: 'relative',
                        width: '84px',
                        height: '84px',
                        border: `2px solid ${accent}`,
                        background: 'rgba(0,0,0,0.68)',
                        boxShadow: `0 0 18px ${accent}77, inset 0 0 18px ${accent}22`,
                        transform: 'rotate(45deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          transform: 'rotate(-45deg)',
                          color: '#fff',
                          fontSize: getShopItemGlyph(item).length > 5 ? '10px' : '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          textShadow: `0 0 8px ${accent}`,
                          maxWidth: '68px',
                          lineHeight: 1.05
                        }}>
                          {getShopItemGlyph(item)}
                        </span>
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '9px',
                        left: '9px',
                        padding: '3px 7px',
                        border: `1px solid ${accent}88`,
                        background: 'rgba(0,0,0,0.7)',
                        color: accent,
                        borderRadius: '3px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {item.isCombatEvent ? (lang === 'fr' ? 'Evenement' : 'Event') : (lang === 'fr' ? 'Relique' : 'Relic')}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '9px',
                        right: '9px',
                        padding: '4px 8px',
                        border: '1px solid rgba(231,76,60,0.8)',
                        background: 'rgba(0,0,0,0.74)',
                        color: '#ffb1a8',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        TICKETS {item.tokenCost}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '9px',
                        right: '9px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#ddd', fontSize: '9px', textTransform: 'uppercase' }}>
                          {visualUniverse || 'Nexus Prototype'}
                        </span>
                        <span style={{ color: owned ? '#2ecc71' : '#aaa', fontSize: '9px', border: '1px solid rgba(255,255,255,0.16)', padding: '2px 5px', borderRadius: '3px' }}>
                          {owned ? 'INDEXE' : (canBuy ? (lang === 'fr' ? 'OUVERT' : 'OPEN') : (lang === 'fr' ? 'SCELLE' : 'SEALED'))}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: accent, lineHeight: 1.25 }}>
                          {item.name[lang]}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', marginTop: '6px', lineHeight: 1.35 }}>
                        {getShopItemSummary(item)}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <span style={{ color: '#ddd', fontSize: '9px', border: '1px solid rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '3px' }}>
                          {item.isCombatEvent ? 'Combat' : formatBoostText(item.boost || {})}
                        </span>
                        <span style={{ color: accent, fontSize: '9px', border: `1px solid ${accent}66`, padding: '2px 6px', borderRadius: '3px' }}>
                          {visualUniverse ? getMediaTypeLabel(LORE_DB[visualUniverse]?.mediaType) : 'Nexus'}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '0 12px 12px' }}>
                      <button
                        onClick={() => buyShopItem(item)}
                        disabled={!canBuy}
                        className="btn-retro"
                        title={owned
                          ? (lang === 'fr' ? 'Objet deja possede.' : 'Item already owned.')
                          : canBuy
                            ? (lang === 'fr' ? `Achete cet objet pour ${item.tokenCost} tickets evenement.` : `Buy this item for ${item.tokenCost} event tickets.`)
                            : (lang === 'fr' ? `Tickets insuffisants: il faut ${item.tokenCost} tickets evenement.` : `Not enough tickets: requires ${item.tokenCost} event tickets.`)}
                        style={{
                          width: '100%',
                          fontSize: '11px',
                          padding: '8px 12px',
                          borderColor: owned ? '#2ecc71' : canBuy ? accent : '#444',
                          color: owned ? '#2ecc71' : canBuy ? accent : '#666',
                          background: canBuy ? `${accent}14` : 'rgba(0,0,0,0.22)'
                        }}
                      >
                        {owned
                          ? 'INDEXE'
                          : canBuy
                            ? (lang === 'fr' ? 'ACHETER' : 'BUY')
                            : (lang === 'fr' ? 'JETONS INSUFFISANTS' : 'NEED TOKENS')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin: Universe visibility controls */}
        {activeTab === 'admin' && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#ff4500' }}>
              {lang === 'fr' ? 'PANNEAU ADMIN - VISIBILITE DES UNIVERS' : 'ADMIN PANEL - UNIVERSE VISIBILITY'}
            </h3>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '16px', lineHeight: 1.45 }}>
              {lang === 'fr'
                ? 'Masque un univers pour le retirer des missions, portails, roster, codex et boutiques sans supprimer ses donnees. Utile pour DLC, rotation saisonniere ou retrait temporaire.'
                : 'Hide a universe to remove it from missions, portals, roster, codex, and shops without deleting its data. Useful for DLC, seasonal rotation, or temporary removal.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{lang === 'fr' ? 'DLC visibles' : 'Visible DLC'}</div>
                <strong style={{ color: '#2ecc71', fontSize: '20px' }}>{visibleUniverseCount}</strong>
              </div>
              <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{lang === 'fr' ? 'DLC masques' : 'Hidden DLC'}</div>
                <strong style={{ color: '#e74c3c', fontSize: '20px' }}>{hiddenUniverseCount}</strong>
              </div>
              <div style={{ padding: '10px', border: '1px solid #333', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{lang === 'fr' ? 'Missions actives' : 'Active missions'}</div>
                <strong style={{ color: '#39c5bb', fontSize: '20px' }}>{ADMIN_VISIBLE_STAGES.filter(stage => stage.id !== 38).length}</strong>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1fr) minmax(260px, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ padding: '12px', border: '1px solid rgba(57,197,187,0.24)', background: 'rgba(57,197,187,0.055)', borderRadius: '5px' }}>
                <div style={{ color: '#39c5bb', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
                  {lang === 'fr' ? 'Diagnostic acces jeu' : 'Game Access Diagnostic'}
                </div>
                <div style={{ display: 'grid', gap: '6px', fontSize: '10px', color: '#d8fffb', lineHeight: 1.35 }}>
                  <span>{lang === 'fr' ? 'Base OC' : 'OC base'}: {adminDiagnostics.ocHeroes} {lang === 'fr' ? 'heros' : 'heroes'} / {adminDiagnostics.ocEnemies} {lang === 'fr' ? 'menaces' : 'threats'} / {adminDiagnostics.ocItems} items.</span>
                  <span>{lang === 'fr' ? 'Missions visibles' : 'Visible missions'}: {adminDiagnostics.unlockedStages}/{adminDiagnostics.visibleStages} {lang === 'fr' ? 'jouables maintenant' : 'playable now'}.</span>
                  <span>{lang === 'fr' ? 'Verrous actifs' : 'Active locks'}: {adminDiagnostics.lockedStages} {lang === 'fr' ? 'missions demandent progression/roster' : 'missions need progress/roster'}.</span>
                  <span>{lang === 'fr' ? 'Assets desactives' : 'Disabled assets'}: {adminDiagnostics.disabledAssets}.</span>
                </div>
              </div>
              <div style={{ padding: '12px', border: '1px solid rgba(255,235,59,0.2)', background: 'rgba(255,235,59,0.04)', borderRadius: '5px' }}>
                <div style={{ color: '#ffeb3b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
                  {lang === 'fr' ? 'Modes et DLC' : 'Modes and DLC'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', marginBottom: '8px' }}>
                  {adminDiagnostics.modes.map(entry => (
                    <div key={entry.mode} style={{ padding: '7px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.18)', borderRadius: '4px' }}>
                      <div style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>{entry.mode}</div>
                      <div style={{ color: entry.unlocked > 0 ? '#2ecc71' : '#ff8c00', fontSize: '9px' }}>{entry.unlocked}/{entry.visible} {lang === 'fr' ? 'jouables' : 'playable'}</div>
                    </div>
                  ))}
                </div>
                <div style={{ color: '#aaa', fontSize: '10px', lineHeight: 1.35 }}>
                  {lang === 'fr'
                    ? `DLC actifs ${adminDiagnostics.dlcVisible}, DLC masques ${adminDiagnostics.dlcHidden}. Les collections et arcs n affichent que les univers visibles et debloques.`
                    : `Active DLC ${adminDiagnostics.dlcVisible}, hidden DLC ${adminDiagnostics.dlcHidden}. Collections and arcs only show visible, unlocked universes.`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              <input
                value={adminUniverseSearch}
                onChange={(event) => setAdminUniverseSearch(event.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher un univers...' : 'Search universe...'}
                style={{
                  flex: '1 1 220px',
                  minWidth: 0,
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid #444',
                  color: '#fff',
                  padding: '9px 10px',
                  borderRadius: '4px',
                  fontFamily: '"Share Tech Mono", monospace'
                }}
              />
              <button onClick={hideAllDlcUniverses} className="btn-retro" title={lang === 'fr' ? 'Masque tous les univers franchise et garde seulement le jeu de base OC.' : 'Hide every franchise universe and keep only base OC content.'} style={{ fontSize: '11px', padding: '8px 12px', borderColor: '#39c5bb', color: '#39c5bb' }}>
                {lang === 'fr' ? 'BASE OC' : 'OC BASE'}
              </button>
              <button onClick={showAllDlcUniverses} className="btn-retro" title={lang === 'fr' ? 'Reactive tous les DLC franchise.' : 'Reactivate every franchise DLC.'} style={{ fontSize: '11px', padding: '8px 12px', borderColor: '#2ecc71', color: '#2ecc71' }}>
                {lang === 'fr' ? 'ACTIVER DLC' : 'ENABLE DLC'}
              </button>
              <button onClick={showAllUniverses} className="btn-retro" title={lang === 'fr' ? 'Reactive absolument tous les univers masques.' : 'Reactivate every hidden universe.'} style={{ fontSize: '11px', padding: '8px 12px', borderColor: '#777', color: '#ddd' }}>
                {lang === 'fr' ? 'TOUT AFFICHER' : 'SHOW ALL'}
              </button>
              {['game', 'movie', 'series', 'manga', 'music'].map(mediaType => {
                const targets = getMediaTypeTargets(mediaType);
                const hiddenCount = getMediaTypeHiddenCount(mediaType);
                const allHidden = targets.length > 0 && hiddenCount === targets.length;
                return (
                  <button
                    key={mediaType}
                    onClick={() => allHidden ? showUniversesByMediaType(mediaType) : hideUniversesByMediaType(mediaType)}
                    className="btn-retro"
                    title={allHidden
                      ? (lang === 'fr' ? `Reactive tous les univers ${getMediaTypeLabel(mediaType)}.` : `Reactivate all ${getMediaTypeLabel(mediaType)} universes.`)
                      : (lang === 'fr' ? `Masque tous les univers ${getMediaTypeLabel(mediaType)}.` : `Hide all ${getMediaTypeLabel(mediaType)} universes.`)}
                    style={{
                      fontSize: '10px',
                      padding: '8px 10px',
                      borderColor: allHidden ? '#2ecc71' : '#555',
                      color: allHidden ? '#2ecc71' : '#bbb'
                    }}
                  >
                    {allHidden ? (lang === 'fr' ? 'AFFICHER ' : 'SHOW ') : (lang === 'fr' ? 'MASQUER ' : 'HIDE ')}
                    {getMediaTypeLabel(mediaType).toUpperCase()} ({hiddenCount}/{targets.length})
                  </button>
                );
              })}
            </div>

            <div style={{ maxHeight: '58vh', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {adminUniverseRows.map(row => {
                const isOpen = Boolean(expandedAdminUniverses[row.universe]);
                const renderAssetRow = ({ key, title, subtitle, hidden, onToggle, spriteInfo }) => (
                  <div key={key} style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(160px, 1fr) minmax(110px, auto) auto',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '7px 8px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '4px',
                    background: hidden ? 'rgba(231,76,60,0.08)' : 'rgba(255,255,255,0.025)'
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: hidden ? '#ffb3aa' : '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                      <div style={{ fontSize: '9px', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
                    </div>
                    <button onClick={onToggle} className="btn-retro" title={hidden ? (lang === 'fr' ? 'Reactive cet element dans l application.' : 'Reactivate this element in the app.') : (lang === 'fr' ? 'Masque cet element sans supprimer ses donnees.' : 'Hide this element without deleting its data.')} style={assetToggleStyle(hidden)}>
                      {hidden ? (lang === 'fr' ? 'ACTIVER' : 'ENABLE') : (lang === 'fr' ? 'MASQUER' : 'DISABLE')}
                    </button>
                    {spriteInfo ? (
                      <button
                        type="button"
                        title={spriteInfo.ready ? (lang === 'fr' ? 'Sprite OpenAI disponible' : 'OpenAI sprite available') : (lang === 'fr' ? 'Pas encore de sprite OpenAI' : 'No OpenAI sprite yet')}
                        onClick={() => openSpritePreview(spriteInfo, title, subtitle)}
                        disabled={!spriteInfo.ready}
                        style={spriteButtonStyle(spriteInfo.ready)}
                      >
                        IA
                      </button>
                    ) : <span style={{ width: '24px' }} />}
                  </div>
                );
                const sectionStyle = {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '8px',
                  marginTop: '8px'
                };
                return (
                  <div
                    key={row.universe}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '4px',
                      border: `1px solid ${row.hidden ? 'rgba(231,76,60,0.45)' : 'rgba(57,197,187,0.28)'}`,
                      background: row.hidden ? 'rgba(231,76,60,0.07)' : 'rgba(57,197,187,0.04)'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto minmax(180px, 1.2fr) minmax(170px, 1fr) auto',
                      gap: '10px',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => toggleAdminUniverseOpen(row.universe)}
                        className="btn-retro"
                        title={isOpen ? (lang === 'fr' ? 'Referme les details de cet univers.' : 'Collapse this universe details.') : (lang === 'fr' ? 'Ouvre les details admin de cet univers.' : 'Expand this universe admin details.')}
                        style={{ fontSize: '11px', padding: '5px 8px', minWidth: '34px', borderColor: isOpen ? '#39c5bb' : '#444', color: isOpen ? '#39c5bb' : '#aaa' }}
                      >
                        {isOpen ? 'v' : '>'}
                      </button>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: row.hidden ? '#ffb3aa' : '#d8fffb' }}>{row.lore?.title?.[lang] || row.universe}</div>
                        <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>
                          {row.universe} - {row.baseGame ? (lang === 'fr' ? 'JEU DE BASE OC' : 'OC BASE GAME') : `DLC - ${getMediaTypeLabel(row.lore?.mediaType)}`}
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#aaa', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{row.heroes.length} {lang === 'fr' ? 'heros' : 'heroes'}</span>
                        <span>{row.enemyCount} {lang === 'fr' ? 'ennemis' : 'enemies'}</span>
                        <span>{row.gearCount} gear</span>
                        <span>{row.stageCount} stages</span>
                        {row.disabledCount > 0 && <span style={{ color: '#e74c3c' }}>{row.disabledCount} off</span>}
                      </div>
                      {row.baseGame ? (
                        <span
                          title={lang === 'fr' ? 'Le Nexus est le contenu OC de base: il reste actif, seuls ses assets peuvent etre controles.' : 'The Nexus is base OC content: it remains active, only its assets can be controlled.'}
                          style={{ fontSize: '10px', padding: '7px 10px', minWidth: '110px', textAlign: 'center', border: '1px solid #39c5bb', color: '#39c5bb', borderRadius: '4px' }}
                        >
                          {lang === 'fr' ? 'SOCLE OC' : 'OC CORE'}
                        </span>
                      ) : (
                        <button
                          onClick={() => setUniverseHidden(row.universe, !row.hidden)}
                          className="btn-retro"
                          title={row.hidden
                            ? (lang === 'fr' ? 'Reactive ce DLC dans les missions, collections, portails et boutiques.' : 'Reactivate this DLC in missions, collections, portals, and shops.')
                            : (lang === 'fr' ? 'Masque ce DLC dans les missions, collections, portails et boutiques.' : 'Hide this DLC from missions, collections, portals, and shops.')}
                          style={{
                            fontSize: '10px',
                            padding: '7px 10px',
                            minWidth: '110px',
                            borderColor: row.hidden ? '#2ecc71' : '#e74c3c',
                            color: row.hidden ? '#2ecc71' : '#e74c3c'
                          }}
                        >
                          {row.hidden
                            ? (lang === 'fr' ? 'ACTIVER DLC' : 'ENABLE DLC')
                            : (lang === 'fr' ? 'MASQUER DLC' : 'HIDE DLC')}
                        </button>
                      )}
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                        <details open>
                          <summary style={{ color: '#39c5bb', fontSize: '11px', cursor: 'pointer' }}>{lang === 'fr' ? 'Heros' : 'Heroes'} ({row.heroes.length})</summary>
                          <div style={sectionStyle}>
                            {row.heroes.map(hero => {
                              const spriteInfo = getHeroSpriteInfo(hero);
                              return renderAssetRow({
                                key: hero.id,
                                title: hero.name,
                                subtitle: `${hero.id} - ${hero.category}`,
                                hidden: isAssetDisabled('heroes', hero.id),
                                onToggle: () => setAssetDisabled('heroes', hero.id, !isAssetDisabled('heroes', hero.id)),
                                spriteInfo
                              });
                            })}
                          </div>
                        </details>
                        <details>
                          <summary style={{ color: '#e74c3c', fontSize: '11px', cursor: 'pointer', marginTop: '10px' }}>{lang === 'fr' ? 'Ennemis et boss' : 'Enemies and bosses'} ({row.enemies.length})</summary>
                          <div style={sectionStyle}>
                            {row.enemies.map(enemy => {
                              const key = getEnemyAdminKey(row.universe, enemy);
                              const spriteInfo = getEnemySpriteInfo(enemy, row.universe);
                              return renderAssetRow({
                                key,
                                title: enemy.name,
                                subtitle: `${enemy.adminType} - HP ${enemy.hp || '?'}`,
                                hidden: isAssetDisabled('enemies', key),
                                onToggle: () => setAssetDisabled('enemies', key, !isAssetDisabled('enemies', key)),
                                spriteInfo
                              });
                            })}
                          </div>
                        </details>
                        <details>
                          <summary style={{ color: '#ffeb3b', fontSize: '11px', cursor: 'pointer', marginTop: '10px' }}>Gear / shop ({row.gear.length})</summary>
                          <div style={sectionStyle}>
                            {row.gear.map(item => renderAssetRow({
                              key: item.id,
                              title: item.name?.[lang] || item.id,
                              subtitle: item.isBattleItem ? `${item.tier} - ${item.role}` : item.isCombatEvent ? 'event item' : formatBoostText(item.boost || {}),
                              hidden: isAssetDisabled('gear', item.id),
                              onToggle: () => setAssetDisabled('gear', item.id, !isAssetDisabled('gear', item.id)),
                              spriteInfo: getItemSpriteInfo(item)
                            }))}
                          </div>
                        </details>
                        <details>
                          <summary style={{ color: '#9b59b6', fontSize: '11px', cursor: 'pointer', marginTop: '10px' }}>Stages ({row.stages.length})</summary>
                          <div style={sectionStyle}>
                            {row.stages.map(stage => {
                              const key = getStageAdminKey(stage);
                              return renderAssetRow({
                                key,
                                title: stage.displayName?.[lang] || stage.name,
                                subtitle: `#${stage.id} - ${stage.mode} - ${stage.bossName}`,
                                hidden: isAssetDisabled('stages', key),
                                onToggle: () => setAssetDisabled('stages', key, !isAssetDisabled('stages', key)),
                                spriteInfo: { ready: false, src: '' }
                              });
                            })}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedUniverseArchive && (
          <div
            onClick={() => setSelectedCollectionUniverse(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 215,
              background: 'rgba(0,0,0,0.84)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '18px'
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                width: 'min(96vw, 1120px)',
                maxHeight: '92vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(7,6,14,0.98)',
                border: `1px solid ${selectedUniverseArchive.cleared ? 'rgba(46,204,113,0.55)' : 'rgba(255,235,59,0.42)'}`,
                borderRadius: '7px',
                boxShadow: '0 0 34px rgba(57,197,187,0.18)'
              }}
            >
              <div style={{
                padding: '15px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: selectedUniverseArchive.cleared ? 'rgba(46,204,113,0.07)' : 'rgba(255,235,59,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#ffeb3b', fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {lang === 'fr' ? 'Dossier univers / collection' : 'Universe collection file'}
                    </div>
                    <h2 style={{ margin: 0, color: selectedUniverseArchive.cleared ? '#2ecc71' : '#fff', fontSize: '22px' }}>
                      {selectedUniverseArchive.lore?.title?.[lang] || selectedUniverseArchive.universe}
                    </h2>
                    <div style={{ marginTop: '5px', color: '#aaa', fontSize: '11px' }}>
                      {getMediaTypeLabel(selectedUniverseArchive.lore?.mediaType)} / {selectedUniverseArchive.cleared ? (lang === 'fr' ? 'Stabilise' : 'Stabilized') : (lang === 'fr' ? 'A stabiliser' : 'To stabilize')}
                      {selectedUniverseArchive.hidden ? ` / ${lang === 'fr' ? 'Masque admin' : 'Admin hidden'}` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCollectionUniverse(null)}
                    className="btn-retro"
                    title={lang === 'fr' ? 'Ferme le dossier de collection de cet univers.' : 'Close this universe collection file.'}
                    style={{ fontSize: '10px', padding: '7px 11px' }}
                  >
                    {lang === 'fr' ? 'FERMER' : 'CLOSE'}
                  </button>
                </div>
                <p style={{ color: '#d8d8d8', fontSize: '11px', lineHeight: 1.45, margin: '12px 0 0' }}>
                  {selectedUniverseArchive.loreBrief}
                </p>
              </div>

              <div style={{ overflowY: 'auto', padding: '15px', display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {[
                    { label: lang === 'fr' ? 'Heros' : 'Heroes', value: selectedUniverseArchive.heroes.length, color: '#39c5bb' },
                    { label: lang === 'fr' ? 'Ennemis' : 'Enemies', value: selectedUniverseArchive.allEnemies.length, color: '#e74c3c' },
                    { label: lang === 'fr' ? 'Reliques' : 'Relics', value: selectedUniverseArchive.relics.length, color: '#9b59b6' },
                    { label: lang === 'fr' ? 'Artefacts melee' : 'Melee artifacts', value: selectedUniverseArchive.battleItems.length, color: '#ffeb3b' },
                    { label: lang === 'fr' ? 'Missions' : 'Missions', value: selectedUniverseArchive.stages.length, color: '#2ecc71' }
                  ].map(entry => (
                    <div key={entry.label} style={{ padding: '9px', border: `1px solid ${entry.color}44`, background: `${entry.color}10`, borderRadius: '4px' }}>
                      <div style={{ color: '#aaa', fontSize: '9px', textTransform: 'uppercase' }}>{entry.label}</div>
                      <strong style={{ color: entry.color, fontSize: '16px' }}>{entry.value}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid rgba(57,197,187,0.24)', background: 'rgba(57,197,187,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#39c5bb', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Personnages indexes' : 'Indexed characters'}
                    </strong>
                    <div style={{ display: 'grid', gap: '7px', marginTop: '9px' }}>
                      {(selectedUniverseArchive.heroes.length ? selectedUniverseArchive.heroes : []).map(hero => {
                        const unlocked = unlockedHeroes.includes(hero.id);
                        const stats = getHeroStats(hero);
                        return (
                          <div key={hero.id} style={{ padding: '8px', border: `1px solid ${hero.primaryColor}55`, background: `${hero.primaryColor}12`, borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                              <b style={{ color: hero.primaryColor, fontSize: '11px' }}>{hero.name}</b>
                              <span style={{ color: unlocked ? '#2ecc71' : '#777', fontSize: '9px' }}>
                                {unlocked ? (lang === 'fr' ? 'Recrute' : 'Recruited') : (lang === 'fr' ? 'Archive' : 'Archive')}
                              </span>
                            </div>
                            <div style={{ color: '#aaa', fontSize: '9px', marginTop: '4px' }}>
                              {hero.category} / Lv {heroLevels[hero.id] || 1} / HP {stats.hp} ATK {stats.atk} DEF {stats.def}
                            </div>
                            <div style={{ color: '#d0d0d0', fontSize: '9px', lineHeight: 1.35, marginTop: '5px' }}>
                              {getLocalizedText(getCharacterPlaque(hero).breachLore, lang, getCharacterPlaque(hero).dossier?.[lang])}
                            </div>
                          </div>
                        );
                      })}
                      {selectedUniverseArchive.heroes.length === 0 && (
                        <div style={{ color: '#777', fontSize: '10px' }}>
                          {lang === 'fr' ? 'Aucun heros jouable indexe pour cet univers.' : 'No playable hero indexed for this universe.'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '12px', border: '1px solid rgba(231,76,60,0.24)', background: 'rgba(231,76,60,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#e74c3c', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Menaces locales' : 'Local threats'}
                    </strong>
                    <div style={{ display: 'grid', gap: '6px', marginTop: '9px' }}>
                      {selectedUniverseArchive.allEnemies.map((enemy, index) => (
                        <div key={`${enemy.name}-${index}`} style={{ padding: '7px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                          <div style={{ color: enemy.color || '#e74c3c', fontSize: '10px', fontWeight: 'bold' }}>{enemy.name}</div>
                          <div style={{ color: '#aaa', fontSize: '9px', marginTop: '3px' }}>
                            HP {enemy.hp || '?'} / ATK {enemy.atk || '?'} / SPD {enemy.spd || '?'}
                          </div>
                          {enemy.special && <div style={{ color: '#ffb15c', fontSize: '9px', marginTop: '3px' }}>{enemy.special}</div>}
                          <div style={{ color: '#d0b7b7', fontSize: '9px', lineHeight: 1.35, marginTop: '5px' }}>
                            {getEnemyLoreDescription({
                              enemy,
                              universe: selectedUniverseArchive.universe,
                              lang,
                              lore: selectedUniverseArchive.lore,
                              type: index === selectedUniverseArchive.allEnemies.length - 1 ? 'worldBoss' : 'menace'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid rgba(155,89,182,0.26)', background: 'rgba(155,89,182,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#d7b5ff', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Reliques et objet evenement' : 'Relics and event item'}
                    </strong>
                    <div style={{ display: 'grid', gap: '6px', marginTop: '9px' }}>
                      {selectedUniverseArchive.relics.map(item => (
                        <div key={item.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.35, paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <b style={{ color: '#d7b5ff' }}>{item.name[lang]}</b> / {formatBoostText(item.boost || {})}
                          <div style={{ color: '#bdb3cf', marginTop: '3px' }}>{getGearLore(item)}</div>
                        </div>
                      ))}
                      {selectedUniverseArchive.eventItem && (
                        <div style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.35, paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <b style={{ color: '#ff8c00' }}>{selectedUniverseArchive.eventItem.name[lang]}</b>: {getEventLore(selectedUniverseArchive.eventItem)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '12px', border: '1px solid rgba(255,235,59,0.26)', background: 'rgba(255,235,59,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#ffeb3b', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Artefacts melee / tactique' : 'Melee / tactics artifacts'}
                    </strong>
                    <div style={{ display: 'grid', gap: '6px', marginTop: '9px' }}>
                      {selectedUniverseArchive.battleItems.map(item => (
                        <div key={item.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.35, display: 'grid', gridTemplateColumns: '28px 1fr', gap: '7px', alignItems: 'center' }}>
                          <img
                            src={getItemSpriteSrc(item)}
                            alt=""
                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            style={{ width: '28px', height: '28px', objectFit: 'contain', imageRendering: 'pixelated' }}
                          />
                          <div>
                          <b style={{ color: item.color }}>{item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : item.role.toUpperCase()}</b>
                          {' '}
                          {getBattleItemLoreDescription({ item, lang, lore: selectedUniverseArchive.lore })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid rgba(46,204,113,0.24)', background: 'rgba(46,204,113,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#8dffb1', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Missions liees' : 'Linked missions'}
                    </strong>
                    <div style={{ display: 'grid', gap: '6px', marginTop: '9px' }}>
                      {selectedUniverseArchive.stages.map(stage => (
                        <div key={stage.id} style={{ color: completedStages.includes(stage.id) ? '#dfffe8' : '#aaa', fontSize: '9px', lineHeight: 1.35 }}>
                          <b style={{ color: completedStages.includes(stage.id) ? '#2ecc71' : '#ffeb3b' }}>
                            #{stage.id} {stage.displayName?.[lang] || stage.name}
                          </b>
                          {' '}
                          / {stage.mode} / {stage.bossName}
                          <div style={{ color: '#9fb0ad', marginTop: '3px' }}>{getRichBreachBrief(stage)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '12px', border: '1px solid rgba(255,140,0,0.25)', background: 'rgba(255,140,0,0.05)', borderRadius: '5px' }}>
                    <strong style={{ color: '#ffb15c', fontSize: '11px', textTransform: 'uppercase' }}>
                      {lang === 'fr' ? 'Arcs et collections' : 'Arcs and collections'}
                    </strong>
                    <div style={{ display: 'grid', gap: '7px', marginTop: '9px' }}>
                      {[...selectedUniverseArchive.universeArcs, ...selectedUniverseArchive.characterArcs].map(arc => (
                        <div key={arc.id} style={{ color: '#ddd', fontSize: '9px', lineHeight: 1.35 }}>
                          <b style={{ color: '#ffb15c' }}>{arc.title[lang]}</b>: {arc.intro?.[lang] || arc.reward?.[lang]}
                        </div>
                      ))}
                      {selectedUniverseArchive.franchiseCollections.map(collection => (
                        <div key={collection.id} style={{ color: collection.complete ? '#2ecc71' : '#aaa', fontSize: '9px', lineHeight: 1.35 }}>
                          <b>{collection.title[lang]}</b>: {collection.completed}/{collection.total} / {collection.bonus[lang]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {spritePreview && (
          <div
            onClick={() => setSpritePreview(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 220,
              background: 'rgba(0,0,0,0.82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                width: 'min(92vw, 980px)',
                maxHeight: '92vh',
                background: 'rgba(8,7,14,0.98)',
                border: '1px solid rgba(57,197,187,0.55)',
                borderRadius: '6px',
                padding: '14px',
                boxShadow: '0 0 30px rgba(57,197,187,0.22)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#39c5bb', fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spritePreview.title}</div>
                  <div style={{ color: '#888', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spritePreview.subtitle}</div>
                </div>
                <button onClick={() => setSpritePreview(null)} className="btn-retro" title={lang === 'fr' ? 'Ferme la previsualisation du sprite.' : 'Close the sprite preview.'} style={{ fontSize: '10px', padding: '6px 10px' }}>
                  {lang === 'fr' ? 'FERMER' : 'CLOSE'}
                </button>
              </div>
              <div style={{ background: '#020204', border: '1px solid #222', maxHeight: '78vh', overflow: 'auto', textAlign: 'center' }}>
                {spritePreview.kind === 'pack' && Array.isArray(spritePreview.sheets) ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', padding: '10px' }}>
                    {spritePreview.sheets.map(sheet => (
                      <div key={sheet.id} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.025)', padding: '8px', textAlign: 'left' }}>
                        <div style={{ color: '#39c5bb', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>{sheet.label}</div>
                        <img
                          src={sheet.src}
                          alt={`${spritePreview.title} - ${sheet.label}`}
                          style={{
                            width: '100%',
                            height: 'auto',
                            imageRendering: 'pixelated',
                            display: 'block',
                            background: '#020204'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={spritePreview.src}
                    alt={spritePreview.title}
                    style={{
                      width: spritePreview.kind === 'item' ? 'min(72vw, 420px)' : 'min(100%, 820px)',
                      height: 'auto',
                      imageRendering: 'pixelated',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Codex & Lore */}
        {activeTab === 'codex' && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#ffeb3b', textShadow: '0 0 5px #ffeb3b' }}>
              📚 {lang === 'fr' ? 'ARCHIVES ET LORE DES UNIVERS' : 'MULTIVERSE CODEX & HISTORICAL RECORDS'}
            </h3>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '20px' }}>
              {lang === 'fr' 
                ? `Consultez les enregistrements historiques des anomalies détectées sur les ${TOTAL_UNIVERSE_COUNT} univers connus du Multivers.`
                : `Browse the historical logs of the spacetime anomalies detected across the ${TOTAL_UNIVERSE_COUNT} known universes of the Multiverse.`}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { id: 'canon', label: { fr: 'Canon', en: 'Canon' } },
                { id: 'universes', label: { fr: 'Univers', en: 'Universes' } },
                { id: 'groups', label: { fr: 'Groupes', en: 'Groups' } },
                { id: 'characters', label: { fr: 'Personnages', en: 'Characters' } },
                { id: 'fusions', label: { fr: 'Fusions', en: 'Fusions' } }
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => { setCodexView(view.id); sound.playSfx('click'); }}
                  className={`btn-retro ${codexView === view.id ? 'active-tab' : ''}`}
                  title={lang === 'fr' ? `Affiche la section Codex: ${view.label.fr}.` : `Show Codex section: ${view.label.en}.`}
                  style={{
                    fontSize: '10px',
                    padding: '6px 10px',
                    borderColor: codexView === view.id ? '#ffeb3b' : '#444',
                    color: codexView === view.id ? '#ffeb3b' : '#aaa'
                  }}
                >
                  {view.label[lang]}
                </button>
              ))}
            </div>

            <div style={{ display: codexView === 'canon' ? 'block' : 'none', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#39c5bb', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Canon du Nexus' : 'Nexus canon'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {CORE_CODEX_ENTRIES.map(entry => (
                  <div key={entry.id} style={{
                    padding: '12px',
                    border: '1px solid rgba(57,197,187,0.25)',
                    background: 'linear-gradient(135deg, rgba(57,197,187,0.08), rgba(155,89,182,0.05))',
                    borderRadius: '6px',
                    minHeight: '118px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <strong style={{ color: '#ffeb3b', fontSize: '12px' }}>{entry.title[lang]}</strong>
                      <span style={{ color: '#39c5bb', fontSize: '8px', textTransform: 'uppercase', border: '1px solid rgba(57,197,187,0.35)', padding: '2px 5px', borderRadius: '3px' }}>
                        {entry.category[lang]}
                      </span>
                    </div>
                    <div style={{ color: '#d8d8d8', fontSize: '10px', lineHeight: 1.45 }}>
                      {entry.desc[lang]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: codexView === 'canon' ? 'block' : 'none', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#ff8c00', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'fr' ? 'Arc narratif principal' : 'Main story arc'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                {NARRATIVE_ACTS.map((act, index) => {
                  const visible = completedStages.length >= Math.max(0, index * 3);
                  return (
                    <div key={act.id} style={{
                      padding: '10px',
                      border: visible ? '1px solid rgba(255,140,0,0.35)' : '1px dashed #333',
                      background: visible ? 'rgba(255,140,0,0.05)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      opacity: visible ? 1 : 0.45
                    }}>
                      <div style={{ color: visible ? '#ff8c00' : '#666', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
                        {visible ? act.title[lang] : (lang === 'fr' ? 'Archive verrouillee' : 'Locked archive')}
                      </div>
                      <div style={{ color: visible ? '#ccc' : '#555', fontSize: '10px', lineHeight: 1.35 }}>
                        {visible ? act.text[lang] : (lang === 'fr' ? 'Stabilise plus de breches pour restaurer cette memoire.' : 'Stabilize more breaches to restore this memory.')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: codexView === 'canon' ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {timelineProgress.map(entry => (
                <div key={entry.id} style={{
                  padding: '10px',
                  border: entry.active ? '1px solid rgba(57,197,187,0.45)' : '1px dashed #333',
                  background: entry.active ? 'rgba(57,197,187,0.06)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  opacity: entry.active ? 1 : 0.55
                }}>
                  <div style={{ fontSize: '10px', color: entry.active ? '#39c5bb' : '#777', fontWeight: 'bold', marginBottom: '5px' }}>
                    {entry.title[lang]} {entry.active ? '' : `(${entry.unlockClears})`}
                  </div>
                  <div style={{ fontSize: '10px', color: entry.active ? '#ccc' : '#666', lineHeight: 1.35 }}>
                    {entry.text[lang]}
                  </div>
                </div>
              ))}
            </div>

            {codexView === 'groups' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {arcProgress.map(arc => (
                  <div key={arc.id} style={{ padding: '13px', border: `1px solid ${arc.color}55`, background: `${arc.color}10`, borderRadius: '5px' }}>
                    <strong style={{ color: arc.color, fontSize: '12px' }}>{arc.title[lang]}</strong>
                    <p style={{ color: '#ccc', fontSize: '10px', lineHeight: 1.4 }}>{arc.intro?.[lang] || arc.premise[lang]}</p>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {(arc.missions || []).slice(0, 3).map((mission, idx) => (
                        <span key={`${arc.id}-codex-${idx}`} style={{ color: '#d8d8d8', fontSize: '9px' }}>{idx + 1}. {mission[lang]}</span>
                      ))}
                    </div>
                    <div style={{ color: '#ffeb3b', fontSize: '9px', marginTop: '7px' }}>{arc.outro?.[lang]}</div>
                  </div>
                ))}
              </div>
            )}

            {codexView === 'characters' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {CHARACTER_NARRATIVE_ARCS.filter(isNarrativeArcAvailable).map(arc => {
                  const hero = HEROES_DB.find(item => item.id === arc.heroId);
                  const heroUnlocked = Boolean(hero && unlockedHeroes.includes(hero.id));
                  const heroLevel = hero ? (heroLevels[hero.id] || 1) : 0;
                  const requiredLevel = getPersonalArcLevelRequirement(arc);
                  const requiredClears = arc.unlock?.type === 'clears' ? arc.unlock.value : 0;
                  const characterArcReady = heroUnlocked && heroLevel >= requiredLevel && completedStages.length >= requiredClears;
                  return (
                    <div key={arc.id} style={{ padding: '13px', border: characterArcReady ? '1px solid #2ecc71' : '1px solid rgba(57,197,187,0.28)', background: characterArcReady ? 'rgba(46,204,113,0.06)' : 'rgba(57,197,187,0.06)', borderRadius: '5px' }}>
                      <strong style={{ color: '#39c5bb', fontSize: '12px' }}>{arc.title[lang]}{hero ? ` / ${hero.name}` : ''}</strong>
                      <div style={{ color: characterArcReady ? '#2ecc71' : '#888', fontSize: '9px', marginTop: '5px' }}>
                        {characterArcReady
                          ? (lang === 'fr' ? 'Arc pret pour une mission personnelle.' : 'Arc ready for a personal mission.')
                          : heroUnlocked
                            ? (lang === 'fr'
                              ? `Resonance requise: niveau ${heroLevel}/${requiredLevel}${requiredClears ? `, ${Math.min(completedStages.length, requiredClears)}/${requiredClears} breches` : ''}.`
                              : `Required resonance: level ${heroLevel}/${requiredLevel}${requiredClears ? `, ${Math.min(completedStages.length, requiredClears)}/${requiredClears} breaches` : ''}.`)
                            : (lang === 'fr' ? 'Heros non recrute.' : 'Hero not recruited.')}
                      </div>
                      <p style={{ color: '#ccc', fontSize: '10px', lineHeight: 1.4 }}>{arc.intro[lang]}</p>
                      <div style={{ display: 'grid', gap: '4px' }}>
                        {arc.missions.map((mission, idx) => (
                          <span key={`${arc.id}-mission-${idx}`} style={{ color: '#d8d8d8', fontSize: '9px' }}>{idx + 1}. {mission[lang]}</span>
                        ))}
                      </div>
                      <div style={{ color: '#ffeb3b', fontSize: '9px', marginTop: '7px' }}>{arc.reward[lang]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {codexView === 'fusions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {[
                  ...FUSION_MISSIONS.filter(entry => {
                    const stage = ADMIN_VISIBLE_STAGES.find(item => item.fusionMission?.id === entry.id);
                    return stage ? isStageUnlocked(stage) : false;
                  }),
                  ...UNIVERSE_NARRATIVE_ARCS.filter(isNarrativeArcAvailable)
                ].map(entry => {
                  const rewardId = entry.itemId;
                  const rewardOwned = rewardId ? inventory.includes(rewardId) : false;
                  const unlockClears = entry.unlockClears || 0;
                  const unlocked = completedStages.length >= unlockClears;
                  return (
                    <div key={entry.id} style={{ padding: '13px', border: '1px solid rgba(255,140,0,0.3)', background: 'rgba(255,140,0,0.06)', borderRadius: '5px' }}>
                      <strong style={{ color: '#ff8c00', fontSize: '12px' }}>{entry.title[lang]}</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '6px 0' }}>
                        <span style={{ color: '#fff', fontSize: '9px', border: '1px solid rgba(255,255,255,0.12)', padding: '2px 5px' }}>{entry.mode || (lang === 'fr' ? 'Arc univers' : 'Universe arc')}</span>
                        <span style={{ color: unlocked ? '#2ecc71' : '#ffea00', fontSize: '9px', border: '1px solid rgba(255,255,255,0.12)', padding: '2px 5px' }}>
                          {unlocked ? (lang === 'fr' ? 'Disponible' : 'Available') : `${completedStages.length}/${unlockClears}`}
                        </span>
                        {rewardId && (
                          <span style={{ color: rewardOwned ? '#2ecc71' : '#aaa', fontSize: '9px', border: '1px solid rgba(255,255,255,0.12)', padding: '2px 5px' }}>
                            {rewardOwned ? (lang === 'fr' ? 'Trace obtenue' : 'Trace sealed') : (lang === 'fr' ? 'Trace a sceller' : 'Trace unsealed')}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#aaa', fontSize: '9px', margin: '5px 0' }}>{entry.universes.join(' / ')}</div>
                      <p style={{ color: '#ccc', fontSize: '10px', lineHeight: 1.4 }}>{entry.intro?.[lang] || entry.decor?.[lang]}</p>
                      {entry.missions && entry.missions.map((mission, idx) => (
                        <div key={`${entry.id}-mission-${idx}`} style={{ color: '#d8d8d8', fontSize: '9px', marginTop: '3px' }}>{idx + 1}. {mission[lang]}</div>
                      ))}
                      {entry.enemies && <div style={{ color: '#ffb15c', fontSize: '9px', marginTop: '6px' }}>{entry.enemies[lang]}</div>}
                      <div style={{ color: '#ffeb3b', fontSize: '9px', marginTop: '7px' }}>{entry.reward?.[lang] || entry.item?.[lang]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: codexView === 'universes' ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
              {(() => {
                const encryptString = (str) => {
                  return str.replace(/[a-zA-Z0-9àâäéèêëîïôöùûüûœçÀÆ]/g, '█');
                };

                return Object.keys(LORE_DB).filter(key => isUniverseVisible(key) && matchesMediaFilter(LORE_DB[key]?.mediaType)).map(key => {
                  const lore = LORE_DB[key];
                  const universeHeroes = HEROES_DB.filter(h => h.universe === key);
                  const ustageId = UNIVERSE_TO_STAGE_ID[key];
                  const isCleared = !ustageId || completedStages.includes(ustageId);
                  const bossIntel = ENEMIES_DB[key]?.worldBoss || ENEMIES_DB[key]?.bosses?.[0];
                  const enemyCount = ENEMIES_DB[key]
                    ? [
                      ...(ENEMIES_DB[key].monsters || []),
                      ...(ENEMIES_DB[key].bosses || []),
                      ENEMIES_DB[key].worldBoss
                    ].filter(Boolean).length
                    : 0;
                  const relicCount = EQUIP_ITEMS_DB.filter(item => item.universe === key).length + (EVENT_ITEMS_DB[key] ? 1 : 0);
                  const stageCount = STAGES.filter(stage => stage.universe === key || stage.sourceUniverses?.includes(key)).length;
                  const linkedArcCount = UNIVERSE_NARRATIVE_ARCS.filter(arc => arc.universes.includes(key)).length
                    + CHARACTER_NARRATIVE_ARCS.filter(arc => {
                      const hero = ALL_HEROES_DB.find(item => item.id === arc.heroId);
                      return hero?.universe === key;
                    }).length;
                  const battleItems = getBattleItemsForUniverse(key);
                  const universeBrief = getUniverseLoreDescription({
                    universe: key,
                    lang,
                    lore,
                    faction: getUniverseFaction(key),
                    cleared: isCleared,
                    heroCount: universeHeroes.length,
                    enemyCount,
                    relicCount: relicCount + battleItems.length,
                    stageCount,
                    arcCount: linkedArcCount
                  });
                  
                  return (
                    <div key={key} style={{
                      padding: '14px',
                      background: isCleared ? 'rgba(255,255,255,0.01)' : 'rgba(255,0,0,0.01)',
                      border: isCleared ? '1px solid #333' : '1px dashed #e74c3c66',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '13px', color: isCleared ? '#39c5bb' : '#555' }}>
                            {lore.title[lang]}
                          </span>
                          <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', color: '#aaa', textTransform: 'uppercase' }}>
                            {getMediaTypeLabel(lore.mediaType)}
                          </span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 'bold', color: isCleared ? '#2ecc71' : '#e74c3c' }}>
                            {isCleared
                              ? (lang === 'fr' ? 'TRACE A.R.C.A. STABILISEE' : 'A.R.C.A. TRACE STABILIZED')
                              : (lang === 'fr' ? `COORDONNEES SCELLEES: faille ${ustageId}` : `SEALED COORDINATES: breach ${ustageId}`)}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: isCleared ? '#ccc' : '#555', lineHeight: '1.4', marginBottom: '10px', fontFamily: isCleared ? 'inherit' : 'Courier New', wordBreak: 'break-all' }}>
                          {isCleared ? universeBrief : encryptString(universeBrief)}
                        </div>
                        {bossIntel && (
                          <div style={{
                            padding: '8px',
                            marginBottom: '10px',
                            border: isCleared ? '1px solid rgba(231,76,60,0.35)' : '1px solid #222',
                            background: isCleared ? 'rgba(231,76,60,0.06)' : 'rgba(0,0,0,0.22)',
                            borderRadius: '4px',
                            color: isCleared ? '#ddd' : '#555',
                            fontSize: '10px',
                            lineHeight: 1.35
                          }}>
                            <strong style={{ color: isCleared ? '#e74c3c' : '#555' }}>
                              {lang === 'fr' ? 'Noyau hostile indexe' : 'Indexed hostile core'}:
                            </strong> {isCleared ? bossIntel.name : encryptString(bossIntel.name)}
                            <br />
                            {isCleared ? `HP ${bossIntel.hp} | ATK ${bossIntel.atk} | ${bossIntel.special}` : encryptString(lang === 'fr' ? 'Pattern hostile scelle' : 'Sealed hostile pattern')}
                            {isCleared && (
                              <div style={{ color: '#d0b7b7', marginTop: '5px' }}>
                                {getEnemyLoreDescription({
                                  enemy: bossIntel,
                                  universe: key,
                                  lang,
                                  lore,
                                  type: 'worldBoss'
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{
                          padding: '8px',
                          marginBottom: '10px',
                          border: isCleared ? '1px solid rgba(255,235,59,0.25)' : '1px solid #222',
                          background: isCleared ? 'rgba(255,235,59,0.05)' : 'rgba(0,0,0,0.22)',
                          borderRadius: '4px'
                        }}>
                          <div style={{ fontSize: '9px', color: isCleared ? '#ffeb3b' : '#555', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>
                            {lang === 'fr' ? 'Artefacts melee / tactique' : 'Melee / tactics artifacts'}
                          </div>
                          <div style={{ display: 'grid', gap: '4px' }}>
                            {battleItems.map(item => (
                              <div key={item.id} style={{ fontSize: '9px', color: isCleared ? '#ccc' : '#555', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {isCleared && (
                                  <img
                                    src={getItemSpriteSrc(item)}
                                    alt=""
                                    onError={(event) => { event.currentTarget.style.display = 'none'; }}
                                    style={{ width: '20px', height: '20px', objectFit: 'contain', imageRendering: 'pixelated' }}
                                  />
                                )}
                                <span style={{ color: isCleared ? item.color : '#555', fontWeight: 'bold' }}>
                                  {item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : 'ITEM'}
                                </span>
                                {' '}
                                {isCleared ? item.name[lang] : encryptString(item.name[lang])}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', borderTop: '1px solid #222', paddingTop: '8px' }}>
                        {universeHeroes.map(h => (
                          <span key={h.id} style={{ fontSize: '8px', padding: '1px 5px', background: `${h.primaryColor}22`, border: `1px solid ${h.primaryColor}`, color: isCleared ? '#fff' : '#666', borderRadius: '3px' }}>
                            {h.name} ({h.category.toUpperCase()})
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

