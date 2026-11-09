import registry from './characterJadeGyrodiskWave17.generated.json' with { type: 'json' };
const HERO='beyond_good_evil_jade',UNIVERSE='Beyond Good & Evil';
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const sourceId=a=>a?.sourceHeroId||a?.sourceId||a?.id;
export const getJadeGyrodiskAssetWave17=()=>registry.entries.find(e=>e.id==='jade-gyrodisk-action-wave17')||null;
export function isJadeGyrodiskProfileWave17(profile) {
 return profile?.sourceHeroId===HERO&&profile.universe===UNIVERSE
  &&profile.name==='Gyrodisk de Jade'&&profile.effect==='damage'&&profile.delivery==='projectile'
  &&profile.sourceAbility?.slot==='secondary';
}
export function getJadeGyrodiskActionFrameWave17(actor,action=actor?.action||actor?.rpgGyrodiskActionWave17||actor?.tacticsGyrodiskActionWave17,{elapsed=action?.elapsed}={}){
 const profile=action?.abilityProfile||action?.identity;
 if(sourceId(actor)!==HERO||actor.universe!==UNIVERSE||!isJadeGyrodiskProfileWave17(profile)
  ||!finite(elapsed)||!finite(action?.duration)||!finite(action?.hitAt)
  ||action.hitAt<=0||action.hitAt>=action.duration||elapsed<0||elapsed>=action.duration)return null;
 const asset=registry.entries.find(e=>e.heroId===HERO&&e.universe===UNIVERSE&&e.id==='jade-gyrodisk-action-wave17'&&e.frames===16&&e.columns===4&&e.rows===4);
 if(!asset)return null;
 const h=action.hitAt,tail=action.duration-h;let index;
 if(elapsed<h*.35)index=Math.min(3,Math.floor(elapsed/(h*.35)*4));
 else if(elapsed<h*.75)index=4+Math.min(3,Math.floor((elapsed-h*.35)/(h*.4)*4));
 else if(elapsed<h)index=8+Math.min(1,Math.floor((elapsed-h*.75)/(h*.25)*2));
 else if(elapsed<h+tail*.25)index=10;
 else if(elapsed<h+tail*.5)index=11;
 else index=12+Math.min(3,Math.floor((elapsed-h-tail*.5)/(tail*.5)*4));
 const row=Math.floor(index/4),col=index%4;
 return{asset,index,row,col,frames:16,columns:4,rows:4,phase:['arrival','preparation','attack','recovery'][row],
  sourceAction:'jade-gyrodisk-wave17',progress:elapsed/action.duration,impactProgress:h/action.duration,
  renderScale:asset.normalization.rows[row].renderScale,source1to1Verified:false};
}
// The actual glove emitter is projected at the simulation release clock. The
// reporting camera stays at the hip and is never a projectile origin.
export function projectJadeGyrodiskOriginWave17(actor,action,height=72){
 if(!finite(actor?.x)||!finite(actor?.y)||!finite(height)||height<=0)return null;
 const frame=getJadeGyrodiskActionFrameWave17(actor,action,{elapsed:action?.hitAt});
 const p=frame?.asset?.gloveEmitter;
 if(!p?.reviewed||p.kind!=='actual-forward-glove-fingertips'||p.separateFromCamera!==true
  ||p.sourceVisibleNeighborhood9x9<30||p.packedVisibleNeighborhood9x9<10)return null;
 const scale=height/256*frame.renderScale,facing=(finite(action?.facing)?action.facing:actor.facing)<0?-1:1;
 return{x:actor.x+(p.point.x-128)*scale*facing,y:actor.y+(p.point.y-244)*scale,
  kind:'jade-gyrodisk-glove-wave17',nativePoint:{...p.point},sourcePoint:{...p.sourcePoint},
  sourceImage:p.sourceImage,sourceImageSha256:p.sourceImageSha256,sheet:frame.asset.sheet,sheetSha256:frame.asset.sha256,
  row:2,col:2,index:10,height,scale,facing,separateFromCamera:true,source1to1Verified:false};
}
