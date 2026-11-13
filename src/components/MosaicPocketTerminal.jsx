import React, { useId, useLayoutEffect, useRef } from 'react';
import './MosaicPocketTerminal.css';

const SECTIONS = [
  { id: 'journal', fr: 'Carnet', en: 'Journal' },
  { id: 'district', fr: 'Quartier', en: 'District' },
  { id: 'transmissions', fr: 'Messages', en: 'Messages' },
  { id: 'guide', fr: 'Guide', en: 'Guide' }
];

/** One pocket terminal, with reading state retained while changing sections.
 * Hidden panels stay mounted but cannot receive keyboard or modal focus. */
export default function MosaicPocketTerminal({ lang = 'fr', section = 'journal', onSectionChange, panels }) {
  const uid = useId();
  const rootRef = useRef(null);
  const navigationRef = useRef(null);
  const tabsRef = useRef(new Map());
  const active = SECTIONS.some(item => item.id === section) ? section : 'journal';
  useLayoutEffect(() => {
    const scroller = rootRef.current?.closest('.immersive-drawer-content');
    if (scroller) scroller.scrollTop = 0;
  }, [active]);
  useLayoutEffect(() => {
    const scroller = rootRef.current?.closest('.immersive-drawer-content');
    const navigation = navigationRef.current;
    if (!scroller || !navigation) return undefined;
    const previous = scroller.style.scrollPaddingTop;
    const measure = () => { scroller.style.scrollPaddingTop = `${Math.ceil(navigation.getBoundingClientRect().height) + 12}px`; };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(navigation);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); scroller.style.scrollPaddingTop = previous; };
  }, []);
  const changeSection = id => onSectionChange?.(id);
  const navigate = (event, id) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = SECTIONS.findIndex(item => item.id === id);
    const next = event.key === 'ArrowRight' ? (current + 1) % SECTIONS.length
      : event.key === 'ArrowLeft' ? (current + SECTIONS.length - 1) % SECTIONS.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? SECTIONS.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    const target = SECTIONS[next].id;
    changeSection(target);
    tabsRef.current.get(target)?.focus({ preventScroll: true });
  };

  return <div ref={rootRef} className="mosaic-pocket-terminal" data-city-terminal-section={active}>
    <div ref={navigationRef} className="mosaic-pocket-tabs" role="tablist" aria-label={lang === 'fr' ? 'Rubriques du terminal' : 'Terminal sections'}>
      {SECTIONS.map(item => <button key={item.id} ref={node => {
        if (node) tabsRef.current.set(item.id, node);
        else tabsRef.current.delete(item.id);
      }} type="button" role="tab" id={`${uid}-tab-${item.id}`} aria-controls={`${uid}-panel-${item.id}`}
        aria-selected={active === item.id} tabIndex={active === item.id ? 0 : -1} data-city-terminal-tab={item.id}
        onClick={() => changeSection(item.id)} onKeyDown={event => navigate(event, item.id)}>
        {item[lang === 'fr' ? 'fr' : 'en']}
      </button>)}
    </div>
    {SECTIONS.map(item => <section key={item.id} className="mosaic-pocket-panel" role="tabpanel"
      id={`${uid}-panel-${item.id}`} aria-labelledby={`${uid}-tab-${item.id}`} hidden={active !== item.id}
      tabIndex={0} data-city-terminal-panel={item.id}>{panels?.[item.id]}</section>)}
  </div>;
}
