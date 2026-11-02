/** Input ownership: releasing a thumb or alias never releases another owner. */
export function createSceneInputs(actions = []) {
  const allowed = new Set(actions), owners = new Map();
  return {
    hold(source, action) {
      if (typeof source !== 'string' || !source || !allowed.has(action)) return false;
      owners.set(source, action); return true;
    },
    release(source) { return owners.delete(source); },
    clear() { owners.clear(); },
    snapshot() { return Object.fromEntries([...owners.values()].map(action => [action, true])); }
  };
}

/** Accumulated movement, not one event's delta, distinguishes drag from tap. */
export const emptySceneAim = () => ({ active: false, pointerId: null, x: 0, startX: 0, distance: 0, moved: false });
export function advanceSceneAim(pointer, pointerId, x) {
  if (!pointer.active || pointer.pointerId !== pointerId || !Number.isFinite(x)) return 0;
  const delta = x - pointer.x;
  pointer.distance = (pointer.distance || 0) + Math.abs(delta);
  pointer.moved = pointer.moved || pointer.distance > 4;
  pointer.x = x;
  return delta;
}
