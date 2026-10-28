import React, { useId, useState } from 'react';
import {
  CLOUD_MEADOW_CHARACTERS,
  CLOUD_MEADOW_REFERENCE_SRC,
  CLOUD_MEADOW_REVIEW_PATH,
  getCloudMeadowCharacter
} from '../game/cloudMeadowCharacters.js';

export default function CloudMeadowGallery({ lang = 'fr' }) {
  const language = lang === 'fr' ? 'fr' : 'en';
  const [selectedId, setSelectedId] = useState(CLOUD_MEADOW_CHARACTERS[0].id);
  const [failedSources, setFailedSources] = useState(() => new Set());
  const titleId = useId();
  const selected = getCloudMeadowCharacter(selectedId) || CLOUD_MEADOW_CHARACTERS[0];
  const label = selected.displayName[language];
  const recordFailure = src => setFailedSources(previous => new Set([...previous, src]));
  const french = language === 'fr';

  return (
    <details className="cloud-meadow-gallery" style={{ margin: '0 0 16px', border: '1px solid #667c6a', borderRadius: '6px', background: '#101b18' }}>
      <summary style={{ cursor: 'pointer', padding: '14px', color: '#d8e4b9', fontWeight: 'bold' }}>
        {french ? 'Références Cloud Meadow' : 'Cloud Meadow references'}
        <span style={{ display: 'inline-block', marginLeft: '12px', fontSize: '11px', fontWeight: 'normal', color: '#c4cec6' }}>
          {french ? '4 personnages · poses statiques' : '4 characters · static poses'}
        </span>
      </summary>

      <section aria-label={french ? 'Galerie des personnages Cloud Meadow' : 'Cloud Meadow character gallery'} style={{ padding: '0 14px 16px' }}>
        <div role="group" aria-label={french ? 'Choisir un personnage' : 'Choose a character'} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {CLOUD_MEADOW_CHARACTERS.map(character => (
            <button
              key={character.id}
              type="button"
              className="btn-retro"
              aria-pressed={selected.id === character.id}
              onClick={() => setSelectedId(character.id)}
              style={{
                padding: '9px 12px', minHeight: '42px',
                borderColor: selected.id === character.id ? '#d8e4b9' : '#667c6a',
                background: selected.id === character.id ? '#d8e4b9' : '#172b23',
                color: selected.id === character.id ? '#17231c' : '#f0f4e8'
              }}
            >
              {character.displayName[language]}
            </button>
          ))}
        </div>

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
                  alt={`${label} — ${selected.description[language]}`}
                  loading="lazy"
                  onError={() => recordFailure(selected.src)}
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
            <figcaption style={{ paddingTop: '10px', color: '#eef3e8' }}>
              <h4 id={titleId} style={{ margin: '0 0 7px', fontSize: '17px' }}>{label}</h4>
              <p style={{ fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{selected.description[language]}</p>
              <p style={{ fontSize: '12px', lineHeight: 1.6, margin: '9px 0 0', color: selected.fidelityStatus === 'adapted-coverage' ? '#f2d49a' : '#c4cec6' }}>
                {selected.fidelityNote[language]}
              </p>
            </figcaption>
          </figure>

          <div style={{ flex: '1 1 210px', minWidth: 0, maxWidth: '320px', color: '#c4cec6', fontSize: '12px', lineHeight: 1.6 }}>
            <p style={{ marginTop: 0 }}>
              {french
                ? 'Quatre images individuelles recréées à partir de la planche fournie, avec une pose par personnage.'
                : 'Four individual images recreated from the supplied sheet, with one pose per character.'}
            </p>
            <a href={CLOUD_MEADOW_REFERENCE_SRC} target="_blank" rel="noopener noreferrer" style={{ color: '#e0edb9', display: 'block' }}>
              {french ? 'Voir la référence fournie' : 'View the supplied reference'}
              {!failedSources.has(CLOUD_MEADOW_REFERENCE_SRC) && (
                <img
                  src={CLOUD_MEADOW_REFERENCE_SRC}
                  alt={french ? 'Planche de référence : Eve, Evan et les deux dragons.' : 'Reference sheet: Eve, Evan and the two dragons.'}
                  loading="lazy"
                  onError={() => recordFailure(CLOUD_MEADOW_REFERENCE_SRC)}
                  style={{ display: 'block', maxWidth: '180px', width: '100%', height: 'auto', marginTop: '8px', borderRadius: '4px' }}
                />
              )}
            </a>
            <p>{french
              ? 'La planche montre des dragons environ 1,8 fois plus hauts que les fermiers. La comparaison détaillée permet de vérifier les silhouettes, les tenues et les queues.'
              : 'The sheet shows dragons approximately 1.8 times taller than the farmers. The detailed comparison lets you review their silhouettes, outfits and tails.'}</p>
            <a className="btn-retro" href={CLOUD_MEADOW_REVIEW_PATH} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 12px', color: '#e0edb9', borderColor: '#667c6a', textDecoration: 'none' }}>
              {french ? 'Ouvrir la comparaison détaillée ↗' : 'Open detailed comparison ↗'}
            </a>
          </div>
        </div>
      </section>
    </details>
  );
}
