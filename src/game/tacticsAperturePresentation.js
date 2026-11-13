// Original procedural textures informed by Valve's Portal 2 screenshots.
// These shapes never create collision or substitute for an official map.
export const TACTICS_APERTURE_MATERIALS = Object.freeze({
  'aperture-panel': { family: 'panel', top: '#c8cac4', mid: '#b0b5b2', side: '#68767b', underside: '#303d44', detail: '#e4e5df', accent: '#9bbbc4', edge: '#d5d9d4' },
  'aperture-frame': { family: 'panel', top: '#505d64', mid: '#3e4c55', side: '#2b3943', underside: '#19252f', detail: '#84949a', accent: '#a9c2c6', edge: '#758890' },
  'aperture-grate': { family: 'grate', top: '#78868a', mid: '#5b6c73', side: '#3b4e58', underside: '#23333e', detail: '#b2c1c3', accent: '#c9d7d4', edge: '#9aadb1' }
});
export const TACTICS_APERTURE_ENVIRONMENT = Object.freeze({
  sky: ['#17242e', '#55646b'], ground: '#303e45', haze: '#8b9b9e',
  far: '#5e7078', near: '#354852', ridge: 'city', flora: 'none',
  accent: '#b8dce0', architecture: 'aperture-maintenance'
});
export function drawApertureLandmarks(ctx, profile, width, horizon, pan) {
  if (profile.architecture !== 'aperture-maintenance') return false;
  const left = width * .08 + pan, right = width * .91 + pan, top = Math.max(18, horizon - 115);
  ctx.fillStyle = '#263640'; ctx.fillRect(left, top, right - left, horizon - top + 28);
  for (let i = 0; i < 7; i++) {
    const x = left + i * (right - left) / 7;
    ctx.fillStyle = i % 3 === 1 ? '#b9c2bf' : '#8e9da0';
    ctx.fillRect(x + 5, top + 9, (right - left) / 7 - 12, horizon - top - 12);
    ctx.fillStyle = '#30444e'; ctx.fillRect(x + 9, top + 13, 3, horizon - top - 20);
  }
  ctx.strokeStyle = '#a9b8ba'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(left, horizon + 4); ctx.lineTo(right, horizon + 4); ctx.stroke();
  ctx.strokeStyle = '#4b606a'; ctx.lineWidth = 6;
  for (const x of [left + (right - left) * .18, left + (right - left) * .76]) {
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, horizon + 30); ctx.stroke();
  }
  return true;
}
export function drawApertureScenery(ctx, { obstacle, point, width, height } = {}) {
  if (!['aperture-support', 'aperture-panels'].includes(obstacle?.sceneryKind) || !point) return false;
  const w = Math.max(4, width), h = Math.max(8, height), x = point.x, y = point.y;
  ctx.fillStyle = '#253640'; ctx.fillRect(x - w * .36, y - h, w * .72, h);
  if (obstacle.sceneryKind === 'aperture-support') {
    ctx.fillStyle = '#667a83';
    ctx.fillRect(x - w * .36, y - h, w * .13, h);
    ctx.fillRect(x + w * .23, y - h, w * .13, h);
    ctx.strokeStyle = '#87999e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - w * .25, y - h * .85); ctx.lineTo(x + w * .25, y - h * .15); ctx.stroke();
  } else {
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = ['#a6b4b5', '#bfc8c5', '#d3d8d1'][i];
      ctx.fillRect(x - w * .32 + i * w * .05, y - h + i * h * .22, w * .54, h * .29);
    }
  }
  return true;
}
