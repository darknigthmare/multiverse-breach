import { useEffect, useRef } from 'react';
import { getSceneCanvasSize, getSceneHudLayout, getSceneHudRect } from '../game/immersiveHubState.js';
import { DISPLAY_PREFERENCES_EVENT, readSceneHudPreferences } from '../game/displayPreferences.js';

// Match the backing canvas to the viewport aspect. World coordinates stay logical;
// one uniform CSS scale is used on both axes, including pointer hit testing.
export default function useSceneViewport(canvasRef, logicalHeight, enabled = true, overlayRef = null) {
  const hudLayoutRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef?.current;
    hudLayoutRef.current = null;
    if (!canvas || !enabled || typeof ResizeObserver === 'undefined') return undefined;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) { hudLayoutRef.current = null; return; }
      const dimensions = getSceneCanvasSize(rect.width, rect.height, logicalHeight);
      if (canvas.width !== dimensions.width) canvas.width = dimensions.width;
      if (canvas.height !== dimensions.height) canvas.height = dimensions.height;
      hudLayoutRef.current = { ...getSceneHudLayout({
        width: rect.width, height: rect.height, logicalHeight,
        ...readSceneHudPreferences(getComputedStyle(document.documentElement))
      }), occlusionRect: getSceneHudRect(rect, overlay?.getBoundingClientRect(), dimensions) };
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (overlay) observer.observe(overlay);
    window.addEventListener(DISPLAY_PREFERENCES_EVENT, resize);
    window.addEventListener('storage', resize);
    resize();
    return () => {
      observer.disconnect();
      hudLayoutRef.current = null;
      window.removeEventListener(DISPLAY_PREFERENCES_EVENT, resize);
      window.removeEventListener('storage', resize);
    };
  }, [canvasRef, enabled, logicalHeight, overlayRef]);
  return hudLayoutRef;
}
