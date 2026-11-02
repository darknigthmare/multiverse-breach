import React, { useId, useState } from 'react';
import {
  CLOUD_MEADOW_CHARACTERS,
  CLOUD_MEADOW_REFERENCES,
  CLOUD_MEADOW_REVIEW_PATH,
  filterCloudMeadowCharacters,
  getCloudMeadowReference
} from '../game/cloudMeadowCharacters.js';

export default function CloudMeadowGallery({ lang = 'fr' }) {
  const language = lang === 'fr' ? 'fr' : 'en';
  const french = language === 'fr';
  const [selectedId, setSelectedId] = useState(CLOUD_MEADOW_CHARACTERS[0]?.id);
  const [referenceId, setReferenceId] = useState('');
  const [query, setQuery] = useState('');
  const [failedSources, setFailedSources] = useState(() => new Set());
  const titleId = useId();
  const visibleCharacters = filterCloudMeadowCharacters({ referenceId, query });
  const selected = visibleCharacters.find(character => character.id === selectedId) || visibleCharacters[0];
  const reference = selected ? getCloudMeadowReference(selected.referenceId) : null;
  const recordFailure = src => setFailedSources(previous => new Set([...previous, src]));
  const controlStyle = { color: '#eef3e8', background: '#172b23', border: '1px solid #667c6a', borderRadius: '4px', padding: '9px', minHeight: '42px', maxWidth: '100%' };

  return (
    <details className="cloud-meadow-gallery" style={{ margin: '0 0 16px', border: '1px solid #667c6a', borderRadius: '6px', background: '#101b18' }}>
      <summary style={{ cursor: 'pointer', padding: '14px', color: '#d8e4b9', fontWeight: 'bold' }}>
        {french ? 'Références Cloud Meadow' : 'Cloud Meadow references'}
        <span style={{ display: 'inline-block', marginLeft: '12px', fontSize: '11px', fontWeight: 'normal', color: '#c4cec6' }}>
          {CLOUD_MEADOW_CHARACTERS.length} {french ? 'personnages · poses statiques' : 'characters · static poses'}
        </span>
      </summary>

      <section aria-label={french ? 'Galerie des personnages Cloud Meadow' : 'Cloud Meadow character gallery'} style={{ padding: '0 14px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: '12px', marginBottom: '14px' }}>
          <label style={{ color: '#c4cec6', display: 'grid', gap: '5px', fontSize: '12px', maxWidth: '100%' }}>
            {french ? 'Planche de référence' : 'Reference sheet'}
            <select value={referenceId} onChange={event => setReferenceId(event.target.value)} style={controlStyle}>
              <option value="">{french ? 'Toutes les planches' : 'All sheets'}</option>
              {CLOUD_MEADOW_REFERENCES.map(source => (
                <option key={source.id} value={source.id}>{source.label[language]}</option>
              ))}
            </select>
          </label>
          <label style={{ color: '#c4cec6', display: 'grid', gap: '5px', fontSize: '12px', flex: '1 1 180px' }}>
            {french ? 'Rechercher un personnage' : 'Find a character'}
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} style={controlStyle} />
          </label>
          <p role="status" style={{ color: '#c4cec6', fontSize: '12px', margin: '0 0 10px' }}>
            {visibleCharacters.length} / {CLOUD_MEADOW_CHARACTERS.length}
          </p>
        </div>

        <div role="group" aria-label={french ? 'Choisir un personnage' : 'Choose a character'} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {visibleCharacters.map(character => (
            <button
              key={character.id}
              type="button"
              className="btn-retro"
              aria-pressed={selected?.id === character.id}
              onClick={() => setSelectedId(character.id)}
              style={{
                padding: '9px 12px', minHeight: '42px', maxWidth: '100%', whiteSpace: 'normal',
                borderColor: selected?.id === character.id ? '#d8e4b9' : '#667c6a',
                background: selected?.id === character.id ? '#d8e4b9' : '#172b23',
                color: selected?.id === character.id ? '#17231c' : '#f0f4e8'
              }}
            >
              {character.displayName[language]}
              {character.fidelityStatus !== 'reference-based-generated' && (
                <small style={{ display: 'block', fontSize: '10px', fontWeight: 'normal', marginTop: '3px' }}>
                  {character.fidelityStatus === 'description-based-adaptation'
                    ? (french ? 'D’après description' : 'From description')
                    : (french ? 'Tenue adaptée' : 'Adapted coverage')}
                </small>
              )}
            </button>
          ))}
        </div>

        {!selected ? (
          <p style={{ color: '#c4cec6', padding: '15px 0' }}>{french ? 'Aucun personnage ne correspond à cette recherche.' : 'No character matches this search.'}</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'start' }}>
            <figure aria-labelledby={titleId} style={{ flex: '1 1 280px', minWidth: 0, margin: 0, maxWidth: '560px' }}>
              <div style={{ aspectRatio: '1', background: '#d9dfd6', borderRadius: '5px', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                {failedSources.has(selected.src) ? (
                  <p role="status" style={{ color: '#293a2f', padding: '20px', textAlign: 'center' }}>
                    {french ? 'Cette image n’a pas pu être chargée.' : 'This image could not be loaded.'}
                  </p>
                ) : (
                  <img
                    key={selected.src}
                    src={selected.src}
                    alt={`${selected.displayName[language]} — ${selected.description[language]}`}
                    loading="lazy"
                    onError={() => recordFailure(selected.src)}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>
              <figcaption style={{ paddingTop: '10px', color: '#eef3e8' }}>
                <h4 id={titleId} style={{ margin: '0 0 7px', fontSize: '17px' }}>{selected.displayName[language]}</h4>
                <p style={{ fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{selected.description[language]}</p>
                <p style={{ fontSize: '12px', lineHeight: 1.6, margin: '9px 0 0', color: selected.fidelityStatus !== 'reference-based-generated' ? '#f2d49a' : '#c4cec6' }}>
                  {selected.fidelityNote[language]}
                </p>
              </figcaption>
            </figure>

            <div style={{ flex: '1 1 210px', minWidth: 0, maxWidth: '320px', color: '#c4cec6', fontSize: '12px', lineHeight: 1.6 }}>
              <p style={{ marginTop: 0 }}>
                {french
                  ? 'Chaque visuel possède sa propre image transparente et renvoie à la planche dont il est issu.'
                  : 'Each artwork has its own transparent image and links to its original reference sheet.'}
              </p>
              {reference && (
                <a href={reference.src} target="_blank" rel="noopener noreferrer" style={{ color: '#e0edb9', display: 'block' }}>
                  {french ? 'Voir la référence : ' : 'View reference: '}{reference.label[language]}
                  {!failedSources.has(reference.src) && (
                    <img
                      key={reference.src}
                      src={reference.src}
                      alt={reference.label[language]}
                      loading="lazy"
                      onError={() => recordFailure(reference.src)}
                      style={{ display: 'block', maxWidth: '240px', width: '100%', height: 'auto', marginTop: '8px', borderRadius: '4px' }}
                    />
                  )}
                </a>
              )}
              <p>{french
                ? 'Une pose entière par personnage. Les tenues adaptées et les illustrations d’après description sont signalées ; les détails peuvent différer de la source.'
                : 'One full-body pose per character. Adapted coverage and illustrations made from descriptions are labeled; details can differ from the source.'}</p>
              <a className="btn-retro" href={`${CLOUD_MEADOW_REVIEW_PATH}#${selected.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 12px', color: '#e0edb9', borderColor: '#667c6a', textDecoration: 'none' }}>
                {french ? 'Comparer ce personnage ↗' : 'Compare this character ↗'}
              </a>
            </div>
          </div>
        )}
      </section>
    </details>
  );
}
