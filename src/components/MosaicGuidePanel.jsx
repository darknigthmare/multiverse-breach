import React, { useEffect, useId, useRef, useState } from 'react';

const SHORT_VIEWPORT = '(max-height: 560px), (max-width: 600px)';
const LOW_VIEWPORT = '(max-height: 560px)';
const GUIDE_STEPS = ['move', 'interact', 'objective'];
const CITY_COMMAND_KEYS = new Set(['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'q', 'e']);

/** Presentation state only: folding the guide never pauses or advances it. */
export default function MosaicGuidePanel({ lang = 'fr', title, body, step, onPause, onOpenDetails }) {
  const fr = lang === 'fr';
  const contentId = useId();
  const toggleRef = useRef(null);
  const contentRef = useRef(null);
  const [compact, setCompact] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(LOW_VIEWPORT).matches
  ));
  const [expanded, setExpanded] = useState(() => (
    typeof window === 'undefined' || !window.matchMedia(SHORT_VIEWPORT).matches
  ));
  useEffect(() => {
    const media = window.matchMedia(SHORT_VIEWPORT);
    const lowViewport = window.matchMedia(LOW_VIEWPORT);
    const collapseForShortViewport = () => {
      if (media.matches) {
        if (contentRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
        setExpanded(false);
      }
      setCompact(lowViewport.matches);
    };
    collapseForShortViewport();
    media.addEventListener('change', collapseForShortViewport);
    lowViewport.addEventListener('change', collapseForShortViewport);
    return () => {
      media.removeEventListener('change', collapseForShortViewport);
      lowViewport.removeEventListener('change', collapseForShortViewport);
    };
  }, []);

  return <section className={`mosaic-city-guide mosaic-city-guide--collapsible${compact ? ' mosaic-city-guide--compact' : ''}`} aria-label={fr ? 'Premiers pas dans la Cité' : 'First steps in the City'} onKeyDown={event => {
    // Keep native scrolling and activation, while the focused guide owns City
    // commands. Keyup still reaches the scene to release any earlier held key;
    // Escape is deliberately left to the global pause owner.
    if (CITY_COMMAND_KEYS.has(event.key.toLowerCase())) event.stopPropagation();
  }}>
    <button ref={toggleRef} type="button" className="mosaic-city-guide-toggle" aria-expanded={compact ? undefined : expanded} aria-controls={compact ? undefined : contentId} aria-haspopup={compact ? 'dialog' : undefined} onClick={compact ? onOpenDetails : () => setExpanded(value => !value)}>
      <span><small>GUIDE</small><strong>{title}</strong></span>
      <span className="mosaic-city-guide-toggle-label">{compact ? (fr ? 'Lire dans le terminal' : 'Read in terminal') : expanded ? (fr ? 'Réduire' : 'Collapse') : (fr ? 'Développer' : 'Expand')}</span>
    </button>
    <div id={contentId} ref={contentRef} className="mosaic-city-guide-content" hidden={compact || !expanded} tabIndex={0} role="region" aria-label={fr ? 'Instructions du guide' : 'Guide instructions'}>
      <div className="mosaic-city-guide-progress" aria-label={fr ? 'Progression du guide' : 'Guide progress'}>{GUIDE_STEPS.map((id, index) => <span key={id} aria-current={step === id ? 'step' : undefined} className={step === 'done' || index < GUIDE_STEPS.indexOf(step) ? 'is-done' : step === id ? 'is-current' : ''}>{index + 1}</span>)}</div>
      <p aria-live="polite">{body}</p>
      <div className="mosaic-city-guide-actions">
        <button type="button" className="mosaic-city-guide-restore" onClick={onOpenDetails}>{fr ? 'Lire dans le terminal' : 'Read in terminal'}</button>
        <button type="button" className="mosaic-city-guide-restore" onClick={onPause}>{fr ? 'Pause guide' : 'Pause guide'}</button>
      </div>
    </div>
  </section>;
}
