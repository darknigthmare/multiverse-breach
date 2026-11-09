import React, { useEffect, useRef, useState } from 'react';
import { getKartDriverFrame } from '../game/kart/kartRoster.js';
import { recolorKartAtlas } from '../game/kart/kartLivery.js';

/** Uses only this character's registered sources; never substitutes a pilot. */
export default function KartSpritePreview({ spec, kind = 'driver', className = '' }) {
  const canvasRef = useRef(null);
  const paintCacheRef = useRef(null);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    let disposed = false;
    let image = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;
    setStatus('loading');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const illustration = typeof spec?.illustration2D === 'string' ? spec.illustration2D : spec?.illustration2D?.src;
    // Collection paint is defined on the model's projected atlas. A separately
    // authored illustration is never recoloured by the technical face mask.
    const sources = kind === 'kart' ? [!spec?.livery && illustration, spec?.sprite2D?.src].filter(Boolean) : spec?.driverSprite?.sources || [];
    let index = 0;
    const next = () => {
      if (disposed) return;
      const source = sources[index++];
      if (!source) { setStatus('unavailable'); return; }
      image = new Image();
      image.onload = () => {
        if (disposed) return;
        let drawable = image;
        if (kind === 'kart' && spec?.livery && source === spec.sprite2D?.src) {
          const key = `${spec.id}|${source}|${spec.livery.sourceColor}|${spec.color}`;
          if (paintCacheRef.current?.key !== key) {
            try {
              paintCacheRef.current = { key, drawable: recolorKartAtlas(image, spec) };
            } catch {
              setStatus('unavailable');
              return;
            }
          }
          drawable = paintCacheRef.current.drawable;
        }
        const frame = kind === 'kart'
          ? source === illustration ? { columns: 1, rows: 1, col: 0, row: 0 } : { ...spec.sprite2D, col: 1, row: 0 }
          : getKartDriverFrame(spec, source);
        const trim = frame?.trim || {};
        const cellWidth = image.naturalWidth / (frame?.columns || 1);
        const cellHeight = image.naturalHeight / (frame?.rows || 1);
        const sx = (frame?.col || 0) * cellWidth + (trim.left || 0);
        const sy = (frame?.row || 0) * cellHeight + (trim.top || 0);
        const sw = Math.max(1, cellWidth - (trim.left || 0) - (trim.right || 0));
        const sh = Math.max(1, cellHeight - (trim.top || 0) - (trim.bottom || 0));
        const scale = Math.min(canvas.width / sw, canvas.height / sh);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(drawable, sx, sy, sw, sh, (canvas.width - sw * scale) / 2, (canvas.height - sh * scale) / 2, sw * scale, sh * scale);
        setStatus('ready');
      };
      image.onerror = next;
      image.src = source;
    };
    next();
    return () => { disposed = true; if (image) { image.onload = null; image.onerror = null; } };
  }, [spec, kind]);
  return <span className={`kart-sprite-preview ${className}`} data-sprite-status={status}>
    <canvas ref={canvasRef} width={128} height={128} role="img" aria-label={kind === 'kart' ? spec?.kartName?.fr : spec?.name} />
    {status === 'unavailable' && <span aria-hidden="true">{spec?.name?.slice(0, 2).toUpperCase() || '?'}</span>}
  </span>;
}
