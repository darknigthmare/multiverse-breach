// The canvas keeps its logical arena dimensions. CSS may letterbox it to fit
// any display; input must use the painted content rather than its CSS box.
export function getContainedCanvasViewport(rect, width, height) {
  if (!rect || ![rect.left, rect.top, rect.width, rect.height, width, height].every(Number.isFinite)
    || rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return null;
  const scale = Math.min(rect.width / width, rect.height / height);
  const paintedWidth = width * scale;
  const paintedHeight = height * scale;
  return {
    left: rect.left + (rect.width - paintedWidth) / 2,
    top: rect.top + (rect.height - paintedHeight) / 2,
    width: paintedWidth,
    height: paintedHeight,
    scale
  };
}

export function clientToCombatPoint(clientX, clientY, rect, width, height) {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;
  const viewport = getContainedCanvasViewport(rect, width, height);
  if (!viewport) return null;
  const x = (clientX - viewport.left) / viewport.scale;
  const y = (clientY - viewport.top) / viewport.scale;
  // A click in a decorative letterbox must never become a tactical order.
  if (x < 0 || y < 0 || x >= width || y >= height) return null;
  return { x, y };
}

export function clientToCombatDelta(dx, dy, rect, width, height) {
  const viewport = getContainedCanvasViewport(rect, width, height);
  if (!viewport || !Number.isFinite(dx) || !Number.isFinite(dy)) return null;
  return { x: dx / viewport.scale, y: dy / viewport.scale };
}

// Completion and acknowledging the result are separate UI transitions. Once
// the engine finishes, an old retreat control must not replace that result.
export function createCombatCompletionGate() {
  let result = null;
  let submitted = false;
  return {
    complete(next) {
      if (submitted || result || !['victory', 'defeat'].includes(next)) return false;
      result = next;
      return true;
    },
    submit(requested, report, callback) {
      if (submitted || typeof callback !== 'function') return false;
      if (result && requested !== result) return false;
      if (!result && requested !== 'quit') return false;
      if (!['victory', 'defeat', 'quit'].includes(requested)) return false;
      submitted = true;
      callback(result || requested, report);
      return true;
    }
  };
}
