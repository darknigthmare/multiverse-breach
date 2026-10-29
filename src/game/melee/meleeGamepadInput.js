import { readGamepadMeleeInput } from './meleeInputMap.js';

/** Keep a lost pad's cancellation and rearming separate from other devices. */
export function createMeleeGamepadInput() {
  let connected = false;
  let identity = null;
  let generation = 0;
  let needsNeutral = false;

  return {
    read(pad) {
      const available = Boolean(pad && pad.connected !== false);
      const nextIdentity = available ? JSON.stringify([pad.index, pad.id, pad.mapping]) : null;
      if (connected && (!available || nextIdentity !== identity)) {
        generation++;
        needsNeutral = true;
      }
      connected = available;
      identity = nextIdentity;

      const raw = readGamepadMeleeInput(available ? pad : null);
      const held = Object.values(raw.actions).some(Boolean);
      // Absence is not a physical neutral sample. A returning held pad cannot
      // rearm itself, while keyboard/touch remain free to control this player.
      if (available && !held) needsNeutral = false;
      const snapshot = needsNeutral && held ? readGamepadMeleeInput(null) : raw;
      return { snapshot, connected, generation };
    },
    disconnect() {
      if (connected) generation++;
      connected = false;
      identity = null;
      needsNeutral = true;
    },
    reset() { needsNeutral = true; }
  };
}
