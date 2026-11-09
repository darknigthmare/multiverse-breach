import registry from './sourceCaptureEnemiesWave17.generated.json' with {type:'json'};
import {drawSourceNativeAtlasWave16,preloadSourceNativeSheetsWave16}from './sourceNativeRendererWave16.js';
import {isSourceKittenWave17,isBubbleActorImmobilizedWave17}from './sourceMechanicsWave17.js';
export const SOURCE_KITTEN_ID_WAVE17='tail_concerto_red_vest_kitten';
export const SOURCE_CAPTURE_ENEMIES_WAVE17=registry.entries;
export const getSourceCaptureEnemyAssetsWave17=()=>SOURCE_CAPTURE_ENEMIES_WAVE17;
export function getSourceCaptureEnemyFrameWave17(actor,animTime=0){
 if(!isSourceKittenWave17(actor))return null;
 const asset=SOURCE_CAPTURE_ENEMIES_WAVE17.find(entry=>entry.sourceEnemyId===SOURCE_KITTEN_ID_WAVE17);
 if(!asset)return null;
 const captured=isBubbleActorImmobilizedWave17(actor),released=actor.sourceKittenReleaseSecondsWave17>0;
 const phase=captured?'captured':released?'released':actor.state==='run'?'run':'idle';
 const elapsed=captured?Math.max(0,actor.sourceBubbleCaptureVisualSecondsWave17||0):released?.5-actor.sourceKittenReleaseSecondsWave17:Math.max(0,Number.isFinite(actor.sourceKittenVisualSecondsWave17)?actor.sourceKittenVisualSecondsWave17:animTime/60);
 const col=Math.max(0,Math.min(3,Math.floor(elapsed*8)%4)),row=asset.phases[phase].row;
 return{asset,phase,row,col,index:row*4+col,sheet:asset.sheet,source1to1Verified:false};
}
export function drawSourceCaptureEnemyWave17(ctx,x,y,actor,animTime,facing=-1,targetHeight=68){
 const frame=getSourceCaptureEnemyFrameWave17(actor,animTime);if(!frame)return false;
 preloadSourceNativeSheetsWave16([frame.asset.sheet]);
 const body=frame.asset.normalization.bodyCalibration.outputBodyHeight,size=targetHeight*frame.asset.bodyHeight/body;
 drawSourceNativeAtlasWave16(ctx,{...frame.asset,row:frame.row,frames:4},frame.col,x,y+size/2-frame.asset.normalization.baseline/256*size,size,size,{facing,glowBlur:0,redrawWhenReady:true});
 return true;
}
export const CANONICAL_CAPTURE_NPC_WAVE17=Object.freeze({id:SOURCE_KITTEN_ID_WAVE17,sourceEnemyId:SOURCE_KITTEN_ID_WAVE17,name:'Chaton du Black Cats Gang',universe:'Tail Concerto',species:'felineko-kitten',hp:65,atk:0,spd:4,stats:{hp:65,atk:0,def:1,spd:4},color:'#e7bc6d',weapon:'none',weaponType:'unarmed',bubbleCaptureEligible:true,sourceNonOffensiveWave17:true,sourceNativeNpcWave17:true,canonStatus:'canon nonoffensive adversary',role:'mischief',simple:{name:'Courir et faire des farces',type:'guard',dmg:0},secondary:{name:'Se cacher',type:'guard',dmg:0},defense:{name:'Fuite du chaton',type:'guard',reduce:0,dur:0.5},special:{name:'Rire du chaton',type:'guard',dmg:0},sourceReference:'Tail Concerto USA manual, printedpage19 /PDFpage21: kittens generally do not attack; they run, laugh, make graffiti and hide. One exact source outfit, not three recolored bodies.',source1to1Verified:false,sourceWork:'Tail Concerto (1998)'});
