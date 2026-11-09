import { useEffect, useRef } from 'react';
import { getExtinctionViewLayout } from '../game/extinctionViewLayout.js';
import { DISPLAY_PREFERENCES_EVENT, readSceneHudPreferences } from '../game/displayPreferences.js';

/** Cache presentation geometry on layout changes, never poll DOM in the renderer. */
export default function useExtinctionViewLayout(canvasRef, sceneHudRef, active) {
  const layoutRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, panel = canvas?.closest('.extinction-panel');
    if (!active || !panel || typeof ResizeObserver === 'undefined') {
      layoutRef.current = null;
      return undefined;
    }
    const elements = [...panel.querySelectorAll('.extinction-hud-dock .nexus-play-stats, .extinction-hud-dock .nexus-play-actions, .extinction-objective-strip')];
    const measure = () => {
      layoutRef.current = getExtinctionViewLayout(canvas.getBoundingClientRect(), canvas.width, canvas.height,
        elements.map(element => element.getBoundingClientRect()), sceneHudRef.current?.fpsRadar,
        readSceneHudPreferences(getComputedStyle(document.documentElement)).safeArea);
    };
    const observer = new ResizeObserver(measure);
    for (const element of [canvas, ...elements]) observer.observe(element);
    window.addEventListener('resize', measure);
    window.addEventListener(DISPLAY_PREFERENCES_EVENT, measure);
    window.addEventListener('storage', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener(DISPLAY_PREFERENCES_EVENT, measure);
      window.removeEventListener('storage', measure);
      layoutRef.current = null;
    };
  }, [canvasRef, sceneHudRef, active]);
  return layoutRef;
}
