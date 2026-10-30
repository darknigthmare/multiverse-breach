import { useEffect, useRef } from 'react';
import { getSceneCanvasSize, getSceneHudLayout } from '../game/immersiveHubState.js';
import { DISPLAY_PREFERENCES_EVENT, readSceneHudPreferences } from '../game/displayPreferences.js';

// Match the backing canvas to the viewport aspect. World coordinates stay logical;
// one uniform CSS scale is used on both axes, including pointer hit testing.
export default function useSceneViewport(canvasRef, logicalHeight, enabled = true) {
  const hudLayoutRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled || typeof ResizeObserver === 'undefined') return undefined;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dimensions = getSceneCanvasSize(rect.width, rect.height, logicalHeight);
      if (canvas.width !== dimensions.width) canvas.width = dimensions.width;
      if (canvas.height !== dimensions.height) canvas.height = dimensions.height;
      hudLayoutRef.current = getSceneHudLayout({
        width: rect.width, height: rect.height, logicalHeight,
        ...readSceneHudPreferences(getComputedStyle(document.documentElement))
      });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener(DISPLAY_PREFERENCES_EVENT, resize);
    window.addEventListener('storage', resize);
    resize();
    return () => {
      observer.disconnect();
      window.removeEventListener(DISPLAY_PREFERENCES_EVENT, resize);
      window.removeEventListener('storage', resize);
    };
  }, [canvasRef, enabled, logicalHeight]);
  return hudLayoutRef;
}
