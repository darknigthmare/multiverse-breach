import React, { useEffect, useId, useRef } from 'react';

// Shared, focusable movement controls. Game commands must not receive these keys.
export default function SceneHoldButton({ action, onInput, disabled = false, children, ...props }) {
  const id = useId();
  const sources = useRef(new Set());
  const latest = useRef(onInput); latest.current = onInput;
  const release = source => { sources.current.delete(source); latest.current(source, action, false); };
  useEffect(() => {
    if (!disabled) return;
    for (const source of sources.current) latest.current(source, action, false);
    sources.current.clear();
  }, [action, disabled]);
  useEffect(() => () => {
    for (const source of sources.current) latest.current(source, action, false);
    sources.current.clear();
  }, [action]);
  const hold = source => {
    if (disabled) return;
    sources.current.add(source); latest.current(source, action, true);
  };
  const pointerEnd = event => {
    release(`pointer:${event.pointerId}`);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <button {...props} type="button" disabled={disabled}
    onPointerDown={event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture?.(event.pointerId);
      hold(`pointer:${event.pointerId}`);
    }}
    onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
    onLostPointerCapture={event => release(`pointer:${event.pointerId}`)}
    onKeyDown={event => {
      if (![' ', 'Enter'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      hold(`button:${id}:${event.key}`);
    }}
    onKeyUp={event => {
      if (![' ', 'Enter'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation(); release(`button:${id}:${event.key}`);
    }}
    onBlur={() => { release(`button:${id}: `); release(`button:${id}:Enter`); }}
    onClick={event => event.preventDefault()}
  >{children}</button>;
}
