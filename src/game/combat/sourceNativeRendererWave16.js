// Drawing is installed by the production renderer. Admission and projection
// modules remain usable in Node without importing browser renderer dependencies.
let canvasRenderer = null;
export function registerSourceNativeRendererWave16(renderer) { canvasRenderer = renderer; }
export function drawSourceNativeAtlasWave16(...args) {
  return canvasRenderer?.drawCosmeticAtlasFrame(...args) ?? false;
}
export function preloadSourceNativeSheetsWave16(sheets) { canvasRenderer?.preloadSpriteSheetSrcs(sheets); }
