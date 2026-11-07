import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import GameCanvas from './GameCanvas';
import FighterMode from './FighterMode';
import CatalogPagination from './CatalogPagination.jsx';
import sound from '../game/soundEngine';
import { drawPixelSprite } from '../game/renderer';
import './HubImmersion.css';
import './CustomBattleMode.css';
import { createCatalogView, paginateCatalog } from '../game/catalogPagination.js';
import { resolveCustomThreatCandidate } from '../game/customLobbySelection.js';
import { getUnlockableById } from '../game/universeUnlockables';
import { resolveActiveHudTheme } from '../game/cosmeticVisualAssets';
import {
  buildCustomEnemyCatalog,
  buildCustomEnemyData,
  buildCustomRuntimeStage,
  normalizeCustomBattlePreset
} from '../game/customBattle';
import {
  STAGE_EVENT_INTENSITIES,
  STAGE_TOPOLOGY_CATALOG,
  STAGE_TOPOLOGY_IDS,
  STAGE_VARIANTS
} from '../game/melee/stageTopologyCatalog';

const MODE_OPTIONS = [
  { id: 'RPG', fr: 'RPG - ATB', en: 'RPG - ATB', descFr: 'Escouade contre menaces, commandes ATB.', descEn: 'Squad versus threats with ATB commands.' },
  { id: 'Tactics', fr: 'TACTIQUE', en: 'TACTICS', descFr: 'Combat au tour par tour sur grille.', descEn: 'Turn-based combat on a grid.' },
  { id: 'Smash', fr: 'MELEE', en: 'MELEE', descFr: 'Arene plateforme en temps reel.', descEn: 'Real-time platform arena.' },
  { id: 'Fighter', fr: 'COMBAT', en: 'FIGHTER', descFr: 'Duel de signatures avec tag.', descEn: 'Tag-team signature duel.' }
];

const CUSTOM_BATTLE_COSMETIC_KINDS = ['npcAssist', 'koEffect', 'introPose', 'victoryPose'];
const CUSTOM_BATTLE_COSMETIC_COLLECTION_KEYS = Object.freeze({
  npcAssist: 'npcAssists',
  koEffect: 'koEffects',
  introPose: 'introPoses',
  victoryPose: 'victoryPoses'
});

const panelStyle = {
  padding: 14,
  border: '1px solid rgba(57,197,187,0.28)',
  borderRadius: 6,
  background: 'rgba(2,10,16,0.76)',
  minWidth: 0
};

const selectStyle = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 44,
  padding: '8px 10px',
  color: '#eaffff',
  border: '1px solid rgba(57,197,187,0.35)',
  borderRadius: 4,
  background: 'rgba(0,0,0,0.72)',
  font: 'inherit'
};

const localized = (entry, lang, fallback = '') => (
  entry?.name?.[lang] || entry?.name?.fr || entry?.name?.en || entry?.name || fallback
);

const presetsEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function TeamPicker({ title, heroes, selectedIds, onChange, max = 3, accent = '#39c5bb', lang }) {
  const pickerId = useId();
  const pickerRef = useRef(null);
  const [view, setView] = useState(createCatalogView);
  const selectedSet = new Set(selectedIds);
  const page = useMemo(() => paginateCatalog(heroes, view), [heroes, view]);
  const selected = selectedIds.map(id => heroes.find(hero => hero.id === id)).filter(Boolean);
  const changeView = changes => setView(previous => ({ ...previous, ...changes }));
  const toggle = id => {
    if (selectedSet.has(id)) {
      if (selectedIds.length <= 1) return;
      onChange(selectedIds.filter(heroId => heroId !== id));
      return;
    }
    if (selectedIds.length >= max) return;
    onChange([...selectedIds, id]);
  };
  return (
    <section ref={pickerRef} className="custom-team-picker" aria-labelledby={`${pickerId}-title`} style={{ ...panelStyle, '--custom-picker-accent': accent }}>
      <h3 className="custom-picker-heading" id={`${pickerId}-title`}>{title}</h3>
      <div className="custom-selected-roster" role="group" aria-label={lang === 'fr' ? 'Escouade sélectionnée' : 'Selected squad'}>
        {selected.map(hero => <button key={hero.id} type="button" className="custom-roster-token"
          aria-disabled={selectedIds.length <= 1}
          aria-label={lang === 'fr' ? `Retirer ${hero.name}` : `Remove ${hero.name}`}
          onClick={() => {
            if (selectedIds.length <= 1) return;
            pickerRef.current?.querySelector('input[type="search"]')?.focus({ preventScroll: true });
            toggle(hero.id);
          }}>{hero.name}<span aria-hidden="true"> ×</span></button>)}
      </div>
      <p className="custom-picker-status" role="status">{lang === 'fr'
        ? `${selectedIds.length}/${max} signatures sélectionnées. ${selectedIds.length >= max ? 'Retire une signature pour en choisir une autre.' : 'Conserve au moins une signature dans ce camp.'}`
        : `${selectedIds.length}/${max} signatures selected. ${selectedIds.length >= max ? 'Remove a signature to choose another.' : 'Keep at least one signature on this side.'}`}</p>
      <CatalogPagination catalogId={`custom-team-${pickerId}`} title={title} lang={lang} page={page} query={view.query}
        onQueryChange={query => changeView({ query, page: 1 })}
        onPageChange={next => changeView({ page: next })}
        onPageSizeChange={pageSize => changeView({ pageSize, page: 1 })} />
      <div className="custom-hero-grid">
        {page.items.map(hero => {
          const isSelected = selectedSet.has(hero.id);
          const unavailable = isSelected ? selectedIds.length <= 1 : selectedIds.length >= max;
          return (
            <button
              type="button"
              key={hero.id}
              onClick={() => toggle(hero.id)}
              className="btn-retro custom-hero-choice"
              aria-pressed={isSelected}
              aria-disabled={unavailable}
              data-hero-id={hero.id}
              title={isSelected
                ? (lang === 'fr' ? `Retirer ${hero.name}` : `Remove ${hero.name}`)
                : (lang === 'fr' ? `Ajouter ${hero.name}` : `Add ${hero.name}`)}
              style={{
                padding: '8px 9px',
                textAlign: 'left',
                borderColor: isSelected ? accent : '#34454b',
                color: isSelected ? '#fff' : '#bdcfd4',
                background: isSelected ? `${accent}22` : 'rgba(0,0,0,0.3)'
              }}
            >
              <canvas aria-hidden="true" width="96" height="88" ref={canvas => { if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, 96, 88); drawPixelSprite(ctx, 48, 64, hero, 0, 1, 60, 'nexus'); }} />
              <strong>{isSelected ? '◆ ' : '◇ '}{hero.name}</strong>
              <small>
                {hero.universe}
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ThreatPicker({ catalog, selectedIds, onChange, max = 6, lang }) {
  const pickerId = useId();
  const pickerRef = useRef(null);
  const [view, setView] = useState(createCatalogView);
  const [candidateId, setCandidateId] = useState('');
  const page = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return paginateCatalog(catalog, { ...view, predicate: entry => !selectedSet.has(entry.id) });
  }, [catalog, selectedIds, view]);
  const candidate = resolveCustomThreatCandidate(page.items, candidateId);
  const selected = selectedIds.map(id => catalog.find(entry => entry.id === id)).filter(Boolean);
  const changeView = changes => {
    setCandidateId('');
    setView(previous => ({ ...previous, ...changes }));
  };
  const add = () => {
    if (!candidate || selectedIds.length >= max || selectedIds.includes(candidate.id)) return;
    pickerRef.current?.querySelector('input[type="search"]')?.focus({ preventScroll: true });
    onChange([...selectedIds, candidate.id]);
    setCandidateId('');
    sound.playSfx('click');
  };
  return (
    <section ref={pickerRef} className="custom-threat-picker" aria-labelledby={`${pickerId}-title`} style={{ ...panelStyle, '--custom-picker-accent': '#ffb28c' }}>
      <h3 className="custom-picker-heading" id={`${pickerId}-title`}>
        {lang === 'fr' ? 'MENACES / ENNEMIS' : 'THREATS / ENEMIES'}
      </h3>
      <CatalogPagination catalogId={`custom-threats-${pickerId}`} title={lang === 'fr' ? 'Menaces' : 'Threats'} lang={lang} page={page} query={view.query}
        onQueryChange={query => changeView({ query, page: 1 })}
        onPageChange={next => changeView({ page: next })}
        onPageSizeChange={pageSize => changeView({ pageSize, page: 1 })} />
      <div className="custom-threat-add">
        <label htmlFor={`${pickerId}-candidate`}>{lang === 'fr' ? 'Menace à ajouter' : 'Threat to add'}</label>
        <select id={`${pickerId}-candidate`} aria-describedby={`${pickerId}-candidate-description`} value={candidate?.id || ''} onChange={event => setCandidateId(event.target.value)} disabled={!page.items.length} style={selectStyle}>
          {!page.items.length && <option value="">{lang === 'fr' ? 'Aucune menace correspondante' : 'No matching threats'}</option>}
          {page.items.map(entry => (
            <option key={entry.id} value={entry.id}>
              [{entry.kind === 'worldBoss' ? 'WORLD BOSS' : entry.kind.toUpperCase()}] {entry.name} — {entry.universe}
            </option>
          ))}
        </select>
        <button type="button" className="btn-retro" onClick={add} disabled={!candidate || selectedIds.length >= max} style={{ padding: '8px 14px', borderColor: '#ff8a50', color: '#ffb28c' }}>
          {lang === 'fr' ? 'AJOUTER' : 'ADD'}
        </button>
      </div>
      <p className="custom-candidate-preview" id={`${pickerId}-candidate-description`}>
        {candidate && <><strong>{candidate.name}</strong><span>{candidate.universe}</span></>}
      </p>
      <div className="custom-selected-roster" role="group" aria-label={lang === 'fr' ? 'Menaces sélectionnées' : 'Selected threats'}>
        {selected.map(entry => (
          <button
            type="button"
            key={entry.id}
            className="custom-roster-token"
            data-threat-id={entry.id}
            aria-disabled={selected.length <= 1}
            onClick={() => {
              if (selected.length <= 1) return;
              pickerRef.current?.querySelector('input[type="search"]')?.focus({ preventScroll: true });
              onChange(selectedIds.filter(id => id !== entry.id));
            }}
            aria-label={lang === 'fr' ? `Retirer ${entry.name}` : `Remove ${entry.name}`}
            title={lang === 'fr' ? `Retirer ${entry.name}` : `Remove ${entry.name}`}
          >
            {entry.name}<span aria-hidden="true"> ×</span>
          </button>
        ))}
      </div>
      <p className="custom-picker-status" role="status">
        {lang === 'fr'
          ? 'Le même roster est utilisé par l IA ou contrôlé à tour de rôle par P2.'
          : 'The same roster is controlled by AI or locally by P2.'}
        {' '}{selectedIds.length}/{max} {lang === 'fr' ? 'menaces sélectionnées.' : 'threats selected.'}
        {selectedIds.length >= max && (lang === 'fr' ? ' Retire une menace pour en choisir une autre.' : ' Remove a threat to choose another.')}
      </p>
    </section>
  );
}

function LoadoutSelect({ label, value, onChange, options, defaultLabel, lang }) {
  return (
    <label style={{ display: 'grid', gap: 6, minWidth: 0 }}>
      <span className="fighter-section-label">{label}</span>
      <select value={value || ''} onChange={event => onChange(event.target.value || null)} style={selectStyle}>
        <option value="">{defaultLabel}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{localized(option, lang, option.universe)} — {option.universe}</option>
        ))}
      </select>
    </label>
  );
}

export default function CustomBattleMode({
  lang = 'fr',
  playerProfile,
  heroes = [],
  unlockedHeroes = [],
  activeTeam = [],
  heroLevels = {},
  equippedGear = {},
  equippedEventItems = {},
  heroTalents = {},
  heroSkins = {},
  completedStages = [],
  portalCollection = {},
  setPortalCollection = () => {},
  hiddenUniverses = [],
  disabledAssets = {},
  onSessionStart,
  onSessionEnd,
  onPauseRequest,
  sessionPaused = false,
  sessionExitRequest = 0,
  dedicatedSession = false
}) {
  const [phase, setPhase] = useState('setup');
  const [lobbyStep, setLobbyStep] = useState(0);
  const lobbyId = useId();
  const stepRefs = useRef([]);
  const panelRef = useRef(null);
  const launchButtonRef = useRef(null);
  const pendingStepFocusRef = useRef(null);
  const lastPhaseRef = useRef(phase);
  const [runtimeNonce, setRuntimeNonce] = useState(0);
  const sessionActiveRef = useRef(false);
  const pendingBattleReportRef = useRef(null);
  const sessionExitRequestRef = useRef(sessionExitRequest);
  const hiddenSet = useMemo(() => new Set(hiddenUniverses), [hiddenUniverses]);
  const disabledHeroSet = useMemo(() => new Set(disabledAssets.heroes || []), [disabledAssets.heroes]);
  const disabledStageSet = useMemo(
    () => new Set((disabledAssets.stages || []).map(String)),
    [disabledAssets.stages]
  );
  const unlockedSet = useMemo(() => new Set(unlockedHeroes), [unlockedHeroes]);
  const availableHeroes = useMemo(() => heroes.filter(hero => (
    (hero.id === 'player_anchor' || unlockedSet.has(hero.id))
    && !hiddenSet.has(hero.universe)
    && !disabledHeroSet.has(hero.id)
  )), [disabledHeroSet, heroes, hiddenSet, unlockedSet]);
  const enemyCatalog = useMemo(() => buildCustomEnemyCatalog({
    hiddenUniverses,
    disabledEnemyIds: disabledAssets.enemies || []
  }), [disabledAssets.enemies, hiddenUniverses]);
  const allowedHeroIds = useMemo(() => availableHeroes.map(hero => hero.id), [availableHeroes]);
  const allowedEnemyIds = useMemo(() => enemyCatalog.map(enemy => enemy.id), [enemyCatalog]);
  const [preset, setPreset] = useState(() => normalizeCustomBattlePreset(portalCollection.customBattlePreset));

  const changeLobbyStep = (step, focus = 'tab') => {
    if (step === lobbyStep) return;
    pendingStepFocusRef.current = focus;
    setLobbyStep(step);
  };
  const handleStepNavigation = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const next = event.key === 'ArrowRight' ? (lobbyStep + 1) % 4
      : event.key === 'ArrowLeft' ? (lobbyStep + 3) % 4
        : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null;
    if (next === null) return;
    event.preventDefault();
    changeLobbyStep(next);
  };
  useEffect(() => {
    const returnedFromBattle = lastPhaseRef.current !== 'setup' && phase === 'setup';
    lastPhaseRef.current = phase;
    if (phase !== 'setup') return;
    const pending = pendingStepFocusRef.current;
    pendingStepFocusRef.current = null;
    const target = pending === 'panel' ? panelRef.current
      : pending === 'tab' ? stepRefs.current[lobbyStep]
        : returnedFromBattle ? launchButtonRef.current : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: pending === 'panel' ? 'start' : 'nearest' });
  }, [lobbyStep, phase]);

  // Le wrapper reste seul proprietaire de l abandon pour tous les moteurs custom.
  useEffect(() => {
    if (sessionExitRequestRef.current === sessionExitRequest) return;
    sessionExitRequestRef.current = sessionExitRequest;
    setPhase('setup');
    if (!sessionActiveRef.current) return;
    sessionActiveRef.current = false;
    onSessionEnd?.({ reason: 'abandoned' });
  }, [onSessionEnd, sessionExitRequest]);

  useEffect(() => {
    setPreset(previous => {
      const normalized = normalizeCustomBattlePreset(previous, { allowedHeroIds, allowedEnemyIds });
      const defaultPlayerIds = activeTeam.filter(id => allowedHeroIds.includes(id)).slice(0, 3);
      if (!normalized.playerTeamIds.length) {
        normalized.playerTeamIds = defaultPlayerIds.length ? defaultPlayerIds : allowedHeroIds.slice(0, 1);
      }
      if (!normalized.opponentTeamIds.length) {
        const distinctOpponents = allowedHeroIds.filter(id => !normalized.playerTeamIds.includes(id));
        normalized.opponentTeamIds = (distinctOpponents.length ? distinctOpponents : allowedHeroIds)
          .slice(0, Math.max(1, normalized.playerTeamIds.length));
      }
      if (!normalized.enemyIds.length && allowedEnemyIds.length) normalized.enemyIds = allowedEnemyIds.slice(0, 1);
      return presetsEqual(previous, normalized) ? previous : normalized;
    });
  }, [activeTeam, allowedEnemyIds, allowedHeroIds]);

  useEffect(() => {
    setPortalCollection(previous => {
      const nextPreset = normalizeCustomBattlePreset(preset);
      const storedPreset = normalizeCustomBattlePreset(previous?.customBattlePreset);
      if (presetsEqual(storedPreset, nextPreset)) return previous;
      return {
        ...(previous || {}),
        customBattlePreset: nextPreset
      };
    });
  }, [preset, setPortalCollection]);

  const archives = useMemo(() => (
    (portalCollection.archives || []).filter(archive => (
      archive?.id
      && !hiddenSet.has(archive.universe)
      && !disabledStageSet.has(String(archive.id))
    ))
  ), [disabledStageSet, hiddenSet, portalCollection.archives]);
  const selectedArchive = archives.find(archive => archive.id === preset.stageArchiveId) || null;
  const ownedBattleMusic = useMemo(() => (
    [...new Set(portalCollection.battleMusic || [])]
      .map(id => getUnlockableById('battleMusic', id))
      .filter(item => item && !hiddenSet.has(item.universe))
  ), [hiddenSet, portalCollection.battleMusic]);
  const ownedStageMusic = useMemo(() => (
    [...new Set(portalCollection.stageMusic || [])]
      .map(id => getUnlockableById('stageMusic', id))
      .filter(item => item && !hiddenSet.has(item.universe))
  ), [hiddenSet, portalCollection.stageMusic]);
  const ownedFieldSupers = useMemo(() => (
    [...new Set(portalCollection.fieldSupers || [])]
      .map(id => getUnlockableById('fieldSuper', id))
      .filter(item => item && !hiddenSet.has(item.universe))
  ), [hiddenSet, portalCollection.fieldSupers]);
  const selectedBattleMusic = ownedBattleMusic.find(item => item.id === preset.battleMusicId) || null;
  const selectedStageMusic = ownedStageMusic.find(item => item.id === preset.stageMusicId) || null;
  const selectedFieldSuper = ownedFieldSupers.find(item => item.id === preset.fieldSuperId) || null;
  const selectedCustomCosmetics = useMemo(() => Object.fromEntries(
    CUSTOM_BATTLE_COSMETIC_KINDS.map(kind => {
      const selectedId = portalCollection.customLoadout?.[kind];
      const collectionKey = CUSTOM_BATTLE_COSMETIC_COLLECTION_KEYS[kind];
      const ownedIds = Array.isArray(portalCollection[collectionKey])
        ? portalCollection[collectionKey]
        : [];
      if (!selectedId || !ownedIds.includes(selectedId)) return [kind, null];
      const unlockable = getUnlockableById(kind, selectedId);
      return [
        kind,
        unlockable && !hiddenSet.has(unlockable.universe) ? unlockable : null
      ];
    })
  ), [hiddenSet, portalCollection]);

  useEffect(() => {
    if (phase !== 'setup') return undefined;
    const previewStage = selectedStageMusic?.musicStage || {
      id: `custom-lobby-${selectedArchive?.universe || 'nexus'}`,
      name: `Custom Lobby - ${selectedArchive?.universe || 'Nexus de Convergence'}`,
      universe: selectedArchive?.universe || 'Nexus de Convergence',
      mode: preset.mode,
      tags: ['customStage', 'loreArena']
    };
    sound.playStageBgm(previewStage, selectedStageMusic?.state || 'grid');
    return () => sound.stopBgm();
  }, [phase, preset.mode, selectedArchive?.universe, selectedStageMusic]);

  const updatePreset = patch => {
    setPreset(previous => normalizeCustomBattlePreset({ ...previous, ...patch }, { allowedHeroIds, allowedEnemyIds }));
    sound.playSfx('click');
  };

  const enemyData = useMemo(
    () => buildCustomEnemyData(preset.enemyIds, enemyCatalog),
    [enemyCatalog, preset.enemyIds]
  );
  const runtimeStage = useMemo(() => buildCustomRuntimeStage({
    preset,
    archive: selectedArchive,
    enemyData,
    battleMusic: selectedBattleMusic,
    stageMusic: selectedStageMusic,
    fieldSuper: selectedFieldSuper,
    cosmetics: selectedCustomCosmetics,
    nonce: runtimeNonce
  }), [enemyData, preset, runtimeNonce, selectedArchive, selectedBattleMusic, selectedCustomCosmetics, selectedFieldSuper, selectedStageMusic]);

  const endDedicatedSession = (report) => {
    if (!sessionActiveRef.current) return;
    sessionActiveRef.current = false;
    onSessionEnd?.(report);
  };

  const beginDedicatedSession = () => {
    if (sessionActiveRef.current) return;
    sessionActiveRef.current = true;
    onSessionStart?.();
  };

  const returnToSetup = (reason = 'quit') => {
    setPhase('setup');
    endDedicatedSession({ ...pendingBattleReportRef.current, reason: reason === 'quit' ? 'abandoned' : 'completed', result: reason });
    pendingBattleReportRef.current = null;
  };

  const launch = () => {
    if (sessionPaused) return;
    if (!preset.playerTeamIds.length) return;
    if (preset.mode === 'Fighter' && !preset.opponentTeamIds.length) return;
    if (preset.mode !== 'Fighter' && !enemyData.customRoster.length) return;
    pendingBattleReportRef.current = null;
    beginDedicatedSession();
    setRuntimeNonce(previous => previous + 1);
    setPhase(preset.mode === 'Fighter' ? 'fighter' : 'battle');
    sound.playSfx('portal');
  };

  if (phase === 'battle') {
    return (
      <GameCanvas
        lang={lang}
        playerProfile={playerProfile}
        activeTeam={preset.playerTeamIds}
        stage={runtimeStage}
        heroLevels={heroLevels}
        equippedGear={equippedGear}
        equippedEventItems={equippedEventItems}
        heroTalents={heroTalents}
        heroSkins={heroSkins}
        completedStages={completedStages}
        hiddenUniverses={hiddenUniverses}
        disabledAssets={disabledAssets}
        customBattle={runtimeStage.customBattle}
        hudTheme={resolveActiveHudTheme(portalCollection)}
        onSessionComplete={(result, summary) => {
          pendingBattleReportRef.current = { result, summary };
        }}
        onBattleEnd={(result) => returnToSetup(result)}
        onPauseRequest={onPauseRequest}
        sessionPaused={sessionPaused}
        dedicatedSession={dedicatedSession}
      />
    );
  }

  if (phase === 'fighter') {
    return (
      <div>
        <FighterMode
          lang={lang}
          heroes={heroes}
          unlockedHeroes={unlockedHeroes}
          activeTeam={preset.playerTeamIds}
          heroLevels={heroLevels}
          portalCollection={portalCollection}
          setPortalCollection={setPortalCollection}
          hiddenUniverses={hiddenUniverses}
          disabledAssets={disabledAssets}
          customConfig={{
            playerTeamIds: preset.playerTeamIds,
            opponentTeamIds: preset.opponentTeamIds,
            opponentControl: preset.opponentControl,
            archiveId: selectedArchive?.id || null,
            battleMusicId: preset.battleMusicId,
            stageMusicId: preset.stageMusicId,
            fieldSuperId: preset.fieldSuperId,
            cosmetics: selectedCustomCosmetics,
            difficulty: preset.difficulty,
            autoStart: true
          }}
          onExit={() => returnToSetup('quit')}
          onSessionStart={beginDedicatedSession}
          onSessionEnd={(report = {}) => {
            endDedicatedSession(report);
            if (report.reason === 'abandoned') setPhase('setup');
          }}
          onPauseRequest={onPauseRequest}
          sessionPaused={sessionPaused}
          dedicatedSession={dedicatedSession}
        />
      </div>
    );
  }

  const modeInfo = MODE_OPTIONS.find(mode => mode.id === preset.mode) || MODE_OPTIONS[0];
  return (
    <div className="glass-panel custom-battle-lobby" data-testid="custom-battle-mode">
      <header className="custom-lobby-header">
        <div>
          <div className="custom-lobby-kicker">A.R.C.A. / {lang === 'fr' ? 'SIMULATION LIBRE' : 'FREE SIMULATION'}</div>
          <h2 className="cyber-title">
            {lang === 'fr' ? 'COMBAT PERSONNALISÉ' : 'CUSTOM BATTLE'}
          </h2>
          <p>
            {lang === 'fr'
              ? 'Compose les deux camps, puis choisis le stage, les musiques et les règles. Ces simulations ne donnent aucune récompense de campagne.'
              : 'Build both sides, then choose the stage, music, and rules. Simulations award no campaign rewards.'}
          </p>
        </div>
        <div className="custom-lobby-progression">
          {lang === 'fr' ? 'PROGRESSION DÉSACTIVÉE' : 'PROGRESSION DISABLED'}
        </div>
      </header>

      <nav className="custom-lobby-steps" role="tablist" aria-label={lang === 'fr' ? 'Étapes de préparation' : 'Setup steps'} onKeyDown={handleStepNavigation}>
        {(lang === 'fr' ? ['MODE', 'ÉQUIPES', 'ARÈNE', 'RÈGLES'] : ['MODE', 'TEAMS', 'ARENA', 'RULES']).map((label, index) => <button key={index} type="button"
          ref={node => { stepRefs.current[index] = node; }} role="tab" id={`${lobbyId}-step-${index}`} aria-controls={`${lobbyId}-panel`}
          tabIndex={lobbyStep === index ? 0 : -1} aria-selected={lobbyStep === index} aria-current={lobbyStep === index ? 'step' : undefined}
          onClick={() => changeLobbyStep(index)}><b aria-hidden="true">{index + 1}</b><span>{label}</span></button>)}
      </nav>
      <div ref={panelRef} id={`${lobbyId}-panel`} role="tabpanel" tabIndex={-1} aria-labelledby={`${lobbyId}-step-${lobbyStep}`} className="custom-lobby-panel">
      <section hidden={lobbyStep !== 0} aria-label={lang === 'fr' ? 'Mode de combat' : 'Battle mode'} style={{ ...panelStyle, display: 'grid', gap: 10 }}>
        <div className="fighter-section-label">{lang === 'fr' ? 'SYSTEME DE COMBAT' : 'BATTLE SYSTEM'}</div>
        <div className="custom-mode-options">
          {MODE_OPTIONS.map(mode => (
            <button
              type="button"
              key={mode.id}
              className="btn-retro custom-mode-choice"
              aria-pressed={preset.mode === mode.id}
              onClick={() => updatePreset({
                mode: mode.id,
                ...(mode.id === 'Smash' ? { hazards: true } : {})
              })}
              style={{
                padding: '10px 8px',
                borderColor: preset.mode === mode.id ? '#39c5bb' : '#34454b',
                color: preset.mode === mode.id ? '#fff' : '#8fa5aa',
                background: preset.mode === mode.id ? 'rgba(57,197,187,0.14)' : 'rgba(0,0,0,0.24)'
              }}
            >
              <strong>{lang === 'fr' ? mode.fr : mode.en}</strong>
              <small>{lang === 'fr' ? mode.descFr : mode.descEn}</small>
            </button>
          ))}
        </div>
        <div className="custom-opponent-options">
          {[
            { id: 'cpu', fr: 'CONTRE CPU', en: 'VERSUS CPU', descFr: 'A.R.C.A. controle le camp adverse.', descEn: 'A.R.C.A. controls the opposing side.' },
            { id: 'p2', fr: 'CONTRE P2 LOCAL', en: 'LOCAL VERSUS P2', descFr: 'Deux joueurs sur le meme appareil.', descEn: 'Two players on the same device.' }
          ].map(option => (
            <button
              type="button"
              key={option.id}
              className="btn-retro custom-mode-choice"
              aria-pressed={preset.opponentControl === option.id}
              onClick={() => updatePreset({
                opponentControl: option.id,
                ...(option.id === 'p2'
                  ? { difficulty: 'standard', skipPreMatchInTraining: false }
                  : {})
              })}
              style={{ padding: 9, borderColor: preset.opponentControl === option.id ? '#ff8a50' : '#34454b', color: preset.opponentControl === option.id ? '#fff' : '#8fa5aa' }}
            >
              <strong>{lang === 'fr' ? option.fr : option.en}</strong>
              <small>{lang === 'fr' ? option.descFr : option.descEn}</small>
            </button>
          ))}
        </div>
      </section>

      <div hidden={lobbyStep !== 1} className="custom-lobby-teams">
        <TeamPicker
          title={lang === 'fr' ? 'ESCOUADE P1' : 'P1 SQUAD'}
          heroes={availableHeroes}
          selectedIds={preset.playerTeamIds}
          onChange={ids => updatePreset({ playerTeamIds: ids })}
          lang={lang}
        />
        {preset.mode === 'Fighter' ? (
          <TeamPicker
            title={preset.opponentControl === 'p2' ? (lang === 'fr' ? 'ESCOUADE P2' : 'P2 SQUAD') : (lang === 'fr' ? 'SIGNATURES CPU' : 'CPU SIGNATURES')}
            heroes={availableHeroes}
            selectedIds={preset.opponentTeamIds}
            onChange={ids => updatePreset({ opponentTeamIds: ids })}
            accent="#ff8a50"
            lang={lang}
          />
        ) : (
          <ThreatPicker
            catalog={enemyCatalog}
            selectedIds={preset.enemyIds}
            onChange={ids => updatePreset({ enemyIds: ids })}
            max={preset.mode === 'Tactics' ? 6 : 3}
            lang={lang}
          />
        )}
      </div>

      <section hidden={lobbyStep !== 2 && lobbyStep !== 3} style={{ ...panelStyle, display: 'grid', gap: 12 }}>
        <div className="fighter-section-label">{lobbyStep === 2 ? (lang === 'fr' ? 'ARÈNE & AMBIANCE' : 'ARENA & ATMOSPHERE') : (lang === 'fr' ? 'RÈGLES DU COMBAT' : 'BATTLE RULES')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 10 }}>
          <label hidden={lobbyStep !== 2} style={{ display: 'grid', gap: 6 }}>
            <span className="fighter-section-label">{lang === 'fr' ? 'STAGE' : 'STAGE'}</span>
            <select value={preset.stageArchiveId || ''} onChange={event => updatePreset({ stageArchiveId: event.target.value || null })} style={selectStyle}>
              <option value="">{lang === 'fr' ? 'Nexus - arene de simulation' : 'Nexus simulation arena'}</option>
              {archives.map(archive => (
                <option key={archive.id} value={archive.id}>
                  {archive.universe} — {localized(archive, lang, archive.id)}
                </option>
              ))}
            </select>
          </label>
          <label hidden={lobbyStep !== 3} style={{ display: 'grid', gap: 6 }}>
            <span className="fighter-section-label">{lang === 'fr' ? 'DIFFICULTE CPU' : 'CPU DIFFICULTY'}</span>
            <select value={preset.difficulty} onChange={event => updatePreset({ difficulty: event.target.value })} disabled={preset.opponentControl === 'p2'} style={selectStyle}>
              <option value="training">{lang === 'fr' ? 'Entrainement' : 'Training'}</option>
              <option value="standard">Standard</option>
              <option value="expert">Expert</option>
            </select>
          </label>
          <div hidden={lobbyStep !== 2}><LoadoutSelect label={lang === 'fr' ? 'MUSIQUE DU STAGE' : 'STAGE MUSIC'} value={preset.stageMusicId} onChange={id => updatePreset({ stageMusicId: id })} options={ownedStageMusic} defaultLabel={lang === 'fr' ? 'Automatique selon le stage' : 'Automatic for stage'} lang={lang} /></div>
          <div hidden={lobbyStep !== 2}><LoadoutSelect label={lang === 'fr' ? 'MUSIQUE DU COMBAT' : 'BATTLE MUSIC'} value={preset.battleMusicId} onChange={id => updatePreset({ battleMusicId: id })} options={ownedBattleMusic} defaultLabel={lang === 'fr' ? 'Automatique selon le combat' : 'Automatic for battle'} lang={lang} /></div>
          <div hidden={lobbyStep !== 3}><LoadoutSelect label={lang === 'fr' ? 'SUPER DE TERRAIN' : 'FIELD SUPER'} value={preset.fieldSuperId} onChange={id => updatePreset({ fieldSuperId: id })} options={ownedFieldSupers} defaultLabel={lang === 'fr' ? 'Aucun super de terrain' : 'No field super'} lang={lang} /></div>
          {preset.mode !== 'Fighter' && lobbyStep === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: 8 }}>
              {[
                { key: 'items', fr: 'Objets', en: 'Items' },
                { key: 'hazards', fr: 'Dangers', en: 'Hazards' }
              ].filter(rule => preset.mode !== 'Smash' || rule.key !== 'hazards').map(rule => (
                <label className="custom-lobby-toggle" key={rule.key}>
                  <input type="checkbox" checked={preset[rule.key]} onChange={event => updatePreset({ [rule.key]: event.target.checked })} />
                  {lang === 'fr' ? rule.fr : rule.en}
                </label>
              ))}
            </div>
          )}
        </div>
        {preset.mode === 'Smash' && lobbyStep === 3 && (
          <fieldset className="custom-melee-stage-rules">
            <legend>{lang === 'fr' ? 'RÈGLES DE L’ARÈNE MÊLÉE' : 'MELEE ARENA RULES'}</legend>
            <label>
              <span className="fighter-section-label">{lang === 'fr' ? 'VARIANTE' : 'VARIANT'}</span>
              <select
                value={preset.stageVariant}
                onChange={event => updatePreset({
                  stageVariant: event.target.value,
                  ...(event.target.value === STAGE_VARIANTS.competitive
                    ? { stageEventIntensity: STAGE_EVENT_INTENSITIES.off }
                    : {})
                })}
                style={selectStyle}
              >
                <option value={STAGE_VARIANTS.lore}>{lang === 'fr' ? 'Lore — evenement complet' : 'Lore — full event'}</option>
                <option value={STAGE_VARIANTS.competitive}>{lang === 'fr' ? 'Competitive — evenement coupe' : 'Competitive — event disabled'}</option>
              </select>
            </label>
            <label>
              <span className="fighter-section-label">{lang === 'fr' ? 'INTENSITE' : 'INTENSITY'}</span>
              <select
                value={preset.stageVariant === STAGE_VARIANTS.competitive
                  ? STAGE_EVENT_INTENSITIES.off
                  : preset.stageEventIntensity}
                onChange={event => updatePreset({ stageEventIntensity: event.target.value })}
                disabled={preset.stageVariant === STAGE_VARIANTS.competitive}
                style={selectStyle}
              >
                <option value={STAGE_EVENT_INTENSITIES.off}>{lang === 'fr' ? 'Désactivée' : 'Off'}</option>
                <option value={STAGE_EVENT_INTENSITIES.light}>{lang === 'fr' ? 'Légère' : 'Light'}</option>
                <option value={STAGE_EVENT_INTENSITIES.full}>{lang === 'fr' ? 'Complète' : 'Full'}</option>
              </select>
              {preset.stageVariant === STAGE_VARIANTS.competitive && (
                <small>{lang === 'fr' ? 'La variante compétitive désactive les événements du décor.' : 'The competitive variant disables stage events.'}</small>
              )}
            </label>
            <label>
              <span className="fighter-section-label">{lang === 'fr' ? 'TOPOLOGIE' : 'TOPOLOGY'}</span>
              <select value={preset.stageTopologyId} onChange={event => updatePreset({ stageTopologyId: event.target.value })} style={selectStyle}>
                <option value="auto">{lang === 'fr' ? 'Automatique selon l univers' : 'Automatic for universe'}</option>
                {Object.values(STAGE_TOPOLOGY_IDS).map(topologyId => (
                  <option key={topologyId} value={topologyId}>
                    {STAGE_TOPOLOGY_CATALOG[topologyId].name[lang] || STAGE_TOPOLOGY_CATALOG[topologyId].name.fr}
                  </option>
                ))}
              </select>
            </label>
            <div className="custom-melee-countdown-rule">
              <strong>{lang === 'fr' ? 'PRE-MATCH : 3 SECONDES' : 'PRE-MATCH: 3 SECONDS'}</strong>
              <span>{lang === 'fr' ? 'Intro, cadrage A.R.C.A. et 3-2-1 synchronises.' : 'Synchronized intro, A.R.C.A. framing and 3-2-1.'}</span>
              {preset.difficulty === 'training' && (
                <label>
                  <input
                    type="checkbox"
                    checked={preset.skipPreMatchInTraining}
                    onChange={event => updatePreset({ skipPreMatchInTraining: event.target.checked })}
                  />
                  {lang === 'fr' ? 'Ignorer automatiquement en entrainement' : 'Skip automatically in training'}
                </label>
              )}
            </div>
          </fieldset>
        )}
        {lobbyStep === 2 && selectedArchive?.image && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 12, alignItems: 'center', padding: 10, border: '1px solid rgba(57,197,187,0.18)', background: 'rgba(57,197,187,0.04)' }}>
            <img src={selectedArchive.image} alt="" style={{ width: 180, maxWidth: '100%', maxHeight: 110, objectFit: 'cover', border: '1px solid #31545a', boxSizing: 'border-box' }} />
            <div>
              <strong style={{ color: selectedArchive.color || '#39c5bb' }}>{selectedArchive.universe}</strong>
              <p className="custom-lobby-note">
                {lang === 'fr'
                  ? `Cette arène débloquée sera utilisée pour ton combat ${modeInfo.fr}.`
                  : `This unlocked arena will host your ${modeInfo.en} battle.`}
              </p>
            </div>
          </div>
        )}
      </section>

      {lobbyStep === 3 && preset.opponentControl === 'p2' && (
        <div className="custom-lobby-p2-note">
          {preset.mode === 'Tactics' || preset.mode === 'RPG'
            ? (lang === 'fr' ? 'P2 prend les commandes pendant les tours/ATB ennemis. La souris est partagee en Tactique.' : 'P2 takes control during enemy turns/ATB. The mouse is shared in Tactics.')
            : (lang === 'fr' ? 'P1 utilise ZQSD et ses touches d action; P2 utilise les fleches et le second groupe de touches affiche en combat.' : 'P1 uses ZQSD and the first action-key group; P2 uses arrows and the second group shown in battle.')}
        </div>
      )}
      </div>

      <footer className="custom-lobby-footer">
        <div className="custom-lobby-summary">
          <strong>{lang === 'fr' ? modeInfo.fr : modeInfo.en} · {preset.opponentControl === 'p2' ? 'P2 LOCAL' : 'CPU'}</strong>
          <span>P1 : {preset.playerTeamIds.map(id => availableHeroes.find(hero => hero.id === id)?.name || id).join(' / ')}</span>
          <span>{preset.opponentControl === 'p2' ? 'P2' : 'CPU'} : {(preset.mode === 'Fighter'
            ? preset.opponentTeamIds.map(id => availableHeroes.find(hero => hero.id === id)?.name || id)
            : enemyData.customRoster.map(entry => entry.name)).join(' / ')}</span>
          <span>{lang === 'fr' ? 'Arène' : 'Arena'} : {selectedArchive ? localized(selectedArchive, lang, selectedArchive.universe) : 'Nexus'}</span>
        </div>
        <div className="custom-lobby-actions">
          {lobbyStep > 0 && <button type="button" className="btn-retro" onClick={() => changeLobbyStep(lobbyStep - 1, 'panel')}>{lang === 'fr' ? 'PRÉCÉDENT' : 'PREVIOUS'}</button>}
          {lobbyStep < 3 && <button type="button" className="btn-retro" onClick={() => changeLobbyStep(lobbyStep + 1, 'panel')}>{lang === 'fr' ? 'SUIVANT' : 'NEXT'}</button>}
      <button
        hidden={lobbyStep !== 3}
        ref={launchButtonRef}
        type="button"
        className="btn-retro"
        onClick={launch}
        disabled={!preset.playerTeamIds.length || (preset.mode === 'Fighter' ? !preset.opponentTeamIds.length : !enemyData.customRoster.length)}
        style={{ justifySelf: 'stretch', padding: '13px 18px', borderColor: '#39c5bb', color: '#fff', background: 'linear-gradient(90deg, rgba(57,197,187,0.2), rgba(255,138,80,0.12))' }}
      >
        {lang === 'fr' ? `LANCER ${modeInfo.fr} — ${preset.opponentControl === 'p2' ? 'P2 LOCAL' : 'CPU'}` : `LAUNCH ${modeInfo.en} — ${preset.opponentControl === 'p2' ? 'LOCAL P2' : 'CPU'}`}
      </button>
        </div>
      </footer>
    </div>
  );
}
