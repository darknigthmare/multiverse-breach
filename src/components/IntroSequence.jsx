import React from 'react';
import AuthPanel from './AuthPanel';

const PROLOGUE_SCENES = [
  {
    id: 'first-breach',
    image: '/backgrounds/multiverse-breach-title-arca-v1.png',
    title: { fr: 'Le ciel se brise', en: 'The sky breaks' },
    kicker: { fr: 'Archive 00 / La Premiere Breche', en: 'Archive 00 / The First Breach' },
    body: {
      fr: 'Veyr, Archiviste du Voile, voulut relier les mondes sans les conquerir. Son Nexus de paix ouvrit pourtant une blessure que rien ne savait refermer. Dans cette ouverture, le Sans-Auteur trouva enfin un passage.',
      en: 'Veyr, Archivist of the Veil, tried to connect worlds without conquering them. His peaceful Nexus opened a wound nothing could close. Inside that opening, the Authorless finally found a path.'
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
  onOpenProfile,
  onContinue,
  onBackToTitle,
  onStartLocal,
  onReplayPrologue,
  onPreviousPrologue,
  onNextPrologue,
  onFinishPrologue,
  onSkipPrologue,
  authProps
}) {
  const playerName = String(playerProfile?.name || '').trim() || (lang === 'fr' ? 'Ancre' : 'Anchor');
  const hasFinishedPrologue = Boolean(onboarding?.prologueCompleted);
  const hasCreatedProfile = Boolean(onboarding?.profileCreated);
  const prologueStep = Math.max(0, Math.min(PROLOGUE_SCENES.length - 1, Number(onboarding?.prologueStep) || 0));
  const scene = PROLOGUE_SCENES[prologueStep];
  const sceneBody = localize(scene?.body, lang).replace('{name}', playerName);

  if (phase === 'title') {
    return (
      <main
        className="intro-experience intro-title-screen"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(3,2,8,0.96) 0%, rgba(3,2,8,0.72) 48%, rgba(3,2,8,0.24) 100%), url(/backgrounds/multiverse-breach-title-arca-v1.png)' }}
      >
        <IntroLanguageButton lang={lang} onToggleLanguage={onToggleLanguage} />
        <div className="intro-title-copy">
          <span className="intro-title-kicker">A.R.C.A. / SIGNAL DE CONVERGENCE</span>
          <h1 className="cyber-title">{lang === 'fr' ? 'BRECHE MULTIVERSELLE' : 'MULTIVERSE BREACH'}</h1>
          <p className="intro-title-lead">
            {lang === 'fr'
              ? 'Les mondes ne fusionnent pas. Ils se dechirent. Stabilise les Trames, rassemble les survivants et resiste au Sans-Auteur.'
              : 'Worlds are not merging. They are tearing apart. Stabilize the Threads, gather survivors, and resist the Authorless.'}
          </p>

          <div className="intro-title-actions">
            {hasFinishedPrologue ? (
              <button
                type="button"
                className="btn-retro intro-primary-action"
                onClick={onContinue}
                title={lang === 'fr' ? 'Ouvre le hub avec ta progression actuelle.' : 'Open the hub with your current progress.'}
              >
                {lang === 'fr' ? 'REPRENDRE LA TRACE' : 'RESUME TRACE'}
              </button>
            ) : hasCreatedProfile ? (
              <button
                type="button"
                className="btn-retro intro-primary-action"
                onClick={onReplayPrologue}
                title={lang === 'fr' ? 'Reprend le prologue de ton Ancre.' : 'Resume your Anchor prologue.'}
              >
                {lang === 'fr' ? 'REPRENDRE LE PROLOGUE' : 'RESUME PROLOGUE'}
              </button>
            ) : (
              <button
                type="button"
                className="btn-retro intro-primary-action"
                onClick={onOpenProfile}
                title={lang === 'fr' ? 'Cree ton identite de joueur avant le prologue.' : 'Create your player identity before the prologue.'}
              >
                {lang === 'fr' ? 'COMMENCER' : 'BEGIN'}
              </button>
            )}

            {hasFinishedPrologue && (
              <button
                type="button"
                className="btn-retro intro-secondary-action"
                onClick={onReplayPrologue}
                title={lang === 'fr' ? 'Relance le prologue sans effacer ta progression.' : 'Replay the prologue without deleting progress.'}
              >
                {lang === 'fr' ? 'REVOIR LE PROLOGUE' : 'REPLAY PROLOGUE'}
              </button>
            )}
          </div>

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
