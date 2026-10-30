import React, { useRef } from 'react';
import HeldControlButton from './HeldControlButton.jsx';

// Keep the scene's action contract while sharing physical-owner cleanup with
// the combat controls. A changed action remounts and releases the old owners.
export default function SceneHoldButton({ action, onInput, disabled = false, children, ...props }) {
  const buttonRef = useRef(null);
  return <HeldControlButton {...props} key={action} ref={buttonRef} disabled={disabled}
    onInput={(source, phase) => {
      // Scene controls have always moved keyboard focus to the touched button.
      // Focus changes release keyboard owners without cancelling held fingers.
      if (phase === 'down' && source.includes(':pointer:')) buttonRef.current?.focus({ preventScroll: true });
      onInput(source, action, phase === 'down');
    }}
    onClick={event => event.preventDefault()}
  >{children}</HeldControlButton>;
}
