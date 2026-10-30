import { trapDialogTab } from '../../game/dialogFocus.js';

const inertLocks = new WeakMap();
const modalDocuments = new WeakMap();

/** Isolate a portal (or a nested dialog) without losing pre-existing inert states. */
export function isolateModalSiblings(overlay) {
  const changed = [];
  let current = overlay;
  const body = overlay?.ownerDocument?.body;
  while (current?.parentElement) {
    for (const sibling of current.parentElement.children) {
      if (sibling === current || ['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)) continue;
      const lock = inertLocks.get(sibling) || { count: 0, original: sibling.inert };
      lock.count += 1;
      inertLocks.set(sibling, lock);
      changed.push(sibling);
      sibling.inert = true;
    }
    if (current.parentElement === body) break;
    current = current.parentElement;
  }
  return () => { for (const element of changed) {
    const lock = inertLocks.get(element);
    if (!lock) continue;
    lock.count -= 1;
    if (!lock.count) { element.inert = lock.original; inertLocks.delete(element); }
  } };
}

/** One lifecycle for focus, nested dialogs, Escape and document scroll. */
export function activateModal({ overlay, dialog, initialFocus, onClose, onKeyDown, returnFocus }) {
  if (!overlay || !dialog) return () => {};
  const doc = overlay.ownerDocument;
  const previousFocus = returnFocus || doc.activeElement;
  const state = modalDocuments.get(doc) || { sessions: [], overflow: doc.body.style.overflow, returnFocus: previousFocus };
  const session = { dialog, previousFocus };
  state.sessions.push(session);
  modalDocuments.set(doc, state);
  const restoreSiblings = isolateModalSiblings(overlay);
  doc.body.style.overflow = 'hidden';
  (initialFocus || dialog).focus({ preventScroll: true });
  const handleKey = event => {
    // A child portal can temporarily suspend this dialog while keeping its state.
    if (overlay.closest('[inert]')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
    } else if (event.key === 'Tab') {
      trapDialogTab(event, dialog);
    } else onKeyDown?.(event);
  };
  doc.addEventListener('keydown', handleKey, true);
  return () => {
    doc.removeEventListener('keydown', handleKey, true);
    restoreSiblings();
    state.sessions = state.sessions.filter(active => active !== session);
    if (!state.sessions.length) {
      doc.body.style.overflow = state.overflow;
      modalDocuments.delete(doc);
    }
    const focusTarget = !state.sessions.length ? state.returnFocus : previousFocus;
    if (focusTarget?.isConnected && !focusTarget.closest?.('[inert]')) focusTarget.focus({ preventScroll: true });
  };
}
