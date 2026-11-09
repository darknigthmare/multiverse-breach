import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import useModalDialog from './collection/useModalDialog.js';
import './UniverseArchiveDialog.css';

export default function UniverseArchiveDialog({ children, onClose, cleared, universe }) {
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  useModalDialog({ overlayRef, dialogRef, onClose });
  const content = (
    <div ref={overlayRef} className="universe-archive-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="universe-archive-title" data-universe-archive={universe} className="universe-archive-reader" style={{ '--archive-accent': cleared ? '#70e4a8' : '#e9db8a' }}>
        {children}
      </section>
    </div>
  );
  return typeof document === 'undefined' || !document.body ? content : createPortal(content, document.body);
}
