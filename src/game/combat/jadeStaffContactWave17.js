import registry from './characterJadeActionWave17.generated.json' with { type: 'json' };

const HERO = 'beyond_good_evil_jade', UNIVERSE = 'Beyond Good & Evil';
const finite = value => typeof value === 'number' && Number.isFinite(value);
const SHA = value => typeof value === 'string' && /^[a-f\d]{64}$/i.test(value);
const STATES = Object.freeze({ light1:'attackLight1', light2:'attackLight2', light3:'attackLight3',
  crouchLight:'crouchLight', charged:'chargeRelease', aerialNeutral:'aerialNeutral',
  aerialForward:'aerialForward', aerialDown:'aerialDown', ledgeAttack:'ledgeAttack' });
const sourceId = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;
const profileOf = action => action?.abilityProfile || action?.identity;
export function isJadeStaffActionWave17(actor, action) {
  const p = profileOf(action);
  return sourceId(actor) === HERO && actor.universe === UNIVERSE
    && p?.sourceHeroId === HERO && p.universe === UNIVERSE
    && p.name === 'Coup du Daï-Jo de Jade' && p.effect === 'damage' && p.delivery === 'melee'
    && p.sourceAbility?.slot === 'simple'
    && (Object.hasOwn(STATES, action.id) || ['light','heavy'].includes(action.type));
}
function measured(p) {
  return p && finite(p.point?.x) && finite(p.point?.y) && finite(p.sourcePoint?.x) && finite(p.sourcePoint?.y)
    && p.point.x >= 0 && p.point.x < 256 && p.point.y >= 0 && p.point.y < 256
    && p.sourceVisibleNeighborhood9x9 >= 12 && p.packedVisibleNeighborhood9x9 >= 5;
}
// Pure projection of the actually visible forward staff segment in contact
// column2. It cannot move an actor, choose a target, advance a clock or apply HP.
export function createJadeStaffProjectorWave17(nativeRegistry) {
  return (actor, action, height = 72) => {
    if (!isJadeStaffActionWave17(actor, action) || !finite(actor.x) || !finite(actor.y)
      || !finite(height) || height <= 0 || !finite(action.elapsed) || !finite(action.hitAt)
      || !finite(action.duration) || action.hitAt <= 0 || action.hitAt >= action.duration
      || action.elapsed < action.hitAt
      || action.elapsed >= action.hitAt + (action.duration - action.hitAt) * .65) return null;
    const state = STATES[action.id] || (action.type === 'heavy' ? 'chargeRelease' : 'attackLight1');
    const asset = nativeRegistry?.entries?.find(entry => entry.heroId === HERO && entry.universe === UNIVERSE
      && entry.columns === 4 && entry.rows === 8 && entry.stateOrder?.includes(state));
    const point = asset?.normalization?.staffContactMeasurements?.[state];
    if (!asset || !point || point.state !== state || point.column !== 2 || point.reviewed !== true
      || point.measureKind !== 'visible-forward-physical-daijo-shaft' || !measured(point.start) || !measured(point.tip)
      || point.sheet !== asset.sheet || point.sheetSha256 !== asset.sha256 || !SHA(point.sourceImageSha256)
      || !finite(point.radius) || point.radius <= 0 || !finite(point.renderScale) || point.renderScale <= 0
      || point.renderScale > 3 || point.baseline !== 244) return null;
    const facing = (finite(action.facing) ? action.facing : actor.facing) < 0 ? -1 : 1;
    const scale = height / 256 * point.renderScale;
    const project = p => ({ x:actor.x + (p.x - 128) * scale * facing,
      y:actor.y + (p.y - 244) * scale });
    return { kind:'jade-daijo-contact-wave17', sourceHeroId:HERO, universe:UNIVERSE,
      state, row:point.row, col:2, start:project(point.start.point), tip:project(point.tip.point),
      radius:point.radius * scale, nativeStart:{...point.start.point}, nativeTip:{...point.tip.point},
      sourceStart:{...point.start.sourcePoint}, sourceTip:{...point.tip.sourcePoint},
      sourceImage:point.sourceImage, sourceImageSha256:point.sourceImageSha256,
      sheet:asset.sheet, sheetSha256:asset.sha256, height, facing, scale,
      physicallyMeasured:true, gameplayEffect:'none', source1to1Verified:false };
  };
}
export const projectJadeStaffContactWave17 = createJadeStaffProjectorWave17(registry);
function box(r) {
  if (!r) return null;
  if ([r.left,r.top,r.right,r.bottom].every(finite)) return r.right>r.left&&r.bottom>r.top?r:null;
  const w=r.width??r.w,h=r.height??r.h;
  return [r.x,r.y,w,h].every(finite)&&w>0&&h>0?{left:r.x,top:r.y,right:r.x+w,bottom:r.y+h}:null;
}
const dist2=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
function pointSegmentDistance2(p,a,b) {
  const length=dist2(a,b),t=length?Math.max(0,Math.min(1,((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/length)):0;
  return dist2(p,{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});
}
function segmentsIntersect(a,b,c,d) {
  const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
  const on=(p,q,r)=>Math.abs(cross(p,q,r))<1e-10&&r.x>=Math.min(p.x,q.x)&&r.x<=Math.max(p.x,q.x)&&r.y>=Math.min(p.y,q.y)&&r.y<=Math.max(p.y,q.y);
  const p=cross(a,b,c),q=cross(a,b,d),r=cross(c,d,a),s=cross(c,d,b);
  return (p>0&&q<0||p<0&&q>0)&&(r>0&&s<0||r<0&&s>0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);
}
// Exact capsule-to-rectangle distance, including rounded corners. A large
// authored range or a source energy crescent never enlarges this physical staff.
export function intersectsJadeStaffHurtboxWave17(projected, hurtbox) {
  const r=box(hurtbox);
  if (!r || projected?.kind!=='jade-daijo-contact-wave17' || projected.sourceHeroId!==HERO
    || projected.universe!==UNIVERSE || projected.physicallyMeasured!==true
    || ![projected.start?.x,projected.start?.y,projected.tip?.x,projected.tip?.y,projected.radius].every(finite)
    || projected.radius<=0) return false;
  const {start:a,tip:b,radius}=projected,inside=p=>p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;
  if (inside(a)||inside(b)) return true;
  const corners=[{x:r.left,y:r.top},{x:r.right,y:r.top},{x:r.right,y:r.bottom},{x:r.left,y:r.bottom}];
  for(let i=0;i<4;i++){
    const c=corners[i],d=corners[(i+1)%4];if(segmentsIntersect(a,b,c,d))return true;
    const distance=Math.min(pointSegmentDistance2(a,c,d),pointSegmentDistance2(b,c,d),pointSegmentDistance2(c,a,b),pointSegmentDistance2(d,a,b));
    if(distance<=radius*radius)return true;
  }
  return false;
}
