const UNIVERSE = 'Meridian Clockwork';
const ACTOR_ID = 'meridian_clockwork:the_twelve_bell_judges';
const SHEET = '/sprites/generated/bosses/meridian-clockwork/the-twelve-bell-judges.png';
const SIZE = 1024;

// Two detached bells were measured against the original bitmap's alpha.
// The polygons follow the outside of their halos and avoid adjacent robes.
const BELLS = [
  {
    pivot: [260, 747],
    bounds: [202, 733, 121, 146],
    outline: [[202, 797], [206, 780], [216, 762], [228, 751], [257, 733], [265, 733], [302, 758],
      [313, 775], [322, 798], [320, 814], [311, 833], [299, 849], [259, 878], [216, 845], [208, 833], [202, 815]],
  },
  {
    pivot: [512, 777],
    bounds: [452, 763, 122, 149],
    outline: [[452, 827], [456, 810], [467, 793], [479, 783], [508, 763], [517, 763], [535, 779],
      [550, 786], [563, 802], [570, 820], [573, 833], [570, 851], [562, 870], [548, 883],
      [514, 911], [508, 911], [474, 883], [461, 869], [454, 853], [452, 839]],
  },
];

const IDLE = { rate: 0.07, swing: 0.095, lift: 8, slide: 3 };
const MOTION = {
  run: { rate: 0.15, swing: 0.18, lift: 15, slide: 17 },
  attack: { rate: 0.24, swing: 0.31, lift: 26, slide: 12 },
  hit: { rate: 0.21, swing: 0.26, lift: 12, slide: -20 },
};
const reducedMotion = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

function isClockworkJudge(actor, url) {
  if (actor?.id !== ACTOR_ID || actor.weapon !== 'command_staff' || !url?.endsWith(SHEET)) return false;
  const native = actor.universe === UNIVERSE && (!actor.sourceUniverse || actor.sourceUniverse === UNIVERSE);
  const projected = actor.sourceUniverse === UNIVERSE && actor.spriteSource === SHEET;
  return native || projected;
}

function addCut(ctx, outline) {
  ctx.moveTo(outline[0][0], outline[0][1]);
  for (let index = 1; index < outline.length; index++) ctx.lineTo(outline[index][0], outline[index][1]);
  ctx.closePath();
}

export function drawTwelveBellJudgesMotion(ctx, actor, image, animTime, x, y, width, height) {
  if (reducedMotion?.matches || actor?.state === 'dead' || image.naturalWidth !== SIZE || image.naturalHeight !== SIZE
    || !isClockworkJudge(actor, image.currentSrc || image.src)) return false;

  const state = actor.state === 'special' ? 'attack' : actor.state;
  const profile = Object.hasOwn(MOTION, state) ? MOTION[state] : IDLE;
  const time = Math.max(0, Number.isFinite(animTime) ? animTime : 0) * profile.rate;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(width / SIZE, height / SIZE);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, SIZE, SIZE);
  for (const bell of BELLS) addCut(ctx, bell.outline);
  ctx.clip('evenodd');
  ctx.drawImage(image, 0, 0, SIZE, SIZE);
  ctx.restore();

  for (const [index, bell] of BELLS.entries()) {
    const phase = time + index * 1.9;
    const swing = Math.sin(phase);
    const lift = Math.sin(phase * 0.73);
    const [pivotX, pivotY] = bell.pivot;
    const [sx, sy, sw, sh] = bell.bounds;
    ctx.save();
    ctx.translate(pivotX + swing * profile.slide, pivotY - lift * profile.lift);
    ctx.rotate(swing * profile.swing);
    ctx.translate(-pivotX, -pivotY);
    ctx.beginPath();
    addCut(ctx, bell.outline);
    ctx.clip();
    ctx.drawImage(image, sx, sy, sw, sh, sx, sy, sw, sh);
    ctx.restore();
  }
  ctx.restore();
  return true;
}
