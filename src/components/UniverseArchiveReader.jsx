import React, { useLayoutEffect, useRef, useState } from 'react';
import UniverseArchiveDialog from './UniverseArchiveDialog.jsx';
import UniverseArchiveCatalog from './UniverseArchiveCatalog.jsx';
import CharacterWardrobe from './CharacterWardrobe.jsx';
import { getCharacterPlaque } from '../game/characterPlaques.js';
import { getHeroSpriteSheetSrc, getItemSpriteSrc, getSpriteSheetLayout } from '../game/spriteAssets.js';
import { getQuarantinedCanonSprite } from '../game/canonicalSpriteQuarantine.js';
import { getBattleItemLoreDescription, getEnemyLoreDescription } from '../game/loreDescriptions.js';
import { archiveSearchText, getArchiveNeighbour } from '../game/universeArchiveView.js';
import { updateCatalogView } from '../game/catalogPagination.js';

const getLocalizedText = (entry, lang, fallback = '') => typeof entry === 'string' ? entry : entry?.[lang] || entry?.fr || entry?.en || fallback;

/** Read-only presentation; catalogue views never become progression or save data. */
export default function UniverseArchiveReader({ archive: selectedUniverseArchive, lang = 'fr', section = 'signatures', onSectionChange, onClose, universes = [], onUniverseChange, unlockedHeroes = [], heroLevels = {}, completedStages = [], inventory = [], presentation }) {
  const { getHeroStats, getEnemySpriteInfo, formatBoostText, getGearLore, getEventLore, getNonCombatStageDetails, getRiftDossierArtSrc, getRichBreachBrief, iconSrc, mediaLabel, isOriginal } = presentation;
  const [views, setViews] = useState({});
  const closeRef = useRef(null);
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const tabsRef = useRef({});
  const universeFocus = useRef(false);
  const fr = lang === 'fr';
  const sections = [
    ['signatures', fr ? 'Personnages et menaces' : 'Characters and threats'],
    ['items', fr ? 'Objets' : 'Items'],
    ...(selectedUniverseArchive.livingWorld ? [['world', fr ? 'Monde vivant' : 'Living world']] : []),
    ['missions', fr ? 'Missions et arcs' : 'Missions and arcs']
  ];
  const activeSection = sections.some(([id]) => id === section) ? section : 'signatures';
  useLayoutEffect(() => {
    if (activeSection !== section) onSectionChange(activeSection);
    if (!universeFocus.current) return;
    universeFocus.current = false;
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
  }, [selectedUniverseArchive.universe, activeSection, section, onSectionChange]);
  const catalogProps = (catalogId, entries, title) => {
    const key = JSON.stringify([selectedUniverseArchive.universe, catalogId]);
    return { catalogId, title, entries, lang, view: views[key], onViewChange: change => setViews(current => updateCatalogView(current, key, change)) };
  };
  const onTabKey = (event, index) => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % sections.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + sections.length) % sections.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = sections.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    const id = sections[target][0];
    onSectionChange(id);
    tabsRef.current[id]?.focus();
  };
  return <UniverseArchiveDialog onClose={onClose} cleared={selectedUniverseArchive.cleared} universe={selectedUniverseArchive.universe} initialFocusRef={closeRef}>
    <header className="universe-archive-header">
      <strong>{fr ? 'Dossier univers' : 'Universe dossier'}</strong>
      <button ref={closeRef} type="button" data-archive-close onClick={onClose}>{fr ? 'Fermer' : 'Close'}</button>
    </header>
    <div className="universe-archive-scroll" ref={scrollRef}>
      <div className="universe-archive-intro">
        {iconSrc && <img src={iconSrc} alt="" onError={event => { event.currentTarget.style.display = 'none'; }} />}
        <div>
          <h2 id="universe-archive-title" tabIndex={0} ref={titleRef}>{getLocalizedText(selectedUniverseArchive.lore?.title, lang, selectedUniverseArchive.universe)}</h2>
          <p>{mediaLabel} · {selectedUniverseArchive.cleared ? (fr ? 'Stabilisé' : 'Stabilized') : (fr ? 'À stabiliser' : 'To stabilize')}{selectedUniverseArchive.hidden ? ` · ${fr ? 'Masqué admin' : 'Admin hidden'}` : ''}</p>
        </div>
      </div>
      <details className="universe-archive-lore" key={selectedUniverseArchive.universe}>
        <summary>{fr ? 'Contexte et continuité' : 'Background and continuity'}</summary>
        <p>{selectedUniverseArchive.loreBrief}</p>
        <p>{isOriginal
          ? (fr ? 'Création originale : continuité propre à Multiverse Breach.' : 'Original creation: a continuity belonging to Multiverse Breach.')
          : (fr ? 'Univers de franchise : origines de référence distinctes de leur adaptation fan-made dans Multiverse Breach.' : 'Franchise universe: source origins are separate from their fan-made adaptation in Multiverse Breach.')}</p>
      </details>
      <div className="universe-archive-neighbours" aria-label={fr ? 'Univers du catalogue' : 'Catalogue universes'}>
        {[-1, 1].map(direction => {
          const neighbour = getArchiveNeighbour(universes, selectedUniverseArchive.universe, direction);
          return <button key={direction} type="button" data-archive-neighbour={direction} disabled={!neighbour} onClick={() => { if (neighbour) { universeFocus.current = true; onUniverseChange(neighbour); } }}>
            {direction < 0 ? (fr ? '← Univers précédent' : '← Previous universe') : (fr ? 'Univers suivant →' : 'Next universe →')}
          </button>;
        })}
      </div>
      <dl className="universe-archive-counts">
        {[
          [fr ? 'Héros' : 'Heroes', selectedUniverseArchive.heroes.length],
          [fr ? 'Menaces' : 'Threats', selectedUniverseArchive.allEnemies.length],
          [fr ? 'Reliques' : 'Relics', selectedUniverseArchive.relics.length],
          [fr ? 'Artefacts' : 'Artifacts', selectedUniverseArchive.battleItems.length],
          [fr ? 'Missions' : 'Missions', selectedUniverseArchive.stages.length]
        ].map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}
      </dl>
      <div role="tablist" className="universe-archive-tabs" aria-label={fr ? 'Chapitres du dossier' : 'Dossier chapters'}>
        {sections.map(([id, label], index) => <button key={id} id={`universe-archive-tab-${id}`} role="tab" type="button" ref={node => { tabsRef.current[id] = node; }} aria-selected={activeSection === id} aria-controls="universe-archive-panel" tabIndex={activeSection === id ? 0 : -1} onClick={() => onSectionChange(id)} onKeyDown={event => onTabKey(event, index)}>{label}</button>)}
      </div>
      <div key={`${selectedUniverseArchive.universe}:${activeSection}`} role="tabpanel" tabIndex={0} id="universe-archive-panel" aria-labelledby={`universe-archive-tab-${activeSection}`} data-archive-section={activeSection} className="universe-archive-chapter">

        {activeSection === 'signatures' && <div className="universe-archive-columns">
          <UniverseArchiveCatalog {...catalogProps('heroes', selectedUniverseArchive.heroes, fr ? 'Personnages indexés' : 'Indexed characters')} getSearchText={hero => archiveSearchText([hero, getCharacterPlaque(hero)])} emptyMessage={fr ? 'Aucun héros jouable indexé pour cet univers.' : 'No playable hero indexed for this universe.'}>
            {items => items.map(hero => {
                        const unlocked = unlockedHeroes.includes(hero.id);
                        const stats = getHeroStats(hero);
                        const plaque = getCharacterPlaque(hero);
                        const rejectedSourceArt = getQuarantinedCanonSprite(hero);
                        const portraitSrc = rejectedSourceArt ? null : hero.portrait || null;
                        const spriteSrc = rejectedSourceArt ? null : portraitSrc || getHeroSpriteSheetSrc(hero, 'collection');
                        const spriteLayout = getSpriteSheetLayout(spriteSrc || '');
                        return (
                          <article className="universe-archive-actor" data-archive-entry={hero.id} key={hero.id} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', gap: '9px', padding: '8px', border: `1px solid ${hero.primaryColor}55`, background: `${hero.primaryColor}12`, borderRadius: '4px' }}>
                            <div
                              role="img"
                              aria-label={rejectedSourceArt ? `${hero.name} - art pending review` : `${hero.name} sprite`}
                              title={rejectedSourceArt ? (lang === 'fr' ? 'Illustration non conforme, remplacement requis' : 'Source art rejected, replacement required') : (lang === 'fr' ? `Plaquette de ${hero.name}` : `${hero.name} sprite sheet`)}
                              style={{
                                width: '84px',
                                height: '96px',
                                alignSelf: 'start',
                                border: `1px solid ${hero.primaryColor}66`,
                                backgroundColor: '#050509',
                                backgroundImage: spriteSrc ? `url("${spriteSrc}")` : 'none',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: portraitSrc ? 'cover' : `${spriteLayout.columns * 100}% ${spriteLayout.rows * 100}%`,
                                backgroundPosition: portraitSrc ? 'center 22%' : '0 0',
                                imageRendering: 'pixelated',
                                display: 'grid',
                                placeItems: 'center',
                                textAlign: 'center',
                                color: '#f6d18c',
                                fontSize: '.75rem'
                              }}
                            >
                              {rejectedSourceArt && (lang === 'fr' ? 'ART À REFAIRE' : 'ART PENDING')}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                <b style={{ color: hero.primaryColor, fontSize: '.9rem' }}>{hero.name}</b>
                                <span style={{ color: unlocked ? '#2ecc71' : '#777', fontSize: '.82rem' }}>
                                  {unlocked ? (lang === 'fr' ? 'Recrute' : 'Recruited') : (lang === 'fr' ? 'Archive' : 'Archive')}
                                </span>
                              </div>
                              <div style={{ color: '#aaa', fontSize: '.82rem', marginTop: '4px' }}>
                                {hero.category} / Lv {heroLevels[hero.id] || 1} / HP {stats.hp} ATK {stats.atk} DEF {stats.def}
                              </div>
                              <div style={{ color: '#d0d0d0', fontSize: '.82rem', lineHeight: 1.35, marginTop: '5px' }}>
                                <b>{getLocalizedText(plaque?.origin, lang)}</b>
                                <p style={{ margin: '4px 0 0' }}>{getLocalizedText(plaque?.dossier, lang)}</p>
                              </div>
                              {plaque?.breachLore && <div style={{ color: '#9eb6c6', fontSize: '.82rem', lineHeight: 1.35, marginTop: '5px' }}>
                                <b>{lang === 'fr' ? 'Adaptation Breach : ' : 'Breach adaptation: '}</b>{getLocalizedText(plaque.breachLore, lang)}
                              </div>}
                            </div>
                          </article>
                        );
                      })}
          </UniverseArchiveCatalog>
          <UniverseArchiveCatalog {...catalogProps('enemies', selectedUniverseArchive.allEnemies, fr ? 'Menaces locales' : 'Local threats')} getSearchText={enemy => archiveSearchText([enemy, getEnemyLoreDescription({ enemy, universe: selectedUniverseArchive.universe, lang, lore: selectedUniverseArchive.lore, type: selectedUniverseArchive.allEnemies.indexOf(enemy) === selectedUniverseArchive.allEnemies.length - 1 ? 'worldBoss' : 'menace' })])}>
            {items => items.map(enemy => {
                        const index = selectedUniverseArchive.allEnemies.indexOf(enemy);
                        const portraitSrc = enemy.portrait || null;
                        const spriteInfo = getEnemySpriteInfo(enemy, selectedUniverseArchive.universe);
                        const spriteSrc = portraitSrc || spriteInfo.src;
                        const illustrationReady = Boolean(portraitSrc) || spriteInfo.ready;
                        const spriteLayout = getSpriteSheetLayout(spriteSrc);
                        return (
                          <article className="universe-archive-actor" data-archive-entry={enemy.id || enemy.name} key={`${enemy.name}-${index}`} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: '8px', padding: '7px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                            <div
                              role={illustrationReady ? 'img' : undefined}
                              aria-label={illustrationReady ? `${enemy.name} sprite` : undefined}
                              style={{
                                width: '72px',
                                height: '72px',
                                border: '1px solid rgba(231,76,60,0.3)',
                                backgroundColor: '#050509',
                                backgroundImage: illustrationReady ? `url("${spriteSrc}")` : undefined,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: portraitSrc ? 'cover' : `${spriteLayout.columns * 100}% ${spriteLayout.rows * 100}%`,
                                backgroundPosition: portraitSrc ? 'center 22%' : '0 0',
                                imageRendering: 'pixelated'
                              }}
                            >
                              {!illustrationReady && <span className="universe-archive-illustration-placeholder" aria-hidden="true">?</span>}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ color: enemy.color || '#e74c3c', fontSize: '.85rem', fontWeight: 'bold' }}>{enemy.name}</div>
                              {!illustrationReady && <p className="universe-archive-illustration-status">{lang === 'fr' ? 'Illustration à venir' : 'Illustration pending'}</p>}
                              <div style={{ color: '#aaa', fontSize: '.82rem', marginTop: '3px' }}>
                                HP {enemy.hp || '?'} / ATK {enemy.atk || '?'} / SPD {enemy.spd || '?'}
                              </div>
                              {enemy.special && (
                                <div style={{ color: '#ffb15c', fontSize: '.82rem', marginTop: '3px' }}>
                                  {getLocalizedText(enemy.special?.name ?? enemy.special, lang, enemy.name)}
                                </div>
                              )}
                              <div style={{ color: '#d0b7b7', fontSize: '.82rem', lineHeight: 1.35, marginTop: '5px' }}>
                                {getEnemyLoreDescription({
                                  enemy,
                                  universe: selectedUniverseArchive.universe,
                                  lang,
                                  lore: selectedUniverseArchive.lore,
                                  type: index === selectedUniverseArchive.allEnemies.length - 1 ? 'worldBoss' : 'menace'
                                })}
                              </div>
                              <CharacterWardrobe actor={{...enemy, universe: selectedUniverseArchive.universe}} lang={lang} inventory={inventory} readOnly />
                            </div>
                          </article>
                        );
                      })}
          </UniverseArchiveCatalog>
        </div>}
        {activeSection === 'items' && <div className="universe-archive-columns">
          <div className="universe-archive-stack">
          <UniverseArchiveCatalog {...catalogProps('relics', selectedUniverseArchive.relics, fr ? 'Reliques' : 'Relics')} getSearchText={item => archiveSearchText([item, getGearLore(item), formatBoostText(item.boost || {})])}>
            {items => items.map(item => (
                        <article data-archive-entry={item.id} key={item.id} style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.35, paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: '7px', alignItems: 'center' }}>
                          <img src={getItemSpriteSrc(item)} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} style={{ width: '34px', height: '34px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                          <div>
                            <b style={{ color: '#d7b5ff' }}>{getLocalizedText(item.name, lang, item.id)}</b> / {formatBoostText(item.boost || {})}
                            <div style={{ color: '#bdb3cf', marginTop: '3px' }}>{getGearLore(item)}</div>
                          </div>
                        </article>
                      ))}
          </UniverseArchiveCatalog>
          {selectedUniverseArchive.eventItem && <section className="universe-archive-catalog" data-archive-event-item={selectedUniverseArchive.eventItem.id}>
            <h3>{fr ? 'Objet événement' : 'Event item'}</h3>
            <article className="universe-archive-event-item">
              <img src={getItemSpriteSrc(selectedUniverseArchive.eventItem)} alt="" onError={event => { event.currentTarget.style.display = 'none'; }} />
              <div><b>{getLocalizedText(selectedUniverseArchive.eventItem.name, lang, selectedUniverseArchive.eventItem.id)}</b>: {getEventLore(selectedUniverseArchive.eventItem)}</div>
            </article>
          </section>}
          </div>
          <UniverseArchiveCatalog {...catalogProps('battle-items', selectedUniverseArchive.battleItems, fr ? 'Artefacts mêlée et tactique' : 'Melee and tactics artifacts')} getSearchText={item => archiveSearchText([item, getBattleItemLoreDescription({ item, lang, lore: selectedUniverseArchive.lore })])}>
            {items => items.map(item => (
                        <article data-archive-entry={item.id} key={item.id} style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.35, display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', gap: '7px', alignItems: 'center' }}>
                          <img
                            src={getItemSpriteSrc(item)}
                            alt=""
                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            style={{ width: '28px', height: '28px', objectFit: 'contain', imageRendering: 'pixelated' }}
                          />
                          <div>
                          <b style={{ color: item.color }}>{item.tier === 'ultimate' ? 'ULT' : item.tier === 'summon' ? 'PNJ' : String(item.role || 'item').toUpperCase()}</b>
                          {' '}
                          {getBattleItemLoreDescription({ item, lang, lore: selectedUniverseArchive.lore })}
                          </div>
                        </article>
                      ))}
          </UniverseArchiveCatalog>
          <UniverseArchiveCatalog {...catalogProps('world-items', selectedUniverseArchive.worldItems, fr ? 'Catalogue local complet' : 'Complete local catalogue')}>
            {items => items.map(item => (
                        <article data-archive-entry={item.id} key={item.id} style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.4, padding: '7px', border: '1px solid rgba(255,226,122,0.12)', background: 'rgba(0,0,0,0.18)', borderRadius: '4px' }}>
                          <b style={{ color: '#ffe27a' }}>{getLocalizedText(item.name, lang, item.id)}</b>
                          <div style={{ color: '#aebfca' }}>{getLocalizedText(item.desc, lang)}</div>
                          <div>{item.type} / {item.rarityId} / {item.acquisition} / 3 {lang === 'fr' ? 'rangs' : 'ranks'}</div>
                        </article>
                      ))}
          </UniverseArchiveCatalog>
        </div>}
        {activeSection === 'world' && selectedUniverseArchive.livingWorld && (
                  <div style={{ padding: '12px', border: '1px solid rgba(52,152,219,0.3)', background: 'rgba(52,152,219,0.05)', borderRadius: '5px' }}>
                    <h3 style={{ color: '#8bd4ff' }}>
                      {lang === 'fr' ? 'Monde vivant complet' : 'Complete living world'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14.69rem), 1fr))', gap: '10px', marginTop: '9px' }}>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Lieux et routes' : 'Places and routes'}</b>
                        {selectedUniverseArchive.livingWorld.locations.map(location => (
                          <div key={location.id} style={{ marginTop: '5px' }}>
                            <b>{getLocalizedText(location.name, lang, location.id)}</b> / {location.type}
                            <div style={{ color: '#aebfca' }}>{getLocalizedText(location.dailyUse, lang)}{location.connectedTo ? ` → ${location.connectedTo}` : ''}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Population et autorités' : 'Population and authorities'}</b>
                        <div style={{ marginTop: '5px' }}>{lang === 'fr' ? 'Habitants' : 'Inhabitants'}: {selectedUniverseArchive.livingWorld.population.inhabitants.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Dirigeants' : 'Leaders'}: {selectedUniverseArchive.livingWorld.population.leaders.join(', ')}</div>
                        {selectedUniverseArchive.livingWorld.population.supportNpcs.map(npc => (
                          <div key={npc.id}>{npc.role}: {npc.name}</div>
                        ))}
                        <div style={{ color: '#aebfca', marginTop: '4px' }}>
                          {lang === 'fr' ? 'Créatures neutres' : 'Neutral creatures'}: {selectedUniverseArchive.livingWorld.population.neutralCreatures.join(', ')}
                        </div>
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Société et économie' : 'Society and economy'}</b>
                        <div style={{ marginTop: '5px' }}>{lang === 'fr' ? 'Factions' : 'Factions'}: {selectedUniverseArchive.livingWorld.society.minorFactions.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Croyances' : 'Beliefs'}: {selectedUniverseArchive.livingWorld.society.beliefs.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Métiers' : 'Professions'}: {selectedUniverseArchive.livingWorld.society.professions.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Ressources' : 'Resources'}: {selectedUniverseArchive.livingWorld.society.resources.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Monnaie' : 'Currency'}: {selectedUniverseArchive.livingWorld.society.economy.currency}</div>
                        <div>{lang === 'fr' ? 'Exportations' : 'Exports'}: {selectedUniverseArchive.livingWorld.society.economy.exports.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Importations' : 'Imports'}: {selectedUniverseArchive.livingWorld.society.economy.imports.join(', ')}</div>
                        <div style={{ color: '#aebfca', marginTop: '4px' }}>{selectedUniverseArchive.livingWorld.society.architecture}</div>
                        <div>{lang === 'fr' ? 'Cuisine' : 'Food'}: {selectedUniverseArchive.livingWorld.society.food.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Véhicules' : 'Vehicles'}: {selectedUniverseArchive.livingWorld.society.vehicles.join(', ')}</div>
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Écologie' : 'Ecology'}</b>
                        <div style={{ marginTop: '5px' }}>{lang === 'fr' ? 'Flore' : 'Flora'}: {selectedUniverseArchive.livingWorld.ecology.flora.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Faune' : 'Fauna'}: {selectedUniverseArchive.livingWorld.ecology.fauna.join(', ')}</div>
                        <div>{lang === 'fr' ? 'Menaces' : 'Threats'}: {selectedUniverseArchive.livingWorld.ecology.threats.join(', ')}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14.69rem), 1fr))', gap: '10px', marginTop: '10px', paddingTop: '9px', borderTop: '1px solid rgba(139,212,255,0.16)' }}>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Dialogues et relations' : 'Dialogues and relationships'}</b>
                        {selectedUniverseArchive.livingWorld.dialogues.map(dialogue => (
                          <div key={dialogue.id} style={{ marginTop: '5px' }}><b>{dialogue.speaker}</b> ({dialogue.location}): {dialogue.line}</div>
                        ))}
                        {selectedUniverseArchive.livingWorld.heroRelationships.map(relationship => (
                          <div key={relationship.id} style={{ color: '#aebfca' }}>{relationship.bond}{relationship.gameplayBonus?.assistChargePercent != null ? ` / +${relationship.gameplayBonus.assistChargePercent}% assist` : ''}</div>
                        ))}
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Quêtes secondaires' : 'Side quests'}</b>
                        {selectedUniverseArchive.livingWorld.sideQuests.map(quest => (
                          <div key={quest.id} style={{ marginTop: '5px' }}>
                            <b>{getLocalizedText(quest.title, lang, quest.id)}</b> / {quest.giver}
                            <div style={{ color: '#aebfca' }}>{quest.objective}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Événements dynamiques' : 'Dynamic events'}</b>
                        {selectedUniverseArchive.livingWorld.randomEvents.map(event => (
                          <div key={event.id} style={{ marginTop: '5px' }}>{Math.round(event.chance * 100)}% / {event.effect}</div>
                        ))}
                      </div>
                      <div style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.45 }}>
                        <b style={{ color: '#8bd4ff' }}>{lang === 'fr' ? 'Entrées de codex' : 'Codex entries'}</b>
                        {selectedUniverseArchive.livingWorld.codexEntries.map(entry => (
                          <div key={entry.id} style={{ marginTop: '5px' }}>
                            <b>{getLocalizedText(entry.title, lang, entry.id)}</b>
                            <div style={{ color: '#aebfca' }}>{getLocalizedText(entry.body, lang)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
        {activeSection === 'missions' && <div className="universe-archive-columns">
          <UniverseArchiveCatalog {...catalogProps('missions', selectedUniverseArchive.stages, fr ? 'Missions liées' : 'Linked missions')} getSearchText={stage => archiveSearchText([stage, getRichBreachBrief(stage), getNonCombatStageDetails(stage, lang)])}>
            {items => items.map(stage => (
                        <article data-archive-entry={stage.id} key={stage.id} style={{ color: completedStages.includes(stage.id) ? '#dfffe8' : '#aaa', fontSize: '.82rem', lineHeight: 1.35, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', background: 'rgba(0,0,0,0.2)' }}>
                          {getRiftDossierArtSrc(stage) && (
                            <img src={getRiftDossierArtSrc(stage)} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} style={{ width: '100%', height: '74px', display: 'block', objectFit: 'cover' }} />
                          )}
                          <div style={{ padding: '7px' }}>
                          <b style={{ color: completedStages.includes(stage.id) ? '#2ecc71' : '#ffeb3b' }}>
                            #{stage.id} {stage.displayName?.[lang] || stage.name}
                          </b>
                          {' '}
                          / {stage.mode} / {getNonCombatStageDetails(stage, lang)
                            ? `${lang === 'fr' ? 'Epreuve' : 'Trial'}: ${getNonCombatStageDetails(stage, lang).title}`
                            : stage.bossName}
                          <div style={{ color: '#9fb0ad', marginTop: '3px' }}>{getRichBreachBrief(stage)}</div>
                          </div>
                        </article>
                      ))}
          </UniverseArchiveCatalog>
          <UniverseArchiveCatalog {...catalogProps('arcs', [...selectedUniverseArchive.universeArcs, ...selectedUniverseArchive.characterArcs], fr ? 'Arcs narratifs' : 'Narrative arcs')}>
            {items => items.map(arc => (
                        <article data-archive-entry={arc.id} key={arc.id} style={{ color: '#ddd', fontSize: '.82rem', lineHeight: 1.35 }}>
                          <b style={{ color: '#ffb15c' }}>{getLocalizedText(arc.title, lang, arc.id)}</b>: {getLocalizedText(arc.intro || arc.reward, lang)}
                        </article>
                      ))}
          </UniverseArchiveCatalog>
          <UniverseArchiveCatalog {...catalogProps('collections', selectedUniverseArchive.franchiseCollections, fr ? 'Collections' : 'Collections')}>
            {items => items.map(collection => (
                        <article data-archive-entry={collection.id} key={collection.id} style={{ color: collection.complete ? '#2ecc71' : '#aaa', fontSize: '.82rem', lineHeight: 1.35 }}>
                          <b>{getLocalizedText(collection.title, lang, collection.id)}</b>: {collection.completed}/{collection.total} / {getLocalizedText(collection.bonus, lang)}
                        </article>
                      ))}
          </UniverseArchiveCatalog>
        </div>}
      </div>
    </div>
  </UniverseArchiveDialog>;
}
