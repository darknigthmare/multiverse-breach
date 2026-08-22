import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AuthPanel from './AuthPanel';

const PROLOGUE_SCENES = [
  {
    id: 'first-breach',
    image: '/backgrounds/multiverse-breach-title-arca-v1.png',
    title: { fr: 'Le ciel se brise', en: 'The sky breaks' },
    kicker: { fr: 'Archive 00 / La Premiere Breche', en: 'Archive 00 / The First Breach' },
    body: {
      fr: 'Veyr, Archiviste du Voile, voulut relier les mondes sans les conquerir. Il ouvrit pourtant la Premiere Breche en sachant qu une route tomberait. Quand A.R.C.A. effaca les noms de cette Route X sacrifiee, sa pression causale prit forme dans le passage de Veyr: le Sans-Auteur ne venait pas d ailleurs, il naquit de ce que le Nexus refusait de reconnaitre.',
      en: 'Veyr, Archivist of the Veil, tried to connect worlds without conquering them. Yet he opened the First Breach knowing one route would fall. When A.R.C.A. erased the names of that sacrificed Route X, its causal pressure took form through Veyr passage: the Authorless did not come from elsewhere, but was born from what the Nexus refused to acknowledge.'
    },
    signal: {
      fr: 'Le Voile ne protege plus chaque histoire. Il les laisse tomber les unes dans les autres.',
      en: 'The Veil no longer protects each story. It lets them fall into one another.'
    }
  },
  {
    id: 'falling-threads',
    image: '/backgrounds/halo-tactics-openai.png',
    title: { fr: 'Les Trames tombent', en: 'The Threads fall' },
    kicker: { fr: 'Archive 01 / Mondes deplaces', en: 'Archive 01 / Displaced worlds' },
    body: {
      fr: 'Un anneau Forerunner traverse une ville contaminee. Les couloirs de Black Mesa repondent a des chevrons anciens. Chaque Trame conserve ses lois, ses blessures et ses ennemis, mais leurs frontieres ne tiennent plus.',
      en: 'A Forerunner ring crosses an infected city. Black Mesa corridors answer ancient chevrons. Every Thread keeps its laws, wounds, and enemies, but their borders no longer hold.'
    },
    signal: {
      fr: 'Une Breche ne copie pas un monde. Elle arrache un fragment encore vivant.',
      en: 'A Breach does not copy a world. It tears away a fragment that is still alive.'
    }
  },
  {
    id: 'arca-awakens',
    image: '/backgrounds/resident-evil-tactics-openai.png',
    title: { fr: 'A.R.C.A. repond', en: 'A.R.C.A. answers' },
    kicker: { fr: 'Archive 02 / Protocole de sauvegarde', en: 'Archive 02 / Preservation protocol' },
    body: {
      fr: 'L Archive de Regulation des Convergences Anormales s eveille au milieu des ruines. A.R.C.A. ne peut pas rendre les mondes a leur place. Elle peut encore identifier leurs signatures, contenir leurs collisions et batir un refuge: la Cite-Mosaique.',
      en: 'The Archive for Regulation of Convergence Anomalies awakens among the ruins. A.R.C.A. cannot return worlds to their place. It can still identify their signatures, contain collisions, and build a refuge: Mosaic City.'
    },
    signal: {
      fr: 'Directive centrale: conserver les histoires sans les reecrire.',
      en: 'Core directive: preserve stories without rewriting them.'
    }
  },
  {
    id: 'anchor-signal',
    image: '/backgrounds/half-life-smash-openai.png',
    title: { fr: 'Un signal reste entier', en: 'One signal remains whole' },
    kicker: { fr: 'Archive 03 / Identification Ancre', en: 'Archive 03 / Anchor identification' },
    body: {
      fr: '{name} se reveille entre plusieurs realites sans appartenir entierement a aucune. Cette coherence impossible fait de toi une Ancre: une signature capable de traverser une Breche sans perdre son nom.',
      en: '{name} wakes between several realities without fully belonging to any of them. That impossible coherence makes you an Anchor: a signature able to cross a Breach without losing its name.'
    },
    signal: {
      fr: 'Identite confirmee. Memoire coherente. Resonance compatible avec le Nexus.',
      en: 'Identity confirmed. Memory coherent. Resonance compatible with the Nexus.'
    }
  },
  {
    id: 'first-cell',
    image: '/backgrounds/stargate-rpg-openai.png',
    title: { fr: 'La premiere cellule', en: 'The first cell' },
    kicker: { fr: 'Archive 04 / Ordre de mission', en: 'Archive 04 / Mission order' },
    body: {
      fr: 'A.R.C.A. place deux signatures du Nexus sous ton commandement: Mirelle Suture recoud les blessures de Trame avant qu elles n effacent une memoire; Bastion Korr verrouille les lignes qu une faille tente de forcer. Ensemble, vous ouvrirez la premiere route stable.',
      en: 'A.R.C.A. places two Nexus signatures under your command: Mirelle Suture stitches Thread wounds before they erase a memory; Bastion Korr locks down the lines a rift tries to force open. Together, you will open the first stable route.'
    },
    signal: {
      fr: 'Directive Ancre: rejoindre la Cite-Mosaique et stabiliser la premiere Trame.',
      en: 'Anchor directive: reach Mosaic City and stabilize the first Thread.'
    }
  }
];

const localize = (entry, lang) => entry?.[lang] || entry?.fr || entry?.en || '';
const TITLE_ATTRACT_DELAY_MS = 25000;

function IntroLanguageButton({ lang, onToggleLanguage }) {
  return (
    <button
      type="button"
      className="intro-language-button"
      onClick={onToggleLanguage}
      title={lang === 'fr' ? 'Passe toute l interface en anglais.' : 'Switch the whole interface to French.'}
    >
      {lang.toUpperCase()}
    </button>
  );
}

function IntroTitleDialog({
  dialog,
  lang,
  audioSettings,
  cloudConnected,
  onClose,
  onConfirmNewTrace,
  onToggleLanguage,
  onChangeAudioSetting,
  onToggleMute,
  eventOptions,
  activeEventId,
  onSelectEvent
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const initialFocusRef = useRef(null);

  useEffect(() => {
    if (!dialog) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById('root');
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden');
    const wasInert = Boolean(appRoot?.inert);
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...dialogRef.current.querySelectorAll('button, input, a[href]')]
        .filter(element => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    initialFocusRef.current?.focus();
    if (appRoot) {
      appRoot.inert = true;
      appRoot.setAttribute('aria-hidden', 'true');
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (appRoot) {
        appRoot.inert = wasInert;
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden');
        else appRoot.setAttribute('aria-hidden', previousAriaHidden);
      }
      window.requestAnimationFrame(() => previousFocus?.focus?.());
    };
  }, [dialog, onClose]);

  if (!dialog) return null;

  const content = (
    <div
      className="intro-title-dialog-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="intro-title-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {dialog === 'newTrace' && (
          <>
            <span className="intro-dialog-kicker">A.R.C.A. / RESET LOCAL</span>
            <h2 id={titleId}>{lang === 'fr' ? 'Ouvrir une Nouvelle Trace ?' : 'Open a New Trace?'}</h2>
            <p>
              {lang === 'fr'
                ? 'Ta progression locale actuelle sera remplacee. L archive cloud reste preservee et la synchronisation automatique sera suspendue jusqu a ton prochain choix explicite.'
                : 'Your current local progress will be replaced. The cloud archive stays preserved and automatic sync will remain suspended until your next explicit choice.'}
            </p>
            {cloudConnected && (
              <div className="intro-dialog-warning">
                {lang === 'fr' ? 'SIGNATURE CLOUD DETECTEE — aucune archive distante ne sera effacee.' : 'CLOUD SIGNATURE DETECTED — no remote archive will be erased.'}
              </div>
            )}
            <div className="intro-dialog-actions">
              <button ref={initialFocusRef} type="button" className="btn-retro" onClick={onClose}>
                {lang === 'fr' ? 'ANNULER' : 'CANCEL'}
              </button>
              <button
                type="button"
                className="btn-retro intro-destructive-action"
                onClick={() => {
                  onConfirmNewTrace();
                  onClose();
                }}
              >
                {lang === 'fr' ? 'CONFIRMER LA NOUVELLE TRACE' : 'CONFIRM NEW TRACE'}
              </button>
            </div>
          </>
        )}

        {dialog === 'options' && (
          <>
            <span className="intro-dialog-kicker">A.R.C.A. / DEVICE</span>
            <h2 id={titleId}>{lang === 'fr' ? 'Options' : 'Options'}</h2>
            <div className="intro-option-row">
              <div>
                <strong>{lang === 'fr' ? 'Langue' : 'Language'}</strong>
                <small>{lang === 'fr' ? 'Interface francaise active' : 'English interface active'}</small>
              </div>
              <button type="button" className="btn-retro" onClick={onToggleLanguage}>{lang.toUpperCase()}</button>
            </div>
            <label className="intro-volume-option" htmlFor="intro-music-volume">
              <span>{lang === 'fr' ? 'Volume musique' : 'Music volume'} <output>{Math.round(audioSettings.musicVolume * 100)}%</output></span>
              <input
                id="intro-music-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.musicVolume}
                onChange={event => onChangeAudioSetting('musicVolume', Number(event.target.value))}
              />
            </label>
            <label className="intro-volume-option" htmlFor="intro-sfx-volume">
              <span>{lang === 'fr' ? 'Volume effets' : 'Sound effects volume'} <output>{Math.round(audioSettings.sfxVolume * 100)}%</output></span>
              <input
                id="intro-sfx-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.sfxVolume}
                onChange={event => onChangeAudioSetting('sfxVolume', Number(event.target.value))}
              />
            </label>
            <div className="intro-option-row">
              <div>
                <strong>{lang === 'fr' ? 'Sortie audio' : 'Audio output'}</strong>
                <small>{audioSettings.muted ? 'MUTE' : (lang === 'fr' ? 'ACTIVE' : 'ENABLED')}</small>
              </div>
              <button type="button" className="btn-retro" aria-pressed={audioSettings.muted} onClick={onToggleMute}>
                {audioSettings.muted ? (lang === 'fr' ? 'REACTIVER' : 'UNMUTE') : 'MUTE'}
              </button>
            </div>
            <fieldset className="intro-event-options">
              <legend>{lang === 'fr' ? 'Variante evenementielle du titre' : 'Title event variant'}</legend>
              <p>
                {lang === 'fr'
                  ? 'Les operations suivent leur calendrier annuel. Seule une fenetre active peut etre engagee et accorder ses recompenses saisonnieres.'
                  : 'Operations follow their annual calendar. Only an active window can be deployed and grant its seasonal rewards.'}
              </p>
              <div>
                <button
                  type="button"
                  className="btn-retro"
                  aria-pressed={!activeEventId}
                  onClick={() => onSelectEvent(null)}
                >
                  {lang === 'fr' ? 'AUCUNE' : 'NONE'}
                </button>
                {eventOptions.map(event => (
                  <button
                    key={event.id}
                    type="button"
                    className="btn-retro"
                    aria-pressed={event.id === activeEventId}
                    disabled={!event.active}
                    title={event.active
                      ? (lang === 'fr' ? 'Operation active et jouable.' : 'Active playable operation.')
                      : `${lang === 'fr' ? 'Fenetre planifiee' : 'Scheduled window'}: ${event.windowLabel}`}
                    onClick={() => onSelectEvent(event.id)}
                  >
                    {event.title} / {event.windowLabel} {event.active ? (lang === 'fr' ? '(ACTIVE)' : '(ACTIVE)') : ''}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="intro-dialog-actions">
              <button ref={initialFocusRef} type="button" className="btn-retro" onClick={onClose}>
                {lang === 'fr' ? 'FERMER' : 'CLOSE'}
              </button>
            </div>
          </>
        )}

        {dialog === 'credits' && (
          <>
            <span className="intro-dialog-kicker">A.R.C.A. / REGISTRY</span>
            <h2 id={titleId}>{lang === 'fr' ? 'Credits et licences' : 'Credits and licenses'}</h2>
            <div className="intro-credits-copy">
              <p>{lang === 'fr' ? 'Multiverse Breach est un projet fan independant et non officiel. Les univers et marques cites restent la propriete de leurs ayants droit.' : 'Multiverse Breach is an independent, unofficial fan project. Referenced universes and trademarks remain the property of their respective owners.'}</p>
              <p>{lang === 'fr' ? 'Les visuels originaux OpenAI du projet sont identifies dans leurs manifestes et dossiers de provenance.' : 'Original OpenAI project visuals are identified in their manifests and provenance records.'}</p>
              <p>React / React DOM / Vite — {lang === 'fr' ? 'licences distribuees par leurs projets respectifs.' : 'licenses distributed by their respective projects.'}</p>
            </div>
            <div className="intro-dialog-actions">
              <button ref={initialFocusRef} type="button" className="btn-retro" onClick={onClose}>
                {lang === 'fr' ? 'FERMER' : 'CLOSE'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}

function TitleRotationPanel({ lang, entries, activeIndex, onSelect }) {
  if (!entries.length) return null;
  const activeEntry = entries[activeIndex % entries.length];
  return (
    <section className="intro-title-rotation" aria-labelledby="intro-title-rotation-label">
      <header>
        <span id="intro-title-rotation-label">{lang === 'fr' ? 'UNIVERS EN ROTATION' : 'ROTATING UNIVERSES'}</span>
        <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}</strong>
      </header>
      <div className="intro-title-rotation-current">
        <span>{activeEntry.mode} / A.R.C.A.</span>
        <strong>{activeEntry.universe}</strong>
        <small>{activeEntry.ownedHeroes.map(hero => hero.name).join(' / ')}</small>
      </div>
      <div className="intro-title-rotation-thumbs">
        {entries.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            aria-pressed={index === activeIndex}
            aria-label={`${entry.universe} / ${entry.mode}`}
            onClick={() => onSelect(index)}
          >
            <img src={entry.image} alt="" loading="eager" decoding="async" />
          </button>
        ))}
      </div>
    </section>
  );
}

function TitleAttractMode({ lang, entry, card, position, total, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const appRoot = document.getElementById('root');
    const previousFocus = document.activeElement;
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden');
    const wasInert = Boolean(appRoot?.inert);
    closeRef.current?.focus();
    if (appRoot) {
      appRoot.inert = true;
      appRoot.setAttribute('aria-hidden', 'true');
    }
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (appRoot) {
        appRoot.inert = wasInert;
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden');
        else appRoot.setAttribute('aria-hidden', previousAriaHidden);
      }
      window.requestAnimationFrame(() => previousFocus?.focus?.());
    };
  }, [onClose]);

  if (!entry) return null;
  const content = (
    <section
      ref={dialogRef}
      className="intro-title-attract"
      data-attract-mode="active"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'fr' ? 'Mode attract, archives deverrouillees' : 'Attract mode, unlocked archives'}
      style={{ backgroundImage: `linear-gradient(90deg, rgba(2,1,7,0.96), rgba(2,1,7,0.3)), url(${entry.image})` }}
    >
      <div className="intro-attract-topbar">
        <span>{lang === 'fr' ? 'MODE ATTRACT / ARCHIVES DEVERROUILLEES UNIQUEMENT' : 'ATTRACT MODE / UNLOCKED ARCHIVES ONLY'}</span>
        <button ref={closeRef} type="button" onClick={onClose}>{lang === 'fr' ? 'RETOUR AU MENU' : 'RETURN TO MENU'}</button>
      </div>
      <div className="intro-attract-copy">
        <span>{entry.mode} / {String(position + 1).padStart(2, '0')}:{String(total).padStart(2, '0')}</span>
        <h2>{entry.title}</h2>
        <p>
          {lang === 'fr'
            ? `Extrait de stage deja deverrouille dans la Trame ${entry.universe}.`
            : `Stage excerpt already unlocked in the ${entry.universe} Thread.`}
        </p>
        {card && (
          <article className="intro-attract-card">
            <span>{lang === 'fr' ? 'CARTE DEJA DEVERROUILLEE' : 'PREVIOUSLY UNLOCKED CARD'}</span>
            <strong>{card.name}</strong>
            <small>{card.universe} / {card.rarityLabel}</small>
          </article>
        )}
      </div>
    </section>
  );
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}

export default function IntroSequence({
  phase,
  lang,
  playerProfile,
  setPlayerProfile,
  onboarding,
  account,
  cloudStatus,
  progressSummary,
  onToggleLanguage,
  onContinue,
  onNewTrace,
  onOpenCollection,
  onBackToTitle,
  onStartLocal,
  onReplayPrologue,
  onPreviousPrologue,
  onNextPrologue,
  onFinishPrologue,
  onSkipPrologue,
  authProps,
  audioSettings = { musicVolume: 0.7, sfxVolume: 0.8, muted: false },
  onChangeAudioSetting,
  onToggleMute,
  titleRotation = [],
  attractStages = [],
  attractCards = [],
  eventVariant = null,
  eventOptions = [],
  activeEventId = null,
  onSelectEvent = () => {},
  onLaunchEvent = () => {}
}) {
  const [titleDialog, setTitleDialog] = useState(null);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [attractActive, setAttractActive] = useState(false);
  const [attractIndex, setAttractIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ));
  const closeTitleDialog = useCallback(() => setTitleDialog(null), []);
  const closeAttract = useCallback(() => setAttractActive(false), []);
  const playerName = String(playerProfile?.name || '').trim() || (lang === 'fr' ? 'Ancre' : 'Anchor');
  const hasFinishedPrologue = Boolean(onboarding?.prologueCompleted);
  const hasCreatedProfile = Boolean(onboarding?.profileCreated);
  const prologueStep = Math.max(0, Math.min(PROLOGUE_SCENES.length - 1, Number(onboarding?.prologueStep) || 0));
  const scene = PROLOGUE_SCENES[prologueStep];
  const sceneBody = localize(scene?.body, lang).replace('{name}', playerName);
  const safeRotationIndex = titleRotation.length ? rotationIndex % titleRotation.length : 0;
  const attractCycleLength = Math.max(attractStages.length, attractCards.length);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return undefined;
    const handleChange = () => {
      setPrefersReducedMotion(media.matches);
      if (media.matches) setAttractActive(false);
    };
    handleChange();
    if (media.addEventListener) media.addEventListener('change', handleChange);
    else media.addListener?.(handleChange);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', handleChange);
      else media.removeListener?.(handleChange);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'title') return undefined;
    const preloadedImages = [...titleRotation, ...attractStages].map(entry => {
      const image = new Image();
      image.src = entry.image;
      return image;
    });
    return () => preloadedImages.forEach(image => {
      image.onload = null;
      image.onerror = null;
    });
  }, [phase, titleRotation, attractStages]);

  useEffect(() => {
    if (phase !== 'title' || titleDialog || attractActive || prefersReducedMotion || titleRotation.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setRotationIndex(index => (index + 1) % titleRotation.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [phase, titleDialog, attractActive, prefersReducedMotion, titleRotation.length]);

  useEffect(() => {
    if (phase !== 'title' || titleDialog || prefersReducedMotion || !attractStages.length) return undefined;
    let idleTimer = null;
    const scheduleAttract = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        setAttractIndex(0);
        setAttractActive(true);
      }, TITLE_ATTRACT_DELAY_MS);
    };
    const handleActivity = () => {
      setAttractActive(false);
      scheduleAttract();
    };
    scheduleAttract();
    window.addEventListener('pointerdown', handleActivity);
    window.addEventListener('pointermove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('pointermove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [phase, titleDialog, prefersReducedMotion, attractStages.length]);

  useEffect(() => {
    if (!attractActive || prefersReducedMotion || attractCycleLength < 2) return undefined;
    const timer = window.setInterval(() => {
      setAttractIndex(index => (index + 1) % attractCycleLength);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [attractActive, attractCycleLength, prefersReducedMotion]);

  if (phase === 'title') {
    return (
      <main
        className="intro-experience intro-title-screen"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(3,2,8,0.96) 0%, rgba(3,2,8,0.72) 48%, rgba(3,2,8,0.24) 100%), url(/backgrounds/multiverse-breach-title-arca-v1.png)' }}
      >
        <IntroLanguageButton lang={lang} onToggleLanguage={onToggleLanguage} />
        <div className="intro-title-copy">
          <span className="intro-title-kicker">A.R.C.A. / SIGNAL DE CONVERGENCE</span>
          {eventVariant && (
            <div className="intro-event-variant" data-title-event={eventVariant.id || 'active'}>
              <span>{lang === 'fr' ? 'FENETRE EVENEMENTIELLE' : 'EVENT WINDOW'}</span>
              <strong>{eventVariant.title} / {lang === 'fr' ? `${eventVariant.tokenCount} Echos disponibles` : `${eventVariant.tokenCount} Echoes available`}</strong>
              <small>{eventVariant.windowLabel} / {eventVariant.stageTitle}</small>
              {hasFinishedPrologue && eventVariant.playable && (
                <button type="button" className="btn-retro" onClick={onLaunchEvent}>
                  {lang === 'fr' ? 'ENGAGER L OPERATION' : 'DEPLOY OPERATION'}
                </button>
              )}
            </div>
          )}
          <h1 className="cyber-title">{lang === 'fr' ? 'BRECHE MULTIVERSELLE' : 'MULTIVERSE BREACH'}</h1>
          <p className="intro-title-lead">
            {lang === 'fr'
              ? 'Les mondes ne fusionnent pas. Ils se dechirent. Stabilise les Trames, rassemble les survivants et resiste au Sans-Auteur.'
              : 'Worlds are not merging. They are tearing apart. Stabilize the Threads, gather survivors, and resist the Authorless.'}
          </p>

          <nav className="intro-title-menu" aria-label={lang === 'fr' ? 'Menu principal' : 'Main menu'}>
            <button
              type="button"
              className="btn-retro intro-primary-action"
              onClick={onContinue}
              disabled={!hasCreatedProfile}
              title={!hasCreatedProfile
                ? (lang === 'fr' ? 'Aucune Trace existante. Ouvre une Nouvelle Trace.' : 'No existing Trace. Open a New Trace.')
                : hasFinishedPrologue
                  ? (lang === 'fr' ? 'Ouvre le hub avec ta progression actuelle.' : 'Open the hub with your current progress.')
                  : (lang === 'fr' ? 'Reprend le prologue a la derniere archive.' : 'Resume the prologue from its latest archive.')}
            >
              {lang === 'fr' ? 'CONTINUER' : 'CONTINUE'}
            </button>
            <button
              type="button"
              className="btn-retro intro-secondary-action"
              onClick={() => hasCreatedProfile ? setTitleDialog('newTrace') : onNewTrace()}
            >
              {lang === 'fr' ? 'NOUVELLE TRACE' : 'NEW TRACE'}
            </button>
            <button type="button" className="btn-retro intro-tertiary-action" disabled={!hasCreatedProfile} onClick={onOpenCollection}>
              {lang === 'fr' ? 'COLLECTION' : 'COLLECTION'}
            </button>
            <button type="button" className="btn-retro intro-tertiary-action" onClick={() => setTitleDialog('options')}>
              {lang === 'fr' ? 'OPTIONS' : 'OPTIONS'}
            </button>
            <button type="button" className="btn-retro intro-tertiary-action" onClick={() => setTitleDialog('credits')}>
              {lang === 'fr' ? 'CREDITS / LICENCES' : 'CREDITS / LICENSES'}
            </button>
          </nav>

          {hasFinishedPrologue && (
            <button
              type="button"
              className="intro-replay-prologue"
              onClick={onReplayPrologue}
              title={lang === 'fr' ? 'Relance le prologue depuis sa premiere archive sans effacer ta progression.' : 'Replay the prologue from its first archive without deleting progress.'}
            >
              {lang === 'fr' ? 'REVOIR LE PROLOGUE' : 'REPLAY PROLOGUE'}
            </button>
          )}

          <TitleRotationPanel
            lang={lang}
            entries={titleRotation}
            activeIndex={safeRotationIndex}
            onSelect={setRotationIndex}
          />

          {hasFinishedPrologue && (
            <div className="intro-resume-strip" aria-label={lang === 'fr' ? 'Resume de progression' : 'Progress summary'}>
              <div><span>{lang === 'fr' ? 'ANCRE' : 'ANCHOR'}</span><strong>{playerName}</strong></div>
              <div><span>{lang === 'fr' ? 'BRECHES STABLES' : 'STABLE BREACHES'}</span><strong>{progressSummary.completedStages}</strong></div>
              <div><span>{lang === 'fr' ? 'SIGNATURES' : 'SIGNATURES'}</span><strong>{progressSummary.unlockedHeroes}</strong></div>
              <div><span>{lang === 'fr' ? 'GRADE DE CYCLE' : 'CYCLE GRADE'}</span><strong>{progressSummary.seasonLevel}</strong></div>
            </div>
          )}
        </div>
        <div className="intro-title-status">
          <span>
            {account
              ? (lang === 'fr' ? 'SIGNATURE CLOUD ANCREE' : 'CLOUD SIGNATURE ANCHORED')
              : hasFinishedPrologue
                ? (lang === 'fr' ? 'TRACE LOCALE DISPONIBLE' : 'LOCAL TRACE AVAILABLE')
                : hasCreatedProfile
                  ? (lang === 'fr' ? 'PROLOGUE EN ATTENTE' : 'PROLOGUE PENDING')
                  : (lang === 'fr' ? 'AUCUNE TRACE ANCREE' : 'NO ANCHORED TRACE')}
          </span>
        </div>
        <IntroTitleDialog
          dialog={titleDialog}
          lang={lang}
          audioSettings={audioSettings}
          cloudConnected={Boolean(account)}
          onClose={closeTitleDialog}
          onConfirmNewTrace={onNewTrace}
          onToggleLanguage={onToggleLanguage}
          onChangeAudioSetting={onChangeAudioSetting}
          onToggleMute={onToggleMute}
          eventOptions={eventOptions}
          activeEventId={activeEventId}
          onSelectEvent={onSelectEvent}
        />
        {attractActive && attractStages.length > 0 && (
          <TitleAttractMode
            lang={lang}
            entry={attractStages[attractIndex % attractStages.length]}
            card={attractCards.length ? attractCards[attractIndex % attractCards.length] : null}
            position={attractIndex % attractStages.length}
            total={attractStages.length}
            onClose={closeAttract}
          />
        )}
      </main>
    );
  }

  if (phase === 'profile') {
    const validName = playerName.length >= 2;
    return (
      <main
        className="intro-experience intro-profile-screen"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(3,2,8,0.98), rgba(3,2,8,0.78)), url(/backgrounds/stargate-rpg-openai.png)' }}
      >
        <IntroLanguageButton lang={lang} onToggleLanguage={onToggleLanguage} />
        <section className="intro-profile-shell">
          <button
            type="button"
            className="intro-back-button"
            onClick={onBackToTitle}
            title={lang === 'fr' ? 'Retourne a l ecran-titre.' : 'Return to the title screen.'}
          >
            {lang === 'fr' ? 'RETOUR' : 'BACK'}
          </button>

          <header className="intro-profile-heading">
            <span>{lang === 'fr' ? 'IDENTIFICATION A.R.C.A.' : 'A.R.C.A. IDENTIFICATION'}</span>
            <h1>{lang === 'fr' ? 'Creer une Ancre' : 'Create an Anchor'}</h1>
            <p>{lang === 'fr' ? 'Cette identite devient ton premier heros et la memoire centrale de ta progression.' : 'This identity becomes your first hero and the central memory of your progress.'}</p>
          </header>

          <div className="intro-profile-layout">
            <div className="intro-identity-panel">
              <label htmlFor="player-name-input">{lang === 'fr' ? 'Nom de l Ancre' : 'Anchor name'}</label>
              <input
                id="player-name-input"
                value={playerProfile?.name || ''}
                maxLength={22}
                autoComplete="nickname"
                onChange={(event) => setPlayerProfile(prev => ({ ...prev, name: event.target.value }))}
                placeholder={lang === 'fr' ? 'Ton pseudo' : 'Your nickname'}
              />
              <div className="intro-starter-cell">
                <span>{lang === 'fr' ? 'CELLULE DE SECOURS' : 'RESCUE CELL'}</span>
                <strong>{playerName} / Mirelle Suture / Bastion Korr</strong>
              </div>
              <button
                type="button"
                className="btn-retro intro-local-action"
                disabled={!validName}
                onClick={onStartLocal}
                title={lang === 'fr' ? 'Cree un profil seulement sur cet appareil puis lance le prologue.' : 'Create a profile only on this device, then start the prologue.'}
              >
                {lang === 'fr' ? 'CONTINUER EN LOCAL' : 'CONTINUE LOCALLY'}
              </button>
            </div>

            <AuthPanel
              {...authProps}
              lang={lang}
              account={account}
              cloudStatus={cloudStatus}
              variant="embedded"
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="intro-experience prologue-screen"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(2,1,7,0.96) 0%, rgba(2,1,7,0.7) 52%, rgba(2,1,7,0.22) 100%), url(${scene.image})` }}
    >
      <div className="prologue-topbar">
        <span>{lang === 'fr' ? 'PROLOGUE A.R.C.A.' : 'A.R.C.A. PROLOGUE'} / {String(prologueStep + 1).padStart(2, '0')}</span>
        <button
          type="button"
          onClick={onSkipPrologue}
          title={lang === 'fr' ? 'Marque le prologue comme termine et ouvre directement le hub.' : 'Mark the prologue complete and open the hub.'}
        >
          {lang === 'fr' ? 'PASSER' : 'SKIP'}
        </button>
      </div>

      <section className="prologue-copy">
        <span className="prologue-kicker">{localize(scene.kicker, lang)}</span>
        <h1>{localize(scene.title, lang)}</h1>
        <p>{sceneBody}</p>
        <blockquote>{localize(scene.signal, lang)}</blockquote>

        <div className="prologue-progress" aria-label={lang === 'fr' ? 'Progression du prologue' : 'Prologue progress'}>
          {PROLOGUE_SCENES.map((entry, index) => (
            <span key={entry.id} className={index <= prologueStep ? 'is-active' : ''} />
          ))}
        </div>

        <div className="prologue-actions">
          <button
            type="button"
            className="btn-retro prologue-secondary"
            onClick={prologueStep === 0 ? onBackToTitle : onPreviousPrologue}
            title={prologueStep === 0
              ? (lang === 'fr' ? 'Retourne a l ecran-titre.' : 'Return to the title screen.')
              : (lang === 'fr' ? 'Revient a la scene precedente.' : 'Return to the previous scene.')}
          >
            {lang === 'fr' ? 'PRECEDENT' : 'PREVIOUS'}
          </button>
          <button
            type="button"
            className="btn-retro intro-primary-action"
            onClick={prologueStep === PROLOGUE_SCENES.length - 1 ? onFinishPrologue : onNextPrologue}
            title={prologueStep === PROLOGUE_SCENES.length - 1
              ? (lang === 'fr' ? 'Termine le prologue et ouvre la Cite-Mosaique.' : 'Finish the prologue and open Mosaic City.')
              : (lang === 'fr' ? 'Affiche la scene suivante du prologue.' : 'Show the next prologue scene.')}
          >
            {prologueStep === PROLOGUE_SCENES.length - 1
              ? (lang === 'fr' ? 'ENTRER DANS LE NEXUS' : 'ENTER THE NEXUS')
              : (lang === 'fr' ? 'SUIVANT' : 'NEXT')}
          </button>
        </div>
      </section>
    </main>
  );
}
