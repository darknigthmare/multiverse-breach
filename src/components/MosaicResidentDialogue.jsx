import React, { useId, useState } from 'react';
import './MosaicResidentDialogue.css';

export default function MosaicResidentDialogue({ conversation, lang = 'fr', onClose }) {
  const [selectedTopic, setSelectedTopic] = useState('origin');
  const titleId = useId();
  if (!conversation) return null;
  const topic = conversation.topics.find(entry => entry.id === selectedTopic) || conversation.topics[0];
  return <section className="mosaic-resident-dialogue" data-city-conversation={conversation.heroId} aria-labelledby={titleId}>
    <div className="mosaic-dialogue-heading">
      <span>{lang === 'fr' ? 'ÉCHANGE DE TRAME · CELLULE ZERO' : 'THREAD EXCHANGE · CELL ZERO'}</span>
      <h3 id={titleId}>{conversation.name}</h3><p>{conversation.role}</p>
    </div>
    <p>{lang === 'fr' ? 'Choisis un sujet à évoquer. Le terminal restitue le dossier transmis par cet habitant.' : 'Choose a topic to discuss. The terminal presents the record shared by this resident.'}</p>
    <div className="mosaic-dialogue-topics" role="group" aria-label={lang === 'fr' ? 'Sujets de conversation' : 'Conversation topics'}>
      {conversation.topics.map(entry => <button key={entry.id} type="button" className="btn-retro" data-dialogue-topic={entry.id}
        aria-pressed={entry.id === topic.id} onClick={() => setSelectedTopic(entry.id)}>{entry.label}</button>)}
    </div>
    <div className="mosaic-dialogue-record" aria-live="polite" aria-atomic="true" data-dialogue-record={topic.id}>
      <h4>{topic.label}</h4><p>{topic.body}</p>
    </div>
    <button type="button" className="btn-retro" data-dialogue-return onClick={onClose}>{lang === 'fr' ? 'REPRENDRE L’EXPLORATION' : 'RESUME EXPLORING'}</button>
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
