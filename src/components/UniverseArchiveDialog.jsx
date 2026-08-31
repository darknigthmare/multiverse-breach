import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function UniverseArchiveDialog({ children, onClose, cleared, universe }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById('root');
    const previousInert = appRoot?.inert;
    document.body.style.overflow = 'hidden';
    if (appRoot) appRoot.inert = true;
    dialogRef.current?.querySelector('[data-archive-close]')?.focus({ preventScroll: true });
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll('button:not(:disabled), input, select, a[href], [tabindex="0"]') || [])];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (appRoot) appRoot.inert = previousInert;
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);
  const content = (
    <div onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="universe-archive-title" data-universe-archive={universe} style={{ width: 'min(96vw, 1120px)', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(7,6,14,0.98)', border: `1px solid ${cleared ? 'rgba(46,204,113,0.55)' : 'rgba(255,235,59,0.42)'}`, borderRadius: 7, boxShadow: '0 0 34px rgba(57,197,187,0.18)' }}>
        {children}
      </section>
    </div>
  );
  return typeof document === 'undefined' || !document.body ? content : createPortal(content, document.body);
}
