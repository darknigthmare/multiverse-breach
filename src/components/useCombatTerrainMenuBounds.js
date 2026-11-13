import { useEffect } from 'react';

// Recompute on layout changes, not in the battle renderer. The live header and
// action dock determine how much room a scrollable terrain menu may occupy.
export default function useCombatTerrainMenuBounds(canvasRef, active) {
  useEffect(() => {
    const root = canvasRef.current?.closest('.combat-immersive-surface');
    const header = root?.querySelector('.combat-hud-header');
    const dock = root?.querySelector('.combat-hud-dock');
    if (!active || !root || !header || !dock) return undefined;
    const measure = () => {
      const available = dock.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 20;
      if (Number.isFinite(available)) root.style.setProperty('--combat-terrain-max-height', `${Math.max(70, Math.floor(available))}px`);
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    for (const element of [root, header, dock]) observer?.observe(element);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    measure();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
      root.style.removeProperty('--combat-terrain-max-height');
    };
  }, [canvasRef, active]);
}
