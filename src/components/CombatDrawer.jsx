import { useEffect, useId, useRef } from 'react';
import { createCombatDialogLifecycle } from '../game/combatDialogLifecycle.js';

/** Paused reference/settings use a modal; live commands keep the battlefield
 * interactive. Both close before Escape reaches a containing session shell. */
export default function CombatDrawer({ open, onClose, title, lang = 'fr', modal = false, children, className = '' }) {
  const ref = useRef(null);
  const titleId = useId();
  const lifecycle = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    const controller = createCombatDialogLifecycle(ref.current);
    lifecycle.current = controller;
    return () => {
      controller.dispose();
      if (lifecycle.current === controller) lifecycle.current = null;
    };
  }, []);
  useEffect(() => {
    lifecycle.current?.sync(open, modal);
  }, [open, modal]);
  return (
    <dialog ref={ref} className={`combat-drawer ${modal ? 'is-paused' : 'is-live'} ${className}`}
      data-combat-drawer="true" aria-labelledby={titleId} aria-modal={modal ? 'true' : undefined}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onKeyDown={event => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault(); event.stopPropagation(); onClose();
        }
      }}>
      <header className="combat-drawer-heading">
        <div><span>{modal ? (lang === 'fr' ? 'EN PAUSE' : 'PAUSED') : (lang === 'fr' ? 'EN DIRECT' : 'LIVE')}</span><h2 id={titleId}>{title}</h2></div>
        <button type="button" data-drawer-close onClick={onClose} aria-label={lang === 'fr' ? 'Fermer le panneau' : 'Close panel'}>×</button>
      </header>
      <div className="combat-drawer-content">{children}</div>
    </dialog>
  );
}
