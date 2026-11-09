import React, { useEffect, useId, useRef } from 'react';
import { createHeldControlInput } from '../game/heldControlInput.js';

/** A game control with independent pointer and keyboard activation sources. */
export default function HeldControlButton({ onInput, disabled = false, children, style, ...props }) {
  const sourcePrefix = useId();
  const current = useRef({ onInput, disabled });
  current.current = { onInput, disabled };
  const inputRef = useRef(null);
  if (!inputRef.current) {
    inputRef.current = createHeldControlInput({
      sourcePrefix,
      onInput: (source, phase) => current.current.onInput?.(source, phase),
      isDisabled: () => current.current.disabled || Boolean(globalThis.document?.hidden)
    });
  }
  const input = inputRef.current;

  useEffect(() => {
    if (disabled) input.clear();
  }, [disabled, input]);

  useEffect(() => {
    const clear = () => input.clear();
    const visibility = () => { if (document.hidden) clear(); };
    window.addEventListener('blur', clear);
    window.addEventListener('pointerup', input.onPointerUp);
    window.addEventListener('pointercancel', input.onPointerCancel);
    window.addEventListener('keyup', input.onKeyUp);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('blur', clear);
      window.removeEventListener('pointerup', input.onPointerUp);
      window.removeEventListener('pointercancel', input.onPointerCancel);
      window.removeEventListener('keyup', input.onKeyUp);
      document.removeEventListener('visibilitychange', visibility);
      clear();
    };
  }, [input]);

  return <button {...props} type="button" disabled={disabled}
    style={{ touchAction: 'none', userSelect: 'none', ...style }}
    onPointerDown={input.onPointerDown} onPointerUp={input.onPointerUp}
    onPointerCancel={input.onPointerCancel} onLostPointerCapture={input.onLostPointerCapture}
    onKeyDown={input.onKeyDown} onKeyUp={input.onKeyUp} onBlur={input.onBlur}
  >{children}</button>;
}
