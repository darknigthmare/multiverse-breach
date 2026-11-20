import React, { useEffect, useRef, useState } from 'react';

/** Displays a reviewed source crop inside the caller's existing portrait frame. */
export default function ReviewedActorPortrait({ portrait, fallback }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { sheet, width, height, crop, smooth } = portrait;

  useEffect(() => {
    setReady(false);
    const context = canvasRef.current?.getContext('2d');
    if (!context) return undefined;
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth !== width || image.naturalHeight !== height) return;
      context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      setReady(true);
    };
    image.src = sheet;
    return () => { image.onload = null; };
  }, [sheet, width, height, crop]);

  return <>
    <canvas
      ref={canvasRef}
      width={crop.width}
      height={crop.height}
      aria-hidden="true"
      style={{ display: ready ? 'block' : 'none', position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', imageRendering: smooth ? 'auto' : 'pixelated' }}
    />
    {!ready && fallback}
  </>;
}
