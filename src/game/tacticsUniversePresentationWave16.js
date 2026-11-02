// Original procedural materials and landmarks for the four W16 sectors.
// A named source location does not certify the exact grid, palette or props.
export const TACTICS_ENVIRONMENT_PROFILES_WAVE16 = Object.freeze({
  'inkwell-cartoon': { sky: ['#83bdd0', '#e7e5b7'], ground: '#799b53', haze: '#e9e3b6', far: '#a2b77b', near: '#6f9553', ridge: 'hills', flora: 'broadleaf', accent: '#eed894', architecture: 'inkwell-cottage' },
  'imc-foundry': { sky: ['#354a58', '#9aa5a2'], ground: '#3d5056', haze: '#b3b9ad', far: '#72858b', near: '#415c65', ridge: 'city', flora: 'none', accent: '#acc9cb', architecture: 'imc-assembly' },
  'central-railway': { sky: ['#8eafba', '#e2dabe'], ground: '#8b9381', haze: '#ded7bb', far: '#a2aea0', near: '#7a8f83', ridge: 'city', flora: 'none', accent: '#e0d4b1', architecture: 'amestrian-station' },
  'sadida-canopy': { sky: ['#6eaaa0', '#c6d6a3'], ground: '#486f4c', haze: '#bfcc98', far: '#8eaf78', near: '#4a8055', ridge: 'hills', flora: 'old-forest', accent: '#bbd482', architecture: 'sadida-tree' }
});

export const TACTICS_TERRAIN_MATERIALS_WAVE16 = Object.freeze({
  'inkwell-grass': { family: 'grass', sideFamily: 'strata', top: '#83a955', mid: '#71964a', side: '#937250', underside: '#554936', detail: '#b4c86d', accent: '#dfdc93', edge: '#a9ba6e' },
  'inkwell-wood': { family: 'wood', top: '#b89562', mid: '#a17c4f', side: '#86643f', underside: '#51402d', detail: '#d7bb83', accent: '#e9d49f', edge: '#cdb07a' },
  'imc-deck': { family: 'panel', top: '#738790', mid: '#5d717a', side: '#3e555f', underside: '#233b47', detail: '#a6b9bc', accent: '#c7d6cf', edge: '#9aafb2' },
  'imc-grate': { family: 'grate', top: '#526972', mid: '#405961', side: '#2d4751', underside: '#1e3542', detail: '#86a6aa', accent: '#b4c8bf', edge: '#829fa3' },
  'central-stone': { family: 'stone', top: '#b1b09a', mid: '#9c9f8e', side: '#7c8578', underside: '#4d5c53', detail: '#d0ccb0', accent: '#e6d9b5', edge: '#c7c3a8' },
  'central-rail': { family: 'panel', top: '#7c7e70', mid: '#686f63', side: '#4e5c51', underside: '#303f37', detail: '#adb19a', accent: '#c7c6a6', edge: '#9ca68e' },
  'sadida-grass': { family: 'grass', sideFamily: 'strata', top: '#5c8d51', mid: '#4f7e45', side: '#6c6241', underside: '#3a3d29', detail: '#98b866', accent: '#c2cf83', edge: '#8ba96a' },
  'sadida-root': { family: 'wood', top: '#8c8152', mid: '#786f43', side: '#605b35', underside: '#3b3d27', detail: '#b4ad70', accent: '#d0c68b', edge: '#a49f67' }
});

function poly(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath(); ctx.fill();
}

export function drawTacticsLandmarksWave16(ctx, profile, width, horizon, pan) {
  const y = horizon + 10, x = width * .83 + pan;
  if (profile.architecture === 'inkwell-cottage') {
    const left = width * .13 + pan;
    ctx.fillStyle = '#e2d7ac'; ctx.fillRect(left, y - 30, 62, 43);
    poly(ctx, [[left - 10, y - 30], [left + 31, y - 55], [left + 72, y - 30]], '#a87e54');
    ctx.fillStyle = profile.near; ctx.fillRect(left + 24, y - 11, 14, 24);
    ctx.beginPath(); ctx.ellipse(left + 13, y - 18, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    poly(ctx, [[x - 54, y + 11], [x - 29, y - 4], [x + 7, y - 8], [x + 43, y + 11]], profile.near);
  } else if (profile.architecture === 'imc-assembly') {
    ctx.fillStyle = profile.near;
    for (let index = 0; index < 4; index++) {
      const left = width * (.08 + index * .23) + pan, top = y - 31 - (index % 2) * 17;
      ctx.fillRect(left, top, 9, y - top + 18); ctx.fillRect(left + 67, top, 9, y - top + 18);
      ctx.fillRect(left - 4, top, 84, 7);
      ctx.strokeStyle = profile.accent; ctx.beginPath(); ctx.moveTo(left + 9, top + 7); ctx.lineTo(left + 67, top + 29); ctx.stroke();
    }
    ctx.fillStyle = profile.accent; ctx.fillRect(x - 26, y - 15, 39, 4);
  } else if (profile.architecture === 'amestrian-station') {
    ctx.fillStyle = '#a5ad9b'; ctx.fillRect(x - 93, y - 30, 158, 44);
    poly(ctx, [[x - 102, y - 30], [x - 14, y - 53], [x + 75, y - 30]], '#657e75');
    ctx.fillStyle = profile.near;
    for (let index = 0; index < 8; index++) ctx.fillRect(x - 80 + index * 18, y - 18, 8, 22);
    ctx.fillStyle = '#d9d2ae'; ctx.fillRect(x - 23, y - 52, 20, 32);
    ctx.beginPath(); ctx.ellipse(x - 13, y - 39, 6, 6, 0, 0, Math.PI * 2); ctx.fill();
  } else if (profile.architecture === 'sadida-tree') {
    poly(ctx, [[x - 21, y + 14], [x - 10, y - 57], [x + 9, y - 57], [x + 25, y + 14]], '#6a7650');
    for (const [offset, rise, radius] of [[-37, 25, 32], [0, 42, 44], [39, 22, 35]]) {
      ctx.fillStyle = profile.near; ctx.beginPath(); ctx.ellipse(x + offset, y - 45 - rise, radius, radius * .64, -.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#7c8d5a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 3, y + 6); ctx.lineTo(x - 57, y + 21); ctx.moveTo(x + 5, y + 5); ctx.lineTo(x + 63, y + 18); ctx.stroke();
  } else return false;
  return true;
}

export function drawTacticsSceneryWave16(ctx, { obstacle, point, width, height } = {}) {
  const kind = obstacle?.sceneryKind;
  if (!point || !['inkwell-milepost', 'imc-service-pylon', 'central-station-clock', 'sadida-root-buttress'].includes(kind)) return false;
  ctx.save();
  const x = point.x, y = point.y;
  const left = x - width / 2, top = y - height;
  if (kind === 'inkwell-milepost') {
    ctx.fillStyle = '#8e6c43'; ctx.fillRect(x - width * .07, top + height * .08, width * .14, height * .92);
    poly(ctx, [[left, top + height * .14], [x + width * .35, top + height * .14], [x + width * .5, top + height * .24], [x + width * .35, top + height * .34], [left, top + height * .34]], '#bea06c');
  } else if (kind === 'imc-service-pylon') {
    poly(ctx, [[x - width * .35, y], [x - width * .28, top], [x + width * .24, top], [x + width * .4, y]], '#607982');
    ctx.fillStyle = '#a4b8ba'; ctx.fillRect(x - width * .17, top + height * .15, width * .34, height * .17);
    ctx.fillStyle = '#76bbbc'; ctx.fillRect(x - width * .11, top + height * .19, width * .22, height * .07);
    ctx.fillStyle = '#354b54'; ctx.fillRect(x - width * .24, y - height * .18, width * .48, height * .09);
  } else if (kind === 'central-station-clock') {
    ctx.fillStyle = '#707e70'; ctx.fillRect(x - width * .09, top + height * .2, width * .18, height * .8);
    ctx.fillStyle = '#dbd8b9'; ctx.beginPath(); ctx.ellipse(x, top + height * .2, width * .37, width * .37, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4f6156'; ctx.lineWidth = Math.max(1, width * .03); ctx.beginPath(); ctx.moveTo(x, top + height * .2); ctx.lineTo(x, top + height * .1); ctx.moveTo(x, top + height * .2); ctx.lineTo(x + width * .17, top + height * .24); ctx.stroke();
  } else {
    poly(ctx, [[left, y], [x - width * .24, top + height * .31], [x, top], [x + width * .21, top + height * .44], [x + width * .5, y]], '#77744b');
    ctx.strokeStyle = '#aca06a'; ctx.lineWidth = Math.max(1, width * .04); ctx.beginPath(); ctx.moveTo(x - width * .23, y); ctx.lineTo(x, top + height * .13); ctx.lineTo(x + width * .12, y); ctx.stroke();
  }
  ctx.restore();
  return true;
}
