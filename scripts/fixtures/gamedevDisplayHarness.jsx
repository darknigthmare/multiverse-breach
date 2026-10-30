import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import GameDisplaySettings, { GameDisplayPreferencesSync } from '../../src/components/GameDisplaySettings.jsx';
import useSceneViewport from '../../src/components/useSceneViewport.js';
import { createReducedMotionReader } from '../../src/game/reducedMotion.js';

export default function DisplayHarness() {
  const canvasRef = useRef(null);
  const hudLayoutRef = useSceneViewport(canvasRef, 540);
  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = createReducedMotionReader();
    let frameId;
    let presentationFrame = 0;
    const draw = () => {
      const layout = hudLayoutRef.current;
      if (layout) {
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const map = layout.cityMinimap;
        const radar = layout.fpsRadar;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#39c5bb';
        context.fillRect(map.x, map.y, map.width, map.height);
        context.strokeStyle = '#ffd469';
        context.beginPath();
        context.arc(radar.x, radar.y, radar.radius, 0, Math.PI * 2);
        context.stroke();
        canvas.dataset.mapRight = String(rect.width - (map.x + map.width) / layout.unitsPerCssPixel);
        canvas.dataset.radarRight = String(rect.width - (radar.x + radar.radius) / layout.unitsPerCssPixel);
        canvas.dataset.reducedMotion = String(reducedMotion());
        canvas.dataset.presentationFrame = String(++presentationFrame);
      }
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [hudLayoutRef]);
  return <main style={{ padding: 16, background: '#10151f', color: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
    <GameDisplayPreferencesSync />
    <h1>Display regression fixture</h1>
    <GameDisplaySettings />
    <canvas ref={canvasRef} data-testid="scene-hud" aria-label="Canvas HUD regression fixture"
      style={{ width: '100%', height: '35vh', minHeight: 200, display: 'block', background: '#202b3c' }} />
  </main>;
}

document.body.style.margin = '0';
createRoot(document.getElementById('root')).render(<DisplayHarness />);
