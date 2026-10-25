import { useEffect } from 'react';

// Match the backing canvas to the viewport aspect. World coordinates stay logical;
// one uniform CSS scale is used on both axes, including pointer hit testing.
export default function useSceneViewport(canvasRef, logicalHeight, enabled = true) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled || typeof ResizeObserver === 'undefined') return undefined;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const width = Math.max(1, Math.round(logicalHeight * rect.width / rect.height));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== logicalHeight) canvas.height = logicalHeight;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [canvasRef, enabled, logicalHeight]);
}
