import React from 'react';
import {
  getPortalFrameForPhase,
  resolvePortalVisual
} from '../../game/visuals/portalVisualCatalog';
import './portalAtlas.css';

const PHASE_LABELS = Object.freeze({
  sealed: { fr: 'signature en veille', en: 'dormant signature' },
  charging: { fr: 'amorce', en: 'charging' },
  cutting: { fr: 'ouverture', en: 'opening' },
  opening: { fr: 'ouverture maximale', en: 'fully open' },
  revealing: { fr: 'stabilise', en: 'stabilized' },
  complete: { fr: 'stabilise', en: 'stabilized' }
});

const clampAtlasIndex = (value, maximum) => Math.max(
  0,
  Math.min(maximum, Math.floor(Number(value) || 0))
);

const getAtlasPosition = (index, count) => (
  count > 1 ? `${(index / (count - 1)) * 100}%` : '0%'
);

/**
 * Renders one frame of the approved universe portal, or the explicit Nexus
 * fallback returned by the visual catalog. The booster phase owns the frame;
 * this component never starts an unsynchronised sprite-sheet loop.
 */
export function PortalAtlas({
  universe,
  openingPhase = 'sealed',
  lang = 'fr',
  className = '',
  decorative = false,
  label,
  title,
  style
}) {
  const resolvedVisual = resolvePortalVisual(universe);
  const atlas = resolvedVisual?.atlas;
  const columns = Math.max(1, Math.floor(Number(atlas?.columns) || 1));
  const rows = Math.max(1, Math.floor(Number(atlas?.rows) || 1));
  const frameCount = Math.max(
    1,
    Math.min(columns, Math.floor(Number(atlas?.frames) || columns))
  );
  const frame = clampAtlasIndex(getPortalFrameForPhase(openingPhase), frameCount - 1);
  const row = clampAtlasIndex(atlas?.row, rows - 1);
  const locale = lang === 'en' ? 'en' : 'fr';
  const phaseLabel = PHASE_LABELS[openingPhase]?.[locale]
    || PHASE_LABELS.sealed[locale];
  const requestedUniverse = resolvedVisual?.requestedUniverse || universe || 'Nexus';
  const accessibleLabel = label || (
    locale === 'fr'
      ? `Portail de ${requestedUniverse}, ${phaseLabel}${resolvedVisual?.isFallback ? ', rendu Nexus de secours' : ''}`
      : `${requestedUniverse} portal, ${phaseLabel}${resolvedVisual?.isFallback ? ', Nexus fallback visual' : ''}`
  );

  if (!atlas?.sheet) return null;

  return (
    <span
      className={`portal-atlas ${className}`.trim()}
      data-opening-phase={openingPhase}
      data-portal-status={resolvedVisual?.status || 'production'}
      data-portal-fallback={resolvedVisual?.isFallback ? 'true' : 'false'}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      title={title}
      style={{
        '--portal-atlas-color': resolvedVisual?.accentColor || '#39c5bb',
        ...style
      }}
    >
      <span
        className="portal-atlas__frame"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${atlas.sheet})`,
          backgroundPosition: `${getAtlasPosition(frame, columns)} ${getAtlasPosition(row, rows)}`,
          backgroundSize: `${columns * 100}% ${rows * 100}%`
        }}
      />
    </span>
  );
}

export default PortalAtlas;
