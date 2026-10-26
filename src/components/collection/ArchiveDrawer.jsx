import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import useModalDialog from './useModalDialog.js';
import './archiveDrawer.css';

export default function ArchiveDrawer({ title, lang = 'fr', onClose, children, className = '' }) {
  const titleId = useId();
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useModalDialog({ overlayRef, dialogRef, initialFocusRef: closeRef, onClose });
  const content = <div ref={overlayRef} className={`archive-drawer-overlay ${className}`} onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section ref={dialogRef} tabIndex={-1} className="archive-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="archive-drawer-header"><h2 id={titleId}>{title}</h2><button ref={closeRef} type="button" className="btn-retro" onClick={onClose}>{lang === 'fr' ? 'FERMER' : 'CLOSE'}</button></header>
      <div className="archive-drawer-content">{children}</div>
    </section>
  </div>;
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}
