import { createReducedMotionReader } from './reducedMotion.js';
import { getOriginalBossMotionId } from './originalBossMotionIdentity.js';

const SIZE = 1024;
const reducedMotion = createReducedMotionReader();
const bosses = new Map([
  ['aether_crown:lord_pneuma', {
    universe: 'The Aether Crown', name: 'Lord Pneuma', weapon: 'magic',
    sheet: '/sprites/generated/bosses/the-aether-crown/lord-pneuma.png',
    draw: drawPneuma,
  }],
  ['valedor_shattered_crown:vaelgor_premier_wyrm', {
    universe: 'Valedor: The Shattered Crown', name: 'Vaelgor, Premier Wyrm', weapon: 'world_power',
    sheet: '/sprites/generated/bosses/valedor-the-shattered-crown/vaelgor-premier-wyrm.png',
    draw: drawVaelgor,
  }],
  ['yomi_no_kage:amas_des_huit_orochi', {
    universe: 'Yomi no Kage', name: 'Amas des Huit Orochi', weapon: 'magic',
    sheet: '/sprites/generated/bosses/yomi-no-kage/amas-des-huit-orochi.png',
    draw: drawOrochi,
  }],
]);

// The upper vortex bends around its horizontal cut at y=247. Pixels below
// the cut, including the planted palm and the start of the stream, stay fixed.
const upperVortex = {
  bounds: [193, 40, 277, 207],
  outline: [[193, 40], [442, 40], [469, 113], [466, 148], [455, 172], [455, 215], [437, 247], [193, 247]],
};
const vortexMotion = {
  idle: { rate: 0.055, lean: 0.015, sway: 0.065 },
  run: { rate: 0.14, lean: 0.09, sway: 0.12 },
  attack: { rate: 0.18, lean: 0.21, sway: 0.22 },
  hit: { rate: 0.26, lean: -0.045, sway: 0.03 },
};

// The crystals sit on separate alpha islands, outside the wings and the body.
const crystals = [
  {
    pivot: [535, 98], spread: 0,
    bounds: [494, 46, 79, 109],
    outline: [[494, 94], [530, 46], [539, 46], [572, 95], [572, 107], [559, 138], [536, 154], [506, 152], [494, 106]],
  },
  {
    pivot: [308, 465], spread: -1,
    bounds: [261, 406, 92, 121],
    outline: [[307, 406], [312, 407], [351, 464], [352, 475], [335, 524], [331, 526], [307, 524], [276, 510], [261, 473], [261, 465]],
  },
  {
    pivot: [807, 609], spread: 1,
    bounds: [757, 546, 100, 130],
    outline: [[758, 609], [803, 546], [811, 547], [856, 610], [856, 621], [834, 668], [807, 675], [777, 669], [757, 622]],
  },
];
const crystalMotion = {
  idle: { rate: 0.06, slide: 7, lift: 10, spread: 0, tilt: 0.08 },
  run: { rate: 0.14, slide: 10, lift: 15, spread: 5, tilt: 0.12 },
  attack: { rate: 0.18, slide: 9, lift: 22, spread: 22, tilt: 0.20 },
  hit: { rate: 0.24, slide: 12, lift: 8, spread: -9, tilt: 0.24 },
};

// Only the three upper crests move. Each transform keeps every point on the
// horizontal base of its cut fixed where the crest joins the original head.
const orochiCrests = [
  {
    rootY: 171, phase: 0,
    bounds: [403, 26, 185, 145],
    outline: [[403, 26], [580, 26], [588, 106], [586, 144], [578, 171], [414, 171], [403, 134]],
  },
  {
    rootY: 245, phase: 2.1,
    bounds: [268, 190, 90, 55],
    outline: [[281, 190], [352, 190], [358, 223], [344, 245], [268, 245], [271, 215]],
  },
  {
    rootY: 228, phase: 4.2,
    bounds: [739, 160, 102, 68],
    outline: [[746, 160], [822, 160], [841, 204], [838, 228], [739, 228]],
  },
];
const orochiMotion = {
  idle: { rate: 0.055, lean: 0, sway: 0.055, stretch: 0.045 },
  run: { rate: 0.095, lean: -0.05, sway: 0.09, stretch: 0.06 },
  attack: { rate: 0.165, lean: 0.12, sway: 0.12, stretch: 0.13 },
  hit: { rate: 0.245, lean: -0.08, sway: 0.055, stretch: 0.06 },
};

function outlineSegment(ctx, { outline }) {
  ctx.moveTo(...outline[0]);
  for (let index = 1; index < outline.length; index++) ctx.lineTo(...outline[index]);
  ctx.closePath();
}

function drawFixedBody(ctx, image, segments) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, SIZE, SIZE);
  for (const segment of segments) outlineSegment(ctx, segment);
  ctx.clip('evenodd');
  ctx.drawImage(image, 0, 0, SIZE, SIZE);
  ctx.restore();
}

function drawSegment(ctx, image, segment) {
  ctx.beginPath();
  outlineSegment(ctx, segment);
  ctx.clip();
  const [x, y, width, height] = segment.bounds;
  ctx.drawImage(image, x, y, width, height, x, y, width, height);
}

function drawPneuma(ctx, image, state, time) {
  const profile = Object.hasOwn(vortexMotion, state) ? vortexMotion[state] : vortexMotion.idle;
  const skew = profile.lean + Math.sin(time * profile.rate) * profile.sway;
  drawFixedBody(ctx, image, [upperVortex]);
  ctx.save();
  ctx.transform(1, 0, skew, 1, -247 * skew, 0);
  drawSegment(ctx, image, upperVortex);
  ctx.restore();
}

function drawVaelgor(ctx, image, state, time) {
  const profile = Object.hasOwn(crystalMotion, state) ? crystalMotion[state] : crystalMotion.idle;
  drawFixedBody(ctx, image, crystals);
  for (const [index, crystal] of crystals.entries()) {
    const [x, y] = crystal.pivot;
    const phase = time * profile.rate + index * 1.9;
    const swing = Math.sin(phase);
    const dx = crystal.spread * profile.spread + swing * profile.slide;
    const dy = -Math.cos(phase) * profile.lift;
    ctx.save();
    ctx.translate(x + dx, y + dy);
    ctx.rotate(swing * profile.tilt);
    ctx.translate(-x, -y);
    drawSegment(ctx, image, crystal);
    ctx.restore();
  }
}

function drawOrochi(ctx, image, state, time) {
  const profile = Object.hasOwn(orochiMotion, state) ? orochiMotion[state] : orochiMotion.idle;
  drawFixedBody(ctx, image, orochiCrests);
  for (const crest of orochiCrests) {
    const phase = time * profile.rate + crest.phase;
    const skew = profile.lean + Math.sin(phase) * profile.sway;
    const stretch = 1 + Math.cos(phase) * profile.stretch;
    ctx.save();
    ctx.transform(1, 0, skew, stretch, -crest.rootY * skew, (1 - stretch) * crest.rootY);
    drawSegment(ctx, image, crest);
    ctx.restore();
  }
}

export function drawOriginalStaticBossMotion(ctx, actor, image, animTime, x, y, width, height) {
  const bossId = getOriginalBossMotionId(actor);
  const boss = bosses.get(bossId);
  if (!boss || reducedMotion() || actor.state === 'dead' || actor.weapon !== boss.weapon
    || image.naturalWidth !== SIZE || image.naturalHeight !== SIZE) return false;
  const native = actor.universe === boss.universe && actor.name === boss.name && (!actor.sourceUniverse || actor.sourceUniverse === boss.universe);
  const projected = actor.sourceUniverse === boss.universe && actor.spriteSource === boss.sheet;
  const url = new URL(image.currentSrc || image.src, 'https://sprite.invalid');
  if ((!native && !projected) || url.pathname !== boss.sheet) return false;
  const time = Math.max(0, Number.isFinite(animTime) ? animTime : 0);
  const state = actor.state === 'special' ? 'attack' : actor.state;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(width / SIZE, height / SIZE);
  boss.draw(ctx, image, state, time);
  ctx.restore();
  return true;
}
