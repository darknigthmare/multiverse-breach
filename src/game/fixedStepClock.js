export const COMBAT_STEP_MS = 1000 / 60;

// Rendering may run at 30, 60, 144 Hz or stop in a hidden tab. Gameplay always
// advances in the same 60 Hz units; returning from a pause never catches up.
export const createFixedStepClock = ({ maxCatchUpMs = 100, maxSteps = 12 } = {}) => {
  let previousTimestamp = null;
  let accumulator = 0;
  return {
    reset() {
      previousTimestamp = null;
      accumulator = 0;
    },
    advance(timestamp, { paused = false, speed = 1 } = {}) {
      if (!Number.isFinite(timestamp)) return 0;
      const elapsed = previousTimestamp === null ? 0 : timestamp - previousTimestamp;
      previousTimestamp = timestamp;
      if (paused || elapsed < 0 || elapsed > 1000) {
        accumulator = 0;
        return 0;
      }
      const multiplier = Number.isFinite(speed) ? Math.max(0, Math.min(2, speed)) : 1;
      accumulator += Math.min(maxCatchUpMs, elapsed) * multiplier;
      const steps = Math.min(maxSteps, Math.floor((accumulator + 1e-7) / COMBAT_STEP_MS));
      accumulator = Math.max(0, accumulator - steps * COMBAT_STEP_MS);
      return steps;
    }
  };
};
