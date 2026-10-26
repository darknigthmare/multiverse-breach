import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import useModalDialog from './collection/useModalDialog.js';

// A local system panel: focus, Escape and backdrop are owned by the same layer.
export default function ImmersiveDrawer({ open, title, onClose, children, lang = 'fr', className = '' }) {
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  useModalDialog({ open, overlayRef, dialogRef, initialFocusRef: closeRef, onClose });
  if (!open) return null;
  return createPortal(
    <div ref={overlayRef} className={`immersive-drawer-backdrop ${className}`} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="immersive-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header><h2 id={titleId}>{title}</h2><button ref={closeRef} type="button" className="btn-retro" onClick={onClose}>{lang === 'fr' ? 'FERMER' : 'CLOSE'} ×</button></header>
        <div className="immersive-drawer-content">{children}</div>
      </section>
    </div>, document.body
  );
}
