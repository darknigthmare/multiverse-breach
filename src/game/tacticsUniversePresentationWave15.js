// Original procedural art for the four W15 sectors. No official source image
// or other engine backdrop is sampled. Profiles describe a chosen work/era.
export const TACTICS_ENVIRONMENT_PROFILES_WAVE15 = Object.freeze({
  'dollet-coast': { sky: ['#7da4b3', '#d7d6bb'], ground: '#8e9a88', haze: '#d9d9bc', far: '#98aca6', near: '#7b8c81', ridge: 'city', flora: 'none', accent: '#e3c894', architecture: 'dollet-roofs' },
  'spencer-courtyard': { sky: ['#1d2d3b', '#71807a'], ground: '#34453b', haze: '#99a399', far: '#526963', near: '#354e46', ridge: 'hills', flora: 'old-forest', accent: '#b6b9a3', architecture: 'spencer-manor' },
  'red-rock-canyon': { sky: ['#8ba6ac', '#dfc19b'], ground: '#a66c49', haze: '#e1c296', far: '#bf9270', near: '#9e6248', ridge: 'mesas', flora: 'steppe', accent: '#e8bc7d', architecture: 'canyon-camp' },
  'white-forest': { sky: ['#7591a1', '#c3d1bc'], ground: '#55744b', haze: '#c4d2bc', far: '#829c8c', near: '#4e7257', ridge: 'valley', flora: 'conifers', accent: '#b4c5a1', architecture: 'resistance-outpost' }
});

export const TACTICS_TERRAIN_MATERIALS_WAVE15 = Object.freeze({
  'dollet-cobble': { family: 'stone', top: '#aca48a', mid: '#98927c', side: '#777864', underside: '#4e554c', detail: '#d2c8a8', accent: '#e4d2aa', edge: '#c9c4aa' },
  'dollet-plaster': { family: 'stone', top: '#d1c3a2', mid: '#baac8b', side: '#9b8c72', underside: '#645b4d', detail: '#eee0bc', accent: '#f5e5b8', edge: '#e4d5af' },
  'spencer-limestone': { family: 'stone', top: '#7c8177', mid: '#6c756c', side: '#53615a', underside: '#303e38', detail: '#a8b09e', accent: '#bdc2af', edge: '#9fa99a' },
  'spencer-marble': { family: 'stone', top: '#b7b8a7', mid: '#9dA493', side: '#7a887d', underside: '#4a5d53', detail: '#d6d6c3', accent: '#e4e2cc', edge: '#c9cdb9' },
  'red-rock-sandstone': { family: 'rock', sideFamily: 'strata', top: '#aa7550', mid: '#976142', side: '#87523b', underside: '#523a30', detail: '#d29b67', accent: '#ebba7a', edge: '#c68c5c' },
  'white-forest-grass': { family: 'grass', sideFamily: 'strata', top: '#62814b', mid: '#547341', side: '#6d5f44', underside: '#39392b', detail: '#93ad67', accent: '#c2cb88', edge: '#8da36a' },
  'white-forest-concrete': { family: 'stone', top: '#8a958c', mid: '#77877d', side: '#5b7066', underside: '#354c43', detail: '#b4beb0', accent: '#d1d3b7', edge: '#a8b6a5' }
});

function poly(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath(); ctx.fill();
}

export function drawTacticsLandmarksWave15(ctx, profile, width, horizon, pan) {
  const y = horizon + 10, x = width * 0.83 + pan;
  if (profile.architecture === 'dollet-roofs') {
    for (let index = 0; index < 4; index++) {
      const left = width * (0.08 + index * 0.08) + pan, roof = y - 17 - (index % 2) * 13;
      ctx.fillStyle = profile.accent; ctx.fillRect(left, roof, 37, y - roof + 14);
      poly(ctx, [[left - 5, roof], [left + 18, roof - 16], [left + 42, roof]], '#936d58');
      ctx.fillStyle = profile.near;
      for (let column = 0; column < 3; column++) ctx.fillRect(left + 5 + column * 11, roof + 7, 5, 10);
    }
  } else if (profile.architecture === 'spencer-manor') {
    ctx.fillStyle = '#7c887c'; ctx.fillRect(x - 68, y - 33, 136, 44);
    poly(ctx, [[x - 80, y - 33], [x - 43, y - 52], [x, y - 43], [x + 42, y - 52], [x + 79, y - 33]], '#354a44');
    ctx.fillStyle = profile.near;
    for (let index = 0; index < 9; index++) ctx.fillRect(x - 56 + index * 13, y - 25, 7, 12);
    ctx.fillStyle = profile.accent;
    for (let index = 0; index < 4; index++) ctx.fillRect(x - 25 + index * 15, y - 18, 4, 29);
  } else if (profile.architecture === 'canyon-camp') {
    for (const [offset, size] of [[-26, 18], [18, 23], [57, 13]]) {
      poly(ctx, [[x + offset - size, y + 7], [x + offset, y - size * 0.65], [x + offset + size, y + 7]], '#9b9473');
      poly(ctx, [[x + offset, y - size * 0.65], [x + offset + size, y + 7], [x + offset + 3, y + 7]], '#6c6754');
    }
  } else if (profile.architecture === 'resistance-outpost') {
    ctx.fillStyle = profile.near; ctx.fillRect(x - 50, y - 22, 62, 35);
    poly(ctx, [[x - 56, y - 22], [x - 20, y - 37], [x + 18, y - 22]], '#687b73');
    ctx.strokeStyle = profile.near; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 38, y + 10); ctx.lineTo(x + 45, y - 74); ctx.lineTo(x + 53, y + 10);
    for (let row = 0; row < 5; row++) { ctx.moveTo(x + 39 + row, y - row * 14); ctx.lineTo(x + 52 - row, y - (row + 1) * 14); }
    ctx.moveTo(x + 27, y - 58); ctx.lineTo(x + 64, y - 58); ctx.stroke();
  } else return false;
  return true;
}

// The main renderer supplies the obstacle's real support, width and height;
// this function adds no collision or interaction state.
export function drawTacticsSceneryWave15(ctx, { obstacle, point, width, height } = {}) {
  if (!['dollet-lamppost', 'spencer-statue', 'radio-mast'].includes(obstacle?.sceneryKind)) return false;
  const w = Math.max(4, width), h = Math.max(8, height);
  ctx.save(); ctx.translate(point.x, point.y);
  ctx.fillStyle = 'rgba(9,20,20,0.21)'; ctx.beginPath(); ctx.ellipse(0, 1, w * 0.48, w * 0.13, 0, 0, Math.PI * 2); ctx.fill();
  const color = obstacle.color || '#7a847b';
  if (obstacle.sceneryKind === 'dollet-lamppost') {
    ctx.fillStyle = color; ctx.fillRect(-w * 0.07, -h * 0.87, w * 0.14, h * 0.87);
    ctx.fillRect(-w * 0.2, -h * 0.09, w * 0.4, h * 0.09);
    poly(ctx, [[-w * 0.2, -h * 0.9], [0, -h], [w * 0.2, -h * 0.9]], color);
    ctx.fillStyle = '#d2c395'; ctx.fillRect(-w * 0.13, -h * 0.9, w * 0.26, h * 0.13);
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(-w * 0.14, -h * 0.9, w * 0.28, h * 0.14);
  } else if (obstacle.sceneryKind === 'spencer-statue') {
    ctx.fillStyle = color; ctx.fillRect(-w * 0.35, -h * 0.27, w * 0.7, h * 0.27);
    poly(ctx, [[-w * 0.19, -h * 0.28], [-w * 0.13, -h * 0.75], [w * 0.05, -h * 0.83], [w * 0.19, -h * 0.29]], color);
    ctx.beginPath(); ctx.ellipse(0, -h * 0.9, w * 0.12, h * 0.09, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d2d1b9'; ctx.lineWidth = Math.max(1, w * 0.04);
    ctx.beginPath(); ctx.moveTo(-w * 0.15, -h * 0.64); ctx.lineTo(-w * 0.25, -h * 0.42); ctx.stroke();
  } else {
    ctx.fillStyle = color; ctx.fillRect(-w * 0.31, -h * 0.3, w * 0.62, h * 0.3);
    ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.5, w * 0.05);
    ctx.beginPath(); ctx.moveTo(-w * 0.17, -h * 0.3); ctx.lineTo(0, -h); ctx.lineTo(w * 0.17, -h * 0.3);
    for (let row = 0; row < 4; row++) { const low = 0.35 + row * 0.14, high = low + 0.14; ctx.moveTo(-w * (1 - low) * 0.23, -h * low); ctx.lineTo(w * (1 - high) * 0.23, -h * high); }
    ctx.moveTo(-w * 0.3, -h * 0.83); ctx.lineTo(w * 0.3, -h * 0.83); ctx.stroke();
    ctx.fillStyle = '#abc1b1'; ctx.fillRect(-w * 0.16, -h * 0.23, w * 0.2, h * 0.07);
  }
  ctx.restore(); return true;
}
