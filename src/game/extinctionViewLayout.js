/** Presentation only: reserve actual DOM HUD space without changing the camera. */
const validRect = r => r && [r.x, r.y, r.w, r.h].every(Number.isFinite) && r.w > 0 && r.h > 0;
const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const contains = (a, b) => a.x <= b.x && a.y <= b.y && a.x + a.w >= b.x + b.w && a.y + a.h >= b.y + b.h;

// Keep maximal empty rectangles. Separate stats/actions matter: the dock's
// enclosing box also contains the useful empty space above its shorter column.
function freeRegions(base, obstacles) {
  let regions = validRect(base) ? [base] : [];
  for (const obstacle of obstacles) {
    const split = regions.flatMap(r => !intersects(r, obstacle) ? [r] : [
      { x: r.x, y: r.y, w: obstacle.x - r.x, h: r.h },
      { x: obstacle.x + obstacle.w, y: r.y, w: r.x + r.w - obstacle.x - obstacle.w, h: r.h },
      { x: r.x, y: r.y, w: r.w, h: obstacle.y - r.y },
      { x: r.x, y: obstacle.y + obstacle.h, w: r.w, h: r.y + r.h - obstacle.y - obstacle.h }
    ].filter(validRect));
    regions = split.filter((r, i) => !split.some((other, j) => j !== i && contains(other, r)
      && (!contains(r, other) || j < i)));
  }
  return regions;
}

/** DOMRect coordinates are CSS pixels; all returned regions use canvas units. */
export function getExtinctionViewLayout(canvasRect, width, height, hudRects = [], radar = null, safeArea = 12) {
  if (!canvasRect || ![canvasRect.width, canvasRect.height, width, height].every(n => Number.isFinite(n) && n > 0)) return null;
  const ux = width / canvasRect.width, uy = height / canvasRect.height;
  const gapX = 8 * ux, gapY = 8 * uy;
  const edge = Math.max(12, Math.min(32, Number.isFinite(safeArea) ? safeArea : 12));
  const edgeX = edge * ux, edgeY = edge * uy;
  const obstacles = hudRects.filter(r => r && r.width > 0 && r.height > 0).map(r => ({
    x: (r.left - canvasRect.left) * ux - gapX, y: (r.top - canvasRect.top) * uy - gapY,
    w: r.width * ux + gapX * 2, h: r.height * uy + gapY * 2
  })).filter(validRect);
  if (radar && [radar.x, radar.y, radar.radius].every(Number.isFinite)) {
    obstacles.push({ x: radar.x - radar.radius - gapX, y: radar.y - radar.radius - gapY,
      w: radar.radius * 2 + gapX * 2, h: radar.radius * 2 + gapY * 2 });
  }
  // The reticle and hit marker keep their original position and clear space.
  obstacles.push({ x: width / 2 - 18, y: height / 2 - 18, w: 36, h: 36 });
  const lowerTop = height * 0.54 + gapY;
  const lower = { x: edgeX, y: lowerTop, w: width - edgeX * 2, h: height - lowerTop - edgeY };
  const sideTop = (56 + edge) * uy, sideHeight = height - (56 + edge * 2) * uy;
  const left = { x: edgeX, y: sideTop, w: width / 2 - 18 - edgeX, h: sideHeight };
  const right = { x: width / 2 + 18, y: sideTop, w: width / 2 - 18 - edgeX, h: sideHeight };
  return { kind: 'extinction-view-layout', width, height, unitsPerCssPixel: uy, safeArea: edge,
    lower: freeRegions(lower, obstacles), side: [...freeRegions(left, obstacles), ...freeRegions(right, obstacles)] };
}

/** Contain the whole sheet/diagram, including sway, in a measured free region. */
export function fitExtinctionView(width, desiredWidth, desiredHeight, sway, layout) {
  if (!layout || ![width, desiredWidth, desiredHeight].every(n => Number.isFinite(n) && n > 0)) return null;
  const fit = (regions, region) => regions.map(area => {
    const scale = Math.min(1, area.w / desiredWidth, area.h / desiredHeight);
    const w = desiredWidth * scale, h = desiredHeight * scale;
    const centered = (width - w) / 2 + sway;
    const x = Math.max(area.x, Math.min(area.x + area.w - w, centered));
    return { x, y: area.y + area.h - h, w, h, region, centerDistance: Math.abs(x + w / 2 - width / 2) };
  }).sort((a, b) => b.h - a.h || a.centerDistance - b.centerDistance);
  const lower = fit(layout.lower, 'lower'), usefulHeight = 80 * layout.unitsPerCssPixel;
  let choices = lower;
  if (!lower.length || lower[0].h < Math.min(desiredHeight, usefulHeight)) {
    choices = [...lower, ...fit(layout.side, 'lateral')].sort((a, b) => b.h - a.h || a.centerDistance - b.centerDistance);
  }
  if (!choices.length) return null;
  const best = choices[0];
  // Keep the usual central view when it is useful; a short landscape strip
  // must not force a 10px weapon while a clear lateral region is available.
  const central = choices.find(p => p.centerDistance <= Math.abs(sway) + 0.5
    && p.h >= Math.min(desiredHeight, usefulHeight) && p.h >= best.h * 0.6);
  const { centerDistance: _distance, ...placement } = central || best;
  return placement;
}
