import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { activateModal } from './collection/modalIsolation.js';
import './game-system.css';

export default function GameSystemDialog({ dialog, lang = 'fr', onResolve }) {
  const titleId = useId();
  const textId = useId();
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const callbackRef = useRef(onResolve);
  callbackRef.current = onResolve;
  const [value, setValue] = useState(dialog.initialValue || '');
  const fr = lang === 'fr';
  const editable = dialog.kind === 'input';
  const copy = dialog.kind === 'copy';

  useEffect(() => {
    const target = inputRef.current || rootRef.current?.querySelector('[data-dialog-cancel], button');
    const release = activateModal({
      overlay: overlayRef.current, dialog: rootRef.current, initialFocus: target,
      onClose: () => callbackRef.current(dialog.id, null)
    });
    if (copy) inputRef.current?.select();
    return release;
  }, [dialog.id, copy]);

  const submit = event => {
    event.preventDefault();
    onResolve(dialog.id, editable ? value : true);
  };
  return createPortal(<div className="game-system-overlay" ref={overlayRef}>
    <form className="game-system-dialog" ref={rootRef} role={dialog.kind === 'confirm' ? 'alertdialog' : 'dialog'} aria-modal="true" aria-labelledby={titleId} aria-describedby={textId} onSubmit={submit} tabIndex={-1}>
      <div className="game-system-kicker">A.R.C.A.</div>
      <h2 id={titleId}>{dialog.title || (fr ? 'Compte et sauvegardes' : 'Account and saves')}</h2>
      <p id={textId} className="game-dialog-message">{dialog.message}</p>
      {(editable || copy) && <label className="game-dialog-field"><span>{fr ? 'Trace Nexus' : 'Nexus trace'}</span>
        <textarea ref={inputRef} autoComplete="off" spellCheck={false} readOnly={copy} rows={8} value={value} onChange={event => setValue(event.target.value)} />
      </label>}
      <div className="game-dialog-actions">
        {(editable || dialog.kind === 'confirm') && <button type="button" className="btn-retro" data-dialog-cancel onClick={() => onResolve(dialog.id, null)}>{dialog.cancelLabel || (fr ? 'Annuler' : 'Cancel')}</button>}
        <button type="submit" className={`btn-retro game-dialog-primary${dialog.destructive ? ' is-destructive' : ''}`} disabled={editable && !value.trim()}>
          {dialog.confirmLabel || (editable ? (fr ? 'Importer cette trace' : 'Import this trace') : dialog.kind === 'confirm' ? (fr ? 'Confirmer' : 'Confirm') : (fr ? 'Fermer' : 'Close'))}
        </button>
      </div>
    </form>
  </div>, document.body);
}
