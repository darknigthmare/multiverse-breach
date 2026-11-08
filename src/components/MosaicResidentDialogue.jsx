import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import './MosaicResidentDialogue.css';

export default function MosaicResidentDialogue({ conversation, lang = 'fr', onClose, onAcceptMission }) {
  const [selectedTopic, setSelectedTopic] = useState('origin');
  const [offerFeedback, setOfferFeedback] = useState('');
  const returnRef = useRef(null);
  const pendingFocus = useRef(false);
  const titleId = useId();
  const exchange = conversation?.questExchange;
  useLayoutEffect(() => {
    if (!pendingFocus.current || exchange?.phase === 'offer') return;
    pendingFocus.current = false;
    returnRef.current?.focus({ preventScroll: true });
    returnRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [exchange?.missionId, exchange?.phase]);
  if (!conversation) return null;
  const topics = Array.isArray(conversation.topics) ? conversation.topics : [];
  const topic = topics.find(entry => entry.id === selectedTopic) || topics[0];
  const local = value => typeof value === 'string' ? value : value?.[lang === 'fr' ? 'fr' : 'en'] || '';
  const line = local(exchange?.line);
  return <section className="mosaic-resident-dialogue" data-city-conversation={conversation.heroId} aria-labelledby={titleId}>
    <div className="mosaic-dialogue-heading">
      <span>{lang === 'fr' ? 'UNE RENCONTRE EN CHEMIN' : 'A MEETING ALONG THE WAY'}</span>
      <h3 id={titleId}>{conversation.name}</h3>{conversation.role && <p>{conversation.role}</p>}
    </div>
    {line && <figure className="mosaic-dialogue-quest" data-dialogue-quest={exchange.missionId} aria-live="polite" aria-atomic="true">
      {local(exchange.title) && <figcaption>{local(exchange.title)}</figcaption>}
      <blockquote><p>{line}</p><cite>{conversation.name}</cite></blockquote>
    </figure>}
    {line && exchange.phase === 'offer' && typeof onAcceptMission === 'function' && <div className="mosaic-dialogue-offer">
      <button type="button" className="btn-retro" data-city-quest-offer={exchange.missionId} onClick={() => {
        const result = onAcceptMission(exchange.missionId);
        setOfferFeedback(result?.changed ? '' : result?.feedback || '');
        if (result?.changed) pendingFocus.current = true;
      }}>{lang === 'fr' ? 'Je m’en charge' : 'I’ll help'}</button>
      {offerFeedback && <p role="status">{offerFeedback}</p>}
    </div>}
    {topic && <details className="mosaic-dialogue-background" key={`${conversation.heroId}:${exchange?.missionId || 'background'}`} open={!line}>
      <summary>{lang === 'fr' ? 'En savoir plus sur' : 'More about'} {conversation.name}</summary>
      <div className="mosaic-dialogue-topics" role="group" aria-label={lang === 'fr' ? 'Sujets de conversation' : 'Conversation topics'}>
        {topics.map(entry => <button key={entry.id} type="button" className="btn-retro" data-dialogue-topic={entry.id}
          aria-pressed={entry.id === topic.id} onClick={() => setSelectedTopic(entry.id)}>{entry.label}</button>)}
      </div>
      <div className="mosaic-dialogue-record" aria-live="polite" aria-atomic="true" data-dialogue-record={topic.id}>
        <h4>{topic.label}</h4><p>{topic.body}</p>
      </div>
    </details>}
    <button ref={returnRef} type="button" className="btn-retro" data-dialogue-return onClick={onClose}>{lang === 'fr' ? 'REPRENDRE L’EXPLORATION' : 'RESUME EXPLORING'}</button>
  </section>;
}

export function MosaicEvidenceLedger({ entries, lang = 'fr' }) {
  const [page, setPage] = useState(0);
  if (!entries.length) return null;
  const count = 4;
  const pages = Math.max(1, Math.ceil(entries.length / count));
  const current = Math.min(page, pages - 1);
  return <details className="mosaic-evidence-ledger">
    <summary>{lang === 'fr' ? 'Témoignages et preuves conservés' : 'Retained testimony and evidence'} · {entries.length}</summary>
    <div className="mosaic-evidence-list">{entries.slice(current * count, (current + 1) * count).map(entry => <article key={entry.districtId} data-reconnaissance-record={entry.districtId}>
      <h4>{entry.universe}</h4>
      <strong>{entry.completed ? (lang === 'fr' ? 'Rapport transmis' : 'Report submitted') : entry.active ? (lang === 'fr' ? 'Dossier suivi' : 'Tracked report') : (lang === 'fr' ? 'Dossier en attente' : 'Pending report')}</strong>
      {!entry.available && <p>{lang === 'fr' ? 'Quartier indisponible · preuves conservées' : 'District unavailable · evidence retained'}</p>}
      <p>{lang === 'fr' ? 'Témoin' : 'Witness'} : {entry.witness?.name || (lang === 'fr' ? 'à rencontrer' : 'not yet met')}</p>
      <p>{lang === 'fr' ? 'Reliques examinées' : 'Relics inspected'} : {entry.evidence.length}/{entry.evidenceGoal}</p>
      {entry.evidence.length > 0 && <ol>{entry.evidence.map(item => <li key={item.id}>{item.name}</li>)}</ol>}
    </article>)}</div>
    {pages > 1 && <nav aria-label={lang === 'fr' ? 'Pages des témoignages' : 'Testimony pages'}>
      <button type="button" className="btn-retro" disabled={!current} onClick={() => setPage(current - 1)}>{lang === 'fr' ? 'Précédent' : 'Previous'}</button>
      <span>{current + 1}/{pages}</span>
      <button type="button" className="btn-retro" disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>{lang === 'fr' ? 'Suivant' : 'Next'}</button>
    </nav>}
  </details>;
}
