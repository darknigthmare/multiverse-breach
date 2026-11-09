const activationCode = event => {
  if (['Space', 'Enter', 'NumpadEnter'].includes(event.code)) return event.code;
  if (event.key === ' ') return 'Space';
  if (event.key === 'Enter') return 'Enter';
  return null;
};

/** Each physical source is sent to the scene's authoritative input registry.
 * Do not aggregate here: a scene can clear its inputs on a tag, pause or reset
 * while this button stays mounted. A fresh source must still reach that scene.
 */
export function createHeldControlInput({ onInput, isDisabled = () => false, sourcePrefix = 'control' }) {
  const owners = new Map();
  const pointerSource = event => Number.isInteger(event.pointerId) ? `${sourcePrefix}:pointer:${event.pointerId}` : null;
  const keySource = event => {
    const code = activationCode(event);
    return code ? `${sourcePrefix}:keyboard:${code}` : null;
  };
  const releaseCapture = owner => {
    if (owner.kind !== 'pointer') return;
    try {
      if (owner.target?.hasPointerCapture?.(owner.id)) owner.target.releasePointerCapture(owner.id);
    } catch { /* The browser may already have cancelled or removed this pointer. */ }
  };
  const release = (source, phase) => {
    const owner = owners.get(source);
    if (!owner) return false;
    owners.delete(source);
    onInput(source, phase);
    releaseCapture(owner);
    return true;
  };
  const clear = kind => {
    for (const [source, owner] of [...owners]) {
      if (!kind || owner.kind === kind) release(source, 'cancel');
    }
  };
  return {
    clear,
    onPointerDown(event) {
      const source = pointerSource(event);
      if (!source || event.button !== 0 || event.defaultPrevented || isDisabled() || owners.has(source)) return;
      event.preventDefault();
      owners.set(source, { kind: 'pointer', target: event.currentTarget, id: event.pointerId });
      try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* Window release is the fallback. */ }
      onInput(source, 'down');
    },
    onPointerUp(event) {
      const source = pointerSource(event);
      if (!owners.has(source)) return;
      event.preventDefault();
      release(source, 'up');
    },
    onPointerCancel(event) { release(pointerSource(event), 'cancel'); },
    onLostPointerCapture(event) { release(pointerSource(event), 'cancel'); },
    onKeyDown(event) {
      const source = keySource(event);
      if (!source || event.defaultPrevented || isDisabled()) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat || owners.has(source)) return;
      owners.set(source, { kind: 'keyboard' });
      onInput(source, 'down');
    },
    onKeyUp(event) {
      const source = keySource(event);
      if (!owners.has(source)) return;
      event.preventDefault();
      event.stopPropagation();
      release(source, 'up');
    },
    onBlur() { clear('keyboard'); }
  };
}
