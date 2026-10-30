import { useEffect, useRef } from 'react';
import { activateModal } from './modalIsolation.js';

export default function useModalDialog({ open = true, overlayRef, dialogRef, initialFocusRef, onClose, onKeyDown }) {
  const callbacks = useRef({ onClose, onKeyDown });
  callbacks.current = { onClose, onKeyDown };
  useEffect(() => {
    if (!open) return undefined;
    return activateModal({
      overlay: overlayRef.current,
      dialog: dialogRef.current,
      initialFocus: initialFocusRef?.current,
      onClose: () => callbacks.current.onClose?.(),
      onKeyDown: event => callbacks.current.onKeyDown?.(event)
    });
  }, [open, overlayRef, dialogRef, initialFocusRef]);
}
