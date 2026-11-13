import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import MosaicResidentDialogue from './MosaicResidentDialogue.jsx';
import useModalDialog from './collection/useModalDialog.js';
import './MosaicResidentConversation.css';

/** A resident encounter owns one modal. Opening the journal replaces this layer. */
export default function MosaicResidentConversation({ open, conversation, lang = 'fr', nextAction,
  location, onClose, onAcceptMission, onOpenJournal }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const titleId = useId();
  const visible = Boolean(open && conversation);
  useModalDialog({ open: visible, overlayRef, dialogRef, initialFocusRef: headingRef, onClose });
  if (!visible) return null;
  return createPortal(
    <div ref={overlayRef} className="mosaic-resident-conversation-backdrop" onPointerDown={event => {
      if (event.target === event.currentTarget) {
        // Closing restores focus; the compatible mousedown must not take it away.
        event.preventDefault();
        onClose?.();
      }
    }}>
      <section ref={dialogRef} className="mosaic-resident-conversation" role="dialog" aria-modal="true"
        aria-labelledby={titleId} tabIndex={-1} data-resident-conversation-modal>
        <header className="mosaic-resident-conversation-toolbar">
          <span>{lang === 'fr' ? 'Au fil de la Cité' : 'Along the City’s streets'}</span>
          <button type="button" className="btn-retro" data-dialogue-close onClick={onClose}
            aria-label={lang === 'fr' ? 'Terminer la conversation' : 'End the conversation'}>
            {lang === 'fr' ? 'Fermer' : 'Close'} <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="mosaic-resident-conversation-content">
          <MosaicResidentDialogue key={`${conversation.heroId}:${conversation.questExchange?.missionId || 'background'}`}
            conversation={conversation} lang={lang} headingId={titleId} headingRef={headingRef}
            nextAction={nextAction} location={location} expandBackground={false}
            onClose={onClose} onAcceptMission={onAcceptMission} onOpenJournal={onOpenJournal} />
        </div>
      </section>
    </div>, document.body
  );
}
