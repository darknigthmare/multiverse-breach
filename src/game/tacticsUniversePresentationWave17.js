// Original procedural textures and silhouettes for the W17 source sectors.
// These palettes follow the declared location vocabulary, not official pixels.
export const TACTICS_ENVIRONMENT_PROFILES_WAVE17 = Object.freeze({
  'hillys-coast': { sky: ['#719fba', '#d8d3ad'], ground: '#648b58', haze: '#d2d4b1', far: '#8ba5a0', near: '#668b79', ridge: 'valley', flora: 'broadleaf', accent: '#e8d8aa', architecture: 'hillys-lighthouse' },
  'legends-dream-forest': { sky: ['#4e7b89', '#c4d1a5'], ground: '#4d8054', haze: '#bbd0a3', far: '#83a884', near: '#49765b', ridge: 'hills', flora: 'old-forest', accent: '#d5d999', architecture: 'legends-great-roots' },
  'vdnh-exhibition': { sky: ['#668891', '#d3cfb5'], ground: '#797d70', haze: '#c6c6ac', far: '#9aa99c', near: '#687d77', ridge: 'city', flora: 'none', accent: '#ddd8b3', architecture: 'vdnh-gallery' },
  'zootopia-rainforest': { sky: ['#537c82', '#b3c8ad'], ground: '#3c6b54', haze: '#b3c9b5', far: '#789f85', near: '#3f735b', ridge: 'valley', flora: 'old-forest', accent: '#a7c79d', architecture: 'rainforest-canopy' }
});

export const TACTICS_TERRAIN_MATERIALS_WAVE17 = Object.freeze({
  'hillys-grass': { family: 'grass', sideFamily: 'strata', top: '#749b58', mid: '#60874c', side: '#887759', underside: '#514d3a', detail: '#a9be73', accent: '#d0d598', edge: '#a5b875' },
  'hillys-stone': { family: 'stone', top: '#b3ad91', mid: '#9a977f', side: '#7e846e', underside: '#505b4e', detail: '#d4ccb0', accent: '#e7dcb7', edge: '#c5c09f' },
  'hillys-dock': { family: 'wood', top: '#9c8357', mid: '#89704b', side: '#6c6042', underside: '#3b4333', detail: '#c4ab77', accent: '#dfcc97', edge: '#b8a272' },
  'legends-moss': { family: 'grass', sideFamily: 'strata', top: '#6c9a5f', mid: '#568b52', side: '#77684c', underside: '#3d4432', detail: '#a6bf79', accent: '#d2d58b', edge: '#99b876' },
  'legends-root': { family: 'wood', top: '#9b7957', mid: '#876447', side: '#6b543e', underside: '#41402f', detail: '#c9a473', accent: '#ddbd88', edge: '#bb986f' },
  'vdnh-marble': { family: 'stone', top: '#c9c7b0', mid: '#afaf9a', side: '#929986', underside: '#626e60', detail: '#e2dec2', accent: '#eee8c9', edge: '#d6d2b7' },
  'vdnh-inlay': { family: 'panel', top: '#a8957c', mid: '#96856f', side: '#796e60', underside: '#4e5148', detail: '#c7baa0', accent: '#a94f43', edge: '#c3b49b' },
  'vdnh-grate': { family: 'grate', top: '#6c807a', mid: '#586e69', side: '#405b56', underside: '#2c4541', detail: '#a1b2a2', accent: '#ccd1b3', edge: '#98ac9c' },
  'rainforest-fern': { family: 'grass', sideFamily: 'strata', top: '#4e865e', mid: '#417752', side: '#61684a', underside: '#343e2c', detail: '#8eb17c', accent: '#bdd0a3', edge: '#83a77a' },
  'rainforest-boardwalk': { family: 'wood', top: '#8c8865', mid: '#777857', side: '#5d654a', underside: '#384833', detail: '#b3b18b', accent: '#d0d1a6', edge: '#a2aa80' }
});

function polygon(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath(); ctx.fill();
}

export function drawTacticsLandmarksWave17(ctx, profile, width, horizon, pan) {
  // Keep the small island beacon left of the live initiative panel.
  const x = width * (profile.architecture === 'hillys-lighthouse' ? .66 : .83) + pan, y = horizon + 10;
  if (profile.architecture === 'hillys-lighthouse') {
    polygon(ctx, [[x - 33, y + 15], [x - 25, y - 72], [x + 8, y - 72], [x + 19, y + 15]], '#d7d0aa');
    ctx.fillStyle = '#536f65'; ctx.fillRect(x - 31, y - 73, 46, 6);
    ctx.fillStyle = '#b5c4b3'; ctx.fillRect(x - 23, y - 89, 30, 16);
    polygon(ctx, [[x - 29, y - 89], [x - 8, y - 105], [x + 13, y - 89]], '#81957e');
    ctx.fillStyle = '#5b7c70'; ctx.fillRect(x - 18, y - 44, 14, 19);
    polygon(ctx, [[x - 59, y + 18], [x - 47, y - 11], [x + 32, y - 6], [x + 50, y + 18]], profile.near);
  } else if (profile.architecture === 'legends-great-roots') {
    for (const [left, rise] of [[width * .14 + pan, 74], [x, 94]]) {
      polygon(ctx, [[left - 38, y + 18], [left - 16, y - rise], [left + 9, y - rise], [left + 34, y + 18]], '#786e4f');
      ctx.strokeStyle = '#a99566'; ctx.lineWidth = 8; ctx.beginPath();
      ctx.moveTo(left - 9, y - 20); ctx.bezierCurveTo(left - 60, y - 12, left - 58, y + 17, left - 89, y + 16); ctx.stroke();
      ctx.fillStyle = profile.near; ctx.beginPath(); ctx.ellipse(left - 4, y - rise + 1, 66, 27, -.1, 0, Math.PI * 2); ctx.fill();
    }
  } else if (profile.architecture === 'vdnh-gallery') {
    const left = width * .16 + pan;
    ctx.fillStyle = '#b5b7a1'; ctx.fillRect(left, y - 43, width * .67, 55);
    ctx.fillStyle = '#d7d3b5'; ctx.fillRect(left - 8, y - 49, width * .67 + 16, 7);
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = '#74867b'; ctx.fillRect(left + 13 + i * width * .07, y - 30, 16, 41);
      ctx.fillStyle = '#e0d8b8'; ctx.fillRect(left + 10 + i * width * .07, y - 34, 22, 5);
    }
    polygon(ctx, [[x - 30, y - 49], [x - 11, y - 67], [x + 9, y - 49]], '#b65748');
  } else if (profile.architecture === 'rainforest-canopy') {
    for (const [left, rise] of [[width * .13 + pan, 88], [width * .47 + pan, 122], [x, 99]]) {
      polygon(ctx, [[left - 17, y + 18], [left - 10, y - rise], [left + 8, y - rise], [left + 20, y + 18]], '#637b5e');
      for (const [dx, dy] of [[-27, 0], [10, -16], [35, 5]]) {
        ctx.fillStyle = profile.near; ctx.beginPath(); ctx.ellipse(left + dx, y - rise + dy, 46, 23, -.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.strokeStyle = '#a3ad82'; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(width * .13 + pan, y - 34); ctx.bezierCurveTo(width * .31 + pan, y - 12, width * .61 + pan, y - 3, x, y - 38); ctx.stroke();
  } else return false;
  return true;
}

export function drawTacticsSceneryWave17(ctx, { obstacle, point, width, height } = {}) {
  const kind = obstacle?.sceneryKind;
  if (!point || !['hillys-beacon', 'legends-root-trunk', 'vdnh-terminal', 'vdnh-column', 'rainforest-steamer-tree'].includes(kind)) return false;
  ctx.save();
  const x = point.x, y = point.y, w = Math.max(4, width), h = Math.max(8, height), top = y - h;
  if (kind === 'hillys-beacon') {
    polygon(ctx, [[x - w * .25, y], [x - w * .2, top + h * .2], [x + w * .2, top + h * .2], [x + w * .26, y]], '#d1c69e');
    ctx.fillStyle = '#728d78'; ctx.fillRect(x - w * .3, top + h * .12, w * .6, h * .12);
    ctx.fillStyle = '#cdd2ad'; ctx.fillRect(x - w * .17, top, w * .34, h * .12);
  } else if (kind === 'vdnh-terminal') {
    polygon(ctx, [[x - w * .38, y], [x - w * .28, top], [x + w * .24, top], [x + w * .4, y]], '#a4ae9c');
    ctx.fillStyle = '#405c58'; ctx.fillRect(x - w * .2, top + h * .15, w * .4, h * .22);
    ctx.fillStyle = '#a6c7b4'; ctx.fillRect(x - w * .15, top + h * .2, w * .3, h * .07);
    ctx.fillStyle = '#b4634e'; ctx.fillRect(x - w * .12, top + h * .55, w * .24, h * .08);
  } else if (kind === 'vdnh-column') {
    ctx.fillStyle = '#a7ad96'; ctx.fillRect(x - w * .23, top + h * .08, w * .46, h * .83);
    ctx.fillStyle = '#d2cfb1'; ctx.fillRect(x - w * .38, top, w * .76, h * .12); ctx.fillRect(x - w * .4, y - h * .09, w * .8, h * .09);
    ctx.strokeStyle = '#d5d1b7'; ctx.lineWidth = Math.max(1, w * .04); ctx.beginPath();
    for (const dx of [-.12, .04, .16]) { ctx.moveTo(x + dx * w, top + h * .15); ctx.lineTo(x + dx * w, y - h * .13); } ctx.stroke();
  } else {
    polygon(ctx, [[x - w * .42, y], [x - w * .2, top + h * .26], [x - w * .06, top], [x + w * .14, top + h * .06], [x + w * .2, top + h * .49], [x + w * .47, y]], kind === 'legends-root-trunk' ? '#806847' : '#5d7b59');
    ctx.strokeStyle = kind === 'legends-root-trunk' ? '#b89b64' : '#9bb383'; ctx.lineWidth = Math.max(1, w * .05); ctx.beginPath();
    ctx.moveTo(x - w * .18, y); ctx.bezierCurveTo(x + w * .1, top + h * .7, x - w * .14, top + h * .32, x, top + h * .15); ctx.stroke();
    if (kind === 'rainforest-steamer-tree') {
      ctx.fillStyle = '#7fa379'; ctx.beginPath(); ctx.ellipse(x, top + h * .11, w * .53, h * .16, -.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(193,215,192,.42)'; ctx.beginPath(); ctx.ellipse(x + w * .17, top + h * .39, w * .32, h * .12, -.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore(); return true;
}
