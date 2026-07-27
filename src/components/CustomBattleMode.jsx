import React, { useEffect, useMemo, useState } from 'react';
import GameCanvas from './GameCanvas';
import FighterMode from './FighterMode';
import sound from '../game/soundEngine';
import { getUnlockableById } from '../game/universeUnlockables';
import {
  buildCustomEnemyCatalog,
  buildCustomEnemyData,
  buildCustomRuntimeStage,
  normalizeCustomBattlePreset
} from '../game/customBattle';

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
  minHeight: 40,
  padding: '8px 10px',
  color: '#eaffff',
  border: '1px solid rgba(57,197,187,0.35)',
  borderRadius: 4,
  background: 'rgba(0,0,0,0.72)',
  font: "11px 'Share Tech Mono', monospace"
};

const localized = (entry, lang, fallback = '') => (
  entry?.name?.[lang] || entry?.name?.fr || entry?.name?.en || entry?.name || fallback
);

const presetsEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function TeamPicker({ title, heroes, selectedIds, onChange, max = 3, accent = '#39c5bb', lang }) {
  const selectedSet = new Set(selectedIds);
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
    <section style={panelStyle}>
      <div className="fighter-section-label" style={{ color: accent, marginBottom: 9 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 7, maxHeight: 220, overflow: 'auto' }}>
        {heroes.map(hero => {
          const selected = selectedSet.has(hero.id);
          return (
            <button
              type="button"
              key={hero.id}
              onClick={() => toggle(hero.id)}
              className="btn-retro"
              aria-pressed={selected}
              title={selected
                ? (lang === 'fr' ? `Retirer ${hero.name}` : `Remove ${hero.name}`)
                : (lang === 'fr' ? `Ajouter ${hero.name}` : `Add ${hero.name}`)}
              style={{
                padding: '8px 9px',
                textAlign: 'left',
                borderColor: selected ? accent : '#34454b',
                color: selected ? '#fff' : '#9db0b5',
                background: selected ? `${accent}22` : 'rgba(0,0,0,0.3)',
                opacity: !selected && selectedIds.length >= max ? 0.42 : 1
              }}
            >
              <strong style={{ display: 'block', fontSize: 10 }}>{selected ? '◆ ' : '◇ '}{hero.name}</strong>
              <small style={{ display: 'block', marginTop: 4, color: hero.primaryColor || accent, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {hero.universe}
              </small>
            </button>
          );
        })}
      </div>
      <small style={{ display: 'block', marginTop: 8, color: '#7f969b' }}>{selectedIds.length}/{max}</small>
    </section>
  );
}

function ThreatPicker({ catalog, selectedIds, onChange, max = 6, lang }) {
  const [query, setQuery] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const selectedSet = new Set(selectedIds);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = catalog
    .filter(entry => !selectedSet.has(entry.id))
    .filter(entry => !normalizedQuery || `${entry.name} ${entry.universe}`.toLowerCase().includes(normalizedQuery))
    .slice(0, 250);
  const selected = selectedIds.map(id => catalog.find(entry => entry.id === id)).filter(Boolean);
  const add = () => {
    const id = candidateId || filtered[0]?.id;
    if (!id || selectedIds.length >= max) return;
    onChange([...selectedIds, id]);
    setCandidateId('');
    sound.playSfx('click');
  };
  return (
    <section style={panelStyle}>
      <div className="fighter-section-label" style={{ color: '#ff8a50', marginBottom: 9 }}>
        {lang === 'fr' ? 'MENACES / ENNEMIS' : 'THREATS / ENEMIES'}
      </div>
      <input
        value={query}
        onChange={event => setQuery(event.target.value)}
        aria-label={lang === 'fr' ? 'Rechercher une menace' : 'Search threats'}
        placeholder={lang === 'fr' ? 'Chercher un ennemi ou un univers...' : 'Search enemy or universe...'}
        style={{ ...selectStyle, marginBottom: 7 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 7 }}>
        <select value={candidateId} onChange={event => setCandidateId(event.target.value)} style={selectStyle}>
          {filtered.map(entry => (
            <option key={entry.id} value={entry.id}>
              [{entry.kind === 'worldBoss' ? 'WORLD BOSS' : entry.kind.toUpperCase()}] {entry.name} — {entry.universe}
            </option>
          ))}
        </select>
        <button type="button" className="btn-retro" onClick={add} disabled={!filtered.length || selectedIds.length >= max} style={{ padding: '8px 14px', borderColor: '#ff8a50', color: '#ffb28c' }}>
          {lang === 'fr' ? 'AJOUTER' : 'ADD'}
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
        {selected.map(entry => (
          <button
            type="button"
            key={entry.id}
            onClick={() => selected.length > 1 && onChange(selectedIds.filter(id => id !== entry.id))}
            title={lang === 'fr' ? `Retirer ${entry.name}` : `Remove ${entry.name}`}
            style={{ padding: '5px 8px', color: '#fff', border: '1px solid #8d4b36', background: 'rgba(141,75,54,0.22)', borderRadius: 3, fontSize: 9 }}
          >
            {entry.name} ×
          </button>
        ))}
      </div>
      <small style={{ display: 'block', marginTop: 8, color: '#7f969b' }}>
        {lang === 'fr'
          ? 'Le même roster est utilisé par l IA ou contrôlé à tour de rôle par P2.'
          : 'The same roster is controlled by AI or locally by P2.'}
        {' '}{selectedIds.length}/{max}
      </small>
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
  disabledAssets = {}
}) {
  const [phase, setPhase] = useState('setup');
  const [runtimeNonce, setRuntimeNonce] = useState(0);
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

  const launch = () => {
    if (!preset.playerTeamIds.length) return;
    if (preset.mode === 'Fighter' && !preset.opponentTeamIds.length) return;
    if (preset.mode !== 'Fighter' && !enemyData.customRoster.length) return;
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
        onBattleEnd={() => setPhase('setup')}
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
          onExit={() => setPhase('setup')}
        />
      </div>
    );
  }

  const modeInfo = MODE_OPTIONS.find(mode => mode.id === preset.mode) || MODE_OPTIONS[0];
  return (
    <div className="glass-panel" data-testid="custom-battle-mode" style={{ padding: 18, borderRadius: 8, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', alignItems: 'end', gap: 12, minWidth: 0 }}>
        <div>
          <div style={{ color: '#39c5bb', fontSize: 10, letterSpacing: 2 }}>A.R.C.A. / SIMULATION LIBRE</div>
          <h2 className="cyber-title" style={{ margin: '5px 0 3px', fontSize: 24 }}>
            {lang === 'fr' ? 'COMBAT PERSONNALISE' : 'CUSTOM BATTLE'}
          </h2>
          <p style={{ margin: 0, color: '#9eb5ba', fontSize: 11, lineHeight: 1.5 }}>
            {lang === 'fr'
              ? 'Compose les deux camps, puis choisis le stage, les musiques et les regles. Ces simulations ne donnent aucune recompense de campagne.'
              : 'Build both sides, then choose the stage, music, and rules. Simulations award no campaign rewards.'}
          </p>
        </div>
        <div style={{ padding: '7px 10px', border: '1px solid #7e6d24', color: '#ffeb3b', background: 'rgba(126,109,36,0.16)', fontSize: 9 }}>
          {lang === 'fr' ? 'PROGRESSION DESACTIVEE' : 'PROGRESSION DISABLED'}
        </div>
      </div>

      <section style={{ ...panelStyle, display: 'grid', gap: 10 }}>
        <div className="fighter-section-label">{lang === 'fr' ? 'SYSTEME DE COMBAT' : 'BATTLE SYSTEM'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
          {MODE_OPTIONS.map(mode => (
            <button
              type="button"
              key={mode.id}
              className="btn-retro"
              aria-pressed={preset.mode === mode.id}
              onClick={() => updatePreset({ mode: mode.id })}
              style={{
                padding: '10px 8px',
                borderColor: preset.mode === mode.id ? '#39c5bb' : '#34454b',
                color: preset.mode === mode.id ? '#fff' : '#8fa5aa',
                background: preset.mode === mode.id ? 'rgba(57,197,187,0.14)' : 'rgba(0,0,0,0.24)'
              }}
            >
              <strong style={{ display: 'block', fontSize: 11 }}>{lang === 'fr' ? mode.fr : mode.en}</strong>
              <small style={{ display: 'block', marginTop: 6, color: '#789096', lineHeight: 1.35 }}>{lang === 'fr' ? mode.descFr : mode.descEn}</small>
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'cpu', fr: 'CONTRE CPU', en: 'VERSUS CPU', descFr: 'A.R.C.A. controle le camp adverse.', descEn: 'A.R.C.A. controls the opposing side.' },
            { id: 'p2', fr: 'CONTRE P2 LOCAL', en: 'LOCAL VERSUS P2', descFr: 'Deux joueurs sur le meme appareil.', descEn: 'Two players on the same device.' }
          ].map(option => (
            <button
              type="button"
              key={option.id}
              className="btn-retro"
              aria-pressed={preset.opponentControl === option.id}
              onClick={() => updatePreset({ opponentControl: option.id })}
              style={{ padding: 9, borderColor: preset.opponentControl === option.id ? '#ff8a50' : '#34454b', color: preset.opponentControl === option.id ? '#fff' : '#8fa5aa' }}
            >
              <strong>{lang === 'fr' ? option.fr : option.en}</strong>
              <small style={{ display: 'block', marginTop: 4 }}>{lang === 'fr' ? option.descFr : option.descEn}</small>
            </button>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
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

      <section style={{ ...panelStyle, display: 'grid', gap: 12 }}>
        <div className="fighter-section-label">{lang === 'fr' ? 'STAGE, SON ET TRAME' : 'STAGE, SOUND, AND THREAD'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="fighter-section-label">{lang === 'fr' ? 'STAGE' : 'STAGE'}</span>
            <select value={preset.stageArchiveId || ''} onChange={event => updatePreset({ stageArchiveId: event.target.value || null })} style={selectStyle}>
              <option value="">{lang === 'fr' ? 'Nexus - arene de simulation' : 'Nexus simulation arena'}</option>
              {archives.map(archive => <option key={archive.id} value={archive.id}>{archive.universe}</option>)}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="fighter-section-label">{lang === 'fr' ? 'DIFFICULTE CPU' : 'CPU DIFFICULTY'}</span>
            <select value={preset.difficulty} onChange={event => updatePreset({ difficulty: event.target.value })} disabled={preset.opponentControl === 'p2'} style={selectStyle}>
              <option value="training">{lang === 'fr' ? 'Entrainement' : 'Training'}</option>
              <option value="standard">Standard</option>
              <option value="expert">Expert</option>
            </select>
          </label>
          <LoadoutSelect label={lang === 'fr' ? 'MUSIQUE DU STAGE' : 'STAGE MUSIC'} value={preset.stageMusicId} onChange={id => updatePreset({ stageMusicId: id })} options={ownedStageMusic} defaultLabel={lang === 'fr' ? 'Automatique selon le stage' : 'Automatic for stage'} lang={lang} />
          <LoadoutSelect label={lang === 'fr' ? 'MUSIQUE DU COMBAT' : 'BATTLE MUSIC'} value={preset.battleMusicId} onChange={id => updatePreset({ battleMusicId: id })} options={ownedBattleMusic} defaultLabel={lang === 'fr' ? 'Automatique selon le combat' : 'Automatic for battle'} lang={lang} />
          <LoadoutSelect label={lang === 'fr' ? 'SUPER DE TERRAIN' : 'FIELD SUPER'} value={preset.fieldSuperId} onChange={id => updatePreset({ fieldSuperId: id })} options={ownedFieldSupers} defaultLabel={lang === 'fr' ? 'Aucun super de terrain' : 'No field super'} lang={lang} />
          {preset.mode !== 'Fighter' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: 8 }}>
              {[
                { key: 'items', fr: 'Objets', en: 'Items' },
                { key: 'hazards', fr: 'Dangers', en: 'Hazards' }
              ].map(rule => (
                <label key={rule.key} style={{ minHeight: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', border: '1px solid #34454b', borderRadius: 4, color: '#cce6e7', fontSize: 10 }}>
                  <input type="checkbox" checked={preset[rule.key]} onChange={event => updatePreset({ [rule.key]: event.target.checked })} />
                  {lang === 'fr' ? rule.fr : rule.en}
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedArchive?.image && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 12, alignItems: 'center', padding: 10, border: '1px solid rgba(57,197,187,0.18)', background: 'rgba(57,197,187,0.04)' }}>
            <img src={selectedArchive.image} alt="" style={{ width: 180, maxWidth: '100%', maxHeight: 110, objectFit: 'cover', border: '1px solid #31545a', boxSizing: 'border-box' }} />
            <div>
              <strong style={{ color: selectedArchive.color || '#39c5bb' }}>{selectedArchive.universe}</strong>
              <p style={{ margin: '5px 0 0', color: '#8ea6ab', fontSize: 10, lineHeight: 1.45 }}>
                {lang === 'fr'
                  ? `Le stage debloque est adapte automatiquement au moteur ${modeInfo.fr}.`
                  : `The unlocked stage is automatically adapted to the ${modeInfo.en} engine.`}
              </p>
            </div>
          </div>
        )}
      </section>

      {preset.opponentControl === 'p2' && (
        <div style={{ padding: 10, border: '1px solid rgba(255,138,80,0.38)', background: 'rgba(255,138,80,0.08)', color: '#ffd4bd', fontSize: 10, lineHeight: 1.5 }}>
          {preset.mode === 'Tactics' || preset.mode === 'RPG'
            ? (lang === 'fr' ? 'P2 prend les commandes pendant les tours/ATB ennemis. La souris est partagee en Tactique.' : 'P2 takes control during enemy turns/ATB. The mouse is shared in Tactics.')
            : (lang === 'fr' ? 'P1 utilise ZQSD et ses touches d action; P2 utilise les fleches et le second groupe de touches affiche en combat.' : 'P1 uses ZQSD and the first action-key group; P2 uses arrows and the second group shown in battle.')}
        </div>
      )}

      <button
        type="button"
        className="btn-retro"
        onClick={launch}
        disabled={!preset.playerTeamIds.length || (preset.mode === 'Fighter' ? !preset.opponentTeamIds.length : !enemyData.customRoster.length)}
        style={{ justifySelf: 'stretch', padding: '13px 18px', borderColor: '#39c5bb', color: '#fff', background: 'linear-gradient(90deg, rgba(57,197,187,0.2), rgba(255,138,80,0.12))', fontSize: 13 }}
      >
        {lang === 'fr' ? `LANCER ${modeInfo.fr} — ${preset.opponentControl === 'p2' ? 'P2 LOCAL' : 'CPU'}` : `LAUNCH ${modeInfo.en} — ${preset.opponentControl === 'p2' ? 'LOCAL P2' : 'CPU'}`}
      </button>
    </div>
  );
}
