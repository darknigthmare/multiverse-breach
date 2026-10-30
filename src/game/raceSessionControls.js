import { createSceneInputs } from './sceneInputs.js';

/** A receipt belongs to one mounted race, never to a later restart. */
export function createRaceRunGuard() {
  let active = true;
  let reported = false;
  return {
    claim() {
      if (!active || reported) return false;
      reported = true;
      return true;
    },
    dispose() { active = false; },
    isActive() { return active; }
  };
}

/** Pointer ownership is separate from keyboard input. Releasing one thumb must
 * not release another pointer (or a keyboard key) using the same control. */
export function createRaceTouchState() {
  const owners = new Map();
  const controls = new Set(['up', 'down', 'left', 'right', 'space']);
  return {
    hold(pointerId, key) {
      if (!Number.isInteger(pointerId) || !controls.has(key)) return false;
      owners.set(pointerId, key);
      return true;
    },
    release(pointerId) { owners.delete(pointerId); },
    clear() { owners.clear(); },
    snapshot() { return Object.fromEntries([...owners.values()].map(key => [key, true])); }
  };
}

/** Remember the action selected at keydown, and release by physical key even
 * when focus or the key's displayed character changes before keyup. */
export function createRaceKeyboardState() {
  const inputs = createSceneInputs(['up', 'down', 'left', 'right', 'space', 'w', 'a', 's', 'd']);
  const source = event => {
    if (typeof event?.code === 'string' && event.code && event.code !== 'Unidentified') return `code:${event.code}`;
    if (typeof event?.key !== 'string' || !event.key) return '';
    return `key:${event.key.toLowerCase()}:${Number.isInteger(event.location) ? event.location : 0}`;
  };
  return {
    hold(event, action) { return inputs.hold(source(event), action); },
    release(event) { inputs.release(source(event)); },
    clear() { inputs.clear(); },
    snapshot() { return inputs.snapshot(); }
  };
}

