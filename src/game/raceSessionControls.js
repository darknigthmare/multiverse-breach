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
