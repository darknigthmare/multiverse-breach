import { KART_MODEL_SCALE } from './kartModel.js';

/** Crop the actual opaque character, then retain its upper body. */
export function getKartDriverBustBounds(pixels, width, height, upperBodyRatio = 0.68) {
  let left = width, right = -1, top = height, bottom = -1;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (pixels[(y * width + x) * 4 + 3] < 20) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (right < left || bottom < top) return null;
  const ratio = Math.max(0.25, Math.min(1, Number(upperBodyRatio) || 0.68));
  return { x: left, y: top, width: right - left + 1,
    height: Math.max(1, Math.round((bottom - top + 1) * ratio)) };
}

/**
 * Seat the bust at the model's real sprite anchor in its eight-view projection.
 * Billboard dimensions match the 3D renderer; only the source art is 2D.
 * Return a destination rectangle for a kart drawn at x-width/2, bottom-height.
 */
export function getKartDriver2DPlacement(bust, x, bottom, width, height, direction = 0, anchor = [0, 0.78, 0.18]) {
  const aspect = bust.width / Math.max(1, bust.height);
  const worldHeight = Math.min(28, 35 / aspect);
  const angle = direction * Math.PI / 4, se = Math.sin(0.56), ce = Math.cos(0.56);
  const sa = Math.sin(angle), ca = Math.cos(angle), scale = 0.203125;
  const projectedX = 0.5 + (anchor[0] * ca - anchor[2] * sa) * scale;
  const projectedY = 0.67 + (anchor[0] * sa * se - anchor[1] * ce + anchor[2] * ca * se) * scale;
  const drawWidth = worldHeight * aspect / KART_MODEL_SCALE * scale * width;
  const drawHeight = worldHeight / KART_MODEL_SCALE * scale * ce * height;
  return {
    x: x - width / 2 + projectedX * width - drawWidth / 2,
    y: bottom - height + projectedY * height - drawHeight,
    width: drawWidth,
    height: drawHeight
  };
}
