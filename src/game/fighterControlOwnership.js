import { createSceneInputs } from './sceneInputs.js';

const keyboardSource = event => {
  if (typeof event?.code === 'string' && event.code && event.code !== 'Unidentified') return `keyboard:${event.code}`;
  if (typeof event?.key !== 'string' || !event.key) return '';
  return `keyboard:${event.key.toLowerCase()}:${Number.isInteger(event.location) ? event.location : 0}`;
};

/** Keep physical keyboard owners separate from the existing touch buttons. */
export function createFighterHeldInputs() {
  const sides = new Map(['player', 'cpu'].map(side => [
    side, createSceneInputs(['left', 'right', 'down', 'guard'])
  ]));
  return {
    holdKey(event, side, control) {
      return sides.get(side)?.hold(keyboardSource(event), control) ?? false;
    },
    releaseKey(event) {
      const source = keyboardSource(event);
      for (const inputs of sides.values()) inputs.release(source);
    },
    setTouch(side, control, active, owner = 'legacy') {
      const inputs = sides.get(side);
      if (!inputs || typeof owner !== 'string' || !owner) return false;
      const source = `touch:${control}:${owner}`;
      if (active) return inputs.hold(source, control);
      inputs.release(source);
      return true;
    },
    clear(side) {
      if (side === undefined) for (const inputs of sides.values()) inputs.clear();
      else sides.get(side)?.clear();
    },
    snapshot() {
      return Object.fromEntries([...sides].map(([side, inputs]) => [side, inputs.snapshot()]));
    }
  };
}

/** A held input belongs to the current fighter, not to the next roster member.
 * Synchronize both before dispatching input and after simulation (forced KO
 * swaps can happen there). Clearing one side must not affect the other player.
 */
export function synchronizeFighterControlOwners(engine, inputRef, ownersRef, heldInputs) {
  if (!engine || engine.disposed || !inputRef || !ownersRef) return;
  let owners = ownersRef.current;
  if (!owners || owners.engine !== engine) {
    owners = { engine };
    ownersRef.current = owners;
  }
  for (const side of ['player', 'cpu']) {
    const actor = engine.getActive(side);
    if (owners[side] !== actor) {
      heldInputs?.clear(side);
      inputRef.current[side] = {};
      engine.clearSideInput(side);
      owners[side] = actor;
    }
  }
}
